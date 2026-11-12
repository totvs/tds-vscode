import * as vscode from "vscode";
import { TdsMcpServer } from "./mcpServer";
import { MCP_SERVER_NAME, MCP_SERVER_VERSION } from "./mcpTypes";
import { getLogFilePath, getLogLevel, mcpLog } from "./mcpLogger";

export { TdsMcpServer } from "./mcpServer";
export * from "./mcpTypes";
export { mcpLog } from "./mcpLogger";

const PROVIDER_ID = "tds-vscode.mcp";
const CONFIG_SECTION = "totvsLanguageServer";
const CONFIG_ENABLE = "mcp.enable";
const CONFIG_LOG = "mcp.log";
const CONFIG_LOG_FILE = "mcp.logFile";

function isEnabled(): boolean {
	return vscode.workspace.getConfiguration(CONFIG_SECTION).get<boolean>(CONFIG_ENABLE, false);
}

function errorText(e: unknown): string {
	return e instanceof Error ? e.stack ?? e.message : String(e);
}

/**
 * Registra o servidor MCP da extensão, o provider de definições para o VS Code
 * e os comandos de controle. As chamadas são registradas no Output Channel "TDS MCP",
 * conforme `totvsLanguageServer.mcp.log` (off | message | verbose).
 *
 * O servidor só é disponibilizado quando `totvsLanguageServer.mcp.enable` estiver ligado.
 */
export function registerMcpServer(_context: vscode.ExtensionContext): vscode.Disposable[] {
	mcpLog.reset();
	mcpLog.lifecycle(`registerMcpServer (enabled=${isEnabled()}, log=${getLogLevel()}, logFile=${getLogFilePath() ?? "<desativado>"})`);

	const server = new TdsMcpServer();
	const onDidChange = new vscode.EventEmitter<void>();

	const provider: vscode.McpServerDefinitionProvider<vscode.McpHttpServerDefinition> = {
		onDidChangeMcpServerDefinitions: onDidChange.event,

		provideMcpServerDefinitions: async () => {
			const enabled = isEnabled();
			mcpLog.message(`provider.provideMcpServerDefinitions (enabled=${enabled})`);
			if (!enabled) {
				return [];
			}
			// Alguns clientes (ex.: Agent Host) usam a definição como veio, sem chamar
			// resolveMcpServerDefinition. Por isso o servidor local é iniciado aqui e a
			// URL/token reais já são devolvidos.
			try {
				const info = await server.start();
				return [
					new vscode.McpHttpServerDefinition(
						MCP_SERVER_NAME,
						vscode.Uri.parse(info.url),
						{ Authorization: `Bearer ${info.token}` },
						MCP_SERVER_VERSION
					)
				];
			} catch (e) {
				mcpLog.lifecycleError("provider.provideMcpServerDefinitions: falha ao iniciar", errorText(e));
				return [];
			}
		},

		resolveMcpServerDefinition: async (definition) => {
			mcpLog.message("provider.resolveMcpServerDefinition", definition.label);
			if (!isEnabled()) {
				mcpLog.warn("provider.resolveMcpServerDefinition: desabilitado por configuração");
				return undefined;
			}
			const info = await server.start();
			definition.uri = vscode.Uri.parse(info.url);
			definition.headers = { Authorization: `Bearer ${info.token}` };
			return definition;
		}
	};

	const providerRegistration = vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, provider);

	const configListener = vscode.workspace.onDidChangeConfiguration(async (e) => {
		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_LOG}`)) {
			// Sempre registrado: é o próprio ajuste do nível de log.
			mcpLog.lifecycle(`nível de log alterado para '${getLogLevel()}'`);
		}

		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_LOG_FILE}`)) {
			mcpLog.lifecycle(`arquivo de log alterado para '${getLogFilePath() ?? "<desativado>"}'`);
		}

		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_ENABLE}`)) {
			mcpLog.message(`configuração ${CONFIG_SECTION}.${CONFIG_ENABLE} alterada (enabled=${isEnabled()})`);
			if (!isEnabled()) {
				await server.stop();
			}
			onDidChange.fire();
		}
	});

	const start = vscode.commands.registerCommand("totvs-developer-studio.mcp.start", async () => {
		mcpLog.message("command totvs-developer-studio.mcp.start");
		try {
			const info = await server.start();
			vscode.window.showInformationMessage(`TDS MCP ativo em ${info.url}`);
		} catch (e) {
			mcpLog.error("command mcp.start falhou", errorText(e));
			vscode.window.showErrorMessage(`Falha ao iniciar o servidor MCP: ${e instanceof Error ? e.message : e}`);
		}
	});

	const stop = vscode.commands.registerCommand("totvs-developer-studio.mcp.stop", async () => {
		mcpLog.message("command totvs-developer-studio.mcp.stop");
		await server.stop();
		vscode.window.showInformationMessage("TDS MCP parado.");
	});

	const showLog = vscode.commands.registerCommand("totvs-developer-studio.mcp.showLog", () => mcpLog.show(false));

	const logDisposable: vscode.Disposable = {
		dispose: () => {
			mcpLog.lifecycle("registerMcpServer: finalizando");
			mcpLog.dispose();
		}
	};

	return [server, onDidChange, providerRegistration, configListener, start, stop, showLog, logDisposable];
}
