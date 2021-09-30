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
describe.skip("RPO Operations", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let pickBox: InputBox;
  let title: string = "";
  let statusBarPO: StatusPageObject;

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName;
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment;

  before(async () => {
    //workbench = new Workbench();

    await openAdvplProject("project2");
    await delay(2000);

    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();
    await delay();

    await serverTreePO.addNewServer(LOCALHOST_DATA);

    serverItemPO = new ServerTreeItemPageObject(await serverTreePO.getServerTreeItem(LOCALHOST_NAME));
    statusBarPO = new StatusPageObject();

    await delay();
  });

  beforeEach(async () => {
  })

  after(async () => {
    await serverTreePO.disconnectAllServers();
  })

  it("Fire Connect Action", async () => {
    serverItemPO.fireConnectAction();
  });

  it("Input Environment", async () => {
    pickBox = new InputBox();
    await delay();

    title = await pickBox.getTitle();
    expect(title).is.equal("Connection (1/1)");

    let quickPicks: QuickPickItem[] = await pickBox.getQuickPicks();
    if (quickPicks.length == 0) {
      expect(await takeQuickPickAction(pickBox, "action")).is.true;
      title = await pickBox.getMessage();
      expect(title.startsWith("Enter the name of the environment")).is.true;
      await delay();
    }

    await pickBox.setText(LOCALHOST_ENVIRONMENT);
    await delay();
    await pickBox.confirm();
    await delay();
  });

  it("Input User", async () => {
    await pickBox.wait(2000);
    title = await pickBox.getTitle();
    expect(title).is.equal("Authentication (1/2)");

    await pickBox.setText(ADMIN_USER_DATA.username);
    await delay();
    await pickBox.confirm();
    await delay();

    await pickBox.wait();
    title = await pickBox.getTitle();
    expect(title).is.equal("Authentication (2/2)");

    await pickBox.setText(ADMIN_USER_DATA.password);
    await delay();
    await pickBox.confirm();
    await delay();
  });

  it("Localhost Server Connected", async () => {
    await statusBarPO.waitConnection();
    expect(await statusBarPO.isConnected(LOCALHOST_NAME, LOCALHOST_ENVIRONMENT)).is.true;
    expect(await serverItemPO.isConnected()).is.true;
  });

  it("Localhost Server Disconnected", async () => {
    serverItemPO.fireDisconnectAction();

    expect(await statusBarPO.isNeedSelectServer()).is.true;
    expect(await serverItemPO.isNotConnected()).is.true;
  });

  it("Try Connect Using Invalid Environment", async () => {
    await serverTreePO.disconnectAllServers();

    expect(await serverTreePO.connect(LOCALHOST_NAME, "p12_invalid", ADMIN_USER_DATA.username, ADMIN_USER_DATA.password))
      .to.not.throw();

    await delay();
    expect(await statusBarPO.isNeedSelectServer()).is.true;
  });

});
