// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  Notification
} from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
} from "../helper";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, LOCALHOST_DATA } from "../servers-data";

// Create a Mocha suite
describe.skip("RPO Operations", () => {
  let workbenchPO: WorkbenchPageObject;
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName;
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();

    await serverTreePO.addNewServer(LOCALHOST_DATA);

    await delay();
  });

  beforeEach(async () => {
    await serverTreePO.connect(LOCALHOST_NAME, LOCALHOST_ENVIRONMENT, ADMIN_USER_DATA);
    serverItemPO = new ServerTreeItemPageObject(await serverTreePO.getServerTreeItem(LOCALHOST_NAME));
  })

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction();
  })

  it("Check Integrity", async () => {
    await serverItemPO.fireCheckIntegrity();

    expect(await workbenchPO.waitCheckIntegrity()).is.true;

    const notification: Notification = await workbenchPO.waitNotification("RPO intact.");
    expect(notification).not.is.undefined;
  });

  it.skip("Revalidate", async () => {
  });

  it.skip("Repository Log", async () => {
  });

  it.skip("Objects Inspector", async () => {
  });

  it.skip("Functions Inspector", async () => {
  });

});
