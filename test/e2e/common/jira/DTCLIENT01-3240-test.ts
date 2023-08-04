import { expect } from "chai";
import { describe, before, it } from "mocha";
import { delay, prepareProject } from "../../helper";
import { FunctionsInspectorPageObject } from "../../page-objects/functions-inspector-po";
import { ObjectsInspectorPageObject } from "../../page-objects/objects-inspector-po";
import { ServerTreeItemPageObject } from "../../page-objects/server-tree-item-po";
import { ServerViewPageObject } from "../../page-objects/server-view-po";
import { WorkbenchPageObject } from "../../page-objects/workbench-po";
import { ADMIN_USER_DATA, APPSERVER_DATA } from "../../scenario";

// Inspetores lado a lado, uma das duas travas em carga
describe("DTCLIENT01-3240: Side-by-side inspectors, one of the two locks on load", async () => {
  let workbenchPO: WorkbenchPageObject;
  let serverTreePO: ServerViewPageObject;
  let serverItemPO: ServerTreeItemPageObject;
  let objectInspectorPO: ObjectsInspectorPageObject;
  let functionsInspectorPO: FunctionsInspectorPageObject;

  before(async () => {
    await prepareProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = await workbenchPO.openTotvsView();

    await serverTreePO.getServer(APPSERVER_DATA);
    serverItemPO = await serverTreePO.connect(
      APPSERVER_DATA.serverName,
      APPSERVER_DATA.environment,
      ADMIN_USER_DATA
    );
  });

  after(async () => {
    await serverItemPO.fireDisconnectAction();
    await delay();
  });

  it("Open 'Objects Inspector'", async () => {
    await serverItemPO.fireObjectsInspector();

    objectInspectorPO = new ObjectsInspectorPageObject();

    expect(await objectInspectorPO.isOpen()).is.true;
  });

  it("Open 'Functions Inspector'", async () => {
    await serverItemPO.fireFunctionsInspector();

    functionsInspectorPO = new FunctionsInspectorPageObject();

    expect(await functionsInspectorPO.isOpen()).is.true;
  });

  it("Put side-by-side");
});
