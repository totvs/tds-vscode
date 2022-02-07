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
const COMPILE_FILE = ["files", "debug", "primitive.prw"];

const BP_FIRST_LINE = 8;
const BP_LOCAL_FUNCTION_LINE = 27;
const BP_LOCAL_AFTER_LOOP = 39;
const BP_RETURN_LIST_PRIVATE = 105;
const BP_RETURN_ALL_SCOPE = 97;

const LOCAL_VAR_INIT_VALUES: any[] = [
  { name: "L_INDEX", value: null, type: "N" },
  { name: "L_NUMBER", value: 0, type: "N" },
  { name: "L_DATE", value: new Date(2022, 0, 1), type: "D" },
  { name: "L_STRING", value: "This is string", type: "C" },
  { name: "L_BOOLEAN", value: false, type: "L" },
  { name: "L_CODEBLOCK", value: "{ |X| CONOUT(X) }", type: "B" },
];

const PRIVATE_VAR_L1_VALUES: any[] = [
  { name: "P_NUMBER", value: 1, type: "N" },
  { name: "P_DATE", value: new Date(2022, 0, 1), type: "D" },
  { name: "P_STRING", value: "This is private-1", type: "C" },
  { name: "P_BOOLEAN", value: false, type: "L" },
  { name: "P_CODEBLOCK", value: '{ |X| CONOUT("L1" + X) }', type: "B" },
];

const PRIVATE_VAR_L2_VALUES: any[] = [
  { name: "P_NUMBER", value: 11, type: "N" },
  { name: "P_DATE", value: new Date(2022, 0, 2), type: "D" },
  { name: "P_STRING", value: "This is private-2", type: "C" },
  { name: "P_BOOLEAN", value: true, type: "L" },
  { name: "P_CODEBLOCK", value: '{ |X| CONOUT("L2" + X) }', type: "B" },
];

const PRIVATE_VAR_L3_VALUES: any[] = [
  { name: "P_NUMBER", value: 3, type: "N" },
  { name: "P_DATE", value: new Date(2022, 0, 3), type: "D" },
  { name: "P_STRING", value: "This is private-3", type: "C" },
  { name: "P_BOOLEAN", value: null, type: "L" },
  { name: "P_CODEBLOCK", value: '{ |X| CONOUT("L3" + X) }', type: "B" },
];

const PUBLIC_VAR_VALUES: any[] = [
  { name: "CPAISBRAS", value: "", type: "C" },
  { name: "X_TODAY", value: new Date(), type: "D" },
];

describe.only("Debug primitive variables", async () => {
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

  describe("Start", () => {
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

      await debugPO.fillProgramName("u_primitive");

      expect(await workbenchPO.isDABeginProcess(), "DA not running").is.true;

      debugBar = await DebugToolbar.create();
      await debugBar.wait(10000);
      await debugBar.waitForBreakPoint();
      await delay();
    });
  });

  describe("Scope: LOCAL", async () => {
    it("Evaluate inicial values", async () => {
      expect(await editor.setBreakpoint(BP_LOCAL_FUNCTION_LINE)).is.true;
      await debugBar.continue();
      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getLocalVariables(
        getLocalVarsName()
      );

      expect(variables.length).to.equals(LOCAL_VAR_INIT_VALUES.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        getLocalVarsName()
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        LOCAL_VAR_INIT_VALUES.map((value: any) => toAdvplType(value))
      );
    });

    it("Loop", async () => {
      let targetValues = [...LOCAL_VAR_INIT_VALUES];
      expect(await editor.setBreakpoint(BP_LOCAL_AFTER_LOOP)).is.true;
      await debugBar.continue();

      targetValues = incValues(targetValues, 5);
      targetValues[0].value = 6;
      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getLocalVariables(
        getLocalVarsName()
      );
      expect(variables.length).equals(targetValues.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        targetValues.map((value: any) => value.name)
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        targetValues.map((value: any) => toAdvplType(value))
      );
    });
  });

  describe("Scope: PRIVATE", async () => {
    it("Set breakpoint", async () => {
      expect(await editor.setBreakpoint(BP_RETURN_LIST_PRIVATE)).is.true;
    });

    it("Private (level 1)", async () => {
      await debugBar.continue();
      let targetValues = [...PRIVATE_VAR_L1_VALUES];

      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getPrivateVariables(
        getPrivateVarsName()
      );
      expect(variables.length).equals(targetValues.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        targetValues.map((value: any) => value.name)
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        targetValues.map((value: any) => toAdvplType(value))
      );
    });

    it("Private (level 2)", async () => {
      await debugBar.continue();
      let targetValues = [...PRIVATE_VAR_L2_VALUES];

      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getPrivateVariables(
        getPrivateVarsName()
      );
      expect(variables.length).equals(targetValues.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        targetValues.map((value: any) => value.name)
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        targetValues.map((value: any) => toAdvplType(value))
      );
    });

    it("Private (level 3)", async () => {
      await debugBar.continue();
      let targetValues = [...PRIVATE_VAR_L3_VALUES];

      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getPrivateVariables(
        getPrivateVarsName()
      );
      expect(variables.length).equals(targetValues.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        targetValues.map((value: any) => value.name)
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        targetValues.map((value: any) => toAdvplType(value))
      );
    });
  });

  describe("Scope: (ALL)", async () => {
    it("Set breakpoint (all scope)", async () => {
      expect(await editor.setBreakpoint(BP_RETURN_ALL_SCOPE)).is.true;
    });

    it("All scope", async () => {
      await debugBar.continue();
      await debugBar.waitForBreakPoint();
      await delay();

      let targetValues = [
        ...LOCAL_VAR_INIT_VALUES,
        ...PRIVATE_VAR_L1_VALUES,
        ...PUBLIC_VAR_VALUES,
      ];

      const variables: VariablePO[] = [
        ...(await debugPO.getLocalVariables(getLocalVarsName())),
        ...(await debugPO.getPrivateVariables(getPrivateVarsName())),
        ...(await debugPO.getPublicVariables(getPublicVarsName())),
      ];
      expect(variables.length).equals(targetValues.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        targetValues.map((value: any) => value.name)
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        targetValues.map((value: any) => toAdvplType(value))
      );
    });
  });

  describe("Stop Debugger", () => {
    it("Stop", async () => {
      await debugBar.continue();
      await workbenchPO.waitStopDebugger();

      expect(
        await workbenchPO.isDAEndProcess(),
        "Debugger not stopped correctly"
      ).is.true;
    });
  });
});

function incValues(values: any[], increment: number): any[] {
  values.forEach((value: any, index: number) => {
    if (value.type == "N") {
      values[index].value = values[index].value + increment;
    } else if (value.type == "D") {
      values[index].value.setDate(values[index].value.getDate() + increment);
    } else if (value.type == "C") {
      values[index].value = `${values[index].value}${"#".repeat(increment)}`;
    } else if (value.type == "L") {
      while (increment > 0) {
        increment--;
        values[index].value = !values[index].value;
      }
    }
  });

  return values;
}

function toAdvplType(variable: any): string {
  if (variable.value == null) {
    return "NIL";
  } else if (variable.type == "N") {
    return `${variable.value}`;
  } else if (variable.type == "D") {
    const d: Date = variable.value as Date;
    var date = d.toJSON().slice(0, 10);
    return `${date.slice(5, 7)}/${date.slice(8, 10)}/${date.slice(2, 4)}`;
  } else if (variable.type == "C") {
    return `"${variable.value}"`;
  } else if (variable.type == "L") {
    return variable.value ? ".T." : ".F.";
  } else if (variable.type == "B") {
    return variable.value;
  }

  return "NIL";
}

function getLocalVarsName(): string[] {
  return LOCAL_VAR_INIT_VALUES.map((value: any) => value.name);
}

function getPrivateVarsName(): string[] {
  return PRIVATE_VAR_L1_VALUES.map((value: any) => value.name);
}

function getPublicVarsName(): string[] {
  return []; //PUBLIC_VAR_VALUES.map((value: any) => value.name);
}
