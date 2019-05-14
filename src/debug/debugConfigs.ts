import {extensions} from 'vscode';
import { chmodSync } from 'fs';
import Utils from '../utils';
import {window} from 'vscode';
import {localize} from '../extension';

let lastProgramExecuted;

export function getDAP(){
	let pathDAP = "";
	let ext = extensions.getExtension("TOTVS.tds-vscode");
	if (ext) {
		if (process.platform === "win32") {
			pathDAP = ext.extensionPath + "\\node_modules\\@totvs\\tds-da\\bin\\windows\\debugAdapter.exe";
		}
		else if (process.platform === "linux") {
			pathDAP = ext.extensionPath + "/node_modules/@totvs/tds-da/bin/linux/debugAdapter";
			chmodSync(pathDAP, '755');
		}

	}
	return { command: pathDAP };
}

export function getProgramName(){
	let config = Utils.getLaunchConfig();
	if (config.lastProgramExecuted) {
		lastProgramExecuted = config.lastProgramExecuted;
	}
	return window.showInputBox({
		placeHolder: localize('tds.vscode.getProgramName', "Please enter the name of an AdvPL function"),
		value: lastProgramExecuted !== undefined ? lastProgramExecuted : ""
	}).then((programName) => {
		if (programName !== undefined) {
			config.lastProgramExecuted = programName;
			Utils.saveLaunchConfig(config);
		}
		//Se nao retornar o program name aqui, o debug nao funciona
		return programName;
	});
}