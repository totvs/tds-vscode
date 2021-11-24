import { expect } from "chai";
import * as fs from "fs-extra";
import { describe, before, it } from "mocha";
import { TreeItem } from "vscode-extension-tester";
import { delay, openAdvplProject } from "../helper";
import { ExplorerPageObject } from "../page-objects/explorer-tree-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, COMPILE_FILES } from "../scenario";

describe("Compile files", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;
  let explorerPO: ExplorerPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject(await workbenchPO.openTotvsView());

    await serverTreePO.addNewServer(APPSERVER_DATA);
    await delay();

    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    //serverTreePO = new ServerTreePageObject(await workbenchPO.openTotvsView());
    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(APPSERVER_DATA.serverName)
    );
    await delay(2000);

    explorerPO = new ExplorerPageObject(await workbenchPO.openExplorerView());
    await delay(2000);
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  (COMPILE_FILES.userFunctions ? it : it.skip)(
    "Compile user function",
    async () => {
      const treeItem: TreeItem = await explorerPO.getTreeItem(
        COMPILE_FILES.userFunctions[0]
      );

      expect(treeItem).is.not.null;

      await delay(5000);
    }
  );

  it("Recompile user function");

  it("Compile function");

  it("Compile resource");

  it("Compile source with errors");
  // , async () => {
  //   const compilePO: CompilePageObject = new CompilePageObject();

  //   await applyPatchPO.setUploadFile([PATCHS_FILES.single]);
  //   await applyPatchPO.fireSubmitCloseID();

  //   expect(await workbenchPO.applyPatchInProgress()).to.be.true;

  //   await workbenchPO.waitApplyPatch();

  //   const notification: Notification = await workbenchPO.getNotification(
  //     /Patch applied/
  //   );

  //   expect(notification).not.is.undefined;
  //   await notification?.dismiss();
  // });
});
