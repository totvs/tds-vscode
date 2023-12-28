import { TModelData } from "../model/addServerModel";
import { CommandToPanelEnum } from "../utilities/command-panel";
import { vscode } from "../utilities/vscodeWrapper";

export interface IAddServerCommand {
	selectedDir: string;
}

export interface IValidateCommand {
	model: {};
}

export function sendReady() {
	vscode.postMessage({
		command: CommandToPanelEnum.Ready,
		model: {}
	});
}

export function sendValidateModel(model: TModelData) {
	vscode.postMessage<IValidateCommand>({
		command: CommandToPanelEnum.Validate,
		model: model
	});
}

export function sendCheckDir(model: any, selectedDir: string) {
	vscode.postMessage<IAddServerCommand>({
		command: CommandToPanelEnum.CheckDir,
		model: model,
		selectedDir: selectedDir
	});
}

export function sendSave(model: any) {
	vscode.postMessage({
		command: CommandToPanelEnum.Save,
		model: model
	});
}

export function sendSaveAndClose(model: any) {
	vscode.postMessage({
		command: CommandToPanelEnum.SaveAndClose,
		model: model
	});
}
