import path = require("path");
import {
  ActivityBar,
  By,
  SideBarView,
  ViewControl,
  VSBrowser,
  WebView,
  Workbench,
} from "vscode-extension-tester";

export async function openAdvplProject(): Promise<void> {
  const folder: string = path.resolve(
    __dirname,
    "..",
    "..",
    "test",
    "resources",
    "advpl"
  );

  return await VSBrowser.instance.openResources(folder);
}

export async function showSideBarTotvs(): Promise<SideBarView> {
  const activityBar: ActivityBar = new ActivityBar();
  const control: ViewControl = await activityBar.getViewControl("TOTVS");
  const sidebar: SideBarView = await control.openView();

  return sidebar;
}

export const delay = (duration: number = 1000) =>
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
  let element = await webView.findWebElement(By.id("serverTypeID"));
  //element.sendKeys(data.serverType);

  element = await webView.findWebElement(By.id("serverNameID"));
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
