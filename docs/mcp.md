# MCP (Model Context Protocol)

O **MCP** (_Model Context Protocol_) é um protocolo aberto que padroniza a forma como aplicações fornecem contexto a modelos de linguagem (_LLMs_) e assistentes de IA.

Assim como os protocolos **LSP** (_Language Server Protocol_) e **DAP** (_Debug Adapter Protocol_) padronizam, respectivamente, a comunicação de recursos de linguagem e de depuração entre editores e servidores, o **MCP** padroniza a conexão entre assistentes de IA e as fontes de dados, ferramentas e serviços externos que eles utilizam.

## Conceitos principais

- **Servidor MCP**: expõe recursos, ferramentas e dados (por exemplo, acesso a arquivos, bancos de dados ou APIs) de forma padronizada.
- **Cliente MCP**: a aplicação ou assistente de IA que consome esses recursos para enriquecer o contexto do modelo.
- **Transporte**: a camada de comunicação entre cliente e servidor (geralmente via _stdio_ ou HTTP).

## Benefícios

- **Padronização**: uma única interface para integrar diferentes fontes de dados e ferramentas.
- **Reutilização**: servidores MCP podem ser compartilhados entre diferentes clientes e assistentes.
- **Extensibilidade**: novas capacidades podem ser adicionadas sem alterar o cliente de IA.

> Saiba mais na documentação oficial: [Model Context Protocol](https://modelcontextprotocol.io/).

## MCP na extensão TDS-VSCode

A extensão **TDS-VSCode** utiliza o **MCP** para integrar seu _Language Server_ (AdvPL/TLPP/4GL) aos assistentes de IA, permitindo que eles compreendam melhor a área de trabalho e sejam mais assertivos e rápidos em questões relacionadas aos seus fontes.

A extensão não disponibiliza um servidor MCP próprio embutido. A integração é feita por meio de extensões "ponte" (_bridge_), que expõem os recursos do _Language Server_ via MCP para o assistente de IA:

### Integração com o GitHub Copilot

Utilizada para ajudar o Copilot a compreender melhor a área de trabalho. Recomenda-se o **VSCode 1.107.1 (11/2025)** ou superior. Em versões anteriores, também é obrigatória a instalação das extensões:

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

Em qualquer versão do VSCode, instale também a extensão:

- [Language Server tools for Copilot](https://marketplace.visualstudio.com/items?itemName=sehejjain.lsp-mcp-bridge) (`sehejjain.lsp-mcp-bridge`)

### Integração com o Kiro

Utilizada para ajudar o Kiro a compreender melhor a área de trabalho. Em qualquer versão do Kiro, instale também a extensão:

- [Kiro LSP MCP](https://open-vsx.org/extension/Rapdog/kiro-lsp-mcp)

### Ferramenta `@tds` no chat

Além da ponte MCP, a extensão registra o participante de chat `@tds` (ferramenta `TDS Tools` / `tds-lm-tools`), que permite executar operações diretamente no _chat_ do assistente. Os comandos são acionados com `/` após o participante, por exemplo `@tds /compiler` ou `@tds /help`:

- **/compiler**: compila o alvo (padrão: editor ativo).
- **/syntax-only**: verifica a sintaxe (_linter_) do alvo, sem gerar código.
- **/validate-patch**: valida um pacote de atualização (`.ptm`, `.zip`, `.upd`) contra o _RPO_ do servidor atual.
- **/apply-patch**: aplica um pacote de atualização (`.ptm`, `.zip`, `.upd`) ao _RPO_ do servidor atual.
- **/help**: exibe a ajuda com os comandos, alvos e _flags_ disponíveis.

#### Alvos (_targets_) suportados

- **editor atual**: `editor`, `current` (padrão)
- **editores abertos**: `open-files`, `open-editors`
- **área de trabalho**: `workspace`, `ws`, `all`
- **arquivo ou pasta**: caminho relativo ou absoluto (ex.: `src/meu.prw`)

#### Flags suportadas (use `chave=valor` ou `chave:valor`)

- `syntaxOnly=true|false`
- `applyOld=true|false`
- `only=all|error|warning`
- `max=N`
- `sort=none|file|severity`
- `format=markdown|json`

Exemplos:

```text
@tds /compiler target=src/modulo syntaxOnly=true only=error sort=file
@tds /syntax-only target=editor
@tds /apply-patch patches/fix.ptm
@tds /validate-patch c:/patches/fix.zip
@tds /help
```

### Configurações recomendadas

Para que o assistente de IA tenha o melhor contexto da área de trabalho por meio do MCP, recomenda-se ajustar as seguintes configurações da extensão (chaves `totvsLanguageServer`):

- **`totvsLanguageServer.editor.index.cache`** (cache de navegação): deve estar ligado, ao menos como `onMemory`. O valor padrão é `off`, o que pode deixar indisponíveis alguns recursos de navegação (DSS) usados pela IA. Valores possíveis:

  - `off`: desliga o cache (não recomendado para uso com IA).
  - `onMemory` (recomendado): cache mantido em memória.
  - `onDisk`: persiste o cache em disco.

- **`totvsLanguageServer.editor.linter.behavior`** (comportamento do _linter_): recomenda-se **`enable`**, aplicando a análise a **todos os fontes** da área de trabalho. O valor padrão é `enableOnlyOpenFiles`. Valores possíveis:
  - `enable` (recomendado): aplica a todos os fontes da área de trabalho.
  - `enableOnlyOpenFiles`: aplica apenas aos fontes em edição.
  - `disable`: desativa o processo.

Exemplo de `settings.json`:

```json
{
  "totvsLanguageServer.editor.index.cache": "onMemory",
  "totvsLanguageServer.editor.linter.behavior": "enable"
}
```
