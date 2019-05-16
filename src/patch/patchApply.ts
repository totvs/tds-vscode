import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
import Utils from '../utils';
import { languageClient } from '../extension';
import * as nls from 'vscode-nls';

let localize = nls.loadMessageBundle();
const compile = require('template-literal');

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
	"tds.webview.patch.apply": localize("tds.webview.patch.apply", "Apply Patch"),
	"tds.webview.server.name": localize("tds.webview.server.name", "Server Name"),
	"tds.webview.address": localize("tds.webview.address", "Address"),
	"tds.webview.environment": localize("tds.webview.environment", "Environment"),
	"tds.webview.patch.file": localize("tds.webview.patch.file", "Patch File"),
	"tds.webview.applyOld": localize("tds.webview.applyOld", "Apply old files")
};


export function patchApply(context: any, isWorkspace: boolean): void {
	if (currentPanel) {
		currentPanel.reveal();
	} else {
		const server = Utils.getCurrentServer();

		if (server) {
			const allInfoServer: any = Utils.getServerForID(server.id);

			if (allInfoServer) {
				server.address = allInfoServer.address;
				server.port = allInfoServer.port;
			}

			if (!isWorkspace) {

				currentPanel = vscode.window.createWebviewPanel(
					'totvs-developer-studio.patchApply',
					'Patch Apply',
					vscode.ViewColumn.One,
					{
						enableScripts: true,
						localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'patch'))],
						retainContextWhenHidden: true
					}
				);

				currentPanel.webview.html = getWebViewContent(context, localizeHTML);
				currentPanel.onDidDispose(
					() => {
						currentPanel = undefined;
					},
					null,
					context.subscriptions
				);

				currentPanel.webview.postMessage({
					command: "setCurrentServer",
					serverCurrent: server
				});

				currentPanel.webview.onDidReceiveMessage(message => {
					switch (message.command) {
						case 'patchApply':
							const patchUri = vscode.Uri.file(message.patchFile).toString();

							if (message.patchFile === "") {
								vscode.window.showErrorMessage(localize("tds.webview.patch.apply.fail", "Apply Patch Fail. Please input patch file."));
							} else {
								//vscode.window.showInformationMessage(localize("tds.webview.patch.apply.start","Started Patch Apply"));
								const permissionsInfos = Utils.getPermissionsInfos();
								languageClient.sendRequest('$totvsserver/patchApply', {
									"patchApplyInfo": {
										"connectionToken": server.token,
										"authenticateToken": permissionsInfos.authorizationToken,
										"environment": server.environment,
										"patchUri": patchUri,
										"isLocal": true,
										"validatePatch": false,
										"applyOldProgram": message.applyOld
									}
								}).then((response: PatchResult) => {
									if (message.applyOld) {
										vscode.window.showInformationMessage('Old files applied.');
									}
								}, (err) => {
									vscode.window.showErrorMessage(err);
								});
							}
							if (currentPanel) {
								if (message.close) {
									currentPanel.dispose();
								}
							}
							return;
					}
				},
					undefined,
					context.subscriptions
				);
			} else {

				let filename: string = "";
				if (context.fsPath && context.fsPath !== undefined) { //A ação veio pelo menu de contexto por exemplo, e/ou com o fsPath preenchido corretamente
					filename = context.fsPath;
				}
				if (filename !== "") {
					const patchFile = filename;
					vscode.window.showWarningMessage(localize("tds.webview.patch.apply.file", "Are you sure you want apply patch {0} from RPO?", path.basename(filename)), localize('tds.vscode.yes', 'Yes'), localize('tds.vscode.no', 'No')).then(clicked => {
						if (clicked === localize('tds.vscode.yes', 'Yes')) {
							const patchUri = vscode.Uri.file(patchFile).toString();
							const permissionsInfos = Utils.getPermissionsInfos();
							languageClient.sendRequest('$totvsserver/patchApply', {
								"patchApplyInfo": {
									"connectionToken": server.token,
									"authenticateToken": permissionsInfos.authorizationToken,
									"environment": server.environment,
									"patchUri": patchUri,
									"isLocal": true,
									"validatePatch": false,
									"applyOldProgram": false
								}
							}).then((response: PatchResult) => {
								// const message: string  = response.message;
								// if(message == "Success"){
								// 	vscode.window.showInformationMessage(localize("tds.webview.patch.applied","Patch Applied!"));
								// }else {
								// 	vscode.window.showErrorMessage(message);
								// }
							}, (err) => {
								vscode.window.showErrorMessage(err);
							});

						}
					});
				}

			}
		} else {
			vscode.window.showErrorMessage(localize("tds.webview.server.not.connected", "No server connected."));
		}
	}
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'patch', 'formApplyPatch.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}

class PatchResult {
	message: string;
}