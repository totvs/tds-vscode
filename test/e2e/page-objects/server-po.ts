import { By, WebView } from "vscode-extension-tester";
import { delay } from "../helper";
import { IServerData } from "./interface-po";


export class ServerPageObject {
	private server: IServerData;

	constructor(data?: IServerData) {
		this.server = data;
	}

	async fillAddServerPage(
		webView: WebView,
		data: IServerData = this.server,
		confirm: boolean = false
	) {
		//let element = await webView.findWebElement(By.id("serverTypeID"));
		//element.sendKeys(data.serverType);

		let element = await webView.findWebElement(By.id("nameID"));
		element.sendKeys(data.serverName);

		element = await webView.findWebElement(By.id("addressID"));
		element.sendKeys(data.address);

		element = await webView.findWebElement(By.id("portID"));
		element.sendKeys(data.port);

		element = await webView.findWebElement(By.id("includePath"));
		element.sendKeys(data.includePath.join(";"));

		if (confirm) {
			element = await webView.findWebElement(By.id("submitIDClose"));
			element.click();
		}

		await delay();
	}
}