export interface IInspectorPanelAction {
  action: InspectorPanelAction;
  content: any;
}

export enum InspectorPanelAction {
  UpdateInspectorInfo,
  ExportToTxt,
  DoUpdateState,
}
