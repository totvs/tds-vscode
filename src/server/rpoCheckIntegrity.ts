import Utils from '../utils';
import { languageClient } from '../extension';
import * as vscode from 'vscode';
import { ResponseError } from 'vscode-languageclient';
import * as nls from 'vscode-nls';
import { _debugEvent } from '../debug';

const localize = nls.loadMessageBundle();

export function rpoCheckIntegrity() {
	const server = Utils.getCurrentServer();

	if (server) {
		if (_debugEvent) {
			vscode.window.showWarningMessage("This operation is not allowed during a debug.")
			return;
		}

		const exec: Thenable<any> =
			languageClient.sendRequest('$totvsserver/rpoCheckIntegrity', {
				"rpoCheckIntegrityInfo": {
					"connectionToken": server.token,
					"environment": server.environment
				}
			}).then((response: RpoChechIntegrityResult) => {
				if (!response.integrity) {
					vscode.window.showErrorMessage(response.message);
				} else {
					vscode.window.showInformationMessage(response.message);
				}
			}, (err: ResponseError<object>) => {
				vscode.window.showErrorMessage(err.message);
			});

		vscode.window.setStatusBarMessage("Checking RPO integrity", exec);
	} else {
		vscode.window.showErrorMessage(localize('tds.vscode.servernotconnected', 'There is no server connected'));
	}
}

class RpoChechIntegrityResult {
	integrity: boolean;
	message: string;
}
