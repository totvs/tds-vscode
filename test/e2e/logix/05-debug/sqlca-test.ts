import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";
import { DebugPageObject, VariablePO } from "../../page-objects/debug-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { TextEditorPageObject } from "../../page-objects/text-editor-po";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { DebugToolbar, TreeItem } from "vscode-extension-tester";

const LAUNCHER_NAME: string = "Smart Client Debug";
const COMPILE_FILE = ["files", "debug", "sqlca.4gl"];

const BP_FIRST_LINE = 5;

const GLOBAL_VAR_INIT_VALUES: any[] = [
  { name: "STATUS", value: "0", type: "N" },
  { name: "SQLCA", value: "Object", type: "OBJECT" },
  { name: "INT_FLAG", value: "0", type: "INTEGER" },
  { name: "QUIT_FLAG", value: "0", type: "INTEGER" },
];

const SQLCA_VARS: any[] = [
  { name: "SQLAWARN", value: "\"\"", type: "C" },
  { name: "SQLCODE", value: "0", type: "INTEGER" },
  { name: "SQLERRD", value: "Array {size=6}", type: "ARRAY" },
  { name: "SQLERRM", value: "\"\"", type: "C" },
  { name: "SQLERRP", value: "\"\"", type: "C" },
];

const SQLERRD_VARS: any[] = [
  { name: "SQLAWARN", value: "\"\"", type: "C" },
  { name: "SQLCODE", value: "0", type: "INTEGER" },
  { name: "SQLERRD", value: "Array {size=6}", type: "ARRAY" },
  { name: "SQLERRM", value: "\"\"", type: "C" },
  { name: "SQLERRP", value: "\"\"", type: "C" },
];

describe.only("LOGIX: Debug SQLCA variable", async () => {
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
    const explorerPO: ExplorerPageObject =
      await workbenchPO.openExplorerView();
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

    expect(await editor.setBreakpoint(BP_FIRST_LINE)).is.true;

    await debugPO.openView();
  });

  it("Start Debugger", async () => {
    await debugPO.selectLaunchConfiguration(LAUNCHER_NAME);
    await debugPO.start();

    await debugPO.fillProgramName("sqlca.4gl");

    expect(await workbenchPO.isDABeginProcess(), "DA not running").is.true;

    debugBar = await DebugToolbar.create();
    await debugBar.wait(10000);
    await debugBar.waitForBreakPoint();
    await delay();
  });

  it("Evaluate inicial values", async () => {
    await delay();

    const variables: VariablePO[] = await debugPO.getGlobalVariables(
      getVarsName(GLOBAL_VAR_INIT_VALUES)
    );

    expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
      getVarsName(GLOBAL_VAR_INIT_VALUES)
    );
    // expect(variables.map((variable: VariablePO) => variable.type)).to.eqls(
    //   getVarsType(GLOBAL_VAR_INIT_VALUES)
    // );
    expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
      GLOBAL_VAR_INIT_VALUES.map((value: any) => value.value)
    );
  });

  it("Evaluate SQLCA", async () => {
    await delay();

    const variables: VariablePO[] = await debugPO.getGlobalVariableValue("SQLCA");

    expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
      getVarsName(SQLCA_VARS)
    );
    // getTooltip retorna valor inesperado para sub-nós.
    //expect(variables.map((variable: VariablePO) => variable.type)).to.eqls(
    //  getVarsType(SQLCA_VARS)
    //);
    expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
      SQLCA_VARS.map((value: any) => value.value)
    );
  });

  it("Evaluate SQLCA.SQLERRD", async () => {
    await delay();

    const variables: VariablePO[] = await debugPO.getGlobalVariableValue("SQLCA.SQLERRD");

    expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
      getVarsName(SQLERRD_VARS)
    );
    // getTooltip retorna valor inesperado para sub-nós.
    //expect(variables.map((variable: VariablePO) => variable.type)).to.eqls(
    //  getVarsType(SQLCA_VARS)
    //);
    expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
      SQLERRD_VARS.map((value: any) => value.value)
    );
  });

  it("Watch");

  it("Hover");

  it("Evaluate");

  it("LOGIX: Stop", async () => {
    await debugBar.continue();
    await workbenchPO.waitStopDebugger();

    expect(
      await workbenchPO.isDAEndProcess(),
      "Debugger not stopped correctly"
    ).is.true;
  });

});

function getVarsName(list: any[]): string[] {
  return list.map((value: any) => value.name);
}

function getVarsType(list: any[]): string[] {
  return list.map(
    (value: any) =>
      `${value.type.at(0)}${value.type.substring(1).toLowerCase()}`
  );
}
