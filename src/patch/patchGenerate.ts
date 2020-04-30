import vscode = require('vscode');
import path = require('path');
import fs = require('fs');
import Utils from '../utils';
import { languageClient } from '../extension';
import { commandBuildFile } from '../compile/tdsBuild';
import * as nls from 'vscode-nls';
import { ResponseError } from 'vscode-languageclient';

let localize = nls.loadMessageBundle();
const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.patch.generate": localize("tds.webview.patch.generate","Patch Generation"),
	"tds.webview.patch.ignore.files": localize("tds.webview.patch.ignore.files","Ignore files"),
	"tds.webview.patch.filter": localize("tds.webview.patch.filter","Filter, ex: MAT or * All (slow)"),
	"tds.webview.patch.clean.selected": localize("tds.webview.patch.clean.selected","Clear Selected"),
	"tds.webview.patch.clean.all": localize("tds.webview.patch.clean.all","Clear All"),
	"tds.webview.patch.items": localize("tds.webview.patch.items","Items"),
	"tds.webview.patch.directory": localize("tds.webview.patch.directory","Patch Generation Directory"),
	"tds.webview.patch.file.name.patch": localize("tds.webview.patch.file.name.patch","Patch file name"),
	"tds.webview.patch.file.name": localize("tds.webview.patch.file.name","File name"),
	"tds.webview.patch.items.generate": localize("tds.webview.patch.items.generate","Generate"),
	"tds.webview.patch.items.generate.close": localize("tds.webview.patch.items.generate.close","Generate/Close"),
	"tds.webview.patch.message1": localize("tds.webview.patch.message1","The generated patch is based on the files from RPO. Be sure that the included fonts are compiled."),
	"tds.webview.patch.items.showing": localize("tds.webview.patch.items.showing","Items showing")
};

export function patchGenerate(context: vscode.ExtensionContext) {
	{
		const server = Utils.getCurrentServer();
		let extensionPath = "";
		if (!context || context === undefined) {
			let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
			if (ext) {
				extensionPath = ext.extensionPath;
			}
		} else {
			extensionPath = context.extensionPath;
		}
		if (server) {
			const currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.patchGenerate.fromRPO',
				'Patch Generate',
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'patch'))],
					retainContextWhenHidden: true
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

			const allInfoServer: any = Utils.getServerForID(server.id);

			if (allInfoServer) {
				server.address = allInfoServer.address;
				server.port = allInfoServer.port;
			}

			// currentPanel.webview.postMessage({
			// 	command: "setCurrentServer",
			// 	serverCurrent: server
			// });

			currentPanel.webview.onDidReceiveMessage(message => {
				switch (message.command) {
					case 'checkDir':
						var checkedDir = Utils.checkDir(message.selectedDir);
						currentPanel.webview.postMessage({
							command: "checkedDir",
							checkedDir: checkedDir
						});
						break;
					case 'inspectorObjects':
						//vscode.window.showInformationMessage(localize("tds.webview.sources.loading","Loading Sources from the Repository."));
						languageClient.sendRequest('$totvsserver/inspectorObjects', {
							"inspectorObjectsInfo": {
								"connectionToken": server.token,
								"environment": server.environment,
								"includeTres": true
							}
						}).then((response: ObjectsResult) => {
							// const message: string = response.message;
							// if (message == "Success") {
							// 	vscode.window.showInformationMessage(localize("tds.webview.sources.loaded","Sources loaded from the Repository: ") + response.objects.length);
								currentPanel.webview.postMessage(response.objects);
							// } else {
							// 	vscode.window.showErrorMessage(message);
							// }
						}, (err: ResponseError<object>) => {
							vscode.window.showErrorMessage(err.message);
						});
						break;
					case 'patchGenerate':
						const filesPath = message.pathFiles;
						const patchName = message.patchName;
						const patchDest = vscode.Uri.file(message.patchDest).toString();

						if (patchDest === "" || filesPath.length === 0) {
							vscode.window.showErrorMessage(localize("tds.webview.patch.generate.fail","Generate Patch Fail. Please destination directory and sources/resources list."));
						} else {
							//vscode.window.showInformationMessage(localize("tds.webview.patch.generate.start","Start Generate Patch"));
							sendPatchGenerateMessage(server, "", patchDest, 3, patchName, filesPath);
						}

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
		} else {
			vscode.window.showErrorMessage(localize("tds.webview.server.not.connected", "There is no server connected."));
		}
	}
}

export function patchGenerateFromFolder(context: any) {

	const server = Utils.getCurrentServer();
	if (!server) {
		vscode.window.showErrorMessage(localize("tds.webview.server.not.connected", "There is no server connected."));
	} else {
		const options: vscode.OpenDialogOptions = {
			canSelectMany: false,
			canSelectFiles: false,
			canSelectFolders: true,
			openLabel: localize("tds.webview.server.select.folder.to.save", "Select folder to save the Patch"),
			//filters: {
			//  'Text files': ['txt'],
			//   'All files': ['*']
			//}
		};
		vscode.window.showOpenDialog(options).then(fileUri => {
			if (!fileUri || fileUri === undefined) {
				vscode.window.showErrorMessage(localize("tds.webview.server.folder.not.selected", "Folder not selected. The process will not continue."));
			} else {
				vscode.window.showInputBox({
					placeHolder: localize("tds.webview.server.patch.name.empty", "Inform the Patch name or let empty to use the default name"),
					value: ""
				}).then((patchName) => {
					const allFilesNames: Array<string> = [];
					const allFilesFullPath: Array<string> = [];
					readFiles(context.fsPath, allFilesNames, allFilesFullPath, (err) => {
						vscode.window.showErrorMessage(err);
					});
					commandBuildFile(context, false, allFilesFullPath);
					let destFolder = fileUri[0].toString();
					sendPatchGenerateMessage(server, "", destFolder, 3, patchName, allFilesNames);
					//});
				});
			}
		});
	}

}

export class PatchResult {
	returnCode: number;
}

export class inspectorObject {
	name: string;
	type: string;
	date: string;
}

export class ObjectsResult {
	message: string;
	objects: Array<inspectorObject>;
}

// function getWizardGeneratePatch(extensionPath: string) {
// 	const htmlOnDiskPath = vscode.Uri.file(
// 		path.join(extensionPath, 'src', 'patch', 'formGenPatch.html')
// 	);

// 	const cssOniskPath = vscode.Uri.file(
// 		path.join(extensionPath, 'resources', 'css', 'form.css')
// 	);

// 	return Utils.addCssToHtml(htmlOnDiskPath, cssOniskPath);
// }

function sendPatchGenerateMessage(server, patchMaster, patchDest, patchType, patchName, filesPath) {
	const permissionsInfos = Utils.getPermissionsInfos();
	languageClient.sendRequest('$totvsserver/patchGenerate', {
		"patchGenerateInfo": {
			"connectionToken": server.token,
			"authorizationToken": permissionsInfos.authorizationToken,
			"environment": server.environment,
			"patchMaster": patchMaster,
			"patchDest": patchDest,
			"isLocal": true,
			"patchType": patchType,
			"name": patchName,
			"patchFiles": filesPath
		}
	}).then((response: PatchResult) => {
		if (response.returnCode === 40840) { // AuthorizationTokenExpiredError
			Utils.removeExpiredAuthorization();
		}
		// const message: string = response.message;
		// if (message == "Success") {
		// 	vscode.window.showInformationMessage(localize("tds.webview.patch.generate.success","Patch Generated Success "));
		// } else {
		// 	vscode.window.showErrorMessage(message);
		// }
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}

function readFiles(dirname: string, allFilesNames: Array<String>, allFilesFullPath: Array<string>, onError: any) {
	let filenames = fs.readdirSync(dirname);
	filenames.forEach(function (filename) {
		if (!Utils.ignoreResource(filename)) {
			let fullPath = path.join(dirname, filename);
			if (fs.statSync(fullPath).isDirectory() && fs.statSync(fullPath)) {
				readFiles(fullPath, allFilesNames, allFilesFullPath, onError);
			} else {
				allFilesNames.push(filename);
				allFilesFullPath.push(fullPath);
			}
		} else {
			vscode.window.showWarningMessage("File/folder '" + filename + "' was ignored.");
		}
	});
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'patch', 'formGenPatch.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}