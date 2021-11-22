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

  async setValue(elementId: string, value: string): Promise<void> {
    const element: WebElement = await this.findElement(elementId);
    await element.clear();
    await element.sendKeys(value);
  }

  async click(elementId: string): Promise<void> {
    const element: WebElement = await this.findElement(elementId);

    await element.click();
    await delay();
  }
}
