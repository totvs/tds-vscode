import { expect } from "chai";
import { describe, before, it } from "mocha";
import { Marker, TreeItem } from "vscode-extension-tester";
import { openProject } from "../../helper";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";
import { ProblemsPageObject } from "./../../page-objects/problem-view-po";
import { BuildPageObject } from "./../../page-objects/build-po";

const COMPILE_FOLDER: string[] = ["files", "withError"];

describe("Compile Source With Error and/or Warnings", async () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;
  let compilePO: BuildPageObject;
  let resourceItem: TreeItem;
  let problemPO: ProblemsPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);

    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    problemPO = await workbenchPO.openProblemsView();
    compilePO = new BuildPageObject(workbenchPO);
  });

  it("Compile", async () => {
    const explorerPO: ExplorerPageObject = await workbenchPO.openExplorerView();

    resourceItem = await explorerPO.getFolder(COMPILE_FOLDER);
    expect(resourceItem).not.undefined;

    await compilePO.fireBuildFile(resourceItem);
    await workbenchPO.waitBuilding();

    await compilePO.askShowCompileResult(false);
  });

  it("Detect warning and errors", async () => {
    let marks: Marker[] = [];

    marks = await problemPO.getAllMarkers();
    expect(marks.length, `Expected all marks`).is.equal(7);

    marks = await problemPO.getAllFile();
    expect(marks.length, `Expected file marks`).is.equal(2);

    marks = await problemPO.getAllErrors();
    expect(marks.length, `Expected marks errors`).is.equal(1);

    marks = await problemPO.getAllWarnings();
    expect(marks.length, `Expected marks warnings`).is.equal(4);
  });
});
