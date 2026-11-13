---
name: totvs-mcp
description: Orienta o uso das ferramentas TOTVS MCP para compilar e analisar fontes AdvPL/TLPP/4GL, consultar símbolos e validar ou aplicar pacotes de atualização.
---

# Ferramentas TOTVS MCP

Use esta skill quando a tarefa exigir as ferramentas TOTVS MCP fornecidas pela extensão TDS-VSCode.

## Escolha da ferramenta

- **Compilar um fonte:** use `TOTVS-MCP--Exp--tds_compile`. A compilação é executada no servidor/ambiente TOTVS conectado e retorna os diagnósticos.
- **Verificar sintaxe sem gerar código no RPO:** use `TOTVS-MCP--Exp--tds_syntax_only`. Também é possível usar `tds_compile` com `syntaxOnly: true`.
- **Aplicar as sugestões de correção do language server:** use `TOTVS-MCP--Exp--tds_fix` para aplicar as correções rápidas sugeridas pelos diagnósticos de erros/avisos. Sempre prefira essa opção antes de editar manualmente o código, e revise o resultado para confirmar se a correção foi aplicada no buffer do editor.
- **Inspecionar a estrutura de um fonte:** use `TOTVS-MCP--Exp--tds_document_symbols` para obter funções, classes, métodos e variáveis.
- **Verificar se o servidor MCP está ativo:** use `TOTVS-MCP--Exp--tds_ping`, especialmente quando uma operação falhar por conexão.
- **Consultar comandos, alvos e opções suportados:** use `TOTVS-MCP--Exp--tds_help` quando os parâmetros ou aliases não estiverem claros.
- **Validar um pacote de atualização:** use `TOTVS-MCP--Exp--tds_validate_patch`. A validação consulta o RPO conectado, mas não o altera.
- **Aplicar um pacote de atualização:** use `TOTVS-MCP--Exp--tds_apply_patch` somente quando o usuário pedir explicitamente para aplicar o pacote. Essa operação altera o RPO.

## Seleção do alvo

1. Prefira o caminho explícito informado pelo usuário, absoluto ou relativo ao workspace, para restringir a operação ao arquivo ou pasta pretendidos.
2. Use `target: "current"` (ou omita `target`) somente quando a intenção for trabalhar no arquivo ativo do editor.
3. Use `target: "open-editors"` para os fontes abertos e `target: "workspace"` para todo o workspace, apenas quando esse escopo for solicitado.
4. Não amplie o alvo para workspace ou pasta quando o usuário indicou um único fonte.

Exemplo de compilação de um arquivo:

```json
{
  "target": "W:\\caminho\\do\\projeto\\fonte.prw",
  "format": "markdown"
}
```

Exemplo de verificação sintática:

```json
{
  "target": "W:\\caminho\\do\\projeto\\fonte.prw",
  "only": "all",
  "sort": "file",
  "format": "markdown"
}
```

As ferramentas de compilação e sintaxe também aceitam `only` (`all`, `error` ou `warning`), `sort` (`none`, `file` ou `severity`) e `max` para limitar a quantidade de diagnósticos.

## Ordem recomendada para usar as sugestões de fix

1. Em tarefas de correção com `TOTVS-MCP--Exp--tds_fix`, use somente `TOTVS-MCP--Exp--tds_syntax_only` para obter e validar diagnósticos. Não compile o fonte nesse fluxo.
2. Revise os erros e avisos retornados para confirmar o problema e o escopo da correção.
3. Use `TOTVS-MCP--Exp--tds_fix` para aplicar as sugestões do language server no buffer do editor.
4. Verifique o resultado na edição do arquivo e confirme se as correções foram aceitas pelo LS.
5. Reexecute somente `TOTVS-MCP--Exp--tds_syntax_only` para validar que os diagnósticos foram resolvidos.
6. Só recorra a ajuste manual quando a ferramenta não oferecer correção ou quando a sugestão aplicada não for suficiente.

## Fluxo para pacotes de atualização

1. Confirme o caminho do pacote `.ptm`, `.zip` ou `.upd` e o ambiente TOTVS conectado.
2. Valide primeiro com `TOTVS-MCP--Exp--tds_validate_patch`, passando `patch` com o caminho do pacote.
3. Apresente o resultado da validação. Não aplique automaticamente, mesmo que a validação seja bem-sucedida.
4. Só aplique após pedido explícito do usuário, usando `TOTVS-MCP--Exp--tds_apply_patch` com o mesmo pacote.
5. `applyOld` é opcional e, quando omitido, permanece `false`. Não o habilite sem solicitação explícita.

## Resultado e falhas

- Informe o alvo usado e se a operação foi compilação ou apenas verificação sintática.
- Resuma erros e avisos retornados; não declare sucesso se a ferramenta retornar falha ou diagnósticos.
- Se não houver diagnósticos, diga que a ferramenta não encontrou erros ou avisos, sem inferir efeitos além do resultado recebido.
- Regra MCP-only: para tarefas de compilação, análise sintática, diagnósticos, warnings, erros ou validação, a ação obrigatória é usar as ferramentas TOTVS MCP (`TOTVS-MCP--Exp--tds_compile`, `TOTVS-MCP--Exp--tds_syntax_only`, `TOTVS-MCP--Exp--tds_fix`, `TOTVS-MCP--Exp--tds_validate_patch`, ou o wrapper `tds`). Não substitua o resultado do MCP por verificações locais, suposições ou diagnósticos inferidos.
- Em caso de falha do MCP (erro de conexão, timeout, ausência de resposta útil ou diagnóstico inválido), notifique o usuário explicitamente e interrompa a execução. Não assuma fallback, não execute checagens locais equivalentes e não afirme que a correção foi validada sem o retorno do MCP.
- Se houver erro de conexão, use `tds_ping` e relate o resultado; não substitua a compilação por uma verificação local como se fossem equivalentes.
- Para descobrir ou confirmar os aliases disponíveis, consulte `tds_help`. Ele documenta também o comando agregado `tds`, cujas ações incluem `compiler`, `syntax-only`, `validate-patch`, `apply-patch` e `help`.
