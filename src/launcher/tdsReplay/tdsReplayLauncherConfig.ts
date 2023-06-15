import * as vscode from "vscode";
import * as path from "path";
import Utils from "../../utils";
import * as fs from "fs";
import * as nls from "vscode-nls";

let localize = nls.loadMessageBundle();
const compile = require("template-literal");

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let currentLaunchersInfoContent: any | undefined;
let launcherInfoChangedManually = false;

const localizeHTML = {
  "tds.webview.launcher.welcome": localize(
    "tds.webview.launcher.welcome",
    "Welcome"
  ),
  "tds.webview.launcher.launcherTitle": localize(
    "tds.webview.launcher.launcherTitle",
    "TDS Replay Launcher Config"
  ),
  "tds.webview.launcher.name": localize(
    "tds.webview.launcher.name",
    "Choose launcher:"
  ),
  "tds.webview.launcher.file": localize("tds.webview.launcher.file", "File:"),
  "tds.webview.launcher.pwd": localize("tds.webview.launcher.pwd", "Password:"),
  "tds.webview.launcher.includeSrc": localize(
    "tds.webview.launcher.includeSrc",
    "Include Sources:"
  ),
  "tds.webview.launcher.excludeSrc": localize(
    "tds.webview.launcher.excludeSrc",
    "Exclude Sources:"
  ),
  "tds.webview.launcher.save": localize("tds.webview.launcher.save", "Save"),
  "tds.webview.launcher.saveClose": localize(
    "tds.webview.launcher.saveClose",
    "Save/Close"
  ),
  "tds.webview.launcher.bottomInfo": localize(
    "tds.webview.launcher.bottomInfo",
    "This config could be altered editing file"
  ),
  "tds.webview.launcher.ignoreFiles": localize(
    "tds.webview.launcher.ignoreFiles",
    "Ignore files not found in WorkSpace (debugging)"
  ),
  "tds.webview.launcher.importOnlySources": localize(
    "tds.webview.launcher.importOnlySources",
    "Import only the sources information"
  ),
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
      addLaunchJsonListener();

      currentPanel = vscode.window.createWebviewPanel(
        "totvs-developer-studio.tdsreplay.configure.launcher",
        localize(
          "tds.vscode.tdsreplay.launcher.configuration",
          "TDS Replay Launcher Configuration"
        ),
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

      currentPanel.onDidChangeViewState((event) => {
        if (currentPanel !== undefined && currentPanel.visible) {
          if (launcherInfoChangedManually) {
            launcherInfoChangedManually = false;
            try {
              currentPanel.webview.postMessage(Utils.getLaunchConfig());
            } catch (e) {
              //Utils.logMessage(`"Não foi possivel ler o arquivo launch.json\nError: ${e}`, MESSAGETYPE.Error, true);
            }
          }
        }
      });

      let launcherConfig = undefined;
      try {
        launcherConfig = Utils.getLaunchConfig();
        currentPanel.webview.postMessage(launcherConfig);
      } catch (e) {
        Utils.logInvalidLaunchJsonFile(e);
        //Devemos realmente limpar todo o conteudo do launch.json em uma situacao de erro?
        //launcherConfig = {};
      }

      currentPanel.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
          case "saveLaunchConfig":
            const launcherName = message.launcherName;
            if (launcherConfig.configurations !== undefined) {
              if (launcherConfig.configurations.length > 0 !== undefined) {
                let updated: boolean = false;
                for (let i = 0; i < launcherConfig.configurations.length; i++) {
                  let configElement = launcherConfig.configurations[i];
                  if (configElement.name === launcherName) {
                    updateElement(configElement, message);
                    updated = true;
                    break;
                  }
                }
                if (!updated) {
                  saveNewLauncher(message, launcherConfig);
                }
              } else {
                saveNewLauncher(message, launcherConfig);
              }
            }

            Utils.persistLaunchInfo(launcherConfig);
            currentLaunchersInfoContent = fs.readFileSync(
              Utils.getLaunchConfigFile(),
              "utf8"
            );

            if (currentPanel !== undefined) {
              currentPanel.webview.postMessage(launcherConfig);
            }

            vscode.window.showInformationMessage(
              localize(
                "tds.vscode.launcher.configuration.saved",
                "Launcher Configuration saved."
              )
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

function saveNewLauncher(message: any, launchersInfo: any): void {
  replayLaunchInfo.name = message.launcherName;
  updateElement(replayLaunchInfo, message);
  launchersInfo.configurations.push(replayLaunchInfo);
}

function addLaunchJsonListener(): void {
  let launchJson = Utils.getLaunchConfigFile();

  if (!fs.existsSync(launchJson)) {
    Utils.createLaunchConfig(replayLaunchInfo);
  }

  if (fs.existsSync(launchJson)) {
    fs.watch(launchJson, { encoding: "buffer" }, (eventType, filename) => {
      if (filename && eventType === "change") {
        let tmpLaunchIfo = Utils.getLaunchConfigFile();
        let tmpContent = fs.readFileSync(tmpLaunchIfo, "utf-8");
        if (currentLaunchersInfoContent !== tmpContent) {
          currentLaunchersInfoContent = tmpContent;
          //Nao é possivel pedir para atualizar a pagina caso ela nao esteja visivel, o que esta acontecendo
          //se entrar aqui pois o usuario alterou o launch.json manualmente.
          //Portanto apenas seta a flag para que o painel seja atualizado assim que ficar visivel.
          //Obs.: Verficar chamada: currentPanel.onDidChangeViewState(...)
          launcherInfoChangedManually = true;
        }
      }
    });
  }
}
