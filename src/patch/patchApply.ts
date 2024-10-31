import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import { ServersConfig } from "../utils";
import { languageClient } from "../extension";
import { ResponseError } from "vscode-languageclient";
import JSZip = require("jszip");
import { ServerItem } from "../serverItem";
import { processSelectResourceMessage } from "../utilities/processSelectResource";

const compile = require("template-literal");

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
  "tds.webview.patch.apply": vscode.l10n.t("Apply Patch"),
  "tds.webview.server.name": vscode.l10n.t("Server Name"),
  "tds.webview.address": vscode.l10n.t("Address"),
  "tds.webview.environment": vscode.l10n.t("Environment"),
  "tds.webview.patch.file": vscode.l10n.t("Patch File"),
  "tds.webview.table.delete.action": vscode.l10n.t("Delete Selected"),
  "tds.webview.table.info.action": vscode.l10n.t("Patch Info"),
  "tds.webview.applyOld": vscode.l10n.t("Apply old files"),
  "tds.webview.newerPatches": vscode.l10n.t("Apply outdated patches"),
  "tds.webview.col01": vscode.l10n.t("Patch Name"),
  "tds.webview.col02": vscode.l10n.t("Patch Full Path"),
  "tds.webview.col03": vscode.l10n.t("Validation"),
  "tds.webview.patch.newest.located": vscode.l10n.t("Newer patches than those selected to be applied were found."),
  "tds.webview.patch.newest.exp": vscode.l10n.t("Continuous Dispatch"),
  "tds.webview.patch.newest.ptm": vscode.l10n.t("Patch"),
  "tds.webview.patch.newest.module": vscode.l10n.t("Module:"),
  "tds.webview.patch.newest.generated": vscode.l10n.t("Generated:"),
  "tds.webview.patch.newest.description": vscode.l10n.t("Description:"),
  "tds.webview.patch.newest.summary": vscode.l10n.t("Summary:"),
  "tds.webview.patch.newest.link": vscode.l10n.t("Download the patch from the Update Center:"),
  "tds.webview.patch.newest.doc": vscode.l10n.t("Read the documentation at:"),
  "tds.webview.patch.validation.error.undefined": vscode.l10n.t("Undefined error. Check AppServer logs for more details."),
  "tds.webview.patch.validation.error.older": vscode.l10n.t("Resources in patch older than RPO. Check Output for details."),
  "tds.webview.patch.validation.error.denied": vscode.l10n.t("Patch apply denied. Check Output for details."),
  "tds.webview.patch.validation.error.newer": vscode.l10n.t("Newer patches available. Click"),
  "tds.webview.patch.validation.error.here": vscode.l10n.t("here"),
  "tds.webview.patch.validation.error.details": vscode.l10n.t("for details."),
  "tds.webview.patch.validation.action.awaiting": vscode.l10n.t("Awaiting validation"),
  "tds.webview.patch.validation.action.validating": vscode.l10n.t("Validating"),
  "tds.webview.patch.validation.inprogress": vscode.l10n.t("Patch validation in progress."),
  "tds.webview.patch.validation.applyold": vscode.l10n.t("There are patches with sources/resources older than RPO."),
  "tds.webview.patch.validation.applyold.overwrite": vscode.l10n.t("This action will overwrite newer sources/resources in the current RPO."),
  "tds.webview.patch.validation.newer": vscode.l10n.t("There are newer patches available at TOTVS Update Center."),
  "tds.webview.patch.validation.newer.overwrite": vscode.l10n.t("This action will apply outdated patches."),
  "tds.webview.patch.validation.critical": vscode.l10n.t("There are patches that cannot be applied and must be removed from the list. See log for details."),
  "tds.webview.patch.validation.problem": vscode.l10n.t("Action required. There are patches with validation problems."),
  "tds.webview.patch.apply.action": vscode.l10n.t("Apply"),
  "tds.webview.patch.applyclose.action": vscode.l10n.t("Apply/Close"),
};

export function patchApply(
  context: any,
  isWorkspace: boolean,
  args?: any[]
): void {
  if (currentPanel) {
    currentPanel.reveal();
  } else {
    const server = ServersConfig.getCurrentServer();

    if (server) {
      const allInfoServer: any = ServersConfig.getServerById(server.id);

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
            if (!processSelectResourceMessage(currentPanel.webview, message)) {
              switch (message.command) {
                case "patchValidate":
                  if (message.patchFiles.length === 0) {
                    vscode.window.showErrorMessage(
                      vscode.l10n.t("Patch validate failed. Please input patch file.")
                    );
                  } else {
                    vscode.window
                      .withProgress(
                        {
                          cancellable: false,
                          location: vscode.ProgressLocation.Notification,
                          title: vscode.l10n.t(`Validating patch`),
                        },
                        async (progress, token) => {
                          let step: number = 100 / (message.patchFiles.length + 1);
                          progress.report({ increment: step / 2 });
                          let index: number = 0;

                          for await (const element of message.patchFiles) {
                            index++;
                            progress.report({
                              increment: step,
                              message: `(${index}/${message.patchFiles.length}) ${element}`,
                            });

                            await doValidatePatch(
                              server,
                              vscode.Uri.file(element).toString()
                            ).then(
                              () => { },
                              (reason: any) => {
                                languageClient.error(reason);
                              }
                            );
                          }

                          progress.report({
                            increment: 100,
                            message: vscode.l10n.t("Patchs validate ( files)"),
                          });
                        }
                      )
                      .then(() => {
                      });
                  }

                  break;

                case "patchApply":
                  if (message.patchFile.length === 0) {
                    vscode.window.showErrorMessage(
                      vscode.l10n.t("Patch apply failed. Please input patch file.")
                    );
                  } else {
                    vscode.window
                      .withProgress(
                        {
                          cancellable: false,
                          location: vscode.ProgressLocation.Notification,
                          title: vscode.l10n.t(`Applying patch`),
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
                              () => { },
                              (reason: any) => {
                                languageClient.error(reason);
                              }
                            );
                          }

                          progress.report({
                            increment: 100,
                            message: vscode.l10n.t("Patchs applied ( files)"),
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

                case "showDuplicateWarning":
                  vscode.window.showWarningMessage(
                    vscode.l10n.t("File already selected: {0}", message.filename)
                  );
                  break;

                case "patchValidateFile":
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
                      vscode.l10n.t("Select a file for operation.")
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
                      vscode.l10n.t("Select a file for operation.")
                    );
                  }
                  break;
              }
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
              vscode.l10n.t("Are you sure you want to apply patch file {0} in RPO?", path.basename(filename)),
              { modal: true },
              vscode.l10n.t("Yes"),
              vscode.l10n.t("No")
            )
            .then((clicked) => {
              if (clicked === vscode.l10n.t("Yes")) {
                const patchUri = vscode.Uri.file(patchFile).toString();

                languageClient
                  .sendRequest("$totvsserver/patchApply", {
                    patchApplyInfo: {
                      connectionToken: server.token,
                      authorizationToken: ServersConfig.getAuthorizationToken(server),
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
                        ServersConfig.removeExpiredAuthorization();
                      }
                      if (response.error == 1) {
                        vscode.window.showErrorMessage(
                          vscode.l10n.t("Patch contains files older than RPO. Patch will not be applied.")
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
      vscode.window.showErrorMessage(vscode.l10n.t("No server connected."));
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

  const cssOnDIskPath = vscode.Uri.file(
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

  const chooseResourcePath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      "resources",
      "script",
      "chooseResource.js"
    )
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOnDIskPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const scriptContent = fs.readFileSync(
    tableScriptPath.with({ scheme: "vscode-resource" }).fsPath
  );
  const chooseResourceContent = fs.readFileSync(
    chooseResourcePath.with({ scheme: "vscode-resource" }).fsPath
  );

  let runTemplate = compile(htmlContent);

  return runTemplate({
    css: cssContent,
    localize: localizeHTML,
    script: scriptContent,
    chooseResourceScript: chooseResourceContent
  });
}

class PatchResult {
  returnCode: number;
}

async function doValidatePatch(
  server: ServerItem,
  patchUri: string
) {
  return languageClient
    .sendRequest("$totvsserver/patchApply", {
      patchApplyInfo: {
        connectionToken: server.token,
        authorizationToken: ServersConfig.getAuthorizationToken(server),
        environment: server.environment,
        patchUri: patchUri,
        isLocal: true,
        isValidOnly: true,
        applyScope: "none",
      },
    })
    .then(
      (response: any) => {
        const patchFile = vscode.Uri.parse(patchUri);
        //const patchFile = vscode.Uri.file(patchUri).toString();
        var patchFilePath = patchFile.path;
        var retMessage = vscode.l10n.t("No validation errors");
        var tphInfoRet = { exp: undefined, ptm: undefined };
        if (patchFilePath.startsWith("/") && patchFilePath.length > 2 && patchFilePath.at(2) === ':') {
          // se formato for windows /d:/totvs/patch/12.1.2210/expedicao_continua_12_1_2210_atf_tttm120_hp.ptm
          // remove a / inicial
          patchFilePath = patchFilePath.substring(1);
        }
        if (!response.error) {
          vscode.window.showInformationMessage(vscode.l10n.t("Patch validated."))
        } else {
          retMessage = response.message
          if (response.errorCode != 5 && response.errorCode != 7 && response.errorCode != 8) {
            // ignore errorCode for apply_old, apply_denied and newer_patches
            languageClient.error(retMessage);
            vscode.window.showErrorMessage(retMessage);
          }
          if (response.errorCode == 5) { // Erro de patch com resources mais antigos que o do RPO
            // exibir os recursos mais antigos
          }
          if (response.errorCode == 8) { // Erro de TPH apenas ocorre se existem patches mais recentes que o validado
            // exibir mensagens e links para patches mais recentes
            retMessage = "check tphInfoRet";
            const tphInfo: any = JSON.parse(response.message);
            const recommendedPatches = tphInfo.recommended;
            if (recommendedPatches) {
              if (recommendedPatches.exp) {
                // exp
                tphInfoRet.exp = recommendedPatches.exp;
              }
              if (recommendedPatches.ptm) {
                // ptm
                tphInfoRet.ptm = recommendedPatches.ptm;
              }
            }
          }
        }
        currentPanel.webview.postMessage({
          command: "patchValidationRet",
          file: patchFilePath,
          message: retMessage,
          errorCode: response.errorCode,
          language: vscode.env.language,
          tphInfoRet: tphInfoRet,
        });
      },
      (err: ResponseError<object>) => {
        vscode.window.showErrorMessage(err.message);
      }
    );
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
        authorizationToken: ServersConfig.getAuthorizationToken(server),
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
          ServersConfig.removeExpiredAuthorization();
        }
        if (response.error == 1) {
          if (response.errorCode > 1) {
            languageClient.error(response.message);
            vscode.window.showErrorMessage(response.message);
          } else {
            vscode.window.showErrorMessage(
              vscode.l10n.t("Patch contains files older than RPO. Patch will not be applied.")
            );
          }
        } else if (applyOld) {
          vscode.window.showInformationMessage(vscode.l10n.t("Old files applied."));
        } else {
          vscode.window.showInformationMessage(vscode.l10n.t("Patch applied."));
        }
      },
      (err: ResponseError<object>) => {
        vscode.window.showErrorMessage(err.message);
      }
    );
}
