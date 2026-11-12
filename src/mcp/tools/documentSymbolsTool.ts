import * as vscode from "vscode";
import { z } from "zod";
import { DocumentSymbolRequest } from "vscode-languageclient";
import { McpRegistrar } from "../mcpTypes";
import { languageClient } from "../../extension";
import { resolveTargetUri } from "../../chat/chatUtils";

/**
 * Ferramenta `tds_document_symbols`: envia `textDocument/documentSymbol` diretamente
 * ao Language Server (TOTVS LS) e devolve a resposta LSP sem conversões.
 * Sem `file`, usa o fonte do editor ativo.
 */
export const registerDocumentSymbolsTool: McpRegistrar = (server) => {
	server.registerTool(
		"tds_document_symbols",
		{
			title: "TDS Document Symbols",
			description:
				"Retorna os símbolos (funções, classes, métodos, variáveis...) de um fonte AdvPL/TLPP/4GL " +
				"consultando o Language Server (textDocument/documentSymbol). " +
				"Se 'file' for omitido, usa o fonte do editor ativo.",
			inputSchema: {
				file: z.string().optional().describe("Caminho do fonte (absoluto ou relativo ao workspace). Padrão: editor ativo")
			}
		},
		async ({ file }) => {
			const fail = (text: string) => ({ content: [{ type: "text" as const, text }], isError: true });

			if (!languageClient || !languageClient.isReady) {
				return fail("O Language Server ainda não está pronto.");
			}

			const uri: vscode.Uri | undefined = resolveTargetUri(file || "current");
			if (!uri) {
				return fail("Nenhum fonte informado e nenhum editor ativo.");
			}

			// Garante que o documento foi aberto (didOpen) e sincronizado com o LS.
			await vscode.workspace.openTextDocument(uri);

			const response = await languageClient.sendRequest(DocumentSymbolRequest.type, {
				textDocument: { uri: uri.toString() }
			});

			return {
				content: [{ type: "text" as const, text: JSON.stringify(response ?? [], null, 2) }]
			};
		}
	);
};
