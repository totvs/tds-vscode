import { languageClient } from "../extension";
import * as vscode from "vscode";
import Utils from "../utils";
import { DidChangeConfigurationNotification } from "vscode-languageclient";

export function toggleAutocompleteBehavior() {
  let config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(
    "totvsLanguageServer"
  );
  let behavior = config.get("editor.toggle.autocomplete");

  if (behavior === "Basic") {
    behavior = "LS";
  } else {
    behavior = "Basic";
  }
  config.update("editor.toggle.autocomplete", behavior);
}

export function syncSettings(): Promise<any> {
  if (!languageClient.isReady) {
    return Promise.resolve();
  }

  let config = vscode.workspace.getConfiguration("totvsLanguageServer");

  const settings: any[] = [];

  settings.push({
    scope: "advpls",
    key: "fsencoding",
    value: config.get("filesystem.encoding"),
  });

  settings.push({
    scope: "advpls",
    key: "autocomplete",
    value: config.get("editor.toggle.autocomplete"),
  });

  settings.push({
    scope: "advpls",
    key: "notificationlevel",
    value: config.get("editor.show.notification")
  });

  settings.push({
    scope: "advpls",
    key: "linter",
    value: config.get("editor.linter") ? "enabled" : "disabled",
  });

  settings.push({
    scope: "server",
    key: "usageInfo",
    value: Utils.isUsageInfoConfig() ? "enabled" : "disabled",
  });

  return languageClient.sendNotification(DidChangeConfigurationNotification.type, { settings: settings });

  // return languageClient.sendRequest("$totvsserver/changeSettingList", {
  //   changeSettingInfo: settings
  // });
}

export function changeSettings(jsonData: any) {

  return languageClient.sendRequest("$totvsserver/changeSetting", jsonData);
}
