import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const CHANNEL_NAME = "TOTVS MCP";
const CONFIG_SECTION = "totvsLanguageServer";
const CONFIG_LOG = "mcp.log";
const CONFIG_LOG_FILE = "mcp.logFile";
const MAX_CHANNEL_LENGTH = 20000;
const MAX_FILE_LENGTH = 20000;

/**
 * Níveis de log (`totvsLanguageServer.mcp.log`), aplicados ao Output Channel:
 * - off:     somente inicialização e finalização;
 * - message: cabeçalho de cada chamada (sem os dados de envio/retorno);
 * - verbose: tudo, incluindo argumentos, resultados e corpo das requisições;
 * - debug:   verbose + mensagens técnicas (nomes de métodos/funções internas).
 *
 * Se `totvsLanguageServer.mcp.logFile` estiver preenchido, o arquivo sempre recebe o log
 * completo (verbose), independentemente do nível acima.
 */
export type McpLogLevel = "off" | "message" | "verbose" | "debug";

const LEVEL_ORDER: Record<McpLogLevel, number> = { off: 0, message: 1, verbose: 2, debug: 3 };

let channel: vscode.OutputChannel | undefined;
let disposed = false;
let lastFileError: string | undefined;

export function getLogLevel(): McpLogLevel {
	const value = vscode.workspace.getConfiguration(CONFIG_SECTION).get<string>(CONFIG_LOG, "message");
	return value === "off" || value === "verbose" || value === "debug" ? value : "message";
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

function getChannel(): vscode.OutputChannel | undefined {
	if (disposed) {
		return undefined;
	}
	if (!channel) {
		// Canal simples (não "log"), para controlar o formato: somente a hora, sem a data.
		channel = vscode.window.createOutputChannel(CHANNEL_NAME);
	}
	return channel;
}

/** Hora local no formato HH:mm:ss (sem a data). */
function currentTime(): string {
	const d = new Date();
	const pad = (n: number, size = 2) => String(n).padStart(size, "0");
	return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds(),2)}`;
}

/** Linha do Output Channel: `HH:mm:ss.SSS [nível] mensagem`. */
function formatChannelLine(kind: string, text: string): string {
	return `${currentTime()} [${kind}] ${text}`;
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
		const message = `Failed to write the MCP log to '${file}': ${e instanceof Error ? e.message : String(e)}`;
		if (message !== lastFileError) {
			lastFileError = message;
			getChannel()?.appendLine(formatChannelLine("error", message));
		}
	}
}

/**
 * Emite uma entrada de log.
 * @param level Nível mínimo configurado para a entrada aparecer no Output Channel.
 * @param verboseTag Marca a entrada como detalhe (prefixo `[verbose]`).
 */
function emit(level: McpLogLevel, kind: "info" | "warn" | "error", msg: string, args: unknown[], tag?: "verbose" | "debug"): void {
	const text = tag ? `[${tag}] ${msg}` : msg;

	if (enabledFor(level)) {
		const line = [text, ...args.map((a) => stringify(a, MAX_CHANNEL_LENGTH))].join(" ");
		getChannel()?.appendLine(formatChannelLine(kind, line));
	}

	// O arquivo recebe sempre o nível verbose (tudo).
	writeToFile(kind, text, args);
}

/** Logger do servidor MCP: Output Channel "TOTVS MCP" e, opcionalmente, arquivo. */
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
	verbose: (msg: string, ...args: unknown[]) => emit("verbose", "info", msg, args, "verbose"),

	/** Mensagens técnicas (nomes de métodos/funções): no canal, somente em `debug`. */
	debug: (msg: string, ...args: unknown[]) => emit("debug", "info", msg, args, "debug"),

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


type CallKind = "tool" | "prompt" | "resource";

const CALL_KIND_LABEL: Record<CallKind, string> = {
	tool: "Tool",
	prompt: "Prompt",
	resource: "Resource"
};

/**
 * Executa `fn` registrando a chamada de uma ferramenta, prompt ou recurso.
 * - message: início, conclusão (com duração) ou falha, sem dados;
 * - verbose: acrescenta parâmetros e resultado;
 * - debug:   acrescenta as mensagens técnicas.
 */
export async function logCall<T>(kind: CallKind, name: string, args: unknown, fn: () => Promise<T> | T): Promise<T> {
	const title = `${CALL_KIND_LABEL[kind]} '${name}'`;
	const start = Date.now();

	mcpLog.message(`${title}: started`);
	mcpLog.verbose(`${title}: parameters`, args);
	mcpLog.debug(`→ ${kind} ${name}`);
	try {
		const result = await fn();
		const elapsed = Date.now() - start;
		mcpLog.message(`${title}: finished in ${elapsed}ms`);
		mcpLog.verbose(`${title}: result`, result);
		mcpLog.debug(`← ${kind} ${name} ok (${elapsed}ms)`);
		return result;
	} catch (e) {
		const elapsed = Date.now() - start;
		const message = e instanceof Error ? e.message : String(e);
		mcpLog.error(`${title}: failed in ${elapsed}ms — ${message}`);
		mcpLog.verbose(`${title}: error details`, e instanceof Error ? e.stack ?? message : message);
		mcpLog.debug(`✗ ${kind} ${name} failed (${elapsed}ms): ${message}`);
		throw e;
	}
}

/**
 * Instrumenta o McpServer para registrar toda chamada a tools, resources e prompts.
 * Deve ser aplicado antes do registro das capacidades.
 */
export function instrumentServer(server: McpServer): void {
	const wrap = (method: "registerTool" | "registerResource" | "registerPrompt", kind: CallKind) => {
		const original = (server as any)[method].bind(server);

		(server as any)[method] = (...params: any[]) => {
			const name = typeof params[0] === "string" ? params[0] : kind;
			const cbIndex = params.length - 1;
			const callback = params[cbIndex];

			if (typeof callback === "function") {
				params[cbIndex] = (...cbArgs: any[]) => {
					// Sem schema o callback recebe só `extra`; com schema, (args, extra).
					const args = cbArgs.length > 1 ? cbArgs[0] : undefined;
					return logCall(kind, name, args, () => callback(...cbArgs));
				};
			}

			mcpLog.verbose(`${CALL_KIND_LABEL[kind]} '${name}' registered`);
			mcpLog.debug(`registered ${kind}: ${name}`);
			return original(...params);
		};
	};

	wrap("registerTool", "tool");
	wrap("registerResource", "resource");
	wrap("registerPrompt", "prompt");
}

/** Extrai um resumo técnico (métodos JSON-RPC) do corpo de uma requisição MCP. */
export function describeRpcBody(body: unknown): string {
	const messages = Array.isArray(body) ? body : [body];
	return messages
		.map((m: any) => {
			if (!m || typeof m !== "object") {
				return "<empty>";
			}
			const toolName = m.params?.name ? `(${m.params.name})` : "";
			return `${m.method ?? "<response>"}${toolName}${m.id !== undefined ? `#${m.id}` : ""}`;
		})
		.join(", ");
}

/** Descreve em linguagem natural o que o cliente MCP está pedindo. */
export function describeRpcFriendly(body: unknown): string {
	const messages = Array.isArray(body) ? body : [body];
	return messages
		.map((m: any) => {
			if (!m || typeof m !== "object") {
				return "empty request";
			}
			const name = m.params?.name ? ` '${m.params.name}'` : "";
			switch (m.method) {
				case "initialize":
					return "the client started the connection";
				case "notifications/initialized":
					return "the client confirmed the connection";
				case "ping":
					return "the client checked whether the server is active";
				case "tools/list":
					return "the client listed the tools";
				case "tools/call":
					return `the client called the tool${name}`;
				case "prompts/list":
					return "the client listed the prompts";
				case "prompts/get":
					return `the client got the prompt${name}`;
				case "resources/list":
					return "the client listed the resources";
				case "resources/read":
					return "the client read a resource";
				case undefined:
					return "the client sent a response";
				default:
					return `the client sent '${m.method}'`;
			}
		})
		.join("; ");
}
