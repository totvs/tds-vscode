import { WorkspaceFolder, DebugConfigurationProvider, DebugConfiguration, CancellationToken, ProviderResult, window } from 'vscode';
import { connectedServerItem } from '../serversView';
import { sessionKey } from '../TotvsLanguageClient';
import * as vscode from 'vscode';
import * as Net from 'net';
import {localize} from '../extension';

/*
 * Set the following compile time flag to true if the
 * debug adapter should run inside the extension host.
 * Please note: the test suite does no longer work in this mode.
 */
const EMBED_DEBUG_ADAPTER = false;

export class TotvsConfigurationProvider implements DebugConfigurationProvider {
	static type = 'totvs_language_debug';

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
					config.type = TotvsConfigurationProvider.type;
					config.name = 'Totvs Language Debug';
					config.request = 'launch';
					config.program = '${workspaceFolder}/${command:AskForProgramName}';
					config.smartclientBin = "C:/totvs/bin/smartclient/smartclient.exe";
					//config.tcpSection = "tcp";
					//config.environment = "environment";
				}
			}

			config.type = TotvsConfigurationProvider.type;
			config.serverAddress = connectedServerItem.address;
			config.serverPort = connectedServerItem.port;
			config.buildVersion = connectedServerItem.buildVersion;

			config.environment = connectedServerItem.currentEnvironment;
			config.serverName = connectedServerItem.label;
			config.authToken = connectedServerItem.token;
			config.publicKey = sessionKey;

			var workspaceFolders = vscode.workspace.workspaceFolders;
			if (workspaceFolders) {
				var wsPaths = new Array(workspaceFolders.length);
				var i = 0;
				for (const workspaceFolder of workspaceFolders) {
					const workspaceFolderPath = workspaceFolder.uri.fsPath;
					wsPaths[i] = workspaceFolderPath;
					i++;
				}
				config.workspaceFolders = wsPaths;
			}

			if (!config.cwb || (config.cwb === '')) {
				config.cwb = vscode.workspace.rootPath;
				window.showInformationMessage(localize('tds.vscode.cwb_warning', 'Parameter cwb not informed. Setting to ${1}', config.cwb));
			}

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