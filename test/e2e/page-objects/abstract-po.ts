import { By, WebElement, WebView } from "vscode-extension-tester";
import { delay } from "../helper";

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
	}

	async click(elementId: string): Promise<void> {
		let element: WebElement = await this.findElement(elementId);

		await element.click();
		await delay();
	}
}