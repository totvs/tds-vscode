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
import { CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IValidationInfo, sendValidationRequest } from "../protocolMessages";
import { TServerModel, TServerType } from "../model/serverModel";
import { TFieldErrors, TdsPanel, isErrors } from "./panel";
import { TIncludePath } from "../model/includeModel";

enum AddServerCommandEnum {
}

type AddServerCommand = CommonCommandFromWebViewEnum & AddServerCommandEnum;

export class AddServerPanel extends TdsPanel<TServerModel> {
  public static currentPanel: AddServerPanel | undefined;

  public static render(context: vscode.ExtensionContext): AddServerPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

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

    return AddServerPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    AddServerPanel.currentPanel = undefined;

    super.dispose();
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
  protected getWebviewContent(extensionUri: vscode.Uri) {

    return getWebviewContent(this._panel.webview, extensionUri, "addServerView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<AddServerCommand, TServerModel>, result: any): Promise<any> {
    const command: AddServerCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          this.sendUpdateModel({
            serverType: "",
            serverName: "",
            port: 0,
            address: "",
            includePaths: [],
            immediateConnection: true,
            secure: false,
            buildVersion: "",
            globalIncludeDirectories: ServersConfig.getGlobalIncludes().join(";"),

          }, undefined);
        }
        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const selectedPath: string = (result[0] as vscode.Uri).fsPath;
          const includePaths: TIncludePath[] = data.model.includePaths
            .filter((includePath: TIncludePath) => includePath.path.trim().length > 0);
          const alreadyExist: boolean = includePaths.findIndex((includePath: TIncludePath) => includePath.path == selectedPath) > -1;
          const index: number = includePaths.push({ path: selectedPath }) - 1;
          const errors: TFieldErrors<TServerModel> = {};

          data.model.includePaths = includePaths;

          if (alreadyExist) {
            errors[`includePaths.${[index]}.path`] = { type: "validade", message: "Path already informed" };
          }

          this.sendUpdateModel(data.model, errors);
        }
        break
    }
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

  async validateModel(model: TServerModel, errors: TFieldErrors<TServerModel>): Promise<boolean> {
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
      errors.root = { type: "validate", message: vscode.l10n.t("Server already exist") };
      errors.serverName = { type: "validate", message: vscode.l10n.t("Server already exist") };
    }

    if (model.address.length == 0) {
      errors.address = { type: "required" };
    }

    if (Number.isNaN(model.port)) {
      errors.port = { type: "validate", message: vscode.l10n.t("[Port] is not a number") };
    } else if (!(model.port > 0)) {
      errors.port = { type: "min", message: vscode.l10n.t("[Port] is not valid range. Min: 1 Max: 65535") };
    } else if (model.port > 65535) {
      errors.port = { type: "max", message: vscode.l10n.t("[Port] is not valid range. Min: 1 Max: 65535") };
    };

    model.includePaths.forEach((includePath: TIncludePath, index: number) => {
      let checkedDir: string = Utils.checkDir(includePath.path, /\.(ch|th|r)$/);

      if (checkedDir.length == 0) {
        errors[`includePaths.${index}.path`] = { type: "validate", message: vscode.l10n.t("Invalid folder or not contains definition files (.ch or .th)") };
      }
    })

    if (!isErrors(errors)) {
      vscode.window.setStatusBarMessage(
        `$(gear~spin) ${vscode.l10n.t("Validating connection...")}`);

      const validInfoNode: IValidationInfo = await sendValidationRequest(model.address, model.port, model.serverType);
      if (validInfoNode.build == "") {
        errors.root = { type: "validate", message: vscode.l10n.t("Server not found for build validate") };
      }

      vscode.window.setStatusBarMessage("");
    }

    return !isErrors(errors);
  }

  async saveModel(model: TServerModel): Promise<boolean> {
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
      const validInfoNode: IValidationInfo = await sendValidationRequest(model.address, model.port, model.serverType);

      ServersConfig.updateBuildVersion(
        serverId,
        validInfoNode.build,
        validInfoNode.secure
      );

      if (model.immediateConnection) {
        vscode.commands.executeCommand("totvs-developer-studio.connect", serverId);
      }

      return true;
    }

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
      "Add Server": vscode.l10n.t("Add Server"),
      "[Server Registration]servers.md#registro-de-servidores": vscode.l10n.t("[Registro de Servidores]servers.md#registro-de-servidores"),
      "Server Type": vscode.l10n.t("Server Type"),
      "Select the Protheus server type": vscode.l10n.t("Select the Protheus server type"),
      "Connect immediately": vscode.l10n.t("Connect immediately"),
      "Server name": vscode.l10n.t("Server name"),
      "Enter a name that helps you identify the server": vscode.l10n.t("Enter a name that helps you identify the server"),
      "Address": vscode.l10n.t("Address"),
      "Enter the IP or name of the server where Protheus is located": vscode.l10n.t("Enter the IP or name of the server where Protheus is located"),
      "Port": vscode.l10n.t("Port"),
      "Enter the SC connection port": vscode.l10n.t("Enter the SC connection port"),
      "[Port] is not valid range. Min: 1 Max: 65535": vscode.l10n.t("[Port] is not valid range. Min: 1 Max: 65535"),
      "Include directories": vscode.l10n.t("Include directories"),
      "Enter the folders where the definition files should be searched": vscode.l10n.t("Enter the folders where the definition files should be searched"),
      "May be informed later. If you do not inform, the global configuration will be used.": vscode.l10n.t("May be informed later. If you do not inform, the global configuration will be used."),
      "Enter the connection parameters to the Protheus server.": vscode.l10n.t("Enter the connection parameters to the Protheus server.")
    }
  }

}