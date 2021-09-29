// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  Workbench,
  Notification,
  TreeItem,
  ViewItemAction,
  InputBox,
  VSBrowser,
  StatusBar,
  By,
  QuickPickItem,
  WebElement,
} from "vscode-extension-tester";
import {
  delay,
  getNewServer,
  getServerTreeItem,
  IAddServerPage,
  openAdvplProject,
  statusBarWithText,
  takeQuickPickAction,
  waitNotification,
} from "../helper";

// Create a Mocha suite
describe.only("TOTVS: Server View Basic Operations", () => {
  let workbench: Workbench;
  let serverTreeItem: TreeItem;
  let pickBox: InputBox;
  let title: string = "";

  const LOCALHOST_NAME: string = "localhost";
  const LOCALHOST_ENVIRONMENT: string = "p12";

  before(async () => {
    workbench = new Workbench();

    await openAdvplProject("project2");
    await delay();

    serverTreeItem = await getServerTreeItem(LOCALHOST_NAME);
    await delay();
  });

  it("No Server Connected", async () => {
    expect(await statusBarWithText("Select server/environment")).not.null;
  });

  it("isSelected Node", async () => {
    await serverTreeItem.select();
    await delay(3000);

    const klass = await serverTreeItem.getAttribute("class");
    expect(klass.indexOf("selected")).greaterThan(-1);
    //expect(await view.isDisplayed()).to.be.true;
    //expect(await serverTreeItem.isSelected()).to.be.true;
  });

  it("Fire Connect Action", async () => {
    const action: ViewItemAction = await serverTreeItem.getActionButton(
      "Connect"
    );

    await action.click();
    await delay();
  });

  it("Input Environment", async () => {
    pickBox = new InputBox();
    await delay();

    title = await pickBox.getTitle();
    expect(title).is.equal("Connection (1/1)");

    let quickPicks: QuickPickItem[] = await pickBox.getQuickPicks();
    expect(quickPicks).is.not.empty;

    await pickBox.setText(LOCALHOST_ENVIRONMENT);
    await delay();
    await pickBox.confirm();
    await delay();
  });

  it("Input User", async () => {
    await pickBox.wait(3000);
    title = await pickBox.getTitle();
    expect(title).is.equal("Authentication (1/2)");

    await pickBox.setText("admin");
    await delay();
    await pickBox.confirm();
    await delay();

    await pickBox.wait();
    title = await pickBox.getTitle();
    expect(title).is.equal("Authentication (2/2)");

    await pickBox.setText("1234");
    await delay();
    await pickBox.confirm();
    await delay();
  });

  it("Localhost Server Connected", async () => {
    expect(await statusBarWithText(`${LOCALHOST_NAME} / ${LOCALHOST_ENVIRONMENT}`, 10000)).not.null;
  });

  it("Fire Disconnect Action", async () => {
    const action: ViewItemAction = await serverTreeItem.getActionButton(
      "Disconnect"
    );
    await delay();

    await action.click();
    await delay();
  });

  it("Localhost Server Disconnected", async () => {
    expect(await statusBarWithText("Select server/environment")).not.null;
  });

});
