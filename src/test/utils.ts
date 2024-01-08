import * as vscode from 'vscode';

export function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function getOpenWebviews(viewType: string): vscode.WebviewPanel[] {
	console.dir(vscode.window.activeTextEditor);
	vscode.window.visibleTextEditors.forEach((value: vscode.TextEditor) => {
		console.dir(value.document.uri);
	});

	return [];
	// return (vscode.window.visibleTextEditors as unknown as vscode.CustomTextEditorProvider[])
	// 	.filter(editor => editor.resolveCustomTextEditor(viewType === viewType)
	// 	.map(editor => editor);
}

import * as assert from 'assert'
import * as os from 'os'
import * as path from 'path'
import { commands, Uri, window, workspace } from 'vscode'

/**
 * Opens an empty file in the workspace.
 *
 * @return Promise<vscode.Uri> A promise that resolves with the URI to
 * the empty file that was created.
 */
export async function openEmptyFile() {
	return openFile(await createFile(''))
}

/**
 * Creates a file.
 *
 * @param contents File contents.
 * @param filename Location of the file to write. If not specified,
 * it will be written to a random file in the operating system's
 * temporary directory.
 * @return Promise<string> A promise that resolves with the file path
 * to the file that was created.
 */
export async function createFile(contents: string, filename?: string) {
	filename =
		(filename && path.isAbsolute(filename) && filename) ||
		path.join(os.tmpdir(), filename || randomName())
	const uri = Uri.file(filename)

	await workspace.fs.writeFile(uri, Buffer.from(contents))
	return uri

	function randomName() {
		return Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, '')
			.substr(0, 10)
	}
}

/**
 * Opens a file in the workspace.
 *
 * @return Promise<vscode.Uri> The URI to file that was opened.
 */
export async function openFile(uri: Uri) {
	await window.showTextDocument(await workspace.openTextDocument(uri))

	assert.ok(window.activeTextEditor)

	return uri
}

/**
 * Closes all files in the workspace.
 */
export async function closeAllFiles() {
	return window.visibleTextEditors.length === 0
		? Promise.resolve()
		: commands.executeCommand('workbench.action.closeAllEditors')
}
