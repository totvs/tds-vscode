import * as vscode from "vscode";
import {
  OutlineAbstractDocumentSymbolProvider,
  ISymbolRule,
} from "./outlineAbstract";

const symbolRules: ISymbolRule[] = [
  {
    kind: vscode.SymbolKind.Function,
    searchExp: /^(function)\s+(\w+)/i,
    group: 2,
  },
  {
    kind: vscode.SymbolKind.Function,
    searchExp: /^(\w+)?\s+(function)\s+(\w+)/i,
    group: 3,
  },
  { kind: vscode.SymbolKind.Class, searchExp: /^class (\w+)/i, group: 1 },
  { kind: vscode.SymbolKind.Variable, searchExp: /^static (\w+)/i, group: 1 },
];

const includeRules: ISymbolRule[] = [
  {
    kind: vscode.SymbolKind.File,
    searchExp: /^(#include)\s+"(.+)"/i,
    group: 2,
  },
];

class OutlineAdvplDocumentSymbolProvider extends OutlineAbstractDocumentSymbolProvider {

  getSymbolRules(): ISymbolRule[] {
    return symbolRules;
  }

  getAdditionalRules(): ISymbolRule[] {
    return includeRules;
  }

  getAdditionalNode(): vscode.DocumentSymbol | null {
    return new vscode.DocumentSymbol(
      "includes",
      "",
      vscode.SymbolKind.File,
      new vscode.Range(0,0,0,0) ,
      new vscode.Range(0,0,0,0)
    );
  }
}

export function register(selector: vscode.DocumentSelector) {
  const provider = new OutlineAdvplDocumentSymbolProvider();

  return vscode.Disposable.from(
    vscode.languages.registerDocumentSymbolProvider(
      selector,
      provider
    ),
  );
}
