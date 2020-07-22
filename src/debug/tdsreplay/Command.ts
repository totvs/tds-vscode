export interface ICommand {
  action: CommandToDA | CommandToPage;
  content: any;
}

export enum CommandToDA {
    SetTimeLine,
    ChangeRowsPerPage,
    ChangePage,
    ChangeItemsPerPage,
    SetIgnoreSourcesNotFound,
    ShowSources
}

export enum CommandToPage {
  AddTimeLines,
  SelectTimeLine,
  OpenSourcesDialog
}
