import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";
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

const LAUNCHER_NAME: string = "Smart Client Debug";
const COMPILE_FILE_ARG_TEST = ["files", "userFunction", "arg-test.prw"];

describe("Debug with arguments", async () => {
  let workbenchPO: WorkbenchPageObject;
  let debugPO: DebugPageObject;
  let serverTreePO: ServerViewPageObject;
  let editor: TextEditorPageObject;
  let debugBar: DebugToolbar;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();

    debugPO = await workbenchPO.openDebugView();
    await debugPO.registerLauncher(
      "totvs_language_debug",
      LAUNCHER_NAME,
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
    await workbenchPO.closeAllEditors();
  });

  it("Prepare source to debug", async () => {
    const explorerPO: ExplorerPageObject = await workbenchPO.openExplorerView();
    const compilePO: BuildPageObject = new BuildPageObject(workbenchPO);
    const resourceItem: TreeItem = await explorerPO.getResource(
      COMPILE_FILE_ARG_TEST
    );

    await resourceItem.click();
    await compilePO.fireBuildFile(resourceItem);
    await workbenchPO.waitBuilding();
  });

  it("Set breakpoint", async () => {
    editor = await debugPO.getEditorSource(
      COMPILE_FILE_ARG_TEST[COMPILE_FILE_ARG_TEST.length - 1]
    );

    await debugPO.openView();
    await debugPO.clearAllBreakpoints();

    expect(await editor.setBreakpoint(5), "Breakpoint not set (line 5)").is
      .true;
  });

  describe("One argument", async () => {
    it("Start Debugger", async () => {
      await debugPO.selectLaunchConfiguration(LAUNCHER_NAME);
      await debugPO.start();

      await debugPO.fillProgramName("u_argTest", "value1-P1");

      expect(await workbenchPO.isDABeginProcess(), "DA not running").is.true;

      debugBar = await DebugToolbar.create();
      await debugBar.waitForBreakPoint();
    });

    it("Evaluate parameters", async () => {
      const debugConsole = new DebugConsoleView();

      await debugConsole.evaluateExpression("p1");
      await debugConsole.evaluateExpression("p2");

      const text: string = await debugConsole.getText();
      expect(text, "P1 expected value").to.have.string("value1-P1");
      expect(text, "P2 not expected value").to.have.string("NIL");
    });

    it("Stop debugger", async () => {
      await debugBar.continue();
      await workbenchPO.waitStopDebugger();

      expect(
        await workbenchPO.isDAEndProcess(),
        "Debugger not stopped correctly"
      ).is.true;
    });
  });

  describe("Two argument", async () => {
    it("Start Debugger", async () => {
      await debugPO.openView();
      await debugPO.selectLaunchConfiguration(LAUNCHER_NAME);
      await debugPO.start();

      await debugPO.fillProgramName("u_argTest", "value1-P1", "value1-P2");

      expect(await workbenchPO.isDABeginProcess(), "DA not running").is.true;

      debugBar = await DebugToolbar.create();
      await debugBar.waitForBreakPoint();
    });

    it("Evaluate parameters", async () => {
      const debugConsole = new DebugConsoleView();

      await debugConsole.evaluateExpression("p1");
      await debugConsole.evaluateExpression("p2");

      const text: string = await debugConsole.getText();
      expect(text, "P1 expected value").to.have.string("value1-P1");
      expect(text, "P2 not expected value").to.have.string("value1-P2");
    });

    it("Continue debugger", async () => {
      await debugBar.continue();
      await workbenchPO.waitStopDebugger();

      expect(
        await workbenchPO.isDAEndProcess(),
        "Debugger not stopped correctly"
      ).is.true;
    });
  });
});
