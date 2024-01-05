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
import { CommonCommandFromWebView, CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IValidationInfo, sendValidationRequest } from "../protocolMessages";
import { TIncludePathModel, TServerModel, TServerType } from "../model/serverModel";
import { TFieldErrors, isErrors } from "../model/field-model";
import { ResponseError } from "vscode-languageclient";

enum AddServerCommandEnum {
}

type AddServerCommand = CommonCommandFromWebViewEnum & AddServerCommandEnum;

export class AddServerPanel {
  public static currentPanel: AddServerPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  /**
   * The AddServerPanel class private constructor (called only from the render method).
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

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: vscode.Uri) {
    if (AddServerPanel.currentPanel) {
      // If the webview panel already exists reveal it
      AddServerPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "add-server-panel",
        // Panel title
        vscode.l10n.t('Add Server'),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      AddServerPanel.currentPanel = new AddServerPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    AddServerPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "addServerView", { title: this._panel.title });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      (message: ReceiveMessage<AddServerCommand, TServerModel>) => {
        const command: AddServerCommand = message.command;
        const data = message.data;

        switch (command) {
          case CommonCommandFromWebViewEnum.Ready:
            break;
          case CommonCommandFromWebViewEnum.Close:
            AddServerPanel.currentPanel.dispose();
            break;
          case CommonCommandFromWebViewEnum.SaveAndClose:
            let errors: TFieldErrors<TServerModel> = {};

            if (this.validateModel(data.model, errors)) {
              if (this.saveModel(data.model)) {
                AddServerPanel.currentPanel.dispose();
              }
            } else {
              this.sendValidateResponse(errors);
            }

            break;
        }
      },
      undefined,
      this._disposables
    );
  }

  private validateModel(model: TServerModel, errors: TFieldErrors<TServerModel>): boolean {
    try {
      model.serverType = model.serverType.trim() as TServerType;
      model.serverName = model.serverName.trim();
      model.port = parseInt(model.port.toString());
      model.address = model.address.trim();

      if (model.serverType.length == 0) {
        errors.serverType = { type: "required" };
      }

      if (model.serverName.length == 0) {
        errors.serverName = { type: "required" };
      }
      const server = ServersConfig.getServerByName(model.serverName);
      if (server !== undefined) {
        errors.root = { type: "validate", message: "Server already exist" };
        errors.serverName = { type: "validate", message: "Server already exist" };
      }

      if (model.address.length == 0) {
        errors.address = { type: "required" };
      }

      if (Number.isNaN(model.port)) {
        errors.port = { type: "validate", message: "[Port] is not a number" };
      } else if (!(model.port > 0)) {
        errors.port = { type: "min" };
      } else if (model.port > 65535) {
        errors.port = { type: "max" };
      }

      model.includePaths.forEach((includePath: TIncludePathModel, index: number) => {
        let checkedDir: string = Utils.checkDir(includePath.path, /\.(ch|th)$/);
        if (checkedDir.length == 0) {
          errors.includePaths = { type: "validate", message: "Pasta inválida ou não contém arquivos de definição (.CH ou .TH)" };
          errors.root = { type: "validate", message: index + "=Pasta inválida ou não contém arquivos de definição (.CH ou .TH)" };
        }

      })

    } catch (error) {
      errors.root = { type: "validate", message: `Internal error: ${error}` }
    }

    return !isErrors(errors);
  }

  private createServer(
    typeServer: string,
    serverName: string,
    port: number,
    address: string,
    secure: number,
    buildVersion: string,
    includes: string[]
  ): string | undefined {
    const serverId = ServersConfig.createNewServer(
      typeServer,
      serverName,
      port,
      address,
      buildVersion,
      secure,
      includes
    );

    if (serverId !== undefined) {
      vscode.window.showInformationMessage(
        vscode.l10n.t("Serve saved. Name: {0}", serverName)
      );
    }

    return serverId;
  }

  private saveModel(model: TServerModel): boolean {
    const serverId = this.createServer(
      model.serverType,
      model.serverName,
      model.port,
      model.address,
      0,
      "",
      model.includePaths.map((row: any) => row.path)
    );
    if (serverId !== undefined) {
      sendValidationRequest(model.address, model.port, model.serverType).then(
        (validInfoNode: IValidationInfo) => {
          ServersConfig.updateBuildVersion(
            serverId,
            validInfoNode.build,
            validInfoNode.secure
          );

          return true;
        },
        (err: ResponseError<object>) => {
          vscode.window.showErrorMessage(err.message);
          return false;
        }
      );
    }

    return true;
  }

  private sendUpdateModel(model: {}) {
    this._panel.webview.postMessage({
      command: CommonCommandToWebViewEnum.UpdateModel,
      model: model
    });
  }

  private sendValidateResponse(errors: TFieldErrors<TServerModel>) {
    this._panel.webview.postMessage({
      command: CommonCommandToWebViewEnum.ValidateResponse,
      data: errors,
    });
  }

}

/*
      if (currentPanel) {
        currentPanel.reveal();
      } else {
        currentPanel = vscode.window.createWebviewPanel(
          "totvs-developer-studio.addServer",
          vscode.l10n.t("New Server"),
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(
                path.join(context.extensionPath, "src", "server")
              ),
            ],
            retainContextWhenHidden: true,
          }
        );

        currentPanel.webview.html = getWebViewContent(context, localizeHTML);
        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined;
          },
          null,
          context.subscriptions
        );

        currentPanel.webview.onDidReceiveMessage(
          (message) => {
            switch (message.command) {
              case "checkDir":
                let checkedDir = Utils.checkDir(message.selectedDir);
                currentPanel.webview.postMessage({
                  command: "checkedDir",
                  checkedDir: checkedDir,
                });
                break;
              case "saveServer":
                if (message.serverName && message.port && message.address) {
                  const serverId = createServer(
                    message.serverType,
                    message.serverName,
                    message.port,
                    message.address,
                    0,
                    "",
                    true,
                    message.includes
                  );
                  if (serverId !== undefined) {
                    sendValidationRequest(message.address, message.port, message.serverType).then(
                      (validInfoNode: IValidationInfo) => {
                        ServersConfig.updateBuildVersion(
                          serverId,
                          validInfoNode.build,
                          validInfoNode.secure
                        );

                        currentPanel?.dispose();
                        return;
                      },
                      (err: ResponseError<object>) => {
                        vscode.window.showErrorMessage(err.message);
                      }
                    );
                  }
                } else {
                  vscode.window.showErrorMessage(
                    vscode.l10n.t("Add Server Fail. Name, port and Address are need")
                  );
                }

                if (currentPanel) {
                  if (message.close) {
                    currentPanel.dispose();
                  }
                }
            }
          },
          undefined,
          context.subscriptions
        );
      }

*/