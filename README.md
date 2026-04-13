C:\Users\acandido\.vscode\extensions\totvs.tds-vscode-2.0.16\node_modules\@totvs\tds-ls\bin\windows\

# TOTVS Developer Studio para VSCode

<!--[![GitHub stars](https://img.shields.io/github/stars/totvs/tds-vscode?style=plastic)](https://github.com/totvs/tds-vscode/stargazers)
![GitHub top language](https://img.shields.io/github/languages/top/totvs/tds-vscode)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/totvs/tds-vscode/Deploy%20Extension)
![GitHub last commit](https://img.shields.io/github/last-commit/totvs/tds-vscode)
-->
<!-- prettier-ignore-start -->
[![GitHub license](https://img.shields.io/github/license/totvs/tds-vscode?style=plastic)](https://github.com/totvs/tds-vscode/blob/master/LICENSE)
![Version](https://img.shields.io/visual-studio-marketplace/v/TOTVS.tds-vscode)
![Installs](https://img.shields.io/visual-studio-marketplace/i/TOTVS.tds-vscode)
![Downloads](https://img.shields.io/visual-studio-marketplace/d/TOTVS.tds-vscode)
![Rating](https://img.shields.io/visual-studio-marketplace/stars/TOTVS.tds-vscode)
[![GitHub issues](https://img.shields.io/github/issues/totvs/tds-vscode?style=plastic)](https://github.com/totvs/tds-vscode/issues)
[![GitHub forks](https://img.shields.io/github/forks/totvs/tds-vscode?style=plastic)](https://github.com/totvs/tds-vscode/network)
![Visual Studio Marketplace Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/TOTVS.tds-vscode)
<!-- markdownlint-disable -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-16-orange.svg)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- markdownlint-enabled -->
<!-- prettier-ignore-end -->

A extensão do **TOTVS Developer Studio for VS Code** disponibiliza uma suíte de desenvolvimento para o ecossistema **Protheus/Logix**.

Utilizando os protocolos de comunicação LSP (_Language Server Protocol_) e DAP (_Debug Adapter Protocol_), ambos amplamente utilizados e extensíveis à outras _IDEs_ de mercado, como Atom, Visual Studio, Eclipse, Eclipse Theia, Vim e Emacs.

> Lista de IDEs com suporte ao [LSP](https://microsoft.github.io/language-server-protocol/implementors/tools) e ao [DAP](https://microsoft.github.io/debug-adapter-protocol/implementors/tools).

> A extensão **TDS-VSCode** somente é suportada por S.O. de 64 bits.

## Funcionalidades

- Sintaxe destacada
- Comunicação baseada nos protocolos LSP/DAP
- [Linter](docs/linter.md) para análise de código estático
- [Console](docs/console.md) informativo e notificações
- [Edição](docs/edition.md), [Formatação](docs/formatter/format_config.md) e [Navegação](docs/dss.md) de arquivos fontes (AdvPL, TLPP, 4GL e variantes)
- [Compilação](docs/compilation.md) de fontes, pastas e da área de trabalho
- [Depuração](docs/debugger.md) e execução (Local e _WebApp_)
- [TDS Replay](https://github.com/totvs/tds-vscode/wiki/TDS-Replay) - Depuração de execução pré-gravada.
- [Geração](docs/build-patch.md) e [aplicação](docs/apply-patch.md) de pacotes de atualizações (_patches_)
- [Manutenção](docs/rpo.md) do _RPO_
- [Inspeção](docs/rpo-inspector.md) do _RPO_
- [Geração de cliente de serviço web](docs/ws-client-generation.md) (_Web Service_)
- [Monitoramento](docs/monitor.md) de servidores
- [RPO Seguro](docs/rpo.md#Token_de_RPO)
- [TDS-Cli](https://github.com/totvs/tds-ls/blob/master/TDS-CLi.md) compilação por linha de comando. Da mesma forma que o Eclipse, essa extensão do VSCode possui uma ferramenta de compilação em linha de comando.
- [Navegação em código](docs/dss.md)
- [API](docs/api.md)

## SOBRE O USO DE CHAVES E TOKENS DE COMPILAÇÃO

As chaves de compilação ou _tokens_ de compilação empregados na construção do _Protheus/Logix_ e suas funcionalidades, são de uso restrito dos _desenvolvedores_ de cada módulo.

> Em caso de mau uso destas chaves ou tokens, por qualquer _outra parte_, que não a referida acima, a mesma irá se responsabilizar, direta ou regressivamente, única e exclusivamente, por todos os prejuízos, perdas, danos, indenizações, multas, condenações judiciais, arbitrais e administrativas e quaisquer outras despesas relacionadas ao mau uso, causados tanto à TOTVS quanto a terceiros, eximindo a TOTVS de toda e qualquer responsabilidade.

## Interoperabilidade entre sistemas operacionais

Para melhor interoperabilidade do ecosistema **Protheus** (áreas de trabalho, _smartClient_, _appServer_ e demais componentes) entre os sistemas operacionais suportados pelo **TDS-VSCode** e seus componentes, recomenda-se **veementemente** que pastas e arquivos não contenham caracteres especiais e/ou acentuados e sempre em mínusculas.

> Leia [Convenção para nomenclatura de _File System_ em ambiente _Linux_](https://tdn.totvs.com/x/h8BICw).

## Guia rápido

> O **VS Code** pode apresentar problemas em suas funcionalidades em sistemas operacionais da linha **Windows Server**.
> Veja os requisitos para uso do **VS Code** em [Requirements](https://code.visualstudio.com/docs/supporting/requirements).

> **Nunca usei o VS Code**: Recomendamos a leitura de:
> - [User Interface](https://code.visualstudio.com/docs/getstarted/userinterface)
> - [Multi-root Workspaces](https://code.visualstudio.com/docs/editor/multi-root-workspaces)
> - [Settings](https://code.visualstudio.com/docs/getstarted/settings)
> - [Basic Edition](https://code.visualstudio.com/docs/editor/codebasics)
> - [Marketplace](https://code.visualstudio.com/docs/editor/extension-gallery)

Ao iniciar o **VS Code** com a extensão **TDS-VSCode** instalada, abra (ou crie) a pasta principal que contém (ou conterá) seus arquivos fontes e de recursos. Essa pasta é denominada genericamente de `projeto`.

No primeiro uso da extensão em um projeto, lhe será apresentada as [Boas Vindas](docs/welcome.md) com configurações mínimas necessárias. Faça-as.

- Acione o ícone da `TOTVS` na barra de atividades
- Registre o servidor de trabalho na visão (Servidores)[docs/servers.md], acionando a ação `+`
- (Conecte-se)[docs/servers.md] ao servidor recém registrado
- Após a conexão, acione na barra de atividades o ícone do `Explorer`
- Abra (ou crie) o arquivo para edição e faça o desenvolvimento necessário
- (Compile)[docs/compilation.md] acionando o atalho `ctrl+F9` ou o menu de contexto sobre o arquivo ou recurso
- Corrija eventuais erros de compilação apresentados na visão `Problems`
- (Execute/depure)[docs/debugging.md] o `Smartclient` configurado na página de `Boas vindas` ou direto no arquivo `.vscode\launch.json`

> Para detalhes dos processos, acesse as ligações (_links_).\
> A visualização ou não das `Boas Vindas` pode ser efetuada em `File | Preferences | Settings | Extensions | TOTVS | Welcome Page`.

## Saiba mais em

> [TOTVS - Extensão de desenvolvimento para VSCode (TEC) - Parte 1](https://www.youtube.com/watch?v=MwIu01Ztfvg)\
> [TOTVS - Extensão de desenvolvimento para VSCode (TEC) - Parte 2](https://www.youtube.com/watch?v=Cz4N0XWCXHY)\
> [TOTVS - TDS-VSCode - Desenvolvimento colaborativo (TEC)](https://www.youtube.com/watch?v=IGWh5ejxhHU)

### Acentuação e caracteres especiais nos códigos fontes

Tivemos notificações de problemas de _encode_ abrindo fontes antes salvos no *TDS*, isso ocorre porque o _encode_ original do VSCode é UTF8 e o do **TDS-VSCode** é outro.
Para garantir a compilação é necessário compatibilizar o _encode_ da seguinte maneira:

- No estado original o fonte será mostrado desta maneira:<br/>
  ![Encoding 1](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding1.png)
- **Antes de editar/salvar qualquer fonte no VS-Code** entre nas configurações (`Ctrl + ,`).
- No campo de busca digite `_encode_` e selecione `Windows1252` ou `Windows1251`, se utilizar alfabeto cirílico.
- Abra o fonte com o novo _encode_ (reforçando que NÃO DEVE tê-lo salvo antes em UTF8)<br/>
  ![Encoding 3](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding3.png)
- Compile e/ou recompile o fonte e execute-o.<br/>
  ![Encoding 4](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding4.png)

Por padrão, o _TDS-VSCode_ já vem configurado para usar o _encode_ `Windows1252 (cp1252)`.

### Desenvolvimento Colaborativo

- Se deseja contribuir com o desenvolvimento do plugin, acesse [Git Hub TDS-VSCODE](https://github.com/totvs/tds-vscode), faça seu commit que iremos analisar!

## Extensões recomendadas

- [Numbered Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.numbered-boomarks)

  Permite uso de _bookmarks_ no estilo Delphi numerados de 1 a 9.

  ![Toggle](https://github.com/alefragnani/vscode-numbered-bookmarks/raw/master/images/numbered-bookmarks-toggle.png)

- [Protheus.DOC](https://github.com/totvs/tds-vscode)

  Suporte aos recursos e snippets de documentação TOTVS ProtheusDoc para VsCode.

  ![Protheus.DOC](https://github.com/totvs/tds-vscode/raw/master/images/Example3.gif)

## Extensões com incompatibilidade

As extensões abaixo não devem ser utilizadas junto com o _TDS-VS-Code_ porque podem causar mal funcionamento.

- [4gl Outline Dxc](https://www.vsixhub.com/vsix/14295/)
- [advpl-vscode](https://github.com/totvs/advpl-vscode)
- flutter e dart

> Caso você perceba que alguma outra extensão de terceiros está interferindo no _TDS for VS-Code_, favor abrir um [chamado](https://github.com/totvs/tds-vscode/issues) informando detalhes da extensão e o problema causado.

## Suporte

### Capturador de Logs

Caso tenha problemas com a ferramenta e deseja suporte da equipe de desenvolvimento da extensão, inicie uma ferramenta de coleta de _logs_ para auxiliar no suporte. Essa ferramenta colhe informações como versões de ferramentas e extensões, sistema operacional, configuração de servidores e etc.

- Para ativá-la, selecione pelo atalho `CTRL + SHIFT + P`, digite `TOTVS: On Logger Capture`. Nesse momento o capturador de _log_ será iniciado.

- Reproduza o problema e selecione a opção `CTRL + SHIFT + P` digite `TOTVS: Off Logger Capture` ou na Barra inferior clique sobre o texto `Capturando logs...`. O capturador será encerrado e um arquivo chamado `tdsSupport.zip` será gerado. Anexe esse arquivo ao chamado.

![Logger](https://raw.githubusercontent.com/totvs/tds-vscode/master/docs/gifs/Logger.gif)

## Resolução de problemas

Alguns problemas conhecidos e como resolvê-los.

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
| Ocorrência                                        | Solução                   |
| ----------------------- | ----------------------- |
| *Aplicação de pacotes de atualização (_patches_)* | |
Servidores `Lobo Guara`, versão igual ou anterior a `19.3.0.5`, podem apresentar mensagem de erro no processo de validação e mesmo assim aplicá-lo. | Atualizar o servidor para a versão mais recente. |
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

Se não conseguir resolvê-los, abra um [chamado](https://github.com/totvs/tds-vscode/issues/new/choose) com o maior número de informações possíveis e inclua os _logs_ gerados conforme instruído em [TROUBLESHOOTING](https://github.com/totvs/tds-vscode/blob/master/TROUBLESHOOTING.md).

## Melhorias

Se você sentiu a falta de alguma funcionalidade deixe sua idéia [registrada](https://github.com/totvs/tds-vscode/issues/new?assignees=&labels=&template=feature_request.md&title=).
Ou se preferir colabore conosco e faça você mesmo. Veja como colaborar a seguir.

## Desenvolvimento Colaborativo

Para contribuir com o desenvolvimento da extensão, acesse [Git Hub TDS-VSCODE](https://github.com/totvs/tds-vscode), faça um _fork_ do projeto, crie um chamado "_Pull Request_" que iremos analisar!

> [TOTVS - TDS-VSCode - Desenvolvimento colaborativo](https://www.youtube.com/watch?v=IGWh5ejxhHU)<br/>

## Mantenedor

<table>
  <tr>
    <td align="center"><a href="https://twitter.com/TOTVSDevelopers"><img src="https://avatars2.githubusercontent.com/u/20243897?v=4?s=100" width="100px;" alt=""/><br /><sub><b>TOTVS S.A.</b></sub></a><br /><a href="#maintenance-totvs" title="Maintenance">🚧</a> <a href="#plugin-totvs" title="Plugin/utility libraries">🔌</a> <a href="#projectManagement-totvs" title="Project Management">📆</a></td>
    </tr>
</table>

## Colaboradores

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/brodao2"><img src="https://avatars0.githubusercontent.com/u/949914?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Alan Cândido</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=brodao2" title="Code">💻</a> <a href="https://github.com/totvs/tds-vscode/commits?author=brodao2" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/lwtnb-wrk"><img src="https://avatars1.githubusercontent.com/u/49563478?v=4?s=50" width="50px;" alt=""/><br /><sub><b>lwtnb-wrk</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=lwtnb-wrk" title="Code">💻</a> <a href="https://github.com/totvs/tds-vscode/commits?author=lwtnb-wrk" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/DanielYampolschi"><img src="https://avatars1.githubusercontent.com/u/10711513?v=4?s=50" width="50px;" alt=""/><br /><sub><b>DanielYampolschi</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=DanielYampolschi" title="Code">💻</a> <a href="https://github.com/totvs/tds-vscode/commits?author=DanielYampolschi" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/matheus-sales"><img src="https://avatars2.githubusercontent.com/u/11618741?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Matheus Sales</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=matheus-sales" title="Code">💻</a> <a href="https://github.com/totvs/tds-vscode/commits?author=matheus-sales" title="Documentation">📖</a></td>
    <td align="center"><a href="http://youtube.com/user/MansanoRicardo"><img src="https://avatars1.githubusercontent.com/u/33813921?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Mansano</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=ricardomansano" title="Code">💻</a> <a href="https://github.com/totvs/tds-vscode/commits?author=ricardomansano" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/acacioegas"><img src="https://avatars0.githubusercontent.com/u/369099?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Acacio Egas</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=acacioegas" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/danielbolognani"><img src="https://avatars1.githubusercontent.com/u/25229827?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Daniel Otto Bolognani</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=danielbolognani" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/leowww"><img src="https://avatars0.githubusercontent.com/u/4183539?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Leo Watanabe</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=leowww" title="Code">💻</a> <a href="https://github.com/totvs/tds-vscode/commits?author=leowww" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/rogeriorc"><img src="https://avatars1.githubusercontent.com/u/2599798?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Rogério Ribeiro da Cruz</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=rogeriorc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/robsonwilliam"><img src="https://avatars3.githubusercontent.com/u/11349311?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Robson William</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=robsonwilliam" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/caiadofelipe"><img src="https://avatars3.githubusercontent.com/u/49681823?v=4?s=50" width="50px;" alt=""/><br /><sub><b>FELIPE CAIADO ALMEIDA</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/issues?q=author%3Acaiadofelipe" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/isaquerochak"><img src="https://avatars0.githubusercontent.com/u/19375217?v=4?s=50" width="50px;" alt=""/><br /><sub><b>isaquerochak</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/issues?q=author%3Aisaquerochak" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/rodrigopg"><img src="https://avatars0.githubusercontent.com/u/5282959?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Rodrigo Gonçalves</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/issues?q=author%3Arodrigopg" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.linkedin.com/in/ramorais/"><img src="https://avatars0.githubusercontent.com/u/9218184?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Rogério A. Morais</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=ramorais" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/alexmmartins"><img src="https://avatars0.githubusercontent.com/u/24897997?v=4?s=50" width="50px;" alt=""/><br /><sub><b>alexmmartins</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=alexmmartins" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/bigois"><img src="https://avatars2.githubusercontent.com/u/22408258?v=4?s=50" width="50px;" alt=""/><br /><sub><b>Guilherme Bigois</b></sub></a><br /><a href="https://github.com/totvs/tds-vscode/commits?author=bigois" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
