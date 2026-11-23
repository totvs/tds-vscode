import * as vscode from "vscode";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, toPlainWorkspaceEdit, onTotvsPosition } from "./languageFeaturesUtils";

/**
 * Tool `tds_code_actions` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerCodeActionsTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_code_actions",
		{
			title: "TDS Code Actions",
			description:
				"List the code actions (quick fixes and refactorings) available for a line/range of an AdvPL/TLPP/4GL source, provided by the TOTVS Language Server. " +
				"Listing only: to APPLY the fixes of the reported problems use tds_fix. " +
				"If 'character' is omitted, the whole line (up to 'endLine') is considered.",
			inputSchema: {
				file: fileSchema,
				line: lineSchema,
				character: characterSchema.optional(),
				endLine: lineSchema.optional(),
				endCharacter: characterSchema.optional()
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, endLine, endCharacter }) =>
			onTotvsPosition(file, line, character ?? 0, "Code actions", async (document, start) => {
				const lastLine: number = Math.min(endLine ?? line, document.lineCount - 1);
				const end: vscode.Position =
					character === undefined && endCharacter === undefined
						? document.lineAt(lastLine).range.end
						: new vscode.Position(lastLine, Math.min(endCharacter ?? character ?? 0, document.lineAt(lastLine).text.length));
				const actions = await vscode.commands.executeCommand<(vscode.CodeAction | vscode.Command)[]>(
					"vscode.executeCodeActionProvider",
					document.uri,
					new vscode.Range(start, end)
				);
				return (actions ?? []).map((action) => {
					const codeAction = action as vscode.CodeAction;
					const command: vscode.Command | undefined = typeof codeAction.command === "object" ? codeAction.command : (action as vscode.Command);
					return {
						title: action.title,
						kind: codeAction.kind?.value,
						isPreferred: codeAction.isPreferred,
						changes: codeAction.edit ? toPlainWorkspaceEdit(codeAction.edit) : undefined,
						command: typeof command?.command === "string" ? command.command : undefined
					};
				});
			})
	);
};
