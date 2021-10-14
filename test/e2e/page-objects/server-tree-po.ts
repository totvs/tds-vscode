import { expect } from "chai"
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
  TitleActionButton
} from "vscode-extension-tester"
import { delay } from "../helper"
import { IServerData, IUserData } from "./interface-po"
import { ServerPageObject } from "./server-po"
import { ServerTreeItemPageObject } from "./server-tree-item-po"
import { WorkbenchPageObject } from "./workbench-po"

export class ServerTreePageObject {
  private view: SideBarView;
  private control: ViewControl;
  private workbenchPO: WorkbenchPageObject;

  constructor () {
    this.workbenchPO = new WorkbenchPageObject()
  }

  async openView (): Promise<SideBarView> {
    if (!this.view) {
      const activityBar = new ActivityBar()
      this.control = await activityBar.getViewControl("TOTVS")
      this.view = await this.control.openView()

      await delay(2000)
    }

    return this.view
  }

  async getServerTreeItem (serverName: string): Promise<TreeItem> {
    const c = (await this.openView()).getContent()
    const s = await c.getSections()

    const serverTreeItem = (await s[0].findItem(serverName)) as TreeItem

    return serverTreeItem
  }

  async removeServer (serverName: string) {
    const c = (await this.openView()).getContent()
    const s = await c.getSections()

    const i: TreeItem = (await s[0].findItem(serverName)) as TreeItem
    await i.select()

    const action: ViewItemAction = await i.getActionButton("Delete Server")
    await action.click()
    await delay()

    const notification: Notification = await this.workbenchPO.waitNotification(
      "Are you sure want to delete this server?",
      false
    )

    expect(notification).not.is.undefined

    await notification.takeAction("Yes")
    await delay()
  }

  async addNewServer (data: IServerData): Promise<void> {
    await delay()

    await this.workbenchPO.executeCommand("totvs-developer-studio.add")
    await delay(2000)

    const webView: WebView = new WebView()
    await webView.switchToFrame()

    const serverPO = new ServerPageObject(data)
    await serverPO.fillAddServerPage(webView, data, true)

    await webView.switchBack()
    await delay()

    const notification: Notification = await this.workbenchPO.waitNotification(
      "Saved server"
    )
    expect(notification).not.is.undefined
  }

  async getNewServer (data: IServerData) {
    let serverTreeItem = await this.getServerTreeItem(data.serverName)

    if (!serverTreeItem) {
      await this.addNewServer(data)
      serverTreeItem = await this.getServerTreeItem(data.serverName)
    }

    return serverTreeItem
  }

  async connect (
    serverName: string,
    environment: string,
    userdata: IUserData
  ): Promise<ServerTreeItemPageObject> {
    const serverPO: ServerTreeItemPageObject = new ServerTreeItemPageObject(
      await this.getServerTreeItem(serverName)
    )

    await serverPO.connect(environment, userdata)

    return serverPO
  }

  async disconnectAllServers (): Promise<void> {
    const c = (await this.openView()).getContent()
    const s = await c.getSections()
    const elements: ViewItem[] = await s[0].getVisibleItems()

    elements.forEach(async (element: WebElement) => {
      const item: ServerTreeItemPageObject = new ServerTreeItemPageObject(
        element as TreeItem
      )
      if (item.isConnected()) {
        await item.fireDisconnectAction()
        await delay()
      }
    })
  }

  async fireConfigureServerView () {
    const titlePart: ViewTitlePart = (await this.openView()).getTitlePart()
    const action: TitleActionButton = await titlePart.getAction(
      "Configure Server View"
    )

    action.click()
    await delay()
  }
}
