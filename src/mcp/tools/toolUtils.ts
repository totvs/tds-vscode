import * as vscode from "vscode";
import { profiled, ToolProfile } from "../mcpLogger";
import { isTotvsSourceUri, notTotvsSourceMessage, resolveTargetUri } from "../mcpUtils";

/**
 * Helpers shared by the TOTVS MCP tools: results, cancellation, timeout,
 * resolution of the target source and execution with profile.
 */

/** Maximum time (ms) of a request to the language server. */
export const REQUEST_TIMEOUT_MS: number = 15000;

/** Text result of a tool. */
export type TextResult = { content: { type: "text"; text: string }[]; isError?: boolean };

/** Text result, optionally flagged as error. */
export function textResult(text: string, isError: boolean = false): TextResult {
	return { content: [{ type: "text", text }], isError };
}

/** Successful result: strings are returned as they are, other values as JSON. */
export function ok(value: unknown): TextResult {
	return textResult(typeof value === "string" ? value : JSON.stringify(value, null, 2));
}

/** Failed result. */
export function fail(text: string): TextResult {
	return textResult(text, true);
}

/** Message of an error (or of any thrown value). */
export function errorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}

/** Rejects when `promise` does not finish in `REQUEST_TIMEOUT_MS`. */
export function withTimeout<T>(promise: Thenable<T>, name: string): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const timer: NodeJS.Timeout = setTimeout(() => reject(new Error(`${name} request timeout`)), REQUEST_TIMEOUT_MS);
		promise.then(
			(value) => {
				clearTimeout(timer);
				resolve(value);
			},
			(error) => {
				clearTimeout(timer);
				reject(error);
			}
		);
	});
}

/** Runs `fn` with a cancellation token bound to the `AbortSignal` of the MCP call. */
export async function withCancellation<T>(signal: AbortSignal | undefined, fn: (token: vscode.CancellationToken) => Promise<T>): Promise<T> {
	const cancellation = new vscode.CancellationTokenSource();
	const onAbort = () => cancellation.cancel();
	signal?.addEventListener("abort", onAbort);

	try {
		return await fn(cancellation.token);
	} finally {
		signal?.removeEventListener("abort", onAbort);
		cancellation.dispose();
	}
}

/** Resolved source (`uri`) or the result to return at once (`result`). */
export type ResolvedSource = { uri: vscode.Uri; result?: undefined } | { uri?: undefined; result: TextResult };

/**
 * Resolves the source of a tool (path, URI or, when omitted, the active editor).
 * Returns a failed result when there is no source and an informative result when it
 * is not an AdvPL/TLPP/4GL source (which is ignored).
 */
export function resolveTotvsSource(file: string | undefined): ResolvedSource {
	const uri: vscode.Uri | undefined = resolveTargetUri(file || "current");
	if (!uri) {
		return { result: fail("No source informed and no active editor.") };
	}
	if (!isTotvsSourceUri(uri)) {
		return { result: ok(notTotvsSourceMessage(uri)) };
	}
	return { uri };
}

/**
 * Runs a request with profile and converts it to a result: the value returned by `fn` is
 * the successful result (see `ok`) and errors become a failed result.
 * @param name Name of the request (log and error message).
 * @param target Target of the request (log).
 */
export async function runRequest(name: string, target: string, fn: (profile: ToolProfile) => Promise<unknown>): Promise<TextResult> {
	try {
		return ok(await profiled(name, target, fn));
	} catch (error) {
		return fail(`${name} failed: ${errorMessage(error)}`);
	}
}
