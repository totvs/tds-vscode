import { languageClient, settingsStatusBarItem } from '../extension';
import * as vscode from 'vscode';

export function updateSettingsBarItem(): void {
	let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('totvsLanguageServer');
	let behavior = config.get('editor.toggle.autocomplete');

	settingsStatusBarItem.text = `Auto-complete: ${behavior}`;

	settingsStatusBarItem.show();
}

export function toglleAutocompleteBehavior() {
	let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('totvsLanguageServer');
	let behavior = config.get('editor.toggle.autocomplete');

	if (behavior === 'basic') {
		behavior = 'rpo';
	} else {
		behavior = 'basic';
	}
	config.update('editor.toggle.autocomplete', behavior);
}

export function syncSettings() {
	let config = vscode.workspace.getConfiguration('totvsLanguageServer');
	let behavior = config.get('editor.toggle.autocomplete');

	changeSettings({ enableAutoComplete: (behavior === 'rpo') });
}

function changeSettings(jsonData: any) {
	languageClient.sendRequest('$advpl/toggleFunctionalities', jsonData);
}