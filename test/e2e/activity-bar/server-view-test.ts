// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it, after } from "mocha";
import {
  SideBarView,
  ViewContent,
  Notification,
} from "vscode-extension-tester";
import {
  avoidsBacksliding,
  openAdvplProject
} from "../helper";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { DELETE_DATA, LOCALHOST_DATA } from "../servers-data";

describe("TOTVS: Server View", () => {
  let view: SideBarView;
  let serverTreePO: ServerTreePageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject();
    view = await serverTreePO.openView();
  });

  after(async () => {
  })

  it("No Servers", async () => {
    const content: ViewContent = view.getContent();
    const text: string = await content.getText();

    expect(text).is.empty;
  });

  it("Add Local Server", async () => {
    await serverTreePO.addNewServer(LOCALHOST_DATA);

    const notification: Notification = await workbenchPO.waitNotification("Saved server");
    expect(notification).not.is.undefined;
  });

  it("Remove Server", async () => {
    await avoidsBacksliding();
    await serverTreePO.addNewServer(DELETE_DATA);

    await serverTreePO.removeServer(DELETE_DATA.serverName);

    expect(await serverTreePO.getServerTreeItem(DELETE_DATA.serverName)).is.undefined;

  });
});
