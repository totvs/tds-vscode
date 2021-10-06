import { By, Input, WebElement, WebView } from "vscode-extension-tester";
import { delay } from "../helper";
import { ICompileKeyData, IIncludeData } from "./interface-po";

export class AbstractPageObject {
	private webView: WebView;

	async beginWebView(): Promise<void> {
		this.webView = new WebView();

		await this.webView.wait()
		await this.webView.switchToFrame();
		await delay(2000);
	}

	async endWebView(): Promise<void> {
		this.webView.switchBack();
		await delay(2000);

		this.webView = null;
	}

	async findElement(id: string) {
		return await this.webView.findWebElement(By.id(id))
	}

	async getValue(elementId: string): Promise<string> {
		let element: WebElement = await this.findElement(elementId);

		return await element.getAttribute("value") || await element.getText();
	}

	async setValue(elementId: string, value: string): Promise<void> {
		let element: WebElement = await this.findElement(elementId);

		await element.sendKeys(value);
		//		await delay(500);
	}

	async click(elementId: string): Promise<void> {
		let element: WebElement = await this.findElement(elementId);

		await element.click();
		await delay();
	}
}

export class CompileKeyPageObject extends AbstractPageObject {
	async fillCompileKeyPage(
		data: ICompileKeyData
	) {
		await this.beginWebView();

		await this.setValue("compileKeyFile", `${data.compileKeyFile}\t`); //força saida do campo

		await this.endWebView();
	}

	async getCompileKeyPage(close: boolean = false)
		: Promise<ICompileKeyData> {
		const result: ICompileKeyData = {
			machineId: "",
			compileKeyFile: "",
			key: "",
			generatedIn: "",
			expireIn: "",
			token: "",
			overwrite: ""
		};
		await this.beginWebView();

		result.machineId = await this.getValue("MachineID");
		result.compileKeyFile = await this.getValue("compileKeyFile");
		result.key = await this.getValue("KeyID");
		result.generatedIn = await this.getValue("GeneratedInID");
		result.expireIn = await this.getValue("ExpireInID");
		result.token = await this.getValue("TokenID");
		result.overwrite = await this.getValue("OverwriteID");

		if (close) {
			await this.click("submitCloseID");
		}

		await this.endWebView();
		return result;
	}

	async isValidKey(): Promise<boolean> {
		await this.beginWebView();

		const message: string = await this.getValue("OutputMessage");

		await this.endWebView();

		return message === "Key successfully validated";
	}

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