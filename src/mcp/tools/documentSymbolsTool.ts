import * as vscode from "vscode";
import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";
import { resolveTargetUri } from "../chatUtils";

type PlainRange = { start: { line: number; character: number }; end: { line: number; character: number } };

function toRange(range: vscode.Range): PlainRange {
	return {
		start: { line: range.start.line, character: range.start.character },
		end: { line: range.end.line, character: range.end.character }
	};
}

/** Converte DocumentSymbol/SymbolInformation do VS Code em objeto simples (JSON). */
function toPlain(symbol: vscode.DocumentSymbol | vscode.SymbolInformation): any {
	const base = {
		name: symbol.name,
		kind: symbol.kind,
		kindName: vscode.SymbolKind[symbol.kind]
	};

	if ("location" in symbol) {
		return {
			...base,
			containerName: symbol.containerName,
			location: { uri: symbol.location.uri.toString(), range: toRange(symbol.location.range) }
		};
	}

	return {
		...base,
		detail: symbol.detail,
		range: toRange(symbol.range),
		selectionRange: toRange(symbol.selectionRange),
		children: symbol.children?.map(toPlain)
	};
}

/**
 * Ferramenta `tds_document_symbols`: obtém os símbolos do documento pelo comando
 * `vscode.executeDocumentSymbolProvider`, que consulta os providers registrados no VS Code
 * (incluindo o Language Server TOTVS), como faz a `sehejjain.lsp-mcp-bridge`.
 * Sem `file`, usa o fonte do editor ativo.
 */
export const registerDocumentSymbolsTool: McpRegistrar = (server) => {
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
			inputSchema: {
				file: z.string().optional().describe("Source path (absolute, relative to the workspace) or file URI (e.g. file:///c:/src/a.prw). Default: active editor")
			}
		},
		async ({ file }) => {
			const fail = (text: string) => ({ content: [{ type: "text" as const, text }], isError: true });

			const uri: vscode.Uri | undefined = resolveTargetUri(file || "current");
			if (!uri) {
				return fail("Nenhum fonte informado e nenhum editor ativo.");
			}

			// Garante que o documento foi aberto (didOpen) e sincronizado com o LS.
			await vscode.workspace.openTextDocument(uri);

			const symbols = await vscode.commands.executeCommand<(vscode.DocumentSymbol | vscode.SymbolInformation)[]>(
				"vscode.executeDocumentSymbolProvider",
				uri
			);

			return {
				content: [{ type: "text" as const, text: JSON.stringify((symbols ?? []).map(toPlain), null, 2) }]
			};
		}
	);
};
