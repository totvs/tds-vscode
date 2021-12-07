import { expect } from "chai";
import * as fs from "fs-extra";
import { describe, before, it } from "mocha";
import { SideBarView, TreeItem } from "vscode-extension-tester";
import { delay, openAdvplProject } from "../helper";
import { BuildPageObject } from "../page-objects/build-po";
import { ExplorerPageObject } from "../page-objects/explorer-view-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../page-objects/server-view-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, COMPILE_FILES } from "../scenario";

describe.skip("Compile files", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;
  let explorerPO: ExplorerPageObject;
  let compilePO: BuildPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.addNewServer(APPSERVER_DATA);
    await delay();

    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    compilePO = new BuildPageObject();
    explorerPO = await workbenchPO.openExplorerView();
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  (COMPILE_FILES.singleFile ? it : it.skip)("Compile Single File", async () => {
    await explorerPO.openView();

    const treeItem: TreeItem = await explorerPO.getTreeItem(
      COMPILE_FILES.singleFile
    );

    expect(treeItem).is.not.undefined;

    await compilePO.fireBuildFile(treeItem);

    await delay(5000);
  });

  (COMPILE_FILES.singleFile ? it : it.skip)(
    "Recompile Single File",
    async () => {
      const treeItem: TreeItem = await explorerPO.getTreeItem(
        COMPILE_FILES.singleFile
      );

      expect(treeItem).is.not.null;

      await compilePO.fireRebuildFile(treeItem);

      await delay(5000);
    }
  );

  it("Compile Users Function");

  it("Compile Resource");

  it("Compile Source With Errors");
});
