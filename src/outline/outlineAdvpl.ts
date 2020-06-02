import * as vscode from "vscode";
import { OutlineAbstractDocumentSymbolProvider, ISymbolRule } from "./outlineAbstract";

const symbolRules: ISymbolRule[] = [
  { kind: vscode.SymbolKind.Function, searchExp: /^(function)\s+(\w+)/i, group: 2 },
  { kind: vscode.SymbolKind.Function, searchExp: /^(\w+)?\s+(function)\s+(\w+)/i, group: 3 },
  { kind: vscode.SymbolKind.Class, searchExp: /^class (\w+)/i, group: 1 },
  { kind: vscode.SymbolKind.Variable, searchExp: /^static (\w+)/i, group: 1 },
]

export class OutlineAdvplDocumentSymbolProvider extends OutlineAbstractDocumentSymbolProvider {

  getSymbolRules(): ISymbolRule[] {
    return symbolRules;
  }
}