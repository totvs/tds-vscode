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
import { CommonCommandFromWebViewEnum, EMPTY_LAUNCHER_CONFIGURATION, ReceiveMessage, TLanguagesEnum, TLauncherType } from "tds-shared/lib";
import { TLauncherConfigurationModel } from "tds-shared/lib";
import { TFieldErrors, isErrors } from "tds-shared/lib";
import { TdsPanel } from "./panel";

enum LauncherConfigurationCommandEnum {
}

type LauncherConfigurationCommand = CommonCommandFromWebViewEnum & LauncherConfigurationCommandEnum;

export class LauncherConfigurationPanel extends TdsPanel<TLauncherConfigurationModel> {
  public static currentPanel: LauncherConfigurationPanel | undefined;

  public static render(context: vscode.ExtensionContext): LauncherConfigurationPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (LauncherConfigurationPanel.currentPanel) {
      // If the webview panel already exists reveal it
      LauncherConfigurationPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "launcher-configuration-panel",
        // Panel title
        vscode.l10n.t("Launcher Configuration"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      LauncherConfigurationPanel.currentPanel = new LauncherConfigurationPanel(panel, extensionUri);
    }

    return LauncherConfigurationPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    LauncherConfigurationPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "launcherConfigurationView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<LauncherConfigurationCommand, TLauncherConfigurationModel>, result: any): Promise<any> {
    const command: LauncherConfigurationCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          data.model = EMPTY_LAUNCHER_CONFIGURATION

          let launcherConfiguration = undefined;
          try {
            launcherConfiguration = LaunchConfig.getLaunchers() || {};
          } catch (e) {
            launcherConfiguration = {};
          }

          data.model.launchersNames = [];
          for (const element of launcherConfiguration) {
            data.model.launchersNames.push(element.name);
          }

          this.sendUpdateModel(data.model, undefined);
        }
        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const selectedFile: string = (result[0] as vscode.Uri).fsPath;

          data.model.smartClient = selectedFile;

          this.sendUpdateModel(data.model, undefined);
        }
        break
    }
  }

  async validateModel(model: TLauncherConfigurationModel, errors: TFieldErrors<TLauncherConfigurationModel>): Promise<boolean> {
    model.launcherType = model.launcherType.trim() as TLauncherType;
    model.name = model.name.trim();
    model.smartClient = model.smartClient.trim();
    model.language = model.language.trim() as TLanguagesEnum;

    if (model.launcherType.length == 0) {
      errors.launcherType = { type: "required" };
    }

    if (model.smartClient.length !== 0) {
      if (!fse.existsSync(model.smartClient)) {
        errors["smartClient"] = { type: "validate", message: vscode.l10n.t("File not found.") };
      }
    }

    if (model.program.length == 0) {
      errors.program = { type: "required" };
    }

    return !isErrors(errors);
  }

  async saveModel(model: TLauncherConfigurationModel): Promise<boolean> {
    let launcherConfiguration = undefined;
    let updated: boolean = false;

    try {
      launcherConfiguration = LaunchConfig.getLaunchers() || {};
    } catch (e) {
      //Utils.logInvalidLaunchJsonFile(e);
      launcherConfiguration = {};
    }

    const updateElement = (element: any) => {
      element.name = model.name;
      element.launcherType = model.launcherType;
      element.smartclientBin = model.smartClient;
      element.program = model.program;
      element.programArguments = model.programArgs;
      element.enableMultiThread = model.enableMultiThread;
      element.enableProfile = model.enableProfile;
      element.isMultiSession = model.multiSession;
      element.isAccessibilityMode = model.accessibilityMode;
      element.doNotShowSplash = model.doNotShowSplash;
      element.openglMode = model.openGlMode;
      element.dpiMode = model.dpiMode;
      element.olddpiMode = model.oldDpiMode;
      element.language = model.language;
      element.ignoreFiles = model.ignoreFiles;
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
      LaunchConfig.saveNewConfiguration(debugLaunchInfo)
    }

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
    }
  }

}