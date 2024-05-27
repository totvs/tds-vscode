import { TModelPanel } from "../panels/panelInterface";
import { TInspectorObject } from "./inspectObjectModel";

export type TGeneratePatchModel = TModelPanel & {
	patchName: string;
	patchDest: string;
	includeTRes: boolean;
	filter: string;
	warningManyItens: boolean;
	objectsLeft: TInspectorObject[];
	objectsRight: TInspectorObject[];
	objectsFiltered: any;
}