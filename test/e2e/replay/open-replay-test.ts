import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openAdvplProject } from "../helper";
import { ApplyPatchPageObject } from "../page-objects/apply-patch-po";
import { ReplayPageObject } from "../page-objects/replay-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { PATCHS_FILES, REPLAY_FILES } from "../scenario";
import path = require("path");
import { ActivityBar, DebugToolbar, DebugView } from "vscode-extension-tester";

(REPLAY_FILES ? describe.only : describe.skip)("Replay Operations", () => {
  let workbenchPO: WorkbenchPageObject;
  let debugView: DebugView;
  let debugBar: DebugToolbar;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    workbenchPO.openTotvsView();

    debugView = await workbenchPO.openDebugView();

    await delay();
  });

  REPLAY_FILES.forEach(async (file: string) => {
    it(`Create Launcher ${path.basename(file)}`, async () => {
      const replayPO = new ReplayPageObject(workbenchPO);

      await replayPO.openLauncher();

      await replayPO.setDataPage({
        launcherName: path.basename(`test_replay_${path.basename(file)}`),
        TDSReplayFile: file,
        passwordID: "",
        includeSrcID: "*",
        excludeSrcID: "",
        ignoreSourcesNotFoundID: true,
      });

      await replayPO.fireSaveClose();

      expect(await workbenchPO.isSaveReplayLauncher()).to.be.true;

      await delay();
    });
  });

  REPLAY_FILES.forEach(async (file: string) => {
    it(`Open/import file ${path.basename(file)}`, async () => {
      await debugView.selectLaunchConfiguration(
        `test_replay_${path.basename(file)}`
      );

      await debugView.start();
      debugBar = await DebugToolbar.create();

      await workbenchPO.waitImportReplay();

      expect(await workbenchPO.isImportReplayFinish()).to.be.true;

      debugBar.stop();

      await delay(2000);
    });
  });
});
