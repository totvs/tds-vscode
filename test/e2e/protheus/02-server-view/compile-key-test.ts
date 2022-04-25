import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { CompileKeyPageObject } from "../../page-objects/compile-key-po";
import { ICompileKeyData } from "../../page-objects/interface-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { COMPILE_KEY_FILE, DELETE_DATA } from "../../scenario";

(Object.keys(COMPILE_KEY_FILE).length > 1 ? describe : describe.skip)(
  "Compile key operations",
  async () => {
    let serverTreePO: ServerViewPageObject;
    let serverItemPO: ServerTreeItemPageObject;
    let workbenchPO: WorkbenchPageObject;

    before(async () => {
      await openProject();

      workbenchPO = new WorkbenchPageObject();
      serverTreePO = await workbenchPO.openTotvsView();

      serverItemPO = new ServerTreeItemPageObject(
        await serverTreePO.getServer(DELETE_DATA)
      );

      await delay();
    });

    it("Compile key (valid input)", async () => {
      const compileKeyPO: CompileKeyPageObject = new CompileKeyPageObject();
      await serverItemPO.fireCompileKey();

      const oldValue: ICompileKeyData = await compileKeyPO.getCompileKeyPage();

      expect(oldValue.machineId).not.empty;

      const newValue: ICompileKeyData = {
        ...oldValue,
        compileKeyFile: COMPILE_KEY_FILE[oldValue.machineId],
      };
      await compileKeyPO.fillCompileKeyPage(newValue);

      expect(await compileKeyPO.isValidKey()).is.true;
      await compileKeyPO.fireSave(true);

      expect(await workbenchPO.isHaveKey()).is.true;
    });

    it("Compile key (clear)", async () => {
      const compileKeyPO: CompileKeyPageObject = new CompileKeyPageObject();
      await serverItemPO.fireCompileKey();
      const oldValue: ICompileKeyData = await compileKeyPO.getCompileKeyPage();
      let newValue: ICompileKeyData = {
        ...oldValue,
        compileKeyFile: COMPILE_KEY_FILE[oldValue.machineId],
      };
      await compileKeyPO.fillCompileKeyPage(newValue);
      await compileKeyPO.fireSave(true);

      await serverItemPO.fireCompileKey();
      await compileKeyPO.fireClear();
      await compileKeyPO.fireSave(false);

      newValue = await compileKeyPO.getCompileKeyPage();
      await compileKeyPO.fireSave(true);

      expect(newValue.token).is.empty;
      expect(await workbenchPO.isNotHaveKey()).is.true;
    });
  }
);
