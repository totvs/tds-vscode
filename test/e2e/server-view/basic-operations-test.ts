import { expect } from "chai";
import { describe, before, it } from "mocha";
import { Notification, WebView } from "vscode-extension-tester";
import {
  delay,
  fillEnvironment,
  fillUserdata,
  openAdvplProject,
} from "../helper";
import { ServerPageObject } from "../page-objects/server-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../page-objects/server-view-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, DELETE_DATA, APPSERVER_DATA } from "../scenario";

describe("TOTVS: Server View Basic Operations", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();
    await delay();

    await serverTreePO.addNewServer(APPSERVER_DATA);

    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(APPSERVER_DATA.serverName)
    );

    await delay(2000);
  });

  it("No Server Connected", async () => {
    expect(await workbenchPO.isNeedSelectServer()).is.true;
  });

  it("isSelected Node", async () => {
    await serverItemPO.select();

    expect(await serverItemPO.isSelected()).is.true;
  });

  it("Fire Connect Action", async () => {
    await serverItemPO.fireConnectAction();
    await workbenchPO.waitValidatingServer();
  });

  it("Input Environment", async () => {
    await fillEnvironment(APPSERVER_DATA.environment);
  });

  it("Input User", async () => {
    await fillUserdata(ADMIN_USER_DATA);
  });

  it("Localhost Server Connected", async () => {
    await workbenchPO.waitConnection();

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.true;
    expect(await serverItemPO.isConnected()).is.true;
  });

  it("Localhost Server Disconnected", async () => {
    await serverItemPO.select();
    await serverItemPO.fireDisconnectAction();

    expect(await workbenchPO.isNeedSelectServer()).is.true;
    expect(await serverItemPO.isNotConnected()).is.true;
  });

  it.skip("Try Connect Using Invalid Environment", async () => {
    await serverTreePO.disconnectAllServers();

    expect(
      await serverTreePO.connect(
        APPSERVER_DATA.serverName,
        "p12_invalid",
        ADMIN_USER_DATA
      )
    ).to.not.throw();

    await delay();
    expect(await workbenchPO.isNeedSelectServer()).is.true;
  });

  it("Add server (context menu)", async () => {
    await serverItemPO.fireAddServerAction();

    const webView: WebView = new WebView();
    await webView.switchToFrame();

    const serverPO = new ServerPageObject();
    await serverPO.fillAddServerPage(webView, DELETE_DATA, true);

    await webView.switchBack();
    await delay();

    expect(await workbenchPO.isSaveServer()).is.true;
  });

  it.skip("Reconnect", async () => {
    await serverTreePO.disconnectAllServers();

    await serverItemPO.fireReconnectAction(); // esta solicitando usuário e senha
    await fillEnvironment(APPSERVER_DATA.environment);
    await workbenchPO.waitReconnection();

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.true;
    expect(await serverItemPO.isConnected()).is.true;
  });
});
