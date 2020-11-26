import { WorkspaceFolder, DebugConfigurationProvider, DebugConfiguration, CancellationToken, window } from 'vscode';
import * as vscode from 'vscode';
import * as Net from 'net';
import { extractProgram, extractArgs, setDapArgs, getDAP } from './debugConfigs';
import serverProvider from '../serverItemProvider';
import * as nls from 'vscode-nls';
import { sendGetJobs } from '../protocolMessages';

const localize = nls.loadMessageBundle();

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
	//async resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): Promise<ProviderResult<DebugConfiguration>> {
	//Parece que mudaram novamente o tipo de retorno dessa funcao, por isso essa nova declaracao.
	async resolveDebugConfiguration(folder: WorkspaceFolder | undefined, config: DebugConfiguration, token?: CancellationToken): Promise<DebugConfiguration> {
		const connectedServerItem = serverProvider.connectedServerItem;

		if (connectedServerItem !== undefined) {
			config.type = TotvsConfigurationProvider.type;
			config.environment = connectedServerItem.environment;
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
				window.showInformationMessage(localize('tds.vscode.program_not_found', "Cannot find a program to debug"));
				return undefined;	// abort launch
			}

			if (config.program === "${command:AskForProgramName}") {
				const value = await vscode.commands.executeCommand("totvs-developer-studio.getProgramName");
				if (!value) {
					window.showInformationMessage(localize('tds.vscode.program_not_found', "Cannot find a program to debug"));
					return undefined;	// abort launch
				}
				config.program = extractProgram(value as string);
				config.programArguments = extractArgs(value as string);
			}

			if (config.startJobList) {
				const jobs: any[] = await sendGetJobs(connectedServerItem);

				//força caixa e verifica se achou configuração
				config.startJobList.forEach((element, index, array) => {
					array[index] = array[index].toLowerCase();

					const find = jobs.find((job) => {
						return array[index] == job.sectionName
					});

					if (!find) {
						console.log(array[index]);
					}
				});

				//seleciona os jobs a serem inicializados
				const startJobs: any[] = jobs.filter((job: any) => {
					return config.startJobList.includes(job.sectionName);
				});

				config.startJobNowList = []; //startJobs.slice()

				while (config.startJobNowList.length < 5) {
					config.startJobNowList.push(...startJobs.slice());
				}
			} else {
				config.startJobNowList = [];
			}

			// se no server conectado houver a informacao de smartclientBin utiliza a informacao
			if (connectedServerItem.smartclientBin) {
				config.smartclientBin = connectedServerItem.smartclientBin;
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

			return Promise.resolve(config);
		} else {
			window.showErrorMessage(localize('tds.vscode.server_not_connected', "No servers connected"));
			return null;
		}
	}

	dispose() {
		if (this._server) {
			this._server.close();
		}
	}

}