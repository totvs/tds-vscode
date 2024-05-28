import { TAbstractModelPanel } from "../panels/panelInterface";

export type TIncludePath = {
	path: string;
}

export type TIncludeModel = TAbstractModelPanel & {
	includePaths: TIncludePath[];
}