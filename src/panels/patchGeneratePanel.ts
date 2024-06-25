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
import * as fse from "fs-extra";
import * as path from "path";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import Utils, { MESSAGE_TYPE, ServersConfig, serverExceptionCodeToString } from "../utils";
import { IObjectData, IPatchResult, sendInspectorObjectsRequest, sendPatchGenerateMessage } from "../protocolMessages";
import { ResponseError } from "vscode-languageclient";
import { CommonCommandFromWebViewEnum, EMPTY_GENERATE_PATCH_FROM_RPO_MODEL, PatchGenerateCommand, PatchGenerateCommandEnum, ReceiveMessage, TFieldErrors, TGeneratePatchFromRpoModel, TInspectorObject, isErrors } from "tds-shared/lib";
import { TdsPanel } from "./panel";
import { basename } from 'path';

interface IGeneratePatchOptions {
  fromRpo: boolean;
  folder: vscode.Uri
}
const panels: {
  rpo?: PatchGenerateFromRpoPanel;
  folder?: PatchGenerateFromRpoPanel;
} = {};

/**
 * Represents a panel for generating patches from RPO or folder models.
 *
 * The `PatchGenerateFromRpoPanel` class is responsible for rendering and managing the webview panel
 * that allows users to generate patches from RPO models. It provides methods for handling user
 * interactions, fetching data from the server, and saving the generated patch.
 *
 * This panel is a part of the TOTVS S.A. extension for Visual Studio Code.
 */
export class PatchGenerateFromRpoPanel extends TdsPanel<TGeneratePatchFromRpoModel, IGeneratePatchOptions> {
  public static currentPanel: PatchGenerateFromRpoPanel | undefined;

  public static render(context: vscode.ExtensionContext, folder: vscode.Uri): PatchGenerateFromRpoPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (folder) {
      if (panels.folder) {
        panels.folder._panel.reveal(); //vscode.ViewColumn.One
        return panels.folder;
      }
    } else {
      if (panels.rpo) {
        panels.rpo._panel.reveal(); //vscode.ViewColumn.One
        return panels.rpo;
      }
    }

    // If a webview panel does not already exist create and show a new one
    const panel = vscode.window.createWebviewPanel(
      // Panel view type
      "patch-generate-panel",
      // Panel title
      folder == undefined ? vscode.l10n.t("Patch Generation (RPO)") : vscode.l10n.t("Patch Generation (FOLDER)"),
      // The editor column the panel should be displayed in
      vscode.ViewColumn.One,
      // Extra panel configurations
      {
        ...getExtraPanelConfigurations(extensionUri)
      }
    );

    if (folder == undefined) {
      panels.rpo = new PatchGenerateFromRpoPanel(panel, extensionUri, { fromRpo: true, folder: folder });
      panels.rpo._panel.onDidDispose(() => {
        panels.rpo = undefined;
      }, null, context.subscriptions);
    } else {
      panels.folder = new PatchGenerateFromRpoPanel(panel, extensionUri, { fromRpo: false, folder: folder });
      panels.folder._panel.onDidDispose(() => {
        panels.folder = undefined;
      }, null, context.subscriptions);
    }

    return folder == undefined ? panels.rpo : panels.folder;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    PatchGenerateFromRpoPanel.currentPanel = undefined;

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
    const server = ServersConfig.getCurrentServer();

    return getWebviewContent(this._panel.webview, extensionUri, "patchGenerateView",
      {
        title: this._panel.title,
        translations: this.getTranslations(),
        data: {
          isServerP20OrGreater: Utils.isServerP20OrGreater(server).toString(),
          fromRpo: this._options.fromRpo ? "true" : "false"
        },
      });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<PatchGenerateCommand, TGeneratePatchFromRpoModel>, result: any): Promise<any> {
    const command: PatchGenerateCommand = message.command;
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

              if (this._options.fromRpo) {
                data.model = await this.getDataFromServer(EMPTY_GENERATE_PATCH_FROM_RPO_MODEL, false);
              } else {
                data.model = await this.getDataFromFolder(
                  { ...EMPTY_GENERATE_PATCH_FROM_RPO_MODEL, folder: this._options.folder.fsPath }, false);
              }

              this.sendUpdateModel(data.model, undefined);

              progress.report({ increment: 100 });
            }
          );
        }

        break;
      case PatchGenerateCommandEnum.IncludeTRes:
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: vscode.l10n.t("Loading RPO content..."),
          },
          async (progress, token) => {
            progress.report({ increment: 0 });

            data.model = await this.getDataFromServer(data.model, data.includeTRes);

            this.sendUpdateModel(data.model, undefined);

            progress.report({ increment: 100 });
          }
        );

        break;
      case PatchGenerateCommandEnum.MoveElements:
        const selectedObject: TInspectorObject[] = data.selectedObject;
        const direction: string = data.direction;

        if (direction == "right") {
          data.model.objectsLeft = data.model.objectsLeft.filter((x: TInspectorObject) => selectedObject.findIndex(y => x.source == y.source) == -1);
          data.model.objectsRight.push(...selectedObject);
        } else {
          data.model.objectsRight = data.model.objectsRight.filter((x: TInspectorObject) => selectedObject.findIndex(y => x.source == y.source) == -1);
          data.model.objectsLeft.push(...selectedObject.map((element: TInspectorObject) => { return { ...element, checked: false } }));
        }

        this.sendUpdateModel(data.model, undefined);

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

  private async getDataFromServer(model: TGeneratePatchFromRpoModel, includeTRes: boolean): Promise<TGeneratePatchFromRpoModel> {
    const server = ServersConfig.getCurrentServer();
    const objectsData: IObjectData[] = await sendInspectorObjectsRequest(server, includeTRes);

    model.objectsLeft = [];
    if (objectsData) {
      objectsData.forEach((object: IObjectData) => {
        model.objectsLeft.push({
          source: object.source,
          date: object.date,
          source_status: object.source_status.toString(),
          rpo_status: object.rpo_status.toString(),
          function: "",
          line: 0
        });
      });
    }

    model.objectsLeft = model.objectsLeft.sort((a: TInspectorObject, b: TInspectorObject) => a.source.localeCompare(b.source));
    model.objectsRight = model.objectsRight.sort((a: TInspectorObject, b: TInspectorObject) => a.source.localeCompare(b.source));
    model.includeTRes = includeTRes;

    return model;
  }

  private async getDataFromFolder(model: TGeneratePatchFromRpoModel, includeTRes: boolean): Promise<TGeneratePatchFromRpoModel> {
    var glob = require('glob');

    const files: string[] = glob.sync(`*.*`, {
      cwd: model.folder,
      absolute: true,
      ignore: ['**/node_modules/**']
    });

    model.objectsLeft = [];
    if (files) {
      files.forEach((resource: string) => {
        const lstat: fse.Stats = fse.lstatSync(resource);

        if (lstat.isFile()) {
          model.objectsLeft.push({
            source: path.basename(resource),
            date: new Date(lstat.mtime),
            source_status: "",
            rpo_status: "",
            function: "",
            line: 0
          });
        }
      });
    }

    model.objectsLeft = model.objectsLeft.sort((a: TInspectorObject, b: TInspectorObject) => a.source.localeCompare(b.source));
    model.objectsRight = model.objectsRight.sort((a: TInspectorObject, b: TInspectorObject) => a.source.localeCompare(b.source));
    model.includeTRes = includeTRes;

    return model;
  }

  protected async validateModel(model: TGeneratePatchFromRpoModel, errors: TFieldErrors<TGeneratePatchFromRpoModel>): Promise<boolean> {
    if (model.patchDest.length == 0) {
      errors.patchDest = { type: "required" };
    }

    if (model.objectsRight.length == 0) {
      errors.objectsRight = { type: "required", message: "Please select objects to include in the patch." };
    }

    return !isErrors(errors);
  }

  protected async saveModel(model: TGeneratePatchFromRpoModel): Promise<boolean> {
    let server = ServersConfig.getCurrentServer();

    const response: IPatchResult | void = await sendPatchGenerateMessage(
      server,
      "",
      model.patchDest,
      3,
      model.patchName,
      model.objectsRight.map((object: TInspectorObject) => object.source),
    ).then(() => {
      vscode.window.showInformationMessage(vscode.l10n.t("Patch file generated"));
    }, (err: ResponseError<object>) => {
      serverExceptionCodeToString(err.code);

      const response: IPatchResult = {
        returnCode: err.code,
        files: "",
        message: err.message
      };

      return response;
    });

    let errors: TFieldErrors<TGeneratePatchFromRpoModel> = {};
    let ok: boolean = true;

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

  getTranslations(): Record<string, string> {
    return {
      "Patch Generation from RPO": vscode.l10n.t("Patch Generation from RPO"),
      "Patch Generation from Folder": vscode.l10n.t("Patch Generation from Folder"),
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