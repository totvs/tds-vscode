import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import Utils from './utils';
import * as nls from 'vscode-nls';
import { languageClient, totvsStatusBarItem } from './extension';
import { inputConnectionParameters } from './inputConnectionParameters';
import { inputAuthenticationParameters } from './inputAuthenticationParameters';
import { SelectServer } from './utils';
import { ResponseError } from 'vscode-languageclient';
import serverProvider, { ServerItem, EnvSection } from './serverItemProvider';
import { ConnTypeIds, sendValidationRequest, IValidationInfo, sendDisconnectRequest, ITokenInfo, sendConnectRequest, sendAuthenticateRequest, IAuthenticationInfo, sendReconnectRequest, IReconnectInfo } from './protocolMessages';

let localize = nls.loadMessageBundle();
const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.newServer.title": localize("tds.webview.newServer.title", "New Server"),
	"tds.webview.newServer.name": localize("tds.webview.newServer.name", "Server Name"),
	"tds.webview.newServer.address": localize("tds.webview.newServer.address", "Address"),
	"tds.webview.newServer.port": localize("tds.webview.newServer.port", "Port"),
	"tds.webview.newServer.save": localize("tds.webview.newServer.save", "Save"),
	"tds.webview.newServer.saveClose": localize("tds.webview.newServer.saveClose", "Save/Close"),
	"tds.webview.newServer.secure": localize("tds.webview.newServer.secure", "Secure(SSL)"),
	"tds.webview.dir.include": localize("tds.webview.dir.include", "Includes directory"),
	"tds.webview.dir.include2": localize("tds.webview.dir.include2", "Allow multiple directories")
};

export class ServersExplorer {

	constructor(context: vscode.ExtensionContext) {
		let currentPanel: vscode.WebviewPanel | undefined = undefined;

		vscode.commands.registerCommand('totvs-developer-studio.add', () => {
			if (vscode.workspace.workspaceFolders === undefined) {
				vscode.window.showErrorMessage("No folder opened.");
				return;
			}

			if (currentPanel) {
				currentPanel.reveal();
			} else {
				currentPanel = vscode.window.createWebviewPanel(
					'totvs-developer-studio.add',
					'Novo Servidor',
					vscode.ViewColumn.One,
					{
						enableScripts: true,
						localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'server'))],
						retainContextWhenHidden: true
					}
				);

				currentPanel.webview.html = getWebViewContent(context, localizeHTML);
				currentPanel.onDidDispose(
					() => {
						currentPanel = undefined;
					},
					null,
					context.subscriptions
				);

				currentPanel.webview.onDidReceiveMessage(message => {
					switch (message.command) {
						case 'checkDir':
							let checkedDir = Utils.checkDir(message.selectedDir);
							currentPanel.webview.postMessage({
								command: "checkedDir",
								checkedDir: checkedDir
							});
							break;
						case 'saveServer':
							const typeServer = "totvs_server_protheus";
							if (message.serverName && message.port && message.address) {
								const serverId = createServer(typeServer, message.serverName, message.port, message.address, 0, "", true, message.includes);
								if (serverId !== undefined) {
									sendValidationRequest(message.address, message.port)
									.then((validInfoNode: IValidationInfo) => {
										Utils.updateBuildVersion(serverId, validInfoNode.build, validInfoNode.secure);
										return;
									}, (err: ResponseError<object>) => {
										vscode.window.showErrorMessage(err.message);
									});
								}
							} else {
								vscode.window.showErrorMessage(localize("tds.webview.serversView.addServerFail", "Add Server Fail. Name, port and Address are need"));
							}

							if (currentPanel) {
								if (message.close) {
									currentPanel.dispose();
								}
							}
					}
				},
					undefined,
					context.subscriptions
				);
			}
		});

		vscode.commands.registerCommand('totvs-developer-studio.config', () => {
			if (vscode.workspace.workspaceFolders === undefined) {
				vscode.window.showErrorMessage("No folder opened.");
				return;
			}
			const servers = Utils.getServerConfigFile();
			if (servers) {
				vscode.window.showTextDocument(vscode.Uri.file(servers));
			}
		});

		// check if there is an open folder
		if (vscode.workspace.workspaceFolders === undefined) {
			vscode.window.showErrorMessage("No folder opened.");
			return;
		}

		const options: vscode.TreeViewOptions<ServerItem | EnvSection> = { treeDataProvider: serverProvider };
		vscode.window.createTreeView('totvs_server', options);
		vscode.window.registerTreeDataProvider('totvs_server', serverProvider);

		vscode.commands.registerCommand('totvs-developer-studio.connect', (serverItem: ServerItem) => {
			let ix = serverProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				//Verifica se ha um buildVersion cadastrado.
				if (serverItem.buildVersion) {
					inputConnectionParameters(context, serverItem, ConnTypeIds.CONNT_DEBUGGER, false);
				} else {
					//Há build no servidor.
					vscode.window.setStatusBarMessage(`Validando servidor [${serverItem.name}]`,
						sendValidationRequest(serverItem.address, serverItem.port)
							.then((validationInfo: IValidationInfo) => {
								//retornou uma versao valida no servidor.
								const updated = Utils.updateBuildVersion(serverItem.id, validationInfo.build, validationInfo.secure);
								serverItem.buildVersion = validationInfo.build;
								if (updated) {
									//continua a autenticacao.
									inputConnectionParameters(context, serverItem, ConnTypeIds.CONNT_DEBUGGER, false);
								} else {
									vscode.window.showErrorMessage(localize("tds.webview.serversView.couldNotConn", "Could not connect to server"));
								}
								return;
							}, (err: ResponseError<object>) => {
								vscode.window.showErrorMessage(err.message);
							})
					);
				}
			}
		});

		vscode.commands.registerCommand('totvs-developer-studio.reconnect', (serverItem: ServerItem) => {
			let ix = serverProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				//Verifica se ha um buildVersion cadastrado.
				if (serverItem.buildVersion) {
					inputConnectionParameters(context, serverItem, ConnTypeIds.CONNT_DEBUGGER, true);
				} else {
					vscode.window.showErrorMessage(localize("tds.webview.serversView.couldNotReconn", "Could not reconnect to server"));
				}
			}
		});
		
		vscode.commands.registerCommand('totvs-developer-studio.disconnect', (serverItem: ServerItem) => {
			if (serverItem.isConnected) {
				vscode.window.setStatusBarMessage(`Desconectando do servidor [${serverItem.name}]`,
					sendDisconnectRequest(serverItem)
						.then((ti: ITokenInfo) => {
							if (!ti.sucess) {
								serverProvider.connectedServerItem = undefined;
								Utils.clearConnectedServerConfig();
							}
						}, (err: ResponseError<object>) => {
							Utils.clearConnectedServerConfig();
							handleError(err);
						})
				);
			} else {
				vscode.window.showInformationMessage(localize("tds.webview.serversView.alreadyConn", "Server is already disconnected"));
			}
		});

		vscode.commands.registerCommand('totvs-developer-studio.selectenv', (environment: EnvSection) => {
			inputConnectionParameters(context, environment, ConnTypeIds.CONNT_DEBUGGER, false);
		});

		vscode.commands.registerCommand('totvs-developer-studio.delete', (serverItem: ServerItem) => {
			let ix = serverProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				Utils.deleteServer(serverItem.id);
			}
		});

		vscode.commands.registerCommand('totvs-developer-studio.delete.environment', (environmentItem: EnvSection) => {
			Utils.deleteEnvironmentServer(environmentItem);
		});

		vscode.commands.registerCommand('totvs-developer-studio.rename', (serverItem: ServerItem) => {
			let ix = serverProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				vscode.window.showInputBox({
					placeHolder: localize("tds.webview.serversView.renameServer", "Rename the server"),
					value: serverItem.label
				}).then((newName: string) => {
					Utils.updateServerName(serverItem.id, newName);
				});
			}

		});

		function createServer(typeServer: string, serverName: string, port: number, address: string, secure: number, buildVersion: string, showSucess: boolean, includes: string[]): string | undefined {
			const serverId = Utils.createNewServer(typeServer, serverName, port, address, buildVersion, secure, includes);

			if (serverId !== undefined && showSucess) {
				vscode.window.showInformationMessage(localize("tds.webview.serversView.serverSaved", "Saved server ") + serverName);
			}

			return serverId;
		}

		function getWebViewContent(context, localizeHTML) {

			const htmlOnDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'src', 'server', 'addServer.html'));
			const cssOniskPath = vscode.Uri.file(path.join(context.extensionPath, 'resources', 'css', 'form.css'));

			const htmlContent = fs.readFileSync(htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath);
			const cssContent = fs.readFileSync(cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath);

			let runTemplate = compile(htmlContent);

			return runTemplate({ css: cssContent, localize: localizeHTML });
		}
	}

}

function doFinishConnectProcess(serverItem: ServerItem, token: string, environment: string) {

	Utils.saveConnectionToken(serverItem.id, token, environment);
	Utils.saveSelectServer(serverItem.id, token, serverItem.name, environment, "");

	if (serverProvider !== undefined) {
		serverItem.currentEnvironment = environment;
		serverItem.token = token;

		serverProvider.connectedServerItem = serverItem;
	}
}

export function connectServer(serverItem: ServerItem, environment: string, connType: ConnTypeIds) {
	if (!serverItem.isConnected && serverItem.currentEnvironment ===environment) {
		vscode.window.showInformationMessage(localize("tds.webview.serversView.alreadyDisconn", "The server selected is already connected."));
	} else {

		if (serverProvider.connectedServerItem !== undefined) {
			vscode.commands.executeCommand('totvs-developer-studio.disconnect', serverProvider.connectedServerItem);
		}

		vscode.window.setStatusBarMessage(`Conectando-se ao servidor [${serverItem.name}]`,
			sendConnectRequest(serverItem, environment, connType)
				.then((result: ITokenInfo) => {
					if (result) {
						doFinishConnectProcess(serverItem, result.token, environment);
						if (result.needAuthentication) {
							inputAuthenticationParameters(serverItem, environment);
						}
					}
				}, (error) => {
					vscode.window.showErrorMessage(error);
				})
		);
	}
}

export function authenticate(serverItem: ServerItem, environment: string, username: string, password: string) {
	vscode.window.setStatusBarMessage(`Autenticando usuário [${username}] no servidor [${serverItem.name}]`,
		sendAuthenticateRequest(serverItem, environment, username, password)
			.then((result: IAuthenticationInfo) => {
				let token: string = result.token;
				return result.sucess ? token: "";
			}, (error: any) => {
				vscode.window.showErrorMessage(error);
				return false;
			}).then((token: string) => {
				if (token) {
					const connectedServerItem = serverProvider.connectedServerItem;

					connectedServerItem.currentEnvironment = environment;
					connectedServerItem.token = token;
					doFinishConnectProcess(serverItem, token, environment);
				}
			})
	);
}


export function reconnectServer(reconnectionInfo: any, environment: string, connType: ConnTypeIds): boolean {
	if (reconnectionInfo.id && reconnectionInfo.token) {
		const servers = Utils.getServersConfig();
		if (servers.configurations) {
			servers.configurations.forEach(element => {
				if (element.id === reconnectionInfo.id) {
					let serverItem: ServerItem = new ServerItem(element.name, element.type, element.address, element.port, element.secure, vscode.TreeItemCollapsibleState.None, element.id,
						element.buildVersion, element.environments, element.includes,
						{
							command: '',
							title: '',
							arguments: [element.name]
						}
					);

					const connectedServerItem = serverProvider.connectedServerItem;
					if (connectedServerItem !== undefined) {
						vscode.commands.executeCommand('totvs-developer-studio.disconnect', connectedServerItem);
					}
					vscode.window.setStatusBarMessage(`Reconectando-se ao servidor [${serverItem.name}]`,
						sendReconnectRequest(serverItem, reconnectionInfo.token, connType)
							.then((ri: IReconnectInfo) => {
								return ri.sucess;
							})
					);
				}
			});
		}
	}

	return false;
}

export function reconnectLastServer() {
	const servers = Utils.getServersConfig();
	if (servers.lastConnectedServer.id) {
		if (servers.configurations) {
			servers.configurations.forEach(element => {
				if (element.id === servers.lastConnectedServer.id) {
					let serverItem: ServerItem = new ServerItem(element.name, element.type, element.address, element.port, element.secure, vscode.TreeItemCollapsibleState.None, element.id,
						element.buildVersion, element.environments, element.includes,
						{
							command: '',
							title: '',
							arguments: [element.name]
						}
					);
					const token = servers.lastConnectedServer.token;
					reconnectServer({ serverItem, token }, servers.lastConnectedServer.environment, ConnTypeIds.CONNT_DEBUGGER);
				}
			});
		}
	}
}

class NodeError {
	code: number;
	message: string;
}

function handleError(nodeError: NodeError) {
	vscode.window.showErrorMessage(nodeError.code + ': ' + nodeError.message);
}

export function updateStatusBarItem(selectServer: SelectServer | undefined): void {
	if (selectServer) {
		totvsStatusBarItem.text = `${selectServer.name} / ${selectServer.environment}`;
	} else {
		totvsStatusBarItem.text = localize('tds.vscode.select_server_environment', '[ Selecionar servidor/ambiente ]');
	}

	totvsStatusBarItem.show();
}
