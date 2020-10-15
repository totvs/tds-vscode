//import * as vscode from 'vscode';
import { ExtensionContext, QuickInputButton, Uri, QuickPickItem, workspace } from "vscode";
import Utils from "./utils";
import * as path from 'path';
import { MultiStepInput } from "./multiStepInput";
import { connectServer, reconnectServer } from "./serversView";
import { ConnTypeIds } from "./protocolMessages";

import * as nls from 'vscode-nls';
import { ServerItem, EnvSection } from "./serverItemProvider";
const localize = nls.loadMessageBundle();

/**
 * Coleta os dados necessarios para conectar a um servidor advpl/4gl.
 *
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 *
 *
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function inputConnectionParameters(context: ExtensionContext, serverParam: any, connType: ConnTypeIds, reconnect: boolean) {

	//const VALIDADE_TIME_OUT = 1000;
	const title = localize('CONNECTION','Connection');

	class NewEnvironmentButton implements QuickInputButton {
		constructor(public iconPath: { light: Uri; dark: Uri; }, public tooltip: string) { }
	}

	const addEnvironmentButton = new NewEnvironmentButton({
		dark: Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', 'add.png')),
		light: Uri.file(path.join(__filename, '..', '..', 'resources', 'light', 'add.png')),
	}, localize('NEW_ENVIRONMENT', 'New environment'));

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
		reconnectionToken: string;
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
		if (reconnect) {//@acandido
			let serverId = (typeof state.server === "string") ? state.server : (state.server as QuickPickItem).detail;
			let environmentName = (typeof state.environment === "string") ? state.environment : (state.environment as QuickPickItem).label;
			state.reconnectionToken = Utils.getSavedTokens(serverId, environmentName);
		}

		return state as State;
	}

	async function pickServer(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		const pick = await input.showQuickPick({
			title: title,
			step: CONNECT_SERVER_STEP,
			totalSteps: CONNECT_TOTAL_STEPS,
			placeholder: localize('SELECT_SERVER', 'Select server'),
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
				placeholder: localize('tds.vscode.select_environment', 'Select environment'),
				items: environments,
				activeItem: typeof state.environment !== 'string' ? state.environment : undefined,
				buttons: [addEnvironmentButton],
				shouldResume: shouldResume
			});

			if (pick instanceof NewEnvironmentButton) {
				return (input: MultiStepInput) => inputEnvironment(input, state, serversConfig);
			}
			state.environment = pick;
			return null;
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
				prompt: localize('ENTER_ENVIRONMENT', 'Enter the name of the environment'),
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
		return value === '' ? localize('REQUIRED_INFORMATION', 'Required information') : undefined;
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
		const server = Utils.getServerById((typeof connectState.server !== 'string') ? (connectState.server.detail ? connectState.server.detail : "") : connectState.server, serversConfig);

		if (connectState.reconnectionToken) {
			let environmentName = (typeof connectState.environment === "string") ? connectState.environment : (connectState.environment as QuickPickItem).label;
			reconnectServer(server, environmentName, connType);
		} else {
			const environment = (typeof connectState.environment !== 'string') ? connectState.environment.label : connectState.environment;
			server.name = server.name; //FIX: quebra-galho necessário para a árvore de servidores
			connectServer(server, environment, connType);
		}
	}

	main();
}

export function serverSelection(args, context) {
	if (args && args.length > 0) {
		inputConnectionParameters(context, args[0], ConnTypeIds.CONNT_DEBUGGER, true);
	} else {
		inputConnectionParameters(context, undefined, ConnTypeIds.CONNT_DEBUGGER, true);
	}
}
