import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const showProgressController = require('template-literal');

const localizeHTML = {
	"tds.webview.title": vscode.l10n.t( "Progress..."),
};

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default class ShowProgressControllerDialog {

	initializePage(context: vscode.ExtensionContext) {
		currentPanel = vscode.window.createWebviewPanel(
			'totvs-developer-studio.showProgress',
			vscode.l10n.t( "Progress..."),
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

		currentPanel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case '':
					return;
			}
		},
			undefined,
			context.subscriptions
		);
	}

	openPage(context: vscode.ExtensionContext) {
		if (currentPanel) {
			currentPanel.reveal();
		}
	}

	setTitle(title:string) {
		if(currentPanel) {
			currentPanel.webview.postMessage({
				command: "setTitle",
				title: title
			});
		}
	}

	setMainMessage(mainMessage:string) {
		if(currentPanel) {
			currentPanel.webview.postMessage({
				command: "setMainMessage",
				mainMessage: mainMessage
			});
		}
	}

	setDetailMessage(detailMessage:string) {
		if(currentPanel) {
			currentPanel.webview.postMessage({
				command: "detailMessage",
				detailMessage: detailMessage
			});
		}
	}

	setPercentageCompleted(percentageCompleted) {
		if(currentPanel) {
			currentPanel.webview.postMessage({
				command: "setPercentageCompleted",
				percentageCompleted: percentageCompleted
			});
		}
	}

	showProgress(context: vscode.ExtensionContext, title: string, mainMessage: string, detailMessage: string, currentWork, totalWork) {
		if (!currentPanel || currentPanel === undefined) {
			this.initializePage(context);
		}
		this.setTitle(title);
		this.setMainMessage(mainMessage);
		this.setDetailMessage(detailMessage);
		this.setPercentageCompleted(Math.round((currentWork * 100) / totalWork));
		this.openPage(context);
	}
}


function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'ui.dialogs', 'showProgressPage.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = showProgressController(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}