import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { handleCompilerCommand } from "../../chat/handleCompileCommands";
import { DEFAULT_FLAG_OPTIONS, FlagOptions, resolveTarget } from "../../chat/chatUtils";

/**
 * Ferramenta `tds_compile`: compila (ou apenas verifica a sintaxe de) um fonte.
 * Reaproveita o mesmo fluxo da ferramenta de chat `@tds /compiler`.
 * Sem `target`, usa o fonte do editor ativo (contexto atual).
 */
export const registerCompileTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_compile",
		{
			title: "TDS Compile",
			description:
				"Compila o fonte AdvPL/TLPP/4GL informado e retorna os erros/avisos (Problems). " +
				"Se 'target' for omitido, usa o fonte do editor ativo. " +
				"Aceita também 'open-editors', 'workspace', ou caminho de arquivo/pasta (relativo ao workspace ou absoluto).",
			inputSchema: {
				target: z.string().optional().describe("Alvo: 'current' (padrão), 'open-editors', 'workspace' ou caminho de arquivo/pasta"),
				syntaxOnly: z.boolean().optional().describe("Somente verificar sintaxe (linter), sem gerar código no RPO"),
				only: z.enum(["all", "error", "warning"]).optional().describe("Filtro de severidade"),
				sort: z.enum(["none", "file", "severity"]).optional().describe("Ordenação do resultado"),
				max: z.number().int().positive().optional().describe("Máximo de diagnósticos retornados"),
				format: z.enum(["markdown", "json"]).optional().describe("Formato do resultado")
			}
		},
		async ({ target, syntaxOnly, only, sort, max, format }, extra) => {
			const flags: FlagOptions = {
				...structuredClone(DEFAULT_FLAG_OPTIONS),
				...(syntaxOnly !== undefined && { syntaxOnly }),
				...(only && { only }),
				...(sort && { sort }),
				...(max && { max }),
				...(format && { format })
			};

			const cancellation = new vscode.CancellationTokenSource();
			const onAbort = () => cancellation.cancel();
			extra?.signal?.addEventListener("abort", onAbort);

			try {
				const isError = { value: false };
				const resolvedTarget: string = resolveTarget(target);
				const output: string[] = await handleCompilerCommand(resolvedTarget, flags, cancellation.token, isError);

				return {
					content: [{ type: "text" as const, text: output.join("\n") }],
					isError: isError.value
				};
			} catch (e) {
				return {
					content: [{ type: "text" as const, text: `Falha ao compilar: ${e instanceof Error ? e.message : String(e)}` }],
					isError: true
				};
			} finally {
				extra?.signal?.removeEventListener("abort", onAbort);
				cancellation.dispose();
			}
		}
	);
};
