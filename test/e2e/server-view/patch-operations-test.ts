// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  Workbench,
  TreeItem,
  ViewItemAction,
  InputBox,
  QuickPickItem,
} from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
  takeQuickPickAction
} from "../helper";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { StatusPageObject } from "../page-objects/status-po";
import { ADMIN_USER_DATA, LOCALHOST_DATA } from "../servers-data";

// Create a Mocha suite
describe("Patch Operations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let pickBox: InputBox;
  let title: string = "";
  let statusBarPO: StatusPageObject;

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName;
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment;

  before(async () => {
    await openAdvplProject();

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();

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

  it.skip("Patch Generation (from RPO)", async () => {
  });

  it.skip("Patch Generation (by difference)", async () => {
  });

  it.skip("Patch Apply", async () => {
  });

});
