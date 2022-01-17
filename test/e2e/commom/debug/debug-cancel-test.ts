import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, fillProgramName, openProject } from "../../helper";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";
import { DebugToolbar } from "vscode-extension-tester";
import { DebugPageObject } from "../../page-objects/debug-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";

describe("Debug cancel", () => {
  let workbenchPO: WorkbenchPageObject;
  let debugPO: DebugPageObject;
  let debugBar: DebugToolbar;
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;

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

    debugPO = await workbenchPO.openDebugView();
  });

  afterEach(async () => {
    workbenchPO.closeAllEditors();
  });

  describe("Smart Client Debug", async () => {
    const launcherName: string = "Smart Client Debug";

    it(`Create Launcher`, async () => {
      await debugPO.addLauncher(
        "totvs_language_debug",
        launcherName,
        APPSERVER_DATA.smartClientBin
      );

      expect(
        await debugPO.isLauncherSaved(launcherName),
        `Launcher [${launcherName}] not saved`
      ).is.true;

      await delay();
    });

    it("Start debugger", async () => {
      await debugPO.selectLaunchConfiguration(launcherName);

      await debugPO.start();
      debugBar = await DebugToolbar.create();
      await delay(2000);

      await fillProgramName("u_escolhenum");

      expect(await workbenchPO.isDAInitialing()).is.true;
      expect(await workbenchPO.isDAReady()).is.true;
    });

    it("Stop debugger", async () => {
      debugBar.stop();

      expect(await workbenchPO.isDABeingFinalized()).is.true;
      expect(await workbenchPO.isDAFinished()).is.true;
    });
  });
});
