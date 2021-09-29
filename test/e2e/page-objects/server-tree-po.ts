import { expect } from "chai";
import { ActivityBar, By, SideBarView, TreeItem, ViewItemAction, Notification, Workbench, WebView } from "vscode-extension-tester";
import { delay, waitNotification } from "../helper";
import { IServerData } from "./interface-po";
import { ServerPageObject } from "./server-po";

export class ServerTreePageObject {
	private view: SideBarView;

	constructor() {
	}

	async openView(): Promise<SideBarView> {
		if (!this.view) {
			const activityBar = new ActivityBar();
			const control = await activityBar.getViewControl("TOTVS");

			this.view = await control.openView();
			await delay();
		}

		return this.view;
	}

	async getServerTreeItem(serverName: string): Promise<TreeItem> {
		const c = (await this.openView()).getContent();
		const s = await c.getSections();

		const serverTreeItem = (await s[0].findItem(
			serverName
		)) as TreeItem;

		return serverTreeItem
	}

	async clearServers() {
	}

	async removeServer(serverName: string, confirm: boolean = false) {
		const c = (await this.openView()).getContent();
		const s = await c.getSections();
		const i2 = await s[0].getVisibleItems();

		const i: TreeItem = (await s[0].findItem(serverName)) as TreeItem;
		await i.select();

		const action: ViewItemAction = await i.getActionButton("Delete Server");
		await action.click();
		await delay();

		if (confirm) {
			const notification: Notification = await waitNotification(
				"Tem certeza que deseja excluir este servidor"
			);

			expect(notification).not.is.undefined;

			await notification.takeAction("Sim");
			await delay();
		}
	}

	async addNewServer(data: IServerData) {
		await new Workbench().executeCommand("totvs-developer-studio.add");
		await delay();

		const webView: WebView = new WebView();
		await webView.switchToFrame();

		const serverPO = new ServerPageObject(data);
		await serverPO.fillAddServerPage(webView, data, true);
		await delay();

		await webView.switchBack();
	}

	async getNewServer(data: IServerData) {
		let serverTreeItem = await this.getServerTreeItem(data.serverName);

		if (!serverTreeItem) {
			await this.addNewServer(data);
			serverTreeItem = await this.getServerTreeItem(data.serverName);
		}

		return serverTreeItem;
	}

}