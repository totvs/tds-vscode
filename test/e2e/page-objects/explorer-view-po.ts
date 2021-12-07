import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
} from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";

export class ExplorerPageObject extends ViewPageObject<SideBarView> {
  constructor() {
    super("Explorer");
  }

  // const tree: DefaultTreeSection = (await content.getSection(
  //   "test"
  // )) as DefaultTreeSection;
  // const serverTreeItem = (await s[0].findItem(name)) as TreeItem;
  // return serverTreeItem;
}
