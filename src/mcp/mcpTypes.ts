import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const MCP_SERVER_NAME = "tds-vscode";
export const MCP_SERVER_VERSION = "0.1.0";
export const MCP_ENDPOINT_PATH = "/mcp";
export const MCP_DEFAULT_HOST = "127.0.0.1";

/**
 * Contrato de um módulo que registra ferramentas/recursos/prompts no servidor MCP.
 * Cada módulo (tools, resources, prompts) expõe uma função com esta assinatura.
 */
export type McpRegistrar = (server: McpServer) => void;

/** Informações de execução do servidor MCP em andamento. */
export interface McpServerInfo {
	host: string;
	port: number;
	/** URL completa do endpoint (ex.: http://127.0.0.1:12345/mcp). */
	url: string;
	/** Token exigido no header `Authorization: Bearer <token>`. */
	token: string;
}
