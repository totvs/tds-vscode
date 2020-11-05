import * as vscode from "vscode";
import * as path from "path";
import { sendRpoInfo } from "../protocolMessages";
import { RpoInfoPanelAction, IRpoInfoPanelAction } from "./actions";
import { ServerItem } from "../serverItemProvider";
import * as nls from "vscode-nls";
import Utils from "../utils";
import { languageClient } from "../extension";
import {IRpoInfoData} from "./rpoPath";

const localize = nls.loadMessageBundle();

let rpoInfoLoader: RpoInfoLoader = undefined;

export function openRpoInfoView(context: vscode.ExtensionContext) {
  const server = Utils.getCurrentServer();

  if ((rpoInfoLoader === null) || (rpoInfoLoader == undefined)) {
    rpoInfoLoader = new RpoInfoLoader(context);
  }

  rpoInfoLoader.toggleServerToMonitor(server);
}

export class RpoInfoLoader {
  protected readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];
  private _isDisposed: boolean = false;
  private _monitorServer: any = null;
  private _context: vscode.ExtensionContext;

  public get monitorServer(): any {
    return this._monitorServer;
  }

  public set monitorServer(value: any) {
    if (this._monitorServer !== value) {
      this._monitorServer = value;
      this.updateRpoInfo();
    }
  }

  constructor(context: vscode.ExtensionContext) {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;
    this._context = context;

    this._disposables.push(
      Utils.onDidSelectedServer((newServer: ServerItem) => {
        rpoInfoLoader.toggleServerToMonitor(newServer);
      })
    );

    this._panel = vscode.window.createWebviewPanel(
      "rpoInfoLoader",
      localize("RPO_LOG", "Log do repositório"),
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
      },
      undefined,
      this._disposables
    );

    this._panel.webview.onDidReceiveMessage(
      (command: IRpoInfoPanelAction) => {
        this.handleMessage(command);
      },
      undefined,
      this._disposables
    );

    this._panel.onDidDispose((event) => {
      this._isDisposed = true;

      rpoInfoLoader = undefined;
    });
  }

  public toggleServerToMonitor(serverItem: ServerItem) {
    this.monitorServer = null;

    if (serverItem) {
      this.monitorServer = serverItem;
    }
  }

  private async handleMessage(command: IRpoInfoPanelAction) {
    switch (command.action) {
      case RpoInfoPanelAction.ExportToJson: {
        this.updateStatus(
          localize("EXPORT_JSON", "Waiting for export JSON file")
        );

        break;
      }
      case RpoInfoPanelAction.ExportToTxt: {
        this.updateStatus(
          localize("EXPORT_TXT", "Waiting for export text file")
        );

        break;

        break;
      }
      default:
        console.log("***** ATTENTION: rpoInfoLoader.tsx");
        console.log("\tUnrecognized command: " + command.action);
        console.log("\t" + command.content);
        break;
    }
  }

  public updateRpoInfo() {
    if (this.monitorServer === null) {
      return;
    }

    vscode.window.setStatusBarMessage(
      "$(clock)" +
        localize(
          "REQUESTING_DATA_FROM_SERVER",
          "Requesting data from the server [{0}]",
          this.monitorServer.name
        ),
      sendRpoInfo(this.monitorServer).then(
        (rpoInfo: IRpoInfoData) => {
            this._panel.webview.postMessage({
              command: RpoInfoPanelAction.UpdateRpoInfo,
              data: {
                serverName: this.monitorServer.name,
                rpoInfo: rpoInfo,
              },
            });
          },
        (err: Error) => {
          languageClient.error(err.message, err);
          vscode.window.showErrorMessage(
            err.message + localize("SEE_LOG", ". See log for details.")
          );
        }
      )
    );
  }

  private updateStatus(msg: string) {
    let icon: string = "$(clock)";

    vscode.window.setStatusBarMessage(`${icon} ${msg}`);
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "out", "webpack", "rpoInfoPanel.js")
    );

    const servers: ServerItem[] = this.monitorServer
      ? [this.monitorServer]
      : [];

    const reactAppUri = this._panel?.webview.asWebviewUri(reactAppPathOnDisk);
    const configJson: any = {
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
  };
}
