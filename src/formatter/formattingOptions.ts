import * as vscode from "vscode";
import { FormattingOptions } from "vscode";

export function getFormattingOptions(langId: string): FormattingOptions {
  const getValue = (langId: string, key: string, valueDefault: any): any => {
    let cfg = vscode.workspace.getConfiguration(`${langId}.formatter`);
    let value = cfg.get(key);

    if (!value) {
      cfg = vscode.workspace.getConfiguration();
      value = cfg.get(key);
    }

    return value ? value : valueDefault;
  };

  return {
    insertSpaces: getValue(langId, "insertSpaces", false),
    tabSize: getValue(langId, "editor.tabSize", 4),
    keywordsCase: getValue(langId, "keywordsCase", "upper"),
    stringStyle: getValue(langId, "stringStyle", "ignore"),
    formatNumber: getValue(langId, "formatNumber", false),
    operatorSpacing: getValue(langId, "operatorSpacing", false),
    //alignFields: false, //EXPERIMENTAL. não habilitar.
  };
}
