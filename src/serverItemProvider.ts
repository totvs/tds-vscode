import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as nls from "vscode-nls";
import Utils from "./utils";

let localize = nls.loadMessageBundle();

class ServerItemProvider
  implements vscode.TreeDataProvider<ServerItem | EnvSection> {
  isConnected(server: ServerItem) {
    return (
      this._connectedServerItem !== undefined &&
      this._connectedServerItem.id === server.id
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

  constructor() {
    // check if there is an open folder
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showErrorMessage("No folder opened.");
      return;
    }
    this.addServersConfigListener();
    this.addLaunchJsonListener();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  public get connectedServerItem(): ServerItem {
    return this._connectedServerItem;
  }

  public set connectedServerItem(server: ServerItem) {
    this._connectedServerItem = server ? server : undefined;
    this.refresh();
  }

  getTreeItem(element: ServerItem | EnvSection): vscode.TreeItem {
    if (element instanceof ServerItem) {
      let iconPath = {
        light: path.join(
          __filename,
          "..",
          "..",
          "resources",
          "light",
          this._connectedServerItem !== undefined &&
            element.id === this._connectedServerItem.id
            ? "server.connected.svg"
            : "server.svg"
        ),
        dark: path.join(
          __filename,
          "..",
          "..",
          "resources",
          "dark",
          this._connectedServerItem !== undefined &&
            element.id === this._connectedServerItem.id
            ? "server.connected.svg"
            : "server.svg"
        ),
      };
      element.iconPath = iconPath;
    }

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
          this.localServerItems[
            element.id
          ].environments = listOfEnvironments.map(
            (env) =>
              new EnvSection(
                env,
                element,
                vscode.TreeItemCollapsibleState.None,
                {
                  command: "totvs-developer-studio.environmentSelection",
                  title: "",
                  arguments: [env],
                }
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

          //					this.refresh();

          Promise.resolve(
            new EnvSection(
              element.name,
              element,
              element.collapsibleState,
              undefined,
              listOfEnvironments
            )
          );
        } else {
          return Promise.resolve([]);
        }
      }
    } else {
      if (!this.localServerItems) {
        const serverConfig = Utils.getServersConfig();
        if (serverConfig.configurations.length <= 0) {
          //se o servers.json existe
          this.localServerItems = this.setConfigWithSmartClient();
        } else {
          this.localServerItems = this.setConfigWithServerConfig();
        }
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

  private addServersConfigListener(): void {
    let serversJson = Utils.getServerConfigFile();
    if (!fs.existsSync(serversJson)) {
      Utils.createServerConfig();
    }
    //Caso o arquivo servers.json seja encontrado, registra o listener já na inicialização.
    fs.watch(serversJson, { encoding: "buffer" }, (eventType, filename) => {
      if (filename && eventType === "change") {
        this.localServerItems = this.setConfigWithServerConfig();
        this.refresh();
      }
    });
  }

  private addLaunchJsonListener(): void {
    let launchJson = Utils.getLaunchConfigFile();

    if (!fs.existsSync(launchJson)) {
      Utils.createLaunchConfig();
    }

    if (fs.existsSync(launchJson)) {
      //Caso o arquivo launch.json seja encontrado, registra o listener já na inicialização.
      fs.watch(launchJson, { encoding: "buffer" }, (eventType, filename) => {
        const serverConfig = Utils.getServersConfig();
        if (filename && eventType === "change") {
          if (serverConfig.configurations.length > 0) {
            this.localServerItems = this.setConfigWithServerConfig();
          } else {
            this.localServerItems = this.setConfigWithSmartClient();
          }
          this.refresh();
        }
      });
    }
  }

  /**
   * Cria os itens da arvore de servidores a partir da leitura do arquivo servers.json
   */
  private setConfigWithServerConfig() {
    const serverConfig = Utils.getServersConfig();

    const serverItem = (
      serverItem: string,
      type: string,
      address: string,
      port: number,
      secure: number,
      id: string,
      buildVersion: string,
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
        environments,
        includes,
        {
          command: "",
          title: "",
          arguments: [serverItem],
        }
      );
    };
    const listServer = new Array<ServerItem>();

    serverConfig.configurations.forEach((element) => {
      let environmentsServer = new Array<EnvSection>();
      if (element.environments) {
        element.environments.forEach((environment) => {
          const env = new EnvSection(
            environment,
            element,
            vscode.TreeItemCollapsibleState.None,
            {
              command: "totvs-developer-studio.environmentSelection",
              title: "",
              arguments: [environment],
            },
            environment
          );

          if (serverConfig.savedTokens) {
            console.log(serverConfig.savedTokens);

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
        environmentsServer,
        element.includes
      );
      // serverConfig.savedTokens.forEach((element) => {
      //   si.token = "";
      // });
      si.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      listServer.push(si);
    });

    return listServer;
  }

  /**
   * Inicia a arvore de servidores lendo o conteudo do smartclient.ini e
   * cria o arquivo servers.json
   */
  private setConfigWithSmartClient() {
    const config = Utils.getLaunchConfig();
    const configs = config.configurations;

    if (!configs) {
      return new Array<ServerItem>();
    }

    let scBinConf;
    configs.forEach((element) => {
      if (element.type === "totvs_language_debug") {
        scBinConf = element.smartclientBin;
      }
    });

    if (scBinConf) {
      const scIniPath = path.join(
        path.dirname(scBinConf),
        path.win32.basename(scBinConf, path.extname(scBinConf)) + ".ini"
      );
      if (this.pathExists(scIniPath)) {
        const serverItems = this.getTCPSecsInIniFile(scIniPath);
        this.saveServers(serverItems);
        return serverItems;
      } else {
        vscode.window.showInformationMessage(
          localize(
            "tds.webview.serversView.invalidJson",
            "launch.json has an invalid smartclientBin configuration."
          )
        );
        return new Array<ServerItem>();
      }
    } else {
      vscode.window.showInformationMessage(
        localize(
          "tds.webview.serversView.addAttrib",
          "Add an attribute smartclientBin with a valid SmartClient path and the executable file name on launch.json."
        )
      );
      return new Array<ServerItem>();
    }
  }

  private saveServers(serverItems: ServerItem[]) {
    Utils.createServerConfig();

    serverItems.forEach((element) => {
      /*const id = */ Utils.createNewServer(
        "totvs_server_protheus",
        element.label,
        element.port,
        element.address,
        element.buildVersion,
        element.secure,
        element.includes
      );

      //A principio parece ser um exagero tentar validar TODOS os servidores ao salvar.
      //Caso essa informação venha do ini do smartclient por exemplo, pode ter um numero muito
      //grande de servidores cadastrados e esse processo fica bastante lento, pois caso o usuario peça
      //para conectar um servidor, o LS tera que processar todas essas requisições que ja estarao na fila
      //das mensagens para enfim processar a mensagem de conexão.

      // languageClient.sendRequest('$totvsserver/validation', {
      // 	validationInfo: {
      // 		server: element.address,
      // 		port: element.port
      // 	}
      // }).then((validInfoNode: NodeInfo) => {
      // 	if (id) {
      // 		Utils.updateBuildVersion(id, validInfoNode.buildVersion);
      // 	}
      // 	return;
      // });
    });
  }

  /**
   * Given the path to smartclient.ini, read all its TCP Sections.
   */
  private getTCPSecsInIniFile(scIniPath: string): ServerItem[] {
    if (this.pathExists(scIniPath)) {
      const toTCPSec = (
        serverItem: string,
        type: string,
        address: string,
        port: number,
        secure: number,
        id: string,
        buildVersion: string
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
          undefined,
          undefined,
          {
            command: "",
            title: "",
            arguments: [serverItem],
          }
        );
      };

      const scIniFileFs = fs.readFileSync(scIniPath, "utf-8");

      let re = /^\[[^\]\r\n]+](?:\r?\n(?:[^[\r\n].*)?)*/gim;
      let matches = re.exec(scIniFileFs);

      const tcpSecs = new Array<ServerItem>();

      while ((matches = re.exec(scIniFileFs)) !== null) {
        let match = matches[0];
        let address = /^SERVER\s?=(?:\s+)?(.+)/im.exec(match);
        let port = /^PORT\s?=(?:\s+)?(.+)/im.exec(match);
        let secure = /^SECURECONNECTION\s?=(?:\s+)?(.+)/im.exec(match);
        let secureInt = 0;

        if (secure !== null) {
          secureInt = parseInt(secure[1]);
        }

        if (address !== null && port !== null) {
          let key = /^\[(.+)\]/gim.exec(match);

          if (key !== null) {
            tcpSecs.push(
              toTCPSec(
                key[1],
                "totvs_server_protheus",
                address[1],
                parseInt(port[1]),
                secureInt,
                Utils.generateRandomID(),
                ""
              )
            );
          }
        }
      }
      this.localServerItems = tcpSecs;
      return tcpSecs;
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }

    return true;
  }
}

export class ServerItem extends vscode.TreeItem {
  public token: string;
  public currentEnvironment: string;

  public get isConnected(): boolean {
    return serverProvider.isConnected(this);
  }

  constructor(
    public name: string,
    public readonly type: string,
    public readonly address: string,
    public readonly port: number,
    public secure: number,
    public collapsibleState: vscode.TreeItemCollapsibleState,
    public id: string,
    public buildVersion: string,
    public environments?: Array<EnvSection>,
    public includes?: string[],
    public readonly command?: vscode.Command
  ) {
    super(name, collapsibleState);
  }

  public getTooltip(): string {
    return `Server=${this.address} | Port=${this.port}`;
  }

  description = `${this.address}:${this.port}`;

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      this.isConnected ? "server.connected.svg" : "server.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      this.isConnected ? "server.connected.svg" : "server.svg"
    ),
  };

  contextValue = this.isConnected ? "serverItem" : "serverItemNotConnected";
}

export class EnvSection extends vscode.TreeItem {
  constructor(
    public label: string,
    public readonly serverItemParent: ServerItem,
    public collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public environments?: string[]
  ) {
    super(label, collapsibleState);
  }

  public getTooltip(): string {
    return `${this.label} @ ${this.serverItemParent.name}`;
  }

  iconPath = {
    light: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "light",
      this.serverItemParent !== undefined &&
        this.serverItemParent.id === this.serverItemParent.id &&
        this.serverItemParent.currentEnvironment === this.label
        ? "environment.connected.svg"
        : "environment.svg"
    ),
    dark: path.join(
      __filename,
      "..",
      "..",
      "resources",
      "dark",
      this.serverItemParent !== undefined &&
        this.serverItemParent.id === this.serverItemParent.id &&
        this.serverItemParent.currentEnvironment === this.label
        ? "environment.connected.svg"
        : "environment.svg"
    ),
  };

  contextValue = "envSection";
}

const serverProvider = new ServerItemProvider();
export default serverProvider;
