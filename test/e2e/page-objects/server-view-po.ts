import { expect } from "chai";
import {
  ActivityBar,
  SideBarView,
  TreeItem,
  ViewItemAction,
  Notification,
  WebView,
  WebElement,
  ViewItem,
  ViewControl,
  ViewTitlePart,
  TitleActionButton,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { IServerData, IUserData } from "./interface-po";
import { ServerPageObject } from "./server-po";
import { ServerTreeItemPageObject } from "./server-tree-item-po";
import { ViewPageObject } from "./view-po";

export class ServerViewPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("Totvs");
  }

  async getServerTreeItem(serverName: string): Promise<TreeItem> {
    return this.getTreeItem(serverName);
  }

  async removeServer(serverName: string) {
    const serverTreeItem: TreeItem = await this.getServerTreeItem(serverName);
    await delay(2000);

    await serverTreeItem.select();
    const action: ViewItemAction = await serverTreeItem.getActionButton(
      "Delete Server"
    );
    await delay();
    await action.click();
    await delay(2000);

    const notification: Notification = await this.workbenchPO.getNotification(
      /Are you sure want to delete/,
      2000
    );
    expect(notification).not.is.null;

    await notification.takeAction("Yes");
    await delay();
  }

  async addNewServer(data: IServerData): Promise<void> {
    await delay();

    await this.workbenchPO.executeCommand("totvs-developer-studio.add");
    await delay();

    const webView: WebView = new WebView();
    await webView.switchToFrame();

    const serverPO = new ServerPageObject(data);
    await serverPO.fillAddServerPage(webView, data, true);

    await webView.switchBack();
    await delay();

    expect(await this.workbenchPO.isSaveServer()).is.true;
  }

  async getNewServer(data: IServerData) {
    let serverTreeItem = await this.getServerTreeItem(data.serverName);

    if (!serverTreeItem) {
      await this.addNewServer(data);
      serverTreeItem = await this.getServerTreeItem(data.serverName);
    }

    return serverTreeItem;
  }

  async connect(
    serverName: string,
    environment: string,
    userdata: IUserData
  ): Promise<ServerTreeItemPageObject> {
    const serverPO: ServerTreeItemPageObject = new ServerTreeItemPageObject(
      await this.getServerTreeItem(serverName)
    );

    await serverPO.connect(environment, userdata);

    return serverPO;
  }

  async disconnectAllServers(): Promise<void> {
    const elements: ViewItem[] = await this.getVisibleItems();

    elements.forEach(async (element: WebElement) => {
      const item: ServerTreeItemPageObject = new ServerTreeItemPageObject(
        element as TreeItem
      );
      if (item.isConnected()) {
        await item.fireDisconnectAction();
        await delay();
      }
    });
  }

  async fireConfigureServerView() {
    (await this.getAction("Configure Server View")).click();
    await delay();
  }
}
