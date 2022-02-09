import {
  VSBrowser,
  Notification,
  Workbench,
  NotificationType,
  NotificationsCenter,
} from "vscode-extension-tester";
import { delay, DEFAULT_DELAY } from "../helper";

export class NotificationPageObject {
  private center: any;
  //private driver: any;

  static create(workbench: Workbench): NotificationPageObject {
    const po: NotificationPageObject = new NotificationPageObject();
    workbench
      .openNotificationsCenter()
      .then((value: NotificationsCenter) => (po.center = value));

    return po;
  }

  private constructor() {
    //this.driver = VSBrowser.instance.driver;
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

  private async waitNotifications(
    delay: number = DEFAULT_DELAY
  ): Promise<Notification[]> {
    //return await this.driver.wait(() => {
    return this.center.getNotifications(NotificationType.Any);
    //}, delay);
  }
}
