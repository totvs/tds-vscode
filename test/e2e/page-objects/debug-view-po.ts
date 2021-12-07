import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  DebugView,
} from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";

export class DebugPageObject extends ViewPageObject<DebugView> {
  constructor() {
    super("Run");
  }

  async start(): Promise<void> {
    await this.view.start();
  }

  async selectLaunchConfiguration(name: string): Promise<void> {
    return await this.view.selectLaunchConfiguration(name);
  }
}
