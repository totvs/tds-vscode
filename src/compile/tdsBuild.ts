import vscode = require('vscode');
import { languageClient } from '../extension';
import utils from '../utils';
import fs = require('fs');
import Utils from '../utils';
import { showCompileResult } from './buildResult';

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

/**
 * Builds a file.
 */
export function buildFile(filename: string[], recompile: boolean, context: vscode.ExtensionContext) {
	const compileOptions = _getCompileOptionsDefault();
	compileOptions.recompile = recompile;
	buildCode(filename, compileOptions, context);
}

/**
 * Build a file list.
 */
async function buildCode(filesPaths: string[], compileOptions: CompileOptions, context: vscode.ExtensionContext) {
	const includes: Array<string> = utils.getIncludes(true) || [];
	if (!includes.toString()) {
		return;
	}

	const configADVPL = vscode.workspace.getConfiguration('totvsLanguageServer');
	const shouldClearConsole = configADVPL.get("clearConsoleBeforeCompile");
	if (shouldClearConsole !== false) {
		languageClient.outputChannel.clear();
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
			if (!Utils.ignoreResource(file)) {
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
			if(response.compileInfos.length > 1){
				verifyCompileResult(response, context);
			}
		}, (err) => {
			vscode.window.showErrorMessage(err);
		});
	} else {
		vscode.window.showErrorMessage(localize("tds.webview.tdsBuild.noServer", 'No server connected'));
	}
}

function verifyCompileResult(response, context){
	const textNoAsk = localize('tds.vscode.noAskAgain', "Don't ask again");
	const textNo = localize('tds.vscode.no', 'No');
	const textYes = localize('tds.vscode.yes', 'Yes');
	const textQuestion = localize('tds.vscode.question.showCompileResult', 'Show table with compile results?');

	let questionAgain = true;

	const configADVPL = vscode.workspace.getConfiguration('totvsLanguageServer');
	const questionEncodingConfig = configADVPL.get("askCompileResult");
	if (questionEncodingConfig !== false) {
		vscode.window.showInformationMessage(textQuestion, textYes, textNo, textNoAsk).then(clicked => {
			if (clicked === textYes) {
				showCompileResult(response.compileInfos, context);
			} else if (clicked === textNoAsk) {
				questionAgain = false;
			}
			configADVPL.update("askCompileResult", questionAgain);
		});
	}
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
		var allFiles = Utils.getAllFilesRecursive(arrayFiles);
		buildFile(allFiles, recompile, context);
	} else {
		if (filename != undefined) {
			buildFile([filename], recompile, context);
		}
	}
}

function changeToArrayString(allFiles) {
	let arrayFiles: string[] = [];

	allFiles.forEach(element => {
		if (element.fsPath) {
			arrayFiles.push(element.fsPath);
		} else {
			if (fs.existsSync(element)) {
				arrayFiles.push(element);
			}
		}
	});

	return arrayFiles;
}

export function commandBuildWorkspace(recompile: boolean, context: vscode.ExtensionContext) {
	const wfolders: vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;
	if (wfolders) {
		let folders: string[] = [];

		wfolders.forEach((value) => {
			folders.push(value.uri.fsPath);
		});

		var allFiles = Utils.getAllFilesRecursive(folders);

		buildFile(allFiles, recompile, context);
	}
}

export async function commandBuildOpenEditors(recompile: boolean, context: vscode.ExtensionContext) {
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
		buildCode(files, compileOptions, context);
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