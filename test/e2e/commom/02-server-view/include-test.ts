import { expect } from "chai";
import { describe, before, it } from "mocha";
import { EditorView, TextEditor } from "vscode-extension-tester";
import {
  avoidsBacksliding,
  delay,
  readServersJsonFile,
  openProject,
} from "../../helper";
import { IncludePageObject } from "../../page-objects/include-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { DELETE_DATA, INCLUDE_PATH_DATA } from "../../scenario";

describe("Include operations and server file structure", () => {
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
});
