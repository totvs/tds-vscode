// import the webdriver and the high level browser wrapper
import { expect } from "chai";
import { describe, before, it } from "mocha";
import { Notification } from "vscode-extension-tester";
import { delay, openAdvplProject } from "../helper";
import { FunctionsInspectorPageObject } from "../page-objects/functions-inspector-po";
import { ObjectsInspectorPageObject } from "../page-objects/objects-inspector-po";
import { RepositoryLogPageObject } from "../page-objects/repository-log-po";
import { ServerTreeItemPageObject } from "../page-objects/server-tree-item-po";
import { ServerTreePageObject } from "../page-objects/server-tree-po";
import { WorkbenchPageObject } from "../page-objects/workbench-po";
import { ADMIN_USER_DATA, LOCALHOST_DATA } from "../servers-data";

// Create a Mocha suite
describe.only("RPO Operations", () => {
  let workbenchPO: WorkbenchPageObject;
  let serverTreePO: ServerTreePageObject;
  let serverItemPO: ServerTreeItemPageObject;

  const LOCALHOST_NAME: string = LOCALHOST_DATA.serverName;
  const LOCALHOST_ENVIRONMENT: string = LOCALHOST_DATA.environment;

  before(async () => {
    await openAdvplProject();

    workbenchPO = new WorkbenchPageObject();
    serverTreePO = new ServerTreePageObject();
    serverTreePO.openView();

    await serverTreePO.addNewServer(LOCALHOST_DATA);

    await delay();
  });

  beforeEach(async () => {
    await delay();

    serverItemPO = await serverTreePO.connect(
      LOCALHOST_NAME,
      LOCALHOST_ENVIRONMENT,
      ADMIN_USER_DATA
    );

  });

  afterEach(async () => {
    await delay();
    await serverItemPO.fireDisconnectAction();
  });

  it("Check Integrity", async () => {
    await serverItemPO.fireCheckIntegrity();

    await workbenchPO.waitCheckIntegrity();
    await delay();

    const notification: Notification = await workbenchPO.waitNotification(
      "RPO intact."
    );

    expect(notification).not.is.undefined;
  });

  it("Revalidate", async () => {
    await serverItemPO.fireRevalidate();

    await workbenchPO.waitRevalidate();
    await delay();

    // const notification: Notification = await workbenchPO.waitNotification(
    //   "RPO could not be revalidated."
    // );

        const notification: Notification = await workbenchPO.waitNotification(
          "End build aborted"
        );

    expect(notification).not.is.undefined;
  });

  it("Repository Log", async () => {
    // testa apenas a abertura do diálogo
    await serverItemPO.fireRepositoryLog();

    const repositoryLogPO: RepositoryLogPageObject = new RepositoryLogPageObject();

    expect(await repositoryLogPO.isOpen()).is.true;

    await repositoryLogPO.close();
  });

  it("Objects Inspector", async () => {
    // testa apenas a abertura do diálogo
    await serverItemPO.fireObjectsInspector();

    const objectInspectorPO: ObjectsInspectorPageObject =
      new ObjectsInspectorPageObject();

    expect(await objectInspectorPO.isOpen()).is.true;

    await objectInspectorPO.close();
  });

  it.only("Functions Inspector", async () => {
    // testa apenas a abertura do diálogo
    await serverItemPO.fireFunctionsInspector();

    const functionsInspectorPO: FunctionsInspectorPageObject =
      new FunctionsInspectorPageObject();

    expect(await functionsInspectorPO.isOpen()).is.true;

    await functionsInspectorPO.close();
  });
});
