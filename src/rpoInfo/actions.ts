export interface IRpoInfoPanelAction {
  action: RpoInfoPanelAction;
  content: any;
}




export enum RpoInfoPanelAction {
  ExportToTxt,
  ExportToJson,
  UpdateRpoInfo,
  DoUpdateState
}
