/**
 * Generates the help text of the TOTVS MCP tools (commands, targets, parameters and examples).
 * @returns Help text in markdown.
 */
export function buildHelpText(): string {
	const lines: string[] = [
		"Available tools:",
		"- tds_compile: compiles the target (default: current editor) and returns errors and warnings.",
		"- tds_syntax_only: checks the syntax of the target (linter), without generating code in the RPO.",
		"- tds_fix: applies the quick fixes of the language server to the problems of a source. When there is more than one fix, it lists the options so the user can choose in the chat (then call again with line and choice).",
		"- tds_validate_patch: validates a patch file (.ptm, .zip, .upd) against the RPO of the current server.",
		"- tds_apply_patch: applies a patch file (.ptm, .zip, .upd) to the RPO of the current server (changes the RPO).",
		"- tds_document_symbols: outline (symbols) of a source file, provided by the language server.",
		"- tds_definition, tds_references, tds_hover, tds_completion, tds_signature_help: language server queries at a position (file, line, character; 0-based).",
		"- tds_workspace_symbols: searches symbols by name across the workspace.",
		// "- tds_code_actions: lists the code actions of a line/range (to apply the fixes use tds_fix).",
		"- tds_rename_symbol, tds_format_document: preview of the edits (nothing is changed).",
		"- tds_help: shows this help.",
		"- tds_ping: checks whether the TOTVS MCP server is active.",
		"",
		"Supported targets (tds_compile, tds_syntax_only):",
		"- current editor: current, editor (default)",
		"- open editors: open-files, open-editors",
		"- workspace: workspace, ws, all",
		"- file: relative or absolute path (ex: src/meu.prw)",
		"- folder: relative or absolute path (ex: src/modulo)",
		"",
		"Parameters (tds_compile, tds_syntax_only):",
		"- target: target, as described above",
		"- syntaxOnly=true|false (tds_compile only)",
		"- only=all|error|warning",
		"- max=N",
		"- sort=none|file|severity",
		"- format=markdown|json",
		"",
		"Notes:",
		"- The tools are executed on the current server/environment.",
		"- When the target/file is omitted, the source of the active editor is used.",
		"- tds_fix works on the problems already reported; run tds_syntax_only first to refresh them.",
		"- tds_compile, tds_syntax_only, tds_fix and the language tools (tds_document_symbols, tds_definition, etc.) ignore files that are not AdvPL/TLPP/4GL sources.",
		"- tds_compile also accepts files whose extension is in totvsLanguageServer.folder.extensionsAllowed (ex: resources).",
		"",
		"Examples:",
		"- Compile the current source.",
		"- Check the syntax of src/modulo, showing only errors.",
		"- Fix the problems of this source.",
		"- Validate the patch patches/fix.ptm and, if it is ok, apply it.",
		"- Which functions exist in this source?"
	];

	return lines.join("\n");
}
