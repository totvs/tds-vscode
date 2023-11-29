import { window, DebugConfiguration, DebugConfigurationProvider } from "vscode";
import * as vscode from "vscode";
import { TotvsConfigurationProvider } from "./TotvsConfigurationProvider";

export class TotvsConfigurationWebProvider
  extends TotvsConfigurationProvider
  implements DebugConfigurationProvider
{
  static _TYPE: string = "totvs_language_web_debug";
  static _NAME: string = "TOTVS Language Web Debug (SmartClient HTML)";
  static _SC_BIN: string = "http://localhost:8080";

  protected initialize(config: DebugConfiguration) {
    config.type = TotvsConfigurationWebProvider._TYPE;
    config.name = TotvsConfigurationWebProvider._NAME;
    config.smartclientBin = null;
    config.smartclientUrl = TotvsConfigurationWebProvider._SC_BIN;
  }

  protected finalize(config: DebugConfiguration) {
    const cfg = vscode.workspace.getConfiguration("totvsLanguageServer");
    const webNavigator: string | undefined = cfg.get("web.navigator");

    if (!webNavigator || webNavigator === "") {
      window.showErrorMessage(
        vscode.l10n.t("Parameter WebNavigator not informed.")
      );
      return undefined; // abort launch
    }

    config.webNavigator = webNavigator;

    return config;
  }
}
