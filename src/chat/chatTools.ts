import * as vscode from "vscode";
import {
	APPLY_PATCH_COMMAND, COMPILER_COMMAND, COMPILER_PARTICIPANT_ID, COMPILER_TOOL_NAME,
	ChatCompilerToolInput, DEFAULT_COMPILER_TOOL_INPUT, DEFAULT_FLAG_OPTIONS, DIAGNOSTIC_IDLE_WINDOW_MS, DIAGNOSTIC_WAIT_TIMEOUT_MS,
	DiagnosticEntry, DiagnosticsWaitResult,
	FlagOptions, HELP_COMMAND,
	SYNTAX_ONLY_COMMAND,
	VALIDATE_PATCH_COMMAND,
	isCurrentEditorTargetAlias,
	isOpenEditorsTargetAlias, isWorkspaceTargetAlias, normalizeCommand,
	normalizeTargetKeyword, resolveTarget,
	stripQuotes
} from "./chatUtils";
import { handleApplyPatchCommand, handleValidPatchCommand } from "./handlePatchCommands";
import { handleCompilerCommand } from "./handleCompileCommands";

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
}

/**
 * Waits for diagnostics to stabilize after compilation to avoid partial reads.
 * @param token Invocation cancellation token.
 * @param timeoutMs Timeout in ms to wait for diagnostic changes.
 * @returns Wait result, including change, timeout, and cancellation.
 */
export async function waitForDiagnosticsChange(
	token: vscode.CancellationToken,
	timeoutMs: number = DIAGNOSTIC_WAIT_TIMEOUT_MS
): Promise<DiagnosticsWaitResult> {
	console.log(`[tds-chat-tools] [tds-chat-tools] waitForDiagnosticsChange: start timeoutMs=${timeoutMs}`);
	return await new Promise<DiagnosticsWaitResult>((resolve) => {
		let finished: boolean = false;
		let idleTimer: NodeJS.Timeout | undefined;
		let hasChange: boolean = false;
		let timedOut: boolean = false;
		let canceled: boolean = false;
		let cancelDisposable: vscode.Disposable | undefined;

		const scheduleIdleResolve: () => void = (): void => {
			if (idleTimer) {
				clearTimeout(idleTimer);
			}
			console.log("[tds-chat-tools] [tds-chat-tools] waitForDiagnosticsChange: diagnostics changed, scheduling idle resolve.");

			idleTimer = setTimeout(() => finish(), DIAGNOSTIC_IDLE_WINDOW_MS);
		};

		const finish: () => void = (): void => {
			if (finished) {
				return;
			}
			finished = true;
			disposable.dispose();
			if (cancelDisposable) {
				cancelDisposable.dispose();
			}
			if (idleTimer) {
				clearTimeout(idleTimer);
			}
			clearTimeout(timeout);
			console.log(`[tds-chat-tools] [tds-chat-tools] waitForDiagnosticsChange: finish changed=${hasChange} timedOut=${timedOut} canceled=${canceled}`);
			resolve({
				changed: hasChange,
				timedOut,
				canceled
			});
		};

		const disposable: vscode.Disposable = vscode.languages.onDidChangeDiagnostics(() => {
			hasChange = true;
			scheduleIdleResolve();
		});
		if (token) {
			cancelDisposable = token.onCancellationRequested(() => {
				console.warn("[tds-chat-tools] waitForDiagnosticsChange: canceled by token.");
				canceled = true;
				finish();
			});
		}
		const timeout: NodeJS.Timeout = setTimeout(() => {
			console.warn("[tds-chat-tools] waitForDiagnosticsChange: timeout reached.");
			timedOut = true;
			finish();
		}, timeoutMs);
	});
}

/**
 * Collects diagnostics only for open documents.
 * @returns List of diagnostics eligible for chat display.
 */
export function collectDiagnosticsForOpenEditors(): DiagnosticEntry[] {
	const openDocumentKeys: Set<string> = new Set(
		vscode.workspace.textDocuments.map((document) =>
			document.uri.scheme === "file"
				? `file:${document.uri.fsPath.toLowerCase()}`
				: `uri:${document.uri.toString(true)}`
		)
	);

	const diagnosticsByUri: [vscode.Uri, vscode.Diagnostic[]][] = vscode.languages.getDiagnostics();
	const filtered: [vscode.Uri, vscode.Diagnostic[]][] = diagnosticsByUri.filter(([uri]) => {
		if (uri.scheme === "file") {
			return openDocumentKeys.has(`file:${uri.fsPath.toLowerCase()}`);
		}

		return openDocumentKeys.has(`uri:${uri.toString(true)}`);
	});

	const entries: DiagnosticEntry[] = [];
	for (const [uri, diagnostics] of filtered) {
		for (const diagnostic of diagnostics) {
			if (
				diagnostic.severity === vscode.DiagnosticSeverity.Error ||
				diagnostic.severity === vscode.DiagnosticSeverity.Warning
			) {
				entries.push({ uri, diagnostic });
			}
		}
	}

	return entries;
}

/**
 * Generates help text with commands and options supported by chat.
 * @returns Help text in markdown for chat.
 */
function buildHelpText(): string {
	const lines: string[] = [
		vscode.l10n.t("Available commands:"),
		vscode.l10n.t("- /{0}: compiles the target (default: current editor).", COMPILER_COMMAND),
		vscode.l10n.t("- /{0}: compiles the target using syntax-only mode.", SYNTAX_ONLY_COMMAND),
		vscode.l10n.t("- /{0}: applies a patch file (.ptm, .zip, .upd).", APPLY_PATCH_COMMAND),
		vscode.l10n.t("- /{0}: validates a patch file (.ptm, .zip, .upd).", VALIDATE_PATCH_COMMAND),
		vscode.l10n.t("- /help: shows this help."),
		"",
		vscode.l10n.t("Supported targets:"),
		vscode.l10n.t("- current editor: editor, current (default)"),
		vscode.l10n.t("- open editors: open-files, open-editors, arquivos-abertos, fontes-abertos, arquivos abertos, fontes abertos"),
		vscode.l10n.t("- workspace: workspace, ws, all"),
		vscode.l10n.t("- file: relative or absolute path (ex: src/meu.prw)"),
		vscode.l10n.t("- folder: relative or absolute path (ex: src/modulo)"),
		"",
		vscode.l10n.t("Notes:"),
		vscode.l10n.t("- If you provide only a single name (no spaces), it is treated as the target."),
		vscode.l10n.t("- The command is executed on the current server/environment."),
		"",
		vscode.l10n.t("Supported flags (use key=value or key:value):"),
		vscode.l10n.t("- syntaxOnly=true|false"),
		vscode.l10n.t("- only=all|error|warning"),
		vscode.l10n.t("- max=N"),
		vscode.l10n.t("- sort=none|file|severity"),
		vscode.l10n.t("- format=markdown|json"),
		"",
		vscode.l10n.t("Examples:"),
		vscode.l10n.t("- /{0} target=src/modulo syntaxOnly=true only=error sort=file", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} target=editor", SYNTAX_ONLY_COMMAND),
		vscode.l10n.t("- /{0} target=open-editors", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} src/modulo", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} only=error", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} syntaxOnly=true", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} format=json", COMPILER_COMMAND),
		vscode.l10n.t("- /{0} patches/fix.ptm", APPLY_PATCH_COMMAND),
		vscode.l10n.t("- /{0} c:/patches/fix.zip", APPLY_PATCH_COMMAND),
		vscode.l10n.t("- /{0} patches/fix.ptm", VALIDATE_PATCH_COMMAND),
		vscode.l10n.t("- /{0} c:/patches/fix.zip", VALIDATE_PATCH_COMMAND)
	];

	return lines.join("\n");
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
		options: vscode.LanguageModelToolInvocationOptions<ChatCompilerToolInput>,
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		console.log(`[tds-chat-tools] [tds-chat-tools] invoke: command='${options.input?.command ?? COMPILER_COMMAND}' target='${options.input?.target ?? "<default>"}' flags='${options.input?.flags.applied}']`);

		if (token.isCancellationRequested) {
			console.warn("[tds-chat-tools] invoke: canceled before start.");
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart("TDS tool invocation canceled by user.")
			]);
		}
		const command: string | undefined = normalizeCommand(options.input?.command);
		const _input: ChatCompilerToolInput = options.input ?? DEFAULT_COMPILER_TOOL_INPUT;
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

		const target: string = resolveTarget(_input.target);
		//const targetUri: vscode.Uri | undefined = resolveTargetUri(input.target);
		const flagOptions: FlagOptions = _input.flags;  //parseFlagOptions(input.flags);
		//const flags: string = flagOptions.applied.length > 0 ? flagOptions.applied.join(", ") : "none";

		if ((_input.command === VALIDATE_PATCH_COMMAND)) {
			const isError: { value: boolean } = { value: false };
			const validationResult: string = await handleValidPatchCommand(_input.target, token, isError);
			let finalMessage: string = !isError.value
				? `Validating the patch for ${resolveTarget(_input.target)}.`
				: validationResult;
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(finalMessage)
			]);
		}

		const isError: { value: boolean } = { value: false };

		if (_input.command === APPLY_PATCH_COMMAND) {
			const validationResult: string = await handleApplyPatchCommand(_input.target, token, isError, flagOptions.applyOld);
			let finalMessage: string = !isError.value
				? `Applying the patch for ${resolveTarget(_input.target)}.`
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

	console.log(`[tds-chat-tools] [tds-chat-tools] participant: received request prompt='${rawPrompt ?? ""}' command='${command ?? ""}'`);
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

	// if (isApplyPatch) {
	// 	input.target = commandPrompt;
	// 	delete input.target;
	// 	//delete input.syntaxOnly;
	// }

	// if (!isApplyPatch && commandPrompt?.trim()) {
	// 	if (isSyntaxOnly && !compilerToolInput) {
	// 		flags.push("only=all");
	// 	}

	// 	input.flags = flags;
	// } else if (!isApplyPatch && isSyntaxOnly) {
	// 	input.flags = ["only=all"];
	// }
	console.log(`[tds-chat-tools] [tds-chat-tools] participant: invoking tool command='${compilerToolInput.command ?? ""}' target='${compilerToolInput.target ?? "<default>"}' flags='${compilerToolInput.flags.applied}'`);

	const resolvedTarget: string = resolveTarget(compilerToolInput.target);
	if (isApplyPatch) {
		console.log("[tds-chat-tools] Validating patch package...\n\n");
	} else if (isSyntaxOnly) {
		console.log(`[tds-chat-tools] Starting syntax-only compilation for ${resolvedTarget}...\n\n`);
	} else if (isValidatePatch) {
		console.log("[tds-chat-tools] Validating patch...\n\n");
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
	console.log(`[tds-chat-tools] [tds-chat-tools] participant: tool invocation finished for target='${resolvedTarget}'`);

	if (isApplyPatch) {
		console.log(`[tds-chat-tools] Patching complete for ${resolvedTarget}.\n\n`);
	} else if (isValidatePatch) {
		console.log(`[tds-chat-tools] Patch validation complete for ${resolvedTarget}.\n\n`);
	} else {
		console.log(`[tds-chat-tools] Compilation finished for ${resolvedTarget}.\n\n`);
	}

	const text: string = result.content
		.filter((part): part is vscode.LanguageModelTextPart => part instanceof vscode.LanguageModelTextPart)
		.map((part) => part.value)
		.join("\n");

	stream.markdown(text || "Compiler tool invoked successfully.");
	console.log(`[tds-chat-tools] [tds-chat-tools] participant: streamed result length=${text.length}`);

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

	return result;
}