import path = require("path");
import fs = require("fs-extra");
import {
  By,
  VSBrowser,
  Workbench,
  Notification,
  InputBox,
  WebElement,
  ActivityBar,
  SideBarView,
  QuickPickItem,
  ContextMenu,
  ViewItem,
  ContextMenuItem,
  ViewControl,
} from "vscode-extension-tester";
import { ServerTreePageObject } from "./page-objects/server-tree-po";
import { expect } from "chai";
import { IUserData } from "./page-objects/interface-po";

const WAIT_NOTIFICATION_TIMEOUT = 2000;
const DEFAULT_DELAY = 1000;
const PROJECT_NAME = "project-advpl"
const advplProjectfolder: string = path.resolve(
  __dirname,
  "..",
  "..",
  "test",
  "resources"
);

export async function openAdvplProject(): Promise<void> {
  const projectFolder: string = path.join(advplProjectfolder, PROJECT_NAME);
  const serversJsonFile: string = path.join(projectFolder, ".vscode", "servers.json");

  if (fs.existsSync(serversJsonFile)) {
    fs.removeSync(serversJsonFile);
  }

  // const notifications = await new Workbench().openNotificationsCenter();
  // await delay();
  // await notifications.clearAllNotifications();
  // await delay();

  await VSBrowser.instance.openResources(projectFolder);
  await delay(5000);
}

export async function readServersJsonFile(): Promise<string> {
  const projectFolder: string = path.join(advplProjectfolder, PROJECT_NAME);
  const serversJsonFile: string = path.join(projectFolder, ".vscode", "servers.json");
  let result: string = "< file not found >";

  if (fs.existsSync(serversJsonFile)) {
    const buffer: Buffer = fs.readFileSync(serversJsonFile);
    result = buffer.toString();
  }

  return result;
}

export async function openServerTreeView(): Promise<ServerTreePageObject> {
  const activityBar = new ActivityBar();
  const control = await activityBar.getViewControl("TOTVS");
  const view: SideBarView = await control.openView();

  await delay();

  return new ServerTreePageObject();
}

export const delay = (duration: number = DEFAULT_DELAY) =>
  new Promise((res) => {
    setTimeout(res, duration);
  });

export const avoidsBacksliding = async () => { await delay(3000); };

export async function takeQuickPickAction(pickBox: InputBox, titleAction: string): Promise<boolean> {
  const actionContainer: WebElement = pickBox.findElement(By.className("actions-container"));
  const actionList: WebElement[] = await actionContainer.findElements(By.className("action-item"));
  const actions: WebElement[] = actionList.filter(async (action: WebElement) => {
    const link: WebElement = await action.findElement(By.css("a.action-label"));
    const title: string = (await link.getAttribute("title")).toLowerCase();
    return title === titleAction.toLowerCase();
  });

  if (actions.length == 1) {
    await actions[0].click();
    await delay();
    return true;
  }

  return false;
}

export async function waitNotification(
  containText: string
): Promise<Notification | undefined> {
  //const notifications = await new Workbench().openNotificationsCenter(); //@acandido verificar uso

  return await VSBrowser.instance.driver.wait(() => {
    return notificationExists(containText.toLowerCase());
  }, WAIT_NOTIFICATION_TIMEOUT);
}

async function notificationExists(
  text: string
): Promise<Notification | undefined> {
  const notifications = await new Workbench().getNotifications();
  for (const notification of notifications) {
    const message = (await notification.getMessage()).toLowerCase();
    if (message.indexOf(text) >= 0) {
      return notification;
    }
  }

  return undefined;
}

// export async function clearServers() {
//   const folder: string = path.resolve(advplProjectfolder);
//   const serversJsonFile: string = path.join(folder, "servers.json");

//   await fs.remove(serversJsonFile);
// }

export async function fillEnvironment(environment: string) {
  console.error("fillEnvironment.1");
  const pickBox = new InputBox();
  await pickBox.wait(3000);
  console.error("fillEnvironment.2");
  await delay();

  let title = await pickBox.getTitle();
  console.error("fillEnvironment.2a");
  expect(title).is.equal("Connection (1/1)");
  console.error("fillEnvironment.3");

  let quickPicks: QuickPickItem[] = await pickBox.getQuickPicks();
  const find: boolean = quickPicks.filter(async (element: QuickPickItem) => {
    return await element.getText() == environment;
  }).length > 0;

  if (!find) {
    expect(await takeQuickPickAction(pickBox, "action")).is.true;
    title = await pickBox.getMessage();
    expect(title.startsWith("Enter the name of the environment")).is.true;
    await delay();
  }

  await pickBox.setText(environment);
  await delay();

  await pickBox.confirm();
  await delay();
}

export async function fillUserdata(userData: IUserData) {
  const pickBox = new InputBox();
  await delay();
  pickBox.wait();

  let title = await pickBox.getTitle();
  title = await pickBox.getTitle();
  expect(title).is.equal("Authentication (1/2)");

  await pickBox.setText(userData.username);
  await delay();
  await pickBox.confirm();
  await delay();

  await pickBox.wait();
  title = await pickBox.getTitle();
  expect(title).is.equal("Authentication (2/2)");

  await pickBox.setText(userData.password);
  await delay();
  await pickBox.confirm();
  await delay();
}

export async function fireContextMenuAction(element: ViewItem | ViewControl, name: string) {
  const menu: ContextMenu = await element.openContextMenu();
  await menu.wait(2000);

  const action: ContextMenuItem = await menu.getItem(name);
  await action.click();
  await delay();
}

