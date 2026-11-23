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
	mcpServerVersion,
	McpServerInfo
} from "./mcpTypes";
import { registerTools } from "./tools";
import { registerResources } from "./resources";
import { registerPrompts } from "./prompts";
import { isKiro, removeKiroMcpEntry, writeKiroMcpEntry } from "./kiroMcpConfig";
import { describeRpcBody, describeRpcFriendly, instrumentServer, mcpLog } from "./mcpLogger";

/** Cria uma instância de McpServer com todas as capacidades registradas. */
function createMcpServer(): McpServer {
	const server = new McpServer({ name: MCP_SERVER_NAME, version: mcpServerVersion() });

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
			mcpLog.verbose("The MCP server is already running", this.info.url);
			mcpLog.debug("TdsMcpServer.start: already running", this.info.url);
			return this.info;
		}
		mcpLog.lifecycle("Starting the MCP server...");
		mcpLog.debug("TdsMcpServer.start", { port });
		const startedAt = Date.now();
		const token = crypto.randomBytes(24).toString("hex");
		const httpServer = http.createServer((req, res) => {
			this.handleRequest(req, res, token).catch((e) => {
				mcpLog.error(`Error while handling the request: ${e instanceof Error ? e.message : String(e)}`);
				mcpLog.debug("HTTP request error", e instanceof Error ? e.stack ?? e.message : String(e));
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
			mcpLog.lifecycleError(`Could not start the MCP server: ${e instanceof Error ? e.message : String(e)}`);
			mcpLog.debug("TdsMcpServer.start failed", e instanceof Error ? e.message : String(e));
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

		mcpLog.lifecycle(`MCP server started at ${this.info.url} (${Date.now() - startedAt}ms)`);
		mcpLog.debug(`TdsMcpServer.start ok (${Date.now() - startedAt}ms)`);
		mcpLog.debug(`MCP URL: ${this.info.url}`);

		// Notificação somente quando o servidor realmente é iniciado (não em chamadas repetidas).
		void vscode.window.showInformationMessage(`TOTVS MCP iniciado em ${this.info.url}`);

		// Kiro reads the servers from .kiro/settings/mcp.json: keep it with the current URL/token.
		if (isKiro()) {
			await writeKiroMcpEntry(this.info);
		}
		return this.info;
	}

	async stop(): Promise<void> {
		mcpLog.lifecycle("Stopping the MCP server...");
		mcpLog.debug("TdsMcpServer.stop");
		const httpServer = this.httpServer;
		this.httpServer = undefined;
		this.info = undefined;

		if (httpServer && isKiro()) {
			await removeKiroMcpEntry();
		}

		if (httpServer) {
			await new Promise<void>((resolve) => httpServer.close(() => resolve()));
		}
	}

	dispose(): void {
		mcpLog.debug("TdsMcpServer.dispose");
		void this.stop();
	}

	private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse, token: string): Promise<void> {
		const url = new URL(req.url ?? "/", `http://${MCP_DEFAULT_HOST}`);
		mcpLog.message(`Request received: ${req.method} ${url.pathname}`);
		mcpLog.debug(`HTTP ${req.method} ${url.pathname}`);

		if (url.pathname !== MCP_ENDPOINT_PATH) {
			mcpLog.warn(`Path not found: ${req.method} ${url.pathname}`);
			mcpLog.debug(`HTTP 404 ${req.method} ${url.pathname}`);
			return sendJson(res, 404, { error: "Not found" });
		}

		if (req.headers.authorization !== `Bearer ${token}`) {
			mcpLog.warn(`Access denied: missing or invalid token (${req.method} ${url.pathname})`);
			mcpLog.debug(`HTTP 401 ${req.method} ${url.pathname}: missing/invalid token`);
			return sendJson(res, 401, { error: "Unauthorized" });
		}

		// Modo stateless: sem sessões, somente POST é suportado.
		if (req.method !== "POST") {
			mcpLog.warn(`Method not allowed: ${req.method} ${url.pathname} (POST only)`);
			mcpLog.debug(`HTTP 405 ${req.method} ${url.pathname}`);
			res.setHeader("Allow", "POST");
			return sendJson(res, 405, {
				jsonrpc: "2.0",
				error: { code: -32000, message: "Method not allowed." },
				id: null
			});
		}

		const body = await readBody(req);
		mcpLog.message(`Client: ${describeRpcFriendly(body)}`);
		mcpLog.verbose("Request body", body);
		mcpLog.debug(`RPC received: ${describeRpcBody(body)}`);
		const server = createMcpServer();
		const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

		// Captures what is sent to the client, to log it (verbose) when the response ends.
		const sentChunks: Buffer[] = [];
		const originalWrite = res.write.bind(res) as (...args: unknown[]) => boolean;
		const originalEnd = res.end.bind(res) as (...args: unknown[]) => http.ServerResponse;
		const capture = (chunk: unknown): void => {
			if (typeof chunk === "string") {
				sentChunks.push(Buffer.from(chunk));
			} else if (Buffer.isBuffer(chunk) || chunk instanceof Uint8Array) {
				sentChunks.push(Buffer.from(chunk));
			}
		};
		res.write = ((chunk: unknown, ...rest: unknown[]) => {
			capture(chunk);
			return originalWrite(chunk, ...rest);
		}) as typeof res.write;
		res.end = ((chunk?: unknown, ...rest: unknown[]) => {
			capture(chunk);
			return originalEnd(chunk, ...rest);
		}) as typeof res.end;

		res.on("close", () => {
			mcpLog.verbose(`Response sent to the client (HTTP ${res.statusCode})`, Buffer.concat(sentChunks).toString("utf8"));
			mcpLog.debug("HTTP response closed");
			void transport.close();
			void server.close();
		});

		mcpLog.debug(`transport.handleRequest → ${describeRpcBody(body)}`);
		await server.connect(transport);
		await transport.handleRequest(req, res, body);
		mcpLog.debug(`transport.handleRequest ← ${describeRpcBody(body)}`);
	}
}
