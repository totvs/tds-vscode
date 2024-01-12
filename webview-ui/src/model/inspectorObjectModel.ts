import { TModelData } from "./modelData";

export type TInspectorObject = TModelData & {
	name: string;
	type: string;
	date: string;
}
