import { tdsVscode } from "@totvs/tds-webtoolkit";
import { TInspectorObject } from "tds-shared/lib";

enum PatchGenerateCommandEnum {
	IncludeTRes = "INCLUDE_TRES",
	MoveElements = "MOVE_ELEMENTS",
}

export function sendToLeft(model: any, selectedObject: TInspectorObject[]) {
	tdsVscode.postMessage({
		command: PatchGenerateCommandEnum.MoveElements,
		data: {
			model: model,
			selectedObject: selectedObject,
			direction: "left"
		}
	});
}

export function sendIncludeTRes(model: any, includeTRes: boolean[]) {
	tdsVscode.postMessage({
		command: PatchGenerateCommandEnum.IncludeTRes,
		data: {
			model: model,
			includeTRes: includeTRes
		}
	});
}

export function sendToRight(model: any, selectedObject: TInspectorObject[]) {
	tdsVscode.postMessage({
		command: PatchGenerateCommandEnum.MoveElements,
		data: {
			model: model,
			selectedObject: selectedObject,
			direction: "right"
		}
	});
}

