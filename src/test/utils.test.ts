import Utils from '../utils';
import * as vscode from 'vscode';
import * as assert from 'assert';
import * as path from 'path';

suite("Utils Tests", function() {

	// Defines a Mocha unit test
	test("getVSCodePath", function() {
		let rootPath: string = vscode.workspace.rootPath || process.cwd();
		let vscodePath: string = Utils.getVSCodePath();

		assert.equal(vscodePath, path.join(rootPath, '.vscode'));
	});

});