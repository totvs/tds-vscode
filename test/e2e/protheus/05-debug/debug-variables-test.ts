import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";
import { DebugToolbar, TreeItem } from "vscode-extension-tester";
import { DebugPageObject, VariablePO } from "../../page-objects/debug-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { TextEditorPageObject } from "../../page-objects/text-editor-po";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";

const LAUNCHER_NAME: string = "Smart Client Debug";
const COMPILE_FILE = ["files", "debug", "primitive.prw"];
const LOCAL_FUNCTION_LINE = 20;

const LOCAL_VAR_INIT_VALUES: any[] = [
  { name: "INDEX", value: "NIL" },
  { name: "NUMBER", value: "0" },
  { name: "DATE", value: "01/01/22" },
  { name: "STRING", value: "This is string" },
  { name: "BOOLEAN", value: ".f." },
];

describe.only("Debug primitive variables", async () => {
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

  it("Set initial breakpoint", async () => {
    editor = await debugPO.getEditorSource(
      COMPILE_FILE[COMPILE_FILE.length - 1]
    );

    await debugPO.openView();
    await debugPO.clearAllBreakpoints();

    expect(await editor.toggleBreakpoint(LOCAL_FUNCTION_LINE)).is.true;
  });

  describe("Local variables", async () => {
    it("Start Debugger", async () => {
      await debugPO.openView();
      await debugPO.selectLaunchConfiguration(LAUNCHER_NAME);
      await debugPO.start();

      await debugPO.fillProgramName("u_primitive");

      expect(await workbenchPO.isDABeginProcess(), "DA not running").is.true;

      debugBar = await DebugToolbar.create();
    });

    it("Go Local Function BP", async () => {
      await debugBar.waitForBreakPoint();
      await delay();
    });

    it("Evaluate inicial values", async () => {
      const variables: VariablePO[] = await debugPO.getLocalVariables();

      expect(variables.length).equals(LOCAL_VAR_INIT_VALUES.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eql(
        LOCAL_VAR_INIT_VALUES.map((value: any) => value.name)
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eql(
        LOCAL_VAR_INIT_VALUES.map((value: any) => value.value)
      );
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
});
