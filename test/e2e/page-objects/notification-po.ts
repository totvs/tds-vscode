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
  center: any;

  constructor(workbench: Workbench) {
    this.workbench = workbench;
    (async () => {
      this.center = await this.workbench.openNotificationsCenter();
    })();
  }

  private async getNotifications(
    type: NotificationType = NotificationType.Any
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for await (const notification of await this.waitNotifications()) {
      if (
        type == NotificationType.Any ||
        (await notification.getType()) == type
      ) {
        notifications.push(notification);
      }
    }

    return notifications;
  }

  async getNotification(
    targetText: RegExp | string,
    type: NotificationType,
    _wait: number = 1000
  ): Promise<Notification | undefined> {
    const target: RegExp = new RegExp(targetText, "i");

    let steps: number = _wait / 500;
    let result: Notification = undefined;

    while (result === undefined && steps > 0) {
      const notifications: Notification[] = await this.getNotifications(type);
      await delay(500);

      notifications.reverse().forEach(async (element: Notification) => {
        if (!result) {
          const message: string = await element.getMessage();

          if (target.exec(message)) {
            result = element;
          }
        }
      });

      steps--;
    }

    return result;
  }

  // center = await new Workbench().openNotificationsCenter();

  // // get notifications from the notifications center
  // // this time they can be filtered by type
  // // lets get info notifications only
  // notifications = await center.getNotifications(NotificationType.Info);

  private async waitNotifications(
    delay: number = WAIT_NOTIFICATION_TIMEOUT
  ): Promise<Notification[]> {
    //return await VSBrowser.instance.driver.wait(async () => {
    //return await this.workbench.getNotifications();
    // const notifications = await new Workbench().getNotifications();
    // return notifications;
    //}, delay);

    return await this.center.getNotifications(NotificationType.Any);
  }
}
