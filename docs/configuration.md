# Configurações

Este documento descreve todas as configurações da extensão **TDS-VSCode** com prefixo `totvsLanguageServer`.

As configurações podem ser alteradas em `File > Preferences > Settings` (atalho `Ctrl + ,`), filtrando por `totvsLanguageServer`, ou editando diretamente os arquivos `settings.json` (do usuário ou da área de trabalho).

## Índice de configurações

### Inicialização do Language Server

| Configuração                      | Tipo  | Padrão | Descrição                                                                          |
| --------------------------------- | ----- | ------ | ---------------------------------------------------------------------------------- |
| `totvsLanguageServer.launch.args` | array | `[]`   | Matriz contendo argumentos extras para passar ao binário do TOTVS Language Server. |

### Compilação de pastas (filtro de extensões)

| Configuração                                        | Tipo    | Padrão       | Descrição                                         |
| --------------------------------------------------- | ------- | ------------ | ------------------------------------------------- |
| `totvsLanguageServer.folder.enableExtensionsFilter` | boolean | `true`       | Compila apenas arquivos com extensões permitidas. |
| `totvsLanguageServer.folder.extensionsAllowed`      | array   | Lista abaixo | Extensões permitidas para compilar a lista.       |

Extensões permitidas padrão:

```
.PRW, .PRX, .PRG, .PPX, .PPP, .TLPP, .APW, .APH, .APL, .AHU,
.TRES, .PNG, .BMP, .RES, .4GL, .PER, .JS, .RPTDESIGN
```

### Rastreamento (trace)

| Configuração                       | Tipo   | Padrão | Descrição                                                                                          |
| ---------------------------------- | ------ | ------ | -------------------------------------------------------------------------------------------------- |
| `totvsLanguageServer.trace.server` | string | `off`  | Rastreia a comunicação entre o VS Code e o Language Server. Valores: `off`, `messages`, `verbose`. |
| `totvsLanguageServer.trace.debug`  | string | `off`  | Rastreia a comunicação entre o VS Code e o Debug Adapter. Valores: `off`, `messages`, `verbose`.   |

### Interface e notificações

| Configuração                              | Tipo    | Padrão | Descrição                                                 |
| ----------------------------------------- | ------- | ------ | --------------------------------------------------------- |
| `totvsLanguageServer.welcomePage`         | boolean | `true` | Mostrar página de boas-vindas na primeira inicialização.  |
| `totvsLanguageServer.askEncodingChange`   | boolean | `true` | Requisitar alteração na codificação para Windows-1252.    |
| `totvsLanguageServer.askCompileResult`    | boolean | `true` | Pedir para exibir tabela com resultados da compilação.    |
| `totvsLanguageServer.showBanner`          | boolean | `true` | Apresenta banner na inicialização.                        |
| `totvsLanguageServer.reconnectLastServer` | boolean | `true` | Reconectar ao último servidor conectado na inicialização. |

### Compilação

| Configuração                                               | Tipo    | Padrão  | Descrição                               |
| ---------------------------------------------------------- | ------- | ------- | --------------------------------------- |
| `totvsLanguageServer.clearConsoleBeforeCompile`            | boolean | `false` | Limpar o console antes da compilação.   |
| `totvsLanguageServer.showConsoleOnCompile`                 | boolean | `true`  | Exibir console na compilação.           |
| `totvsLanguageServer.compilation.generatePpoFile`          | boolean | `false` | Gera arquivo PPO.                       |
| `totvsLanguageServer.compilation.showPreCompiler`          | boolean | `false` | Mostrar comando pré-compilador.         |
| `totvsLanguageServer.compilation.commitWithErrorOrWarning` | boolean | `false` | Comitar a compilação com erros/alertas. |
| `totvsLanguageServer.compilation.tempDir`                  | string  | `""`    | Diretório temporário.                   |

### Depuração e execução Web

| Configuração                              | Tipo    | Padrão  | Descrição                                           |
| ----------------------------------------- | ------- | ------- | --------------------------------------------------- |
| `totvsLanguageServer.web-agent.agent`     | string  | `""`    | Executável do web-agent.                            |
| `totvsLanguageServer.web-agent.arguments` | array   | `[]`    | Argumentos extras do web-agent.                     |
| `totvsLanguageServer.web.navigator`       | string  | `""`    | Navegador da Web (depuração com SmartClientHtml).   |
| `totvsLanguageServer.web.arguments`       | array   | `[]`    | Argumentos para navegador web.                      |
| `totvsLanguageServer.web.open.external`   | boolean | `false` | Não mostrar aviso de abertura de navegador externo. |

### Editor

| Configuração                                   | Tipo    | Padrão                | Descrição                                                                                                                                    |
| ---------------------------------------------- | ------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `totvsLanguageServer.editor.show.notification` | string  | `none`                | Nível de notificação a ser exibido no 'pop-up'. Valores: `none`, `only errors`, `errors and warnings`, `errors warnings and infos`, `all`.   |
| `totvsLanguageServer.editor.autocomplete`      | string  | `LS`                  | Alterna o modo de preenchimento automático. Valores: `Off`, `Basic`, `LS`.                                                                   |
| `totvsLanguageServer.editor.hover`             | string  | `markDown`            | Controla como a apresentação é exibida ao passar o mouse. Valores: `off`, `plaintext`, `markDown` (usa PDoc se disponível).                  |
| `totvsLanguageServer.editor.signatureHelp`     | boolean | `true`                | Controla a ativação da ajuda de assinatura.                                                                                                  |
| `totvsLanguageServer.editor.codeLens`          | boolean | `true`                | Controla a ativação do CodeLens.                                                                                                             |
| `totvsLanguageServer.editor.linter.behavior`   | string  | `enableOnlyOpenFiles` | Habilitar o Linter. Valores: `enable` (todos os arquivos da área de trabalho), `enableOnlyOpenFiles` (apenas arquivos em edição), `disable`. |
| `totvsLanguageServer.editor.linter.includes`   | string  | `""`                  | Não edite. Pode ser sobrescrito.                                                                                                             |
| `totvsLanguageServer.editor.index.cache`       | string  | `off`                 | Persistência do cache de navegação. Valores: `off` (alguns recursos de DSS podem ficar indisponíveis), `onMemory`, `onDisk`.                 |

### Formatação

| Configuração                             | Tipo   | Padrão      | Descrição                                                          |
| ---------------------------------------- | ------ | ----------- | ------------------------------------------------------------------ |
| `totvsLanguageServer.formatter.provider` | string | `extension` | Provedor de formatação. Valores: `ls`, `extension` (experimental). |

### Sistema de arquivos

| Configuração                              | Tipo   | Padrão   | Descrição                                                                                      |
| ----------------------------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------- |
| `totvsLanguageServer.filesystem.encoding` | string | `cp1252` | Definir a codificação do sistema de arquivos. Valores: `cp1252`, `cp1251` (alfabeto cirílico). |

### Área de trabalho e telemetria

| Configuração                                | Tipo    | Padrão  | Descrição                                                        |
| ------------------------------------------- | ------- | ------- | ---------------------------------------------------------------- |
| `totvsLanguageServer.workspaceServerConfig` | boolean | `false` | Usa a área de trabalho para manter as configurações do servidor. |
| `totvsLanguageServer.usageInfoConfig`       | boolean | `false` | Alterna a indicação de uso (telemetria).                         |

## Exemplo com valores padrão

O bloco abaixo reproduz todas as configurações `totvsLanguageServer` com seus valores padrão. Copie para o seu `settings.json` e ajuste conforme necessário.

```json
{
  "totvsLanguageServer.launch.args": [],
  "totvsLanguageServer.folder.enableExtensionsFilter": true,
  "totvsLanguageServer.folder.extensionsAllowed": [
    ".PRW",
    ".PRX",
    ".PRG",
    ".PPX",
    ".PPP",
    ".TLPP",
    ".APW",
    ".APH",
    ".APL",
    ".AHU",
    ".TRES",
    ".PNG",
    ".BMP",
    ".RES",
    ".4GL",
    ".PER",
    ".JS",
    ".RPTDESIGN"
  ],
  "totvsLanguageServer.trace.server": "off",
  "totvsLanguageServer.trace.debug": "off",
  "totvsLanguageServer.welcomePage": true,
  "totvsLanguageServer.askEncodingChange": true,
  "totvsLanguageServer.askCompileResult": true,
  "totvsLanguageServer.clearConsoleBeforeCompile": false,
  "totvsLanguageServer.showConsoleOnCompile": true,
  "totvsLanguageServer.showBanner": true,
  "totvsLanguageServer.reconnectLastServer": true,
  "totvsLanguageServer.compilation.generatePpoFile": false,
  "totvsLanguageServer.compilation.showPreCompiler": false,
  "totvsLanguageServer.compilation.commitWithErrorOrWarning": false,
  "totvsLanguageServer.compilation.tempDir": "",
  "totvsLanguageServer.web-agent.agent": "",
  "totvsLanguageServer.web-agent.arguments": [],
  "totvsLanguageServer.web.navigator": "",
  "totvsLanguageServer.web.arguments": [],
  "totvsLanguageServer.web.open.external": false,
  "totvsLanguageServer.editor.show.notification": "none",
  "totvsLanguageServer.editor.autocomplete": "LS",
  "totvsLanguageServer.editor.hover": "markDown",
  "totvsLanguageServer.editor.signatureHelp": true,
  "totvsLanguageServer.editor.codeLens": true,
  "totvsLanguageServer.editor.linter.behavior": "enableOnlyOpenFiles",
  "totvsLanguageServer.editor.linter.includes": "",
  "totvsLanguageServer.editor.index.cache": "off",
  "totvsLanguageServer.formatter.provider": "extension",
  "totvsLanguageServer.filesystem.encoding": "cp1252",
  "totvsLanguageServer.workspaceServerConfig": false,
  "totvsLanguageServer.usageInfoConfig": false
}
```

## Combinações que alteram o comportamento

Determinadas combinações de configuração afetam o comportamento de processos e outras configurações.

### totvsLanguageServer.editor.linter.behavior

```json
{
  totvsLanguageServer.editor.linter.behavior=disable
}
```

Quando desabilitado o processo do Linter, processos dependentes do Linter, tais como `Outline`, navegação, `hover`, podem não responder como esperado.

```json
{
  totvsLanguageServer.editor.linter.behavior=enableOnlyOpenFiles
}
```

Quando em `enableOnlyOpenFiles` o processo do Linter será executado somente nos arquivos abertos para edição e processos dependentes do Linter, tais como `Outline`, navegação, `hover`, serão aplicados somente nesses arquivos.

### totvsLanguageServer.editor.index.cache

```json
{
  totvsLanguageServer.editor.index.cache=off
}
```

Quando desligado o cache da indexação de símbolos, processos dependentes da indexação, tais como `Outline`, navegação, `hover`, podem não responder como esperado.

Mesmo com o cache ligado (memória ou disco), aplica-se as restrições da chave `totvsLanguageServer.editor.index.cache`.
