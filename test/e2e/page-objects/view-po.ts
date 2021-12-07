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
  ): Promise<TreeItem | null> {
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

    result = await (nodes.length > 1
      ? this.openChild(nodes, tree)
      : tree.findItem(nodes[0]));
    //result = await tree.openItem(...nodes);
    // for (const node of nodes) {
    //   aux = await (aux ? aux.findChildItem(node) : tree.findItem(node));

    //   if (aux) {
    //     result = aux;
    //     nodes.length > 1 ? await result.expand() : null;
    //   } else {
    //     result = null;
    //     break;
    //   }
    // }

    return Array.isArray(result)
      ? (result[0] as TreeItem)
      : result == undefined
      ? null
      : result;
  }

  async openChild(
    nodes: string[],
    tree: DefaultTreeSection
  ): Promise<TreeItem> {
    let treeItem: TreeItem[] = await tree.openItem(...nodes);
    // await parentItem.expand();
    //  await parentItem.findChildItem(nodes[0]);

    // while (treeItem) {
    //   parentItem = treeItem;
    //   nodes = nodes.splice(0, 1);
    //   treeItem = await parentItem.findChildItem(nodes[0]);
    //   await treeItem?.expand();
    // }

    return treeItem[0];
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
