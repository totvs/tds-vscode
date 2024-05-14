import { TModelPanel } from "../panels/panel";
import { TInspectorObject } from "../patch/patchUtil";

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