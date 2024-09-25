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
import { CommonCommandFromWebViewEnum, ReceiveMessage, LauncherTypeEnum, TDebugDataConfiguration, TDebugConfigurationModel, EMPTY_DEBUG_DATA_CONFIGURATION } from "@tds-shared/index";
import { TFieldErrors, isErrors } from "@tds-shared/index";
import { TdsPanel } from "./panel";
import { LanguagesEnum } from '@tds-shared/index';
import { EMPTY_DEBUG_CONFIGURATION } from '@tds-shared/index';

enum LauncherConfigurationCommandEnum {
}

type LauncherConfigurationCommand = CommonCommandFromWebViewEnum & LauncherConfigurationCommandEnum;

export class LauncherConfigurationPanel extends TdsPanel<TDebugConfigurationModel> {
  public static currentPanel: LauncherConfigurationPanel | undefined;

  public static render(context: vscode.ExtensionContext): LauncherConfigurationPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (LauncherConfigurationPanel.currentPanel) {
      // If the webview panel already exists reveal it
      LauncherConfigurationPanel.currentPanel.reveal(); //vscode.ViewColumn.One
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
  protected async panelListener(message: ReceiveMessage<LauncherConfigurationCommand, TDebugConfigurationModel>, result: any): Promise<any> {
    const command: LauncherConfigurationCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          data.model = EMPTY_DEBUG_CONFIGURATION();

          let launcherConfiguration = undefined;
          try {
            launcherConfiguration = LaunchConfig.getLaunchers() || {};
          } catch (e) {
            launcherConfiguration = {};
          }

          data.model.launchers = {};
          if (launcherConfiguration.length > 0) {
            for (const element of launcherConfiguration) {
              if ((element.type !== LauncherTypeEnum.TotvsLanguageDebug) && (element.type !== LauncherTypeEnum.TotvsWebDebug)) {
                continue;
              }

              const dataDebug: TDebugDataConfiguration = EMPTY_DEBUG_DATA_CONFIGURATION();

              dataDebug.smartClient = element.smartclientBin;
              dataDebug.program = element.program;
              dataDebug.programArgs = element.programArguments;
              dataDebug.enableMultiThread = element.enableMultiThread;
              dataDebug.enableProfile = element.enableProfile;
              dataDebug.multiSession = element.isMultiSession;
              dataDebug.accessibilityMode = element.isAccessibilityMode;
              dataDebug.doNotShowSplash = element.doNotShowSplash;
              dataDebug.openGlMode = element.openglMode;
              dataDebug.dpiMode = element.dpiMode;
              dataDebug.oldDpiMode = element.olddpiMode;
              dataDebug.language = element.language;
              dataDebug.ignoreFiles = element.ignoreFiles;

              data.model.launchers[element.name] = dataDebug;
            }
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

  async validateModel(model: TDebugConfigurationModel, errors: TFieldErrors<TDebugConfigurationModel>): Promise<boolean> {
    model.launcherType = model.launcherType.trim() as LauncherTypeEnum;
    model.name = model.name.trim();

    model.smartClient = model.smartClient.trim();
    model.language = model.language as LanguagesEnum;
    model.webAppUrl = model.webAppUrl.trim();
    model.program = model.program.trim();
    model.programArgs = model.programArgs.map((element: { value: string }) => {
      element.value = element.value.trim();
      return element;
    });

    if (model.launcherType.length == 0) {
      errors.launcherType = { type: "required" };
    }

    if ((model.launcherType !== LauncherTypeEnum.TotvsLanguageDebug)
      && (model.launcherType !== LauncherTypeEnum.TotvsWebDebug)) {
      errors.launcherType = { type: "validate", message: vscode.l10n.t("Invalid launcher type.") };
    }

    if (model.launcherType == LauncherTypeEnum.TotvsLanguageDebug) {
      if (model.smartClient.length !== 0) {
        if (!fse.existsSync(model.smartClient)) {
          errors["smartClient"] = { type: "validate", message: vscode.l10n.t("File not found.") };
        }
      }

      // if (model.program.length == 0) {
      //   errors["languageDebug.program"] = { type: "required" };
      // }
    }

    return !isErrors(errors);
  }

  async saveModel(model: TDebugConfigurationModel): Promise<boolean> {
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
      element.smartclientBin = model.smartClient;
      element.program = model.program || "${command:AskForProgramName}";
      element.programArguments = model.programArgs.map((element: { value: string }) => {
        return element.value === "<empty>" ? "" : element.value;
      });
      element.enableMultiThread = model.enableMultiThread;
      element.enableProfile = model.enableProfile;
      element.isMultiSession = model.multiSession;
      element.isAccessibilityMode = model.accessibilityMode;
      element.doNotShowSplash = model.doNotShowSplash;
      element.openglMode = model.openGlMode;
      element.dpiMode = model.dpiMode;
      element.olddpiMode = model.oldDpiMode;
      if (model.language &&
        (model.language !== LanguagesEnum.DEFAULT)) {
        element.language = LanguagesEnum[model.language];
      }
      element.ignoreFiles = model.ignoreFiles;
    }

    for (let i = 0; i < launcherConfiguration.length; i++) {
      const element = launcherConfiguration[i];
      if (element.name.toLowerCase() === model.name.toLocaleLowerCase()) {
        updateElement(element);
        LaunchConfig.updateConfiguration(model.name, element)
        updated = true;
        break;
      }
    }

    if (!updated) {
      const debugLaunchInfo = {};
      updateElement(debugLaunchInfo);

      LaunchConfig.saveNewConfiguration(debugLaunchInfo, this.getDefaultLauncherType(model.launcherType));
    }

    return true;
  }

  private getDefaultLauncherType(launcherType: LauncherTypeEnum): {} {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const defaultLaunch = {};

    if (ext) {
      const packageJSON = ext.packageJSON;
      const launchers = packageJSON.contributes.debuggers;
      const launcher = launchers.find((element: any) => {
        return element.type === launcherType;
      });

      if (launcher) {
        const properties = launcher.configurationAttributes.launch.properties;

        Object.keys(properties)
          .filter((property: string) => {
            return (property !== "program") && (property !== "smartclientBin");
          })
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
      "Launcher Type": vscode.l10n.t("Launcher Type"),
      "AdvPL Arguments `-A`": vscode.l10n.t("AdvPL Arguments `-A`"),
      "AdvPL Function": vscode.l10n.t("AdvPL Function"),
      "Configure an launcher for debugging": vscode.l10n.t("Configure an launcher for debugging"),
      "Debugger Options": vscode.l10n.t("Debugger Options"),
      "Enter a name that helps you identify the launcher": vscode.l10n.t("Enter a name that helps you identify the launcher"),
      "Enter the arguments for AdvPL function.": vscode.l10n.t("Enter the arguments for AdvPL function."),
      "Enter the name of the function to be performed.": vscode.l10n.t("Enter the name of the function to be performed."),
      "Enter the value of parameters.": vscode.l10n.t("Enter the value of parameters."),
      "If not informed, it will use the definition made in the current server configuration.": vscode.l10n.t("If not informed, it will use the definition made in the current server configuration."),
      "If not informed, it will use the `http(s)://<server>:<port>/webapp` of current server configuration.": vscode.l10n.t("If not informed, it will use the `http(s)://<server>:<port>/webapp` of current server configuration."),
      "Ignore files not found in WorkSpace (debugging)": vscode.l10n.t("Ignore files not found in WorkSpace (debugging)"),
      "Language": vscode.l10n.t("Language"),
      "Mark the arguments which will be passed to the process of debugging.": vscode.l10n.t("Mark the arguments which will be passed to the process of debugging."),
      "Mark the arguments which will be passed to the SmartClient.": vscode.l10n.t("Mark the arguments which will be passed to the SmartClient."),
      "Multi Thread": vscode.l10n.t("Multi Thread"),
      "Name": vscode.l10n.t("Name"),
      "Profile": vscode.l10n.t("Profile"),
      "Select the launcher type to config": vscode.l10n.t("Select the launcher type to config"),
      "Select the SmartClient binary to be used.": vscode.l10n.t("Select the SmartClient binary to be used."),
      "Smart Client (Desktop)": vscode.l10n.t("Smart Client (Desktop)"),
      "Smart Client Arguments": vscode.l10n.t("Smart Client Arguments"),
      "Start Web App URL.": vscode.l10n.t("Start Web App URL."),
      "Web App URL": vscode.l10n.t("Web App URL"),
      "`-AC` Accessibility module": vscode.l10n.t("`-AC` Accessibility module"),
      "`-DPI` Enable DPI mode": vscode.l10n.t("`-DPI` Enable DPI mode"),
      "`-M` Multiple sessions": vscode.l10n.t("`-M` Multiple sessions"),
      "`-OLDDPI` Enable old DPI mode": vscode.l10n.t("`-OLDDPI` Enable old DPI mode"),
      "`-OPENGL` Enable OpenGL mode": vscode.l10n.t("`-OPENGL` Enable OpenGL mode"),
      "`-Q` Don't display 'splash'": vscode.l10n.t("`-Q` Don't display 'splash'"),
      "Select Smart Client Desktop": vscode.l10n.t("Select Smart Client Desktop")
    }
  }

}

