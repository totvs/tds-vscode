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

import { ServersConfig } from "../utils";
import { languageClient } from "../extension";
import * as vscode from "vscode";
import { ResponseError } from "vscode-languageclient";

export function revalidateRpo() {
  const server = ServersConfig.getCurrentServer();

  if (server) {
    const exec: Thenable<any> = languageClient
      .sendRequest("$totvsserver/revalidateRpo", {
        revalidateRpoInfo: {
          connectionToken: server.token,
          environment: server.environment,
        },
      })
      .then(
        (response: any) => {
          // Nothing to do
        },
        (err: ResponseError<object>) => {
          vscode.window.showErrorMessage(err.message);
        }
      );
    vscode.window.setStatusBarMessage(vscode.l10n.t("Revalidating RPO"), exec);
  } else {
    vscode.window.showErrorMessage(
      vscode.l10n.t("There is no server connected")
    );
  }
}
