import { expect } from "chai";
import { By, ContextMenu, ContextMenuItem, InputBox, QuickPickItem, TreeItem, ViewItem, ViewItemAction } from "vscode-extension-tester";
import { delay, fillEnvironment, fillUserdata, fireContextMenuAction, takeQuickPickAction } from "../helper";
import { IUserData } from "./interface-po";
import { StatusPageObject } from "./status-po";
import { WorkbenchPageObject } from "./workbench-po";

export class ServerTreeItemPageObject {
  private serverTreeItem: TreeItem;
  private workbenchPO: WorkbenchPageObject;

  constructor(serverTreeItem: TreeItem) {
    this.serverTreeItem = serverTreeItem;
    this.workbenchPO = new WorkbenchPageObject();
  }

  async connect(environment: string, userData: IUserData) {
    this.select();
    await fireContextMenuAction(this.serverTreeItem, "Connect");

    await fillEnvironment(environment);
    await fillUserdata(userData);

    await this.workbenchPO.waitConnection();
    expect(
      await this.workbenchPO.isConnected(
        await this.serverTreeItem.getLabel(),
        environment
      )
    ).is.true;
  }

  async select() {
    await this.serverTreeItem.select();
    await delay();
  }

  async isSelected(): Promise<boolean> {
    const klass = await this.serverTreeItem.getAttribute("class");
    return klass.indexOf("selected") > -1;
  }

  async fireConnectAction() {
    const action: ViewItemAction = await this.serverTreeItem.getActionButton(
      "Connect"
    );

    await action.click();
    await delay();
  }

  async isConnected(): Promise<boolean> {
    const icon = await this.serverTreeItem.findElement(
      By.className("custom-view-tree-node-item-icon")
    );
    const klass = await icon.getAttribute("style");

    return klass.indexOf("server.connected.svg") > -1;
  }

  async isNotConnected(): Promise<boolean> {
    const icon = await this.serverTreeItem.findElement(
      By.className("custom-view-tree-node-item-icon")
    );
    const klass = await icon.getAttribute("style");

    return klass.indexOf("_server.svg") > -1;
  }

  async fireDisconnectAction() {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Disconnect");
  }

  async fireReconnectAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Reconnect");
    //await delay(2000);
  }

  async fireAddServerAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Add Server");
  }

  async fireDefragAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Defrag RPO");
  }

  async fireInclude(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Include");
    await delay(2000); //adicional devido a processamento
  }

  async fireCompileKey(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Compile Key");
    await delay(2000); //adicional devido a processamento
  }

  async fireCheckIntegrity(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "RPO check integrity");
  }

  async fireRevalidate(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Revalidate RPO");
  }

  async fireRepositoryLog(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Repository Log");
  }

  async fireObjectsInspector(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Objects Inspector");
  }

  async fireFunctionsInspector(): Promise<void> {
    await this.select();
await fireContextMenuAction(this.serverTreeItem, "Functions Inspector");
}
}