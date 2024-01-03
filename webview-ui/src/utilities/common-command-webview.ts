import { TModelData } from "../model/addServerModel";
import { vscode } from "./vscodeWrapper";

export enum CommonCommandFromPanelEnum {
	InitialData = "INITIAL_DATA",
	UpdateModel = "UPDATE_MODEL",
	ValidateResponse = "VALIDATE_RESPONSE"
}

export type CommonCommandFromPanel = CommonCommandFromPanelEnum;

export type ReceiveMessage<C extends CommonCommandFromPanel, T = any> = {
	command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}

export enum CommonCommandToPanelEnum {
	Save = "SAVE",
	SaveAndClose = "SAVE_AND_CLOSE",
	Close = "CLOSE",
	Ready = "READY",
	Validate = "VALIDATE"
}

export type CommonCommandToPanel = CommonCommandToPanelEnum;

export type CommandFromPanel<C extends CommonCommandFromPanel, T = TModelData> = {
	readonly command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}

export type SendMessage<C extends CommonCommandToPanel, T = any> = {
	command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}

export function sendReady() {
	const message: SendMessage<CommonCommandToPanelEnum, any> = {
		command: CommonCommandToPanelEnum.Ready,
		data: {
			model: undefined
		}
	}

	vscode.postMessage(message);
}

export function sendValidateModel(model: TModelData) {
	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
		command: CommonCommandToPanelEnum.Validate,
		data: {
			model: model
		}
	}

	vscode.postMessage(message);
}

export function sendSave(model: TModelData) {
	console.log(">>>> sendSave");
	console.dir(model);
	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
		command: CommonCommandToPanelEnum.Save,
		data: {
			model: model
		}
	}

	vscode.postMessage(message);
}

export function sendSaveAndClose(model: any) {
	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
		command: CommonCommandToPanelEnum.SaveAndClose,
		data: {
			model: model
		}
	}

	vscode.postMessage(message);
}

export function sendClose() {
	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
		command: CommonCommandToPanelEnum.Close,
		data: {
			model: undefined
		}
	}
}
