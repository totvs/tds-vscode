// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it, after } from "mocha";
import {
  SideBarView,
  ViewContent,
  Notification,
} from "vscode-extension-tester";
import {
  delay,
  openAdvplProject,
  waitNotification,
} from "../helper";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { DELETE_DATA, LOCALHOST_DATA } from "../servers-data";

// Create a Mocha suite
describe("TOTVS: Server View", () => {
  let view: SideBarView;
  let serverTreePO: ServerTreePageObject;

  before(async () => {
    await openAdvplProject();
    await delay();

    serverTreePO = new ServerTreePageObject();
    view = await serverTreePO.openView();
  });

  after(async () => {
    //await serverTreePO.clearServers();
  })

  it("No Servers", async () => {
    const content: ViewContent = view.getContent();
    const text: string = await content.getText();

    expect(text).is.empty;
  });

  it("Add Local Server", async () => {
    await serverTreePO.addNewServer(LOCALHOST_DATA);

    const notification: Notification = await waitNotification("Saved server");
    expect(notification).not.is.undefined;
  });

  it("Remove Server", async () => {
    await serverTreePO.addNewServer(DELETE_DATA);

    await delay(3000);

    await serverTreePO.removeServer(DELETE_DATA.serverName);

    const notification: Notification = await waitNotification(
      "Tem certeza que deseja excluir este servidor"
    );

    expect(notification).not.is.undefined;

    await notification.takeAction("Sim");
    await delay();
  });
});
