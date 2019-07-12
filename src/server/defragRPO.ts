import Utils from '../utils';
import { languageClient, localize } from '../extension';
import * as vscode from 'vscode';

export function defragRpo() {
	const server = Utils.getCurrentServer();

	if (server) {
		languageClient.sendRequest('$totvsserver/defragRpo', {
			"defragRpoInfo": {
				"connectionToken": server.token,
				"environment": server.environment,
				"packPatchInfo": true
			}
		});
	} else {
		vscode.window.showErrorMessage(localize('tds.vscode.servernotconnected', 'There is no server connected'));
	}
}