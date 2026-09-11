import * as vscode from "vscode";
import { DocumentFormatting } from "./documentFormatting";
import { AdvplFormattingRules } from "./advplFormattingRules";

class AdvplFormatting extends DocumentFormatting
  implements
    vscode.DocumentRangeFormattingEditProvider,
    vscode.OnTypeFormattingEditProvider,
    vscode.DocumentFormattingEditProvider {
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return [];
  }

  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    return Promise.resolve([]);
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return super.provideDocumentFormattingEdits(document, options, token);
  }
}

export function register(selector: vscode.DocumentSelector) {
  const provider = new AdvplFormatting(new AdvplFormattingRules());

  return vscode.Disposable.from(
    vscode.languages.registerOnTypeFormattingEditProvider(
      selector,
      provider,
      "\n"
    ),
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      selector,
      provider
    ),
    vscode.languages.registerDocumentFormattingEditProvider(selector, provider)
  );
}
