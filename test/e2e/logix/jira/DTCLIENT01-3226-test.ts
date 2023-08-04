import { expect } from "chai";
import { describe, before, it } from "mocha";
import { TreeItem } from "vscode-extension-tester";
import { delay, prepareProject } from "../../helper";
import { BuildPageObject } from "../../page-objects/build-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

const COMPILE_FILE = ["files", "singleFile", "job003.4gl"];

//[TDS - VSCode 1.3.11] apos troca de ambiente do appserver, falha compilacao alegando q server nao está conectado
describe("DTCLIENT01-3126: [TDS-VSCode 1.3.11] after changing appserver environment, compilation fails claiming server is not connected", async () => {
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();

    const serverTreePO: ServerViewPageObject =
      await workbenchPO.openTotvsView();
    await serverTreePO.getServer(APPSERVER_DATA);
    await delay();
  });

  after(async () => {
    await workbenchPO.closeAllEditors();
  });

  describe(`First envinronment: ${APPSERVER_DATA.environments[0]}`, async () => {
    it("Connect", async () => {
      const serverTreePO: ServerViewPageObject =
        await workbenchPO.openTotvsView();

      await serverTreePO.connect(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environments[0],
        ADMIN_USER_DATA
      );

      expect(
        await workbenchPO.isConnected(
          APPSERVER_DATA.serverName,
          APPSERVER_DATA.environments[0]
        )
      ).is.true;
    });

    it("Try compile", async () => {
      const explorerPO: ExplorerPageObject =
        await workbenchPO.openExplorerView();
      const compilePO: BuildPageObject = new BuildPageObject(workbenchPO);
      const resourceItem: TreeItem = await explorerPO.getResource(COMPILE_FILE);

      compilePO.compileProcess(resourceItem);
    });
  });

  describe(`Second envinronment: ${APPSERVER_DATA.environments[1]}`, async () => {
    it("Change envinronment", async () => {
      const serverTreePO: ServerViewPageObject =
        await workbenchPO.openTotvsView();

      await serverTreePO.changeEnvironment(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environments[1],
        ADMIN_USER_DATA
      );

      expect(
        await workbenchPO.isConnected(
          APPSERVER_DATA.serverName,
          APPSERVER_DATA.environments[1]
        )
      ).is.true;
    });

    it("Try compile", async () => {
      const explorerPO: ExplorerPageObject =
        await workbenchPO.openExplorerView();
      const compilePO: BuildPageObject = new BuildPageObject(workbenchPO);
      const resourceItem: TreeItem = await explorerPO.getResource(COMPILE_FILE);

      compilePO.compileProcess(resourceItem);
    });
  });
});
