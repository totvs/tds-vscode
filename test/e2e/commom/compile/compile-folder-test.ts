import { expect } from "chai";
import { describe, before, it } from "mocha";
import { TreeItem } from "vscode-extension-tester";
import { delay, openProject } from "../../helper";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { OutputLsPageObject } from "../../page-objects/output-ls-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, COMPILE_FILES } from "../../scenario";

const FOLDER_TO_COMPILE: string[] = ["files"];

describe("Compile folders", () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;
  let compilePO: BuildPageObject;
  let outputPO: OutputLsPageObject;
  let explorerPO: ExplorerPageObject;
  let folderItem: TreeItem;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);
    await delay();

    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );

    outputPO = await workbenchPO.openOutputLs();
    compilePO = new BuildPageObject(workbenchPO);
  });

  beforeEach(async () => {
    explorerPO = await workbenchPO.openExplorerView();
  });

  it("Find folder", async () => {
    folderItem = await explorerPO.getFolder(FOLDER_TO_COMPILE);

    expect(folderItem).is.not.undefined;
    expect(FOLDER_TO_COMPILE[FOLDER_TO_COMPILE.length - 1]).is.equals(
      await folderItem.getLabel()
    );
  });

  it("Compile folder", async () => {
    await outputPO.clearConsole();
    await compilePO.fireBuildFile(folderItem);

    await workbenchPO.waitBuilding();

    await compilePO.askShowCompileResult(false);

    await outputPO.compileSequenceFolderTest();
  });

  it.skip("Recompile", async () => {
    await outputPO.clearConsole();
    await compilePO.fireRebuildFile(folderItem); //comando rebuild não pega item correte da árvore e sim do editor

    await workbenchPO.waitBuilding();

    await outputPO.recompileSequenceFileTest();
  });
});
