// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import { EditorView, TextEditor } from "vscode-extension-tester";
import {
  avoidsBacksliding,
  delay,
  openAdvplProject,
  readServersJsonFile
} from "../helper";
import { CompileKeyPageObject } from "../page-objects/compile-key-po";
import { IncludePageObject } from "../page-objects/include-po";
import { ICompileKeyData, IIncludeData } from "../page-objects/interface-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { StatusPageObject } from "../page-objects/status-po";
import { CHANGE_INCLUDE_PATH_DATA, COMPILE_KEY_FILE, DELETE_DATA } from "../servers-data";

// Create a Mocha suite
describe.only("TOTVS: Server View Configurations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let statusBarPO: StatusPageObject;

  before(async () => {
    await openAdvplProject();

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();

    serverItemPO = new ServerTreeItemPageObject(await serverTreePO.getNewServer(DELETE_DATA));

    statusBarPO = new StatusPageObject();
    await delay();
  });

  it("Include (change)", async () => {
    const includePO: IncludePageObject = new IncludePageObject();
    await serverItemPO.fireInclude();

    await includePO.fillIncludePage(CHANGE_INCLUDE_PATH_DATA, true);

    await serverItemPO.fireInclude();
    const pageData: IIncludeData = await includePO.getIncludePage();

    expect(pageData.includePath.join(";")).to.equal(CHANGE_INCLUDE_PATH_DATA.includePath.join(";"));
  });

  it.only("Include (add more patchs)", async () => {
    await avoidsBacksliding();
    console.error("include.1");

    const includePO: IncludePageObject = new IncludePageObject();
    await serverItemPO.fireInclude();
    console.error("include.2");

    const oldValue: IIncludeData = await includePO.getIncludePage();
    const newValue: IIncludeData = { includePath: [...oldValue.includePath, ...CHANGE_INCLUDE_PATH_DATA.includePath] };
    console.error("include.3");

    await includePO.fillIncludePage(newValue, true);
    await avoidsBacksliding();
    console.error("include.4");

    await serverItemPO.fireInclude();
    const pageData: IIncludeData = (await includePO.getIncludePage());
    console.error("include.5");

    expect(pageData.includePath).to.equal(newValue.includePath);
    console.error("include.6");

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
      })

      return text;
    }
    const text = await editor.getText();
    expect(transform(text)).to.equals(transform(textServer));

    await view.closeEditor(title);
  });

  it("Compile key (valid input)", async () => {
    const compileKeyPO: CompileKeyPageObject = new CompileKeyPageObject();
    await serverItemPO.fireCompileKey();

    const oldValue: ICompileKeyData = await compileKeyPO.getCompileKeyPage();

    expect(oldValue.machineId).not.empty;

    const newValue: ICompileKeyData = { ...oldValue, compileKeyFile: COMPILE_KEY_FILE[oldValue.machineId] };
    await compileKeyPO.fillCompileKeyPage(newValue);

    expect(await compileKeyPO.isValidKey()).is.true;
    await compileKeyPO.fireSave(true);

    expect(await statusBarPO.isLoggedIn()).is.true;
  });

  it("Compile key (clear)", async () => {
    const compileKeyPO: CompileKeyPageObject = new CompileKeyPageObject();
    await serverItemPO.fireCompileKey();
    let oldValue: ICompileKeyData = await compileKeyPO.getCompileKeyPage();
    let newValue: ICompileKeyData = { ...oldValue, compileKeyFile: COMPILE_KEY_FILE[oldValue.machineId] };
    await compileKeyPO.fillCompileKeyPage(newValue);
    await compileKeyPO.fireSave(true);

    await serverItemPO.fireCompileKey();
    await compileKeyPO.fireClear();
    await compileKeyPO.fireSave(false);

    newValue = await compileKeyPO.getCompileKeyPage();
    await compileKeyPO.fireSave(true);

    expect(newValue.token).is.empty;
    expect(await statusBarPO.isNotLoggedIn()).is.true;
  });

});
