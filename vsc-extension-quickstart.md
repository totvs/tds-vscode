# TOTVS Developer Studio para VSCode

[![Build Status](https://travis-ci.org/totvs/tds-vscode.svg?branch=master)](https://travis-ci.org/totvs/tds-vscode)

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-15-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

A extensão do **TOTVS Developer Studio for VS Code** disponibiliza uma suíte de desenvolvimento para o ecossistema **Protheus**.

Utilizando os protocolos de comunicação LSP (_Language Server Protocol_) e DAP (_Debug Adapter Protocol_), ambos amplamente utilizados e extensíveis à outras _IDEs_ de mercado, como Atom, Visual Studio, Eclipse, Eclipse Theia, Vim e Emacs.

> Lista de IDEs com suporte ao [LSP](https://microsoft.github.io/language-server-protocol/implementors/tools) e ao [DAP](https://microsoft.github.io/debug-adapter-protocol/implementors/tools).

## Funcionalidades

- Sintaxe destacada
- Comunicação baseada nos protocolos LSP/DAP
- [Console](docs/console.md) informativo e notificações
- [Edição](docs/edition.md) de arquivos fontes (AdvPL, TLPP, 4GL e variantes)
- [Compilação](docs/compilation.md) de fontes, pastas e da área de trabalho
- [Depuração](docs/debugger.md) e execução (Local e _WebApp_)
- [Geração](docs/build-patch.md) e [aplicação](docs/apply-patch.md) de pacotes de correção (_patchs_)
- [Manutenção](docs/rpo.md) do _RPO_
- [Inspeção](docs/rpo-inspector.md) do _RPO_
- [Geração de cliente de serviço web](docs/ws-client-generation.md) (_Web Service_)
- [Monitoramento](docs/monitor.md) de servidores

## Guia rápido

> **Nunca usei o VS-Code**: Recomendamos a leitura de:\
>
> - [User Interface](https://code.visualstudio.com/docs/getstarted/userinterface)\
> - [Multi-root Workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces)\
> - [Settings](https://code.visualstudio.com/docs/getstarted/settings)\
> - [Basic Edition](https://code.visualstudio.com/docs/editor/codebasics)\
> - [Marketpalce](https://code.visualstudio.com/docs/editor/extension-gallery)

Ao iniciar o **VS-Code** com a extensão **TDS-VSCode** instalada, abra (ou crie) a pasta principal que contém (ou conterá) seus arquivos fontes e de recursos. Essa pasta é denominada genericamente de `projeto`.

No primeiro uso da extensão em um projeto, lhe será apresentada as [Boas Vindas](docs/welcome.md) com configurações mínimas necessárias. Faça-as.

- Acione o icone da `TOTVS` na barra de atividades
- Resgistre o servidor de trabalho na visão (Servidores)[docs/servers.md], acionando a ação `+`
- (Conecte-se)[docs/servers.md] ao servidor recém registrado
- Após a conexão, acione na barra de atividades o icone do `Explorer`
- Abra (ou crie) o arquivo para edição e faça o desenvolvimento necessário
- (Compile)[docs/compilation.md] acionando o atalho `ctrl+F9` ou o menu de contexto sobre o arquivo ou recurso
- Corrija eventuais erros de compilação apresentados na visão `Problems`
- (Execute/depure)[docs/debugging.md] o `Smartclient` configurado na página de `Boas vindas` ou direto no arquivo `.vscode\launch.json`

> Para detalhes dos processos, acesse as ligações (_links_).\
> A visualização ou não das `Boas Vindas` pode ser efetuada em `File | Preferences | Settings | Extensions | TOTVS | Welcome Page`.

## Saiba mais em

> [TOTVS - Extensão de desenvolvimento para VSCode (TEC) - Parte 1](https://www.youtube.com/watch?v=MwIu01Ztfvg)\
> [TOTVS - Extensão de desenvolvimento para VSCode (TEC) - Parte 2](https://www.youtube.com/watch?v=Cz4N0XWCXHY)\
> [TOTVS - TDS-VSCode - Desenvolvimento colaborativo](https://www.youtube.com/watch?v=IGWh5ejxhHU)

### Acentuação e caracteres especiais

Tivemos reportes de problemas de encode abrindo fontes antes salvos no TDS, isso ocorre porque o encode original do VSCode é UTF8 e o do TDS é outro.
Para garantir a compilação é necessário compatibilizar o encode da seguinte maneira:

- No estado original o Fonte será mostrado desta maneira:<br/>
  ![Encoding 1](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding1.png)
- **Antes de editar/salvar qualquer fonte no VS** entre nas configurações do VS `Ctrl + ,`.
- No campo de busca digite `encode` e selecione `Windows1252` ou `Windows1253` se utilizar alfabero cirílico.<br/>
- Abra o fonte com o novo encode (reforçando que NÃO DEVE tê-lo salvo antes em UTF8)<br/>
  ![Encoding 3](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding3.png)
- Compile e/ou recompile o fonte e execute-o.<br/>
  ![Encoding 4](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding4.png)

Por padrão, o _TDS-VSCode_ já vem configurado para usar o encodin `WindowsCP1252`.

## Suporte

### Capturador de Logs

- Caso tenha problemas com a ferramenta e deseja suporte da equipe de desenvolvimento da extensão, inicie uma ferramenta de coleta de logs para auxiliar no suporte. Essa ferramenta colhe informações como versões de ferramentas e extensões, sistema operacional, versão do **VS-Code**, configuração de servidores e outras informações relevantes.

- Para ativar, acione o atalho `CTRL + SHIFT + P`, digite `TOTVS: On Logger Capture` e acione o comando. Nesse momento o capturador de log é iniciado.

- Reproduza a ocorrência e acione o atalho `CTRL + SHIFT + P`, digite `TOTVS: Off Logger Capture` ou na barra de status acione o _mouse_ sobre o texto `Capturando logs...`. O capturador será encerrado e um arquivo chamado `tdsSupport.zip` será gerado. Anexe este arquivo ao chamado.

![Logger](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Logger.gif)

### Desenvolvimento Colaborativo

- Se deseja contribuir com o desenvolvimento do plugin, acesse [Git Hub TDS-VSCODE](https://github.com/totvs/tds-vscode), faça seu commit que iremos analisar!

## Extensões recomendadas

- [Numbered Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.numbered-bookmarks)

  Permite uso de _bookmarks_ no estilo Delphi numerados de 1 a 9.

  ![Toggle](https://github.com/alefragnani/vscode-numbered-bookmarks/raw/master/images/numbered-bookmarks-toggle.png)
