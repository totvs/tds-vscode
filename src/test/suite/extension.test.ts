//src/test/suite/extension.test.ts

import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as TDSVSCode from '../../extension';

suite('Extension Test Suite', () => {

	test('Add Server', () => {
		vscode.commands.executeCommand("totvs-developer-studio.addServer");

		const editor:vscode.TextEditor = vscode.window.activeTextEditor;

		assert.notEqual(editor, undefined);
	});


});