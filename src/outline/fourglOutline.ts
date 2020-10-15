import * as vscode from "vscode";
import {
  OutlineAbstractDocumentSymbolProvider,
  ISymbolRule,
} from "./outlineAbstract";

const symbolRules: ISymbolRule[] = [
  {
    kind: vscode.SymbolKind.Function,
    searchExp: /^(\s*)(function)\s+(\w+)/i,
    group: 3,
  },
  {
    kind: vscode.SymbolKind.Function,
    searchExp: /^(\s*)(report)\s+(\w+)/i,
    group: 3,
  },
  { kind: vscode.SymbolKind.Function, searchExp: /^(\s*)(main)/i, group: 2 },
  { kind: vscode.SymbolKind.Function, searchExp: /^(\s*)(globals)/i, group: 2 },
];

class Outline4GlDocumentSymbolProvider extends OutlineAbstractDocumentSymbolProvider {
  getSymbolRules(): ISymbolRule[] {
    return symbolRules;
  }
}

export function register(selector: vscode.DocumentSelector) {
  const provider = new Outline4GlDocumentSymbolProvider();

  return vscode.Disposable.from(
    vscode.languages.registerDocumentSymbolProvider(selector, provider)
  );
}
