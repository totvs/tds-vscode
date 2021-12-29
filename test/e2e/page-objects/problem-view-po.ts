import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ProblemsView,
} from "vscode-extension-tester";
import { ViewPageObject } from "./view-po";
import { WorkbenchPageObject } from "./workbench-po";

export class ProblemPageObject {
  private _problemsView: ProblemsView;

  constructor(problemsView: ProblemsView) {
    this._problemsView = problemsView;
  }

  // async openPanel(): Promise<void> {
  //   this._problemsView;
  //}
}
