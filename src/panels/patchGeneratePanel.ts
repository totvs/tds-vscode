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
import { CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IObjectData, IPatchResult, IValidationInfo, IWsdlGenerateResult, sendInspectorObjectsRequest, sendPatchGenerateMessage, sendValidationRequest, sendWsdlGenerateRequest } from "../protocolMessages";
import { ITdsPanel, TFieldErrors, TIncludePath, isErrors } from "../model/field-model";
import * as fse from "fs-extra";
import path from "path";
import { _debugEvent } from "../debug";
import { TGeneratePatchModel } from "../model/generatePatchModel";
import { TInspectorObject } from "../patch/patchUtil";

enum PatchGenerateCommandEnum {
}

type PatchGenerateCommand = CommonCommandFromWebViewEnum & PatchGenerateCommandEnum;

const EMPTY_MODEL: TGeneratePatchModel = {
  objectsLeft: [],
  objectsRight: [],
  patchDest: "",
  patchName: "",
}

export class PatchGeneratePanel implements ITdsPanel<TGeneratePatchModel> {
  public static currentPanel: PatchGeneratePanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  /**
   * The PatchGeneratePanel class private constructor (called only from the render method).
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
        vscode.l10n.t("Patch generation from RPO"),
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

    return getWebviewContent(this._panel.webview, extensionUri, "patchGenerateView", { title: this._panel.title });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      async (message: ReceiveMessage<PatchGenerateCommand, TGeneratePatchModel>) => {
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
                  const server = ServersConfig.getCurrentServer();
                  const model: TGeneratePatchModel = EMPTY_MODEL;
                  let includeTRes: boolean = false;

                  progress.report({ increment: 0 });
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

                  progress.report({ increment: 100 });

                  this._sendUpdateModel(model);
                }
              );
            }
            break;
          case CommonCommandFromWebViewEnum.Close:
            PatchGeneratePanel.currentPanel.dispose();
            break;
          case CommonCommandFromWebViewEnum.Save:
          case CommonCommandFromWebViewEnum.SaveAndClose:
            let errors: TFieldErrors<TGeneratePatchModel> = {};

            if (await this._validateModel(data.model, errors)) {
              if (this._saveModel(data.model)) {
                if (command === CommonCommandFromWebViewEnum.SaveAndClose) {
                  PatchGeneratePanel.currentPanel.dispose();
                } else {
                  // this._sendUpdateModel({
                  //   urlOrWsdlFile: "",
                  //   outputPath: data.model.outputFilename,
                  //   outputFilename: "",
                  //   overwrite: false
                  // });
                }
              }
            } else {
              this._sendValidateResponse(errors);
            }

            break;
        }
      },
      undefined,
      this._disposables
    );
  }

  async _validateModel(model: TGeneratePatchModel, errors: TFieldErrors<TGeneratePatchModel>): Promise<boolean> {
    try {

      if (model.objectsRight.length == 0) {
        errors.objectsRight = { type: "required" };
      }
    } catch (error) {
      errors.root = { type: "validate", message: `Internal error: ${error}` }
    }

    return !isErrors(errors);
  }

  async _saveModel(model: TGeneratePatchModel): Promise<boolean> {
    if (_debugEvent) {
      vscode.window.showWarningMessage("This operation is not allowed during a debug.")
      return;
    }
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
      model.objectsRight
    ).then(() => {
      vscode.window.showInformationMessage(vscode.l10n.t("Patch file generated"));
    });

    if (!response) {
      let errors: TFieldErrors<TGeneratePatchModel> = {};
      errors.root = { type: "validate", message: "Internal error: See more information in log" };
      this._sendValidateResponse(errors)
    } else if (response.returnCode !== 0) {
      let errors: TFieldErrors<TGeneratePatchModel> = {};
      errors.root = { type: "validate", message: `Protheus server was unable to generate the patch. Reason: ${response.message}` };;
      this._sendValidateResponse(errors)

      return false;
    }

    return true;
  }

  _sendValidateResponse(errors: TFieldErrors<TGeneratePatchModel>) {
    this._panel.webview.postMessage({
      command: CommonCommandToWebViewEnum.ValidateResponse,
      data: errors,
    });
  }

  _sendUpdateModel(model: TGeneratePatchModel): void {
    this._panel.webview.postMessage({
      command: CommonCommandToWebViewEnum.UpdateModel,
      data: {
        model: model
      }
    });
  }
}