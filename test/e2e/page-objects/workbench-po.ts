import {
  Workbench,
  Notification,
  NotificationType,
  ActivityBar,
  SideBarView,
  ViewControl,
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
  private async processInProgress(
    targetText: RegExp | string
  ): Promise<boolean> {
    let notification: Notification = await this.getNotification(targetText);

    return await notification.hasProgress();
  }

  private async waitProcessFinish(
    targetText: RegExp | string,
    _wait: number = 30000
  ): Promise<Notification> {
    let steps: number = _wait / 500;
    let notification: Notification = await this.getNotification(targetText);

    if (notification) {
      try {
        while ((await notification.hasProgress()) && steps > 0) {
          await delay(500);
          steps--;
        }
        expect(
          notification.hasProgress(),
          `Timeout process (${_wait}ms): ${targetText}`
        ).is.false;
      } catch (error) {
        //em caso de erro, considera que é barra de progresso que é destruída
        //quando o processo termina
      }
    }

    return notification;
  }

  async waitConnection(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Authenticating user/);
  }

  async waitReconnection(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Reconnecting to the server/);
  }

  async waitCheckIntegrity(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Checking RPO integrity/);
  }

  async waitRevalidate(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Revalidating RPO/);
  }

  async waitRpoLoaded(wait: number = 30000): Promise<void> {
    await this.waitProcessFinish(/Loading RPO content/);
  }

  async applyPatchInProgress() {
    return await this.processInProgress(/Applying patch/);
  }

  async waitApplyPatch() {
    await this.waitProcessFinish(/Applying patch/, 180000); // 3 min para terminar
  }

  async getNotification(
    targetText: RegExp | string,
    _wait: number = 1000
  ): Promise<Notification> {
    const notification: Notification = await this.notification.getNotification(
      targetText,
      NotificationType.Any,
      _wait
    );

    return notification;
  }

  async executeCommand(command: string) {
    await this.workbench.executeCommand(command);
  }

  private async getView(beginViewName: string): Promise<SideBarView> {
    const activityBar: ActivityBar = new ActivityBar();
    const controls: ViewControl[] = await activityBar.getViewControls();
    const viewList: Promise<SideBarView>[] = controls
      .filter(async (element: ViewControl) => {
        return (await element.getTitle()).startsWith(beginViewName);
      })
      .map(async (element: ViewControl) => {
        return await element.openView();
      });
    await Promise.all(viewList);

    await delay();

    return await viewList[0];
  }

  async openExplorerView(): Promise<SideBarView> {
    await this.executeCommand("workbench.explorer.fileView.focus");

    return await this.getView("Explorer");
  }

  async openTotvsView(): Promise<SideBarView> {
    await this.executeCommand("totvs_server.focus");

    return this.getView("TOTVS");
  }
}
