import {
  Workbench,
  Notification,
  NotificationType,
  ActivityBar,
  SideBarView,
  ViewControl,
  DebugView,
  EditorView,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { NotificationPageObject } from "./notification-po";
import { StatusPageObject } from "./status-po";
import { expect } from "chai";

const PROCESS_TIMEOUT = 10 * 1000; //10 segundos
const WAIT_PROCESS_TIMEOUT = 3 * 60 * 1000; // 3min

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

  private async testNotification(targetText: RegExp | string) {
    const notification: Notification = await this.getNotification(targetText);
    const result: boolean = notification ? true : false;
    await notification?.dismiss();

    return result;
  }

  async isRpoIntegrity(): Promise<boolean> {
    return await this.testNotification(/RPO [intact|incomplete]/);
  }

  async isSaveServer(): Promise<boolean> {
    return await this.testNotification(/Serve saved/);
  }

  async isLauncherSaved(): Promise<boolean> {
    return await this.testNotification(/Launcher Configuration saved/);
  }

  async isAuthenticationFailed(): Promise<boolean> {
    let result: boolean = false;

    await this.getNotification(/Authentication failed:/).then(
      async (notification: Notification) => {
        await notification?.dismiss();
        result = notification ? true : false;
      }
    );

    return result;
  }

  async isDAInitialing(): Promise<boolean> {
    return await this.testNotification(/TDS\-DA being initialized/);
  }

  async isDAReady(): Promise<boolean> {
    return await this.testNotification(/TDS\-DA ready/);
  }

  async isDACheckingSources(): Promise<boolean> {
    return await this.testNotification(/Checking the.*source/);
  }

  async isDASourceListRecording(): Promise<boolean> {
    return await this.testNotification(/Source List in this/);
  }

  async isDAReadingAllTimelines(): Promise<boolean> {
    return await this.testNotification(/Reading all TimeLines/);
  }

  async isDAReadingAllTimelinesDone(): Promise<boolean> {
    return await this.testNotification(/Reading all TimeLines.*DONE/);
  }

  async isDAStoppingFistLine(): Promise<boolean> {
    return await this.testNotification(/Stopping in the first timeline/);
  }

  async isDAStoppingFistLineDone(): Promise<boolean> {
    return await this.testNotification(/Stopping in the first timeline.*DONE/);
  }

  async isDABeingFinalized(): Promise<any> {
    return await this.testNotification(/TDS\-DA being finalized/);
  }

  async isDAFinished(): Promise<any> {
    return await this.testNotification(/TDS\-DA finished/);
  }

  async isPatchValidateNotBeExecuted(): Promise<boolean> {
    return await this.testNotification(/Patch validate could not be executed/);
  }

  async isPatchApplied(): Promise<boolean> {
    return await this.testNotification(/Patch applied/);
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

    return await notification?.hasProgress();
  }

  private async waitProcessFinish(
    targetText: RegExp | string,
    _wait: number = PROCESS_TIMEOUT
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

  async waitConnection(wait: number = PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Authenticating user/);
  }

  async waitReconnection(wait: number = PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Reconnecting to the server/);
  }

  async waitCheckIntegrity(wait: number = PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Checking RPO integrity/);
  }

  async waitRevalidate(wait: number = PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Revalidating RPO/);
  }

  async waitRpoLoaded(wait: number = PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Loading RPO content/);
  }

  async waitValidatingServer(): Promise<void> {
    await this.processInProgress(/Validating server/);
  }

  async applyPatchInProgress() {
    return await this.processInProgress(/Applying patch/);
  }

  async waitApplyPatch() {
    await this.waitProcessFinish(/Applying patch/, WAIT_PROCESS_TIMEOUT);
  }

  async waitImportReplay(delay: number = WAIT_PROCESS_TIMEOUT) {
    await this.waitProcessFinish(/Importing TDS Replay/, delay);
  }

  async getNotification(
    targetText: RegExp | string,
    _wait: number = 5000
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

  async openDebugView(): Promise<DebugView> {
    return (await (
      await new ActivityBar().getViewControl("Run")
    ).openView()) as DebugView;
  }

  async openExplorerView(): Promise<SideBarView> {
    await this.executeCommand("workbench.explorer.fileView.focus");

    return await this.getView("Explorer");
  }

  async openTotvsView(): Promise<SideBarView> {
    await this.executeCommand("totvs_server.focus");
    await delay();

    return this.getView("TOTVS");
  }

  async closeAllEditors() {
    const view = new EditorView();
    view.closeAllEditors();
    await delay();
  }
}
