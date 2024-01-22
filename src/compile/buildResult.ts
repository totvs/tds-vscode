import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { CompileResult } from './CompileResult';
import { CompileInfo } from './CompileInfo';

const compile = require('template-literal');

const localizeHTML = {
  'tds.webview.build.result': vscode.l10n.t('Compilation Result'),
  'tds.webview.compile.col01': vscode.l10n.t('File Name'),
  'tds.webview.compile.col02': vscode.l10n.t('Result'),
  'tds.webview.compile.col03': vscode.l10n.t('Message'),
  'tds.webview.compile.col04': vscode.l10n.t('Detail'),
  'tds.webview.compile.col05': vscode.l10n.t('Path'),
};

export function commandShowBuildTableResult(
  context: any,
  response: CompileResult
) {
  const extensionPath = context.extensionPath;
  const currentPanel = vscode.window.createWebviewPanel(
    "totvs-developer-studio.compile.result",
    "Compilation Result",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(extensionPath, "src", "compile")),
      ],
      retainContextWhenHidden: true,
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

  currentPanel.webview.onDidReceiveMessage(
    (message) => {
      switch (message.command) {
        case "getData":
          const compileInfos = response.compileInfos.map(
            (item: CompileInfo) => {
              return {
                status: item.status,
                filePath: item.filePath,
                message: item.message,
                detail: item.detail,
              };
            }
          );
          currentPanel.webview.postMessage({
            command: "setData",
            code: response.returnCode,
            data: compileInfos,
          });
          break;
        case "close":
          currentPanel.dispose();
          break;
      }
    },
    undefined,
    context.subscriptions
  );
}

function getWebViewContent(extensionPath, localizeHTML) {
  const htmlOnDiskPath = vscode.Uri.file(
    path.join(extensionPath, "src", "compile", "compileResultPage.html")
  );
  const cssOnDIskPath = vscode.Uri.file(
    path.join(extensionPath, "resources", "css", "table_materialize.css")
  );
  const tableScriptPath = vscode.Uri.file(
    path.join(extensionPath, "resources", "script", "table_materialize.js")
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOnDIskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const scriptContent = fs.readFileSync(
    tableScriptPath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({
    css: cssContent,
    localize: localizeHTML,
    script: scriptContent,
  });
}
