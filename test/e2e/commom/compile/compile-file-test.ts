import { expect } from "chai";
import { describe, before, it } from "mocha";
import { TreeItem } from "vscode-extension-tester";
import { openProject } from "../../helper";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { OutputLsPageObject } from "../../page-objects/output-ls-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA, COMPILE_FILES } from "../../scenario";

(COMPILE_FILES.singleFile ? describe : describe)(
  "Compile Simple File (basic test)",
  () => {
    let serverTreePO: ServerViewPageObject;
    let workbenchPO: WorkbenchPageObject;
    let explorerPO: ExplorerPageObject;
    let compilePO: BuildPageObject;
    let resourceItem: TreeItem;
    let outputPO: OutputLsPageObject;

    before(async () => {
      await openProject();

      workbenchPO = new WorkbenchPageObject();
      serverTreePO = await workbenchPO.openTotvsView();

      await serverTreePO.getServer(APPSERVER_DATA);

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

    it("Find resource", async () => {
      resourceItem = await explorerPO.getResource(COMPILE_FILES.singleFile);

      expect(resourceItem).is.not.undefined;
      expect(
        COMPILE_FILES.singleFile[COMPILE_FILES.singleFile.length - 1]
      ).is.equals(await resourceItem.getLabel());
    });

    it("Compile", async () => {
      await outputPO.clearConsole();
      await compilePO.fireBuildFile(resourceItem);

      await workbenchPO.waitBuilding();
      await compilePO.askShowCompileResult(false);

      await outputPO.compileSequenceSingleFileTest();
    });

    it.skip("Recompile", async () => {
      await outputPO.clearConsole();
      await compilePO.fireRebuildFile(resourceItem); //comando rebuild não pega item correte da árvore e sim do editor

      await workbenchPO.waitBuilding();
      await compilePO.askShowCompileResult(false);

      await outputPO.recompileSequenceFileTest();
    });
  }
);
