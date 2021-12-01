import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openAdvplProject } from "../helper";
import { ReplayPageObject } from "../page-objects/replay-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { REPLAY_FILES } from "../scenario";
import path = require("path");
import { DebugToolbar, DebugView } from "vscode-extension-tester";

const BIG_IMPORT_TIMEOUT = 2 * 60 * 1000; // 2min

(REPLAY_FILES ? describe : describe.skip)("Replay Operations", () => {
  let workbenchPO: WorkbenchPageObject;
  let debugView: DebugView;
  let debugBar: DebugToolbar;

  before(async () => {
    await openAdvplProject();
    await delay(5000); //necessário para inicializar LS se necessário

    workbenchPO = new WorkbenchPageObject();
    workbenchPO.openTotvsView();

    debugView = await workbenchPO.openDebugView();

    await delay();
  });

  afterEach(async () => {
    workbenchPO.closeAllEditors();
  });

  //[...REPLAY_FILES["small"]].forEach(async (file: string) => {
  [...REPLAY_FILES["big"], ...REPLAY_FILES["small"]].forEach(
    async (file: string) => {
      describe(`Create launcher and import file: ${path.basename(
        file
      )}`, async () => {
        it(`Create Launcher ${path.basename(file)}`, async () => {
          const replayPO = new ReplayPageObject(workbenchPO);

          await replayPO.addReplayLauncher({
            launcherName: path.basename(`test_replay_${path.basename(file)}`),
            TDSReplayFile: file,
          });

          expect(await workbenchPO.isLauncherSaved()).to.be.true;

          await delay();
        });

        it("Start debugger", async () => {
          await debugView.selectLaunchConfiguration(
            `test_replay_${path.basename(file)}`
          );

          await debugView.start();
          debugBar = await DebugToolbar.create();
          await delay(2000);

          expect(await workbenchPO.isDAInitialing()).to.be.true;
          expect(await workbenchPO.isDAReady()).to.be.true;
        });

        it("Import file", async () => {
          if (path.dirname(file).endsWith("big")) {
            await workbenchPO.waitImportReplay(BIG_IMPORT_TIMEOUT);
          }

          expect(await workbenchPO.isDAReadingAllTimelines()).to.be.true;
          expect(await workbenchPO.isDACheckingSources()).to.be.true;
          expect(await workbenchPO.isDASourceListRecording()).to.be.true;
          expect(await workbenchPO.isDAReadingAllTimelinesDone()).to.be.true;
          expect(await workbenchPO.isDAStoppingFistLine()).to.be.true;
          expect(await workbenchPO.isDAStoppingFistLineDone()).to.be.true;

          await delay();
        });

        it("Stop debugger", async () => {
          debugBar.stop();

          expect(await workbenchPO.isDAFinished()).to.be.true;
        });
      });
    }
  );
});
