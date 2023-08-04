import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  TreeItem,
  Notification,
  EditorView,
  TextEditor,
} from "vscode-extension-tester";
import { delay, DELAY_LONG, prepareProject } from "../../helper";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

const COMPILE_FOLDER = ["git", "GIT-0895"];

// Não mostra tabela como resultados da compilação #895
describe("GIT-0895: Does not show table as build results", async () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let explorerPO: ExplorerPageObject;
  let compilePO: BuildPageObject;
  let resourceItem: TreeItem;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);

    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    compilePO = new BuildPageObject(workbenchPO);
  });

  beforeEach(async () => {
    explorerPO = await workbenchPO.openExplorerView();
  });

  it("Compile Source", async () => {
    resourceItem = await explorerPO.getFolder(COMPILE_FOLDER);
    expect(resourceItem).not.undefined;

    await compilePO.fireBuildFile(resourceItem);
    await workbenchPO.waitBuilding();
  });

  it("Open result compile table", async () => {
    await compilePO.askShowCompileResult(true);
    await delay();

    const view: EditorView = new EditorView();
    const editor: TextEditor = new TextEditor(view);
    const title: string = await editor.getTitle();

    expect(title).to.equals("Compilation Result");
    await delay(DELAY_LONG);

    await view.closeEditor(title);
  });
});
