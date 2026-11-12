import * as crypto from "crypto";
import * as http from "http";
import { AddressInfo } from "net";
import * as vscode from "vscode";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
	MCP_DEFAULT_HOST,
	MCP_ENDPOINT_PATH,
	MCP_SERVER_NAME,
	MCP_SERVER_VERSION,
	McpServerInfo
} from "./mcpTypes";
import { registerTools } from "./tools";
import { registerResources } from "./resources";
import { registerPrompts } from "./prompts";
import { describeRpcBody, instrumentServer, logCall, mcpLog } from "./mcpLogger";

/** Cria uma instância de McpServer com todas as capacidades registradas. */
function createMcpServer(): McpServer {
	const server = new McpServer({ name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION });

	instrumentServer(server);
	registerTools(server);
	registerResources(server);
	registerPrompts(server);

	return server;
}

function readBody(req: http.IncomingMessage): Promise<unknown> {
	return new Promise((resolve, reject) => {
		const chunks: Buffer[] = [];
		req.on("data", (chunk) => chunks.push(chunk));
		req.on("end", () => {
			if (chunks.length === 0) {
				return resolve(undefined);
			}
			try {
				resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
			} catch (e) {
				reject(e);
			}
		});
		req.on("error", reject);
	});
}

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(body));
}

/**
 * Servidor MCP (Streamable HTTP, modo stateless) executado no extension host.
 * Escuta somente em loopback e exige token Bearer.
 */
export class TdsMcpServer implements vscode.Disposable {
	private httpServer: http.Server | undefined;
	private info: McpServerInfo | undefined;

	get serverInfo(): McpServerInfo | undefined {
		return this.info;
	}

	get isRunning(): boolean {
		return this.httpServer !== undefined;
	}

	/** Inicia o servidor em uma porta livre (ou na informada). */
	async start(port: number = 0): Promise<McpServerInfo> {
		if (this.info) {
			mcpLog.verbose("TdsMcpServer.start: já em execução", this.info.url);
			return this.info;
		}
		mcpLog.lifecycle("TdsMcpServer.start", { port });
		const startedAt = Date.now();
		const token = crypto.randomBytes(24).toString("hex");
		const httpServer = http.createServer((req, res) => {
			this.handleRequest(req, res, token).catch((e) => {
				mcpLog.error("erro na requisição HTTP", e instanceof Error ? e.stack ?? e.message : String(e));
				if (!res.headersSent) {
					sendJson(res, 500, {
						jsonrpc: "2.0",
						error: { code: -32603, message: "Internal server error" },
						id: null
					});
				}
			});
		});

		await new Promise<void>((resolve, reject) => {
			httpServer.once("error", reject);
			httpServer.listen(port, MCP_DEFAULT_HOST, () => resolve());
		}).catch((e) => {
			mcpLog.lifecycleError("TdsMcpServer.start falhou", e instanceof Error ? e.message : String(e));
			throw e;
		});

		const address = httpServer.address() as AddressInfo;
		this.httpServer = httpServer;
		this.info = {
			host: MCP_DEFAULT_HOST,
			port: address.port,
			url: `http://${MCP_DEFAULT_HOST}:${address.port}${MCP_ENDPOINT_PATH}`,
			token
		};

		mcpLog.lifecycle(`TdsMcpServer.start ok (${Date.now() - startedAt}ms)`);
		mcpLog.lifecycle(`MCP URL: ${this.info.url}`);
		return this.info;
	}

	async stop(): Promise<void> {
		mcpLog.lifecycle("TdsMcpServer.stop");
		const httpServer = this.httpServer;
		this.httpServer = undefined;
		this.info = undefined;

		if (httpServer) {
			await new Promise<void>((resolve) => httpServer.close(() => resolve()));
		}
	}

	dispose(): void {
		mcpLog.lifecycle("TdsMcpServer.dispose");
		void this.stop();
	}

	private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse, token: string): Promise<void> {
		const url = new URL(req.url ?? "/", `http://${MCP_DEFAULT_HOST}`);
		mcpLog.message(`HTTP ${req.method} ${url.pathname}`);

		if (url.pathname !== MCP_ENDPOINT_PATH) {
			mcpLog.warn(`HTTP 404 ${req.method} ${url.pathname}`);
			return sendJson(res, 404, { error: "Not found" });
		}

		if (req.headers.authorization !== `Bearer ${token}`) {
			mcpLog.warn(`HTTP 401 ${req.method} ${url.pathname}: token ausente/inválido`);
			return sendJson(res, 401, { error: "Unauthorized" });
		}

		// Modo stateless: sem sessões, somente POST é suportado.
		if (req.method !== "POST") {
			mcpLog.warn(`HTTP 405 ${req.method} ${url.pathname}`);
			res.setHeader("Allow", "POST");
			return sendJson(res, 405, {
				jsonrpc: "2.0",
				error: { code: -32000, message: "Method not allowed." },
				id: null
			});
		}

		const body = await readBody(req);
		mcpLog.message(`RPC recebido: ${describeRpcBody(body)}`);
		mcpLog.verbose("RPC body", body);
		const server = createMcpServer();
		const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

		res.on("close", () => {
			mcpLog.verbose("HTTP resposta encerrada");
			void transport.close();
			void server.close();
		});

		await logCall("transport.handleRequest", describeRpcBody(body), async () => {
			await server.connect(transport);
			await transport.handleRequest(req, res, body);
		});
	}
}
