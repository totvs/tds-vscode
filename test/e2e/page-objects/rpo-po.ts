import { AbstractPageObject } from "./abstract-po";
import { ICompileKeyData, IIncludeData } from "./interface-po";

export class RpoPageObject extends AbstractPageObject {

	async fireClear(): Promise<void> {
		await this.beginWebView();

		await this.click("cleanID");

		await this.endWebView();
	}

	async fireSave(close: boolean): Promise<void> {
		await this.beginWebView();

		close ? await this.click("submitCloseID") : await this.click("submitID");

		await this.endWebView();
	}
}