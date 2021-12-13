import { expect } from "chai";
import { assert } from "console";
import { describe, before, it } from "mocha";
import { By, WebElement } from "vscode-extension-tester";
import { delay, openProject } from "../../helper";
import { PatchGeneratePageObject } from "../../page-objects/patch-generate-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

describe.skip("Patch Operations (forms)", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerViewPageObject();

    await serverTreePO.addNewServer(APPSERVER_DATA);

    await delay();
  });

  beforeEach(async () => {
    await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(APPSERVER_DATA.serverName)
    );
  });

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  });

  describe("Form Filling Test", () => {
    it("From RPO", async () => {
      await serverItemPO.firePatchGenerationFromRPOAction();

      const patchGeneratePO: PatchGeneratePageObject =
        new PatchGeneratePageObject();

      await workbenchPO.waitRpoLoaded();

      const result: string = await patchGeneratePO.applyFilterInput("*");
      expect(result).not.equal("");

      const options: string[] = result.split("\n");

      await patchGeneratePO.selectLeftOption(options[0]);
      await patchGeneratePO.beginWebView();

      const selectRight: WebElement = await patchGeneratePO.findElement(
        "SelectR"
      );
      let optionsRight: WebElement[] = await selectRight.findElements(
        By.css("option")
      );
      await patchGeneratePO.endWebView();

      expect(optionsRight.length).is.equal(1);

      await patchGeneratePO.selectLeftOption(...options.slice(0, 2));
      await patchGeneratePO.beginWebView();
      optionsRight = await selectRight.findElements(By.css("option"));
      expect(optionsRight.length).is.equal(2);

      await patchGeneratePO.endWebView();
      await delay(5000);

      //await patchGeneratePO.close();
    });

    it("Patch Generation (by difference)");

    it("Patch Apply");
  });
});
