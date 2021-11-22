import { AbstractPageObject } from "./abstract-po";
import { IReplayData } from "./interface-po";
import { WorkbenchPageObject } from "./workbench-po";

export class ReplayPageObject extends AbstractPageObject {
  private workbenchPO: WorkbenchPageObject;

  constructor(workbenchPO: WorkbenchPageObject) {
    super();

    this.workbenchPO = workbenchPO;
  }

  async openLauncher(): Promise<void> {
    await this.workbenchPO.executeCommand("totvs-developer-studio.tdsreplay.configure.launcher");
  }

  async fireSaveClose() {
    await this.beginWebView();

    await this.click("submitCloseID");

    await this.endWebView();
  }

  async getDataPage(): Promise<IReplayData> {
    const result: IReplayData = {
      passwordID: "",
      includeSrcID: "",
      excluseSrcID: "",
      TDSReplayFile: "",
      launcherName: "",
      ignoraSourceNotFoundID: false,
    };
    await this.beginWebView();

    result.launcherName = await this.getValue("launcherNameID");
    result.TDSReplayFile = await this.getValue("TDSReplayFile");
    result.passwordID = await this.getValue("passwordID");
    result.includeSrcID = await this.getValue("includeSrcID");
    result.excluseSrcID = await this.getValue("excluseSrcID");
    result.ignoraSourceNotFoundID =
      (await this.getValue("ignoraSourceNotFoundID")) == "true";

    await this.endWebView();
    return result;
  }

  async setDataPage(data: IReplayData): Promise<void> {
    await this.beginWebView();

    await this.setValue("launcherNameID", data.launcherName );
    await this.setValue("TDSReplayFile", data.TDSReplayFile);
    await this.setValue("passwordID", data.passwordID   );
    await this.setValue("includeSrcID", data.includeSrcID );
    await this.setValue("excluseSrcID", data.excluseSrcID );
    await this.setValue("ignoraSourceNotFoundID", data.ignoraSourceNotFoundID? "true":"false");

    await this.endWebView();
  }
}
