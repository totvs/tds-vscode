import { expect } from "chai";
import { describe, before, it, Context } from "mocha";
import { delay, openAdvplProject } from "../helper";
import { ApplyPatchPageObject } from "../page-objects/apply-patch-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, PATCHS_FILES } from "../scenario";
import { Notification } from "vscode-extension-tester";

describe("Patch Operations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject(await workbenchPO.openTotvsView());

    await serverTreePO.addNewServer(APPSERVER_DATA);

    await delay();
  });

  beforeEach(async () => {
    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(APPSERVER_DATA.serverName)
    );
  });

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  });

  (PATCHS_FILES.single ? it : it.skip)("Apply single file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile([PATCHS_FILES.single]);
    await applyPatchPO.fireSubmitCloseID();

    expect(await workbenchPO.applyPatchInProgress()).is.true;

    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isApplyPatch()).is.true;
  });

  (PATCHS_FILES.many ? it : it.skip)("Apply many file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile(PATCHS_FILES.many);
    await applyPatchPO.fireSubmitCloseID();

    expect(await workbenchPO.applyPatchInProgress()).is.true;

    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isApplyPatch()).is.true;
  });

  (PATCHS_FILES.invalid ? it : it.skip)("Apply invalid file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile(PATCHS_FILES.invalid);
    await applyPatchPO.fireSubmitCloseID();
    await delay(2000);

    expect(await workbenchPO.isPatchValidateNotBeExecuted()).is.true;
  });

  (PATCHS_FILES.zip ? it : it.skip)("Apply many file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile(PATCHS_FILES.zip);
    await applyPatchPO.fireSubmitCloseID();

    expect(await workbenchPO.applyPatchInProgress()).is.true;

    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isApplyPatch()).is.true;
  });
});
