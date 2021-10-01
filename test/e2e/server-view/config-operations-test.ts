// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import { EditorView, TextEditor } from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
  readServersJsonFile
} from "../helper";
import { IncludePageObject } from "../page-objects/include-po";
import { IIncludeData } from "../page-objects/interface-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { StatusPageObject } from "../page-objects/status-po";
import { CHANGE_INCLUDE_PATH_DATA, DELETE_DATA } from "../servers-data";

// Create a Mocha suite
describe.only("TOTVS: Server View Configurations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let statusBarPO: StatusPageObject;

  before(async () => {
    await openAdvplProject();
    await delay(2000);

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();
    await delay();

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

  it.skip("Include (add more patchs)", async () => {
    //esta falhando no segundo fillIncludePage
    //não encontra a WebView
    const includePO: IncludePageObject = new IncludePageObject();
    await serverItemPO.fireInclude();
    await delay();

    const oldValue: IIncludeData = await includePO.getIncludePage();
    const newValue: IIncludeData = { includePath: [...oldValue.includePath, ...CHANGE_INCLUDE_PATH_DATA.includePath] };

    await includePO.fillIncludePage(newValue, true);
    await delay();

    await serverItemPO.fireInclude();
    const pageData: IIncludeData = (await includePO.getIncludePage());
    expect(pageData.includePath).to.equal(newValue.includePath);
  });

  it.only("Configure Server View", async () => {
    await serverTreePO.fireConfigureServerView();

    const view: EditorView = new EditorView();
    const editor: TextEditor = new TextEditor(view);
    const title: string = await editor.getTitle();
    const textServer: string = await readServersJsonFile();

    const text = await editor.getText();
    expect(text).to.equals(textServer);

    await view.closeEditor(title);
  });

  it.skip("Compile key (input)", async () => {
  });

  it.skip("Compile key (clear)", async () => {
  });

});
