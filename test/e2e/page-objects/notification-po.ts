import {
  VSBrowser,
  Notification,
  Workbench,
  NotificationType,
} from "vscode-extension-tester";
import { delay } from "../helper";

const WAIT_NOTIFICATION_TIMEOUT = 2000;

export class NotificationPageObject {
  private workbench: Workbench;

  constructor(workbench: Workbench) {
    this.workbench = workbench;
  }

  async getNotifications(
    type: NotificationType = NotificationType.Any
  ): Promise<Notification[]> {
    const notifications: Notification[] = await this.waitNotification();

    return notifications.filter(async (notification: Notification) => {
      type == NotificationType.Any || (await notification.getType()) == type;
    });
  }

  async getNotification(
    targetText: RegExp | string,
    dimiss: boolean,
    type: NotificationType,
    _wait: number = 1000
  ): Promise<Notification | undefined> {
    const target: RegExp = new RegExp(targetText, "i");

    let steps: number = _wait / 500;
    let result: Notification = null;

    while (result === null && steps > 0) {
      const notifications: Notification[] = await this.getNotifications(type);
      await delay(500);

      notifications.forEach(async (element: Notification) => {
        if (!result) {
          const message: string = await element.getMessage();

          if (target.exec(message)) {
            result = element;
          }
        }
      });

      steps--;
    }

    if (result && dimiss) {
      result.dismiss();
    }

    return result;
  }

  private async waitNotification(): Promise<Notification[]> {
    return await VSBrowser.instance.driver.wait(async () => {
      return await this.workbench.getNotifications();
    }, WAIT_NOTIFICATION_TIMEOUT);
  }
}
