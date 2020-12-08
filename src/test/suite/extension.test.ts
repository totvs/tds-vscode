import * as assert from 'assert';
import { after } from 'mocha';

import * as vscode from 'vscode';
import * as tdsvscode from '../../extension';

suite('Extension Test Suite', () => {
	after(() => {
		vscode.window.showInformationMessage('All tests done!');
	});

	test('Add new server', () => {
		vscode.commands.executeCommand(
			"totvs-developer-studio.add").then((value) => {
				console.log("OK");
				console.log(value);
			}, (reason: any) => {
				console.error("ERRO");
				console.error(reason);
			}
			);
	});


})