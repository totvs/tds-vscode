import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  delay,
  fillEnvironment,
  fillUserdata,
  openAdvplProject,
} from "../helper";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { APPSERVER_DATA, NO_ADMIN_USER_DATA } from "../scenario";
import { INVALID_USER_DATA, ADMIN_USER_DATA } from "../scenario";

describe("TOTVS: Credentials Users Connect", () => {
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject(await workbenchPO.openTotvsView());
    await delay();

    await serverTreePO.addNewServer(APPSERVER_DATA);

    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServerTreeItem(APPSERVER_DATA.serverName)
    );

    await delay();
  });

  it("Input No Admin User", async () => {
    await serverItemPO.select();
    await serverItemPO.fireConnectAction();
    await fillEnvironment(APPSERVER_DATA.environment);
    await fillUserdata(NO_ADMIN_USER_DATA);
    await workbenchPO.waitConnection();

    expect(await workbenchPO.isAuthenticationFailed()).to.be.true;

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.false;

    expect(await serverItemPO.isConnected()).is.false;
  });

  it("Input Invalid User", async () => {
    await serverItemPO.select();
    await serverItemPO.fireConnectAction();
    await fillEnvironment(APPSERVER_DATA.environment);
    await fillUserdata(INVALID_USER_DATA);
    await workbenchPO.waitConnection();

    expect(await workbenchPO.isAuthenticationFailed()).to.be.true;

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.false;

    expect(await serverItemPO.isConnected()).is.false;
  });

  it("Input Admin User", async () => {
    await serverItemPO.select();
    await serverItemPO.fireConnectAction();
    await fillEnvironment(APPSERVER_DATA.environment);
    await fillUserdata(ADMIN_USER_DATA);
    await workbenchPO.waitConnection();

    expect(await workbenchPO.isAuthenticationFailed()).is.false;

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).to.be.true;

    expect(await serverItemPO.isConnected()).to.be.true;
  });
});
