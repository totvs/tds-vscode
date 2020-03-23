import vscode = require('vscode');
import path = require('path');
import * as fs from 'fs';
import Utils from '../utils';

import * as nls from 'vscode-nls';
let localize = nls.loadMessageBundle();
const compile = require('template-literal');


const localizeHTML = {
	"tds.webview.title": localize("tds.webview.title", "Include"),
	"tds.webview.dir.include": localize("tds.webview.dir.include", "Includes directory:"),
	"tds.webview.dir.include2": localize("tds.webview.dir.include2", "Allow multiple directories"),
	"tds.webview.dir.include.info": localize("tds.webview.dir.include.info", "These settings can also be changed in")
}

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default function showInclude(context: vscode.ExtensionContext) {
	if (currentPanel) {
		currentPanel.reveal();
	} else {
		currentPanel = vscode.window.createWebviewPanel(
			'totvs-developer-studio.include',
			localize("tds.webview.title", "Global Include"),
			vscode.ViewColumn.One,
			{
				enableScripts: true,
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

		const includes = Utils.getIncludes();
		const includeString: string = includes.toString();
		if (includeString) {
			const aux = includeString.replace(/,/g, ";");
			if (aux) {
				currentPanel.webview.postMessage({
					command: "setCurrentInclude",
					include: aux
				});
			}
		}
		currentPanel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'checkDir':
					var checkedDir = Utils.checkDir(message.selectedDir);
					currentPanel.webview.postMessage({
						command: "checkedDir",
						checkedDir: checkedDir
					});
					break;
				case 'includeClose':
					const includePath = message.include;
					Utils.saveIncludePath(includePath);
					if (currentPanel) {
						if (message.close) {
							currentPanel.dispose();
						}
					}
					break;
			}
		},
			undefined,
			context.subscriptions
		);
	}
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'include', 'include.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}