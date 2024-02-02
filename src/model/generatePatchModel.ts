import { TInspectorObject } from "../patch/patchUtil";
import { TModelPanel } from "./field-model";

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