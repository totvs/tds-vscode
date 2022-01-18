import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, fillProgramName, openProject } from "../../helper";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, COMPILE_FILES } from "../../scenario";
import {
  DebugConsoleView,
  DebugToolbar,
  TreeItem,
} from "vscode-extension-tester";
import { DebugPageObject } from "../../page-objects/debug-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { TextEditorPageObject } from "../../page-objects/text-editor-po";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "./../../page-objects/explorer-view-po";

const launcherName: string = "Smart Client Debug";

describe("Debug with arguments", () => {
  let workbenchPO: WorkbenchPageObject;
  let debugPO: DebugPageObject;
  let debugBar: DebugToolbar;
  let serverTreePO: ServerViewPageObject;
  let editor: TextEditorPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();

    debugPO = await workbenchPO.openDebugView();
    await debugPO.registerLauncher(
      "totvs_language_debug",
      launcherName,
      APPSERVER_DATA.smartClientBin
    );

    serverTreePO = await workbenchPO.openTotvsView();
    await serverTreePO.getServer(APPSERVER_DATA);
    await delay();

    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
  });

  after(async () => {
    workbenchPO.closeAllEditors();
  });

  it(`Prepare source to debug`, async () => {
    const explorerPO: ExplorerPageObject = await workbenchPO.openExplorerView();
    const compilePO: BuildPageObject = new BuildPageObject(workbenchPO);
    const resourceItem: TreeItem = await explorerPO.getResource(
      COMPILE_FILES.singleFile
    );
    await compilePO.fireRebuildFile(resourceItem);
    await compilePO.waitBuildingResource();
  });

  it("Set breakpoint", async () => {
    editor = await debugPO.getEditorSource(
      COMPILE_FILES.singleFile[COMPILE_FILES.singleFile.lenght - 1]
    );
    const result = await editor.toggleBreakpoint(4);
    expect(result, "Breakpoint not set (line 4)").to.be.true;
  });

  describe("One argument", () => {
    it("Start Debugger", async () => {
      await debugPO.openView();
      await debugPO.selectLaunchConfiguration(launcherName);
      await debugPO.start();
      await fillProgramName("u_escolhenum", "value1-P1");

      expect(await workbenchPO.isDAInitialing(), "DA not initialing").is.true;
      expect(await workbenchPO.isDAReady(), "DA not ready").is.true;

      debugBar = await DebugToolbar.create();
      await debugBar.waitForBreakPoint();
    });

    it("Evaluate parameters", async () => {
      const debugConsole = new DebugConsoleView();

      await debugConsole.evaluateExpression("p1");
      await debugConsole.evaluateExpression("p2");

      let text: string = await debugConsole.getText();
      console.error(text);
      expect(text, "P1 expected value").to.have.string("value1-P1");
      expect(text, "P2 not expected value").to.have.string("NIL");
    });

    it("Stop debugger", async () => {
      await debugBar.stop();
      await editor.waitStopDebugger(debugBar);

      expect(
        await workbenchPO.isDABeingFinalized(),
        "Debugger not being finalized"
      ).is.true;
      expect(await workbenchPO.isDAFinished(), "Debugger not finishied").is
        .true;
    });
  });

  describe("Two argument", () => {
    it("Start Debugger", async () => {
      await debugPO.openView();
      await debugPO.selectLaunchConfiguration(launcherName);
      await debugPO.start();
      await fillProgramName("u_escolhenum", "value1-P1", "value1-P2");

      expect(await workbenchPO.isDAInitialing(), "DA not initialing").is.true;
      expect(await workbenchPO.isDAReady(), "DA not ready").is.true;

      debugBar = await DebugToolbar.create();
      await debugBar.waitForBreakPoint();
    });

    it("Evaluate parameters", async () => {
      const debugConsole = new DebugConsoleView();

      await debugConsole.evaluateExpression("p1");
      await debugConsole.evaluateExpression("p2");

      let text: string = await debugConsole.getText();
      console.error(text);
      expect(text, "P1 expected value").to.have.string("value1-P1");
      expect(text, "P2 not expected value").to.have.string("value1-P2");
    });

    it("Stop debugger", async () => {
      await debugBar.stop();
      await editor.waitStopDebugger(debugBar);

      expect(
        await workbenchPO.isDABeingFinalized(),
        "Debugger not being finalized"
      ).is.true;
      expect(await workbenchPO.isDAFinished(), "Debugger not finishied").is
        .true;
    });
  });
});
