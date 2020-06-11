import * as vscode from "vscode";
import { DocumentFormatting } from "./documentFormatting";
import { FourglFormattingRules } from "./fourglFormattingRules";
import { parser } from "../parser";

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
    const result: vscode.TextEdit[] = [];

    try {
      const line: vscode.TextLine = document.lineAt(position.line - 1);
      const ast = parser(document.languageId, line.text + "\n");

      ast.forEach((element: any) => {
        element.forEach((token: any) => {
          if (token.type === "keyword") {
            const s = line.range.start;
            const oldValue = line.text.substr(token.offset, token.value.length);

            const r = new vscode.Range(
              s.line,
              token.offset,
              s.line,
              token.offset + token.value.length
            );

            result.push(vscode.TextEdit.replace(r, token.value.toUpperCase()));
          }
        });
      });
    } catch (error) {
      console.log(error);
    }

    return Promise.resolve(result);
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    return super.provideDocumentFormattingEdits(document, options, token);
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
