import { ExtensionContext, QuickInputButton, Uri, QuickPickItem, workspace } from "vscode";
import Utils from "./utils";
import * as path from 'path';
import { MultiStepInput } from "./multiStepInput";
import { authenticate, reconnectServer } from "./serversView";

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
export async function inputConnectionParameters(context: ExtensionContext, serverParam: any) {

	//const VALIDADE_TIME_OUT = 1000;
	const title = 'Conexão';

	class NewEnvironmentButton implements QuickInputButton {
		constructor(public iconPath: { light: Uri; dark: Uri; }, public tooltip: string) {

		}
	}

	const addEnvironmentButton = new NewEnvironmentButton({
		dark: Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', 'add.png')),
		light: Uri.file(path.join(__filename, '..', '..', 'resources', 'light', 'add.png')),
	}, 'Novo ambiente');

	let TOTAL_STEPS = 4;
	let SERVER_STEP = 1;
	let ENVIRONEMNT_STEP = 2;
	let USERNAME_STEP = 3;
	let PASSWROD_STEP = 4;

	const serversConfig = Utils.getServersConfig();

	const servers: QuickPickItem[] = serversConfig.configurations
		.map(element => ({ detail: element.id, label: element.name, description: `${element.address}:${element.port}` }));

	interface State {
		title: string;
		step: number;
		totalSteps: number;
		server: QuickPickItem | string;
		environment: QuickPickItem | string;
		username: string;
		password: string;
		reconnectionInfo: object;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;

		if (serverParam) {
			state.server = serverParam.id;
			TOTAL_STEPS -= 1;
			SERVER_STEP -= 1;
			ENVIRONEMNT_STEP -= 1;
			USERNAME_STEP -= 1;
			PASSWROD_STEP -= 1;

			await MultiStepInput.run(input => pickEnvironment(input, state, serversConfig));
		} else {
			await MultiStepInput.run(input => pickServer(input, state, serversConfig));
		}
		return state as State;
	}

	async function pickServer(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		const pick = await input.showQuickPick({
			title: title,
			step: SERVER_STEP,
			totalSteps: TOTAL_STEPS,
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
				step: ENVIRONEMNT_STEP,
				totalSteps: TOTAL_STEPS,
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

			return (input: MultiStepInput) => inputUsername(input, state, serversConfig);
		} else {
			return (input: MultiStepInput) => inputEnvironment(input, state, serversConfig);
		}
	}

	async function inputEnvironment(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		state.environment = await input.showInputBox({
			title: title,
			step: ENVIRONEMNT_STEP,
			totalSteps: TOTAL_STEPS,
			value: typeof state.environment === 'string' ? state.environment : '',
			prompt: 'Informe o nome do ambiente',
			shouldResume: shouldResume,
			validate: validateRequiredValue,
			password: false
		});

		return (input: MultiStepInput) => inputUsername(input, state, serversConfig);
	}

	async function inputUsername(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		const configADVPL = workspace.getConfiguration('totvsLanguageServer');
		let useReconnectionToken = configADVPL.get('useReconnectionToken');
		if (useReconnectionToken) {
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
							return;
						}
					}
				}
			}
		}

		state.username = await input.showInputBox({
			title: title,
			step: USERNAME_STEP,
			totalSteps: TOTAL_STEPS,
			value: state.username || '',
			prompt: 'Identificação do usuário',
			validate: validateRequiredValue,
			shouldResume: shouldResume,
			password: false
		});

		return (input: MultiStepInput) => inputPassword(input, state, serversConfig);
	}

	async function inputPassword(input: MultiStepInput, state: Partial<State>, serversConfig: any) {
		state.password = await input.showInputBox({
			title: title,
			step: PASSWROD_STEP,
			totalSteps: TOTAL_STEPS,
			value: state.password || '',
			prompt: 'Senha de acesso',
			validate: allTrueValue,
			shouldResume: shouldResume,
			password: true
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

	async function allTrueValue(value: string) {
		// ...validate...
		//await new Promise(resolve => setTimeout(resolve, VALIDADE_TIME_OUT));

		return undefined;
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
			//target = Utils.getServerForNameWithConfig((typeof state.server !== 'string') ? state.server.label : state.server, serversConfig);
			target = Utils.getServerById((typeof state.server !== 'string') ? (state.server.detail ? state.server.detail : "") : state.server, serversConfig);
			if (target) {
				state.environment = target.environment;
				state.username = target.username;
			}
		}

		return (target ? target.environments : [])
			.map(name => ({ label: name }));
	}

	async function main() {
		const state = await collectInputs();
		if (state.reconnectionInfo) {
			if (!reconnectServer(state.reconnectionInfo)) {
				// falha ao reconectar
			}
		}
		else {
			//const server = Utils.getServerForNameWithConfig((typeof state.server !== 'string') ? state.server.label : state.server, serversConfig);
			const server = Utils.getServerById((typeof state.server !== 'string') ? (state.server.detail ? state.server.detail : "") : state.server, serversConfig);
			const environment = (typeof state.environment !== 'string') ? state.environment.label : state.environment;

			server.label = server.name; //FIX: quebra-galho necessário para a árvore de servidores
			authenticate(server, environment, state.username, state.password);
		}
	}

	main();
}

export function serverAuthentication(args, context){
	if (args && args.length > 0) {
		inputConnectionParameters(context, args[0]);
	} else {
		inputConnectionParameters(context, undefined);
	}
}