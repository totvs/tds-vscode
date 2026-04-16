import * as vscode from "vscode";
import * as fs from "fs";
import {
  EnvSection,
  ServerGroupItem,
  ServerItem,
  ServerTreeItem,
  ServerType,
} from "./serverItem";
import Utils, { ServersConfig } from "./utils";
import { updateStatusBarItems } from "./statusBar";

class ServerItemProvider
  implements vscode.TreeDataProvider<ServerTreeItem>
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

  private _onDidChangeTreeData: vscode.EventEmitter<ServerTreeItem | undefined> =
    new vscode.EventEmitter<ServerTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<ServerTreeItem | undefined> =
    this._onDidChangeTreeData.event;
  public localServerItems: Array<ServerItem> = [];
  private rootItems: Array<ServerTreeItem> = [];

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

  refresh(element?: ServerTreeItem): void {
    this._onDidChangeTreeData.fire(element);
  }

  public get connectedServerItem(): ServerItem {
    return this._connectedServerItem;
  }

  public set connectedServerItem(server: ServerItem) {
    if (this._connectedServerItem !== server) {
      this._connectedServerItem = server;

      let includes = ""; // XXX porque? apenas populando uma lista local e nao usa depois???
      if (server === undefined) {
        ServersConfig.clearConnectedServerConfig();
        const serversIncludes = ServersConfig.getGlobalIncludes();
        if (serversIncludes) {
          serversIncludes.forEach((includeItem) => {
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

      this.refresh();
    }
  }

  getTreeItem(element: ServerTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: ServerTreeItem): Thenable<ServerTreeItem[]> {
    if (element instanceof ServerGroupItem) {
      return Promise.resolve(this.sortTreeItems(element.children));
    }

    if (element instanceof ServerItem) {
      return Promise.resolve(element.environments ?? []);
    }

    if (this.rootItems.length === 0 && this.localServerItems.length === 0) {
      this.rootItems = this.setConfigWithServerConfig();
    }

    return Promise.resolve(this.sortTreeItems(this.rootItems));
  }

  checkServersConfigListener(refresh: boolean): void {
    let serversJson: string = ServersConfig.getServerConfigFile();

    if (this.configFilePath !== serversJson) {
      if (this.configFilePath) {
        fs.unwatchFile(this.configFilePath);
      }

      if (!fs.existsSync(serversJson)) {
        ServersConfig.createServerConfig();
      }

      fs.watch(serversJson, { encoding: "buffer" }, (eventType, filename) => {
        if (filename && eventType === "change") {
          updateStatusBarItems();
          this.rootItems = this.setConfigWithServerConfig();
          this.refresh();
        }
      });

      this.configFilePath = serversJson;

      if (refresh) {
        this.rootItems = this.setConfigWithServerConfig();
        this.refresh();
      }
    }

    ServersConfig.updateLinterIncludes();
  }

  /**
   * Cria os itens da arvore de servidores a partir da leitura do arquivo servers.json
   */
  private setConfigWithServerConfig() {
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
      includes: string[] | undefined,
      group: string | undefined
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
        includes,
        group
      );
    };
    const listServer = new Array<ServerItem>();
    const rootItems = new Array<ServerTreeItem>();
    const groups = new Map<string, ServerGroupItem>();

    ServersConfig.getServers().forEach((element) => {
      let token: string = element.token ? element.token : "";

      if (element.environment) {
        token =
          ServersConfig.getSavedTokens(element.id, element.environment) ?? token;
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
        [],
        element.includes,
        element.group
      );

      const environmentsServer =
        element.environments?.map(
          (environment) =>
            new EnvSection(
              environment,
              si
            )
        ) ?? [];

      si.environments = environmentsServer;

      if (element.smartclientBin) {
        si.smartclientBin = element.smartclientBin;
      }
      si.collapsibleState =
        environmentsServer.length > 0
          ? vscode.TreeItemCollapsibleState.Collapsed
          : vscode.TreeItemCollapsibleState.None;
      listServer.push(si);

      this.attachServerToTree(rootItems, groups, si);
    });

    this.localServerItems = listServer;

    return rootItems;
  }

  private attachServerToTree(
    rootItems: Array<ServerTreeItem>,
    groups: Map<string, ServerGroupItem>,
    serverItem: ServerItem
  ) {
    const segments = this.splitGroupPath(serverItem.group);

    if (segments.length === 0) {
      rootItems.push(serverItem);
      return;
    }

    let currentChildren = rootItems;
    let currentPath = "";

    segments.forEach((segment) => {
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;

      let group = groups.get(currentPath);
      if (!group) {
        group = new ServerGroupItem(currentPath);
        groups.set(currentPath, group);
        currentChildren.push(group);
      }

      currentChildren = group.children;
    });

    currentChildren.push(serverItem);
  }

  private splitGroupPath(group: string | undefined): string[] {
    if (!group) {
      return [];
    }

    return group
      .split(/[\\/]+/)
      .map((segment) => segment.trim())
      .filter((segment) => segment.length > 0);
  }

  private sortTreeItems(items: Array<ServerTreeItem>): Array<ServerTreeItem> {
    return [...items].sort((item1, item2) => {
      const item1IsGroup = item1 instanceof ServerGroupItem;
      const item2IsGroup = item2 instanceof ServerGroupItem;

      if (item1IsGroup !== item2IsGroup) {
        return item1IsGroup ? -1 : 1;
      }

      return this.getLabel(item1).localeCompare(this.getLabel(item2), undefined, {
        sensitivity: "base",
      });
    });
  }

  private getLabel(item: ServerTreeItem): string {
    return typeof item.label === "string" ? item.label : item.label?.label ?? "";
  }
}

const SERVER_TREE_MIME = "application/vnd.code.tree.totvs_server";

class ServerDragAndDropController
  implements vscode.TreeDragAndDropController<ServerTreeItem>
{
  readonly dragMimeTypes = [SERVER_TREE_MIME];
  readonly dropMimeTypes = [SERVER_TREE_MIME];

  async handleDrag(
    source: readonly ServerTreeItem[],
    dataTransfer: vscode.DataTransfer
  ): Promise<void> {
    const serverIds = source
      .filter((item): item is ServerItem => item instanceof ServerItem)
      .map((item) => item.id);

    if (serverIds.length > 0) {
      dataTransfer.set(
        SERVER_TREE_MIME,
        new vscode.DataTransferItem(JSON.stringify({ serverIds }))
      );
    }
  }

  async handleDrop(
    target: ServerTreeItem | undefined,
    dataTransfer: vscode.DataTransfer
  ): Promise<void> {
    const transferItem = dataTransfer.get(SERVER_TREE_MIME);
    if (!transferItem) {
      return;
    }

    const payload = JSON.parse(await transferItem.asString());
    const serverIds: string[] = payload.serverIds ?? [];

    if (serverIds.length === 0) {
      return;
    }

    const targetGroup =
      target instanceof ServerGroupItem
        ? target.groupPath
        : target instanceof ServerItem
          ? target.group
          : undefined;

    serverIds.forEach((serverId) => {
      ServersConfig.updateServerGroup(serverId, targetGroup);
    });
  }
}

const serverProvider = new ServerItemProvider();
export const serverDragAndDropController = new ServerDragAndDropController();
export default serverProvider;
