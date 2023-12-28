// Comandos aqui definidos, tem seus equivalentes definidos
// webview-ui\src\utilities\command-panel.ts : CommandFromPanelEnum
// e tratados no listener da APLICAÇÃO.
export enum CommandToUiEnum {
  InitializeData = "INITIALIZE_DATA",
  UpdateModel = "UPDATE_MODEL",
  ValidateResponse = "VALIDATE_RESPONSE",
}

// Comandos aqui definidos, tem seus equivalentes definidos
// webview-ui\src\utilities\command-panel.ts : CommandToPanelEnum
// e tratados no listener do PAINEL.
export enum CommandFromUiEnum {
  Ready = "READY",
  CheckDir = "CHECK_DIR",
  Save = "SAVE",
  SaveAndClose = "SAVE_AND_CLOSE",
  Validate = "VALIDATE",
}