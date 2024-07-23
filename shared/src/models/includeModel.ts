import { deepCopy, TAbstractModelPanel } from "../panels/panelInterface";

export type TIncludePath = {
	path: string;
}

export type TIncludeModel = TAbstractModelPanel & {
	includePaths: TIncludePath[];
}

export type TGlobalIncludeModel = TIncludeModel;

export function EMPTY_INCLUDE_MODEL(): TIncludeModel {
	return {
		includePaths: []
	};
}

export function EMPTY_GLOBAL_INCLUDE_MODEL(): TGlobalIncludeModel {
	return { ...EMPTY_INCLUDE_MODEL() };
}