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
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { CommonCommandFromWebViewEnum, EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL, ImportSourcesOnlyResultCommand, ImportSourcesOnlyResultCommandEnum, ReceiveMessage, TFieldErrors, TImportSourcesOnlyResultData, TImportSourcesOnlyResultModel, isErrors } from "@tds-shared/index";
import { TdsPanel } from "./panel";
import { formatDate, ServersConfig } from "../utils";

export type ImportSourcesOnlyResultOptions = {
  data: TImportSourcesOnlyResultData[];
};

export class ImportSourcesOnlyResultPanel extends TdsPanel<TImportSourcesOnlyResultModel, ImportSourcesOnlyResultOptions> {
  public static currentPanel: ImportSourcesOnlyResultPanel | undefined;

  /**
   * Renders the Global Include panel in the Visual Studio Code editor.
   *
   * If the panel already exists, it will be revealed. Otherwise, a new panel will be created and shown in the first editor column.
   *
   * @param context The extension context, used to get the extension URI.
   * @returns The current instance of the ImportSourcesOnlyResultPanel.
   */
  public static render(context: vscode.ExtensionContext, sourceList: TImportSourcesOnlyResultData): ImportSourcesOnlyResultPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (ImportSourcesOnlyResultPanel.currentPanel) {
      // If the webview panel already exists reveal it
      ImportSourcesOnlyResultPanel.currentPanel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "import-source-only-result-panel",
        // Panel title
        vscode.l10n.t("Replay Sources Result"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      ImportSourcesOnlyResultPanel.currentPanel = new ImportSourcesOnlyResultPanel(panel, extensionUri, { data: sourceList });
    }

    return ImportSourcesOnlyResultPanel.currentPanel;
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ImportSourcesOnlyResultPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "ImportSourcesOnlyResultView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<ImportSourcesOnlyResultCommand, TImportSourcesOnlyResultModel>, result: any): Promise<any> {
    const command: ImportSourcesOnlyResultCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        const model: TImportSourcesOnlyResultModel = EMPTY_IMPORT_SOURCES_ONLY_RESULT_MODEL();

        model.sourceObj = this._options.data;

        this.sendUpdateModel(model, undefined);

        break;
      case ImportSourcesOnlyResultCommandEnum.EXPORT: {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: `Export sources list. Wait...`,
            cancellable: true,
          },
          async (progress, token: vscode.CancellationToken) => {
            progress.report({ increment: 0 });

            let filename: string = "";

            if (data.type == "TXT") {
              filename = this.doExportToTxt(data.model.sourceObj, token);
            } else {
              filename = this.doExportToCsv(data.model.sourceObj, token);
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

  protected validateModel(model: TImportSourcesOnlyResultModel, errors: TFieldErrors<TImportSourcesOnlyResultModel>): boolean {
    //not applicable

    return !isErrors(errors);
  }

  protected saveModel(model: TImportSourcesOnlyResultModel): boolean {
    //not applicable

    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
    };
  }

  /**
 * Exports the provided inspector object information to a text file.
 *
 * @param objects - An array of `TInspectorObject` objects containing the information to be exported.
 * @returns The path to the generated text file.
 */
  private doExportToTxt(objects: TImportSourcesOnlyResultData[], token: vscode.CancellationToken): string {
    const keys: string[] = ["source", "compilationDate"];
    const colWidths: Record<string, number> = {
      "source": 35,
      "compilationDate": 25
    }
    const server = ServersConfig.getCurrentServer();
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-replay", postfix: ".txt" });
    const fs = require("fs");

    const write = (line: string) => {
      fs.appendFileSync(file.fd, line);
    };
    const writeLine = (line: string) => {
      write(line);
      fs.appendFileSync(file.fd, "\n");
    };
    const SEPARATOR_LINE = "-".repeat(60);

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
        if (key == "compilationDate") {
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

  private doExportToCsv(objects: TImportSourcesOnlyResultData[], token: vscode.CancellationToken): string {
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".csv" });
    const fs = require("fs");
    const keys: string[] = ["source", "compilationDate"];

    const write = (line: string) => {
      fs.appendFileSync(file.fd, line);
    };
    const writeLine = (line: string) => {
      write(line);
      fs.appendFileSync(file.fd, "\n");
    };

    keys.forEach((key: string) => {
      write(`"${key}"`);

      if (key !== "compilationDate") {
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

        if (key !== "compilationDate") {
          write(";");
        }
      });

      writeLine("");
    }

    return file.name;
  }

}