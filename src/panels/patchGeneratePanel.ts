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
import { ServersConfig, serverExceptionCodeToString } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IObjectData, IPatchResult, sendInspectorObjectsRequest, sendPatchGenerateMessage } from "../protocolMessages";
import { TFieldErrors, TdsPanel, isErrors } from "../model/field-model";
import { TGeneratePatchModel } from "../model/generatePatchModel";
import { TInspectorObject } from "../patch/patchUtil";
import { ResponseError } from "vscode-languageclient";

enum PatchGenerateCommandEnum {
  IncludeTRes = "INCLUDE_TRES",
  MoveElements = "MOVE_ELEMENTS",
}

type PatchGenerateCommand = CommonCommandFromWebViewEnum & PatchGenerateCommandEnum;

const EMPTY_MODEL: TGeneratePatchModel = {
  patchName: "",
  patchDest: "",
  includeTRes: false,
  filter: "",
  warningManyItens: false,
  objectsLeft: [],
  objectsRight: [],
  objectsFiltered: []
}

export class PatchGeneratePanel extends TdsPanel<TGeneratePatchModel> {
  public static currentPanel: PatchGeneratePanel | undefined;

  public static render(context: vscode.ExtensionContext): PatchGeneratePanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (PatchGeneratePanel.currentPanel) {
      // If the webview panel already exists reveal it
      PatchGeneratePanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "patch-generate-panel",
        // Panel title
        vscode.l10n.t("Patch Generation from RPO"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      PatchGeneratePanel.currentPanel = new PatchGeneratePanel(panel, extensionUri);
    }

    return PatchGeneratePanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    PatchGeneratePanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "patchGenerateView", { title: this._panel.title });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<PatchGenerateCommand, TGeneratePatchModel>, result: any): Promise<any> {
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

              data.model = await this.getDataFromServer(EMPTY_MODEL, false);

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
          data.model.objectsLeft = data.model.objectsLeft.filter((x: TInspectorObject) => selectedObject.findIndex(y => x.name == y.name) == -1);
          data.model.objectsRight.push(...selectedObject);
        } else {
          data.model.objectsRight = data.model.objectsRight.filter((x: TInspectorObject) => selectedObject.findIndex(y => x.name == y.name) == -1);
          data.model.objectsLeft.push(...selectedObject);
        }

        data.model.objectsRight = data.model.objectsRight.sort((a: TInspectorObject, b: TInspectorObject) => a.name.localeCompare(b.name));
        data.model.objectsLeft = data.model.objectsLeft.sort((a: TInspectorObject, b: TInspectorObject) => a.name.localeCompare(b.name));

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

  private async getDataFromServer(model: TGeneratePatchModel, includeTRes: boolean): Promise<TGeneratePatchModel> {
    const server = ServersConfig.getCurrentServer();
    const objectsData: IObjectData[] = await sendInspectorObjectsRequest(server, includeTRes);

    model.objectsLeft = [];
    if (objectsData) {
      objectsData.forEach((object: IObjectData) => {
        model.objectsLeft.push({
          name: object.source,
          type: object.source_status.toString(),
          date: object.date
        });
      });

    }

    model.objectsLeft = model.objectsLeft.sort((a: TInspectorObject, b: TInspectorObject) => a.name.localeCompare(b.name));
    model.objectsRight = model.objectsRight.sort((a: TInspectorObject, b: TInspectorObject) => a.name.localeCompare(b.name));
    model.includeTRes = includeTRes;

    return model;

  }

  protected async validateModel(model: TGeneratePatchModel, errors: TFieldErrors<TGeneratePatchModel>): Promise<boolean> {
    try {
      if (model.patchDest.length == 0) {
        errors.patchDest = { type: "required" };
      }

      if (model.objectsRight.length == 0) {
        errors.objectsRight = { type: "required", message: "Please select objects to include in the patch." };
      }
    } catch (error) {
      errors.root = { type: "validate", message: `Internal error: ${error}` }
    }

    return !isErrors(errors);
  }

  protected async saveModel(model: TGeneratePatchModel): Promise<boolean> {
    let server = ServersConfig.getCurrentServer();

    // const filesPath = message.pathFiles;
    // const patchName = message.patchName;
    // const patchDestUri = vscode.Uri.file(
    //   message.patchDest
    // ).toString();

    // if (patchDestUri === "" || filesPath.length === 0) {
    //   vscode.window.showErrorMessage(
    //     vscode.l10n.t("Patch Generation failed. Please check destination directory and sources/resources list.")
    //   );
    // } else {
    // save last patchGenerateDir
    //  ServersConfig.updatePatchGenerateDir(server.id, model.patchDest);
    //vscode.window.showInformationMessage(localize("tds.webview.patch.generate.start","Start Generate Patch"));
    const response: IPatchResult | void = await sendPatchGenerateMessage(
      server,
      "",
      model.patchDest,
      3,
      model.patchName,
      model.objectsRight.map((object: TInspectorObject) => object.name),
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

    let errors: TFieldErrors<TGeneratePatchModel> = {};
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

}