import { expect } from "chai";
import { before, describe, it } from "mocha";
import {
  avoidsBacksliding,
  delay,
  prepareProject,
  readServersJsonFile,
} from "../../helper";
import { ServerGroupItemPageObject } from "../../page-objects/server-group-item-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { APPSERVER_DATA } from "../../scenario";

const GROUPED_DATA = {
  ...APPSERVER_DATA,
  serverName: "forGroup",
  group: "ERP/REST",
};

const GROUP_CLEAR_DATA = {
  ...APPSERVER_DATA,
  serverName: "forGroupClear",
  group: "ERP/REST",
};

const MOVED_GROUP = "ERP/API";

describe("Server View Group Operations", async () => {
  let serverTreePO: ServerViewPageObject;
  let workbenchPO: WorkbenchPageObject;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await delay();
  });

  async function getServersConfig(): Promise<any> {
    return JSON.parse(await readServersJsonFile());
  }

  async function getServerConfigByName(serverName: string): Promise<any> {
    const servers = await getServersConfig();

    return servers.configurations.find((server) => server.name === serverName);
  }

  it("Add grouped server", async () => {
    await serverTreePO.addServer(GROUPED_DATA);
    await avoidsBacksliding();

    expect(
      await serverTreePO.getTreeItem(["ERP", "REST", GROUPED_DATA.serverName])
    ).not.is.undefined;

    const savedServer = await getServerConfigByName(GROUPED_DATA.serverName);

    expect(savedServer).not.is.undefined;
    expect(savedServer.group).to.equal(GROUPED_DATA.group);
  });

  it("Move server to root", async () => {
    const serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getTreeItem(["ERP", "REST", GROUPED_DATA.serverName])
    );

    await serverItemPO.fireMoveToRootAction();
    await avoidsBacksliding();

    expect(await serverTreePO.getTreeItem([GROUPED_DATA.serverName])).not.is
      .undefined;
    expect(
      await serverTreePO.getTreeItem(["ERP", "REST", GROUPED_DATA.serverName])
    ).is.undefined;

    const savedServer = await getServerConfigByName(GROUPED_DATA.serverName);

    expect(savedServer).not.is.undefined;
    expect(savedServer.group).is.undefined;
  });

  it("Move server to another group", async () => {
    const serverItemPO = new ServerTreeItemPageObject(
      await serverTreePO.getTreeItem([GROUPED_DATA.serverName])
    );

    await serverItemPO.fireMoveToGroupAction(MOVED_GROUP);
    await avoidsBacksliding();

    expect(
      await serverTreePO.getTreeItem(["ERP", "API", GROUPED_DATA.serverName])
    ).not.is.undefined;
    expect(await serverTreePO.getTreeItem([GROUPED_DATA.serverName])).is
      .undefined;

    const savedServer = await getServerConfigByName(GROUPED_DATA.serverName);

    expect(savedServer).not.is.undefined;
    expect(savedServer.group).to.equal(MOVED_GROUP);
  });

  it("Remove group", async () => {
    await serverTreePO.addServer(GROUP_CLEAR_DATA);
    await avoidsBacksliding();

    const groupPO = new ServerGroupItemPageObject(
      await serverTreePO.getTreeItem(["ERP"])
    );

    await groupPO.fireRemoveGroupAction();
    await avoidsBacksliding();

    expect(await serverTreePO.getTreeItem(["ERP"])).is.undefined;
    expect(await serverTreePO.getTreeItem([GROUP_CLEAR_DATA.serverName])).not.is
      .undefined;

    const savedServer = await getServerConfigByName(GROUP_CLEAR_DATA.serverName);

    expect(savedServer).not.is.undefined;
    expect(savedServer.group).is.undefined;
  });
});
