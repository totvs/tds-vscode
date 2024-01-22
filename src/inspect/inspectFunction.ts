import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Utils, { ServersConfig } from '../utils';
import { languageClient } from '../extension';
const compile = require('template-literal');
import { ResponseError } from 'vscode-languageclient';
import { openInspectView } from "../inspect-harpia";

const localizeHTML = {
	"tds.webview.functionsinspector": vscode.l10n.t("Functions Inspector"),
	"tds.webview.functionsinspector.filter": vscode.l10n.t("Filter, ex: MAT or * All (slow)"),
	"tds.webview.functionsinspector.export2file": vscode.l10n.t("Export to file"),
	"tds.webview.functionsinspector.export": vscode.l10n.t("Export filtered items to file"),
	"tds.webview.functionsinspector.items.showing": vscode.l10n.t("Items showing"),
	"tds.webview.functionsinspector.filter.functions": vscode.l10n.t("Use filter to display functions"),
	"tds.webview.functionsinspector.close": vscode.l10n.t("Close")
};

export function inspectFunctions(context: vscode.ExtensionContext) {
	const server = ServersConfig.getCurrentServer();
	if (server) {
		if (Utils.isServerP20OrGreater(server)) {
			openInspectView(context, {
				objectsInspector: false,
				includeOutScope: false, //inicia com #NONE
			});
		} else {
			inspectFunctionsLegado(context);
		}
	}
}

function inspectFunctionsLegado(context: vscode.ExtensionContext) {
	const server = ServersConfig.getCurrentServer();

	if (server) {
		let extensionPath = "";
		if (!context || context === undefined) {
			let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
			if (ext) {
				extensionPath = ext.extensionPath;
			}
		} else {
			extensionPath = context.extensionPath;
		}

		const currentPanel = vscode.window.createWebviewPanel(
			"totvs-developer-studio.inspect.function",
			"Functions Inspector",
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(path.join(extensionPath, "src", "patch")),
				],
				retainContextWhenHidden: true,
			}
		);

		currentPanel.webview.html = getWebViewContent(context, localizeHTML);

		currentPanel.onDidDispose(
			() => {
				//currentPanel = undefined;
			},
			null,
			context.subscriptions
		);

		currentPanel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'inspectorFunctions':
					languageClient.sendRequest('$totvsserver/inspectorFunctions', {
						"inspectorFunctionsInfo": {
							"connectionToken": server.token,
							"environment": server.environment
						}
					}).then((response: InspectorFunctionResult) => {
						currentPanel.webview.postMessage(response.functions);
					}, (err: ResponseError<object>) => {
						vscode.window.showErrorMessage(err.message);
					});
					return;
				case 'close':
					currentPanel.dispose();
					break;
				case 'exportData':
					const allItems = message.items[0];
					let pathFile = vscode.workspace.rootPath + "/inspectorFunctions.txt";
					const textString = allItems.join("\n");

					if (fs.existsSync(pathFile)) {
						let r = Math.random().toString(36).substring(7);
						pathFile = vscode.workspace.rootPath + "/inspectorFunctions" + r + ".txt";
					}

					let setting: vscode.Uri = vscode.Uri.parse("untitled:" + pathFile);
					vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
						vscode.window.showTextDocument(a, 1, false).then(e => {
							e.edit(edit => {
								edit.insert(new vscode.Position(0, 0), textString);
							});
						});
					}, (error: any) => {
						console.error(error);
						debugger;
					});
					break;
			}
		},
			undefined,
			context.subscriptions
		);
	} else {
		vscode.window.showErrorMessage(
			vscode.l10n.t("There is no server connected")
		  );
	}
}


function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'inspect', 'formInspectFunction.html'));
	const cssOnDIskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOnDIskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}


class InspectorFunctionResult {
	message: string;
	functions: Array<string>;
}