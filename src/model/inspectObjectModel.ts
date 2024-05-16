import { TModelPanel } from "../panels/panel";

export type TInspectorObject = {
	program: string;
	date: string;
	status: string;
	rpo: string;
}

export type TInspectorObjectModel = TModelPanel & {
	includeTRes: boolean;
	filter: string;
	objects: TInspectorObject[];
}