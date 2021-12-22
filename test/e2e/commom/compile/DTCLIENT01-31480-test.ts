import { expect } from "chai";
import { describe, before, it } from "mocha";
import { TreeItem } from "vscode-extension-tester";
import { openProject } from "../../helper";
import { BottomBarPageObject } from "../../page-objects/bottom-bar-po";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { OutputLsPageObject } from "../../page-objects/output-ls-po";
import { ProblemPageObject } from "../../page-objects/problem-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

const WANR_SOURCE = ["DTCLIENT01-3148", "warning.prw"];
const ERROR_SOURCE = ["DTCLIENT01-3148", "error.prw"];

describe.only("Compilation messages are no longer shown in 'Problems' view", () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let explorerPO: ExplorerPageObject;
  let compilePO: BuildPageObject;
  let resourceItem: TreeItem;
  let problemPO: ProblemPageObject;

  before(async () => {
    await openProject();

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

  beforeEach(async () => {
    explorerPO = await workbenchPO.openExplorerView();
  });

  it.only("Source with warning", async () => {
    resourceItem = await explorerPO.getResource(WANR_SOURCE);
    expect(resourceItem).not.undefined;

    await compilePO.fireRebuildFile(resourceItem);

    await compilePO.waitBuildingResource();
  });

  it("Source with error", async () => {
    resourceItem = await explorerPO.getResource(ERROR_SOURCE);
    expect(resourceItem).is.not.undefined;

    await compilePO.fireRebuildFile(resourceItem);

    await compilePO.waitBuildingResource();
  });
});
