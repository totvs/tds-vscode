import { z } from "zod";
import { McpRegistrar, MCP_SERVER_NAME, mcpServerVersion } from "../mcpTypes";
import { profiled } from "../mcpLogger";

/**
 * Ferramenta de exemplo/diagnóstico. Serve de modelo para novas ferramentas.
 */
export const registerPingTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_ping",
		{
			title: "TDS Ping",
			description: "Checks whether the MCP server of the TDS-VSCode extension is active.",
			inputSchema: { message: z.string().optional().describe("Optional text to be returned") }
		},
		async ({ message }) =>
			profiled("tds_ping", "-", () => ({
				content: [
					{
						type: "text",
						text: JSON.stringify({
							server: MCP_SERVER_NAME,
							version: mcpServerVersion(),
							echo: message ?? null
						})
					}
				]
			}))
	);
};
