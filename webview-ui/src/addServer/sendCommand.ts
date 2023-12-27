import { TAddServerModel } from "../model/addServerModel";
import { CommandToPanelEnum } from "../utilities/command-panel";
import { vscode } from "../utilities/vscodeWrapper";

export interface IAddServerCommand {
	selectedDir: string;
}

export function sendReady() {
	vscode.postMessage({
		command: CommandToPanelEnum.Ready,
		model: {}
	});
}

export function sendCheckDir(model: TAddServerModel, selectedDir: string) {
	vscode.postMessage<IAddServerCommand>({
		command: CommandToPanelEnum.CheckDir,
		model: model,
		selectedDir: selectedDir
	});
}

export function sendSave(model: TAddServerModel) {
	vscode.postMessage({
		command: CommandToPanelEnum.Save,
		model: model
	});
}

export function sendSaveAndClose(model: TAddServerModel) {
	vscode.postMessage({
		command: CommandToPanelEnum.SaveAndClose,
		model: model
	});
}
