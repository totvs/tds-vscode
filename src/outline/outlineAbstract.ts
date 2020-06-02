import * as vscode from "vscode";

export interface ISymbolRule {
  kind: vscode.SymbolKind, searchExp: RegExp, group: number
}

export abstract class OutlineAbstractDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider {

  private format(expMatch: RegExpMatchArray, group: number): string {
    return ((group > expMatch.length - 1) ? expMatch[group - 1] : expMatch[group]).trim();
  }

  public provideDocumentSymbols(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    return new Promise((resolve) => {
      let symbols: vscode.DocumentSymbol[] = [];
      let nodes = [symbols];

      for (var i = 0; i < document.lineCount; i++) {
        var line: vscode.TextLine = document.lineAt(i);

        if (line.text.length == 0) {
          continue;
        }

        const symbolsRE = this.getSymbolRules();
        for (var j = 0; j < symbolsRE.length; j++) {
          const element = symbolsRE[j];
          const result: RegExpMatchArray = line.text.match(element.searchExp);

          if (result) {
            const marker_symbol = new vscode.DocumentSymbol(
              this.format(result, element.group),
              "",
              element.kind,
              line.range,
              line.range
            );

            nodes[nodes.length - 1].push(marker_symbol);
            break;
          }
        }
      }

      resolve(symbols);
    });
  }

  abstract getSymbolRules(): ISymbolRule[];
}