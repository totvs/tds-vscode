import Utils from '../utils';
import { languageClient } from '../extension';
import * as vscode from 'vscode';
import { ResponseError } from 'vscode-languageclient';
import * as nls from 'vscode-nls';

const localize = nls.loadMessageBundle();

export function rpoCheckIntegrity() {
	const server = Utils.getCurrentServer();

	if (server) {
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
	} else {
		vscode.window.showErrorMessage(localize('tds.vscode.servernotconnected', 'There is no server connected'));
	}
}

class RpoChechIntegrityResult {
	integrity: boolean;
	message: string;
}
