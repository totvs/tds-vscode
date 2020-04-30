import vscode = require('vscode');
import { languageClient } from '../extension';
import path = require('path');
import fs = require('fs');
import { extensions, window, Uri, ViewColumn } from 'vscode';
import * as nls from 'vscode-nls';
import Utils from '../utils';
import { ResponseError } from 'vscode-languageclient';

let localize = nls.config({ locale: 'en' })();
const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.deleteFile.title": localize("tds.webview.deleteFile.title", "Deleting source/resource from RPO"),
	"tds.webview.deleteFile.line1": localize("tds.webview.deleteFile.line1", "In order to delete a source/resource from RPO follow these steps:"),
	"tds.webview.deleteFile.line2": localize("tds.webview.deleteFile.line2", "Find source/resource in workspace"),
	"tds.webview.deleteFile.line3": localize("tds.webview.deleteFile.line3", "Select source/recourse with rigth mouse buttom"),
	"tds.webview.deleteFile.line4": localize("tds.webview.deleteFile.line4", "Select the option 'Delete source/resource from RPO' on popup menu"),
	"tds.webview.deleteFile.line5": localize("tds.webview.deleteFile.line5", "Confirm file deletion selecting the option 'YES' in the form displayed on the bottom right corner.")
}

export function deleteFileFromRPO(context: any, selectedFiles): void {
	const files = changeToArrayString(selectedFiles);

	if (context.contextValue === "serverItem") {
		const currentPanel = window.createWebviewPanel(
			'totvs-developer-studio.delete.file.fromRPO',
			localize('tds.vscode.deleteFile', 'Delete File From RPO'),
			ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true
			}
		);
		let ext = extensions.getExtension("TOTVS.tds-vscode");
		if (ext) {
			currentPanel.webview.html = getWebViewContent(ext, localizeHTML);
		}
	} else {
		let allFiles: string[];
		if (!files) {
			if (context.fsPath && context.fsPath !== undefined) { //A ação veio pelo menu de contexto por exemplo, e/ou com o fsPath preenchido corretamente
				allFiles = [context.fsPath];
			}
		}
		allFiles = Utils.getAllFilesRecursive(files);

		if (allFiles) {
			window.showWarningMessage(localize('tds.vscode.delete_prw_file', "Are you sure you want to delete {0} files from RPO?", allFiles.length), localize('tds.vscode.yes', 'Yes'), localize('tds.vscode.no', 'No')).then(clicked => {
				if (clicked === localize('tds.vscode.yes', 'Yes')) {
					deletePrograms(allFiles);
				}
			});
		}
	}

	function getWebViewContent(context, localizeHTML) {

		const htmlOnDiskPath = Uri.file(path.join(context.extensionPath, 'src', 'server', 'deleteFileFromRPO.html'));
		const cssOniskPath = Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

		const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
		const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

		let runTemplate = compile(htmlContent);

		return runTemplate({ css: cssContent, localize: localizeHTML });
	}

}

function changeToArrayString(allFiles) {
	let arrayFiles: string[] = [];

	if(allFiles !== undefined) {
		allFiles.forEach(element => {
			if (element.fsPath) {
				arrayFiles.push(element.fsPath);
			} else {
				if (fs.existsSync(element)) {
					arrayFiles.push(element);
				}
			}
		});
	}

	return arrayFiles;
}

export function deletePrograms(programs: string[]) {
	const server = Utils.getCurrentServer();
	try {
		if (server) {
			//vscode.window.showInformationMessage("Compilação iniciada");
			const permissionsInfos = Utils.getPermissionsInfos();

			languageClient.sendRequest('$totvsserver/deletePrograms', {
				"deleteProgramsInfo": {
					"connectionToken": server.token,
					"authorizationToken": permissionsInfos.authorizationToken,
					"environment": server.environment,
					"programs": programs
				}
			}).then((response: DeleteProgramResult) => {
				if (response.returnCode == 40840) { // AuthorizationTokenExpiredError
					Utils.removeExpiredAuthorization();
				}
				// const message: string  = response.message;
				// if(message == "Success"){
				// 	vscode.window.showInformationMessage("Program " + path.basename(filename) + " deleted succesfully from RPO!");
				// }else {
				// 	vscode.window.showErrorMessage(message);
				// }
			}, (err: ResponseError<object>) => {
				vscode.window.showErrorMessage(err.message);
			});
		} else {
			vscode.window.showErrorMessage(localize("tds.webview.tdsBuild.noServer", 'No server connected'));
		}
	} catch (error) {
		languageClient.error(error);
	}
}

export class DeleteProgramResult {
	returnCode: number;
}