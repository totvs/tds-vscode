import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const CHANNEL_NAME = "TOTVS-Mcp";
const CONFIG_SECTION = "totvsLanguageServer";
const CONFIG_LOG = "mcp.log";
const CONFIG_LOG_FILE = "mcp.logFile";
const MAX_CHANNEL_LENGTH = 2000;
const MAX_FILE_LENGTH = 20000;

/**
 * Níveis de log (`totvsLanguageServer.mcp.log`), aplicados ao Output Channel:
 * - off:     somente inicialização e finalização;
 * - message: cabeçalho de cada chamada (sem os dados de envio/retorno);
 * - verbose: tudo, incluindo argumentos, resultados e corpo das requisições.
 *
 * Se `totvsLanguageServer.mcp.logFile` estiver preenchido, o arquivo sempre recebe o log
 * completo (verbose), independentemente do nível acima.
 */
export type McpLogLevel = "off" | "message" | "verbose";

const LEVEL_ORDER: Record<McpLogLevel, number> = { off: 0, message: 1, verbose: 2 };

let channel: vscode.LogOutputChannel | undefined;
let disposed = false;
let lastFileError: string | undefined;

export function getLogLevel(): McpLogLevel {
	const value = vscode.workspace.getConfiguration(CONFIG_SECTION).get<string>(CONFIG_LOG, "message");
	return value === "off" || value === "verbose" ? value : "message";
}

/**
 * Caminho do arquivo de log configurado em `totvsLanguageServer.mcp.logFile`.
 * Sem caminho (apenas o nome), usa a pasta raiz do projeto (primeiro workspace folder).
 * @returns Caminho absoluto, ou undefined quando não configurado.
 */
export function getLogFilePath(): string | undefined {
	const configured = vscode.workspace.getConfiguration(CONFIG_SECTION).get<string>(CONFIG_LOG_FILE, "")?.trim();
	if (!configured) {
		return undefined;
	}
	if (path.isAbsolute(configured)) {
		return configured;
	}

	const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	return root ? path.join(root, configured) : undefined;
}

function enabledFor(level: McpLogLevel): boolean {
	return LEVEL_ORDER[getLogLevel()] >= LEVEL_ORDER[level];
}

function getChannel(): vscode.LogOutputChannel | undefined {
	if (disposed) {
		return undefined;
	}
	if (!channel) {
		channel = vscode.window.createOutputChannel(CHANNEL_NAME, { log: true });
	}
	return channel;
}

/** Serializa para log, truncando textos longos e tolerando referências circulares. */
function stringify(value: unknown, max: number): string {
	let text: string;
	try {
		text = value === undefined ? "undefined" : (typeof value === "string" ? value : JSON.stringify(value));
	} catch {
		text = String(value);
	}
	return text.length > max ? `${text.slice(0, max)}… [+${text.length - max} chars]` : text;
}

function writeToFile(kind: string, msg: string, args: unknown[]): void {
	const file = getLogFilePath();
	if (!file) {
		return;
	}

	try {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		const line = [msg, ...args.map((a) => stringify(a, MAX_FILE_LENGTH))].join(" ");
		fs.appendFileSync(file, `${new Date().toISOString()} [${kind}] ${line}\n`, "utf8");
		lastFileError = undefined;
	} catch (e) {
		// Avisa uma única vez por erro, para não poluir o canal.
		const message = `Falha ao gravar o log MCP em '${file}': ${e instanceof Error ? e.message : String(e)}`;
		if (message !== lastFileError) {
			lastFileError = message;
			getChannel()?.error(message);
		}
	}
}

/**
 * Emite uma entrada de log.
 * @param level Nível mínimo configurado para a entrada aparecer no Output Channel.
 * @param verboseTag Marca a entrada como detalhe (prefixo `[verbose]`).
 */
function emit(level: McpLogLevel, kind: "info" | "warn" | "error", msg: string, args: unknown[], verboseTag = false): void {
	const text = verboseTag ? `[verbose] ${msg}` : msg;

	if (enabledFor(level)) {
		getChannel()?.[kind](text, ...args.map((a) => stringify(a, MAX_CHANNEL_LENGTH)));
	}

	// O arquivo recebe sempre o nível verbose (tudo).
	writeToFile(kind, text, args);
}

/** Logger do servidor MCP: Output Channel "TOTVS-Mcp" e, opcionalmente, arquivo. */
export const mcpLog = {
	/** Inicialização/finalização: sempre registrado, inclusive com `mcp.log = off`. */
	lifecycle: (msg: string, ...args: unknown[]) => emit("off", "info", msg, args),
	/** Falha de inicialização/finalização: sempre registrado. */
	lifecycleError: (msg: string, ...args: unknown[]) => emit("off", "error", msg, args),

	/** Cabeçalho das chamadas: no canal, em `message` e `verbose`. */
	message: (msg: string, ...args: unknown[]) => emit("message", "info", msg, args),
	warn: (msg: string, ...args: unknown[]) => emit("message", "warn", msg, args),
	error: (msg: string, ...args: unknown[]) => emit("message", "error", msg, args),

	/** Dados completos (argumentos, resultados, corpos): no canal, somente em `verbose`. */
	verbose: (msg: string, ...args: unknown[]) => emit("verbose", "info", msg, args, true),

	show: (preserveFocus = true) => getChannel()?.show(preserveFocus),
	dispose: () => {
		channel?.dispose();
		channel = undefined;
		disposed = true;
	},
	/** Permite recriar o canal após um `dispose` (ex.: reativação da extensão). */
	reset: () => {
		disposed = false;
	}
};

/**
 * Executa `fn` registrando a chamada.
 * - message: cabeçalho de entrada/saída e duração (sem dados);
 * - verbose: acrescenta argumentos e resultado.
 */
export async function logCall<T>(label: string, args: unknown, fn: () => Promise<T> | T): Promise<T> {
	const start = Date.now();
	mcpLog.message(`→ ${label}`);
	mcpLog.verbose(`→ ${label} args`, args);
	try {
		const result = await fn();
		mcpLog.message(`← ${label} ok (${Date.now() - start}ms)`);
		mcpLog.verbose(`← ${label} resultado`, result);
		return result;
	} catch (e) {
		const message = e instanceof Error ? e.message : String(e);
		mcpLog.error(`✗ ${label} falhou (${Date.now() - start}ms): ${message}`);
		mcpLog.verbose(`✗ ${label} stack`, e instanceof Error ? e.stack ?? message : message);
		throw e;
	}
}

/**
 * Instrumenta o McpServer para registrar toda chamada a tools, resources e prompts.
 * Deve ser aplicado antes do registro das capacidades.
 */
export function instrumentServer(server: McpServer): void {
	const wrap = (method: "registerTool" | "registerResource" | "registerPrompt", kind: string) => {
		const original = (server as any)[method].bind(server);

		(server as any)[method] = (...params: any[]) => {
			const name = typeof params[0] === "string" ? params[0] : kind;
			const cbIndex = params.length - 1;
			const callback = params[cbIndex];

			if (typeof callback === "function") {
				params[cbIndex] = (...cbArgs: any[]) => {
					// Sem schema o callback recebe só `extra`; com schema, (args, extra).
					const args = cbArgs.length > 1 ? cbArgs[0] : undefined;
					return logCall(`${kind} ${name}`, args, () => callback(...cbArgs));
				};
			}

			mcpLog.verbose(`registrado ${kind}: ${name}`);
			return original(...params);
		};
	};

	wrap("registerTool", "tool");
	wrap("registerResource", "resource");
	wrap("registerPrompt", "prompt");
}

/** Extrai um resumo (métodos JSON-RPC) do corpo de uma requisição MCP. */
export function describeRpcBody(body: unknown): string {
	const messages = Array.isArray(body) ? body : [body];
	return messages
		.map((m: any) => {
			if (!m || typeof m !== "object") {
				return "<vazio>";
			}
			const toolName = m.params?.name ? `(${m.params.name})` : "";
			return `${m.method ?? "<resposta>"}${toolName}${m.id !== undefined ? `#${m.id}` : ""}`;
		})
		.join(", ");
}
