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
		console.log("this.fillIncludePage.1")
		let webView: WebView = new WebView();
		console.log("this.fillIncludePage.2")
		await webView.wait(3000)
		await delay(2000);
		console.log("this.fillIncludePage.3")
		await webView.switchToFrame();
		console.log("this.fillIncludePage.4")

		let element: WebElement = await webView.findWebElement(By.id("includePath"));
		await element.sendKeys(data.includePath.join(";"));

		if (confirm) {
			const element = await webView.findWebElement(By.id("submitIDClose"));
			await element.click();
		}

		await webView.switchBack();
		await delay(2000);
	}

	async getIncludePage(
	): Promise<IIncludeData> {
		const result: IIncludeData = { includePath: [] };

		let webView: WebView = new WebView();
		await webView.wait(3000)
		await webView.switchToFrame();

		let element: WebElement = await webView.findWebElement(By.id("includePath"));
		const text: string = await element.getAttribute("value");
		result.includePath = text.split(";");

		element = await webView.findWebElement(By.id("submitIDClose"));
		await element.click();

		await webView.switchBack();
		await delay(2000);

		return result;
	}

}