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

				const target: string = resolveTarget(input.target);
				const targetUri: vscode.Uri | undefined = resolveTargetUri(input.target);
				const flagOptions: FlagOptions = parseFlagOptions(input.flags);
				const flags: string = flagOptions.applied.length > 0 ? flagOptions.applied.join(", ") : "none";

				if ((input.command === VALIDATE_PATCH_COMMAND) || (input.command === APPLY_PATCH_COMMAND)) {
					const isError: { value: boolean } = { value: false };
					const validationResult: string = await handleValidPatchCommand(input.target, token, isError);
					let finalMessage: string = !isError.value
						? `Validating the patch for ${resolveTarget(input.target)}.`
						: validationResult;
					return new vscode.LanguageModelToolResult([
						new vscode.LanguageModelTextPart(finalMessage)
					]);
				}

				if (input.command === APPLY_PATCH_COMMAND) {
					const isError: { value: boolean } = { value: false };
					const validationResult: string = await handleApplyPatchCommand(input.target, token, isError, flagOptions.applyOld);
					if (isError.value) {
						let finalMessage: string = !isError.value
							? `Applying the patch for ${resolveTarget(input.target)}.`
							: validationResult;
						return new vscode.LanguageModelToolResult([
							new vscode.LanguageModelTextPart(finalMessage)
						]);
					}
				}

				const isOpenEditorsTarget: boolean = target === "open-editors";
				const isWorkspaceTarget: boolean = target === "workspace" && !targetUri;
				const commandIdBase: string = isWorkspaceTarget
					? REBUILD_WORKSPACE_COMMAND
					: isOpenEditorsTarget
						? REBUILD_OPEN_EDITORS_COMMAND
						: REBUILD_FILE_COMMAND;
				const commandId: string = flagOptions.syntaxOnly ? SYNTAX_ONLY_FILE_COMMAND : commandIdBase;

				try {
					if (isWorkspaceTarget || isOpenEditorsTarget) {
						await vscode.commands.executeCommand(commandId);
					} else if (targetUri) {
						await vscode.commands.executeCommand(commandId, undefined, [targetUri]);
					} else {
						await vscode.commands.executeCommand(commandId);
					}
				} catch (error) {
					return new vscode.LanguageModelToolResult([
						new vscode.LanguageModelTextPart(
							`TDS tool command failed (${commandId}): ${error instanceof Error ? error.message : String(error)}`
						)
					]);
				}

				const diagnosticsTimeout: number = isDirectoryUri(targetUri)
					? DIAGNOSTIC_WAIT_TIMEOUT_MS_FOLDER
					: DIAGNOSTIC_WAIT_TIMEOUT_MS;
				const waitResult: DiagnosticsWaitResult = await waitForDiagnosticsChange(token, diagnosticsTimeout);
				if (waitResult.canceled) {
					return new vscode.LanguageModelToolResult([
						new vscode.LanguageModelTextPart("Compiler tool invocation canceled by user.")
					]);
				}

				const diagnostics: DiagnosticEntry[] = applyDiagnosticFilterOptions(
					isOpenEditorsTarget ? collectDiagnosticsForOpenEditors() : collectDiagnostics(targetUri, isWorkspaceTarget),
					flagOptions
				);
				const showAllDiagnostics: boolean = isDirectoryUri(targetUri);
				const maxToShow: number = flagOptions.max && flagOptions.max > 0
					? flagOptions.max
					: (showAllDiagnostics ? diagnostics.length : MAX_DIAGNOSTICS_TO_SHOW);
				const displayedDiagnostics: DiagnosticEntry[] = diagnostics.slice(0, maxToShow);
				const diagnosticsSummary: string = formatDiagnosticsSummary(
					displayedDiagnostics,
					target,
					diagnostics.length > displayedDiagnostics.length,
					flagOptions.format
				);

				const summary: string = flagOptions.format === "json"
					? JSON.stringify({
						command: commandId,
						target,
						flags: flags,
						diagnosticsUpdated: waitResult.changed,
						timedOut: waitResult.timedOut,
						diagnostics: JSON.parse(diagnosticsSummary)
					}, null, 2)
					: [
						"Compiler tool executed successfully with:",
						//`- command: ${commandId}`,
						`- target: ${target}`,
						`- compiler`,
						`- flags: ${flags}`,
						//`- diagnostics-updated: ${waitResult.changed ? "true" : "false"}`,
						"",
						...(waitResult.timedOut && !waitResult.changed
							? [
								"Diagnostics were not updated before timeout. Results below may reflect a previous compile.",
								""
							]
							: []),
						diagnosticsSummary
					].join("\n");

				return new vscode.LanguageModelToolResult([
					new vscode.LanguageModelTextPart(summary)
				]);
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