export interface ICommand {
  action: CommandAction;
  content: any;
}

export enum CommandAction {
  ToggleServer,
  SetSpeedUpdate,
  UpdateUsers,
  ToggleAGroup,
  LockServer,
  SendMessage,
  KillConnection,
  StopServer,
  ToggleWriteLogServer
}
