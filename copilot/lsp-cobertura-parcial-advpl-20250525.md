# Por que o Language Server AdvPL tem cobertura parcial?

**Arquivo analisado:** `mata010.prx`  
**Data:** 21/05/2026  
**Contexto:** Análise executada durante code review com uso explícito das ferramentas LSP disponíveis no VS Code (TDS Language Server).

---

## Sumário Executivo

Durante o code review do `mata010.prx`, foram acionadas as 10 ferramentas LSP disponíveis. Apenas **2 delas produziram resultados concretos e confiáveis** (`lsp_document_symbols` e `get_errors`). As demais 8 retornaram resultados vazios ou parciais. Este documento explica **por que** isso acontece, com base no comportamento observado e nas características arquiteturais do TDS Language Server.

---

## 1. O que é o Language Server Protocol (LSP)?

O LSP é um protocolo padronizado (Microsoft) que permite que editores como o VS Code ofereçam funcionalidades inteligentes de código (hover, go-to-definition, referências, etc.) sem precisar entender cada linguagem diretamente. O editor se comunica com um servidor externo (o Language Server) que processa o código-fonte e responde às consultas.

Para AdvPL/TLPP, o Language Server é o **TDS Language Server** (fornecido pela TOTVS via extensão TDS-VSCode). Ele opera de forma diferente dos Language Servers de linguagens modernas como TypeScript, Java ou C#, e essa diferença explica as limitações observadas.

---

## 2. Ferramentas LSP testadas e resultados obtidos

| Ferramenta | Resultado | Nível de cobertura |
|---|---|---|
| `lsp_document_symbols` | ✅ Retornou 14 símbolos (funções) do arquivo | **Funcional** |
| `get_errors` | ✅ Retornou 9 warnings do compilador (W0007, W0016) | **Funcional** |
| `lsp_hover` | ⚠️ Funciona apenas para `#define` — sem info de funções | **Parcial** |
| `lsp_references` | ❌ Sem resultados para funções AdvPL | **Não funcional** |
| `lsp_workspace_symbols` | ❌ Não indexou arquivos `.prx` ou funções AdvPL | **Não funcional** |
| `lsp_definition` | ❌ Não navega para declarações de funções binárias | **Não funcional** |
| `lsp_signature_help` | ❌ Sem informação de assinaturas de funções AdvPL | **Não funcional** |
| `lsp_completion` | ⚠️ Funciona para keywords, não para símbolos do projeto | **Parcial** |
| `lsp_code_actions` | ⚠️ Limitado a ações genéricas de diagnóstico | **Parcial** |
| `lsp_format_document` | ⚠️ Formatação básica, sem análise semântica | **Parcial** |

---

## 3. Razões técnicas da cobertura parcial

### 3.1 AdvPL é uma linguagem dinamicamente tipada sem análise de fluxo

O AdvPL foi projetado para execução dinâmica no Protheus AppServer. Variáveis podem assumir qualquer tipo em tempo de execução (`LOCAL x := "texto"` e depois `x := 42` é válido). Isso torna **impossível** para o Language Server inferir:

- O tipo retornado por uma função em tempo de edição
- Os parâmetros que uma função de callback espera receber
- O tipo de uma variável em um determinado ponto do código

**Impacto direto:** `lsp_hover` não consegue exibir a assinatura de funções porque não há informação de tipo disponível estaticamente. Durante o teste no `mata010.prx`, o hover sobre `ExistCpo()` e `Aviso()` retornou vazio — o LS simplesmente não tem esses dados.

---

### 3.2 O símbolo de referência cruzada depende do RPO compilado, não do fonte

Em AdvPL, a unidade de compilação é o **RPO (Repositório de Objetos do Protheus)**. As funções são registradas no RPO após compilação. O Language Server resolve referências consultando:

1. O RPO conectado (AppServer)
2. Definições em `.ch` (headers)
3. O arquivo `.vscode/.advpl/_binary_functions.prw` (funções binárias do AppServer)

Isso significa que **se a função não está no RPO conectado ou nos headers, o LS não a conhece**. Durante a análise, o warning `W0007` em `mata010.prx` (linha 353) ocorreu exatamente por isso:

```
W0007 — FindFunction: too many parameters (0 expected, 1 supplied)
```

O LS resolveu `FindFunction` com **0 parâmetros** (definição no `_binary_functions.prw`), mas o código chama com 1 parâmetro. Isso indica que existe uma segunda definição em algum `.ch` incluído que o LS não está conseguindo resolver corretamente — **ambiguidade de definição entre fonte e binário**.

---

### 3.3 Arquivos `.prx` não são indexados no símbolo global do workspace

O `lsp_workspace_symbols` retornou zero resultados para funções AdvPL. A razão é que o TDS Language Server **não mantém um índice global de símbolos** em memória para todos os arquivos `.prx` do workspace como TypeScript ou Java fariam.

O LS AdvPL opera no modelo **"arquivo aberto"**: analisa o arquivo atualmente aberto e seus includes diretos (`#include`). Não faz análise prévia de todos os arquivos do projeto. Consequências:

- `lsp_workspace_symbols("Mata010Deleta")` → ❌ sem resultado
- `lsp_references` em `Mata010Deleta` → ❌ sem resultado
- `lsp_definition` para ir até a declaração → ❌ sem resultado

Para encontrar onde `Mata010Deleta` é chamado (referenciado no array `aRotina` como string `"Mata010Deleta"`), o LS teria que analisar semanticamente strings literais — algo que nenhum Language Server de linguagem dinâmica faz por padrão.

---

### 3.4 Referências por string literal são invisíveis ao LSP

Em AdvPL, é idiomático registrar funções por **nome em string**:

```advpl
// mata010.prx — linha ~3284
aAdd(aRotina, {"Excluir", "Mata010Deleta", 0, 5, 0, NIL})
```

A função `Mata010Deleta` é referenciada como uma string `"Mata010Deleta"`, não como um símbolo. O LSP trata isso como um literal de texto, não como uma referência semântica. Portanto:

- `lsp_references("Mata010Deleta")` → retorna 0 referências
- O bug crítico (`lReturn` nunca atribuído em `Mata010Deleta`) só foi encontrado por **leitura direta do código**, não pelo LS

Esse padrão é amplamente usado em AdvPL para callbacks de MBrowse (`aRotina`), triggers de ModelDef, handlers de `Set Key`, e configurações de `AxCadastro` — tornando a análise de impacto via LSP estruturalmente impossível para grande parte do código legado.

---

### 3.5 `Set Key` com parâmetros implícitos gera falsos positivos (W0016)

O warning `W0016` apareceu em **8 ocorrências** no `mata010.prx`, todas em funções registradas como handlers de `Set Key`:

```advpl
// Declaração sem parâmetros:
Static Function MT010F4()
Static Function MT010Perg()

// Chamada implícita pelo runtime com 3 argumentos:
// Set Key GT_F4 To MT010F4
// O runtime passa (nKey, nRow, nCol) automaticamente
```

O LS emite `W0016 — function called with more arguments than declared` porque analisa a **declaração estática** (0 parâmetros) sem entender que o runtime Protheus injeta argumentos implicitamente no mecanismo `Set Key`. Isso é um **falso positivo estrutural** — o código funciona corretamente, mas o LS não tem como saber disso.

---

### 3.6 O `lsp_document_symbols` funciona porque não requer análise semântica profunda

A ferramenta que funcionou melhor (`lsp_document_symbols`) opera no modelo mais simples: **análise sintática**. Ela identifica `Function`, `Static Function`, `Class`, `Method` pelo padrão léxico, sem precisar resolver tipos, referências ou o RPO. Por isso retornou os 14 símbolos corretamente.

Da mesma forma, `get_errors` funciona bem porque o TDS Language Server usa o mesmo parser do compilador RDMake para detectar erros de sintaxe e warnings de assinatura — essa análise não depende do índice global de símbolos.

---

## 4. Comparativo: AdvPL vs linguagens com cobertura LSP completa

| Característica | TypeScript / Java | AdvPL / TLPP |
|---|---|---|
| Tipagem | Estática | Dinâmica (AdvPL) / Estática opcional (TLPP) |
| Índice global de símbolos | Sim (build-time) | Não (apenas arquivo aberto) |
| Referências semânticas | Símbolos | Strings literais (callbacks/aRotina) |
| Resolução de tipos em hover | Sim | Apenas `#define` |
| Go-to-definition cross-file | Sim | Limitado ao RPO conectado |
| Análise de fluxo de dados | Sim | Não |
| Inferência de tipo de retorno | Sim | Não |

---

## 5. O que funciona no LSP AdvPL e como aproveitá-lo

Apesar das limitações, o TDS Language Server oferece valor real nas seguintes situações:

| Situação | Ferramenta útil |
|---|---|
| Listar funções/classes de um arquivo grande | `lsp_document_symbols` — mapeia a estrutura sem ler o arquivo inteiro |
| Detectar erros de compilação sem compilar | `get_errors` — warnings W0007/W0016, erros de sintaxe |
| Hover em constantes e `#define` | `lsp_hover` — exibe o valor expandido de defines |
| Autocompletar keywords e funções do RPO | `lsp_completion` — útil durante edição ativa |
| Formatar o arquivo | `lsp_format_document` — aplica indentação padrão |

Para análises além dessas (referências cruzadas, impacto de mudanças, uso de variáveis), a estratégia correta é combinar:
1. **`lsp_document_symbols`** para mapear a estrutura
2. **`get_errors`** para validação de compilação
3. **`grep_search`** com regex para rastrear referências textuais (incluindo strings literais)
4. **`mcp_advpl-tlpp-mc_code-search`** para buscar padrões de uso no repositório

---

## 6. Conclusão

A cobertura parcial do Language Server AdvPL é uma **consequência direta das características da linguagem** — tipagem dinâmica, compilação orientada a RPO, e uso extensivo de referências por string literal — combinadas com uma **arquitetura de LS orientada a arquivo aberto** em vez de índice global.

Não se trata de uma limitação da extensão TDS-VSCode em si, mas de uma restrição fundamental de como AdvPL foi projetado. O TLPP (com tipagem estática e namespaces) oferece cobertura LSP significativamente melhor, o que é um dos argumentos técnicos para migração gradual de código legado `.prx` para `.tlpp`.

Para o `mata010.prx` especificamente, os problemas críticos identificados (`lReturn` não inicializado, `Aviso()` dentro de transação, `dbSelectArea("SX5")` direto) foram encontrados exclusivamente por **leitura direta do código** — evidenciando que o code review manual continua indispensável para arquivos AdvPL legados.
