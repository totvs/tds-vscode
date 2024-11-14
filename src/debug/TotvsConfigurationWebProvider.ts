import { window, DebugConfiguration, DebugConfigurationProvider } from "vscode";
import * as vscode from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";
import serverProvider from "../serverItemProvider";
import { ServerItem } from "../serverItem";

export class TotvsConfigurationWebProvider
  extends TotvsConfigurationProvider
  implements DebugConfigurationProvider {
  static _TYPE: string = "totvs_language_web_debug";
  static _NAME: string = "TOTVS Language Web Debug (SmartClient HTML)";

  protected initialize(config: DebugConfiguration) {

    config.type = TotvsConfigurationWebProvider._TYPE;
    config.name = TotvsConfigurationWebProvider._NAME;
    config.smartclientBin = null;
    config.smartclientUrl = null;
  }

  protected finalize(config: DebugConfiguration) {
    const cfg = vscode.workspace.getConfiguration("totvsLanguageServer");
    let webNavigator: string = cfg.get("web.navigator") || "";
    const webNavigatorArgs: string[] = cfg.get("web.arguments") || [];

    if (webNavigator === "") {
      configureWebNavigator();
      return undefined; //cancela a execução
    }

    config.webNavigator = webNavigator;
    config.webNavigatorArgs = webNavigatorArgs;

    const connectedServerItem: ServerItem = serverProvider.connectedServerItem;
    if (!config.smartclientUrl) {
      // if address do not start with http:// or https:// add scheme
      if (!connectedServerItem.address.startsWith("http://") && !connectedServerItem.address.startsWith("https://")) {
        let scheme = connectedServerItem.secure ? "https" : "http";
        config.smartclientUrl = `${scheme}://${connectedServerItem.address}:${connectedServerItem.port}/webapp/`;
      } else {
        config.smartclientUrl = `${connectedServerItem.address}:${connectedServerItem.port}/webapp/`;
      }
    }

    if (config.smartclientUrl && !config.smartclientUrl.endsWith("/")) {
      config.smartclientUrl = config.smartclientUrl + '/';
    }

    return config;
  }
}

function configureWebNavigator() {
  window.showErrorMessage(
    vscode.l10n.t("Parameter WebNavigator not informed."),
    { modal: true },
    vscode.l10n.t("Select Browser")
  ).then(async (response: string) => {
    if (response && response == vscode.l10n.t("Select Browser")) {
      const options: vscode.OpenDialogOptions = {
        canSelectFiles: true,
        title: vscode.l10n.t("Select Browser"),
        openLabel: vscode.l10n.t("Select Browser")
      };

      vscode.window.showOpenDialog(options)
        .then((fileUris: vscode.Uri[]) => {
          if (fileUris && fileUris.length > 0) {
            const cfg = vscode.workspace.getConfiguration("totvsLanguageServer");
            let webNavigator: string = "";

            if (fileUris[0].path.startsWith("/") && fileUris[0].path.search(":") == 2) {
              webNavigator = fileUris[0].path.substring(1).replace(/\//g, "\\");
            } else {
              webNavigator = fileUris[0].path;
            }

            cfg.update("web.navigator", webNavigator).then(() => {
              window.showInformationMessage(
                vscode.l10n.t("Configuration saves in the user area. Restart debugger process."),
                { modal: true })
            });
          }
        })
    }
  });

}

