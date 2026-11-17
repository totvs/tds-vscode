import * as vscode from "vscode";
import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpRegistrar, MCP_SERVER_NAME } from "../mcpTypes";
import { isTotvsSourceUri, notTotvsSourceMessage, resolveTargetUri, toWorkspaceRelativePath } from "../mcpUtils";
import { mcpLog } from "../mcpLogger";

const DEFAULT_MAX_DIAGNOSTICS = 10;

type FixOutcome = "applied" | "skipped" | "no-fix" | "failed";

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

/**
 * Pergunta ao usuário qual correção aplicar.
 * Usa elicitação do MCP quando o cliente suporta; caso contrário (ou se falhar), usa um QuickPick do VS Code.
 * @returns Índice da opção escolhida, ou undefined se o usuário recusou/cancelou.
 */
async function askWhichFix(
	server: McpServer,
	requestId: string | number,
	diagnostic: vscode.Diagnostic,
	line: number,
	titles: string[]
): Promise<number | undefined> {
	const labels = titles.map((t, i) => `${i + 1}. ${t}`);
	const message = `Linha ${line}: ${diagnostic.message}\nExistem ${titles.length} correções possíveis. Qual deve ser aplicada?`;

	if (server.server.getClientCapabilities()?.elicitation) {
		try {
			const result = await server.server.elicitInput(
				{
					mode: "form",
					message,
					requestedSchema: {
						type: "object",
						properties: {
							option: { type: "string", title: "Correção", description: "Correção a aplicar", enum: labels }
						},
						required: ["option"]
					}
				},
				{ relatedRequestId: requestId }
			);

			if (result.action !== "accept") {
				return undefined;
			}
			const index = labels.indexOf(String(result.content?.option));
			return index >= 0 ? index : undefined;
		} catch (e) {
			mcpLog.warn("Asking through the MCP client did not work; using the VS Code window");
			mcpLog.debug("tds_fix: elicitation failed, using QuickPick", e instanceof Error ? e.message : String(e));
		}
	}

	const picked = await vscode.window.showQuickPick(
		labels.map((label, i) => ({ label, index: i })),
		{ title: MCP_SERVER_NAME, placeHolder: message.replace(/\n/g, " — "), ignoreFocusOut: true }
	);
	return picked?.index;
}

/** Aplica uma code action (edição e/ou comando). */
async function applyFix(action: vscode.CodeAction): Promise<void> {
	if (action.edit) {
		const ok = await vscode.workspace.applyEdit(action.edit);
		if (!ok) {
			throw new Error("O VS Code não conseguiu aplicar a edição.");
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
				"When a problem has more than one possible fix, the user is asked which one to apply. " +
				"Use when the user asks to fix, correct or resolve the problems of a source. " +
				"WARNING: modifies the file (left unsaved in the editor). With apply=false only lists the available fixes. " +
				"If 'file' is omitted, uses the active editor.",
			inputSchema: {
				file: z.string().optional().describe("Source path (absolute, relative to the workspace) or file URI. Default: active editor"),
				line: z.number().int().positive().optional().describe("Only fix the problems of this line (1-based)"),
				only: z.enum(["all", "error", "warning"]).optional().describe("Severity filter (default: all)"),
				apply: z.boolean().optional().describe("Apply the fixes (default: true). When false, only lists the available fixes"),
				max: z.number().int().positive().optional().describe(`Maximum number of problems handled (default: ${DEFAULT_MAX_DIAGNOSTICS})`)
			},
			annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false }
		},
		async ({ file, line, only, apply, max }, extra) => {
			const fail = (text: string) => ({ content: [{ type: "text" as const, text }], isError: true });

			const uri: vscode.Uri | undefined = resolveTargetUri(file || "current");
			if (!uri) {
				return fail("Nenhum fonte informado e nenhum editor ativo.");
			}
			if (!isTotvsSourceUri(uri)) {
				return { content: [{ type: "text" as const, text: notTotvsSourceMessage(uri) }] };
			}

			const document = await vscode.workspace.openTextDocument(uri);
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
				return {
					content: [{ type: "text" as const, text: `Nenhum problema encontrado em ${relativePath}. Compile/verifique a sintaxe antes (tds_syntax_only) para atualizar os diagnósticos.` }]
				};
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
					const fixes = await getQuickFixes(uri, diagnostic);
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
						const index = await askWhichFix(server, extra.requestId, diagnostic, diagLine, fixes.map((f) => f.title));
						chosen = index === undefined ? undefined : fixes[index];
					}

					if (!chosen) {
						report.outcome = "skipped";
						report.detail = "Nenhuma correção escolhida pelo usuário.";
						continue;
					}

					await applyFix(chosen);
					report.outcome = "applied";
					report.fix = chosen.title;
				} catch (e) {
					report.outcome = "failed";
					report.detail = e instanceof Error ? e.message : String(e);
				}
			}

			const applied = reports.filter((r) => r.outcome === "applied").length;
			const summary = {
				file: relativePath,
				applied,
				unsaved: applied > 0 && document.isDirty,
				note: applied > 0 ? "Fixes applied to the editor buffer; the file was not saved. Recompile to confirm." : undefined,
				problems: reports
			};

			return {
				content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }],
				isError: reports.length > 0 && reports.every((r) => r.outcome === "failed")
			};
		}
	);
};
