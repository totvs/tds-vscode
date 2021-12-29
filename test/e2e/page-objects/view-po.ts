import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ViewSection,
  ViewItem,
  TitleActionButton,
  ViewTitlePart,
  ActivityBar,
  ViewControl,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { WorkbenchPageObject } from "./workbench-po";

export class ViewPageObject<T> {
  private _view: T | SideBarView;
  protected workbenchPO: WorkbenchPageObject;
  private viewName: string;

  protected constructor(name: string) {
    this.viewName = name.toLowerCase();
    this.workbenchPO = new WorkbenchPageObject();
    this.openView().then((value: T) => {
      this._view = value;
    });
  }

  get view(): T {
    return this._view as T;
  }

  async openView(): Promise<T> {
    const activityBar: ActivityBar = new ActivityBar();
    const controls: ViewControl[] = await activityBar.getViewControls();
    let result: T = null;

    for await (const control of controls) {
      const vc: ViewControl = control;
      const title: string = (await vc.getTitle()).toLowerCase();

      if (title.startsWith(this.viewName)) {
        result = (await vc.openView()) as unknown as T;
      }
    }

    this._view = result;

    await delay();

    return result;
  }

  async getTreeItem(
    name: string,
    sectionName?: string
  ): Promise<TreeItem | undefined> {
    const view: SideBarView = this.view as unknown as SideBarView;
    const content: ViewContent = view.getContent();
    let tree: DefaultTreeSection;

    if (sectionName) {
      tree = (await content.getSection(sectionName)) as DefaultTreeSection;
    } else {
      const sections = await content.getSections();
      tree = sections[0] as DefaultTreeSection;
    }

    const nodes: string[] = name.split("/");
    const result: TreeItem =
      nodes.length > 1
        ? await this.findChildNode(nodes, tree)
        : await tree.findItem(nodes[0]);

    return result;
  }

  async findChildNode(
    nodes: string[],
    tree: DefaultTreeSection
  ): Promise<TreeItem> {
    await tree.openItem(...nodes);
    const item = await tree.findItem(nodes[nodes.length - 1]);

    return item;
    //const labels = await Promise.all(treeItems.map((item) => item.getLabel()));
    //console.error(labels);
    //console.error(treeItems.length);

    //return treeItems.pop();
    //const target: string = nodes[nodes.length - 1].toLocaleLowerCase();
    // const treeItem: TreeItem = treeItems
    //   .filter(async (item: TreeItem) => {
    //     const label: string = await item.getLabel();
    //     return label.toLowerCase() === target;
    //   })
    //   .pop();
    //for await (const value of treeItems) {
    //  console.error(await value.getLabel());
    //}

    //return treeItems[0];
    // let result: TreeItem = undefined;
    // let aux: TreeItem = sourceItem;

    // let auxTreeItem: TreeItem = undefined;
    // while (nodes.length) {
    //   const target: string = nodes.shift().toLowerCase();

    //   for await (const treeItem of treeItems) {
    //     const label: string = (await treeItem.getLabel()).toLowerCase();

    //     if (label === target) {
    //       auxTreeItem = treeItem;
    //     }
    //   }

    //   if (auxTreeItem && await auxTreeItem.hasChildren()) {
    //     await auxTreeItem.select();
    //     await auxTreeItem.expand();
    //     treeItems = await auxTreeItem.getChildren();
    //     await auxTreeItem.select();
    //     auxTreeItem = undefined;
    //   } else {
    //     nodes = [];
    //   }
    // }

    // return auxTreeItem;
    //   const label: string = await aux.getLabel();

    //   if (label.toLowerCase() === nodes[0].toLowerCase()) {
    //     aux.expand();
    //     for await (const child of await aux.getChildren()) {
    //       result = await this.findChildNode(nodes.slice(1), child);
    //     }
    //   }
    // }
    //   if (label.toLowerCase() === nodes[0]) {
    //     nodes.splice(0, 1);
    //     if (result) {
    //       break;
    //     }
    //   }
    //}

    //return result;
  }

  async getAction(action: string): Promise<TitleActionButton> {
    const view: SideBarView = this.view as unknown as SideBarView;
    const titlePart: ViewTitlePart = view.getTitlePart();

    return await titlePart.getAction(action);
  }

  async getVisibleItems(): Promise<ViewItem[]> {
    const view: SideBarView = this.view as unknown as SideBarView;
    const content: ViewContent = view.getContent();
    const sections: ViewSection[] = await content.getSections();
    const elements: ViewItem[] = await sections[0].getVisibleItems();

    return elements;
  }
}
