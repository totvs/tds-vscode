import { McpRegistrar } from "../mcpTypes";
import { buildHelpText } from "../../chat/chatTools";

const MCP_TOOLS_HELP: string = [
	"",
	"Equivalent MCP tools:",
	"- tds_compile: compiles the target (default: current editor).",
	"- tds_syntax_only: checks the syntax of the target, without generating code.",
	"- tds_validate_patch: validates a patch file (.ptm, .zip, .upd) against the RPO of the current server.",
	"- tds_apply_patch: applies a patch file (.ptm, .zip, .upd) to the RPO of the current server (changes the RPO).",
	"- tds_document_symbols: outline of symbols of a source file, provided by the language server.",
	"- tds_help: shows this help.",
	"Note: in MCP tools the options are passed as parameters (target, syntaxOnly, only, sort, max, format), not as key=value text."
].join("\n");

/**
 * Ferramenta `tds_help`: ajuda com comandos, alvos e opções suportados.
 */
export const registerHelpTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_help",
		{
			title: "TDS Help",
			description:
				"Shows the commands, targets and options supported by the TOTVS tools (compile, syntax check, patch validation/application). " +
				"Use when the user asks what the TOTVS tools can do or how to use them.",
			annotations: { readOnlyHint: true }
		},
		async () => ({
			content: [{ type: "text" as const, text: buildHelpText() + "\n" + MCP_TOOLS_HELP }]
		})
	);
};
