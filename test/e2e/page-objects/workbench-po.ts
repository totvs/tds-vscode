import {
  Workbench,
  Notification,
  NotificationType,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { NotificationPageObject } from "./notification-po";
import { StatusPageObject } from "./status-po";

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

  async isLoggedIn(): Promise<boolean> {
    return (
      (await this.statusBar.statusBarWithText(/Permissions: Logged in/)) !==
      null
    );
  }

  async isNotLoggedIn(): Promise<boolean> {
    return (
      (await this.statusBar.statusBarWithText(/Permissions: NOT logged in/)) !==
      null
    );
  }

  async waitConnection(wait: number = 30000): Promise<void> {
    if (
      (await this.statusBar.statusBarWithText(/Authenticating user.*/),
      wait) === null
    ) {
      throw new Error(`Connection process timeout (${wait})ms`);
    }
  }

  async waitReconnection(wait: number = 30000): Promise<void> {
    if (
      (await this.statusBar.statusBarWithText(/.*Reconnecting to the server*./),
      wait) === null
    ) {
      throw new Error(`Connection process timeout (${wait})ms`);
    }
  }

  async waitCheckIntegrity(wait: number = 30000): Promise<void> {
    if (
      (await this.statusBar.statusBarWithText(/Checking RPO integrity/),
      wait) === null
    ) {
      throw new Error(`Check Integrity process timeout (${wait})ms`);
    }
  }

  async waitRevalidate(wait: number = 30000): Promise<void> {
    if (
      (await this.statusBar.statusBarWithText(/Revalidating RPO/), wait) ===
      null
    ) {
      throw new Error(`Revalidate process timeout (${wait})ms`);
    }
  }

  async getNotification(
    targetText: RegExp | string,
    dimiss: boolean = true,
    _wait: number = 1000
  ): Promise<Notification> {
    return await this.notification.getNotification(
      targetText,
      dimiss,
      NotificationType.Any,
      _wait
    );
  }

  async executeCommand(command: string) {
    await this.workbench.executeCommand(command);
  }
}
