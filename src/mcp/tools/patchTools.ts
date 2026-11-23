import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { profiled } from "../mcpLogger";
import { handleApplyPatchCommand, handleValidPatchCommand } from "../handlePatchCommands";
import { stripQuotes } from "../mcpUtils";
import { textResult, withCancellation } from "./toolUtils";

const patchSchema = z
	.string()
	.min(1)
	.describe("Path of the update package (.ptm, .zip or .upd), absolute or relative to the workspace");

/** Envolve o caminho em aspas, para suportar espaços no parser dos handlers do chat. */
function quotePath(patch: string): string {
	return `"${stripQuotes(patch.trim())}"`;
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
				"Validates an update package (.ptm, .zip, .upd) against the RPO of the currently connected server/environment, " +
				"without changing the RPO. Use it before applying a patch.",
			inputSchema: { patch: patchSchema },
			annotations: { readOnlyHint: true, destructiveHint: false }
		},
		async ({ patch }, extra) =>
			withCancellation(extra?.signal, async (token) => {
				const isError = { value: false };
				const message = await profiled("tds_validate_patch", patch, (profile) =>
					profile.phase("validate", () => handleValidPatchCommand(quotePath(patch), token, isError))
				);
				return textResult(message, isError.value);
			})
	);

	server.registerTool(
		"tds_apply_patch",
		{
			title: "TDS Apply Patch",
			description:
				"WARNING: changes the RPO. Applies an update package (.ptm, .zip, .upd) to the RPO of the currently connected server/environment. " +
				"Only use it when the user explicitly asks to apply the patch; validate it first with tds_validate_patch.",
			inputSchema: {
				patch: patchSchema,
				applyOld: z.boolean().optional().describe("Also apply resources older than the ones in the RPO (default: false)")
			},
			annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: false }
		},
		async ({ patch, applyOld }, extra) =>
			withCancellation(extra?.signal, async (token) => {
				const isError = { value: false };
				const message = await profiled("tds_apply_patch", patch, (profile) =>
					profile.phase("apply", () => handleApplyPatchCommand(quotePath(patch), token, isError, applyOld ?? false))
				);
				return textResult(message, isError.value);
			})
	);
};
