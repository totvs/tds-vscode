import { StatusBar, WebElement, Workbench } from "vscode-extension-tester";
import { delay } from "../helper";


export class StatusPageObject {
	async statusBarWithText(targetText: string | RegExp, _wait: number = 1000): Promise<WebElement> {
		const workbench: Workbench = new Workbench();

		const statusBar: StatusBar = workbench.getStatusBar();
		const target: RegExp = new RegExp(targetText, "i");
		let steps: number = _wait / 500;
		let result: WebElement = null;

		while (result == null && steps > -1) {
			const statusItems: WebElement[] = await statusBar.getItems();
			statusItems.forEach(async element => {
				if (target.exec(await element.getText())) {
					result = element;
				}
			});
			await delay(0.5);
			steps--;
		}

		return result;
	}

	async isConnected(LOCALHOST_NAME: string, LOCALHOST_ENVIRONMENT: string): Promise<boolean> {
		return (await this.statusBarWithText(`${LOCALHOST_NAME} / ${LOCALHOST_ENVIRONMENT}`, 10000)) != null
	}

	async isNoServerSelected(): Promise<boolean> {
		return (await this.statusBarWithText("Select server/environment")) != null
	}

	async waitConnection(wait: number = 30000): Promise<void> {
		if ((await this.statusBarWithText(/Autenticando usuário.*/), wait) == null) {
			throw new Error(`Connection process timeout (${wait})ms`);
		}
	}

}