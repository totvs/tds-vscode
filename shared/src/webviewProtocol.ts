export enum CommonCommandFromWebViewEnum {
	AfterSelectResource = "AFTER_SELECT_RESOURCE",
	Close = "CLOSE",
	Ready = "READY",
	Reset = "RESET",
	Save = "SAVE",
	SaveAndClose = "SAVE_AND_CLOSE",
	SelectResource = "SELECT_RESOURCE",
}

export type CommonCommandFromWebView = CommonCommandFromWebViewEnum;

export enum CommonCommandToWebViewEnum {
	InitialData = "INITIAL_DATA",
	UpdateModel = "UPDATE_MODEL",
}

