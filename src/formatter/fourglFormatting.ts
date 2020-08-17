import * as vscode from "vscode";
import { DocumentFormatting } from "./documentFormatting";
import { FourglFormattingRules } from "./fourglFormattingRules";
import { parser4GL, IOffsetPosition } from "../parser";

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

      if (line.text.trim() !== "") {
        const offsetPos: IOffsetPosition = {
          locStart: document.offsetAt(line.range.start),
          locEnd: document.offsetAt(line.range.end),
          //cursorOffset: document.offsetAt(line.rangeIncludingLineBreak.end)
        };

        const formatted  = parser4GL.getFormatted(document.languageId, document.getText(), offsetPos );
        result.push(vscode.TextEdit.replace(line.range, formatted));
      }
    } catch (error) {
      console.error(error);
      Promise.reject(error);
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
