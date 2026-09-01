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

  private isBlankLine(line: string): boolean {
    return line.trim() === "";
  }

  private isWrapEnabled(value: any): boolean {
    if (typeof value === "boolean") {
      return value;
    }

    return String(value).toLowerCase() === "auto";
  }

  private splitCodeAndComment(line: string): { code: string; comment: string } {
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < line.length - 1; i++) {
      const current = line[i];
      const next = line[i + 1];

      if (current === '"' && !inSingle) {
        inDouble = !inDouble;
      } else if (current === "'" && !inDouble) {
        inSingle = !inSingle;
      }

      if (!inSingle && !inDouble && current === "/" && next === "/") {
        return { code: line.substring(0, i), comment: line.substring(i) };
      }
    }

    return { code: line, comment: "" };
  }

  private normalizeConditionSpacing(code: string): string {
    return code.replace(
      /\b(if|elseif|while|for|do\s+while)\s*\(/gi,
      (match, keyword) => {
        if (keyword.toLowerCase() === "do while") {
          return "do while (";
        }

        return `${keyword} (`;
      }
    );
  }

  private normalizeCalls(code: string): string {
    // Normalizes call syntax by removing spaces between callee and opening parenthesis.
    return code.replace(/\b([a-z_][a-z0-9_]*)\s+\(/gi, (fullMatch, name) => {
      if (/^(if|elseif|while|for|function|procedure|class|return)$/i.test(name)) {
        return fullMatch;
      }

      return `${name}(`;
    });
  }

  private normalizeOperatorSpacing(code: string): string {
    let normalized = code;

    normalized = normalized
      .replace(/\s*(:=)\s*/g, " $1 ")
      .replace(/\s*(==|!=|>=|<=|<>)\s*/g, " $1 ")
      .replace(/\s*=\s*/g, " = ")
      .replace(/\s*<\s*/g, " < ")
      .replace(/\s*>\s*/g, " > ")
      .replace(/[ \t]{2,}/g, " ");

    return normalized;
  }

  private normalizeParenthesesSpacing(code: string, enabled: boolean): string {
    if (enabled) {
      return code
        .replace(/\(([^\s\)])+/g, (value) => `${value[0]} ${value.substring(1)}`)
        .replace(/([^\s\(])\)/g, (value) => `${value[0]} ${value[1]}`)
        .replace(/\(\s+\)/g, "()");
    }

    return code.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
  }

  private applyInlineSpacingOptions(line: string, options: FormattingOptions): string {
    if (this.isBlankLine(line)) {
      return "";
    }

    const split = this.splitCodeAndComment(line);
    let code = split.code;

    if ((options as any).normalizeConditionSpacing) {
      code = this.normalizeConditionSpacing(code);
    }

    if ((options as any).normalizeCalls) {
      code = this.normalizeCalls(code);
    }

    if ((options as any).spaceAfterComma) {
      code = code.replace(/,\s*/g, ", ").replace(/,\s+\)/g, ",)");
    }

    code = this.normalizeParenthesesSpacing(code, !!(options as any).spaceInsideParentheses);

    if ((options as any).operatorSpacing) {
      code = this.normalizeOperatorSpacing(code);
    }

    return `${code}${split.comment}`.trimEnd();
  }

  private splitLongLine(line: string, options: FormattingOptions): string[] {
    const maxLineLength = Number((options as any).maxLineLength || 120);
    if (line.length <= maxLineLength) {
      return [line];
    }

    const wrapParameters = this.isWrapEnabled((options as any).wrapParameters);
    const wrapArguments = this.isWrapEnabled((options as any).wrapArguments);
    if (!wrapParameters && !wrapArguments) {
      return [line];
    }

    const split = this.splitCodeAndComment(line);
    const code = split.code.trimEnd();

    if (code.length <= maxLineLength) {
      return [line];
    }

    const openIndex = code.indexOf("(");
    const closeIndex = code.lastIndexOf(")");
    if (openIndex < 0 || closeIndex <= openIndex) {
      return [line];
    }

    const body = code.substring(openIndex + 1, closeIndex);
    if (!body.includes(",")) {
      return [line];
    }

    const items = body
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (items.length < 2) {
      return [line];
    }

    const baseIndent = (line.match(/^\s*/) || [""])[0];
    const continuationIndent = options.insertSpaces
      ? " ".repeat(options.tabSize || 4)
      : "\t";
    const itemIndent = `${baseIndent}${continuationIndent}`;

    const start = code.substring(0, openIndex + 1).trimEnd();
    const end = code.substring(closeIndex + 1).trim();
    const wrapped: string[] = [start];

    for (let i = 0; i < items.length; i++) {
      const suffix = i < items.length - 1 ? "," : "";
      wrapped.push(`${itemIndent}${items[i]}${suffix}`);
    }

    let closeLine = `${baseIndent})`;
    if (end.length > 0) {
      closeLine += ` ${end}`;
    }
    if (split.comment.length > 0) {
      closeLine += ` ${split.comment}`;
    }

    wrapped.push(closeLine.trimEnd());
    return wrapped;
  }

  private isTopLevelDeclaration(line: string): boolean {
    const trimmed = line.trim();
    if (trimmed !== line) {
      return false;
    }

    return /^(static\s+)?(user\s+function|function|procedure|class)\b/i.test(trimmed);
  }

  private normalizeDeclarationSpacing(lines: string[], options: FormattingOptions): string[] {
    const target = Number((options as any).blankLinesBetweenTopLevelDeclarations ?? 1);
    const expected = target < 0 ? 0 : target;
    const output: string[] = [];

    for (const line of lines) {
      if (this.isTopLevelDeclaration(line)) {
        let blankCount = 0;
        let index = output.length - 1;
        while (index >= 0 && this.isBlankLine(output[index])) {
          blankCount++;
          index--;
        }

        if (index >= 0) {
          while (blankCount > expected) {
            output.pop();
            blankCount--;
          }
          while (blankCount < expected) {
            output.push("");
            blankCount++;
          }
        }
      }

      output.push(line);
    }

    return output;
  }

  private normalizeConsecutiveBlankLines(
    lines: string[],
    options: FormattingOptions
  ): string[] {
    const target = Number((options as any).maxConsecutiveBlankLines ?? 1);
    const maxConsecutive = target < 0 ? 0 : target;
    const output: string[] = [];
    let blankCount = 0;

    for (const line of lines) {
      if (this.isBlankLine(line)) {
        blankCount++;
        if (blankCount <= maxConsecutive) {
          output.push("");
        }
      } else {
        blankCount = 0;
        output.push(line);
      }
    }

    return output;
  }

  private parseAssignmentForAlignment(line: string): {
    left: string;
    operator: string;
    right: string;
  } | null {
    if (this.isBlankLine(line)) {
      return null;
    }

    const split = this.splitCodeAndComment(line);
    const code = split.code;
    const match = code.match(/^(\s*)([^=:\n][^\n]*?)\s*(?::=|=)\s*(.*?)\s*$/);

    if (!match) {
      return null;
    }

    const operatorMatch = code.match(/:=|=/);
    if (!operatorMatch) {
      return null;
    }

    const leading = match[1] ?? "";
    const left = `${leading}${(match[2] ?? "").trim()}`;
    const operator = operatorMatch[0];
    const right = (match[3] ?? "").trim();

    // Ignore comparisons and control-flow lines.
    if (/[<>!]=/.test(code) || /\b(if|elseif|while|for)\b/i.test(left.trim())) {
      return null;
    }

    return { left, operator, right };
  }

  private alignAssignmentFields(lines: string[]): string[] {
    const output = [...lines];
    let blockStart = -1;
    let maxLeft = 0;

    const flushBlock = (endIndex: number) => {
      if (blockStart < 0 || endIndex - blockStart < 2) {
        blockStart = -1;
        maxLeft = 0;
        return;
      }

      for (let i = blockStart; i < endIndex; i++) {
        const parsed = this.parseAssignmentForAlignment(output[i]);
        if (!parsed) {
          continue;
        }

        const paddedLeft = parsed.left.padEnd(maxLeft, " ");
        output[i] = `${paddedLeft} ${parsed.operator} ${parsed.right}`.trimEnd();
      }

      blockStart = -1;
      maxLeft = 0;
    };

    for (let i = 0; i <= output.length; i++) {
      const line = i < output.length ? output[i] : "";
      const parsed = i < output.length ? this.parseAssignmentForAlignment(line) : null;

      if (!parsed) {
        flushBlock(i);
        continue;
      }

      if (blockStart < 0) {
        blockStart = i;
        maxLeft = parsed.left.length;
      } else {
        maxLeft = Math.max(maxLeft, parsed.left.length);
      }
    }

    return output;
  }

  private applyOptionRules(lines: string[], options: FormattingOptions): string[] {
    const transformedLines: string[] = [];

    for (const line of lines) {
      const normalized = this.applyInlineSpacingOptions(line, options);
      const splitLines = this.splitLongLine(normalized, options);

      splitLines.forEach((value) => transformedLines.push(value));
    }

    const declarationSpacing = this.normalizeDeclarationSpacing(
      transformedLines,
      options
    );
    const normalizedBlanks = this.normalizeConsecutiveBlankLines(
      declarationSpacing,
      options
    );

    // if ((options as any).alignFields) {
    //   return this.alignAssignmentFields(normalizedBlanks);
    // }

    return normalizedBlanks;
  }

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

    const formattedLines: string[] = [];
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
          } else if (this.ignore_at) {
            continue;
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
          formattedLines.push(newLine);
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
          formattedLines.push(newLine);
          this.lineContinue = newLine.endsWith(";");
        } else {
          formattedLines.push(line.text.trimRight());
        }
      }

      if (formattedLines.length <= nl) {
        formattedLines.push(line.text.trimRight());
      }
    }

    const result: TextEdit[] = [];
    const finalLines = this.applyOptionRules(formattedLines, options);
    const limit = Math.min(finalLines.length, lc);

    for (let i = 0; i < limit; i++) {
      const current = document.lineAt(i).text.trimRight();
      if (current !== finalLines[i]) {
        result.push(TextEdit.replace(document.lineAt(i).range, finalLines[i]));
      }
    }

    if (finalLines.length > lc) {
      const appendContent = `\n${finalLines.slice(lc).join("\n")}`;
      const endPosition = document.lineAt(lc - 1).range.end;
      result.push(TextEdit.insert(endPosition, appendContent));
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
        title: "Formatting",
        cancellable: true,
      },
      (progress, token) => {
        let lineCount = 0;

        token.onCancellationRequested(() => {
          vscode.window.showWarningMessage("Resource formatting canceled.");
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
                    (value: boolean) => { },
                    (reason) => {
                      vscode.window.showErrorMessage(
                        `Formatting error: ${reason}`
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
      `Formatting finished. ${lc} lines have been processed in ${targetResources.length} files.`
    );
  }
}
