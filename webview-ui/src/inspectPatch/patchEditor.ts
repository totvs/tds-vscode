import * as path from "path";
import * as vscode from "vscode";
import { sendPatchInfo } from "../../protocolMessages";
import { ServersConfig } from "../../utils";
import { ApplyViewAction } from "./actions";
import { Disposable, disposeAll } from "./dispose";
import * as fs from "fs"
import { IPatchData } from "./patchData";

interface PatchDocumentDelegate {
  getFileData(): Promise<IPatchData>;
}

/**
 * Define the document (the data model) used for paw draw files.
 */
class PatchDocument extends Disposable implements vscode.CustomDocument {
  static async create(
    uri: vscode.Uri,
    delegate: PatchDocumentDelegate
  ): Promise<PatchDocument | PromiseLike<PatchDocument>> {
    // If we have a backup, read that. Otherwise read the resource from the workspace
    const fileData: IPatchData = await PatchDocument.readFile(uri);
    return new PatchDocument(uri, fileData, delegate);
  }

  private static async readFile(uri: vscode.Uri): Promise<IPatchData> {
    const server = ServersConfig.getCurrentServer();
    const data: IPatchData = {
      filename: path.basename(uri.fsPath),
      lengthFile: (await vscode.workspace.fs.stat(uri)).size,
      patchInfo: await sendPatchInfo(
        server,
        uri.fsPath
      ),
    };

    return data;
  }

  private readonly _uri: vscode.Uri;

  private _documentData: IPatchData;
  private readonly _delegate: PatchDocumentDelegate;

  private constructor(
    uri: vscode.Uri,
    initialContent: IPatchData,
    delegate: PatchDocumentDelegate
  ) {
    super();
    this._uri = uri;
    this._documentData = initialContent;
    this._delegate = delegate;
  }

  public get uri() {
    return this._uri;
  }

  public get documentData(): IPatchData {
    return this._documentData;
  }

  private readonly _onDidDispose = this._register(
    new vscode.EventEmitter<void>()
  );
  /**
   * Fired when the document is disposed of.
   */
  public readonly onDidDispose = this._onDidDispose.event;

  private readonly _onDidChangeDocument = this._register(
    new vscode.EventEmitter<{
      readonly content?: IPatchData;
    }>()
  );
  /**
   * Fired to notify webviews that the document has changed.
   */
  public readonly onDidChangeContent = this._onDidChangeDocument.event;

  private readonly _onDidChange = this._register(
    new vscode.EventEmitter<{
      readonly label: string;
      undo(): void;
      redo(): void;
    }>()
  );
  /**
   * Fired to tell VS Code that an edit has occured in the document.
   *
   * This updates the document's dirty indicator.
   */
  public readonly onDidChange = this._onDidChange.event;

  /**
   * Called by VS Code when there are no more references to the document.
   *
   * This happens when all editors for it have been closed.
   */
  dispose(): void {
    this._onDidDispose.fire();
    super.dispose();
  }

  /**
   * Called by VS Code when the user saves the document.
   */
  async save(cancellation: vscode.CancellationToken): Promise<void> {
    await this.saveAs(this.uri, cancellation);
  }

  /**
   * Called by VS Code when the user saves the document to a new location.
   */
  async saveAs(
    targetResource: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<void> {
    const fileData = await this._delegate.getFileData();
    if (cancellation.isCancellationRequested) {
      return;
    }
    //await vscode.workspace.fs.writeFile(targetResource, fileData);
  }

  /**
   * Called by VS Code when the user calls `revert` on a document.
   */
  async revert(_cancellation: vscode.CancellationToken): Promise<void> {
    const diskContent = await PatchDocument.readFile(this.uri);
    this._documentData = diskContent;
    //this._edits = this._savedEdits;
    // this._onDidChangeDocument.fire({
    //   content: diskContent,
    //   edits: this._edits,
    // });
  }

  /**
   * Called by VS Code to backup the edited document.
   *
   * These backups are used to implement hot exit.
   */
  async backup(
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Promise<vscode.CustomDocumentBackup> {
    await this.saveAs(destination, cancellation);

    return {
      id: destination.toString(),
      delete: async () => {
        try {
          await vscode.workspace.fs.delete(destination);
        } catch {
          // noop
        }
      },
    };
  }
}

export class PatchEditorProvider
  implements vscode.CustomEditorProvider<PatchDocument> {
  private static newPatchFileId = 1;

  public static register(context: vscode.ExtensionContext): vscode.Disposable {

    return vscode.window.registerCustomEditorProvider(
      PatchEditorProvider.viewType,
      new PatchEditorProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: false,
      }
    );
  }

  static readonly viewType = "tds.patchView";

  /**
   * Tracks all known webviews
   */
  private readonly webviews = new WebviewCollection();

  constructor(private readonly _context: vscode.ExtensionContext) { }

  async openCustomDocument(
    uri: vscode.Uri,
    openContext: { backupId?: string },
    _token: vscode.CancellationToken
  ): Promise<PatchDocument> {
    const document: PatchDocument = await PatchDocument.create(uri, {
      getFileData: async () => {
        const webviewsForDocument = Array.from(this.webviews.get(document.uri));
        if (!webviewsForDocument.length) {
          throw new Error("Could not find webview to save for");
        }

        const panel = webviewsForDocument[0];
        const response = await this.postMessageWithResponse<number[]>(
          panel,
          "getFileData",
          {}
        );

        return { filename: "", lengthFile: 0, patchInfo: {} }
      },
    });

    return document;
  }

  async resolveCustomEditor(
    document: PatchDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    // Add the webview to our internal set of active webviews
    this.webviews.add(document.uri, webviewPanel);

    // Setup initial content for the webview
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // Wait for the webview to be properly ready before we init
    webviewPanel.webview.onDidReceiveMessage((e) => {
      if (e.action === ApplyViewAction.Ready) {
        const data: IPatchData = document.documentData;
        this.postMessage(webviewPanel, ApplyViewAction.Init, data);
      }
    });
  }

  private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<
    vscode.CustomDocumentEditEvent<PatchDocument>
  >();
  public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument
    .event;

  public saveCustomDocument(
    document: PatchDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    return document.save(cancellation);
  }

  public saveCustomDocumentAs(
    document: PatchDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    return document.saveAs(destination, cancellation);
  }

  public revertCustomDocument(
    document: PatchDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    return document.revert(cancellation);
  }

  public backupCustomDocument(
    document: PatchDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken
  ): Thenable<vscode.CustomDocumentBackup> {
    return document.backup(context.destination, cancellation);
  }

  /**
   * Get the static HTML used for in our editor's webviews.
   */
  private getHtmlForWebview(webview: vscode.Webview): string {
    const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const extensionPath = ext.extensionPath;

    // Local path to main script run in the webview
    const reactAppPathOnDisk = vscode.Uri.file(
      path.join(extensionPath, "out", "webpack", "inspectPatchPanel.js")
    );

    const reactAppUri = webview.asWebviewUri(reactAppPathOnDisk);

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
        </script>
    </head>
    <body>
        <div id="root"></div>
        <script crossorigin src="${reactAppUri}"></script>
    </body>
    </html>`;
  }

  private _requestId = 1;
  private readonly _callbacks = new Map<number, (response: any) => void>();

  private postMessageWithResponse<R = unknown>(
    panel: vscode.WebviewPanel,
    type: string,
    body: any
  ): Promise<R> {
    const requestId = this._requestId++;
    const p = new Promise<R>((resolve) =>
      this._callbacks.set(requestId, resolve)
    );
    //panel.webview.postMessage({ type, requestId, body });
    return p;
  }

  private postMessage(
    panel: vscode.WebviewPanel,
    action: ApplyViewAction,
    content: any
  ): void {
    panel.webview.postMessage({ action: action, content: content });
  }
}

/**
 * Tracks all webviews.
 */
class WebviewCollection {
  private readonly _webviews = new Set<{
    readonly resource: string;
    readonly webviewPanel: vscode.WebviewPanel;
  }>();

  /**
   * Get all known webviews for a given uri.
   */
  public *get(uri: vscode.Uri): Iterable<vscode.WebviewPanel> {
    const key = uri.toString();
    for (const entry of this._webviews) {
      if (entry.resource === key) {
        yield entry.webviewPanel;
      }
    }
  }

  /**
   * Add a new webview to the collection.
   */
  public add(uri: vscode.Uri, webviewPanel: vscode.WebviewPanel) {
    const entry = { resource: uri.toString(), webviewPanel };
    this._webviews.add(entry);

    webviewPanel.onDidDispose(() => {
      this._webviews.delete(entry);
    });
  }
}
