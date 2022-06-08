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
      vscode.window.showWarningMessage(
        "This operation is not allowed during a debug."
      );
      return;
    }

    vscode.window
      .showWarningMessage(
        localize(
          "tds.vscode.defrag.rpo",
          "Are you sure you want to defrag the RPO? (This process may take some time)"
        ),
        localize("tds.vscode.yes", "Yes"),
        localize("tds.vscode.no", "No")
      )
      .then((clicked) => {
        if (clicked === localize("tds.vscode.yes", "Yes")) {
          if (Utils.isServerP20OrGreater(server)) {
            let packPatchInfo = false;
            let authorizationToken: string = Utils.getAuthorizationToken(server);
            if (authorizationToken.length > 0) {
              vscode.window
              .showWarningMessage(
                localize(
                  "tds.vscode.defrag.packPatchInfo",
                  "Clear apply patch history?"
                ),
                localize("tds.vscode.yes", "Yes"),
                localize("tds.vscode.no", "No")
              )
              .then((clicked) => {
                if (clicked === localize("tds.vscode.yes", "Yes")) {
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
      localize("tds.vscode.servernotconnected", "There is no server connected")
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
    `$(gear~spin) ${localize(
      "tds.vscode.servernotconnected",
      "Defragmenting RPO (process may take some time)"
    )}`,
    exec
  );
}