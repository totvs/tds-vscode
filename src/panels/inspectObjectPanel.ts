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
import { ServersConfig } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "./utilities/common-command-panel";
import { IObjectData, sendInspectorObjectsRequest } from "../protocolMessages";
import { TFieldErrors, TdsPanel, isErrors } from "./panel";
import { TInspectorObject, TInspectorObjectModel } from "../model/inspectObjectModel";

enum InspectObjectCommandEnum {
  IncludeTRes = "INCLUDE_TRES",
  Export = "EXPORT"

}

type InspectObjectCommand = CommonCommandFromWebViewEnum & InspectObjectCommandEnum;

const EMPTY_MODEL: TInspectorObjectModel = {
  includeTRes: false,
  filter: "",
  objects: [],
}

export class InspectorObjectPanel extends TdsPanel<TInspectorObjectModel> {
  public static currentPanel: InspectorObjectPanel | undefined;

  public static render(context: vscode.ExtensionContext): InspectorObjectPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (InspectorObjectPanel.currentPanel) {
      // If the webview panel already exists reveal it
      InspectorObjectPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "inspector-objects-panel",
        // Panel title
        vscode.l10n.t("Objects Inspector"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      InspectorObjectPanel.currentPanel = new InspectorObjectPanel(panel, extensionUri);
    }

    return InspectorObjectPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    InspectorObjectPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "inspectObjectView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<InspectObjectCommand, TInspectorObjectModel>, result: any): Promise<any> {
    const command: InspectObjectCommand = message.command;
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
      case InspectObjectCommandEnum.IncludeTRes:
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

      case InspectObjectCommandEnum.Export: {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `$(gear~spin) Export inspector information. Wait...`,
          },
          async (progress, token) => {
            progress.report({ increment: 0 });

            let filename: string = "";

            if (data.type == "TXT") {
              filename = this.doExportToTxt(data.model.objects);
            } else {
              filename = this.doExportToCsv(data.model.objects);
            }

            const uri: vscode.Uri = vscode.Uri.parse("file:" + filename);
            await vscode.workspace.openTextDocument(uri).then(
              (a: vscode.TextDocument) => {
                vscode.window.showTextDocument(a, 1, false);
              },
              (error: any) => {
                vscode.window.showErrorMessage(error);
              }
            );

            this.sendUpdateModel(data.model, undefined);

            progress.report({ increment: 100 });
          }
        );

        break;
      }
    }
  }

  private async getDataFromServer(model: TInspectorObjectModel, includeTRes: boolean): Promise<TInspectorObjectModel> {
    const server = ServersConfig.getCurrentServer();
    const objectsData: IObjectData[] = await sendInspectorObjectsRequest(server, includeTRes);

    model.objects = [];
    if (objectsData) {
      objectsData.forEach((object: IObjectData) => {
        model.objects.push({
          program: object.source,
          date: object.date,
          status: object.source_status.toString(),
          rpo: object.rpo_status.toString(),
        });
      });

    }

    model.objects = model.objects.sort((a: TInspectorObject, b: TInspectorObject) => a.program.localeCompare(b.program));
    model.includeTRes = includeTRes;

    return model;

  }

  protected async validateModel(model: TInspectorObjectModel, errors: TFieldErrors<TInspectorObjectModel>): Promise<boolean> {
    try {
      //
    } catch (error) {
      errors.root = { type: "validate", message: `Internal error: ${error}` }
    }

    return !isErrors(errors);
  }

  protected async saveModel(model: TInspectorObjectModel): Promise<boolean> {
    // let server = ServersConfig.getCurrentServer();

    // // const filesPath = message.pathFiles;
    // // const patchName = message.patchName;
    // // const patchDestUri = vscode.Uri.file(
    // //   message.patchDest
    // // ).toString();

    // // if (patchDestUri === "" || filesPath.length === 0) {
    // //   vscode.window.showErrorMessage(
    // //     vscode.l10n.t("Patch Generation failed. Please check destination directory and sources/resources list.")
    // //   );
    // // } else {
    // // save last patchGenerateDir
    // //  ServersConfig.updatePatchGenerateDir(server.id, model.patchDest);
    // //vscode.window.showInformationMessage(localize("tds.webview.patch.generate.start","Start Generate Patch"));
    // const response: IPatchResult | void = await sendPatchGenerateMessage(
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

    // let errors: TFieldErrors<TInspectObjectModel> = {};
    // let ok: boolean = true;

    // if (!response) {
    //   errors.root = { type: "validate", message: "Internal error: See more information in log" };
    //   ok = false
    // } else if (response.returnCode !== 0) {
    //   const msgError = ` ${serverExceptionCodeToString(response.returnCode)} ${response.message}`;
    //   Utils.logMessage(msgError, MESSAGE_TYPE.Error, false);
    //   vscode.window.showErrorMessage(msgError);
    //   errors.root = { type: "validate", message: `Protheus Server was unable to generate the patch. Code: ${response.returnCode}` };;
    //   ok = false
    // }

    // if (!ok) {
    //   this.sendUpdateModel(model, errors);
    // }

    // return ok;
    return true;
  }

  getTranslations(): Record<string, string> {
    return {
      "Objects Inspector": vscode.l10n.t("Objects Inspector"),
      "Filter": vscode.l10n.t("Filter"),
      "Filter by Object Name. Ex: Mat or Fat*": vscode.l10n.t("Filter by Object Name. Ex: Mat or Fat*"),
      "Include *.TRES": vscode.l10n.t("Include *.TRES"),
      "100 (fast render)": vscode.l10n.t("100 (fast render)"),
      "500 (slow render)": vscode.l10n.t("500 (slow render)"),
      "RPO Objects": vscode.l10n.t("RPO Objects"),
      "Export (TXT)": vscode.l10n.t("Export (TXT)"),
      "Export (CSV)": vscode.l10n.t("Export (CSV)"),
    }
  }

  /**
   * Exports the provided inspector object information to a text file.
   *
   * @param objects - An array of `TInspectorObject` objects containing the information to be exported.
   * @returns The path to the generated text file.
   */
  private doExportToTxt(objects: TInspectorObject[]): string {
    const server = ServersConfig.getCurrentServer();

    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".txt" });
    const fs = require("fs");

    const write = (line: string) => {
      fs.appendFileSync(file.fd, line);
    };
    const writeLine = (line: string) => {
      write(line);
      fs.appendFileSync(file.fd, "\n");
    };
    const SEPARATOR_LINE = "-".repeat(100);

    writeLine(SEPARATOR_LINE);
    writeLine(`Server ........: ${server.name}`);
    writeLine(`Build .........: ${server.buildVersion}`);
    writeLine(`Address .......: ${server.address}:${server.port}`);
    writeLine(`Environment ...: ${server.environment}`);
    writeLine(SEPARATOR_LINE);

    write("Object Name".padEnd(30));
    write("Date".padEnd(30));
    write("Status".padEnd(30));
    writeLine("RPO".padEnd(30));

    writeLine(SEPARATOR_LINE);

    for (const value of objects) {
      let line: string = "";

      ['program', 'date', 'status', 'rpo'].forEach((key: string) => {
        write(`${value[key]}`.padEnd(25));
        write("".padEnd(5));
      });

      writeLine("");
    }

    writeLine(SEPARATOR_LINE);

    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const now = new Date().toLocaleString();

    writeLine("");
    writeLine(SEPARATOR_LINE);
    writeLine(`Total resources: ${objects.length}`);
    writeLine(`Generated by TDS-VSCode version${ext.packageJSON["version"]} at ${now}`);
    writeLine(SEPARATOR_LINE);

    return file.name;
  }

  private doExportToCsv(objects: TInspectorObject[]): string {
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".csv" });
    const fs = require("fs");

    const write = (line: string) => {
      fs.appendFileSync(file.fd, line);
    };
    const writeLine = (line: string) => {
      write(line);
      fs.appendFileSync(file.fd, "\n");
    };

    writeLine("\"Object Name\";\"Date\";\"Status\";\"RPO\"");

    for (const value of objects) {
      let line: string = "";

      ['program', 'date', 'status', 'rpo'].forEach((key: string) => {
        write(`\"${value[key]}\"`);

        if (key !== "rpo") {
          write(";");
        }
      });

      writeLine("");
    }

    return file.name;
  }

}