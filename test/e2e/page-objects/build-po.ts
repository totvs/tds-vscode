import { delay, fireContextMenuAction } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { TreeItem } from "vscode-extension-tester";

export class BuildPageObject extends AbstractPageObject {
  async fireBuildFile(item: TreeItem) {
    await item.select();
    await delay();
    await fireContextMenuAction(item, "totvs-developer-studio.build.file");
  }

  async fireRebuildFile(item: TreeItem) {
    await item.select();
    await delay();
    await fireContextMenuAction(item, "totvs-developer-studio.rebuild.file");
  }
}
