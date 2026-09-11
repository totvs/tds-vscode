import * as vscode from "vscode";
import * as fs from "fs";
import path from "path";
import { ValidResponse, sendPatchValidateRequest, sendPatchApplyRequest } from "../protocolMessages";
import { ServersConfig } from "../utils";
import { stripQuotes, resolvePatchFilePath } from "./chatUtils";

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
