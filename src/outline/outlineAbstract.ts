import * as vscode from "vscode";

export interface ISymbolRule {
  kind: vscode.SymbolKind;
  searchExp: RegExp;
  group: number;
}

export abstract class OutlineAbstractDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider {
  private format(expMatch: RegExpMatchArray, group: number): string {
    return (group > expMatch.length - 1
      ? expMatch[group - 1]
      : expMatch[group]
    ).trim();
  }

  public provideDocumentSymbols(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    return new Promise((resolve) => {
      const symbols: vscode.DocumentSymbol[] = [];
      const nodes = [symbols];

      nodes[nodes.length - 1].push(...this.doProcessDocument(document));

      resolve(symbols);
    });
  }

  protected doProcessDocument(document: vscode.TextDocument) {
    const nodes = [];
    const additionalNode = this.getAdditionalNode();
    const additionalRules = this.getAdditionalRules();
    const symbolRules = this.getSymbolRules();

    if (additionalNode !== null) {
      nodes.push(additionalNode);
    }

    for (let i = 0; i < document.lineCount; i++) {
      const line: vscode.TextLine = document.lineAt(i);
      if (line.text.length === 0) {
        continue;
      }

      if (additionalRules.length > 0) {
        const children: vscode.DocumentSymbol[] = this.doProcessRules(
          line,
          additionalRules
        );
        if (additionalNode !== null) {
          additionalNode.children.push(...children);
        } else {
          nodes.push(...children);
        }
      }

      nodes.push(...this.doProcessRules(line, symbolRules));
    }

    return nodes;
  }

  protected doProcessRules(
    line: vscode.TextLine,
    symbolRules: ISymbolRule[]
  ): vscode.DocumentSymbol[] {
    const nodes = [];

    for (let j = 0; j < symbolRules.length; j++) {
      const element = symbolRules[j];
      const result: RegExpMatchArray = line.text.match(element.searchExp);

      if (result) {
        const marker_symbol = new vscode.DocumentSymbol(
          this.format(result, element.group),
          "",
          element.kind,
          line.range,
          line.range
        );

        nodes.push(marker_symbol);
        break;
      }
    }

    return nodes;
  }

  protected getAdditionalRules(): ISymbolRule[] {
    return [];
  }

  protected getAdditionalNode(): vscode.DocumentSymbol | null {
    return null;
  }

  abstract getSymbolRules(): ISymbolRule[];
}
