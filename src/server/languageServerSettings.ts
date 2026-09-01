import * as vscode from "vscode";
import { languageClient } from "../extension";
import Utils, { ServersConfig } from "../utils";

const currentSettings: {} = {};
let _needRestart: boolean = false;
let _waitRestart: boolean = false;

function setNeedRestart(value: boolean) {
  _needRestart = value;
  //_waitRestart = value ? false : true;
}

function getFormatterKeysFromPackage(): Record<string, Record<string, any>> {
  const ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
  const properties = ext?.packageJSON?.contributes?.configuration?.properties || {};
  const advplFormatterProperties = properties["advpl.formatter"]?.properties || {};
  const fourglFormatterProperties = properties["4gl.formatter"]?.properties || {};
  const defaultValues: Record<string, Record<string, any>> = {};
  defaultValues["advpl"] = {};
  defaultValues["4gl"] = {};

  Object.entries(advplFormatterProperties).forEach(([key, config]: [string, any]) => {
    defaultValues["advpl"][key] = config.default;
  });

  Object.entries(fourglFormatterProperties).forEach(([key, config]: [string, any]) => {
    defaultValues["4gl"][key] = config.default;
  });

  return defaultValues;
}

function isNewSettings(scope: string, key: string, value: any): boolean {
  let result: boolean = true;

  if (currentSettings[scope]) {
    if (currentSettings[scope][key] !== undefined) {
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
  _needRestart = false;

  const settings: any[] = [];

  if (config.has("editor.linter")) {
    let oldLinter = config.get("editor.linter");
    if (oldLinter !== Object(oldLinter)) {
      let newLinter = oldLinter ? "enabled" : "disabled";
      config.update("editor.linter.behavior", newLinter);
      config.update("editor.linter", undefined, vscode.ConfigurationTarget.Global);
      config.update("editor.linter", undefined, vscode.ConfigurationTarget.Workspace);
    }
  }

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

  let linterBehavior = config.get("editor.linter.behavior");
  if (linterBehavior === String(linterBehavior)) { // proteção: só entra se behavior for um Object (evitar bug que pega informacao de editor.linter)
    if (isNewSettings("linter", "behavior", linterBehavior)) {
      settings.push({
        scope: "linter",
        key: "behavior",
        value: String(linterBehavior)
      });
    }
  }

  const includes: string = (ServersConfig.getIncludes(true, ServersConfig.getCurrentServer()) || []).join(";");
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
    setNeedRestart(true);
  }

  const indexCache: string = config.get("editor.index.cache");
  if (isNewSettings("editor", "index.cache", indexCache)) {
    settings.push({
      scope: "editor",
      key: "indexCache",
      value: indexCache
    });
    setNeedRestart(true);
  }

  const codeLens = config.get("editor.codeLens");
  if (isNewSettings("editor", "codeLens", codeLens)) {
    settings.push({
      scope: "editor",
      key: "codeLens",
      value: String(codeLens)
    });
    setNeedRestart(true);
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

  const formattingProvider = config.get("formatter.provider", "ls");
  if (isNewSettings("formatter", "provider", formattingProvider)) {
    settings.push({
      scope: "formatter",
      key: "provider",
      value: String(formattingProvider)
    });
    // NÃO chamar setNeedRestart — o LS faz register/unregister dinâmico de textDocument/formatting
  }

  const formatterKeysMap: Record<string, Record<string, any>> = getFormatterKeysFromPackage();
  Object.entries(formatterKeysMap).forEach(([language, values]) => {
    const formatterConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(`${language}.formatter`);

    Object.entries(values).forEach(([key, defaultValue]) => {
      const value: any = formatterConfig.get(key, defaultValue);

      if (isNewSettings("formatter", `${language}.${key}`, value)) {
        settings.push({
          scope: "formatter",
          key: `${language}.${key}`,
          value: `${value}`
        });
      }
    });
  });

  if (settings.length > 0) {
    let ext = vscode.extensions.getExtension("TOTVS.tds-vscode");
    const version: string = ext.packageJSON["version"];
    if (isNewSettings("extension", "tdsversion", version)) {
      settings.push({
        scope: "extension",
        key: "tdsversion",
        value: version
      });
    }
  }

  return settings;
}

export async function warningNeedRestart(): Promise<boolean> {
  if (_needRestart) {
    if (!_waitRestart) {
      const message: string = "To make the change effective, it is necessary to restart TOTVS LS Server. Wait a moment.";
      vscode.window.showInformationMessage(message);
      languageClient.outputChannel.appendLine(message);
      languageClient.outputChannel.show(true);

      // Sleep para dar tempo ao LS processar antes de reiniciar
      await new Promise(resolve => setTimeout(resolve, 5000));

      //needRestart = false;
      _waitRestart = true;
    }
  }

  return _needRestart;
}

