import Utils, { ServersConfig } from "../utils";
import { languageClient } from "../extension";
import * as vscode from "vscode";
import { ResponseError } from "vscode-languageclient";
import { _debugEvent } from "../debug";

export function defragRpo() {
  const server = ServersConfig.getCurrentServer();

  if (server) {
    if (_debugEvent) {
      vscode.window.showWarningMessage(
        vscode.l10n.t("This operation is not allowed during a debug.")
      );
      return;
    }

    vscode.window
      .showWarningMessage(
        vscode.l10n.t("Are you sure you want to defrag the RPO? (This process may take some time)"),
        { modal: true },
        vscode.l10n.t("Yes"),
        vscode.l10n.t("No")
      )
      .then((clicked) => {
        if (clicked === vscode.l10n.t("Yes")) {
          if (Utils.isServerP20OrGreater(server)) {
            let packPatchInfo = false;
            let authorizationToken: string = ServersConfig.getAuthorizationToken(server);
            if (authorizationToken.length > 0) {
              vscode.window
                .showWarningMessage(
                  vscode.l10n.t("Clear apply patch history?"),
                  { modal: true },
                  vscode.l10n.t("Yes"),
                  vscode.l10n.t("No")
                )
                .then((clicked) => {
                  if (clicked === vscode.l10n.t("Yes")) {
                    packPatchInfo = true;
                  }
                  execDefragRpo(server.token, authorizationToken, server.environment, packPatchInfo);
                });
            }
            else {
              execDefragRpo(server.token, authorizationToken, server.environment, packPatchInfo);
            }
          }
          else {
            // até a LG 19 e anteriores, efetuar sempre a remoção do log de aplicação de patch
            // pois o RPO guardava uma "cópia" do patch aplicado fazendo com que o RPO aumentasse muito de tamanho
            execDefragRpo(server.token, "", server.environment, true);
          }
        }
      });
  } else {
    vscode.window.showErrorMessage(
      vscode.l10n.t("There is no server connected")
    );
  }
}

function execDefragRpo(connectionToken, authorizationToken, environment, packPatchInfo) {
  const exec: Thenable<any> = languageClient
    .sendRequest("$totvsserver/defragRpo", {
      defragRpoInfo: {
        connectionToken: connectionToken,
        authorizationToken: authorizationToken,
        environment: environment,
        packPatchInfo: packPatchInfo,
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
  vscode.window.setStatusBarMessage(
    `$(gear~spin) ${vscode.l10n.t("Defragmenting RPO (process may take some time)")}`,
    exec
  );
}