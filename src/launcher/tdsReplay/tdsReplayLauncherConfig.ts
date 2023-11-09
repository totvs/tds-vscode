import * as vscode from "vscode";
import * as path from "path";
import { LaunchConfig } from "../../utils";
import * as fs from "fs";

const compile = require("template-literal");

let currentPanel: vscode.WebviewPanel | undefined = undefined;
//let currentLaunchersInfoContent: any | undefined;
//let launcherInfoChangedManually = false;

const localizeHTML = {
  "tds.webview.launcher.welcome": vscode.l10n.t("Welcome"),
  "tds.webview.launcher.launcherTitle": vscode.l10n.t("TDS Replay Launcher Config"),
  "tds.webview.launcher.name": vscode.l10n.t("Choose launcher:"),
  "tds.webview.launcher.file": vscode.l10n.t("File:"),
  "tds.webview.launcher.pwd": vscode.l10n.t("Password:"),
  "tds.webview.launcher.includeSrc": vscode.l10n.t("Include Sources:"),
  "tds.webview.launcher.excludeSrc": vscode.l10n.t("Exclude Sources:"),
  "tds.webview.launcher.save": vscode.l10n.t("Save"),
  "tds.webview.launcher.saveClose": vscode.l10n.t("Save/Close"),
  "tds.webview.launcher.bottomInfo": vscode.l10n.t("This config could be altered editing file"),
  "tds.webview.launcher.ignoreFiles": vscode.l10n.t("Ignore files not found in WorkSpace (debugging)"),
  "tds.webview.launcher.importOnlySources": vscode.l10n.t("Import only the sources information"),
};


const replayLaunchInfo: any = {
  type: "totvs_tdsreplay_debug",
  request: "launch",
  cwb: "${workspaceRoot}",
  ignoreSourcesNotFound: true,
  name: "",
};

export default class LauncherConfiguration {
  static show(context: vscode.ExtensionContext) {
    if (currentPanel) {
      currentPanel.reveal();
    } else {
      //addLaunchJsonListener();

      currentPanel = vscode.window.createWebviewPanel(
        "totvs-developer-studio.tdsreplay.configure.launcher",
        vscode.l10n.t("TDS Replay Launcher Configuration"),
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
        //Devemos realmente limpar todo o conteudo do launch.json em uma situacao de erro?
        //launcherConfiguration = {};
      }

      currentPanel.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
          case "saveLaunchConfig":
            const launcherName = message.launcherName;
            if (launcherConfiguration !== undefined) {
              let updated: boolean = false;
              for (let i = 0; i < launcherConfiguration.length; i++) {
                let configElement = launcherConfiguration[i];
                if (configElement.name === launcherName) {
                  updateElement(configElement, message);
                  LaunchConfig.updateConfiguration(launcherName, configElement)
                  updated = true;
                  break;
                }
              }
              if (!updated) {
                //saveNewLauncher(message, launcherConfiguration);
                replayLaunchInfo.name = message.launcherName;
                updateElement(replayLaunchInfo, message);
                //launcherConfiguration.push(replayLaunchInfo);
                LaunchConfig.saveNewConfiguration(replayLaunchInfo)
              }
            }

            //Utils.persistLaunchInfo(launcherConfig); // XXX
            // currentLaunchersInfoContent = fs.readFileSync(
            //   Utils.getLaunchConfigFile(),
            //   "utf8"
            // );

            if (currentPanel !== undefined) {
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
      "tdsReplay",
      "tdsReplayLauncherConfig.html"
    )
  );
  const cssOniskPath = vscode.Uri.file(
    path.join(context.extensionPath, "resources", "css", "form.css")
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOniskPath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({ css: cssContent, localize: localizeHTML });
}

function updateElement(configElement: any, message: any) {
  configElement.tdsReplayFile = message.tdsReplayFile;
  configElement.password = message.password;
  configElement.includeSources = message.includeSources;
  configElement.excludeSources = message.excludeSources;
  configElement.ignoreSourcesNotFound = message.ignoreSourcesNotFound;
  configElement.importOnlySourcesInfo = message.importOnlySourcesInfo;
}

// function saveNewLauncher(message: any, launchersInfo: any): void {
//   replayLaunchInfo.name = message.launcherName;
//   updateElement(replayLaunchInfo, message);
//   launchersInfo.configurations.push(replayLaunchInfo);
// }

// function addLaunchJsonListener(): void {
//   let launchJson = Utils.getLaunchConfigFile();

//   if (!fs.existsSync(launchJson)) {
//     Utils.createLaunchConfig(replayLaunchInfo);
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
