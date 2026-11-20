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
 * Adds/updates the TOTVS MCP entry (current URL and token) in `.kiro/settings/mcp.json`
 * of the first workspace folder. The other entries of the file are preserved.
 */
export async function writeKiroMcpEntry(info: McpServerInfo): Promise<void> {
	const uri: vscode.Uri | undefined = configUri();
	if (!uri) {
		mcpLog.warn("Kiro: no workspace folder open; mcp.json was not updated");
		return;
	}

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
			headers: { Authorization: `Bearer ${info.token}` }
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
