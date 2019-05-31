import { extensions, QuickPickItem, Disposable, QuickPick } from 'vscode';
import { chmodSync } from 'fs';
import Utils from '../utils';
import { window } from 'vscode';
import { localize } from '../extension';

export function getDAP() {
	let pathDAP = "";
	let ext = extensions.getExtension("TOTVS.tds-vscode");
	if (ext) {
		if (process.platform === "win32") {
			pathDAP = ext.extensionPath + "\\node_modules\\@totvs\\tds-da\\bin\\windows\\debugAdapter.exe";
		}
		else if (process.platform === "linux") {
			pathDAP = ext.extensionPath + "/node_modules/@totvs/tds-da/bin/linux/debugAdapter";
			chmodSync(pathDAP, '755');
		}

	}
	return { command: pathDAP };
}

class QuickPickProgram implements QuickPickItem {

	label: string;
	description: string;
	args: string[] = [];

	constructor(program: string, args: string[]) {
		this.label = program;
		this.setArgs(args);
	}

	public setArgs(args: string[]) {
		this.args = args;
		this.description = this.args.join(" ");
	}
}

export async function getProgramName() {
	const disposables: Disposable[] = [];

	let config = Utils.getLaunchConfig();
	let lastProgramExecuted = "";
	let lastPrograms: QuickPickProgram[] = [];

	if (config.lastProgramExecuted) {
		lastProgramExecuted = config.lastProgramExecuted;
	}

	if (config.lastPrograms) {
		lastPrograms = config.lastPrograms;
	} else {
		config.lastPrograms = lastPrograms;
	}

	try {
		return await new Promise<string | undefined>((resolve, reject) => {
			const qp: QuickPick<QuickPickProgram> = window.createQuickPick<QuickPickProgram>();
			qp.title = localize('tds.vscode.getProgramName', "Please enter the name of an AdvPL function");
			qp.items = lastPrograms;
			qp.value = lastProgramExecuted;
			qp.matchOnDescription = true;
			qp.placeholder = localize('tds.vscode.getProgramName', "Please enter the name of an AdvPL function");

			disposables.push(qp.onDidChangeSelection(selection => {
				if (selection[0]) {
					qp.value = selection[0].label + ' ' + selection[0].description;
				}
			}));

			disposables.push(qp.onDidAccept(e => {
				if (qp.value) {
					qp.hide();
				}
			}));

			qp.onDidHide(() => {
				const program = extractProgram(qp.value);

				if (program && program.length > 0) {
					const args = extractArgs(qp.value);
					const argsAux = args.join(" ");

					config.lastProgramExecuted = program;

					const find: boolean = config.lastPrograms.some((element: QuickPickProgram) => {
						return (element.label.toLowerCase() === program.toLowerCase()) &&
							(element.description === argsAux);
					});

					if (!find) {
						config.lastPrograms.push(new QuickPickProgram(program, args));
						Utils.saveLaunchConfig(config);
					}
				}

				resolve(qp.value);
				qp.dispose();
			});

			qp.show();
		});
	} finally {
		disposables.forEach(d => d.dispose());
	}
}

export function extractProgram(value: string): string {
	const groups: string[] = value.split(/(\w+)+/i).filter((value) => {
		return value && value.trim().length > 0;
	});

	return (groups && groups.length > 0) ? groups[0] : "";
}

const ignoreValue: string[] = [',', '(', ')' ];

export function extractArgs(value: string): string[] {
	const groups: string[] = value.replace(/-a=/gi, "").split(/(\w+)+/i).filter((value) => {
		return value && value.trim().length > 0 && !ignoreValue.some((char) => value.trim() === char);
	});

	return (groups && groups.length > 1) ? groups.slice(1) : [];
}

export async function getProgramArguments() {
	return await pickProgramArguments();
}

async function pickProgramArguments() {
	const disposables: Disposable[] = [];

	let config = Utils.getLaunchConfig();
	let lastProgramExecuted = "";
	let lastPrograms: QuickPickProgram[] = [];

	if (config.lastProgramExecuted) {
		lastProgramExecuted = config.lastProgramExecuted;
	}

	lastPrograms = config.lastPrograms.filter((element: QuickPickProgram) => {
		return (element.label.toLowerCase() === lastProgramExecuted.toLowerCase());
	});

	lastPrograms.forEach(element => {
		element.label = element.description;
		element.description = '';
	});

	try {
		return await new Promise<string[] | undefined>((resolve, reject) => {
			const qp: QuickPick<QuickPickProgram> = window.createQuickPick<QuickPickProgram>();
			qp.title = localize('tds.vscode.getProgramArguments', "Informe lista de argumentos separados por vírgula");
			qp.items = lastPrograms;
			qp.placeholder = localize('tds.vscode.getProgramArguments', "Informe lista de argumentos separados por vírgula");

			disposables.push(qp.onDidChangeSelection(selection => {
				if (selection[0]) {
					qp.value = selection[0].label;
				}
			}));

			disposables.push(qp.onDidAccept(e => {
				if (qp.value) {
					qp.hide();
				}
			}));

			qp.onDidHide(() => {
				const program = lastProgramExecuted;
				const description = qp.value.toLowerCase();

				const args = extractArgs(qp.value);

				const find: boolean = config.lastPrograms.some((element: QuickPickProgram) => {
					return (element.label.toLowerCase() === description);
				});

				if (!find) {
					config.lastPrograms.push(new QuickPickProgram(program, args));
					Utils.saveLaunchConfig(config);
				}

				resolve(args);
				qp.dispose();
			});

			qp.show();
		});
	} finally {
		disposables.forEach(d => d.dispose());
	}
}
