import * as vscode from "vscode";
import {
  DocumentFormattingEditProvider,
  TextDocument,
  FormattingOptions,
  CancellationToken,
  ProviderResult,
  TextEdit,
} from "vscode";
import { RulesFormatting, RuleMatch } from "./formattingRules";
import { getFormattingOptions } from "./formattingOptions";

export class DocumentFormatting implements DocumentFormattingEditProvider {
  private rulesFormatting: RulesFormatting;

  private lineContinue: boolean = false;
  private ignore_at: string | null = null;

  constructor(RulesFormatting: RulesFormatting) {
    this.rulesFormatting = RulesFormatting;
  }

  protected applyFormattingEdits(
    document: TextDocument,
    options: FormattingOptions,
    token: CancellationToken
  ): TextEdit[] {
    options = { ...options, ...getFormattingOptions(document.languageId) };

    let rules: RulesFormatting = this.rulesFormatting;
    const tab: string = options.insertSpaces
      ? " ".repeat(options.tabSize)
      : "\t";
    let identBlock: string = "";
    let cont: number = 0;

    let result: TextEdit[] = [];
    const lc = document.lineCount;
    this.ignore_at = null;

    for (let nl = 0; nl < lc; nl++) {
      const line = document.lineAt(nl);

      if (!line.isEmptyOrWhitespace && rules.match(line.text)) {
        let ruleMatch: RuleMatch | null = rules.getLastMatch();

        if (ruleMatch) {
          const rule = ruleMatch.rule;

          if (rule.id === this.ignore_at) {
            this.ignore_at = null;
          }

          if (rule.ignore_at) {
            this.ignore_at = rule.ignore_at;
          }

          if (!rule.increment && !rule.decrement && !rule.reset) {
            continue;
          }

          if (rule.reset) {
            cont = 0;
            identBlock = "";
          }

          if (rule.decrement) {
            cont = cont < 1 ? 0 : cont - 1;
            identBlock = tab.repeat(cont);
          }

          const newLine: string = line.text
            .replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : ""))
            .trimRight();
          result.push(TextEdit.replace(line.range, newLine));
          this.lineContinue = newLine.endsWith(";");

          if (rule.increment) {
            cont++;
            identBlock = tab.repeat(cont);
          }

          if (rule.subrules) {
            rules = rule.subrules;
            if (rules.getRules().length === 0) {
              rules = this.rulesFormatting;
            }
          }
        }
      } else {
        if (!this.ignore_at) {
          let newLine: string = "";
          if (!line.isEmptyOrWhitespace) {
            newLine = line.text
              .replace(/(\s*)?/, identBlock + (this.lineContinue ? tab : ""))
              .trimRight();
          }

          const regExpResult = newLine.match(/^(\s+)(return)/i);
          if (regExpResult) {
            const ws = regExpResult[1];
            if (ws === tab) {
              newLine = newLine.trim();
            }
          }
          result.push(TextEdit.replace(line.range, newLine));
          this.lineContinue = newLine.endsWith(";");
        }
      }
    }

    return result;
  }

  provideDocumentFormattingEdits(
    document: TextDocument,
    options: FormattingOptions,
    token: CancellationToken
  ): ProviderResult<TextEdit[]> {
    const result = this.applyFormattingEdits(document, options, token);

    return result;
  }
}

export async function resourceFormatting(
  resources: string[],
  documentFormatting: DocumentFormatting
) {
  const targetResources: string[] = resources;

  if (targetResources.length === 0) {
    vscode.window.showInformationMessage("Nenhum recurso localizado.");
  } else {
    vscode.window.showInformationMessage("Formatação em lote iniciada.");

    let lc = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Formatação",
        cancellable: true,
      },
      (progress, token) => {
        let lineCount = 0;

        token.onCancellationRequested(() => {
          vscode.window.showWarningMessage("Formatação de recursos cancelada.");
        });
        const total = targetResources.length;
        const increment: number = 100 / total;

        targetResources.forEach((resource: string, index) => {
          const uri: vscode.Uri = vscode.Uri.file(resource);

          vscode.workspace
            .openTextDocument(uri)
            .then(async (document: TextDocument) => {
              if (document.languageId !== "") {
                lineCount += document.lineCount;

                const options: FormattingOptions = getFormattingOptions(
                  document.languageId
                );
                const providerResult: ProviderResult<
                  TextEdit[]
                > = documentFormatting.provideDocumentFormattingEdits(
                  document,
                  options,
                  token
                );
                if (Array.isArray(providerResult)) {
                  progress.report({
                    increment: increment * index,
                    message: `${uri.toString(false)} (${index + 1}/${total})`,
                  });

                  const wsEdit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
                  wsEdit.set(uri, providerResult);
                  await vscode.workspace.applyEdit(wsEdit).then(
                    (value: boolean) => {},
                    (reason) => {
                      vscode.window.showErrorMessage(
                        `Formatação(erro): ${reason}`
                      );
                      console.log(reason);
                    }
                  );
                }
              }
            });
        });

        const p = new Promise((resolve) => {
          setTimeout(() => {
            resolve(lineCount);
          }, 5000);
        });

        return p;
      }
    );
    vscode.window.showInformationMessage(
      `Formatação finalizada. Foram processadas ${lc} linhas em ${targetResources.length} arquivos.`
    );
  }
}
