export interface ICommand {
  action: CommandAction;
  content: any;
}

export enum CommandAction {
    SetTimeLine,
    ChangeRowsPerPage,
    ChangePage,
    ChangeItemsPerPage,
    SetIgnoreSourcesNotFound
}
