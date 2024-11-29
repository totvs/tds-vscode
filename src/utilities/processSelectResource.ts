import * as vscode from 'vscode';

type TSendSelectResourceOptions = {
	target: string;
	canSelectMany: boolean,
	canSelectFiles: boolean,
	canSelectFolders: boolean,
	currentFolder: string,
	title: string,
	openLabel: string,
	accept: string;
}

export function processSelectResourceMessage(webview: vscode.Webview, message: any): boolean {
	let result: boolean = false;

	if (message.command == "SELECT_RESOURCE") {
		const selectionProps: TSendSelectResourceOptions = message.data;
		const filters = {};

		if (selectionProps.accept) {
			filters["Accept files"] = [];

			selectionProps.accept.split(",").forEach((element: string) => {
				let key: string;
				let value: string;

				if (element.startsWith(".")) {
					key = `*${element}`;
					value = `${element.substring(1)}`;
				} else {
					key = `${element}`;
					value = `${element}`;
				}

				filters[key] = [value];
				filters["Accept files"].push(...filters[key]);
			});
		}

		if (!filters["All files"]) {
			filters["All files"] = ["*"];
		}

		const options: vscode.OpenDialogOptions = {
			canSelectMany: selectionProps.canSelectMany,
			canSelectFiles: selectionProps.canSelectFiles,
			canSelectFolders: selectionProps.canSelectFolders,
			defaultUri: vscode.Uri.file(selectionProps.currentFolder),
			title: selectionProps.title,
			openLabel: selectionProps.openLabel,
			filters: filters
		};

		vscode.window.showOpenDialog(options)
			.then((fileUris: vscode.Uri[]) => {
				webview.postMessage({
					command: "AFTER_SELECT_RESOURCE",
					data: {
						target: selectionProps.target,
						files: fileUris.map((uri: vscode.Uri)=> {
							if (uri.path.startsWith("/") && uri.path.search(":")==2) {
								return uri.path.substring(1).replace(/\//g, "\\");
							}

							return uri.path;
						} )
					}
				});
			}
		);

		result = true;
	}

	return result;
}