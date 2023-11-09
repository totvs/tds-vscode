import * as vscode from 'vscode';
import { ExtensionContext, QuickInputButton, Uri, QuickPickItem, workspace } from "vscode";
import Utils, { ServersConfig } from "./utils";
import * as path from 'path';
import { MultiStepInput } from "./multiStepInput";
import { connectServer, reconnectServer } from "./serversView";
import { ConnTypeIds } from "./protocolMessages";

import { ServerItem, EnvSection } from "./serverItem";

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
	const title = vscode.l10n.t('Connection');

	class NewEnvironmentButton implements QuickInputButton {
		constructor(public iconPath: { light: Uri; dark: Uri; }, public tooltip: string) { }
	}

	const addEnvironmentButton = new NewEnvironmentButton({
		dark: Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', 'add.png')),
		light: Uri.file(path.join(__filename, '..', '..', 'resources', 'light', 'add.png')),
	}, vscode.l10n.t('New environment'));

	let CONNECT_TOTAL_STEPS = 2;
	let CONNECT_SERVER_STEP = 1;
	let CONNECT_ENVIRONMENT_STEP = 2;

	const servers: QuickPickItem[] = ServersConfig.getServers()
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

			await MultiStepInput.run(input => pickEnvironment(input, state));
		} else if (serverParam instanceof EnvSection) {
			state.server = serverParam.serverItemParent.id;
			state.environment = serverParam.label;
		} else {
			await MultiStepInput.run(input => pickServer(input, state));
		}

		// reconnection token requires server and environment informations
		const configADVPL = workspace.getConfiguration('totvsLanguageServer');
		if (reconnect) {//@acandido
			let serverId = (typeof state.server === "string") ? state.server : (state.server as QuickPickItem).detail;
			let environmentName = (typeof state.environment === "string") ? state.environment : (state.environment as QuickPickItem).label;
			state.reconnectionToken = ServersConfig.getSavedTokens(serverId, environmentName);
		}

		return state as State;
	}

	async function pickServer(input: MultiStepInput, state: Partial<State>) {
		const pick = await input.showQuickPick({
			title: title,
			step: CONNECT_SERVER_STEP,
			totalSteps: CONNECT_TOTAL_STEPS,
			placeholder: vscode.l10n.t('Select server'),
			items: servers,
			activeItem: typeof state.server !== 'string' ? state.server : undefined,
			shouldResume: shouldResume,
			validate: validateServerName,
		});

		state.server = pick;

		return (input: MultiStepInput) => pickEnvironment(input, state);
	}

	async function pickEnvironment(input: MultiStepInput, state: Partial<State>) {
		const environments = await getEnvironments(state);

		if (environments.length > 0) {
			const pick = await input.showQuickPick({
				title: title,
				step: CONNECT_ENVIRONMENT_STEP,
				totalSteps: CONNECT_TOTAL_STEPS,
				placeholder: vscode.l10n.t('Select environment'),
				items: environments,
				activeItem: typeof state.environment !== 'string' ? state.environment : undefined,
				buttons: [addEnvironmentButton],
				shouldResume: shouldResume
			});

			if (pick instanceof NewEnvironmentButton) {
				return (input: MultiStepInput) => inputEnvironment(input, state);
			}
			state.environment = pick;
			return null;
		} else {
			return (input: MultiStepInput) => inputEnvironment(input, state);
		}
	}

	async function inputEnvironment(input: MultiStepInput, state: Partial<State>) {
		state.environment = await input.showInputBox({
			title: title,
			step: CONNECT_ENVIRONMENT_STEP,
			totalSteps: CONNECT_TOTAL_STEPS,
			value: typeof state.environment === 'string' ? state.environment : '',
			prompt: vscode.l10n.t('Enter the name of the environment'),
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
		return value === '' ? vscode.l10n.t('Required information') : undefined;
	}

	async function getEnvironments(state: Partial<State>): Promise<QuickPickItem[]> {
		// ...retrieve...
		//await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));

		let target;
		if (state.server) {
			target = ServersConfig.getServerById((typeof state.server !== 'string') ? (state.server.detail ? state.server.detail : "") : state.server);
			if (target) {
				state.environment = target.environment;
			}
		}

		return (target ? target.environments : [])
			.map(name => ({ label: name }));
	}

	async function main() {
		const connectState = await collectConnectInputs();
		const server = ServersConfig.getServerById((typeof connectState.server !== 'string') ? (connectState.server.detail ? connectState.server.detail : "") : connectState.server);

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
