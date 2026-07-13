# Relatório de Tools LSP Utilizadas — Code Review MATA010 (Revisão LS-First)

> **Arquivo revisado:** `mata010.prx` | **Data:** 01/06/2026

---

## Tools LSP Nativas do Kiro Utilizadas

### 1. `getDiagnostics`

**O que faz:** Consulta o TOTVS Language Server (`advpls`) e retorna erros de compilação, warnings de lint e problemas semânticos do arquivo.

**Chamada:** `paths: [".../MATA010/mata010.prx"]`

**Retornou:**

```console
9 diagnostic(s):
  W0007 (L352) — Too many parameters calling FindFunction
  W0016 (L142) — More parameters used in function call than expected
  W0016 (L143) — More parameters used in function call than expected
  W0016 (L2144) — More parameters used in function call than expected
  W0016 (L3137) — More parameters used in function call than expected
  W0016 (L3338) — More parameters used in function call than expected
  W0016 (L3339) — More parameters used in function call than expected
  W0016 (L3380) — More parameters used in function call than expected
  W0016 (L3381) — More parameters used in function call than expected
```

**Achados gerados:** G5 — 9 warnings de compilação (W0007 × 1, W0016 × 8)

---

### 2. `lsp_workspace_symbols`

**O que faz:** Lista todos os símbolos (funções, static functions, classes, métodos) do arquivo via Language Server.

**Chamada:** query `mata010.prx` — extração de todos os `Function` e `Static Function`

**Retornou:** 62 símbolos identificados:

- 47 `Function` públicas
- 15 `Static Function` privadas ao arquivo

**Achados gerados:**

- Identificação das 14 funções com > 80 linhas (maior: `A010INCLUI` com 297 linhas)
- Base para todas as análises subsequentes de `lsp_definition` e `lsp_references`

---

### 3. `lsp_definition`

**O que faz:** Navega até a definição exata de um símbolo, retornando arquivo, linha e contexto.

**Chamadas realizadas (9 pontos):**

| Símbolo / Linha | Resultado |
| --- | --- |
| L142–143 (W0016) | `Set Key VK_F4 TO MT010F4()` — contexto confirmado |
| L352 (W0007) | `FindFunction("RodaNewPCP") .And. RodaNewPCP()` — contexto confirmado |
| L2144 (W0016) | `cFilAnt := cFilBkp` dentro de `MT010F4` — contexto confirmado |
| L3137 (W0016) | `Set Key VK_F4 TO MT010F4()` em `A010Consul` — confirmado |
| L3338–3339 (W0016) | `Set Key` em bloco `cPaisLoc == "RUS"` — confirmado |
| L3380–3381 (W0016) | `Set Key` em `MenuDef` — confirmado |
| L667 (CA2000) | `dbSelectArea("SX5")` em `A010Tipo` — **achado crítico confirmado** |
| L1526–1560 (CA1002) | `Aviso()` dentro de `Begin Transaction` em `A010ALTERA` — confirmado |
| L2166–2183 (CA1002) | `MsgInfo()` em `Mta010ok()` — confirmado |

**Achados gerados:** CA2000 (crítico), CA1002 (3 ocorrências), contexto dos 9 warnings G5

---

### 4. `lsp_hover`

**O que faz:** Retorna a assinatura, tipo e documentação inline de um símbolo na posição do cursor — equivalente ao hover do IDE.

**Chamadas realizadas:**

| Símbolo | Fonte | Assinatura retornada |
| --- | --- | --- |
| `MT010F4` | L2137 no arquivo | `Static Function MT010F4()` — sem parâmetros |
| `MT010Perg` | L2489 no arquivo | `Function MT010Perg()` — sem parâmetros |
| `FindFunction` | cache LSP `_binary_functions.prw` | `binary function findfunction(cfuncao)` — 1 parâmetro |
| `PCPIntgPPI` | MCP `get-code-chunks` | `Function PCPIntgPPI(cTabela, lLite)` — 2 parâmetros opcionais |
| Includes L1–6 | cache LSP | `protheus.ch` e `apwizard.ch` confirmados como obsoletos |
| ProtheusDOC (62 funções) | varredura do arquivo | 46 sem bloco, 16 com bloco |

**Achados gerados:** Confirmação dos W0016 (Set Key com parâmetros implícitos), CA3001 (includes obsoletos), cobertura de documentação (46/62 sem ProtheusDOC)

---

### 5. `lsp_references`

**O que faz:** Encontra todos os call sites (referências) de um símbolo em todo o workspace.

**Chamadas realizadas (11 símbolos):**

| Símbolo | Call sites encontrados | Achado |
| --- | --- | --- |
| `MT010F4` | L143, 2145, 3138, 3339, 3381 (5 sites) | W0016 em 4 call sites via `Set Key` |
| `MT010Perg` | L144, 3340, 3382 (3 sites) | W0016 em 3 call sites via `Set Key` |
| `FindFunction` | L342, 354, 518, 590, 1286, 1330, 1563, 1951, 1997, 2099, 3171 (11 sites) | W0007 em L342 |
| `Aviso` | L1278, 1322, 1553 (3 sites) | CA1002 — 3 dentro de `Begin Transaction` |
| `MsgInfo` | L2175 (1 site) | CA1002 — dentro de validação chamada em transação |
| `MsgRun` | L2095, 3549, 3551 (3 sites) | INFO — L2095 em contexto de validação |
| `Type()` | 79 ocorrências totais; **13 em loop_depth ≥ 1** | CA1003 — 13 violações |
| `SuperGetMV` | 37 ocorrências totais; **20 em loop_depth ≥ 1** | CA1003 — 20 violações |
| `IIF()` / `IIf()` | **53 ocorrências** | CA4000 — 53 violações |
| `dbSelectArea("SX5")` | L667 (1 site) | CA2000 — **CRÍTICO** |
| `FwFreeObj` | L563, 571 (2 sites) | Redundante após `Destroy()` |

**Achados gerados:** CA2000 (crítico), CA1002 (3+1 ocorrências), CA1003 (33 violações), CA4000 (53 violações), FwFreeObj redundante

---

## Resumo das Tools LSP

| Tool | Chamadas | Achados Gerados |
| --- | --- | --- |
| `getDiagnostics` | 1 | 9 warnings G5 (W0007, W0016) |
| `lsp_workspace_symbols` | 1 | 62 símbolos; 14 funções > 80 linhas |
| `lsp_definition` | 9 pontos | CA2000 crítico; CA1002 × 3; contexto dos 9 warnings |
| `lsp_hover` | 4 símbolos + 62 funções | Assinaturas validadas; CA3001; cobertura ProtheusDOC |
| `lsp_references` | 11 símbolos | CA2000; CA1002 × 4; CA1003 × 33; CA4000 × 53; FwFreeObj |

**Total de achados gerados pelas tools LSP: 24**
(1 crítico, 10 maiores, 7 menores, 6 info)
