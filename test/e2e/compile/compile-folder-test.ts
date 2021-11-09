import { expect } from "chai";
import { describe, before, it, Context } from "mocha";
import { delay, openAdvplProject } from "../helper";
import { ApplyPatchPageObject } from "../page-objects/apply-patch-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../scenario";

describe("Compile folders", () => {
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

  it("Compile folders");

  it("Recompile folders");

  it("Compile folders with errors");
  // , async () => {
  //   const compilePO: CompilePageObject = new CompilePageObject();

  //   await applyPatchPO.setUploadFile([PATCHS_FILES.single]);
  //   await applyPatchPO.fireSubmitCloseID();

  //   expect(await workbenchPO.applyPatchInProgress()).is.true;

  //   await workbenchPO.waitApplyPatch();

  //   const notification: Notification = await workbenchPO.getNotification(
  //     /Patch applied/
  //   );

  //   expect(notification).not.is.undefined;
  //   await notification?.dismiss();
  // });
});
