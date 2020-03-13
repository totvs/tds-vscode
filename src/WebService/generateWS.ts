import vscode = require('vscode');
import path = require('path');
import * as fs from 'fs';
import * as nls from 'vscode-nls';
import { languageClient } from '../extension';
import Utils from '../utils';
let localize = nls.loadMessageBundle();
const compile = require('template-literal');


const localizeHTML = {
	"tds.webview.title": localize("tds.webview.title", "Generate WS Protheus"),
	"tds.webview.ws.URL": localize("tds.webview.ws.URL", "URL Web Service"),
	"tds.webview.ws.path": localize("tds.webview.ws.path", "File Directory"),
	"tds.webview.ws.name": localize("tds.webview.ws.name", "File Name")
};

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export default function showWSPage(context: vscode.ExtensionContext) {
	if (currentPanel) {
		currentPanel.reveal();
	} else {
		let server = Utils.getCurrentServer();
		if (server) {
			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.ws.show',
				localize("tds.webview.title", "Generate WS Protheus"),
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
					case 'wsClose':
						const extension:string = message.fileName.split('.').pop().toLowerCase();
						if( extension !== "prw" && extension !== "prx" && extension !== "tlpp"){
							vscode.window.showErrorMessage("Is need a extension prw, prx or tlpp");
							return;
						}
						server = Utils.getCurrentServer();
						languageClient.sendRequest('$totvsserver/wsdlGenerate', {
							"wsdlGenerateInfo": {
								"connectionToken": server.token,
								"environment": server.environment,
								"wsdlUrl": message.url
							}
						}).then((response: any) => {
							const pathFile = message.path + "//" + message.fileName;

							if (fs.existsSync(pathFile)){
								vscode.window.showWarningMessage("The file exists. Would like overwrite? ", 'Yes', 'No').then(clicked => {
									if (clicked === 'Yes') {
										fs.unlinkSync(pathFile);
										createAndWriteOpen(pathFile, response.content);
									}
								});
							}else{
								createAndWriteOpen(pathFile, response.content);
							}
							if (currentPanel) {
								if (message.close) {
									currentPanel.dispose();
								}
							}
						}, (err) => {
							vscode.window.showErrorMessage(err);
						});
						return;
				}
			},
				undefined,
				context.subscriptions
			);
		}else{
			vscode.window.showErrorMessage(localize("tds.webview.server.not.connected","There is no server connected."));
		}
	}
}

function createAndWriteOpen(filePath, content){
	fs.appendFile(filePath, content, (err) => {
		vscode.window.showErrorMessage(err.message);
	});

	vscode.window.showInformationMessage("The file was successfully created. Would like open? ", 'Yes', 'No').then(clicked => {
		if (clicked === 'Yes') {
			vscode.window.showTextDocument(vscode.Uri.file(filePath));
		}
	});
}
function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'WebService', 'generateWS.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}