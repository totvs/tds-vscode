import * as vscode from "vscode";
import { isUndefined } from 'util';
import { FormattingOptions } from 'vscode';

export function getFormattingOptions(): FormattingOptions {
	let cfg = vscode.workspace.getConfiguration("[advpl]");
	let _insertSpaces: boolean | undefined = cfg.get("editor.insertSpaces");
	let _tabSize: number | undefined = cfg.get("editor.tabSize");

	if (isUndefined(_insertSpaces)) {
		cfg = vscode.workspace.getConfiguration();
		_insertSpaces = cfg.get("editor.insertSpaces");
	}

	if (isUndefined(_tabSize)) {
		cfg = vscode.workspace.getConfiguration();
		_tabSize = cfg.get("editor.tabSize");
	}

	return {
		insertSpaces: _insertSpaces ? _insertSpaces : false,
		tabSize: _tabSize ? _tabSize : 4
	};

}