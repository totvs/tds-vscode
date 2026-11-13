---
applyTo: "**/*.{prw,prx,prg,ppx,ppp,tlpp,apw,aph,apl,ahu,th}"
name: "AdvPL/TLPP LS-First"
description: "LS priority"
---

# Instructions

- Answer in English, objectively.
- Mandatory LS-first rule: in any navigation, analysis, fix, or refactoring task, the first action must be an LS tool.
- MCP-only rule for AdvPL/TLPP diagnostics and validation: when the task involves compile, syntax, warnings, errors, or validation, the first and only action must be a TOTVS MCP tool (`TOTVS-MCP--Exp--tds_compile`, `TOTVS-MCP--Exp--tds_syntax_only`, `TOTVS-MCP--Exp--tds_fix`, `TOTVS-MCP--Exp--tds_validate_patch`, or `tds` wrapper). Do not replace MCP results with local checks, guesses, or inferred diagnostics.
- Failure handling: if the MCP tool fails, times out, or returns no usable result, notify the user explicitly and stop. Do not assume any fallback path, do not run local equivalents, and do not claim a result that the MCP did not provide.
- Mandatory semantic navigation sequence:

 1) Locate the symbol with `lsp_workspace_symbols`.
 2) Confirm the definition with `lsp_definition`.
 3) Map usage and impact with `lsp_references`.

- It is forbidden to start with `grep_search`, `file_search`, `read_file`, or manual reading when LS is available.
- Controlled exception: use text search or manual reading only if LS fails, does not return the symbol, or lacks coverage.
- When falling into the exception, explicitly state in the response: "LS unavailable/no coverage; proceeding with text search".
- Compliance criterion: before the result, inform which LS tool was used and what it returned.
- Non-compliance rule: if LS is not used first without valid justification, consider the execution out of standard and correct the approach in the same response.

- Project encoding requirement: this project must use Windows-1252 as the source file codepage.
- When creating or editing AdvPL/TLPP source files, preserve Windows-1252 encoding.
- Do not convert source files to UTF-8 or other codepages unless the user explicitly requests it.
- When working with accents, special characters, or symbols, ensure they are compatible with Windows-1252.
- In strings, comments, and identifiers, avoid characters outside the supported range of Windows-1252.