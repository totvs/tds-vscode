import { string } from "prop-types";
import * as vscode from "vscode";

import { languageClient } from "../extension";
import { ServerItem } from "../serverItem";
import { ServersConfig } from "../utils";

export function tlppTools(message: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let serverResponse: string;
    const server = ServersConfig.getCurrentServer();

    if (server)
    {
      const allInfoServer: any = ServersConfig.getServerById(server.id);
      if (allInfoServer) {
        server.address = allInfoServer.address;
        server.port = allInfoServer.port;
      }
    }
    else
    {
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
){
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
