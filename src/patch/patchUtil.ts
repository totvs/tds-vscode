/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { _debugEvent } from "../debug";
import Utils, { ServersConfig } from "../utils";
import { commandBuildFile } from "../compile/tdsBuild";
import { sendPatchGenerateMessage } from "../protocolMessages";


export function patchGenerateFromFolder(context: any) {
	const server = ServersConfig.getCurrentServer();
	if (!server) {
		vscode.window.showErrorMessage(
			vscode.l10n.t("There is no server connected.")
		);
	} else {
		const options: vscode.OpenDialogOptions = {
			canSelectMany: false,
			canSelectFiles: false,
			canSelectFolders: true,
			openLabel: vscode.l10n.t("Select folder to save the Patch"),
			//filters: {
			//  'Text files': ['txt'],
			//   'All files': ['*']
			//}
		};
		vscode.window.showOpenDialog(options).then((fileUri) => {
			if (!fileUri || fileUri === undefined) {
				vscode.window.showErrorMessage(
					vscode.l10n.t("Folder not selected. The process will not continue.")
				);
			} else {
				vscode.window
					.showInputBox({
						placeHolder: vscode.l10n.t("Inform the Patch name or let empty to use the default name"),
						value: "",
					})
					.then((patchName) => {
						const allFilesNames: Array<string> = [];
						const allFilesFullPath: Array<string> = [];
						readFiles(
							context.fsPath,
							allFilesNames,
							allFilesFullPath,
							(err) => {
								vscode.window.showErrorMessage(err);
							}
						);
						commandBuildFile(context, false, allFilesFullPath);
						let destFolder = fileUri[0].toString();
						sendPatchGenerateMessage(
							server,
							"",
							destFolder,
							3,
							patchName,
							allFilesNames
						).then(() => {
							vscode.window.showInformationMessage(vscode.l10n.t("Patch file generated"));
						});
						//});
					});
			}
		});
	}
}


function readFiles(
	dirname: string,
	allFilesNames: Array<String>,
	allFilesFullPath: Array<string>,
	onError: any
) {
	let filenames = fs.readdirSync(dirname);
	filenames.forEach(function (filename) {
		if (!Utils.ignoreResource(filename)) {
			let fullPath = path.join(dirname, filename);
			if (fs.statSync(fullPath).isDirectory() && fs.statSync(fullPath)) {
				readFiles(fullPath, allFilesNames, allFilesFullPath, onError);
			} else {
				allFilesNames.push(filename);
				allFilesFullPath.push(fullPath);
			}
		} else {
			vscode.window.showWarningMessage(
				vscode.l10n.t("File/folder '{0}' was ignored.", filename)
			);
		}
	});
}
