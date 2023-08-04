import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, DEFAULT_DELAY, prepareProject } from "../../helper";
import { ApplyPatchPageObject } from "../../page-objects/apply-patch-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, PATCHS_FILES } from "../../scenario";

describe("Patch Operations", async () => {
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
    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  });

  it("Apply single file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await delay();

    await applyPatchPO.setUploadFile([PATCHS_FILES.single]);
    await applyPatchPO.fireSubmitClose();
    await delay(DEFAULT_DELAY);

    expect(await workbenchPO.applyPatchInProgress()).is.true;

    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isPatchApplied()).is.true;
  });

  it("Apply many file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile(PATCHS_FILES.many);
    await applyPatchPO.fireSubmitClose();
    await delay(DEFAULT_DELAY);

    expect(await workbenchPO.applyPatchInProgress()).is.true;

    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isPatchApplied()).is.true;
  });

  it("Apply invalid file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile(PATCHS_FILES.invalid);
    await applyPatchPO.fireSubmitClose();
    await delay(DEFAULT_DELAY);

    if (await serverItemPO.isServerLogix()) {
      expect(await workbenchPO.isPatchFileNotFoundOrInvalid()).is.true;
    } else {
      expect(await workbenchPO.isPatchVersionIncorrect()).is.true;
    }
    expect(await workbenchPO.isRequestFailed()).is.true;
    expect(await workbenchPO.isPatchValidateNotBeExecuted()).is.true;
  });

  it("Apply From Zip file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile(PATCHS_FILES.zip);

    await workbenchPO.applyCheckingZipInProgress();
    await applyPatchPO.fireSubmitClose();

    expect(await workbenchPO.applyPatchInProgress()).is.true;
    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isPatchApplied()).is.true;
  });
});
