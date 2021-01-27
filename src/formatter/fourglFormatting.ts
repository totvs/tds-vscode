import * as vscode from "vscode";
import { DocumentFormatting } from "./documentFormatting";
import { FourglFormattingRules } from "./fourglFormattingRules";
import { format4GL } from "../parser";
import { getFormattingOptions } from "./formattingOptions";

class FourglFormatting
  extends DocumentFormatting
  implements
    vscode.DocumentRangeFormattingEditProvider,
    vscode.OnTypeFormattingEditProvider,
    vscode.DocumentFormattingEditProvider {
  private doFormat(document: vscode.TextDocument, options: any): any {
    try {
      const formatted = format4GL(
        document.languageId,
        document.getText(),
        options
      );

      return formatted;
    } catch (error) {
      const stack: string = error.stack ? error.stack : "";
      const message: string = error.message ? error.message : "";

      if (
        stack.startsWith("Error:") &&
        stack.indexOf("Normalizer.normalize") &&
        message !== ""
      ) {
        vscode.window.showErrorMessage(message);
      }

      console.error(error);

      return Promise.reject(error);
    }
  }

  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    const result: vscode.TextEdit[] = [];

    options = {
      ...getFormattingOptions(document.languageId),
      ...options,
      rangeStart: document.offsetAt(range.start),
      rangeEnd: document.offsetAt(range.end),
    };

    const formatted = this.doFormat(document, options);

    if (formatted.length > 0) {
      result.push(
        vscode.TextEdit.replace(
          range,
          formatted.substring(0, formatted.length - 1)
        )
      );
    }

    return result;
  }

  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const result: vscode.TextEdit[] = [];
    const line: vscode.TextLine = document.lineAt(position.line);

    if (line.text.trim() !== "") {
      options = {
        ...getFormattingOptions(document.languageId),
        ...options,
        rangeStart: document.offsetAt(line.range.start),
        rangeEnd: document.offsetAt(line.range.end),
        scope: ch === "\n" ? "line" : "word",
      };

      const formatted = this.doFormat(document, options);

      if (formatted.length > 0 && formatted !== line.text) {
        result.push(
          vscode.TextEdit.replace(
            line.range,
            formatted.substring(0, formatted.length - 1)
          )
        );
      }
    }

    return Promise.resolve(result);
  }

  provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    const result = super.applyFormattingEdits(document, options, token);
    options = { ...getFormattingOptions(document.languageId), ...options };

    const formatted = this.doFormat(document, options);

    if (formatted.length > 0) {
      const start = document.validatePosition(new vscode.Position(0, 0));
      const end = document.validatePosition(
        new vscode.Position(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
      );

      result.push(
        vscode.TextEdit.replace(new vscode.Range(start, end), formatted)
      );
    }

    return result;
  }
}

export function register(selector: vscode.DocumentSelector): vscode.Disposable {
  const provider = new FourglFormatting(new FourglFormattingRules());

  return vscode.Disposable.from(
    vscode.languages.registerOnTypeFormattingEditProvider(
      selector,
      provider,
      " "
    ),
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      selector,
      provider
    ),
    vscode.languages.registerDocumentFormattingEditProvider(selector, provider)
  );
}
