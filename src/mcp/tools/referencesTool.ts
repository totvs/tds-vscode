import * as vscode from "vscode";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, maxSchema, paginate, toPlainLocation, onTotvsPosition } from "./languageFeaturesUtils";

/**
 * Tool `tds_references` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerReferencesTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_references",
		{
			title: "TDS References",
			description:
				"Find all references (usages) of the symbol at a position of an AdvPL/TLPP/4GL source, using the TOTVS Language Server. " +
				"Use this AUTOMATICALLY for impact analysis, 'where is this called/used?' and before changing a symbol.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema, max: maxSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, max }) =>
			onTotvsPosition(file, line, character, "References", async (document, position) => {
				const items = await vscode.commands.executeCommand<vscode.Location[]>(
					"vscode.executeReferenceProvider",
					document.uri,
					position
				);
				return paginate("references", items ?? [], max, toPlainLocation);
			})
	);
};
