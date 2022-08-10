import * as vscode from "vscode";
import { syncSettings } from "./server/languageServerSettings";
import { updateStatusBarItems } from "./statusBar";

export function registerWorkspace(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(() => {
			syncSettings();
			updateStatusBarItems();
		}),
		// vscode.workspace.onDidChangeWorkspaceFolders((event: vscode.WorkspaceFoldersChangeEvent) => {
		// 	console.dir(event);
		// }),
		// vscode.workspace.onDidChangeTextDocument((event: vscode.TextDocumentChangeEvent) => {
		// 	console.dir(event);
		// }),
		// vscode.workspace.onDidCreateFiles((event: vscode.FileCreateEvent) => {
		// 	console.dir(event);
		// }),
		// vscode.workspace.onDidDeleteFiles((event: vscode.FileDeleteEvent) => {
		// 	console.dir(event);
		// })
	);

	// const fsw = vscode.workspace.createFileSystemWatcher("**");
	// context.subscriptions.push(fsw);
	// fsw.onDidChange((e: vscode.Uri) => { console.dir(e) });
	// fsw.onDidCreate((e: vscode.Uri) => { console.dir(e) });
	// fsw.onDidDelete((e: vscode.Uri) => { console.dir(e) });
}