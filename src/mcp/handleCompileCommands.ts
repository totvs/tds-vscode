import * as vscode from "vscode";
import { REBUILD_WORKSPACE_COMMAND, isDirectoryUri, MAX_DIAGNOSTICS_TO_SHOW, REBUILD_FILE_COMMAND, REBUILD_OPEN_EDITORS_COMMAND, SYNTAX_ONLY_FILE_COMMAND, FlagOptions, resolveTargetUri, isTotvsSourceUri, isExtensionAllowedUri, notTotvsSourceMessage, toWorkspaceRelativePath } from "./mcpUtils";
import type { BuildOutcome } from "../compile/tdsBuild";
import { mcpLog } from "./mcpLogger";
import type { CompileInfo } from "../compile/CompileInfo";
import type { CompileResult } from "../compile/CompileResult";

type ResultSeverity = "ERROR" | "WARN" | "OTHER";

/** Diagnostic reported by the Language Server (LSP format) in `diagnostics` of the compilation response. */
type LsDiagnostic = {
	range?: { start?: { line?: number; character?: number } };
	severity?: number | string;
	code?: string | number | { value?: string | number };
	source?: string;
	message?: string;
	uri?: string;
	filePath?: string;
	file?: string;
};

/** Diagnostics grouped by file (alternative shape accepted for `diagnostics`). */
type LsDiagnosticGroup = {
	uri?: string;
	filePath?: string;
	file?: string;
	diagnostics?: LsDiagnostic[];
};

/** Normalized result entry used by filters, sorting and output. */
type ResultEntry = {
	severity: ResultSeverity;
	path: string;
	line?: number;
	column?: number;
	code?: string;
	source?: string;
	message: string;
};

/**
 * Classifies the severity of a diagnostic reported by the Language Server.
 * Numbers follow the LSP (1=Error, 2=Warning, 3=Information, 4=Hint); a missing severity is treated as error.
 * @param severity Severity as reported (LSP number or text).
 * @returns Severity used by the filters and counters.
 */
function classifySeverity(severity: number | string | undefined): ResultSeverity {
	if (severity === undefined || severity === null) {
		return "ERROR";
	}
	if (typeof severity === "number") {
		return severity === 1 ? "ERROR" : severity === 2 ? "WARN" : "OTHER";
	}
	switch (severity.toLowerCase()) {
		case "fatal":
		case "error":
			return "ERROR";
		case "warn":
		case "warning":
			return "WARN";
		default:
			return "OTHER";
	}
}

/**
 * Classifies the status of a `compileInfos` item (used only when the response has no `diagnostics`).
 * @param status Status reported by the Language Server (FATAL, ERROR, WARN, ...).
 * @returns Severity used by the filters and counters.
 */
function classifyStatus(status: string | undefined): ResultSeverity {
	return classifySeverity((status ?? "").toLowerCase() || "other");
}

/**
 * Extracts the entries from the `diagnostics` property of the compilation response.
 * Accepts a flat list of LSP diagnostics or a list grouped by file (`{ uri, diagnostics }`).
 * When the diagnostic has no file, `fallbackPath` is used.
 * @param result Compilation response.
 * @param fallbackPath File used when a diagnostic does not inform its file.
 * @returns Entries, or undefined when the response has no `diagnostics` list.
 */
function entriesFromDiagnostics(result: CompileResult, fallbackPath: string): ResultEntry[] | undefined {
	const raw: unknown = (result as { diagnostics?: unknown }).diagnostics;
	if (!Array.isArray(raw)) {
		return undefined;
	}

	const entries: ResultEntry[] = [];
	const add = (diagnostic: LsDiagnostic, groupFile?: string): void => {
		const file: string | undefined = diagnostic.uri ?? diagnostic.filePath ?? diagnostic.file ?? groupFile;
		const code = diagnostic.code && typeof diagnostic.code === "object" ? diagnostic.code.value : diagnostic.code;
		const start = diagnostic.range?.start;
		entries.push({
			severity: classifySeverity(diagnostic.severity),
			path: file ? toWorkspaceRelativePath(file) : fallbackPath,
			line: typeof start?.line === "number" ? start.line + 1 : undefined,
			column: typeof start?.character === "number" ? start.character + 1 : undefined,
			code: code !== undefined && code !== null && code !== "" ? String(code) : undefined,
			source: diagnostic.source || undefined,
			message: (diagnostic.message ?? "").replace(/\s+/g, " ").trim()
		});
	};

	for (const item of raw as (LsDiagnostic | LsDiagnosticGroup)[]) {
		const group = item as LsDiagnosticGroup;
		if (Array.isArray(group.diagnostics)) {
			const groupFile: string | undefined = group.uri ?? group.filePath ?? group.file;
			group.diagnostics.forEach((diagnostic) => add(diagnostic, groupFile));
		} else {
			add(item as LsDiagnostic);
		}
	}

	return entries;
}

/**
 * Builds the entries from `compileInfos` (fallback for Language Servers that do not send `diagnostics`).
 * @param infos Results of the compilation request.
 * @returns Entries without line/column.
 */
function entriesFromCompileInfos(infos: CompileInfo[]): ResultEntry[] {
	return infos.map((info) => {
		const detail: string = (info.detail ?? "").replace(/\s+/g, " ").trim();
		const message: string = (info.message ?? "").replace(/\s+/g, " ").trim();
		return {
			severity: classifyStatus(info.status),
			path: toWorkspaceRelativePath(info.filePath),
			message: detail && detail !== message ? `${message} (${detail})` : message
		};
	});
}
/**
 * Runs the compile/syntax-only command and returns the result reported by the Language Server.
 * The result comes from the Language Server response of the compilation request
 * (`$totvsserver/compilation`), not from the Problems view.
 * @param target Resolved target (file, folder, `workspace` or `open-editors`).
 * @param flagOptions Filter/sort/format options.
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

	// Alvo de arquivo único que não é fonte AdvPL/TLPP/4GL: ignora.
	// Na compilação (não syntax-only), aceita também as extensões de `folder.extensionsAllowed` (ex.: recursos).
	if (!isWorkspaceTarget && !isOpenEditorsTarget && targetUri && !isDirectoryUri(targetUri) && !isTotvsSourceUri(targetUri)
		&& (flagOptions.syntaxOnly || !isExtensionAllowedUri(targetUri))) {
		console.log(`[handleCompilerCommand] invoke: ignored, not an AdvPL/TLPP/4GL source: '${targetUri.toString(true)}'`);
		isError.value = false;
		return [notTotvsSourceMessage(targetUri)];
	}

	if (cancelToken.isCancellationRequested) {
		return ["Compiler tool invocation canceled by user."];
	}

	let outcome: BuildOutcome | undefined;
	mcpLog.verbose("Sent to the Language Server (build command)", { command: commandId, target: targetUri ? toWorkspaceRelativePath(targetUri) : target });
	try {
		if (isWorkspaceTarget || isOpenEditorsTarget) {
			console.log(`[handleCompilerCommand] invoke: executing command '${commandId}' without explicit URI.`);
			outcome = await vscode.commands.executeCommand<BuildOutcome | undefined>(commandId);
		} else if (target) {
			console.log(`[handleCompilerCommand] invoke: executing command '${commandId}' with URI '${targetUri.toString(true)}'.`);
			outcome = await vscode.commands.executeCommand<BuildOutcome | undefined>(commandId, undefined, [targetUri]);
		} else {
			console.log(`[handleCompilerCommand] invoke: executing command '${commandId}' fallback without URI.`);
			outcome = await vscode.commands.executeCommand<BuildOutcome | undefined>(commandId);
		}
	} catch (error) {
		console.error(`[handleCompilerCommand] invoke: command failed (${commandId}): ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
		return [
			`TDS tool command failed (${commandId}): ${error instanceof Error ? error.message : String(error)}`
		];
	}

	mcpLog.verbose("Received from the Language Server (build result)", outcome);
	if (!outcome || outcome.error || !outcome.result) {
		const reason: string = outcome?.error ?? "The command returned no result.";
		console.warn(`[handleCompilerCommand] invoke: build not completed: ${reason}`);
		return [`Compilation was not completed: ${reason}`];
	}

	if (cancelToken.isCancellationRequested) {
		return ["Compiler tool invocation canceled by user."];
	}

	isError.value = false;
	const targetLabel: string = targetUri ? toWorkspaceRelativePath(targetUri) : target;
	// Arquivo sem indicação no diagnóstico: usa o alvo (arquivo único) ou o único arquivo informado em compileInfos.
	const infoFiles: string[] = [...new Set((outcome.result.compileInfos ?? []).map((info) => toWorkspaceRelativePath(info.filePath)).filter((f) => f))];
	const fallbackPath: string = targetUri && !isDirectoryUri(targetUri) ? targetLabel : (infoFiles.length === 1 ? infoFiles[0] : "");
	const entries: ResultEntry[] = entriesFromDiagnostics(outcome.result, fallbackPath) ?? entriesFromCompileInfos(outcome.result.compileInfos ?? []);
	return [formatResult(entries, outcome.result.returnCode, commandId, targetLabel, targetUri, flagOptions)];
}

/**
 * Applies filters, sorting and limit to the results reported by the Language Server and formats them.
 * @param all Result entries (from `diagnostics`, or `compileInfos` as fallback).
 * @param returnCode Return code of the compilation request.
 * @param commandId Executed command.
 * @param target Target label.
 * @param targetUri Resolved target URI, when applicable.
 * @param flags Filter/sort/format options.
 * @returns Final text for the tool output.
 */
function formatResult(
	all: ResultEntry[],
	returnCode: number,
	commandId: string,
	target: string,
	targetUri: vscode.Uri | undefined,
	flags: FlagOptions
): string {
	const errorsTotal: number = all.filter((c) => c.severity === "ERROR").length;
	const warningsTotal: number = all.filter((c) => c.severity === "WARN").length;
	const others: number = all.length - errorsTotal - warningsTotal;

	let entries = all.filter((c) => c.severity !== "OTHER");
	if (flags.only === "error") {
		entries = entries.filter((c) => c.severity === "ERROR");
	} else if (flags.only === "warning") {
		entries = entries.filter((c) => c.severity === "WARN");
	}

	const byLocation = (a: ResultEntry, b: ResultEntry): number =>
		a.path.toLowerCase().localeCompare(b.path.toLowerCase()) || (a.line ?? 0) - (b.line ?? 0);
	if (flags.sort === "file") {
		entries.sort(byLocation);
	} else if (flags.sort === "severity") {
		entries.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "ERROR" ? -1 : 1) || byLocation(a, b));
	}

	const maxToShow: number = flags.max && flags.max > 0
		? flags.max
		: (isDirectoryUri(targetUri) || target === "workspace" || target === "open-editors" ? entries.length : MAX_DIAGNOSTICS_TO_SHOW);
	const displayed = entries.slice(0, maxToShow);
	const truncated: boolean = entries.length > displayed.length;

	console.log(`[handleCompilerCommand] invoke: results total=${all.length} displayed=${displayed.length} returnCode=${returnCode}`);

	if (flags.format === "json") {
		return JSON.stringify({
			command: commandId,
			target,
			flags,
			returnCode,
			errors: errorsTotal,
			warnings: warningsTotal,
			others,
			truncated,
			results: displayed.map((c) => ({
				severity: c.severity === "ERROR" ? "error" : "warning",
				path: c.path,
				line: c.line ?? null,
				column: c.column ?? null,
				code: c.code ?? null,
				source: c.source ?? null,
				message: c.message
			}))
		}, null, 2);
	}

	const lines: string[] = [
		errorsTotal + warningsTotal === 0
			? "Compilation finished by the Language Server with no errors or warnings."
			: "Compilation finished by the Language Server with errors or warnings:",
		`- target: ${target}`,
		`- return code: ${returnCode}`,
		`- errors: ${errorsTotal}`,
		`- warnings: ${warningsTotal}`
	];
	if (others > 0) {
		lines.push(`- other results (no error/warning): ${others}`);
	}

	if (displayed.length > 0) {
		lines.push("");
		displayed.forEach((c, index) => {
			const location: string = `${c.path}${c.line !== undefined ? `:${c.line}` : ""}`;
			const code: string = c.code ? ` [${c.code}]` : "";
			const source: string = c.source ? ` (${c.source})` : "";
			lines.push(`${index + 1}. ${c.severity === "ERROR" ? "ERROR" : "WARN"} ${location}${source}${code}${c.message ? ` - ${c.message}` : ""}`);
		});
	}

	if (truncated) {
		lines.push("", `Showing first ${displayed.length} of ${entries.length} results.`);
	}

	return lines.join("\n");
}