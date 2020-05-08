import * as vscode from 'vscode';
import * as path from 'path';
import * as nls from 'vscode-nls';
import * as fs from 'fs';
import { languageClient, permissionStatusBarItem } from '../extension';
import {isLSInitialized} from '../TotvsLanguageClient'
import Utils from '../utils';
import { ResponseError } from 'vscode-languageclient';

let localize = nls.loadMessageBundle();
const compile = require('template-literal');
const localizeHTML = {
	"tds.webview.title": localize("tds.webview.title", "Compile Key"),
	"tds.webview.compile.machine.id": localize("tds.webview.compile.machine.id", "This Machine ID"),
	"tds.webview.compile.key.file": localize("tds.webview.compile.key.file", "Compile Key File"),
	"tds.webview.compile.key.id": localize("tds.webview.compile.key.id", "Compile Key ID"),
	"tds.webview.compile.key.generated": localize("tds.webview.compile.key.generated", "Generated"),
	"tds.webview.compile.key.expire": localize("tds.webview.compile.key.expire", "Expire"),
	"tds.webview.compile.key.token": localize("tds.webview.compile.key.token", "Token"),
	"tds.webview.compile.key.overwrite": localize("tds.webview.compile.key.overwrite", "Allow overwrite default"),
	"tds.webview.compile.key.setting": localize("tds.webview.compile.key.setting", "These settings can also be changed in"),
	"tds.webview.compile.key.validated": localize("tds.webview.compile.key.invalid", "Key successfully validated"),
	"tds.webview.compile.key.invalid": localize("tds.webview.compile.key.invalid", "Invalid key"),
}

export function compileKeyPage(context: vscode.ExtensionContext) {

	if(!isLSInitialized) {
		languageClient.onReady().then(async () => {
			initializePage(context);
		});
	} else {
		initializePage(context);
	}
}

	function initializePage(context: vscode.ExtensionContext) {

	let extensionPath = '';
	if (!context || context === undefined) {
		let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
		if (ext) {
			extensionPath = ext.extensionPath;
		}
	} else {
		extensionPath = context.extensionPath;
	}
	const currentPanel = vscode.window.createWebviewPanel(
		'totvs-developer-studio.compile.key',
		'Compile Key',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'src', 'compileKey'))],
			retainContextWhenHidden: true
		}
	);

	currentPanel.webview.html = getWebViewContent(context, localizeHTML);

	getId(currentPanel);

	const compileKey = Utils.getPermissionsInfos();
	if (compileKey !== "" && compileKey.authorizationToken && !compileKey.userId) {
		const generated = compileKey.issued;
		const expiry = compileKey.expire;
		const canOverride: boolean = compileKey.buildType == "0";
		setCurrentKey(currentPanel, compileKey.path, compileKey.machineId, generated, expiry, compileKey.tokenKey, canOverride);
	}

	currentPanel.webview.onDidReceiveMessage(message => {
		switch (message.command) {
			case 'saveKey':
				if (message.token) {
					validateKey(currentPanel, message, true);
				}
				if (message.close) {
					currentPanel.dispose();
				}
				break;
			case 'readFile':
				const compileKey = Utils.readCompileKeyFile(message.path);
				compileKey.path = message.path;
				var canOverride: boolean = compileKey.permission == "1";
				setCurrentKey(currentPanel, compileKey.path, compileKey.id, compileKey.generation, compileKey.validation, compileKey.key, canOverride);
				validateKey(currentPanel, {
					'id': compileKey.id.toUpperCase(),
					'generated': compileKey.generation,
					'expire': compileKey.validation,
					'overwrite': canOverride,
					'token': compileKey.key.toUpperCase()
				}, false);
				break;
			case 'validateKey':
				if (message.token) {
					validateKey(currentPanel, message, false);
				} else {
					vscode.window.showErrorMessage("All parameters are required for valid key");
				}
				break;
			case 'cleanKey':
				const config = Utils.getServersConfig();
				if (config.permissions.authorizationToken) {
					const infos = {
						"authorizationToken": ""
					}
					Utils.savePermissionsInfos(infos);
				}
				break;
		}
	},
		undefined,
		context.subscriptions
	);
}

function setCurrentKey(currentPanel, path, id, issued, expiry, authorizationToken, canOverride: boolean) {
	currentPanel.webview.postMessage({
		command: "setCurrentKey",
		'path': path,
		'id': id,
		'issued': issued,
		'expiry': expiry,
		'authorizationToken': authorizationToken,
		'canOverride': canOverride
	});
}

function getId(currentPanel) {
	languageClient.sendRequest('$totvsserver/getId')
		.then((response: any) => {
			if (response.id) {
				currentPanel.webview.postMessage({
					command: "setID",
					'id': response.id
				});
			}
		}, (err: ResponseError<object>) => {
			vscode.window.showErrorMessage(err.message);
		});
}

function validateKey(currentPanel, message, close: boolean) {
	if (message.token) {
		let canOverride = "0";
		if (message.overwrite == true) {
			canOverride = "1";
		}
		languageClient.sendRequest('$totvsserver/validKey', {
			"keyInfo": {
				'id': message.id,
				'issued': message.generated,
				'expiry': message.expire,
				'canOverride': canOverride,
				'token': message.token
			}
		}).then((response: any) => {
			let outputMessageText
			let outputMessageType
			if (message.path) {
				response.path = message.path;
			}
			if (response.buildType == 0 || response.buildType == 1 || response.buildType == 2) {
				response.tokenKey = message.token;
				response.machineId = message.id;
				response.issued = message.generated;
				response.expire = message.expire;
				response.userId = "";
				if (close) {
					Utils.savePermissionsInfos(response);
				}
				outputMessageText = localizeHTML["tds.webview.compile.key.validated"];
				outputMessageType = "success"
			} else {
				outputMessageText = localizeHTML["tds.webview.compile.key.invalid"]
				outputMessageType = "error"
			}
			if (!close) {
				currentPanel.webview.postMessage({
					command: "setOutputMessage",
					output: outputMessageText,
					type: outputMessageType
				});
			}
	}, (err: ResponseError<object>) => {
			vscode.window.showErrorMessage(err.message);
		});
	} else {
		vscode.window.showErrorMessage("Empty key");
	}
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {

	const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'compileKey', 'formCompileKey.html'));
	const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

	const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
	const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

	let runTemplate = compile(htmlContent);

	return runTemplate({ css: cssContent, localize: localizeHTML });
}

export function updatePermissionBarItem(infos: any | undefined): void {
	if (infos.authorizationToken) {
		const [dd, mm, yyyy] = infos.expire.split("/");
		const expiryDate: Date = new Date(`${yyyy}-${mm}-${dd} 23:59:59`);
		if (expiryDate.getTime() >= new Date().getTime()) {
			const newLine = "\n";
			permissionStatusBarItem.text = 'Permissions: Logged in';
			if (infos.machineId) {
				permissionStatusBarItem.tooltip = infos.machineId + newLine;
			}else if(infos.userId){
				permissionStatusBarItem.tooltip = infos.userId + newLine;

			}
			permissionStatusBarItem.tooltip += "Expires in " + expiryDate.toLocaleString() + newLine;

			if (infos.buildType == 0) {
				permissionStatusBarItem.tooltip += "Allow compile functions and overwrite default TOTVS";
			} else if (infos.buildType == 1) {
				permissionStatusBarItem.tooltip += "Allow only compile users functions";
			} else if (infos.buildType == 2) {
				permissionStatusBarItem.tooltip += "Allow compile functions";
			}
		} else {
			permissionStatusBarItem.text = 'Permissions: Expired in ' + expiryDate.toLocaleString();
			permissionStatusBarItem.tooltip = "";
		}
	} else {
		permissionStatusBarItem.text = 'Permissions: NOT logged in';
		permissionStatusBarItem.tooltip = "";
	}
	permissionStatusBarItem.show();
}