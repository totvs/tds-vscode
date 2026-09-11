import * as vscode from "vscode";
import { REBUILD_WORKSPACE_COMMAND, DIAGNOSTIC_WAIT_TIMEOUT_MS, DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER, DiagnosticEntry, DiagnosticsWaitResult, isDirectoryUri, MAX_DIAGNOSTICS_TO_SHOW, REBUILD_FILE_COMMAND, REBUILD_OPEN_EDITORS_COMMAND, SYNTAX_ONLY_FILE_COMMAND, FlagOptions, resolveTargetUri, isUriInsideFolder, severityLabel, toLocationLink, uriEquals, isWorkspaceUri } from "./chatUtils";
import { waitForDiagnosticsChange, collectDiagnosticsForOpenEditors } from "./chatTools";

/**
 * Runs compiler command from chat.
 * Validates prompt/path/extension and then requests server-side compilation.
 * @param prompt Raw prompt text.
 * @param cancelToken Request cancellation token.
 * @param isError Mutable wrapper used as out parameter.
 * The function updates `isError.value` to indicate whether the compilation flow ended with an error.
 * @returns Status text for chat output.
 */
export async function handleCompilerCommand(
	target: string,
	flagOptions: FlagOptions,
	cancelToken: vscode.CancellationToken,
	isError: { value: boolean }
): Promise<string[]> {
	isError.value = true;
	const targetUri: vscode.Uri | undefined = resolveTargetUri(target);
	const isOpenEditorsTarget: boolean = target === "open-editors";
	const isWorkspaceTarget: boolean = target === "workspace" && !targetUri;
	const commandIdBase: string = isWorkspaceTarget
		? REBUILD_WORKSPACE_COMMAND
		: isOpenEditorsTarget
			? REBUILD_OPEN_EDITORS_COMMAND
			: REBUILD_FILE_COMMAND;
	const commandId: string = flagOptions.syntaxOnly ? SYNTAX_ONLY_FILE_COMMAND : commandIdBase;
	console.log(`[handleCompilerCommand] invoke: resolved target='${target}', commandId='${commandId}', targetUri='${targetUri?.toString(true) ?? "<none>"}'`);

	try {
		if (isWorkspaceTarget || isOpenEditorsTarget) {
			console.log(`[handleCompilerCommand] invoke: executing command '${commandId}' without explicit URI.`);
			await vscode.commands.executeCommand(commandId);
		} else if (target) {
			console.log(`[handleCompilerCommand] invoke: executing command '${commandId}' with URI '${targetUri.toString(true)}'.`);
			await vscode.commands.executeCommand(commandId, undefined, [targetUri]);
		} else {
			console.log(`[handleCompilerCommand] invoke: executing command '${commandId}' fallback without URI.`);
			await vscode.commands.executeCommand(commandId);
		}
		isError.value = false;
	} catch (error) {
		console.error(`[handleCompilerCommand] invoke: command failed (${commandId}): ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
		return [
			`TDS tool command failed (${commandId}): ${error instanceof Error ? error.message : String(error)}`
		];
	}

	const diagnosticsTimeout: number = isDirectoryUri(targetUri)
		? DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER
		: DIAGNOSTIC_WAIT_TIMEOUT_MS;
	console.log(`[handleCompilerCommand] invoke: waiting diagnostics with timeout=${diagnosticsTimeout}`);
	const waitResult: DiagnosticsWaitResult = await waitForDiagnosticsChange(cancelToken, diagnosticsTimeout);
	if (waitResult.canceled) {
		console.warn("[handleCompilerCommand] invoke: canceled while waiting diagnostics.");
		return [
			"Compiler tool invocation canceled by user."
		];
	}

	const diagnosticsCollected: DiagnosticEntry[] = isOpenEditorsTarget ? collectDiagnosticsForOpenEditors() : collectDiagnostics(targetUri, isWorkspaceTarget);
	const diagnostics: DiagnosticEntry[] = applyDiagnosticFilterOptions(
		diagnosticsCollected,
		flagOptions
	);
	const showAllDiagnostics: boolean = isDirectoryUri(targetUri);
	const maxToShow: number = flagOptions.max && flagOptions.max > 0
		? flagOptions.max
		: (showAllDiagnostics ? diagnostics.length : MAX_DIAGNOSTICS_TO_SHOW);
	const displayedDiagnostics: DiagnosticEntry[] = diagnostics.slice(0, maxToShow);

	console.log(`[handleCompilerCommand] invoke: diagnostics total=${diagnostics.length} displayed=${displayedDiagnostics.length} timedOut=${waitResult.timedOut} changed=${waitResult.changed}`);

	const diagnosticsSummary: string = formatDiagnosticsSummary(
		displayedDiagnostics,
		target,
		diagnostics.length > displayedDiagnostics.length,
		flagOptions
	);

	const summary: string[] = flagOptions.format === "json"
		? [JSON.stringify({
			command: commandId,
			target,
			flags: flagOptions,
			diagnosticsUpdated: waitResult.changed,
			timedOut: waitResult.timedOut,
			diagnostics: JSON.parse(diagnosticsSummary)
		}, null, 2)]
		: [
			...(waitResult.timedOut && !waitResult.changed
				? [
					"Diagnostics were not updated before timeout. Results below may reflect a previous compile.",
					""
				]
				: []),
			diagnosticsSummary
		];

	return summary;
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
	flags: FlagOptions
): string {
	const errors: number = entries.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Error).length;
	const warnings: number = entries.length - errors;

	if (flags.format === "json") {
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

	if (!flags.applied) {
		//Quando executado via Kiro, este atributo vem como undefined, então inicializamos aqui para evitar erros de acesso .
		//Ocorre com frequência quando solicitado compileção de workspace.
		flags.applied = [];
	}

	const lines: string[] = [
		"Compilation finished with diagnostics:",
		`- target: ${targetLabel}`,
		`- flags: ${flags.applied.join(", ")}`,
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
