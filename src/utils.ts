import * as vscode from 'vscode';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import * as stripJsonComments from 'strip-json-comments';
import * as ini from 'ini';

const homedir = require('os').homedir();

import * as nls from 'vscode-nls';
let localize = nls.loadMessageBundle();

export interface SelectServer {
	name: string;
	id: string;
	token: string;
	environment: string;
	environments?: string[];
}

export default class Utils {
	/**
	* Subscrição para evento de seleção de servidor/ambiente.
	*/
	static get onDidSelectedServer(): vscode.Event<SelectServer> {
		return Utils._onDidSelectedServer.event;
	}

	/**
	 * Subscrição para evento de chave de compilação.
	 */
	static get onDidSelectedKey(): vscode.Event<string> {
		return Utils._onDidSelectedKey.event;
	}

	/**
	 * Emite a notificação de seleção de servidor/ambiente
	 */
	private static _onDidSelectedServer = new vscode.EventEmitter<SelectServer>();

	/**
	 * Emite a notificação de seleção de chave de compilação
	 */
	private static _onDidSelectedKey = new vscode.EventEmitter<string>();

	/**
	 * Gera um id de servidor
	 */
	static generateRandomID() {
		return Math.random().toString(36).substring(2, 15) + Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
	}

	/**
	 * Retorna o path completo do servers.json
	 */
	static getServerConfigFile() {
		return homedir + "/.totvsls/servers.json";
	}

	/**
	 * Retorna o path de onde deve ficar o servers.json
	 */
	static getServerConfigPath() {
		return homedir + "/.totvsls";
	}

	/**
 * Retorna o path completo do launch.json
 */
	static getLaunchConfigFile() {
		let rootPath: string = vscode.workspace.rootPath || process.cwd();

		return path.join(rootPath, ".vscode", "launch.json");
	}

	/**
	 * Retorna o path da pastar .vscode dentro do workspace
	 */
	static getVSCodePath() {
		let rootPath: string = vscode.workspace.rootPath || process.cwd();

		return path.join(rootPath, ".vscode");
	}

	/**
	 * Retorna todo o conteudo do servers.json
	 */
	static getServersConfig() {
		let fs = require('fs');
		let exist = fs.existsSync(this.getServerConfigFile());
		if (exist) {
			let json = fs.readFileSync(this.getServerConfigFile()).toString();
			return JSON.parse(json);
		}
	}

	/**
	 * Retorna todo o conteudo do launch.json
	 */
	static getLaunchConfig() {
		let fs = require('fs');
		let exist = fs.existsSync(this.getLaunchConfigFile());
		if (exist) {
			let json = fs.readFileSync(this.getLaunchConfigFile()).toString();
			return JSON.parse(stripJsonComments(json));
		}
	}

	static saveLaunchConfig(config: JSON) {
		let fs = require('fs');
		fs.writeFileSync(Utils.getLaunchConfigFile(), JSON.stringify(config, null, "\t"), (err) => {
			if (err) {
				console.error(err);
			}
		});
	}

	/**
	 * Salva o servidor logado por ultimo.
	 * @param id Id do servidor logado
	 * @param token Token que o LS gerou em cima das informacoes de login
	 * @param name Nome do servidor logado
	 * @param environment Ambiente utilizado no login
	 */
	static saveSelectServer(id: string, token: string, name: string, environment: string, username: string) {
		const servers = this.getServersConfig();

		servers.configurations.forEach(element => {
			if (element.id === id) {
				if (element.environments === undefined) {
					element.environments = [environment];
				} else if (element.environments.indexOf(environment) === -1) {
					element.environments.push(environment);
				}
				element.username = username;
				element.environment = environment;

				let server: SelectServer = {
					'name': element.name,
					'id': element.id,
					'token': token,
					'environment': element.environment
				};
				servers.connectedServer = server;
				servers.lastConnectedServer = server;
				Utils._onDidSelectedServer.fire(server);
			}
		});

		this.persistServersInfo(servers);
	}

	/**
	 * Notifica o cancelamento de seleção de servidor/ambiente
	 */
	static cancelSelectServer() {
		Utils._onDidSelectedServer.fire(undefined);
	}

	/**
	 * Deleta o servidor logado por ultimo do servers.json
	 */
	static deleteSelectServer() {
		const servers = this.getServersConfig();
		if (servers.connectedServer.id) {
			let server = {};
			servers.connectedServer = server;
			const configADVPL = vscode.workspace.getConfiguration('totvsLanguageServer');//transformar em configuracao de workspace
			let isReconnectLastServer = configADVPL.get('reconnectLastServer');
			if (!isReconnectLastServer) {
				servers.lastConnectedServer = {};
			}
			this.persistServersInfo(servers);
		}
	}

	static clearConnectedServerConfig() {
		const allConfigs = this.getServersConfig();

		allConfigs.connectedServer = {};
		allConfigs.lastConnectedServer = {};
		this.persistServersInfo(allConfigs);
		Utils.cancelSelectServer();
	}

	/**
	 * Deleta o servidor logado por ultimo do servers.json
	 */
	static deleteServer(id: string) {
		const allConfigs = this.getServersConfig();

		if (allConfigs.configurations) {
			const configs = allConfigs.configurations;

			configs.forEach(element => {
				if (element.id === id) {
					const index = configs.indexOf(element, 0);
					configs.splice(index, 1);
					this.persistServersInfo(allConfigs);
					return;
				}
			});
		}
	}

	/**
	 * Grava no arquivo servers.json uma nova configuracao de servers
	 * @param JSONServerInfo
	 */
	static persistServersInfo(JSONServerInfo) {
		let fs = require('fs');
		fs.writeFileSync(Utils.getServerConfigFile(), JSON.stringify(JSONServerInfo, null, "\t"), (err) => {
			if (err) {
				console.error(err);
			}
		});
	}

	/**
	 * Grava no arquivo launch.json uma nova configuracao de launchs
	 * @param JSONServerInfo
	 */
	static persistLaunchsInfo(JSONLaunchInfo) {
		let fs = require('fs');
		fs.writeFileSync(Utils.getLaunchConfigFile(), JSON.stringify(JSONLaunchInfo, null, "\t"), (err) => {
			if (err) {
				console.error(err);
			}
		});
	}

	/**
	 * Cria uma nova configuracao de servidor no servers.json
	 */
	static createNewServer(typeServer, serverName, port, address, buildVersion): string | undefined {
		this.createServerConfig();
		const serverConfig = Utils.getServersConfig();

		if (serverConfig.configurations) {
			const servers = serverConfig.configurations;
			const serverId: string = Utils.generateRandomID();
			servers.push({
				id: serverId,
				type: typeServer,
				name: serverName,
				port: parseInt(port),
				address: address,
				buildVersion: buildVersion
			});

			Utils.persistServersInfo(serverConfig);
			return serverId;
		}
		return undefined;
	}

	/**
	 * Recupera o ultimo servidor logado
	 */
	static getCurrentServer() {
		const servers = this.getServersConfig();

		if (servers.connectedServer.id) {
			return servers.connectedServer;
		} else {
			return "";
		}
	}

	static getPermissionsInfos() {
		const servers = this.getServersConfig();

		const permissions = servers.permissions;
		if (permissions) {
			return permissions;
		}

		return "";
	}

	static savePermissionsInfos(infos: any) {
		const config = Utils.getServersConfig();

		config.permissions = infos;

		this.persistServersInfo(config);
		Utils._onDidSelectedKey.fire(infos);
	}

	static removeExpiredAuthorization() {
		vscode.window.showWarningMessage(localize("tds.webview.utils.removeExpiredAuthorization", 'Expired authorization token deleted'));
		Utils.savePermissionsInfos({}); // remove expired authorization key
	}

	/**
	 * Recupera a lista de includes do arquivod servers.json
	 */
	static getIncludes(absolutePath: boolean = false): Array<string> {
		const servers = this.getServersConfig();
		const includes: Array<string> = servers.includes as Array<string>;

		if (includes.toString()) {
			if (absolutePath) {
				const ws: string = vscode.workspace.rootPath || '';
				includes.forEach((value, index, elements) => {
					if (value.startsWith(".")) {
						value = path.resolve(ws, value);
					} else {
						value = path.resolve(value.replace('${workspaceFolder}', ws));
					}

					try {
						const fi: fs.Stats = fs.lstatSync(value);
						if (!fi.isDirectory) {
							const msg: string = localize("tds.webview.utils.reviewList", "Review the folder list in order to search for settings (.ch). Not recognized as folder: {0}", value);
							vscode.window.showWarningMessage(msg);
						} else {
							elements[index] = value;
						}

					} catch (error) {
						const msg: string = localize("tds.webview.utils.reviewList2", "Review the folder list in order to search for settings (.ch). Invalid folder: {0}", value);
						console.log(error);
						vscode.window.showWarningMessage(msg);
						elements[index] = "";
					}
				});
			}

		} else {
			vscode.window.showWarningMessage(localize("tds.webview.utils.listFolders", 'List of folders to search for definitions not configured.'));
		}
		return includes;
	}

	/**
	 * Cria o arquivo servers.json caso ele nao exista.
	 */
	static createServerConfig() {
		const servers = Utils.getServersConfig();
		if (!servers) {
			let fs = require("fs");
			const sampleServer = {
				version: "0.2.0",
				includes: ["C:/totvs/includes"],
				permissions: {
					authorizationtoken: ""
				},
				connectedServer: {},
				configurations: []
			};

			if (!fs.existsSync(Utils.getServerConfigPath())) {
				fs.mkdirSync(Utils.getServerConfigPath());
			}

			let serversJson = Utils.getServerConfigFile();

			fs.writeFileSync(serversJson, JSON.stringify(sampleServer, null, "\t"), (err) => {
				if (err) {
					console.error(err);
				}
			});
		}
	}
	/**
	 * Cria o arquivo launch.json caso ele nao exista.
	 */
	static createLaunchConfig() {
		const launch = Utils.getLaunchConfig();
		if (!launch) {
			let fs = require("fs");
			let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
			if (ext) {
				let sampleLaunch = {
					"version": "0.2.0",
					"configurations": []
				};

				let pkg = ext.packageJSON;
				let contributes = pkg["contributes"];
				let debug = (contributes["debuggers"] as any[]).filter((element: any) => {
					return element.type === "totvs_language_debug";
				});

				if (debug.length === 1) {
					let initCfg = (debug[0]["initialConfigurations"]  as any[]).filter((element: any) => {
						return element.request === "launch";
					});

					if (initCfg.length === 1) {
						sampleLaunch = {
							"version": "0.2.0",
							"configurations": [ (initCfg[0] as never) ]
						};
					}
				}

				if (!fs.existsSync(Utils.getVSCodePath())) {
					fs.mkdirSync(Utils.getVSCodePath());
				}

				let launchJson = Utils.getLaunchConfigFile();

				fs.writeFileSync(launchJson, JSON.stringify(sampleLaunch, null, "\t"), (err) => {
					if (err) {
						console.error(err);
					}
				});
			};

		}
	}
	/**
	 *Recupera um servidor pelo ID informado.
	 * @param ID ID do servidor que sera selecionado.
	 */
	static getServerForID(ID: string) {
		let server;
		const allConfigs = this.getServersConfig();

		if (allConfigs.configurations) {
			const configs = allConfigs.configurations;

			configs.forEach(element => {
				if (element.id === ID) {
					server = element;
					if (server.environments === undefined) {
						server.environments = [];
					}
				}
			});
		}
		return server;
	}

	/**
 	*Recupera um servidor pelo nome informado.
 	* @param name nome do servidor alvo.
 	*/
	static getServerForNameWithConfig(name: string, serversConfig: any) {
		let server;

		if (serversConfig.configurations) {
			const configs = serversConfig.configurations;

			configs.forEach(element => {
				if (element.name === name) {
					server = element;
					if (server.environments === undefined) {
						server.environments = [];
					}
				}
			});
		}
		return server;
	}

	static addCssToHtml(htmlFilePath: vscode.Uri, cssFilePath: vscode.Uri) {

		const htmlContent = fs.readFileSync(htmlFilePath.with({ scheme: 'vscode-resource' }).fsPath);
		const cssContent = fs.readFileSync(cssFilePath.with({ scheme: 'vscode-resource' }).fsPath);

		const $ = cheerio.load(htmlContent.toString());

		let style = $('style').html();

		if (style === undefined || style === null || style === "") {
			$('html').append('<style>' + cssContent + '</style>');
		} else {
			$('style').append(cssContent.toString());
		}

		return $.html();
	}
	/**
	 *Salva uma nova configuracao de include.
	 */
	static saveIncludePath(path) {
		const servers = this.getServersConfig();

		servers.includes = path;

		this.persistServersInfo(servers);
	}

	/**
	 *Atualiza no server.json a build de um servidor
	 * @param id ID do server que sera atualizado
	 * @param buildVersion Nova build do servidor
	 */
	static updateBuildVersion(id: string, buildVersion: string) {
		let result = false;
		if (!id || !buildVersion) {
			return result;
		}
		const serverConfig = this.getServersConfig();
		serverConfig.configurations.forEach(element => {
			if (element.id === id) {
				element.buildVersion = buildVersion;
				this.persistServersInfo(serverConfig);
				result = true;
			}
		});

		return result;
	}

	/**
	 *Atualiza no server.json o nome de um servidor
	 * @param id ID do server que sera atualizado
	 * @param newName Novo nome do servidor
	 */
	static updateServerName(id: string, newName: string) {
		let result = false;
		if (!id || !newName) {
			return result;
		}
		const serverConfig = this.getServersConfig();
		serverConfig.configurations.forEach(element => {
			if (element.id === id) {
				element.name = newName;
				this.persistServersInfo(serverConfig);
				result = true;
			}
		});

		return result;
	}


	static readCompileKeyFile(path) {
		if (fs.existsSync(path)) {
			const parseIni = ini.parse(fs.readFileSync(path, 'utf-8').toLowerCase());

			return parseIni.authorization;
		}
		return undefined;
	}
}