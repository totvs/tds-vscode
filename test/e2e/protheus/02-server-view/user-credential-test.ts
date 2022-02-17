import { expect } from "chai";
import { describe, before, it } from "mocha";
import { openProject } from "../../helper";
import { OutputLsPageObject } from "../../page-objects/output-ls-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { APPSERVER_DATA, NO_ADMIN_USER_DATA } from "../../scenario";
import { INVALID_USER_DATA, ADMIN_USER_DATA } from "../../scenario";

describe("Credentials Users Connect", async () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;
  let outputPO: OutputLsPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    outputPO = await workbenchPO.openOutputLs();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);
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

    if (await serverItemPO.isServerLogix()) {
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

    if (await serverItemPO.isServerLogix()) {
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
    await outputPO.clearConsole();

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

    await outputPO.loginSequenceTest();
  });
});
