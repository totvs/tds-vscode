# Capabilities com `dynamicRegistration` no `initialize`

Levantamento feito em `totvsls/totvsls/msg_lsp_initialize_request.cc`, no handler do request
`initialize`, sobre quais capabilities de `textDocument` são efetivamente checadas via
`dynamicRegistration` para decidir se o provider correspondente é habilitado na resposta do
servidor.

## Capabilities que checam `dynamicRegistration` (ativas)

| Capability (`textDocument.*`) | Provider habilitado | Observações |
| -------------------------------- | --------------------------------------------- | ------------- |
| `documentSymbol` | `documentSymbolProvider` | Única checagem fora do bloco `isTDS_2()` |
| `completion` | `completionProvider` | Só dentro de `if (g_config->isTDS_2())` |
| `documentLink` | `documentLinkProvider` | Idem |
| `semanticTokens` | `semanticTokensProvider` | Idem |
| `definition` | `definitionProvider` | Idem |
| `declaration` | `declarationProvider` | Idem |
| `implementation` | `implementationProvider` | Idem |
| `references` | `referencesProvider` | Idem |
| `hover` | `hoverProvider` | Idem |
| `codeLens` | `codeLensProvider` | Exige também `resolveProvider` |
| `signatureHelp` | `signatureHelpProvider` | Exige também `contextSupport` |
| `formatting` | `documentFormattingProvider` | Idem |
| `rangeFormatting` | `documentRangeFormattingProvider` | Idem |

## Observações adicionais

- `documentHighlight`: possui checagem de `dynamicRegistration`, porém está **comentada**
  (bloco `/* ... */`); o provider correspondente é sempre `reset()`.
- `workspaceSymbol`: é habilitado sem checar `dynamicRegistration` — apenas verifica
  `has_value()` da capability.
- Todas as checagens acima (exceto `documentSymbol`) estão dentro do bloco
  `if (g_config->isTDS_2())`, ou seja, só se aplicam quando o protocolo TDS 2.0 (ou superior)
  está ativo.

## Referência

- Arquivo: `totvsls/totvsls/msg_lsp_initialize_request.cc` (linhas ~1590-1835)

---

# Opções de formatação (`FormattingOptions`) — o que falta implementar

Struct declarada em `totvsls/totvsls/formatter/formatting_options.hpp` e populada em
`totvsls/totvsls/formatter/formatting_options.cpp`. O consumo real das opções acontece em
`totvsls/totvsls/formatter/document_formatting.cpp` (`DocumentFormatting::doFormatDocument`).

## Já implementado (com efeito real na formatação)

| Opção            | Onde é usada                                | Observação |
|-------------------|----------------------------------------------|------------|
| `insertSpaces`     | `document_formatting.cpp:56`                | Define se a indentação usa espaços ou tab |
| `tabSize`          | `document_formatting.cpp:56`                | Tamanho da indentação quando `insertSpaces = true` |

## Lidas do settings, mas sem efeito na formatação (parseadas e descartadas)

Essas opções são convertidas em `getFormattingOptions` (`formatting_options.cpp`), porém não
são referenciadas em nenhuma regra de formatação (`advpl_formatting_rules.cpp`,
`fourgl_formatting_rules.cpp`, `formatting_rules.cpp`, `document_formatting.cpp`):

- `keywordsCase` (default: `"upper"`)
- `stringStyle` (default: `"ignore"`)
- `operatorSpacing` (default: `true`)
- `maxConsecutiveBlankLines` (default: `1`)
- `formatNumber` (default: `false`)

## Nunca lidas do settings e sem efeito na formatação (só existem como default na struct)

- `wrapParameters` (default: `"auto"`)
- `wrapArguments` (default: `"auto"`)
- `spaceAfterComma` (default: `true`)
- `spaceInsideParentheses` (default: `false`)
- `normalizeCalls` (default: `false`)
- `blankLinesBetweenTopLevelDeclarations` (default: `1`)

## Conclusão

Das opções de formatação avaliadas, **nenhuma está totalmente implementada** de fato no
formatador — o pipeline atual (`doFormatDocument`) só realiza reindentação de blocos com base
em regras (`RulesFormatting`) e no par `insertSpaces`/`tabSize`. Todas as demais opções listadas
precisam ser implementadas nas regras de formatação (`advpl_formatting_rules.cpp` /
`fourgl_formatting_rules.cpp`) ou em `document_formatting.cpp` para terem efeito real.

## Referência

- `totvsls/totvsls/formatter/formatting_options.hpp`
- `totvsls/totvsls/formatter/formatting_options.cpp`
- `totvsls/totvsls/formatter/document_formatting.cpp`
