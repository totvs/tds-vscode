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
} from "vscode-extension-tester";
import { ServerTreePageObject } from "./page-objects/server-tree-po";

const WAIT_NOTIFICATION_TIMEOUT = 2000;
const DEFAULT_DELAY = 1000;
const advplProjectfolder: string = path.resolve(
  __dirname,
  "..",
  "..",
  "test",
  "resources",
  "advpl"
);

export async function openAdvplProject(projectName: string): Promise<void> {
  const folder: string = path.join(path.resolve(advplProjectfolder), projectName);

  await VSBrowser.instance.openResources(folder);
  await delay();
}

export async function openServerTreeView(): Promise<ServerTreePageObject> {
  const activityBar = new ActivityBar();
  const control = await activityBar.getViewControl("TOTVS");

  const view: SideBarView = await control.openView();
  await delay();

  return undefined; //new ServerTreePageObject(view);
}

export const delay = (duration: number = DEFAULT_DELAY) =>
  new Promise((res) => {
    setTimeout(res, duration);
  });

export async function quickPickActions(quickPick: InputBox): Promise<WebElement[]> {
  const titleBar = await quickPick.findElements(By.className("quick-input-titlebar"));
  let result: WebElement[] = [];

  if (titleBar.length > 0 && await titleBar[0].isDisplayed()) {
    const buttons = await titleBar[0].findElements(By.className("action-item"));
    result = buttons.filter(async (button: WebElement) => {
      return await button.isEnabled();
    })
  }

  return result;
}

export async function takeQuickPickAction(pickBox: InputBox, titleAction: string): Promise<boolean> {
  // <ul class="" role = "toolbar" >
  //   <li class="action-item" role = "presentation" >
  //     <a class="action-label codicon quick-input-button-icon-1" role = "button"
  //        title = "New environment" tabindex = "0" >
  //     </a>
  //   </li >
  //  </ul >
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


