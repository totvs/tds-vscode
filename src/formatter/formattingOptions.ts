import * as vscode from "vscode";
import { FormattingOptions } from 'vscode';

export function getFormattingOptions(langId: string): FormattingOptions {
	let cfg = vscode.workspace.getConfiguration(langId);
	let _insertSpaces: boolean | undefined = cfg.get("editor.insertSpaces");
	let _tabSize: number | undefined = cfg.get("editor.tabSize");

	if (_insertSpaces === undefined) {
		cfg = vscode.workspace.getConfiguration();
		_insertSpaces = cfg.get("editor.insertSpaces");
	}

	if (_tabSize === undefined) {
		cfg = vscode.workspace.getConfiguration();
		_tabSize = cfg.get("editor.tabSize");
	}

	return {
		insertSpaces: _insertSpaces ? _insertSpaces : false,
		tabSize: _tabSize ? _tabSize : 4
	};

}