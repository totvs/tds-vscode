import * as vscode from "vscode";
import { ConfigPackage } from "./config";
import { ServersConfig } from "./utils";
import { AuthSettings } from "./authSettings";
import { Logger } from "./logger";

export async function openWebMonitorView(context: vscode.ExtensionContext): Promise<any> {
	const data: {} = await AuthSettings.instance.getAuthData();
	let url: string = ConfigPackage.UrlWebMonitor();
	if (url.length == 0) {
		const server = ServersConfig.getCurrentServer();
		if (server.secure) {
			url = `https://${server.address}:${server.port}`;
		} else {
			url = `http://${server.address}:${server.port}`;
		}
	}

	//valida a requisição, pois iframe não tem tratamento de erro
	var request = new Request(`${url}/webmonitor/main?token=${encodeData(data)}`);

	await fetch(request).then((response) => {
		const view = vscode.window.createWebviewPanel(
			"webMonitor",
			"Web Monitor",
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);

		const html = (): string => {
			return /*html*/ `
		  <html lang="en" style="height: 100%;">
			<head>
			  <meta charset="utf-8">
			  <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
			  <meta name="theme-color" content="#000000">
			  <meta http-equiv="Content-Security-Policy" content="frame-src ${url}">
			</head>

			<body style="height: 100%; width: 100%">
			  <iframe style="height: auto; min-height: 100%; width: 100%"
				  src="${url}/webmonitor/main?token=${encodeData(data)}" frameborder="0">
			  </iframe>
			</body>
		  </html>
		`
		};

		view.webview.html = html();
	}).catch((error) => {
		Logger.logError(vscode.l10n.t("Error trying to open the Web Monitor. URL: {0}", url));
		Logger.logError(error, false);
		//throw new Error(error);
	});

}


function encodeData(data: {}): string {
	let result: string = "";

	result += Buffer.from(data["username"] || "", 'utf-8').toString('base64') + ":";
	result += Buffer.from(data["password"] || "", 'utf-8').toString('base64') + ":";
	result += Buffer.from(data["environment"] || "", 'utf-8').toString('base64');

	return encodeURIComponent(result);
}

