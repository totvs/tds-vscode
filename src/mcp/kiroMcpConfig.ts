import * as vscode from "vscode";
import { McpServerInfo, MCP_SERVER_NAME } from "./mcpTypes";
import { mcpLog } from "./mcpLogger";

/** Name of the entry written in `mcpServers` of the Kiro configuration. */
export const KIRO_MCP_ENTRY_NAME: string = "totvs-mcp";

/**
 * Indicates whether the extension is running on Kiro.
 * Kiro reads the MCP servers from `.kiro/settings/mcp.json` (it does not use the
 * VS Code provider of MCP server definitions), so the file must be kept up to date.
 */
export function isKiro(): boolean {
	return vscode.env.appName.toLowerCase().includes("kiro");
}

function configUri(): vscode.Uri | undefined {
	const folder: vscode.WorkspaceFolder | undefined = vscode.workspace.workspaceFolders?.[0];
	return folder ? vscode.Uri.joinPath(folder.uri, ".kiro", "settings", "mcp.json") : undefined;
}

type KiroMcpConfig = { mcpServers?: Record<string, unknown>; [key: string]: unknown };

/**
 * Reads the configuration file. Returns `undefined` when it does not exist and `null` when it
 * cannot be interpreted (invalid JSON), in which case it must not be overwritten.
 */
async function readConfig(uri: vscode.Uri): Promise<KiroMcpConfig | undefined | null> {
	let text: string;
	try {
		text = Buffer.from(await vscode.workspace.fs.readFile(uri)).toString("utf8");
	} catch {
		return undefined;
	}

	if (text.trim().length === 0) {
		return {};
	}

	try {
		const parsed: unknown = JSON.parse(text.replace(/^\uFEFF/, ""));
		return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as KiroMcpConfig) : null;
	} catch {
		return null;
	}
}

async function writeConfig(uri: vscode.Uri, config: KiroMcpConfig): Promise<void> {
	await vscode.workspace.fs.createDirectory(vscode.Uri.joinPath(uri, ".."));
	await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(config, null, 2) + "\n", "utf8"));
}

/**
 * Tools registered by the MCP server (see `tools/index.ts`), auto-approved one by one in Kiro.
 * Keep in sync when adding/removing a tool (`tds_code_actions` is disabled).
 */
export const KIRO_AUTO_APPROVE_TOOLS: readonly string[] = [
	"tds_ping",
	"tds_compile",
	"tds_syntax_only",
	"tds_fix",
	"tds_validate_patch",
	"tds_apply_patch",
	"tds_document_symbols",
	"tds_definition",
	"tds_references",
	"tds_hover",
	"tds_completion",
	"tds_workspace_symbols",
	"tds_rename_symbol",
	"tds_format_document",
	"tds_signature_help",
	"tds_help"
];

/** Key (workspaceState) with the user's decision about auto-approving all the tools. */
const AUTO_APPROVE_KEY: string = "tds.mcp.kiro.autoApprove";

/** `all`: auto-approve every tool; `ask`: Kiro asks before each use. `undefined`: not decided yet. */
type AutoApproveDecision = "all" | "ask";

let state: vscode.Memento | undefined;
let lastInfo: McpServerInfo | undefined;
let askPending: boolean = false;

/** Sets the storage used to remember the auto-approve decision of the workspace. */
export function setKiroMcpState(memento: vscode.Memento): void {
	state = memento;
}

/** Forgets the auto-approve decision of the workspace (it is asked again on the next write). */
export async function resetKiroMcpState(): Promise<void> {
	await state?.update(AUTO_APPROVE_KEY, undefined);
}

/**
 * Asks the user whether Kiro may run all the TOTVS MCP tools without confirmation.
 * It does not block the server start: the entry is written first without `autoApprove`
 * and rewritten when the user answers "all".
 */
async function askAutoApprove(): Promise<void> {
	if (askPending || !state) {
		return;
	}
	askPending = true;
	try {
		const all: string = "Liberar todas";
		const ask: string = "Perguntar a cada uso";
		const answer: string | undefined = await vscode.window.showWarningMessage(
			"Deseja liberar todas as ferramentas do TOTVS MCP no Kiro, sem pedir confirmação a cada uso?",
			{
				modal: true,
				detail:
					"Isso inclui tds_apply_patch (altera o RPO) e tds_fix (altera arquivos). " +
					"Se você escolher 'Perguntar a cada uso', o Kiro pede confirmação antes de executar cada ferramenta."
			},
			all,
			ask
		);
		if (answer === undefined) {
			return; // Fechou a mensagem: pergunta de novo na próxima inicialização.
		}

		const decision: AutoApproveDecision = answer === all ? "all" : "ask";
		await state.update(AUTO_APPROVE_KEY, decision);
		mcpLog.lifecycle(`Kiro: auto-approve of the tools set to '${decision}'`);

		const uri: vscode.Uri | undefined = configUri();
		if (decision === "all" && uri && lastInfo) {
			await writeEntry(uri, lastInfo, true);
		}
	} finally {
		askPending = false;
	}
}

/**
 * Adds/updates the TOTVS MCP entry (current URL and token) in `.kiro/settings/mcp.json`
 * of the first workspace folder. The other entries of the file are preserved.
 * The entry only gets `autoApprove` (every tool listed by name) when the user chose to allow all the tools.
 */
export async function writeKiroMcpEntry(info: McpServerInfo): Promise<void> {
	const uri: vscode.Uri | undefined = configUri();
	if (!uri) {
		mcpLog.warn("Kiro: no workspace folder open; mcp.json was not updated");
		return;
	}

	lastInfo = info;
	const decision: AutoApproveDecision | undefined = state?.get<AutoApproveDecision>(AUTO_APPROVE_KEY);
	await writeEntry(uri, info, decision === "all");

	if (decision === undefined) {
		void askAutoApprove();
	}
}

async function writeEntry(uri: vscode.Uri, info: McpServerInfo, autoApproveAll: boolean): Promise<void> {
	try {
		const config: KiroMcpConfig | undefined | null = await readConfig(uri);
		if (config === null) {
			mcpLog.warn(`Kiro: ${uri.fsPath} is not a valid JSON; it was not updated. Add the TOTVS MCP manually (${info.url})`);
			return;
		}

		const next: KiroMcpConfig = config ?? {};
		const servers: Record<string, unknown> = { ...(next.mcpServers ?? {}) };
		servers[KIRO_MCP_ENTRY_NAME] = {
			url: info.url,
			headers: { Authorization: `Bearer ${info.token}` },
			...(autoApproveAll ? { autoApprove: [...KIRO_AUTO_APPROVE_TOOLS] } : {})
		};
		next.mcpServers = servers;

		await writeConfig(uri, next);
		mcpLog.lifecycle(`Kiro: '${KIRO_MCP_ENTRY_NAME}' entry written in ${uri.fsPath} (${MCP_SERVER_NAME}). The file has the access token: do not commit it`);
	} catch (e) {
		mcpLog.error(`Kiro: could not update ${uri.fsPath}: ${e instanceof Error ? e.message : String(e)}`);
	}
}

/** Removes the TOTVS MCP entry from `.kiro/settings/mcp.json` (when it exists). */
export async function removeKiroMcpEntry(): Promise<void> {
	const uri: vscode.Uri | undefined = configUri();
	if (!uri) {
		return;
	}

	try {
		const config: KiroMcpConfig | undefined | null = await readConfig(uri);
		if (!config || !config.mcpServers || !(KIRO_MCP_ENTRY_NAME in config.mcpServers)) {
			return;
		}

		const servers: Record<string, unknown> = { ...config.mcpServers };
		delete servers[KIRO_MCP_ENTRY_NAME];
		config.mcpServers = servers;

		await writeConfig(uri, config);
		mcpLog.lifecycle(`Kiro: '${KIRO_MCP_ENTRY_NAME}' entry removed from ${uri.fsPath}`);
	} catch (e) {
		mcpLog.error(`Kiro: could not update ${uri.fsPath}: ${e instanceof Error ? e.message : String(e)}`);
	}
}
