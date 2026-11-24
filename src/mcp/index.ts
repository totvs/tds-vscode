import * as vscode from "vscode";
import { TdsMcpServer } from "./mcpServer";
import { MCP_SERVER_NAME, mcpServerVersion } from "./mcpTypes";
import { isKiro, removeKiroMcpEntry, resetKiroMcpState, setKiroMcpState, writeKiroMcpEntry } from "./kiroMcpConfig";
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
let activeServer: TdsMcpServer | undefined;

/**
 * Kiro: remove a entrada `totvs-mcp` de `.kiro/settings/mcp.json` e a decisão de liberar
 * todas as ferramentas. Se o servidor estiver em execução, a entrada é gravada de novo
 * (URL e token atuais) e a pergunta de liberação é refeita. Fora do Kiro, não faz nada.
 */
export async function resetKiroMcpEntry(): Promise<void> {
	if (!isKiro()) {
		return;
	}

	await resetKiroMcpState();
	await removeKiroMcpEntry();

	const info = activeServer?.isRunning ? activeServer.serverInfo : undefined;
	if (info) {
		await writeKiroMcpEntry(info);
	}
}

export function registerMcpServer(context: vscode.ExtensionContext): vscode.Disposable[] {
	setKiroMcpState(context.workspaceState);
	mcpLog.reset();
	mcpLog.lifecycle(
		`TOTVS MCP loaded (server ${isEnabled() ? "enabled" : "disabled"}, log level: ${getLogLevel()}, log file: ${getLogFilePath() ?? "not configured"})`
	);
	mcpLog.debug(`registerMcpServer (enabled=${isEnabled()}, log=${getLogLevel()}, logFile=${getLogFilePath() ?? "<disabled>"})`);

	const server = new TdsMcpServer();
	activeServer = server;
	const onDidChange = new vscode.EventEmitter<void>();

	const provider: vscode.McpServerDefinitionProvider<vscode.McpHttpServerDefinition> = {
		onDidChangeMcpServerDefinitions: onDidChange.event,

		provideMcpServerDefinitions: async () => {
			const enabled = isEnabled();
			mcpLog.message(`VS Code queried the available MCP servers (server ${enabled ? "enabled" : "disabled"})`);
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
						mcpServerVersion()
					)
				];
			} catch (e) {
				mcpLog.lifecycleError(`Could not start the MCP server: ${e instanceof Error ? e.message : String(e)}`);
				mcpLog.debug("provider.provideMcpServerDefinitions: start failed", errorText(e));
				return [];
			}
		},

		resolveMcpServerDefinition: async (definition) => {
			mcpLog.message("VS Code is preparing the connection to the MCP server");
			mcpLog.debug("provider.resolveMcpServerDefinition", definition.label);
			if (!isEnabled()) {
				mcpLog.warn("The MCP server is disabled in the settings");
				mcpLog.debug("provider.resolveMcpServerDefinition: disabled by configuration");
				return undefined;
			}
			const info = await server.start();
			definition.uri = vscode.Uri.parse(info.url);
			definition.headers = { Authorization: `Bearer ${info.token}` };
			return definition;
		}
	};

	// Kiro does not query the provider (it reads .kiro/settings/mcp.json): start the server
	// at once, so the entry (URL and token) is written to the file.
	const startForKiro = (): void => {
		if (isKiro() && isEnabled()) {
			server.start().catch((e) => mcpLog.error(`Could not start the MCP server: ${errorText(e)}`));
		}
	};
	startForKiro();

	const providerRegistration = vscode.lm.registerMcpServerDefinitionProvider(PROVIDER_ID, provider);

	const configListener = vscode.workspace.onDidChangeConfiguration(async (e) => {
		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_LOG}`)) {
			// Sempre registrado: é o próprio ajuste do nível de log.
			mcpLog.lifecycle(`Log level changed to '${getLogLevel()}'`);
		}

		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_LOG_FILE}`)) {
			mcpLog.lifecycle(`Log file changed to '${getLogFilePath() ?? "not configured"}'`);
		}

		if (e.affectsConfiguration(`${CONFIG_SECTION}.${CONFIG_ENABLE}`)) {
			mcpLog.message(`The MCP server was ${isEnabled() ? "enabled" : "disabled"} in the settings`);
			mcpLog.debug(`setting ${CONFIG_SECTION}.${CONFIG_ENABLE} changed (enabled=${isEnabled()})`);
			if (!isEnabled()) {
				await server.stop();
			} else {
				startForKiro();
			}
			onDidChange.fire();
		}
	});

	const start = vscode.commands.registerCommand("totvs-developer-studio.mcp.start", async () => {
		mcpLog.message("Command 'Start MCP server' executed");
		mcpLog.debug("command totvs-developer-studio.mcp.start");
		try {
			if (server.isRunning) {
				vscode.window.showInformationMessage(vscode.l10n.t("TOTVS MCP is already running at {0}", server.serverInfo?.url ?? ""));
				return;
			}
			// A notificação de início é exibida pelo próprio servidor ao iniciar.
			await server.start();
		} catch (e) {
			mcpLog.error(`Could not start the MCP server: ${e instanceof Error ? e.message : String(e)}`);
			mcpLog.debug("command mcp.start failed", errorText(e));
			vscode.window.showErrorMessage(vscode.l10n.t("Could not start the MCP server: {0}", e instanceof Error ? e.message : String(e)));
		}
	});

	const stop = vscode.commands.registerCommand("totvs-developer-studio.mcp.stop", async () => {
		mcpLog.message("Command 'Stop MCP server' executed");
		mcpLog.debug("command totvs-developer-studio.mcp.stop");
		await server.stop();
		vscode.window.showInformationMessage(vscode.l10n.t("TOTVS MCP stopped."));
	});

	const showLog = vscode.commands.registerCommand("totvs-developer-studio.mcp.showLog", () => mcpLog.show(false));

	const logDisposable: vscode.Disposable = {
		dispose: () => {
			mcpLog.lifecycle("TOTVS MCP finished");
			mcpLog.debug("registerMcpServer: finishing");
			mcpLog.dispose();
		}
	};

	return [server, onDidChange, providerRegistration, configListener, start, stop, showLog, logDisposable];
}
