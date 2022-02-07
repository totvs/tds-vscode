import { delay, DEFAULT_DELAY } from "../helper";
import { AbstractPageObject } from "./abstract-po";

export class ApplyTemplatePageObject extends AbstractPageObject {
  async setTemplateFile(templateFile: string) {
    await this.beginWebView();

    await this.setValue("btn-File", templateFile);
    await delay(DEFAULT_DELAY);

    await this.endWebView();
  }

  async fireSubmitClose() {
    await this.beginWebView();

    await this.click("submitApplyID");

    await this.endWebView();
  }
}
