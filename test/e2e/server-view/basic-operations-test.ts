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
} from "vscode-extension-tester";
import {
  delay,
  getNewServer,
  getServerTreeItem,
  IAddServerPage,
  openAdvplProject,
  takeQuickPickAction,
  waitNotification,
} from "../helper";

// Create a Mocha suite
describe.only("TOTVS: Server View Basic Operations", () => {
  let workbench: Workbench;
  let serverTreeItem: TreeItem;

  const LOCALHOST_NAME: string = "localhost";

  before(async () => {
    workbench = new Workbench();

    await openAdvplProject("project2");
    await delay();

    serverTreeItem = await getServerTreeItem(LOCALHOST_NAME);
    await delay();
  });

  it("Any server/connected", async () => {
    const statusBar: StatusBar = await workbench.getStatusBar();
  });

  it("isSelected", async () => {
    await serverTreeItem.select();
    await delay(3000);

    const klass = await serverTreeItem.getAttribute("class");
    expect(klass.indexOf("selected")).greaterThan(-1);
    //expect(await view.isDisplayed()).to.be.true;
    expect(await serverTreeItem.isSelected()).to.be.true;
  });

  it("Connect", async () => {
    const action: ViewItemAction = await serverTreeItem.getActionButton(
      "Connect"
    );

    await action.click();
    await delay();

    const pickBox: InputBox = new InputBox();

    let title: string = await pickBox.getTitle();
    expect(title).is.equal("Connection (1/1)");

    //await takeQuickPickAction(pickBox, "+");

    let quickPicks: QuickPickItem[] = await pickBox.getQuickPicks();
    expect(quickPicks).is.empty;

    await pickBox.setText("p12");
    await delay(4000);
    await pickBox.confirm();
    await delay(1000);

    title = await pickBox.getTitle();
    expect(title).is.equal("Authentication (1/2)");

  });
});
