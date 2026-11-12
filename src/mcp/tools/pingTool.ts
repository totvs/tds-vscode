import { z } from "zod";
import { McpRegistrar, MCP_SERVER_NAME, MCP_SERVER_VERSION } from "../mcpTypes";

/**
 * Ferramenta de exemplo/diagnóstico. Serve de modelo para novas ferramentas.
 */
export const registerPingTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_ping",
		{
			title: "TDS Ping",
			description: "Verifica se o servidor MCP da extensão TDS-VSCode está ativo.",
			inputSchema: { message: z.string().optional().describe("Texto opcional a ser devolvido") }
		},
		async ({ message }) => ({
			content: [
				{
					type: "text",
					text: JSON.stringify({
						server: MCP_SERVER_NAME,
						version: MCP_SERVER_VERSION,
						echo: message ?? null
					})
				}
			]
		})
	);
};
