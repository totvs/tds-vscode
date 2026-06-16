import * as vscode from 'vscode';

/**
 * Input schema for position-based tools
 */
interface ToolCompilerInput {
    uri: string;
    line: number;
    character: number;
}

// /**
//  * Input schema for references tool
//  */
// interface ToolReferencesInput extends ToolCompilerInput {
//     includeDeclaration?: boolean;
// }

// /**
//  * Input schema for completion tool
//  */
// interface ToolCompletionInput extends ToolCompilerInput {
//     triggerKind?: number;
//     triggerCharacter?: string;
// }

// /**
//  * Input schema for workspace symbols tool
//  */
// interface ToolWorkspaceSymbolsInput {
//     query: string;
// }

// /**
//  * Input schema for document symbols tool
//  */
// interface ToolDocumentSymbolsInput {
//     uri: string;
// }

// /**
//  * Input schema for rename symbol tool
//  */
// interface ToolRenameInput extends ToolPositionInput {
//     newName: string;
// }

// /**
//  * Input schema for code actions tool
//  */
// interface ToolCodeActionsInput {
//     uri: string;
//     range: {
//         start: { line: number; character: number };
//         end: { line: number; character: number };
//     };
//     context?: {
//         only?: string[];
//     };
// }

// /**
//  * Input schema for format document tool
//  */
// interface ToolFormatInput {
//     uri: string;
//     options?: any;
// }

// /**
//  * Input schema for signature help tool
//  */
// interface ToolSignatureHelpInput extends ToolPositionInput {
//     triggerKind?: number;
//     triggerCharacter?: string;
// }

/**
 * Register all Language Model Tools for GitHub Copilot integration
 */
export function registerLanguageModelTools(): vscode.Disposable[] {
    const disposables: vscode.Disposable[] = [];

    // Register lsp_definition tool
    disposables.push(vscode.lm.registerTool('compiler', {
        prepareInvocation: (options: vscode.LanguageModelToolInvocationPrepareOptions<ToolCompilerInput>, token: vscode.CancellationToken): vscode.ProviderResult<vscode.PreparedToolInvocation> => {
            if (token.isCancellationRequested) {
                return undefined;
            }

            const input: ToolCompilerInput | undefined = options.input;
            const location: string = input?.uri
                ? `${input.uri}:${(input.line ?? 0) + 1}:${(input.character ?? 0) + 1}`
                : 'current location';

            return {
                invocationMessage: `Preparing compiler tool for ${location}`
            };

        },
        invoke: async (options: vscode.LanguageModelToolInvocationOptions<ToolCompilerInput>, _token: vscode.CancellationToken) => {
            const input = options.input;

            // const result: vscode.LanguageModelToolResult = await vscode.lm.invokeTool(
            //     COMPILER_TOOL_NAME,
            //     {
            //         input,
            //         toolInvocationToken: request.toolInvocationToken
            //     },
            //     token
            // );
            try {

                const response = `Compiler result:\n\n`;

                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(response)
                ]);
            } catch (error) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(`Error getting definition: ${error}`)
                ]);
            }
        }
    }));

    return disposables;
}
