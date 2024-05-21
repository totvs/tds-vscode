import { tdsVscode } from "@totvs/tds-webtoolkit";
import { TInspectorObject } from "../model/inspectorObjectModel";

enum PatchGenerateCommandEnum {
	IncludeTRes = "INCLUDE_TRES",
	Export = "EXPORT",
	// 	MoveElements = "MOVE_ELEMENTS",
}

// export function sendToLeft(model: any, selectedObject: TInspectorObject[]) {
// 	tdsVscode.postMessage({
// 		command: PatchGenerateCommandEnum.MoveElements,
// 		data: {
// 			model: model,
// 			selectedObject: selectedObject,
// 			direction: "left"
// 		}
// 	});
// }

export function sendExport(type: string, model: any) {
	tdsVscode.postMessage({
		command: PatchGenerateCommandEnum.Export,
		data: {
			type: type,
			model: model,
		}
	});
}

export function sendIncludeTRes(model: any, includeTRes: boolean) {
	tdsVscode.postMessage({
		command: PatchGenerateCommandEnum.IncludeTRes,
		data: {
			model: model,
			includeTRes: includeTRes
		}
	});
}

// export function sendToRight(model: any, selectedObject: TInspectorObject[]) {
// 	tdsVscode.postMessage({
// 		command: PatchGenerateCommandEnum.MoveElements,
// 		data: {
// 			model: model,
// 			selectedObject: selectedObject,
// 			direction: "right"
// 		}
// 	});
// }

