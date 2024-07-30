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
import * as path from "path";
import * as fse from "fs-extra";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { ServersConfig, pathErrorCodeToString } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "@tds-shared/index";
import { IPatchApplyResult, PathErrorCodes, sendApplyPatchRequest, sendValidatePatchRequest } from "../protocolMessages";
import { TApplyPatchModel, TPatchFileData } from "@tds-shared/index";
import { ServerItem } from "../serverItem";
import { TFieldErrors, isErrors } from "@tds-shared/index";
import { TdsPanel } from "./panel";
import { ApplyPatchCommand, ApplyPatchCommandEnum, EMPTY_APPLY_PATCH_MODEL } from "@tds-shared/index";

export enum OperationApplyPatchEnum {
  APPLY = "apply",
  VALIDATE = "validate"
}

interface IApplyPatchOptions {
  operation: OperationApplyPatchEnum;
}

export class ApplyPatchPanel extends TdsPanel<TApplyPatchModel, IApplyPatchOptions> {
  public static currentPanel: ApplyPatchPanel | undefined;
  files: TPatchFileData[];

  public static async render(context: vscode.ExtensionContext, files: vscode.Uri[], operation: OperationApplyPatchEnum): Promise<ApplyPatchPanel> {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (ApplyPatchPanel.currentPanel) {
      // If the webview panel already exists reveal it
      ApplyPatchPanel.currentPanel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "patch-generate-panel",
        // Panel title
        operation == OperationApplyPatchEnum.APPLY ? vscode.l10n.t("Apply Patch") : vscode.l10n.t("Validate Patch"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );


      ApplyPatchPanel.currentPanel = new ApplyPatchPanel(panel, extensionUri, files, { operation: operation });
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
  protected constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, files: vscode.Uri[], options: IApplyPatchOptions) {
    super(panel, extensionUri, options);

    const foundFile: vscode.Uri[] = getRecursiveFiles(files);

    this.files = foundFile.map((file: vscode.Uri) => {
      const data: TPatchFileData = {
        name: path.basename(file.path),
        validation: "",
        tphInfo: {},
        isProcessing: false,
        uri: file.path.startsWith("/") ? file.path.substring(1) : file.path
      }

      return data;
    }) || [];

  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ApplyPatchPanel.currentPanel = undefined;
    this.files = [];
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

    return getWebviewContent(this._panel.webview, extensionUri, "ApplyPatchView",
      { title: this._panel.title, translations: this.getTranslations() });
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

              data.model = EMPTY_APPLY_PATCH_MODEL();
              data.model.serverName = server.name;
              data.model.address = `${server.address}:${server.port}`;
              data.model.environment = server.environment;
              data.model.patchFiles = this.files.sort((a: TPatchFileData, b: TPatchFileData) => a.uri.localeCompare(b.uri));

              this.sendUpdateModel(data.model, undefined);

              progress.report({ increment: 100 });

              if (this._options.operation == OperationApplyPatchEnum.VALIDATE) {
                const errors: TFieldErrors<TPatchFileData> = {};

                data.model.patchFiles = data.model.patchFiles.map((patchFile: TPatchFileData) => {
                  patchFile.isProcessing = true;
                  return patchFile;
                });
                this.sendUpdateModel(data.model, errors);

                this.validateModel(data.model, errors);
                this.sendUpdateModel(data.model, errors);
              }
            }
          );
        }

        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:
        if (result && result.length > 0) {
          const patchFiles: TPatchFileData[] = data.model.patchFiles
            .filter((patchFile: TPatchFileData) => patchFile.uri);
          const errors: TFieldErrors<TPatchFileData> = {};

          for await (const file of result) {
            const alreadyExist: boolean = patchFiles.findIndex((patchFile: TPatchFileData) => patchFile.uri == file.path) > -1;
            const pathData: TPatchFileData = {
              uri: file.path,
              name: path.basename(file.path),
              validation: "",
              tphInfo: {},
              isProcessing: true,
            }
            pathData.uri = pathData.uri.startsWith("/") ? pathData.uri.substring(1) : pathData.uri;
            const index: number = patchFiles.push(pathData) - 1;

            if (alreadyExist) {
              errors[`patchFiles.${[index]}.name`] = { type: "validade", message: "Patch already informed" };
            }
          }

          data.model.patchFiles = patchFiles;
          this.sendUpdateModel(data.model, errors);

          let i: number = 0
          for await (const file of data.model.patchFiles) {
            if (data.model.patchFiles[i].isProcessing) {
              const server = ServersConfig.getCurrentServer();

              await this.doValidatePatch(server, data.model.patchFiles[i], i, errors);

              data.model.patchFiles[i].isProcessing = false;
            }

            i++;
          }

          this.sendUpdateModel(data.model, errors);
        }

        break;

      case ApplyPatchCommandEnum.GET_INFO_PATCH:
        {
          const selectedPatch: number = data.index;

          vscode.commands.executeCommand(
            "totvs-developer-studio.patchInfos",
            {
              fsPath: data.model.patchFiles[selectedPatch].uri,
            });

          break;
        }
      case ApplyPatchCommandEnum.PATCH_VALIDATE:
        {
          const errors: TFieldErrors<TPatchFileData> = {};

          this.validateModel(data.model, errors);
          this.sendUpdateModel(data.model, errors);

          break;
        }
    }
  }

  protected async validateModel(model: TApplyPatchModel, errors: TFieldErrors<TApplyPatchModel>): Promise<boolean> {
    if (model.patchFiles.length == 0) {
      errors.patchFiles = { type: "validate", message: "Ao menos um pacote deve ser informado" }
    } else {
      vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: vscode.l10n.t(`Validating patch`),
        },
        async (progress, token) => {
          const server: ServerItem = ServersConfig.getCurrentServer();
          const step: number = 100 / (model.patchFiles.length + 1);
          let index: number = 0;

          progress.report({ increment: step / 2 });

          for await (const element of model.patchFiles) {
            progress.report({
              increment: step,
              message: `(${index + 1}/${model.patchFiles.length}) ${element.name}`,
            });

            await this.doValidatePatch(server, element, index, errors);

            if (this._options.operation == OperationApplyPatchEnum.VALIDATE) {
              element.isProcessing = false;
              this.sendUpdateModel(model, errors);
            }

            if (token.isCancellationRequested) {
              break;
            }

            index++;
          }
        }
      );
    }

    return !isErrors(errors);
  }

  protected async saveModel(model: TApplyPatchModel): Promise<boolean> {
    let errors: TFieldErrors<TApplyPatchModel>;

    vscode.window.withProgress(
      {
        cancellable: false,
        location: vscode.ProgressLocation.Notification,
        title: vscode.l10n.t(`Applying patch`),
      },
      async (progress, token) => {
        const server: ServerItem = ServersConfig.getCurrentServer();
        const step: number = 100 / (model.patchFiles.length + 1);
        let index: number = 0;

        progress.report({ increment: step / 2 });

        for await (const element of model.patchFiles) {
          progress.report({
            increment: step,
            message: `(${index + 1}/${model.patchFiles.length}) ${element.name}`,
          });

          model.patchFiles[index].isProcessing = true;
          this.sendUpdateModel(model, errors);

          this.doApplyPatch(server, element, index, errors);

          model.patchFiles[index].isProcessing = false;
          this.sendUpdateModel(model, errors);

          if (token.isCancellationRequested) {
            break;
          }
          index++;
        }
      }
    );

    this.sendUpdateModel(model, errors);

    return !isErrors(errors);
  }

  async doValidatePatch(server: ServerItem, patchFile: TPatchFileData, index: number, errors: TFieldErrors<TApplyPatchModel>) {

    if (!fse.existsSync(patchFile.uri)) {
      errors[`patchFiles.${index}.name`] = { type: "validate", message: "File nor found" };
      return;
    }

    const response: IPatchApplyResult = await sendValidatePatchRequest(server, vscode.Uri.parse("file:///" + patchFile.uri));

    if (response.errorCode == PathErrorCodes.Ok) {
      vscode.window.showInformationMessage(vscode.l10n.t("Patch validated."));
      patchFile.validation = "OK";
      patchFile.tphInfo = {};
    } else {
      if (response.errorCode !== PathErrorCodes.Ok) {
        const msg: string = pathErrorCodeToString(response.errorCode, response.message);

        errors[`patchFiles.${index}.name`] = { type: "validate", message: response.message };
      }

      if (response.errorCode !== PathErrorCodes.OldResources
        && response.errorCode !== PathErrorCodes.ApplyDenied
        && response.errorCode !== PathErrorCodes.NewerPatches) {
        // ignore errorCode for apply_old, apply_denied and newer_patches
        vscode.window.showErrorMessage(response.message);
      }

      if (response.errorCode == PathErrorCodes.NewerPatches) { // Erro de TPH apenas ocorre se existem patches mais recentes que o validado
        // exibir mensagens e links para patches mais recentes
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

  async doApplyPatch(server: ServerItem, patchFile: TPatchFileData, index: number, errors: TFieldErrors<TApplyPatchModel>) {

    if (!fse.existsSync(vscode.Uri.parse(patchFile.uri).fsPath)) {
      errors[`patchFiles.${index}.name`] = { type: "validate", message: "File nor found" };
      return;
    }

    const response: IPatchApplyResult = await sendApplyPatchRequest(server, vscode.Uri.parse(patchFile.uri), false, "only_new");

    if (response.errorCode == PathErrorCodes.Ok) {
      vscode.window.showInformationMessage(vscode.l10n.t("Patch applied."));
      patchFile.validation = "Applied";
      patchFile.tphInfo = {};
    } else {
      const msg: string = pathErrorCodeToString(response.errorCode, response.message);

      errors[`patchFiles.${index}.name`] = { type: "validate", message: response.message };

      vscode.window.showErrorMessage(response.message);
    }
  }

  protected getTranslations(): Record<string, string> {
    return {
      "Apply Patch": this._options.operation == OperationApplyPatchEnum.VALIDATE
        ? vscode.l10n.t("Validate Patch")
        : vscode.l10n.t("Apply Patch"),
      "Server name": vscode.l10n.t("Server name"),
      "Target Server Identifier": vscode.l10n.t("Target Server Identifier"),
      "Address": vscode.l10n.t("Address"),
      "Target server address": vscode.l10n.t("Target server address"),
      "Environment": vscode.l10n.t("Environment"),
      "Target environment": vscode.l10n.t("Target environment"),
      "Patch Files": vscode.l10n.t("Patch Files"),
      "Select the update package(s)": vscode.l10n.t("Select the update package(s)"),
      "Apply old files": vscode.l10n.t("Apply old files"),
    }

  }
}

function getRecursiveFiles(targetList: vscode.Uri[]): vscode.Uri[] {
  const glob = require('glob');
  const foundFiles: vscode.Uri[] = [];

  targetList.forEach((target: vscode.Uri) => {
    ["ptm", "upd", "zip"].forEach((ext: string) => {
      const files: string[] = glob.sync(`**/*.${ext}`, {
        cwd: target.fsPath,
        absolute: true,
        ignore: ['**/node_modules/**']
      });

      files.forEach((file: string) => {
        foundFiles.push(vscode.Uri.parse(`file:///${file}`));
      });
    });
  });

  return foundFiles;
}
