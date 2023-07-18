import * as vscode from "vscode";
import type * as lsp from 'vscode-languageserver-types';

export function registerXRef(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("advpl.showXrefs", showXrefsHandlerCmd));
}

function clearUri(uri: vscode.Uri): string {
	let aux = uri.toString();

	if (aux.startsWith("file:///")) { //windows é com ///!?
		aux = aux.substring(8);
	} else if (aux.startsWith("file://")) {
		aux = aux.substring(7);
	}
	aux = aux.replace("%3A", ":");

	return aux;
}

function convertRange(range: lsp.Range): vscode.Range {
	return new vscode.Range(range.start.line, range.start.character, range.end.line, range.end.character);
}

function showXrefsHandlerCmd(uri: vscode.Uri, position: vscode.Position, xrefArgs: any[]) {
	const locations = (xrefArgs).map(loc => {
		return new vscode.Location(vscode.Uri.parse(loc.uri), convertRange(loc.range));
	});

	vscode.commands.executeCommand(
		'editor.action.showReferences',
		vscode.Uri.parse(uri.toString()), position,
		locations);
}
