import { TModelPanel } from "../panels/panelInterface";

export type TIncludePath = {
	path: string;
}

export type TIncludeModel = TModelPanel & {
	includePaths: TIncludePath[];
}