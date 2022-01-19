import { delay } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { By, Key, WebElement } from "vscode-extension-tester";

export class PatchGeneratePageObject extends AbstractPageObject {
  async applyFilterInput(filter: string): Promise<boolean> {
    await this.beginWebView();
    await this.setValue("FilterInput", `${filter}${Key.TAB}`); //força saida do campo
    await delay();

    const result: string = await this.getValue("SelectL");
    await this.endWebView();

    return result.length > 0;
  }

  async selectLeftOption(...elements: string[]): Promise<void> {
    await this.beginWebView();

    const selectLeft: WebElement = await this.findElement("SelectL");
    const options: WebElement[] = await selectLeft.findElements(
      By.css("option")
    );

    options.filter(async (option: WebElement) => {
      const text: string = await option.getText();

      if (elements.includes(text)) {
        await option.click();
      }
    });

    const button: WebElement = await this.findElement("loadRight");
    button.click();

    await this.endWebView();
  }

  async getLeftOption(): Promise<string[]> {
    await this.beginWebView();

    const result: string = await this.getValue("SelectL");
    await this.endWebView();

    return result.split("\n");
  }

  async getRightOption(): Promise<string[]> {
    await this.beginWebView();

    const result: string = await this.getValue("SelectR");
    await this.endWebView();

    return result.split("\n");
  }
}
