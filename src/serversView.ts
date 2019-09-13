import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import Utils from './utils';
import * as nls from 'vscode-nls';
import { languageClient, totvsStatusBarItem } from './extension';
import { inputConnectionParameters } from './inputConnectionParameters';
import { SelectServer } from './utils';


let localize = nls.loadMessageBundle();
const compile = require('template-literal');

const localizeHTML = {
	"tds.webview.newServer.title": localize("tds.webview.newServer.title", "New Server"),
	"tds.webview.newServer.name": localize("tds.webview.newServer.name", "Server Name"),
	"tds.webview.newServer.address": localize("tds.webview.newServer.address", "Address"),
	"tds.webview.newServer.port": localize("tds.webview.newServer.port", "Port"),
	"tds.webview.newServer.save": localize("tds.webview.newServer.save", "Save"),
	"tds.webview.newServer.saveClose": localize("tds.webview.newServer.saveClose", "Save/Close")
}

export let connectedServerItem: ServerItem | undefined;

export class ServerItemProvider implements vscode.TreeDataProvider<ServerItem | EnvSection> {

	private _onDidChangeTreeData: vscode.EventEmitter<ServerItem | EnvSection | undefined> = new vscode.EventEmitter<ServerItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ServerItem | EnvSection | undefined> = this._onDidChangeTreeData.event;

	public localServerItems: Array<ServerItem>;

	constructor() {
		this.addServersConfigListener();
		this.addLaunchJsonListener();
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: ServerItem | EnvSection): vscode.TreeItem {
		if (element instanceof ServerItem) {
			let iconPath = {
				light: path.join(__filename, '..', '..', 'resources', 'light', connectedServerItem !== undefined && element.id === connectedServerItem.id ? 'server.connected.svg' : 'server.svg'),
				dark: path.join(__filename, '..', '..', 'resources', 'dark', connectedServerItem !== undefined && element.id === connectedServerItem.id ? 'server.connected.svg' : 'server.svg')
			};
			element.iconPath = iconPath;
		}
		return element;
	}

	getChildren(element?: ServerItem): Thenable<ServerItem[] | EnvSection[]> {
		if (element) {
			if (element.environments) {
				return Promise.resolve(element.environments);
			}
			else {

				const servers = Utils.getServersConfig();
				const listOfEnvironments = servers.configurations[element.id].environments;
				if (listOfEnvironments.size > 0) {
					treeDataProvider.localServerItems[element.id].environments = listOfEnvironments.map(env => new EnvSection(env, element.label, vscode.TreeItemCollapsibleState.None, {
						command: 'totvs_server.selectEnvironment',
						title: '',
						arguments: [env]
					}));
					treeDataProvider.localServerItems[element.id].collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
					//Workaround: Bug que nao muda visualmente o collapsibleState se o label permanecer intalterado
					treeDataProvider.localServerItems[element.id].label = treeDataProvider.localServerItems[element.id].label.endsWith(' ') ? treeDataProvider.localServerItems[element.id].label.trim() : treeDataProvider.localServerItems[element.id].label + ' ';
					treeDataProvider.refresh();
					element.environments = listOfEnvironments;
					Promise.resolve(new EnvSection(element.label, element.currentEnvironment, element.collapsibleState, undefined, listOfEnvironments));
				}
				else {
					return Promise.resolve([]);
				}
			}
		} else {
			if (!this.localServerItems) {
				const serverConfig = Utils.getServersConfig();
				if (serverConfig.configurations.length <= 0) { //se o servers.json existe
					this.localServerItems = this.setConfigWithSmartClient();
				} else {
					this.localServerItems = this.setConfigWithServerConfig();
				}

			}
		}

		return Promise.resolve(this.localServerItems.sort((srv1, srv2) => {
			const label1 = srv1.label.toLowerCase();
			const label2 = srv2.label.toLowerCase();
			if (label1 > label2) { return 1; }
			if (label1 < label2) { return -1; }
			return 0;
		}));
	}

	private addServersConfigListener(): void {
		let serversJson = Utils.getServerConfigFile();
		if (!fs.existsSync(serversJson)) {
			Utils.createServerConfig();
		}
		//Caso o arquivo servers.json seja encontrado, registra o listener já na inicialização.
		fs.watch(serversJson, { encoding: 'buffer' }, (eventType, filename) => {
			if (filename && eventType === 'change') {
				this.localServerItems = this.setConfigWithServerConfig();
				this.refresh();
			}
		});
	}

	private addLaunchJsonListener(): void {
		let launchJson = Utils.getLaunchConfigFile();

		if (!fs.existsSync(launchJson)) {
			Utils.createLaunchConfig();
		}

		if (fs.existsSync(launchJson)) { //Caso o arquivo launch.json seja encontrado, registra o listener já na inicialização.
			fs.watch(launchJson, { encoding: 'buffer' }, (eventType, filename) => {
				const serverConfig = Utils.getServersConfig();
				if (filename && eventType === 'change') {
					if (serverConfig.configurations.length > 0) {
						this.localServerItems = this.setConfigWithServerConfig();
					} else {
						this.localServerItems = this.setConfigWithSmartClient();
					}
					this.refresh();
				}
			});
		}
	}

	/**
	 * Cria os itens da arvore de servidores a partir da leitura do arquivo servers.json
	 */
	private setConfigWithServerConfig() {
		const serverConfig = Utils.getServersConfig();
		const serverItem = (serverItem: string, address: string, port: number, id: string, buildVersion: string, environments: Array<EnvSection>): ServerItem => {
			return new ServerItem(serverItem, address, port, vscode.TreeItemCollapsibleState.None, id, buildVersion, environments, {
				command: '',
				title: '',
				arguments: [serverItem]
			});
		};
		const listServer = new Array<ServerItem>();

		serverConfig.configurations.forEach(element => {
			let environmentsServer = new Array<EnvSection>();
			if (element.environments) {
				element.environments.forEach(environment => {
					const env = new EnvSection(environment, element.name, vscode.TreeItemCollapsibleState.None,
						{ command: 'totvs_server.selectEnvironment', title: '', arguments: [environment] }, environment);
					environmentsServer.push(env);
				});
			}

			listServer.push(serverItem(element.name, element.address, element.port, element.id, element.buildVersion, environmentsServer));
			listServer[listServer.length - 1].collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
		});

		return listServer;
	}

	/**
	 * Inicia a arvore de servidores lendo o conteudo do smartclient.ini e
	 * cria o arquivo servers.json
	 */
	private setConfigWithSmartClient() {
		const config = Utils.getLaunchConfig();
		const configs = config.configurations;

		if (!configs) {
			return new Array<ServerItem>();
		}

		let scBinConf;
		configs.forEach(element => {
			if (element.type === 'totvs_language_debug') {
				scBinConf = element.smartclientBin;
			}
		});

		if (scBinConf) {
			const scIniPath = path.join(
				path.dirname(scBinConf),
				path.win32.basename(scBinConf, path.extname(scBinConf)) + '.ini'
			);
			if (this.pathExists(scIniPath)) {
				const serverItems = this.getTCPSecsInIniFile(scIniPath);
				this.saveServers(serverItems);
				return serverItems;
			} else {
				vscode.window.showInformationMessage(localize("tds.webview.serversView.invalidJson", 'launch.json has an invalid smartclientBin configuration.'));
				return new Array<ServerItem>();
			}
		} else {
			vscode.window.showInformationMessage(localize("tds.webview.serversView.addAttrib", 'Add an attribute smartclientBin with a valid SmartClient path and the executable file name on launch.json.'));
			return new Array<ServerItem>();
		}
	}

	private saveServers(serverItems: ServerItem[]) {
		Utils.createServerConfig();

		serverItems.forEach(element => {
			/*const id = */Utils.createNewServer("totvs_server_protheus", element.label, element.port, element.address, element.buildVersion);

			//A principio parece ser um exagero tentar validar TODOS os servidores ao salvar.
			//Caso essa informação venha do ini do smartclient por exemplo, pode ter um numero muito
			//grande de servidores cadastrados e esse processo fica bastante lento, pois caso o usuario peça
			//para conectar um servidor, o LS tera que processar todas essas requisições que ja estarao na fila
			//das mensagens para enfim processar a mensagem de conexão.

			// languageClient.sendRequest('$totvsserver/validation', {
			// 	validationInfo: {
			// 		server: element.address,
			// 		port: element.port
			// 	}
			// }).then((validInfoNode: NodeInfo) => {
			// 	if (id) {
			// 		Utils.updateBuildVersion(id, validInfoNode.buildVersion);
			// 	}
			// 	return;
			// });

		});
	}

	/**
	 * Given the path to smartclient.ini, read all its TCP Sections.
	 */
	private getTCPSecsInIniFile(scIniPath: string): ServerItem[] {
		if (this.pathExists(scIniPath)) {

			const toTCPSec = (serverItem: string, address: string, port: number, id: string, buildVersion: string): ServerItem => {
				return new ServerItem(serverItem, address, port, vscode.TreeItemCollapsibleState.None, id, buildVersion, undefined, {
					command: 'totvs-developer-studio.selectNode',
					title: '',
					arguments: [serverItem]
				});
			};

			const scIniFileFs = fs.readFileSync(scIniPath, 'utf-8');

			let re = /^\[[^\]\r\n]+](?:\r?\n(?:[^[\r\n].*)?)*/igm;
			let matches = re.exec(scIniFileFs);

			const tcpSecs = new Array<ServerItem>();

			while ((matches = re.exec(scIniFileFs)) !== null) {
				let match = matches[0];
				let address = /^SERVER\s?=(?:\s+)?(.+)/im.exec(match);
				let port = /^PORT\s?=(?:\s+)?(.+)/im.exec(match);

				if ((address !== null) && (port !== null)) {
					let key = /^\[(.+)\]/igm.exec(match);

					if (key !== null) {
						tcpSecs.push(toTCPSec(key[1], address[1], parseInt(port[1]), Utils.generateRandomID(), ""));
					}
				}
			}
			this.localServerItems = tcpSecs;
			return tcpSecs;
		} else {
			return [];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}

		return true;
	}

}

export class ServerItem extends vscode.TreeItem {

	public isConnected: boolean = false;
	public token: string;
	public currentEnvironment: string;

	constructor(
		public label: string,
		public readonly address: string,
		public readonly port: number,
		public collapsibleState: vscode.TreeItemCollapsibleState,
		public id: string,
		public buildVersion: string,
		public environments?: Array<EnvSection>,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `Server=${this.address} | Port=${this.port}`;
	}

	get description(): string {
		return `${this.address}:${this.port}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', connectedServerItem !== undefined && this.id === connectedServerItem.id ? 'server.connected.svg' : 'server.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', connectedServerItem !== undefined && this.id === connectedServerItem.id ? 'server.connected.svg' : 'server.svg')
	};

	contextValue = 'serverItem';
}

export class EnvSection extends vscode.TreeItem {

	constructor(
		public label: string,
		public readonly serverItemParent: string,
		public collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public environments?: string[]
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}: ${this.serverItemParent}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', connectedServerItem !== undefined && connectedServerItem.currentEnvironment == this.label ? 'environment.connected.svg' : 'environment.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', connectedServerItem !== undefined && connectedServerItem.currentEnvironment == this.label ? 'environment.connected.svg' : 'environment.svg')
	};

	contextValue = 'envSection';
}

const treeDataProvider = new ServerItemProvider();
export class ServersExplorer {

	constructor(context: vscode.ExtensionContext) {
		vscode.window.createTreeView('totvs_server', { treeDataProvider });

		vscode.window.registerTreeDataProvider('totvs_server', treeDataProvider);
		vscode.commands.registerCommand('totvs-developer-studio.connect', (serverItem: ServerItem) => {
			let ix = treeDataProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				//Verifica se ha um buildVersion cadastrado.
				if (serverItem.buildVersion) {
					inputConnectionParameters(context, serverItem);
				} else {
					//Há build no servidor.
					languageClient.sendRequest('$totvsserver/validation', {
						validationInfo: {
							server: serverItem.address,
							port: serverItem.port
						}
					}).then((validInfoNode: NodeInfo) => {
						//retornou uma versao valida no servidor.
						const updated = Utils.updateBuildVersion(serverItem.id, validInfoNode.buildVersion);
						serverItem.buildVersion = validInfoNode.buildVersion;
						if (updated) {
							//continua a autenticacao.
							inputConnectionParameters(context, serverItem);
						} else {
							vscode.window.showErrorMessage(localize("tds.webview.serversView.cloudNotConn", "Cloud not connect to server"));
						}
						return;
					}, (err) => {
						vscode.window.showErrorMessage(err.message);
					});
				}
			}
		});
		vscode.commands.registerCommand('totvs-developer-studio.disconnect', (serverItem: ServerItem) => {
			if (connectedServerItem !== undefined && serverItem.id === connectedServerItem.id) {
				languageClient.sendRequest('$totvsserver/disconnect', {
					disconnectInfo: {
						connectionToken: connectedServerItem.token,
						serverName: connectedServerItem.label
					}
				}).then((disconnectInfo: DisconnectReturnInfo) => {
					if (disconnectInfo !== undefined && disconnectInfo.code === undefined) {
						connectedServerItem = undefined;
						Utils.clearConnectedServerConfig();
						if (treeDataProvider !== undefined) {
							treeDataProvider.refresh();
						}
					}
				}, (err) => {
					Utils.clearConnectedServerConfig();
					if (treeDataProvider !== undefined) {
						treeDataProvider.refresh();
					}
					handleError(err);
				});
			} else {
				vscode.window.showInformationMessage(localize("tds.webview.serversView.alreadyConn", "Server is already disconnected"));
			}
		});
		vscode.commands.registerCommand('totvs-developer-studio.selectenv', (environment: EnvSection) => {
			const config = vscode.workspace.getConfiguration("launch", null);
			const configs = config.get<any[]>("configurations");
			if (configs) {
				configs.forEach(element => {
					if (element.type === 'totvs_language_debug') {
						element.serverItem = environment.serverItemParent.trim();
						element.environment = environment.label;
					}
				});
				config.update("configurations", configs);
			}
			/**
			 * TODO: Aplicar a seleção a partir do menu de contexto dos environments listados
			 */

		});

		let currentPanel: vscode.WebviewPanel | undefined = undefined;

		vscode.commands.registerCommand('totvs-developer-studio.delete', (serverItem: ServerItem) => {
			let ix = treeDataProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				Utils.deleteServer(serverItem.id);
			}

		});

		vscode.commands.registerCommand('totvs-developer-studio.rename', (serverItem: ServerItem) => {
			let ix = treeDataProvider.localServerItems.indexOf(serverItem);
			if (ix >= 0) {
				vscode.window.showInputBox({
					placeHolder: localize("tds.webview.serversView.renameServer", "Rename the server"),
					value: serverItem.label
				}).then((newName: string) => {
					Utils.updateServerName(serverItem.id, newName)
				});
			}

		})

		vscode.commands.registerCommand('totvs-developer-studio.add', () => {

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
						case 'saveServer':
							const typeServer = "totvs_server_protheus";
							if (message.serverName && message.port && message.address) {
								const serverId = createServer(typeServer, message.serverName, message.port, message.address, "", true);
								if (serverId !== undefined) {
									languageClient.sendRequest('$totvsserver/validation', {
										validationInfo: {
											server: message.address,
											port: parseInt(message.port),
										}
									}).then((validInfoNode: NodeInfo) => {
										Utils.updateBuildVersion(serverId, validInfoNode.buildVersion);
										return;
									}, (err) => {
										vscode.window.showErrorMessage(err);
									})
								}
							} else {
								vscode.window.showErrorMessage(localize("tds.webview.serversView.addServerFail", "Add Server Fail. Name, port and Address are need"))
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
			const servers = Utils.getServerConfigFile();
			if (servers) {
				vscode.window.showTextDocument(vscode.Uri.file(servers));
			}
		});

		function createServer(typeServer: string, serverName: string, port: number, address: string, buildVersion: string, showSucess: boolean): string | undefined {
			const serverId = Utils.createNewServer(typeServer, serverName, port, address, buildVersion);

			if (treeDataProvider !== undefined) {
				treeDataProvider.refresh();
			}
			if (serverId != undefined && showSucess) {
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

export function authenticate(serverItem: ServerItem, environment: string, username: string, password: string) {
	if (connectedServerItem !== undefined && connectedServerItem.id === serverItem.id && connectedServerItem.currentEnvironment === serverItem.currentEnvironment) {
		vscode.window.showInformationMessage(localize("tds.webview.serversView.alreadyDisconn", "The server selected is already connected."));
	}
	//vscode.window.showInformationMessage("Initializing connection with server " + serverItem.label);
	if (connectedServerItem !== undefined) {
		vscode.commands.executeCommand('totvs-developer-studio.disconnect', connectedServerItem).then(() => {
			sendAuthenticateRequest(serverItem, environment, username, password);
		});
	} else {
		sendAuthenticateRequest(serverItem, environment, username, password);
	}
}

function sendAuthenticateRequest(serverItem: ServerItem, environment: string, user: string, password: string) {
	languageClient.sendRequest('$totvsserver/authentication', {
		authenticationInfo: {
			connType: 1,
			identification: serverItem.id,
			server: serverItem.address,
			port: serverItem.port,
			buildVersion: serverItem.buildVersion,
			environment: environment,
			user: user,
			password: password,
			autoReconnect: true
		}
	}).then((authenticationNode: AuthenticationNode) => {
		let token: string = authenticationNode.connectionToken;
		if (token) {
			//vscode.window.showInformationMessage('Server ' + serverItem.label + ' connected!');
			Utils.saveSelectServer(serverItem.id, token, serverItem.label, environment, user);
			Utils.saveConnectionToken(serverItem.id, token, environment);
			if (treeDataProvider !== undefined) {
				connectedServerItem = serverItem;
				connectedServerItem.currentEnvironment = environment;
				connectedServerItem.token = token;
				treeDataProvider.refresh();
			}
			return true;
		} else {
			vscode.window.showErrorMessage(localize("tds.webview.serversView.errorConnServer", 'Error connecting server'));
			return false;
		}
	}, err => {
		vscode.window.showErrorMessage(err);
	});
}

export class AuthenticationNode {
	// These properties come directly from the language server.
	id: any;
	osType: number;
	connectionToken: string;
}

export function reconnectServer(reconnectionInfo): boolean {
	if (reconnectionInfo.id && reconnectionInfo.token) {
		const servers = Utils.getServersConfig();
		if (servers.configurations) {
			servers.configurations.forEach(element => {
				if (element.id === reconnectionInfo.id) {
					let serverItem: ServerItem = new ServerItem(element.name, element.address, element.port, vscode.TreeItemCollapsibleState.None, element.id, element.buildVersion, element.environments, {
						command: '',
						title: '',
						arguments: [element.name]
					});
					if (connectedServerItem !== undefined) {
						vscode.commands.executeCommand('totvs-developer-studio.disconnect', connectedServerItem).then(() => {
							return sendReconnectRequest(serverItem, reconnectionInfo.token);
						});
					} else {
						return sendReconnectRequest(serverItem, reconnectionInfo.token);
					}
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
					let serverItem: ServerItem = new ServerItem(element.name, element.address, element.port, vscode.TreeItemCollapsibleState.None, element.id, element.buildVersion, element.environments, {
						command: '',
						title: '',
						arguments: [element.name]
					});
					sendReconnectRequest(serverItem, servers.lastConnectedServer.token);
				}
			});
		}
	}
}

function sendReconnectRequest(serverItem: ServerItem, connectionToken: string) {
	languageClient.sendRequest('$totvsserver/reconnect', {
		reconnectInfo: {
			connectionToken: connectionToken,
			serverName: serverItem.label
		}
	}).then((reconnectNode: ReconnectNode) => {
		let token: string = reconnectNode.connectionToken;
		if (token) {
			let environment: string = reconnectNode.environment;
			let user: string = reconnectNode.user;
			//vscode.window.showInformationMessage('Server ' + serverItem.label + ' connected!');
			Utils.saveSelectServer(serverItem.id, token, serverItem.label, environment, user);
			if (treeDataProvider !== undefined) {
				connectedServerItem = serverItem;
				connectedServerItem.currentEnvironment = environment;
				connectedServerItem.token = token;
				treeDataProvider.refresh();
			}
			return true;
		} else {
			vscode.window.showErrorMessage(localize("tds.webview.serversView.errorConnServer", 'Error reconnecting server'));
			return false;
		}
	}, err => {
		vscode.window.showErrorMessage(err);
	});
}

export class ReconnectNode {
	connectionToken: string;
	environment: string;
	user: string;
}

export class NodeInfo {
	id: any;
	buildVersion: string;
}

class DisconnectReturnInfo {
	id: any;
	code: any;
	message: string;
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
