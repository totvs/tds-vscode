import {extensions, window, DebugSession, debug} from 'vscode';
import { chmodSync } from 'fs';
import Utils, { MESSAGETYPE } from '../utils';
import { localize } from '../extension';

let lastProgramExecuted;
let isTableSyncEnabled = false;
let debugSession: DebugSession | undefined;

export function getDAP() {
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

export function getProgramName() {
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

export function toggleTableSync() {
	if(debugSession !== undefined) {
		let launchConfig = Utils.getLaunchConfig();
		launchConfig.configurations.forEach(launchElement => {
			if(debugSession !== undefined && launchElement.name === debugSession.name) {
				isTableSyncEnabled = !launchElement.enableTableSync;
				sendChangeTableSyncSetting();
				launchElement.enableTableSync = isTableSyncEnabled;
				if(isTableSyncEnabled) {
					Utils.logMessage(localize('tds.debug.tableSync.enabled', "Tables synchronism enabled"), MESSAGETYPE.Info,true);
				} else {
					Utils.logMessage(localize('tds.debug.tableSync.disabled', "Tables synchronism disabled"), MESSAGETYPE.Info,true);
				}
			}
		});
		Utils.saveLaunchConfig(launchConfig);
	} else {
		Utils.logMessage(
			localize('tds.debug.tableSync.disabled', "The command to (Dis)Enable the table synchronism needs an active debug session. For an initial configuration, please change the file launch.json manually"),
		MESSAGETYPE.Error,true);
	}
}

debug.onDidChangeActiveDebugSession((newDebugSession) => {
 	debugSession = newDebugSession;
})

function sendChangeTableSyncSetting(): void {
	if(debugSession === undefined) {
		debugSession = debug.activeDebugSession;
	}
	if(debugSession !== undefined) {
		const settingsArray = [
			{key:"enableTableSync", value: isTableSyncEnabled}
		];
		const arg = {settings: settingsArray};

		debugSession.customRequest("$changeSettings", arg).then((value: any) => {
			//let status = isTableSyncEnabled ? localize('tds.debug.tableSync.satus.enabled',"enabled") : localize('tds.debug.tableSync.satus.disabled',"disabled");
			//Utils.logMessage(localize('tds.debug.tableSync.satus',`Tables synchronism ${status}`) , MESSAGETYPE.Info, true);

		}).then(undefined, err => {
			console.error(err.message);
			Utils.logMessage(err.message,MESSAGETYPE.Error, true);
		 });
	}
}