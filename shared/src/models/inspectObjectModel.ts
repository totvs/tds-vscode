import { TModelPanel } from "../panels/panelInterface";

export type TInspectorObject = {
	source: string;
	date: string;
	rpo_status: string | number;
	source_status: string | number;
	function: string;
	line: number;
}

export type TInspectorObjectModel = TModelPanel & {
	includeOutScope: boolean;
	objects: TInspectorObject[];
}