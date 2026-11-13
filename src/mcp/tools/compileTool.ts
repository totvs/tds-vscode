import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { handleCompilerCommand } from "../handleCompileCommands";
import { DEFAULT_FLAG_OPTIONS, FlagOptions, resolveTarget } from "../chatUtils";

type CompileArgs = {
	target?: string;
	syntaxOnly?: boolean;
	only?: "all" | "error" | "warning";
	sort?: "none" | "file" | "severity";
	max?: number;
	format?: "markdown" | "json";
};

/**
 * Executa o fluxo de compilação do chat (`@tds /compiler`) e converte o resultado para MCP.
 * Sem `target`, usa o fonte do editor ativo (contexto atual).
 */
async function runCompile(args: CompileArgs, signal?: AbortSignal) {
	const { target, syntaxOnly, only, sort, max, format } = args;
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
	signal?.addEventListener("abort", onAbort);

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
		signal?.removeEventListener("abort", onAbort);
		cancellation.dispose();
	}
}

const targetSchema = z.string().optional().describe("Alvo: 'current' (padrão), 'open-editors', 'workspace' ou caminho de arquivo/pasta");
const onlySchema = z.enum(["all", "error", "warning"]).optional().describe("Filtro de severidade");
const sortSchema = z.enum(["none", "file", "severity"]).optional().describe("Ordenação do resultado");
const maxSchema = z.number().int().positive().optional().describe("Máximo de diagnósticos retornados");
const formatSchema = z.enum(["markdown", "json"]).optional().describe("Formato do resultado");

/**
 * Ferramentas `tds_compile` e `tds_syntax_only`.
 * Reaproveitam o mesmo fluxo da ferramenta de chat `@tds /compiler` e `@tds /syntax-only`.
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
				target: targetSchema,
				syntaxOnly: z.boolean().optional().describe("Somente verificar sintaxe (linter), sem gerar código no RPO"),
				only: onlySchema,
				sort: sortSchema,
				max: maxSchema,
				format: formatSchema
			}
		},
		(args, extra) => runCompile(args, extra?.signal)
	);

	server.registerTool(
		"tds_syntax_only",
		{
			title: "TDS Syntax Only",
			description:
				"Verifica a sintaxe (linter) do fonte AdvPL/TLPP/4GL informado, sem gerar código no RPO, e retorna os erros/avisos. " +
				"Se 'target' for omitido, usa o fonte do editor ativo.",
			inputSchema: {
				target: targetSchema,
				only: onlySchema,
				sort: sortSchema,
				max: maxSchema,
				format: formatSchema
			}
		},
		(args, extra) => runCompile({ ...args, syntaxOnly: true }, extra?.signal)
	);
};
