import { BottomBarPanel, ProblemsView } from "vscode-extension-tester";
import { ProblemsPageObject } from "./problem-view-po";

export class BottomBarPageObject {
  private _bottomBar: BottomBarPanel;

  constructor() {
    this._bottomBar = new BottomBarPanel();
  }

  async openProblemsView(): Promise<ProblemsPageObject> {
    await this._bottomBar.toggle(true);
    const view: ProblemsView = await this._bottomBar.openProblemsView();
    const problemView: ProblemsPageObject = new ProblemsPageObject(view);

    return problemView;
  }
}
