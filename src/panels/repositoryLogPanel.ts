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
import { ServersConfig } from "../utils";
import { CommonCommandFromWebViewEnum, EMPTY_REPOSITORY_MODEL, ReceiveMessage, TPatchInfoModel } from "tds-shared/lib";
import { IRpoInfoData, sendRpoInfo } from "../protocolMessages";
import { TRepositoryLogModel } from "tds-shared/lib";
import { TFieldErrors, isErrors } from "tds-shared/lib";
import { TdsPanel } from "./panel";
import { languageClient } from "../extension";

enum RepositoryLogCommandEnum {
  ExportToTxt = "EXPORT_TO_TXT",
  ExportToJson = "EXPORT_TO_JSON",
}

type RepositoryLogCommand = CommonCommandFromWebViewEnum & RepositoryLogCommandEnum;

export class RepositoryLogPanel extends TdsPanel<TRepositoryLogModel> {
  public static currentPanel: RepositoryLogPanel | undefined;

  public static render(context: vscode.ExtensionContext): RepositoryLogPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (RepositoryLogPanel.currentPanel) {
      // If the webview panel already exists reveal it
      RepositoryLogPanel.currentPanel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "repository-log--panel",
        // Panel title
        vscode.l10n.t('Repository Log'),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      RepositoryLogPanel.currentPanel = new RepositoryLogPanel(panel, extensionUri);
    }

    return RepositoryLogPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    RepositoryLogPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "repositoryLogView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<RepositoryLogCommand, TRepositoryLogModel>, result: any): Promise<any> {
    const command: RepositoryLogCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          let model: TRepositoryLogModel = EMPTY_REPOSITORY_MODEL;

          this.updateRpoInfo(model);
          this.sendUpdateModel(model, undefined);
        }
        break;
    }
  }

  async validateModel(model: TRepositoryLogModel, errors: TFieldErrors<TRepositoryLogModel>): Promise<boolean> {

    //Does not apply

    return !isErrors(errors);
  }

  async saveModel(model: TRepositoryLogModel): Promise<boolean> {
    //Does not apply

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
    }
  }

  private updateRpoInfo(model: TRepositoryLogModel): boolean {
    const server = ServersConfig.getCurrentServer();

    vscode.window.setStatusBarMessage(
      "$(gear~spin)" +
      vscode.l10n.t("Requesting data from the server [{0}]", server.name),
      sendRpoInfo(server).then(
        (rpoInfo: IRpoInfoData) => {
          model.serverName = server.name;
          model.environment = server.environment;
          model.dateGeneration = new Date(rpoInfo.dateGeneration);
          model.rpoVersion = rpoInfo.rpoVersion;
          model.rpoPatches = [];

          model.rpoPatches.push(...rpoInfo.rpoPatchs);

          this.sendUpdateModel(model, undefined);
        },
        (err: Error) => {
          languageClient.error(err.message, err);
          vscode.window.showErrorMessage(
            err.message + vscode.l10n.t(". See log for details.")
          );
        }
      )
    );

    return true;
  }


}