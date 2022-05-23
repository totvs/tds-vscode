import {
  Workbench,
  Notification,
  NotificationType,
  EditorView,
  InputBox,
} from "vscode-extension-tester";
import { delay, DELAY_MEDIUM } from "../helper";
import { NotificationPageObject } from "./notification-po";
import { StatusPageObject } from "./status-po";
import { expect } from "chai";
import { ExplorerPageObject } from "./explorer-view-po";
import { ServerViewPageObject } from "./server-view-po";
import { DebugPageObject } from "./debug-view-po";
import { MonitorPageObject } from "./monitor-po";
import { OutputLsPageObject } from "./output-ls-po";
import { ProblemsPageObject } from "./problem-view-po";
import { BottomBarPageObject } from "./bottom-bar-po";

const FAST_PROCESS_TIMEOUT = 30 * 1000; //30 segundos
const MEDIUM_PROCESS_TIMEOUT = 60 * 1000; //1 min
const SLOW_PROCESS_TIMEOUT = 3 * 60 * 1000; // 3min

export class WorkbenchPageObject {
  private _workbench: Workbench;
  private statusBar: StatusPageObject;
  private notification: NotificationPageObject;
  private bottombar: BottomBarPageObject;

  constructor() {
    this._workbench = new Workbench();
    this.statusBar = new StatusPageObject(this._workbench);
    this.notification = NotificationPageObject.create(this._workbench);
    this.bottombar = new BottomBarPageObject();
  }

  async wait() {
    await delay(500);
    await this._workbench.getStatusBar().wait(2000);
  }

  async isConnected(
    name: string,
    environment: string
  ): Promise<boolean> {
    return (
      (await this.statusBar.statusBarWithText(
        `${name} / ${environment}`,
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

  private async testNotification(
    targetText: RegExp | string
  ): Promise<boolean> {
    const notification: Notification = await this.getNotification(targetText);
    const result: boolean = notification ? true : false;
    await notification?.dismiss();

    return result;
  }

  async isRpoIntactOrIncomplete(): Promise<boolean> {
    return await this.testNotification(/RPO [intact|incomplete]/);
  }

  async isSavedServer(): Promise<boolean> {
    return await this.testNotification(/Serve saved/);
  }

  async isLauncherSaved(): Promise<boolean> {
    return await this.testNotification(/Launcher Configuration saved/);
  }

  async isAuthenticationFailed(): Promise<boolean> {
    let result: boolean = false;

    await this.getNotification(/Authentication failed/).then(
      async (notification: Notification) => {
        await notification?.dismiss();
        result = notification ? true : false;
      }
    );

    return result;
  }

  async isUserNotAdmin(): Promise<boolean> {
    return await this.testNotification(/User is not admin/);
  }

  async isInvalidUser(): Promise<boolean> {
    return await this.testNotification(/Invalid user and\/or password/);
  }

  async isAcessDenied(): Promise<boolean> {
    return await this.testNotification(/Authentication.*Access denied/);
  }

  async isApplyTemplateNotSuported(): Promise<boolean> {
    return await this.testNotification(/Operation not supported.*version/);
  }

  async isDAInitialing(): Promise<boolean> {
    return await this.testNotification(/TDS\-DA being initialized/);
  }

  async isDAReady(): Promise<boolean> {
    return await this.testNotification(/TDS\-DA ready/);
  }

  async isDAServerConnected(): Promise<boolean> {
    return await this.testNotification(/Application Server connected/);
  }

  async isDACheckingSources(): Promise<boolean> {
    return await this.testNotification(/Checking the.*source/);
  }

  async isDASourceListRecording(): Promise<boolean> {
    return await this.testNotification(/Source List in this/);
  }

  async isDAReadingAllTimelines(): Promise<boolean> {
    return await this.testNotification(
      /Reading all TimeLines from the database\. Please wait.*time/
    );
  }

  async isDAReadingAllTimelinesDone(): Promise<boolean> {
    return await this.testNotification(/Read all TimeLines from the database/);
  }

  async isDAStoppingFistLineDone(): Promise<boolean> {
    return await this.testNotification(/Stopped in the first timeline./);
  }

  async isDABeingFinalized(): Promise<any> {
    return await this.testNotification(/TDS\-DA being finalized/);
  }

  async isDAFinished(): Promise<any> {
    return this.testNotification(/TDS\-DA finished/);
  }

  async isDAEndProcess(): Promise<boolean> {
    return await Promise.all([
      await this.testNotification(/Closing SmartClient/),
      await this.testNotification(/ExitCode=.*ExistStatus=.*/),
      await this.testNotification(/SmartClient closed/),
      await this.testNotification(/TDS-DA being finalized/),
      await this.isDAFinished(),
    ]).then((value: boolean[]) => {
      return !value.includes(false);
    });
  }

  async isDABeginProcess(): Promise<boolean> {
    return await Promise.all([
      await this.isDAInitialing(),
      await this.isDAReady(),
      await this.isDAServerConnected(),
    ]).then((value: boolean[]) => {
      return !value.includes(false);
    });
  }

  async isPatchValidateNotBeExecuted(): Promise<boolean> {
    return await this.testNotification(/Patch validate could not be executed/);
  }

  async isRequestFailed(): Promise<boolean> {
    return await this.testNotification(/A request has failed/);
  }

  async isPatchVersionIncorrect(): Promise<boolean> {
    return await this.testNotification(/Path version incorrect/);
  }

  async isPatchFileNotFoundOrInvalid(): Promise<boolean> {
    return await this.testNotification(/Patch file not found or invalid/);
  }

  async isPatchApplied(): Promise<boolean> {
    return await this.testNotification(/Patch applied/);
  }

  async isTemplateApplied(): Promise<boolean> {
    return await this.testNotification(/Template applied/);
  }

  async isOneOrMoreFileHaveError(): Promise<boolean> {
    await this.testNotification(/\[FATAL\] Aborting/);
    return await this.testNotification(/One or more files have.*/);
  }

  async isCompileOk(): Promise<boolean> {
    return ! (await this.isOneOrMoreFileHaveError());
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

  private async waitNotification(
    targetText: RegExp | string,
    _wait: number = FAST_PROCESS_TIMEOUT
  ) {
    let steps: number = _wait / 500;
    let notification: Notification = await this.getNotification(targetText);

    if (notification) {
      let notificationAux;
      while (!notificationAux && steps > 0) {
        await delay(500);
        steps--;

        notificationAux = await this.getNotification(targetText);
      }
    }

    return notification;
  }

  public async waitProcessFinish(
    targetText: RegExp | string,
    _wait: number = FAST_PROCESS_TIMEOUT
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

  async waitAuthenticating(wait: number = MEDIUM_PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Authenticating user/, wait);
  }

  async waitAskShowCompileResult(
    wait: number = MEDIUM_PROCESS_TIMEOUT
  ): Promise<Notification> {
    return await this.waitNotification(/Show table with compile results/, wait);
  }

  async waitConnection(wait: number = MEDIUM_PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Authenticating user/, wait);
  }

  async waitReconnection(wait: number = MEDIUM_PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Reconnecting to the server/);
  }

  async waitCheckIntegrity(wait: number = FAST_PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Checking RPO integrity/);
  }

  async waitRevalidate(wait: number = FAST_PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Revalidating RPO/);
  }

  async waitRpoLoaded(wait: number = FAST_PROCESS_TIMEOUT): Promise<void> {
    await this.waitProcessFinish(/Loading RPO content/);
  }

  async waitValidatingServer(): Promise<void> {
    await this.waitProcessFinish(/Validating server/);
  }

  async startConnection(): Promise<boolean> {
    return await this.testNotification(/Starting connection to/);
  }

  async connectionServer(): Promise<boolean> {
    return await this.testNotification(/Connection to the server/);
  }

  async startingUser(): Promise<boolean> {
    return await this.testNotification(/Starting user/);
  }

  async authenticationFinished(): Promise<boolean> {
    return await this.testNotification(/User '.*' authentication finished/);
  }

  async isAuthenticatedSuccessfully(): Promise<boolean> {
    return await this.testNotification(/User authenticated successfully/);
  }

  async applyTemplateInProgress(): Promise<boolean> {
    return await this.processInProgress(/Applying template/);
  }

  async waitApplyTemplate() {
    await this.waitProcessFinish(/Applying template/, SLOW_PROCESS_TIMEOUT);
  }

  async applyCheckingZipInProgress(): Promise<boolean> {
    return await this.processInProgress(/Checking zip files/);
  }

  async applyPatchInProgress(): Promise<boolean> {
    return await this.processInProgress(/Applying patch/);
  }

  async waitApplyPatch(delay: number = SLOW_PROCESS_TIMEOUT) {
    await this.waitProcessFinish(/Applying patch/, delay);
  }

  async waitImportReplay(delay: number = SLOW_PROCESS_TIMEOUT) {
    await this.waitProcessFinish(/Importing TDS Replay/, delay);
  }

  async waitBuilding(_delay: number = SLOW_PROCESS_TIMEOUT) {
    await this.waitProcessFinish(/Building\.\.\./, _delay);
    await delay(DELAY_MEDIUM);
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
    await this._workbench.executeCommand(command);
    await delay();
  }

  async promptCommand(text: string) {
    await this._workbench.openCommandPrompt().then(async (value: InputBox) => {
      await value.setText(text);
      await value.confirm();
    });
  }

  async openMonitor(): Promise<MonitorPageObject> {
    await this.executeCommand("TOTVSMonitor: Open monitor view");

    return new MonitorPageObject(this);
  }

  async openDebugView(): Promise<DebugPageObject> {
    const po: DebugPageObject = new DebugPageObject();
    await po.openView();

    return po;
  }

  async openExplorerView(): Promise<ExplorerPageObject> {
    const po: ExplorerPageObject = new ExplorerPageObject();
    await po.openView();

    return po;
  }

  async openTotvsView(): Promise<ServerViewPageObject> {
    const po: ServerViewPageObject = new ServerViewPageObject();
    await po.openView();

    return po;
  }

  async openOutputLs(): Promise<OutputLsPageObject> {
    const po: OutputLsPageObject = new OutputLsPageObject(this);
    await po.openPanel();

    return po;
  }

  async openProblemsView(): Promise<ProblemsPageObject> {
    const po: ProblemsPageObject = await this.bottombar.openProblemsView();
    //await po.openPanel();

    return po;
  }

  async closeAllEditors() {
    const view = new EditorView();
    view.closeAllEditors();
    await delay();
  }

  async waitStopDebugger(wait: number = MEDIUM_PROCESS_TIMEOUT) {
    return await this.waitNotification(/Closing SmartClient/, wait);
  }
}
