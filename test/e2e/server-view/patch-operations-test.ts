import { expect } from "chai";
import { assert } from "console";
import { describe, before, it } from "mocha";
import { By, WebElement } from "vscode-extension-tester";
import { delay, openAdvplProject } from "../helper";
import { PatchGeneratePageObject } from "../page-objects/patch-generate-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { ADMIN_USER_DATA, LOCALHOST_DATA } from "../servers-data";

describe.only("Patch Operations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;

  before(async () => {
    await openAdvplProject();

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();

    await serverTreePO.addNewServer(LOCALHOST_DATA);

    await delay();
  });

  beforeEach(async () => {
    await serverTreePO.connect(
      LOCALHOST_DATA.serverName,
      LOCALHOST_DATA.environment,
      ADMIN_USER_DATA
    );
    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(LOCALHOST_DATA.serverName)
    );
  });

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  });

  describe("Form Filling Test (no patch file generate)", () => {
    it("Patch Generation (from RPO)", async () => {
      await serverItemPO.firePatchGenerationFromRPOAction();

      const patchGeneratePO: PatchGeneratePageObject =
        new PatchGeneratePageObject();

      //expect(await patchGeneratePO.isOpen()).is.true;

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
