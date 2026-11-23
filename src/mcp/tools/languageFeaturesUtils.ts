import * as vscode from "vscode";
import { z } from "zod";
import { toWorkspaceRelativePath } from "../mcpUtils";
import { resolveTotvsSource, runRequest, TextResult, withTimeout } from "./toolUtils";

/**
 * Shared helpers of the language-feature tools (definition, references, hover, completion, symbols,
 * rename and format previews, code actions and signature help) of the TOTVS MCP.
 * Each tool is in its own file (`<name>Tool.ts`).
 *
 * Inspired by the extension `sehejjain.lsp-mcp-bridge` (MIT License,
 * Copyright (c) 2024 LSP MCP Bridge Contributors,
 * https://github.com/sehejjain/Language-Server-MCP-Bridge). The full license text is in
 * THIRD-PARTY-NOTICES.md. The same approach is used, i.e. the
 * built-in `vscode.execute*Provider` commands, which query the providers registered in VS Code
 * (including the TOTVS Language Server). Here the tools are restricted to AdvPL/TLPP/4GL sources.
 *
 * All tools are read-only: rename and format only return a preview, nothing is changed.
 */

export const DEFAULT_MAX_ITEMS: number = 100;

export const fileSchema = z
	.string()
	.optional()
	.describe("Source path (absolute, relative to the workspace) or file URI (e.g. file:///c:/src/a.prw). Default: active editor");
export const lineSchema = z.number().int().min(0).describe("Line number (0-based)");
export const characterSchema = z.number().int().min(0).describe("Character offset in the line (0-based)");
export const maxSchema = z.number().int().min(1).optional().describe(`Maximum number of items returned (default ${DEFAULT_MAX_ITEMS})`);

/**
 * Limits a list to `max` items (default `DEFAULT_MAX_ITEMS`), informing the total.
 * @param key Name of the property that receives the (converted) items.
 */
export function paginate<T>(key: string, all: T[], max: number | undefined, map: (item: T) => unknown): Record<string, unknown> {
	const limit: number = max ?? DEFAULT_MAX_ITEMS;
	return { total: all.length, returned: Math.min(all.length, limit), [key]: all.slice(0, limit).map(map) };
}
export function toPlainRange(range: vscode.Range): object {
	return {
		start: { line: range.start.line, character: range.start.character },
		end: { line: range.end.line, character: range.end.character }
	};
}

export function toPlainLocation(item: vscode.Location | vscode.LocationLink): object {
	if ("targetUri" in item) {
		return {
			file: toWorkspaceRelativePath(item.targetUri),
			range: toPlainRange(item.targetSelectionRange ?? item.targetRange)
		};
	}

	return { file: toWorkspaceRelativePath(item.uri), range: toPlainRange(item.range) };
}

export function toPlainEdit(edit: vscode.TextEdit): object {
	return { range: toPlainRange(edit.range), newText: edit.newText };
}

export function toPlainWorkspaceEdit(edit: vscode.WorkspaceEdit | undefined): object[] {
	return (edit?.entries() ?? []).map(([uri, edits]) => ({
		file: toWorkspaceRelativePath(uri),
		edits: edits.map(toPlainEdit)
	}));
}

export function toPlainSymbol(symbol: vscode.DocumentSymbol | vscode.SymbolInformation): object {
	const base = {
		name: symbol.name,
		kind: symbol.kind,
		kindName: vscode.SymbolKind[symbol.kind]
	};

	if ("location" in symbol) {
		return {
			...base,
			containerName: symbol.containerName,
			location: { file: toWorkspaceRelativePath(symbol.location.uri), range: toPlainRange(symbol.location.range) }
		};
	}

	return {
		...base,
		detail: symbol.detail,
		range: toPlainRange(symbol.range),
		selectionRange: toPlainRange(symbol.selectionRange),
		children: symbol.children?.map(toPlainSymbol)
	};
}

export function markdownText(content: vscode.MarkdownString | vscode.MarkedString | string | undefined): string {
	if (!content) {
		return "";
	}
	if (typeof content === "string") {
		return content;
	}
	return content.value;
}

/**
 * Opens the TOTVS source (sends didOpen to the LS) and runs the request.
 * Non TOTVS sources are ignored, errors are returned as a failed result.
 */
export async function onTotvsDocument(
	file: string | undefined,
	name: string,
	run: (document: vscode.TextDocument) => Promise<unknown>
): Promise<TextResult> {
	const { uri, result } = resolveTotvsSource(file);
	if (!uri) {
		return result;
	}

	return runRequest(name, toWorkspaceRelativePath(uri), async (profile) => {
		const document: vscode.TextDocument = await profile.phase("open", () => vscode.workspace.openTextDocument(uri));
		return profile.phase("request", () => withTimeout(run(document), name));
	});
}

/** Same as `onTotvsDocument`, validating the position against the document. */
export async function onTotvsPosition(
	file: string | undefined,
	line: number,
	character: number,
	name: string,
	run: (document: vscode.TextDocument, position: vscode.Position) => Promise<unknown>
): Promise<TextResult> {
	return onTotvsDocument(file, name, async (document) => {
		if (line >= document.lineCount) {
			return `Line ${line} is beyond the end of the document (${document.lineCount} lines).`;
		}
		const lineLength: number = document.lineAt(line).text.length;
		return run(document, new vscode.Position(line, Math.min(character, lineLength)));
	});
}
