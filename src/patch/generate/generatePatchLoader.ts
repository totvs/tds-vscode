/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as vscode from 'vscode';
import * as path from 'path';
import { GeneratePatchPanelAction, IGeneratePatchPanelAction } from './actions';
import * as nls from 'vscode-nls';
import Utils from '../../utils';
import { ServerItem } from '../../serverItemProvider';
import {
  IGeneratePatchData,
  IServerFS,
  PatchProcess,
} from './generatePatchData';
import { IGetPatchDirResult, sendGetPatchDir } from '../../protocolMessages';
import { folder } from 'jszip';
import { serverSelection } from '../../inputConnectionParameters';
import { utils } from 'mocha';
import { IfStatement } from 'typescript';

const fs = require('fs');
const os = require('os');

const localize = nls.loadMessageBundle();
const WS_STATE_KEY = 'GENERATE_PATCH_TABLE';

let generatePathLoader: GeneratePatchLoader = undefined;

export function openGeneratePatchView(
  context: vscode.ExtensionContext,
  args: any = {}
) {
  const server = Utils.getCurrentServer();

  if (generatePathLoader === undefined || generatePathLoader === null) {
    generatePathLoader = new GeneratePatchLoader(context, args);
  }

  generatePathLoader.toggleServer(server);
}

class GeneratePatchLoader {
  protected readonly _panel: vscode.WebviewPanel | undefined;
  private _disposables: vscode.Disposable[] = [];
  private _currentServer: any = null;
  private _context: vscode.ExtensionContext;
  private _generatePatchData: IGeneratePatchData;
  private _nodeMap: Map<string, IServerFS> = new Map<string, IServerFS>();

  public get currentServer(): any {
    return this._currentServer;
  }

  public set currentServer(value: any) {
    this._currentServer = value;

    if (value) {
      (this._generatePatchData.generate = false),
        (this._generatePatchData.serverName = value.name);
    } else {
      (this._generatePatchData.generate = false),
        (this._generatePatchData.serverName = '');
      this._generatePatchData.rootFolder = undefined;
    }

    this.updatePage();
  }

  constructor(context: vscode.ExtensionContext, args: any) {
    this._context = context;

    this._disposables.push(
      Utils.onDidSelectedServer((newServer: ServerItem) => {
        generatePathLoader.toggleServer(newServer);
      })
    );

    const ext = vscode.extensions.getExtension('TOTVS.tds-vscode');
    this._panel = vscode.window.createWebviewPanel(
      'generatePathLoader',
      localize('GENERATE_PATCH', 'Generate Patch'),
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(ext.extensionPath, 'out', 'webpack')),
        ],
      }
    );

    this._panel.webview.html = this.getWebviewContent();
    this._panel.onDidChangeViewState(
      (listener: vscode.WebviewPanelOnDidChangeViewStateEvent) => {
        if (this.currentServer !== null) {
          this.updatePage();
        }
      },
      undefined,
      this._disposables
    );

    this._panel.webview.onDidReceiveMessage(
      (command: IGeneratePatchPanelAction) => {
        this.handleMessage(command);
        this.updatePage();
      },
      undefined,
      this._disposables
    );

    this._panel.onDidDispose((event) => {
      //this._isDisposed = true;

      generatePathLoader = undefined;
    });
  }

  public toggleServer(serverItem: ServerItem) {
    this.currentServer = serverItem;
  }

  private updatePage() {
    const hasServer: boolean = this.currentServer ? true : false;
    const hasData: boolean = hasServer; //&& this._generatePatchData.patchFiles.length > 0;
    if (hasServer) {
      if (!this._generatePatchData.rootFolder) {
        const root: IServerFS = {
          id: 'root_' + this.currentServer.id,
          name: this.currentServer.name,
          children: [],
          directory: true,
          path: '',
          parentId: '',
        };

        this.loadServerFS(root).then((result: IServerFS) => {
          this._generatePatchData.loading = true;
          this._generatePatchData.rootFolder = result;

          this._nodeMap[result.id] = result;
          result.children.forEach((folder: IServerFS) => {
            this._nodeMap[result.id] = folder;
          }, this);

          this._panel.webview.postMessage({
            command: GeneratePatchPanelAction.UpdatePage,
            data: this._generatePatchData,
          });
        });
      } else {
        this._panel.webview.postMessage({
          command: GeneratePatchPanelAction.UpdatePage,
          data: this._generatePatchData,
        });
      }
    }
  }

  private async handleMessage(command: IGeneratePatchPanelAction) {
    switch (command.action) {
      case GeneratePatchPanelAction.LoadingData: {
        const loadingFolder: IServerFS = command.content.loadingFolder;
        const promises: any[] = [];
        loadingFolder.children.forEach((folder: IServerFS) => {
          this._nodeMap[folder.parentId].children = folder;
          this._nodeMap[folder.id] = folder;
          promises.push(this.loadServerFS(folder));
        });
        Promise.all(promises).then((result: IServerFS[]) => {
          const root: IServerFS = this._generatePatchData.rootFolder;
          this._generatePatchData.loading = false;
          result.forEach((folder: IServerFS) => {
            folder.children.forEach((subfolder: IServerFS) => {
              this._nodeMap[subfolder.id].children.push(subfolder);
            }, this);
          });

          this._generatePatchData.rootFolder = root;
          this._panel.webview.postMessage({
            command: GeneratePatchPanelAction.UpdatePage,
            data: this._generatePatchData,
          });
        });
        break;
      }
      case GeneratePatchPanelAction.Generate: {
        //this.doGenerate
        break;
      }
      case GeneratePatchPanelAction.SelectFoler: {
        const folder: string = command.content.targetFolder;
        this.doSelectFolder(folder);

        break;
      }

      // case GeneratePatchPanelAction.DoUpdateState: {
      //   {
      //     const state: any = command.content.state;
      //     const reload: boolean = command.content.reload;
      //     const context = this._context;

      //     context.workspaceState.update(WS_STATE_KEY, state);

      //     if (reload) {
      //       this._panel.dispose();

      //       context.workspaceState.update(WS_STATE_KEY, {});
      //       openGeneratePatchView(context, undefined);
      //     }

      //     break;
      //   }
      // }
      default:
        console.log('***** ATTENTION: generatePathLoader.tsx');
        console.log('\tUnrecognized command: ' + command.action);
        console.log('\t' + command.content);
        break;
    }
  }

  private initData(memento: any): IGeneratePatchData {
    this._generatePatchData = {
      process: memento['process'],
      ignoreTres: memento['ignoreTres'],
      targetFolder: memento['targetFolder'],
      resources: [],
      selectedResources: [],
      targetFile: '',
      rpoMaster: '',
      rootFolder: undefined,
      loading: false,
      generate: false,
      serverName: '',
    };

    return this._generatePatchData;
  }

  private async loadServerFS(target: IServerFS) {
    const server = this.currentServer;
    const that = this;

    const createChild = function (
      parent: IServerFS,
      resource: string,
      directory: boolean
    ): IServerFS {
      return {
        id: (directory ? 'folder_' : 'file_') + Date.now().toString(36),
        name: resource,
        children: [],
        directory: directory,
        path: (parent.name.length === 0 ? '' : parent.name + '\\') + resource,
        parentId: parent.id,
      };
    };

    const getPatchDir = async function (folder: IServerFS) {
      const folders: IGetPatchDirResult = await sendGetPatchDir(
        server,
        folder.path,
        true
      );
      const files: IGetPatchDirResult = await sendGetPatchDir(
        server,
        folder.path,
        false
      );

      folders.directory.forEach((resource: string) => {
        const child = createChild(folder, resource, true);
        folder.children.push(child);
      });

      files.directory.forEach((resource: string) => {
        if (resource.toLowerCase().endsWith('.rpo')) {
          folder.children.push(createChild(folder, resource, false));
        }
      });

      return folder;
    };

    return getPatchDir(target);
  }

  private doGenerate(generateData: IGeneratePatchData) {
    // const self = this;
    // const total: number = 4;
    // let cnt: number = 0;
    // let inc: number = 100 / total;
    // vscode.window.withProgress(
    //   {
    //     location: vscode.ProgressLocation.Notification,
    //     title: localize("VALIDATING_MESSAGE", "Validating Patch"),
    //     cancellable: true,
    //   }, async (progress, token) => {
    //     token.onCancellationRequested(() => {
    //       console.log("User canceled the operation");
    //     });
    //     progress.report({ increment: 0, message: "Inicializando..." });
    //     patchFiles.forEach(async (element: IPatchFileInfo) => {
    //       cnt++;
    //       progress.report({
    //         message: localize("APPLYING", "File {3} #{0}/{1}", cnt, total, element.name),
    //         increment: inc
    //       });
    //       element.status = "validating";
    //       element.data = { error_number: -1, data: "" }
    //       self.updatePage();
    //       await sendGeneratePatchRequest(this.currentServer, element.fullpath, element.applyScope)
    //         .then((result: IPatchValidateResult) => {
    //           element.status = "applyed";
    //         }, (reason: IPatchValidateResult) => {
    //           element.message = reason.message || "";
    //           element.data = { error_number: reason.errorCode, data: reason.patchValidates };
    //           if (reason.errorCode == PATCH_ERROR_CODE.OLD_RESOURCES) {
    //             element.status = element.applyScope == "none" ? "error" : "warning";
    //           } else {
    //             element.status = "error";
    //           }
    //         }).then(() => {
    //           self.updatePage();
    //         });
    //     });
    //     progress.report({ increment: 100, message: "Finalizado" });
    //   }
    //    );
  }

  private doSelectFolder(folder: string) {
    const options: vscode.OpenDialogOptions = {
      canSelectMany: false,
      openLabel: 'Select',
      canSelectFiles: false,
      canSelectFolders: true,
      defaultUri: vscode.Uri.parse(folder),
    };

    vscode.window.showOpenDialog(options).then((folder) => {
      if (folder && folder[0]) {
        this._generatePatchData.targetFolder = folder[0].fsPath;
        this.updatePage();
      }
    });
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const ext = vscode.extensions.getExtension('TOTVS.tds-vscode');
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(ext.extensionPath, 'out', 'webpack', 'GeneratePatchPanel.js')
    );

    const servers: ServerItem[] = this.currentServer
      ? [this.currentServer]
      : [];

    const reactAppUri: vscode.Uri = this._panel?.webview.asWebviewUri(
      reactAppPathOnDisk
    );
    const memento: any = this._context.workspaceState.get(WS_STATE_KEY, {
      process: PatchProcess.fromRpo,
      ignoreTres: true,
      targetFolder: '',
    });
    const configJson: any = {
      serverList: servers,
      memento: memento,
      translations: getTranslations(),
      generatePathData: this.initData(memento),
    };

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Monitor View</title>

        <meta http-equiv="Content-Security-Policy"
                    content="default-src 'none';
                             img-src https:;
                             script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
                             style-src vscode-resource: 'unsafe-inline';">

        <script>
          window.acquireVsCodeApi = acquireVsCodeApi;
          window.initialData = ${JSON.stringify(configJson)};
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="${reactAppUri}"></script>
    </body>
    </html>`;
  }
}

function getTranslations() {
  return {
    GENERATE_PATCH: localize('GENERATE_PATCH', 'Generate Patch'),
    //   NO_DATA: localize(
    //     "NO_DATA",
    //     "There are no patchs to validate or apply."
    //   ),
    //   FILES: localize("FILES", "files"),
    //   FILTER: localize("FILTER", "Filter"),
    //   FILTERING_ON_OFF: localize("FILTERING_ON_OFF", "Filtering on/off"),
    //   FIRST: localize("FIRST", "First"),
    //   FIRST_PAGE: localize("FIRST_PAGE", "First page"),
    //   FROM_TO_OF_COUNT: localize("FROM_TO_OF_COUNT", "from-to de count"),
    //   LAST: localize("LAST", "Last"),
    //   LAST_PAGE: localize("LAST_PAGE", "Last page"),
    //   LINES_PAGE: localize("LINES_PAGE.", "lines/p."),
    //   NEXT: localize("NEXT", "Next"),
    //   NEXT_PAGE: localize("NEXT_PAGE", "Next page"),
    //   PREVIOUS: localize("PREVIOUS", "Previous"),
    //   PREVIOUS_PAGE: localize("PREVIOUS_PAGE", "Previous page"),
    //   SEARCH: localize("SEARCH", "Search"),
    //   SEARCH_ALL_COLUMNS: localize("SEARCH_ALL_COLUMNS", "Search in all columns"),
    //   FILES_SELECTED: localize(
    //     "FILES_SELECTED",
    //     "{0} files selected"
    //   ),
    //   STATUS: localize("STATUS", "Status"),
    //   NAME: localize("NAME", "Name"),
    //   FULLPATH: localize("FULLPATH", "Full File Name"),
    //   SIZE: localize("SIZE", "Size(KB)"),
    //   ACTIONS: localize("ACTIONS", "Actions"),
    //   REMOVE_PATCH: localize("REMOVE_PATCH", "Remove patch"),
    //   VALIDATE_PATCH: localize("VALIDATE_PATCH", "Validate patch"),
    //   //
    //   ENVIRONMENT: localize("ENVIRONMENT", "Environment"),
    //   RESOURCE: localize("RESOURCE", "Resource"),
    //   RPO: localize("RPO", "RPO"),
    //   PACK: localize("PACK", "Patch"),
    //   DLG_TITLE_RESOURCES: localize("DLG_TITLE_RESOURCES", "Resources"),
    //   ENVIRONEMNT: localize("ENVIRONEMNT", "Environemnt"),
    //   SHOW_COLUMNS: localize("SHOW_COLUMNS", "Show Columns"),
    //
  };
}
