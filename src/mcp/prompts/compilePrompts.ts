import { z } from "zod";
import { McpRegistrar } from "../mcpTypes";

const COMPILE_TOOL = "tds_compile";

function userMessage(text: string) {
	return {
		messages: [{ role: "user" as const, content: { type: "text" as const, text } }]
	};
}

/**
 * Prompts de compilação:
 * - `tds_compile_current`: compila o fonte corrente (editor ativo);
 * - `tds_compile_folder`: compila uma pasta indicada pelo usuário.
 * Ambos orientam o modelo a usar a ferramenta `tds_compile` e a analisar o resultado.
 */
export const registerCompilePrompts: McpRegistrar = (server) => {
	server.registerPrompt(
		"tds_compile_current",
		{
			title: "Compilar fonte corrente",
			description: "Compila o fonte AdvPL/TLPP/4GL do editor ativo e analisa os erros e avisos retornados."
		},
		() =>
			userMessage(
				[
					`Compile o fonte do editor ativo usando a ferramenta ${COMPILE_TOOL}, sem informar 'target'.`,
					"Depois da compilação:",
					"- Se houver erros, liste cada um com arquivo, linha e mensagem, explique a causa provável e proponha a correção.",
					"- Se houver somente avisos, resuma-os e indique se merecem atenção.",
					"- Se não houver problemas, informe que a compilação foi concluída com sucesso."
				].join("\n")
			)
	);

	server.registerPrompt(
		"tds_compile_folder",
		{
			title: "Compilar pasta",
			description: "Compila todos os fontes de uma pasta indicada pelo usuário e analisa os erros e avisos retornados.",
			argsSchema: {
				folder: z.string().describe("Pasta a compilar (caminho absoluto ou relativo ao workspace)")
			}
		},
		({ folder }) =>
			userMessage(
				[
					`Compile a pasta "${folder}" usando a ferramenta ${COMPILE_TOOL} com target="${folder}".`,
					"Depois da compilação:",
					"- Agrupe os problemas por arquivo, listando linha e mensagem de cada erro.",
					"- Priorize os erros sobre os avisos e proponha a correção dos mais relevantes.",
					"- Se não houver problemas, informe que a compilação da pasta foi concluída com sucesso."
				].join("\n")
			)
	);
};
