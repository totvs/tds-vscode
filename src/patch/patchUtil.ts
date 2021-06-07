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
import { ResponseError } from "vscode-languageclient";
import { _debugEvent } from "../debug";
import { languageClient } from "../extension";
import Utils from "../utils";
import { PatchResult } from "./patchGenerate";

export function sendPatchGenerateMessage(server, patchMaster, patchDest, patchType, patchName, filesPath) {
	return languageClient.sendRequest('$totvsserver/patchGenerate', {
		"patchGenerateInfo": {
			connectionToken: server.token,
			authorizationToken: Utils.getAuthorizationToken(server),
			environment: server.environment,
			patchMaster: patchMaster,
			patchDest: patchDest,
			isLocal: true,
			patchType: patchType,
			name: patchName,
			patchFiles: filesPath
		}
	}).then((response: PatchResult) => {
		if (response.returnCode === 40840) { // AuthorizationTokenExpiredError
			Utils.removeExpiredAuthorization();
		}
		return response;
	}, (err: ResponseError<object>) => {
		vscode.window.showErrorMessage(err.message);
	});
}
