import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Utils, { ServersConfig } from '../utils';
import { languageClient } from '../extension';
const compile = require('template-literal');
import { ResponseError } from 'vscode-languageclient';
import { openInspectView } from "../inspect-harpia";

const localizeHTML = {
	"tds.webview.inspect.generate": vscode.l10n.t("Patch Generation"),
	"tds.webview.inspect.ignore.files": vscode.l10n.t("Ignore files"),
	"tds.webview.inspect.filter": vscode.l10n.t("Filter, ex: MAT or * All (slow)"),
	"tds.webview.inspect.clean.selected": vscode.l10n.t("Clear Selected"),
	"tds.webview.inspect.clean.all": vscode.l10n.t("Clear All"),
	"tds.webview.inspect.items": vscode.l10n.t("Items"),
	"tds.webview.inspect.directory": vscode.l10n.t("Patch Generation Directory"),
	"tds.webview.inspect.file.name.patch": vscode.l10n.t("Patch file name"),
	"tds.webview.inspect.file.name": vscode.l10n.t("File name"),
	"tds.webview.inspect.items.generate": vscode.l10n.t("Generate"),
	"tds.webview.inspect.items.generate.close": vscode.l10n.t("Generate/Close"),
	"tds.webview.inspect.message1": vscode.l10n.t("The generated patch is based on the files from RPO. Be sure that the included fonts are compiled."),
	"tds.webview.inspect.items.showing": vscode.l10n.t("Items showing")
};

export function inspectObject(context: vscode.ExtensionContext) {
	const server = ServersConfig.getCurrentServer();
	if (server) {
		if (Utils.isServerP20OrGreater(server)) {
			openInspectView(context, {
			  objectsInspector: true,
			  includeOutScope: false, //TRES
			});
		} else {
			inspectObjectLegado(context);
		}
	}
}

function inspectObjectLegado(context: vscode.ExtensionContext) {
	const server = ServersConfig.getCurrentServer();

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

		const currentPanel = vscode.window.createWebviewPanel(
      "totvs-developer-studio.inspect.object",
      "Objects Inspector",
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(extensionPath, "src", "patch")),
        ],
        retainContextWhenHidden: true,
      }
    );

		//currentPanel.webview.html = getWizardGeneratePatch(extensionPath);
		currentPanel.webview.html = getWebViewContent(context, localizeHTML);

		currentPanel.onDidDispose(
			() => {
				//currentPanel = undefined;
			},
			null,
			context.subscriptions
		);

		currentPanel.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'inspectorObjects':
					languageClient.sendRequest('$totvsserver/inspectorObjects', {
						"inspectorObjectsInfo": {
							"connectionToken": server.token,
							"environment": server.environment,
							"includeTres": true
						}
					}).then((response: any) => {
						currentPanel.webview.postMessage(response.objects);
					}, (err: ResponseError<object>) => {
						vscode.window.showErrorMessage(err.message);
					});
					return;
				case 'close':
					currentPanel.dispose();
					break;
				case 'exportData':
					const allItems = message.items[0];
					let pathFile = vscode.workspace.rootPath + "/inspectorObject.txt";
					const textString = allItems.join("\n");

					// if(fs.existsSync(pathFile)){
					if (fs.existsSync(pathFile)) {
						let r = Math.random().toString(36).substring(7);
						pathFile = vscode.workspace.rootPath + "/inspectorObject" + r + ".txt";
					}

					let setting: vscode.Uri = vscode.Uri.parse("untitled:" + pathFile);
					vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
						vscode.window.showTextDocument(a, 1, false).then(e => {
							e.edit(edit => {
								edit.insert(new vscode.Position(0, 0), textString);
							});
						});
					}, (err: ResponseError<object>) => {
						console.error(err.message);
						debugger;
					});
					break;
			}
		},
			undefined,
			context.subscriptions
		);
	} else {
		vscode.window.showErrorMessage("There is no server connected.");
	}
}


function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'inspect', 'formInspectObject.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}