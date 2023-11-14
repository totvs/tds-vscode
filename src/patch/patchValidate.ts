import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { ServersConfig } from "../utils";
import { languageClient } from "../extension";
const compile = require("template-literal");
import { ResponseError } from "vscode-languageclient";
import { _debugEvent } from "../debug";

let patchValidatesData: any;
let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
  "tds.webview.validate.patch": vscode.l10n.t("Patch Validate"),
  "tds.webview.validate.ignore.files": vscode.l10n.t("Ignore files"),
  "tds.webview.validate.export.files": vscode.l10n.t("Export to file"),
  "tds.webview.validate.export.files2": vscode.l10n.t("Export items filted to file"),
  "tds.webview.validate.export.close": vscode.l10n.t("Close"),
  "tds.webview.validate.filter": vscode.l10n.t("Filter, ex: MAT or * All (slow)"),
  "tds.webview.validate.items.showing": vscode.l10n.t("Items showing"),
  "tds.webview.validate.col01": vscode.l10n.t("File"),
  "tds.webview.validate.col02": vscode.l10n.t("Date Patch"),
  "tds.webview.validate.col03": vscode.l10n.t("Date Rpo"),
};

export function patchValidates(context: vscode.ExtensionContext, args: any) {
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
        "totvs-developer-studio.validate.patch",
        "Patch Validate",
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
          switch (message.command) {
            case "patchValidate":
              vscode.window.setStatusBarMessage(
                `$(gear~spin) ${vscode.l10n.t("Executing patch validation...")}`,
                sendPatchValidate(message.patchFile, server, currentPanel)
              );

              break;
            case "exportPatchValidate":
              vscode.window.setStatusBarMessage(
                `$(gear~spin) ${vscode.l10n.t("Exporting patch validation...")}`,
                exportPatchValidate()
              );
              break;

            case "close":
              if (currentPanel) {
                currentPanel.dispose();
              }
              break;
          }
        },
        undefined,
        context.subscriptions
      );
    } else {
      currentPanel.reveal();
    }

    if (args) {
      if (args.fsPath) {
        sendPatchPath(args.fsPath, currentPanel);
        vscode.window.setStatusBarMessage(
          `$(gear~spin) ${vscode.l10n.t("Starting package generation...")}`,
          5000
        );
        sendPatchValidate(args.fsPath, server, currentPanel);
      }
    }
  } else {
    vscode.window.showErrorMessage("There is no server connected.");
  }
}

function sendPatchPath(path, currentPanel) {
  currentPanel.webview.postMessage({
    command: "setPatchPath",
    path: path,
  });
}

function exportPatchValidate() {
  return new Promise(() => {
    if (patchValidatesData) {
      let patchValidates = patchValidatesData;
      let data =
        "FILE".padEnd(80, " ") +
        "DATE PATCH".padEnd(20, " ") +
        "DATE RPO".padEnd(20, " ") +
        os.EOL;
      for (let index = 0; index < patchValidates.length; index++) {
        const element = patchValidates[index];
        let output =
          element.name.padEnd(80, " ") +
          element.date.padEnd(20, " ") +
          element.size.padEnd(20, " ");
        data += output + os.EOL;
      }
      vscode.window
        .showSaveDialog({ saveLabel: "Export" })
        .then((exportFile) => {
          fs.writeFileSync(exportFile.fsPath, data);
        });
    }
  });
}

function sendPatchValidate(patchFile, server, currentPanel): Promise<any> {
  if (_debugEvent) {
    vscode.window.showWarningMessage(
      "This operation is not allowed during a debug."
    );
    return Promise.resolve();
  }

  const patchURI = vscode.Uri.file(patchFile).toString();
  return languageClient
    .sendRequest("$totvsserver/patchApply", {
      patchApplyInfo: {
        connectionToken: server.token,
        authorizationToken: ServersConfig.getAuthorizationToken(server),
        environment: server.environment,
        patchUri: patchURI,
        isLocal: true,
        isValidOnly: true,
        applyScope: "none",
      },
    })
    .then(
      (response: any) => {
        const errorMessage = response.message;
        if (errorMessage) {
          vscode.window.showWarningMessage(errorMessage);
          patchValidatesData = response.patchValidates;
          currentPanel.webview.postMessage({
            command: "setData",
            data: response.patchValidates,
          });
        } else {
          vscode.window.showInformationMessage(
            "No validation issues detected."
          );
        }
      },
      (err: ResponseError<object>) => {
        vscode.window.showErrorMessage(err.message);
      }
    );
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {
  const htmlOnDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, "src", "patch", "formValidatePatch.html")
  );
  const cssOnDIskPath = vscode.Uri.file(
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
  //const cssOnDIskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOnDIskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const scriptContent = fs.readFileSync(
    tableScriptPath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({
    css: cssContent,
    localize: localizeHTML,
    script: scriptContent,
  });
}
