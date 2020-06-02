import * as vscode from "vscode";
import { OutlineAbstractDocumentSymbolProvider, ISymbolRule } from "./outlineAbstract";

const symbolRules: ISymbolRule[] = [
  { kind: vscode.SymbolKind.Function, searchExp: /^(function)\s+(\w+)/i, group: 2 },
  { kind: vscode.SymbolKind.Function, searchExp: /^(report)\s+(\w+)/i, group: 2 },
  { kind: vscode.SymbolKind.Function, searchExp: /^(main)/i, group: 1 },
  { kind: vscode.SymbolKind.Function, searchExp: /^(globals)/i, group: 1 },
]

export class Outline4GlDocumentSymbolProvider extends OutlineAbstractDocumentSymbolProvider {

  getSymbolRules(): ISymbolRule[] {
    return symbolRules;
  }
}
