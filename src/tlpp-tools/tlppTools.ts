/*
Copyright 2021-2024 TOTVS S.A

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

import { languageClient } from "../extension";
import { ServerItem } from "../serverItem";
import { ServersConfig } from "../utils";

export function tlppTools(message: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let serverResponse: string;
    const server = ServersConfig.getCurrentServer();

    if (server) {
      const allInfoServer: any = ServersConfig.getServerById(server.id);
      if (allInfoServer) {
        server.address = allInfoServer.address;
        server.port = allInfoServer.port;
      }
    }
    else {
      reject(
        new Error(
          "No server connected. Check if there is a server connected in 'totvs.tds-vscode' extension."
        )
      );
      return;
    }

    doRequest(server, message).then((result) => {
      serverResponse = result;
      resolve(serverResponse);
    });
  });
}

async function doRequest(
  server: ServerItem,
  params: string,
) {
  return languageClient.sendRequest("$totvstlpptools/tlppTools", {
    getTlppTools: {
      connectionToken: server.token,
      environment: server.environment,
      requestParams: params
    },
  })
    .then(
      (response: any) => {
        return response.requestResponse;
      },
      (err: Error) => {
        languageClient.error(err.message);
        vscode.window.showErrorMessage(
          err.message + vscode.l10n.t(". See log for details.")
        );
      }
    );
}
