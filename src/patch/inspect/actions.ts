export interface IApplyViewAction {
  action: ApplyViewAction;
  content?: any;
}

export enum ApplyViewAction {
	Ready,
	Init
}
