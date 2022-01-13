import { expect } from "chai";
import { describe, before, it } from "mocha";
import { avoidsBacksliding, delay, openProject } from "../../helper";
import { OutputLsPageObject } from "../../page-objects/output-ls-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { DELETE_DATA, APPSERVER_DATA } from "../../scenario";

describe("Server View", () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let outputPO: OutputLsPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    outputPO = await workbenchPO.openOutputLs();
    serverTreePO = await workbenchPO.openTotvsView();
  });

  it("No Servers", async () => {
    expect(await serverTreePO.getVisibleItems()).is.empty;
  });

  it("Add Local Server", async () => {
    await outputPO.clearConsole();
    await serverTreePO.addServer(APPSERVER_DATA);
  });

  it("Console log (Local Server)", async () => {
    await outputPO.validServerSequenceTest();
  });

  it("Remove Server", async () => {
    await avoidsBacksliding();

    await serverTreePO.addServer(DELETE_DATA);
    await delay();
    await serverTreePO.removeServer(DELETE_DATA.serverName);

    expect(await serverTreePO.getTreeItem(DELETE_DATA.serverName)).is.undefined;
  });
});
