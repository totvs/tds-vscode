# Servidor **TOTVS MCP**

A extensão **TDS-VSCode** possui um servidor MCP embutido, o **TOTVS MCP**. Com ele, o assistente de IA pode, usando linguagem natural, **compilar** fontes, **corrigir** problemas, **validar e aplicar** pacotes de atualização e **consultar a estrutura** dos fontes, sempre sobre o ambiente que você já tem conectado no **VS Code/Kiro**.

> O **TOTVS MCP** é **experimental** (`**TOTVS MCP** (Exp)`). Ferramentas, parâmetros e mensagens podem mudar em versões futuras.

## MCP (Model Context Protocol)

O **MCP** (_Model Context Protocol_) é um protocolo aberto que padroniza a forma como aplicações fornecem contexto a modelos de linguagem (_LLMs_) e assistentes de IA.

Assim como os protocolos **LSP** (_Language Server Protocol_) e **DAP** (_Debug Adapter Protocol_) padronizam, respectivamente, a comunicação de recursos de linguagem e de depuração entre editores e servidores, o **MCP** padroniza a conexão entre assistentes de IA e as fontes de dados, ferramentas e serviços externos que eles utilizam.

> Saiba mais na documentação oficial: [Model Context Protocol](https://modelcontextprotocol.io/).

## Conceitos principais

- **Servidor MCP**: expõe ferramentas (_tools_), recursos (_resources_) e _prompts_ de forma padronizada.
- **Cliente MCP**: a aplicação ou assistente de IA que consome esses recursos (GitHub Copilot, Kiro etc.).
- **Transporte**: a camada de comunicação entre cliente e servidor (geralmente _stdio_ ou HTTP).
- **Ferramenta (_tool_)**: uma ação que o modelo pode executar (ex.: compilar um fonte).
- **_Prompt_**: um roteiro pronto, invocado explicitamente pelo usuário (ex.: `/mcp...`).

## Como funciona

- O servidor roda dentro da própria extensão (_extension host_) e usa o transporte **HTTP (_Streamable HTTP_)**, no endereço `http://127.0.0.1:<porta>/mcp`.
- A porta é livre e escolhida a cada início. Cada janela do **VS Code/Kiro** possui o seu próprio servidor.
- Atende **somente a máquina local** (_loopback_) e exige um **_token_** (`Authorization: Bearer ...`), gerado a cada início e entregue automaticamente ao **VS Code/Kiro**. O _token_ nunca é gravado no _log_.
- O servidor **vem ligado** (`totvsLanguageServer.mcp.enable` = `true`). A extensão se registra no VS Code como um provedor de servidores MCP (`**TOTVS MCP**`) e o servidor é iniciado quando o VS Code consulta os servidores disponíveis. No Kiro, o servidor é iniciado ao abrir a área de trabalho (veja [Kiro](#kiro)). Nesse momento é exibida a notificação `**TOTVS MCP** iniciado em http://127.0.0.1:<porta>/mcp`.
- As ferramentas operam sobre o **servidor/ambiente atualmente conectado** e sobre o _Language Server_ (LS) da extensão. Portanto, para compilar ou aplicar _patch_, conecte-se antes a um servidor, como faria normalmente.

## Requisitos

- **VSCode 1.107.1** (11/2025) ou superior. Em versões anteriores, o suporte a servidores MCP fornecidos por extensões pode não estar disponível.
- Um assistente de IA com suporte a MCP, como o **GitHub Copilot Chat** (modo _Agent_) ou o **Kiro**.
- Para compilar, corrigir e aplicar _patch_: um servidor _Protheus_ conectado e o LS em execução.

## Como habilitar

1. O servidor já vem ligado. Se ele tiver sido desligado, volte a ligá-lo no `settings.json`:

   ```json
   {
     "totvsLanguageServer.mcp.enable": true
   }
   ```

2. Abra o _chat_ do assistente de IA. O servidor `**TOTVS MCP**` passa a constar na lista de servidores MCP (comando `MCP: List Servers`).
3. Na primeira utilização, o VS Code pede para **confiar** no servidor. Confirme.
4. Verifique as ferramentas disponíveis no ícone de ferramentas do _chat_ (devem constar as `tds_*`).

Para desligar, volte a configuração para `false`. O servidor é finalizado imediatamente.

> **Dica**: se o servidor não aparecer, recarregue a janela (`Developer: Reload Window`) e consulte o canal de saída `**TOTVS MCP**` (veja [Registro de atividades](#registro-de-atividades-log)).

## Comandos

Acessíveis pela paleta de comandos (`Ctrl+Shift+P`):

| Comando                              | Descrição                                                                     |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `TOTVS: Iniciar servidor MCP`        | Inicia o servidor, se ainda não estiver ativo. Exibe a notificação com a URL. |
| `TOTVS: Parar servidor MCP`          | Finaliza o servidor.                                                          |
| `TOTVS: Mostrar log do servidor MCP` | Abre o canal de saída `**TOTVS MCP**`.                                        |
| `TOTVS: Reiniciar estado do contexto de IA (instruções e skill)` | Apaga o contexto de IA da área de trabalho (no VS Code: instruções do Copilot; no Kiro: _steering_, _skill_ e a entrada `totvs-mcp` do `mcp.json`) e refaz as perguntas. Veja [Contexto de IA](#contexto-de-ia-instruções-e-skill). |

Normalmente os comandos de iniciar e parar não são necessários: o servidor é iniciado automaticamente, pois a configuração `mcp.enable` vem ligada.

## Configurações

| Configuração                      | Padrão    | Descrição                                                                                                     |
| --------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `totvsLanguageServer.mcp.enable`  | `true`    | Habilita o servidor MCP embutido.                                                                             |
| `totvsLanguageServer.mcp.log`     | `message` | Nível de _log_ do canal de saída: `off`, `message`, `verbose` ou `debug`.                                     |
| `totvsLanguageServer.mcp.logFile` | (vazio)   | Arquivo para gravar o _log_ completo. Se informar apenas o nome, usa a pasta raiz do projeto. Vazio desativa. |

Exemplo:

```json
{
  "totvsLanguageServer.mcp.enable": true,
  "totvsLanguageServer.mcp.log": "message",
  "totvsLanguageServer.mcp.logFile": "tds-mcp.log"
}
```

As alterações de `mcp.log` e `mcp.logFile` valem imediatamente, sem recarregar a janela.

## Ferramentas (_tools_)

Os parâmetros são sempre **opcionais**, exceto onde indicado. Nas ferramentas que recebem um fonte, se o parâmetro de arquivo/alvo for omitido, é utilizado o **fonte do editor ativo** (o fonte "no contexto").

> Se o foco estiver no painel do _chat_ e não houver um editor ativo, informe o caminho do fonte explicitamente.

| Ferramenta             | O que faz                                                         | Altera dados?               |
| ---------------------- | ----------------------------------------------------------------- | --------------------------- |
| `tds_compile`          | Compila e retorna erros e avisos.                                 | Sim (gera código no RPO)    |
| `tds_syntax_only`      | Verifica a sintaxe (_linter_), sem gerar código.                  | Não                         |
| `tds_fix`              | Aplica as correções (_quick fixes_) do LS aos problemas do fonte. | Sim (altera o fonte aberto) |
| `tds_validate_patch`   | Valida um pacote de atualização contra o RPO atual.               | Não                         |
| `tds_apply_patch`      | Aplica um pacote de atualização ao RPO atual.                     | Sim (atualiza o RPO)        |
| `tds_document_symbols` | Estrutura (símbolos) de um fonte, obtida do LS.                   | Não                         |
| `tds_definition`       | Definição do símbolo em uma posição do fonte.                     | Não                         |
| `tds_references`       | Referências (usos) do símbolo em uma posição do fonte.            | Não                         |
| `tds_hover`            | Documentação e tipo do símbolo em uma posição do fonte.           | Não                         |
| `tds_completion`       | Sugestões de completação em uma posição do fonte.                 | Não                         |
| `tds_workspace_symbols`| Busca símbolos por nome em toda a área de trabalho.               | Não                         |
| `tds_signature_help`   | Assinatura e parâmetros da função/método em uma posição.          | Não                         |
| `tds_code_actions`     | Lista as ações de código (correções e refatorações) de uma linha. | Não                         |
| `tds_rename_symbol`    | Prévia das edições para renomear um símbolo (não aplica).         | Não                         |
| `tds_format_document`  | Prévia das edições da formatação do fonte (não aplica).           | Não                         |
| `tds_help`             | Ajuda com comandos, alvos e opções.                               | Não                         |
| `tds_ping`             | Verifica se o servidor está ativo.                                | Não                         |

### `tds_compile` e `tds_syntax_only`

Compilam (ou apenas verificam a sintaxe) e devolvem os erros e avisos exibidos em `Problemas`. `tds_syntax_only` equivale a `tds_compile` com `syntaxOnly=true`.

| Parâmetro    | Valores                    | Descrição                                                                  |
| ------------ | -------------------------- | -------------------------------------------------------------------------- |
| `target`     | texto                      | Alvo. Veja [Alvos](#alvos-targets). Padrão: editor ativo.                  |
| `syntaxOnly` | `true`, `false`            | Somente `tds_compile`. Verifica a sintaxe sem gerar código no RPO.         |
| `only`       | `all`, `error`, `warning`  | Filtra por severidade.                                                     |
| `sort`       | `none`, `file`, `severity` | Ordenação do resultado.                                                    |
| `max`        | número                     | Máximo de problemas retornados. Padrão: 20 para arquivo; todos para pasta. |
| `format`     | `markdown`, `json`         | Formato do resultado. Padrão: `markdown`.                                  |

#### Alvos (_targets_)

- **editor atual**: `current` ou `editor` (padrão)
- **editores abertos**: `open-editors` ou `open-files`
- **área de trabalho**: `workspace`, `ws` ou `all`
- **arquivo ou pasta**: caminho relativo à área de trabalho ou absoluto (ex.: `src/meu.prw`, `src/modulo`)

### `tds_fix`

Aplica as correções sugeridas pelo LS aos erros e avisos de um fonte.

| Parâmetro | Valores                   | Descrição                                                                           |
| --------- | ------------------------- | ----------------------------------------------------------------------------------- |
| `file`    | texto                     | Caminho (absoluto ou relativo) ou URI do fonte. Padrão: editor ativo.               |
| `line`    | número (base 1)           | Corrige somente os problemas desta linha.                                           |
| `only`    | `all`, `error`, `warning` | Filtra por severidade. Padrão: `all`.                                               |
| `apply`   | `true`, `false`           | `true` (padrão) aplica as correções. `false` apenas lista as correções disponíveis. |
| `max`     | número                    | Máximo de problemas tratados. Padrão: 10.                                           |

Como funciona:

1. Lê os problemas já existentes em `Problemas`. Se não houver nenhum, oriente o assistente a executar antes `tds_syntax_only` para atualizá-los.
2. Para cada problema, consulta as correções oferecidas pelo LS. Ações de assistentes de IA (como _Fix_ e _Explain_ do Copilot) são **ignoradas**.
3. Com **uma** correção, ela é aplicada. Com **mais de uma**, o usuário é **perguntado** sobre qual aplicar:

   - se o cliente MCP suporta _elicitation_, a pergunta aparece no próprio _chat_ (formulário com a lista numerada de opções);
   - caso contrário, é exibida uma lista de seleção (_QuickPick_) no **VS Code/Kiro**.

   Recusar ou cancelar a pergunta faz o problema ser ignorado.

4. Os problemas são tratados **de baixo para cima**, para que uma correção não desloque a posição das seguintes.
5. As correções ficam **no editor, sem salvar o arquivo**. Recompile para confirmar.

### `tds_validate_patch` e `tds_apply_patch`

| Parâmetro  | Valores         | Descrição                                                                                                 |
| ---------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| `patch`    | texto           | **Obrigatório.** Caminho do pacote (`.ptm`, `.zip` ou `.upd`), absoluto ou relativo à área de trabalho.   |
| `applyOld` | `true`, `false` | Somente `tds_apply_patch`. Aplica também recursos mais antigos que os existentes no RPO. Padrão: `false`. |

> **Atenção**: `tds_apply_patch` **atualiza o RPO** do servidor atual. Os clientes tratam a ferramenta como destrutiva e tendem a pedir confirmação. Valide o pacote antes com `tds_validate_patch`.

### `tds_document_symbols`

Retorna a estrutura hierárquica do fonte (funções, classes, métodos, variáveis etc.), obtida do LS pelo comando `vscode.executeDocumentSymbolProvider`.

| Parâmetro | Descrição                                                             |
| --------- | --------------------------------------------------------------------- |
| `file`    | Caminho (absoluto ou relativo) ou URI do fonte. Padrão: editor ativo. |

Cada símbolo traz `name`, `kind`, `kindName` (ex.: `Function`), `range`, `selectionRange`, `detail` e `children`. Se o LS ainda estiver iniciando, o resultado pode vir vazio; tente novamente em alguns instantes.

### Ferramentas de linguagem

Consultam o LS pelos comandos `vscode.execute*Provider` do VS Code e valem **somente para fontes AdvPL/TLPP/4GL** (os demais são ignorados). Todas são de leitura: renomear e formatar apenas devolvem uma prévia das edições, sem alterar arquivos. Para **aplicar** as correções dos problemas apontados, use `tds_fix`.

| Ferramenta | Parâmetros |
| ---------- | ---------- |
| `tds_definition`, `tds_hover` | `file` (padrão: editor ativo), `line`, `character` (base 0) |
| `tds_references` | `file`, `line`, `character`, `max` (padrão 100) |
| `tds_completion` | `file`, `line`, `character`, `triggerCharacter`, `max` |
| `tds_signature_help` | `file`, `line`, `character`, `triggerCharacter` |
| `tds_workspace_symbols` | `query`, `max` |
| `tds_rename_symbol` | `file`, `line`, `character`, `newName` |
| `tds_code_actions` | `file`, `line`, `character`, `endLine`, `endCharacter` (sem `character`, considera a linha inteira) |
| `tds_format_document` | `file`, `tabSize`, `insertSpaces`, `max` |

> As posições (`line` e `character`) começam em 0, como nos resultados de `tds_document_symbols`.

### `tds_help` e `tds_ping`

- `tds_help`: texto de ajuda com os comandos, alvos e opções, e a correspondência com as ferramentas MCP.
- `tds_ping`: devolve o nome do servidor, a versão da extensão (campo `version` do `package.json`) e o texto informado em `message` (opcional). Útil para testar a conexão.

## _Prompts_

Os _prompts_ são roteiros prontos que o usuário invoca explicitamente. No _chat_ do VS Code aparecem como comandos `/mcp.<servidor>.<prompt>`; digite `/mcp.` para listá-los.

| _Prompt_              | Argumento              | O que faz                                                                        |
| --------------------- | ---------------------- | -------------------------------------------------------------------------------- |
| `tds_compile_current` | —                      | Compila o fonte do editor ativo e analisa os erros e avisos, propondo correções. |
| `tds_compile_folder`  | `folder` (obrigatório) | Compila uma pasta informada, agrupa os problemas por arquivo e propõe correções. |

Os _prompts_ não compilam sozinhos: eles orientam o modelo a usar a ferramenta `tds_compile`.

## Exemplos de uso

Peça em linguagem natural; o assistente escolhe a ferramenta. Se quiser forçar a escolha, cite o nome da ferramenta.

```text
Compile o fonte atual e me diga o que está errado.
Verifique a sintaxe de src/modulo/vendas.prw, mostrando somente os erros.
Compile a pasta src/modulo e agrupe os problemas por arquivo.
Corrija os problemas deste fonte.
Liste as correções possíveis para a linha 42, sem aplicar.
Valide o patch patches/fix.ptm e, se estiver ok, aplique-o.
Quais funções existem neste fonte?
Use a ferramenta tds_document_symbols no arquivo src/utils.prw.
```

Fluxo típico de correção:

```text
Você:       Verifique a sintaxe do fonte atual e corrija o que for possível.
Assistente: [tds_syntax_only]  -> 3 erros, 1 aviso.
Assistente: [tds_fix]          -> linha 42 possui 2 correções. Qual aplicar?
Você:       2. Declarar variável 'cNome'
Assistente: [tds_fix]          -> 3 correções aplicadas (arquivo não salvo).
Assistente: [tds_syntax_only]  -> nenhum problema.
```

Exemplo (ilustrativo) de resultado de `tds_compile` no formato `markdown`:

```text
Compilation finished with diagnostics:
- target: src/modulo/vendas.prw
- flags: syntaxOnly=false
- errors: 1
- warnings: 0

1. Error src/modulo/vendas.prw:42 (advpl) - Variável 'cNome' não declarada
```

### Prompts

```text
/mcp.<servidor>.tds_compile_current
/mcp.<servidor>.tds_compile_folder   (informe folder: src/modulo)
```

## Registro de atividades (_log_)

As atividades são registradas na visão `Output`, seleção **TOTVS MCP** (ou comando `TOTVS: Mostrar log do servidor MCP`). Cada linha começa pela hora local: `HH:mm:ss [nível] mensagem`.

### Níveis (`totvsLanguageServer.mcp.log`)

| Nível              | O que registra                                                                                                                                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `off`              | Somente inicialização e finalização do servidor (inclui a URL).                                                                               |
| `message` (padrão) | Acrescenta o cabeçalho de cada chamada: pedidos do cliente, início, conclusão (com duração) ou falha de cada ferramenta. Não mostra os dados. |
| `verbose`          | Acrescenta os dados: parâmetros e resultado das ferramentas e conteúdo dos pedidos. Inclui o _profile_ (tempo em ms de cada etapa, como abrir o fonte, consulta ao LS, compilação ou aplicação, e o total) de cada ferramenta, inclusive quando falha. Linhas com prefixo `[verbose]`.                           |
| `debug`            | Acrescenta as mensagens técnicas (nomes de métodos e funções internas). Linhas com prefixo `[debug]`.                                         |

Exemplo (`message`):

```text
19:17:45 [info] **TOTVS MCP** carregado (servidor habilitado, nível de log: message, arquivo de log: não configurado)
19:17:45 [info] Iniciando o servidor MCP...
19:17:45 [info] Servidor MCP iniciado em http://127.0.0.1:54321/mcp (30ms)
19:18:02 [info] Pedido do cliente: o cliente chamou a ferramenta 'tds_compile'
19:18:02 [info] Ferramenta 'tds_compile': iniciada
19:18:04 [info] Ferramenta 'tds_compile': concluída em 2268ms
```

### Arquivo de _log_ (`totvsLanguageServer.mcp.logFile`)

Quando informado, o arquivo recebe **sempre o log completo** (equivalente a `debug`), independentemente do nível do canal. Cada linha começa pela data e hora (ISO 8601). Se informar apenas o nome do arquivo, ele é criado na pasta raiz do projeto; um caminho absoluto também é aceito. Pastas inexistentes são criadas.

> **Cuidado**: nos níveis `verbose` e `debug`, e no arquivo, o _log_ contém os parâmetros e resultados das ferramentas, o que pode incluir **código-fonte (trechos)** e mensagens do compilador. Não compartilhe o arquivo sem revisá-lo e, se ele ficar dentro do projeto, inclua-o no `.gitignore`. O _token_ de acesso nunca é registrado.

## Segurança

- O servidor escuta apenas em `127.0.0.1` e rejeita requisições sem o _token_ correto (`401`).
- O _token_ é aleatório, gerado a cada início e entregue somente ao VS Code.
- Somente o método `POST` no caminho `/mcp` é aceito.
- O VS Code pede confirmação para confiar no servidor na primeira utilização.
- Ferramentas que alteram dados (`tds_apply_patch`, `tds_fix`) são marcadas como destrutivas, para que o cliente solicite confirmação.
- Mesmo assim, o servidor opera com as **suas** credenciais e conexões: ele pode compilar e aplicar _patch_ no ambiente em que você estiver conectado. Como ele vem ligado, desligue-o (`totvsLanguageServer.mcp.enable` = `false`) quando não for utilizar e confira o ambiente antes de pedir operações que alteram o RPO.

## Solução de problemas

| Sintoma                                        | O que verificar                                                                                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| O servidor `**TOTVS MCP**` não aparece         | `totvsLanguageServer.mcp.enable` está `true`? Recarregue a janela. Veja o canal `**TOTVS MCP**` e o `MCP: List Servers`.                   |
| As ferramentas não aparecem no _chat_          | O _chat_ está em modo _Agent_? As ferramentas `tds_*` estão marcadas no ícone de ferramentas? Reinicie o servidor em `MCP: List Servers`.  |
| O modelo não usa a ferramenta                  | Cite o nome da ferramenta no pedido (ex.: "use `tds_document_symbols`"). Se houver outra extensão com ferramenta equivalente, desmarque-a. |
| `tds_compile` não encontra o fonte             | Informe o caminho em `target`. O editor ativo pode não ser o esperado se o foco estiver no _chat_.                                         |
| `tds_compile` retorna resultados antigos       | Veja o aviso "Diagnostics were not updated before timeout". Verifique a conexão com o servidor e tente novamente.                          |
| `tds_fix` informa "No problems found"         | Execute antes `tds_syntax_only` (ou compile) para atualizar `Problemas`.                                                                   |
| `tds_fix` não oferece correções                | O LS pode não ter correção automática para aquele problema (`no-fix`). Use `apply=false` para listar o que existe.                         |
| `tds_document_symbols` retorna lista vazia     | O LS ainda pode estar iniciando. Aguarde e tente novamente.                                                                                |
| Erro `401` no _log_                            | O cliente está usando um _token_ antigo. Reinicie o servidor (`MCP: List Servers`) ou recarregue a janela.                                 |

Para investigar, ative `"totvsLanguageServer.mcp.log": "debug"` e/ou informe um `mcp.logFile`.

## MCP na extensão TDS-VSCode: integrações complementares

Além do _**TOTVS MCP**_, é possível usar extensões "ponte" (_bridge_) que expõem os recursos do _Language Server_ (navegação, definição, referências, _hover_ etc.) via MCP, para que o assistente de IA compreenda melhor a área de trabalho:

### GitHub Copilot

Recomenda-se o **VSCode 1.107.1 (11/2025)** ou superior. Em versões anteriores, também é obrigatória a instalação das extensões:

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

### Kiro

O **Kiro** lê os servidores MCP do arquivo `.kiro/settings/mcp.json` e não consulta o provedor de servidores do VS Code. Por isso, no Kiro, com `totvsLanguageServer.mcp.enable` ligado (padrão), a extensão inicia o servidor ao abrir a área de trabalho e grava (ou atualiza) a entrada `totvs-mcp` nesse arquivo com a URL e o _token_ atuais. As demais entradas do arquivo são preservadas, e a entrada é removida quando o servidor é parado.

```json
{
  "mcpServers": {
    "totvs-mcp": {
      "url": "http://127.0.0.1:<porta>/mcp",
      "headers": { "Authorization": "Bearer <token>" }
    }
  }
}
```

> **Atenção:** o arquivo contém o _token_ de acesso, que muda a cada início do servidor. **Não o versione** (inclua `.kiro/settings/mcp.json` no `.gitignore`). Se o arquivo não for um JSON válido, a extensão não o altera e registra o aviso no canal `TOTVS MCP`. Se o Kiro foi encerrado sem parar o servidor, a entrada pode ficar desatualizada até a próxima inicialização.

> Algumas dessas extensões possuem ferramentas equivalentes às do **TOTVS MCP** (por exemplo, símbolos de documento). Havendo duplicidade, o modelo escolhe uma delas; desmarque a que não deseja utilizar na lista de ferramentas do _chat_.

### Contexto de IA (instruções e skill)

Ao abrir a área de trabalho, a extensão oferece gravar arquivos de contexto que orientam o assistente de IA a usar o _Language Server_ e o **TOTVS MCP**:

| Editor        | Arquivo gravado                                         |
| ------------- | ------------------------------------------------------- |
| **VS Code**   | `.github/instructions/tds-vscode-<versão>.instructions.md` |
| **Kiro**      | `.kiro/steering/advpl-tlpp-ls-first-<versão>.md`        |
| **Kiro**      | `.kiro/skills/totvs-mcp-first/SKILL.md`                 |

A resposta a cada pergunta (**Sim**, **Agora não** ou **Nunca**) e a versão instalada ficam registradas no estado da área de trabalho. A pergunta é feita quando o arquivo não existe e o usuário não escolheu **Nunca**. Para a _skill_, também quando a extensão traz uma versão mais nova.

#### Comando `TOTVS: Reiniciar estado do contexto de IA (instruções e skill)`

Identificador: `totvsLanguageServer.iacontext.reset`.

O comando pede confirmação e, sem reiniciar o editor:

1. Apaga o estado registrado (respostas e versões instaladas).
2. Apaga os arquivos de contexto:
   - no **VS Code**, os arquivos `.github/instructions/tds-vscode-*.instructions.md`;
   - no **Kiro**, os arquivos `.kiro/steering/advpl-tlpp-ls-first-*.md`, o arquivo `.kiro/skills/totvs-mcp-first/SKILL.md` (e a pasta, se ficar vazia) e a entrada `totvs-mcp` de `.kiro/settings/mcp.json`, junto com a decisão de liberar todas as ferramentas.
3. Refaz as perguntas de instruções e de _skill_, gravando a versão atual da extensão para quem responder **Sim**.
4. No **Kiro**, com o servidor em execução, grava de novo a entrada `totvs-mcp` (URL e _token_ atuais) e refaz a pergunta de liberação das ferramentas.

> **Atenção:** alterações feitas manualmente nas instruções, no _steering_ ou na _skill_ são perdidas. Se quiser preservá-las, copie os arquivos antes de executar o comando.

Use o comando quando:

- escolheu **Nunca** (ou **Perguntar a cada uso**, na liberação das ferramentas) e mudou de ideia;
- quer substituir as instruções, o _steering_ e a _skill_ pela versão da extensão, por exemplo após atualizá-la;
- apagou um dos arquivos e quer gravá-lo de novo;
- copiou ou clonou a área de trabalho e os arquivos de contexto não vieram junto;
- a entrada `totvs-mcp` do `mcp.json` ficou inválida ou desatualizada;
- está testando ou atualizando os modelos (_templates_) de instruções e _skill_.

### Configurações recomendadas

Para que o assistente de IA tenha o melhor contexto da área de trabalho, recomenda-se ajustar as seguintes configurações da extensão (chaves `totvsLanguageServer`):

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

## Ferramentas do _chat_ `@tds` (depreciado)

O participante de _chat_ `@tds` (ferramenta `TDS Tools` / `tds-lm-tools`) está **depreciado**, devido à descontinuação das _LM Tools_ por parte da _Microsoft_. Suas operações (`/compiler`, `/syntax-only`, `/validate-patch`, `/apply-patch` e `/help`) foram incorporadas ao **TOTVS MCP**, que as executa por meio de linguagem natural:

| `@tds`            | **TOTVS MCP**        |
| ----------------- | -------------------- |
| `/compiler`       | `tds_compile`        |
| `/syntax-only`    | `tds_syntax_only`    |
| `/validate-patch` | `tds_validate_patch` |
| `/apply-patch`    | `tds_apply_patch`    |
| `/help`           | `tds_help`           |
