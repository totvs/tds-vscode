import { languageClient, settingsStatusBarItem } from '../extension';
import * as vscode from 'vscode';
import * as nls from 'vscode-nls';

let localize = nls.loadMessageBundle();

export function updateSettingsBarItem(): void {
	let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('totvsLanguageServer');
	let behavior = config.get('editor.toggle.autocomplete');

	settingsStatusBarItem.text = `${behavior}`;
	settingsStatusBarItem.tooltip = localize("tds.vscode.lssettings.auto.complete",'Auto complete type') + '  ';

	settingsStatusBarItem.show();
}

export function toggleAutocompleteBehavior() {
	let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('totvsLanguageServer');
	let behavior = config.get('editor.toggle.autocomplete');

	if (behavior === 'Basic') {
		behavior = 'LS';
	} else {
		behavior = 'Basic';
	}
	config.update('editor.toggle.autocomplete', behavior);
}

export function syncSettings() {
	let config = vscode.workspace.getConfiguration('totvsLanguageServer');

	let behavior = config.get('editor.toggle.autocomplete');
	changeSettings({ changeSettingInfo: { scope: "advpls", key: "autocomplete", value: behavior } });

	let notificationlevel = config.get('editor.show.notification');
	changeSettings({ changeSettingInfo: { scope: "advpls", key: "notificationlevel", value: notificationlevel } });
}

function changeSettings(jsonData: any) {
	languageClient.sendRequest('$totvsserver/changeSetting', jsonData);
}