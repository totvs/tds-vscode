import Utils from '../utils';
import { languageClient, localize } from '../extension';
import * as vscode from 'vscode';
import { ResponseError } from 'vscode-languageclient';

export function defragRpo() {
	const server = Utils.getCurrentServer();

	if (server) {
		languageClient.sendRequest('$totvsserver/defragRpo', {
			"defragRpoInfo": {
				"connectionToken": server.token,
				"environment": server.environment,
				"packPatchInfo": true
			}
		}).then((response: any) => {
			// Nothing to do
		}, (err: ResponseError<object>) => {
			vscode.window.showErrorMessage(err.message);
		});
	} else {
		vscode.window.showErrorMessage(localize('tds.vscode.servernotconnected', 'There is no server connected'));
	}
}