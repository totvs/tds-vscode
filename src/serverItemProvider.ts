import * as vscode from "vscode";
import * as fs from "fs";
//import Utils from "./utils";
import { changeSettings } from "./server/languageServerSettings";
import { EnvSection, ServerItem, ServerType } from "./serverItem";
import Utils from "./utils";

class ServerItemProvider
  implements vscode.TreeDataProvider<ServerItem | EnvSection>
{
  isConnected(server: ServerItem) {
    return (
      this._connectedServerItem !== undefined &&
      this._connectedServerItem.id === server.id
    );
  }

  isCurrentEnvironment(environment: EnvSection) {
    return (
      this.isConnected(environment.serverItemParent) &&
      environment.serverItemParent.environment === environment.label
    );
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    ServerItem | EnvSection | undefined
  > = new vscode.EventEmitter<ServerItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<
    ServerItem | EnvSection | undefined
  > = this._onDidChangeTreeData.event;
  public localServerItems: Array<ServerItem>;

  private _connectedServerItem: ServerItem | undefined = undefined;

  private configFilePath: string = "";

  constructor() {
    // check if there is an open folder
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage("No folder opened.");
      return;
    }

    vscode.workspace.workspaceFolders.forEach((folder) => {
      if (!fs.existsSync(folder.uri.fsPath)) {
        vscode.window.showWarningMessage(
          `Folder not exist or access unavailable. Check it to avoid unwanted behavior. Path: ${folder.uri.fsPath}`
        );
      }
    });

    vscode.workspace.onDidChangeConfiguration(() => {
      this.checkServersConfigListener(true);
    });

  }

  refresh(element?: ServerItem): void {
    this._onDidChangeTreeData.fire(element);
  }

  public get connectedServerItem(): ServerItem {
    return this._connectedServerItem;
  }

  public set connectedServerItem(server: ServerItem) {
    if (this._connectedServerItem !== server) {
      this._connectedServerItem = server;

      let includes = "";
      if (server === undefined) {
        Utils.clearConnectedServerConfig();
        const serversConfig = Utils.getServersConfig();
        if (serversConfig.includes) {
          let includesList = serversConfig.includes as Array<string>;
          includesList.forEach((includeItem) => {
            includes += includeItem + ";";
          });
        }
      } else {
        if (server.includes) {
          server.includes.forEach((includeItem) => {
            includes += includeItem + ";";
          });
        }
      }
      if (includes) {
        changeSettings({
          changeSettingInfo: {
            scope: "advpls",
            key: "includes",
            value: includes,
          },
        });
      }

      this.refresh();
    }
  }

  getTreeItem(element: ServerItem | EnvSection): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ServerItem): Thenable<ServerItem[] | EnvSection[]> {
    if (element) {
      if (element.environments) {
        return Promise.resolve(element.environments);
      } else {
        const servers = Utils.getServersConfig();
        const listOfEnvironments =
          servers.configurations[element.id].environments;
        if (listOfEnvironments.size > 0) {
          this.localServerItems[element.id].environments =
            listOfEnvironments.map(
              (env) =>
                new EnvSection(
                  env,
                  element,
                )
            );
          this.localServerItems[element.id].collapsibleState =
            vscode.TreeItemCollapsibleState.Expanded;
          //Workaround: Bug que nao muda visualmente o collapsibleState se o label permanecer intalterado
          this.localServerItems[element.id].label = this.localServerItems[
            element.id
          ].label.endsWith(" ")
            ? this.localServerItems[element.id].label.trim()
            : this.localServerItems[element.id].label + " ";
          element.environments = listOfEnvironments;

          Promise.resolve(
            new EnvSection(
              element.name,
              element,
            )
          );
        } else {
          return Promise.resolve([]);
        }
      }
    } else {
      if (!this.localServerItems) {
        const serverConfig = Utils.getServersConfig();
        this.localServerItems = this.setConfigWithServerConfig();
      }
    }

    return Promise.resolve(
      this.localServerItems.sort((srv1, srv2) => {
        const label1 = srv1.name.toLowerCase();
        const label2 = srv2.name.toLowerCase();
        if (label1 > label2) {
          return 1;
        }
        if (label1 < label2) {
          return -1;
        }
        return 0;
      })
    );
  }

  checkServersConfigListener(refresh: boolean): void {
    let serversJson: string = Utils.getServerConfigFile();

    if (this.configFilePath !== serversJson) {
      if (this.configFilePath) {
        fs.unwatchFile(this.configFilePath);
      }

      if (!fs.existsSync(serversJson)) {
        Utils.createServerConfig();
      }

      fs.watch(serversJson, { encoding: "buffer" }, (eventType, filename) => {
        if (filename && eventType === "change") {
          this.localServerItems = this.setConfigWithServerConfig();
          this.refresh();
        }
      });

      this.configFilePath = serversJson;

      if (refresh) {
        this.localServerItems = this.setConfigWithServerConfig();
        this.refresh();
      }
    }
  }

  /**
   * Cria os itens da arvore de servidores a partir da leitura do arquivo servers.json
   */
  private setConfigWithServerConfig() {
    const serverConfig = Utils.getServersConfig();

    const serverItem = (
      serverItem: string,
      type: ServerType,
      address: string,
      port: number,
      secure: number,
      id: string,
      buildVersion: string,
      token: string,
      environments: Array<EnvSection>,
      includes: string[]
    ): ServerItem => {
      return new ServerItem(
        serverItem,
        type,
        address,
        port,
        secure,
        vscode.TreeItemCollapsibleState.None,
        id,
        buildVersion,
        token,
        environments,
        includes
      );
    };
    const listServer = new Array<ServerItem>();

    serverConfig.configurations.forEach((element) => {
      let environmentsServer = new Array<EnvSection>();
      let token: string = element.token ? element.token : "";

      if (element.environments) {
        element.environments.forEach((environment) => {
          const env = new EnvSection(
            environment,
            element,
          );

          if (serverConfig.savedTokens) {
            serverConfig.savedTokens.forEach((savedToken) => {
              if (savedToken[0] === element.id + ":" + element.environment) {
                token = savedToken[1].token;
              }
            });
          }

          environmentsServer.push(env);
        });
      }

      const si: ServerItem = serverItem(
        element.name,
        element.type,
        element.address,
        element.port,
        element.secure,
        element.id,
        element.buildVersion,
        token,
        environmentsServer,
        element.includes
      );
      if (element.smartclientBin) {
        si.smartclientBin = element.smartclientBin;
      }
      si.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      listServer.push(si);
    });

    return listServer;
  }
}

const serverProvider = new ServerItemProvider();
export default serverProvider;
