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
          let authorizationToken: string = Utils.isServerP20OrGreater(server)
            ? Utils.getAuthorizationToken(server)
            : "";
          let packPatchInfo = false;
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
    `$(~spin) ${localize(
      "tds.vscode.servernotconnected",
      "Defragmenting RPO (process may take some time)"
    )}`,
    exec
  );
}