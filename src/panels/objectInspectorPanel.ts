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
import Utils, { ServersConfig, formatDate } from "../utils";
import { CommonCommandFromWebViewEnum, ReceiveMessage } from "@tds-shared/index";
import { IFunctionData, IObjectData, sendInspectorObjectsRequest } from "../protocolMessages";
import { TFieldErrors, isErrors } from "@tds-shared/index";
import { TInspectorObject, TInspectorObjectModel } from "@tds-shared/index";
import { sendInspectorFunctionsRequest } from './../protocolMessages';
import { TdsPanel } from "./panel";

export interface IInspectOptionsView {
  inspector: "objects" | "functions";
  includeOutScope: boolean; //TRES para objetos e "fontes sem função publica" para funções
}

enum InspectObjectCommandEnum {
  IncludeOutScope = "INCLUDE_OUT_SCOPE",
  Export = "EXPORT"

}

type InspectObjectCommand = CommonCommandFromWebViewEnum & InspectObjectCommandEnum;

const EMPTY_MODEL: TInspectorObjectModel = {
  includeOutScope: false,
  objects: [],
}

const panels: {
  objects?: InspectorObjectPanel;
  functions?: InspectorObjectPanel;
} = {};

export class InspectorObjectPanel extends TdsPanel<TInspectorObjectModel, IInspectOptionsView> {

  protected constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, options: IInspectOptionsView) {
    super(panel, extensionUri, options);
  }

  public static render(context: vscode.ExtensionContext, options: IInspectOptionsView): InspectorObjectPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (options.inspector == "objects") {
      if (panels.objects) {
        panels.objects._panel.reveal(); //vscode.ViewColumn.One
        return panels.objects;
      }
    } else {
      if (panels.functions) {
        panels.functions._panel.reveal(); //vscode.ViewColumn.One
        return panels.functions;
      }
    }

    // If a webview panel does not already exist create and show a new one
    const panel = vscode.window.createWebviewPanel(
      // Panel view type
      "inspector-objects-panel",
      // Panel title
      options.inspector == "objects"
        ? vscode.l10n.t("Objects Inspector")
        : vscode.l10n.t("Functions Inspector"),
      // The editor column the panel should be displayed in
      vscode.ViewColumn.One,
      // Extra panel configurations
      {
        ...getExtraPanelConfigurations(extensionUri)
      }
    );

    if (options.inspector == "objects") {
      panels.objects = new InspectorObjectPanel(panel, extensionUri, options);
      panels.objects._panel.onDidDispose(() => {
        panels.objects = undefined;
      }, null, context.subscriptions);
    } else {
      panels.functions = new InspectorObjectPanel(panel, extensionUri, options);
      panels.functions._panel.onDidDispose(() => {
        panels.functions = undefined;
      }, null, context.subscriptions);
    }

    return options.inspector == "objects"
      ? panels.objects
      : panels.functions;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {

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
    const server = ServersConfig.getCurrentServer();

    return getWebviewContent(this._panel.webview, extensionUri, "objectInspectorView",
      {
        title: this._panel.title,
        translations: this.getTranslations(),
        data: {
          inspector: this._options.inspector.toString(),
          isServerP20OrGreater: Utils.isServerP20OrGreater(server).toString()
        },
      }
    )
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

              data.model = await this.getDataFromServer(EMPTY_MODEL);

              this.sendUpdateModel(data.model, undefined);

              progress.report({ increment: 100 });
            }
          );
        }

        break;
      case InspectObjectCommandEnum.IncludeOutScope:
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: vscode.l10n.t("Loading RPO content..."),
          },
          async (progress, token) => {
            progress.report({ increment: 0 });
            this._options.includeOutScope = data.includeOutScope;
            data.model = await this.getDataFromServer(data.model);

            this.sendUpdateModel(data.model, undefined);

            progress.report({ increment: 100 });
          }
        );

        break;

      case InspectObjectCommandEnum.Export: {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: `Export inspector information. Wait...`,
            cancellable: true,
          },
          async (progress, token: vscode.CancellationToken) => {
            progress.report({ increment: 0 });

            let filename: string = "";

            if (data.type == "TXT") {
              filename = this.doExportToTxt(data.model.objects, token);
            } else {
              filename = this.doExportToCsv(data.model.objects, token);
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

  private async getDataFromServer(model: TInspectorObjectModel): Promise<TInspectorObjectModel> {
    const server = ServersConfig.getCurrentServer();
    const objectsData: IObjectData[] | IFunctionData[] =
      this._options.inspector == "objects"
        ? await sendInspectorObjectsRequest(server, this._options.includeOutScope)
        : await sendInspectorFunctionsRequest(server, this._options.includeOutScope);
    //chamada abaixo necessária para complementar as informações das funções
    //TODO: rever processo no LS para obter em apenas uma chamada
    const sourceData: IObjectData[] = this._options.inspector == "functions"
      ? await sendInspectorObjectsRequest(server, false)
      : [];
    let oldSOurce: string = "";
    let indexSource: number = -1;

    model.objects = [];
    if (objectsData) {
      objectsData.forEach((object: IObjectData | IFunctionData) => {
        const data: TInspectorObject = {
          source: "",
          date: new Date(),
          rpo_status: "",
          source_status: "",
          function: "",
          line: 0
        };

        data.source = object.source;
        data.rpo_status = object.rpo_status;
        data.source_status = object.source_status;

        if (this._options.inspector == "objects") {
          data.date = new Date((object as IObjectData).date);
        } else {
          if (oldSOurce !== object.source) {
            oldSOurce = object.source;
            data.source = object.source;
            indexSource = sourceData.findIndex((source: IObjectData) => source.source === object.source);
          }
          if (indexSource !== -1) {
            data.date = new Date(sourceData[indexSource].date);
          }
          data.function = (object as IFunctionData).function;
          data.line = (object as IFunctionData).line;
        }

        model.objects.push(data);
      });

    }

    model.includeOutScope = this._options.includeOutScope;

    return model;

  }

  protected async validateModel(model: TInspectorObjectModel, errors: TFieldErrors<TInspectorObjectModel>): Promise<boolean> {
    //does not apply to this model
    return !isErrors(errors);
  }

  protected async saveModel(model: TInspectorObjectModel): Promise<boolean> {
    //does not apply to this model
    return true;
  }

  getTranslations(): Record<string, string> {
    return {
      "Object Name": vscode.l10n.t("Object Name"),
      "Compile Date": vscode.l10n.t("Compile Date"),
      "Status": vscode.l10n.t("Status"),
      "RPO": vscode.l10n.t("RPO"),
      "Function": vscode.l10n.t("Function"),
      "Line": vscode.l10n.t("Line"),
      "Source": vscode.l10n.t("Source"),
      "Export (TXT)": vscode.l10n.t("Export (TXT)"),
      "Export (CSV)": vscode.l10n.t("Export (CSV)"),
      "Include TRES": vscode.l10n.t("Include TRES"),
      "Exclude TRES": vscode.l10n.t("Exclude TRES"),
      "Exclude sources without public elements": vscode.l10n.t("Exclude sources without public elements"),
      "Include sources without public elements": vscode.l10n.t("Include sources without public elements"),
      "Objects Inspector": vscode.l10n.t("Objects Inspector"),
      "Functions Inspector": vscode.l10n.t("Functions Inspector"),
      "Elements/page": vscode.l10n.t("Elements/page"),
      "Filter": vscode.l10n.t("Filter"),
      "FilterInfo": vscode.l10n.t("Filter by Object Name. Ex: Mat or Fat*"),
    }
  }

  /**
   * Exports the provided inspector object information to a text file.
   *
   * @param objects - An array of `TInspectorObject` objects containing the information to be exported.
   * @returns The path to the generated text file.
   */
  private doExportToTxt(objects: TInspectorObject[], token: vscode.CancellationToken): string {
    const keys: string[] = this._options.inspector == "objects"
      ? ["source", "date", "rpo_status", "source_status"]
      : ["function", "line", "source", "date", "rpo_status", "source_status"];
    const colWidths: Record<string, number> = {
      "source": this._options.inspector == "objects" ? 35 : 45,
      "date": 25,
      "rpo_status": 15,
      "source_status": 15,
      "function": this._options.inspector == "objects" ? 35 : 45,
      "line": 10,
    }
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
    const SEPARATOR_LINE = "-".repeat(this._options.inspector == "objects" ? 90 : 155);

    writeLine(SEPARATOR_LINE);
    writeLine(`Server ........: ${server.name}`);
    writeLine(`Build .........: ${server.buildVersion}`);
    writeLine(`Address .......: ${server.address}:${server.port}`);
    writeLine(`Environment ...: ${server.environment}`);
    writeLine("");
    writeLine(`Total resources: ${objects.length}`);
    writeLine(SEPARATOR_LINE);

    keys.forEach((key: string) => {
      write(`${key}`.padEnd(colWidths[key]));
    });

    writeLine("");
    writeLine(SEPARATOR_LINE);

    for (const value of objects) {
      if (token.isCancellationRequested) {
        writeLine("");
        writeLine(SEPARATOR_LINE);
        writeLine("Export canceled by user");

        break;
      }

      keys.forEach((key: string) => {
        if (key == "date") {
          write(formatDate(new Date(value[key])).padEnd(colWidths[key]));
        } else {
          write(`${value[key]}`.padEnd(colWidths[key]));
        }

      });

      writeLine("");
    }

    writeLine(SEPARATOR_LINE);

    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const now = new Date().toLocaleString();

    writeLine("");
    writeLine(SEPARATOR_LINE);
    writeLine(`Generated by TDS-VSCode version ${ext.packageJSON["version"]} at ${now}`);
    writeLine(SEPARATOR_LINE);

    return file.name;
  }

  private doExportToCsv(objects: TInspectorObject[], token: vscode.CancellationToken): string {
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".csv" });
    const fs = require("fs");
    const keys: string[] = this._options.inspector == "objects"
      ? ["source", "date", "rpo_status", "source_status"]
      : ["function", "line", "source", "date", "rpo_status", "source_status"];

    const write = (line: string) => {
      fs.appendFileSync(file.fd, line);
    };
    const writeLine = (line: string) => {
      write(line);
      fs.appendFileSync(file.fd, "\n");
    };

    keys.forEach((key: string) => {
      write(`"${key}"`);

      if (key !== "source_status") {
        write(";");
      }
    });
    writeLine("");

    for (const value of objects) {
      if (token.isCancellationRequested) {
        writeLine("");
        writeLine("Export canceled by user");

        break;
      }

      keys.forEach((key: string) => {
        if (key == "date") {
          write(`\"${formatDate(new Date(value[key]))}\"`);
        } else {
          write(`\"${value[key]}\"`);
        }

        if (key !== "source_status") {
          write(";");
        }
      });

      writeLine("");
    }

    return file.name;
  }

}