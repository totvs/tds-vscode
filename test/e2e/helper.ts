import path = require("path");
import fs = require("fs-extra");
import {
  By,
  VSBrowser,
  Workbench,
  Notification,
  InputBox,
  WebElement,
} from "vscode-extension-tester";

const WAIT_NOTIFICATION_TIMEOUT = 2000;
const DEFAULT_DELAY = 2;
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

  return await VSBrowser.instance.openResources(folder);
}

export const delay = (seconds: number = DEFAULT_DELAY) =>
  new Promise((res) => {
    setTimeout(res, seconds * 1000);
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

export async function takeQuickPickAction(quickPick: InputBox, target: string): Promise<boolean> {
  const actionList: WebElement[] = await quickPickActions(quickPick);

  await actionList.forEach(async (action: WebElement) => {
    const label: WebElement = await action.findElement(By.className("action-label"));
    const text: string = await label.getText();
    if (text === target) {
      action.click();
      await delay();
      return true;
    }
  });

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


