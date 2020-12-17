import * as vscode from "vscode";
import * as nls from "vscode-nls";
import { ServerItem } from "./serverItemProvider";
import Utils from "./utils";

const localize = nls.config({
	locale: vscode.env.language,
	bundleFormat: nls.BundleFormat.standalone,
})();

let totvsStatusBarItem: vscode.StatusBarItem;
let saveLocationBarItem: vscode.StatusBarItem;

export function initStatusBarItems(context: vscode.ExtensionContext) {
	initStatusBarItem(context);
	initSaveLocationBarItem(context);
}

function initStatusBarItem(context: vscode.ExtensionContext) {
	totvsStatusBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		100
	);
	totvsStatusBarItem.command = "totvs-developer-studio.serverSelection";
	totvsStatusBarItem.text = localize("tds.vscode.initializing", "(initializing)");
	totvsStatusBarItem.tooltip = totvsStatusBarItem.text;

	context.subscriptions.push(totvsStatusBarItem);
	context.subscriptions.push(Utils.onDidSelectedServer(updateStatusBarItem));

	totvsStatusBarItem.show();
}

export function updateStatusBarItem(selectServer: ServerItem | undefined): void {
	if (selectServer) {
		totvsStatusBarItem.text = `${selectServer.name} / ${selectServer.environment}`;
		totvsStatusBarItem.tooltip = `Address: ${selectServer.address}`
	} else {
		totvsStatusBarItem.text = localize(
			"tds.vscode.select_server_environment",
			"Select server/environment"
		);
		totvsStatusBarItem.tooltip = localize(
			"tds.vscode.select_server_environment.tooltip",
			"Select a server and environment in the server view"
		);
	}

	totvsStatusBarItem.show();
}

function initSaveLocationBarItem(context: vscode.ExtensionContext) {
	saveLocationBarItem = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left,
		100
	);
	saveLocationBarItem.command = "totvs-developer-studio.toggleSaveLocation";

	context.subscriptions.push(saveLocationBarItem);
	//context.subscriptions.push(Utils.onDidSelectedServer(updateStatusBarItem));

	updateSaveLocationBarItem();
}


export function updateSaveLocationBarItem() {
	const workspace: boolean = Utils.isWorkspaceServerConfig()
	const location: string = Utils.getServerConfigFile()

	if (workspace) {
		saveLocationBarItem.text = "$(globe)";
	} else {
		saveLocationBarItem.text = "$(home)";
	}
	saveLocationBarItem.tooltip = location;

	saveLocationBarItem.show();
}
