import path = require("path");
import fs = require("fs-extra");
import {
  ActivityBar,
  By,
  SideBarView,
  ViewControl,
  VSBrowser,
  WebView,
  Workbench,
  Notification,
  TreeItem,
} from "vscode-extension-tester";

const WAIT_NOTIFICATION_TIMEOUT = 2000;
const DEFAULT_DELAY = 2000;
const advplProjectfolder: string = path.resolve(
  __dirname,
  "..",
  "..",
  "test",
  "resources",
  "advpl"
);

export async function openAdvplProject(): Promise<void> {
  const folder: string = path.resolve(advplProjectfolder);

  return await VSBrowser.instance.openResources(folder);
}

export async function getSideBarTotvs(): Promise<SideBarView> {
  const activityBar: ActivityBar = new ActivityBar();
  const control: ViewControl = await activityBar.getViewControl("TOTVS");
  const sidebar: SideBarView = await control.openView();

  return sidebar;
}

async function getServerTreeItem(serverName: string) {
  const view: SideBarView = await getSideBarTotvs();
  const c = view.getContent();
  const s = await c.getSections();

  const serverTreeItem = (await s[0].findItem(
    serverName
  )) as TreeItem;

  return serverTreeItem
}

export async function getNewServer(server: IAddServerPage) {
  let serverTreeItem = await getServerTreeItem(server.serverName);

  if (!serverTreeItem) {
    addNewServer(server);
    serverTreeItem = await getServerTreeItem(server.serverName);
  }

  return serverTreeItem;
}

export const delay = (duration: number = DEFAULT_DELAY) =>
  new Promise((res) => {
    setTimeout(res, duration);
  });

export interface IAddServerPage {
  serverName: string;
  address: string;
  port: number;
  includePath: string[];
}

export async function fillAddServerPage(
  webView: WebView,
  data: IAddServerPage,
  confirm: boolean = false
) {
  //let element = await webView.findWebElement(By.id("serverTypeID"));
  //element.sendKeys(data.serverType);

  let element = await webView.findWebElement(By.id("nameID"));
  element.sendKeys(data.serverName);

  element = await webView.findWebElement(By.id("addressID"));
  element.sendKeys(data.address);

  element = await webView.findWebElement(By.id("portID"));
  element.sendKeys(data.port);

  element = await webView.findWebElement(By.id("includePath"));
  element.sendKeys(data.includePath.join(";"));

  if (confirm) {
    element = await webView.findWebElement(By.id("submitIDClose"));
    element.click();
  }
}

export async function addNewServer(server: IAddServerPage) {
  await new Workbench().executeCommand("totvs-developer-studio.add");
  await delay();

  const webView: WebView = new WebView();
  await webView.switchToFrame();

  await fillAddServerPage(webView, server, true);

  await delay();

  await webView.switchBack();
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

export async function clearServers() {
  const folder: string = path.resolve(advplProjectfolder);
  const serversJsonFile: string = path.join(folder, "servers.json");

  await fs.remove(serversJsonFile);
}