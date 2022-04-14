import { delay, fireContextMenuAction } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { TreeItem, Notification } from "vscode-extension-tester";
import { WorkbenchPageObject } from "./workbench-po";
import { expect } from "chai";

export class BuildPageObject extends AbstractPageObject {
  private workbenchPO: WorkbenchPageObject;

  constructor(workbenchPO: WorkbenchPageObject) {
    super();

    this.workbenchPO = workbenchPO;
  }

  async fireBuildFile(item: TreeItem) {
    await fireContextMenuAction(item, "Compile File/Folder");
  }

  //TODO: não esta sendo acionado, devido a necessidade do acionamento ALT
  async fireRebuildFile(item: TreeItem) {
    await this.workbenchPO.executeCommand(
      "totvs-developer-studio.rebuild.file"
    );
  }

  async askShowCompileResult(open: boolean): Promise<boolean> {
    const notification: Notification =
      await this.workbenchPO.waitAskShowCompileResult();

    expect(notification, "askShowCompileResult").not.is.undefined;

    if (open) {
      await notification.takeAction("Yes");
      await delay();
    } else {
      await notification.dismiss();
    }

    return open;
  }

  async compileProcess(resourceItem: TreeItem) {
    const outputPO = await this.workbenchPO.openOutputLs();
    await outputPO.clearConsole();

    const expandable: boolean = await resourceItem.isExpandable(); //é um folder
    await this.fireBuildFile(resourceItem);

    await this.workbenchPO.waitBuilding();

    if (expandable) {
      await this.askShowCompileResult(false);
    }
  }
}
