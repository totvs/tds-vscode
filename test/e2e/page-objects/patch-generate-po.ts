import { delay } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { By, WebElement } from "vscode-extension-tester";

export class PatchGeneratePageObject extends AbstractPageObject {
  // constructor() {
  //   super("Patch Generate");
  // }

  async fillRepositoryLogPage(
    data: any // ICompileKeyData
  ) {
    // await this.beginWebView();
    // await this.setValue("compileKeyFile", `${data.compileKeyFile}\t`); //força saida do campo
    // await this.endWebView();
  }

  async applyFilterInput(filter: string): Promise<string> {
    await this.beginWebView();
    await this.setValue("FilterInput", `${filter}\t`); //força saida do campo
    await delay();

    const result: string = await this.getValue("SelectL");

    await this.endWebView();
    return result;
  }

  async selectLeftOption(...elements: string[]) {
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
}
