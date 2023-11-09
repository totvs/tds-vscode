import * as vscode from "vscode";
import * as path from "path";
import {
  IFunctionData,
  IObjectData,
  sendInspectorFunctionsRequest,
  sendInspectorObjectsRequest,
} from "../protocolMessages";
import { InspectorPanelAction, IInspectorPanelAction } from "./actions";
import { ServerItem } from "../serverItem";
import { ServersConfig } from "../utils";
import { languageClient } from "../extension";

let inspectLoader: Map<string, InspectorLoader> = new Map<
  string,
  InspectorLoader
>();

export interface IInspectOptiosView {
  objectsInspector: boolean;
  includeOutScope: boolean; //TRES para objetos e "fontes sem função publica" para funções
}

export function openInspectView(
  context: vscode.ExtensionContext,
  options: IInspectOptiosView
) {
  const server = ServersConfig.getCurrentServer();
  const key = options.objectsInspector ? "objects" : "functions";

  if (!inspectLoader.has(key)) {
    inspectLoader.set(key, new InspectorLoader(context, options));
  }

  inspectLoader.get(key).toggleServerToInspect(server);
}

export class InspectorLoader implements vscode.Disposable {
  protected readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];
  private _isDisposed: boolean = false;
  private _inspectServer: any = null;
  private _options: IInspectOptiosView;
  private _context: vscode.ExtensionContext;
  private _results: IObjectData[] | IFunctionData[];

  constructor(context: vscode.ExtensionContext, options: IInspectOptiosView) {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;
    this._options = options;
    this._context = context;

    this._disposables.push(
      ServersConfig.onDidSelectedServer((newServer: ServerItem) => {
        const key = options.objectsInspector ? "objects" : "functions";
        if (inspectLoader.has(key)) {
          inspectLoader.get(key).toggleServerToInspect(newServer);
        }
      })
    );

    this._panel = vscode.window.createWebviewPanel(
      "inspectLoader",
      options.objectsInspector
        ? vscode.l10n.t("Objects Inspector")
        : vscode.l10n.t("Functions Inspector"),
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, "out", "webpack")),
        ],
      }
    );

    this._panel.webview.html = this.getWebviewContent();
    this._panel.onDidChangeViewState(
      (listener: vscode.WebviewPanelOnDidChangeViewStateEvent) => {
        if (listener.webviewPanel.visible) {
          this.updateInspectInfo();
        }
      },
      undefined,
      this._disposables
    );

    this._panel.webview.onDidReceiveMessage(
      (command: IInspectorPanelAction) => {
        this.handleMessage(command);
      },
      undefined,
      this._disposables
    );

    this._panel.onDidDispose(() => {
      const key = options.objectsInspector ? "objects" : "functions";
      inspectLoader.get(key).dispose();
      inspectLoader.delete(key);
    });
  }

  public get inspectServer(): any {
    return this._inspectServer;
  }

  public set inspectServer(value: any) {
    if (this._inspectServer !== value) {
      this._inspectServer = value;
      this.updateInspectInfo();
    }
  }

  dispose() {
    this._isDisposed = true;

    this._disposables.forEach((element: vscode.Disposable) =>
      element.dispose()
    );
  }

  public toggleServerToInspect(serverItem: ServerItem) {
    this.inspectServer = null;

    if (serverItem) {
      this.inspectServer = serverItem;
    }
  }

  private async handleMessage(command: IInspectorPanelAction) {
    switch (command.action) {
      case InspectorPanelAction.RefreshInspectorInfo: {
        this._results = undefined;
        this.updateInspectInfo();
        break;
      }
      case InspectorPanelAction.UpdateInspectorInfo: {
        this._options.includeOutScope = command.content.includeOutScope;
        this.updateInspectInfo();
        break;
      }
      case InspectorPanelAction.DoUpdateState: {
        const state: any = command.content.state;
        const reload: boolean = command.content.reload;
        const context = this._context;
        context.workspaceState.update(this.stateKey, state);

        if (reload) {
          context.workspaceState.update(this.stateKey, {});
          this._panel.dispose();

          openInspectView(context, this._options);
        }

        break;
      }

      case InspectorPanelAction.ExportToTxt: {
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `$(gear~spin) Export inspector information. Wait...`,
          },
          async (progress, token) => {
            progress.report({ increment: 0 });

            let filename: string = "";

            if (command.content.csv) {
              if (this._options.objectsInspector) {
                filename = this.doExportObjectsToCsv(
                  command.content.columns,
                  command.content.rows
                );
              } else {
                filename = this.doExportFunctionsToCsv(
                  command.content.columns,
                  command.content.rows
                );
              }
            } else {
              filename = this.doExportToTxt(
                this.inspectServer,
                command.content.rows
              );
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

            progress.report({ increment: 100 });
          }
        );

        break;
      }
      default:
        console.log("***** ATTENTION: inspectLoader.tsx");
        console.log("\tUnrecognized command: " + command.action);
        console.log("\t" + command.content);
        break;
    }
  }

  get stateKey(): string {
    return this._options.objectsInspector
      ? "OBJECTS_INSPECTOR_PANEL_4"
      : "FUNCTIONS_INSPECTOR_PANEL_4";
  }

  public doExportToTxt(server: any, functionsInfo: any[]): string {
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".txt" });
    const fs = require("fs");

    const writeLine = (line: string) => {
      fs.appendFileSync(file.fd, line);
      fs.appendFileSync(file.fd, "\n");
    };
    const SEPARATOR_LINE = "-".repeat(50);

    writeLine(SEPARATOR_LINE);
    writeLine(`Server ........: ${server.name}`);
    writeLine(`Build .........: ${server.buildVersion}`);
    writeLine(`Address .......: ${server.address}:${server.port}`);
    writeLine(`Environment ...: ${server.environment}`);
    //writeLine(`OS Platform ...: ${server.osType}`);
    // writeLine(`  RPO Version..: ${functionsInfo.version}`);
    // writeLine(`  Generated at : ${functionsInfo.date}`);
    writeLine(SEPARATOR_LINE);

    for (const value of functionsInfo) {
      let line: string = "";

      ['source', 'date', 'rpo_status', 'source_status'].forEach((key: string) => {
        line += `${value[key]}`.padEnd(25);
      });

      writeLine(line);
    }

    writeLine(SEPARATOR_LINE);

    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const now = new Date().toLocaleString();

    writeLine("");
    writeLine(SEPARATOR_LINE);
    writeLine(`Total resources: ${functionsInfo.length}`);
    writeLine(`Generated by TDS-VSCode version${ext.packageJSON["version"]}`);
    writeLine(`at ${now}`);
    writeLine(SEPARATOR_LINE);

    return file.name;
  }

  private doExportObjectsToCsv(columns: any[], functionsInfo: any[]): string {
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".csv" });
    const fs = require("fs");

    const writeLine = (line: string) => {
      fs.appendFileSync(file.fd, line);
      fs.appendFileSync(file.fd, "\n");
    };

    const colSource: any = columns.find((col: any) => col.field == "source");
    const colDate: any = columns.find((col: any) => col.field == "date");
    const colSourceStatus: any = columns.find((col: any) => col.field == "source_status");
    const colRpoStatus: any = columns.find((col: any) => col.field == "rpo_status");

    let line: string = `"${colSource.title}";"${colDate.title}";"${colSourceStatus.title}";"${colRpoStatus.title}"`
    writeLine(line);

    for (const value of functionsInfo) {
      line = `"${value["source"]}";"${value["date"]}";"${colSourceStatus.lookup[value["source_status"]]}";"${colRpoStatus.lookup[value["rpo_status"]]}"`;
      writeLine(line);
    }

    return file.name;
  }

  private doExportFunctionsToCsv(columns: any[], functionsInfo: any[]): string {
    const tmp = require("tmp");
    const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".csv" });
    const fs = require("fs");

    const writeLine = (line: string) => {
      fs.appendFileSync(file.fd, line);
      fs.appendFileSync(file.fd, "\n");
    };

    const colFunction: any = columns.find((col: any) => col.field == "function");
    const colSource: any = columns.find((col: any) => col.field == "source");
    const colLine: any = columns.find((col: any) => col.field == "line");
    const colSourceStatus: any = columns.find((col: any) => col.field == "source_status");
    const colRpoStatus: any = columns.find((col: any) => col.field == "rpo_status");

    let line: string = `"${colFunction.title}";"${colSource.title}";"${colLine.title}";"${colSourceStatus.title}";"${colRpoStatus.title}"`
    writeLine(line);

    for (const value of functionsInfo) {
      line = `"${value["function"]}";"${value["source"]}";"${value["line"]}";"${colSourceStatus.lookup[value["source_status"]]}";"${colRpoStatus.lookup[value["rpo_status"]]}"`;
      writeLine(line);
    }

    return file.name;
  }

  public updateInspectInfo() {
    if (this.inspectServer === null) {
      return;
    }

    let proc: any;

    if (this._options.objectsInspector) {
      if (this._results) {
        this._panel.webview.postMessage({
          command: InspectorPanelAction.UpdateInspectorInfo,
          data: {
            serverName: this.inspectServer.name,
            environment: this.inspectServer.environment,
            includeOutScope: this._options.includeOutScope,
            dataRows: this._results,
          },
        });
      } else {
        proc = () => {
          sendInspectorObjectsRequest(
            this.inspectServer,
            this._options.includeOutScope
          ).then(
            (result: IObjectData[]) => {
              this._results = result;
              this._panel.webview.postMessage({
                command: InspectorPanelAction.UpdateInspectorInfo,
                data: {
                  serverName: this.inspectServer.name,
                  environment: this.inspectServer.environment,
                  includeOutScope: this._options.includeOutScope,
                  dataRows: this._results,
                },
              });
            },
            (err: Error) => {
              languageClient.error(err.message, err);
              vscode.window.showErrorMessage(
                err.message + vscode.l10n.t(". See log for details.")
              );
            }
          );
        };
      }
    } else {
      if (this._results) {
        this._panel.webview.postMessage({
          command: InspectorPanelAction.UpdateInspectorInfo,
          data: {
            serverName: this.inspectServer.name,
            environment: this.inspectServer.environment,
            includeOutScope: this._options.includeOutScope,
            dataRows: this._results,
          },
        });
      } else {
        proc = () =>
          sendInspectorFunctionsRequest(
            this.inspectServer,
            !this._options.includeOutScope
          ).then(
            (rows: IFunctionData[]) => {
              this._results = rows;
              this._panel.webview.postMessage({
                command: InspectorPanelAction.UpdateInspectorInfo,
                data: {
                  serverName: this.inspectServer.name,
                  environment: this.inspectServer.environment,
                  includeOutScope: this._options.includeOutScope,
                  dataRows: this._results,
                },
              });
            },
            (err: Error) => {
              languageClient.error(err.message, err);
              vscode.window.showErrorMessage(
                err.message + vscode.l10n.t(". See log for details.")
              );
            }
          );
      }
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: `${vscode.l10n.t("Requesting data from the server [{0}]", this.inspectServer.name)}`,
      },
      async (progress, token) => {
        await proc();
      }
    );
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "out", "webpack", "inspectPanel.js")
    );

    const servers: ServerItem[] = this.inspectServer
      ? [this.inspectServer]
      : [];

    const reactAppUri = this._panel?.webview.asWebviewUri(reactAppPathOnDisk);
    const configJson: any = {
      options: {
        ...this._options,
        stateKey: this.stateKey,
      },
      serverList: servers,
      translations: getTranslations(),
    };

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monitor View</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src https:;
                             script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = ${JSON.stringify(configJson)};
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="${reactAppUri}"></script>
    </body>
    </html>`;
  }
}

function getTranslations() {
  return {
    INSPECTOR_FUNCTIONS: vscode.l10n.t("Functions Inspector "),
    INSPECTOR_OBJECTS: vscode.l10n.t("Objects Inspector"),
    NO_INFO_FROM_RPO: vscode.l10n.t("There is no information about the RPO."),
    ACTIONS: vscode.l10n.t("Actions"),
    DRAG_HEADERS: vscode.l10n.t("Drag headers ..."),
    FILTER: vscode.l10n.t("Filter"),
    FILTERING_ON_OFF: vscode.l10n.t("Filtering on/off"),
    FIRST: vscode.l10n.t("First"),
    FIRST_PAGE: vscode.l10n.t("First page"),
    FROM_TO_OF_COUNT: vscode.l10n.t("from-to de count"),
    GROUPED_BY: vscode.l10n.t("Grouped by:"),
    GROUPING_ON_OFF: vscode.l10n.t("Grouping on/off"),
    TREE_ON_OFF: vscode.l10n.t("Tree server on/off"),
    LAST: vscode.l10n.t("Last"),
    LAST_PAGE: vscode.l10n.t("Last page"),
    LINES_PAGE: vscode.l10n.t("lines/p."),
    NEXT: vscode.l10n.t("Next"),
    NEXT_PAGE: vscode.l10n.t("Next page"),
    PREVIOUS: vscode.l10n.t("Previous"),
    PREVIOUS_PAGE: vscode.l10n.t("Previous page"),
    RESET_CONFIGURATIONS: vscode.l10n.t("Reset configurations"),
    SEARCH: vscode.l10n.t("Search"),
    SEARCH_ALL_COLUMNS: vscode.l10n.t("Search in all columns"),
    SERVER: vscode.l10n.t("Server"),
    SHOW_HIDE_COLUMNS: vscode.l10n.t("Show/hide columns"),
    INITIALIZING: vscode.l10n.t("(initializing)"),
    SHOW_COLUMNS: vscode.l10n.t("Show Columns"),
    RESOURCES: vscode.l10n.t("Resources"),
    EXPORT_TXT: vscode.l10n.t("Export as Text"),
    REFRESH: vscode.l10n.t("Refresh"),
    RPO_LOG: vscode.l10n.t("Repository Log"),
  };
}
