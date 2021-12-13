import {
  BottomBarPanel,
  ProblemsView,
  Workbench,
} from "vscode-extension-tester";

export class BottomBarPageObject {
  private workbench: Workbench;

  constructor(workbench: Workbench) {
    this.workbench = workbench;
  }

  get bottomBar(): BottomBarPanel {
    return this.workbench.getBottomBar();
  }

  async captureView(viewTitle: string): Promise<void> {
    await this.bottomBar.toggle(true);
    const view: ProblemsView = await this.bottomBar.openProblemsView();

    //   view.
    // // make sure the panel is open
    // await bottomBar.toggle(true);
  }
}
