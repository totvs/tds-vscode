import vscode = require('vscode');
import path = require('path');
import * as fs from 'fs';
import Utils from '../utils';

import {ExtensionContext} from 'vscode';

import * as nls from 'vscode-nls';
let localize = nls.loadMessageBundle();
const compile = require('template-literal');


const localizeHTML = {
	"tds.webview.welcome": localize("tds.webview.welcome", "Welcome"),
	"tds.webview.path.smartclient": localize("tds.webview.path.smartclient", "Path to your SmartClient:"),
	"tds.webview.dir.include": localize("tds.webview.dir.include", "Includes directory:"),
	"tds.webview.dir.include2": localize("tds.webview.dir.include2", "Allow multiple directories"),
	"tds.webview.dir.include.info": localize("tds.webview.dir.include.info", "These settings can also be changed in"),
	"tds.webview.dir.include.info.or": localize("tds.webview.dir.include.info.or", "or")
}

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default class welcomePage {
	static show(context: vscode.ExtensionContext, forcedShow: boolean) {
		if (currentPanel) {
			currentPanel.reveal();
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.welcomePage',
				localize("tds.webview.welcome", "Welcome"),
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
				const includePath = Utils.getIncludes();
				currentPanel.webview.postMessage({
					command: "setCurrentInclude",
					include: includePath
				});
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
					case 'welcomeClose':
						const smartClientBin = message.smartClientBin;
						const includePath = message.includes;

						Utils.saveIncludePath(includePath);
						saveSmartClientBin(smartClientBin);
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

function saveSmartClientBin(smartClient: string) {
	const launchConfig = Utils.getLaunchConfig();

	if (launchConfig) {
		if (launchConfig.configurations) {
			const configs = launchConfig.configurations;
			configs.forEach(element => {
				element.smartclientBin = smartClient;
			});

			Utils.persistLaunchsInfo(launchConfig);
		}
	}
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'welcome', 'welcomePage.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}

export function showWelcomePage(context: ExtensionContext, forcedShow: boolean) {
	const configADVPL = vscode.workspace.getConfiguration('totvsLanguageServer');//transformar em configuracao de workspace
	let isShowWelcomePage = configADVPL.get('welcomePage');

	if (isShowWelcomePage || forcedShow) {
		welcomePage.show(context, forcedShow);
		isShowWelcomePage = configADVPL.update("welcomePage", false);
	}
}