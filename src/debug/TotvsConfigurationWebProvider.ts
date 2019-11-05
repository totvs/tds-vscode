import { ProviderResult, window, CancellationToken, DebugConfiguration, WorkspaceFolder, DebugConfigurationProvider } from 'vscode';
import { connectedServerItem } from '../serversView';
import * as vscode from 'vscode';
import * as Net from 'net';
import { sessionKey } from '../TotvsLanguageClient';
import {localize} from '../extension';
import { setDapArgs } from './debugConfigs';
/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does no longer work in this mode.
 */
const EMBED_DEBUG_ADAPTER = false;

export class TotvsConfigurationWebProvider implements DebugConfigurationProvider {
	static type = 'totvs_language_web_debug';

	private _server?: Net.Server;

	/**
	 * Massage a debug configuration just before a debug session is being launched,
	 * e.g. add all missing attributes to the debug configuration.
	 */
	resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {

		if (connectedServerItem !== undefined) {

			// if launch.json is missing or empty
			if (!config.type && !config.request && !config.name) {
				const editor = window.activeTextEditor;
				if (editor && editor.document.languageId === 'totvs-developer-studio') {
					config.type = TotvsConfigurationWebProvider.type;
					config.name = 'Totvs Language Web Debug (SmartClient HTML)';
					config.request = 'launch';
					config.program = '${workspaceFolder}/${command:AskForProgramName}';
					config.smartclientUrl = "http://localhost:8080";
				}
			}

			config.type = TotvsConfigurationWebProvider.type;
			config.serverAddress = connectedServerItem.address;
			config.serverPort = connectedServerItem.port;
			config.buildVersion = connectedServerItem.buildVersion;

			config.environment = connectedServerItem.currentEnvironment;
			config.serverName = connectedServerItem.label;
			config.publicKey = sessionKey;
			config.token = connectedServerItem.token;

			let workspaceFolders = vscode.workspace.workspaceFolders;
			if (workspaceFolders) {
				let wsPaths = new Array(workspaceFolders.length);
				let i = 0;
				for (const workspaceFolder of workspaceFolders) {
					const workspaceFolderPath = workspaceFolder.uri.fsPath;
					wsPaths[i] = workspaceFolderPath;
					i++;
				}
				config.workspaceFolders = wsPaths;
			}

			if (!config.cwb || (config.cwb === '')) {
				config.cwb = vscode.workspace.rootPath;
				window.showInformationMessage(localize('tds.vscode.cwb_warning', 'Parameter cwb not informed. Setting to {0}', config.cwb));
			}

			const cfg = vscode.workspace.getConfiguration("totvsLanguageServer");
			const webNavigator: string | undefined = cfg.get("web.navigator");

			if (!webNavigator || (webNavigator === '')) {
				window.showErrorMessage(localize('tds.vscode.web_navigator', 'Parameter webNavigator not informed.'));
				return undefined;	// abort launch
			}
			config.webNavigator = webNavigator;

			if (!config.program) {
				return window.showInformationMessage(localize('tds.vscode.program_not_found', "Cannot find a program to debug")).then(_ => {
					return undefined;	// abort launch
				});
			}

			if (EMBED_DEBUG_ADAPTER) {
				// start port listener on launch of first debug session
				/*			if (!this._server) {

								// start listening on a random port
								this._server = Net.createServer(socket => {
									const session = new MockDebugSession();
									session.setRunAsServer(true);
									session.start(<NodeJS.ReadableStream>socket, socket);
								}).listen(0);
							}*/

				// make VS Code connect to debug server instead of launching debug adapter
				config.debugServer = 8588;//this._server.address().port;
			}
			let setDapArgsArr: string[] =  [];
			if (config.logFile) {
				const ws: string = vscode.workspace.rootPath || '';
				setDapArgsArr.push("--log-file=" + config.logFile.replace('${workspaceFolder}', ws));
			}
			if (config.waitForAttach) {
				setDapArgsArr.push("--wait-for-attach=" + config.waitForAttach);
			}
			setDapArgs(setDapArgsArr);

			return config;
		} else {
			window.showErrorMessage(localize('tds.vscode.server_not_connected', "Nenhum servidor conectado"));
			return null;
		}
	}

	dispose() {
		if (this._server) {
			this._server.close();
		}
	}
}