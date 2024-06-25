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

//TODO: Revisar processo. Aguardando documentação sobre regras de aplicação/geração de pacotes

import * as vscode from "vscode";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { CommonCommandFromWebViewEnum, PatchGenerateCommand, ReceiveMessage, TFieldErrors, TGeneratePatchByDifferenceModel, isErrors } from "tds-shared/lib";
import { TdsPanel } from "./panel";
import { ServerFileSystemProvider } from "../serverFileSystemProvider";
import Utils, { MESSAGE_TYPE, ServersConfig, serverExceptionCodeToString } from "../utils";
import { IPatchResult, sendPatchGenerateMessage } from "../protocolMessages";
import { ResponseError } from "vscode-languageclient";
import { logger } from "@vscode/debugadapter";

const EMPTY_MODEL: TGeneratePatchByDifferenceModel = {
  patchName: "",
  patchDest: "",
  rpoMasterFolder: "\\protheus_data\\patchs_dif"
}

export class PatchGenerateByDifferencePanel extends TdsPanel<TGeneratePatchByDifferenceModel> {
  public static currentPanel: PatchGenerateByDifferencePanel | undefined;
  public static _serverFs: ServerFileSystemProvider;

  public static async render(context: vscode.ExtensionContext): Promise<PatchGenerateByDifferencePanel> {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (PatchGenerateByDifferencePanel.currentPanel) {
      // If the webview panel already exists reveal it
      PatchGenerateByDifferencePanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "patch-generate-panel",
        // Panel title
        vscode.l10n.t("Generate Patch by difference RPO"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      if (PatchGenerateByDifferencePanel._serverFs == undefined) {
        PatchGenerateByDifferencePanel._serverFs = new ServerFileSystemProvider();
        PatchGenerateByDifferencePanel._serverFs.root = await PatchGenerateByDifferencePanel._serverFs.loadServerFS(
          true, /^.*\.rpo$/i, "", false);


        context.subscriptions.push(
          vscode.workspace.registerFileSystemProvider(ServerFileSystemProvider.scheme, PatchGenerateByDifferencePanel._serverFs, { isCaseSensitive: false, isReadonly: true })
        );
      }

      PatchGenerateByDifferencePanel.currentPanel = new PatchGenerateByDifferencePanel(panel, extensionUri);
    }

    return PatchGenerateByDifferencePanel.currentPanel;
  }

  private _serverFs: ServerFileSystemProvider;

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    PatchGenerateByDifferencePanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "patchGenerateByDifferenceView",
      {
        title: this._panel.title,
        translations: this.getTranslations(),
        data: {
          //isServerP20OrGreater: Utils.isServerP20OrGreater(server).toString()
        },
      });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<PatchGenerateCommand, TGeneratePatchByDifferenceModel>, result: any): Promise<any> {
    const command: PatchGenerateCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          data.model = EMPTY_MODEL;

          this.sendUpdateModel(data.model, undefined);
        }

        break;
      case CommonCommandFromWebViewEnum.AfterSelectResource:


        if (result && result.length > 0) {
          const selectedFile: string = (result[0] as vscode.Uri).fsPath;

          data.model.patchDest = selectedFile;
          this.sendUpdateModel(data.model, undefined);
        }

        break;
    }
  }

  protected async validateModel(model: TGeneratePatchByDifferenceModel, errors: TFieldErrors<TGeneratePatchByDifferenceModel>): Promise<boolean> {
    if (model.patchDest.length == 0) {
      errors.patchDest = { type: "required" };
    }

    if (model.rpoMasterFolder.length == 0) {
      errors.rpoMasterFolder = { type: "required" };
    }

    // if (model.rpoMasterFile.length == 0) {
    //   errors.rpoMasterFolder = { type: "required" };
    // }

    return !isErrors(errors);
  }

  protected async saveModel(model: TGeneratePatchByDifferenceModel): Promise<boolean> {
    let ok: boolean = false;

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: vscode.l10n.t('Generating Patch'),
        cancellable: true,
      },
      async (progress, token) => {
        let server = ServersConfig.getCurrentServer();

        token.onCancellationRequested(() => {
          vscode.window.showInformationMessage('User canceled the operation');
        });
        progress.report({ increment: 0, message: 'Inicializando...' });

        const response: IPatchResult | void = await sendPatchGenerateMessage(server, model.rpoMasterFolder,
          model.patchDest, 3, model.patchName, []).then((result) => {
            progress.report({ increment: 100, message: 'Finalizado' });
            this._panel.dispose();
          }).then((response) => {
            vscode.window.showInformationMessage(vscode.l10n.t("Patch file generated"));

            return response;
          }, (err: ResponseError<object>) => {
            serverExceptionCodeToString(err.code);

            const response: IPatchResult = {
              returnCode: err.code,
              files: "",
              message: err.message
            };

            ok = true;
            return response;
          });

        let errors: TFieldErrors<TGeneratePatchByDifferenceModel> = {};

        if (!response) {
          errors.patchName = { type: "validate", message: "Internal error: See more information in log" };
          ok = false
        } else if (response.returnCode !== 0) {
          const msgError = ` ${serverExceptionCodeToString(response.returnCode)} ${response.message}`;
          Utils.logMessage(msgError, MESSAGE_TYPE.Error, false);
          vscode.window.showErrorMessage(msgError);
          errors.patchName = {
            type: "validate",
            message: vscode.l10n.t("Protheus Server was unable to generate the patch. Code: {0}", response.returnCode)
          };;
          ok = false
        }

        if (!ok) {
          this.sendUpdateModel(model, errors);
        }

        return ok;
      }
    );

    return ok;
  }

  getTranslations(): Record<string, string> {
    return {
      "Patch Generation from RPO": vscode.l10n.t("Patch Generation from RPO"),
      "Output Folder": vscode.l10n.t("Output Folder"),
      "Enter the destination folder of the generated update package": vscode.l10n.t("Enter the destination folder of the generated update package"),
      "Select the destination folder of the generated update package": vscode.l10n.t("Select the destination folder of the generated update package"),
      "Select Output Directory": vscode.l10n.t("Select Output Directory"),
      "Output Patch Filename": vscode.l10n.t("Output Patch Filename"),
      "Enter update package name.": vscode.l10n.t("Enter update package name."),
      "Filter": vscode.l10n.t("Filter"),
      "Filter by Object Name. Ex: Mat or Fat*": vscode.l10n.t("Filter by Object Name. Ex: Mat or Fat*"),
      "Include *.TRES": vscode.l10n.t("Include *.TRES"),
      "Resource count limit": vscode.l10n.t("Resource count limit"),
      "100 (fast render)": vscode.l10n.t("100 (fast render)"),
      "500 (slow render)": vscode.l10n.t("500 (slow render)"),
      "RPO Objects": vscode.l10n.t("RPO Objects"),
      "To patch": vscode.l10n.t("To patch"),
    }
  }
}