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
import { ServersConfig, pathErrorCodeToString, serverExceptionCodeToString } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IPatchApplyResult, IPatchResult, PathErrorCodes, sendValidatePatchRequest } from "../protocolMessages";
import { TFieldErrors, TdsPanel, isErrors } from "../model/field-model";
import { TApplyPatchModel, TPatchFileData } from "../model/applyPatchModel";
import { ServerItem } from "../serverItem";
import * as path from "path";
import * as fse from "fs-extra";

enum ApplyPatchCommandEnum {
  PATCH_VALIDATE = "PATCH_VALIDATE"
}

type ApplyPatchCommand = CommonCommandFromWebViewEnum & ApplyPatchCommandEnum;

const EMPTY_MODEL: TApplyPatchModel = {
  serverName: "",
  address: "",
  environment: "",
  patchFiles: [],
  applyOldFiles: false
}

export class ApplyPatchPanel extends TdsPanel<TApplyPatchModel> {
  public static currentPanel: ApplyPatchPanel | undefined;
  files: TPatchFileData[];

  public static render(context: vscode.ExtensionContext, files?: any[]): ApplyPatchPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (ApplyPatchPanel.currentPanel) {
      // If the webview panel already exists reveal it
      ApplyPatchPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "patch-generate-panel",
        // Panel title
        vscode.l10n.t("Apply Patch"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      ApplyPatchPanel.currentPanel = new ApplyPatchPanel(panel, extensionUri, files);
    }

    return ApplyPatchPanel.currentPanel;
  }

  /**
   * The TApplyPathPanel class protected constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   * @param files The pre selected files
   */
  protected constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, files: any[]) {
    super(panel, extensionUri);

    this.files = files || [];
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ApplyPatchPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "ApplyPatchView", { title: this._panel.title });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<ApplyPatchCommand, TApplyPatchModel>, result: any): Promise<any> {
    const command: ApplyPatchCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Window,
              title: vscode.l10n.t("Loading RPO content..."),
            },
            async (progress, token) => {
              progress.report({ increment: 0 });
              const server = ServersConfig.getCurrentServer();

              data.model = EMPTY_MODEL;
              data.model.serverName = server.name;
              data.model.address = server.address;
              data.model.environment = server.environment;
              data.model.patchFiles = this.files;

              this.sendUpdateModel(data.model, undefined);

              progress.report({ increment: 100 });
            }
          );
        }

        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const patchFiles: TPatchFileData[] = data.model.patchFiles
            .filter((patchFile: TPatchFileData) => patchFile.uri);
          const errors: TFieldErrors<TPatchFileData> = {};

          const processSelectedFile = async (selectedFile: vscode.Uri) => {
            const alreadyExist: boolean = patchFiles.findIndex((patchFile: TPatchFileData) => patchFile.uri.path == selectedFile.path) > -1;
            const index: number = patchFiles.push(
              {
                uri: selectedFile,
                name: path.basename(selectedFile.path),
                validation: "",
                tphInfo: {}
              }
            ) - 1;

            if (alreadyExist) {
              errors[`patchFiles.${[index]}.name`] = { type: "validade", message: "Patch already informed" };
            } else {
              let server = ServersConfig.getCurrentServer();
              await this.doValidatePatch(server, patchFiles[index], index, errors);
            }
          };

          for await (const file of result) {
            await processSelectedFile(file);
          }

          data.model.patchFiles = patchFiles;

          this.sendUpdateModel(data.model, errors);
        }

        break;

      case ApplyPatchCommandEnum.PATCH_VALIDATE:
        const errors: TFieldErrors<TPatchFileData> = {};
        const patchFiles: TPatchFileData[] = data.model.patchFiles
          .filter((patchFile: TPatchFileData) => patchFile.uri);

        this.validateModel(data.model, errors);
        this.sendUpdateModel(data.model, errors);

        break;

    }
  }

  protected async validateModel(model: TApplyPatchModel, errors: TFieldErrors<TApplyPatchModel>): Promise<boolean> {
    try {
      if (model.patchFiles.length == 0) {
        errors.root = { type: "validate", message: "Ao menos um pacote deve ser informado" }
      }
    } catch (error) {
      errors.root = { type: "validate", message: `Internal error: ${error}` }
    }

    vscode.window.withProgress(
      {
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
        title: vscode.l10n.t(`Validating patch`),
      },
      async (progress, token) => {
        const server: ServerItem = ServersConfig.getCurrentServer();
        let step: number = 100 / (model.patchFiles.length + 1);
        let index: number = 0;

        progress.report({ increment: step / 2 });

        for await (const element of model.patchFiles) {
          index++;
          progress.report({
            increment: step,
            message: `(${index}/${model.patchFiles.length}) ${element.name}`,
          });

          this.doValidatePatch(server, element, index, errors);

          if (!isErrors(errors) || token.isCancellationRequested) {
            break;
          }
        }
      }
    );

    return !isErrors(errors);
  }

  protected async saveModel(model: TApplyPatchModel): Promise<boolean> {
    let server = ServersConfig.getCurrentServer();

    const response: IPatchResult | void = undefined; //await sendApplyPatchMessage(
    //   server,
    //   "",
    //   model.patchDest,
    //   3,
    //   model.patchName,
    //   model.objectsRight.map((object: TInspectorObject) => object.name),
    // ).then(() => {
    //   vscode.window.showInformationMessage(vscode.l10n.t("Patch file generated"));
    // }, (err: ResponseError<object>) => {
    //   serverExceptionCodeToString(err.code);

    //   const response: IPatchResult = {
    //     returnCode: err.code,
    //     files: "",
    //     message: err.message
    //   };

    //   return response;
    // });

    let errors: TFieldErrors<TApplyPatchModel> = {};
    let ok: boolean = true;

    if (!response) {
      errors.root = { type: "validate", message: "Internal error: See more information in log" };
      ok = false
    } else if (response.returnCode !== 0) {
      const msgError = ` ${serverExceptionCodeToString(response.returnCode)} ${response.message}`;
      this.logError(msgError)
      vscode.window.showErrorMessage(msgError);
      errors.root = { type: "validate", message: `Protheus Server was unable to generate the patch. Code: ${response.returnCode}` };;
      ok = false
    }

    if (!ok) {
      this.sendUpdateModel(model, errors);
    }

    return ok;
  }

  async doValidatePatch(server: ServerItem, patchFile: TPatchFileData, index: number, errors: TFieldErrors<TApplyPatchModel>) {

    if (!fse.existsSync(patchFile.uri.fsPath)) {
      errors[`patchFiles.${index}.name`] = { type: "validate", message: "File nor found" };
      return;
    }

    const response: IPatchApplyResult = await sendValidatePatchRequest(server, patchFile.uri);

    if (response.errorCode == PathErrorCodes.Ok) {
      vscode.window.showInformationMessage(vscode.l10n.t("Patch validated."));
      patchFile.validation = "OK";
      patchFile.tphInfo = {};
    } else {
      //languageClient.error(`File: ${response.file}`, false);

      if (response.errorCode !== PathErrorCodes.Ok) {
        const msg: string = pathErrorCodeToString(response.errorCode, response.message);

        errors[`patchFiles.${index}.name`] = { type: "validate", message: response.message };
        errors.root = { type: "validate", message: msg };
      }

      if (response.errorCode !== PathErrorCodes.OldResources
        && response.errorCode !== PathErrorCodes.ApplyDenied
        && response.errorCode !== PathErrorCodes.NewerPatches) {
        // ignore errorCode for apply_old, apply_denied and newer_patches
        vscode.window.showErrorMessage(response.message);
      }

      if (response.errorCode == PathErrorCodes.NewerPatches) { // Erro de TPH apenas ocorre se existem patches mais recentes que o validado
        // exibir mensagens e links para patches mais recentes
        response.tphInfoRet
        const tphInfo: any = JSON.parse(response.message);
        const recommendedPatches = tphInfo.recommended;
        if (recommendedPatches) {
          // exp
          patchFile.tphInfo.exp = recommendedPatches.exp;
          // ptm
          patchFile.tphInfo.ptm = recommendedPatches.ptm;
        }

        vscode.window.showWarningMessage(response.message);
      }
    }
  }
}