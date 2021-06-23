import * as vscode from "vscode";
import * as path from "path";
import { ApplyPatchPanelAction, IApplyPatchPanelAction } from "./actions";
import * as nls from "vscode-nls";
import Utils from "../../utils";
import { ServerItem } from "../../serverItemProvider";
import { IApplyPatchData, IApplyScope, IPatchFileInfo, PATCH_ERROR_CODE } from "./applyPatchData";
import JSZip = require("jszip");
import { sendApplyPatchRequest, sendValidPatchRequest } from "../../protocolMessages";
import { IPatchValidateResult } from "../../rpoInfo/rpoPath";
import { PatchEditorProvider } from "../inspect/patchEditor";

const fs = require("fs");
const os = require("os");

const localize = nls.loadMessageBundle();
const WS_STATE_KEY = "APPLY_PATCH_TABLE";

let applyPathLoader: ApplyPatchLoader = undefined;

export function openApplyPatchView(context: vscode.ExtensionContext, args: any = []) {
  const server = Utils.getCurrentServer();

  if (applyPathLoader === undefined || applyPathLoader === null) {
    applyPathLoader = new ApplyPatchLoader(context, args);
  }

  applyPathLoader.toggleServer(server);
}

export class ApplyPatchLoader {
  protected readonly _panel: vscode.WebviewPanel | undefined;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];
  private _isDisposed: boolean = false;
  private _currentServer: any = null;
  private _context: vscode.ExtensionContext;
  private _applyPatchData: IApplyPatchData = {
    validateProcess: false,
    patchFiles: [],
    lastFolder: "",
    historyFolder: []
  };

  public get currentServer(): any {
    return this._currentServer;
  }

  public set currentServer(value: any) {
    if (this._currentServer !== value) {
      this._currentServer = value;
      this._applyPatchData.patchFiles.forEach((element: IPatchFileInfo) => {
        element.applyScope = "none";
        element.status = "loaded";
      });
      this.updatePage();
    }
  }

  constructor(context: vscode.ExtensionContext, args: any) {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    this._extensionPath = ext.extensionPath;
    this._context = context;

    this._disposables.push(
      Utils.onDidSelectedServer((newServer: ServerItem) => {
        applyPathLoader.toggleServer(newServer);
      })
    );

    this._panel = vscode.window.createWebviewPanel(
      "applyPathLoader",
      localize("APPLY_PATCH", "Apply Patch"),
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(this._extensionPath, "out", "webpack")),
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
      (command: IApplyPatchPanelAction) => {
        this.handleMessage(command);
        this.updatePage();
      },
      undefined,
      this._disposables
    );

    this._panel.onDidDispose((event) => {
      this._isDisposed = true;

      applyPathLoader = undefined;
    });

    if (args && args.fsPath) {
      this.addFile(args.fsPath);
    }
  }

  public toggleServer(serverItem: ServerItem) {
    this.currentServer = serverItem;
  }

  private updatePage() {
    const hasServer: boolean = this.currentServer ? true : false;
    const hasData: boolean = hasServer && this._applyPatchData.patchFiles.length > 0;

    this._panel.webview.postMessage({
      command: ApplyPatchPanelAction.UpdatePage,
      data: {
        validate: hasData,
        apply: hasData,
        deleteAll: hasData,
        serverName: hasServer ?
          this.currentServer.name :
          localize("AWAITING_SELECTION", "(awaiting selection)"),
        applyPatchData: this._applyPatchData,
      },
    });
  }

  private async handleMessage(command: IApplyPatchPanelAction) {
    switch (command.action) {
      case ApplyPatchPanelAction.ShowContent:
        {
          const file: any = command.content.file;
          this.doShowContent(file);
          break;
        }
      case ApplyPatchPanelAction.UpdateData:
        {
          const file: any = command.content.file;
          const id: string = command.content.id;
          const value: IApplyScope = command.content.value;

          if (id == "apply_resource") {
            this.doApplyOldSource(this.findFile(file), value);
          }
          break;
        }
      case ApplyPatchPanelAction.Apply:
        {
          const processAll: any = command.content.processAll;
          const file: any = command.content.file;

          if (processAll) {
            this.doApply(this._applyPatchData.patchFiles)
          } else {
            this.doApply(this.findFile(file));
          }
          break;
        }
      case ApplyPatchPanelAction.SelectFile: {
        {
          const files: any = command.content.files;
          this.doSelectFiles(files);

          break;
        }
      }
      case ApplyPatchPanelAction.RemoveFile: {
        {
          const file: any = command.content.file;
          const processAll: any = command.content.processAll;

          if (processAll) {
            this._applyPatchData.patchFiles = []
          } else {
            this.doRemoveFile(this.findFile(file));
          }

          break;
        }
      }

      case ApplyPatchPanelAction.ValidateFile: {
        {
          const file: any = command.content.file;
          const processAll: any = command.content.processAll;

          if (processAll) {
            this.doValidateFiles(this._applyPatchData.patchFiles)
          } else {
            this.doValidateFiles(this.findFile(file));
          }

          break;
        }
      }

      case ApplyPatchPanelAction.DoUpdateState: {
        {
          const state: any = command.content.state;
          const reload: boolean = command.content.reload;
          const context = this._context;

          context.workspaceState.update(WS_STATE_KEY, state);

          if (reload) {
            this._panel.dispose();

            context.workspaceState.update(WS_STATE_KEY, {});
            openApplyPatchView(context, undefined);
          }

          break;
        }
      }
      default:
        console.log("***** ATTENTION: applyPathLoader.tsx");
        console.log("\tUnrecognized command: " + command.action);
        console.log("\t" + command.content);
        break;
    }
  }

  private findFile(file: string) {
    const result = this._applyPatchData.patchFiles.find((target: IPatchFileInfo) => {
      return target.fullpath === file;
    })

    return result ? [result] : [];
  }

  private doSelectFiles(files: any[]) {
    files.forEach(element => {
      const find = this._applyPatchData.patchFiles.find((target: IPatchFileInfo) => {
        return target.fullpath === element.fullpath;
      })

      if (!find) {
        this.addFile(element.fullpath);
      }
    });
  }

  private doShowContent(patchFile: IPatchFileInfo) {
    vscode.commands.executeCommand(
      "vscode.openWith",
      patchFile.fullpath,
      PatchEditorProvider.viewType
    );
  }

  private doApplyOldSource(patchFiles: IPatchFileInfo[], value: IApplyScope) {
    patchFiles.forEach((patchFile) => {
      if (patchFile) {
        if (patchFile.data.error_number == PATCH_ERROR_CODE.OLD_RESOURCES) {
          patchFile.applyScope = value;
          patchFile.status = (value !== "none") ? "warning" : "loaded";
        }
      }
    })
  }

  private async doApply(_patchFiles: IPatchFileInfo[]) {
    const self = this;
    const patchFiles: IPatchFileInfo[] = _patchFiles.filter((patchFile: IPatchFileInfo) => {
      return patchFile.status == "loaded" ||
        patchFile.status == "warning" ||
        patchFile.status == "valid"
    });

    const total: number = patchFiles.length;
    let cnt: number = 0;
    let inc: number = 100 / total;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize("VALIDATING_MESSAGE", "Validating Patch"),
        cancellable: true,
      }, async (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("User canceled the operation");
        });

        progress.report({ increment: 0, message: "Inicializando..." });

        patchFiles.forEach(async (element: IPatchFileInfo) => {
          cnt++;
          progress.report({
            message: localize("APPLYING", "File {3} #{0}/{1}", cnt, total, element.name),
            increment: inc
          });
          element.status = "validating";
          element.data = { error_number: -1, data: "" }
          self.updatePage();

          await sendApplyPatchRequest(this.currentServer, vscode.Uri.file(element.fullpath).toString(), element.applyScope)
            .then((result: IPatchValidateResult) => {
              element.status = "applyed";
            }, (reason: IPatchValidateResult) => {
              element.message = reason.message || "";
              element.data = { error_number: reason.errorCode, data: reason.patchValidates };
              if (reason.errorCode == PATCH_ERROR_CODE.OLD_RESOURCES) {
                element.status = element.applyScope == "none" ? "error" : "warning";
              } else {
                element.status = "error";
              }
            }).then(() => {
              self.updatePage();
            });
        });

        progress.report({ increment: 100, message: "Finalizado" });
      }
    );
  }

  private async doValidateFiles(patchFiles: IPatchFileInfo[]) {
    const self = this;

    const total: number = patchFiles.length;
    let cnt: number = 0;
    let inc: number = 100 / total;

    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize("VALIDATING_MESSAGE", "Validating Patch"),
        cancellable: false,
      }, async (progress, token) => {
        token.onCancellationRequested(() => {
          console.log("User canceled the operation");
        });

        progress.report({ increment: 0, message: "Inicializando..." });

        patchFiles.forEach(async (element: IPatchFileInfo) => {
          cnt++;
          progress.report({
            message: localize("APPLYING", "File {3} #{0}/{1}", cnt, total, element.name),
            increment: inc
          });
          element.status = "validating";
          element.data = { error_number: -1, data: "" }
          self.updatePage();

          await sendValidPatchRequest(this.currentServer, vscode.Uri.file(element.fullpath).toString(), element.applyScope)
            .then((result: IPatchValidateResult) => {
              element.data = { error_number: result.errorCode, data: result.patchValidates };
              element.status = "valid";
            }, (reason: IPatchValidateResult) => {
              element.message = reason.message || "";
              element.data = { error_number: reason.errorCode, data: reason.patchValidates };
              if (reason.errorCode == PATCH_ERROR_CODE.OLD_RESOURCES) {
                element.status = element.applyScope == "none" ? "error" : "warning";
              } else {
                element.status = "error";
              }
            }).then(() => {
              self.updatePage();
            });
        });

        progress.report({ increment: 100, message: "Finalizado" });

      }
    );
  }

  private doRemoveFile(patchFiles: IPatchFileInfo[]) {
    patchFiles.forEach((patchFile) => {
      this._applyPatchData.patchFiles = this._applyPatchData.patchFiles.
        filter((element) => (element.fullpath !== patchFile.fullpath) && element.zipFile !== patchFile.fullpath);
    });
  }

  private addFile(file: string, zipname: string = "") {
    const filename = path.basename(file)
    const ext: string = path.extname(file).toLowerCase();
    const stats = fs.statSync(file);
    const fileSize = stats.size;

    this._applyPatchData.patchFiles.push({
      name: filename,
      fullpath: file,
      status: "loaded",
      size: fileSize,
      zipFile: zipname,
      message: "",
      applyScope: "none",
      data: { error_number: -1, data: undefined }
    });

    if (ext === ".zip") {
      this.extractPatchsFiles(file);
    }
  }

  private extractPatchsFiles(zipfilename: string): void {
    const tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), 'tds-'));
    const zip: JSZip = new JSZip();
    const data = fs.readFileSync(zipfilename);
    const self = this;

    zip.loadAsync(data).then(function (contents) {
      Object.keys(contents.files).forEach((filename) => {
        if (filename.toLowerCase().endsWith("ptm")) {
          const dest = path.join(tmpPath, filename);
          const zipEntry = zip.file(filename);

          zipEntry.async('nodebuffer')
            .then(function (content: any) {
              fs.writeFileSync(dest, content);
              self.addFile(dest, zipfilename);
            }).then(() => {
              self.updatePage();
            })
            .catch((reason: any) => {
              throw new Error(reason);
            });
        }
      });
    });
  }

  private getWebviewContent(): string {
    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(this._extensionPath, "out", "webpack", "applyPatchPanel.js")
    );

    const servers: ServerItem[] = this.currentServer
      ? [this.currentServer]
      : [];

    const reactAppUri = this._panel?.webview.asWebviewUri(reactAppPathOnDisk);
    const configJson: any = {
      serverList: servers,
      memento: this._context.workspaceState.get(WS_STATE_KEY, {}),
      translations: getTranslations(),
    };

    if (configJson["memento"].hasOwnProperty("customProps")) {
      const customProps = configJson["memento"]["customProps"];
      // if (!customProps.hasOwnProperty("lastFolder")) {
      //   customProps["lastFolder"] = this.lastFolder;
      // }
      // if (!customProps.hasOwnProperty("historyFolder")) {
      //   customProps["historyFolder"] = this.historyFolder;
      // }
    } else {
      configJson["memento"] = { customProps: { lastFolder: "", historyFolder: [] } };
    }

    // this.lastFolder = configJson["memento"]["customProps"]["lastFolder"];
    // this.historyFolder = configJson["memento"]["customProps"]["historyFolder"];

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
    NO_DATA: localize(
      "NO_DATA",
      "There are no patchs to validate or apply."
    ),
    FILES: localize("FILES", "files"),
    FILTER: localize("FILTER", "Filter"),
    FILTERING_ON_OFF: localize("FILTERING_ON_OFF", "Filtering on/off"),
    FIRST: localize("FIRST", "First"),
    FIRST_PAGE: localize("FIRST_PAGE", "First page"),
    FROM_TO_OF_COUNT: localize("FROM_TO_OF_COUNT", "from-to de count"),
    LAST: localize("LAST", "Last"),
    LAST_PAGE: localize("LAST_PAGE", "Last page"),
    LINES_PAGE: localize("LINES_PAGE.", "lines/p."),
    NEXT: localize("NEXT", "Next"),
    NEXT_PAGE: localize("NEXT_PAGE", "Next page"),
    PREVIOUS: localize("PREVIOUS", "Previous"),
    PREVIOUS_PAGE: localize("PREVIOUS_PAGE", "Previous page"),
    SEARCH: localize("SEARCH", "Search"),
    SEARCH_ALL_COLUMNS: localize("SEARCH_ALL_COLUMNS", "Search in all columns"),
    APPLY_PATCH: localize("APPLY_PATCH", "Apply Patch"),
    FILES_SELECTED: localize(
      "FILES_SELECTED",
      "{0} files selected"
    ),
    STATUS: localize("STATUS", "Status"),
    NAME: localize("NAME", "Name"),
    FULLPATH: localize("FULLPATH", "Full File Name"),
    SIZE: localize("SIZE", "Size(KB)"),
    ACTIONS: localize("ACTIONS", "Actions"),
    REMOVE_PATCH: localize("REMOVE_PATCH", "Remove patch"),
    VALIDATE_PATCH: localize("VALIDATE_PATCH", "Validate patch"),
    //
    ENVIRONMENT: localize("ENVIRONMENT", "Environment"),
    RESOURCE: localize("RESOURCE", "Resource"),
    RPO: localize("RPO", "RPO"),
    PACK: localize("PACK", "Patch"),
    DLG_TITLE_RESOURCES: localize("DLG_TITLE_RESOURCES", "Resources"),
    ENVIRONEMNT: localize("ENVIRONEMNT", "Environemnt"),
    SHOW_COLUMNS: localize("SHOW_COLUMNS", "Show Columns"),
  };
}
