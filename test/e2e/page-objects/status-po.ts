import { StatusBar, WebElement, Workbench } from "vscode-extension-tester";
import { delay } from "../helper";


export class StatusPageObject {
	private workbench: Workbench;

	constructor() {
		this.workbench = new Workbench();
	}

	async wait() {
		await delay(500);
		await this.workbench.getStatusBar().wait(2000);
	}

	async statusBarWithText(targetText: string | RegExp, _wait: number = 1000): Promise<WebElement> {
		const statusBar: StatusBar = this.workbench.getStatusBar();
		this.wait();

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

	async isLoggedIn(): Promise<boolean> {
		return (await this.statusBarWithText(/Permissions: Logged in/)) != null
	}

	async isNotLoggedIn(): Promise<boolean> {
		return (await this.statusBarWithText(/Permissions: NOT logged in/)) != null
	}

	async waitConnection(wait: number = 30000): Promise<void> {
		if ((await this.statusBarWithText(/Authenticating user.*/), wait) == null) {
			throw new Error(`Connection process timeout (${wait})ms`);
		}
	}

	async waitReconnection(wait: number = 30000): Promise<void> {
		if ((await this.statusBarWithText(/.*Reconnecting to the server*./), wait) == null) {
			throw new Error(`Connection process timeout (${wait})ms`);
		}
	}

	async waitCheckIntegrity(wait: number = 30000): Promise<void> {
		if ((await this.statusBarWithText(/Checking RPO integrity/), wait) == null) {
			throw new Error(`Check Integrity process timeout (${wait})ms`);
		}
	}
}