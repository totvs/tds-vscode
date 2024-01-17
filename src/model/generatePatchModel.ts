import { TInspectorObject } from "../patch/patchUtil";
import { TModelPanel } from "./field-model";

export type TGeneratePatchModel = TModelPanel & {
	patchName: string;
	outputPath: string;
	includeTRes: boolean;
	filter: string;
	warningManyItens: boolean;
	objectsLeft: TInspectorObject[];
	objectsRight: TInspectorObject[];
	objectsFiltered: any;
}