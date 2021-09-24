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
  delay,
  IAddServerPage,
  openAdvplProject,
  waitNotification,
} from "../helper";

// Create a Mocha suite
describe("TOTVS: Server View Basic Operations", () => {
  let view: SideBarView;
  let workbench: Workbench;
  let serverTreeItem: TreeItem;

  const LOCALHOST_DATA: IAddServerPage = {
    serverName: "localhost",
    address: "localhost",
    port: 2030,
    includePath: ["m:\\protheus\\includes"],
  };

  before(async () => {
    await openAdvplProject();
    await delay();
    workbench = new Workbench();
    await addNewServer(LOCALHOST_DATA);

    const c = view.getContent();
    const s = await c.getSections();

    serverTreeItem = (await s[0].findItem(
      LOCALHOST_DATA.serverName
    )) as TreeItem;
    serverTreeItem.select();
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
