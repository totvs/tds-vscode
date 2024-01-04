import { CommonCommandToPanelEnum, SendMessage } from "../utilities/common-command-webview";
import { vscode } from "../utilities/vscodeWrapper";

export function sendCheckDir(model: any, selectedDir: string) {
	vscode.postMessage({
		command: CommonCommandToPanelEnum.CheckDir,
		data: {
			model: model,
			selectedDir: selectedDir
		}
	});
}


