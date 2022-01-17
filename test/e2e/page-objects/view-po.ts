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
        : await this.findNode(nodes[0], tree);

    return result;
  }

  async findNode(label: string, tree: DefaultTreeSection): Promise<TreeItem> {
    const nodes: TreeItem[] = await tree.getVisibleItems();

    for (const node of nodes) {
      const target: string = await node.getLabel();

      if (target == label) {
        if (await node.isExpandable() && !node.isExpanded()) {
          await node.expand();
          return await this.findNode(label, tree);
        };

        return node;
      }
    }

    return undefined;
  }

  async findChildNode(
    nodes: string[],
    tree: DefaultTreeSection
  ): Promise<TreeItem> {
    await tree.openItem(...nodes);
    const item = await tree.findItem(nodes[nodes.length - 1]);

    return item;
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
