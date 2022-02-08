import { By, TreeItem, ViewItemAction } from "vscode-extension-tester";
import {
  delay,
  DEFAULT_DELAY,
  fillEnvironment,
  fillUserdata,
  fireContextMenuAction,
} from "../helper";
import { IUserData } from "./interface-po";
import { WorkbenchPageObject } from "./workbench-po";

export class ServerTreeItemPageObject {
  private serverTreeItem: TreeItem;
  private workbenchPO: WorkbenchPageObject;

  constructor(serverTreeItem: TreeItem) {
    this.serverTreeItem = serverTreeItem;
    this.workbenchPO = new WorkbenchPageObject();
  }

  async connect(environment: string, userData: IUserData) {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Connect");
    await this.workbenchPO.waitValidatingServer();
    await delay();

    await fillEnvironment(environment);

    if (userData) {
      await fillUserdata(userData);
    }

    await this.workbenchPO.waitConnection();
  }

  async isLogix(): Promise<boolean> {
    const tooltip: string = await this.serverTreeItem.getTooltip();

    return tooltip.startsWith("Logix");
  }

  async isServerP20OrGreater(): Promise<boolean> {
    const tooltip: string = await this.serverTreeItem.getTooltip();
    const pos: number = tooltip.lastIndexOf(" ");

    return tooltip.substring(pos + 1).localeCompare("7.00.191205P") > 0;
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
    await fireContextMenuAction(this.serverTreeItem, "Disconnect");
  }

  async fireReconnectAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Reconnect");
    // await delay(DEFAULT_DELAY);
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
    await delay(DEFAULT_DELAY); // adicional devido a processamento
  }

  async fireCompileKey(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Compile Key");
    await delay(DEFAULT_DELAY); // adicional devido a processamento
  }

  async fireCheckIntegrity(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "RPO check integrity");
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

  async firePatchGenerationFromRPOAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(
      this.serverTreeItem,
      "Patch Generation (from RPO)"
    );
  }

  async fireApplyPatchAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.serverTreeItem, "Patch Apply");
  }
}
