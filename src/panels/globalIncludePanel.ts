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
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import Utils, { ServersConfig } from "../utils";
import { CommonCommandFromWebViewEnum, EMPTY_GLOBAL_INCLUDE_MODEL, ReceiveMessage, TFieldErrors, TGlobalIncludeModel, TIncludePath, isErrors } from "@tds-shared/index";
import { TdsPanel } from "./panel";

enum GlobalIncludeCommandEnum {
}

type GlobalIncludeCommand = CommonCommandFromWebViewEnum & GlobalIncludeCommandEnum;

export class GlobalIncludePanel extends TdsPanel<TGlobalIncludeModel> {
  public static currentPanel: GlobalIncludePanel | undefined;

  /**
   * Renders the Global Include panel in the Visual Studio Code editor.
   *
   * If the panel already exists, it will be revealed. Otherwise, a new panel will be created and shown in the first editor column.
   *
   * @param context The extension context, used to get the extension URI.
   * @returns The current instance of the GlobalIncludePanel.
   */
  public static render(context: vscode.ExtensionContext): GlobalIncludePanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (GlobalIncludePanel.currentPanel) {
      // If the webview panel already exists reveal it
      GlobalIncludePanel.currentPanel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "global-include-panel",
        // Panel title
        vscode.l10n.t("Global Include"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      GlobalIncludePanel.currentPanel = new GlobalIncludePanel(panel, extensionUri);
    }

    return GlobalIncludePanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    GlobalIncludePanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "globalIncludeView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<GlobalIncludeCommand, TGlobalIncludeModel>, result: any): Promise<any> {
    const command: GlobalIncludeCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        const includes: string[] = ServersConfig.getIncludes();
        const model: TGlobalIncludeModel = EMPTY_GLOBAL_INCLUDE_MODEL() && {
          includePaths: includes.map((value: string) => { return { path: value } })
        }
        this.sendUpdateModel(model, undefined);

        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const selectedPath: string = (result[0] as vscode.Uri).fsPath;
          const includePaths: TIncludePath[] = data.model.includePaths
            .filter((includePath: TIncludePath) => includePath.path.trim().length > 0);
          const alreadyExist: boolean = includePaths.findIndex((includePath: TIncludePath) => includePath.path == selectedPath) > -1;
          const index: number = includePaths.push({ path: selectedPath }) - 1;
          const errors: TFieldErrors<TGlobalIncludeModel> = {};

          data.model.includePaths = includePaths;

          if (alreadyExist) {
            errors[`includePaths.${[index]}.path`] = { type: "validade", message: "Path already informed" };
          }

          this.sendUpdateModel(data.model, errors);
        }
        break

        break;
    }
  }

  protected validateModel(model: TGlobalIncludeModel, errors: TFieldErrors<TGlobalIncludeModel>): boolean {
    model.includePaths.forEach((includePath: TIncludePath, index: number) => {
      const checkedDir: string = Utils.checkDir(includePath.path, /\.(ch|th|r)$/gi);

      if (checkedDir.length == 0) {
        errors[`includePaths.${index}.path`] = { type: "validate", message: vscode.l10n.t("Invalid folder or not contains definition files (.CH or .TH)") };
      }
    })

    return !isErrors(errors);
  }

  protected saveModel(model: TGlobalIncludeModel): boolean {
    const includePath: string[] = model.includePaths.map((row: TIncludePath) => row.path);
    ServersConfig.saveIncludePath(includePath);

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
      "Global Include": vscode.l10n.t("Global Include"),
      "The global search folder list is used when not specified in the server definition.": vscode.l10n.t("The global search folder list is used when not specified in the server definition."),
      "Include directories": vscode.l10n.t("Include directories"),
      "Enter the folders where the definition files should be searched": vscode.l10n.t("Enter the folders where the definition files should be searched"),
      "Select folder with definition files": vscode.l10n.t("Select folder with definition files"),
      "Select the folder where the definition files are located": vscode.l10n.t("Select the folder where the definition files are located"),
      "These settings can also be changed in {0}": vscode.l10n.t("These settings can also be changed in {0}"),
    };
  }

}