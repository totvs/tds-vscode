import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, maxSchema, paginate, toPlainEdit, onTotvsDocument } from "./languageFeaturesUtils";

/**
 * Tool `tds_format_document` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerFormatDocumentTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_format_document",
		{
			title: "TDS Format Document (preview)",
			description:
				"Preview the edits the formatter would apply to an AdvPL/TLPP/4GL source (TOTVS formatter). " +
				"PREVIEW ONLY: the file is not changed.",
			inputSchema: {
				file: fileSchema,
				tabSize: z.number().int().min(1).optional().describe("Tab size (default: editor setting)"),
				insertSpaces: z.boolean().optional().describe("Use spaces instead of tabs (default: editor setting)"),
				max: maxSchema
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, tabSize, insertSpaces, max }) =>
			onTotvsDocument(file, "Format document", async (document) => {
				const editor: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("editor", document.uri);
				const options: vscode.FormattingOptions = {
					tabSize: tabSize ?? editor.get<number>("tabSize", 4),
					insertSpaces: insertSpaces ?? editor.get<boolean>("insertSpaces", true)
				};
				const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
					"vscode.executeFormatDocumentProvider",
					document.uri,
					options
				);
				return { preview: true, ...paginate("edits", edits ?? [], max, toPlainEdit) };
			})
	);
};
