import { BottomBarPanel, ProblemsView } from "vscode-extension-tester";

export class BottomBarPageObject {
  private _bottomBar: BottomBarPanel;

  public get bottomBar(): any {
    if (!this._bottomBar) {
      this._bottomBar = new BottomBarPanel();
    }

    return this._bottomBar;
  }

  async captureView(viewTitle: string): Promise<void> {
    await this._bottomBar.toggle(true);
    const view: ProblemsView = await this.bottomBar.openProblemsView();

    //   view.
    // // make sure the panel is open
    // await bottomBar.toggle(true);
  }
}
