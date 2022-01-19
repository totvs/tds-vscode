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
    const sections = await content.getSections();
    const tree: DefaultTreeSection = sections[0] as DefaultTreeSection;

    const result: TreeItem = await this.findNode(tree, path);

    return result;
  }

  async countChild(path: string[]): Promise<number> {
    const view: SideBarView = this.view as unknown as SideBarView;
    const content: ViewContent = view.getContent();
    const sections = await content.getSections();
    const tree: DefaultTreeSection = sections[0] as DefaultTreeSection;
    let result: number = 0;

    if (path.length == 0) {
      result = (await tree.getVisibleItems()).length;
    } //if (path.length == 1) {
    else result = (await tree.openItem(...path)).length;
    // } else {
    //   result = (await tree.openItem(...path.slice(0, -1))).length;
    // }

    return result;
  }

  private async findNode(
    tree: DefaultTreeSection,
    path: string[]
  ): Promise<TreeItem> {
    if (path.length == 1) {
      return await tree.findItem(path[0]);
    }

    const target: string[] = path.slice(0, -1);
    const nodes: TreeItem[]  = await tree.openItem(...target);
    const nodes2 :TreeItem[] =  await tree.openItem(...path);
    const labels2 = await Promise.all(nodes.map((item) => item.getLabel()));
    const labels3 = await Promise.all(nodes2.map((item) => item.getLabel()));
    console.log(">>>>>> ", target, path, labels2, labels3);

    for (const node of nodes) {
      const target: string = await node.getLabel();

      if (target == path[path.length - 1]) {
        return node;
      }
    }

    return undefined;
  }

  async findChildNode(
    tree: DefaultTreeSection,
    nodes: string[]
  ): Promise<TreeItem> {
    let node: TreeItem = await tree.findItem(nodes[0]);
    let aux = undefined;

    if (node) {
      let level: number = 1;
      do {
        //await node.expand();
        const children = await node.getChildren();
        for await (const child of children) {
          if ((await child.getLabel()) == node[level]) {
            aux = child;
            node = aux;
          }
        }
        level++;
      } while (level < nodes.length);
    }

    return aux;
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
