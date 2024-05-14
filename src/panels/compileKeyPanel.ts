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
import { TCompileKeyModel, TCompileKey, TAuthorization } from "../model/compileKeyModel";
import { TdsPanel, TFieldErrors, isErrors } from "./panel";
import { sendGetIdMessage, TValidKeyResult, sendValidKey } from "../protocolMessages";
import { ServersConfig } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";

enum CompileKeyCommandEnum {
}

type CompileKeyCommand = CommonCommandFromWebViewEnum & CompileKeyCommandEnum;

const EMPTY_MODEL: TCompileKeyModel = {
  machineId: "",
  path: "",
  issued: "",
  expire: "",
  buildType: "",
  tokenKey: "",
  authorizationToken: "",
  userId: "",

  id: "",
  generation: "",
  validation: "",
  permission: "",
  key: "",
  canOverride: false
}

export class CompileKeyPanel extends TdsPanel<TCompileKeyModel> {
  public static currentPanel: CompileKeyPanel | undefined;

  public static render(context: vscode.ExtensionContext): CompileKeyPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (CompileKeyPanel.currentPanel) {
      // If the webview panel already exists reveal it
      CompileKeyPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "compile-key-panel",
        // Panel title
        vscode.l10n.t('Compile Key'),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      CompileKeyPanel.currentPanel = new CompileKeyPanel(panel, extensionUri);
    }

    return CompileKeyPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    CompileKeyPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "compileKeyView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<CompileKeyCommand, TCompileKeyModel>, result: any): Promise<any> {
    const command: CompileKeyCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Reset:
      case CommonCommandFromWebViewEnum.Ready:
        const machineId = await sendGetIdMessage();
        const compileKey: TCompileKey = ServersConfig.getPermissionsInfos();
        const authorization: any = {};
        const model: TCompileKeyModel = data.model || EMPTY_MODEL;
        model.machineId = machineId;

        if (compileKey && compileKey.authorizationToken) {
          model.path = compileKey.path;
          model.issued = compileKey.issued;
          model.expire = compileKey.expire;
          model.buildType = compileKey.buildType;
          model.tokenKey = compileKey.tokenKey;
          model.authorizationToken = compileKey.authorizationToken;
          model.userId = compileKey.userId;

          model.id = compileKey.userId;
          model.generation = authorization.generation;
          model.validation = authorization.validation;
          model.permission = authorization.permission;
          model.key = authorization.key;
          model.canOverride = compileKey.buildType === "0";
        } else {
          model.path = "";
          model.issued = "";
          model.expire = "";
          model.buildType = "";
          model.tokenKey = "";
          model.authorizationToken = "";
          model.userId = "";

          model.id = "";
          model.generation = "";
          model.validation = "";
          model.permission = "";
          model.key = "";
          model.canOverride = false;

        }

        const errors: TFieldErrors<TCompileKeyModel> = {};

        if (!model.machineId) {
          errors.machineId = {
            type: "validate",
            message: vscode.l10n.t("Machine Id is required")
          };
        }

        this.sendUpdateModel(model, undefined);

        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const selectedPath: string = (result[0] as vscode.Uri).fsPath;

          const authorization: TAuthorization = ServersConfig.readCompileKeyFile(
            selectedPath
          );
          const errors: TFieldErrors<TCompileKeyModel> = {};

          if (authorization) {
            data.model.path = selectedPath;
            data.model.id = authorization.id.toUpperCase();
            data.model.generation = authorization.generation;
            data.model.validation = authorization.validation;
            data.model.key = authorization.key;
            data.model.canOverride = authorization.permission === "1";

            await this.validateModel(data.model, errors);
          } else {
            errors.path = {
              type: "validate",
              message: vscode.l10n.t("Invalid compile key file")
            };
          }

          this.sendUpdateModel(data.model, errors);
        }
        break
    }
  }

  async validateModel(model: TCompileKeyModel, errors: TFieldErrors<TCompileKeyModel>): Promise<boolean> {
    // validateKey(
    //   currentPanel,
    //   {
    //     id: authorization.id.toUpperCase(),
    //     generated: authorization.generation,
    //     expire: authorization.validation,
    //     overwrite: canOverride,
    //     token: authorization.key.toUpperCase(),
    //   },
    //   false
    // );

    vscode.window.setStatusBarMessage(
      `$(gear~spin) ${vscode.l10n.t("Validating compile key...")}`);

    const validKey: TValidKeyResult | undefined = await sendValidKey(model.id, model.generation, model.expire, model.canOverride, model.tokenKey);

    if (validKey.buildType == -1) {
      errors.root = { type: "validate", message: "Server refused compile key" };
    }

    if (validKey.authorizationToken == "") {
      errors.authorizationToken = { type: "validate", message: "Invalid token" };
    }

    vscode.window.setStatusBarMessage("");

    return !isErrors(errors);
  }

  async saveModel(model: TCompileKeyModel): Promise<boolean> {
    const compileKey: TCompileKey = model as TCompileKey;
    ServersConfig.savePermissionsInfos(compileKey);

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
      "Compile Key": vscode.l10n.t("Compile Key"),
      "Machine ID": vscode.l10n.t("Machine ID"),
      "Single Identifier of the Station.Automatically obtained": vscode.l10n.t("Single Identifier of the Station.Automatically obtained"),
      "Compile Key File": vscode.l10n.t("Compile Key File"),
      "Generated compilation key file (.Aut)": vscode.l10n.t("Generated compilation key file (.Aut)"),
      "Generated": vscode.l10n.t("Generated"),
      "Date of key generation": vscode.l10n.t("Date of key generation"),
      "Expire": vscode.l10n.t("Expire"),
      "Date of Key Expiration": vscode.l10n.t("Date of Key Expiration"),
      "Token": vscode.l10n.t("Token"),
      "Token generated": vscode.l10n.t("Token generated"),
      "Allow override default": vscode.l10n.t("Allow override default"),
      "From 05/17/2019 all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and macOS.": vscode.l10n.t("From 05/17/2019 all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and macOS.")
    }
  }

}