import vscode = require('vscode');
import { languageClient } from './extension';
import utils from './utils';
import path = require('path');
import fs = require('fs');
import Utils from './utils';
//import { verifyEditorState, ConfirmResult as EditorStateResult } from './verifyEditorState';

import * as nls from 'vscode-nls';
let localize = nls.loadMessageBundle();

interface CompileOptions {
	"recompile": boolean;
	"debugAphInfo": boolean;
	"gradualSending": boolean;
	"generatePpoFile": boolean;
	"showPreCompiler": boolean;
	"priorVelocity": boolean;
}

//TODO: pegar as opções de compilação da configuração (talvez por server? ou workspace?)
function _getCompileOptionsDefault(): CompileOptions {
	let config = vscode.workspace.getConfiguration("totvsLanguageServer");
	let generatePpoFile = config.get("compilation.generatePpoFile");
	let showPreCompiler = config.get("compilation.showPreCompiler");

	return {
		"recompile": false,
		"debugAphInfo": true,
		"gradualSending": true,
		"generatePpoFile": generatePpoFile as boolean,
		"showPreCompiler": showPreCompiler as boolean,
		"priorVelocity": true
	};
}

//TODO: pegar a lista de arquivos a ignorar da configuração
const ignoreListExpressions: Array<RegExp> = [];
ignoreListExpressions.push(/^\..*/ig); //começa com ponto (normalmente são de controle/configuração)
ignoreListExpressions.push(/(\.)$/ig); // sem extensão (não é possivel determinar se é fonte ou recurso)
ignoreListExpressions.push((/(\.ch)$/ig)); // arquivos de definição e trabalho
ignoreListExpressions.push((/(\.erx_.*)$/ig)); // arquivos de definição e trabalho
ignoreListExpressions.push((/(\.ppx_.*)$/ig)); // arquivos de definição e trabalho
ignoreListExpressions.push((/(\.err_.*)$/ig)); // arquivos de definição e trabalho

//lista de arquivos/pastas normalmente ignorados
ignoreListExpressions.push(/(.*)?(#.*#)$/ig);
ignoreListExpressions.push(/(.*)?(\.#*)$/ig);
ignoreListExpressions.push(/(.*)?(%.*%)$/ig);
ignoreListExpressions.push(/(.*)?(\._.*)$/ig);
ignoreListExpressions.push(/(.*)?(CVS)$/ig);
ignoreListExpressions.push(/(.*)?.*(CVS)$/ig);
ignoreListExpressions.push(/(.*)?(\.cvsignore)$/ig);
ignoreListExpressions.push(/(.*)?(SCCS)$/ig);
ignoreListExpressions.push(/(.*)?.*\/SCCS\/.*$/ig);
ignoreListExpressions.push(/(.*)?(vssver\.scc)$/ig);
ignoreListExpressions.push(/(.*)?(\.svn)$/ig);
ignoreListExpressions.push(/(.*)?(\.DS_Store)$/ig);
ignoreListExpressions.push(/(.*)?(\.git)$/ig);
ignoreListExpressions.push(/(.*)?(\.gitattributes)$/ig);
ignoreListExpressions.push(/(.*)?(\.gitignore)$/ig);
ignoreListExpressions.push(/(.*)?(\.gitmodules)$/ig);
ignoreListExpressions.push(/(.*)?(\.hg)$/ig);
ignoreListExpressions.push(/(.*)?(\.hgignore)$/ig);
ignoreListExpressions.push(/(.*)?(\.hgsub)$/ig);
ignoreListExpressions.push(/(.*)?(\.hgsubstate)$/ig);
ignoreListExpressions.push(/(.*)?(\.hgtags)$/ig);
ignoreListExpressions.push(/(.*)?(\.bzr)$/ig);
ignoreListExpressions.push(/(.*)?(\.bzrignore)$/ig);

function processIgnoreList(ignoreList: Array<RegExp>, testName: string): boolean {
	let result: boolean = false;

	for (let index = 0; index < ignoreList.length; index++) {
		const regexp = ignoreList[index];
		if (regexp.test(testName)) {
			result = true;
			break;
		}
	}

	return result;
}

function ignoreResource(fileName: string): boolean {

	return processIgnoreList(ignoreListExpressions, path.basename(fileName));
}

function getAllFiles(folders: Array<string>): string[] {
	const files: string[] = [];

	folders.forEach((folder) => {
		if (fs.lstatSync(folder).isDirectory()) {
			fs.readdirSync(folder).forEach(file => {
				if (!ignoreResource(file)) {
					const fn = path.join(folder, file);
					const ss = fs.statSync(fn);
					if (ss.isDirectory()) {
						files.push(...getAllFiles([fn]));
					} else {
						files.push(fn);
					}
				}
			});
		} else {
			files.push(folder);
		}
	});

	return files;
}
export function deletePrograms(programs: string[]) {
	const server = utils.getCurrentServer();
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
			}, (err) => {
				vscode.window.showErrorMessage(err);
			});
		} else {
			vscode.window.showErrorMessage(localize("tds.webview.tdsBuild.noServer", 'No server connected'));
		}
	} catch (error) {
		languageClient.error(error);
	}

}

/**
 * Builds a file.
 */
export function buildFile(filename: string[], recompile: boolean) {
	//languageClient.info(localize("tds.webview.tdsBuild.compileBegin", "Resource compilation started. Resource: {0}", filename));
	const compileOptions = _getCompileOptionsDefault();
	compileOptions.recompile = recompile;
	buildCode(filename, compileOptions);

	languageClient.info('Compilação de recurso finalizada.');
}

/**
 * Build a file list.
 */
async function buildCode(filesPaths: string[], compileOptions: CompileOptions) {
	const includes: Array<string> = utils.getIncludes(true) || [];
	if (!includes.toString()) {
		return;
	}

	const resourcesToConfirm: vscode.TextDocument[] = vscode.workspace.textDocuments.filter(d => !d.isUntitled && d.isDirty);
	const count = resourcesToConfirm.length;

	if (count !== 0) {
		if (!vscode.workspace.saveAll(false)) {
			vscode.window.showWarningMessage(localize("tds.webview.tdsBuild.canceled", 'Operation canceled because it is not possible to save edited files.'));
			return;
		}
		vscode.window.showWarningMessage(localize("tds.webview.tdsBuild.saved", 'Files saved successfully.'));
	}

	const server = utils.getCurrentServer();

	if (server) {
		const permissionsInfos = Utils.getPermissionsInfos();
		let includesUris: Array<string> = [];
		for (let idx = 0; idx < includes.length; idx++) {
			includesUris.push(vscode.Uri.file(includes[idx]).toString());
		}
		let filesUris: Array<string> = [];
		filesPaths.forEach(file => {
			if (!ignoreResource(file)) {
				filesUris.push(vscode.Uri.file(file).toString());
			} else {
				languageClient.warn(localize("tds.webview.tdsBuild.resourceInList", "Resource appears in the list of files to ignore. Resource: {0}", file));
			}
		});
		languageClient.sendRequest('$totvsserver/compilation', {
			"compilationInfo": {
				"connectionToken": server.token,
				"authorizationToken": permissionsInfos.authorizationToken,
				"environment": server.environment,
				"includeUris": includesUris,
				"fileUris": filesUris,
				"compileOptions": compileOptions
			}
		}).then((response: CompileResult) => {
			if (response.returnCode == 40840) {
				Utils.removeExpiredAuthorization();
			}
		}, (err) => {
			vscode.window.showErrorMessage(err);
		});
	} else {
		vscode.window.showErrorMessage(localize("tds.webview.tdsBuild.noServer", 'No server connected'));
	}
}

export class CompileInfo {
	status: string;
	filePath: string;
	message: string;
	detail: string;
}

export class CompileResult {
	returnCode: number;
	compileInfos: Array<CompileInfo>;
}

export class DeleteProgramResult {
	returnCode: number;
}

export function commandBuildFile(context, recompile: boolean, files) {
	let editor: vscode.TextEditor | undefined;
	let filename: string | undefined = undefined;
	if (context === undefined) { //A ação veio pelo ctrl+f9
		editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage(localize('tds.vscode.editornotactive', 'No editor is active, cannot find current file to build.'));
			return;
		}
		filename = editor.document.uri.fsPath;
	}
	if (files) {
		const arrayFiles: string[] = changeToArrayString(files);
		var allFiles = getAllFiles(arrayFiles);
		buildFile(allFiles, recompile);
	} else {
		if (filename != undefined) {
			buildFile([filename], recompile);
		}
	}
}

function changeToArrayString(allFiles) {
	let arrayFiles: string[] = [];

	allFiles.forEach(element => {
		if(element.fsPath){
			arrayFiles.push(element.fsPath);
		}else{
			if(fs.existsSync(element)){
				arrayFiles.push(element);
			}
		}
	});

	return arrayFiles;
}

export function commandBuildWorkspace(recompile: boolean) {
	const wfolders: vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
	if (wfolders) {
		let folders: string[] = [];

		wfolders.forEach((value) => {
			folders.push(value.uri.fsPath);
		});

		var allFiles = getAllFiles(folders);

		buildFile(allFiles, recompile);
	}
}

export async function commandBuildOpenEditors(recompile: boolean) {
	let delayNext = 250;
	let files: string[] = [];
	let filename: string | undefined = undefined;
	let editor = vscode.window.activeTextEditor;
	let nextEditor = editor;
	if (!editor) {
		vscode.window.showInformationMessage(localize('tds.vscode.editornotactive', 'No editor is active, cannot find current file to build.'));
		return;
	}
	if (editor.viewColumn) {
		filename = editor.document.uri.fsPath;
		if (files.indexOf(filename) == -1) {
			files.push(filename);
		}
	}
	else {
		vscode.commands.executeCommand("workbench.action.nextEditor");
		await delay(delayNext);
		editor = vscode.window.activeTextEditor;
		if (editor) {
			if (editor.viewColumn) {
				filename = editor.document.uri.fsPath;
				if (files.indexOf(filename) == -1) {
					files.push(filename);
				}
			}
			else {
				vscode.window.showWarningMessage("[SKIPPING] Editor file is not fully open");
			}
		}
	}
	do {
		vscode.commands.executeCommand("workbench.action.nextEditor");
		await delay(delayNext);
		nextEditor = vscode.window.activeTextEditor;
		if (nextEditor && !sameEditor(editor as vscode.TextEditor, nextEditor as vscode.TextEditor)) {
			if (nextEditor.viewColumn) {
				filename = nextEditor.document.uri.fsPath;
				if (files.indexOf(filename) == -1) {
					files.push(filename);
				}
			}
			else {
				vscode.window.showWarningMessage("[SKIPPING] Editor file is not fully open");
			}
		} else {
			break;
		}
	} while (true);
	// check if there are files to compile
	if (files.length > 0) {
		const compileOptions = _getCompileOptionsDefault();
		compileOptions.recompile = recompile;
		buildCode(files, compileOptions);
	} else {
		vscode.window.showWarningMessage("There is nothing to compile");
	}
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function sameEditor(editor: vscode.TextEditor, nextEditor: vscode.TextEditor) {
	if (editor === undefined && nextEditor === undefined) return true;
	if (editor === undefined || nextEditor === undefined) return false;
	return (editor.viewColumn === nextEditor.viewColumn) && ((editor as any)._id === (nextEditor as any)._id);
}