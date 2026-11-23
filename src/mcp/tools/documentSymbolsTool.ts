import * as vscode from "vscode";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, toPlainSymbol, onTotvsDocument } from "./languageFeaturesUtils";

/**
 * Tool `tds_document_symbols` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerDocumentSymbolsTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_document_symbols",
		{
			title: "TDS Document Symbols",
			description:
				"Get a hierarchical outline of all symbols (functions, classes, methods, variables) of an AdvPL/TLPP/4GL source file, " +
				"provided by the TOTVS Language Server (document symbols). " +
				"Use this AUTOMATICALLY when the user asks about file structure, 'what's in this file?', needs an overview, " +
				"wants the outline or the list of functions/classes of a .prw/.tlpp/.prx/.4gl source. " +
				"Prefer this tool over generic document-symbol tools for TOTVS sources. " +
				"If 'file' is omitted, uses the active editor.",
			inputSchema: { file: fileSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file }) =>
			onTotvsDocument(file, "Document symbols", async (document) => {
				const symbols = await vscode.commands.executeCommand<(vscode.DocumentSymbol | vscode.SymbolInformation)[]>(
					"vscode.executeDocumentSymbolProvider",
					document.uri
				);
				return (symbols ?? []).map(toPlainSymbol);
			})
	);
};
