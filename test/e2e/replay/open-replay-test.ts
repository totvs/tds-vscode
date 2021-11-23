import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openAdvplProject } from "../helper";
import { ApplyPatchPageObject } from "../page-objects/apply-patch-po";
import { ReplayPageObject } from "../page-objects/replay-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import {
  PATCHS_FILES,
  REPLAY_FILES,
} from "../scenario";
import path = require("path");

describe.skip("Replay Operations", () => {
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();

    await delay();
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  (REPLAY_FILES ? it : it.skip)("Create Launcher", async () => {
    const replayPO = new ReplayPageObject(workbenchPO);

    await replayPO.openLauncher();

    await replayPO.setDataPage( {
      launcherName: path.basename("test_replay"),
      TDSReplayFile: REPLAY_FILES[0],
      passwordID: "passwordID",
      includeSrcID: "includeSrcID",
      excluseSrcID: "excluseSrcID",
      ignoraSourceNotFoundID: false
    })

    await replayPO.fireSaveClose();

    await delay(10000);
  });

  (REPLAY_FILES ? it.skip : it.skip)("Open file", async () => {
    REPLAY_FILES.forEach((file: string) => {});

    const applyPatchPO: ApplyPatchPageObject = new ApplyPatchPageObject();
    await applyPatchPO.setUploadFile([PATCHS_FILES.single]);
    await applyPatchPO.fireSubmitClose();

    expect(await workbenchPO.applyPatchInProgress()).is.true;

    await workbenchPO.waitApplyPatch();

    expect(await workbenchPO.isApplyPatch()).is.true;
  });
});
