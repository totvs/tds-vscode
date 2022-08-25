import * as vscode from "vscode";
import Utils from "../utils";

const oldSettings: {} = {};

function isNewSettings(scope: string, key: string, value: any): boolean {
  let result: boolean = true;

  if (oldSettings[scope]) {
    if (oldSettings[scope][key]) {
      result = oldSettings[scope][key] !== value;
    }
  } else {
    oldSettings[scope] = {}
  }

  oldSettings[scope][key] = value;

  return result;
}

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

export function getLanguageServerSettings(): any[] {
  let config = vscode.workspace.getConfiguration("totvsLanguageServer");

  const settings: any[] = [];

  if (isNewSettings("advpls", "fsencoding", config.get("filesystem.encoding"))) {
    settings.push({
      scope: "advpls",
      key: "fsencoding",
      value: config.get("filesystem.encoding"),
    });
  }

  if (isNewSettings("advpls", "autocomplete", config.get("editor.toggle.autocomplete"))) {
    settings.push({
      scope: "advpls",
      key: "autocomplete",
      value: config.get("editor.toggle.autocomplete"),
    });
  }

  if (isNewSettings("advpls", "notificationlevel", config.get("editor.show.notification"))) {
    settings.push({
      scope: "advpls",
      key: "notificationlevel",
      value: config.get("editor.show.notification")
    });
  }

  const usageInfo: string = Utils.isUsageInfoConfig() ? "enabled" : "disabled";
  if (isNewSettings("server", "usageInfo", usageInfo)) {
    settings.push({
      scope: "server",
      key: "usageInfo",
      value: usageInfo
    });
  }

  const linter = config.get("editor.linter.behavior");
  if (isNewSettings("linter", "behavior", linter)) {
    settings.push({
      scope: "linter",
      key: "behavior",
      value: linter
    });
  }

  const includes: string = (Utils.getIncludes(true, Utils.getCurrentServer()) || []).join(";");
  if (isNewSettings("linter", "includes", includes)) {
    settings.push({
      scope: "linter",
      key: "includes",
      value: includes
    });
  }

  return settings;
}

