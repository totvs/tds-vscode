import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Utils, { ServersConfig } from '../utils';

const compile = require('template-literal');


const localizeHTML = {
	"tds.webview.title": vscode.l10n.t("Include"),
	"tds.webview.dir.include": vscode.l10n.t("Includes directory:"),
	"tds.webview.dir.include2": vscode.l10n.t("Allow multiple directories"),
	"tds.webview.dir.include.info": vscode.l10n.t("These settings can also be changed in"),
	"tds.webview.dir.include.save": vscode.l10n.t("Save"),
	"tds.webview.dir.include.saveclose": vscode.l10n.t("Save/Close"),
};

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default function showInclude(context: vscode.ExtensionContext) {
	if (currentPanel) {
		currentPanel.reveal();
	} else {
		currentPanel = vscode.window.createWebviewPanel(
			'totvs-developer-studio.include',
			vscode.l10n.t("Global Include"),
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

		const includes = ServersConfig.getIncludes();
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
					let checkedDir = Utils.checkDir(message.selectedDir);
					currentPanel.webview.postMessage({
						command: "checkedDir",
						checkedDir: checkedDir
					});
					break;
				case 'includeClose':
					const includePath = message.include;
					ServersConfig.saveIncludePath(includePath);
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
	const cssOnDIskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOnDIskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}