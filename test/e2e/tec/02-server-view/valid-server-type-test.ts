import { expect } from "chai";
import { describe, before, it } from "mocha";
import {
  delay,
  DEFAULT_DELAY,
  fillEnvironment,
  fillUserdata,
  openProject,
} from "../../helper";
import { ServerPageObject } from "../../page-objects/server-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, DELETE_DATA, APPSERVER_DATA } from "../../scenario";

describe("Validate server type and environments", async () => {
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await openProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);

    serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getServer(APPSERVER_DATA)
    );

    await delay(DEFAULT_DELAY);
  });

  it("Are Type and Icon Correct?", async () => {
    await serverItemPO.select();

    expect(serverItemPO.isServerTotvstec()).is.true;
  });

  it("Connect", async () => {
    await serverItemPO.connect(APPSERVER_DATA.serverName, ADMIN_USER_DATA);
    await workbenchPO.waitValidatingServer();
  });

  it("Server Connected", async () => {
    await workbenchPO.waitConnection();

    expect(
      await workbenchPO.isConnected(
        APPSERVER_DATA.serverName,
        APPSERVER_DATA.environment
      )
    ).is.true;

    expect(await serverItemPO.isConnected()).is.true;
  });

  it("Disconnected", async () => {
    await serverItemPO.fireDisconnectAction();

    expect(await workbenchPO.isNeedSelectServer()).is.true;
    expect(await serverItemPO.isNotConnected()).is.true;
  });
});
