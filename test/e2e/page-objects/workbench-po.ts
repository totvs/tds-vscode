import {
  Workbench,
  Notification,
  NotificationType,
  WebElement,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { NotificationPageObject } from "./notification-po";
import { StatusPageObject } from "./status-po";
import { expect } from "chai";

export class WorkbenchPageObject {
  private workbench: Workbench;
  private statusBar: StatusPageObject;
  private notification: NotificationPageObject;

  constructor() {
    this.workbench = new Workbench();
    this.statusBar = new StatusPageObject(this.workbench);
    this.notification = new NotificationPageObject(this.workbench);
  }

  async wait() {
    await delay(500);
    await this.workbench.getStatusBar().wait(2000);
  }

  async isConnected(
    LOCALHOST_NAME: string,
    LOCALHOST_ENVIRONMENT: string
  ): Promise<boolean> {
    return (
      (await this.statusBar.statusBarWithText(
        `${LOCALHOST_NAME} / ${LOCALHOST_ENVIRONMENT}`,
        10000
      )) !== null
    );
  }

  async isNeedSelectServer(): Promise<boolean> {
    return (
      (await this.statusBar.statusBarWithText(/Select server\/environment/)) !==
      null
    );
  }

  async isHaveKey(): Promise<boolean> {
    return (await this.statusBar.statusBarWithText(/HAVE key/)) !== null;
  }

  async isNotHaveKey(): Promise<boolean> {
    return (await this.statusBar.statusBarWithText(/NOT key/)) !== null;
  }

  private async waitProcessFinish(
    targetText: RegExp | string,
    _wait: number = 30000
  ): Promise<Notification> {
    let steps: number = _wait / 500;
    this.statusBar.statusBarWithText;
    let notification: Notification = await this.getNotification(targetText);

    if (notification) {
      while ((await notification.hasProgress()) && steps > 0) {
        await delay(500);

        steps--;
      }

      expect(
        notification.hasProgress(),
        `Timeout process (${_wait}ms): ${targetText}`
      ).is.false;
    }

    return notification;
  }

  async waitConnection(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Authenticating user/);
    // if (
    //   (await this.statusBar.statusBarWithText(/Authenticating user.*/),
    //   wait) === null
    // ) {
    //   throw new Error(`Connection process timeout (${wait})ms`);
    // }
  }

  async waitReconnection(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Reconnecting to the server/);
  }

  async waitCheckIntegrity(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Reconnecting to the server/);
  }

  async waitRevalidate(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Revalidating RPO/);
  }

  async waitRpoLoaded(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Loading RPO content/);
  }

  async waitApplyPatch() {
    throw new Error("Method not implemented.");
  }

  async getNotification(
    targetText: RegExp | string,
    dimiss: boolean = true,
    _wait: number = 1000
  ): Promise<Notification> {
    const notification: Notification = await this.notification.getNotification(
      targetText,
      dimiss,
      NotificationType.Any,
      _wait
    );

    return notification;
  }

  async executeCommand(command: string) {
    await this.workbench.executeCommand(command);
  }
}
