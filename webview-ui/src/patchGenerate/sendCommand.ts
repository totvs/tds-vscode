import { TInspectorObject } from "../model/inspectorObjectModel";
import { CommonCommandToPanelEnum, SendMessage } from "../utilities/common-command-webview";
import { vscode } from "../utilities/vscodeWrapper";

export function sendToLeft(model: any, selectedObject: TInspectorObject[]) {
	vscode.postMessage({
		command: CommonCommandToPanelEnum.MoveElements,
		data: {
			model: model,
			selectedObject: selectedObject,
			direction: "left"
		}
	});
}

export function sendIncludeTRes(model: any, includeTRes: boolean[]) {
	vscode.postMessage({
		command: CommonCommandToPanelEnum.IncludeTRes,
		data: {
			model: model,
			includeTRes: includeTRes
		}
	});
}

export function sendToRight(model: any, selectedObject: TInspectorObject[]) {
	vscode.postMessage({
		command: CommonCommandToPanelEnum.MoveElements,
		data: {
			model: model,
			selectedObject: selectedObject,
			direction: "right"
		}
	});
}

