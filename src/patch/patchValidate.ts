import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import Utils from '../utils';
import { languageClient } from '../extension';
const compile = require('template-literal');
import * as nls from 'vscode-nls';
import { ResponseError } from 'vscode-languageclient';
import { CompileKey } from '../compileKey/compileKey';
import { _debugEvent } from '../debug';
import { IRpoToken } from '../rpoToken';

let localize = nls.loadMessageBundle();

let patchValidatesData: any;

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
	"tds.webview.validate.patch": localize("tds.webview.validate.patch", "Patch Validate"),
	"tds.webview.validate.ignore.files": localize("tds.webview.validate.ignore.files", "Ignore files"),
	"tds.webview.validate.export.files": localize("tds.webview.validate.export.files", "Export to file"),
	"tds.webview.validate.export.files2": localize("tds.webview.validate.export.files2", "Export items filted to file"),
	"tds.webview.validate.export.close": localize("tds.webview.validate.export.close", "Close"),
	"tds.webview.validate.filter": localize("tds.webview.validate.filter", "Filter, ex: MAT or * All (slow)"),
	"tds.webview.validate.items.showing": localize("tds.webview.validate.items.showing", "Items showing"),
	"tds.webview.validate.col01": localize("tds.webview.validate.col01", "File"),
	"tds.webview.validate.col02": localize("tds.webview.validate.col02", "Date Patch"),
	"tds.webview.validate.col03": localize("tds.webview.validate.col02", "Date Rpo"),
};

export function patchValidates(context: vscode.ExtensionContext, args: any) {
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

		if (!currentPanel) {
			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.validate.patch',
				'Patch Validate',
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
					case 'patchValidate':
						sendPatchValidate(message.patchFile, server, currentPanel);
						break;
					case 'exportPatchValidate':
						exportPatchValidate();
						break;
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
				sendPatchValidate(args.fsPath, server, currentPanel);
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

function exportPatchValidate() {
	if (patchValidatesData) {
		let patchValidates = patchValidatesData;
		let data = "FILE".padEnd(80, ' ') + "DATE PATCH".padEnd(20, ' ') + "DATE RPO".padEnd(20, ' ') + os.EOL;
		for (let index = 0; index < patchValidates.length; index++) {
			const element = patchValidates[index];
			let output = element.name.padEnd(80, ' ') + element.date.padEnd(20, ' ') + element.size.padEnd(20, ' ');
			data += output + os.EOL;
		}
		vscode.window.showSaveDialog({ saveLabel: "Export" }).then(exportFile => {
			fs.writeFileSync(exportFile.fsPath, data);
		});
	}
}

function sendPatchValidate(patchFile, server, currentPanel) {
	if (_debugEvent) {
		vscode.window.showWarningMessage("Esta operação não é permitida durante uma depuração.")
		return;
	}
	const patchURI = vscode.Uri.file(patchFile).toString();
	languageClient.sendRequest('$totvsserver/patchValidate', {
		"patchValidateInfo": {
			connectionToken: server.token,
			authorizationToken: Utils.getAuthorizationToken(server),
			environment: server.environment,
			patchUri: patchURI,
			isLocal: true
		}
	}).then((response: any) => {
		patchValidatesData = response.patchValidates;
		currentPanel.webview.postMessage({
			command: 'setData',
			data: response.patchValidates
		});
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'patch', 'formValidatePatch.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'table_materialize.css'));
	const tableScriptPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'script', 'table_materialize.js'));
	//const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const scriptContent = fs.readFileSync(tableScriptPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML, script: scriptContent });
}