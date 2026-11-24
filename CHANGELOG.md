# Changelog

## Versão [3.0.X]

### Depreciado

#### Ferramentas para _chat_ `@tds`

As ferramentas de modelo de linguagem (_LM Tools_) foram removidas devido a descontinuação por parte da _Microsoft_. Em seu lugar, foi implementado o [_TOTVS MCP_](#servidor-totvs-mcp) que efetua as mesmas operações usando linguagem natural.

#### Uso de extensões de terceiros dscontinuada

- VS Code: [Language Server tools for Copilot](https://marketplace.visualstudio.com/items?itemName=sehejjain.lsp-mcp-bridge) (`sehejjain.lsp-mcp-bridge`)
- Kiro: [Kio LSP MCP](https://open-vsx.org/extension/Rapdog/kiro-lsp-mcp) (`sehejjain.lsp-mcp-bridge`)

Essas extensões não são mais necessária e seu uso foi descontinuado, pois suas funcionalidades agora fazem parte do _TOTVS MCP_. Caso a tenha instalado, desinstale-as (ou desabilite) para evitar ferramentas duplicadas no _chat_.

### Novidades

#### Servidor TOTVS MCP

Implementação do _TOTVS MCP_, um servidor [MCP](docs/mcp.md) (_Model Context Protocol_) embutido na extensão, que permite aos assistentes de IA (GitHub Copilot, Kiro etc.) operar sobre os fontes e o ambiente conectado, usando linguagem natural.

O servidor vem ligado por padrão (`"totvsLanguageServer.mcp.enable": true`) e se apresenta com a versão da extensão, a mesma devolvida pela ferramenta `tds_ping`.

Foram incorporadas as ferramentas de linguagem `tds_definition`, `tds_references`, `tds_hover`, `tds_completion`, `tds_workspace_symbols`, `tds_signature_help`, `tds_code_actions`, `tds_rename_symbol` (prévia) e `tds_format_document` (prévia), que se somam à `tds_document_symbols`. Elas valem somente para fontes AdvPL/TLPP/4GL. Veja detalhes em [TOTVS MCP](docs/mcp.md).

> **Kiro:** o Kiro lê os servidores MCP de `.kiro/settings/mcp.json`. Com `totvsLanguageServer.mcp.enable` ligado (padrão), a extensão inicia o servidor (porta livre) e grava a entrada `totvs-mcp` nesse arquivo, com a URL e o _token_ atuais, removendo-a ao parar o servidor. O arquivo contém o _token_: não o versione. Veja [TOTVS MCP](docs/mcp.md#kiro).

#### `Linter` com _Tree-sitter_

Troca do motor do `linter`, que passa a utilizar o [_Tree-sitter_](https://tree-sitter.github.io/) e proporciona diversas melhorias.

Alguns ganhos:

- Performance e consumo de recursos (CPU/Memória).
- Indica vários erros em única passagem.
- Tratamento de erros com correta visualização do código em `Problemas`.
- Dobra de código (_folding_) mais assertiva.

> **Recurso experimental, ativado por padrão.** Caso apresente problemas (por exemplo, na visão `Estrutura`, na navegação ou no `hover` em símbolos), abra um chamado relatando o ocorrido e desligue o _Tree-sitter_ definindo no `settings.json`:

```json
{
  ...,
  "totvsLanguageServer.linter.callTreeSitter": false
}
```

#### Correção rápida (_quick fix_)

Adicionada [correção rápida](docs/fix.md) para diversos erros de compilação. Veja detalhes na documentação associada.

As correções podem ser aplicadas no problema sob o cursor ou [em todo o fonte](docs/fix.md#aplicar-em-todo-o-fonte), para os problemas do mesmo tipo.

#### Contexto de IA (instruções e _skill_)

No Kiro, a extensão oferece a configuração do contexto de IA da área de trabalho:

- instruções (_steering_) em `.kiro/steering/advpl-tlpp-ls-first-<versão>.md`;
- _skill_ `totvs-mcp-first` em `.kiro/skills/totvs-mcp-first/SKILL.md`, que orienta o assistente a usar primeiro as ferramentas do _TOTVS MCP_.

A _skill_ é oferecida novamente quando a extensão traz uma versão mais nova e nunca é sobrescrita sem confirmação. A opção "Nunca" é lembrada.

O comando `TOTVS: Reiniciar estado do contexto de IA (instruções e skill)` (`totvsLanguageServer.iacontext.reset`), após confirmação, limpa o estado do contexto de IA e, no Kiro, remove o _steering_, a _skill_ e a entrada `totvs-mcp` de `.kiro/settings/mcp.json`, refazendo a verificação em seguida. As instruções do GitHub Copilot (`.github/instructions`) são mantidas. Veja detalhes em [TOTVS MCP](docs/mcp.md).

### Melhorias

#### Pastas de trabalho

As pastas `.cache`, `.advpl` e arquivos do _linter_ agora ficam em `.tds` (antes `.vscode`).
Caso seja detectado dentro das pastas `.vscode`, as pastas serão movidas para a nova localização.

> Sugestão:
>
> Exclua da pesquisa a pasta de trabalho `.tds`, adicionando a chave abaixo em `settings.json`.

```json
{
  ...
  "search.exclude": {
      "**/.tds": true
  }
}
```

> Caso queira esconder pasta de trabalho `.tds` da visão `Explorer`, adicione a chave abaixo em `settings.json`.

```json
{
  ...
  "files.exclude": {
      "**/.tds": true
  }
}
```

#### Visão "Estrutura" (_Outline_)

- Padronização na visualização de informações sobre o símbolo.
- Tratamento de erros no arquivo fonte.

#### Edição de código

A edição passa a ser incremental. Em vez de reprocessar ou reanalisar o fonte inteiro a cada modificação, apenas o que foi modificado será reprocessado ou reanalisado. Com isso, o tempo de resposta do `LS` torna-se mais rápido, evitando travamentos em fontes grandes e melhorando o consumo de recursos (CPU e memória).

Recurso perceptível em fontes médios e grandes (acima de 100K).

#### Formatação de código AdvPL

A formatação pode ser efetuada:

- Fonte inteiro
- Em bloco (_range_)
- Durante a digitação

#### Dobra de código (_Folding_)

A dobra (_folding_) de código é controlada pelas configurações nativas do VS Code `editor.folding` (liga/desliga) e `editor.foldingStrategy` (`auto` | `indentation`), global ou por linguagem (ex.: `"[advpl]"`). [Detalhes em TDS: Configurações](./docs/configuration.md).

```json
{
  "editor.folding": true,
  "editor.foldingStrategy": "auto"
}
```

> O uso de `editor.foldingStrategy: "auto"` (_folding_ provido pelo Language Server) é **experimental** para AdvPL/TLPP. Em caso de regiões incorretas, favor abrir um [chamado](https://github.com/totvs/tds-vscode/issues) e utilizar `"indentation"`.

#### TOTVS MCP

- Cada ferramenta registra o tempo de cada etapa (_profile_) no _log_ do canal `TOTVS MCP`, nos níveis `verbose` e `debug`, inclusive quando falha.
- Descrições, parâmetros e mensagens das ferramentas passam a ser em inglês (ex.: `No problems found in ...`).

### Correções

- Corrigida a queda do LS quando o arquivo-fonte encontrava-se com o atributo _Read Only_ ativado. [GITHUB 1505](https://github.com/totvs/tds-vscode/issues/1505) e [DTCLIENT01-7923](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-7923).

#### Valores padrão de `totvsLanguageServer.editor.linter.behavior` e `totvsLanguageServer.editor.index.cache`

Ajustado o valor padrão das configurações abaixo e, também, a validação, que só é efetuada se houver alterações em uma dessas propriedades.

```json
{
  "totvsLanguageServer.editor.linter.behavior": "enableOnlyOpenFiles",
  "totvsLanguageServer.editor.index.cache": "onMemory"
}
```

Para o uso com IA, recomenda-se:

```json
{
  "totvsLanguageServer.editor.linter.behavior": "enable",
  "totvsLanguageServer.editor.index.cache": "onMemory" //ou onDisk
}
```

> IMPORTANTE:
>
> Com o comportamento padrão do _linter_ (`enableOnlyOpenFiles`), o uso de IA pode ser limitado.
> Ao desligar esses recursos, solicitações da IA podem perder acurácia e usar busca textual (_grep_, _read file_ e outras), que podem ser mais lentas.

#### Notificação de alterações nas configurações

Algumas configurações não eram notificadas ao LS.

#### Pasta de _cache_ criada indevidamente

Em determinadas configurações da propriedade `totvsLanguageServer.editor.index.cache` a estrutura de pastas do _cache_ era criada indevidamente.

#### Compilação de arquivos selecionados

Corrigida a compilação, a verificação de sintaxe e a recompilação de arquivos selecionados na visão `Explorer`, e a compilação disparada pela geração de pacote de atualização (_patch_). O resultado da compilação também volta a ser devolvido à ferramenta `tds_compile` do _TOTVS MCP_.
