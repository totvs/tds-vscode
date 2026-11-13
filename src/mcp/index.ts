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
 * e os comandos de controle. As chamadas são registradas no Output Channel "TOTVS MCP",
 * conforme `totvsLanguageServer.mcp.log` (off | message | verbose | debug).
 *
 * O servidor só é disponibilizado quando `totvsLanguageServer.mcp.enable` estiver ligado.
 */
export function registerMcpServer(_context: vscode.ExtensionContext): vscode.Disposable[] {
	mcpLog.reset();
	mcpLog.lifecycle(
		`TOTVS MCP carregado (servidor ${isEnabled() ? "habilitado" : "desabilitado"}, nível de log: ${getLogLevel()}, arquivo de log: ${getLogFilePath() ?? "não configurado"})`
	);
	mcpLog.debug(`registerMcpServer (enabled=${isEnabled()}, log=${getLogLevel()}, logFile=${getLogFilePath() ?? "<desativado>"})`);

	const server = new TdsMcpServer();
	const onDidChange = new vscode.EventEmitter<void>();

	const provider: vscode.McpServerDefinitionProvider<vscode.McpHttpServerDefinition> = {
		onDidChangeMcpServerDefinitions: onDidChange.event,

		provideMcpServerDefinitions: async () => {
			const enabled = isEnabled();
			mcpLog.message(`O VS Code consultou os servidores MCP disponíveis (servidor ${enabled ? "habilitado" : "desabilitado"})`);
			mcpLog.debug(`provider.provideMcpServerDefinitions (enabled=${enabled})`);
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
				mcpLog.lifecycleError(`Não foi possível iniciar o servidor MCP: ${e instanceof Error ? e.message : String(e)}`);
				mcpLog.debug("provider.provideMcpServerDefinitions: falha ao iniciar", errorText(e));
				return [];
			}
		},

		resolveMcpServerDefinition: async (definition) => {
			mcpLog.message("O VS Code está preparando a conexão com o servidor MCP");
			mcpLog.debug("provider.resolveMcpServerDefinition", definition.label);
			if (!isEnabled()) {
				mcpLog.warn("O servidor MCP está desabilitado nas configurações");
				mcpLog.debug("provider.resolveMcpServerDefinition: desabilitado por configuração");
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
			mcpLog.lifecycle(`Nível de log alterado para '${getLogLevel()}'`);
		}

		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_LOG_FILE}`)) {
			mcpLog.lifecycle(`Arquivo de log alterado para '${getLogFilePath() ?? "não configurado"}'`);
		}

		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_ENABLE}`)) {
			mcpLog.message(`O servidor MCP foi ${isEnabled() ? "habilitado" : "desabilitado"} nas configurações`);
			mcpLog.debug(`configuração ${CONFIG_SECTION}.${CONFIG_ENABLE} alterada (enabled=${isEnabled()})`);
			if (!isEnabled()) {
				await server.stop();
			}
			onDidChange.fire();
		}
	});

	const start = vscode.commands.registerCommand("totvs-developer-studio.mcp.start", async () => {
		mcpLog.message("Comando 'Iniciar servidor MCP' executado");
		mcpLog.debug("command totvs-developer-studio.mcp.start");
		try {
			if (server.isRunning) {
				vscode.window.showInformationMessage(`TOTVS MCP já está em execução em ${server.serverInfo?.url}`);
				return;
			}
			// A notificação de início é exibida pelo próprio servidor ao iniciar.
			await server.start();
		} catch (e) {
			mcpLog.error(`Não foi possível iniciar o servidor MCP: ${e instanceof Error ? e.message : String(e)}`);
			mcpLog.debug("command mcp.start falhou", errorText(e));
			vscode.window.showErrorMessage(`Falha ao iniciar o servidor MCP: ${e instanceof Error ? e.message : e}`);
		}
	});

	const stop = vscode.commands.registerCommand("totvs-developer-studio.mcp.stop", async () => {
		mcpLog.message("Comando 'Parar servidor MCP' executado");
		mcpLog.debug("command totvs-developer-studio.mcp.stop");
		await server.stop();
		vscode.window.showInformationMessage("TOTVS MCP parado.");
	});

	const showLog = vscode.commands.registerCommand("totvs-developer-studio.mcp.showLog", () => mcpLog.show(false));

	const logDisposable: vscode.Disposable = {
		dispose: () => {
			mcpLog.lifecycle("TOTVS MCP finalizado");
			mcpLog.debug("registerMcpServer: finalizando");
			mcpLog.dispose();
		}
	};

	return [server, onDidChange, providerRegistration, configListener, start, stop, showLog, logDisposable];
}
