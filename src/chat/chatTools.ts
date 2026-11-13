import * as vscode from "vscode";
import {
	APPLY_PATCH_COMMAND, COMPILER_COMMAND, COMPILER_PARTICIPANT_ID, COMPILER_TOOL_NAME,
	ChatCompilerToolInput, DEFAULT_COMPILER_TOOL_INPUT, DEFAULT_FLAG_OPTIONS,
	FlagOptions, HELP_COMMAND,
	SYNTAX_ONLY_COMMAND,
	VALIDATE_PATCH_COMMAND,
	isCurrentEditorTargetAlias,
	isOpenEditorsTargetAlias, isWorkspaceTargetAlias, normalizeCommand,
	normalizeTargetKeyword, resolveTarget,
	stripQuotes
} from "../mcp/chatUtils";
import { handleApplyPatchCommand, handleValidPatchCommand } from "../mcp/handlePatchCommands";
import { handleCompilerCommand } from "../mcp/handleCompileCommands";
import { buildHelpText } from "../mcp/helpText";

function isValidCommand(command: string | undefined, prompt: string | undefined): string {
	let result: string = "";

	const allowedCommands: Set<string> = new Set([
		COMPILER_COMMAND,
		SYNTAX_ONLY_COMMAND,
		APPLY_PATCH_COMMAND,
		VALIDATE_PATCH_COMMAND,
		HELP_COMMAND
	]);

	if (!command || !allowedCommands.has(command)) {
		result = "Command not recognized. Use /help to see available commands.";
	}

	return result;
}

/**
 * Heuristic to decide whether the text looks like a direct path/target.
 * @param value Text provided in the prompt.
 * @returns True when the text looks like a path, alias, or valid target.
 */
function looksLikePathOrTarget(value: string): boolean {
	const normalized: string = normalizeTargetKeyword(value);
	if (
		isWorkspaceTargetAlias(normalized) ||
		isCurrentEditorTargetAlias(normalized) ||
		isOpenEditorsTargetAlias(normalized)
	) {
		return true;
	}

	if (/^[a-zA-Z]:[\\/]/.test(value)) {
		return true;
	}

	if (/^\.{1,2}[\\/]/.test(value)) {
		return true;
	}

	if (value.includes("\\") || value.includes("/")) {
		return true;
	}

	if (/\.[a-zA-Z0-9_-]+$/.test(value)) {
		return true;
	}

	return false;
}

/**
 * Extracts target from prompt patterns like target=..., file:..., folder:...
 * or a single value that looks like a path.
 * @param prompt Full prompt sent in the chat.
 * @returns Extracted target when found.
 */
function extractTargetFromPrompt(prompt: string): string | undefined {
	const directiveMatch: RegExpMatchArray | null = prompt.match(
		/(?:^|\s)(?:target|arquivo|file|path|pasta|folder)\s*[:=]\s*("[^"]+"|"[^"]+"|\S+)/i
	);
	if (directiveMatch) {
		return stripQuotes(directiveMatch[1]);
	}

	const normalizedValue: string = normalizeTargetKeyword(prompt);
	if (
		isWorkspaceTargetAlias(normalizedValue) ||
		isCurrentEditorTargetAlias(normalizedValue) ||
		isOpenEditorsTargetAlias(normalizedValue)
	) {
		return normalizedValue;
	}

	const value: string = stripQuotes(prompt);
	if (!value.includes(" ")) {
		if (!/^(only|max|sort)\s*[:=]/i.test(value)) {
			return value;
		}
	}

	if (!value.includes(" ") && looksLikePathOrTarget(value)) {
		return value;
	}

	return undefined;
}

/**
 * Parses diagnostic filter/sort flags from the prompt.
 * @param flags Raw list of flags received by the tool.
 * @returns Normalized filter/sort options and the list of applied flags.
 */
function parseFlagOptions(options: FlagOptions, key: string, value: string): void {
	key = key.toLowerCase();
	value = stripQuotes(value).toLowerCase();

	if (key === "syntaxonly") {
		options.syntaxOnly = value === "true";
		options.applied.push("syntaxOnly=true");
	} else if (key === "applyold") {
		options.applyOld = value === "true";
		options.applied.push("applyOld=true");
	} else if (key === "only") {
		if (value === "error" || value === "errors") {
			options.only = "error";
			options.applied.push("only=error");
		} else if (value === "warning" || value === "warnings" || value === "warn") {
			options.only = "warning";
			options.applied.push("only=warning");
		} else if (value === "all") {
			options.only = "all";
			options.applied.push("only=all");
		}
	} else if (key === "max") {
		const max: number = Number.parseInt(value, 10);
		if (!Number.isNaN(max) && max > 0) {
			options.max = max;
			options.applied.push(`max=${max}`);
		}
	} else if (key === "sort") {
		if (value === "file" || value === "severity" || value === "none") {
			options.sort = value;
			options.applied.push(`sort=${value}`);
		}
	} else if (key === "format") {
		if (value === "markdown" || value === "json") {
			options.format = value;
			options.applied.push(`format=${value}`);
		}
	}

	if (options.applied.length === 0) {
		options.applied.push("(none)");
	}
}


/**
 * Implements the compiler tool used by the chat participant.
 *
 * Responsibilities:
 * - Resolve the compilation target (current editor, file, folder, or workspace).
 * - Execute the corresponding VS Code build command.
 * - Wait for diagnostics to stabilize after compilation.
 * - Collect, filter, sort, and format errors/warnings for chat response.
 *
 * Input options:
 * - target: path/alias of the compilation target.
 * - flags: text parameters for diagnostic filters (only, max, sort).
 */
class ChatTdsTools implements vscode.LanguageModelTool<ChatCompilerToolInput> {
	/**
	 * Prepares the invocation message shown before tool execution.
	 * @param options Tool invocation options.
	 * @param _token Cancellation token.
	 * @returns Preparation message shown in chat.
	 */
	prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<ChatCompilerToolInput>,
		_token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.PreparedToolInvocation> {
		const target: string = resolveTarget(options.input?.target);
		let invocationMessage: string = `Preparing compiler tool for ${target}`;

		if (options.input?.command === APPLY_PATCH_COMMAND) {
			invocationMessage = `Preparing patch application tool for ${target}`;
		} else if (options.input?.command === VALIDATE_PATCH_COMMAND) {
			invocationMessage = `Preparing patch validation tool for ${target}`;
		}

		return {
			invocationMessage
		};
	}

	/**
	 * Executes build, collects diagnostics, and returns the chat summary.
	 * @param options Invocation options with target/flags.
	 * @param token Operation cancellation token.
	 * @returns Text result for chat response.
	 */
	async invoke(
		_options: vscode.LanguageModelToolInvocationOptions<ChatCompilerToolInput>,
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		console.log(`[tds-chat-tools invoke: command='${_options.input?.command ?? COMPILER_COMMAND}' target='${_options.input?.target ?? "<default>"}'`);

		if (token.isCancellationRequested) {
			console.warn("[tds-chat-tools] invoke: canceled before start.");
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart("TDS tool invocation canceled by user.")
			]);
		}
		const command: string | undefined = normalizeCommand(_options.input?.command);
		const input: ChatCompilerToolInput = {
			...structuredClone(DEFAULT_COMPILER_TOOL_INPUT),
			...structuredClone(_options.input ?? {})
		};

		const isValid: string = isValidCommand(command, command);

		if (isValid !== "") {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(isValid)
			]);
		}

		const isHelp: boolean = command === HELP_COMMAND;
		if (isHelp) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(buildHelpText())
			]);
		}

		const target: string = resolveTarget(input.target);
		const flagOptions: FlagOptions = input.flags;

		if ((input.command === VALIDATE_PATCH_COMMAND)) {
			const isError: { value: boolean } = { value: false };
			const validationResult: string = await handleValidPatchCommand(input.target, token, isError);
			let finalMessage: string = !isError.value
				? `Validating the patch for ${resolveTarget(input.target)}.`
				: validationResult;
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(finalMessage)
			]);
		}

		const isError: { value: boolean } = { value: false };

		if (input.command === APPLY_PATCH_COMMAND) {
			const validationResult: string = await handleApplyPatchCommand(input.target, token, isError, flagOptions.applyOld);
			let finalMessage: string = !isError.value
				? `Applying the patch for ${resolveTarget(input.target)}.`
				: validationResult;

			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(finalMessage)
			]);
		}

		const validationResult: string[] = await handleCompilerCommand(target, flagOptions, token, isError);
		return new vscode.LanguageModelToolResult([
			new vscode.LanguageModelTextPart(validationResult.join("\n"))
		]);
	}
}

/**
 * Chat participant handler: parses prompt, builds input, and forwards to the tool.
 * @param request Chat request.
 * @param _context Chat conversation context.
 * @param stream Response stream to send markdown to the user.
 * @param token Request cancellation token.
 * @returns Execution metadata for participant telemetry/logging.
 */
async function compilerParticipantHandler(
	request: vscode.ChatRequest,
	_context: vscode.ChatContext,
	stream: vscode.ChatResponseStream,
	token: vscode.CancellationToken
): Promise<vscode.ChatResult | void> {
	const rawPrompt: string | undefined = request.prompt?.trim();
	let commandPrompt: string | undefined = rawPrompt;
	let command: string | undefined = normalizeCommand(request.command ?? commandPrompt);

	console.log(`[tds-chat-tools participant: received request prompt='${rawPrompt ?? ""}' command='${command ?? ""}'`);
	const isValid: string = isValidCommand(command, commandPrompt);

	if (isValid !== "") {
		console.error(`[tds-chat-tools] participant: invalid command '${command ?? "<undefined>"}'.`);
		stream.markdown("Command not recognized. Use /help to see available commands.\n\n" + buildHelpText());

		return {
			metadata: {
				tool: COMPILER_TOOL_NAME,
				command: HELP_COMMAND
			}
		};
	}

	const isHelp: boolean = command === HELP_COMMAND || rawPrompt === "/help";
	if (isHelp) {
		stream.markdown(buildHelpText());
		return {
			metadata: {
				tool: COMPILER_TOOL_NAME,
				command: HELP_COMMAND
			}
		};
	}

	const isSyntaxOnly: boolean = command === SYNTAX_ONLY_COMMAND;
	const isApplyPatch: boolean = command === APPLY_PATCH_COMMAND;
	const isValidatePatch: boolean = command === VALIDATE_PATCH_COMMAND;
	const compilerToolInput: ChatCompilerToolInput = parserPrompt(command, commandPrompt);

	console.log(`[tds-chat-tools participant: invoking tool command='${compilerToolInput.command ?? ""}' target='${compilerToolInput.target ?? "<default>"}' flags='${compilerToolInput.flags.applied}'`);

	const resolvedTarget: string = resolveTarget(compilerToolInput.target);
	if (isApplyPatch) {
		console.log("[tds-chat-tools] Validating patch package...\n\n");
	} else if (isSyntaxOnly) {
		console.log(`[tds-chat-tools Starting syntax-only compilation for ${resolvedTarget}...\n\n`);
	} else if (isValidatePatch) {
		console.log("[tds-chat-tools] Validating patch...\	n\n");
	} else {
		console.log(`[tds-chat-tools] Starting compilation for ${resolvedTarget}...\n\n`);
	}

	const result: vscode.LanguageModelToolResult = await vscode.lm.invokeTool(
		COMPILER_TOOL_NAME,
		{
			input: compilerToolInput,
			toolInvocationToken: request.toolInvocationToken
		},
		token
	);
	console.log(`[tds-chat-tools participant: tool invocation finished for target='${resolvedTarget}'`);

	if (isApplyPatch) {
		console.log(`[tds-chat-tools Patching complete for ${resolvedTarget}.\n\n`);
	} else if (isValidatePatch) {
		console.log(`[tds-chat-tools Patch validation complete for ${resolvedTarget}.\n\n`);
	} else {
		console.log(`[tds-chat-tools Compilation finished for ${resolvedTarget}.\n\n`);
	}

	const text: string = result.content
		.filter((part): part is vscode.LanguageModelTextPart => part instanceof vscode.LanguageModelTextPart)
		.map((part) => part.value)
		.join("\n");

	stream.markdown(text || "Compiler tool invoked successfully.");
	console.log(`[tds-chat-tools participant: streamed result length=${text.length}`);

	return {
		metadata: {
			tool: COMPILER_TOOL_NAME,
			command: command ?? COMPILER_COMMAND
		}
	};
}

/**
 * Registers the language model tool and chat participant for compilation.
 * @param context Extension context to register disposables.
 */
export function registerChatTools(context: vscode.ExtensionContext): vscode.Disposable[] {
	const disposables: vscode.Disposable[] = [];

	console.warn(`Registering chat tools for TDS compilation...${COMPILER_TOOL_NAME}`);

	disposables.push(
		vscode.lm.registerTool(COMPILER_TOOL_NAME, new ChatTdsTools())
	);

	const participant: vscode.ChatParticipant = vscode.chat.createChatParticipant(
		COMPILER_PARTICIPANT_ID,
		compilerParticipantHandler
	);
	participant.iconPath = vscode.Uri.file(context.asAbsolutePath("icons/totvs24x24.png"));

	disposables.push(participant);
	return disposables;
}

function parserPrompt(command: string, prompt: string): ChatCompilerToolInput {
	const result: ChatCompilerToolInput = {
		command: command,
		target: "",
		flags: structuredClone(DEFAULT_FLAG_OPTIONS)
	};
	const parts: string[] = prompt.split(/\s+/);
	let isFirstPart: boolean = true;

	for (const part of parts) {
		const subPart: string[] = part.split(/[=\:]/);

		if (subPart.length === 2) {
			const key: string = subPart[0].toLowerCase();
			const value: string = subPart[1];

			if (key === "target") {
				result.target = value;
			} else {
				parseFlagOptions(result.flags, key, value);
			}
		} else if (subPart.length === 1 && isFirstPart) {
			result.target = subPart[0];
		}
		isFirstPart = false;
	}

	if (result.target.length === 0) {
		result.target = "current";
	}
	if (result.flags.applied.length === 0) {
		result.flags.applied.push("(none)");
	}

	console.log(`parserPrompt: parsed input=${JSON.stringify(result)}`);

	return structuredClone(result);
}