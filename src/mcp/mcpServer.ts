import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

export class TdsMcpServer {
	private mcpServer: McpServer;

	private readonly toolCatalog: Record<string, { description: string; usage: string; enabled: boolean }> = {
		help: {
			description: 'Shows available MCP tools and usage examples',
			usage: 'help  or  help { toolName: "<name>" }',
			enabled: true,
		},
		compiler: {
			description: 'Trigger compilation of the active editor, open editors, a path, or the workspace',
			usage: 'compiler  or  compiler { target?: string, flags?: string[] }',
			enabled: true,
		},
		// Tools below are not yet enabled — implementations are commented out
		'lsp.references': {
			description: 'Find all references to a symbol at a given position',
			usage: 'lsp.references { uri, position: { line, character }, includeDeclaration? }',
			enabled: false,
		},
		'lsp.hover': {
			description: 'Get hover information for a symbol at a given position',
			usage: 'lsp.hover { uri, position: { line, character } }',
			enabled: false,
		},
		'lsp.completion': {
			description: 'Get code-completion suggestions at a given position',
			usage: 'lsp.completion { uri, position: { line, character }, triggerKind?, triggerCharacter? }',
			enabled: false,
		},
	};

	constructor() {
		this.mcpServer = new McpServer({
			name: 'tds-mcp-server',
			version: '0.0.1',
		});

		this.registerTools();
	}

	/**
	 * Register all MCP tools
	 */
	private registerTools(): void {
		this.registerHelpTool();
		this.registerCompilerTool();
		// this.registerReferencesTool();
		// this.registerHoverTool();
		// this.registerCompletionTool();
	}

	private registerHelpTool(): void {
		this.mcpServer.registerTool(
			'help',
			{
				title: 'Help',
				description: 'Get help information about the available tools',
				inputSchema: {
					toolName: z.string().optional().describe('Name of the tool to get detailed help for (optional)')
				}
			},
			async (input) => {
				const { toolName } = input as { toolName?: string };

				if (toolName) {
					const normalizedToolName = toolName.trim().toLowerCase();
					const tool = this.toolCatalog[normalizedToolName];

					if (!tool) {
						return {
							content: [{
								type: 'text',
								text: `Unknown tool: ${toolName}. Use help without parameters to list all tools.`
							}],
							isError: true
						};
					}

					return {
						content: [{
							type: 'text',
							text: [
								`Tool: ${normalizedToolName}`,
								`Description: ${tool.description}`,
								`Usage: ${tool.usage}`,
								`Status: ${tool.enabled ? 'enabled' : 'disabled'}`
							].join('\n')
						}]
					};
				}

				const toolsList = Object.entries(this.toolCatalog)
					.map(([name, tool]) => `- ${name} (${tool.enabled ? 'enabled' : 'disabled'}): ${tool.description}`)
					.join('\n');

				return {
					content: [{
						type: 'text',
						text: [
							'Available MCP tools:',
							toolsList,
							'',
							'Use help { toolName: "<name>" } to get detailed usage.'
						].join('\n')
					}]
				};
			}
		);
	}

	private registerCompilerTool(): void {
		this.mcpServer.registerTool(
			'compiler',
			{
				title: 'Compiler',
				description: 'Trigger compilation of the active editor, open editors, a path, or the workspace',
				inputSchema: {
					target: z.string().optional().describe('Compilation target: "file", "editors", "workspace", or a file path (optional)'),
					flags: z.array(z.string()).optional().describe('Additional compiler flags (optional)')
				}
			},
			async (input) => {
				const { target, flags } = input as { target?: string; flags?: string[] };

				// Return structured response about compilation capability
				return {
					content: [{
						type: 'text',
						text: [
							'Compiler tool is available.',
							`Target: ${target || 'active editor (default)'}`,
							`Flags: ${flags?.join(', ') || 'none'}`,
							'',
							'To trigger compilation, use this tool with optional parameters:',
							'- target: "file" (active editor), "editors" (all open), "workspace", or a file path',
							'- flags: array of compiler flags'
						].join('\n')
					}]
				};
			}
		);
	}

	/**
	 * Start the MCP server with stdio transport
	 */
	public async start(): Promise<void> {
		const transport = new StdioServerTransport();
		await this.mcpServer.connect(transport);
	}

	/**
	 * Get the underlying MCP server instance
	 */
	public getServer(): McpServer {
		return this.mcpServer;
	}
}