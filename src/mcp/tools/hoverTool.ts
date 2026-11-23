import * as vscode from "vscode";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, toPlainRange, markdownText, onTotvsPosition } from "./languageFeaturesUtils";

/**
 * Tool `tds_hover` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerHoverTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_hover",
		{
			title: "TDS Hover",
			description:
				"Get documentation, type and signature information of the symbol at a position of an AdvPL/TLPP/4GL source, " +
				"as the hover of the TOTVS Language Server. Use this AUTOMATICALLY for 'what is this?' questions.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character }) =>
			onTotvsPosition(file, line, character, "Hover", async (document, position) => {
				const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
					"vscode.executeHoverProvider",
					document.uri,
					position
				);
				if (!hovers || hovers.length === 0) {
					return "No hover information at this position.";
				}
				return hovers.map((hover) => ({
					contents: hover.contents.map(markdownText).filter((text) => text.length > 0),
					range: hover.range ? toPlainRange(hover.range) : undefined
				}));
			})
	);
};
