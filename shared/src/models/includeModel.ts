import { deepCopy, TAbstractModelPanel } from "../panels/panelInterface";

export type TIncludePath = {
	path: string;
}

export type TIncludeModel = TAbstractModelPanel & {
	includePaths: TIncludePath[];
}

export type TGlobalIncludeModel = TIncludeModel;

export const EMPTY_INCLUDE_MODEL: TIncludeModel =
	deepCopy<TIncludeModel>({
		includePaths: []
	});

export const EMPTY_GLOBAL_INCLUDE_MODEL: TGlobalIncludeModel =
	deepCopy<TGlobalIncludeModel>({ ...EMPTY_INCLUDE_MODEL });
