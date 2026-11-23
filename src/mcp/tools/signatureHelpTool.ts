import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { fileSchema, lineSchema, characterSchema, markdownText, onTotvsPosition } from "./languageFeaturesUtils";

/**
 * Tool `tds_signature_help` of the TOTVS MCP (read-only).
 * Adapted from `sehejjain.lsp-mcp-bridge` (MIT License); see THIRD-PARTY-NOTICES.md.
 */
export const registerSignatureHelpTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_signature_help",
		{
			title: "TDS Signature Help",
			description:
				"Get the signature and parameters of the function/method call at a position of an AdvPL/TLPP/4GL source, " +
				"provided by the TOTVS Language Server. Use when the user asks about the parameters of a function.",
			inputSchema: {
				file: fileSchema,
				line: lineSchema,
				character: characterSchema,
				triggerCharacter: z.string().max(1).optional().describe("Trigger character (e.g. '(' or ',')")
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, triggerCharacter }) =>
			onTotvsPosition(file, line, character, "Signature help", async (document, position) => {
				const help = await vscode.commands.executeCommand<vscode.SignatureHelp>(
					"vscode.executeSignatureHelpProvider",
					document.uri,
					position,
					triggerCharacter
				);
				if (!help || help.signatures.length === 0) {
					return "No signature help at this position.";
				}
				return {
					activeSignature: help.activeSignature,
					activeParameter: help.activeParameter,
					signatures: help.signatures.map((signature) => ({
						label: signature.label,
						documentation: markdownText(signature.documentation),
						parameters: signature.parameters.map((parameter) => ({
							label: typeof parameter.label === "string" ? parameter.label : signature.label.substring(parameter.label[0], parameter.label[1]),
							documentation: markdownText(parameter.documentation)
						}))
					}))
				};
			})
	);
};
