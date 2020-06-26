import * as vscode from "vscode";
import * as path from "path";
import {
  sendReconnectRequest,
  IReconnectInfo,
  sendLockServer,
  sendStopServer,
  sendKillConnection,
  sendAppKillConnection,
} from "../protocolMessages";
import { MonitorPanelAction, IMonitorPanelAction } from "./actions";
import { isNullOrUndefined } from "util";
import IMonitorUser from "./monitorUser";
import Utils from "../utils";
import {
  sendDisconnectRequest,
  ConnTypeIds,
  sendGetUsersRequest,
} from "../protocolMessages";
import { languageClient } from "../extension";
import { ServerItem } from "../serverItemProvider";

const DEFAULT_SPEED = 15;

let monitorLoader: MonitorLoader = undefined;

export function openMonitorView() {
  const server = Utils.getCurrentServer();

  if (isNullOrUndefined(monitorLoader)) {
    monitorLoader = new MonitorLoader();
    monitorLoader.toggleServerToMonitor(server);
  } else {
    monitorLoader.toggleServerToMonitor(server);
    monitorLoader.reveal();
  }
}

export class MonitorLoader {
  protected readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];
  private _isDisposed: boolean = false;
  private _monitorServer: any = null;
  private _speed: number = DEFAULT_SPEED;
  private _lock: boolean = false;
  private _timeoutSched: any = undefined;

  public get monitorServer(): any {
    return this._monitorServer;
  }

  public set monitorServer(value: any) {
    if (this._monitorServer !== value) {
      this._monitorServer = value;
      this.updateUsers(true);
    }
  }

  constructor() {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;

    this._disposables.push(
      Utils.onDidSelectedServer((newServer: ServerItem) => {
        monitorLoader.toggleServerToMonitor(newServer);
      })
    );

    this._panel = vscode.window.createWebviewPanel(
      "monitorLoader",
      "Monitor",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, "out", "webpack")),
        ],
      }
    );

    // this._panel.iconPath = {
    //   light: vscode.Uri.parse(
    //     path.join(
    //       "file:///",
    //       __filename,
    //       "..",
    //       "..",
    //       "..",
    //       "resources",
    //       "light",
    //       "lock.svg"
    //     )
    //   ),
    //   dark: vscode.Uri.parse(
    //     path.join(
    //       "file:///",
    //       __filename,
    //       "..",
    //       "..",
    //       "..",
    //       "resources",
    //       "dark",
    //       "lock.svg"
    //     )
    //   ),
    // };

    this._panel.webview.html = this.getWebviewContent();

    this._panel.onDidChangeViewState((listener: vscode.WebviewPanelOnDidChangeViewStateEvent) => {
      if (this.monitorServer !== null) {
        this.updateUsers(listener.webviewPanel.visible);
      }
    },
      undefined,
      this._disposables
    );

    this._panel.webview.onDidReceiveMessage(
      (command: IMonitorPanelAction) => {
        this.handleMessage(command);
      },
      undefined,
      this._disposables
    );

    this._panel.onDidDispose((event) => {
      this._isDisposed = true;

      if (this.monitorServer) {
        vscode.window.setStatusBarMessage(
          `Desconectando monitor do servidor [${this.monitorServer.name}]`,
              sendDisconnectRequest(this.monitorServer)
        );
      }

      if (this._timeoutSched) {
        clearTimeout(this._timeoutSched);
      }

      monitorLoader = undefined;
    });

    this.speed = DEFAULT_SPEED;
  }

  public reveal() {
    if (!this._isDisposed) {
      this._panel.reveal();
    }
  }

  public set speed(v: number) {
    if (this._speed !== v) {
      this._speed = v;
      if (this._speed === 0) {
        vscode.window.showWarningMessage(
          "A atualização ocorrerá por solicitação."
        );
      } else {
        vscode.window.showWarningMessage(
          `A atualização ocorrerá a cada ${this._speed} segundos.`
        );
      }
    }
    this._panel.webview.postMessage({
      command: MonitorPanelAction.SetSpeedUpdate,
      data: v,
    });
  }

  public set lock(v: boolean) {
    this._lock = v;

    this._panel.webview.postMessage({
      command: MonitorPanelAction.LockServer,
      data: this._lock,
    });
  }

  public toggleServerToMonitor(serverItem: ServerItem) {
    if (this.monitorServer) {
      vscode.window.setStatusBarMessage(
        `Desconectando monitor do servidor [${this.monitorServer.name}]`,
        sendDisconnectRequest(this.monitorServer)
      );
    }

    this.monitorServer = null;

    if (serverItem) {
      const monitorItem: ServerItem = Utils.deepCopy(
        Utils.getServerForID(serverItem.id)
      ) as ServerItem;

      monitorItem.id += "_monitor";
      monitorItem.name += "_monitor";

      vscode.window.setStatusBarMessage(
        `Conectando monitor ao servidor [${serverItem.name}]`,
        sendReconnectRequest(
          monitorItem,
          serverItem.token,
          ConnTypeIds.CONNT_MONITOR
        ).then((result: IReconnectInfo) => {
          if (result.sucess) {
            monitorItem.token = result.token;
            this.monitorServer = monitorItem;
          } else {
            vscode.window.showErrorMessage(
              `Não foi possivel efetuar a conexão [${this.monitorServer.name} ao monitor.`
            );
          }
        }
        )
      );
    }
  }

  private setLockServer(
    server: ServerItem,
    lock: boolean
  ) {
    sendLockServer(server, lock).then((result: boolean) => {
      if (result) {
        vscode.window.showInformationMessage("OK");
      } else {
        vscode.window.showInformationMessage("ERRO");
      }
    }, (error) => {

    });
  }

  private stopServer(server: ServerItem) {
    return sendStopServer(server)
      .then(
        (response: any) => {
          return response.message === "OK";
        },
        (error: Error) => {
          return null;
        }
      );
  }

  private killConnection(server: ServerItem, recipients: any[]): void {
    recipients.forEach((recipient) => {
      sendKillConnection(server, recipient)
        .then(
          (response: string) => {
            vscode.window.showWarningMessage(response);
          },
          (error: Error) => {
            vscode.window.showErrorMessage(error.message);
          }
        );
    });
  }

  private appKillConnection(server: ServerItem, recipients: any[]): void {
    recipients.forEach((recipient) => {
      sendAppKillConnection(server, recipient)
        .then(
          (response: any) => {
            vscode.window.showWarningMessage(response);
          },
          (error: Error) => {
            vscode.window.showErrorMessage(error.message);
          }
        );
    });
  }

  private sendMessage(
    server: ServerItem,
    recipients: any[],
    message: string
  ): void {
    recipients.forEach((recipient) => {
      languageClient
        .sendRequest("$totvsmonitor/sendUserMessage", {
          sendUserMessageInfo: {
            connectionToken: server.token,
            userName: recipient.username,
            computerName: recipient.machine,
            threadId: recipient.threadId,
            serverName: recipient.server,
            message: message,
          },
        })
        .then(
          (response: any) => {
            vscode.window.showWarningMessage(response.message);
          },
          (error: Error) => {
            vscode.window.showErrorMessage(error.message);
          }
        );
    });
  }

  private async handleMessage(command: IMonitorPanelAction) {
    switch (command.action) {
      case MonitorPanelAction.SetSpeedUpdate: {
        this.speed = command.content.speed;
        break;
      }
      case MonitorPanelAction.UpdateUsers: {
        this.speed = this._speed;
        if (this.monitorServer !== null) {
          this.updateUsers(true);
        }
        break;
      }
      case MonitorPanelAction.LockServer: {
        const result = await this.setLockServer(
          this.monitorServer,
          command.content.lock
        );
        //this.lock = result;

        break;
      }
      case MonitorPanelAction.SendMessage: {
        this.sendMessage(
          this.monitorServer,
          command.content.recipients,
          command.content.message
        );
        break;
      }
      case MonitorPanelAction.KillConnection: {
        if (command.content.killNow) {
          this.appKillConnection(
            this.monitorServer,
            command.content.recipients
          );
        } else {
          this.killConnection(
            this.monitorServer,
            command.content.recipients
          );
        }

        break;
      }
      case MonitorPanelAction.StopServer: {
        this.stopServer(this.monitorServer);

        break;
      }
      default:
        console.log("***** ATENÇÃO: monitorLoader.tsx");
        console.log("\tComando não reconhecido: " + command.action);
        console.log("\t" + command.content);
        break;
    }
  }

  public updateUsers(scheduler: boolean) {
    const doScheduler = () => {
      if (scheduler && this._speed > 0) {
        this._timeoutSched = setTimeout(
          updateScheduledUsers,
          this._speed * 1000,
          this,
          true
        );
      }
    };

    if (this._timeoutSched) {
      clearTimeout(this._timeoutSched);
    }

    if (this.monitorServer === null) {
      this._panel.webview.postMessage({
        command: MonitorPanelAction.UpdateUsers,
        data: { serverName: "(aguardando seleção)", users: [] },
      });
    } else {
      vscode.window.setStatusBarMessage(
        `Requisitando dados ao servidor [${this.monitorServer.name}]`,
        sendGetUsersRequest(this.monitorServer).then(
          (users: any) => {
            if (users) {
              this._panel.webview.postMessage({
                command: MonitorPanelAction.UpdateUsers,
                data: { serverName: this.monitorServer.name.replace("_monitor", ""), users: users },
              });
            }
            doScheduler();
          },
          (err: Error) => {
            languageClient.error(err.message, err);
            vscode.window.showErrorMessage(err.message + '\nVer log para detalhes.');

            if (this._speed > 0) {
              languageClient.info("Atualização automática paralizada.");
              languageClient.info("Favor acionar [Atualização], para reativar.");
            }
          }
        )
      );
    }
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "out", "webpack", "monitorPanel.js")
    );

    const servers: ServerItem[] = this.monitorServer
      ? [this.monitorServer]
      : [];
    const reactAppUri = this._panel?.webview.asWebviewUri(reactAppPathOnDisk);
    const configJson = JSON.stringify({
      serverList: servers,
      speed: this._speed,
    });

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
          window.initialData = ${configJson};
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="${reactAppUri}"></script>
    </body>
    </html>`;
  }
}

function updateScheduledUsers(monitor: MonitorLoader, scheduler: boolean) {
  monitor.updateUsers(scheduler);
}
