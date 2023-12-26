import * as vscode from "vscode";
import { getUri } from "./getUri";
import { getNonce } from "./getNonce";

/**
 * A extra options interface.
 *
 * @property data JSON structure with initial data
 * @property title View Title
 *
 * @remarks Extra files is add after de main files and storage in 'webview-ui/src/js' or 'webview-ui/src/css'
 */
export interface IWebviewContent {
  title?: string;
  data?: {}
}

// * @property cssExtraFiles Additional CSS files
//   * @property jsExtraFiles Additional JS files

const BASE_FOLDER: string[] = [
  "webview-ui",
  "build",
];

const CSS_BASE_FOLDER: string[] = [
  ...BASE_FOLDER,
  "css"
];

const JS_BASE_FOLDER: string[] = [
  ...BASE_FOLDER,
  "js"
];

/**
 * A helper function which will get the webview content..
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param entryPointName The entry point name
 * @param options An json with extra options
 * @returns A template string literal containing the HTML that should be
 * rendered within the webview panel
 */
export function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri, entryPointName: string, options?: IWebviewContent): string {
  // The CSS file from the React build output
  const stylesUri: vscode.Uri[] = [];
  const codiconsUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'webview-ui', 'node_modules', '@vscode', 'codicons', 'dist', 'codicon.css'));
  stylesUri.push(codiconsUri);

  // const cssFiles: string[] = options.cssExtraFiles || [];

  // The JS file from the React build output
  const scriptsUri: vscode.Uri[] = [];
  const jsFiles: string[] = [];  //options.jsExtraFiles || [];
  scriptsUri.push(getUri(webview, extensionUri, [
    ...BASE_FOLDER,
    `${entryPointName}.js`,
  ]))

  // cssFiles.forEach((filename) => {
  //   stylesUri.push(getUri(webview, extensionUri, [
  //     ...CSS_BASE_FOLDER,
  //     //folderName,
  //     filename
  //   ]))
  // });

  // jsFiles.forEach((filename) => {
  //   scriptsUri.push(getUri(webview, extensionUri, [
  //     ...JS_BASE_FOLDER,
  //     //folderName,
  //     filename
  //   ]))
  // });

  const nonce = getNonce();

  const data = { ...options!.data };

  //         <meta http-equiv="Content-Security-Policy"
  //                     content="default-src 'none';
  //                              img-src https:;
  //                              script-src 'unsafe-eval' 'unsafe-inline' vscode-resource:;
  //                              style-src vscode-resource: 'unsafe-inline';">

  return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          <meta http-equiv="Content-Security-Policy"
              content="default-src 'none';
                      img-src https: 'unsafe-inline' ${webview.cspSource};
                      font-src ${webview.cspSource};
                      style-src 'unsafe-inline' ${webview.cspSource};
                      script-src 'nonce-${nonce}';"
          >
          ${stylesUri.map((uri: vscode.Uri) => {
    return `<link rel="stylesheet" type="text/css" href="${stylesUri}">\n`;
  })}
          <link href="${codiconsUri}" rel="stylesheet" />
          <title>${options.title || "Webview Title"}</title>
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          ${scriptsUri.map((uri: vscode.Uri) => {
    return `<script nonce="${nonce}" src="${uri}"></script>\n`;
  })}
        </body>
      </html>
    `;
}