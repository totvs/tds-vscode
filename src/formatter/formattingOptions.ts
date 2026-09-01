import * as vscode from "vscode";
import { FormattingOptions } from "vscode";

export function getFormattingOptions(langId: string): FormattingOptions {
  const getValue = (langId: string, key: string, valueDefault: any): any => {
    let cfg = vscode.workspace.getConfiguration(`${langId}.formatter`);
    let value = cfg.get(key);

    if (value === undefined) {
      cfg = vscode.workspace.getConfiguration();
      value = cfg.get(key);
    }

    return value === undefined ? valueDefault : value;
  };

  return {
    keywordsCase: getValue(langId, "keywordsCase", "upper"),
    insertSpaces: getValue(langId, "insertSpaces", false),
    tabSize: getValue(langId, "editor.tabSize", 4),
    stringStyle: getValue(langId, "stringStyle", "ignore"),
    maxConsecutiveBlankLines: getValue(langId, "maxConsecutiveBlankLines", 1),
    maxLineLength: getValue(langId, "maxLineLength", 120),
    wrapParameters: getValue(langId, "wrapParameters", "auto"),
    wrapArguments: getValue(langId, "wrapArguments", "auto"),
    formatNumber: getValue(langId, "formatNumber", false),
    operatorSpacing: getValue(langId, "operatorSpacing", true),
    spaceAfterComma: getValue(langId, "spaceAfterComma", true),
    spaceInsideParentheses: getValue(langId, "spaceInsideParentheses", false),
    alignAssignments: getValue(langId, "alignAssignments", false),
    normalizeConditionSpacing: getValue(langId, "normalizeConditionSpacing", true),
    normalizeCalls: getValue(langId, "normalizeCalls", false),
    preserveSingleLineBlocks: getValue(langId, "preserveSingleLineBlocks", false),
    blankLinesBetweenTopLevelDeclarations: getValue(
      langId,
      "blankLinesBetweenTopLevelDeclarations",
      1
    ),
    commentReflow: getValue(langId, "commentReflow", false),
    trimFinalNewlines: getValue(langId, "trimFinalNewlines", true),
    trimTrailingWhitespace: getValue(langId, "trimTrailingWhitespace", true)
  };
}
