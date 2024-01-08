import * as assert from 'assert';
import * as vscode from 'vscode';
import { getOpenWebviews, sleep } from '../utils';

suite('Extension Basic Test Suite', () => {

	test('TDS-VSCode activating', async () => {
		const extension = vscode.extensions.getExtension('totvs.tds-vscode');

		if (!extension.isActive) {
			await extension?.activate();
			await sleep(2000);
		}

		assert.ok(extension.isActive, "TDS-VSCode extension is not active");
	});

	test.skip('Add Server', async () => {
		const uri: vscode.Uri = vscode.Uri.file("./test/suite/fixtures/addServer.json");;
		await vscode.commands.executeCommand("vscode.open", uri);

		await vscode.commands.executeCommand("totvs-developer-studio.addServer").then(async () => {
			await sleep(2000);
			//	const views = getOpenWebviews(AddServerEditorProvider.viewType);
			//	assert.equal(views.length, 1);

			//	console.dir("webview", views);
			//result._getPanel().webview.postMessage({ command: 'close' });

		});
	});

});





