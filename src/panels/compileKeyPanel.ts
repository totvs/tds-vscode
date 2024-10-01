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
import { TCompileKeyModel, TCompileKey, TAuthorization, TFieldError } from "@tds-shared/index";
import { TFieldErrors, isErrors } from "@tds-shared/index";
import { sendGetIdMessage, TValidKeyResult, sendValidKey } from "../protocolMessages";
import { ServersConfig } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "@tds-shared/index";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { TdsPanel } from "./panel";
import * as fse from "fs-extra";
import { languageClient } from "../extension";

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
      CompileKeyPanel.currentPanel.reveal(); //vscode.ViewColumn.One
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
   * @returns A _template_ string literal containing the HTML that should be
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
    let command: CompileKeyCommand = message.command;
    const data = message.data;
    let errors: TFieldErrors<TCompileKeyModel> = {};

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

        errors = {};

        if (!model.machineId) {
          errors.machineId = {
            type: "validate",
            message: vscode.l10n.t("Machine Id is required")
          };
        }

        this.sendUpdateModel(model, undefined);

        break;

      case CommonCommandFromWebViewEnum.Validate:
        errors = {};

        if (data.model.path.trim() == "") {
          errors.path = {
            type: "validate",
            message: vscode.l10n.t("AUT file is required")
          }
        } else {
          errors = await this.validateAuthorization(data.model.path, data.model);
        }

        this.sendUpdateModel(data.model, errors);
        break;

      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const selectedPath: string = (result[0] as vscode.Uri).fsPath;
          errors = await this.validateAuthorization(selectedPath, data.model);

          this.sendUpdateModel(data.model, errors);
        }
        break
    }
  }

  async validateModel(model: TCompileKeyModel, errors: TFieldErrors<TCompileKeyModel>): Promise<boolean> {

    vscode.window.setStatusBarMessage(
      `$(gear~spin) ${vscode.l10n.t("Validating compile key...")}`);

    const validKey: TValidKeyResult | undefined = await sendValidKey(model.id, model.generation, model.expire, model.canOverride, model.tokenKey);

    if (validKey.buildType == -1) {
      errors.path = { type: "validate", message: vscode.l10n.t("Server refused compile key").concat(` ${validKey.errorMessage}`) };
    } else if (validKey.authorizationToken == "") {
      errors.path = { type: "validate", message: vscode.l10n.t("Invalid Token") };
      // errors.authorizationToken = {
      //   type: "validate", message: vscode.l10n.t("Invalid token")
      // };
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
      "Generated compilation key file (.AUT)": vscode.l10n.t("Generated compilation key file (.AUT)"),
      "Generated": vscode.l10n.t("Generated"),
      "Date of key generation": vscode.l10n.t("Date of key generation"),
      "Expire": vscode.l10n.t("Expire"),
      "Date of Key Expiration": vscode.l10n.t("Date of Key Expiration"),
      "Token": vscode.l10n.t("Token"),
      "Token generated": vscode.l10n.t("Token generated"),
      "Allow override default": vscode.l10n.t("Allow override default"),
      "From **05/17/2019** all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and MacOS.": vscode.l10n.t("From **05/17/2019** all keys will have to be regenerated using the Machine ID shown above. This will allow compatibility with Linux and MacOS."),
      "Authorization Token": vscode.l10n.t("Authorization Token"),
      "From **servers 7.00.210324p (Harpia)**, compilation keys should be replaced by _Token RPO_.": vscode.l10n.t("From **servers 7.00.210324p (Harpia)**, compilation keys should be replaced by _Token RPO_.")
    }
  }

  protected async validateAuthorization(autFile: string, model: TCompileKeyModel):
    Promise<TFieldErrors<TCompileKeyModel>> {
    const authorization: TAuthorization = ServersConfig.readCompileKeyFile(
      autFile
    );
    let errors: TFieldErrors<TCompileKeyModel> = {};

    if (authorization) {
      model.path = autFile;
      model.id = authorization.id.toUpperCase();
      model.generation = authorization.generation;
      model.validation = authorization.validation;
      model.key = authorization.key;
      model.canOverride = authorization.permission === "1";

      model.expire = authorization.validation;
      model.tokenKey = model.key;

      await this.validateModel(model, errors);
    } else {
      errors.path = {
        type: "validate",
        message: vscode.l10n.t("Invalid compile key file")
      };
    }

    return errors;
  }

}