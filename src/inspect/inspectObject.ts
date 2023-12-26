import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Utils, { ServersConfig } from '../utils';
import { languageClient } from '../extension';
const compile = require('template-literal');
import { ResponseError } from 'vscode-languageclient';
// @@ import { openInspectView } from "../inspect-harpia";

const localizeHTML = {
	"tds.webview.objectsinspector": vscode.l10n.t("Objects Inspector"),
	"tds.webview.objectsinspector.ignore.files": vscode.l10n.t("Ignore files"),
	"tds.webview.objectsinspector.filter": vscode.l10n.t("Filter, ex: MAT or * All (slow)"),
	"tds.webview.objectsinspector.export2file": vscode.l10n.t("Export to file"),
	"tds.webview.objectsinspector.export": vscode.l10n.t("Export filtered items to file"),
	"tds.webview.objectsinspector.items.showing": vscode.l10n.t("Items showing"),
	"tds.webview.objectsinspector.filter.objects": vscode.l10n.t("Use filter to display objects"),
	"tds.webview.objectsinspector.close": vscode.l10n.t("Close")
};

export function inspectObject(context: vscode.ExtensionContext) {
	const server = ServersConfig.getCurrentServer();
	if (server) {
		if (Utils.isServerP20OrGreater(server)) {
			// @@ openInspectView(context, {
			// 	objectsInspector: true,
			// 	includeOutScope: false, //TRES
			// });
		} else {
			inspectObjectLegado(context);
		}
	}
}

function inspectObjectLegado(context: vscode.ExtensionContext) {
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
			"totvs-developer-studio.inspect.object",
			"Objects Inspector",
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.file(path.join(extensionPath, "src", "patch")),
				],
				retainContextWhenHidden: true,
			}
		);

		//currentPanel.webview.html = getWizardGeneratePatch(extensionPath);
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
				case 'inspectorObjects':
					languageClient.sendRequest('$totvsserver/inspectorObjects', {
						"inspectorObjectsInfo": {
							"connectionToken": server.token,
							"environment": server.environment,
							"includeTres": true
						}
					}).then((response: any) => {
						currentPanel.webview.postMessage(response.objects);
					}, (err: ResponseError<object>) => {
						vscode.window.showErrorMessage(err.message);
					});
					return;
				case 'close':
					currentPanel.dispose();
					break;
				case 'exportData':
					const allItems = message.items[0];
					let pathFile = vscode.workspace.rootPath + "/inspectorObject.txt";
					const textString = allItems.join("\n");

					// if(fs.existsSync(pathFile)){
					if (fs.existsSync(pathFile)) {
						let r = Math.random().toString(36).substring(7);
						pathFile = vscode.workspace.rootPath + "/inspectorObject" + r + ".txt";
					}

					let setting: vscode.Uri = vscode.Uri.parse("untitled:" + pathFile);
					vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
						vscode.window.showTextDocument(a, 1, false).then(e => {
							e.edit(edit => {
								edit.insert(new vscode.Position(0, 0), textString);
							});
						});
					}, (err: ResponseError<object>) => {
						console.error(err.message);
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

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'inspect', 'formInspectObject.html'));
	const cssOnDIskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOnDIskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}