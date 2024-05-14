import * as vscode from "vscode";
import Utils, { MESSAGE_TYPE } from "../utils";
import { getExtraPanelConfigurations, getWebviewContent } from "./utilities/webview-utils";

const fs = require("fs");
var os = require('os');

export class ImportSourcesOnlyResultPanel {
  public sourceList: any = [];

  public static currentPanel: ImportSourcesOnlyResultPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  /**
   * The AddServerPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, sourceList: any) {
    this.sourceList = sourceList;
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   * @param sourceList Initial source list
   */
  public static render(extensionUri: vscode.Uri, sourceList: any) {
    if (ImportSourcesOnlyResultPanel.currentPanel) {
      ImportSourcesOnlyResultPanel.currentPanel.sourceList = sourceList;
      // If the webview panel already exists reveal it
      ImportSourcesOnlyResultPanel.currentPanel._panel.reveal(); //vscode.ViewColumn.One
    } else {
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        "import-sources-only-result",
        // Panel title
        vscode.l10n.t("Replay Sources Result"),
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          ...getExtraPanelConfigurations(extensionUri)
        });

      ImportSourcesOnlyResultPanel.currentPanel = new ImportSourcesOnlyResultPanel(panel, extensionUri, sourceList);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    ImportSourcesOnlyResultPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(extensionUri: vscode.Uri) {

    return getWebviewContent(this._panel.webview, extensionUri, "ImportSourcesOnlyResultView",
      { title: this._panel.title, data: this.sourceList, translations: this.getTranslations() });
  }

  getTranslations(): Record<string, string> {
    throw new Error("Method not implemented.");
  }

  /*
  * Sets up an event listener to listen for messages passed from the webview context and
  * executes code based on the message that is received.
  *
  * @param webview A reference to the extension webview
  */
  private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        switch (command) {
          case "exportToTxt":
            this.handleExportToTxt(message);
            return;
          case "exportToCsv":
            this.handleExportToTxt(message, true);
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside src/webview/main.ts)
        }
      },
      undefined,
      this._disposables
    );
  }

  private handleExportToTxt(message: any, isCsv?: boolean) {
    const tableRows = message.data;
    let saveLabel = isCsv ? "Export to Csv" : "Export to TXT";
    let filters = isCsv ? { 'Csv': ['csv'] } : { 'Text': ['txt'] };

    vscode.window.showSaveDialog({ saveLabel: saveLabel, filters: filters }).then(fileInfos => {
      let savePath = fileInfos.path;
      if (os.platform() === "win32") {
        savePath = savePath.substring(1);
      }
      const writeStream = fs.createWriteStream(savePath);
      isCsv ?
        tableRows.forEach((value) => {
          writeStream.write(`${value.name},${value.compileDate}\n`)
        })
        : tableRows.forEach((value) => {
          writeStream.write(`${value.name} ${value.compileDate}\n`)
        });

      // the finish event is emitted when all data has been flushed from the stream
      writeStream.on('finish', () => {
        let fullSuccessMsg = `File ${savePath} saved successfully!`;
        Utils.logMessage(fullSuccessMsg, MESSAGE_TYPE.Info, true);
      });

      // handle the errors on the write process
      writeStream.on('error', (err) => {
        let fullErrMsg = `There is an error writing the file ${savePath} => ${err}`;
        Utils.logMessage(fullErrMsg, MESSAGE_TYPE.Error, true);
      });

      writeStream.end();
    });
  }
}


// private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, sourceList: Object) {
//   let sourceListAsJsonString = JSON.stringify(sourceList);
//   let regex = / /g;
//   sourceListAsJsonString = sourceListAsJsonString.replace(regex, "\u00a0");
//   console.log(sourceListAsJsonString);
//   const webviewUri = getUri(webview, extensionUri, ["out", "debug", "tdsreplay", "webviews", "ImportSourcesOnlyWebView.js"]);
//   const nonce = getNonce();

//   // Tip: Install the es6-string-html VSCODE EXTENSION to enable code highlighting below
//   //Para adicionar componentes do vscode-ui-webtoolkit, eh necessario importar e registrar no arquivo ImportSourcesOnlyWebView.ts
//   return /*html*/ `
//...html
//   `;
// }
