import { expect } from "chai";
import { assert } from "console";
import { describe, before, it } from "mocha";
import { By, WebElement } from "vscode-extension-tester";
import { delay, openAdvplProject } from "../helper";
import { ApplyPatchPageObject } from "../page-objects/apply-patch-po";
import { PatchGeneratePageObject } from "../page-objects/patch-generate-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, PATCHS_FILES } from "../scenario";

describe.only("Patch Operations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();

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

  it.only("Apply single file", async () => {
    await serverItemPO.fireApplyPatchAction();

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();

    await applyPatchPO.setUploadFile([PATCHS_FILES.single]);

    await applyPatchPO.fireSubmitCloseID();

    await workbenchPO.waitApplyPatch();
    //await applyPatchPO.endWebView();

    //      expect(optionsRight.length).is.equal(2);

    //await patchGeneratePO.close();
  });

  // (PATCHS_FILES.many.length > 1 ? it.skip : it)("Apply many file", async () => {
  //   await serverItemPO.fireApplyPatchAction();

  //   const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();

  //   await applyPatchPO.beginWebView();

  //   await applyPatchPO.endWebView();

  //   //      expect(optionsRight.length).is.equal(2);

  //   //await patchGeneratePO.close();
  // });

  // (PATCHS_FILES.zip.length == 0 ? it.skip : it)("Apply many file", async () => {
  //   await serverItemPO.fireApplyPatchAction();

  //   const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();

  //   await applyPatchPO.beginWebView();

  //   await applyPatchPO.endWebView();

  //   //      expect(optionsRight.length).is.equal(2);

  //   //await patchGeneratePO.close();
  // });
});
