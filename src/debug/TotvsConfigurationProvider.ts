import { WorkspaceFolder, DebugConfigurationProvider, DebugConfiguration, CancellationToken, ProviderResult, window } from 'vscode';
import { connectedServerItem } from '../serversView';
import { sessionKey } from '../TotvsLanguageClient';
import * as vscode from 'vscode';
import * as Net from 'net';
import {localize} from '../extension';
import { extractProgram, extractArgs } from './debugConfigs';

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
	//resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration> {
	async resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): Promise<ProviderResult<DebugConfiguration>> {
		if (connectedServerItem !== undefined) {
			config.type = TotvsConfigurationProvider.type;
			config.environment = connectedServerItem.currentEnvironment;
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

			if (!config.program) {
				return window.showInformationMessage(localize('tds.vscode.program_not_found', "Cannot find a program to debug")).then(_ => {
					return undefined;	// abort launch
				});
			}

			if (config.program === "${command:AskForProgramName}") {
				const value = await vscode.commands.executeCommand("totvs-developer-studio.getProgramName");
				if (!value) {
					return window.showInformationMessage(localize('tds.vscode.program_not_found', "Cannot find a program to debug")).then(_ => {
						return undefined;	// abort launch
					});
				}
				config.program = extractProgram(value as string);
				config.programArguments = extractArgs(value as string);
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