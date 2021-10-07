// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  Notification
} from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
  waitNotification
} from "../helper";
import { RpoPageObject } from "../page-objects/rpo-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { StatusPageObject } from "../page-objects/status-po";
import { ADMIN_USER_DATA, LOCALHOST_DATA } from "../servers-data";

// Create a Mocha suite
describe.skip("RPO Operations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let statusBarPO: StatusPageObject;

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName;
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment;

  before(async () => {
    console.error("before.1");
    await openAdvplProject();
    console.error("before.2");

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();
    console.error("before.3");

    await serverTreePO.addNewServer(LOCALHOST_DATA);
    console.error("before.4");

    statusBarPO = new StatusPageObject();
    console.error("before.5");

    await delay();
    console.error("before.8");
  });

  beforeEach(async () => {
    console.error("beforeEach.1");
    await serverTreePO.connect(LOCALHOST_NAME, LOCALHOST_ENVIRONMENT, ADMIN_USER_DATA);
    console.error("beforeEach.2");
    serverItemPO = new ServerTreeItemPageObject(await serverTreePO.getServerTreeItem(LOCALHOST_NAME));
    console.error("beforeEach.3");
  })

  afterEach(async () => {
    console.error("afterEach.1");

    await serverItemPO.fireDisconnectAction();
    console.error("afterEach.2");
  })

  it("Check Integrity", async () => {
    await serverItemPO.fireCheckIntegrity();

    expect(await statusBarPO.waitCheckIntegrity()).is.true;

    const notification: Notification = await waitNotification("RPO intact.");
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
