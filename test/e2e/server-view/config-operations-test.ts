// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  Workbench,
  TreeItem,
  ViewItemAction,
  InputBox,
  QuickPickItem,
  Notification
} from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
  takeQuickPickAction,
  waitNotification
} from "../helper";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { StatusPageObject } from "../page-objects/status-po";
import { ADMIN_USER_DATA, DELETE_DATA, LOCALHOST_DATA } from "../servers-data";

// Create a Mocha suite
describe("TOTVS: Server View Configurations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let statusBarPO: StatusPageObject;

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName;
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment;

  before(async () => {
    await openAdvplProject();
    await delay(2000);

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();
    await delay();

    await serverTreePO.addNewServer(LOCALHOST_DATA);

    statusBarPO = new StatusPageObject();

    await delay();
  });

  beforeEach(async () => {
    await serverTreePO.connect(LOCALHOST_NAME, LOCALHOST_ENVIRONMENT, ADMIN_USER_DATA);
    serverItemPO = new ServerTreeItemPageObject(await serverTreePO.getServerTreeItem(LOCALHOST_NAME));
  })

  afterEach(async () => {
    await serverItemPO.fireDisconnectAction();
    serverItemPO = null;
  })

  it.skip("Include", async () => {
  });

  it.skip("Compile key (input)", async () => {
  });

  it.skip("Configure Server View", async () => {
  });

});
