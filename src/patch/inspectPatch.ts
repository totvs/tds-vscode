import * as vscode from 'vscode';
import path = require('path');
import fs = require('fs');
import Utils from '../utils';
import { languageClient } from '../extension';
const compile = require('template-literal');
import * as nls from 'vscode-nls';
import { ResponseError } from 'vscode-languageclient';
let localize = nls.loadMessageBundle();

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
	"tds.webview.inspect.patch": localize("tds.webview.inspect.patch", "Patch Infos"),
	"tds.webview.inspect.ignore.files": localize("tds.webview.inspect.ignore.files", "Ignore files"),
	"tds.webview.inspect.export.files": localize("tds.webview.inspect.export.files", "Export to file"),
	"tds.webview.inspect.export.files2": localize("tds.webview.inspect.export.files2", "Export items filted to file"),
	"tds.webview.inspect.export.close": localize("tds.webview.inspect.export.close", "Close"),
	"tds.webview.inspect.filter": localize("tds.webview.inspect.filter", "Filter, ex: MAT or * All (slow)"),
	"tds.webview.inspect.items.showing": localize("tds.webview.inspect.items.showing", "Items showing"),
	"tds.webview.inspect.col01": localize("tds.webview.inspect.col01", "Name"),
	"tds.webview.inspect.col02": localize("tds.webview.inspect.col02", "Date"),
}

export function patchInfos(context: vscode.ExtensionContext, args: any) {
	const server = Utils.getCurrentServer();
	const authorizationToken = Utils.getPermissionsInfos().authorizationToken;

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

		if (!currentPanel) {
			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.inspect.patch',
				'Inspetor de Patch',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'patch'))],
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
					case 'patchInfo':
						sendPatchInfo(message.patchFile, server, authorizationToken, currentPanel);
						return;
					case 'close':
						if (currentPanel) {
							currentPanel.dispose();
						}
						break;
				}
			},
				undefined,
				context.subscriptions
			);
		}else{
			currentPanel.reveal();
		}

		if (args) {
			if (args.fsPath) {
				sendPatchPath(args.fsPath, currentPanel);
				sendPatchInfo(args.fsPath, server, authorizationToken, currentPanel);
			}
		}
	} else {
		vscode.window.showErrorMessage("There is no server connected.");
	}
}

function sendPatchPath(path, currentPanel) {
	currentPanel.webview.postMessage({
		command: "setPatchPath",
		'path': path
	});
}

function sendPatchInfo(patchFile, server, authorizationToken, currentPanel) {
	const patchURI = vscode.Uri.file(patchFile).toString();
	languageClient.sendRequest('$totvsserver/patchInfo', {
		"patchInfoInfo": {
			"connectionToken": server.token,
			"authorizationToken": authorizationToken,
			"environment": server.environment,
			"patchUri": patchURI,
			"isLocal": true
		}
	}).then((response: any) => {
		currentPanel.webview.postMessage({
			command: 'setData',
			data: response.patchInfos
		});
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'patch', 'formInspectPatch.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'table_materialize.css'));
	const tableScriptPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'script', 'table_materialize.js'));
	//const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const scriptContent = fs.readFileSync(tableScriptPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML, script: scriptContent });
}