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
import * as path from "path";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";
import { BuildResultCommand, BuildResultCommandEnum, CommonCommandFromWebViewEnum, EMPTY_BUILD_RESULT_MODEL, ReceiveMessage, TBuildInfoResult, TBuildResultModel } from "@tds-shared/index";
import { TFieldErrors, isErrors } from "@tds-shared/index";
import { TdsPanel } from "./panel";
import { CompileResult } from "../compile/CompileResult";
import { CompileInfo } from "../compile/CompileInfo";
import { ServersConfig, formatDate, formatNumber } from "../utils";


type BuildResultOptions = {
  buildResult: CompileResult;
};

export class BuildResultPanel extends TdsPanel<TBuildResultModel, BuildResultOptions> {
  public static currentPanel: BuildResultPanel | undefined;

  public static render(context: vscode.ExtensionContext, compileResult: CompileResult): BuildResultPanel {
    const extensionUri: vscode.Uri = context.extensionUri;

    if (BuildResultPanel.currentPanel) {
      // If the webview panel already exists reveal it
      BuildResultPanel.currentPanel.reveal(); //vscode.ViewColumn.One
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "build-result-panel",
        // Panel title
        vscode.l10n.t('Build Result'),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        }
      );

      BuildResultPanel.currentPanel = new BuildResultPanel(panel, extensionUri, compileResult);
    }

    return BuildResultPanel.currentPanel;
  }

  /**
   * Constructs a new `BuildResultPanel` instance.
   *
   * @param panel - The `vscode.WebviewPanel` instance to use for the build result panel.
   * @param extensionUri - The `vscode.Uri` of the extension containing the build result panel.
   * @param compileResult - The `CompileResult` to display in the build result panel.
   */
  constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    compileResult: CompileResult
  ) {
    super(panel, extensionUri, { buildResult: compileResult });
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    BuildResultPanel.currentPanel = undefined;

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

    return getWebviewContent(this._panel.webview, extensionUri, "buildResultView",
      { title: this._panel.title, translations: this.getTranslations() });
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  protected async panelListener(message: ReceiveMessage<BuildResultCommand, TBuildResultModel>, result: any): Promise<any> {
    const command: BuildResultCommand = message.command;
    const data = message.data;

    switch (command) {
      case CommonCommandFromWebViewEnum.Ready:
        if (data.model == undefined) {
          const model: TBuildResultModel = EMPTY_BUILD_RESULT_MODEL();

          model.timeStamp = new Date();
          model.returnCode = this._options.buildResult.returnCode;
          model.buildInfos = [];
          this._options.buildResult.compileInfos.forEach((info: CompileInfo) => {
            const filename: string = path.basename(info.filePath);
            const detail: string = info.detail.toLowerCase().startsWith(filename.toLowerCase())
              ? info.detail.substring(filename.length)
              : info.detail;

            const buildInfo: TBuildInfoResult = {
              filename: filename,
              status: info.status,
              message: info.message,
              detail: detail,
              uri: info.filePath
            };

            model.buildInfos.push(buildInfo);
          });

          this.sendUpdateModel(model, undefined);
        }
        break;
      case BuildResultCommandEnum.Export: {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Window,
            title: vscode.l10n.t(`Export compilation result. Wait...`),
              cancellable: true,
          },
          async (progress, token: vscode.CancellationToken) => {
            progress.report({ increment: 0 });

            const filename: string = this.doExportToTxt(data.model, token);

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

  async validateModel(model: TBuildResultModel, errors: TFieldErrors<TBuildResultModel>): Promise<boolean> {
    // not applicable

    return !isErrors(errors);
  }

  async saveModel(model: TBuildResultModel): Promise<boolean> {
    // not applicable
    return true;
  }

  protected getTranslations(): Record<string, string> {
    return {
      "Filename": vscode.l10n.t("Filename"),
      "Message": vscode.l10n.t("Message"),
      "Status": vscode.l10n.t("Status"),
      "Detail": vscode.l10n.t("Detail"),
      "Path": vscode.l10n.t("Path"),
      "Export": vscode.l10n.t("Export"),
      "Compilation results made at [{0}]": vscode.l10n.t("Compilation results made at [{0}]"),
      "Compilation aborted.": vscode.l10n.t("Compilation aborted.")
    }
  }

  private doExportToTxt(model: TBuildResultModel, token: vscode.CancellationToken): string {
    const server = ServersConfig.getCurrentServer();
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-patch-info", postfix: ".txt" });
    const fs = require("fs");

    const write = (line: string) => {
      fs.appendFileSync(file.fd, line);
    };
    const writeLine = (line: string) => {
      write(line);
      fs.appendFileSync(file.fd, "\n");
    };
    const SEPARATOR_LINE = "-".repeat(90);

    writeLine(SEPARATOR_LINE);
    writeLine(`Server ........: ${server.name}`);
    writeLine(`Build .........: ${server.buildVersion}`);
    writeLine(`Address .......: ${server.address}:${server.port}`);
    writeLine(`Environment ...: ${server.environment}`);
    writeLine("");
    writeLine(`Size ..........: ${formatNumber(model.buildInfos.length, "int")} resources`);
    writeLine(`Compiled at ...: ${formatDate(model.timeStamp)}`);
    writeLine(SEPARATOR_LINE);

    write("Filename".padEnd(30));
    write("Status".padEnd(10));
    write("Message".padEnd(30));
    writeLine("");

    write("Path");
    writeLine("");

    write("Details");
    writeLine("");
    writeLine(SEPARATOR_LINE);

    for (const value of model.buildInfos) {
      if (token.isCancellationRequested) {
        writeLine("");
        writeLine(SEPARATOR_LINE);
        writeLine("Export canceled by user");

        break;
      }

      write(value.filename.padEnd(30));
      write(value.status.padEnd(10));
      write(value.message.padEnd(30));
      writeLine("");

      write(value.uri);
      writeLine("");

      write(value.detail);
      writeLine("");
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
}