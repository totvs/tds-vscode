import path = require("path");
import {
  ActivityBar,
  SideBarView,
  ViewControl,
  VSBrowser,
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
  console.log(`openAdvplProject ${folder}`);

  return await VSBrowser.instance.openResources(folder);
}

export async function showSideBarTotvs(): Promise<SideBarView> {
  const activityBar: ActivityBar = new ActivityBar();
  const control: ViewControl = await activityBar.getViewControl("TOTVS");
  const sidebar: SideBarView = await control.openView();

  return sidebar;
}

export const delay = (duration: number = 2000) =>
  new Promise((res) => {
    setTimeout(res, duration);
  });
