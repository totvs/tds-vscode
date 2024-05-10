// import { TModelData } from "../model/modelData";
// import { vscode } from "./vscodeWrapper";

// export enum CommonCommandEnum {
// 	InitialData = "INITIAL_DATA",
// 	UpdateModel = "UPDATE_MODEL",
// }

// export type CommonCommandFromPanel = CommonCommandEnum;

// export type ReceiveMessage<C extends CommonCommandFromPanel, T = any> = {
// 	command: C,
// 	data: {
// 		model: T,
// 		[key: string]: any,
// 	}
// }

// export enum CommonCommandToPanelEnum {
// 	Save = "SAVE",
// 	SaveAndClose = "SAVE_AND_CLOSE",
// 	Close = "CLOSE",
// 	Ready = "READY",
// 	Reset = "RESET",
// 	Validate = "VALIDATE",
// 	CheckDir = "CHECK_DIR",
// 	SelectResource = "SELECT_RESOURCE",
// 	UpdateModel = "UPDATE_MODEL",
// 	MoveElements = "MOVE_ELEMENTS",
// 	IncludeTRes = "INCLUDE_TRES",
// 	GetInfoPatch = "GET_INFO_PATCH",
// }

// export type CommonCommandToPanel = CommonCommandToPanelEnum;

// export type CommandFromPanel<C extends CommonCommandFromPanel, T = TModelData> = {
// 	readonly command: C,
// 	data: {
// 		model: T,
// 		[key: string]: any,
// 	}
// }

// export type SendMessage<C extends CommonCommandToPanel, T = any> = {
// 	command: C,
// 	data: {
// 		model: T,
// 		[key: string]: any,
// 	}
// }

// export function sendReady() {
// 	const message: SendMessage<CommonCommandToPanelEnum, any> = {
// 		command: CommonCommandToPanelEnum.Ready,
// 		data: {
// 			model: undefined
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export function sendReset(model: TModelData) {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.Reset,
// 		data: {
// 			model: model
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export type TSendSelectResourceProps = {
// 	canSelectMany: boolean,
// 	canSelectFiles: boolean,
// 	canSelectFolders: boolean,
// 	currentFolder: string,
// 	title: string,
// 	openLabel: string,
// 	filters: {
// 		[key: string]: string[]
// 	}
// }

// export function sendSelectResource(firedBy: string, props: TSendSelectResourceProps & { model: TModelData }) {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.SelectResource,
// 		data: {
// 			...props,
// 			firedBy: firedBy
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export function sendValidateModel(model: TModelData) {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.Validate,
// 		data: {
// 			model: model
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export function sendSave(model: TModelData) {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.Save,
// 		data: {
// 			model: model
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export function sendSaveAndClose(model: any) {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.SaveAndClose,
// 		data: {
// 			model: model
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export function sendUpdateModel(model: any) {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.UpdateModel,
// 		data: {
// 			model: model
// 		}
// 	}

// 	vscode.postMessage(message);
// }

// export function sendClose() {
// 	const message: SendMessage<CommonCommandToPanelEnum, TModelData> = {
// 		command: CommonCommandToPanelEnum.Close,
// 		data: {
// 			model: undefined
// 		}
// 	}

// 	vscode.postMessage(message);
// }
