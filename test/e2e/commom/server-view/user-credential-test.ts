import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, openProject } from "../../helper";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { APPSERVER_DATA, NO_ADMIN_USER_DATA } from "../../scenario";
import { INVALID_USER_DATA, ADMIN_USER_DATA } from "../../scenario";

describe("TOTVS: Credentials Users Connect", () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerViewPageObject();
    await delay();

    await serverTreePO.addNewServer(APPSERVER_DATA);
  });

  afterEach(async () => {
    if (await serverItemPO.isConnected()) {
      await serverItemPO.fireDisconnectAction();
    }
  });

  it("Input No Admin User", async () => {
    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      NO_ADMIN_USER_DATA,
      false
    );

    if (await serverItemPO.isLogix()) {
      expect(
        await workbenchPO.isConnected(
          APPSERVER_DATA.serverName,
          APPSERVER_DATA.environment
        )
      ).is.true;
      expect(await serverItemPO.isConnected()).is.true;
    } else {
      expect(await workbenchPO.isAuthenticationFailed()).is.true;
      expect(await workbenchPO.isAcessDenied()).is.true;
      expect(
        await workbenchPO.isConnected(
          APPSERVER_DATA.serverName,
          APPSERVER_DATA.environment
        )
      ).is.false;
      expect(await serverItemPO.isConnected()).is.false;
    }
  });

  it("Input Invalid User", async () => {
    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      INVALID_USER_DATA,
      false
    );

    if (await serverItemPO.isLogix()) {
      expect(
        await workbenchPO.isConnected(
          APPSERVER_DATA.serverName,
          APPSERVER_DATA.environment
        )
      ).is.true;
      expect(await serverItemPO.isConnected()).is.true;
    } else {
      expect(await workbenchPO.isAuthenticationFailed()).is.true;
      expect(await workbenchPO.isInvalidUser()).is.true;
      expect(
        await workbenchPO.isConnected(
          APPSERVER_DATA.serverName,
          APPSERVER_DATA.environment
        )
      ).is.false;
      expect(await serverItemPO.isConnected()).is.false;
    }
  });

  it("Input Admin User", async () => {
    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA,
      false
    );

    expect(await workbenchPO.isAuthenticationFailed()).is.false;

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.true;

    expect(await serverItemPO.isConnected()).is.true;
  });
});
