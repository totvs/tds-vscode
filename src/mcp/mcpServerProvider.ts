import * as vscode from 'vscode';
import * as path from 'path';

/**
 * MCP Server Definition Provider that registers our LSP MCP server with VS Code
 */
export class TdsMcpServerProvider implements vscode.McpServerDefinitionProvider {
	private _onDidChangeMcpServerDefinitions = new vscode.EventEmitter<void>();
	public readonly onDidChangeMcpServerDefinitions = this._onDidChangeMcpServerDefinitions.event;

	/**
	 * Provide the MCP server definitions
	 */
	public async provideMcpServerDefinitions(): Promise<vscode.McpServerDefinition[]> {
		const extension = vscode.extensions.getExtension('TOTVS.tds-vscode');
		if (!extension) {
			console.warn('Unable to resolve extension metadata for MCP stdio server definition.');
			return [];
		}
		const version: string = extension.packageJSON["version"];
		const stdioServerScript = path.join(extension.extensionPath, 'out', 'mcp', 'stdioServer.js');

		const definition = new vscode.McpStdioServerDefinition(
			'tds-mcp-server',
			process.execPath,
			[stdioServerScript],
			{},
			version
		);

		definition.cwd = extension.extensionUri;

		return [definition];
	}

	/**
	 * Resolve MCP server definition - called when the server needs to be started
	 */
	public async resolveMcpServerDefinition(
		definition: vscode.McpServerDefinition
	): Promise<vscode.McpServerDefinition> {
		// No additional resolution needed for our stdio server definition
		return definition;
	}

	/**
	 * Dispose the provider
	 */
	public dispose(): void {
		this._onDidChangeMcpServerDefinitions.dispose();
	}
}

/**
 * Register the MCP server provider with VS Code
 */
export function registerMcpServerProvider(): vscode.Disposable[] {
	const provider = new TdsMcpServerProvider();
	const disposable = vscode.lm.registerMcpServerDefinitionProvider(
		'tds-mcp-server',
		provider
	);

	return [provider, disposable];
}