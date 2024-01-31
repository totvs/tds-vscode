import * as vscode from 'vscode';
import { languageClient } from '../extension';
import * as path from 'path';
import * as fs from 'fs';
import { extensions, window, Uri, ViewColumn } from 'vscode';
import Utils, { ServersConfig } from '../utils';
import { ResponseError } from 'vscode-languageclient';
import { _debugEvent } from '../debug';
import { ServerExceptionCodes } from '../protocolMessages';

const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.deleteFile.title": vscode.l10n.t("Deleting source/resource from RPO"),
	"tds.webview.deleteFile.line1": vscode.l10n.t("In order to delete a source/resource from RPO follow these steps:"),
	"tds.webview.deleteFile.line2": vscode.l10n.t("Find source/resource in workspace"),
	"tds.webview.deleteFile.line3": vscode.l10n.t("Select source/resource with right mouse button"),
	"tds.webview.deleteFile.line4": vscode.l10n.t("Select the option 'Delete source/resource from RPO' on popup menu"),
	"tds.webview.deleteFile.line5": vscode.l10n.t("Confirm file deletion selecting the option 'YES' in the form displayed on the bottom right corner.")
};

export function deleteFileFromRPO(context: any, selectedFiles): void {
	const files = changeToArrayString(selectedFiles);

	if (context.contextValue === "serverItem") {
		const currentPanel = window.createWebviewPanel(
			'totvs-developer-studio.delete.file.fromRPO',
			vscode.l10n.t('Delete File From RPO'),
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
			window.showWarningMessage(vscode.l10n.t("Are you sure you want to delete {0} files from RPO?", allFiles.length), { modal: true }, vscode.l10n.t('Yes'), vscode.l10n.t('No')).then(clicked => {
				if (clicked === vscode.l10n.t('Yes')) {
					deletePrograms(allFiles);
				}
			});
		}
	}

	function getWebViewContent(context, localizeHTML) {

		const htmlOnDiskPath = Uri.file(path.join(context.extensionPath, 'src', 'server', 'deleteFileFromRPO.html'));
		const cssOnDIskPath = Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

		const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
		const cssContent = fs.readFileSync(cssOnDIskPath.with({ scheme: 'vscode-resource' }).fsPath);

		let runTemplate = compile(htmlContent);

		return runTemplate({ css: cssContent, localize: localizeHTML });
	}

}

function changeToArrayString(allFiles) {
	let arrayFiles: string[] = [];

	if (allFiles !== undefined) {
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
	const server = ServersConfig.getCurrentServer();
	try {
		if (server) {
			if (_debugEvent) {
				vscode.window.showWarningMessage("This operation is not allowed during a debug.")
				return;
			}
			//vscode.window.showInformationMessage("Compilação iniciada");
			languageClient.sendRequest('$totvsserver/deletePrograms', {
				"deleteProgramsInfo": {
					connectionToken: server.token,
					authorizationToken: ServersConfig.getAuthorizationToken(server),
					environment: server.environment,
					programs: programs
				}
			}).then((response: DeleteProgramResult) => {
				if (response.returnCode === ServerExceptionCodes.AuthorizationTokenExpiredError) {
					ServersConfig.removeExpiredAuthorization();
				}
			}, (err: ResponseError<object>) => {
				vscode.window.showErrorMessage(err.message);
			});
		} else {
			vscode.window.showErrorMessage(vscode.l10n.t('No server connected'));
		}
	} catch (error) {
		languageClient.error(error);
	}
}

export class DeleteProgramResult {
	returnCode: number;
}