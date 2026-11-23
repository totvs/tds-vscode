import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, toPlainWorkspaceEdit, onTotvsPosition } from "./languageFeaturesUtils";

/**
 * Tool `tds_rename_symbol` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerRenameSymbolTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_rename_symbol",
		{
			title: "TDS Rename Symbol (preview)",
			description:
				"Preview the edits needed to rename the symbol at a position of an AdvPL/TLPP/4GL source, using the TOTVS Language Server. " +
				"PREVIEW ONLY: nothing is changed in the files; apply the returned edits with the editing tools if the user agrees.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema, newName: z.string().min(1).describe("New symbol name") },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, newName }) =>
			onTotvsPosition(file, line, character, "Rename", async (document, position) => {
				const edit = await vscode.commands.executeCommand<vscode.WorkspaceEdit>(
					"vscode.executeDocumentRenameProvider",
					document.uri,
					position,
					newName
				);
				const changes: object[] = toPlainWorkspaceEdit(edit);
				return changes.length === 0 ? "The language server did not return rename edits for this position." : { preview: true, changes };
			})
	);
};
