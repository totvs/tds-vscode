# ADVPLS Capabilities (LSP + Debug Adapter)

Este documento consolida os *capabilities* encontrados no projeto ADVPLS, com base no código atual.

## Fontes

- `totvsls/totvsls/msg_lsp_initialize_request.cc` (capabilities LSP em `initialize`)
- `debugAdapter/Capabilities.h`
- `debugAdapter/Capabilities.cpp`

---

## 1) LSP Server Capabilities (initialize response)

### 1.1 Sempre enviados

- `textDocumentSync`
    - `openClose = true`
    - `change = Full`
- `renameProvider`
    - `prepareProvider = true`
    - `workDoneProgress = true`

### 1.2 Enviados condicionalmente

- `workspace`
    - Enviado quando o cliente possui `workspace` e `workspaceEdit`.
    - `workspace.workspaceFolders`
        - `supported = true`
        - `changeNotifications = <uuid>`
    - `workspace.fileOperations` (com filtros por extensões ADVPL + pasta)
        - `didCreate`: somente se cliente suporta `didCreate`
        - `didRename`: somente se cliente suporta `didRename`
        - `willDelete`: somente se cliente suporta `willDelete`
        - `willRename`: condicionado no código por `willDelete`
        - `didDelete`: resetado (não anunciado)
        - `willCreate`: resetado (não anunciado)

- `documentSymbolProvider`
    - Enviado quando `textDocument.documentSymbol.dynamicRegistration` é suportado.

### 1.3 Capabilities habilitados

- `completionProvider`
    - Requer `g_config->enabledCompletionProvider`
    - Requer `textDocument.completion.dynamicRegistration`

- `documentLinkProvider`
    - Requer `g_config->showDocumentLinksOnIncludes`
    - Requer `textDocument.documentLink.dynamicRegistration`
    - `resolveProvider = true`

- `semanticTokensProvider`
    - Requer `g_config->enabledSemanticTokens`
    - Requer `textDocument.semanticTokens.dynamicRegistration`
    - `full = true`
    - `range = false`
    - `legend.tokenTypes` preenchido por `SYMBOL_KIND_ENUM_MAP`
    - `legend.tokenModifiers` preenchido por `parserSymbolModifierMap`

- `workspaceSymbolProvider`
    - Requer `workspace.symbol`
    - `workDoneProgress = false`
    - `resolveProvider = true`

- `definitionProvider`
    - Requer `textDocument.definition.dynamicRegistration`

- `declarationProvider`
    - Requer `textDocument.declaration.dynamicRegistration`

- `implementationProvider`
    - Requer `textDocument.implementation.dynamicRegistration`

- `referencesProvider`
    - Requer `textDocument.references.dynamicRegistration`

- `hoverProvider`
    - Requer `textDocument.hover.dynamicRegistration`
    - Ajuste de formato (`markdown`/`plaintext`) em `g_config->hoverMode`

- `codeLensProvider`
    - Lógica depende de `g_config->enableCodeLens`, `textDocument.codeLens.dynamicRegistration` e `resolveProvider` do cliente
    - Quando enviado: `resolveProvider = true`

- `signatureHelpProvider`
    - Requer `g_config->enableSignatureHelp`
    - Requer `textDocument.signatureHelp.dynamicRegistration`
    - Requer `textDocument.signatureHelp.contextSupport`
    - `triggerCharacters = ["("]`
    - `retriggerCharacters = [","]`

### 1.5 Não anunciados no fluxo atual (apesar de existirem no tipo)

No `initialize` atual, não há atribuição positiva para:

- `documentRangeFormattingProvider`
- `documentOnTypeFormattingProvider`
- `executeCommandProvider`
- `typeDefinitionProvider`
- `documentHighlightProvider` (resetado)
- `codeActionProvider`
- `colorProvider`
- `foldingRangeProvider`
- `semanticHighlighting`
- `typeHierarchyProvider`
- `callHierarchyProvider`
- `selectionRangeProvider`
- `linkedEditingRangeProvider`
- `monikerProvider`

---

## 2) LSP Client Capabilities lidos pelo servidor

Durante o `initialize`, o servidor consulta principalmente:

- `workspace.workspaceEdit`
- `workspace.fileOperations.*`
- `workspace.symbol`
- `window.showMessage.messageActionItem.additionalPropertiesSupport`
- `textDocument.documentSymbol.dynamicRegistration`
- `textDocument.completion.dynamicRegistration`
- `textDocument.documentLink.dynamicRegistration`
- `textDocument.semanticTokens.dynamicRegistration`
- `textDocument.semanticTokens.formats`
- `textDocument.definition.dynamicRegistration`
- `textDocument.declaration.dynamicRegistration`
- `textDocument.implementation.dynamicRegistration`
- `textDocument.references.dynamicRegistration`
- `textDocument.hover.dynamicRegistration`
- `textDocument.hover.contentFormat`
- `textDocument.codeLens.dynamicRegistration`
- `textDocument.codeLens.resolveProvider`
- `textDocument.signatureHelp.dynamicRegistration`
- `textDocument.signatureHelp.contextSupport`
- `textDocument.signatureHelp.signatureInformation.documentationFormat`

---

## 3) Debug Adapter Protocol (DAP) Capabilities

Valores padrão definidos em `debugAdapter/Capabilities.cpp`:

### 3.1 `true`

- `supportsCancelRequest`
- `supportsConditionalBreakpoints`
- `supportsConfigurationDoneRequest`
- `supportsEvaluateForHovers`
- `supportsHitConditionalBreakpoints`
- `supportsLogPoints`
- `supportsTerminateRequest`

### 3.2 `false`

- `supportsBreakpointLocationsRequest`
- `supportsClipboardContext`
- `supportsCompletionsRequest`
- `supportsDataBreakpoints`
- `supportsDelayedStackTraceLoading`
- `supportsDisassembleRequest`
- `supportsExceptionInfoRequest`
- `supportsExceptionOptions`
- `supportsFunctionBreakpoints`
- `supportsGotoTargetsRequest`
- `supportsInstructionBreakpoints`
- `supportsLoadedSourcesRequest`
- `supportsModulesRequest`
- `supportsReadMemoryRequest`
- `supportsRestartFrame`
- `supportsRestartRequest`
- `supportsSetExpression`
- `supportsSetVariable`
- `supportsStepBack`
- `supportsStepInTargetsRequest`
- `supportsSteppingGranularity`
- `supportsTerminateThreadsRequest`
- `supportsValueFormattingOptions`
- `supportTerminateDebuggee`

### 3.3 Listas opcionais (somente se preenchidas)

No JSON, os campos abaixo só são enviados quando possuem itens:

- `exceptionBreakpointFilters`
- `additionalModuleColumns`
- `supportedChecksumAlgorithms`

---

## 4) Resumo prático

- O ADVPLS anuncia capacidades LSP de forma dinâmica, dependente do que o cliente declara e de *feature flags* (`g_config`).
- Em modo TDS 2.x, são habilitados recursos como completion, semantic tokens, hover, signature help, references, definition/declaration/implementation e code lens.
- No DAP, o conjunto ativo padrão é enxuto (foco em debug básico, breakpoints condicionais, hover eval, logpoints e terminate).
