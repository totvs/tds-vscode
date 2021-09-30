import { StatusBar, WebElement, Workbench } from "vscode-extension-tester";
import { delay } from "../helper";


export class StatusPageObject {
	private workbench: Workbench;

	constructor() {
		this.workbench = new Workbench();
	}

	async wait() {
		await delay(2000);
		await this.workbench.getStatusBar().wait();
	}

	async statusBarWithText(targetText: string | RegExp, _wait: number = 1000): Promise<WebElement> {
		const statusBar: StatusBar = this.workbench.getStatusBar();
		const target: RegExp = new RegExp(targetText, "i");
		let steps: number = _wait / 500;
		let result: WebElement = null;

		while (result == null && steps > 0) {
			const statusItems: WebElement[] = await statusBar.getItems();
			await delay(500);

			statusItems.forEach(async element => {
				if (!result) {
					const text: string = await element.getText();
					if (target.exec(text)) {
						result = element;
					}
				}
			});

			steps--;
		}

		return result;
	}

	async isConnected(LOCALHOST_NAME: string, LOCALHOST_ENVIRONMENT: string): Promise<boolean> {
		return (await this.statusBarWithText(`${LOCALHOST_NAME} / ${LOCALHOST_ENVIRONMENT}`, 10000)) != null
	}

	async isNeedSelectServer(): Promise<boolean> {
		return (await this.statusBarWithText(/Select server\/environment/)) != null
	}

	async waitConnection(wait: number = 30000): Promise<void> {
		if ((await this.statusBarWithText(/Autenticando usuário.*/), wait) == null) {
			throw new Error(`Connection process timeout (${wait})ms`);
		}
	}

}