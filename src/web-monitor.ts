/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as vscode from "vscode";
import { ServersConfig } from "./utils";
import { AuthSettings } from "./authSettings";
import { Logger } from "./logger";

export async function openWebMonitorView(context: vscode.ExtensionContext): Promise<any> {
	const data: {} = await AuthSettings.instance.getAuthData();
	const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("totvsLanguageServer");
	let url: string = config.get("url.webMonitor", "");

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
		let msg: string = "";

		if (response.status == 401) {
			msg = vscode.l10n.t("Unauthorized access to Web Monitor. Please check your credentials.");
		} else if (response.status == 403) {
			msg = vscode.l10n.t("Forbidden access to Web Monitor. Please check your credentials.");
		} else if (response.status == 404) {
			msg = vscode.l10n.t("Web Monitor not found. Please check your credentials.");
		}

		if (msg.length > 0) {
			Logger.logError(msg);
			Logger.logInfo(vscode.l10n.t("It was not possible to validate its user with current credentials."), false);
			Logger.logInfo(vscode.l10n.t("Try disconnecting and connecting the server again."), false);
		}

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

