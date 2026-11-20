import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { profiled } from "../mcpLogger";
import { isTotvsSourceUri, notTotvsSourceMessage, resolveTargetUri, toWorkspaceRelativePath } from "../mcpUtils";

/**
 * Language-feature tools (definition, references, hover, completion, symbols, rename and
 * format previews, code actions and signature help) of the TOTVS MCP.
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

const DEFAULT_MAX_ITEMS: number = 100;
const REQUEST_TIMEOUT_MS: number = 15000;

type TextResult = { content: { type: "text"; text: string }[]; isError?: boolean };

const fileSchema = z
	.string()
	.optional()
	.describe("Source path (absolute, relative to the workspace) or file URI (e.g. file:///c:/src/a.prw). Default: active editor");
const lineSchema = z.number().int().min(0).describe("Line number (0-based)");
const characterSchema = z.number().int().min(0).describe("Character offset in the line (0-based)");
const maxSchema = z.number().int().min(1).optional().describe(`Maximum number of items returned (default ${DEFAULT_MAX_ITEMS})`);

function ok(value: unknown): TextResult {
	return { content: [{ type: "text", text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }] };
}

function fail(text: string): TextResult {
	return { content: [{ type: "text", text }], isError: true };
}

function withTimeout<T>(promise: Thenable<T>, name: string): Promise<T> {
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

function toPlainRange(range: vscode.Range): object {
	return {
		start: { line: range.start.line, character: range.start.character },
		end: { line: range.end.line, character: range.end.character }
	};
}

function toPlainLocation(item: vscode.Location | vscode.LocationLink): object {
	if ("targetUri" in item) {
		return {
			file: toWorkspaceRelativePath(item.targetUri),
			range: toPlainRange(item.targetSelectionRange ?? item.targetRange)
		};
	}

	return { file: toWorkspaceRelativePath(item.uri), range: toPlainRange(item.range) };
}

function toPlainEdit(edit: vscode.TextEdit): object {
	return { range: toPlainRange(edit.range), newText: edit.newText };
}

function toPlainWorkspaceEdit(edit: vscode.WorkspaceEdit | undefined): object[] {
	return (edit?.entries() ?? []).map(([uri, edits]) => ({
		file: toWorkspaceRelativePath(uri),
		edits: edits.map(toPlainEdit)
	}));
}

function toPlainSymbol(symbol: vscode.DocumentSymbol | vscode.SymbolInformation): object {
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
function markdownText(content: vscode.MarkdownString | vscode.MarkedString | string | undefined): string {
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
async function onTotvsDocument(
	file: string | undefined,
	name: string,
	run: (document: vscode.TextDocument) => Promise<unknown>
): Promise<TextResult> {
	const uri: vscode.Uri | undefined = resolveTargetUri(file || "current");
	if (!uri) {
		return fail("No source informed and no active editor.");
	}
	if (!isTotvsSourceUri(uri)) {
		return ok(notTotvsSourceMessage(uri));
	}

	try {
		return await profiled(name, toWorkspaceRelativePath(uri), async (profile) => {
			const document: vscode.TextDocument = await profile.phase("open", () => vscode.workspace.openTextDocument(uri));
			return ok(await profile.phase("request", () => withTimeout(run(document), name)));
		});
	} catch (error) {
		return fail(`${name} failed: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/** Same as `onTotvsDocument`, validating the position against the document. */
async function onTotvsPosition(
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

export const registerLanguageFeaturesTools: McpRegistrar = (server) => {
	server.registerTool(
		"tds_document_symbols",
		{
			title: "TDS Document Symbols",
			description:
				"Get a hierarchical outline of all symbols (functions, classes, methods, variables) of an AdvPL/TLPP/4GL source file, " +
				"provided by the TOTVS Language Server (document symbols). " +
				"Use this AUTOMATICALLY when the user asks about file structure, 'what's in this file?', needs an overview, " +
				"wants the outline or the list of functions/classes of a .prw/.tlpp/.prx/.4gl source. " +
				"Prefer this tool over generic document-symbol tools for TOTVS sources. " +
				"If 'file' is omitted, uses the active editor.",
			inputSchema: { file: fileSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file }) =>
			onTotvsDocument(file, "Document symbols", async (document) => {
				const symbols = await vscode.commands.executeCommand<(vscode.DocumentSymbol | vscode.SymbolInformation)[]>(
					"vscode.executeDocumentSymbolProvider",
					document.uri
				);
				return (symbols ?? []).map(toPlainSymbol);
			})
	);
	server.registerTool(
		"tds_definition",
		{
			title: "TDS Definition",
			description:
				"Find the definition/declaration of the symbol (function, class, method, variable) at a position of an AdvPL/TLPP/4GL source, " +
				"using the TOTVS Language Server. Use this AUTOMATICALLY when the user asks where something is defined or implemented.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character }) =>
			onTotvsPosition(file, line, character, "Definition", async (document, position) => {
				const items = await vscode.commands.executeCommand<(vscode.Location | vscode.LocationLink)[]>(
					"vscode.executeDefinitionProvider",
					document.uri,
					position
				);
				return (items ?? []).map(toPlainLocation);
			})
	);

	server.registerTool(
		"tds_references",
		{
			title: "TDS References",
			description:
				"Find all references (usages) of the symbol at a position of an AdvPL/TLPP/4GL source, using the TOTVS Language Server. " +
				"Use this AUTOMATICALLY for impact analysis, 'where is this called/used?' and before changing a symbol.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema, max: maxSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, max }) =>
			onTotvsPosition(file, line, character, "References", async (document, position) => {
				const items = await vscode.commands.executeCommand<vscode.Location[]>(
					"vscode.executeReferenceProvider",
					document.uri,
					position
				);
				const limit: number = max ?? DEFAULT_MAX_ITEMS;
				const all: vscode.Location[] = items ?? [];
				return { total: all.length, returned: Math.min(all.length, limit), references: all.slice(0, limit).map(toPlainLocation) };
			})
	);

	server.registerTool(
		"tds_hover",
		{
			title: "TDS Hover",
			description:
				"Get documentation, type and signature information of the symbol at a position of an AdvPL/TLPP/4GL source, " +
				"as the hover of the TOTVS Language Server. Use this AUTOMATICALLY for 'what is this?' questions.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character }) =>
			onTotvsPosition(file, line, character, "Hover", async (document, position) => {
				const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
					"vscode.executeHoverProvider",
					document.uri,
					position
				);
				if (!hovers || hovers.length === 0) {
					return "No hover information at this position.";
				}
				return hovers.map((hover) => ({
					contents: hover.contents.map(markdownText).filter((text) => text.length > 0),
					range: hover.range ? toPlainRange(hover.range) : undefined
				}));
			})
	);

	server.registerTool(
		"tds_completion",
		{
			title: "TDS Completion",
			description:
				"Get the code completion suggestions at a position of an AdvPL/TLPP/4GL source, provided by the TOTVS Language Server. " +
				"Use when the user asks which functions, methods or members are available at a point of the code.",
			inputSchema: {
				file: fileSchema,
				line: lineSchema,
				character: characterSchema,
				triggerCharacter: z.string().max(1).optional().describe("Trigger character (e.g. ':' or '.')"),
				max: maxSchema
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, triggerCharacter, max }) =>
			onTotvsPosition(file, line, character, "Completion", async (document, position) => {
				const list = await vscode.commands.executeCommand<vscode.CompletionList>(
					"vscode.executeCompletionItemProvider",
					document.uri,
					position,
					triggerCharacter
				);
				const limit: number = max ?? DEFAULT_MAX_ITEMS;
				const all: vscode.CompletionItem[] = list?.items ?? [];
				return {
					total: all.length,
					returned: Math.min(all.length, limit),
					isIncomplete: list?.isIncomplete ?? false,
					items: all.slice(0, limit).map((item) => ({
						label: typeof item.label === "string" ? item.label : item.label.label,
						kind: item.kind === undefined ? undefined : vscode.CompletionItemKind[item.kind],
						detail: item.detail,
						documentation: markdownText(item.documentation),
						insertText: typeof item.insertText === "string" ? item.insertText : item.insertText?.value
					}))
				};
			})
	);

	server.registerTool(
		"tds_workspace_symbols",
		{
			title: "TDS Workspace Symbols",
			description:
				"Search symbols (functions, classes, methods) by name across the workspace, provided by the TOTVS Language Server. " +
				"Only AdvPL/TLPP/4GL sources are returned. Use this AUTOMATICALLY to find where a function or class is, when the file is unknown.",
			inputSchema: {
				query: z.string().describe("Text to search in symbol names (partial match)"),
				max: maxSchema
			},
			annotations: { readOnlyHint: true }
		},
		async ({ query, max }) => {
			try {
				const items = await profiled("Workspace symbols", `query='${query}'`, (profile) =>
					profile.phase("request", () =>
						withTimeout(
							vscode.commands.executeCommand<vscode.SymbolInformation[]>("vscode.executeWorkspaceSymbolProvider", query),
							"Workspace symbols"
						)
					)
				);
				const limit: number = max ?? DEFAULT_MAX_ITEMS;
				const all: vscode.SymbolInformation[] = (items ?? []).filter((item) => isTotvsSourceUri(item.location.uri));
				return ok({
					total: all.length,
					returned: Math.min(all.length, limit),
					symbols: all.slice(0, limit).map((item) => ({
						name: item.name,
						kind: vscode.SymbolKind[item.kind],
						containerName: item.containerName,
						file: toWorkspaceRelativePath(item.location.uri),
						range: toPlainRange(item.location.range)
					}))
				});
			} catch (error) {
				return fail(`Workspace symbols failed: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
	);

	server.registerTool(
		"tds_rename_symbol",
		{
			title: "TDS Rename Symbol (preview)",
			description:
				"Preview the edits needed to rename the symbol at a position of an AdvPL/TLPP/4GL source, using the TOTVS Language Server. " +
				"PREVIEW ONLY: nothing is changed in the files; apply the returned edits with the editing tools if the user agrees.",
			inputSchema: { file: fileSchema, line: lineSchema, character: characterSchema, newName: z.string().min(1).describe("New symbol name") },
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, newName }) =>
			onTotvsPosition(file, line, character, "Rename", async (document, position) => {
				const edit = await vscode.commands.executeCommand<vscode.WorkspaceEdit>(
					"vscode.executeDocumentRenameProvider",
					document.uri,
					position,
					newName
				);
				const changes: object[] = toPlainWorkspaceEdit(edit);
				return changes.length === 0 ? "The language server did not return rename edits for this position." : { preview: true, changes };
			})
	);

	server.registerTool(
		"tds_code_actions",
		{
			title: "TDS Code Actions",
			description:
				"List the code actions (quick fixes and refactorings) available for a line/range of an AdvPL/TLPP/4GL source, provided by the TOTVS Language Server. " +
				"Listing only: to APPLY the fixes of the reported problems use tds_fix. " +
				"If 'character' is omitted, the whole line (up to 'endLine') is considered.",
			inputSchema: {
				file: fileSchema,
				line: lineSchema,
				character: characterSchema.optional(),
				endLine: lineSchema.optional(),
				endCharacter: characterSchema.optional()
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, endLine, endCharacter }) =>
			onTotvsPosition(file, line, character ?? 0, "Code actions", async (document, start) => {
				const lastLine: number = Math.min(endLine ?? line, document.lineCount - 1);
				const end: vscode.Position =
					character === undefined && endCharacter === undefined
						? document.lineAt(lastLine).range.end
						: new vscode.Position(lastLine, Math.min(endCharacter ?? character ?? 0, document.lineAt(lastLine).text.length));
				const actions = await vscode.commands.executeCommand<(vscode.CodeAction | vscode.Command)[]>(
					"vscode.executeCodeActionProvider",
					document.uri,
					new vscode.Range(start, end)
				);
				return (actions ?? []).map((action) => {
					const codeAction = action as vscode.CodeAction;
					const command: vscode.Command | undefined = typeof codeAction.command === "object" ? codeAction.command : (action as vscode.Command);
					return {
						title: action.title,
						kind: codeAction.kind?.value,
						isPreferred: codeAction.isPreferred,
						changes: codeAction.edit ? toPlainWorkspaceEdit(codeAction.edit) : undefined,
						command: typeof command?.command === "string" ? command.command : undefined
					};
				});
			})
	);

	server.registerTool(
		"tds_format_document",
		{
			title: "TDS Format Document (preview)",
			description:
				"Preview the edits the formatter would apply to an AdvPL/TLPP/4GL source (TOTVS formatter). " +
				"PREVIEW ONLY: the file is not changed.",
			inputSchema: {
				file: fileSchema,
				tabSize: z.number().int().min(1).optional().describe("Tab size (default: editor setting)"),
				insertSpaces: z.boolean().optional().describe("Use spaces instead of tabs (default: editor setting)"),
				max: maxSchema
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, tabSize, insertSpaces, max }) =>
			onTotvsDocument(file, "Format document", async (document) => {
				const editor: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("editor", document.uri);
				const options: vscode.FormattingOptions = {
					tabSize: tabSize ?? editor.get<number>("tabSize", 4),
					insertSpaces: insertSpaces ?? editor.get<boolean>("insertSpaces", true)
				};
				const edits = await vscode.commands.executeCommand<vscode.TextEdit[]>(
					"vscode.executeFormatDocumentProvider",
					document.uri,
					options
				);
				const limit: number = max ?? DEFAULT_MAX_ITEMS;
				const all: vscode.TextEdit[] = edits ?? [];
				return { preview: true, total: all.length, returned: Math.min(all.length, limit), edits: all.slice(0, limit).map(toPlainEdit) };
			})
	);

	server.registerTool(
		"tds_signature_help",
		{
			title: "TDS Signature Help",
			description:
				"Get the signature and parameters of the function/method call at a position of an AdvPL/TLPP/4GL source, " +
				"provided by the TOTVS Language Server. Use when the user asks about the parameters of a function.",
			inputSchema: {
				file: fileSchema,
				line: lineSchema,
				character: characterSchema,
				triggerCharacter: z.string().max(1).optional().describe("Trigger character (e.g. '(' or ',')")
			},
			annotations: { readOnlyHint: true }
		},
		async ({ file, line, character, triggerCharacter }) =>
			onTotvsPosition(file, line, character, "Signature help", async (document, position) => {
				const help = await vscode.commands.executeCommand<vscode.SignatureHelp>(
					"vscode.executeSignatureHelpProvider",
					document.uri,
					position,
					triggerCharacter
				);
				if (!help || help.signatures.length === 0) {
					return "No signature help at this position.";
				}
				return {
					activeSignature: help.activeSignature,
					activeParameter: help.activeParameter,
					signatures: help.signatures.map((signature) => ({
						label: signature.label,
						documentation: markdownText(signature.documentation),
						parameters: signature.parameters.map((parameter) => ({
							label: typeof parameter.label === "string" ? parameter.label : signature.label.substring(parameter.label[0], parameter.label[1]),
							documentation: markdownText(parameter.documentation)
						}))
					}))
				};
			})
	);
};
