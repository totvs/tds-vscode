import * as vscode from "vscode";
import * as path from "path";
import { sendRpoInfo } from "../protocolMessages";
import { RpoInfoPanelAction, IRpoInfoPanelAction } from "./actions";
import { ServerItem } from "../serverItem";
import { ServersConfig } from "../utils";
import { languageClient } from "../extension";
import { IProgramApp, IRpoInfoData, IRpoPatch } from "./rpoPath";

let rpoInfoLoader: RpoInfoLoader = undefined;

export function openRpoInfoView(context: vscode.ExtensionContext) {
  const server = ServersConfig.getCurrentServer();

  if (rpoInfoLoader === null || rpoInfoLoader == undefined) {
    rpoInfoLoader = new RpoInfoLoader(context);
  }

  rpoInfoLoader?.toggleServerToMonitor(server);
}

export class RpoInfoLoader implements vscode.Disposable {
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
      ServersConfig.onDidSelectedServer((newServer: ServerItem) => {
        if (rpoInfoLoader) {
          rpoInfoLoader.toggleServerToMonitor(newServer);
        }
      })
    );

    this._panel = vscode.window.createWebviewPanel(
      "rpoInfoLoader",
      vscode.l10n.t("Repository Log"),
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
          this.updateRpoInfo();
        }
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

    this._panel.onDidDispose(() => {
      this._isDisposed = true;

      rpoInfoLoader = undefined;
    });
  }

  dispose() {
    this._isDisposed = true;
    this._disposables.forEach((element: vscode.Disposable) =>
      element.dispose()
    );
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
          vscode.l10n.t("Waiting for export JSON file")
        );

        break;
      }
      case RpoInfoPanelAction.ExportToTxt: {
        vscode.window.setStatusBarMessage(
          "$(gear~spin)" + "Export repository log. Wait...",
          this.doExportToTxt(
            this.monitorServer,
            command.content.rpoInfo,
            command.content.rpoPath
          ).then(
            (filename: string) => {
              var setting: vscode.Uri = vscode.Uri.parse("file:" + filename);
              vscode.workspace.openTextDocument(setting).then(
                (a: vscode.TextDocument) => {
                  vscode.window.showTextDocument(a, 1, false);
                },
                (error: any) => {
                  vscode.window.showErrorMessage(error);
                }
              );
            },
            (reason: any) => {
              vscode.window.showErrorMessage(reason);
            }
          )
        );

        break;
      }
      default:
        console.log("***** ATTENTION: rpoInfoLoader.tsx");
        console.log("\tUnrecognized command: " + command.action);
        console.log("\t" + command.content);
        break;
    }
  }

  public doExportToTxt(
    server: any,
    rpoInfo: any,
    rpoPath: IRpoPatch
  ): Thenable<string> {
    return new Promise<string>((resolve) => {
      const fs = require("fs");
      const tmp = require("tmp");
      const file = tmp.fileSync({ prefix: "vscode-tds-rpo", postfix: ".log" });

      const writeLine = (line: string) => {
        fs.appendFileSync(file.fd, line);
        fs.appendFileSync(file.fd, "\n");
      };
      const SEPARATOR_LINE = "-".repeat(50);

      writeLine(SEPARATOR_LINE);
      writeLine(`Server ........: ${server.name}`);
      writeLine(`Port ..........: ${server.port}`);
      writeLine(`Address .......: ${server.address}`);
      writeLine(`Build .........: ${server.buildVersion}`);
      writeLine(`OS Platform ...: ${server.osType}`);
      writeLine(SEPARATOR_LINE);

      writeLine(`Environment ...: ${rpoInfo.environment}`);
      writeLine(`  RPO Version..: ${rpoInfo.version}`);
      writeLine(`  Generated at : ${rpoInfo.date}`);
      writeLine(SEPARATOR_LINE);

      writeLine(`File`);
      writeLine(
        `  Applyed .....: ${rpoPath.typePatch == 1
          ? "Update"
          : rpoPath.typePatch == 2
            ? "Package"
            : "Correction"
        }`
      );
      writeLine(`  Build .......: ${rpoPath.buildFileApplication}`);
      writeLine(`  Date ........: ${rpoPath.dateFileApplication}`);
      writeLine(SEPARATOR_LINE);

      writeLine(`Generation`);
      writeLine(`  Build .......: ${rpoPath.buildFileGeneration}`);
      writeLine(`  Date ........: ${rpoPath.dateFileGeneration}`);
      writeLine(SEPARATOR_LINE);

      if (rpoPath.skipOld) {
        writeLine("This file overwrote more recent resources");
        writeLine(SEPARATOR_LINE);
      }

      rpoPath.programsApp.forEach((value: IProgramApp) => {
        writeLine(value.name.padEnd(29, " ") + "\t" + value.date);
      });
      writeLine(SEPARATOR_LINE);

      const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
      const now = new Date().toLocaleString();

      writeLine("");
      writeLine(SEPARATOR_LINE);
      writeLine(`Total resources: ${rpoPath.programsApp.length}`);
      writeLine(`Generated by TDS-VSCode version${ext.packageJSON["version"]}`);
      writeLine(`at ${now}`);
      writeLine(SEPARATOR_LINE);

      return resolve(file.name);
    });
  }

  private prepareNodes(parent: any, rpoInfo: IRpoInfoData) {
    const map: any = {};

    const dateRpo: Date = new Date(Date.parse(rpoInfo.dateGeneration));
    rpoInfo.dateGeneration =
      dateRpo.toLocaleDateString() + " " + dateRpo.toLocaleTimeString();

    rpoInfo.rpoPatchs.forEach((rpoPatch: IRpoPatch) => {
      const name: string = rpoPatch.dateFileApplication.split("T")[0];
      let isCustom: boolean = rpoPatch.typePatch > 10;
      if (isCustom) {
        rpoPatch.typePatch = rpoPatch.typePatch - 10;
      }

      let key = name.substr(0, 7);
      if (!map[key]) {
        map[key] = { id: "node_" + key, name: key, children: [] };
        parent.children.push(map[key]);
      }

      map[key].children.push({
        id: "node_" + key + map[key].children.length,
        name: name + (isCustom ? " (Custom)" : ""),
        children: [],
        rpoPatch: rpoPatch,
      });

      const dateApp: Date = new Date(Date.parse(rpoPatch.dateFileApplication));
      const dateGen: Date = new Date(Date.parse(rpoPatch.dateFileGeneration));
      rpoPatch.dateFileApplication = dateApp.toLocaleDateString();
      rpoPatch.dateFileGeneration = dateGen.toLocaleDateString();

      rpoPatch.programsApp.forEach((program: IProgramApp) => {
        const date: Date = new Date(Date.parse(program.date));
        program.date =
          date.toLocaleDateString() + " " + date.toLocaleTimeString();
      });
    });
  }

  public updateRpoInfo() {
    if (this.monitorServer === null) {
      return;
    }

    vscode.window.setStatusBarMessage(
      "$(gear~spin)" +
      vscode.l10n.t("Requesting data from the server [{0}]", this.monitorServer.name),
      sendRpoInfo(this.monitorServer).then(
        (rpoInfo: IRpoInfoData) => {
          const parent: any = {
            id: "node_" + rpoInfo.environment,
            name: rpoInfo.environment,
            children: [],
          };
          this.prepareNodes(parent, rpoInfo);
          this._panel.webview.postMessage({
            command: RpoInfoPanelAction.UpdateRpoInfo,
            data: {
              serverName: this.monitorServer.name,
              rpoInfo: rpoInfo,
              treeNodes: parent,
            },
          });
        },
        (err: Error) => {
          languageClient.error(err.message, err);
          vscode.window.showErrorMessage(
            err.message + vscode.l10n.t(". See log for details.")
          );
        }
      )
    );
  }

  private updateStatus(msg: string) {
    let icon: string = "$(gear~spin)";

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
    RPO_LOG: vscode.l10n.t("Repository Log"),
  };
}
