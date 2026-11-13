import { McpRegistrar } from "../mcpTypes";
import { registerCompilePrompts } from "./compilePrompts";

/**
 * Lista de registradores de prompts.
 * Para adicionar um novo prompt: crie o arquivo em `prompts/` e inclua-o aqui.
 */
const promptRegistrars: McpRegistrar[] = [registerCompilePrompts];

export const registerPrompts: McpRegistrar = (server) => {
	promptRegistrars.forEach((register) => register(server));
};
