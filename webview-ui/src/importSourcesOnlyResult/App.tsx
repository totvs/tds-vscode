import { vscode } from "../utilities/vscodeWrapper";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";

function App() {

  return (
    <main>
      <h1>Hello World!</h1>
    </main>
  );
}

export default App;

//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
// 	  <!--meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; 'nonce-${nonce}'"-->
// 	  <!-- Antes do 'nonce-${nonce}' NAO pode ter ponto-e-virgula-->
//         <meta http-equiv="Content-Security-Policy" content="script-src 'self'; script-src-elem 'self' 'nonce-${nonce}'">
//         <title>Replay Import Soures Result</title>
//       </head>
//       <body>
//         <h1>Replay Import Sources Result </h1>
//         <vscode-button id="exportToTxt">Export to TXT</vscode-button>
// 	  <vscode-button id="exportToCsv">Export to CSV</vscode-button>
// 	  <vscode-data-grid id="sourcesgrid" generate-header="sticky" aria-label="Basic">
// 	  </vscode-data-grid>
//         <script id="module" type="module" nonce="${nonce}" src="${webviewUri}" sourceList=${sourceListAsJsonString}></script>
//       </body>
//     </html>