import {
  SideBarView,
  TreeItem,
  ViewContent,
  DefaultTreeSection,
  ProblemsView,
  MarkerType,
  Marker,
} from "vscode-extension-tester";
import { delay } from "../helper";
import { ViewPageObject } from "./view-po";
import { WorkbenchPageObject } from "./workbench-po";

export class ProblemsPageObject {
  private _problemsView: ProblemsView;

  constructor(problemsView: ProblemsView) {
    this._problemsView = problemsView;
  }

  async getAllMarkers(
    markType: MarkerType = MarkerType.Any
  ): Promise<Marker[]> {
    const markers: Marker[] = await this._problemsView.getAllMarkers(markType);
    await delay(2000);

    return markers;
  }

  async getAllErrors(): Promise<Marker[]> {
    return await this.getAllMarkers(MarkerType.Error);
  }

  async getAllWarnings(): Promise<Marker[]> {
    return await this.getAllMarkers(MarkerType.Warning);
  }

  async getAllFile(): Promise<Marker[]> {
    return await this.getAllMarkers(MarkerType.File);
  }
}
