import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import Utils from '../utils';

export const documentFormatting = async (resources: string[]) => {
  const resourceList: string[] = getResourceList(resources).filter(
    (resource: string) =>
      Utils.isAdvPlSource(resource) || Utils.is4glSource(resource)
  );

  if (resourceList.length === 0) {
    vscode.window.showInformationMessage('Nenhum recurso localizado.');
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Formatting',
      cancellable: true,
    },
    async (progress, token) => {
      token.onCancellationRequested(() => {
        vscode.window.showWarningMessage('Resource formatting canceled.');
      });

      const total: number = resourceList.length;
      const increment: number = 100 / total;
      let formatted: number = 0;

      for (let index = 0; index < total; index++) {
        if (token.isCancellationRequested) {
          break;
        }

        const resource: string = resourceList[index];
        const uri: vscode.Uri = vscode.Uri.file(resource);

        progress.report({
          increment: increment,
          message: `${uri.toString(false)} (${index + 1}/${total})`,
        });

        try {
          const document: vscode.TextDocument = await vscode.workspace.openTextDocument(
            uri
          );
          const editor: vscode.TextEditor = await vscode.window.showTextDocument(
            document,
            { preview: false, preserveFocus: true }
          );

          // Formata o fonte usando o comando de formatação do editor,
          // que aciona o provedor de formatação registrado (extensão ou LS).
          await vscode.commands.executeCommand('editor.action.formatDocument');
          await editor.document.save();
          formatted++;
        } catch (reason) {
          vscode.window.showErrorMessage(
            `Formatting error (${uri.toString(false)}): ${reason}`
          );
          console.log(reason);
        }
      }

      vscode.window.showInformationMessage(
        `Formatting finished. ${formatted} of ${total} files have been processed.`
      );
    }
  );
};

function getResourceList(resources: string[]): string[] {
  const resultList: string[] = [];

  resources.forEach((resourcePath: string) => {
    const fi: fs.Stats = fs.lstatSync(resourcePath);
    if (fi.isDirectory()) {
      let filenames = fs
        .readdirSync(resourcePath)
        .map<string>((filename: string) => {
          return path.join(resourcePath, filename);
        });
      resultList.push(...getResourceList(filenames));
    } else {
      resultList.push(resourcePath);
    }
  });

  return resultList;
}

import { register as R4gl } from './fourglFormatting';
import { register as RAdvpl } from './advplFormatting';

export const register4glFormatting = () =>
  R4gl({ language: '4gl', scheme: 'file' });
export const registerAdvplFormatting = () =>
  RAdvpl({ language: 'advpl', scheme: 'file' });
