import { TreeItem } from "vscode-extension-tester";
import { delay, fireContextMenuAction } from "../helper";

export class ServerGroupItemPageObject {
  private groupTreeItem: TreeItem;

  constructor(groupTreeItem: TreeItem) {
    this.groupTreeItem = groupTreeItem;
  }

  async select() {
    await this.groupTreeItem.select();
    await delay();
  }

  async expand() {
    if (await this.groupTreeItem.isExpandable()) {
      await this.groupTreeItem.expand();
      await delay();
    }
  }

  async fireRemoveGroupAction(): Promise<void> {
    await this.select();
    await fireContextMenuAction(this.groupTreeItem, "Remove group");
  }
}
