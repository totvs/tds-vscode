// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  ActivityBar,
  SideBarView,
  ViewContent,
  Workbench,
  Notification,
  TreeItem,
  ViewItemAction,
} from "vscode-extension-tester";
import {
  addNewServer,
  clearServers,
  delay,
  getNewServer,
  IAddServerPage,
  openAdvplProject,
  waitNotification,
} from "../helper";

// Create a Mocha suite
describe("TOTVS: Server View Basic Operations", () => {
  let workbench: Workbench;
  let serverTreeItem: TreeItem;

  const LOCALHOST_DATA: IAddServerPage = {
    serverName: "localhost",
    address: "localhost",
    port: 2030,
    includePath: ["m:\\protheus\\includes"],
  };

  before(async () => {
    // await openAdvplProject();
    // await delay();

    //serverTreeItem = await getNewServer(LOCALHOST_DATA);
    await delay();
  });


  it("Connect", async () => {
    const action: ViewItemAction = await serverTreeItem.getActionButton(
      "Connect"
    );
    await action.click();
    await delay();

    const notification: Notification = await waitNotification(
      "Tem certeza que deseja excluir este servidor"
    );
    expect(notification).not.is.undefined;
  });
});
