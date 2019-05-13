import { ExtensionContext, QuickInputButton, Uri, QuickPickItem } from "vscode";
import Utils from "./utils";
import * as path from 'path';
import { MultiStepInput } from "./multiStepInput";
import { authenticate } from "./serversView";
import { authenticateIdentity } from "./identity/identity";

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
		.map(element => ({ label: element.name, description: `${element.address}:${element.port}` }));

	interface State {
		title: string;
		step: number;
		totalSteps: number;
		server: QuickPickItem | string;
		environment: QuickPickItem | string;
		username: string;
		password: string;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;

		if (serverParam) {
			state.server = serverParam.label;
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
				return (input: MultiStepInput) => inputEnvironment(input, state);
			}
			state.environment = pick;

			return (input: MultiStepInput) => inputUsername(input, state);
		} else {
			return (input: MultiStepInput) => inputEnvironment(input, state);
		}
	}

	async function inputEnvironment(input: MultiStepInput, state: Partial<State>) {
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

		return (input: MultiStepInput) => inputUsername(input, state);
	}

	async function inputUsername(input: MultiStepInput, state: Partial<State>) {
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

		return (input: MultiStepInput) => inputPassword(input, state);
	}

	async function inputPassword(input: MultiStepInput, state: Partial<State>) {
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
			target = Utils.getServerForNameWithConfig((typeof state.server !== 'string') ? state.server.label : state.server, serversConfig);

			if (target) {
				state.environment = target.environment;
				state.username = target.username;
			}
		}

		return (target ? target.environments : [])
			.map(name => ({ label: name }));
	}

	const state = await collectInputs();
	const server = Utils.getServerForNameWithConfig((typeof state.server !== 'string') ? state.server.label : state.server, serversConfig);
	const environment = (typeof state.environment !== 'string') ? state.environment.label : state.environment;

	server.label = server.name; //FIX: quebra-galho necessário para a árvore de servidores
	authenticate(server, environment, state.username, state.password);
}

/**
 * Coleta os dados necessarios para conectar ao Identity
 */

export async function inputIdentityParameters() {
	//const VALIDADE_TIME_OUT = 1000;
	const title = 'Login Identity';

	let TOTAL_STEPS = 2;
	let USERNAME_STEP = 1;
	let PASSWROD_STEP = 2;

	interface State {
		title: string;
		step: number;
		totalSteps: number;
		username: string;
		password: string;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		const identityInfo = Utils.getPermissionsInfos();
		if(identityInfo){
			state.username= identityInfo.userId;
		}
		await MultiStepInput.run(input => inputUsername(input, state));

		return state as State;
	}

	async function inputUsername(input: MultiStepInput, state: Partial<State>) {
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

		return (input: MultiStepInput) => inputPassword(input, state);
	}

	async function inputPassword(input: MultiStepInput, state: Partial<State>) {
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

	const state = await collectInputs();

	authenticateIdentity(state.username, state.password);
}

export function serverAuthentication(args, context){
	if (args && args.length > 0) {
		inputConnectionParameters(context, args[0]);
	} else {
		inputConnectionParameters(context, undefined);
	}
}