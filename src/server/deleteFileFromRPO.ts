/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as vscode from 'vscode';
import { languageClient } from '../extension';
import * as fs from 'fs';
import { window } from 'vscode';
import Utils, { ServersConfig } from '../utils';
import { ResponseError } from 'vscode-languageclient';
import { ServerExceptionCodes } from '../protocolMessages';

export function deleteFileFromRPO(context: any, selectedFiles): void {
	const files = changeToArrayString(selectedFiles);

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