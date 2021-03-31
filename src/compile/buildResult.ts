import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as compile from 'template-literal';
import * as nls from 'vscode-nls';
import { CompileResult } from './CompileResult';

let localize = nls.loadMessageBundle();


const localizeHTML = {
	"tds.webview.build.result": localize("tds.webview.build.result", "Compilation Result"),
	"tds.webview.compile.col01": localize("tds.webview.compile.col01", "File Name"),
	"tds.webview.compile.col02": localize("tds.webview.compile.col02", "Result"),
	"tds.webview.compile.col03": localize("tds.webview.compile.col03", "Message"),
	"tds.webview.compile.col04": localize("tds.webview.compile.col04", "Detail"),
	"tds.webview.compile.col05": localize("tds.webview.compile.col05", "Path")
};

export function showCompileResult(response: CompileResult, context: any) {
	let extensionPath = "";
	if (!context.extensionPath || context.extensionPath === undefined) {
		let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
		if (ext) {
			extensionPath = ext.extensionPath;
		}
	} else {
		extensionPath = context.extensionPath;
	}

	const currentPanel = vscode.window.createWebviewPanel(
		'totvs-developer-studio.compile.result',
		'Compilation Result',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'compile'))],
			retainContextWhenHidden: true
		}
	);

	currentPanel.webview.html = getWebViewContent(extensionPath, localizeHTML);

	currentPanel.onDidDispose(
		() => {
			//currentPanel = undefined;
		},
		null,
		context.subscriptions
	);

	currentPanel.webview.onDidReceiveMessage(message => {
		switch (message.command) {
			case 'getData':
				currentPanel.webview.postMessage({
					command: "setData",
					code: response.returnCode,
					data: response.compileInfos
				});
				break;
			case 'close':
				currentPanel.dispose();
				break;
		}
	},
		undefined,
		context.subscriptions
	);
}

function getWebViewContent(extensionPath, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(extensionPath, 'src', 'compile', 'compileResultPage.html'));
	const cssOniskPath = vscode.Uri.file(path.join(extensionPath, 'resources', 'css', 'table_materialize.css'));
	const tableScriptPath = vscode.Uri.file(path.join(extensionPath, 'resources', 'script', 'table_materialize.js'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const scriptContent = fs.readFileSync(tableScriptPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML, script: scriptContent });
}