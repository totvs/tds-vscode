import { expect } from "chai";
import { describe, before, it, afterEach } from "mocha";
import { EditorView, TextEditor } from "vscode-extension-tester";
import {
  avoidsBacksliding,
  delay,
  readServersJsonFile,
  openProject,
} from "../../helper";
import { CompileKeyPageObject } from "../../page-objects/compile-key-po";
import { IncludePageObject } from "../../page-objects/include-po";
import { ICompileKeyData } from "../../page-objects/interface-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import {
  COMPILE_KEY_FILE,
  DELETE_DATA,
  INCLUDE_PATH_DATA,
} from "../../scenario";

describe("Server View Configurations", () => {
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

  it("Include (change)", async () => {
    const includePO: IncludePageObject = new IncludePageObject();
    await serverItemPO.fireInclude();

    await includePO.fillIncludePage(INCLUDE_PATH_DATA.toChange);
    await includePO.fireSave(true);

    await serverItemPO.fireInclude();
    const pageData: string[] = await includePO.getIncludePage();

    expect(pageData.join(";")).to.equal(INCLUDE_PATH_DATA.toChange.join(";"));
    await includePO.fireSave(true);
  });

  it("Include (add more patchs)", async () => {
    await avoidsBacksliding();

    const includePO: IncludePageObject = new IncludePageObject();
    await serverItemPO.fireInclude();

    const oldValue: string[] = await includePO.getIncludePage();
    const newValue: string[] = [...oldValue, ...INCLUDE_PATH_DATA.toAdd];

    await includePO.fillIncludePage(newValue);
    await includePO.fireSave(true);
    await avoidsBacksliding();

    await serverItemPO.fireInclude();
    const pageData: string[] = await includePO.getIncludePage();

    expect(pageData.join(";")).to.equal(newValue.join(";"));
    await includePO.fireSave(true);
  });

  it("Configure Server View", async () => {
    await serverTreePO.fireConfigureServerView();

    const view: EditorView = new EditorView();
    const editor: TextEditor = new TextEditor(view);
    const title: string = await editor.getTitle();
    const textServer: string = await readServersJsonFile();
    const transform = (text: string): string => {
      const replaces: any[][] = [
        [/\r/g, ""],
        // [/\\n/g, "\n"],
        // [/\\t/g, "\t"]
      ];

      replaces.forEach((element: any[]) => {
        text = text.replace(element[0], element[1]);
      });

      return text;
    };
    const text = await editor.getText();
    expect(transform(text)).to.equals(transform(textServer));

    await view.closeEditor(title);
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
});
