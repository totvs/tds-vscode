import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { languageClient } from '../extension';
import Utils, { ServersConfig } from '../utils';
import { ResponseError } from 'vscode-languageclient';
import { _debugEvent } from '../debug';
import { processSelectResourceMessage } from '../utilities/processSelectResource';

const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.title": vscode.l10n.t("Generate WS"),
	"tds.webview.ws.URL": vscode.l10n.t("URL Web Service / WSDL FIle"),
	"tds.webview.ws.path": vscode.l10n.t("File Directory"),
	"tds.webview.ws.name": vscode.l10n.t("Output File Name"),
	"tds.webview.ws.save.action": vscode.l10n.t("Save"),
	"tds.webview.ws.saveclose.action": vscode.l10n.t("Save/Close"),
};

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default function showWSPage(context: vscode.ExtensionContext) {
	if (currentPanel) {
		currentPanel.reveal();
	} else {
		let server = ServersConfig.getCurrentServer();
		if (server) {
			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.ws.show',
				vscode.l10n.t("Generate WS Protheus"),
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
				if (!processSelectResourceMessage(currentPanel.webview, message)) {
					switch (message.command) {
					case 'checkDir':
						let checkedDir = Utils.checkDir(message.selectedDir);
						currentPanel.webview.postMessage({
							command: "checkedDir",
							checkedDir: checkedDir
						});
						break;
					case 'wsClose':
						const extension: string = message.outputFileName.split('.').pop().toLowerCase();
						if (extension !== "prw" && extension !== "prx" && extension !== "tlpp") {
							vscode.window.showErrorMessage("The output file must have one of the following extensions: .prw, .prx or .tlpp");
							return;
						}
						if (_debugEvent) {
							vscode.window.showWarningMessage("This operation is not allowed during a debug.")
							return;
						}
						server = ServersConfig.getCurrentServer();
						languageClient.sendRequest('$totvsserver/wsdlGenerate', {
							"wsdlGenerateInfo": {
								connectionToken: server.token,
								authorizationToken: ServersConfig.getAuthorizationToken(server),
								environment: server.environment,
								wsdlUrl: message.url
							}
						}).then((response: any) => {
							const pathFile = message.path + "//" + message.outputFileName;

							if (fs.existsSync(pathFile)) {
								vscode.window.showWarningMessage("The file exists. Would like overwrite? ", { modal: true }, 'Yes', 'No').then(clicked => {
									if (clicked === 'Yes') {
										fs.unlinkSync(pathFile);
										createAndWriteOpen(pathFile, response.content);
									}
								});
							} else {
								createAndWriteOpen(pathFile, response.content);
							}
							if (currentPanel) {
								if (message.close) {
									currentPanel.dispose();
								}
							}
						}, (err: ResponseError<object>) => {
							vscode.window.showErrorMessage(err.message);
						});
						return;
				}
				}
			},
				undefined,
				context.subscriptions
			);
		} else {
			vscode.window.showErrorMessage(vscode.l10n.t("There is no server connected."));
		}
	}
}

function createAndWriteOpen(filePath, content) {
	fs.appendFile(filePath, content, (err) => {
		vscode.window.showErrorMessage(err.message);
	});

	vscode.window.showInformationMessage("The file was successfully created. Would like open? ", { modal: true }, 'Yes', 'No').then(clicked => {
		if (clicked === 'Yes') {
			vscode.window.showTextDocument(vscode.Uri.file(filePath));
		}
	});
}
function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'WebService', 'generateWS.html'));
	const cssOnDIskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));
	const chooseResourcePath = vscode.Uri.file(
		path.join(
		  context.extensionPath,
		  "resources",
		  "script",
		  "chooseResource.js"
		)
	  );

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOnDIskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const chooseResourceContent = fs.readFileSync(
		chooseResourcePath.with({ scheme: "vscode-resource" }).fsPath
	  );

	let runTemplate = compile(htmlContent);

	return runTemplate({
		css: cssContent,
		localize: localizeHTML,
		chooseResourceScript: chooseResourceContent
	});
}