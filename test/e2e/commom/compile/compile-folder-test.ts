import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

describe.skip("Compile folders", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

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

  after(async () => {
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

  //   expect(notification).not.is.null;
  //   await notification?.dismiss();
  // });
});
