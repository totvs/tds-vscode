import { expect } from "chai";
import { describe, before, it } from "mocha";
import { TreeItem } from "vscode-extension-tester";
import { prepareProject } from "../../helper";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ExplorerPageObject } from "../../page-objects/explorer-view-po";

describe.only("DSS: Cache Configuration", async () => {
  let workbenchPO: WorkbenchPageObject;
  let resourceItem: TreeItem;

  before((done) => {

    prepareProject();

    workbenchPO = new WorkbenchPageObject();

    done();
  });

  it("Cache: onDisk", (done) => {
    workbenchPO.openExplorerView()
      .then((explorerPO: ExplorerPageObject) => {
        explorerPO.getResource([".vscode", "settings.json"]).then((value: TreeItem) => {
          resourceItem = value;
        });
      });

    expect(resourceItem).is.not.undefined;

    done();
  });

  it("Cache: Off", async () => {
    const explorerPO: ExplorerPageObject = await workbenchPO.openExplorerView();

    resourceItem = await explorerPO.getResource([".vscode", "settings.json"]);

    expect(resourceItem).is.not.undefined;
  });

  it("Cache: OnMemory", async () => {
    const explorerPO: ExplorerPageObject = await workbenchPO.openExplorerView();

    resourceItem = await explorerPO.getResource([".vscode", "settings.json"]);

    expect(resourceItem).is.not.undefined;
  });

});
