import { McpRegistrar } from "../mcpTypes";
import { registerPingTool } from "./pingTool";
import { registerCompileTool } from "./compileTool";
import { registerPatchTools } from "./patchTools";
import { registerHelpTool } from "./helpTool";
import { registerFixTool } from "./fixTool";
import { registerDocumentSymbolsTool } from "./documentSymbolsTool";
import { registerDefinitionTool } from "./definitionTool";
import { registerReferencesTool } from "./referencesTool";
import { registerHoverTool } from "./hoverTool";
import { registerCompletionTool } from "./completionTool";
import { registerWorkspaceSymbolsTool } from "./workspaceSymbolsTool";
import { registerRenameSymbolTool } from "./renameSymbolTool";
// `tds_code_actions` desativada: `tds_fix` (com apply=false) já lista as opções de correção.
// import { registerCodeActionsTool } from "./codeActionsTool";
import { registerFormatDocumentTool } from "./formatDocumentTool";
import { registerSignatureHelpTool } from "./signatureHelpTool";

/**
 * Lista de registradores de ferramentas.
 * Para adicionar uma nova ferramenta: crie o arquivo em `tools/` e inclua-o aqui.
 */
const toolRegistrars: McpRegistrar[] = [
	registerPingTool,
	registerCompileTool,
	registerFixTool,
	registerPatchTools,
	registerDocumentSymbolsTool,
	registerDefinitionTool,
	registerReferencesTool,
	registerHoverTool,
	registerCompletionTool,
	registerWorkspaceSymbolsTool,
	registerRenameSymbolTool,
	// registerCodeActionsTool,
	registerFormatDocumentTool,
	registerSignatureHelpTool,
	registerHelpTool
];

export const registerTools: McpRegistrar = (server) => {
	toolRegistrars.forEach((register) => register(server));
};
