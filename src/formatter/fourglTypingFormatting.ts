import * as vscode from "vscode";

export class FourglTypingFormatting implements vscode.OnTypeFormattingEditProvider {
  public provideOnTypeFormattingEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    ch: string,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Thenable<vscode.TextEdit[]> {
    return new Promise<vscode.TextEdit[]>(() => {
      const line: vscode.TextLine = document.lineAt(position.line-1);
      const text: string = line.text.toLowerCase();
      const range = line.range;
      const result: vscode.TextEdit[] = [];

      result.push(vscode.TextEdit.replace(range, text));
      result.push(vscode.TextEdit.insert(range.start, "XXXXXXXXX"));

      return result;
    });
  }
}
