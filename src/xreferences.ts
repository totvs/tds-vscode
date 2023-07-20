import * as vscode from "vscode";
import type * as lsp from 'vscode-languageserver-types';

export function registerXRef(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand("advpl.showXrefs", showXrefsHandlerCmd));
}

function convertRange(range: lsp.Range): vscode.Range {
	return new vscode.Range(range.start.line, range.start.character, range.end.line, range.end.character);
}

function showXrefsHandlerCmd(kind: string, uri: vscode.Uri, position: vscode.Position, xrefArgs: any[]) {
	var locations: any[] = [];

	if (kind == "function") {
		locations = (xrefArgs).map(loc => {
			return new vscode.Location(vscode.Uri.parse(loc.uri), convertRange(loc.range));
		});
	}

	if (locations.length > 0) {
		vscode.commands.executeCommand(
			'editor.action.showReferences',
			vscode.Uri.parse(uri.toString()), position,
			locations);
	}
}
