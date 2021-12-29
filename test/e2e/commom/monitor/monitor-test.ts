import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, PATCHS_FILES } from "../../scenario";
import { MonitorPageObject } from "./../../page-objects/monitor-po";
import { IMonitorData } from "./../../page-objects/interface-po";

describe.skip("Monitor Operations", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;
  let monitorPO: MonitorPageObject;
  let monitorData: IMonitorData;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);

    await delay();

    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
  });

  it("Open Monitor", async () => {
    monitorPO = await workbenchPO.openMonitor();

    expect(monitorPO).is.not.null;

    await delay();
  });

  it("Load data", async () => {
    monitorData = await monitorPO.getDataPage();

    expect(monitorData.subtitle).contain(APPSERVER_DATA.serverName);
  });

  it("Are there connections?", async () => {
    expect(monitorData.connections).is.not.empty;
  });

  describe("Send message", async () => {
    let skip: boolean = false;

    before(() => {
      //skip = true;
    });

    (!skip ? it : it.skip)("Send Message (one user)");
    (!skip ? it : it.skip)("Send Message (all user)");
  });
});