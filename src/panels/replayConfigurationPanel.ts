/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as vscode from "vscode";
import * as fse from "fs-extra";

import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { LaunchConfig } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage, LauncherTypeEnum, TReplayDataConfiguration, TReplayConfigurationModel, EMPTY_DEBUG_DATA_CONFIGURATION, EMPTY_REPLAY_CONFIGURATION } from "tds-shared/lib";
import { TFieldErrors, isErrors } from "tds-shared/lib";
import { TdsPanel } from "./panel";
import { LanguagesEnum } from 'tds-shared/lib';
import { EMPTY_DEBUG_CONFIGURATION } from 'tds-shared/lib';

enum ReplayConfigurationCommandEnum {
}

type ReplayConfigurationCommand = CommonCommandFromWebViewEnum & ReplayConfigurationCommandEnum;

export class ReplayConfigurationPanel extends TdsPanel<TReplayConfigurationModel> {
  public static currentPanel: ReplayConfigurationPanel | undefined;

  public static render(context: vscode.ExtensionContext): ReplayConfigurationPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (ReplayConfigurationPanel.currentPanel) {
      // If the webview panel already exists reveal it
      ReplayConfigurationPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "replay-configuration-panel",
        // Panel title
        vscode.l10n.t("TDS-Replay Launcher Configuration"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      ReplayConfigurationPanel.currentPanel = new ReplayConfigurationPanel(panel, extensionUri);
    }

    return ReplayConfigurationPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ReplayConfigurationPanel.currentPanel = undefined;

    super.dispose();
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param extensionUri The URI of the directory containing the extension
   * @returns A _template_ string literal containing the HTML that should be
   * rendered within the webview panel
   */
  protected getWebviewContent(extensionUri: vscode.Uri) {

    return getWebviewContent(this._panel.webview, extensionUri, "replayConfigurationView",
      {
        title: this._panel.title,
        translations: this.getTranslations()
      });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<ReplayConfigurationCommand, TReplayConfigurationModel>, result: any): Promise<any> {
    const command: ReplayConfigurationCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          data.model = EMPTY_REPLAY_CONFIGURATION;

          let launcherConfiguration = undefined;
          try {
            launcherConfiguration = LaunchConfig.getLaunchers() || {};
          } catch (e) {
            launcherConfiguration = {};
          }

          data.model.launchers = {};
          if (launcherConfiguration.length > 0) {
            for (const element of launcherConfiguration) {
              if (element.type !== LauncherTypeEnum.ReplayDebug) {
                continue;
              }

              let dataDebug: TReplayDataConfiguration = EMPTY_REPLAY_CONFIGURATION;

              dataDebug.launcherType = element.type;
              dataDebug.name = element.name;
              dataDebug.replayFile = element.tdsReplayFile;
              dataDebug.password = element.password;
              dataDebug.includeSources = element.includeSource.map((e: string) => { value: e }); //necessário como objeto para satisfazer React
              dataDebug.excludeSources = element.excludeSource.map((e: string) => { value: e }); //necessário como objeto para satisfazer React
              dataDebug.ignoreFiles = element.ignoreSourcesNotFound;
              dataDebug.importOnlySourcesInfo = element.importOnlySourcesInfo;

              data.model.launchers[element.name] = dataDebug;
            }
          }

          this.sendUpdateModel(data.model, undefined);
        }
        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const selectedFile: string = (result[0] as vscode.Uri).fsPath;

          data.model.replayFile = selectedFile;

          this.sendUpdateModel(data.model, undefined);
        }
        break

    }
  }

  async validateModel(model: TReplayConfigurationModel, errors: TFieldErrors<TReplayConfigurationModel>): Promise<boolean> {
    model.launcherType = model.launcherType.trim() as LauncherTypeEnum;
    model.name = model.name.trim();

    model.launcherType = model.launcherType as LauncherTypeEnum;
    model.name = model.name.trim();
    model.replayFile = model.replayFile.trim();
    model.password = model.password.trim();
    model.includeSources = model.includeSources.filter((e) => e.value.trim() != "");
    model.excludeSources = model.excludeSources.filter((e) => e.value.trim() != "");

    if (model.launcherType.length == 0) {
      errors.launcherType = { type: "required" };
    }

    if (model.launcherType !== LauncherTypeEnum.ReplayDebug) {
      errors.launcherType = { type: "validate", message: vscode.l10n.t("Invalid launcher type.") };
    }

    if (model.replayFile.length == 0) {
      errors.replayFile = { type: "required" };
    } else if (fse.existsSync(model.replayFile) === false) {
      errors.replayFile = { type: "validate", message: vscode.l10n.t("File not found.") };
    }

    return !isErrors(errors);
  }

  async saveModel(model: TReplayConfigurationModel): Promise<boolean> {
    let launcherConfiguration = undefined;
    let updated: boolean = false;

    try {
      launcherConfiguration = LaunchConfig.getLaunchers() || {};
    } catch (e) {
      //Utils.logInvalidLaunchJsonFile(e);
      launcherConfiguration = {};
    }

    const updateElement = (element: any) => {
      element.request = "launch";

      element.type = model.launcherType;
      element.name = model.name;
      element.tdsReplayFile = model.replayFile;
      element.password = model.password;
      element.includeSources = model.includeSources.map((e) => e.value).join(";"); //necessário como objeto para satisfazer React
      element.excludeSources = model.excludeSources.map((e) => e.value).join(";"); //necessário como objeto para satisfazer React
      element.ignoreSourcesNotFound = model.ignoreFiles;
      element.importOnlySourcesInfo = model.importOnlySourcesInfo;
    }

    for (let i = 0; i < launcherConfiguration.length; i++) {
      let element = launcherConfiguration[i];
      if (element.name.toLowerCase() === model.name.toLocaleLowerCase()) {
        updateElement(element);
        LaunchConfig.updateConfiguration(model.name, element)
        updated = true;
        break;
      }
    }

    if (!updated) {
      let debugLaunchInfo = {};
      updateElement(debugLaunchInfo);

      LaunchConfig.saveNewConfiguration(debugLaunchInfo, this.getDefaultLauncherType(model.launcherType));
    }

    return true;
  }

  private getDefaultLauncherType(launcherType: LauncherTypeEnum): {} {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    let defaultLaunch = {};

    if (ext) {
      const packageJSON = ext.packageJSON;
      const launchers = packageJSON.contributes.debuggers;
      const launcher = launchers.find((element: any) => {
        return element.type === launcherType;
      });

      if (launcher) {
        const properties = launcher.configurationAttributes.launch.properties;

        Object.keys(properties)
          .forEach((property: string) => {
            defaultLaunch[property] = properties[property].default;
          }
          )
      }
    }

    return defaultLaunch;
  }

  protected getTranslations(): Record<string, string> {
    return {
    }
  }
}

