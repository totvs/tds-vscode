import { By, WebElement, WebView } from "vscode-extension-tester";
import { delay } from "../helper";

export class AbstractPageObject {
  private _webView: WebView;

  public get webView(): WebView {
    return this._webView;
  }

  async beginWebView(): Promise<void> {
    this._webView = new WebView();

    await this.webView.wait();
    await this.webView.switchToFrame();
    await delay(2000);
  }

  async endWebView(): Promise<void> {
    this.webView.switchBack();
    await delay(2000);

    this._webView = null;
  }

  async findElement(id: string) {
    return await this.webView.findWebElement(By.id(id));
  }

  async getValue(elementId: string): Promise<string> {
    const element: WebElement = await this.findElement(elementId);

    return (await element.getAttribute("value")) || (await element.getText());
  }

  async isValue(elementId: string): Promise<boolean> {
    const element: WebElement = await this.findElement(elementId);

    return await element.isSelected();
  }

  async setValue(
    elementId: string,
    value: string | boolean | number
  ): Promise<void> {
    const element: WebElement = await this.findElement(elementId);
    const tagName: string = await element.getTagName();

    if (tagName == "select") {
      await this.setOption(elementId, value as string | number);
    } else if (typeof value == "string") {
      await element.clear();
      await element.sendKeys(value);
    } else if (typeof value == "number") {
      await element.clear();
      await element.sendKeys(String(value));
    } else {
      await element.click();
      const check: boolean = await element.isSelected();
      if (check != value) {
        await element.click();
      }
    }
  }

  async setOption(id: string, target: string | number) {
    const options = await this.getOptions(id);

    for (let i = 0; i < options.length; i++) {
      if ((await options[i].getAttribute("class")).indexOf("disabled") < 0) {
        const label: string = await options[i].getText();
        const value: string = await options[i].getAttribute("value");

        if (label == target || value == target) {
          await options[i].click();
          await delay(500);
        }
      }
    }

    // const element: WebElement = await this.findElement(id);
    // await element.click();

    // if (typeof target == "string") {
    //   for await (const option of await element.findElements(By.css("option"))) {
    //     const label: string = await option.getText();
    //     const value: string = await option.getAttribute("value");

    //     if (label == target || value == target) {
    //       await option.click();
    //       await delay(3000);
    //     }
    //   }
    // } else {
    //   const options: WebElement[] = await element.findElements(
    //     By.css("option")
    //   );
    //   await options[target].click();
    // }

    // await delay(3000);
  }

  private async getOptions(id: string): Promise<WebElement[]> {
    const combo = await this.findElement(id);

    return await combo.findElements(By.css("option"));
  }

  async click(elementId: string): Promise<void> {
    const element: WebElement = await this.findElement(elementId);

    await element.click();
    await delay();
  }
}
