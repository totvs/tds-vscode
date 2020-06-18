import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
import Utils from '../utils';
import { languageClient } from '../extension';
const compile = require('template-literal');
import * as nls from 'vscode-nls';
import { ResponseError } from 'vscode-languageclient';
let localize = nls.loadMessageBundle();

const localizeHTML = {
	"tds.webview.inspect.generate": localize("tds.webview.inspect.generate", "Patch Generation"),
	"tds.webview.inspect.ignore.files": localize("tds.webview.inspect.ignore.files", "Ignore files"),
	"tds.webview.inspect.filter": localize("tds.webview.inspect.filter", "Filter, ex: MAT or * All (slow)"),
	"tds.webview.inspect.clean.selected": localize("tds.webview.inspect.clean.selected", "Clear Selected"),
	"tds.webview.inspect.clean.all": localize("tds.webview.inspect.clean.all", "Clear All"),
	"tds.webview.inspect.items": localize("tds.webview.inspect.items", "Items"),
	"tds.webview.inspect.directory": localize("tds.webview.inspect.directory", "Patch Generation Directory"),
	"tds.webview.inspect.file.name.patch": localize("tds.webview.inspect.file.name.patch", "Patch file name"),
	"tds.webview.inspect.file.name": localize("tds.webview.inspect.file.name", "File name"),
	"tds.webview.inspect.items.generate": localize("tds.webview.inspect.items.generate", "Generate"),
	"tds.webview.inspect.items.generate.close": localize("tds.webview.inspect.items.generate.close", "Generate/Close"),
	"tds.webview.inspect.message1": localize("tds.webview.inspect.message1", "The generated patch is based on the files from RPO. Be sure that the included fonts are compiled."),
	"tds.webview.inspect.items.showing": localize("tds.webview.inspect.items.showing", "Items showing")
}

export function inspectObject(context: vscode.ExtensionContext) {
	const server = Utils.getCurrentServer();

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
			'totvs-developer-studio.inspect.object',
			'Inspetor de Objetos',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'patch'))],
				retainContextWhenHidden: true
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
		vscode.window.showErrorMessage("There is no server connected.");
	}
}


function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'inspect', 'formInspectObject.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}