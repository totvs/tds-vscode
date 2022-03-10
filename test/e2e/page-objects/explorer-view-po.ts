import { SideBarView, TreeItem } from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";

export class ExplorerPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("Explorer");
  }

  async getResource(path: string[]): Promise<TreeItem> {
    return await super.getTreeItem(path);
  }

  async getFolder(path: string[]): Promise<TreeItem> {
    return await this.getResource(path);
  }
}
