import { McpRegistrar } from "../mcpTypes";
import { registerPingTool } from "./pingTool";
import { registerCompileTool } from "./compileTool";
import { registerPatchTools } from "./patchTools";
import { registerHelpTool } from "./helpTool";
import { registerFixTool } from "./fixTool";
import { registerLanguageFeaturesTools } from "./languageFeaturesTools";

/**
 * Lista de registradores de ferramentas.
 * Para adicionar uma nova ferramenta: crie o arquivo em `tools/` e inclua-o aqui.
 */
const toolRegistrars: McpRegistrar[] = [
	registerPingTool,
	registerCompileTool,
	registerFixTool,
	registerPatchTools,
	registerLanguageFeaturesTools,
	registerHelpTool
];

export const registerTools: McpRegistrar = (server) => {
	toolRegistrars.forEach((register) => register(server));
};
