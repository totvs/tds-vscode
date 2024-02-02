export enum CommonCommandFromWebViewEnum {
	Save = "SAVE",
	SaveAndClose = "SAVE_AND_CLOSE",
	Close = "CLOSE",
	Ready = "READY",
	SelectResource = "SELECT_RESOURCE",
	AfterSelectResource = "AFTER_SELECT_RESOURCE",
	MoveElements = "MOVE_ELEMENTS",
	IncludeTRes = "INCLUDE_TRES",
}

export type CommonCommandFromWebView = CommonCommandFromWebViewEnum;

export enum CommonCommandToWebViewEnum {
	InitialData = "INITIAL_DATA",
	UpdateModel = "UPDATE_MODEL",
}

export type ReceiveMessage<C extends CommonCommandFromWebView, T = any> = {
	command: C,
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