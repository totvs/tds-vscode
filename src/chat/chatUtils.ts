import * as vscode from "vscode";
import * as fs from "fs";
import path from "path";

export const COMPILER_TOOL_NAME: string = "tds-lm-tools";
export const COMPILER_PARTICIPANT_ID: string = "tds-vscode.tools";
export const COMPILER_COMMAND: string = "compiler";
export const SYNTAX_ONLY_COMMAND: string = "syntax-only";
export const APPLY_PATCH_COMMAND: string = "apply-patch";
export const VALIDATE_PATCH_COMMAND: string = "validate-patch";
export const HELP_COMMAND: string = "help";
export const REBUILD_WORKSPACE_COMMAND: string = "totvs-developer-studio.rebuild.workspace";
export const REBUILD_OPEN_EDITORS_COMMAND: string = "totvs-developer-studio.rebuild.openEditors";
export const REBUILD_FILE_COMMAND: string = "totvs-developer-studio.rebuild.file";
export const SYNTAX_ONLY_FILE_COMMAND: string = "totvs-developer-studio.syntax-only.file";
export const MAX_DIAGNOSTICS_TO_SHOW: number = 20;
export const DIAGNOSTIC_WAIT_TIMEOUT_MS: number = 10000;
export const DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER: number = 60000;
export const DIAGNOSTIC_IDLE_WINDOW_MS: number = 5000;

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

export type ChatCompilerToolInput = {
	command: string;
	target: string;
	flags: FlagOptions;
};

export const DEFAULT_FLAG_OPTIONS: FlagOptions = {
	only: "all",
	sort: "none",
	format: "markdown",
	syntaxOnly: false,
	applyOld: false,
	applied: []
};

export const DEFAULT_COMPILER_TOOL_INPUT: ChatCompilerToolInput = {
	command: COMPILER_COMMAND,
	target: "",
	flags: { ...DEFAULT_FLAG_OPTIONS }
};

export type DiagnosticEntry = {
	uri: vscode.Uri;
	diagnostic: vscode.Diagnostic;
};

export type FlagOptions = {
	only: "all" | "error" | "warning";
	max?: number;
	sort: "none" | "file" | "severity";
	format: "markdown" | "json";
	applyOld: boolean;
	syntaxOnly?: boolean;
	applied: string[];
};

export type DiagnosticsWaitResult = {
	changed: boolean;
	timedOut: boolean;
	canceled: boolean;
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

export function normalizeCommand(value: string): string {
	if (value.startsWith("/")) {
		value = value.slice(1);
	}

	return value.trim().toLowerCase();
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

/**
 * Checks whether a URI is inside a parent folder (recursively).
 * @param parentFolder Base folder URI.
 * @param targetUri Resource URI to validate.
 * @returns True when targetUri is contained within the parent folder.
 */
export function isUriInsideFolder(parentFolder: vscode.Uri, targetUri: vscode.Uri): boolean {
	if (parentFolder.scheme !== "file" || targetUri.scheme !== "file") {
		return false;
	}

	const parentPath: string = path.resolve(parentFolder.fsPath).toLowerCase();
	const targetPath: string = path.resolve(targetUri.fsPath).toLowerCase();
	if (parentPath === targetPath) {
		return true;
	}

	const prefix: string = parentPath.endsWith(path.sep) ? parentPath : `${parentPath}${path.sep}`;
	return targetPath.startsWith(prefix);
}

/**
 * Compares two URIs, using case-insensitive comparison for file paths.
 * @param left First URI.
 * @param right Second URI.
 * @returns True when the URIs represent the same resource.
 */
export function uriEquals(left: vscode.Uri, right: vscode.Uri): boolean {
	if (left.toString() === right.toString()) {
		return true;
	}

	if (left.scheme === "file" && right.scheme === "file") {
		return left.fsPath.toLowerCase() === right.fsPath.toLowerCase();
	}

	return false;
}

/**
 * Indicates whether the URI belongs to an open workspace folder.
 * @param uri URI to validate.
 * @returns True when the URI belongs to the workspace.
 */
export function isWorkspaceUri(uri: vscode.Uri): boolean {
	if (uri.scheme !== "file") {
		return false;
	}

	const folder: vscode.WorkspaceFolder | undefined = vscode.workspace.getWorkspaceFolder(uri);
	return !!folder;
}

/**
 * Generates a clickable Markdown link for a diagnostic file and line.
 * @param uri Resource URI with the diagnostic.
 * @param relativePath Relative path for display.
 * @param line 1-based line for navigation.
 * @returns Markdown link to the problem location.
 */
export function toLocationLink(uri: vscode.Uri, relativePath: string, line: number): string {
	if (uri.scheme !== "file") {
		return `${relativePath}:${line}`;
	}

	const locationUri: string = uri.with({ fragment: `L${line}` }).toString(true);
	return `[${relativePath}:${line}](${locationUri})`;
}

/**
 * Returns a standardized label for diagnostic severity.
 * @param severity Diagnostic severity.
 * @returns Standardized text for chat display.
 */
export function severityLabel(severity: vscode.DiagnosticSeverity): string {
	switch (severity) {
		case vscode.DiagnosticSeverity.Error:
			return "ERROR";
		case vscode.DiagnosticSeverity.Warning:
			return "WARN";
		case vscode.DiagnosticSeverity.Information:
			return "INFO";
		case vscode.DiagnosticSeverity.Hint:
			return "HINT";
		default:
			return "UNKNOWN";
	}
}
