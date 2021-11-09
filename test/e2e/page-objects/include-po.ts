import { By, Input, WebElement, WebView } from "vscode-extension-tester"
import { delay } from "../helper"
import { AbstractPageObject } from "./abstract-po"
import { IIncludeData } from "./interface-po"

export class IncludePageObject extends AbstractPageObject {
  async fillIncludePage(data: string[]): Promise<void> {
    await this.beginWebView();

    await this.setValue("includePath", data.join(";"));

    await this.endWebView();
  }

  async fireSave(close: boolean): Promise<void> {
    await this.beginWebView();

    close ? await this.click("submitIDClose") : await this.click("submitID");

    await this.endWebView();
  }

  async getIncludePage(close: boolean = false): Promise<string[]> {
    const result: string[] = [];
    await this.beginWebView();

    const text: string = await this.getValue("includePath");
    result.push(...text.split(";"));

    if (close) {
      await this.click("submitCloseID");
    }

    await this.endWebView();
    return result;
  }
}
