export interface IMonitorPanelAction {
  action: MonitorPanelAction;
  content: any;
}

export enum MonitorPanelAction {
  SetSpeedUpdate,
  SetCodePageUpdate,
  UpdateUsers,
  ToggleAGroup,
  LockServer,
  SendMessage,
  KillConnection,
  StopServer,
  DoUpdateState,
  EnableUpdateUsers
}
