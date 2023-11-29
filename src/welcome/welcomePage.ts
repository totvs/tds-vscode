import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Utils, { ServersConfig, LaunchConfig } from '../utils';
import { ExtensionContext } from 'vscode';

const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.welcome": vscode.l10n.t("Welcome"),
	"tds.webview.path.smartclient": vscode.l10n.t("Path to your SmartClient:"),
	"tds.webview.dir.include": vscode.l10n.t("Includes directory:"),
	"tds.webview.dir.include2": vscode.l10n.t("Allow multiple directories"),
	"tds.webview.dir.include.info": vscode.l10n.t("These settings can also be changed in"),
	"tds.webview.dir.include.info.or": vscode.l10n.t("or"),
	"tds.webview.dir.include.save.action": vscode.l10n.t("Save"),
	"tds.webview.dir.include.saveclose.action": vscode.l10n.t("Save/Close"),
};

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default class WelcomePage {
	static show(context: vscode.ExtensionContext, forcedShow: boolean) {
		if (currentPanel) {
			currentPanel.reveal();
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.welcomePage',
				vscode.l10n.t("Welcome"),
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

			if (forcedShow) {
				const includePath = ServersConfig.getIncludes();
				currentPanel.webview.postMessage({
					command: "setCurrentInclude",
					include: includePath
				});
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
					case 'welcomeClose':
						const smartClientBin = message.smartClientBin;
						const includePath = message.includes;

						ServersConfig.saveIncludePath(includePath);
						LaunchConfig.saveSmartClientBin(smartClientBin);
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
		}
	}

}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'welcome', 'welcomePage.html'));
	const cssOnDIskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOnDIskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}

export function showWelcomePage(context: ExtensionContext, forcedShow: boolean) {
	const configADVPL = vscode.workspace.getConfiguration('totvsLanguageServer');//transformar em configuracao de workspace
	let isShowWelcomePage = configADVPL.get('welcomePage');

	if (isShowWelcomePage || forcedShow) {
		WelcomePage.show(context, forcedShow);
		isShowWelcomePage = configADVPL.update("welcomePage", false);
	}
}