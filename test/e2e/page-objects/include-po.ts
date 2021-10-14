import { By, Input, WebElement, WebView } from "vscode-extension-tester"
import { delay } from "../helper"
import { AbstractPageObject } from "./abstract-po"
import { IIncludeData } from "./interface-po"

export class IncludePageObject extends AbstractPageObject {
  async fillIncludePage (
    data: IIncludeData
  ): Promise<void> {
    await this.beginWebView()

    await this.setValue("includePath", data.includePath.join(";"))

    await this.endWebView()
  }

  async fireSave (close: boolean): Promise<void> {
    await this.beginWebView()

    close ? await this.click("submitIDClose") : await this.click("submitID")

    await this.endWebView()
  }

  async getIncludePage (close: boolean = false
  ): Promise<IIncludeData> {
    const result: IIncludeData = { includePath: [] }
    await this.beginWebView()

    const text: string = await this.getValue("includePath")
    result.includePath = text.split(";")

    if (close) {
      await this.click("submitCloseID")
    }

    await this.endWebView()
    return result
  }
}