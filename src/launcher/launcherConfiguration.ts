import * as vscode from "vscode";
import * as path from "path";
import { LaunchConfig } from "../utils";
import * as fs from "fs";

const compile = require("template-literal");

let currentPanel: vscode.WebviewPanel | undefined = undefined;
//let currentLaunchersInfoContent: any | undefined;
//let launcherInfoChangedManually = false;

const localizeHTML = {
  "tds.webview.launcher.welcome": vscode.l10n.t("Welcome"),
  "tds.webview.launcher.launcherTitle": vscode.l10n.t("Launcher Config"),
  "tds.webview.launcher.name": vscode.l10n.t("Choose launcher:"),
  "tds.webview.launcher.program": vscode.l10n.t("Program:"),
  "tds.webview.launcher.program.arguments": vscode.l10n.t("Arguments (-A):"),
  "tds.webview.launcher.smartclient": vscode.l10n.t("SmartClient:"),
  "tds.webview.launcher.multiThread": vscode.l10n.t("Enable multiple threads"),
  "tds.webview.launcher.profile": vscode.l10n.t("Enable Profile"),
  "tds.webview.launcher.multiSession": vscode.l10n.t("(-M) Multiple sessions"),
  "tds.webview.launcher.acc": vscode.l10n.t("(-AC) Accessibility module"),
  "tds.webview.launcher.splash": vscode.l10n.t("(-Q) Don't display 'splash'"),
  "tds.webview.launcher.opengl": vscode.l10n.t("(-OPENGL) Enable OpenGL mode"),
  "tds.webview.launcher.dpi": vscode.l10n.t("(-DPI) Enable DPI mode"),
  "tds.webview.launcher.olddpi": vscode.l10n.t("(-OLDDPI) Enable OLDDPI mode"),
  "tds.webview.launcher.language": vscode.l10n.t("Language (-L):"),
  "tds.webview.launcher.langPT": vscode.l10n.t("Portuguese"),
  "tds.webview.launcher.langEN": vscode.l10n.t("English"),
  "tds.webview.launcher.langES": vscode.l10n.t("Spanish"),
  "tds.webview.launcher.langRU": vscode.l10n.t("Russian"),
  "tds.webview.launcher.save": vscode.l10n.t("Save"),
  "tds.webview.launcher.saveClose": vscode.l10n.t("Save/Close"),
  "tds.webview.launcher.bottomInfo": vscode.l10n.t("This config could be altered editing file"),
  "tds.webview.launcher.ignoreFiles": vscode.l10n.t("Ignore files not found in WorkSpace (debugging)"),
};

const debugLaunchInfo: any = {
  type: "totvs_language_debug",
  request: "launch",
  cwb: "${workspaceRoot}",
  name: "",
};

export default class LauncherConfiguration {
  static show(context: vscode.ExtensionContext) {
    if (currentPanel) {
      currentPanel.reveal();
    } else {
      //addLaunchJsonListener();

      currentPanel = vscode.window.createWebviewPanel(
        "totvs-developer-studio.configure.launcher",
        vscode.l10n.t("Launcher Configuration"),
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      );

      currentPanel.webview.html = getWebViewContent(context, localizeHTML);

      currentPanel.onDidDispose(() => {
        currentPanel = undefined;
      }, null);

      // currentPanel.onDidChangeViewState((event) => {
      //   if (currentPanel !== undefined && currentPanel.visible) {
      //     if (launcherInfoChangedManually) {
      //       launcherInfoChangedManually = false;
      //       try {
      //         currentPanel.webview.postMessage(Utils.getLaunchConfig());
      //       } catch (e) {
      //         //Utils.logMessage(`"Não foi possivel ler o arquivo launch.json\nError: ${e}`, MESSAGETYPE.Error, true);
      //       }
      //     }
      //   }
      // });

      let launcherConfiguration = undefined;
      try {
        launcherConfiguration = LaunchConfig.getLaunchers();
        currentPanel.webview.postMessage(launcherConfiguration);
      } catch (e) {
        //Utils.logInvalidLaunchJsonFile(e);
        launcherConfiguration = {};
      }

      currentPanel.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
          case "saveLaunchConfig":
            const launcherName = message.launcherName;
            if (launcherConfiguration !== undefined) {
              let updated: boolean = false;
              for (let i = 0; i < launcherConfiguration.length; i++) {
                let element = launcherConfiguration[i];
                if (element.name === launcherName) {
                  updateElement(element, message);
                  LaunchConfig.updateConfiguration(launcherName, element)
                  updated = true;
                  break;
                }
              }
              if (!updated) {
                //saveNewLauncher(message, launcherConfiguration);
                debugLaunchInfo.name = message.launcherName;
                updateElement(debugLaunchInfo, message);
                // launcherConfiguration.push(debugLaunchInfo);
                LaunchConfig.saveNewConfiguration(debugLaunchInfo)
              }

              //Utils.persistLaunchInfo(launchersInfo); // XXX
              // currentLaunchersInfoContent = fs.readFileSync(
              //   Utils.getLaunchConfigFile(),
              //   "utf8"
              // );

              if (currentPanel !== undefined) {
                console.log("Carregando launch Config onDidReceiveMessage");
                currentPanel.webview.postMessage(launcherConfiguration);
              }

              vscode.window.showInformationMessage(
                vscode.l10n.t("Launcher Configuration saved.")
              );

              if (currentPanel) {
                if (message.close) {
                  currentPanel.dispose();
                }
              }
            }
            return;
        }
      }, undefined);
    }
  }
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {
  const htmlOnDiskPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "src",
      "launcher",
      "launcherConfiguration.html"
    )
  );
  const cssOnDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, "resources", "css", "form.css")
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({ css: cssContent, localize: localizeHTML });
}

function updateElement(element: any, message: any) {
  element.smartclientBin = message.smartclientBin;
  element.program = message.program;
  element.programArguments = message.programArguments;
  element.enableMultiThread = message.enableMultiThread;
  element.enableProfile = message.enableProfile;
  element.isMultiSession = message.isMultiSession;
  element.isAccessibilityMode = message.isAccessibilityMode;
  element.doNotShowSplash = message.doNotShowSplash;
  element.openglMode = message.openglMode;
  element.dpiMode = message.dpiMode;
  element.olddpiMode = message.olddpiMode;
  element.language = message.language;
  element.ignoreFiles = message.ignoreFiles;
  element.enableTableSync = true;
}

// function saveNewLauncher(message: any, launchersInfo: any): void {
//   debugLaunchInfo.name = message.launcherName;
//   updateElement(debugLaunchInfo, message);
//   launchersInfo.configurations.push(debugLaunchInfo);
// }

// function addLaunchJsonListener(): void {
//   let launchJson = Utils.getLaunchConfigFile();

//   if (!fs.existsSync(launchJson)) {
//     Utils.createLaunchConfig(debugLaunchInfo);
//   }

//   if (fs.existsSync(launchJson)) {
//     fs.watch(launchJson, { encoding: "buffer" }, (eventType, filename) => {
//       if (filename && eventType === "change") {
//         let tmpLaunchIfo = Utils.getLaunchConfigFile();
//         let tmpContent = fs.readFileSync(tmpLaunchIfo, "utf-8");
//         if (currentLaunchersInfoContent !== tmpContent) {
//           currentLaunchersInfoContent = tmpContent;
//           //Nao é possivel pedir para atualizar a pagina caso ela nao esteja visivel, o que esta acontecendo
//           //se entrar aqui pois o usuario alterou o launch.json manualmente.
//           //Portanto apenas seta a flag para que o painel seja atualizado assim que ficar visivel.
//           //Obs.: Verficar chamada: currentPanel.onDidChangeViewState(...)
//           launcherInfoChangedManually = true;
//         }
//       }
//     });
//   }
// }
