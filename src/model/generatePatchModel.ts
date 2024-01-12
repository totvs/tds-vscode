import { TInspectorObject } from "../patch/patchUtil";
import { TModelPanel } from "./field-model";

export type TGeneratePatchModel = TModelPanel & {
	patchName: string;
	patchDest: string;
	objectsLeft: TInspectorObject[];
	objectsRight: TInspectorObject[];
}