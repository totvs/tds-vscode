import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const COMPILER_TOOL_NAME: string = "chat-tds-compiler";
const COMPILER_PARTICIPANT_ID: string = "tds-vscode.tools";
const COMPILER_COMMAND: string = "compiler";
const REBUILD_COMMAND: string = "recompiler";
const SYNTAX_ONLY_COMMAND: string = "syntax-only";

const WORKSPACE_TARGET_ALIASES: Set<string> = new Set([
	"workspace",
	"ws",
	"all"
]);

const CURRENT_EDITOR_TARGET_ALIASES: Set<string> = new Set([
	"current",
	"editor"
]);

const OPEN_EDITORS_TARGET_ALIASES: Set<string> = new Set([
	"open-files",
	"open-editors",
	"arquivos-abertos",
	"fontes-abertos",
	"arquivos abertos",
	"fontes abertos"
]);

type ChatCompilerToolInput = {
	target?: string;
	rebuild?: boolean;
	flags?: string[];
};

type DiagnosticEntry = {
	uri: vscode.Uri;
	diagnostic: vscode.Diagnostic;
};

type DiagnosticFilterOptions = {
	only: "all" | "error" | "warning";
	max?: number;
	sort: "none" | "file" | "severity";
	applied: string[];
};

type DiagnosticsWaitResult = {
	changed: boolean;
	timedOut: boolean;
	canceled: boolean;
};

const MAX_DIAGNOSTICS_TO_SHOW: number = 20;
const DIAGNOSTIC_WAIT_TIMEOUT_MS: number = 12000;
const DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER: number = 30000;
const DIAGNOSTIC_IDLE_WINDOW_MS: number = 3000;

const DEFAULT_DIAGNOSTIC_FILTER_OPTIONS: DiagnosticFilterOptions = {
	only: "all",
	sort: "none",
	applied: []
};

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
 * Normalizes target keywords for case-insensitive comparison.
 * @param value Target value provided in the prompt.
 * @returns Target normalized to lowercase.
 */
function normalizeTargetKeyword(value: string): string {
	return value.trim().toLowerCase();
}

/**
 * Checks whether the value represents the workspace target.
 * @param value Target value.
 * @returns True when the target represents the workspace.
 */
function isWorkspaceTargetAlias(value: string): boolean {
	return WORKSPACE_TARGET_ALIASES.has(normalizeTargetKeyword(value));
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
 * Checks whether the value represents the open editors target.
 * @param value Target value.
 * @returns True when the target represents open editors.
 */
function isOpenEditorsTargetAlias(value: string): boolean {
	return OPEN_EDITORS_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

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
 * Parses diagnostic filter/sort flags from the prompt.
 * @param flags Raw list of flags received by the tool.
 * @returns Normalized filter/sort options and the list of applied flags.
 */
function parseDiagnosticFilterOptions(flags: string[] | undefined): DiagnosticFilterOptions {
	if (!flags || flags.length === 0) {
		return { ...DEFAULT_DIAGNOSTIC_FILTER_OPTIONS, applied: [] };
	}

	const joined: string = flags.join(" ");
	const options: DiagnosticFilterOptions = {
		...DEFAULT_DIAGNOSTIC_FILTER_OPTIONS,
		applied: []
	};
	const regex: RegExp = /(only|max|sort)\s*[:=]\s*("[^"]+"|"[^"]+"|\S+)/gi;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(joined)) !== null) {
		const key: string = match[1].toLowerCase();
		const rawValue: string = stripQuotes(match[2]);
		const value: string = rawValue.toLowerCase();

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
	}

	return options;
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
 * Resolves the target into a real URI used to run the build/rebuild command.
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
 * @param targetUri Target URI for build/rebuild.
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
	options: DiagnosticFilterOptions
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
	truncated: boolean
): string {
	if (entries.length === 0) {
		return [
			"Compilation completed and no errors or warnings were found in Problems.",
			`- target: ${targetLabel}`
		].join("\n");
	}

	const errors: number = entries.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Error).length;
	const warnings: number = entries.length - errors;
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
		vscode.l10n.t("- /{0}: recompiles the target (default: current editor).", REBUILD_COMMAND),
		vscode.l10n.t("- /{0}: compiles and shows only errors (only=error).", SYNTAX_ONLY_COMMAND),
		"",
		vscode.l10n.t("Supported targets:"),
		vscode.l10n.t("- current editor: editor, current, current-editor, editor-atual, editor-corrente, arquivo-atual"),
		vscode.l10n.t("- open editors: open-files, open-editors, arquivos-abertos, fontes-abertos, arquivos abertos, fontes abertos"),
		vscode.l10n.t("- workspace: workspace, projeto, ws, all"),
		vscode.l10n.t("- file: relative or absolute path (ex: src/meu.prw)"),
		vscode.l10n.t("- folder: relative or absolute path (ex: src/modulo)"),
		"",
		vscode.l10n.t("Note: if you provide only a single name (no spaces), it is treated as the target."),
		"",
		vscode.l10n.t("Supported flags (use key=value or key:value):"),
		vscode.l10n.t("- only=all|error|warning"),
		vscode.l10n.t("- max=N"),
		vscode.l10n.t("- sort=none|file|severity"),
		"",
		vscode.l10n.t("Examples:"),
		vscode.l10n.t("- /{0} target=src/modulo only=error sort=file", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} target=workspace only=warning max=50", REBUILD_COMMAND),
		vscode.l10n.t("- /{0} target=editor", SYNTAX_ONLY_COMMAND),
		vscode.l10n.t("- /{0} target=open-editors", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} src/modulo", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} only=error", COMPILER_COMMAND)];

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
 * - Execute the corresponding VS Code build/rebuild command.
 * - Wait for diagnostics to stabilize after compilation.
 * - Collect, filter, sort, and format errors/warnings for chat response.
 *
 * Input options:
 * - target: path/alias of the compilation target.
 * - rebuild: when true, runs rebuild instead of build.
 * - flags: text parameters for diagnostic filters (only, max, sort).
 */
class ChatCompiler implements vscode.LanguageModelTool<ChatCompilerToolInput> {
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

		return {
			invocationMessage: `Preparing compiler tool for ${target}`
		};
	}

	/**
	 * Executes build/rebuild, collects diagnostics, and returns the chat summary.
	 * @param options Invocation options with target/rebuild/flags.
	 * @param token Operation cancellation token.
	 * @returns Text result for chat response.
	 */
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<ChatCompilerToolInput>,
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		if (token.isCancellationRequested) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart("Compiler tool invocation canceled by user.")
			]);
		}

		const input: ChatCompilerToolInput = options.input ?? {};
		const target: string = resolveTarget(input.target);
		const targetUri: vscode.Uri | undefined = resolveTargetUri(input.target);
		const filterOptions: DiagnosticFilterOptions = parseDiagnosticFilterOptions(input.flags);
		const flags: string = filterOptions.applied.length > 0 ? filterOptions.applied.join(", ") : "none";
		const isOpenEditorsTarget: boolean = target === "open-editors";
		const isWorkspaceTarget: boolean = target === "workspace" && !targetUri;
		const commandId: string = isWorkspaceTarget
			? (input.rebuild ? "totvs-developer-studio.rebuild.workspace" : "totvs-developer-studio.build.workspace")
			: isOpenEditorsTarget
				? (input.rebuild ? "totvs-developer-studio.rebuild.openEditors" : "totvs-developer-studio.build.openEditors")
				: (input.rebuild ? "totvs-developer-studio.rebuild.file" : "totvs-developer-studio.build.file");

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
					`Compiler command failed (${commandId}): ${error instanceof Error ? error.message : String(error)}`
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
			filterOptions
		);
		const showAllDiagnostics: boolean = isDirectoryUri(targetUri);
		const maxToShow: number = filterOptions.max && filterOptions.max > 0
			? filterOptions.max
			: (showAllDiagnostics ? diagnostics.length : MAX_DIAGNOSTICS_TO_SHOW);
		const displayedDiagnostics: DiagnosticEntry[] = diagnostics.slice(0, maxToShow);
		const diagnosticsSummary: string = formatDiagnosticsSummary(
			displayedDiagnostics,
			target,
			diagnostics.length > displayedDiagnostics.length
		);

		const summary: string = [
			"Compiler tool executed successfully with:",
			`- command: ${commandId}`,
			`- target: ${target}`,
			`- rebuild: ${input.rebuild ? "true" : "false"}`,
			`- flags: ${flags}`,
			`- diagnostics-updated: ${waitResult.changed ? "true" : "false"}`,
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
	if (request.prompt?.trim() === "/help" || request.command === "help") {
		stream.markdown(buildHelpText());
		return {
			metadata: {
				tool: COMPILER_TOOL_NAME,
				command: "help"
			}
		};
	}

	const isSyntaxOnly: boolean = request.command === SYNTAX_ONLY_COMMAND || request.command === "syntax-only";
	const isRebuild: boolean = request.command === REBUILD_COMMAND || request.command === "rebuild";

	const input: ChatCompilerToolInput = {
		target: resolveTarget(),
		rebuild: isSyntaxOnly ? false : isRebuild
	};

	if (request.prompt?.trim()) {
		const prompt: string = request.prompt.trim();
		const targetFromPrompt: string | undefined = extractTargetFromPrompt(prompt);
		if (targetFromPrompt) {
			input.target = targetFromPrompt;
		}

		const flags: string[] = [prompt];
		const hasOnlyFlag: boolean = /(?:^|\s)only\s*[:=]/i.test(prompt);
		if (isSyntaxOnly && !hasOnlyFlag) {
			flags.push("only=error");
		}

		input.flags = flags;
	} else if (isSyntaxOnly) {
		input.flags = ["only=error"];
	}

	const result: vscode.LanguageModelToolResult = await vscode.lm.invokeTool(
		COMPILER_TOOL_NAME,
		{
			input,
			toolInvocationToken: request.toolInvocationToken
		},
		token
	);

	const text: string = result.content
		.filter((part): part is vscode.LanguageModelTextPart => part instanceof vscode.LanguageModelTextPart)
		.map((part) => part.value)
		.join("\n");

	stream.markdown(text || "Compiler tool invoked successfully.");

	return {
		metadata: {
			tool: COMPILER_TOOL_NAME,
			command: request.command ?? COMPILER_COMMAND
		}
	};
}

/**
 * Registers the language model tool and chat participant for compilation.
 * @param context Extension context to register disposables.
 */
export function registerChatTools(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.lm.registerTool(COMPILER_TOOL_NAME, new ChatCompiler())
	);

	const participant: vscode.ChatParticipant = vscode.chat.createChatParticipant(
		COMPILER_PARTICIPANT_ID,
		compilerParticipantHandler
	);
	participant.iconPath = new vscode.ThemeIcon("tools");

	context.subscriptions.push(participant);
}
