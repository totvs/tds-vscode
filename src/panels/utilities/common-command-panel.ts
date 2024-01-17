export enum CommonCommandFromWebViewEnum {
	_Save = "SAVE",
	_SaveAndClose = "SAVE_AND_CLOSE",
	_Close = "CLOSE",
	Ready = "READY",
	SelectFolder = "SELECT_FOLDER"
}

export type CommonCommandFromWebView = CommonCommandFromWebViewEnum;

export enum CommonCommandToWebViewEnum {
	InitialData = "INITIAL_DATA",
	UpdateModel = "UPDATE_MODEL",
	ValidateResponse = "VALIDATE_RESPONSE"
}

export type ReceiveMessage<C extends CommonCommandFromWebView, T = any> = {
	readonly command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}

export type SendMessage<C, T = any> = {
	readonly command: C,
	data: {
		model: T,
		[key: string]: any,
	}
}