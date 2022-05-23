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
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";

const LAUNCHER_NAME: string = "Smart Client Debug";
const COMPILE_FILE = ["files", "debug", "primitive.4gl"];

const BP_FIRST_LINE = 30;
const BP_LOCAL_START = 53;
const BP_LOCAL_AFTER_LET = 74;
const BP_LOCAL_RETURN = 71;

const LOCAL_VAR_INIT_VALUES: any[] = [
  { name: "L_INDEX", type: "SMALLINT", value: 0 },
  { name: "L_DECIMAL", type: "DECIMAL", value: 0 },
  { name: "L_DECIMAL_1", type: "DECIMAL(10,1)", value: 0 },
  { name: "L_DECIMAL_2", type: "DECIMAL(10,2)", value: 0 },
  { name: "L_FLOAT", type: "FLOAT", value: 0 },
  { name: "L_SMALLFLOAT", type: "SMALLFLOAT", value: 0 },
  { name: "L_MONEY", type: "MONEY", value: 0 },
  { name: "L_SMALLINT_MIN", type: "SMALLINT", value: 0 },
  { name: "L_SMALLINT", type: "SMALLINT", value: 0 },
  { name: "L_SMALLINT_MAX", type: "SMALLINT", value: 0 },
  { name: "L_INTEGER_MIN", type: "INTEGER", value: 0 },
  { name: "L_INTEGER", type: "INTEGER", value: 0 },
  { name: "L_INTEGER_MAX", type: "INTEGER", value: 0 },
  { name: "L_CHAR", type: "CHAR(10)", value: "" },
  { name: "L_VARCHAR", type: "VARCHAR(10)", value: "" },
  { name: "L_DATE", type: "DATE", value: "" },
  { name: "L_DATETIME", type: "DATETIME YEAR TO SECOND", value: "" },
];

const LOCAL_VAR_assignment_VALUES = [
  { name: "L_INDEX", type: "SMALLINT", value: 0 },
  { name: "L_DECIMAL", type: "DECIMAL", value: 1.23 },
  { name: "L_DECIMAL_1", type: "DECIMAL(10,1)", value: 1.23 },
  { name: "L_DECIMAL_2", type: "DECIMAL(10,2)", value: 0 },
  {
    name: "L_FLOAT",
    type: "FLOAT",
    value: 0.12345678901234567890123456789,
  },
  { name: "L_SMALLFLOAT", type: "SMALLFLOAT", value: 0.1234567890123456 },
  { name: "L_MONEY", type: "MONEY", value: 1.12 },
  { name: "L_SMALLINT_MIN", type: "SMALLINT", value: -32767 },
  { name: "L_SMALLINT", type: "SMALLINT", value: 0 },
  { name: "L_SMALLINT_MAX", type: "SMALLINT", value: 32767 },
  { name: "L_INTEGER_MIN", type: "INTEGER", value: -2147483647 },
  { name: "L_INTEGER", type: "INTEGER", value: 0 },
  { name: "L_INTEGER_MAX", type: "INTEGER", value: 2147483647 },
  { name: "L_CHAR", type: "CHAR(10)", value: "char" },
  { name: "L_VARCHAR", type: "VARCHAR(10)", value: "varchar" },
  { name: "L_DATE", type: "DATE", value: "2022-01-01" },
  {
    name: "L_DATETIME",
    type: "DATETIME YEAR TO SECOND",
    value: "2022-01-01 12:00:00",
  },
];

const MODULAR_VAR_INIT_VALUES: any[] = [
  { name: "M_DECIMAL", type: "DECIMAL", value: 0 },
  { name: "M_DECIMAL_1", type: "DECIMAL(10,1)", value: 0 },
  { name: "M_DECIMAL_2", type: "DECIMAL(10,2)", value: 0 },
  { name: "M_FLOAT", type: "FLOAT", value: 0 },
  { name: "M_SMALLFLOAT", type: "SMALLFLOAT", value: 0 },
  { name: "M_MONEY", type: "MONEY", value: 0 },
  { name: "M_SMALLINT_MIN", type: "SMALLINT", value: 0 },
  { name: "M_SMALLINT", type: "SMALLINT", value: 0 },
  { name: "M_SMALLINT_MAX", type: "SMALLINT", value: 0 },
  { name: "M_INTEGER_MIN", type: "INTEGER", value: 0 },
  { name: "M_INTEGER", type: "INTEGER", value: 0 },
  { name: "M_INTEGER_MAX", type: "INTEGER", value: 0 },
  { name: "M_CHAR", type: "CHAR(10)", value: "" },
  { name: "M_VARCHAR", type: "VARCHAR(10)", value: "" },
];

const GLOBAL_VAR_INIT_VALUES: any[] = [
  { name: "STATUS", value: "0", type: "N" },
  { name: "SQLCA", value: "Object", type: "OBJECT" },
  { name: "INT_FLAG", value: "0", type: "INTEGER" },
  { name: "QUIT_FLAG", value: "0", type: "INTEGER" },
  //{ name: "G_USER", value: "NIL", type: "CHAR(8)" },
  //{ name: "G_COD_EPRESA", value: "NIL", type: "CHAR(2)" },
];

describe("Debug primitive variables", async () => {
  let workbenchPO: WorkbenchPageObject;
  let debugPO: DebugPageObject;
  let serverTreePO: ServerViewPageObject;
  let editor: TextEditorPageObject;
  let debugBar: DebugToolbar;
  let serverTreeItemPO: ServerTreeItemPageObject;

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

    serverTreeItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
  });

  after(async () => {
    await serverTreePO.openView();
    await serverTreeItemPO.fireDisconnectAction();
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
      expect(await workbenchPO.isCompileOk()).is.true;
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

      await debugPO.fillProgramName(COMPILE_FILE[COMPILE_FILE.length - 1]);

      expect(await workbenchPO.isDABeginProcess(), "DA not running").is.true;

      debugBar = await DebugToolbar.create();
      await debugBar.wait(10000);
      await debugBar.waitForBreakPoint();
      await delay();
    });
  });

  describe("Scope: GLOBAL", async () => {
    it("Evaluate inicial values", async () => {
      await delay();

      const variables: VariablePO[] = await debugPO.getGlobalVariables(
        getGlobalVarsName()
      );

      // expect(variables).to.have.deep.nested.property(
      //   "name",
      //   getGlobalVarsName()
      // );

      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        getGlobalVarsName()
      );
      expect(variables.map((variable: VariablePO) => variable.type)).to.eqls(
        getGlobalVarsType()
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        GLOBAL_VAR_INIT_VALUES.map((value: any) => to4GLType(value))
      );
    });
  });

  describe.skip("Scope: MODULAR", async () => {
    it("Evaluate inicial values", async () => {
      await delay();

      const variables: VariablePO[] = await debugPO.getModularVariables(
        getModularVarsName()
      );

      //expect(variables.length).to.equals(MODULAR_VAR_INIT_VALUES.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        getModularVarsName()
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        MODULAR_VAR_INIT_VALUES.map((value: any) => to4GLType(value))
      );
    });
  });

  describe("Scope: LOCAL", async () => {
    it("Evaluate inicial values", async () => {
      expect(await editor.setBreakpoint(BP_LOCAL_START)).is.true;
      await debugBar.continue();
      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getLocalVariables(
        getLocalVarsName()
      );

      //expect(variables.length).to.equals(LOCAL_VAR_INIT_VALUES.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        getLocalVarsName()
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        LOCAL_VAR_INIT_VALUES.map((value: any) => to4GLType(value))
      );
    });

    it("Evaluate after assignment", async () => {
      expect(await editor.setBreakpoint(BP_LOCAL_AFTER_LET)).is.true;
      await debugBar.continue();
      await debugBar.waitForBreakPoint();
      await delay();

      const variables: VariablePO[] = await debugPO.getLocalVariables(
        getLocalVarsName()
      );

      expect(variables.length).to.equals(LOCAL_VAR_assignment_VALUES.length);
      expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
        getLocalVarsName()
      );
      expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
        LOCAL_VAR_assignment_VALUES.map((value: any) => to4GLType(value))
      );
    });

    it("Loop");
    // , async () => {
    //   let targetValues = [...LOCAL_VAR_INIT_VALUES];
    //   expect(await editor.setBreakpoint(BP_LOCAL_RETURN)).is.true;
    //   await debugBar.continue();

    //   targetValues = incValues(targetValues, 5);
    //   targetValues[0].value = 6;
    //   await debugBar.waitForBreakPoint();
    //   await delay();

    //   const variables: VariablePO[] = await debugPO.getLocalVariables(
    //     getLocalVarsName()
    //   );
    //   expect(variables.length).equals(targetValues.length);
    //   expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
    //     targetValues.map((value: any) => value.name)
    //   );
    //   expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
    //     targetValues.map((value: any) => toAdvplType(value))
    //   );
    // });
  });

  // , async () => {
  //   it("Set breakpoint", async () => {
  //     expect(await editor.setBreakpoint(BP_LIST_PRIVATE_RETURN)).is.true;
  //   });

  //   it("Private (level 1)", async () => {
  //     await debugBar.continue();
  //     let targetValues = [...PRIVATE_VAR_L1_VALUES];

  //     await debugBar.waitForBreakPoint();
  //     await delay();

  //     const variables: VariablePO[] = await debugPO.getPrivateVariables(
  //       getPrivateVarsName()
  //     );
  //     expect(variables.length).equals(targetValues.length);
  //     expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
  //       targetValues.map((value: any) => value.name)
  //     );
  //     expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
  //       targetValues.map((value: any) => toAdvplType(value))
  //     );
  //   });

  //   it("Private (level 2)", async () => {
  //     await debugBar.continue();
  //     let targetValues = [...PRIVATE_VAR_L2_VALUES];

  //     await debugBar.waitForBreakPoint();
  //     await delay();

  //     const variables: VariablePO[] = await debugPO.getPrivateVariables(
  //       getPrivateVarsName()
  //     );
  //     expect(variables.length).equals(targetValues.length);
  //     expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
  //       targetValues.map((value: any) => value.name)
  //     );
  //     expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
  //       targetValues.map((value: any) => toAdvplType(value))
  //     );
  //   });

  //   it("Private (level 3)", async () => {
  //     await debugBar.continue();
  //     let targetValues = [...PRIVATE_VAR_L3_VALUES];

  //     await debugBar.waitForBreakPoint();
  //     await delay();

  //     const variables: VariablePO[] = await debugPO.getPrivateVariables(
  //       getPrivateVarsName()
  //     );
  //     expect(variables.length).equals(targetValues.length);
  //     expect(variables.map((variable: VariablePO) => variable.name)).to.eqls(
  //       targetValues.map((value: any) => value.name)
  //     );
  //     expect(variables.map((variable: VariablePO) => variable.value)).to.eqls(
  //       targetValues.map((value: any) => toAdvplType(value))
  //     );
  //   });
  //});

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

function to4GLType(variable: any): string {
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
  } else {
    return variable.value;
  }

  return "NIL";
}

function getLocalVarsName(): string[] {
  return LOCAL_VAR_INIT_VALUES.map((value: any) => value.name);
}

function getGlobalVarsName(): string[] {
  return GLOBAL_VAR_INIT_VALUES.map((value: any) => value.name);
}

function getGlobalVarsType(): string[] {
  return GLOBAL_VAR_INIT_VALUES.map(
    (value: any) =>
      `${value.type.at(0)}${value.type.substring(1).toLowerCase()}`
  );
}

function getModularVarsName(): string[] {
  return MODULAR_VAR_INIT_VALUES.map((value: any) => value.name);
}
