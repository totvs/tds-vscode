import * as vscode from "vscode";
import * as path from "path";
import { ICommand, CommandAction } from "./command";
import { ServerItem } from "../serversView";
import { isNullOrUndefined } from "util";

let monitorView: CreateMonitorLoader = undefined;
const monitorViews: Array<ServerItem> = new Array<ServerItem>();

export function updateMonitorView() {
  if (isNullOrUndefined(monitorView)) {
    monitorView = new CreateMonitorLoader();
  }

   monitorView.serverList = monitorViews;
}

export function toggleServerToMonitor(server: ServerItem) {
  const pos = monitorViews.indexOf(server);

  if (pos === -1) {
    monitorViews.push(server);
  } else {
    monitorViews.splice(pos, 1);
  }

  updateMonitorView();
}

let EXEC_NUM = 1;

export class CreateMonitorLoader {
  protected readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];
  private _isDisposed: boolean = false;

  public set serverList(serverList: Array<ServerItem>) {
    console.log("setServerList " + EXEC_NUM);
    EXEC_NUM++;
    this._panel.webview.postMessage({
      command: CommandAction.UpdateData,
      data: serverList
    });
  }

  constructor() {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;

    this._panel = vscode.window.createWebviewPanel(
      "createMonitorView",
      "Monitor",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(
            path.join(this._extensionPath, "out", "webpack")
          )
        ]
      }
    );

    this._panel.webview.html = this.getWebviewContent();

    this._panel.onDidDispose((event) => {
      this._isDisposed = true;
    });

    this._panel.webview.onDidReceiveMessage(
      (command: ICommand) => {
        console.log("---> ");
        console.log(command);
        switch (command.action) {
          case CommandAction.LoadData:
            break;

        }
        //this.updatePanel(config);
      },
      undefined,
      this._disposables
    );
  }

  public reveal() {
    if(!this._isDisposed) {
      this._panel.reveal();
    }
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(
        this._extensionPath,
        "out",
        "webpack",
        "monitorView.js"
      )
    );

    const reactAppUri = reactAppPathOnDisk.with({ scheme: "vscode-resource" });

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
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="${reactAppUri}"></script>
    </body>
    </html>`;
  }
}
