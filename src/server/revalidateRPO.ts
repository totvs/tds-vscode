import Utils from "../utils";
import { languageClient } from "../extension";
import * as vscode from "vscode";
import { ResponseError } from "vscode-languageclient";
import * as nls from "vscode-nls";
import { _debugEvent } from "../debug";

const localize = nls.loadMessageBundle();

export function revalidateRpo() {
  const server = Utils.getCurrentServer();

  if (server) {
    if (_debugEvent) {
      vscode.window.showWarningMessage("Esta operação não é permitida durante uma depuração.")
      return;
    }
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
    vscode.window.setStatusBarMessage("Revalidando RPO", exec);
  } else {
    vscode.window.showErrorMessage(
      localize("tds.vscode.servernotconnected", "There is no server connected")
    );
  }
}
