import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ActivityBar,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { ViewPageObject } from "./view-po";

export class ExplorerPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("Explorer");
  }

  async getResource(path: string[]): Promise<TreeItem> {
    const treeItem: TreeItem = await super.getTreeItem(path);
    //await treeItem?.select();
    await delay();

    return treeItem;
  }

  async getFolder(path: string[]): Promise<TreeItem> {
    return await this.getResource(path);
  }
}
