import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import Utils from '../utils';
import * as zlib from 'zlib';
import * as fs from 'fs';
import * as tmp from 'tmp';
import * as nls from 'vscode-nls';

let localize = nls.loadMessageBundle();

var logFile: string;
let logStatusBarItem: vscode.StatusBarItem;

export function onCaptureLoggers(context: ExtensionContext) {

	vscode.window.showInformationMessage(localize("tds.vscode.logger.authorize","I authorize TOTVS to collect information from my development environment for technical support purposes"), localize("tds.vscode.logger.yes","Yes"), localize("tds.vscode.logger.no","No")).then(clicked => {
		if (clicked === localize("tds.vscode.logger.yes","Yes")) {
			if (!logFile) {
				vscode.window.showInformationMessage(localize("tds.vscode.logger.capture","Capture Logs started. Reproduce the problem and close the grabber."));
				const tmpFile = tmp.fileSync({ prefix: "vscode-tds-infos", postfix: ".log" });
				logFile = tmpFile.name;
				const newLine: String = "\n--------------------------------------------------\n";
				const tab = "\t"
				const fs = require('fs');

				var data = localize("tds.vscode.logger.starting","Starting Log on") + new Date().toString() + newLine;
				data += localize("tds.vscode.logger.version.text","VSCode Version:") + " " + vscode.version + "\n";
				data += tab + "AppName : " + vscode.env.appName + "\n";
				data += tab + "AppRoot : " + vscode.env.appRoot + "\n";
				data += tab + "Language : " + vscode.env.language + "\n";
				data += tab + "MachineID : " + vscode.env.machineId + "\n";
				data += tab + "SessionID : " + vscode.env.sessionId + newLine;
				data += localize("tds.vscode.logger.path.text","Path servers.json:") + " " + Utils.getServerConfigPath() + newLine;
				data += localize("tds.vscode.logger.content.text","Content servers.json:") + " " + JSON.stringify(Utils.getServersConfig()) + newLine;
				data += localize("tds.vscode.logger.path.launch","Path launch.json:") + " " + Utils.getLaunchConfigFile() + newLine;
				data += localize("tds.vscode.logger.content.launch","Content launch.json:") + " " + JSON.stringify(Utils.getLaunchConfig()) + newLine;
				data += localize("tds.vscode.logger.root.path","Root Path Workspace:") + " " + vscode.workspace.rootPath + "\n";
				const work: any = vscode.workspace.workspaceFolders;
				data += tab + localize("tds.vscode.logger.folders.length","Folders length:") + " " + work.length + newLine;
				data += localize("tds.vscode.logger.all.extensions","All Extensions:") + " \n";

				//A gravacao esta separada para diminuir o consumo de memoria.
				fs.appendFileSync(logFile, data, { flag: "a" }, (err) => {
					console.log(err);
				});

				//A gravacao esta separada para diminuir o consumo de memoria.
				vscode.extensions.all.forEach(element => {
					if (!element.id.startsWith("vscode.") && !element.id.startsWith("ms-vscode.")) {
						var version = tab + "ID: " + element.id + "\n";
						version += tab + localize("tds.vscode.logger.active.text","Active:") + " " + element.isActive + "\n";
						version += tab + "PackageJSON: " + JSON.stringify(element.packageJSON) + "\n\n";

						fs.appendFileSync(logFile, version, { flag: "a" }, (err) => {
							console.log(err);
						});
					}
				});

				var final = "--------------------------------------------------\n" + localize("tds.vscode.logger.ending.log","Ending log on ") + new Date().toString() + newLine;

				//A gravacao esta separada para diminuir o consumo de memoria.
				fs.appendFileSync(logFile, final, { flag: "a" }, (err) => {
					console.log(err);
				});

				logStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
				logStatusBarItem.command = "totvs-developer-studio.logger.off";
				const str: string = localize("tds.vscode.logger.finish.log","Finish log capture.");
				logStatusBarItem.tooltip = str;
				context.subscriptions.push(logStatusBarItem);
				logStatusBarItem.text = localize("tds.vscode.logger.capturing.logs","Capturing logs ... Click here to close.");
				logStatusBarItem.show();
			} else {
				vscode.window.showErrorMessage(localize("tds.vscode.logger.collection","Collection has already been started. Reproduce the problem and close the grabber."));
			}
			return;
		}
	});

}

export function offCaptureLoggers() {
	if (logFile) {
		const gzip = zlib.createGzip();
		const input = fs.createReadStream(logFile);

		var filePathZip: string = vscode.workspace.rootPath + '\\tdsSupport.zip';

		if (fs.existsSync(filePathZip)) {
			filePathZip = vscode.workspace.rootPath + '\\tdsSupport' + Date.now() + '.zip';
		}

		const output = fs.createWriteStream(filePathZip);
		input.pipe(gzip).pipe(output);

		logStatusBarItem.hide();

		vscode.window.showInformationMessage(localize("tds.vscode.logger.file.successfully","Log file successfully generated in") + filePathZip);
		logFile = "";
	} else {
		vscode.window.showErrorMessage(localize("tds.vscode.logger.first.start","First start logging"));
	}
}