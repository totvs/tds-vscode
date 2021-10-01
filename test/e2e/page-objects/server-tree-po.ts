import { expect } from "chai";
import { ActivityBar, By, SideBarView, TreeItem, ViewItemAction, Notification, Workbench, WebView, InputBox, QuickPickItem, WebElement, ViewSection, ViewItem, ViewControl } from "vscode-extension-tester";
import { delay, fireContextMenuAction, takeQuickPickAction, waitNotification } from "../helper";
import { IServerData, IUserData } from "./interface-po";
import { ServerPageObject } from "./server-po";
import { ServerTreeItemPageObject } from "./server-tree-item-po";
import { StatusPageObject } from "./status-po";

export class ServerTreePageObject {
	private view: SideBarView;
	control: ViewControl;

	constructor() {
	}

	async openView(): Promise<SideBarView> {
		if (!this.view) {
			const activityBar = new ActivityBar();
			this.control = await activityBar.getViewControl("TOTVS");
			this.view = await this.control.openView();

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

	async removeServer(serverName: string, confirm: boolean = false) {
		const c = (await this.openView()).getContent();
		const s = await c.getSections();

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

	async addNewServer(data: IServerData): Promise<void> {
		await new Workbench().executeCommand("totvs-developer-studio.add");
		await delay();

		const webView: WebView = new WebView();
		await webView.switchToFrame();

		const serverPO = new ServerPageObject(data);
		await serverPO.fillAddServerPage(webView, data, true);

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

	async connect(serverName: string, environment: string, userdata: IUserData) {
		const serverPO: ServerTreeItemPageObject = new ServerTreeItemPageObject(await this.getServerTreeItem(serverName));

		await serverPO.connect(environment, userdata);
	};

	async disconnectAllServers(): Promise<void> {
		const c = (await this.openView()).getContent();
		const s = await c.getSections();
		const elements: ViewItem[] = await s[0].getVisibleItems();

		elements.forEach(async (element: WebElement) => {
			const item: ServerTreeItemPageObject = new ServerTreeItemPageObject(element as TreeItem);
			if (item.isConnected()) {
				await item.fireDisconnectAction();
				await delay();
			}
		})
	}
}