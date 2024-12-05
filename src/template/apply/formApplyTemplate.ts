import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ServersConfig } from "../../utils";
const compile = require("template-literal");
import {
  IApplyTemplateResult,
  sendApplyTemplateRequest,
} from "../../protocolMessages";
import { processSelectResourceMessage } from "../../utilities/processSelectResource";

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
  "tds.webview.template.apply": vscode.l10n.t("Apply Template"),
};

export function openTemplateApplyView(
  context: vscode.ExtensionContext,
  args: any
) {
  const server = ServersConfig.getCurrentServer();
  if (server) {
    let extensionPath = "";
    if (!context || context === undefined) {
      let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
      if (ext) {
        extensionPath = ext.extensionPath;
      }
    } else {
      extensionPath = context.extensionPath;
    }
    if (!currentPanel) {
      currentPanel = vscode.window.createWebviewPanel(
        "totvs-developer-studio.template.apply",
        "Apply Template",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(extensionPath, "src", "patch")),
          ],
          retainContextWhenHidden: true,
        }
      );

      currentPanel.webview.html = getWebViewContent(context, localizeHTML);

      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined;
        },
        null,
        context.subscriptions
      );

      currentPanel.webview.onDidReceiveMessage(
        (message) => {
          if (!processSelectResourceMessage(currentPanel.webview, message)) {
            switch (message.command) {
            case "templateApply":
              templateApply(message.templateFile);
              currentPanel.dispose();
              return;
            case "close":
              currentPanel.dispose();
              break;
          }
        }
        },
        undefined,
        context.subscriptions
      );
    } else {
      currentPanel.reveal();
    }

    if (args && args.fsPath) {
      setTemplatePath(args.fsPath, currentPanel);
    }
  } else {
    vscode.window.showErrorMessage("There is no server connected.");
  }
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {
  const htmlOnDiskPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "src",
      "template",
      "apply",
      "formApplyTemplate.html"
    )
  );
  const cssOnDiskPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "resources",
      "css",
      "table_materialize.css"
    )
  );
  const tableScriptPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "resources",
      "script",
      "table_materialize.js"
    )
  );
  const chooseResourcePath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "resources",
      "script",
      "chooseResource.js"
    )
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const scriptContent = fs.readFileSync(
    tableScriptPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const chooseResourceContent = fs.readFileSync(
    chooseResourcePath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({
    css: cssContent,
    localize: localizeHTML,
    script: scriptContent,
    chooseResourceScript: chooseResourceContent
  });
}

function setTemplatePath(path, currentPanel) {
  currentPanel.webview.postMessage({
    command: "setTemplatePath",
    path: path,
  });
}

function templateApply(templateFile) {
  const server = ServersConfig.getCurrentServer();
  const includes = ServersConfig.getIncludes(true, server) || [];
  let includesUris: Array<string> = includes.map((include) => {
    return vscode.Uri.file(include).toString();
  });
  let templateUri = vscode.Uri.file(templateFile);
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      title: vscode.l10n.t("Applying template"),
      cancellable: true,
    },
    async (progress, token) => {
      token.onCancellationRequested(() => {
        vscode.window.showInformationMessage("User canceled the operation");
      });

      progress.report({
        increment: 0,
        message: vscode.l10n.t("Processing... (may take several minutes)"),
      });

      return sendApplyTemplateRequest(server, includesUris, templateUri).then(
        (response: IApplyTemplateResult) => {
          progress.report({
            increment: 100,
            message: vscode.l10n.t("Finished."),
          });
          console.log(response.message);
        }
      );
    }
  );
}
