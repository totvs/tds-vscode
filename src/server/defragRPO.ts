import Utils from "../utils";
import { languageClient } from "../extension";
import * as vscode from "vscode";
import { ResponseError } from "vscode-languageclient";
import * as nls from "vscode-nls";
import { _debugEvent } from "../debug";

const localize = nls.loadMessageBundle();

export function defragRpo() {
  const server = Utils.getCurrentServer();

  if (server) {
    if (_debugEvent) {
      vscode.window.showWarningMessage("Esta operação não é permitida durante uma depuração.")
      return;
    }
    let authorizationToken: string = Utils.isSafeRPO(server) ? Utils.getAuthorizationToken(server) : "";
    const exec: Thenable<any> = languageClient
      .sendRequest("$totvsserver/defragRpo", {
        defragRpoInfo: {
          connectionToken: server.token,
					authorizationToken: authorizationToken,
          environment: server.environment,
          packPatchInfo: true,
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
    vscode.window.setStatusBarMessage("Desfragmentando RPO", exec);
  } else {
    vscode.window.showErrorMessage(
      localize("tds.vscode.servernotconnected", "There is no server connected")
    );
  }
}
