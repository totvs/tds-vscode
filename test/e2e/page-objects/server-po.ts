import { By, WebView } from "vscode-extension-tester";
import { delay } from "../helper";
import { AbstractPageObject } from "./abstract-po";
import { IServerData } from "./interface-po";

export class ServerPageObject extends AbstractPageObject {
  private server: IServerData;

  constructor(data?: IServerData) {
    super();
    this.server = data;
  }

  async fillServerPage(data: IServerData = this.server) {
    await this.beginWebView();

    await this.setValue("serverTypeID", data.serverType);
    await this.setValue("nameID", data.serverName);
    await this.setValue("addressID", data.address);
    await this.setValue("portID", data.port);
    await this.setValue("includePath", data.includePath.join(";"));

    await this.endWebView();
  }

  async fireSaveClose(): Promise<void> {
    await this.beginWebView();

    await this.click("submitIDClose");

    await this.endWebView();

    await delay(2000);
  }
}
