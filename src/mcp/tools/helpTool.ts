import { McpRegistrar } from "../mcpTypes";
import { buildHelpText } from "../helpText";

/**
 * Ferramenta `tds_help`: ajuda com comandos, alvos e opções suportados.
 */
export const registerHelpTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_help",
		{
			title: "TDS Help",
			description:
				"Shows the tools, targets and options supported by the TOTVS MCP (compile, syntax check, fix, patch validation/application, document symbols). " +
				"Use when the user asks what the TOTVS tools can do or how to use them.",
			annotations: { readOnlyHint: true }
		},
		async () => ({
			content: [{ type: "text" as const, text: buildHelpText() }]
		})
	);
};
