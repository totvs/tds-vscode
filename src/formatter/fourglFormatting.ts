import * as vscode from 'vscode';
import { DocumentFormatting } from './documentFormatting';
import { FourglFormattingRules } from './fourglFormattingRules';
import { parser, Token4GlType } from '../parser';
import { isArray } from 'util';

class FourglFormatting
  extends DocumentFormatting
  implements
    vscode.DocumentRangeFormattingEditProvider,
    vscode.OnTypeFormattingEditProvider,
    vscode.DocumentFormattingEditProvider
{
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    throw new Error('Method not implemented.');
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
      const line: vscode.TextLine = document.lineAt(position.line);
      if (line.text.trim() !== '') {
        const ast = parser(document.languageId, line.text + '\n'); //obrigatorio \n
        const nodes = this.findNodes(Token4GlType.keyword, ast);

        nodes.forEach((token: any) => {
          if (token.type === Token4GlType.keyword) {
            const s = line.range.start;
            const offset = token.location.start.offset;

            const r = new vscode.Range(
              s.line,
              offset,
              s.line,
              token.location.end.offset
            );

            result.push(vscode.TextEdit.replace(r, token.value.toUpperCase()));
          }
        });
      }
    } catch (error) {
      console.error(error);
    }

    return Promise.resolve(result);
  }

  private findNodes(target: Token4GlType, node: any): any[] {
    let result: any[] = [];

    if (node === undefined || node === null) {
      //ignorar
    } else if (isArray(node)) {
      node.forEach((element: any) => {
        result = result.concat(this.findNodes(target, element));
      });
    } else if (node.type === target) {
      result.push(node);
    } else if (isArray(node.value)) {
      result = result.concat(this.findNodes(target, node.value));
    }

    return result;
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
      ' '
    ),
    vscode.languages.registerDocumentRangeFormattingEditProvider(
      selector,
      provider
    ),
    vscode.languages.registerDocumentFormattingEditProvider(selector, provider)
  );
}
