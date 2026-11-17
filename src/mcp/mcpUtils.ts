import * as vscode from "vscode";
import * as fs from "fs";
import path from "path";

export const REBUILD_WORKSPACE_COMMAND: string = "totvs-developer-studio.rebuild.workspace";
export const REBUILD_OPEN_EDITORS_COMMAND: string = "totvs-developer-studio.rebuild.openEditors";
export const REBUILD_FILE_COMMAND: string = "totvs-developer-studio.rebuild.file";
export const SYNTAX_ONLY_FILE_COMMAND: string = "totvs-developer-studio.syntax-only.file";
export const MAX_DIAGNOSTICS_TO_SHOW: number = 20;

export const WORKSPACE_TARGET_ALIASES: Set<string> = new Set([
	"workspace",
	"ws",
	"all"
]);

export const CURRENT_EDITOR_TARGET_ALIASES: Set<string> = new Set([
	"current",
	"editor"
]);

export const OPEN_EDITORS_TARGET_ALIASES: Set<string> = new Set([
	"open-files",
	"open-editors"
]);

export const DEFAULT_FLAG_OPTIONS: FlagOptions = {
	only: "all",
	sort: "none",
	format: "markdown",
	syntaxOnly: false,
	applyOld: false,
	applied: []
};

export type FlagOptions = {
	only: "all" | "error" | "warning";
	max?: number;
	sort: "none" | "file" | "severity";
	format: "markdown" | "json";
	applyOld: boolean;
	syntaxOnly?: boolean;
	applied?: string[];
};

/**
 * Checks whether the value represents the current editor target.
 * @param value Target value.
 * @returns True when the target represents the current editor.
 */
export function isCurrentEditorTargetAlias(value: string): boolean {
	return CURRENT_EDITOR_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Checks whether the value represents the open editors target.
 * @param value Target value.
 * @returns True when the target represents open editors.
 */
export function isOpenEditorsTargetAlias(value: string): boolean {
	return OPEN_EDITORS_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Checks whether the value represents the workspace target.
 * @param value Target value.
 * @returns True when the target represents the workspace.
 */
export function isWorkspaceTargetAlias(value: string): boolean {
	return WORKSPACE_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Normalizes target keywords for case-insensitive comparison.
 * @param value Target value provided in the prompt.
 * @returns Target normalized to lowercase.
 */
export function normalizeTargetKeyword(value: string): string {
	return stripQuotes(value).trim().toLowerCase();
}

/**
 * Resolves a patch file path to an absolute file-system path.
 * @param explicitPath Patch path provided by prompt.
 * @returns Absolute fsPath for patch file when resolvable.
 */
export function resolvePatchFilePath(explicitPath: string): string | undefined {
	const candidateUri: vscode.Uri | undefined = resolveTargetUri(explicitPath);

	if (!candidateUri || candidateUri.scheme !== "file") {
		return undefined;
	}

	return candidateUri.fsPath;
}

/**
 * Resolves the target label used in chat messages.
 * @param explicitTarget Target explicitly provided by the user.
 * @returns Resolved target label.
*/
export function resolveTarget(explicitTarget?: string): string {
	if (explicitTarget?.trim()) {
		const target: string = stripQuotes(explicitTarget);
		if (isWorkspaceTargetAlias(target)) {
			return "workspace";
		}

		if (isOpenEditorsTargetAlias(target)) {
			return "open-editors";
		}
		if (isCurrentEditorTargetAlias(target)) {
			const activeDocument: vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document;
			if (!activeDocument) {
				return "workspace";
			}

			if (activeDocument.uri.scheme === "file") {
				return vscode.workspace.asRelativePath(activeDocument.uri, false);
			}

			return activeDocument.uri.toString(true);
		}

		return target;
	}

	const activeDocument: vscode.TextDocument | undefined = vscode.window.activeTextEditor?.document;
	if (!activeDocument) {
		return "workspace";
	}

	if (activeDocument.uri.scheme === "file") {
		return vscode.workspace.asRelativePath(activeDocument.uri, false);
	}

	return activeDocument.uri.toString(true);
}

/**
 * Resolves the target into a real URI used to run the build command.
 * @param explicitTarget Target explicitly provided by the user.
 * @returns Resolved URI for execution, when applicable.
 */
export function resolveTargetUri(explicitTarget?: string): vscode.Uri | undefined {
	const trimmedTarget: string | undefined = explicitTarget?.trim();
	if (trimmedTarget) {
		const target: string = stripQuotes(trimmedTarget);
		if (isWorkspaceTargetAlias(target)) {
			return undefined;
		}

		if (isOpenEditorsTargetAlias(target)) {
			return undefined;
		}

		if (isCurrentEditorTargetAlias(target)) {
			return vscode.window.activeTextEditor?.document.uri;
		}

		const isWindowsAbsolutePath: boolean = /^[a-zA-Z]:[\\/]/.test(target);
		if (isWindowsAbsolutePath) {
			return vscode.Uri.file(target);
		}

		const hasUriScheme: boolean = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(target);
		if (hasUriScheme) {
			return vscode.Uri.parse(target, true);
		}

		const workspaceFolder: vscode.WorkspaceFolder | undefined = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const fullPath: string = path.resolve(workspaceFolder.uri.fsPath, target);
			return vscode.Uri.file(fullPath);
		}

		return vscode.Uri.file(path.resolve(target));
	}

	return vscode.window.activeTextEditor?.document.uri;
}

/** Extensões de fontes AdvPL/TLPP (mesma lista de `Utils.isAdvPlSource`). */
const ADVPL_SOURCE_EXTENSIONS: Set<string> = new Set([
	".th", ".ch", ".prw", ".prg", ".prx", ".ppx", ".ppp", ".tlpp", ".aph", ".ahu", ".apl", ".apw"
]);

/** Extensões de fontes 4GL/Logix (mesma lista de `Utils.is4glSource`). */
const LOGIX_SOURCE_EXTENSIONS: Set<string> = new Set([".4gl", ".per"]);

/**
 * Indica se a URI aponta para um fonte AdvPL/TLPP/4GL (pela extensão).
 * @param uri URI candidata.
 * @returns True quando é um fonte AdvPL/TLPP/4GL.
 */
export function isTotvsSourceUri(uri: vscode.Uri): boolean {
	const ext: string = path.extname(uri.path).toLowerCase();
	return ADVPL_SOURCE_EXTENSIONS.has(ext) || LOGIX_SOURCE_EXTENSIONS.has(ext);
}

/**
 * Indica se a extensão da URI consta em `totvsLanguageServer.folder.extensionsAllowed`
 * (comparação sem diferenciar maiúsculas/minúsculas).
 * @param uri URI candidata.
 * @returns True quando a extensão está na lista de extensões permitidas.
 */
export function isExtensionAllowedUri(uri: vscode.Uri): boolean {
	const ext: string = path.extname(uri.path).toLowerCase();
	if (!ext) {
		return false;
	}

	const allowed: string[] = vscode.workspace
		.getConfiguration("totvsLanguageServer", uri)
		.get<string[]>("folder.extensionsAllowed", []);
	return allowed.some((item) => {
		const value: string = item.trim().toLowerCase();
		return (value.startsWith(".") ? value : `.${value}`) === ext;
	});
}

/**
 * Mensagem padrão das ferramentas tds_* quando o contexto não é um fonte AdvPL/TLPP/4GL.
 * @param uri URI ignorada.
 * @returns Texto para o resultado da ferramenta.
 */
export function notTotvsSourceMessage(uri: vscode.Uri): string {
	return `Ignored: '${toWorkspaceRelativePath(uri)}' is not an AdvPL/TLPP/4GL source.`;
}

/**
 * Converts a file/folder (path, file URI or Uri) to the path relative to the workspace, with `/` separators.
 * Resources outside the workspace keep their full path.
 * @param value Path, URI text or Uri.
 * @returns Workspace relative path (or the full path/URI when it is outside the workspace).
 */
export function toWorkspaceRelativePath(value: string | vscode.Uri | undefined): string {
	if (!value) {
		return "";
	}

	try {
		let uri: vscode.Uri;
		if (typeof value === "string") {
			uri = /^[a-zA-Z][a-zA-Z\d+.-]+:\/\//.test(value) ? vscode.Uri.parse(value, true) : vscode.Uri.file(value);
		} else {
			uri = value;
		}
		return uri.scheme === "file" ? vscode.workspace.asRelativePath(uri, false).replace(/\\/g, "/") : uri.toString(true);
	} catch {
		return String(value);
	}
}

/**
 * Removes single/double quotes from the edges of the prompt value.
 * @param value Raw text provided by the user.
 * @returns Text without outer quotes.
 */
export function stripQuotes(value: string): string {
	const trimmed: string = value.trim();
	if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
		return trimmed.slice(1, -1).trim();
	}

	return trimmed;
}

/**
 * Checks whether the URI points to an existing directory on disk.
 * @param uri Candidate URI.
 * @returns True when the URI is an existing directory.
 */
export function isDirectoryUri(uri: vscode.Uri | undefined): boolean {
	if (!uri || uri.scheme !== "file") {
		return false;
	}

	try {
		return fs.existsSync(uri.fsPath) && fs.statSync(uri.fsPath).isDirectory();
	} catch {
		return false;
	}
}

