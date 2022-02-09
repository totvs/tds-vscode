import { expect } from "chai";
import path = require("path");
import fse = require("fs-extra");
import {
  SideBarView,
  TreeItem,
  ViewItemAction,
  Notification,
  ViewItem,
} from "vscode-extension-tester";
import { delay, DEFAULT_DELAY } from "../helper";
import { PROJECT_FOLDER } from "../scenario";
import { IServerData, IUserData } from "./interface-po";
import { ServerPageObject } from "./server-po";
import { ServerTreeItemPageObject } from "./server-tree-item-po";
import { ViewPageObject } from "./view-po";

export class ServerViewPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("TOTVS");
  }

  async removeServer(serverName: string) {
    const serverTreeItem: TreeItem = await this.getTreeItem([serverName]);
    await delay();

    await serverTreeItem.select();
    const action: ViewItemAction = await serverTreeItem.getActionButton(
      "Delete Server"
    );
    await delay();
    await action.click();
    await delay();

    const notification: Notification = await this.workbenchPO.getNotification(
      /Are you sure want to delete/,
      2000
    );
    expect(notification).not.is.null;

    await notification.takeAction("Yes");
    await delay();
  }

  async addServer(data: IServerData): Promise<void> {
    await this.workbenchPO.executeCommand("totvs-developer-studio.add");

    const serverPO: ServerPageObject = new ServerPageObject(data);
    await serverPO.fillServerPage(data);
    await serverPO.fireSaveClose();

    expect(await this.workbenchPO.isSavedServer()).is.true;
  }

  private async registerServer(data: IServerData): Promise<void> {
    const serverJsonFile: string = path.join(
      PROJECT_FOLDER,
      ".vscode",
      "servers.json"
    );

    if (!fse.existsSync(serverJsonFile)) {
      this.addServer(data);
      await delay();
    } else {
      const servers: any = fse.readJSONSync(serverJsonFile);

      servers.configurations = [
        {
          id: "qg0x8r7my7kya6rmkzldj9lq5o2y",
          type: data.serverType,
          name: data.serverName,
          port: data.port,
          address: data.address,
          includes: data.includePath,
          environments: [ data.environment ],
        },
      ];

      fse.writeJSONSync(serverJsonFile, servers);
    }
  }

  async getServer(data: IServerData) {
    let serverTreeItem = await this.getTreeItem([data.serverName]);

    if (!serverTreeItem) {
      await this.registerServer(data);
      serverTreeItem = await this.getTreeItem([data.serverName]);
    }

    return serverTreeItem;
  }

  async connect(
    serverName: string,
    environment: string,
    userdata: IUserData,
    validate: boolean = true
  ): Promise<ServerTreeItemPageObject> {
    const serverPO: ServerTreeItemPageObject = new ServerTreeItemPageObject(
      await this.getTreeItem([serverName])
    );

    await serverPO.connect(environment, userdata);

    if (validate) {
      expect(await this.workbenchPO.isConnected(serverName, environment)).is
        .true;
    }

    return serverPO;
  }

  async disconnectAllServers(): Promise<void> {
    const elements: ViewItem[] = await this.getVisibleItems();

    for await (const element of elements) {
      const item: ServerTreeItemPageObject = new ServerTreeItemPageObject(
        element as TreeItem
      );
      if (item.isConnected()) {
        await item.fireDisconnectAction();
        await delay();
      }
    }
  }

  async fireConfigureServerView() {
    (await this.getAction("Configure Server View")).click();
    await delay();
  }
}
