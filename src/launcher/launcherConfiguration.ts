import vscode = require('vscode');
import path = require('path');
import Utils from '../utils';
import * as fs from 'fs';
import * as nls from 'vscode-nls';

let localize = nls.loadMessageBundle();
const compile = require('template-literal');

let currentPanel: vscode.WebviewPanel | undefined = undefined;
let currentLaunchersInfoContent: any | undefined;
let launcherInfoChangedManually = false;

const localizeHTML = {
	"tds.webview.launcher.welcome": localize("tds.webview.launcher.welcome","Welcome"),
	"tds.webview.launcher.launcherTitle": localize("tds.webview.launcher.launcherTitle","Launcher Config"),
	"tds.webview.launcher.name": localize("tds.webview.launcher.name","Choose launcher:"),
	"tds.webview.launcher.program": localize("tds.webview.launcher.program","Program:"),
	"tds.webview.launcher.program.arguments": localize("tds.webview.launcher.program.arguments","Arguments (-A):"),
	"tds.webview.launcher.smartclient": localize("tds.webview.launcher.smartclient","SmartClient:"),
	"tds.webview.launcher.multiThread": localize("tds.webview.launcher.multiThread","Enable multiple threads"),
	"tds.webview.launcher.profile": localize("tds.webview.launcher.profile","Enable Profile"),
	"tds.webview.launcher.multiSession": localize("tds.webview.launcher.multiSession","(-M) Multiple sessions"),
	"tds.webview.launcher.acc": localize("tds.webview.launcher.acc","(-AC) Accessibility module"),
	"tds.webview.launcher.splash": localize("tds.webview.launcher.splash","(-Q) Don't display 'splash'"),
	"tds.webview.launcher.language": localize("tds.webview.launcher.language","(-L) Language"),
	"tds.webview.launcher.langPT": localize("tds.webview.launcher.langPT","Portuguese"),
	"tds.webview.launcher.langEN": localize("tds.webview.launcher.langEN","English"),
	"tds.webview.launcher.langES": localize("tds.webview.launcher.langES","Spanish"),
	"tds.webview.launcher.langRU": localize("tds.webview.launcher.langRU","Russian"),
	"tds.webview.launcher.save": localize("tds.webview.launcher.save","Save"),
	"tds.webview.launcher.saveClose": localize("tds.webview.launcher.saveClose","Save/Close"),
	"tds.webview.launcher.bottomInfo": localize("tds.webview.launcher.bottomInfo","This config could be altered editing file"),
	"tds.webview.launcher.ignoreFiles": localize("tds.webview.launcher.ignoreFiles", "Ignore files not found in WorkSpace (debugging)")
};

export default class LauncherConfiguration {
	static show(context: vscode.ExtensionContext) {
		if (currentPanel) {
			currentPanel.reveal();
		} else {

			addLaunchJsonListener();

			currentPanel = vscode.window.createWebviewPanel(
				'totvs-developer-studio.configure.launcher',
				localize("tds.vscode.launcher.configuration",'Launcher Configuration'),
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);

			currentPanel.webview.html = getWebViewContent(context,localizeHTML);

			currentPanel.onDidDispose(() => {
					currentPanel = undefined;
				},null
			);

			currentPanel.onDidChangeViewState((event) => {
				if(currentPanel !== undefined && currentPanel.visible) {
					if(launcherInfoChangedManually) {
						launcherInfoChangedManually = false;
						currentPanel.webview.postMessage(Utils.getLaunchConfig());
					}
				}
			});

			let launchersInfo = Utils.getLaunchConfig();

			currentPanel.webview.postMessage(launchersInfo);

			currentPanel.webview.onDidReceiveMessage(message => {
				switch (message.command) {
					case 'saveLaunchConfig':
						const launcherName = message.launcherName;
						if(launchersInfo.configurations !== undefined) {
							if(launchersInfo.configurations.length > 0 !== undefined)  {
								let updated: boolean = false;
								for(let i=0 ; i < launchersInfo.configurations.length; i++) {
									let element = launchersInfo.configurations[i];
									if(element.name === launcherName) {
										updateElement(element, message);
										updated = true;
										break;
									}
								}
								if(!updated) {
									saveNewLauncher(message, launchersInfo);
								}
							} else {
								saveNewLauncher(message, launchersInfo);
							}
						}

						Utils.persistLaunchsInfo(launchersInfo);
						currentLaunchersInfoContent = fs.readFileSync(Utils.getLaunchConfigFile(),'utf8');

						if(currentPanel !== undefined) {
							currentPanel.webview.postMessage(launchersInfo);
						}

						vscode.window.showInformationMessage(localize("tds.vscode.launcher.executor","Executor") + " " +message.launcherName+ " " + localize("tds.vscode.launcher.saved","saved."));

						if (currentPanel) {
							if(message.close){
								currentPanel.dispose();
							}
						}
						return;
				}
			}, undefined);
		}
	}
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML){

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'launcher', 'launcherConfiguration.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({css: cssContent,localize: localizeHTML});
}

function updateElement(element: any, message: any) {
	element.smartclientBin = message.smartclientBin;
	element.program = message.program;
	element.programArguments = message.programArguments;
	element.enableMultiThread = message.enableMultiThread;
	element.enableProfile = message.enableProfile;
	element.isMultiSession = message.isMultiSession;
	element.isAccessibilityMode = message.isAccessibilityMode;
	element.doNotShowSplash = message.doNotShowSplash;
	element.language = message.hasLanguage ? message.language : "";
	element.ignoreFiles = message.ignoreFiles;
	element.enableTableSync = true;
}

function saveNewLauncher(message: any, launchersInfo: any): void {
	let element: any = {
		type: "totvs_language_debug",
		request: "launch",
		cwb: "${workspaceRoot}",
		name: message.launcherName
	};
	updateElement(element, message);
	launchersInfo.configurations.push(element);
}

function addLaunchJsonListener(): void {
	let launchJson = Utils.getLaunchConfigFile();

	if (!fs.existsSync(launchJson)) {
		Utils.createLaunchConfig();
	}

	if (fs.existsSync(launchJson)) {
		fs.watch(launchJson, { encoding: 'buffer' }, (eventType, filename) => {
			if (filename && eventType === 'change') {
				let tmpLaunchIfo = Utils.getLaunchConfigFile();
				let tmpContent = fs.readFileSync(tmpLaunchIfo, 'utf-8');
				if(currentLaunchersInfoContent !== tmpContent) {
					currentLaunchersInfoContent = tmpContent;
					//Nao é possivel pedir para atualizar a pagina caso ela nao esteja visivel, o que esta acontecendo
					//se entrar aqui pois o usuario alterou o launch.json manualmente.
					//Portanto apenas seta a flag para que o painel seja atualizado assim que ficar visivel.
					//Obs.: Verficar chamada: currentPanel.onDidChangeViewState(...)
					launcherInfoChangedManually = true;
				}
			}
		});
	}
}