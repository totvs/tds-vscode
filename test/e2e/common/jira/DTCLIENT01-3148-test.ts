import { expect } from "chai";
import { describe, before, it } from "mocha";
import { Marker, TreeItem } from "vscode-extension-tester";
import { prepareProject } from "../../helper";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { ProblemsPageObject } from "../../page-objects/problem-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

const COMPILE_FOLDER = ["jira", "DTCLIENT01-3148"];

// Mensagens de compilação não são mais mostradas
describe("DTCLIENT01-3148: Build messages are no longer shown", async () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let compilePO: BuildPageObject;
  let resourceItem: TreeItem;
  let problemPO: ProblemsPageObject;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);

    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    problemPO = await workbenchPO.openProblemsView();
    compilePO = new BuildPageObject(workbenchPO);
  });

  it("Compile Source", async () => {
    const explorerPO: ExplorerPageObject = await workbenchPO.openExplorerView();

    resourceItem = await explorerPO.getFolder(COMPILE_FOLDER);
    expect(resourceItem).not.undefined;

    await compilePO.fireBuildFile(resourceItem);
    await workbenchPO.waitBuilding();

    await compilePO.showCompileResult(false);
  });

  it("Source with warning", async () => {
    const marks: Marker[] = await problemPO.getAllWarnings();
    expect(marks.length).is.equal(2);
  });

  it("Source with error", async () => {
    const marks: Marker[] = await problemPO.getAllErrors();
    expect(marks.length).is.equal(1);
  });
});
