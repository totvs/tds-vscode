import { expect } from "chai";
import { describe, before, it } from "mocha";
import { avoidsBacksliding, delay, prepareProject } from "../../helper";
import { OutputLsPageObject } from "../../page-objects/output-ls-po";
import { ServerPageObject } from "../../page-objects/server-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { DELETE_DATA, APPSERVER_DATA } from "../../scenario";
import { VALID_SERVER_SEQUENCE } from "./../../page-objects/output-ls-po";

describe("Server View", async () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let outputPO: OutputLsPageObject;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();
    outputPO = await workbenchPO.openOutputLs();
    serverTreePO = await workbenchPO.openTotvsView();
  });

  it("No Servers", async () => {
    const items = await serverTreePO.getVisibleItems();
    expect(items).is.empty;
  });

  it("Add Local Server", async () => {
    await outputPO.clearConsole();
    const serverPO: ServerPageObject = new ServerPageObject(APPSERVER_DATA);
    await workbenchPO.executeCommand("totvs-developer-studio.add");

    await serverPO.fillServerPage(APPSERVER_DATA);
    await serverPO.fireSaveClose();

    expect(await workbenchPO.isSavedServer()).is.true;
  });

  it("Validate Server", async () => {
    const text: string[] = await outputPO.extractServerSequenceTest();

    expect(text).to.be.an("array").and.is.eqls(VALID_SERVER_SEQUENCE);
  });

  it("Remove Server", async () => {
    await avoidsBacksliding();

    await serverTreePO.addServer(DELETE_DATA);
    await delay();
    await serverTreePO.removeServer(DELETE_DATA.serverName);

    expect(await serverTreePO.getTreeItem([DELETE_DATA.serverName])).is
      .undefined;
  });
});
