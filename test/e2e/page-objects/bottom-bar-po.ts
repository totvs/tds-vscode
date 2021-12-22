import {
  BottomBarPanel,
  ProblemsView,
  Workbench,
} from "vscode-extension-tester";
import { ProblemPageObject } from "./problem-view-po";

export class BottomBarPageObject {
  private _bottomBar: BottomBarPanel;

  constructor() {
    this._bottomBar = new BottomBarPanel();
  }

  async openProblemsView(): Promise<ProblemPageObject> {
    await this._bottomBar.toggle(true);
    const view: ProblemsView = await this._bottomBar.openProblemsView();
    const problemView: ProblemPageObject = new ProblemPageObject(view);

    return problemView;
  }
}
