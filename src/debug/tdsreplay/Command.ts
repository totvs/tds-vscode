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
    ShowSources,
    GetCurrentState
}

export enum CommandToPage {
  AddTimeLines,
  SelectTimeLine,
  OpenSourcesDialog,
  OpenWaitPage,
  ShowLoadingPageDialog,
  SetUpdatedState
}
