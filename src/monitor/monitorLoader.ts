import {
  IAuthenticationInfo,
  ITokenInfo,
} from "./../langServer/protocolMessages";
import { languageClient } from "../extension";
import * as vscode from "vscode";
import * as path from "path";
import { MonitorPanelAction, IMonitorPanelAction } from "./actions";
import { isNullOrUndefined } from "util";
import IMonitorUser from "./monitorUser";
import { ServerItem } from "../serversView";
import Utils, { SelectServer } from "../utils";
import {
  sendDisconnectRequest,
  sendConnectRequest,
  ConnTypeIds,
  sendGetUsersRequest,
  sendAuthenticateRequest,
} from "../langServer/protocolMessages";

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
  private _monitorServer: any;
  private _speed: number = DEFAULT_SPEED;
  private _lock: boolean = false;
  private _timeoutSched: any = undefined;

  constructor() {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;

    this._disposables.push(
      Utils.onDidSelectedServer((newServer: SelectServer) => {
        const server = Utils.getServerById(newServer.id);
        monitorLoader.toggleServerToMonitor(server);
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

    this._panel.iconPath = {
      light: vscode.Uri.parse(
        path.join(
          "file:///",
          __filename,
          "..",
          "..",
          "..",
          "resources",
          "light",
          "lock.svg"
        )
      ),
      dark: vscode.Uri.parse(
        path.join(
          "file:///",
          __filename,
          "..",
          "..",
          "..",
          "resources",
          "dark",
          "lock.svg"
        )
      ),
    };
    this._panel.webview.html = this.getWebviewContent();

    this._panel.webview.onDidReceiveMessage(
      (command: IMonitorPanelAction) => {
        this.handleMessage(command);
      },
      undefined,
      this._disposables
    );

    this._panel.onDidDispose((event) => {
      if (this._timeoutSched) {
        clearTimeout(this._timeoutSched);
      }
      monitorLoader = undefined;
      this._isDisposed = true;
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

  public set writeLogServer(v: boolean) {
    //this._writeLogServer = v;
  }

  public set lock(v: boolean) {
    this._lock = v;

    this._panel.webview.postMessage({
      command: MonitorPanelAction.LockServer,
      data: this._lock,
    });
  }

  public toggleServerToMonitor(serverItem: SelectServer) {
    if (this._monitorServer) {
      vscode.window.setStatusBarMessage(
        `Desconectando monitor do servidor [${this._monitorServer.name}]`,
        sendDisconnectRequest(this._monitorServer)
      );
    }
    if (serverItem) {
      this._monitorServer = Utils.deepCopy(
        Utils.getServerForID(serverItem.id)
      ) as ServerItem;
      this._monitorServer.id += "_";
      this._monitorServer.name += "_";
      this._monitorServer.token = "";

      vscode.window.setStatusBarMessage(
        `Conectando monitor ao servidor [${this._monitorServer.name}]`,
        sendConnectRequest(
          this._monitorServer,
          this._monitorServer.environment,
          ConnTypeIds.CONNT_MONITOR
        ).then((result: ITokenInfo) => {
          if (result.sucess) {
            this._monitorServer.token = result.token;
            this._monitorServer.secure = result.needAuthentication ? 1 : 0;
            if (result.needAuthentication) {
              vscode.window.setStatusBarMessage(
                `Autenticando monitor no servidor [${this._monitorServer.name}]`,
                sendAuthenticateRequest(
                  this._monitorServer,
                  this._monitorServer.environment,
                  this._monitorServer.username,
                  this._monitorServer.password
                ).then(
                  (value: IAuthenticationInfo) => {
                    if (value.sucess) {
                      this._monitorServer.token = value.token;
                      Utils.saveConnectionToken(
                        this._monitorServer.id,
                        value.token,
                        this._monitorServer.environment
                      );
                      this.updateUsers(true);
                    } else {
                      this._monitorServer.token = "";
                      vscode.window.showErrorMessage(
                        `Não foi possivel efetuar a autenticação do usuário ${this._monitorServer.username}`
                      );
                    }
                  },
                  (error) => {
                    vscode.window.showErrorMessage(error);
                  }
                )
              );
            }
          } else {
            this._monitorServer.token = "";
            vscode.window.showErrorMessage(
              `Não foi possivel conexão de monitoramento para ${this._monitorServer.name}`
            );
          }
        })
      );
    }
  }

  private async setLockServer(
    server: ServerItem,
    lock: boolean
  ): Promise<boolean> {
    return languageClient
      .sendRequest("$totvsmonitor/setConnectionStatus", {
        setConnectionStatusInfo: {
          connectionToken: server.token,
          status: lock,
        },
      })
      .then(
        (response: any) => {
          return response.message === "OK";
        },
        (error: Error) => {
          return null;
        }
      );
  }

  private async stopServer(server: ServerItem): Promise<boolean> {
    return languageClient
      .sendRequest("$totvsmonitor/stopServer", {
        stopServerInfo: {
          connectionToken: server.token,
        },
      })
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
      languageClient
        .sendRequest("$totvsmonitor/killUser", {
          killUserInfo: {
            connectionToken: server.token,
            userName: recipient.username,
            computerName: recipient.computerName,
            threadId: recipient.threadId,
            serverName: recipient.server,
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

  private appKillConnection(server: ServerItem, recipients: any[]): void {
    recipients.forEach((recipient) => {
      languageClient
        .sendRequest("$totvsmonitor/appKillUser", {
          appKillUserInfo: {
            connectionToken: server.token,
            userName: recipient.userServer,
            computerName: recipient.machine,
            threadId: recipient.threadId,
            serverName: recipient.server,
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
        this.updateUsers(true);

        break;
      }
      case MonitorPanelAction.LockServer: {
        const result = await this.setLockServer(
          command.content.server,
          command.content.lock
        );
        this.lock = result;

        break;
      }
      case MonitorPanelAction.SendMessage: {
        this.sendMessage(
          command.content.server,
          command.content.recipients,
          command.content.message
        );
        break;
      }
      case MonitorPanelAction.KillConnection: {
        if (command.content.killNow) {
          this.appKillConnection(
            command.content.server,
            command.content.recipients
          );
        } else {
          this.killConnection(
            command.content.server,
            command.content.recipients
          );
        }

        this.updateUsers(false);

        break;
      }
      case MonitorPanelAction.StopServer: {
        const server = command.content.server;
        this.stopServer(server);

        break;
      }
      case MonitorPanelAction.ToggleWriteLogServer: {
        this.writeLogServer = !this.writeLogServer;

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
    let result = [];

    vscode.window.setStatusBarMessage(
      `Requisitando dados ao servidor [${this._monitorServer.name}]`,
      sendGetUsersRequest(this._monitorServer).then(
        (users: any) => {
          if (users && users.lenght > 0) {
            this._panel.webview.postMessage({
              command: MonitorPanelAction.UpdateUsers,
              data: users,
            });
            if (this.writeLogServer) {
              this.doWriteLogServer(users);
            }
          } else {
            vscode.window.showInformationMessage("Não há dados a serem apresentados.");
          }

          if (scheduler && this._speed > 0) {
            this._timeoutSched = setTimeout(
              updateScheduledUsers,
              this._speed * 1000,
              this,
              true
            );
          }
        },
        (err: Error) => {
          languageClient.error(err.message, err);
          vscode.window.showErrorMessage(err.message + '\nVer log para detalhes.');

          if (this._timeoutSched) {
            clearTimeout(this._timeoutSched);
          }
          if (this._speed > 0) {
            languageClient.info("Atualização automática paralizada.");
            languageClient.info("Favor acionar [Atualização], para reativar.");
          }
        }
      )
    );
  }

  doWriteLogServer(users: IMonitorUser[]) {
    throw new Error("Method not implemented.");
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "out", "webpack", "monitorPanel.js")
    );

    const servers: ServerItem[] = this._monitorServer
      ? [this._monitorServer]
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
