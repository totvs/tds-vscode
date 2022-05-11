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
import * as nls from "vscode-nls";
import Utils from "../utils";
import { languageClient } from "../extension";
import * as fse from "fs-extra";

const localize = nls.loadMessageBundle();

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
  const server = Utils.getCurrentServer();
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

  constructor(context: vscode.ExtensionContext, options: IInspectOptiosView) {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;
    this._options = options;
    this._context = context;

    this._disposables.push(
      Utils.onDidSelectedServer((newServer: ServerItem) => {
        const key = options.objectsInspector ? "objects" : "functions";
        if (inspectLoader.has(key)) {
          inspectLoader.get(key).toggleServerToInspect(newServer);
        }
      })
    );

    this._panel = vscode.window.createWebviewPanel(
      "inspectLoader",
      options.objectsInspector
        ? localize("INSPECT_OBJECTS", "Objects Inspector")
        : localize("INSPECT_FUNCTIONS", "Functions Inspector"),
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
        if (listener.webviewPanel.active) {
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

            const filename: string = this.doExportToTxt(
              this.inspectServer,
              command.content.rows
            );
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

      Object.keys(value).forEach((key: string) => {
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

  public updateInspectInfo() {
    if (this.inspectServer === null) {
      return;
    }

    let proc: any;

    if (this._options.objectsInspector) {
      proc = () => {
        sendInspectorObjectsRequest(
          this.inspectServer,
          this._options.includeOutScope
        ).then(
          (result: IObjectData[]) => {
            this._panel.webview.postMessage({
              command: InspectorPanelAction.UpdateInspectorInfo,
              data: {
                serverName: this.inspectServer.name,
                environment: this.inspectServer.environment,
                includeOutScope: this._options.includeOutScope,
                dataRows: result,
              },
            });
          },
          (err: Error) => {
            languageClient.error(err.message, err);
            vscode.window.showErrorMessage(
              err.message + localize("SEE_LOG", ". See log for details.")
            );
          }
        );
      };
    } else {
      proc = () =>
        sendInspectorFunctionsRequest(
          this.inspectServer,
          !this._options.includeOutScope
        ).then(
          (rows: IFunctionData[]) => {
            this._panel.webview.postMessage({
              command: InspectorPanelAction.UpdateInspectorInfo,
              data: {
                serverName: this.inspectServer.name,
                environment: this.inspectServer.environment,
                includeOutScope: this._options.includeOutScope,
                dataRows: rows,
              },
            });
          },
          (err: Error) => {
            languageClient.error(err.message, err);
            vscode.window.showErrorMessage(
              err.message + localize("SEE_LOG", ". See log for details.")
            );
          }
        );
    }

    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Window,
        title: `${localize(
          "REQUESTING_DATA_FROM_SERVER",
          "Requesting data from the server [{0}]",
          this.inspectServer.name
        )}`,
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
    INSPECTOR_FUNCTIONS: localize(
      "INSPECTOR_FUNCTIONS",
      "Functions Inspector "
    ),
    INSPECTOR_OBJECTS: localize("INSPECTOR_OBJECTS", "Objects Inspector"),
    NO_INFO_FROM_RPO: localize(
      "NO_INFO_FROM_RPO",
      "There is no information about the RPO."
    ),
    ACTIONS: localize("ACTIONS", "Actions"),
    DRAG_HEADERS: localize("DRAG_HEADERS", "Drag headers ..."),
    FILTER: localize("FILTER", "Filter"),
    FILTERING_ON_OFF: localize("FILTERING_ON_OFF", "Filtering on/off"),
    FIRST: localize("FIRST", "First"),
    FIRST_PAGE: localize("FIRST_PAGE", "First page"),
    FROM_TO_OF_COUNT: localize("FROM_TO_OF_COUNT", "from-to de count"),
    GROUPED_BY: localize("GROUPED_BY", "Grouped by:"),
    GROUPING_ON_OFF: localize("GROUPING_ON_OFF", "Grouping on/off"),
    TREE_ON_OFF: localize("TREE_ON_OFF", "Tree server on/off"),
    LAST: localize("LAST", "Last"),
    LAST_PAGE: localize("LAST_PAGE", "Last page"),
    LINES_PAGE: localize("LINES_PAGE", "lines/p."),
    NEXT: localize("NEXT", "Next"),
    NEXT_PAGE: localize("NEXT_PAGE", "Next page"),
    PREVIOUS: localize("PREVIOUS", "Previous"),
    PREVIOUS_PAGE: localize("PREVIOUS_PAGE", "Previous page"),
    RESET_CONFIGURATIONS: localize(
      "RESET_CONFIGURATIONS",
      "Reset configurations"
    ),
    SEARCH: localize("SEARCH", "Search"),
    SEARCH_ALL_COLUMNS: localize("SEARCH_ALL_COLUMNS", "Search in all columns"),
    SERVER: localize("SERVER", "Server"),
    SHOW_HIDE_COLUMNS: localize("SHOW_HIDE_COLUMNS", "Show/hide columns"),
    INITIALIZING: localize("INITIALIZING", "(initializing)"),
    SHOW_COLUMNS: localize("SHOW_COLUMNS", "Show Columns"),
    RESOURCES: localize("RESOURCES", "Resources"),
    EXPORT_TXT: localize("EXPORT_TXT", "Export as Text"),
    RPO_LOG: localize("RPO_LOG", "Repository Log"),
  };
}
