import { ServersConfig } from "../utils";
import { languageClient } from "../extension";
import * as vscode from "vscode";
import { ResponseError } from "vscode-languageclient";
import { _debugEvent } from "../debug";

export function revalidateRpo() {
  const server = ServersConfig.getCurrentServer();

  if (server) {
    if (_debugEvent) {
      vscode.window.showWarningMessage(vscode.l10n.t("This operation is not allowed during a debug."))
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
    vscode.window.setStatusBarMessage(vscode.l10n.t("Revalidating RPO"), exec);
  } else {
    vscode.window.showErrorMessage(
      vscode.l10n.t("There is no server connected")
    );
  }
}
