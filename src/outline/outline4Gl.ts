import * as vscode from "vscode";

export class Outline4GlDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider {
  private formatFunc(cmd: string): string {
    return cmd
      .replace(/^ *function /i, "")
      .replace(/\(.*/, "")
      .trim();
  }

  private formatRep(cmd: string): string {
    return cmd
      .replace(/^ *report /i, "")
      .replace(/\(.*/, "")
      .trim();
  }

  public provideDocumentSymbols(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    return new Promise((resolve) => {
      let symbols: vscode.DocumentSymbol[] = [];
      let nodes = [symbols];

      let key = vscode.SymbolKind.Key;
      let func = vscode.SymbolKind.Function;

      for (var i = 0; i < document.lineCount; i++) {
        var line = document.lineAt(i);

        if (line.text.match(/^ *function /i)) {
          let marker_symbol = new vscode.DocumentSymbol(
            this.formatFunc(line.text),
            "",
            func,
            line.range,
            line.range
          );

          nodes[nodes.length - 1].push(marker_symbol);
        } else if (line.text.match(/^ *report /i)) {
          let marker_symbol = new vscode.DocumentSymbol(
            this.formatRep(line.text),
            "Report",
            func,
            line.range,
            line.range
          );

          nodes[nodes.length - 1].push(marker_symbol);
        } else if (line.text.startsWith("MAIN")) {
          let marker_symbol = new vscode.DocumentSymbol(
            "MAIN",
            "MAIN statement",
            func,
            line.range,
            line.range
          );

          nodes[nodes.length - 1].push(marker_symbol);
        } else if (line.text.startsWith("GLOBALS")) {
          let marker_symbol = new vscode.DocumentSymbol(
            "GLOBALS",
            "",
            key,
            line.range,
            line.range
          );

          nodes[nodes.length - 1].push(marker_symbol);
        }
      }

      resolve(symbols);
    });
  }
}
