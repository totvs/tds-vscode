import * as vscode from "vscode";
import * as path from "path";
import { ApplyPatchPanelAction, IApplyPatchPanelAction } from "./actions";
import * as nls from "vscode-nls";
import Utils from "../../utils";
import { ServerItem } from "../../serverItemProvider";
import { IApplyPatchData, IPatchFileInfo, PATCH_ERROR_CODE } from "./applyPatchData";
import JSZip = require("jszip");
import { IPatchInfoRequestData } from "../../rpoInfo/rpoPath";
import { sendApplyPatchRequest, sendValidPatchRequest } from "../../protocolMessages";

const fs = require("fs");
const os = require("os");

const localize = nls.loadMessageBundle();
const WS_STATE_KEY = "APPLY_PATCH_TABLE";

let applyPathLoader: ApplyPatchLoader = undefined;

export function openApplyPatchView(context: vscode.ExtensionContext) {
  const server = Utils.getCurrentServer();

  if (applyPathLoader === undefined || applyPathLoader === null) {
    applyPathLoader = new ApplyPatchLoader(context);
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
        element.applyOld = false;
        element.status = "loaded";
      });
      this.updatePage();
    }
  }

  constructor(context: vscode.ExtensionContext) {
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
        applyOld: hasData,
        apply: hasData,
        deleteAll: hasData,
        serverName: hasServer ?
          this.currentServer.name :
          localize("AWAITING_SELECTION", "(awaiting selection)"),
        applyPatchData: this._applyPatchData,
      },
    });
  }

  private applyPatchs(
    server: ServerItem,
    files: any[],
    message: string
  ): void {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: localize("APPLY_PATCHS_MESSAGE", "Applying Patch"),
        cancellable: true,
      },
      (progress, token) => {
        const total: number = files.length;
        let cnt: number = 0;
        let inc: number = files.length / 100;

        token.onCancellationRequested(() => {
          console.log("User canceled the operation");
        });

        files.forEach((recipient) => {
          cnt++;
          progress.report({
            message: localize("APPLYING", "Applying #{0}/{1}", cnt, total),
            increment: inc,
          });
        });

        const p = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });

        return p;
      }
    );
  }

  private async handleMessage(command: IApplyPatchPanelAction) {
    switch (command.action) {
      case ApplyPatchPanelAction.ApplyOldSource:
        {
          const processAll: any = command.content.processAll;
          const file: any = command.content.file;
          const value: boolean = command.content.value;

          if (processAll) {
            this.doApplyOldSource(this._applyPatchData.patchFiles, value)
          } else {
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
            openApplyPatchView(context);
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

  private doApplyOldSource(patchFiles: IPatchFileInfo[], value: boolean) {
    patchFiles.forEach((patchFile) => {
      if (patchFile) {
        if (patchFile.data.error_number == PATCH_ERROR_CODE.OLD_RESOURCES) {
          patchFile.applyOld = value;
          patchFile.status = value ? "warning" : "loaded";
        }
      }
    })
  }

  private async doApply(patchFiles: IPatchFileInfo[]) {
    const self = this;
    const process = [];

    patchFiles.forEach((element: IPatchFileInfo) => {
      process.push(() => {
        if (element.status == "loaded" || element.status == "valid" || element.status == "warning") {
          element.status = "applying";
          element.data = { error_number: -1, data: "" }
          self.updatePage();

          sendApplyPatchRequest(this.currentServer, [element.fullpath], Utils.getPermissionsInfos(), element.applyOld)
            .then((result: IPatchInfoRequestData) => {
              element.status = "applyed";
            }, (reason: any) => {
              element.message = reason.message || "";
              element.data = reason.data;
              element.status = "error";
            }).then(() => {
              self.updatePage();
            });
        }
      })
    });

    for (let i = 0; i < process.length; i++) {
      await process[i]();
    }

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

        patchFiles.forEach( async (element: IPatchFileInfo) =>  {
            cnt++;
            progress.report({
              message: localize("APPLYING", "File {3} #{0}/{1}", cnt, total, element.name),
              increment: inc
            });
            element.status = "validating";
            element.data = { error_number: -1, data: "" }
            self.updatePage();

            await sendValidPatchRequest(this.currentServer, element.fullpath, Utils.getPermissionsInfos(), element.applyOld)
              .then((result: IPatchInfoRequestData) => {
                element.status = "valid";
              }, (reason: any) => {
                element.message = reason.message || "";
                element.data = reason.data;
                if (reason.data.error_number == PATCH_ERROR_CODE.OLD_RESOURCES) {
                  element.status = element.applyOld ? "warning" : "error";
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
      applyOld: false,
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
    CANCEL: localize("CANCEL", "Cancel"),
    COMMENT: localize("COMMENT", "Comment"),
    COMPUTER_NAME: localize("COMPUTER_NAME", "Computer Name"),
    CONNECTION: localize("CONNECTION", "Connection"),
    "CONNECTION_TYPE ": localize("CONNECTION_TYPE ", "Connection Type"),
    CTREE_ID: localize("CTREE_ID", "CTree ID"),
    DISCONNECT_ALL_USERS: localize(
      "DISCONNECT_ALL_USERS",
      "Disconnect all users"
    ),
    DISCONNECT_SELECTD_USERS: localize(
      "DISCONNECT_SELECTD_USERS",
      "Disconnect selectd users"
    ),
    DRAG_HEADERS: localize("DRAG_HEADERS", "Drag headers ..."),
    ELAPSED_TIME: localize("ELAPSED_TIME", "Elapsed time"),
    GROUPED_BY: localize("GROUPED_BY", "Grouped by:"),
    GROUPING_ON_OFF: localize("GROUPING_ON_OFF", "Grouping on/off"),
    TREE_ON_OFF: localize("TREE_ON_OFF", "Tree server on/off"),
    INACTIVITY_TIME: localize("INACTIVITY_TIME", "Idle time"),
    INFO_RELEASE_CONNECTION: localize(
      "INFO_RELEASE_CONNECTION",
      "When confirming the release of new connections, users can connect to that server again."
    ),
    "INSTRUCTIONS_SEG ": localize("INSTRUCTIONS_SEG ", "Instructions/sec"),
    LOCK_SERVER: localize("LOCK_SERVER", "Lock server"),
    LONG: localize("LONG", "(long)"),
    MANUAL: localize("MANUAL", "(manual)"),
    MEMORY_USE: localize("MEMORY_USE", "Memory in Use"),
    MESSAGE_TEXT: localize("MESSAGE_TEXT", "Message Text"),
    NORMAL: localize("NORMAL", "(normal)"),
    OK: localize("OK", "OK"),
    PROGRAM: localize("PROGRAM", "Program"),
    REFRESH_DATA: localize("REFRESH_DATA", "Refresh data"),
    REMARKS: localize("REMARKS", "Remarks"),
    RESET_CONFIGURATIONS: localize(
      "RESET_CONFIGURATIONS",
      "Reset configurations"
    ),
    SEND: localize("SEND", "Submit"),
    SEND_MESSAGE_ALL_USERS: localize(
      "SEND_MESSAGE_ALL_USERS",
      "Send message to all users"
    ),
    SEND_MESSAGE_SELECTED_USERS: localize(
      "SEND_MESSAGE_SELECTED_USERS",
      "Send message to selected users"
    ),
    SERVER: localize("SERVER", "Server"),
    SHORT: localize("SHORT", "(short)"),
    SHOW_HIDE_COLUMNS: localize("SHOW_HIDE_COLUMNS", "Show/hide columns"),
    SID: localize("SID", "SID"),
    STOP_SERVER: localize("STOP_SERVER", "Stop server"),
    THREAD: localize("THREAD", "Thread ID"),
    "TOTAL_INSTRUCTIONS ": localize("TOTAL_INSTRUCTIONS ", "Instructions"),
    UNLOCK_SERVER: localize("UNLOCK_SERVER", "Unlock server"),
    UPDATE_SPEED: localize("UPDATE_SPEED", "Update speed {0}"),
    USER: localize("USER", "User"),
    USER_NAME: localize("USER_NAME", "User Name"),
    WARNING_BLOCKING_CONNECTIONS: localize(
      "WARNING_BLOCKING_CONNECTIONS",
      "When confirming the blocking of new connections, no user can connect to that server."
    ),
    WARN_ALL_CONNECTIONS_CLOSE_1: localize(
      "WARN_ALL_CONNECTIONS_CLOSE_1",
      "When confirming the server stop, all connections (including this) will be closed, as well as other processes."
    ),
    WARN_ALL_CONNECTIONS_CLOSE_2: localize(
      "ERROR_ALL_CONNECTIONS_CLOSE_2",
      "Restarting will only be possible by physically accessing the server."
    ),
    SECONDS: localize("SECONDS", "{0} seconds"),
    WARN_CONNECTION_TERMINATED: localize(
      "WARN_CONNECTION_TERMINATED",
      "The users listed below will have their connections terminated."
    ),
    TERMINATE_CONNECTIONS_IMMEDIATELY: localize(
      "TERMINATE_CONNECTIONS_IMMEDIATELY",
      "Terminate connections immediately."
    ),
    DLG_TITLE_SEND_MESSAGE: localize(
      "DLG_TITLE_SEND_MESSAGE",
      "Message sending"
    ),
    DLG_TITLE_CLOSE_CONNECTIONS: localize(
      "DLG_TITLE_CLOSE_CONNECTIONS",
      "Closes user connections"
    ),
    DLG_TITLE_SPEED: localize("DLG_TITLE_SPEED", "Interval between updates"),
    DLG_TITLE_STOP_SERVER: localize(
      "DLG_TITLE_STOP_SERVER",
      "Confirm the server stop?"
    ),
    DLG_TITLE_LOCK_SERVER: localize(
      "DLG_TITLE_LOCK_SERVER",
      "Block new connections?"
    ),
    DLG_TITLE_REMARKS: localize("DLG_TITLE_REMARKS", "Remarks"),
    DLG_TITLE_UNLOCK: localize("DLG_TITLE_UNLOCK", "Unlock new connections?"),
    ENVIRONEMNT: localize("ENVIRONEMNT", "Environemnt"),
    SHOW_COLUMNS: localize("SHOW_COLUMNS", "Show Columns"),
  };
}
