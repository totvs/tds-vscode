import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import Utils from "../utils";
import { languageClient } from "../extension";
import * as nls from "vscode-nls";
import { ResponseError } from "vscode-languageclient";
import JSZip = require("jszip");
import { ServerItem } from "../serverItemProvider";

let localize = nls.loadMessageBundle();
const compile = require("template-literal");

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
  "tds.webview.patch.apply": localize("tds.webview.patch.apply", "Apply Patch"),
  "tds.webview.server.name": localize("tds.webview.server.name", "Server Name"),
  "tds.webview.address": localize("tds.webview.address", "Address"),
  "tds.webview.environment": localize("tds.webview.environment", "Environment"),
  "tds.webview.patch.file": localize("tds.webview.patch.file", "Patch File"),
  "tds.webview.applyOld": localize("tds.webview.applyOld", "Apply old files"),
  "tds.webview.col01": localize("tds.webview.col01", "Patch Name"),
  "tds.webview.col02": localize("tds.webview.col02", "Patch Full Path"),
};

export function patchApply(
  context: any,
  isWorkspace: boolean,
  args?: any[]
): void {
  if (currentPanel) {
    currentPanel.reveal();
  } else {
    const server = Utils.getCurrentServer();

    if (server) {
      const allInfoServer: any = Utils.getServerById(server.id);

      if (allInfoServer) {
        server.address = allInfoServer.address;
        server.port = allInfoServer.port;
      }

      if (!isWorkspace) {
        currentPanel = vscode.window.createWebviewPanel(
          "totvs-developer-studio.patchApply",
          "Patch Apply",
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, "src", "patch")),
            ],
            retainContextWhenHidden: true,
          }
        );

        currentPanel.webview.html = getWebViewContent(context, localizeHTML);
        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined;
          },
          null,
          context.subscriptions
        );

        currentPanel.webview.postMessage({
          command: "setCurrentServer",
          serverCurrent: server,
        });

        currentPanel.webview.onDidReceiveMessage(
          async (message) => {
            switch (message.command) {
              case "patchApply":
                if (message.patchFile.length === 0) {
                  vscode.window.showErrorMessage(
                    localize(
                      "tds.webview.patch.apply.fail",
                      "Apply Patch Fail. Please input patch file."
                    )
                  );
                } else {
                  vscode.window
                    .withProgress(
                      {
                        cancellable: false,
                        location: vscode.ProgressLocation.Notification,
                        title: localize(
                          "tds.webview.applying_server",
                          `Applying patch`
                        ),
                      },
                      async (progress, token) => {
                        let step: number = 100 / (message.patchFile.length + 1);
                        progress.report({ increment: step / 2 });
                        let index: number = 0;

                        for await (const element of message.patchFile) {
                          index++;
                          progress.report({
                            increment: step,
                            message: `(${index}/${message.patchFile.length}) ${element}`,
                          });

                          await doApplyPatch(
                            server,
                            vscode.Uri.file(element).toString(),
                            message.applyOld
                          ).then(
                            () => {},
                            (reason: any) => {
                              languageClient.error(reason);
                            }
                          );
                        }

                        progress.report({
                          increment: 100,
                          message: localize(
                            "tds.webview.patchs_applied",
                            "Patchs applied ( files)" //${index}
                          ),
                        });
                      }
                    )
                    .then(() => {
                      if (currentPanel) {
                        if (message.close) {
                          currentPanel.dispose();
                        }
                      }
                    });
                }

                if (currentPanel) {
                  if (message.close) {
                    currentPanel.dispose();
                  }
                }

                break;

              case "extractPatchsFiles":
                // msg emitida com tempo, pois o processo de verificação do zip
                // é muito rápido (zip de expedição contiuna com +40M e 4 ptm, leva < 2 seg)

                vscode.window.withProgress(
                  {
                    location: vscode.ProgressLocation.Window,
                    cancellable: false,
                    title: `${localize(
                      "tds.vscode.starting.build.patch",
                      "Checking zip files"
                    )}`,
                  },
                  async (progress) => {
                    progress.report({ increment: 0 });

                    await extractPatchsFiles(message.files).then(
                      async (files) => {
                        if (files.length === 0) {
                          vscode.window.showWarningMessage(
                            "No patch file found in zip files."
                          );
                        } else {
                          const step = 100 / (files.length + 2);

                          for await (const element of files) {
                            progress.report({
                              increment: step,
                            });

                            if (currentPanel) {
                              currentPanel.webview.postMessage({
                                command: "addFilepath",
                                file: element,
                              });
                            }
                          }
                        }
                      },
                      (reason: any) => {
                        vscode.window.showErrorMessage(reason);
                      }
                    );
                    progress.report({ increment: 100 });
                  }
                );
                break;

              case "showDuplicateWarning":
                vscode.window.showWarningMessage(
                  "Already selected. File: " + message.filename
                );
                break;

              case "patchValidate":
                if (message.file) {
                  vscode.window.showInformationMessage("PatchValidate");
                  const validateArgs = {
                    fsPath: message.file,
                  };
                  vscode.commands.executeCommand(
                    "totvs-developer-studio.patchValidate.fromFile",
                    validateArgs
                  );
                } else {
                  vscode.window.showInformationMessage(
                    localize(
                      "tds.webview.patch.apply.select.file",
                      "Select a file for operation."
                    )
                  );
                }
                break;

              case "patchInfo":
                if (message.file) {
                  const args = {
                    fsPath: message.file,
                  };
                  vscode.commands.executeCommand(
                    "totvs-developer-studio.patchInfos.fromFile",
                    args
                  );
                } else {
                  vscode.window.showInformationMessage(
                    localize(
                      "tds.webview.patch.apply.select.file",
                      "Select a file for operation."
                    )
                  );
                }
                break;
            }
          },
          undefined,
          context.subscriptions
        );
      } else {
        let filename: string = "";
        if (args && args["path"] !== undefined) {
          //A ação veio pelo menu de contexto por exemplo, e/ou com o fsPath preenchido corretamente
          filename = args["path"];
        }
        if (filename !== "") {
          const patchFile = filename;
          vscode.window
            .showWarningMessage(
              localize(
                "tds.webview.patch.apply.file",
                "Are you sure you want patch {0} the RPO?",
                path.basename(filename)
              ),
              localize("tds.vscode.yes", "Yes"),
              localize("tds.vscode.no", "No")
            )
            .then((clicked) => {
              if (clicked === localize("tds.vscode.yes", "Yes")) {
                const patchUri = vscode.Uri.file(patchFile).toString();

                languageClient
                  .sendRequest("$totvsserver/patchApply", {
                    patchApplyInfo: {
                      connectionToken: server.token,
                      authorizationToken: Utils.getAuthorizationToken(server),
                      environment: server.environment,
                      patchUri: patchUri,
                      isLocal: true,
                      isValidOnly: false,
                      applyScope: "only_new",
                    },
                  })
                  .then(
                    (response: any) => {
                      if ((response as PatchResult).returnCode === 40840) {
                        // AuthorizationTokenExpiredError
                        Utils.removeExpiredAuthorization();
                      }
                      if (response.error == 1) {
                        vscode.window.showErrorMessage(
                          localize(
                            "tds.webview.patch.oldFiles",
                            "Patch contains files older than RPO. Patch not applied."
                          )
                        );
                      }
                      // const message: string  = response.message;
                      // if(message == "Success"){
                      // 	vscode.window.showInformationMessage(localize("tds.webview.patch.applied","Patch Applied!"));
                      // }else {
                      // 	vscode.window.showErrorMessage(message);
                      // }
                    },
                    (err: ResponseError<object>) => {
                      vscode.window.showErrorMessage(err.message);
                    }
                  );
              }
            });
        }
      }
    } else {
      vscode.window.showErrorMessage(
        localize("tds.webview.server.not.connected", "No server connected.")
      );
    }
  }
}

function extractPatchsFiles(zipfilenames: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let files: string[] = [];
    const tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), "tds-"));

    zipfilenames.forEach((zipfilename) => {
      const zip: JSZip = new JSZip();
      const data = fs.readFileSync(zipfilename);

      zip.loadAsync(data).then(function (contents) {
        Object.keys(contents.files).forEach(function (filename) {
          if (filename.toLowerCase().endsWith("ptm")) {
            const dest = path.join(tmpPath, filename);
            files.push(dest);
            zip
              .file(filename)
              .async("nodebuffer")
              .then(function (content: any) {
                fs.writeFileSync(dest, content);
              })
              .catch((reason: any) => {
                reject(reason);
              });
          }
        });
        resolve(files);
      });
    });
  });
}

function getWebViewContent(context: vscode.ExtensionContext, localizeHTML) {
  const htmlOnDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, "src", "patch", "formApplyPatch.html")
  );
  const cssOniskPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "resources",
      "css",
      "table_materialize.css"
    )
  );
  const tableScriptPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "resources",
      "script",
      "table_materialize.js"
    )
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOniskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const scriptContent = fs.readFileSync(
    tableScriptPath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({
    css: cssContent,
    localize: localizeHTML,
    script: scriptContent,
  });
}

class PatchResult {
  returnCode: number;
}

async function doApplyPatch(
  server: ServerItem,
  patchUri: string,
  applyOld: boolean
) {
  return languageClient
    .sendRequest("$totvsserver/patchApply", {
      patchApplyInfo: {
        connectionToken: server.token,
        authorizationToken: Utils.getAuthorizationToken(server),
        environment: server.environment,
        patchUri: patchUri,
        isLocal: true,
        isValidOnly: false,
        applyScope: applyOld ? "all" : "only_new",
      },
    })
    .then(
      (response: any) => {
        if (response.returnCode === 40840) {
          // AuthorizationTokenExpiredError
          Utils.removeExpiredAuthorization();
        }
        if (response.error == 1) {
          if (response.errorCode > 1) {
            languageClient.error(response.message);
            vscode.window.showErrorMessage(response.message);
          } else {
            vscode.window.showErrorMessage(
              localize(
                "tds.webview.patch.oldFiles",
                "Patch contains files older than RPO. Patch not applied."
              )
            );
          }
        } else if (applyOld) {
          vscode.window.showInformationMessage("Old files applied.");
        } else {
          vscode.window.showInformationMessage("Patch applied.");
        }
      },
      (err: ResponseError<object>) => {
        vscode.window.showErrorMessage(err.message);
      }
    );
}
