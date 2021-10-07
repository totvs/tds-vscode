import { StatusBar, VSBrowser, Notification, Workbench, NotificationsCenter } from "vscode-extension-tester";
import { delay } from "../helper";
import { StatusPageObject } from "./status-po";

const WAIT_NOTIFICATION_TIMEOUT = 2000;

export class NotificationPageObject {
	private workbench: Workbench;
	private notifications: NotificationsCenter;

	constructor(workbench: Workbench) {
		this.workbench = workbench;
		//(async () => { this.notifications = await this.workbench.openNotificationsCenter() })();
	}

	async waitNotification(
		containText: string,
		dismiss: boolean
	): Promise<Notification | undefined> {
		return await VSBrowser.instance.driver.wait(async () => {
			const notification: Notification = await this.notificationExists(containText.toLowerCase());
			if (dismiss) {
				await notification?.dismiss();
			}

			return notification;
		}, WAIT_NOTIFICATION_TIMEOUT);
	}

	async notificationExists(
		text: string
	): Promise<Notification | undefined> {
		const notifications = await this.workbench.getNotifications();

		for (const notification of notifications) {
			const message = (await notification.getMessage()).toLowerCase();
			if (message.indexOf(text) >= 0) {
				return notification;
			}
		}

		return undefined;
	}
}