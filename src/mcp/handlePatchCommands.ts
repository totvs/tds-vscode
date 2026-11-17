import * as vscode from "vscode";
import * as fs from "fs";
import path from "path";
import { ValidResponse, sendPatchValidateRequest, sendPatchApplyRequest } from "../protocolMessages";
import { ServersConfig } from "../utils";
import { stripQuotes, resolvePatchFilePath, toWorkspaceRelativePath } from "./mcpUtils";
import { mcpLog } from "./mcpLogger";

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
 * Validates if a file extension is supported by patch validation flow.
 * @param filePath Candidate file path.
 * @returns True when extension is accepted for patch validation.
 */
function isSupportedPatchFile(filePath: string): boolean {
	const extension: string = path.extname(filePath).toLowerCase();
	return extension === ".ptm" || extension === ".zip" || extension === ".upd";
}

/**
 * Formats the result reported by the Language Server for a patch request.
 * @param action Action label (`validation` or `apply`).
 * @param patchFilePath Patch file path.
 * @param response Language Server response.
 * @returns Text with code, message and the resources older than the RPO, when reported.
 */
function formatPatchFailure(action: string, patchFilePath: string, response: ValidResponse): string {
	const lines: string[] = [
		`Patch ${action} failed for ${toWorkspaceRelativePath(patchFilePath)}.`,
		`- Code: ${response.errorCode}`,
		`- Message: ${response.message || "Unknown error."}`
	];

	const items: any[] = Array.isArray(response.patchValidates) ? response.patchValidates : [];
	if (items.length > 0) {
		lines.push("", "Resources reported by the Language Server:", "Patch Date | RPO Date | Filename");
		items.forEach((item: any) => lines.push(`${item.datePatch} | ${item.dateRpo} | ${item.file}`));
	}

	lines.push("", "Check the selected server/environment and patch compatibility before retrying.");
	return lines.join("\n");
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
export async function handleValidPatchCommand(
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
		return `Patch file not found: ${toWorkspaceRelativePath(patchFilePath)}`;
	}

	let fileStats: fs.Stats;
	try {
		fileStats = fs.statSync(patchFilePath);
	} catch (error) {
		return `Unable to access patch file: ${error instanceof Error ? error.message : String(error)}`;
	}

	if (!fileStats.isFile()) {
		return `Invalid patch path (not a file): ${toWorkspaceRelativePath(patchFilePath)}`;
	}

	if (!isSupportedPatchFile(patchFilePath)) {
		return `Unsupported patch extension. Use .ptm, .zip, or .upd files: ${toWorkspaceRelativePath(patchFilePath)}`;
	}

	try {
		const server = ServersConfig.getCurrentServer();
		mcpLog.verbose("Sent to the Language Server (patch validation)", { patch: toWorkspaceRelativePath(patchFilePath) });
		const validationResult: ValidResponse = await sendPatchValidateRequest(server, patchFilePath);
		mcpLog.verbose("Received from the Language Server (patch validation)", validationResult);

		if (validationResult.error !== 0) {
			isError.value = true;
			return formatPatchFailure("validation", patchFilePath, validationResult);
		}

		isError.value = false;
		return `Patch validated successfully: ${toWorkspaceRelativePath(patchFilePath)}.`;
	} catch (error) {
		isError.value = true;
		return `Error during patch validation: ${error instanceof Error ? error.message : String(error)}`;
	}
}

export async function handleApplyPatchCommand(
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
		return `Patch file not found: ${toWorkspaceRelativePath(patchFilePath)}`;
	}

	let fileStats: fs.Stats;
	try {
		fileStats = fs.statSync(patchFilePath);
	} catch (error) {
		return `Unable to access patch file: ${error instanceof Error ? error.message : String(error)}`;
	}

	if (!fileStats.isFile()) {
		return `Invalid patch path (not a file): ${toWorkspaceRelativePath(patchFilePath)}`;
	}

	if (!isSupportedPatchFile(patchFilePath)) {
		return `Unsupported patch extension. Use .ptm, .zip, or .upd files: ${toWorkspaceRelativePath(patchFilePath)}`;
	}

	try {
		const server = ServersConfig.getCurrentServer();
		mcpLog.verbose("Sent to the Language Server (patch apply)", { patch: toWorkspaceRelativePath(patchFilePath), applyOld });
		const applyResult: ValidResponse = await sendPatchApplyRequest(server, patchFilePath, applyOld);
		mcpLog.verbose("Received from the Language Server (patch apply)", applyResult);

		if (applyResult.error !== 0) {
			isError.value = true;
			return formatPatchFailure("apply", patchFilePath, applyResult);
		}

		isError.value = false;
		return `Patch applied successfully: ${toWorkspaceRelativePath(patchFilePath)}.`;
	} catch (error) {
		isError.value = true;
		return `Error during patch apply: ${error instanceof Error ? error.message : String(error)}`;
	}
}
