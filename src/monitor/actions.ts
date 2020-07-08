export interface IMonitorPanelAction {
  action: MonitorPanelAction;
  content: any;
}

export enum MonitorPanelAction {
  SetSpeedUpdate,
  UpdateUsers,
  ToggleAGroup,
  LockServer,
  SendMessage,
  KillConnection,
  StopServer,
  DoUpdateState
}
