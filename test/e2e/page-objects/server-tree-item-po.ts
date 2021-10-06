import { expect } from "chai";
import { By, ContextMenu, ContextMenuItem, InputBox, QuickPickItem, TreeItem, ViewItem, ViewItemAction } from "vscode-extension-tester";
import { delay, fillEnvironment, fillUserdata, fireContextMenuAction, takeQuickPickAction } from "../helper";
import { IUserData } from "./interface-po";
import { StatusPageObject } from "./status-po";

export class ServerTreeItemPageObject {
	private serverTreeItem: TreeItem;

	constructor(serverTreeItem: TreeItem) {
		this.serverTreeItem = serverTreeItem;
	}

	async connect(environment: string, userData: IUserData) {
		this.select();
		await fireContextMenuAction(this.serverTreeItem, "Connect");

		await fillEnvironment(environment);
		await fillUserdata(userData);

		const statusBarPO: StatusPageObject = new StatusPageObject();
		await statusBarPO.wait();

		await statusBarPO.waitConnection();
		expect(await statusBarPO.isConnected(await this.serverTreeItem.getLabel(), environment)).is.true;
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

	async fireDisconnectAction() {
		const action: ViewItemAction = await this.serverTreeItem.getActionButton(
			"Disconnect"
		);

		await action.click();
		await delay();
	}

	async isConnected(): Promise<boolean> {
		const icon = await this.serverTreeItem.findElement(By.className("custom-view-tree-node-item-icon"));
		const klass = await icon.getAttribute("style");

		return klass.indexOf("server.connected.svg") > -1;
	}

	async isNotConnected(): Promise<boolean> {
		const icon = await this.serverTreeItem.findElement(By.className("custom-view-tree-node-item-icon"));
		const klass = await icon.getAttribute("style");

		return klass.indexOf("_server.svg") > -1;
	}

	async fireReconnectAction() {
		await this.select();
		await fireContextMenuAction(this.serverTreeItem, "Reconnect");
		await delay(2000);
	}

	async fireAddServerAction() {
		await this.select();
		await fireContextMenuAction(this.serverTreeItem, "Add Server");
		await delay();
	}

	async fireDefragAction() {
		await this.select();
		await fireContextMenuAction(this.serverTreeItem, "Defrag RPO");
		await delay();
	}

	async fireInclude() {
		await this.select();
		await fireContextMenuAction(this.serverTreeItem, "Include");
		await delay();
	}

	async fireCompileKey() {
		await this.select();
		await fireContextMenuAction(this.serverTreeItem, "Compile Key");
		await delay();
	}

}