import * as path from "path";
import * as vscode from "vscode";
import { TPatchEditorModel } from "tds-shared/lib";
import { Disposable } from "./utilities/dispose";
import { ServersConfig } from "../utils";
import { sendPatchInfo } from "../protocolMessages";
import { CommonCommandFromWebViewEnum, CommonCommandToWebViewEnum } from "tds-shared/lib";
import { getWebviewContent } from "./utilities/webview-utils";

interface PatchDocumentDelegate {
  getFileData(): Promise<TPatchEditorModel>;
}

/**
 * Define the document (the data model) used for patches files.
 */
class PatchDocument extends Disposable implements vscode.CustomDocument {
  static async create(
    uri: vscode.Uri,
    delegate: PatchDocumentDelegate
  ): Promise<PatchDocument | PromiseLike<PatchDocument>> {
    // If we have a backup, read that. Otherwise read the resource from the workspace
    const fileData: TPatchEditorModel = await PatchDocument.readFile(uri);
    return new PatchDocument(uri, fileData, delegate);
  }

  private static async readFile(uri: vscode.Uri): Promise<TPatchEditorModel> {
    const server = ServersConfig.getCurrentServer();
    const data: TPatchEditorModel = {
      filename: path.basename(uri.fsPath),
      lengthFile: (await vscode.workspace.fs.stat(uri)).size,
      patchInfo: await sendPatchInfo(
        server,
        uri.toString()
      ),
    };

    return data;
  }

  private readonly _uri: vscode.Uri;

  private _documentData: TPatchEditorModel;
  private readonly _delegate: PatchDocumentDelegate;

  private constructor(
    uri: vscode.Uri,
    initialContent: TPatchEditorModel,
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

  public get documentData(): TPatchEditorModel {
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
      readonly content?: TPatchEditorModel;
    }>()
  );
  /**
   * Fired to notify webview that the document has changed.
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
   * Fired to tell VS Code that an edit has occurred in the document.
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
    throw new Error(vscode.l10n.t("PTM files cannot be saved by TDS-VSCode. Please build them using the command [TOTVS: Patch Generation]."));
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

export class PatchEditorProvider //aka PatchEditorPanel
  implements vscode.CustomEditorProvider<PatchDocument> {
  private static newPatchFileId = 1;
  public static readonly viewType = "tds.patchEditorView";

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

        return { filename: "", lengthFile: 0, patchInfo: [] }
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
    this._setWebviewMessageListener(webviewPanel.webview, document);
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is received.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: vscode.Webview, document: PatchDocument) {
    webview.onDidReceiveMessage(
      (message: any) => {
        if (message.command === CommonCommandFromWebViewEnum.Ready) {
          webview.postMessage({
            command: CommonCommandToWebViewEnum.UpdateModel,
            data: {
              model: document.documentData,
              errors: []
            }
          });
        };
      },
      undefined,
      //this._disposables
    );
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

    return getWebviewContent(webview, this._context.extensionUri, "editorPatchView",
      { title: "Patch Editor", translations: this.getTranslations() });
  }

  protected getTranslations(): Record<string, string> {
    return {
      "Patch Objects": vscode.l10n.t("Patch Objects"),
      "**File:** `{0}` **Size:** `{1} bytes (~{2} KBytes)`": vscode.l10n.t("**File:** `{0}` **Size:** `{1} bytes (~{2} KBytes)`"),
      "Object Name": vscode.l10n.t("Object Name"),
      "Compile Date": vscode.l10n.t("Compile Date"),
      "Type": vscode.l10n.t("Type"),
      "Size": vscode.l10n.t("Size"),
      "Build Type": vscode.l10n.t("Build Type"),
    }
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