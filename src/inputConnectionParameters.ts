//import * as vscode from 'vscode';
import { ExtensionContext, QuickInputButton, Uri, QuickPickItem, workspace } from "vscode";
import Utils from "./utils";
import * as path from 'path';
import { MultiStepInput } from "./multiStepInput";
import { connectServer, reconnectServer, ServerItem, EnvSection, connTypeId, connTypeIds } from "./serversView";

import * as nls from 'vscode-nls';
let localize = nls.loadMessageBundle();

/**
 * Coleta os dados necessarios para conectar a um servidor advpl.
 *
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 *
 *
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function inputConnectionParameters(context: ExtensionContext, serverParam: any, connType: connTypeId, reconnect: boolean) {

	//const VALIDADE_TIME_OUT = 1000;
	const title = 'Conexão';

	class NewEnvironmentButton implements QuickInputButton {
		constructor(public iconPath: { light: Uri; dark: Uri; }, public tooltip: string) {}
	}

	const addEnvironmentButton = new NewEnvironmentButton({
		dark: Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', 'add.png')),
		light: Uri.file(path.join(__filename, '..', '..', 'resources', 'light', 'add.png')),
	}, 'Novo ambiente');

	let CONNECT_TOTAL_STEPS = 2;
	let CONNECT_SERVER_STEP = 1;
	let CONNECT_ENVIRONMENT_STEP = 2;

	const serversConfig = Utils.getServersConfig();

	const servers: QuickPickItem[] = serversConfig.configurations
		.map(element => ({ detail: element.id, label: element.name, description: `${element.address}:${element.port}` }));

	interface State {
		title: string;
		step: number;
		totalSteps: number;
		server: QuickPickItem | string;
		environment: QuickPickItem | string;
		needAuthentication: true;
		reconnectionInfo: object;
	}

	async function collectConnectInputs() {
		const state = {} as Partial<State>;

		if (serverParam instanceof ServerItem) {
			state.server = serverParam.id;
			CONNECT_TOTAL_STEPS -= 1;
			CONNECT_SERVER_STEP -= 1;
			CONNECT_ENVIRONMENT_STEP -= 1;

			await MultiStepInput.run(input => pickEnvironment(input, state, serversConfig));
	 	} else if (serverParam instanceof EnvSection) {
			 state.server = serverParam.serverItemParent.id;
			 state.environment = serverParam.label;
		} else {
			await MultiStepInput.run(input => pickServer(input, state, serversConfig));
		}

		// reconnection token requires server and environment informations
		const configADVPL = workspace.getConfiguration('totvsLanguageServer');
		if (reconnect) {
			let serverId = (typeof state.server === "string") ? state.server : (state.server as QuickPickItem).detail;
			let environmentName = (typeof state.environment === "string") ? state.environment : (state.environment as QuickPickItem).label;
			let key = serverId + ":" + environmentName;
			let savedTokens: [string, object] = serversConfig.savedTokens;
			if (savedTokens) {
				for (let idx = 0; idx < savedTokens.length; idx++) {
					if (savedTokens[idx][0] === key) {
						let reconnectionInfo = savedTokens[idx][1];
						if (reconnectionInfo) {
							state.reconnectionInfo = reconnectionInfo;
						}
					}
				}
			}
		}

		return state as State;
	}

	async function pickServer(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		const pick = await input.showQuickPick({
			title: title,
			step: CONNECT_SERVER_STEP,
			totalSteps: CONNECT_TOTAL_STEPS,
			placeholder: 'Selecione servidor',
			items: servers,
			activeItem: typeof state.server !== 'string' ? state.server : undefined,
			shouldResume: shouldResume,
			validate: validateServerName,
		});

		state.server = pick;

		return (input: MultiStepInput) => pickEnvironment(input, state, serversConfig);
	}

	async function pickEnvironment(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		const environments = await getEnvironments(state, serversConfig);

		if (environments.length > 0) {
			const pick = await input.showQuickPick({
				title: title,
				step: CONNECT_ENVIRONMENT_STEP,
				totalSteps: CONNECT_TOTAL_STEPS,
				placeholder: localize('tds.vscode.select_environment','Select environment'),
				items: environments,
				activeItem: typeof state.environment !== 'string' ? state.environment : undefined,
				buttons: [addEnvironmentButton],
				shouldResume: shouldResume
			});

			if (pick instanceof NewEnvironmentButton) {
				return (input: MultiStepInput) => inputEnvironment(input, state, serversConfig);
			}
			state.environment = pick;
		} else {
			return (input: MultiStepInput) => inputEnvironment(input, state, serversConfig);
		}
	}

	async function inputEnvironment(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		state.environment = await input.showInputBox({
			title: title,
			step: CONNECT_ENVIRONMENT_STEP,
			totalSteps: CONNECT_TOTAL_STEPS,
			value: typeof state.environment === 'string' ? state.environment : '',
			prompt: 'Informe o nome do ambiente',
			shouldResume: shouldResume,
			validate: validateRequiredValue,
			password: false
		});
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {
			return false;
		});
	}

	async function validateServerName(name: string) {
		//await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));
		let result = false;

		servers.forEach((element) => {
			if (element.label === name) {
				result = true;
			}
		});

		return result;
	}

	async function validateRequiredValue(value: string) {
		// ...validate...
		//Nao esta claro o motivo desse timeout, pois o resolve nunca é passado e sempre é esperado o total do timeout antes de continuar
		//await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));
		return value === '' ? 'Informação requerida' : undefined;
	}

	async function getEnvironments(state: Partial<State>, serversConfig: any): Promise<QuickPickItem[]> {
		// ...retrieve...
		//await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));

		let target;
		if (state.server) {
			target = Utils.getServerById((typeof state.server !== 'string') ? (state.server.detail ? state.server.detail : "") : state.server, serversConfig);
			if (target) {
				state.environment = target.environment;
			}
		}

		return (target ? target.environments : [])
			.map(name => ({ label: name }));
	}

	async function main() {
		const connectState = await collectConnectInputs();
		if (connectState.reconnectionInfo) {
			let environmentName = (typeof connectState.environment === "string") ? connectState.environment : (connectState.environment as QuickPickItem).label;
			reconnectServer(connectState.reconnectionInfo, environmentName, connType);
		}
		else {
			const server = Utils.getServerById((typeof connectState.server !== 'string') ? (connectState.server.detail ? connectState.server.detail : "") : connectState.server, serversConfig);
			const environment = (typeof connectState.environment !== 'string') ? connectState.environment.label : connectState.environment;
			server.name = server.name; //FIX: quebra-galho necessário para a árvore de servidores
			connectServer(server, environment, connType);
		}
	}

	main();
}

export function serverSelection(args, context){
	if (args && args.length > 0) {
		inputConnectionParameters(context, args[0], 'CONNT_DEBUGGER', false);
	} else {
		inputConnectionParameters(context, undefined, 'CONNT_DEBUGGER', false);
	}
}
