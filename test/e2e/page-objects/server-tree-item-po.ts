import { By, TreeItem, ViewItemAction } from "vscode-extension-tester";
import { delay } from "../helper";

export class ServerTreeItemPageObject {
	private serverTreeItem: TreeItem;

	constructor(serverTreeItem: TreeItem) {
		this.serverTreeItem = serverTreeItem;
	}

	async select() {
		await this.serverTreeItem.select();
		await delay(2);
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

}