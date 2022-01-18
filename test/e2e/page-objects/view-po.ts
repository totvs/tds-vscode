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
} from "vscode-extension-tester";
import { delay } from "../helper";
import { WorkbenchPageObject } from "./workbench-po";

export class ViewPageObject<T> {
  private _view: T;
  protected workbenchPO: WorkbenchPageObject;
  private viewName: string;

  protected constructor(name: string) {
    this.viewName = name;
    this.workbenchPO = new WorkbenchPageObject();
    this.openView().then((value: T) => {
      this._view = value;
    });
  }

  get view(): T {
    return this._view as T;
  }

  async openView(): Promise<T> {
    let result: T = (await (
      await new ActivityBar().getViewControl(this.viewName)
    )?.openView()) as unknown as T;

    this._view = result;

    // const title: string = await (this._view as unknown as SideBarView)
    //   .getTitlePart()
    //   .getTitle();
    // console.log("%%%%%%%%%%%%%%%%%%", title);

    return result;
    // const activityBar: ActivityBar = new ActivityBar();
    // const controls: ViewControl[] = await activityBar.getViewControls();
    // let result: T = null;

    // for await (const control of controls) {
    //   const vc: ViewControl = control;
    //   const title: string = await vc.getTitle();

    //   if (title.startsWith(this.viewName)) {
    //     result = (await vc.openView()) as unknown as T;
    //   }
    // }

    // this._view = result;

    // await delay(2000);

    // return result;
  }

  async openTreeItem(
    sectionName?: string,
    ...path: string[]
  ): Promise<TreeItem[]> {
    const view: SideBarView = this.view as unknown as SideBarView;
    const content: ViewContent = view.getContent();
    let tree: DefaultTreeSection;

    if (sectionName) {
      tree = (await content.getSection(sectionName)) as DefaultTreeSection;
    } else {
      const sections = await content.getSections();
      tree = sections[0] as DefaultTreeSection;
    }

    const result: TreeItem[] = await tree.openItem(...path);

    return result;
  }

  async getTreeItem(path: string[]): Promise<TreeItem | undefined> {
    const view: SideBarView = this.view as unknown as SideBarView;
    const content: ViewContent = view.getContent();
    let tree: DefaultTreeSection;

    // if (sectionName) {
    //   tree = (await content.getSection(sectionName)) as DefaultTreeSection;
    // } else {
    const sections = await content.getSections();
    tree = sections[0] as DefaultTreeSection;
    //    }

    const result: TreeItem =
      path.length > 1
        ? await this.findChildNode(tree, path)
        : await this.findNode(tree, path[0]);

    return result;
  }

  private async findNode(
    tree: DefaultTreeSection,
    label: string
  ): Promise<TreeItem> {
    const nodes: TreeItem[] = await tree.getVisibleItems();

    for (const node of nodes) {
      const target: string = await node.getLabel();

      if (target == label) {
        if ((await node.isExpandable()) && !node.isExpanded()) {
          await node.expand();
          return await this.findNode(tree, label);
        }

        return node;
      }
    }

    return undefined;
  }

  async findChildNode(
    tree: DefaultTreeSection,
    nodes: string[]
  ): Promise<TreeItem> {
    let items: TreeItem[] = await tree.openItem(...nodes.slice(0, -1));

    if (items.length == 0) {
      let node: TreeItem = await tree.findItem(nodes[0]);
      if (node) {
        let level: number = 1;
        let aux = undefined;
        while (level < nodes.length) {
          aux = await node.findChildItem(nodes[level]);
          if (aux) {
            node = aux;
          }
          level++;
        }
        if (aux) {
          return aux;
        }
      }
    }

    // for (const item of items) {
    //   console.log(
    //     "findChildNode.2",
    //     nodes[nodes.length - 1],
    //     await item.getLabel()
    //   );

    //   if ((await item.getLabel()) == nodes[nodes.length - 1]) {
    //     console.log("findChildNode.3");

    //     return item;
    //   }
    // }

    return undefined;
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
