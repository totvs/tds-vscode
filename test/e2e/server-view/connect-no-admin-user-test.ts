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

describe.only("TOTVS: Server View Authentication Users", () => {
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
  });

  it("Input Environment", async () => {
    await fillEnvironment(APPSERVER_DATA.environment);
  });

  it("Input No Admin User", async () => {
    await fillUserdata(NO_ADMIN_USER_DATA);
    await workbenchPO.waitConnection();

    await delay();

    expect(
      await workbenchPO.isAuthenticationFailed()
    ).is.true;
  });

  it("Localhost Server Not Connected", async () => {
    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.false;

    expect(await serverItemPO.isConnected()).is.false;
  });

});
