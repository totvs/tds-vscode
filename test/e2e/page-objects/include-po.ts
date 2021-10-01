import { By, Input, WebElement, WebView } from "vscode-extension-tester";
import { delay } from "../helper";
import { IIncludeData } from "./interface-po";


export class IncludePageObject {

	constructor() {
	}

	async fillIncludePage(
		data: IIncludeData,
		confirm: boolean = false
	) {
		let webView: WebView = new WebView();
		await webView.wait()
		await webView.switchToFrame();

		let element: WebElement = await webView.findWebElement(By.id("includePath"));
		element.sendKeys(data.includePath.join(";"));

		if (confirm) {
			const element = await webView.findWebElement(By.id("submitIDClose"));
			element.click();
		}

		await webView.switchBack();
		await delay(2000);
	}

	async getIncludePage(
	): Promise<IIncludeData> {
		const result: IIncludeData = { includePath: [] };

		let webView: WebView = new WebView();
		await webView.wait()
		await webView.switchToFrame();

		let element: WebElement = await webView.findWebElement(By.id("includePath"));
		const text: string = await element.getAttribute("value");
		result.includePath = text.split(";");

		element = await webView.findWebElement(By.id("submitIDClose"));
		element.click();

		await webView.switchBack();
		await delay(2000);

		return result;
	}

}