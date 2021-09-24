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
describe("TOTVS: Server View", () => {
  let view: SideBarView;
  let workbench: Workbench;

  const LOCALHOST_DATA: IAddServerPage = {
    serverName: "localhost",
    address: "localhost",
    port: 2030,
    includePath: ["m:\\protheus\\includes"],
  };

  const DELETE_DATA: IAddServerPage = {
    serverName: "forDelete",
    address: "127.0.0.1",
    port: 2030,
    includePath: ["m:\\protheus\\includes"],
  };

  before(async () => {
    await openAdvplProject();
    await delay();
    workbench = new Workbench();

    const activityBar = new ActivityBar();
    const control = await activityBar.getViewControl("TOTVS");

    view = await control.openView();
    await delay();
  });

  it("No Servers", async () => {
    const content: ViewContent = view.getContent();
    const text: string = await content.getText();

    expect(text).is.empty;
  });

  it("Add Local Server", async () => {
    await addNewServer(LOCALHOST_DATA);

    const notification: Notification = await waitNotification("Saved server");
    expect(notification).not.is.undefined;
  });

  it.only("Remove Server", async () => {
    await addNewServer(DELETE_DATA);

    const c = view.getContent();
    const s = await c.getSections();
    const i2 = await s[0].getVisibleItems();

    const i: TreeItem = (await s[0].findItem(
      DELETE_DATA.serverName
    )) as TreeItem;
    await i.select();

    const action: ViewItemAction = await i.getActionButton("Delete Server");
    await action.click();
    await delay();

    // const notification: Notification = await waitNotification(
    //   "Tem certeza que deseja excluir este servidor"
    // );
    // expect(notification).not.is.undefined;

    // const actions = await notification.getActions();
    // for (const action in actions) {
    //   if (action.toLowerCase() === "sim") {
    //     actions[action].click();
    //   }
    // }

    await delay(3000);
  });
});
