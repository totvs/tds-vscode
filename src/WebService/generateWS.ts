import vscode = require('vscode');
import path = require('path');
import * as fs from 'fs';
import * as nls from 'vscode-nls';
import { languageClient } from '../extension';
import Utils from '../utils';
import { ResponseError } from 'vscode-languageclient';
let localize = nls.loadMessageBundle();
const compile = require('template-literal');


const localizeHTML = {
	"tds.webview.title": localize("tds.webview.title", "Generate WS Protheus"),
	"tds.webview.ws.URL": localize("tds.webview.ws.URL", "URL Web Service / WSDL FIle"),
	"tds.webview.ws.path": localize("tds.webview.ws.path", "File Directory"),
	"tds.webview.ws.name": localize("tds.webview.ws.name", "Output File Name")
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
					case 'checkDir':
						var checkedDir = Utils.checkDir(message.selectedDir);
						currentPanel.webview.postMessage({
							command: "checkedDir",
							checkedDir: checkedDir
						});
						break;
					case 'wsClose':
						const extension:string = message.outputFileName.split('.').pop().toLowerCase();
						if( extension !== "prw" && extension !== "prx" && extension !== "tlpp") {
							vscode.window.showErrorMessage("The output file must have one of the following extensions: .prw, .prx or .tlpp");
							return;
						}
						server = Utils.getCurrentServer();
						const permissionsInfos = Utils.getPermissionsInfos();
						languageClient.sendRequest('$totvsserver/wsdlGenerate', {
							"wsdlGenerateInfo": {
								"connectionToken": server.token,
								"authorizationToken" : permissionsInfos.authorizationToken,
								"environment": server.environment,
								"wsdlUrl": message.url
							}
						}).then((response: any) => {
							const pathFile = message.path + "//" + message.outputFileName;

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
						}, (err: ResponseError<object>) => {
							vscode.window.showErrorMessage(err.message);
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