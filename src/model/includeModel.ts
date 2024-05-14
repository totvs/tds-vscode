import { TModelPanel } from "../panels/panel";

export type TIncludePath = {
	path: string;
}

export type TIncludeModel = TModelPanel & {
	includePaths: TIncludePath[];
}