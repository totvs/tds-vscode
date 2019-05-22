import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import Utils from '../utils';
import * as zlib from 'zlib';
import * as fs from 'fs';
import * as tmp from 'tmp';
let logFile: string;
let logStatusBarItem: vscode.StatusBarItem;

export function onCaptureLoggers(context: ExtensionContext) {

	vscode.window.showInformationMessage("Autorizo a TOTVS a colher informações do meu ambiente de desenvolvimento para fins de suporte tecnico", "Sim", "Não").then(clicked => {
		if (clicked === "Sim") {
			if (!logFile) {
				vscode.window.showInformationMessage("Iniciada a captura de Logs. Reproduza o problema e encerre o capturador.");
				const tmpFile = tmp.fileSync({ prefix: "vscode-tds-infos", postfix: ".log" });
				logFile = tmpFile.name;
				const newLine: String = "\n--------------------------------------------------\n";
				const tab = "\t";
				const fs = require('fs');

				let data = "Iniciando Log em " + new Date().toString() + newLine;
				data += "VSCode Version: " + vscode.version + "\n";
				data += tab + "AppName : " + vscode.env.appName + "\n";
				data += tab + "AppRoot : " + vscode.env.appRoot + "\n";
				data += tab + "Language : " + vscode.env.language + "\n";
				data += tab + "MachineID : " + vscode.env.machineId + "\n";
				data += tab + "SessionID : " + vscode.env.sessionId + newLine;
				data += "Path servers.json: " + Utils.getServerConfigPath() + newLine;
				data += "Content servers.json: " + JSON.stringify(Utils.getServersConfig()) + newLine;
				data += "Path launch.json: " + Utils.getLaunchConfigFile() + newLine;
				data += "Content launch.json: " + JSON.stringify(Utils.getLaunchConfig()) + newLine;
				data += "Root Path Workspace: " + vscode.workspace.rootPath + "\n";
				const work: any = vscode.workspace.workspaceFolders;
				data += tab + "Folders length: " + work.length + newLine;
				data += "All Extensions: \n";

				//A gravacao esta separada para diminuir o consumo de memoria.
				fs.appendFileSync(logFile, data, { flag: "a" }, (err) => {
					console.log(err);
				});

				//A gravacao esta separada para diminuir o consumo de memoria.
				vscode.extensions.all.forEach(element => {
					if (!element.id.startsWith("vscode.") && !element.id.startsWith("ms-vscode.")) {
						let version = tab + "ID: " + element.id + "\n";
						version += tab + "Active: " + element.isActive + "\n";
						version += tab + "PackageJSON: " + JSON.stringify(element.packageJSON) + "\n\n";

						fs.appendFileSync(logFile, version, { flag: "a" }, (err) => {
							console.log(err);
						});
					}
				});

				let final = "--------------------------------------------------\n" + "Finalizando log em " + new Date().toString() + newLine;

				//A gravacao esta separada para diminuir o consumo de memoria.
				fs.appendFileSync(logFile, final, { flag: "a" }, (err) => {
					console.log(err);
				});

				logStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
				logStatusBarItem.command = "totvs-developer-studio.logger.off";
				const str: string = "Finalizar a captura de logs.";
				logStatusBarItem.tooltip = str;
				context.subscriptions.push(logStatusBarItem);
				logStatusBarItem.text = "Capturando logs... Clique aqui para encerrar.";
				logStatusBarItem.show();
			} else {
				vscode.window.showErrorMessage("A coleta ja foi iniciada. Reproduza o problema e encerre o capturador.");
			}
			return;
		}
	});

}

export function offCaptureLoggers() {
	if (logFile) {
		const gzip = zlib.createGzip();
		const input = fs.createReadStream(logFile);

		let filePathZip: string = vscode.workspace.rootPath + '\\tdsSupport.zip';

		if (fs.existsSync(filePathZip)) {
			filePathZip = vscode.workspace.rootPath + '\\tdsSupport' + Date.now() + '.zip';
		}

		const output = fs.createWriteStream(filePathZip);
		input.pipe(gzip).pipe(output);

		logStatusBarItem.hide();

		vscode.window.showInformationMessage("Arquivo de logs gerados com sucesso em " + filePathZip);
		logFile = "";
	} else {
		vscode.window.showErrorMessage("Primeiramente inicie a captura de log");
	}
}