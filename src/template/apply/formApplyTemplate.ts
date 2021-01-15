import * as vscode from "vscode";
import * as path from 'path';
import * as fs from 'fs';
import Utils from "../../utils";
const compile = require('template-literal');
import * as nls from 'vscode-nls';
import { IApplyTemplateResult, sendApplyTemplateRequest } from "../../protocolMessages";
let localize = nls.loadMessageBundle();

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
	"tds.webview.template.apply": localize("tds.webview.template.apply", "Apply Template"),
}


export function openTemplateApplyView(context: vscode.ExtensionContext, args: any) {
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
				'totvs-developer-studio.template.apply',
				'Apply Template',
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
					case 'templateApply':
						templateApply(message.templateFile);
						if (message.close) {
							closeCurrentPanel();
						}
						break;
					case 'close':
						closeCurrentPanel();
						break;
				}
			},
				undefined,
				context.subscriptions
			);
		} else {
			currentPanel.reveal();
		}

		if (args && args.fsPath) {
			setTemplatePath(args.fsPath, currentPanel);
		}
	} else {
		vscode.window.showErrorMessage("There is no server connected.");
	}
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {
	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'template', 'apply', 'formApplyTemplate.html'));
	const cssOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'table_materialize.css'));
	const tableScriptPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'script', 'table_materialize.js'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const scriptContent = fs.readFileSync(tableScriptPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML, script: scriptContent });
}

function closeCurrentPanel() {
	if (currentPanel) {
		currentPanel.dispose();
	}
}

function setTemplatePath(path, currentPanel) {
	currentPanel.webview.postMessage({
		command: 'setTemplatePath',
		path: path
	});
}

function templateApply(templateFile) {
	const server = Utils.getCurrentServer();
    const includes = Utils.getIncludes(true, server) || [];
    let includesUris: Array<string> = includes.map((include) => {
      return vscode.Uri.file(include).toString();
    });
	let templateUri = vscode.Uri.file(templateFile);
	sendApplyTemplateRequest(server, includesUris, templateUri).then((response: IApplyTemplateResult) => {
		console.log(response.message);
	});
}
