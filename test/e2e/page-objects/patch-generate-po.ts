import { delay } from "../helper";
import {  AbstractPageObject } from "./abstract-po";
import { By, WebElement } from 'vscode-extension-tester';

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
    const options: WebElement[] = await selectLeft.findElements(By.css("option"));

    options.filter(async (option: WebElement) => {
      const text: string = await option.getText();

      if (elements.includes(text)) {
          await option.click();
      }
    })

    const button: WebElement = await this.findElement("loadRight");
    button.click();

    await this.endWebView();
  }

  // async getCompileKeyPage(close: boolean = false)
  // 	: Promise<ICompileKeyData> {
  // 	const result: ICompileKeyData = {
  // 		machineId: "",
  // 		compileKeyFile: "",
  // 		key: "",
  // 		generatedIn: "",
  // 		expireIn: "",
  // 		token: "",
  // 		overwrite: ""
  // 	};
  // 	await this.beginWebView();

  // 	result.machineId = await this.getValue("MachineID");
  // 	result.compileKeyFile = await this.getValue("compileKeyFile");
  // 	result.key = await this.getValue("KeyID");
  // 	result.generatedIn = await this.getValue("GeneratedInID");
  // 	result.expireIn = await this.getValue("ExpireInID");
  // 	result.token = await this.getValue("TokenID");
  // 	result.overwrite = await this.getValue("OverwriteID");

  // 	if (close) {
  // 		await this.click("submitCloseID");
  // 	}

  // 	await this.endWebView();
  // 	return result;
  // }

  // async isValidKey(): Promise<boolean> {
  // 	await this.beginWebView();

  // 	const message: string = await this.getValue("OutputMessage");

  // 	await this.endWebView();

  // 	return message === "Key successfully validated";
  // }

  // async fireClear(): Promise<void> {
  // 	await this.beginWebView();

  // 	await this.click("cleanID");

  // 	await this.endWebView();
  // }

  // async fireSave(close: boolean): Promise<void> {
  // 	await this.beginWebView();

  // 	await this.click(close ? "submitCloseID" : "submitID");

  // 	await this.endWebView();
  // }
}
