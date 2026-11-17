import * as vscode from "vscode";
import { REBUILD_WORKSPACE_COMMAND, isDirectoryUri, MAX_DIAGNOSTICS_TO_SHOW, REBUILD_FILE_COMMAND, REBUILD_OPEN_EDITORS_COMMAND, SYNTAX_ONLY_FILE_COMMAND, FlagOptions, resolveTargetUri, isTotvsSourceUri, isExtensionAllowedUri, notTotvsSourceMessage, toWorkspaceRelativePath } from "./mcpUtils";
import type { BuildOutcome } from "../compile/tdsBuild";
import { mcpLog } from "./mcpLogger";
import type { CompileInfo } from "../compile/CompileInfo";

type ResultSeverity = "ERROR" | "WARN" | "OTHER";

/**
 * Classifies the status of a Language Server compile result.
 * @param status Status reported by the Language Server (FATAL, ERROR, WARN, ...).
 * @returns Severity used by the filters and counters.
 */
function classifyStatus(status: string | undefined): ResultSeverity {
	switch ((status ?? "").toUpperCase()) {
		case "FATAL":
		case "ERROR":
			return "ERROR";
		case "WARN":
			return "WARN";
		default:
			return "OTHER";
	}
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
	return [formatResult(outcome.result.compileInfos ?? [], outcome.result.returnCode, commandId, targetUri ? toWorkspaceRelativePath(targetUri) : target, targetUri, flagOptions)];
}

/**
 * Applies filters, sorting and limit to the results reported by the Language Server and formats them.
 * @param infos Results of the compilation request.
 * @param returnCode Return code of the compilation request.
 * @param commandId Executed command.
 * @param target Target label.
 * @param targetUri Resolved target URI, when applicable.
 * @param flags Filter/sort/format options.
 * @returns Final text for the tool output.
 */
function formatResult(
	infos: CompileInfo[],
	returnCode: number,
	commandId: string,
	target: string,
	targetUri: vscode.Uri | undefined,
	flags: FlagOptions
): string {
	const classified = infos.map((info) => ({ info, severity: classifyStatus(info.status), path: toWorkspaceRelativePath(info.filePath) }));
	const errorsTotal: number = classified.filter((c) => c.severity === "ERROR").length;
	const warningsTotal: number = classified.filter((c) => c.severity === "WARN").length;
	const others: number = classified.length - errorsTotal - warningsTotal;

	let entries = classified.filter((c) => c.severity !== "OTHER");
	if (flags.only === "error") {
		entries = entries.filter((c) => c.severity === "ERROR");
	} else if (flags.only === "warning") {
		entries = entries.filter((c) => c.severity === "WARN");
	}

	if (flags.sort === "file") {
		entries.sort((a, b) => a.path.toLowerCase().localeCompare(b.path.toLowerCase()));
	} else if (flags.sort === "severity") {
		entries.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "ERROR" ? -1 : 1) || a.path.toLowerCase().localeCompare(b.path.toLowerCase()));
	}

	const maxToShow: number = flags.max && flags.max > 0
		? flags.max
		: (isDirectoryUri(targetUri) || target === "workspace" || target === "open-editors" ? entries.length : MAX_DIAGNOSTICS_TO_SHOW);
	const displayed = entries.slice(0, maxToShow);
	const truncated: boolean = entries.length > displayed.length;

	console.log(`[handleCompilerCommand] invoke: results total=${infos.length} displayed=${displayed.length} returnCode=${returnCode}`);

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
				status: c.info.status,
				path: c.path,
				message: c.info.message ?? null,
				detail: c.info.detail ?? null
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
			const message: string = (c.info.message ?? "").replace(/\s+/g, " ").trim();
			const detail: string = (c.info.detail ?? "").replace(/\s+/g, " ").trim();
			lines.push(`${index + 1}. ${c.severity === "ERROR" ? "ERROR" : "WARN"} ${c.path}${message ? ` - ${message}` : ""}${detail ? ` (${detail})` : ""}`);
		});
	}

	if (truncated) {
		lines.push("", `Showing first ${displayed.length} of ${entries.length} results.`);
	}

	return lines.join("\n");
}
