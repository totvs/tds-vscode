import * as vscode from "vscode";
import * as path from "path";
import {
  sendReconnectRequest,
  IReconnectInfo,
  sendLockServer,
  sendStopServer,
  sendKillConnection,
  sendAppKillConnection,
  sendUserMessage,
  sendIsLockServer,
} from "../protocolMessages";
import { MonitorPanelAction, IMonitorPanelAction } from "./actions";
import { isNullOrUndefined } from "util";
import Utils from "../utils";
import {
  sendDisconnectRequest,
  ConnTypeIds,
  sendGetUsersRequest,
} from "../protocolMessages";
import { languageClient } from "../extension";
import serverProvider, { ServerItem } from "../serverItemProvider";
import * as nls from "vscode-nls";

const localize = nls.loadMessageBundle();

const DEFAULT_SPEED = 30;

let monitorLoader: MonitorLoader = undefined;

export function openMonitorView(context: vscode.ExtensionContext) {
  const server = Utils.getCurrentServer();

  if (isNullOrUndefined(monitorLoader)) {
    monitorLoader = new MonitorLoader(context);
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
  private _enableUpdateUsers: boolean = true;
  private _lock: boolean = false;
  private _timeoutSched: any = undefined;
  private _context: vscode.ExtensionContext;

  public get monitorServer(): any {
    return this._monitorServer;
  }

  public set monitorServer(value: any) {
    if (this._monitorServer !== value) {
      this._monitorServer = value;
      this.updateUsers(true);
      this.isLockServer(this._monitorServer);
    }
  }

  constructor(context: vscode.ExtensionContext) {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;
    this._context = context;

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

    this._panel.webview.html = this.getWebviewContent();
    this._panel.onDidChangeViewState(
      (listener: vscode.WebviewPanelOnDidChangeViewStateEvent) => {
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
          localize(
            "MSG_DISCONECT_MONITOR",
            "Disconnecting monitor from server [{0}]",
            this.monitorServer.name
          ),
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

      this.updateSpeedStatus();
    }
  }

  public get speed(): number {
    return this._speed;
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
        localize(
          "DISCONNECTING_SERVER",
          "Disconnecting [{0}] from the server ",
          this.monitorServer.name
        ),
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
              localize(
                "NOT_POSSIBLE_CONNECTION",
                "It was not possible to make the monitoring connection at [{0}].",
                this.monitorServer.name
              )
            );
          }
        })
      );
    }
  }

  private setLockServer(server: ServerItem, lock: boolean) {
    sendLockServer(server, lock).then(
      (result: boolean) => {
        if (result) {
          this.isLockServer(server);
        } else {
          vscode.window.showErrorMessage(
            localize(
              "NOT_BLOCK_NEW_CONNECTIONS",
              "Could not block new connections."
            )
          );
          console.log(result);
        }
      },
      (error) => {
        vscode.window.showErrorMessage(error.message);
      }
    );
  }

  private isLockServer(server: ServerItem) {
    sendIsLockServer(server).then(
      (response: boolean) => {
        this.lock = response;
        if (response) {
          vscode.window.showInformationMessage(
            localize(
              "NEW_CONNECTIONS_BLOCKED",
              "Server with new connections blocked."
            )
          );
        }
      },
      (error: Error) => {
        vscode.window.showErrorMessage(error.message);
      }
    );
  }

  private stopServer(server: ServerItem) {
    sendStopServer(server).then(
      (response: string) => {
        if (response !== "OK") {
          vscode.window.showErrorMessage(
            localize(
              "SERVER_NOT_BE_SHUTDOWN",
              "The server could not be shut down. Return: {0}",
              response
            )
          );
        } else {
          serverProvider.connectedServerItem = undefined;
        }
      },
      (error: Error) => {
        vscode.window.showErrorMessage(error.message);
      }
    );
  }

  private killConnection(
    server: ServerItem,
    recipients: any[],
    killNow: boolean
  ): void {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize("CLOSING_CONNECTIONS", "Closing connections."),
        cancellable: true,
      },
      (progress, token) => {
        const total: number = recipients.length;
        let cnt: number = 0;
        let inc: number = recipients.length / 100;

        token.onCancellationRequested(() => {
          console.log("User canceled the operation");
        });

        recipients.forEach((recipient) => {
          cnt++;
          progress.report({
            message: localize(
              "SHUTTING_DOWN",
              "Shutting down #{0}/{1}",
              cnt,
              total
            ),
            increment: inc,
          });

          if (killNow) {
            sendKillConnection(server, recipient).then(
              (response: string) => {
                //
              },
              (error: Error) => {
                vscode.window.showErrorMessage(error.message);
              }
            );
          } else {
            sendAppKillConnection(server, recipient).then(
              (response: string) => {
                //
              },
              (error: Error) => {
                vscode.window.showErrorMessage(error.message);
              }
            );
          }
        });

        const p = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });

        return p;
      }
    );
  }

  private sendMessage(
    server: ServerItem,
    recipients: any[],
    message: string
  ): void {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize("SENDING_MESSAGE", "Sending message to users."),
        cancellable: true,
      },
      (progress, token) => {
        const total: number = recipients.length;
        let cnt: number = 0;
        let inc: number = recipients.length / 100;

        token.onCancellationRequested(() => {
          console.log("User canceled the operation");
        });

        recipients.forEach((recipient) => {
          cnt++;
          progress.report({
            message: localize("SENDING", "Sending #{0}/{1}", cnt, total),
            increment: inc,
          });

          sendUserMessage(server, recipient, message).then(
            (response: any) => {
              //vscode.window.showWarningMessage(response);
            },
            (error: Error) => {
              vscode.window.showErrorMessage(error.message);
            }
          );
        });

        const p = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });

        return p;
      }
    );
  }

  private async handleMessage(command: IMonitorPanelAction) {
    switch (command.action) {
      case MonitorPanelAction.EnableUpdateUsers: {
        this._enableUpdateUsers = command.content.state;
        this.updateUsers(this._enableUpdateUsers);

        break;
      }
      case MonitorPanelAction.DoUpdateState: {
        const key = command.content.key;
        const state: any = command.content.state;
        this._context.workspaceState.update(key, state);

        this._panel.webview.postMessage({
          command: MonitorPanelAction.DoUpdateState,
          data: {
            key: key,
            state: state,
          },
        });

        break;
      }
      case MonitorPanelAction.SetSpeedUpdate: {
        this.speed = command.content.speed;
        this.updateUsers(true);
        break;
      }
      case MonitorPanelAction.UpdateUsers: {
        this.updateUsers(true);
        break;
      }
      case MonitorPanelAction.LockServer: {
        const result = this.setLockServer(
          this.monitorServer,
          command.content.lock
        );

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
        this.killConnection(
          this.monitorServer,
          command.content.recipients,
          command.content.killNow
        );

        break;
      }
      case MonitorPanelAction.StopServer: {
        this.stopServer(this.monitorServer);

        break;
      }
      default:
        console.log("***** ATTENTION: monitorLoader.tsx");
        console.log("\tUnrecognized command: " + command.action);
        console.log("\t" + command.content);
        break;
    }
  }

  public updateUsers(scheduler: boolean) {
    if (this.monitorServer == null) {
      return;
    }

    const doScheduler = () => {
      if (scheduler && this.speed > 0) {
        this._timeoutSched = setTimeout(
          updateScheduledUsers,
          this.speed * 1000,
          this,
          true
        );
      }
    };

    if (this._timeoutSched) {
      clearTimeout(this._timeoutSched);
    }

    if (this._enableUpdateUsers) {
      if (this.monitorServer === null) {
        this._panel.webview.postMessage({
          command: MonitorPanelAction.UpdateUsers,
          data: {
            serverName: localize("AWAITING_SELECTION", "(awaiting selection)"),
            users: [],
          },
        });
      } else {
        vscode.window.setStatusBarMessage(
          localize(
            "REQUESTING_DATA_FROM_SERVER",
            "Requesting data from the server [{0}]",
            this.monitorServer.name
          ),
          sendGetUsersRequest(this.monitorServer).then(
            (users: any) => {
              if (users) {
                const complement = users.length
                  ? localize("THREADS", " ({0} thread(s))", users.length)
                  : localize("THREADS_NONE", " (none thread)");

                this._panel.webview.postMessage({
                  command: MonitorPanelAction.UpdateUsers,
                  data: {
                    serverName:
                      this.monitorServer.name.replace("_monitor", "") +
                      complement,
                    users: users,
                  },
                });
              }
              this.updateSpeedStatus();
              doScheduler();
            },
            (err: Error) => {
              languageClient.error(err.message, err);
              vscode.window.showErrorMessage(
                err.message + localize("SEE_LOG", ". See log for details.")
              );

              if (this.speed > 0) {
                languageClient.info(
                  localize(
                    "AUTOMATIC_UPDATE_STOPPED",
                    "Automatic update stopped."
                  )
                );
                languageClient.info(
                  localize(
                    "PLEASE_CLICK_REACTIVATE",
                    "Please click on [Update] to reactivate."
                  )
                );
              }
            }
          )
        );
      }
    }
  }

  private updateSpeedStatus() {
    var nextUpdate = new Date(Date.now());

    const msg1 = localize(
      "MSG_1",
      "Monitor: Updated as {0}.",
      `${nextUpdate.getHours()}:${nextUpdate.getMinutes()}:${nextUpdate.getSeconds()}`
    );
    let msg2 = "";

    if (this.speed === 0) {
      msg2 = localize(
        "MSG_2_REQUEST",
        "The next one will take place on request."
      );
    } else {
      nextUpdate.setSeconds(nextUpdate.getSeconds() + this.speed);
      msg2 = localize(
        "MSG_2_NEXT",
        "The next one will occur {0}",
        `${nextUpdate.getHours()}:${nextUpdate.getMinutes()}:${nextUpdate.getSeconds()}`
      );
    }

    vscode.window.setStatusBarMessage(`${msg1} ${msg2}`);
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
    const configJson: any = {
      serverList: servers,
      memento: {}, //this._context.workspaceState.get("monitorTable", {}),
      translation: nls.loadMessageBundle(),
    };

    if (configJson["memento"].hasOwnProperty("customProps")) {
      const customProps = configJson["memento"]["customProps"];
      if (customProps.hasOwnProperty("speed")) {
        this.speed = customProps["speed"];
      } else {
        customProps["speed"] = this.speed;
      }
    } else {
      configJson["memento"] = { customProps: { speed: this.speed } };
    }

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

function updateScheduledUsers(monitor: MonitorLoader, scheduler: boolean) {
  monitor.updateUsers(scheduler);
}
