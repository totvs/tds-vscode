// Comandos aqui definidos, tem seus equivalentes definidos
// src\panels\utilities\command-ui.ts : CommandFromPanelEnum
// e tratados no listener do PAINEL.
export enum CommandToPanelEnum {
	CheckDir = "CHECK_DIR",
	Save = "SAVE",
	SaveAndClose = "SAVE_AND_CLOSE",
	Ready = "Ready"
}

// Comandos aqui definidos, tem seus equivalentes definidos
// src\panels\utilities\command-ui.ts : CommandToPanelEnum
// e tratados no listener da APLICAÇÃO.
export enum CommandFromPanelEnum {
	InitialData = "INITIAL_DATA",
	UpdateModel = "UPDATE_MODEL",
}