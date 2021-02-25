import * as vscode from 'vscode';
import { languageClient } from "../extension";
import utils from "../utils";
import * as fs from 'fs';
import Utils from "../utils";
import { showCompileResult } from "./buildResult";

var windows1252 = require('windows-1252');
var windows1251 = require('windows-1251');

import * as nls from "vscode-nls";
import { ResponseError } from "vscode-languageclient";
import { CompileResult } from "./CompileResult";
import { sendCompilation } from "../protocolMessages";
let localize = nls.loadMessageBundle();

interface CompileOptions {
  recompile: boolean;
  debugAphInfo: boolean;
  gradualSending: boolean;
  generatePpoFile: boolean;
  showPreCompiler: boolean;
  priorVelocity: boolean;
  returnPpo: boolean;
  commitWithErrorOrWarning: boolean;
}

//TODO: pegar as opções de compilação da configuração (talvez por server? ou workspace?)
function _getCompileOptionsDefault(): CompileOptions {
  let config = vscode.workspace.getConfiguration("totvsLanguageServer");
  let generatePpoFile = config.get("compilation.generatePpoFile");
  let showPreCompiler = config.get("compilation.showPreCompiler");
  let commitWithErrorOrWarning = config.get("compilation.commitWithErrorOrWarning");

  return {
    recompile: false,
    debugAphInfo: true,
    gradualSending: true,
    generatePpoFile: generatePpoFile as boolean,
    showPreCompiler: showPreCompiler as boolean,
    priorVelocity: true,
    returnPpo: false,
    commitWithErrorOrWarning: commitWithErrorOrWarning as boolean
  };
}

export function generatePpo(filePath: string, options?: any): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!filePath || filePath.length == 0) {
      reject(new Error("Undefined filePath."));
      return;
    }
    if (!fs.existsSync(filePath)) {
      reject(new Error("File '" + filePath + "' not found."));
      return;
    }

    const server = utils.getCurrentServer();
    if (!server) {
      reject(new Error("No server connected. Check if there is a server connected in 'totvs.tds-vscode' extension."));
      return;
    }

    const serverItem = utils.getServerById(server.id);
    let isAdvplsource: boolean = Utils.isAdvPlSource(filePath);
    if (!isAdvplsource) {
      reject(new Error("This file has an invalid AdvPL source file extension."));
      return;
    }

    const includes = utils.getIncludes(true, serverItem) || [];
    let includesUris: Array<string> = includes.map((include) => {
      return vscode.Uri.file(include).toString();
    });
    if (includesUris.length == 0) {
      reject(new Error("Includes undefined."));
      return;
    }

    let filesUris: Array<string> = [];
    filesUris.push(vscode.Uri.file(filePath).toString());

    //const configADVPL = vscode.workspace.getConfiguration("totvsLanguageServer");
    let extensionsAllowed: string[];
    // if (configADVPL.get("folder.enableExtensionsFilter", true)) {
    //   extensionsAllowed = configADVPL.get("folder.extensionsAllowed", []); // Le a chave especifica
    // }

    const permissionsInfos = Utils.getPermissionsInfos();

    const compileOptions = _getCompileOptionsDefault();
    compileOptions.recompile = true;
    compileOptions.generatePpoFile = false;
    compileOptions.showPreCompiler = false;
    compileOptions.returnPpo = true;

    sendCompilation(server, permissionsInfos, includesUris, filesUris, compileOptions, extensionsAllowed, isAdvplsource)
    .then(
    (response: CompileResult) => {
      if (response.compileInfos.length > 0) {
        for (let index = 0; index < response.compileInfos.length; index++) {
          const compileInfo = response.compileInfos[index];
          if (compileInfo.status === "APPRE") {
            // o compileInfo.detail chega do LS com encoding utf8
            // a extensão tds-vscode realiza a conversão para o enconding conforme informado em options.encoding
            // caso nenhum encoding seja informado, converte para o padrão AdvPL cp1252
            if (options && options.encoding) {
              let encoding: string = (<string>options.encoding).toLowerCase();
              //console.log("encoding: "+encoding);
              if (options.encoding === 'utf8') {
                resolve(compileInfo.detail);
              }
              else if (encoding === 'windows-1252' || encoding === 'cp1252') {
                //let apple = "Maçã";
                //console.log(apple);
                resolve(windows1252.encode(compileInfo.detail));
              }
              else if (encoding === 'windows-1251' || encoding === 'cp1251') {
                //let helloWorld = "Привет мир";
                //console.log(helloWorld);
                //resolve(windows1251.encode(helloWorld));
                resolve(windows1251.encode(compileInfo.detail));
              }
              else {
                // unknown encoding - fallback to utf8
                resolve(compileInfo.detail);
              }
            }
            else {
              // if there is no encoding option - use windows-1252
              resolve(windows1252.encode(compileInfo.detail));
            }
          }
        }
      }
    },
    (err: ResponseError<object>) => {
      reject(new Error(err.message));
    });
  });
}

/**
 * Builds a file.
 */
export function buildFile(
  filename: string[],
  recompile: boolean,
  context: vscode.ExtensionContext
) {
  const compileOptions = _getCompileOptionsDefault();
  compileOptions.recompile = recompile;
  buildCode(filename, compileOptions, context);
}

/**
 * Build a file list.
 */
async function buildCode(
  filesPaths: string[],
  compileOptions: CompileOptions,
  context: vscode.ExtensionContext
) {
  const server = utils.getCurrentServer();

  const configADVPL = vscode.workspace.getConfiguration("totvsLanguageServer");
  const shouldClearConsole = configADVPL.get("clearConsoleBeforeCompile");
  if (shouldClearConsole !== false) {
    languageClient.outputChannel.clear();
  }
  const showConsoleOnCompile = configADVPL.get("showConsoleOnCompile");
  if (showConsoleOnCompile !== false) {
    languageClient.outputChannel.show();
  }

  const resourcesToConfirm: vscode.TextDocument[] = vscode.workspace.textDocuments.filter(
    (d) => !d.isUntitled && d.isDirty
  );
  const count = resourcesToConfirm.length;

  if (count !== 0) {
    if (!vscode.workspace.saveAll(false)) {
      vscode.window.showWarningMessage(
        localize(
          "tds.webview.tdsBuild.canceled",
          "Operation canceled because it is not possible to save edited files."
        )
      );
      return;
    }
    vscode.window.showWarningMessage(
      localize("tds.webview.tdsBuild.saved", "Files saved successfully.")
    );
  }

  if (server) {
    //Só faz sentido processar os includes se existir um servidor selecionado onde sera compilado.
    let serverItem = utils.getServerById(server.id);
    let hasAdvplsource: boolean =
      filesPaths.filter((file) => {
        return Utils.isAdvPlSource(file);
      }).length > 0;
    let includes: Array<string> = [];

    if (hasAdvplsource) {
      includes = utils.getIncludes(true, serverItem) || [];
      if (!includes.toString()) {
        return;
      }
    }

    let includesUris: Array<string> = [];
    for (let idx = 0; idx < includes.length; idx++) {
      includesUris.push(vscode.Uri.file(includes[idx]).toString());
    }
    if (includesUris.length === 0) {
      const wp: string[] = vscode.workspace.workspaceFolders.map((uri) => {
        return uri.uri.toString();
      });
      includesUris.push(...wp);
    }

    let filesUris: Array<string> = [];
    filesPaths.forEach((file) => {
      if (!Utils.ignoreResource(file)) {
        filesUris.push(vscode.Uri.file(file).toString());
      } else {
        languageClient.warn(
          localize(
            "tds.webview.tdsBuild.resourceInList",
            "Resource appears in the list of files to ignore. Resource: {0}",
            file
            )
            );
          }
        });

        let extensionsAllowed: string[];
        if (configADVPL.get("folder.enableExtensionsFilter", true)) {
          extensionsAllowed = configADVPL.get("folder.extensionsAllowed", []); // Le a chave especifica
        }

        const permissionsInfos = Utils.getPermissionsInfos();
        sendCompilation(server, permissionsInfos, includesUris, filesUris, compileOptions, extensionsAllowed, hasAdvplsource)
        .then(
        (response: CompileResult) => {
          if (response.returnCode === 40840) {
            Utils.removeExpiredAuthorization();
          }
          if (response.compileInfos.length > 0) {
            // Exibe aba problems casa haja pelo menos um erro ou warning
            let showProblems = false;
            for (let index = 0; index < response.compileInfos.length; index++) {
              const compileInfo = response.compileInfos[index];
              if (
                compileInfo.status === "FATAL" ||
                compileInfo.status === "ERROR" ||
                compileInfo.status === "WARN"
              ) {
                showProblems = true;
                break;
              }
            }
            if (showProblems) {
              // focus
              vscode.commands.executeCommand("workbench.action.problems.focus");
            }
            if (context !== undefined) {
              verifyCompileResult(response, context);
            }
          }
        },
        (err: ResponseError<object>) => {
          vscode.window.showErrorMessage(err.message);
        }
      );
  } else {
    vscode.window.showErrorMessage(
      localize("tds.webview.tdsBuild.noServer", "No server connected")
    );
  }
}

function verifyCompileResult(response, context) {
  const textNoAsk = localize("tds.vscode.noAskAgain", "Don't ask again");
  const textNo = localize("tds.vscode.no", "No");
  const textYes = localize("tds.vscode.yes", "Yes");
  const textQuestion = localize(
    "tds.vscode.question.showCompileResult",
    "Show table with compile results?"
  );

  let questionAgain = true;

  const configADVPL = vscode.workspace.getConfiguration("totvsLanguageServer");
  const askCompileResult = configADVPL.get("askCompileResult");
  if (askCompileResult !== false) {
    vscode.window
      .showInformationMessage(textQuestion, textYes, textNo, textNoAsk)
      .then((clicked) => {
        if (clicked === textYes) {
          showCompileResult(response, context);
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
  if (context === undefined) {
    //A ação veio pelo ctrl+f9
    editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        localize(
          "tds.vscode.editornotactive",
          "No editor is active, cannot find current file to build."
        )
      );
      return;
    }
    filename = editor.document.uri.fsPath;
    recompile = true;
  }
  if (files) {
    const arrayFiles: string[] = changeToArrayString(files);
    let allFiles = Utils.getAllFilesRecursive(arrayFiles);
    buildFile(allFiles, recompile, context);
  } else {
    if (filename !== undefined) {
      buildFile([filename], recompile, context);
    }
  }
}

function changeToArrayString(allFiles) {
  let arrayFiles: string[] = [];

  allFiles.forEach((element) => {
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

export function commandBuildWorkspace(
  recompile: boolean,
  context: vscode.ExtensionContext
) {
  if (vscode.workspace.workspaceFolders) {
    let folders: string[] = [];

    vscode.workspace.workspaceFolders.forEach((value) => {
      folders.push(value.uri.fsPath);
    });

    let allFiles = Utils.getAllFilesRecursive(folders);

    buildFile(allFiles, recompile, context);
  }
}

export async function commandBuildOpenEditors(
  recompile: boolean,
  context: vscode.ExtensionContext
) {
  let delayNext = 250;
  let files: string[] = [];
  let filename: string | undefined = undefined;
  let editor = vscode.window.activeTextEditor;
  let nextEditor = editor;
  if (!editor) {
    vscode.window.showInformationMessage(
      localize(
        "tds.vscode.editornotactive",
        "No editor is active, cannot find current file to build."
      )
    );
    return;
  }
  if (editor.viewColumn) {
    filename = editor.document.uri.fsPath;
    if (files.indexOf(filename) === -1) {
      files.push(filename);
    }
  } else {
    vscode.commands.executeCommand("workbench.action.nextEditor");
    await delay(delayNext);
    editor = vscode.window.activeTextEditor;
    if (editor) {
      if (editor.viewColumn) {
        filename = editor.document.uri.fsPath;
        if (files.indexOf(filename) === -1) {
          files.push(filename);
        }
      } else {
        vscode.window.showWarningMessage(
          "[SKIPPING] Editor file is not fully open"
        );
      }
    }
  }
  do {
    vscode.commands.executeCommand("workbench.action.nextEditor");
    await delay(delayNext);
    nextEditor = vscode.window.activeTextEditor;
    if (!nextEditor) {
      // arquivo que não pode ser aberto pelo editor (binarios ou requerem confirmacao do usuario)
      continue;
    }
    if (
      nextEditor &&
      !sameEditor(editor as vscode.TextEditor, nextEditor as vscode.TextEditor)
    ) {
      if (nextEditor.viewColumn) {
        filename = nextEditor.document.uri.fsPath;
        if (files.indexOf(filename) === -1) {
          files.push(filename);
        }
      } else {
        vscode.window.showWarningMessage(
          "[SKIPPING] Editor file is not fully open"
        );
      }
    } else {
      // retornou ao primeiro editor
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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sameEditor(editor: vscode.TextEditor, nextEditor: vscode.TextEditor) {
  if (editor === undefined && nextEditor === undefined) {
    return true;
  }

  if (editor === undefined || nextEditor === undefined) {
    return false;
  }

  return editor.document === nextEditor.document;
}
