import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { ViewPageObject } from "./view-po";

export class ExplorerPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("Explorer");
  }

  async getResource(labels: string[]): Promise<TreeItem> {
    const treeItem: TreeItem = await super.getTreeItem(labels.join("/"));
    await treeItem?.select();
    await delay();

    return treeItem;
  }
}
