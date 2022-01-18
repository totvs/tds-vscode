import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ActivityBar,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { ViewPageObject } from "./view-po";

export interface IFolderTree {
  parent: TreeItem;
  child: TreeItem[];
}

export class ExplorerPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("Explorer");
  }

  // async openView(): Promise<SideBarView> {
  //   return await (
  //     await new ActivityBar().getViewControl("Explorer")
  //   ).openView();
  // }

  async getResource(labels: string[]): Promise<TreeItem> {
    const treeItem: TreeItem = await super.getTreeItem(labels.join("/"));
    //await treeItem?.select();
    await delay();

    return treeItem;
  }

  async getFolder(labels: string[]): Promise<TreeItem> {
    return this.getResource(labels);
  }

  async getFolderTree(labels: string[]): Promise<IFolderTree> {
    const result: IFolderTree = {
      parent: await super.getTreeItem(labels.join("/")),
      child: await super.openTreeItem(labels.join("/")),
    };

    await delay();

    return result;
  }
}
