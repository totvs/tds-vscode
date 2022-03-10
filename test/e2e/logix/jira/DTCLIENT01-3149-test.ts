import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  DebugConsoleView,
  DebugToolbar,
  TreeItem,
} from "vscode-extension-tester";
import { delay, openProject } from "../../helper";
import { BuildPageObject } from "../../page-objects/build-po";
import { DebugPageObject } from "../../page-objects/debug-view-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { TextEditorPageObject } from "../../page-objects/text-editor-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

const COMPILE_FILE = ["jira", "DTCLIENT01-3149", "arraydin2.4gl"];
const LAUNCHER_NAME: string = "Smart Client Debug";

// [VSCode] array 4GL dinamico mostra SIZE incorreto no DEBUG via VSCODE
describe("DTCLIENT01-3149: [VSCode] dynamic 4GL array shows incorrect SIZE in DEBUG via VSCODE", async () => {
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
    const resourceItem: TreeItem = await explorerPO.getResource(COMPILE_FILE);

    await resourceItem.click();
    await compilePO.fireBuildFile(resourceItem);
    await workbenchPO.waitBuilding();
  });

  it("Set breakpoint", async () => {
    editor = await debugPO.getEditorSource(
      COMPILE_FILE[COMPILE_FILE.length - 1]
    );

    await debugPO.openView();
    await debugPO.clearAllBreakpoints();

    const result = await editor.setBreakpoint(5);
    expect(result, "Breakpoint not set (line 5)").is.true;
  });

  it("Start Debugger", async () => {
    await debugPO.openView();
    await debugPO.selectLaunchConfiguration(LAUNCHER_NAME);
    await debugPO.start();

    await debugPO.fillProgramName("arraydin2.4gl");

    expect(await workbenchPO.isDAInitialing(), "DA not initialing").is.true;
    expect(await workbenchPO.isDAReady(), "DA not ready").is.true;

    debugBar = await DebugToolbar.create();
    await debugBar.waitForBreakPoint();
  });

  it("Evaluate parameters", async () => {
    const debugConsole = new DebugConsoleView();

    await debugConsole.evaluateExpression("ma_dados");

    let text: string = await debugConsole.getText();

    expect(text, "P1 expected value").to.have.string("value1-P1");
  });

  it("Stop debugger", async () => {
    await debugBar.continue();
    await workbenchPO.waitStopDebugger();

    expect(await workbenchPO.isDAEndProcess(), "Debugger not stopped correctly")
      .is.true;
  });
});
