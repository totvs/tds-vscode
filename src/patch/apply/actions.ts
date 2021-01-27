export interface IApplyPatchPanelAction {
  action: ApplyPatchPanelAction;
  content: any;
}
export enum ApplyPatchPanelAction {
	UpdatePage,
	SelectFile,
	ValidateFile,
	InformationFile,
	DoUpdateState,
	RemoveFile,
	UpdateData,
	Apply,
	ShowContent
}
