import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ViewSection,
  ViewItem,
  TitleActionButton,
  ViewTitlePart,
} from "vscode-extension-tester";
import { WorkbenchPageObject } from "./workbench-po";

export class ViewPageObject {
  protected view: SideBarView;
  protected workbenchPO: WorkbenchPageObject;

  constructor(view: SideBarView) {
    this.view = view;
    this.workbenchPO = new WorkbenchPageObject();
  }

  async getTreeItem(name: string, sectionName?: string): Promise<TreeItem> {
    const content: ViewContent = this.view.getContent();
    let tree: DefaultTreeSection;

    if (sectionName) {
      tree = (await content.getSection(sectionName)) as DefaultTreeSection;
    } else {
      tree = (await content.getSections()[0]) as DefaultTreeSection;
    }

    return (await tree.findItem(name)) as TreeItem;
  }

  async getAction(action: string): Promise<TitleActionButton> {
    const titlePart: ViewTitlePart = this.view.getTitlePart();
    return await titlePart.getAction(action);
  }

  async getVisibleItems(): Promise<ViewItem[]> {
    const content: ViewContent = this.view.getContent();
    const sections: ViewSection[] = await content.getSections();
    const elements: ViewItem[] = await sections[0].getVisibleItems();

    return elements;
  }
}
