import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { languageClient } from "../extension";
import { ServersConfig } from "../utils";
import { ResponseError } from "vscode-languageclient";

const compile = require("template-literal");
const localizeHTML = {
  "tds.webview.title": vscode.l10n.t("Compile Key"),
  "tds.webview.compile.machine.id": vscode.l10n.t("This Machine ID"),
  "tds.webview.compile.key.file": vscode.l10n.t("Compile Key File"),
  "tds.webview.compile.key.id": vscode.l10n.t("Compile Key ID"),
  "tds.webview.compile.key.generated": vscode.l10n.t("Generated"),
  "tds.webview.compile.key.expire": vscode.l10n.t("Expire"),
  "tds.webview.compile.key.token": vscode.l10n.t("Token"),
  "tds.webview.compile.key.overwrite": vscode.l10n.t("Allow overwrite default"),
  "tds.webview.compile.key.validate": vscode.l10n.t("Validate Key"),
  "tds.webview.compile.key.clean": vscode.l10n.t("Clean Key"),
  "tds.webview.compile.key.save": vscode.l10n.t("Save"),
  "tds.webview.compile.key.saveclose": vscode.l10n.t("Save/Close"),
  "tds.webview.compile.key.memo": vscode.l10n.t("* From 05/17/2019 all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and macOS."),
  "tds.webview.compile.key.setting": vscode.l10n.t("These settings can also be changed in"),
  "tds.webview.compile.key.validated": vscode.l10n.t("Key successfully validated"),
  "tds.webview.compile.key.invalid": vscode.l10n.t("Invalid key"),
};

export interface CompileKey {
  path: string;
  machineId: string;
  issued: string;
  expire: string;
  buildType: string;
  tokenKey: string;
  authorizationToken: string;
  userId: string;
}

export interface Authorization {
  id: string;
  generation: string;
  validation: string;
  permission: string;
  key: string;
}

export function compileKeyPage(context: vscode.ExtensionContext) {
  initializePage(context);
}

function initializePage(context: vscode.ExtensionContext) {
  let extensionPath = "";
  if (!context || context === undefined) {
    let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    if (ext) {
      extensionPath = ext.extensionPath;
    }
  } else {
    extensionPath = context.extensionPath;
  }
  const currentPanel = vscode.window.createWebviewPanel(
    "totvs-developer-studio.compile.key",
    "Compile Key",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(extensionPath, "src", "compileKey")),
      ],
      retainContextWhenHidden: true,
    }
  );

  currentPanel.webview.html = getWebViewContent(context, localizeHTML);

  getId(currentPanel);

  const compileKey = ServersConfig.getPermissionsInfos();
  if (compileKey && compileKey.authorizationToken) {
    // && !compileKey.userId) {
    const generated = compileKey.issued;
    const expiry = compileKey.expire;
    const canOverride: boolean = compileKey.buildType === "0";
    setCurrentKey(
      currentPanel,
      compileKey.path,
      compileKey.machineId,
      generated,
      expiry,
      compileKey.tokenKey,
      canOverride
    );
  }

  currentPanel.webview.onDidReceiveMessage(
    (message) => {
      //console.log('onDidReceiveMessage: ' + message.command);
      switch (message.command) {
        case "saveKey":
          if (message.token) {
            validateKey(currentPanel, message, true);
          }
          if (message.close) {
            currentPanel.dispose();
          }
          break;
        case "readFile":
          const authorization: Authorization = ServersConfig.readCompileKeyFile(
            message.path
          );
          if (authorization) {
            let canOverride: boolean = authorization.permission === "1";
            setCurrentKey(
              currentPanel,
              message.path,
              authorization.id,
              authorization.generation,
              authorization.validation,
              authorization.key,
              canOverride
            );
            validateKey(
              currentPanel,
              {
                id: authorization.id.toUpperCase(),
                generated: authorization.generation,
                expire: authorization.validation,
                overwrite: canOverride,
                token: authorization.key.toUpperCase(),
              },
              false
            );
          }
          break;
        case "validateKey":
          if (message.token) {
            validateKey(currentPanel, message, false);
          } else {
            vscode.window.showErrorMessage(
              "All parameters are required for valid key"
            );
          }
          break;
        case "cleanKey":
          ServersConfig.deletePermissionsInfos();
          break;
      }
    },
    undefined,
    context.subscriptions
  );
}

function setCurrentKey(
  currentPanel,
  path,
  id,
  issued,
  expiry,
  authorizationToken,
  canOverride: boolean
) {
  currentPanel.webview.postMessage({
    command: "setCurrentKey",
    path: path,
    id: id,
    issued: issued,
    expiry: expiry,
    authorizationToken: authorizationToken,
    canOverride: canOverride,
  });
}

function getId(currentPanel) {
  languageClient.sendRequest("$totvsserver/getId").then(
    (response: any) => {
      if (response.id) {
        currentPanel.webview.postMessage({
          command: "setID",
          id: response.id,
        });
      } else {
        vscode.window.showErrorMessage("Couldn't get [Machine ID].");
      }
    },
    (err: ResponseError<object>) => {
      vscode.window.showErrorMessage(err.message);
    }
  );
}

class ValidKeyResult {
  authorizationToken: string;
  buildType: number;
}

function validateKey(currentPanel, message, close: boolean) {
  if (message.token) {
    let canOverride = "0";
    if (message.overwrite) {
      canOverride = "1";
    }
    languageClient
      .sendRequest("$totvsserver/validKey", {
        keyInfo: {
          id: message.id,
          issued: message.generated,
          expiry: message.expire,
          canOverride: canOverride,
          token: message.token,
        },
      })
      .then(
        (response: ValidKeyResult) => {
          // console.log(
          //   'validateKey response authorizationToken: ' +
          //     response.authorizationToken
          //);
          let outputMessageText: string;
          let outputMessageType: string;
          if (response.authorizationToken !== "") {
            //console.log("validateKey success");
            if (close) {
              let permission: CompileKey = {
                path: message.path,
                machineId: message.id,
                issued: message.generated,
                expire: message.expire,
                buildType: String(response.buildType),
                tokenKey: message.token,
                authorizationToken: response.authorizationToken,
                userId: "",
              };
              ServersConfig.savePermissionsInfos(permission);
            }
            outputMessageText =
              localizeHTML["tds.webview.compile.key.validated"];
            outputMessageType = "success";
          } else {
            //console.log("validateKey error");
            outputMessageText = localizeHTML["tds.webview.compile.key.invalid"];
            outputMessageType = "error";
          }
          if (!close) {
            currentPanel.webview.postMessage({
              command: "setOutputMessage",
              output: outputMessageText,
              type: outputMessageType,
            });
          }
        },
        (err: ResponseError<object>) => {
          vscode.window.showErrorMessage(err.message);
        }
      );
  } else {
    vscode.window.showErrorMessage("Empty key");
  }
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {
  const htmlOnDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, "src", "compileKey", "formCompileKey.html")
  );
  const cssOnDIskPath = vscode.Uri.file(
    path.join(context.extensionPath, "resources", "css", "form.css")
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOnDIskPath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({ css: cssContent, localize: localizeHTML });
}
