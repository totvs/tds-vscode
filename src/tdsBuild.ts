import vscode = require('vscode');
import { languageClient } from './extension';
import utils from './utils';
import path = require('path');
import fs = require('fs');
import Utils from './utils';

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
	});

	return files;
}

function build(folders: string[], files: string[], recompile: boolean) {
	try {
		vscode.window.withProgress({
			location: vscode.ProgressLocation.Window,
			title: "Compilação de pastas.",
			cancellable: true,
		}, async (progress, token) => {
			token.onCancellationRequested(() => {
				return Promise.resolve(false);
			});

			//let files: string[] = [];
			progress.report({ message: localize("tds.webview.tdsBuild.listResource", 'Obtendo lista de recursos'), increment: 0 });
			if ((!files || files.length === 0) && folders.length > 0) {
				files = await getAllFiles(folders);
			}

			progress.report({ message: localize("tds.webview.tdsBuild.gettingResource", 'Getting resource list'), increment: 0 });
			{
				const compileOptions = _getCompileOptionsDefault();
				compileOptions.recompile = recompile;
				buildCode(files, compileOptions);
			}

			return Promise.resolve(true);
		}).then((result) => {
			if (result) {
				languageClient.(localize("tds.webview.tdsBuild.compileFolder", 'Folder and sub-folder compilation done.'));
			} else {
				log(localize("tds.webview.tdsBuild.compileFolder2", 'Compilation of folder and sub-folders canceled by user.'));
			}
		});
	} catch (error) {
		logError(error);
	}
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
				// const message: string  = response.message;
				// if(message == "Success"){
				// 	vscode.window.showInformationMessage("Program " + path.basename(filename) + " deleted succesfully from RPO!");
				// }else {
				// 	vscode.window.showErrorMessage(message);
				// }
			}, (err) => {
				logError(err);
			});
		} else {
			logError(localize("tds.webview.tdsBuild.noServer", 'No server connected'));
		}
	} catch (error) {
		logError(error);
	}

}

/**
 * Builds a file.
 */
export function buildFile(filename: string) {
	if (!ignoreResource(filename)) {
		log(localize("tds.webview.tdsBuild.compileBegin", "Resource compilation started. Resource: {0}", filename));
		const compileOptions = _getCompileOptionsDefault();
		compileOptions.recompile = true;
		buildCode([filename], compileOptions);
		log('Compilação de recurso finalizada.');
	} else {
		logWarning(localize("tds.webview.tdsBuild.resourceInList", "Resource appears in the list of files to ignore. Resource: {0}", filename));
	}
}

export function buildFiles(files: string[], recompile: boolean) {
	build([], files, recompile);
}

/**
 * Builds a folder.
 */
export function buildFolder(folders: string[], recompile: boolean) {
	log(localize("tds.webview.tdsBuild.compileFolder3", "Folder and sub-folder compilation started. It may take some time. Total folders: {0}", folders.length));
	build(folders, [], recompile);
	// try {
	// 	vscode.window.withProgress({
	// 		location: vscode.ProgressLocation.Window, //vscode.ProgressLocation.Notification
	// 		title: "Compilação de pastas.",
	// 		cancellable: true,
	// 	}, async (progress, token) => {
	// 		token.onCancellationRequested(() => {
	// 			return Promise.resolve(false);
	// 		});

	// 		let files: string[] = [];
	// 		progress.report({ message: 'Obtendo lista de recursos', increment: 0 });
	// 		{
	// 			files = await getAllFiles(folders);
	// 		}

	// 		progress.report({ message: 'Obtendo lista de recursos', increment: 0 });
	// 		{
	// 			const compileOptions = _getCompileOptionsDefault();
	// 			compileOptions.recompile = recompile;
	// 			buildCode(files, compileOptions);
	// 		}

	// 		return Promise.resolve(true);
	// 	}).then((result) => {
	// 		if (result) {
	// 			log('Compilação de pasta e sub-pastas finalizada.');
	// 		} else {
	// 			log('Compilação de pasta e sub-pastas cancelada por solicitação do usuário.');
	// 		}localize("tds.webview.tdsBuild.
	// 	});
	// } catch (error) {
	// 	log(error);
	// 	vscode.window.showErrorMessage(error);
	// }
}

/**
 * Build a file list.
 */
async function buildCode(filesPaths: string[], compileOptions: CompileOptions) {
	const includes: Array<string> = utils.getIncludes(true) || [];
	if (!includes.toString()) {
		return;
	}
	//TODO: verificar se a salva automática esta ativa. Se não ativa, recomendar que seja ativada
	//		const setting = this.configurationService.inspect('files.autoSave');
	//		if (vscode.workspace.getConfiguration('files.autoSave').inspect() === 'off') {
	//
	//		}

	// Por solicitação do Mansano, a salva é efetuada de forma automática, sem confirmação e sem verificação da configuração do VSCode
	//	const stateResult: EditorStateResult = await verifyEditorState();
	//	if (stateResult === EditorStateResult.SAVE) {
	const resourcesToConfirm: vscode.TextDocument[] = vscode.workspace.textDocuments.filter(d => !d.isUntitled && d.isDirty);
	const count = resourcesToConfirm.length;

	if (count !== 0) {
		if (!vscode.workspace.saveAll(false)) {
			logWarning(localize("tds.webview.tdsBuild.canceled", 'Operation canceled because it is not possible to save edited files.'));
			return;
		}
		logWarning(localize("tds.webview.tdsBuild.saved", 'Files saved successfully.'));
	}
	//	 else if (stateResult === EditorStateResult.CANCEL) {
	//		logWarning('Operação cancelada por solicitação do usuário.');
	//		return;
	//}

	const server = utils.getCurrentServer();

	if (server) {
		//vscode.window.showInformationMessage("Compilação iniciada");
		const permissionsInfos = Utils.getPermissionsInfos();
		let includesUris: Array<string> = [];
		for (let idx = 0; idx < includes.length; idx++) {
			includesUris.push(vscode.Uri.file(includes[idx]).toString());
		}
		let filesUris: Array<string> = [];
		for (let idx = 0; idx < filesPaths.length; idx++) {
			filesUris.push(vscode.Uri.file(filesPaths[idx]).toString());
		}
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
			// const results: Array<Array<string>> = response.resourceResults;
			// if(results !== undefined) {
			// 	results.forEach((element: any) => {
			// 		const message = path.parse(element.filePath).base + ": " + element.result;
			// 		const result = element.result.toUpperCase();
			// 		if (result.includes("ERR")) {
			// 			vscode.window.showErrorMessage(message);
			// 		} else {
			// 			vscode.window.showInformationMessage(message);
			// 		}
			// 	});
			// }
		}, (err) => {
			logError(err);
		});
	} else {
		logError(localize("tds.webview.tdsBuild.noServer", 'No server connected'));
	}
}

export class CompileResult {
	resourceResults: Array<Array<string>>;
}

export class DeleteProgramResult {
	message: string;
}

export function commandBuildFile(context) {
	let editor: vscode.TextEditor | undefined;
	let filename: string | undefined = undefined;
	if (context === undefined) { //A ação veio pelo ctrl+f9
		editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage(localize('tds.vscode.editornotactive', 'No editor is active, cannot find current file to build.'));
			return;
		}
		filename = editor.document.uri.fsPath;
	} else if (context.fsPath && context.fsPath !== undefined) { //A ação veio pelo menu de contexto por exemplo, e/ou com o fsPath preenchido corretamente
		filename = context.fsPath;
	}
	if (filename !== undefined) {
		buildFile(filename);
	}
}

export function commandBuildFolder(context) {
	log(context);
	buildFolder([context.fsPath], false);
}

export function commandBuildWorkspace() {
	const wfolders: vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
	if (wfolders) {
		let folders: string[] = [];

		wfolders.forEach((value) => {
			folders.push(value.uri.fsPath);
		});

		buildFolder(folders, false);
	}
}