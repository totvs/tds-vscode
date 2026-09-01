---
applyTo: "**/*.{.prw,.prx,.prg,.ppx,.ppp,.tlpp,.apw,.aph,.apl,.ahu,.th}"
name: "AdvPL/TLPP LS-First"
description: "LS priority"
---

<!--
NOTICE for Protheus developers:
     This instruction file was generated automatically.
     Changes are preserved, as it is generated only if it does not exist.
     If you do not want to use it, keep it in the folder but leave it empty.
-->

<!--
NOTICE for extension developers:
     Keep the `.md.txt` extension to prevent it from being loaded during
     extension development, which could interfere with the environment.
-->

# Instructions

- Answer in English, objectively.
- Mandatory LS-first rule: in any navigation, analysis, fix, or refactoring task, the first action must be an LS tool.
- Mandatory semantic navigation sequence:

 1) Locate the symbol with `lsp_workspace_symbols`.
 2) Confirm the definition with `lsp_definition`.
 3) Map usage and impact with `lsp_references`.

- It is forbidden to start with `grep_search`, `file_search`, `read_file`, or manual reading when LS is available.
- Controlled exception: use text search or manual reading only if LS fails, does not return the symbol, or lacks coverage.
- When falling into the exception, explicitly state in the response: "LS unavailable/no coverage; proceeding with text search".
- Compliance criterion: before the result, inform which LS tool was used and what it returned.
- Non-compliance rule: if LS is not used first without valid justification, consider the execution out of standard and correct the approach in the same response.
- Ao receber uma solicitação de compilação, usar o comando `totvs-developer-studio.rebuild.file`.