import * as vscode from "vscode";
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
	"open-editors",
	"arquivos-abertos",
	"fontes-abertos",
	"arquivos abertos",
	"fontes abertos"
]);

/**
 * Checks whether the value represents the workspace target.
 * @param value Target value.
 * @returns True when the target represents the workspace.
 */
function isWorkspaceTargetAlias(value: string): boolean {
	return WORKSPACE_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Checks whether the value represents the open editors target.
 * @param value Target value.
 * @returns True when the target represents open editors.
 */
function isOpenEditorsTargetAlias(value: string): boolean {
	return OPEN_EDITORS_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Normalizes target keywords for case-insensitive comparison.
 * @param value Target value provided in the prompt.
 * @returns Target normalized to lowercase.
 */
function normalizeTargetKeyword(value: string): string {
	return value.trim().toLowerCase();
}

/**
 * Checks whether the value represents the current editor target.
 * @param value Target value.
 * @returns True when the target represents the current editor.
 */
function isCurrentEditorTargetAlias(value: string): boolean {
	return CURRENT_EDITOR_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Removes single/double quotes from the edges of the prompt value.
 * @param value Raw text provided by the user.
 * @returns Text without outer quotes.
 */
function stripQuotes(value: string): string {
	const trimmed: string = value.trim();
	if ((trimmed.startsWith("\"") && trimmed.endsWith("\"")) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
		return trimmed.slice(1, -1).trim();
	}

	return trimmed;
}

/**
 * Resolves the target label used in chat messages.
 * @param explicitTarget Target explicitly provided by the user.
 * @returns Resolved target label.
 */
function resolveTarget(explicitTarget?: string): string {
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
function resolveTargetUri(explicitTarget?: string): vscode.Uri | undefined {
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
 * Resolves a patch file path to an absolute file-system path.
 * @param explicitPath Patch path provided by prompt.
 * @returns Absolute fsPath for patch file when resolvable.
 */
function resolvePatchFilePath(explicitPath: string): string | undefined {
	const candidateUri: vscode.Uri | undefined = resolveTargetUri(explicitPath);

	if (!candidateUri || candidateUri.scheme !== "file") {
		return undefined;
	}

	return candidateUri.fsPath;
}
