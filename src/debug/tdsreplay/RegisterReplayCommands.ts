import {commands,ExtensionContext,} from "vscode";
import { ImportSourcesOnlyResultPanel } from "./panels/ImportSourcesOnlyResultPanel";


export function ReplayRegisterCommands(context: ExtensionContext) {
	const importSourcesOnlyResult = commands.registerCommand("tdsreplay.importSourcesOnlyResult", (sourceList: any) => {
		ImportSourcesOnlyResultPanel.render(context.extensionUri, sourceList);
	});

	context.subscriptions.push(importSourcesOnlyResult);
}