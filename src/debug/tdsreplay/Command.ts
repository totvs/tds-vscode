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
  GetCurrentState,
  ShowSources,
  SetSelectedSources,
}

export enum CommandToPage {
  AddTimeLines,
  SelectTimeLine,
  OpenSourcesDialog,
  OpenWaitPage,
  ShowLoadingPageDialog,
  ShowMessageDialog,
  SetUpdatedState
}
