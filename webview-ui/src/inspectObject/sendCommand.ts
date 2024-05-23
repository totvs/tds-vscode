import { tdsVscode } from "@totvs/tds-webtoolkit";

enum InspectObjectCommandEnum {
	IncludeOutScope = "INCLUDE_OUT_SCOPE",
	Export = "EXPORT",
}

export function sendExport(model: any, type: string) {
	tdsVscode.postMessage({
		command: InspectObjectCommandEnum.Export,
		data: {
			model: model,
			type: type,
		}
	});
}

export function sendIncludeOutScope(model: any, includeOutScope: boolean) {
	tdsVscode.postMessage({
		command: InspectObjectCommandEnum.IncludeOutScope,
		data: {
			model: model,
			includeOutScope: includeOutScope
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

