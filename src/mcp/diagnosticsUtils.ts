import * as vscode from "vscode";
import { DIAGNOSTIC_IDLE_WINDOW_MS, DIAGNOSTIC_WAIT_TIMEOUT_MS, DiagnosticEntry, DiagnosticsWaitResult } from "./mcpUtils";

/**
 * Waits for diagnostics to stabilize after compilation to avoid partial reads.
 * @param token Invocation cancellation token.
 * @param timeoutMs Timeout in ms to wait for diagnostic changes.
 * @returns Wait result, including change, timeout, and cancellation.
 */
export async function waitForDiagnosticsChange(
	token: vscode.CancellationToken,
	timeoutMs: number = DIAGNOSTIC_WAIT_TIMEOUT_MS
): Promise<DiagnosticsWaitResult> {
	console.log(`[tds-mcp waitForDiagnosticsChange: start timeoutMs=${timeoutMs}`);
	return await new Promise<DiagnosticsWaitResult>((resolve) => {
		let finished: boolean = false;
		let idleTimer: NodeJS.Timeout | undefined;
		let hasChange: boolean = false;
		let timedOut: boolean = false;
		let canceled: boolean = false;
		let cancelDisposable: vscode.Disposable | undefined;

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
			if (cancelDisposable) {
				cancelDisposable.dispose();
			}
			if (idleTimer) {
				clearTimeout(idleTimer);
			}
			clearTimeout(timeout);
			console.log(`[tds-mcp waitForDiagnosticsChange: finish changed=${hasChange} timedOut=${timedOut} canceled=${canceled}`);
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
		if (token) {
			cancelDisposable = token.onCancellationRequested(() => {
				console.warn("[tds-mcp] waitForDiagnosticsChange: canceled by token.");
				canceled = true;
				finish();
			});
		}
		const timeout: NodeJS.Timeout = setTimeout(() => {
			console.warn("[tds-mcp] waitForDiagnosticsChange: timeout reached.");
			timedOut = true;
			finish();
		}, timeoutMs);
	});
}

/**
 * Collects diagnostics only for open documents.
 * @returns List of diagnostics eligible for chat display.
 */
export function collectDiagnosticsForOpenEditors(): DiagnosticEntry[] {
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
