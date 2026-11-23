import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { isTotvsSourceUri, toWorkspaceRelativePath } from "../mcpUtils";
import { maxSchema, paginate, toPlainRange } from "./languageFeaturesUtils";
import { runRequest, withTimeout } from "./toolUtils";

/**
 * Tool `tds_workspace_symbols` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerWorkspaceSymbolsTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_workspace_symbols",
		{
			title: "TDS Workspace Symbols",
			description:
				"Search symbols (functions, classes, methods) by name across the workspace, provided by the TOTVS Language Server. " +
				"Only AdvPL/TLPP/4GL sources are returned. Use this AUTOMATICALLY to find where a function or class is, when the file is unknown.",
			inputSchema: {
				query: z.string().describe("Text to search in symbol names (partial match)"),
				max: maxSchema
			},
			annotations: { readOnlyHint: true }
		},
		async ({ query, max }) =>
			runRequest("Workspace symbols", `query='${query}'`, async (profile) => {
				const items = await profile.phase("request", () =>
					withTimeout(
						vscode.commands.executeCommand<vscode.SymbolInformation[]>("vscode.executeWorkspaceSymbolProvider", query),
						"Workspace symbols"
					)
				);
				const all: vscode.SymbolInformation[] = (items ?? []).filter((item) => isTotvsSourceUri(item.location.uri));
				return paginate("symbols", all, max, (item) => ({
					name: item.name,
					kind: vscode.SymbolKind[item.kind],
					containerName: item.containerName,
					file: toWorkspaceRelativePath(item.location.uri),
					range: toPlainRange(item.location.range)
				}));
			})
	);
};
