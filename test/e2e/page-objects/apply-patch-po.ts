import { delay } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { By, ModalDialog, WebElement } from "vscode-extension-tester";

export class ApplyPatchPageObject extends AbstractPageObject {
  async setUploadFile(patchList: string[]) {
    await this.beginWebView();

    await this.setValue("btn-File", patchList[0]);
    await delay(2000);

    await this.endWebView();
  }

  async fireSubmitCloseID() {
    await this.beginWebView();

    await this.click("submitCloseID");

    await this.endWebView();
  }

}
