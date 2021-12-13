import { StatusBar, WebElement, Workbench } from "vscode-extension-tester";
import { delay } from "../helper";

export class StatusPageObject {
  private workbench: Workbench;

  constructor(workbench: Workbench) {
    this.workbench = workbench;
  }

  get statusBar(): StatusBar {
    return this.workbench.getStatusBar();
  }

  async statusBarWithText(
    targetText: string | RegExp,
    _wait: number = 1000
  ): Promise<WebElement> {
    const target: RegExp = new RegExp(targetText, "i");
    let steps: number = _wait / 500;
    let result: WebElement = null;

    while (result === null && steps > 0) {
      const statusItems: WebElement[] = await this.statusBar.getItems();
      await delay(500);

      statusItems.forEach(async (element) => {
        if (!result) {
          const text: string = await element.getText();
          if (target.exec(text)) {
            result = element;
          }
        }
      });

      steps--;
    }

    return result;
  }
}
