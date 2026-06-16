import path from "path";
import * as vscode from "vscode";
import * as fs from "fs";
import { sendPatchApplyRequest, sendPatchValidateRequest, ValidResponse } from "../protocolMessages";
import { ServersConfig } from "../utils";
import { APPLY_PATCH_COMMAND, COMPILER_COMMAND, COMPILER_PARTICIPANT_ID, COMPILER_TOOL_NAME, CURRENT_EDITOR_TARGET_ALIASES, HELP_COMMAND, OPEN_EDITORS_TARGET_ALIASES, REBUILD_FILE_COMMAND, REBUILD_OPEN_EDITORS_COMMAND, REBUILD_WORKSPACE_COMMAND, SYNTAX_ONLY_COMMAND, SYNTAX_ONLY_FILE_COMMAND, VALIDATE_PATCH_COMMAND, WORKSPACE_TARGET_ALIASES } from "./chatToolsConst";

type ChatCompilerToolInput = {
	command?: string;
	target?: string;
	flags?: string[];
};

type DiagnosticEntry = {
	uri: vscode.Uri;
	diagnostic: vscode.Diagnostic;
};

type FlagOptions = {
	only: "all" | "error" | "warning";
	max?: number;
	sort: "none" | "file" | "severity";
	format: "markdown" | "json";
	applyOld: boolean;
	syntaxOnly?: boolean;
	applied: string[];
};

type DiagnosticsWaitResult = {
	changed: boolean;
	timedOut: boolean;
	canceled: boolean;
};

const MAX_DIAGNOSTICS_TO_SHOW: number = 20;
const DIAGNOSTIC_WAIT_TIMEOUT_MS: number = 10000;
const DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER: number = 60000;
const DIAGNOSTIC_IDLE_WINDOW_MS: number = 5000;

const DEFAULT_FLAG_OPTIONS: FlagOptions = {
	only: "all",
	sort: "none",
	format: "markdown",
	syntaxOnly: false,
	applyOld: false,
	applied: []
};

/**
 * Heuristic to decide whether the text looks like a direct path/target.
 * @param value Text provided in the prompt.
 * @returns True when the text looks like a path, alias, or valid target.
 */
function looksLikePathOrTarget(value: string): boolean {
	const normalized: string = normalizeTargetKeyword(value);
	if (
		isWorkspaceTargetAlias(normalized) ||
		isCurrentEditorTargetAlias(normalized) ||
		isOpenEditorsTargetAlias(normalized)
	) {
		return true;
	}

	if (/^[a-zA-Z]:[\\/]/.test(value)) {
		return true;
	}

	if (/^\.{1,2}[\\/]/.test(value)) {
		return true;
	}

	if (value.includes("\\") || value.includes("/")) {
		return true;
	}

	if (/\.[a-zA-Z0-9_-]+$/.test(value)) {
		return true;
	}

	return false;
}

/**
 * Extracts target from prompt patterns like target=..., file:..., folder:...
 * or a single value that looks like a path.
 * @param prompt Full prompt sent in the chat.
 * @returns Extracted target when found.
 */
function extractTargetFromPrompt(prompt: string): string | undefined {
	const directiveMatch: RegExpMatchArray | null = prompt.match(
		/(?:^|\s)(?:target|arquivo|file|path|pasta|folder)\s*[:=]\s*("[^"]+"|"[^"]+"|\S+)/i
	);
	if (directiveMatch) {
		return stripQuotes(directiveMatch[1]);
	}

	const normalizedValue: string = normalizeTargetKeyword(stripQuotes(prompt));
	if (
		isWorkspaceTargetAlias(normalizedValue) ||
		isCurrentEditorTargetAlias(normalizedValue) ||
		isOpenEditorsTargetAlias(normalizedValue)
	) {
		return normalizedValue;
	}

	const value: string = stripQuotes(prompt);
	if (!value.includes(" ")) {
		if (!/^(only|max|sort)\s*[:=]/i.test(value)) {
			return value;
		}
	}

	if (!value.includes(" ") && looksLikePathOrTarget(value)) {
		return value;
	}

	return undefined;
}

/**
 * Extracts patch file path from a standalone prompt value.
 * Supported input examples: relative path, absolute path, or quoted path.
 * @param prompt Full prompt sent in the chat.
 * @returns Extracted patch file path when found.
 */
function extractPatchFileFromPrompt(prompt: string): string | undefined {
	const value: string = stripQuotes(prompt);
	if (!value) {
		return undefined;
	}

	const quotedPrompt: string = prompt.trim();
	if (
		(quotedPrompt.startsWith("\"") && quotedPrompt.endsWith("\"")) ||
		(quotedPrompt.startsWith("'") && quotedPrompt.endsWith("'"))
	) {
		return value;
	}

	if (!value.includes(" ")) {
		return value;
	}

	return undefined;
}

/**
 * Parses diagnostic filter/sort flags from the prompt.
 * @param flags Raw list of flags received by the tool.
 * @returns Normalized filter/sort options and the list of applied flags.
 */
function parseFlagOptions(flags: string[] | undefined): FlagOptions {
	if (!flags || flags.length === 0) {
		return { ...DEFAULT_FLAG_OPTIONS, applied: [] };
	}

	const joined: string = flags.join(" ");
	const options: FlagOptions = {
		...DEFAULT_FLAG_OPTIONS,
		applied: []
	};
	const regex: RegExp = /(syntaxOnly|only|max|sort|format|applyOld)\s*[:=]\s*("[^"]+"|"[^"]+"|\S+)/gi;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(joined)) !== null) {
		const key: string = match[1].toLowerCase();
		const rawValue: string = stripQuotes(match[2]);
		const value: string = rawValue.toLowerCase();

		if (key === "syntaxonly") {
			options.syntaxOnly = value === "true";
			options.applied.push("syntaxOnly=true");
		}

		if (key === "applyold") {
			options.applyOld = value === "true";
			options.applied.push("applyOld=true");
		}

		if (key === "only") {
			if (value === "error" || value === "errors") {
				options.only = "error";
				options.applied.push("only=error");
			} else if (value === "warning" || value === "warnings" || value === "warn") {
				options.only = "warning";
				options.applied.push("only=warning");
			} else if (value === "all") {
				options.only = "all";
				options.applied.push("only=all");
			}
		}

		if (key === "max") {
			const max: number = Number.parseInt(value, 10);
			if (!Number.isNaN(max) && max > 0) {
				options.max = max;
				options.applied.push(`max=${max}`);
			}
		}

		if (key === "sort") {
			if (value === "file" || value === "severity" || value === "none") {
				options.sort = value;
				options.applied.push(`sort=${value}`);
			}
		}

		if (key === "format") {
			if (value === "markdown" || value === "json") {
				options.format = value;
				options.applied.push(`format=${value}`);
			}
		}
	}

	return options;
}

/**
 * Validates if a file extension is supported by patch validation flow.
 * @param filePath Candidate file path.
 * @returns True when extension is accepted for patch validation.
 */
function isSupportedPatchFile(filePath: string): boolean {
	const extension: string = path.extname(filePath).toLowerCase();
	return extension === ".ptm" || extension === ".zip" || extension === ".upd";
}

/**
 * Runs patch validation command from chat.
 * Validates prompt/path/extension and then requests server-side validation.
 * @param prompt Raw prompt text.
 * @param token Request cancellation token.
 * @param isError Mutable wrapper used as out parameter.
 * The function updates `isError.value` to indicate whether the validation flow ended with an error.
 * @returns Status text for chat output.
 */
async function handleValidPatchCommand(
	prompt: string | undefined,
	token: vscode.CancellationToken,
	isError: { value: boolean }
): Promise<string> {
	isError.value = true;

	if (token.isCancellationRequested) {
		return "Validate patch command canceled by user.";
	}

	const patchFromPrompt: string | undefined = prompt?.trim() ? extractPatchFileFromPrompt(prompt.trim()) : undefined;
	if (!patchFromPrompt) {
		return "Patch file is required. Usage: /validate-patch patches/fix.ptm or /validate-patch c:/patches/fix.zip";
	}

	const patchFilePath: string | undefined = resolvePatchFilePath(patchFromPrompt);
	if (!patchFilePath) {
		return `Unable to resolve patch file path: ${patchFromPrompt}`;
	}

	if (!fs.existsSync(patchFilePath)) {
		return `Patch file not found: ${patchFilePath}`;
	}

	let fileStats: fs.Stats;
	try {
		fileStats = fs.statSync(patchFilePath);
	} catch (error) {
		return `Unable to access patch file: ${error instanceof Error ? error.message : String(error)}`;
	}

	if (!fileStats.isFile()) {
		return `Invalid patch path (not a file): ${patchFilePath}`;
	}

	if (!isSupportedPatchFile(patchFilePath)) {
		return `Unsupported patch extension. Use .ptm, .zip, or .upd files: ${patchFilePath}`;
	}

	try {
		const server = ServersConfig.getCurrentServer();
		const validationResult: ValidResponse = await sendPatchValidateRequest(server, patchFilePath);

		if (validationResult.error !== 0) {
			isError.value = true;
			return [
				`Patch validation failed for ${vscode.workspace.asRelativePath(patchFilePath, false)}.`,
				`- Code: ${validationResult.errorCode}`,
				`- Message: ${validationResult.message || "Unknown validation error."}`,
				"",
				"Check the selected server/environment and patch compatibility before retrying."
			].join("\n");
		}

		return `Patch validated successfully: ${vscode.workspace.asRelativePath(patchFilePath, false)}.`;
	} catch (error) {
		isError.value = true;
		return `Error during patch validation: ${error instanceof Error ? error.message : String(error)}`;
	}
}

async function handleApplyPatchCommand(
	prompt: string | undefined,
	token: vscode.CancellationToken,
	isError: { value: boolean },
	applyOld: boolean
): Promise<string> {
	isError.value = true;

	if (token.isCancellationRequested) {
		return "Apply patch command canceled by user.";
	}

	const patchFromPrompt: string | undefined = prompt?.trim() ? extractPatchFileFromPrompt(prompt.trim()) : undefined;
	if (!patchFromPrompt) {
		return "Patch file is required. Usage: /apply-patch patches/fix.ptm or /apply-patch c:/patches/fix.zip";
	}

	const patchFilePath: string | undefined = resolvePatchFilePath(patchFromPrompt);
	if (!patchFilePath) {
		return `Unable to resolve patch file path: ${patchFromPrompt}`;
	}

	if (!fs.existsSync(patchFilePath)) {
		return `Patch file not found: ${patchFilePath}`;
	}

	let fileStats: fs.Stats;
	try {
		fileStats = fs.statSync(patchFilePath);
	} catch (error) {
		return `Unable to access patch file: ${error instanceof Error ? error.message : String(error)}`;
	}

	if (!fileStats.isFile()) {
		return `Invalid patch path (not a file): ${patchFilePath}`;
	}

	if (!isSupportedPatchFile(patchFilePath)) {
		return `Unsupported patch extension. Use .ptm, .zip, or .upd files: ${patchFilePath}`;
	}

	try {
		const server = ServersConfig.getCurrentServer();
		const validationResult: ValidResponse = await sendPatchApplyRequest(server, patchFilePath, applyOld);

		if (validationResult.error !== 0) {
			isError.value = true;
			return [
				`Patch validation failed for ${vscode.workspace.asRelativePath(patchFilePath, false)}.`,
				`- Code: ${validationResult.errorCode}`,
				`- Message: ${validationResult.message || "Unknown validation error."}`,
				"",
				"Check the selected server/environment and patch compatibility before retrying."
			].join("\n");
		}

		return `Patch validated successfully: ${vscode.workspace.asRelativePath(patchFilePath, false)}.`;
	} catch (error) {
		isError.value = true;
		return `Error during patch validation: ${error instanceof Error ? error.message : String(error)}`;
	}
}

/**
 * Compares two URIs, using case-insensitive comparison for file paths.
 * @param left First URI.
 * @param right Second URI.
 * @returns True when the URIs represent the same resource.
 */
function uriEquals(left: vscode.Uri, right: vscode.Uri): boolean {
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
function isWorkspaceUri(uri: vscode.Uri): boolean {
	if (uri.scheme !== "file") {
		return false;
	}

	const folder: vscode.WorkspaceFolder | undefined = vscode.workspace.getWorkspaceFolder(uri);
	return !!folder;
}

/**
 * Checks whether a URI is inside a parent folder (recursively).
 * @param parentFolder Base folder URI.
 * @param targetUri Resource URI to validate.
 * @returns True when targetUri is contained within the parent folder.
 */
function isUriInsideFolder(parentFolder: vscode.Uri, targetUri: vscode.Uri): boolean {
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
 * Checks whether the URI points to an existing directory on disk.
 * @param uri Candidate URI.
 * @returns True when the URI is an existing directory.
 */
function isDirectoryUri(uri: vscode.Uri | undefined): boolean {
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
 * Collects diagnostics only for open documents.
 * @returns List of diagnostics eligible for chat display.
 */
function collectDiagnosticsForOpenEditors(): DiagnosticEntry[] {
	const openDocumentKeys: Set<string> = new Set(
		vscode.workspace.textDocuments.map((document) =>
			document.uri.scheme === "file"
				? `file:${document.uri.fsPath.toLowerCase()}`
				: `uri:${document.uri.toString(true)}`
		)
	);

	const diagnosticsByUri: [vscode.Uri, vscode.Diagnostic[]][] = vscode.languages.getDiagnostics();
	const filtered: [vscode.Uri, vscode.Diagnostic[]][] = diagnosticsByUri.filter(([uri]) => {
		if (uri.scheme === "file") {
			return openDocumentKeys.has(`file:${uri.fsPath.toLowerCase()}`);
		}

		return openDocumentKeys.has(`uri:${uri.toString(true)}`);
	});

	const entries: DiagnosticEntry[] = [];
	for (const [uri, diagnostics] of filtered) {
		for (const diagnostic of diagnostics) {
			if (
				diagnostic.severity === vscode.DiagnosticSeverity.Error ||
				diagnostic.severity === vscode.DiagnosticSeverity.Warning
			) {
				entries.push({ uri, diagnostic });
			}
		}
	}

	return entries;
}

/**
 * Collects error/warning diagnostics for a file, folder, or workspace.
 * @param targetUri Target URI for build.
 * @param isWorkspaceTarget Indicates whether the build was requested for the entire workspace.
 * @returns List of diagnostics eligible for chat display.
 */
function collectDiagnostics(targetUri: vscode.Uri | undefined, isWorkspaceTarget: boolean): DiagnosticEntry[] {
	const diagnosticsByUri: [vscode.Uri, vscode.Diagnostic[]][] = vscode.languages.getDiagnostics();
	let filtered: [vscode.Uri, vscode.Diagnostic[]][] = diagnosticsByUri;

	if (!isWorkspaceTarget && targetUri) {
		if (isDirectoryUri(targetUri)) {
			filtered = diagnosticsByUri.filter(([uri]) => isUriInsideFolder(targetUri, uri));
		} else {
			filtered = diagnosticsByUri.filter(([uri]) => uriEquals(uri, targetUri));
		}

		if (filtered.length === 0) {
			filtered = diagnosticsByUri.filter(([uri]) => isWorkspaceUri(uri));
		}
	} else {
		filtered = diagnosticsByUri.filter(([uri]) => isWorkspaceUri(uri));
	}

	const entries: DiagnosticEntry[] = [];
	for (const [uri, diagnostics] of filtered) {
		for (const diagnostic of diagnostics) {
			if (
				diagnostic.severity === vscode.DiagnosticSeverity.Error ||
				diagnostic.severity === vscode.DiagnosticSeverity.Warning
			) {
				entries.push({ uri, diagnostic });
			}
		}
	}

	return entries;
}


/**
 * Applies diagnostic filters and sorting based on provided flags.
 * @param entries Collected diagnostics.
 * @param options Filter/sort options.
 * @returns Filtered and sorted diagnostics.
 */
function applyDiagnosticFilterOptions(
	entries: DiagnosticEntry[],
	options: FlagOptions
): DiagnosticEntry[] {
	let result: DiagnosticEntry[] = entries.slice();

	if (options.only === "error") {
		result = result.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Error);
	} else if (options.only === "warning") {
		result = result.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Warning);
	}

	if (options.sort === "file") {
		result.sort((a, b) => {
			const pathA: string = a.uri.scheme === "file" ? a.uri.fsPath.toLowerCase() : a.uri.toString(true).toLowerCase();
			const pathB: string = b.uri.scheme === "file" ? b.uri.fsPath.toLowerCase() : b.uri.toString(true).toLowerCase();
			if (pathA < pathB) {
				return -1;
			}
			if (pathA > pathB) {
				return 1;
			}

			const lineA: number = a.diagnostic.range.start.line;
			const lineB: number = b.diagnostic.range.start.line;
			return lineA - lineB;
		});
	} else if (options.sort === "severity") {
		result.sort((a, b) => {
			const severityA: vscode.DiagnosticSeverity = a.diagnostic.severity ?? vscode.DiagnosticSeverity.Hint;
			const severityB: vscode.DiagnosticSeverity = b.diagnostic.severity ?? vscode.DiagnosticSeverity.Hint;
			if (severityA !== severityB) {
				return severityA - severityB;
			}

			const pathA: string = a.uri.scheme === "file" ? a.uri.fsPath.toLowerCase() : a.uri.toString(true).toLowerCase();
			const pathB: string = b.uri.scheme === "file" ? b.uri.fsPath.toLowerCase() : b.uri.toString(true).toLowerCase();
			if (pathA < pathB) {
				return -1;
			}
			if (pathA > pathB) {
				return 1;
			}

			return a.diagnostic.range.start.line - b.diagnostic.range.start.line;
		});
	}

	return result;
}

/**
 * Returns a standardized label for diagnostic severity.
 * @param severity Diagnostic severity.
 * @returns Standardized text for chat display.
 */
function severityLabel(severity: vscode.DiagnosticSeverity): string {
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

/**
 * Generates a clickable Markdown link for a diagnostic file and line.
 * @param uri Resource URI with the diagnostic.
 * @param relativePath Relative path for display.
 * @param line 1-based line for navigation.
 * @returns Markdown link to the problem location.
 */
function toLocationLink(uri: vscode.Uri, relativePath: string, line: number): string {
	if (uri.scheme !== "file") {
		return `${relativePath}:${line}`;
	}

	const locationUri: string = uri.with({ fragment: `L${line}` }).toString(true);
	return `[${relativePath}:${line}](${locationUri})`;
}

/**
 * Builds the final text with summary and diagnostics list for chat.
 * @param entries Diagnostics to display.
 * @param targetLabel Name/identifier of the compiled target.
 * @param truncated Indicates whether the list was truncated by limit.
 * @returns Final response text for chat.
 */
function formatDiagnosticsSummary(
	entries: DiagnosticEntry[],
	targetLabel: string,
	truncated: boolean,
	outputFormat: "markdown" | "json"
): string {
	const errors: number = entries.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Error).length;
	const warnings: number = entries.length - errors;

	if (outputFormat === "json") {
		const diagnostics = entries.map((entry) => {
			const relativePath: string =
				entry.uri.scheme === "file"
					? vscode.workspace.asRelativePath(entry.uri, false)
					: entry.uri.toString(true);
			const code: string | number | undefined =
				typeof entry.diagnostic.code === "string"
					? entry.diagnostic.code
					: entry.diagnostic.code && typeof entry.diagnostic.code === "object"
						? entry.diagnostic.code.value
						: undefined;
			return {
				severity: severityLabel(entry.diagnostic.severity),
				message: entry.diagnostic.message.replace(/\s+/g, " ").trim(),
				source: entry.diagnostic.source ?? null,
				code: code ?? null,
				line: entry.diagnostic.range.start.line + 1,
				path: relativePath,
				uri: entry.uri.toString(true)
			};
		});

		return JSON.stringify({
			target: targetLabel,
			errors,
			warnings,
			truncated,
			diagnostics
		}, null, 2);
	}

	if (entries.length === 0) {
		return [
			"Compilation completed and no errors or warnings were found in Problems.",
		].join("\n");
	}
	const details: string[] = entries.map((entry, index) => {
		const relativePath: string =
			entry.uri.scheme === "file"
				? vscode.workspace.asRelativePath(entry.uri, false)
				: entry.uri.toString(true);
		const line: number = entry.diagnostic.range.start.line + 1;
		const locationLink: string = toLocationLink(entry.uri, relativePath, line);
		const code: string | number | undefined =
			typeof entry.diagnostic.code === "string"
				? entry.diagnostic.code
				: entry.diagnostic.code && typeof entry.diagnostic.code === "object"
					? entry.diagnostic.code.value
					: undefined;
		const cleanMessage: string = entry.diagnostic.message.replace(/\s+/g, " ").trim();
		const source: string = entry.diagnostic.source ? ` (${entry.diagnostic.source})` : "";
		const codeText: string = code ? ` [${code}]` : "";

		return `${index + 1}. ${severityLabel(entry.diagnostic.severity)} ${locationLink}${source}${codeText} - ${cleanMessage}`;
	});

	const lines: string[] = [
		"Compilation finished with diagnostics:",
		`- target: ${targetLabel}`,
		`- errors: ${errors}`,
		`- warnings: ${warnings}`,
		"",
		...details
	];

	if (truncated) {
		lines.push("", `Showing first ${MAX_DIAGNOSTICS_TO_SHOW} diagnostics.`);
	}

	return lines.join("\n");
}

/**
 * Generates help text with commands and options supported by chat.
 * @returns Help text in markdown for chat.
 */
function buildHelpText(): string {
	const lines: string[] = [
		vscode.l10n.t("Available commands:"),
		vscode.l10n.t("- /{0}: compiles the target (default: current editor).", COMPILER_COMMAND),
		vscode.l10n.t("- /{0}: compiles the target using syntax-only mode.", SYNTAX_ONLY_COMMAND),
		vscode.l10n.t("- /{0}: applies a patch file (.ptm, .zip, .upd).", APPLY_PATCH_COMMAND),
		vscode.l10n.t("- /{0}: validates a patch file (.ptm, .zip, .upd).", VALIDATE_PATCH_COMMAND),
		vscode.l10n.t("- /help: shows this help."),
		"",
		vscode.l10n.t("Supported targets:"),
		vscode.l10n.t("- current editor: editor, current"),
		vscode.l10n.t("- open editors: open-files, open-editors, arquivos-abertos, fontes-abertos, arquivos abertos, fontes abertos"),
		vscode.l10n.t("- workspace: workspace, ws, all"),
		vscode.l10n.t("- file: relative or absolute path (ex: src/meu.prw)"),
		vscode.l10n.t("- folder: relative or absolute path (ex: src/modulo)"),
		"",
		vscode.l10n.t("Notes:"),
		vscode.l10n.t("- If you provide only a single name (no spaces), it is treated as the target."),
		vscode.l10n.t("- The command is executed on the current server/environment."),
		"",
		vscode.l10n.t("Supported flags (use key=value or key:value):"),
		vscode.l10n.t("- syntaxOnly=true|false"),
		vscode.l10n.t("- only=all|error|warning"),
		vscode.l10n.t("- max=N"),
		vscode.l10n.t("- sort=none|file|severity"),
		vscode.l10n.t("- format=markdown|json"),
		"",
		vscode.l10n.t("Examples:"),
		vscode.l10n.t("- /{0} target=src/modulo syntaxOnly=true only=error sort=file", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} target=editor", SYNTAX_ONLY_COMMAND),
		vscode.l10n.t("- /{0} target=open-editors", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} src/modulo", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} only=error", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} syntaxOnly=true", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} format=json", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} patches/fix.ptm", APPLY_PATCH_COMMAND),
		vscode.l10n.t("- /{0} c:/patches/fix.zip", APPLY_PATCH_COMMAND),
		vscode.l10n.t("- /{0} patches/fix.ptm", VALIDATE_PATCH_COMMAND),
		vscode.l10n.t("- /{0} c:/patches/fix.zip", VALIDATE_PATCH_COMMAND)
	];

	return lines.join("\n");
}

/**
 * Waits for diagnostics to stabilize after compilation to avoid partial reads.
 * @param token Invocation cancellation token.
 * @param timeoutMs Timeout in ms to wait for diagnostic changes.
 * @returns Wait result, including change, timeout, and cancellation.
 */
async function waitForDiagnosticsChange(
	token: vscode.CancellationToken,
	timeoutMs: number = DIAGNOSTIC_WAIT_TIMEOUT_MS
): Promise<DiagnosticsWaitResult> {
	return await new Promise<DiagnosticsWaitResult>((resolve) => {
		let finished: boolean = false;
		let idleTimer: NodeJS.Timeout | undefined;
		let hasChange: boolean = false;
		let timedOut: boolean = false;
		let canceled: boolean = false;

		const scheduleIdleResolve: () => void = (): void => {
			if (idleTimer) {
				clearTimeout(idleTimer);
			}

			idleTimer = setTimeout(() => finish(), DIAGNOSTIC_IDLE_WINDOW_MS);
		};

		const finish: () => void = (): void => {
			if (finished) {
				return;
			}
			finished = true;
			disposable.dispose();
			cancelDisposable.dispose();
			if (idleTimer) {
				clearTimeout(idleTimer);
			}
			clearTimeout(timeout);
			resolve({
				changed: hasChange,
				timedOut,
				canceled
			});
		};

		const disposable: vscode.Disposable = vscode.languages.onDidChangeDiagnostics(() => {
			hasChange = true;
			scheduleIdleResolve();
		});
		const cancelDisposable: vscode.Disposable = token.onCancellationRequested(() => {
			canceled = true;
			finish();
		});
		const timeout: NodeJS.Timeout = setTimeout(() => {
			timedOut = true;
			finish();
		}, timeoutMs);
	});
}

/**
 * Implements the compiler tool used by the chat participant.
 *
 * Responsibilities:
 * - Resolve the compilation target (current editor, file, folder, or workspace).
 * - Execute the corresponding VS Code build command.
 * - Wait for diagnostics to stabilize after compilation.
 * - Collect, filter, sort, and format errors/warnings for chat response.
 *
 * Input options:
 * - target: path/alias of the compilation target.
 * - flags: text parameters for diagnostic filters (only, max, sort).
 */
class ChatTdsTools implements vscode.LanguageModelTool<ChatCompilerToolInput> {
	/**
	 * Prepares the invocation message shown before tool execution.
	 * @param options Tool invocation options.
	 * @param _token Cancellation token.
	 * @returns Preparation message shown in chat.
	 */
	prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<ChatCompilerToolInput>,
		_token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.PreparedToolInvocation> {
		const target: string = resolveTarget(options.input?.target);
		let invocationMessage: string = `Preparing compiler tool for ${target}`;

		if (options.input?.command === APPLY_PATCH_COMMAND) {
			invocationMessage = `Preparing patch application tool for ${target}`;
		} else if (options.input?.command === VALIDATE_PATCH_COMMAND) {
			invocationMessage = `Preparing patch validation tool for ${target}`;
		}

		return {
			invocationMessage
		};
	}

	/**
	 * Executes build, collects diagnostics, and returns the chat summary.
	 * @param options Invocation options with target/flags.
	 * @param token Operation cancellation token.
	 * @returns Text result for chat response.
	 */
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<ChatCompilerToolInput>,
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		if (token.isCancellationRequested) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart("TDS tool invocation canceled by user.")
			]);
		}

		const input: ChatCompilerToolInput = options.input ?? {};
		const target: string = resolveTarget(input.target);
		const targetUri: vscode.Uri | undefined = resolveTargetUri(input.target);
		const flagOptions: FlagOptions = parseFlagOptions(input.flags);
		const flags: string = flagOptions.applied.length > 0 ? flagOptions.applied.join(", ") : "none";

		if ((input.command === VALIDATE_PATCH_COMMAND) || (input.command === APPLY_PATCH_COMMAND)) {
			const isError: { value: boolean } = { value: false };
			const validationResult: string = await handleValidPatchCommand(input.target, token, isError);
			let finalMessage: string = !isError.value
				? `Validating the patch for ${resolveTarget(input.target)}.`
				: validationResult;
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(finalMessage)
			]);
		}

		if (input.command === APPLY_PATCH_COMMAND) {
			const isError: { value: boolean } = { value: false };
			const validationResult: string = await handleApplyPatchCommand(input.target, token, isError, flagOptions.applyOld);
			if (isError.value) {
				let finalMessage: string = !isError.value
					? `Applying the patch for ${resolveTarget(input.target)}.`
					: validationResult;
				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(finalMessage)
				]);
			}
		}

		const isOpenEditorsTarget: boolean = target === "open-editors";
		const isWorkspaceTarget: boolean = target === "workspace" && !targetUri;
		const commandIdBase: string = isWorkspaceTarget
			? REBUILD_WORKSPACE_COMMAND
			: isOpenEditorsTarget
				? REBUILD_OPEN_EDITORS_COMMAND
				: REBUILD_FILE_COMMAND;
		const commandId: string = flagOptions.syntaxOnly ? SYNTAX_ONLY_FILE_COMMAND : commandIdBase;

		try {
			if (isWorkspaceTarget || isOpenEditorsTarget) {
				await vscode.commands.executeCommand(commandId);
			} else if (targetUri) {
				await vscode.commands.executeCommand(commandId, undefined, [targetUri]);
			} else {
				await vscode.commands.executeCommand(commandId);
			}
		} catch (error) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(
					`TDS tool command failed (${commandId}): ${error instanceof Error ? error.message : String(error)}`
				)
			]);
		}

		const diagnosticsTimeout: number = isDirectoryUri(targetUri)
			? DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER
			: DIAGNOSTIC_WAIT_TIMEOUT_MS;
		const waitResult: DiagnosticsWaitResult = await waitForDiagnosticsChange(token, diagnosticsTimeout);
		if (waitResult.canceled) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart("Compiler tool invocation canceled by user.")
			]);
		}

		const diagnostics: DiagnosticEntry[] = applyDiagnosticFilterOptions(
			isOpenEditorsTarget ? collectDiagnosticsForOpenEditors() : collectDiagnostics(targetUri, isWorkspaceTarget),
			flagOptions
		);
		const showAllDiagnostics: boolean = isDirectoryUri(targetUri);
		const maxToShow: number = flagOptions.max && flagOptions.max > 0
			? flagOptions.max
			: (showAllDiagnostics ? diagnostics.length : MAX_DIAGNOSTICS_TO_SHOW);
		const displayedDiagnostics: DiagnosticEntry[] = diagnostics.slice(0, maxToShow);
		const diagnosticsSummary: string = formatDiagnosticsSummary(
			displayedDiagnostics,
			target,
			diagnostics.length > displayedDiagnostics.length,
			flagOptions.format
		);

		const summary: string = flagOptions.format === "json"
			? JSON.stringify({
				command: commandId,
				target,
				flags: flags,
				diagnosticsUpdated: waitResult.changed,
				timedOut: waitResult.timedOut,
				diagnostics: JSON.parse(diagnosticsSummary)
			}, null, 2)
			: [
				"Compiler tool executed successfully with:",
				//`- command: ${commandId}`,
				`- target: ${target}`,
				`- compiler`,
				`- flags: ${flags}`,
				//`- diagnostics-updated: ${waitResult.changed ? "true" : "false"}`,
				"",
				...(waitResult.timedOut && !waitResult.changed
					? [
						"Diagnostics were not updated before timeout. Results below may reflect a previous compile.",
						""
					]
					: []),
				diagnosticsSummary
			].join("\n");

		return new vscode.LanguageModelToolResult([
			new vscode.LanguageModelTextPart(summary)
		]);
	}
}

/**
 * Chat participant handler: parses prompt, builds input, and forwards to the tool.
 * @param request Chat request.
 * @param _context Chat conversation context.
 * @param stream Response stream to send markdown to the user.
 * @param token Request cancellation token.
 * @returns Execution metadata for participant telemetry/logging.
 */
async function compilerParticipantHandler(
	request: vscode.ChatRequest,
	_context: vscode.ChatContext,
	stream: vscode.ChatResponseStream,
	token: vscode.CancellationToken
): Promise<vscode.ChatResult | void> {
	const rawPrompt: string | undefined = request.prompt?.trim();
	let command: string | undefined = request.command;
	let commandPrompt: string | undefined = rawPrompt;

	if (!command && rawPrompt) {
		const promptCommandMatch: RegExpMatchArray | null = rawPrompt.match(
			/^\/?(compiler|syntax-only|apply-patch|validate-patch|help)(?:\s+(.*))?$/i
		);
		if (promptCommandMatch) {
			command = promptCommandMatch[1].toLowerCase();
			commandPrompt = promptCommandMatch[2]?.trim();
		}
	}

	const isHelp: boolean = command === HELP_COMMAND || rawPrompt === "/help";
	const allowedCommands: Set<string> = new Set([
		COMPILER_COMMAND,
		SYNTAX_ONLY_COMMAND,
		APPLY_PATCH_COMMAND,
		VALIDATE_PATCH_COMMAND,
		HELP_COMMAND
	]);
	if (!command || !allowedCommands.has(command)) {
		if (!isHelp) {
			stream.markdown("Command not recognized. Use /help to see available commands.\n\n" + buildHelpText());
		} else {
			stream.markdown(buildHelpText());
		}
		return {
			metadata: {
				tool: COMPILER_TOOL_NAME,
				command: HELP_COMMAND
			}
		};
	}

	if (isHelp) {
		stream.markdown(buildHelpText());
		return {
			metadata: {
				tool: COMPILER_TOOL_NAME,
				command: HELP_COMMAND
			}
		};
	}

	const isSyntaxOnly: boolean = command === SYNTAX_ONLY_COMMAND;
	const isApplyPatch: boolean = command === APPLY_PATCH_COMMAND;
	const isValidatePatch: boolean = command === VALIDATE_PATCH_COMMAND;
	const input: ChatCompilerToolInput = {
		command,
		target: resolveTarget(),
		//syntaxOnly: isSyntaxOnly
	};

	if (isApplyPatch) {
		input.target = commandPrompt;
		delete input.target;
		//delete input.syntaxOnly;
	}

	if (!isApplyPatch && commandPrompt?.trim()) {
		const prompt: string = commandPrompt.trim();
		const targetFromPrompt: string | undefined = extractTargetFromPrompt(prompt);
		if (targetFromPrompt) {
			input.target = targetFromPrompt;
		}

		const flags: string[] = [prompt];
		const hasOnlyFlag: boolean = /(?:^|\s)only\s*[:=]/i.test(prompt);
		if (isSyntaxOnly && !hasOnlyFlag) {
			flags.push("only=all");
		}

		input.flags = flags;
	} else if (!isApplyPatch && isSyntaxOnly) {
		input.flags = ["only=all"];
	}

	const resolvedTarget: string = resolveTarget(input.target);
	if (isApplyPatch) {
		stream.markdown("Validating patch package...\n\n");
	} else if (isSyntaxOnly) {
		stream.markdown(`Starting syntax-only compilation for ${resolvedTarget}...\n\n`);
	} else if (isValidatePatch) {
		stream.markdown("Validating patch...\n\n");
	} else {
		stream.markdown(`Starting compilation for ${resolvedTarget}...\n\n`);
	}

	const result: vscode.LanguageModelToolResult = await vscode.lm.invokeTool(
		COMPILER_TOOL_NAME,
		{
			input,
			toolInvocationToken: request.toolInvocationToken
		},
		token
	);

	if (isApplyPatch) {
		stream.markdown(`Patching complete for ${resolvedTarget}.\n\n`);
	} else if (isValidatePatch) {
		stream.markdown(`Patch validation complete for ${resolvedTarget}.\n\n`);
	} else {
		stream.markdown(`Compilation finished for ${resolvedTarget}.\n\n`);
	}

	const text: string = result.content
		.filter((part): part is vscode.LanguageModelTextPart => part instanceof vscode.LanguageModelTextPart)
		.map((part) => part.value)
		.join("\n");

	stream.markdown(text || "Compiler tool invoked successfully.");

	return {
		metadata: {
			tool: COMPILER_TOOL_NAME,
			command: command ?? COMPILER_COMMAND
		}
	};
}

/**
 * Registers the language model tool and chat participant for compilation.
 * @param context Extension context to register disposables.
 */
export function registerChatTools(context: vscode.ExtensionContext): vscode.Disposable[] {
	const disposables: vscode.Disposable[] = [];

	console.warn(`Registering chat tools for TDS compilation...${COMPILER_TOOL_NAME}`);

	disposables.push(
		vscode.lm.registerTool(COMPILER_TOOL_NAME, new ChatTdsTools())
	);

	const participant: vscode.ChatParticipant = vscode.chat.createChatParticipant(
		COMPILER_PARTICIPANT_ID,
		compilerParticipantHandler
	);
	participant.iconPath = vscode.Uri.file(context.asAbsolutePath("icons/totvs24x24.png"));

	disposables.push(participant);
	return disposables;
}
