import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { profiled } from "../mcpLogger";
import { handleCompilerCommand } from "../handleCompileCommands";
import { DEFAULT_FLAG_OPTIONS, FlagOptions, resolveTarget } from "../mcpUtils";
import { errorMessage, fail, textResult, TextResult, withCancellation } from "./toolUtils";

type CompileArgs = {
	target?: string;
	syntaxOnly?: boolean;
	only?: "all" | "error" | "warning";
	sort?: "none" | "file" | "severity";
	max?: number;
	format?: "markdown" | "json";
};

/**
 * Executa o fluxo de compilação e converte o resultado para MCP.
 * Sem `target`, usa o fonte do editor ativo (contexto atual).
 */
async function runCompile(args: CompileArgs, signal?: AbortSignal): Promise<TextResult> {
	const { target, syntaxOnly, only, sort, max, format } = args;
	const flags: FlagOptions = {
		...structuredClone(DEFAULT_FLAG_OPTIONS),
		...(syntaxOnly !== undefined && { syntaxOnly }),
		...(only && { only }),
		...(sort && { sort }),
		...(max && { max }),
		...(format && { format })
	};

	try {
		return await withCancellation(signal, async (token) => {
			const isError = { value: false };
			const resolvedTarget: string = resolveTarget(target);
			const output: string[] = await profiled(syntaxOnly ? "tds_syntax_only" : "tds_compile", resolvedTarget, (profile) =>
				profile.phase("compile", () => handleCompilerCommand(resolvedTarget, flags, token, isError))
			);
			return textResult(output.join("\n"), isError.value);
		});
	} catch (e) {
		return fail(`Compilation failed: ${errorMessage(e)}`);
	}
}

const targetSchema = z
	.string()
	.optional()
	.describe("Target: 'current' (default), 'open-editors', 'workspace' or the path of a file/folder");
const onlySchema = z.enum(["all", "error", "warning"]).optional().describe("Severity filter");
const sortSchema = z.enum(["none", "file", "severity"]).optional().describe("Sort order of the result");
const maxSchema = z.number().int().positive().optional().describe("Maximum number of diagnostics returned");
const formatSchema = z.enum(["markdown", "json"]).optional().describe("Format of the result");

/**
 * Ferramentas `tds_compile` e `tds_syntax_only`.
 * Compilam (ou apenas verificam a sintaxe de) fontes e retornam os diagnósticos.
 */
export const registerCompileTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_compile",
		{
			title: "TDS Compile",
			description:
				"Compiles the AdvPL/TLPP/4GL source and returns the errors/warnings (Problems). " +
				"If 'target' is omitted, uses the source of the active editor. " +
				"Also accepts 'open-editors', 'workspace' or the path of a file/folder (relative to the workspace or absolute).",
			inputSchema: {
				target: targetSchema,
				syntaxOnly: z.boolean().optional().describe("Only check the syntax (linter), without generating code in the RPO"),
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
				"Checks the syntax (linter) of the AdvPL/TLPP/4GL source, without generating code in the RPO, and returns the errors/warnings. " +
				"If 'target' is omitted, uses the source of the active editor.",
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
