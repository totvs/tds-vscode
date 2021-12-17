import { delay, fireContextMenuAction } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { TreeItem } from "vscode-extension-tester";
import { WorkbenchPageObject } from "./workbench-po";
import { IMonitorConnectionsData, IMonitorData } from "./interface-po";

const DEFAULT_MONITOR_DATA: IMonitorData = {
  subtitle: "",
  connections: [],
};

export class MonitorPageObject extends AbstractPageObject {
  private workspacePO: WorkbenchPageObject;

  constructor(workspacePO: WorkbenchPageObject) {
    super();

    this.workspacePO = workspacePO;
  }

  async fireBuildFile(item: TreeItem) {
    await item.select();
    await delay();
    await fireContextMenuAction(item, "Compile File/Folder");
  }

  async fireRebuildFile(item: TreeItem) {
    await item.select();
    await delay();
    await this.workspacePO.executeCommand(
      "totvs-developer-studio.rebuild.file"
    );
  }

  async getDataPage(): Promise<IMonitorData> {
    const result: IMonitorData = { ...DEFAULT_MONITOR_DATA };
    await this.beginWebView();

    result.subtitle = await this.getSubtitle();
    result.connections = await this.getConnections();

    await this.endWebView();
    return result;
  }

  private async getSubtitle(): Promise<string> {
    return "";
  }

  private async getConnections(): Promise<IMonitorConnectionsData[]> {
    const result: IMonitorConnectionsData[] = [];

    return result;
  }
}
