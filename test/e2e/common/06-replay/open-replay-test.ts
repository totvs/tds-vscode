import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, DEFAULT_DELAY, openProject } from "../../helper";
import { ReplayPageObject } from "../../page-objects/replay-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { REPLAY_FILES } from "../../scenario";
import path = require("path");
import { DebugToolbar } from "vscode-extension-tester";
import { DebugPageObject } from "../../page-objects/debug-view-po";

const LONG_IMPORT_TIMEOUT = 3 * 60 * 1000; // 3min

(REPLAY_FILES ? describe : describe)("Replay Operations", async () => {
  let workbenchPO: WorkbenchPageObject;
  let debugView: DebugPageObject;
  let debugBar: DebugToolbar;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    workbenchPO.openTotvsView();

    debugView = await workbenchPO.openDebugView();

    await delay();
  });

  afterEach(async () => {
    await workbenchPO.closeAllEditors();
  });

  Object.keys(REPLAY_FILES).forEach((key: string) => {
    REPLAY_FILES[key].forEach(async (file: string) => {
      describe(`Create launcher and import file: ${path.basename(
        file
      )}`, async () => {
        it(`Create Launcher ${path.basename(file)}`, async () => {
          const replayPO = new ReplayPageObject(workbenchPO);

          await replayPO.addReplayLauncher({
            launcherName: path.basename(`test_replay_${path.basename(file)}`),
            TDSReplayFile: file,
          });

          expect(await workbenchPO.isLauncherSaved()).is.true;

          await delay();
        });

        it("Start debugger", async () => {
          await debugView.selectLaunchConfiguration(
            `test_replay_${path.basename(file)}`
          );

          await debugView.start();
          debugBar = await DebugToolbar.create();
          await delay(DEFAULT_DELAY);

          expect(await workbenchPO.isDAInitialing()).is.true;
          expect(await workbenchPO.isDAReady()).is.true;
        });

        it("Import file", async () => {
          await workbenchPO.waitImportReplay(LONG_IMPORT_TIMEOUT);

          expect(await workbenchPO.isDAReadingAllTimelines()).is.true;
          expect(await workbenchPO.isDACheckingSources()).is.true;
          expect(await workbenchPO.isDASourceListRecording()).is.true;
          expect(await workbenchPO.isDAReadingAllTimelinesDone()).is.true;

          //expect(await workbenchPO.isDAStoppingFistLine()).is.true;
          expect(await workbenchPO.isDAStoppingFistLineDone()).is.true;

          await delay();
        });

        it("Stop debugger", async () => {
          debugBar.stop();

          expect(await workbenchPO.isDABeingFinalized()).is.true;
          expect(await workbenchPO.isDAFinished()).is.true;
        });
      });
    });
  });
});
