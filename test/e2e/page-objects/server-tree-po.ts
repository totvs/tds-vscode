import { expect } from "chai";
import { ActivityBar, By, SideBarView, TreeItem, ViewItemAction, Notification, Workbench, WebView, InputBox } from "vscode-extension-tester";
import { delay, waitNotification } from "../helper";
import { IServerData } from "./interface-po";
import { ServerPageObject } from "./server-po";
import { StatusPageObject } from "./status-po";

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

	async connect(serverName: string, environment: string, username: string, password: string, verify: boolean = false) {
		const serverTreeItem = await this.getServerTreeItem(serverName);

		const action: ViewItemAction = await serverTreeItem.getActionButton(
			"Connect"
		);
		await action.click();
		await delay(2);

		const pickBox: InputBox = new InputBox();
		await delay();

		if (verify) {
			let title = await pickBox.getTitle();
			expect(title).is.equal("Connection (1/1)");
		}

		await pickBox.setText(environment);
		await delay();
		await pickBox.confirm();
		await delay();

		await pickBox.wait(3000);

		if (verify) {
			const title = await pickBox.getTitle();
			expect(title).is.equal("Authentication (1/2)");
		}

		await pickBox.setText(username);
		await delay();
		await pickBox.confirm();
		await delay();

		await pickBox.wait();
		if (verify) {
			const title = await pickBox.getTitle();
			expect(title).is.equal("Authentication (2/2)");
		}
		await pickBox.setText(password);
		await delay();
		await pickBox.confirm();
		await delay();

		const statusBarPO: StatusPageObject = new StatusPageObject();
		await statusBarPO.waitConnection();
		if (verify) {
			expect(await statusBarPO.isConnected(serverName, environment)).is.true;
		}
	};

}