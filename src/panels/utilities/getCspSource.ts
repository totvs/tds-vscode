import { Uri } from "vscode";

// Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
export function getCspSource(extensionUri: Uri) {
  return [
    Uri.joinPath(extensionUri, "out"),
    Uri.joinPath(extensionUri, "webview-ui/build"),
    Uri.joinPath(extensionUri, "webview-ui/node_modules/@vscode"),
    Uri.joinPath(extensionUri, "webview-ui/media")
  ];
}
