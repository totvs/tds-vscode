export interface ICommand {
  action: CommandAction;
  content: any;
}

export enum CommandAction {
    AddTimeLines,
    SetTimeLine,
    ChangeRowsPerPage,
    ChangePage,
    ChangeItemsPerPage,
    SetIgnoreSourcesNotFound,
    SelectTimeLine
}
