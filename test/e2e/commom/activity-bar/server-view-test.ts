import { expect } from "chai";
import { describe, before, it } from "mocha";
import { avoidsBacksliding, delay, openProject } from "../../helper";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { DELETE_DATA, APPSERVER_DATA } from "../../scenario";

describe("Server View", () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();
  });

  it("No Servers", async () => {
    expect(await serverTreePO.getVisibleItems()).is.empty;
  });

  it("Add Local Server", async () => {
    await serverTreePO.getServer(APPSERVER_DATA);
  });

  it("Remove Server", async () => {
    await avoidsBacksliding();

    await serverTreePO.getServer(DELETE_DATA);
    await delay();
    await serverTreePO.removeServer(DELETE_DATA.serverName);

    expect(await serverTreePO.getTreeItem(DELETE_DATA.serverName)).is.null;
  });
});
