export interface ICommand {
  action: CommandAction;
  content: any;
}

export enum CommandAction {
    UpdateData,
    LoadData
}
