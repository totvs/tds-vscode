# Inventario de Funcionalidades - tds-vscode

Este documento consolida as funcionalidades implementadas pela extensao com base no manifesto (package.json) e no ponto de ativacao (src/extension.ts).

## 1) Capacidades Nucleares

- Suporte de desenvolvimento Protheus/Logix com LSP e DAP.
- Edicao com sintaxe, snippets, formatacao, outline e semantic tokens.
- Compilacao de arquivo, workspace, editores abertos e chave de compilacao.
- Depuracao local (SmartClient), web e TDS Replay.
- Fluxos de patch: gerar, validar, inspecionar e aplicar.
- Operacoes de RPO: defrag, integridade, revalidacao, exclusao de fonte.
- View de servidores TOTVS com acoes contextuais.
- Webviews para monitor, RPO info, patch e timeline.
- Suporte a template apply, include e geracao de Web Service.
- Captura de logs e telemetria de uso.

## 2) Contribuicoes Declaradas no Manifesto

### 2.1 Linguagens

- advpl: .ch, .th, .prw, .prg, .prx, .ppx, .ppp, .tlpp, .ahu, .apl, .apw
- advpl-asp: .aph
- 4gl: .4gl, .per
- totvs_patch: .ptm, .upd, .pak
- totvs_template: .tpl

### 2.2 Gramaticas e Snippets

- 5 gramaticas TextMate (incluindo injecoes markdown/sql para AdvPL).
- 2 pacotes de snippets (AdvPL e 4GL).

### 2.3 Depuradores

- totvs_language_debug
- totvs_tdsreplay_debug
- totvs_language_web_debug

### 2.4 UI Contribuida

- 1 custom editor: tds.patchView para *.ptm.
- 1 views container (TOTVS) com 1 view (totvs_server).
- Menus:
  - explorer/context: 12 entradas
  - view/item/context: 27 entradas
  - view/title: 3 entradas
  - commandPalette: 18 entradas
- 4 keybindings de build/rebuild.
- 5 cores de terminal personalizadas.

### 2.5 Configuracoes

- 33 settings em contributes.configuration.properties.
- Cobrem: trace, autocomplete, hover, codelens, linter, cache de index, encoding, comportamento de compilacao, web args, reconexao, boas-vindas, RPO token e similares.

## 3) Mapa de Comandos (Manifesto)

Total declarado: 60 comandos.

### 3.1 Build e Formatar

- totvs-developer-studio.build.file
- totvs-developer-studio.rebuild.file
- totvs-developer-studio.build.workspace
- totvs-developer-studio.rebuild.workspace
- totvs-developer-studio.build.openEditors
- totvs-developer-studio.rebuild.openEditors
- totvs-developer-studio.show.result.build
- totvs-developer-studio.compile.key
- totvs-developer-studio.run.formatter

### 3.2 Debug

- totvs-developer-studio.getDAP
- totvs-developer-studio.getProgramName
- totvs-developer-studio.getProgramArguments
- totvs-developer-studio.configure.launcher
- totvs-developer-studio.tdsreplay.configure.launcher
- totvs-developer-studio.tdsreplay.webview.timeLine
- totvs-developer-studio.toggleTableSync

### 3.3 Patch

- totvs-developer-studio.patchGenerate.fromRPO
- totvs-developer-studio.patchGenerate.fromFolder
- totvs-developer-studio.patchGenerate.byDifference
- totvs-developer-studio.patchApply
- totvs-developer-studio.patchApply.fromFile
- totvs-developer-studio.patchInfos.fromFile
- totvs-developer-studio.patchValidate.fromFile

### 3.4 RPO e Inspecao

- totvs-developer-studio.defragRPO
- totvs-developer-studio.rpoCheckIntegrity
- totvs-developer-studio.revalidateRPO
- totvs-developer-studio.delete.file.fromRPO
- totvs-developer-studio.inspectorObjects
- totvs-developer-studio.inspectorFunctions
- totvs-developer-studio.open-loadrpoinfo-view

### 3.5 Servidores e Conexao

- totvs-developer-studio.add
- totvs-developer-studio.config
- totvs-developer-studio.connect
- totvs-developer-studio.reconnect
- totvs-developer-studio.disconnect
- totvs-developer-studio.serverSelection
- totvs-developer-studio.rename
- totvs-developer-studio.moveToRoot
- totvs-developer-studio.moveToGroup
- totvs-developer-studio.removeGroup
- totvs-developer-studio.delete
- totvs-developer-studio.delete.environment
- totvs-developer-studio.selectenv

### 3.6 Token, Usage e Utilitarios

- totvs-developer-studio.selectRpoToken
- totvs-developer-studio.selectRpoToken.enable
- totvs-developer-studio.selectRpoToken.disable
- totvs-developer-studio.inputRpoToken
- totvs-developer-studio.clearRpoToken
- totvs-developer-studio.toggleSaveLocation
- totvs-developer-studio.toggleUsageInfo
- totvs-developer-studio.detailUsageInfo
- totvs-developer-studio.logger.on
- totvs-developer-studio.logger.off
- totvs-developer-studio.welcomePage

### 3.7 Includes, WS, Template e Monitor

- totvs-developer-studio.include
- totvs-developer-studio.ws.show
- totvs-developer-studio.templateApply
- totvs-developer-studio.templateApply.fromFile
- tds-monitor.open-monitor-view
- advpl.freshenIndex

## 4) Registro em Runtime (src/extension.ts)

Registrados explicitamente no ponto de ativacao:

- build/rebuild e resultado de compilacao
- patch (gerar/aplicar/validar/inspecionar)
- include/ws/template
- monitor/rpo info
- selecao de servidor e operacoes de token
- compile key e launchers
- formatter
- logger e detailUsageInfo
- hooks registerXRef/registerWorkspace/registerDebug
- registro do custom editor PatchEditorProvider

Comandos declarados no manifesto que nao aparecem explicitamente em src/extension.ts tendem a ser registrados por outros modulos de infraestrutura da view de servidores (ex.: acoes de item/view), especialmente fluxo connect/reconnect/disconnect e manutencao de grupos.

## 5) Pontos de Atencao

- Diferenca de identificador observada entre tds.getDAP (registrado em runtime) e totvs-developer-studio.getDAP (declarado no manifesto), recomendando validacao de compatibilidade/legado.
- advpl.freshenIndex aparece no manifesto, mas o trecho de registro direto em src/extension.ts esta comentado; validar se o comando e fornecido por outro fluxo ou se esta inativo.

## 6) Referencias

- Manifesto: package.json
- Ativacao/runtime: src/extension.ts
- Visao funcional de alto nivel: README.md
