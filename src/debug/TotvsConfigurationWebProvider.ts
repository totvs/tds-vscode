import { existsSync } from "fs";
import * as path from "path";
import { DebugConfiguration, DebugConfigurationProvider } from "vscode";
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
    const webNavigator: string = config["webNavigator"] || cfg.get("web.navigator") || "";
    const webNavigatorArgs: string[] = config["web.arguments"] || cfg.get("web.arguments") || [];
    let webAgent: string = config["webAgent"] || cfg.get<string>("web-agent.agent") || "";
    const webAgentArgs: string[] = config["web-agent.arguments"] || cfg.get("web-agent.arguments") || [];

    if (process.platform === "win32") {
      if (webAgent) {
        webAgent = path.normalize(webAgent.replace(/%([^%]+)%/g, (reference, name) =>
          process.env[name] ?? reference
        ));
      } else {
        const localAppData = process.env.LOCALAPPDATA ||
          (process.env.APPDATA && path.join(process.env.APPDATA, "..", "Local"));
        if (localAppData) {
          const defaultWebAgent = path.join(localAppData, "Programs", "web-agent", "web-agent.exe");
          if (existsSync(defaultWebAgent)) {
            webAgent = defaultWebAgent;
          }
        }
      }
    }

    config.webNavigator = webNavigator;
    config.webNavigatorArgs = webNavigatorArgs;
    config.webAgent = webAgent;
    config.webAgentArgs = webAgentArgs;

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

