import { expect } from "chai";
import { describe, before, it } from "mocha";
import { Marker, TreeItem } from "vscode-extension-tester";
import { delay, openProject, openProjectWithReset } from "../../helper";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";
import { BuildPageObject } from "./../../page-objects/build-po";
import { ProblemsPageObject } from "./../../page-objects/problem-view-po";

const FOLDER_TO_COMPILE: string[] = ["files", "withError"];

describe("Compile Source With Error and/or Warnings", async () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let compilePO: BuildPageObject;
  let explorerPO: ExplorerPageObject;
  let folderItem: TreeItem;
  let serverPO: ServerTreeItemPageObject;

  before(async () => {
    await openProjectWithReset();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);
    await delay();

    serverPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    compilePO = new BuildPageObject(workbenchPO);
  });

  after(async () => {
    await serverTreePO.openView();
    await serverPO.fireDisconnectAction();
  });

  beforeEach(async () => {
    explorerPO = await workbenchPO.openExplorerView();
  });

  it("Find folder", async () => {
    folderItem = await explorerPO.getFolder(FOLDER_TO_COMPILE);

    expect(folderItem).is.not.undefined;
    expect(FOLDER_TO_COMPILE[FOLDER_TO_COMPILE.length - 1]).is.equals(
      await folderItem.getLabel()
    );
  });

  it("Compile folder", async () => {
    await compilePO.fireBuildFile(folderItem);

    await workbenchPO.waitBuilding();

    await compilePO.askShowCompileResult(false);
  });

  it("Detect warning and errors", async () => {
    const problemPO: ProblemsPageObject = await workbenchPO.openProblemsView();
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
