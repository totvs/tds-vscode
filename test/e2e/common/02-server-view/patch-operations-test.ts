import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, prepareProject } from "../../helper";
import { PatchGeneratePageObject } from "../../page-objects/patch-generate-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

describe("Patch Operations (forms)", async () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);

    await delay();
  });

  beforeEach(async () => {
    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
  });

  afterEach(async () => {
    await workbenchPO.closeAllEditors();

    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  });

  it("From RPO", async () => {
    await serverItemPO.firePatchGenerationFromRPOAction();

    const patchGeneratePO: PatchGeneratePageObject =
      new PatchGeneratePageObject();
    await delay();

    await workbenchPO.waitRpoLoaded();

    expect(await patchGeneratePO.applyFilterInput("_NOT_FOUND_")).is.false;
    expect(await patchGeneratePO.applyFilterInput("CFGX*")).is.true;

    const options: string[] = await patchGeneratePO.getLeftOption();
    await patchGeneratePO.selectLeftOption(options[0]);

    let optionsRight: string[] = await patchGeneratePO.getRightOption();
    expect(optionsRight.length).is.equal(1);

    await patchGeneratePO.selectLeftOption(...options.slice(0, 10));
    optionsRight = await patchGeneratePO.getRightOption();
    expect(optionsRight.length).is.equal(10);
  });

  it("Patch Generation (by difference)");

  it("Patch Apply");
});
