import * as vscode from "vscode";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, toPlainLocation, onTotvsPosition } from "./languageFeaturesUtils";

/**
 * Tool `tds_definition` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerDefinitionTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_definition",
		{
			title: "TDS Definition",
			description:
				"Find the definition/declaration of the symbol (function, class, method, variable) at a position of an AdvPL/TLPP/4GL source, " +
				"using the TOTVS Language Server. Use this AUTOMATICALLY when the user asks where something is defined or implemented.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character }) =>
			onTotvsPosition(file, line, character, "Definition", async (document, position) => {
				const items = await vscode.commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>(
					"vscode.executeDefinitionProvider",
					document.uri,
					position
				);
				return (items ?? []).map(toPlainLocation);
			})
	);
};
