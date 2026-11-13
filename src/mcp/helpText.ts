import * as vscode from "vscode";
import { APPLY_PATCH_COMMAND, COMPILER_COMMAND, SYNTAX_ONLY_COMMAND, VALIDATE_PATCH_COMMAND } from "./chatUtils";

/**
 * Generates help text with commands and options supported by chat.
 * @returns Help text in markdown for chat.
 */
export function buildHelpText(): string {
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
