import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import Utils from '../utils';
import { languageClient } from '../extension';
import * as nls from 'vscode-nls';
import { ResponseError } from 'vscode-languageclient';
import JSZip = require('jszip');

let localize = nls.loadMessageBundle();
const compile = require('template-literal');

let currentPanel: vscode.WebviewPanel | undefined = undefined;

const localizeHTML = {
  'tds.webview.patch.apply': localize('tds.webview.patch.apply', 'Apply Patch'),
  'tds.webview.server.name': localize('tds.webview.server.name', 'Server Name'),
  'tds.webview.address': localize('tds.webview.address', 'Address'),
  'tds.webview.environment': localize('tds.webview.environment', 'Environment'),
  'tds.webview.patch.file': localize('tds.webview.patch.file', 'Patch File'),
  'tds.webview.applyOld': localize('tds.webview.applyOld', 'Apply old files'),
  'tds.webview.col01': localize('tds.webview.col01', 'Patch Name'),
  'tds.webview.col02': localize('tds.webview.col02', 'Patch Full Path'),
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
          'totvs-developer-studio.patchApply',
          'Patch Apply',
          vscode.ViewColumn.One,
          {
            enableScripts: true,
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, 'src', 'patch')),
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
          command: 'setCurrentServer',
          serverCurrent: server,
        });

        currentPanel.webview.onDidReceiveMessage(
          async (message) => {
            switch (message.command) {
              case 'patchApply':
                if (message.patchFile.length === 0) {
                  vscode.window.showErrorMessage(
                    localize(
                      'tds.webview.patch.apply.fail',
                      'Apply Patch Fail. Please input patch file.'
                    )
                  );
                } else {
                  //vscode.window.showInformationMessage(localize("tds.webview.patch.apply.start","Started Patch Apply"));
                  const permissionsInfos = Utils.getPermissionsInfos();

                  message.patchFile.forEach(async (element, index) => {
                    const patchUri = vscode.Uri.file(element).toString();
                    languageClient.info(
                      `Applying ${patchUri} (${index}/${message.patchFile.length})`
                    );
                    await languageClient
                      .sendRequest('$totvsserver/patchApply', {
                        patchApplyInfo: {
                          connectionToken: server.token,
                          authorizationToken:
                          Utils.getAuthorizationToken(server),
                          environment: server.environment,
                          patchUri: patchUri,
                          isLocal: true,
                          isValidOnly: false,
                          applyScope: message.applyOld ? "all" : "only_new",
                        },
                      })
                      .then(
                        (response: any) => {
                          if (response.returnCode === 40840) {
                            // AuthorizationTokenExpiredError
                            Utils.removeExpiredAuthorization();
                          }
                          if (response.error == 1) {
                            vscode.window.showErrorMessage(
                              localize(
                                'tds.webview.patch.oldFiles',
                                'Patch contains files older than RPO. Patch not applied.'
                              )
                            );
                          }

                          if (message.applyOld) {
                            vscode.window.showInformationMessage(
                              'Old files applied.'
                            );
                          }
                        },
                        (err: ResponseError<object>) => {
                          vscode.window.showErrorMessage(err.message);
                        }
                      );
                  });
                  if (currentPanel) {
                    if (message.close) {
                      currentPanel.dispose();
                    }
                  }
                }
                return;

              case 'extractPatchsFiles':
                vscode.window.showWarningMessage('Checking zip files');

                extractPatchsFiles(message.files)
                  .then((files) => {
                    if (files.length === 0) {
                      vscode.window.showWarningMessage(
                        'No patch file found in zip files.'
                      );
                    } else {
                      for (let index = 0; index < files.length; index++) {
                        const element = files[index];
                        if (currentPanel) {
                          currentPanel.webview.postMessage({
                            command: 'addFilepath',
                            file: element,
                          });
                        }
                      }
                    }
                  })
                  .catch((reason: any) => {
                    vscode.window.showErrorMessage(reason);
                  });
                return;

              case 'showDuplicateWarning':
                vscode.window.showWarningMessage(
                  'Already selected. File: ' + message.filename
                );
                return;

              case 'patchValidate':
                vscode.window.showInformationMessage('PatchValidate');
                const validateArgs = {
                  fsPath: message.file,
                };
                vscode.commands.executeCommand(
                  'totvs-developer-studio.patchValidate.fromFile',
                  validateArgs
                );
                return;

              case 'patchInfo':
                const args = {
                  fsPath: message.file,
                };
                vscode.commands.executeCommand(
                  'totvs-developer-studio.patchInfos.fromFile',
                  args
                );
                return;
            }
          },
          undefined,
          context.subscriptions
        );
      } else {
        let filename: string = '';
        if (args && args['path'] !== undefined) {
          //A ação veio pelo menu de contexto por exemplo, e/ou com o fsPath preenchido corretamente
          filename = args['path'];
        }
        if (filename !== '') {
          const patchFile = filename;
          vscode.window
            .showWarningMessage(
              localize(
                'tds.webview.patch.apply.file',
                'Are you sure you want patch {0} the RPO?',
                path.basename(filename)
              ),
              localize('tds.vscode.yes', 'Yes'),
              localize('tds.vscode.no', 'No')
            )
            .then((clicked) => {
              if (clicked === localize('tds.vscode.yes', 'Yes')) {
                const patchUri = vscode.Uri.file(patchFile).toString();
                const permissionsInfos = Utils.getPermissionsInfos();
                languageClient
                  .sendRequest('$totvsserver/patchApply', {
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
                            'tds.webview.patch.oldFiles',
                            'Patch contains files older than RPO. Patch not applied.'
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
        localize('tds.webview.server.not.connected', 'No server connected.')
      );
    }
  }
}

function extractPatchsFiles(zipfilenames: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let files: string[] = [];
    const tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), 'tds-'));

    zipfilenames.forEach((zipfilename) => {
      const zip: JSZip = new JSZip();
      const data = fs.readFileSync(zipfilename);

      zip.loadAsync(data).then(function (contents) {
        Object.keys(contents.files).forEach(function (filename) {
          if (filename.toLowerCase().endsWith('ptm')) {
            const dest = path.join(tmpPath, filename);
            files.push(dest);
            zip
              .file(filename)
              .async('nodebuffer')
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
    path.join(context.extensionPath, 'src', 'patch', 'formApplyPatch.html')
  );
  const cssOniskPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      'resources',
      'css',
      'table_materialize.css'
    )
  );
  const tableScriptPath = vscode.Uri.file(
    path.join(
      context.extensionPath,
      'resources',
      'script',
      'table_materialize.js'
    )
  );

  const htmlContent = fs.readFileSync(
    htmlOnDiskPath.with({ scheme: 'vscode-resource' }).fsPath
  );
  const cssContent = fs.readFileSync(
    cssOniskPath.with({ scheme: 'vscode-resource' }).fsPath
  );
  const scriptContent = fs.readFileSync(
    tableScriptPath.with({ scheme: 'vscode-resource' }).fsPath
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
