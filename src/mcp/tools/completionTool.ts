import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, maxSchema, markdownText, onTotvsPosition, paginate } from "./languageFeaturesUtils";

/**
 * Tool `tds_completion` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerCompletionTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_completion",
		{
			title: "TDS Completion",
			description:
				"Get the code completion suggestions at a position of an AdvPL/TLPP/4GL source, provided by the TOTVS Language Server. " +
				"Use when the user asks which functions, methods or members are available at a point of the code.",
			inputSchema: {
				file: fileSchema,
				line: lineSchema,
				character: characterSchema,
				triggerCharacter: z.string().max(1).optional().describe("Trigger character (e.g. ':' or '.')"),
				max: maxSchema
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, triggerCharacter, max }) =>
			onTotvsPosition(file, line, character, "Completion", async (document, position) => {
				const list = await vscode.commands.executeCommand<vscode.CompletionList>(
					"vscode.executeCompletionItemProvider",
					document.uri,
					position,
					triggerCharacter
				);
				return {
					isIncomplete: list?.isIncomplete ?? false,
					...paginate("items", list?.items ?? [], max, (item: vscode.CompletionItem) => ({
						label: typeof item.label === "string" ? item.label : item.label.label,
						kind: item.kind === undefined ? undefined : vscode.CompletionItemKind[item.kind],
						detail: item.detail,
						documentation: markdownText(item.documentation),
						insertText: typeof item.insertText === "string" ? item.insertText : item.insertText?.value
					}))
				};
			})
	);
};
