import * as vscode from "vscode";
import { getUri } from "../../../utilities/getUri";
import { getNonce } from "../../../utilities/getNonce";
import Utils, { MESSAGETYPE } from "../../../utils";
const fs = require("fs");
var os = require('os');
//import html from '../html/WebViewImportSourcesOnlyResult.html'

export class ImportSourcesOnlyResultPanel {
  public static currentPanel: ImportSourcesOnlyResultPanel | undefined;
  public sourceList: any;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel,extensionUri: vscode.Uri, sourceList: any) {
    this._panel = panel;

	this.sourceList = sourceList;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri, sourceList);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  public static render(extensionUri: vscode.Uri, sourceList: any) {
    if (ImportSourcesOnlyResultPanel.currentPanel) {
		ImportSourcesOnlyResultPanel.currentPanel.sourceList = sourceList;
        // If the webview panel already exists reveal it
		ImportSourcesOnlyResultPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel("importSourcesOnlyResult", "Replay Sources Result", vscode.ViewColumn.One, {
         // Enable javascript in the webview
        enableScripts: true,
        // Restrict the webview to only load resources from the `out` directory
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out', 'debug', 'tdsreplay', 'webviews')]
      });

      ImportSourcesOnlyResultPanel.currentPanel = new ImportSourcesOnlyResultPanel(panel,extensionUri, sourceList);
    }
  }

  public dispose() {
    ImportSourcesOnlyResultPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, sourceList: Object) {

	let sourceListAsJsonString = JSON.stringify(sourceList);
	let regex = / /g;
	sourceListAsJsonString = sourceListAsJsonString.replace(regex, "\u00a0");
	//console.debug(sourceListAsJsonString);
	const webviewUri = getUri(webview, extensionUri, ["out","debug","tdsreplay","webviews","ImportSourcesOnlyWebView.js"]);
    const nonce = getNonce();

    // Tip: Install the es6-string-html VSCODE EXTENSION to enable code highlighting below
	//Para adicionar componentes do vscode-ui-webtoolkit, eh necessario importar e registrar no arquivo ImportSourcesOnlyWebView.ts
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <!--meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; 'nonce-${nonce}'"-->
		  <!-- Antes do 'nonce-${nonce}' NAO pode ter ponto-e-virgula-->
          <meta http-equiv="Content-Security-Policy" content="script-src 'self'; script-src-elem 'self' 'nonce-${nonce}'">
          <title>Replay Import Soures Result</title>
        </head>
        <body>
          <h1>Replay Import Sources Result </h1>
          <vscode-button id="exportToTxt">Export to TXT</vscode-button>
		  <vscode-button id="exportToCsv">Export to CSV</vscode-button>
		  <vscode-data-grid id="sourcesgrid" generate-header="sticky" aria-label="Basic">
		  </vscode-data-grid>
          <script id="module" type="module" nonce="${nonce}" src="${webviewUri}" sourceList=${sourceListAsJsonString}></script>
        </body>
      </html>
    `;
  }

   /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
   private _setWebviewMessageListener(webview: vscode.Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        switch (command) {
			case "exportToTxt":
				handleExportToTxt(message);
            return;
			case "exportToCsv":
				handleExportToTxt(message, true);
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside src/webview/main.ts)
        }
      },
      undefined,
      this._disposables
    );

	function handleExportToTxt(message: any, isCsv?: boolean)
	{
		const tableRows = message.data;
		let saveLabel = isCsv ? "Export to Csv" : "Export to TXT";
		let filters = isCsv ? {'Csv': ['csv']} : {'Text': ['txt']};
		vscode.window.showSaveDialog({saveLabel: saveLabel, filters:filters}).then(fileInfos => {
			let savePath = fileInfos.path;
			if(os.platform() === "win32") {
				savePath = savePath.substring(1);
			}
			const writeStream = fs.createWriteStream(savePath);
			isCsv ? tableRows.forEach(value => writeStream.write(`${value.name},${value.compileDate}\n`))
				  : tableRows.forEach(value => writeStream.write(`${value.name} ${value.compileDate}\n`));

			// the finish event is emitted when all data has been flushed from the stream
			writeStream.on('finish', () => {
				let fullSuccesMsg = `File ${savePath} saved successfully!`;
				Utils.logMessage(fullSuccesMsg, MESSAGETYPE.Info,	true);
			});
			// handle the errors on the write process
			writeStream.on('error', (err) => {
				let fullErrMsg = `There is an error writing the file ${savePath} => ${err}`;
				Utils.logMessage(fullErrMsg, MESSAGETYPE.Error,	true);
			});
			writeStream.end();
		});
	}

  }

}