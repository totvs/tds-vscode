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
    let result: TreeItem[] | TreeItem;

    result =
      nodes.length > 1
        ? await this.openChild(nodes, tree)
        : await tree.findItem(nodes[0]);

    return Array.isArray(result) && result.length == 1
      ? (result[0] as TreeItem)
      : result;
  }

  async openChild(
    nodes: string[],
    tree: DefaultTreeSection
  ): Promise<TreeItem> {
    const treeItems: TreeItem[] = await tree.openItem(...nodes.slice(0, -1));
    const target: string = nodes[nodes.length - 1].toLocaleLowerCase();
    const treeItem: TreeItem = treeItems
      .filter(async (item: TreeItem) => {
        const label: string = await item.getLabel();
        return label.toLowerCase() === target;
      })
      .pop();

    return treeItem;
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
