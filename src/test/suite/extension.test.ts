import * as assert from 'assert';
import * as vscode from 'vscode';

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// function getOpenWebviews(): vscode.WebviewPanel[] {
// 	return vscode.window.visibleTextEditors
// 		.filter(editor => editor.viewType === "totvs-developer-studio.addServer"))
// 		.map(editor => editor as vscode.WebviewPanel);
// }

function getOpenWebviews(): vscode.WebviewPanel[] {
	return (vscode.window.visibleTextEditors as unknown as vscode.WebviewPanel[])
		.filter(editor => editor.viewType === "totvs-developer-studio.addServer")
		.map(editor => editor as vscode.WebviewPanel);
}
suite('Extension Test Suite', () => {

	test('Add Server', async () => {
		await vscode.commands.executeCommand("totvs-developer-studio.addServer").then(async (result: any) => {
			assert.notEqual(result, undefined);
			let times = 5;
			await sleep(2000);
			const views = getOpenWebviews();

			console.log("webview", result._getPanel());
			result._getPanel().webview.postMessage({ command: 'close' });

			assert.notEqual(result, undefined);

		});
	});

});





