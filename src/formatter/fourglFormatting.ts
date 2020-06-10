import * as vscode from "vscode";
import { DocumentFormatting } from "./documentFormatting";
import { FourglFormattingRules } from "./fourglFormattingRules";

class FourglFormatting extends DocumentFormatting
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
    throw new Error("Method not implemented.");
  }

  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const line: vscode.TextLine = document.lineAt(position.line - 1);
    const text: string = line.text.toLowerCase();
    const range = line.range;
    const result: vscode.TextEdit[] = [];

    result.push(vscode.TextEdit.replace(range, text));
    result.push(vscode.TextEdit.insert(range.start, "XXXXXXXXX"));

    return Promise.resolve(result);
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return super.provideDocumentFormattingEdits(document,options,token);
  }
}

export function register(selector: vscode.DocumentSelector): vscode.Disposable {
  const provider = new FourglFormatting(new FourglFormattingRules());

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

