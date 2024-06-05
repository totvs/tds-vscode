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
  sendSetEnvEncodesRequest,
  IEnvEncode,
} from "../protocolMessages";
import { MonitorPanelAction, IMonitorPanelAction } from "./actions";
import Utils, { ServersConfig, groupBy } from "../utils";
import {
  sendDisconnectRequest,
  ConnTypeIds,
  sendGetUsersRequest,
} from "../protocolMessages";
import { languageClient } from "../extension";
import serverProvider from "../serverItemProvider";
import { ServerItem } from "../serverItem";

const DEFAULT_SPEED = 30;
const WS_STATE_KEY = "MONITOR_TABLE";

let monitorLoader: MonitorLoader = undefined;

export function openMonitorView(context: vscode.ExtensionContext) {
  const server = ServersConfig.getCurrentServer();

  if (monitorLoader === undefined || monitorLoader === null) {
    monitorLoader = new MonitorLoader(context);
  }

  monitorLoader?.toggleServerToMonitor(server);
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
      this.updateCodePage(undefined, undefined, false);
      this.updateUsers(true);
      this.isLockServer(this._monitorServer);
    }
  }

  constructor(context: vscode.ExtensionContext) {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;
    this._context = context;

    this._disposables.push(
      ServersConfig.onDidSelectedServer((newServer: ServerItem) => {
        monitorLoader?.toggleServerToMonitor(newServer);
      })
    );

    this.registerCommands();

    this._panel = vscode.window.createWebviewPanel(
      "monitorLoader",
      vscode.l10n.t("Monitor"),
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
        this._enableUpdateUsers = listener.webviewPanel.visible;

        this.updateUsers(listener.webviewPanel.visible);

        if (!listener.webviewPanel.visible) {
          this.updateSpeedStatus(vscode.l10n.t("Monitor tab is not visible."))
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
          vscode.l10n.t("Disconnecting monitor from server [{0}]", this.monitorServer.name),
          sendDisconnectRequest(this.monitorServer).then(() => {
            vscode.window.setStatusBarMessage("");
          })
        );
      }

      if (this._timeoutSched) {
        clearTimeout(this._timeoutSched);
      }

      monitorLoader = undefined;
    });
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
        vscode.l10n.t("Disconnecting [{0}] from the server ", this.monitorServer.name),
        sendDisconnectRequest(this.monitorServer)
      );
    }

    this.monitorServer = null;

    if (serverItem) {
      const monitorItem: ServerItem = Utils.deepCopy(
        ServersConfig.getServerById(serverItem.id)
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
              vscode.l10n.t("It was not possible to make the monitoring connection at [{0}].", this.monitorServer.name)
            );
          }
        })
      );
    }
  }

  private registerCommands() {
    vscode.commands.getCommands(false).then((commands: string[]) => {
      let index = commands.indexOf("_totvs-developer-studio.clearMonitorPanel");
      if (index === -1) {
        this._disposables.push(
          vscode.commands.registerCommand(
            "_totvs-developer-studio.clearMonitorPanel",
            () => {
              this.clearPanel();
              vscode.window.setStatusBarMessage("");
            }
          )
        );
      }

      index = commands.indexOf("_totvs-developer-studio.updateMonitorPanel");
      if (index === -1) {
        this._disposables.push(
          vscode.commands.registerCommand(
            "_totvs-developer-studio.updateMonitorPanel",
            () => {
              if (!this._isDisposed) {
                if (this.monitorServer === null) {
                  this.monitorServer = serverProvider.connectedServerItem;
                }
                this.updateUsers(true);
              }
            }
          )
        );
      }
    });
  }

  private setLockServer(server: ServerItem, lock: boolean) {
    sendLockServer(server, lock).then(
      (result: boolean) => {
        if (result) {
          this.isLockServer(server);
        } else {
          vscode.window.showErrorMessage(
            vscode.l10n.t("Could not block new connections.")
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
            vscode.l10n.t("Server with new connections blocked.")
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
            vscode.l10n.t("The server could not be shut down. Return: {0}", response)
          );
        } else {
          serverProvider.connectedServerItem = undefined;
          this.clearPanel();
          vscode.window.setStatusBarMessage("");
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
        title: vscode.l10n.t("Closing connections."),
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
            message: vscode.l10n.t("Shutting down #{0}/{1}", cnt, total),
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
            resolve(true);
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
        title: vscode.l10n.t("Sending message to users."),
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
            message: vscode.l10n.t("Sending #{0}/{1}", cnt, total),
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
            resolve(true);
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
        const reason = command.content.reason;

        this.updateUsers(this._enableUpdateUsers);

        if (reason === 1) {
          //1 dialog open, 2 selected row
          this.updateSpeedStatus(
            vscode.l10n.t("Waiting for preview configuration changes.")
          );
        } else if (reason === 2) {
          this.updateSpeedStatus(
            vscode.l10n.t("Selected connections.")
          );
        } else {
          this.updateSpeedStatus();
        }

        break;
      }
      case MonitorPanelAction.DoUpdateState: {
        const state: any = command.content.state;
        const reload: boolean = command.content.reload;
        const context = this._context;

        context.workspaceState.update(WS_STATE_KEY, state);

        if (reload) {
          this._panel.dispose();

          context.workspaceState.update(WS_STATE_KEY, {});
          openMonitorView(context);
        }

        break;
      }
      case MonitorPanelAction.SetSpeedUpdate: {
        this.speed = command.content.speed;
        this.updateUsers(true);
        break;
      }
      case MonitorPanelAction.SetCodePageUpdate: {
        this.updateCodePage(command.content.environment, command.content.codepage, true);
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

  private updateCodePage(environment: string, codepage: string, save: boolean) {
    const envEncodeList: IEnvEncode[] = [];
    const environmentConfig: any[] = ServersConfig.getEnvironmentsConfig(this.monitorServer.name);

    if (save) {
      const index: number = environmentConfig.findIndex(((element) => {
        return element.name == environment.toLowerCase();
      }))
      if (index == -1) {
        codepage
        environmentConfig.push({ "name": environment.toLowerCase(), "encoding": codepage });
      } else {
        environmentConfig[index] = { "name": environment.toLowerCase(), "encoding": codepage };
      }

      ServersConfig.setEnvironmentsConfig(this.monitorServer.name, environmentConfig);
    }

    environmentConfig.forEach((environment) => {
      envEncodeList.push({ environment: environment.name, encoding: Number.parseInt(environment.encoding.charAt(0)) });
    })

    vscode.window.setStatusBarMessage(
      `$(sync~spin)${vscode.l10n.t("Setting server [{0}]...", this.monitorServer.name)}`,
      sendSetEnvEncodesRequest(this.monitorServer, envEncodeList).then(
        (message: string) => {
          if (message !== "OK") {
            languageClient.error(`SetEnvEncodes: ${message}`);
            vscode.window.showErrorMessage(message);
          }
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

  public updateUsers(scheduler: boolean) {
    if (this._timeoutSched) {
      clearTimeout(this._timeoutSched);
    }

    if (this.monitorServer === null) {
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

    if (this._enableUpdateUsers) {
      if (this.monitorServer === null) {
        this._panel.webview.postMessage({
          command: MonitorPanelAction.UpdateUsers,
          data: {
            serverName: vscode.l10n.t("(awaiting selection)"),
            users: [],
          },
        });
      } else {
        vscode.window.setStatusBarMessage(
          "$(gear~spin)" +
          vscode.l10n.t("Requesting data from the server [{0}]", this.monitorServer.name),
          sendGetUsersRequest(this.monitorServer).then(
            (users: any) => {
              if (users) {
                let map = groupBy(users, (item: any) => {
                  return item.environment;
                })
                const environments: any[] = [];
                Array.from(map.keys()).forEach((value) => {
                  environments.push({ name: value, codePage: 0 });
                });

                map = groupBy(users, (item: any) => {
                  return item.server;
                })
                const servers = Array.from(map.keys());

                const complement = users.length
                  ? vscode.l10n.t(" ({0} thread(s) in {1} server(s))", users.length, servers.length)
                  : vscode.l10n.t(" (none thread)");

                this._panel.webview.postMessage({
                  command: MonitorPanelAction.UpdateUsers,
                  data: {
                    serverName:
                      this.monitorServer.name.replace("_monitor", "") +
                      complement,
                    users: users,
                    servers: servers,
                    environments: environments
                  },
                }).then((value: boolean) => {
                  //console.log(`>>>>>>> postMessge ${value}`);
                }, (reason: any) => {
                  console.log(reason);
                });
              }
              this.updateSpeedStatus();
              doScheduler();
            },
            (err: Error) => {
              languageClient.error(err.message, err);
              vscode.window.showErrorMessage(
                err.message + vscode.l10n.t(". See log for details.")
              );

              if (this.speed > 0) {
                languageClient.info(vscode.l10n.t("Automatic update stopped."));
                languageClient.info(vscode.l10n.t("Please click on [Update] to reactivate.")
                );
              }
            }
          )
        );
      }
    }
  }

  private updateSpeedStatus(pauseReason?: string) {
    let nextUpdate = new Date(Date.now());
    let icon: string = "$(gear~spin)";
    let msg1: string = "";
    let msg2: string = "";

    if (pauseReason) {
      icon = "$(debug-pause)";
      msg1 = vscode.l10n.t("Monitor paused: {0}", pauseReason);
    } else {
      msg1 = vscode.l10n.t("Monitor: Updated as {0}.", `${nextUpdate.toLocaleTimeString()}`);

      if (this.speed === 0) {
        msg2 = vscode.l10n.t("The next one will take place on request.");
      } else {
        nextUpdate.setSeconds(nextUpdate.getSeconds() + this.speed);
        msg2 = vscode.l10n.t("The next one will occur {0}.", `${nextUpdate.toLocaleTimeString()}`);
      }
    }

    vscode.window.setStatusBarMessage(`${icon} ${msg1} ${msg2}`);
  }

  private clearPanel() {
    if (
      !this._isDisposed &&
      this._panel !== undefined &&
      this._panel.webview !== undefined
    ) {
      this._panel.webview.postMessage({
        command: MonitorPanelAction.UpdateUsers,
        data: {
          serverName: "Disconnected",
          users: [],
          servers: [],
        },
      });
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
    const configJson: any = {
      serverList: servers,
      memento: this._context.workspaceState.get(WS_STATE_KEY, {}),
      translations: getTranslations(),
    };

    if (configJson["memento"].hasOwnProperty("customProps")) {
      const customProps = configJson["memento"]["customProps"];
      if (!customProps.hasOwnProperty("speed")) {
        customProps["speed"] = this.speed;
      }
    } else {
      configJson["memento"] = { customProps: { speed: this.speed } };
    }
    this.speed = configJson["memento"]["customProps"]["speed"];

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

function getTranslations() {
  return {
    ACTIONS: vscode.l10n.t("Actions"),
    ENVIRONMENT: vscode.l10n.t("Environment"),
    CANCEL: vscode.l10n.t("Cancel"),
    COMMENT: vscode.l10n.t("Comment"),
    COMPUTER_NAME: vscode.l10n.t("Computer Name"),
    CONNECTION: vscode.l10n.t("Connection"),
    CONNECTIONS: vscode.l10n.t("connections"),
    CONNECTIONS_SELECTED: vscode.l10n.t("{0} connections selected"),
    "CONNECTION_TYPE ": vscode.l10n.t("Connection Type"),
    CTREE_ID: vscode.l10n.t("CTree ID"),
    DISCONNECT_ALL_USERS: vscode.l10n.t("Disconnect all users"),
    DISCONNECT_SELECTD_USERS: vscode.l10n.t("Disconnect selectd users"),
    DRAG_HEADERS: vscode.l10n.t("Drag headers ..."),
    ELAPSED_TIME: vscode.l10n.t("Elapsed time"),
    FILTER: vscode.l10n.t("Filter"),
    FILTERING_ON_OFF: vscode.l10n.t("Filtering on/off"),
    FIRST: vscode.l10n.t("First"),
    FIRST_PAGE: vscode.l10n.t("First page"),
    FROM_TO_OF_COUNT: vscode.l10n.t("from-to de count"),
    GROUPED_BY: vscode.l10n.t("Grouped by:"),
    GROUPING_ON_OFF: vscode.l10n.t("Grouping on/off"),
    TREE_ON_OFF: vscode.l10n.t("Tree server on/off"),
    INACTIVITY_TIME: vscode.l10n.t("Idle time"),
    INFO_RELEASE_CONNECTION: vscode.l10n.t("When confirming the release of new connections, users can connect to that server again."),
    "INSTRUCTIONS_SEG ": vscode.l10n.t("Instructions/sec"),
    LAST: vscode.l10n.t("Last"),
    LAST_PAGE: vscode.l10n.t("Last page"),
    "LINES_PAGE.": vscode.l10n.t("lines/p."),
    LOCK_SERVER: vscode.l10n.t("Lock server"),
    LONG: vscode.l10n.t("(long)"),
    MANUAL: vscode.l10n.t("(manual)"),
    MEMORY_USE: vscode.l10n.t("Memory in Use"),
    MESSAGE_TEXT: vscode.l10n.t("Message Text"),
    NEXT: vscode.l10n.t("Next"),
    NEXT_PAGE: vscode.l10n.t("Next page"),
    NORMAL: vscode.l10n.t("(normal)"),
    NO_CONNECTIONS: vscode.l10n.t("There are no connections or they are not visible to the monitor."),
    OK: vscode.l10n.t("OK"),
    PREVIOUS: vscode.l10n.t("Previous"),
    PREVIOUS_PAGE: vscode.l10n.t("Previous page"),
    PROGRAM: vscode.l10n.t("Program"),
    REFRESH_DATA: vscode.l10n.t("Refresh data"),
    REMARKS: vscode.l10n.t("Remarks"),
    RESET_CONFIGURATIONS: vscode.l10n.t("Reset configurations"),
    SEARCH: vscode.l10n.t("Search"),
    SEARCH_ALL_COLUMNS: vscode.l10n.t("Search in all columns"),
    SEND: vscode.l10n.t("Submit"),
    SEND_MESSAGE_ALL_USERS: vscode.l10n.t("Send message to all users"),
    SEND_MESSAGE_SELECTED_USERS: vscode.l10n.t("Send message to selected users"),
    SERVER: vscode.l10n.t("Server"),
    SHORT: vscode.l10n.t("(short)"),
    SHOW_HIDE_COLUMNS: vscode.l10n.t("Show/hide columns"),
    SID: vscode.l10n.t("SID"),
    STOP_SERVER: vscode.l10n.t("Stop server"),
    THREAD: vscode.l10n.t("ThreadID"),
    "TOTAL_INSTRUCTIONS ": vscode.l10n.t("Instructions"),
    UNLOCK_SERVER: vscode.l10n.t("Unlock server"),
    UPDATE_SPEED: vscode.l10n.t("Update speed {0}"),
    USER: vscode.l10n.t("User"),
    USER_NAME: vscode.l10n.t("User Name"),
    WARNING_BLOCKING_CONNECTIONS: vscode.l10n.t("When confirming the blocking of new connections, no user can connect to that server."),
    WARN_ALL_CONNECTIONS_CLOSE_1: vscode.l10n.t("When confirming the server stop, all connections (including this) will be closed, as well as other processes."),
    WARN_ALL_CONNECTIONS_CLOSE_2: vscode.l10n.t("Restarting will only be possible by physically accessing the server."),
    SECONDS: vscode.l10n.t("{0} seconds"),
    WARN_CONNECTION_TERMINATED: vscode.l10n.t("The users listed below will have their connections terminated."),
    TERMINATE_CONNECTIONS_IMMEDIATELY: vscode.l10n.t("Terminate connections immediately."),
    DLG_TITLE_SEND_MESSAGE: vscode.l10n.t("Message sending"),
    DLG_TITLE_CLOSE_CONNECTIONS: vscode.l10n.t("Closes user connections"),
    DLG_TITLE_SPEED: vscode.l10n.t("Interval between updates"),
    DLG_TITLE_STOP_SERVER: vscode.l10n.t("Confirm the server stop?"),
    DLG_TITLE_LOCK_SERVER: vscode.l10n.t("Block new connections?"),
    DLG_TITLE_REMARKS: vscode.l10n.t("Remarks"),
    DLG_TITLE_CHANGE_CODE_PAGE: vscode.l10n.t("Change Environment Encoding"),
    DLG_TITLE_UNLOCK: vscode.l10n.t("Unlock new connections?"),
    ENVIRONEMNT: vscode.l10n.t("Environemnt"),
    MONITOR: vscode.l10n.t("Monitor"),
    INITIALIZING: vscode.l10n.t("(initializing)"),
    SHOW_COLUMNS: vscode.l10n.t("Show Columns"),
  };
}
