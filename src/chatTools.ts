import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const COMPILER_TOOL_NAME = 'chat-tds-compiler';
const COMPILER_PARTICIPANT_ID = 'tds-vscode.compiler';
const COMPILER_COMMAND = 'chat-tds-compiler';
const REBUILD_COMMAND = 'chat-tds-rebuild';

const WORKSPACE_TARGET_ALIASES = new Set([
	'workspace',
	'projeto',
	'ws',
	'all'
]);

const CURRENT_EDITOR_TARGET_ALIASES = new Set([
	'current',
	'current-editor',
	'editor',
	'editor-atual',
	'editor-corrente',
	'arquivo-atual'
]);

type ChatCompilerToolInput = {
	target?: string;
	rebuild?: boolean;
	flags?: string[];
};

type DiagnosticEntry = {
	uri: vscode.Uri;
	diagnostic: vscode.Diagnostic;
};

type DiagnosticFilterOptions = {
	only: 'all' | 'error' | 'warning';
	max?: number;
	source?: string;
	sort: 'none' | 'file' | 'severity';
	applied: string[];
};

type DiagnosticsWaitResult = {
	changed: boolean;
	timedOut: boolean;
	canceled: boolean;
};

const MAX_DIAGNOSTICS_TO_SHOW = 20;
const DIAGNOSTIC_WAIT_TIMEOUT_MS = 12000;
const DIAGNOSTIC_IDLE_WINDOW_MS = 900;

const DEFAULT_DIAGNOSTIC_FILTER_OPTIONS: DiagnosticFilterOptions = {
	only: 'all',
	sort: 'none',
	applied: []
};

/**
 * Remove aspas simples/duplas nas bordas do valor informado no prompt.
 * @param value Texto bruto informado pelo usuário.
 * @returns Texto sem aspas externas.
 */
function stripQuotes(value: string): string {
	const trimmed = value.trim();
	if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith('\'') && trimmed.endsWith('\''))) {
		return trimmed.slice(1, -1).trim();
	}

	return trimmed;
}

/**
 * Normaliza palavras-chave de target para comparação case-insensitive.
 * @param value Valor de target informado no prompt.
 * @returns Target normalizado em minúsculas.
 */
function normalizeTargetKeyword(value: string): string {
	return value.trim().toLowerCase();
}

/**
 * Verifica se o valor representa o target de workspace.
 * @param value Valor de target.
 * @returns True quando o target representa workspace.
 */
function isWorkspaceTargetAlias(value: string): boolean {
	return WORKSPACE_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Verifica se o valor representa o target do editor atual.
 * @param value Valor de target.
 * @returns True quando o target representa o editor corrente.
 */
function isCurrentEditorTargetAlias(value: string): boolean {
	return CURRENT_EDITOR_TARGET_ALIASES.has(normalizeTargetKeyword(value));
}

/**
 * Heurística para decidir se o texto parece um path/target direto.
 * @param value Texto informado no prompt.
 * @returns True quando o texto parece um caminho, alias ou target válido.
 */
function looksLikePathOrTarget(value: string): boolean {
	const normalized = normalizeTargetKeyword(value);
	if (isWorkspaceTargetAlias(normalized) || isCurrentEditorTargetAlias(normalized)) {
		return true;
	}

	if (/^[a-zA-Z]:[\\/]/.test(value)) {
		return true;
	}

	if (/^\.{1,2}[\\/]/.test(value)) {
		return true;
	}

	if (value.includes('\\') || value.includes('/')) {
		return true;
	}

	if (/\.[a-zA-Z0-9_-]+$/.test(value)) {
		return true;
	}

	return false;
}

/**
 * Extrai target do prompt em padrões como target=..., file:..., pasta:...
 * ou valor único que pareça caminho.
 * @param prompt Prompt completo enviado no chat.
 * @returns Target extraído quando encontrado.
 */
function extractTargetFromPrompt(prompt: string): string | undefined {
	const directiveMatch = prompt.match(
		/(?:^|\s)(?:target|arquivo|file|path|pasta|folder)\s*[:=]\s*("[^"]+"|'[^']+'|\S+)/i
	);
	if (directiveMatch) {
		return stripQuotes(directiveMatch[1]);
	}

	const value = stripQuotes(prompt);
	if (!value.includes(' ') && looksLikePathOrTarget(value)) {
		return value;
	}

	return undefined;
}

/**
 * Faz parse das flags de filtro/ordenação de diagnósticos vindas do prompt.
 * @param flags Lista bruta de flags recebida pela tool.
 * @returns Opções normalizadas de filtro/ordenação e lista de flags aplicadas.
 */
function parseDiagnosticFilterOptions(flags: string[] | undefined): DiagnosticFilterOptions {
	if (!flags || flags.length === 0) {
		return { ...DEFAULT_DIAGNOSTIC_FILTER_OPTIONS, applied: [] };
	}

	const joined = flags.join(' ');
	const options: DiagnosticFilterOptions = {
		...DEFAULT_DIAGNOSTIC_FILTER_OPTIONS,
		applied: []
	};
	const regex = /(only|max|source|sort)\s*[:=]\s*("[^"]+"|'[^']+'|\S+)/gi;
	let match: RegExpExecArray | null;

	while ((match = regex.exec(joined)) !== null) {
		const key = match[1].toLowerCase();
		const rawValue = stripQuotes(match[2]);
		const value = rawValue.toLowerCase();

		if (key === 'only') {
			if (value === 'error' || value === 'errors') {
				options.only = 'error';
				options.applied.push('only=error');
			} else if (value === 'warning' || value === 'warnings' || value === 'warn') {
				options.only = 'warning';
				options.applied.push('only=warning');
			} else if (value === 'all') {
				options.only = 'all';
				options.applied.push('only=all');
			}
		}

		if (key === 'max') {
			const max = Number.parseInt(value, 10);
			if (!Number.isNaN(max) && max > 0) {
				options.max = max;
				options.applied.push(`max=${max}`);
			}
		}

		if (key === 'source') {
			if (rawValue.trim()) {
				options.source = rawValue.trim();
				options.applied.push(`source=${rawValue.trim()}`);
			}
		}

		if (key === 'sort') {
			if (value === 'file' || value === 'severity' || value === 'none') {
				options.sort = value;
				options.applied.push(`sort=${value}`);
			}
		}
	}

	return options;
}

/**
 * Resolve o rótulo textual do target para uso em mensagens do chat.
 * @param explicitTarget Target informado explicitamente pelo usuário.
 * @returns Rótulo textual do target resolvido.
 */
function resolveTarget(explicitTarget?: string): string {
	if (explicitTarget?.trim()) {
		const target = stripQuotes(explicitTarget);
		if (isWorkspaceTargetAlias(target)) {
			return 'workspace';
		}

		if (isCurrentEditorTargetAlias(target)) {
			const activeDocument = vscode.window.activeTextEditor?.document;
			if (!activeDocument) {
				return 'workspace';
			}

			if (activeDocument.uri.scheme === 'file') {
				return vscode.workspace.asRelativePath(activeDocument.uri, false);
			}

			return activeDocument.uri.toString(true);
		}

		return target;
	}

	const activeDocument = vscode.window.activeTextEditor?.document;
	if (!activeDocument) {
		return 'workspace';
	}

	if (activeDocument.uri.scheme === 'file') {
		return vscode.workspace.asRelativePath(activeDocument.uri, false);
	}

	return activeDocument.uri.toString(true);
}

/**
 * Resolve o target para URI real usada na execução do comando de build/rebuild.
 * @param explicitTarget Target informado explicitamente pelo usuário.
 * @returns URI resolvida para execução, quando aplicável.
 */
function resolveTargetUri(explicitTarget?: string): vscode.Uri | undefined {
	const trimmedTarget = explicitTarget?.trim();
	if (trimmedTarget) {
		const target = stripQuotes(trimmedTarget);
		if (isWorkspaceTargetAlias(target)) {
			return undefined;
		}

		if (isCurrentEditorTargetAlias(target)) {
			return vscode.window.activeTextEditor?.document.uri;
		}

		const isWindowsAbsolutePath = /^[a-zA-Z]:[\\/]/.test(target);
		if (isWindowsAbsolutePath) {
			return vscode.Uri.file(target);
		}

		const hasUriScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(target);
		if (hasUriScheme) {
			return vscode.Uri.parse(target, true);
		}

		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			const fullPath = path.resolve(workspaceFolder.uri.fsPath, target);
			return vscode.Uri.file(fullPath);
		}

		return vscode.Uri.file(path.resolve(target));
	}

	return vscode.window.activeTextEditor?.document.uri;
}

/**
 * Compara duas URIs, com tratamento case-insensitive para caminhos de arquivo.
 * @param left Primeira URI.
 * @param right Segunda URI.
 * @returns True quando as URIs representam o mesmo recurso.
 */
function uriEquals(left: vscode.Uri, right: vscode.Uri): boolean {
	if (left.toString() === right.toString()) {
		return true;
	}

	if (left.scheme === 'file' && right.scheme === 'file') {
		return left.fsPath.toLowerCase() === right.fsPath.toLowerCase();
	}

	return false;
}

/**
 * Indica se a URI pertence a alguma pasta aberta no workspace.
 * @param uri URI a ser validada.
 * @returns True quando a URI pertence ao workspace.
 */
function isWorkspaceUri(uri: vscode.Uri): boolean {
	if (uri.scheme !== 'file') {
		return false;
	}

	const folder = vscode.workspace.getWorkspaceFolder(uri);
	return !!folder;
}

/**
 * Verifica se uma URI está dentro de uma pasta pai (recursivamente).
 * @param parentFolder URI da pasta base.
 * @param targetUri URI do recurso a validar.
 * @returns True quando targetUri está contida na pasta pai.
 */
function isUriInsideFolder(parentFolder: vscode.Uri, targetUri: vscode.Uri): boolean {
	if (parentFolder.scheme !== 'file' || targetUri.scheme !== 'file') {
		return false;
	}

	const parentPath = path.resolve(parentFolder.fsPath).toLowerCase();
	const targetPath = path.resolve(targetUri.fsPath).toLowerCase();
	if (parentPath === targetPath) {
		return true;
	}

	const prefix = parentPath.endsWith(path.sep) ? parentPath : `${parentPath}${path.sep}`;
	return targetPath.startsWith(prefix);
}

/**
 * Verifica se a URI aponta para diretório existente no sistema de arquivos.
 * @param uri URI candidata.
 * @returns True quando a URI é um diretório existente.
 */
function isDirectoryUri(uri: vscode.Uri | undefined): boolean {
	if (!uri || uri.scheme !== 'file') {
		return false;
	}

	try {
		return fs.existsSync(uri.fsPath) && fs.statSync(uri.fsPath).isDirectory();
	} catch {
		return false;
	}
}

/**
 * Coleta diagnósticos de erro/warning para arquivo, pasta ou workspace.
 * @param targetUri URI alvo do build/rebuild.
 * @param isWorkspaceTarget Indica se a compilação foi solicitada para todo o workspace.
 * @returns Lista de diagnósticos elegíveis para exibição no chat.
 */
function collectDiagnostics(targetUri: vscode.Uri | undefined, isWorkspaceTarget: boolean): DiagnosticEntry[] {
	const diagnosticsByUri = vscode.languages.getDiagnostics();
	let filtered = diagnosticsByUri;

	if (!isWorkspaceTarget && targetUri) {
		if (isDirectoryUri(targetUri)) {
			filtered = diagnosticsByUri.filter(([uri]) => isUriInsideFolder(targetUri, uri));
		} else {
			filtered = diagnosticsByUri.filter(([uri]) => uriEquals(uri, targetUri));
		}

		if (filtered.length === 0) {
			filtered = diagnosticsByUri.filter(([uri]) => isWorkspaceUri(uri));
		}
	} else {
		filtered = diagnosticsByUri.filter(([uri]) => isWorkspaceUri(uri));
	}

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
 * Aplica filtros e ordenação de diagnósticos conforme flags informadas.
 * @param entries Diagnósticos coletados.
 * @param options Opções de filtro/ordenação.
 * @returns Diagnósticos filtrados e ordenados.
 */
function applyDiagnosticFilterOptions(
	entries: DiagnosticEntry[],
	options: DiagnosticFilterOptions
): DiagnosticEntry[] {
	let result = entries.slice();

	if (options.only === 'error') {
		result = result.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Error);
	} else if (options.only === 'warning') {
		result = result.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Warning);
	}

	if (options.source) {
		const sourceFilter = options.source.toLowerCase();
		result = result.filter((entry) => (entry.diagnostic.source ?? '').toLowerCase().includes(sourceFilter));
	}

	if (options.sort === 'file') {
		result.sort((a, b) => {
			const pathA = a.uri.scheme === 'file' ? a.uri.fsPath.toLowerCase() : a.uri.toString(true).toLowerCase();
			const pathB = b.uri.scheme === 'file' ? b.uri.fsPath.toLowerCase() : b.uri.toString(true).toLowerCase();
			if (pathA < pathB) {
				return -1;
			}
			if (pathA > pathB) {
				return 1;
			}

			const lineA = a.diagnostic.range.start.line;
			const lineB = b.diagnostic.range.start.line;
			return lineA - lineB;
		});
	} else if (options.sort === 'severity') {
		result.sort((a, b) => {
			const severityA = a.diagnostic.severity ?? vscode.DiagnosticSeverity.Hint;
			const severityB = b.diagnostic.severity ?? vscode.DiagnosticSeverity.Hint;
			if (severityA !== severityB) {
				return severityA - severityB;
			}

			const pathA = a.uri.scheme === 'file' ? a.uri.fsPath.toLowerCase() : a.uri.toString(true).toLowerCase();
			const pathB = b.uri.scheme === 'file' ? b.uri.fsPath.toLowerCase() : b.uri.toString(true).toLowerCase();
			if (pathA < pathB) {
				return -1;
			}
			if (pathA > pathB) {
				return 1;
			}

			return a.diagnostic.range.start.line - b.diagnostic.range.start.line;
		});
	}

	return result;
}

/**
 * Retorna rótulo textual padronizado para severidade de diagnóstico.
 * @param severity Severidade do diagnóstico.
 * @returns Texto padronizado para exibição no chat.
 */
function severityLabel(severity: vscode.DiagnosticSeverity): string {
	switch (severity) {
		case vscode.DiagnosticSeverity.Error:
			return 'ERROR';
		case vscode.DiagnosticSeverity.Warning:
			return 'WARN';
		case vscode.DiagnosticSeverity.Information:
			return 'INFO';
		case vscode.DiagnosticSeverity.Hint:
			return 'HINT';
		default:
			return 'UNKNOWN';
	}
}

/**
 * Gera link Markdown clicável para arquivo e linha do diagnóstico.
 * @param uri URI do recurso com diagnóstico.
 * @param relativePath Caminho relativo para exibição.
 * @param line Linha 1-based para navegação.
 * @returns Link markdown para localização do problema.
 */
function toLocationLink(uri: vscode.Uri, relativePath: string, line: number): string {
	if (uri.scheme !== 'file') {
		return `${relativePath}:${line}`;
	}

	const locationUri = uri.with({ fragment: `L${line}` }).toString(true);
	return `[${relativePath}:${line}](${locationUri})`;
}

/**
 * Monta o texto final com resumo e lista de diagnósticos para o chat.
 * @param entries Diagnósticos a serem exibidos.
 * @param targetLabel Nome/identificação do target compilado.
 * @param truncated Indica se a lista foi truncada por limite.
 * @returns Texto final de resposta do chat.
 */
function formatDiagnosticsSummary(
	entries: DiagnosticEntry[],
	targetLabel: string,
	truncated: boolean
): string {
	if (entries.length === 0) {
		return [
			'Compilation completed and no errors or warnings were found in Problems.',
			`- target: ${targetLabel}`
		].join('\n');
	}

	const errors = entries.filter((entry) => entry.diagnostic.severity === vscode.DiagnosticSeverity.Error).length;
	const warnings = entries.length - errors;
	const details = entries.map((entry, index) => {
		const relativePath =
			entry.uri.scheme === 'file'
				? vscode.workspace.asRelativePath(entry.uri, false)
				: entry.uri.toString(true);
		const line = entry.diagnostic.range.start.line + 1;
		const locationLink = toLocationLink(entry.uri, relativePath, line);
		const code =
			typeof entry.diagnostic.code === 'string'
				? entry.diagnostic.code
				: entry.diagnostic.code && typeof entry.diagnostic.code === 'object'
					? entry.diagnostic.code.value
					: undefined;
		const cleanMessage = entry.diagnostic.message.replace(/\s+/g, ' ').trim();
		const source = entry.diagnostic.source ? ` (${entry.diagnostic.source})` : '';
		const codeText = code ? ` [${code}]` : '';

		return `${index + 1}. ${severityLabel(entry.diagnostic.severity)} ${locationLink}${source}${codeText} - ${cleanMessage}`;
	});

	const lines = [
		'Compilation finished with diagnostics:',
		`- target: ${targetLabel}`,
		`- errors: ${errors}`,
		`- warnings: ${warnings}`,
		'',
		...details
	];

	if (truncated) {
		lines.push('', `Showing first ${MAX_DIAGNOSTICS_TO_SHOW} diagnostics.`);
	}

	return lines.join('\n');
}

/**
 * Aguarda estabilização dos diagnósticos após compilação para evitar leitura parcial.
 * @param token Token de cancelamento da invocação.
	 * @returns Resultado da espera, incluindo mudança, timeout e cancelamento.
 */
async function waitForDiagnosticsChange(token: vscode.CancellationToken): Promise<DiagnosticsWaitResult> {
	return await new Promise<DiagnosticsWaitResult>((resolve) => {
		let finished = false;
		let idleTimer: NodeJS.Timeout | undefined;
		let hasChange = false;
		let timedOut = false;
		let canceled = false;

		const scheduleIdleResolve = () => {
			if (idleTimer) {
				clearTimeout(idleTimer);
			}

			idleTimer = setTimeout(() => finish(), DIAGNOSTIC_IDLE_WINDOW_MS);
		};

		const finish = () => {
			if (finished) {
				return;
			}
			finished = true;
			disposable.dispose();
			cancelDisposable.dispose();
			if (idleTimer) {
				clearTimeout(idleTimer);
			}
			clearTimeout(timeout);
			resolve({
				changed: hasChange,
				timedOut,
				canceled
			});
		};

		const disposable = vscode.languages.onDidChangeDiagnostics(() => {
			hasChange = true;
			scheduleIdleResolve();
		});
		const cancelDisposable = token.onCancellationRequested(() => {
			canceled = true;
			finish();
		});
		const timeout = setTimeout(() => {
			timedOut = true;
			finish();
		}, DIAGNOSTIC_WAIT_TIMEOUT_MS);
	});
}

/**
 * Implementa a tool de compilação usada pelo participante de chat.
 *
 * Responsabilidades:
 * - Resolver o target de compilação (editor atual, arquivo, pasta ou workspace).
 * - Executar o comando VS Code correspondente de build/rebuild.
 * - Aguardar a estabilização de diagnósticos após a compilação.
 * - Coletar, filtrar, ordenar e formatar erros/warnings para resposta no chat.
 *
 * Opções de entrada:
 * - target: caminho/alias do alvo de compilação.
 * - rebuild: quando true executa rebuild em vez de build.
 * - flags: parâmetros textuais para filtros de diagnóstico (only, max, source, sort).
 */
class ChatCompiler implements vscode.LanguageModelTool<ChatCompilerToolInput> {
	/**
	 * Prepara mensagem de invocação exibida antes da execução da ferramenta.
	 * @param options Opções da invocação da tool.
	 * @param _token Token de cancelamento.
	 * @returns Mensagem de preparação mostrada no chat.
	 */
	prepareInvocation(
		options: vscode.LanguageModelToolInvocationPrepareOptions<ChatCompilerToolInput>,
		_token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.PreparedToolInvocation> {
		const target = resolveTarget(options.input?.target);

		return {
			invocationMessage: `Preparing compiler tool for ${target}`
		};
	}

	/**
	 * Executa build/rebuild, coleta diagnósticos e devolve o resumo para o chat.
	 * @param options Opções de invocação com target/rebuild/flags.
	 * @param token Token de cancelamento da operação.
	 * @returns Resultado textual para resposta do chat.
	 */
	async invoke(
		options: vscode.LanguageModelToolInvocationOptions<ChatCompilerToolInput>,
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelToolResult> {
		if (token.isCancellationRequested) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart('Compiler tool invocation canceled by user.')
			]);
		}

		const input = options.input ?? {};
		const target = resolveTarget(input.target);
		const targetUri = resolveTargetUri(input.target);
		const filterOptions = parseDiagnosticFilterOptions(input.flags);
		const flags = filterOptions.applied.length > 0 ? filterOptions.applied.join(', ') : 'none';
		const isWorkspaceTarget = target === 'workspace' && !targetUri;
		const commandId = isWorkspaceTarget
			? (input.rebuild ? 'totvs-developer-studio.rebuild.workspace' : 'totvs-developer-studio.build.workspace')
			: (input.rebuild ? 'totvs-developer-studio.rebuild.file' : 'totvs-developer-studio.build.file');

		try {
			if (isWorkspaceTarget) {
				await vscode.commands.executeCommand(commandId);
			} else if (targetUri) {
				await vscode.commands.executeCommand(commandId, undefined, [targetUri]);
			} else {
				await vscode.commands.executeCommand(commandId);
			}
		} catch (error) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart(
					`Compiler command failed (${commandId}): ${error instanceof Error ? error.message : String(error)}`
				)
			]);
		}

		const waitResult = await waitForDiagnosticsChange(token);
		if (waitResult.canceled) {
			return new vscode.LanguageModelToolResult([
				new vscode.LanguageModelTextPart('Compiler tool invocation canceled by user.')
			]);
		}

		const diagnostics = applyDiagnosticFilterOptions(
			collectDiagnostics(targetUri, isWorkspaceTarget),
			filterOptions
		);
		const showAllDiagnostics = isDirectoryUri(targetUri);
		const maxToShow = filterOptions.max && filterOptions.max > 0
			? filterOptions.max
			: (showAllDiagnostics ? diagnostics.length : MAX_DIAGNOSTICS_TO_SHOW);
		const displayedDiagnostics = diagnostics.slice(0, maxToShow);
		const diagnosticsSummary = formatDiagnosticsSummary(
			displayedDiagnostics,
			target,
			diagnostics.length > displayedDiagnostics.length
		);

		const summary = [
			'Compiler tool executed successfully with:',
			`- command: ${commandId}`,
			`- target: ${target}`,
			`- rebuild: ${input.rebuild ? 'true' : 'false'}`,
			`- flags: ${flags}`,
			`- diagnostics-updated: ${waitResult.changed ? 'true' : 'false'}`,
			'',
			...(waitResult.timedOut && !waitResult.changed
				? [
					'Diagnostics were not updated before timeout. Results below may reflect a previous compile.',
					''
				]
				: []),
			diagnosticsSummary
		].join('\n');

		return new vscode.LanguageModelToolResult([
			new vscode.LanguageModelTextPart(summary)
		]);
	}
}

/**
 * Handler do participante de chat: interpreta prompt, monta input e encaminha para a tool.
 * @param request Requisição recebida do chat.
 * @param _context Contexto da conversa no chat.
 * @param stream Stream de resposta para enviar markdown ao usuário.
 * @param token Token de cancelamento da requisição.
 * @returns Metadados da execução para telemetria/log do participante.
 */
async function compilerParticipantHandler(
	request: vscode.ChatRequest,
	_context: vscode.ChatContext,
	stream: vscode.ChatResponseStream,
	token: vscode.CancellationToken
): Promise<vscode.ChatResult | void> {
	const isRebuild = request.command === REBUILD_COMMAND || request.command === 'rebuild';

	const input: ChatCompilerToolInput = {
		target: resolveTarget(),
		rebuild: isRebuild
	};

	if (request.prompt?.trim()) {
		const prompt = request.prompt.trim();
		const targetFromPrompt = extractTargetFromPrompt(prompt);
		if (targetFromPrompt) {
			input.target = targetFromPrompt;
		}

		input.flags = [prompt];
	}

	const result = await vscode.lm.invokeTool(
		COMPILER_TOOL_NAME,
		{
			input,
			toolInvocationToken: request.toolInvocationToken
		},
		token
	);

	const text = result.content
		.filter((part): part is vscode.LanguageModelTextPart => part instanceof vscode.LanguageModelTextPart)
		.map((part) => part.value)
		.join('\n');

	stream.markdown(text || 'Compiler tool invoked successfully.');

	return {
		metadata: {
			tool: COMPILER_TOOL_NAME,
			command: request.command ?? COMPILER_COMMAND
		}
	};
}

/**
 * Registra a language model tool e o participante de chat da funcionalidade de compilação.
 * @param context Contexto da extensão para registrar disposables.
 */
export function registerChatTools(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.lm.registerTool(COMPILER_TOOL_NAME, new ChatCompiler())
	);

	const participant = vscode.chat.createChatParticipant(COMPILER_PARTICIPANT_ID, compilerParticipantHandler);
	participant.iconPath = new vscode.ThemeIcon('tools');

	context.subscriptions.push(participant);
}
