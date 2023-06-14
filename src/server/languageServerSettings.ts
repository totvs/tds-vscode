import * as vscode from "vscode";
import Utils from "../utils";

const currentSettings: {} = {};
let needRestart: boolean = false;
let waitRestart: boolean = false;

function isNewSettings(scope: string, key: string, value: any): boolean {
  let result: boolean = true;

  if (currentSettings[scope]) {
    if (currentSettings[scope][key]) {
      if (Array.isArray(value)) {
        result = currentSettings[scope][key] !== value.join(";");
      } else {
        result = currentSettings[scope][key] !== value;
      }
    }
  } else {
    currentSettings[scope] = {}
  }

  if (Array.isArray(value)) {
    currentSettings[scope][key] = value.join(";");
  } else {
    currentSettings[scope][key] = value;
  }

  return result;
}

export function getLanguageServerSettings(): any[] {
  return getModifiedLanguageServerSettings();
}

export function getModifiedLanguageServerSettings(): any[] {
  let config = vscode.workspace.getConfiguration("totvsLanguageServer");
  needRestart = false;

  const settings: any[] = [];

  if (isNewSettings("advpls", "fsencoding", config.get("filesystem.encoding"))) {
    settings.push({
      scope: "advpls",
      key: "fsencoding",
      value: config.get("filesystem.encoding"),
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
      value: String(usageInfo)
    });
  }

  let linter = config.get("editor.linter.behavior");
  if (isNewSettings("linter", "behavior", linter)) {
    settings.push({
      scope: "linter",
      key: "behavior",
      value: String(linter)
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

  const hover: string = config.get("editor.hover");
  if (isNewSettings("editor", "hoverMode", hover)) {
    settings.push({
      scope: "editor",
      key: "hoverMode",
      value: hover
    });
  }

  const launchArgs = config.get("launch.args");
  if (isNewSettings("launch", "args", launchArgs)) {
    needRestart = true;
  }

  const indexCache: string = config.get("editor.index.cache");
  if (isNewSettings("editor", "index.cache", indexCache)) {
    settings.push({
      scope: "editor",
      key: "indexCache",
      value: indexCache
    });
    needRestart = true;
  }

  const codeLens = config.get("editor.codeLens");
  if (isNewSettings("editor", "codeLens", codeLens)) {
    settings.push({
      scope: "editor",
      key: "codeLens",
      value: String(codeLens)
    });
  }

  const signatureHelp = config.get("editor.signatureHelp");
  if (isNewSettings("editor", "signatureHelp", signatureHelp)) {
    settings.push({
      scope: "editor",
      key: "signatureHelp",
      value: String(signatureHelp)
    });
  }
  const autocomplete = config.get("editor.autocomplete");
  if (isNewSettings("editor", "autocomplete", autocomplete)) {
    settings.push({
      scope: "editor",
      key: "autocomplete",
      value: String(autocomplete)
    });
  }

  if (settings.length > 0) {
    let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const version: string = ext.packageJSON["version"];
    settings.push({
      scope: "extension",
      key: "tdsversion",
      value: version
    });
  }

  return settings;
}

export function confirmRestartNow(): boolean {

  if (needRestart && !waitRestart) {
    vscode.window.showInformationMessage(
      "To make the change effective, it is necessary to restart VS-CODE.", { modal: true },
      "Now", "Later").then((value: string) => {
        waitRestart = true;
        if (value == "Now") {
          vscode.commands.executeCommand("workbench.action.reloadWindow");
        } else if (value == "Later") {
          setTimeout(() => {
            needRestart = true;
            waitRestart = false;
            confirmRestartNow();
          }, 60000);
        } else {
          needRestart = false;
          waitRestart = false;
        }
      })
  }

  return needRestart;
}

