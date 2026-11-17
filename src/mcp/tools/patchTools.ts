import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { handleApplyPatchCommand, handleValidPatchCommand } from "../handlePatchCommands";
import { stripQuotes } from "../mcpUtils";

const patchSchema = z.string().min(1).describe("Caminho do pacote de atualização (.ptm, .zip ou .upd), absoluto ou relativo ao workspace");

/** Executa `fn` com um token de cancelamento ligado ao `AbortSignal` da chamada MCP. */
async function withCancellation<T>(signal: AbortSignal | undefined, fn: (token: vscode.CancellationToken) => Promise<T>): Promise<T> {
	const cancellation = new vscode.CancellationTokenSource();
	const onAbort = () => cancellation.cancel();
	signal?.addEventListener("abort", onAbort);

	try {
		return await fn(cancellation.token);
	} finally {
		signal?.removeEventListener("abort", onAbort);
		cancellation.dispose();
	}
}

/** Envolve o caminho em aspas, para suportar espaços no parser dos handlers do chat. */
function quotePath(patch: string): string {
	return `"${stripQuotes(patch.trim())}"`;
}

function textResult(text: string, isError: boolean) {
	return { content: [{ type: "text" as const, text }], isError };
}

/**
 * Ferramentas de pacote de atualização:
 * - `tds_validate_patch`: valida o pacote contra o RPO do servidor atual;
 * - `tds_apply_patch`: aplica o pacote ao RPO do servidor atual (altera o RPO).
 */
export const registerPatchTools: McpRegistrar = (server) => {
	server.registerTool(
		"tds_validate_patch",
		{
			title: "TDS Validate Patch",
			description:
				"Valida um pacote de atualização (.ptm, .zip, .upd) contra o RPO do servidor/ambiente atualmente conectado, " +
				"sem alterar o RPO. Use antes de aplicar um patch.",
			inputSchema: { patch: patchSchema },
			annotations: { readOnlyHint: true, destructiveHint: false }
		},
		async ({ patch }, extra) =>
			withCancellation(extra?.signal, async (token) => {
				const isError = { value: false };
				const message = await handleValidPatchCommand(quotePath(patch), token, isError);
				return textResult(message, isError.value);
			})
	);

	server.registerTool(
		"tds_apply_patch",
		{
			title: "TDS Apply Patch",
			description:
				"ATENÇÃO: altera o RPO. Aplica um pacote de atualização (.ptm, .zip, .upd) ao RPO do servidor/ambiente atualmente conectado. " +
				"Só use quando o usuário pedir explicitamente a aplicação do patch; valide antes com tds_validate_patch.",
			inputSchema: {
				patch: patchSchema,
				applyOld: z.boolean().optional().describe("Aplicar também recursos mais antigos que os existentes no RPO (padrão: false)")
			},
			annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false }
		},
		async ({ patch, applyOld }, extra) =>
			withCancellation(extra?.signal, async (token) => {
				const isError = { value: false };
				const message = await handleApplyPatchCommand(quotePath(patch), token, isError, applyOld ?? false);
				return textResult(message, isError.value);
			})
	);
};
