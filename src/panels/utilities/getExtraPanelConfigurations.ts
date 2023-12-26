import { Uri } from "vscode";
import { getCspSource } from "./getCspSource";

// Extra panel configurations
export function getExtraPanelConfigurations(extensionUri: Uri): {} {
  return {
    // Enable JavaScript in the webview
    enableScripts: true,
    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
    localResourceRoots: getCspSource(extensionUri)
  };
}
