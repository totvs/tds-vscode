import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { toWorkspaceRelativePath } from "../mcpUtils";
import { mcpLog, profiled, ToolProfile } from "../mcpLogger";
import { errorMessage, ok, resolveTotvsSource, textResult } from "./toolUtils";

const DEFAULT_MAX_DIAGNOSTICS = 10;

type FixOutcome = "applied" | "skipped" | "needs-choice" | "no-fix" | "failed";

type FixReport = {
	line: number;
	message: string;
	outcome: FixOutcome;
	fix?: string;
	options?: string[];
	detail?: string;
};

/**
 * Comandos de IA/chat que extensões (Copilot, Kiro etc.) expõem como "quick fix" (ex.: "Fix", "Explain").
 * Não são correções do Language Server e devem ser ignoradas.
 */
const AI_ACTION_COMMAND = /copilot|chat|inlinechat|inline-chat|editorchat|\bai\b|kiro|assistant|agent/i;

/** Indica se a ação tem edições de texto concretas (típico de um quick fix do LS). */
function hasTextEdits(action: vscode.CodeAction): boolean {
	return !!action.edit && action.edit.size > 0;
}

/** Indica se a code action veio do Language Server, e não de um assistente de IA. */
function isLanguageServerFix(action: vscode.CodeAction): boolean {
	if (hasTextEdits(action)) {
		return true;
	}
	return !!action.command && !AI_ACTION_COMMAND.test(action.command.command);
}

/** Busca os quick fixes oferecidos pelo LS (code actions) para um diagnóstico. */
async function getQuickFixes(uri: vscode.Uri, diagnostic: vscode.Diagnostic): Promise<vscode.CodeAction[]> {
	const actions = await vscode.commands.executeCommand<(vscode.CodeAction | vscode.Command)[]>(
		"vscode.executeCodeActionProvider",
		uri,
		diagnostic.range,
		vscode.CodeActionKind.QuickFix.value
	);

	const candidates = (actions ?? [])
		.filter((a): a is vscode.CodeAction => "title" in a && ("edit" in a || "command" in a))
		.filter((a) => !a.kind || vscode.CodeActionKind.QuickFix.contains(a.kind))
		.filter((a) => !a.disabled)
		// Mantém só as ações que tratam este diagnóstico (ou que não informam a qual se referem).
		.filter((a) => !a.diagnostics?.length || a.diagnostics.some((d) => d.message === diagnostic.message));

	const fixes = candidates.filter(isLanguageServerFix);

	candidates
		.filter((a) => !fixes.includes(a))
		.forEach((a) => mcpLog.debug(`tds_fix: action ignored (not from the Language Server): '${a.title}'`, a.command?.command));
	mcpLog.verbose(`Language Server fixes for line ${diagnostic.range.start.line + 1}`, fixes.map((f) => f.title));

	return fixes;
}

/** Aplica uma code action (edição e/ou comando). */
async function applyFix(action: vscode.CodeAction): Promise<void> {
	if (action.edit) {
		const applied = await vscode.workspace.applyEdit(action.edit);
		if (!applied) {
			throw new Error("VS Code could not apply the edit.");
		}
	}
	if (action.command) {
		await vscode.commands.executeCommand(action.command.command, ...(action.command.arguments ?? []));
	}
}

/**
 * Ferramenta `tds_fix`: aplica os quick fixes (code actions) do Language Server aos erros/avisos de um fonte.
 * Quando um diagnóstico possui mais de uma correção, pergunta ao usuário qual aplicar.
 */
export const registerFixTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_fix",
		{
			title: "TDS Fix",
			description:
				"Applies the quick fixes (code actions) offered by the TOTVS Language Server to the errors/warnings of an AdvPL/TLPP/4GL source. " +
				"When a problem has more than one possible fix, nothing is applied for it: the result lists the options (outcome 'needs-choice'). " +
				"In that case ask the user, in the chat, which option to apply, then call this tool again with 'line' and 'choice' (option number). " +
				"Use when the user asks to fix, correct or resolve the problems of a source. " +
				"WARNING: modifies the file (left unsaved in the editor). With apply=false only lists the available fixes. " +
				"If 'file' is omitted, uses the active editor.",
			inputSchema: {
				file: z.string().optional().describe("Source path (absolute, relative to the workspace) or file URI. Default: active editor"),
				line: z.number().int().positive().optional().describe("Only fix the problems of this line (1-based)"),
				only: z.enum(["all", "error", "warning"]).optional().describe("Severity filter (default: all)"),
				apply: z.boolean().optional().describe("Apply the fixes (default: true). When false, only lists the available fixes"),
				max: z.number().int().positive().optional().describe(`Maximum number of problems handled (default: ${DEFAULT_MAX_DIAGNOSTICS})`),
				choice: z.number().int().positive().optional().describe("Number (1-based) of the option to apply when a problem has more than one fix. Use together with 'line', after asking the user in the chat")
			},
			annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false }
		},
		(args) =>
			profiled("tds_fix", args.file || "current", async (profile: ToolProfile) => {
			const { file, line, only, apply, max, choice } = args;

			const { uri, result } = resolveTotvsSource(file);
			if (!uri) {
				return result;
			}

			const document = await profile.phase("open", () => vscode.workspace.openTextDocument(uri));
			const shouldApply = apply ?? true;
			const limit = max ?? DEFAULT_MAX_DIAGNOSTICS;
			const relativePath = toWorkspaceRelativePath(uri);

			let diagnostics = vscode.languages
				.getDiagnostics(uri)
				.filter((d) => d.severity === vscode.DiagnosticSeverity.Error || d.severity === vscode.DiagnosticSeverity.Warning)
				.filter((d) => (only === "error" ? d.severity === vscode.DiagnosticSeverity.Error : true))
				.filter((d) => (only === "warning" ? d.severity === vscode.DiagnosticSeverity.Warning : true))
				.filter((d) => (line ? d.range.start.line + 1 === line : true));

			if (diagnostics.length === 0) {
				return ok(`No problems found in ${relativePath}. Compile or check the syntax first (tds_syntax_only) to refresh the diagnostics.`);
			}

			// De baixo para cima: aplicar uma correção não desloca as posições das anteriores.
			diagnostics = diagnostics
				.sort((a, b) => b.range.start.line - a.range.start.line || b.range.start.character - a.range.start.character)
				.slice(0, limit);

			const reports: FixReport[] = [];

			for (const diagnostic of diagnostics) {
				const diagLine = diagnostic.range.start.line + 1;
				const report: FixReport = { line: diagLine, message: diagnostic.message.replace(/\s+/g, " ").trim(), outcome: "no-fix" };
				reports.push(report);

				try {
					const fixes = await profile.phase("quickFixes", () => getQuickFixes(uri, diagnostic));
					report.options = fixes.map((f) => f.title);

					if (fixes.length === 0) {
						continue;
					}
					if (!shouldApply) {
						report.outcome = "skipped";
						report.detail = "apply=false";
						continue;
					}

					let chosen: vscode.CodeAction | undefined = fixes[0];
					if (fixes.length > 1) {
						// A escolha é feita no chat: a ferramenta devolve as opções e o modelo pergunta ao usuário.
						if (choice === undefined) {
							report.outcome = "needs-choice";
							report.detail = "More than one fix is available. Ask the user which option to apply and call tds_fix again with this line and 'choice'.";
							continue;
						}
						if (choice > fixes.length) {
							report.outcome = "failed";
							report.detail = `Invalid choice ${choice}. Valid options: 1 to ${fixes.length}.`;
							continue;
						}
						chosen = fixes[choice - 1];
					}

					await profile.phase("apply", () => applyFix(chosen));
					report.outcome = "applied";
					report.fix = chosen.title;
				} catch (e) {
					report.outcome = "failed";
					report.detail = errorMessage(e);
				}
			}

			const applied = reports.filter((r) => r.outcome === "applied").length;
			const pending = reports.filter((r) => r.outcome === "needs-choice");
			const notes: string[] = [];
			if (applied > 0) {
				notes.push("Fixes applied to the editor buffer; the file was not saved. Recompile to confirm.");
			}
			if (pending.length > 0) {
				notes.push(`Lines ${pending.map((r) => r.line).join(", ")} have more than one fix. Ask the user which option to apply (see 'options') and call tds_fix again with 'line' and 'choice' (1-based option number).`);
			}
			const summary = {
				file: relativePath,
				applied,
				unsaved: applied > 0 && document.isDirty,
				note: notes.length > 0 ? notes.join(" ") : undefined,
				problems: reports
			};

			return textResult(
				JSON.stringify(summary, null, 2),
				reports.length > 0 && reports.every((r) => r.outcome === "failed")
			);
		})
	);
};
