export interface IInspectorPanelAction {
  action: InspectorPanelAction;
  content: any;
}

export enum InspectorPanelAction {
  RefreshInspectorInfo,
  UpdateInspectorInfo,
  ExportToTxt,
  DoUpdateState,
}
