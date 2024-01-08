/*
Copyright 2021 TOTVS S.A

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
import { CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { ITdsPanel, TFieldError, TFieldErrors, TIncludePath, isErrors } from "../model/field-model";
import { TIncludeModel } from "../model/includeModel";

const localizeHTML = {
  "tds.webview.title": vscode.l10n.t("Include"),
  "tds.webview.dir.include": vscode.l10n.t("Includes directory:"),
  "tds.webview.dir.include2": vscode.l10n.t("Allow multiple directories"),
  "tds.webview.dir.include.info": vscode.l10n.t("These settings can also be changed in"),
  "tds.webview.dir.include.save": vscode.l10n.t("Save"),
  "tds.webview.dir.include.saveclose": vscode.l10n.t("Save/Close"),
};

enum GlobalIncludeCommandEnum {
}

type GlobalIncludeCommand = CommonCommandFromWebViewEnum & GlobalIncludeCommandEnum;

export class GlobalIncludePanel implements ITdsPanel<TIncludeModel> {
  public static currentPanel: GlobalIncludePanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  /**
   * The GlobalIncludePanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  public static render(context: vscode.ExtensionContext): GlobalIncludePanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (GlobalIncludePanel.currentPanel) {
      // If the webview panel already exists reveal it
      GlobalIncludePanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
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

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();

      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(extensionUri: vscode.Uri) {

    return getWebviewContent(this._panel.webview, extensionUri, "globalIncludeView", { title: this._panel.title });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      (message: ReceiveMessage<GlobalIncludeCommand, TIncludeModel>) => {
        const command: GlobalIncludeCommand = message.command;
        const data = message.data;

        switch (command) {
          case CommonCommandFromWebViewEnum.Ready:
            const includes = ServersConfig.getIncludes();
            const includeString: string = includes.toString();
            if (includeString) {
              const aux = includeString.replace(/,/g, ";");
              if (aux) {
                const model: TIncludeModel = {
                  includePaths: aux.split(";").map((value: string) => { return { path: value } })
                  //aux.split(";").map((value: string) => { path: value });
                }
                this._sendUpdateModel(model);
              }
            }

            break;
          case CommonCommandFromWebViewEnum.Close:
            GlobalIncludePanel.currentPanel.dispose();
            break;
          case CommonCommandFromWebViewEnum.SaveAndClose:
            let errors: TFieldErrors<TIncludeModel> = {};

            if (this._validateModel(data.model, errors)) {
              if (this._saveModel(data.model)) {
                GlobalIncludePanel.currentPanel.dispose();
              }
            } else {
              this._sendValidateResponse(errors);
            }

            break;
        }
      },
      undefined,
      this._disposables
    );
  }

  _validateModel(model: TIncludeModel, errors: TFieldErrors<TIncludeModel>): boolean {
    try {
      model.includePaths.forEach((includePath: TIncludePath, index: number) => {
        let checkedDir: string = Utils.checkDir(includePath.path, /\.(ch|th|r)$/);

        if (checkedDir.length == 0) {
          errors[`includePaths.${index}.path`] = { type: "validate", message: "Pasta inválida ou não contém arquivos de definição (.CH ou .TH)" };
        }
      })

    } catch (error) {
      errors.root = { type: "validate", message: `Internal error: ${error}` }
    }

    return !isErrors(errors);
  }

  _saveModel(model: TIncludeModel): boolean {
    const includePath: string[] = model.includePaths.map((row: TIncludePath) => row.path);
    ServersConfig.saveIncludePath(includePath);

    return true;
  }

  _sendValidateResponse(errors: TFieldErrors<TIncludeModel>) {
    this._panel.webview.postMessage({
      command: CommonCommandToWebViewEnum.ValidateResponse,
      data: errors,
    });
  }

  _sendUpdateModel(model: TIncludeModel) {
    this._panel.webview.postMessage({
      command: CommonCommandToWebViewEnum.UpdateModel,
      data: {
        model: model
      }
    });
  }

}