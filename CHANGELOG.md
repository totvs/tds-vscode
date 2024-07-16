# Changelog [(Versão 1.*)](./CHANGELOG-V1.md)

## Versão [2.1.NEXT]

- A interface do **TDS-VSCode** passa a utilizar o tema definido no **VS-Code**.
  Isso permite que os usuários tenham a opção de escolher o tema que melhor lhe agrades. Em algumas interfaces, há campos que armazenam data e hora. Por padrão, o formato da deste é no idioma selecionado no **VS-Code**. Caso o idioma seja o inglês, o formato da data e números é apresentado no padrão americano (``mm/dd/yyyy hh:mm:ss AM/PM`` ou ``9,999.99``). Caso queira alterar o formato de apresentação, informe o idioma no qual deseja o formato em [totvsLanguageServer.formatLocale](./docs/settings.md#totvsLanguageServer.formatLocale)

- Documentação das configurações do **TDS-VSCode** em [Configurações](./docs/settings.md).

- Nova interface de [boas-vindas](./docs/welcome.md).

- Unificação das interfaces de configuração de depuração (_dekstop_, _webApp_ e _TDS-Replay_).

- Na definição do lançador do TDS-Replay, no lugar de informar um arquivo do TDS-Replay, pode colocar `"${command:SelectReplayFile}` em `tdsReplayFile`. Com isso, lhe será solicitado qual o arquivo a processar no momento que iniciar a execução do debug.

## Descontinuado

- Aplicação de _templates_

- Propriedade `totvsLanguageServer.askCompileResult` em favor de `totvsLanguageServer.showCompileResult` [(detalhes)](./docs/compilation.md#resultado-da-compilação)

- Propriedade `totvsLanguageServer.welcomePage` em favor da nova interface [(detalhes)](./docs/welcome.md)

## Versão [2.0.8]

### Correções

#### Não exibe informações do Json ao depurar [#1090](https://github.com/totvs/tds-vscode/issues/1090)

Implementado tratamento específico para objetos JSON com array no 1o nível.

## Versão [2.0.8]

### Melhorias

#### Abrir uma janela do navegador quando iniciar o debug do tipo `totvs_language_web_debug` [#1233](https://github.com/totvs/tds-vscode/issues/1233)

Foi adicionado a possibilidade de passar parâmetros para o navegador a ser utilizado na depuração do tipo [`totvs_language_web_debug`](./docs/debugger.md#totvs-language-web-debug-html).

### Correções

#### Ignorando chaves de permissões de acesso a ações de Monitor [#1238](https://github.com/totvs/tds-vscode/issues/1238)

As chaves "AllowMonitor" dentre outras de Monitor não estavam sendo consideradas corretamente.

#### Falha na visualização de informações de patch [#1237](https://github.com/totvs/tds-vscode/issues/1237)

Ao acionar o "Patch Info" de um patch que se encontra em um caminho com acentuação, ocorria a falha "File could not be copied to the server".

#### Classe no TL++ [#1234](https://github.com/totvs/tds-vscode/issues/1234)

Em estruturas sem a devida finalização, p.e. `class` e `end class`, poderia gerar lista de símbolos (visão _Outline_) incorreta e/ou gerar um erro no log.
Foi adicionado tratamento para esses blocos, de forma a evitar a ocorrência.

#### Validações chave TDS [#1238](https://github.com/totvs/tds-vscode/issues/1238)

Ajuste na validação das chaves TDS.

## Versão [2.0.7]

### Correções

#### Erro no _linter_ [#1224](https://github.com/totvs/tds-vscode/issues/1224)

Em determinadas estruturas, p.e. `class` sem identificador, poderia ocorrer _crash_ durante processos do _DSS_.

#### Problema na paginação do TDS Replay

Ao executar o TDS Replay, a paginação não estava funcionando corretamente.

## Versão [2.0.6]

### Correções

#### TDS Replay - Não exibe quantidade de linhas na linha do tempo [#1193](https://github.com/totvs/tds-vscode/issues/1193)

Correção no tratamento de linhas quando opção ``ignoreSourcesNotFound`` ativa.

#### Indexação DSS não respeitava configurações de cache

Mesmo com a configuração de cache desligada ocorria a indexação do DSS.

### Melhorias

#### Ignorar pasta durante compilação

Caso necessite ignorar uma pasta durante a compilação, adicione o arquivo ".tdscompileignore" na raiz desta pasta.

## Versão [2.0.5]

### Correções

#### Problemas não eram removidos ao fechar o editor

Ao fechar um fonte aberto no editor com "Problemas", os registros na aba de "Problemas" não estavam sendo removidos.

## Versão [2.0.4]

### Correções

#### Pending response rejected since connection got disposed Code: -32097 [#1190](https://github.com/totvs/tds-vscode/issues/1190)

Ocorria um erro ao compilar pasta/workspace com mais de 89 fontes.

#### Adição de configuração de pasta temporária

Adicionada uma configuração extra ("totvsLanguageServer.compilation.tempDir") que sobrescreve a pasta temporária padrão do SO, caso o usuário não queira alterar a pasta temporária existente. Esta pasta é utilizada durante a pré-compilação (appre) e pode causar erros em SO que sejam "case-sensitive" (Linux/MacOS).

### Melhorias

#### Fontes fora da área de trabalho

Os fontes abertos fora da área de trabalho, não são mais processados para fins da visão ``Estrutura (_Outline_)`` e funcionalidades providas pelo [``DSS``](./docs/dss.md) e [``linter```](./docs/linter.md).
Demais funcionalidades continuam funcionando normalmente.

> Fontes fora da área de trabalho receberá uma notificação na visão ``Problemas`` como uma informação.
![``Problema`` com informação de fora da área de trabalho](./docs/images/info-source-outside.png)

#### Depuração com variáveis do tipo _string_ (_character_)

Variáveis do tipo  _character_ (_string_), podem conter dados nos formatos CP1252/CP1251 ou UTF8, que podem ser diferenciadas pelo prefixo ``UTF8`` em seus valores nas visões ``Variables`` e ``Watches`` e ao passar o mouse sobre a variável. Também foi modificado a forma de apresentação.

Leia [Recursos Estendidos de Depuração](../docs/debugger.md#funcionalidades_estendidas_de_depuração) para maiores detalhes e como ativar/desativar.

## Versão [2.0.3]

### Correções

#### Montagem/apresentação de "Estrutura" (Outline) de fontes [#1192](https://github.com/totvs/tds-vscode/issues/1192)

Correção pontuais na montagem/apresentação de "Estrutura" (Outline).

#### Exibição de erro de C++ Runtime

Durante a indexação ocorria a exibição de erro de C++ Runtime em uma determinada circunstância.

#### Queda do LS durante edição

Durante a edição de um arquivo fora da área de trabalho corrente, ocorria a queda do LS.

#### Erro na inicialização do tds-vscode

A extensão do tds-vscode nem subia caso a versão do VS Code fosse menor que 1.73.0.

#### Queda durante depuração

Durante a depuração se existisse um 'watch' de tabela (por exemplo: "table:pcy") ocorria a queda na depuração.

### Melhoria

#### Uniformização de comandos de Recompile em primeiro plano

Ao acionar o menu de contexto os comandos de "Recompile" serão exibidos inicialmente, para exibir os comandos de "Compile" o acionamento da tecla modificadora SHIFT deve ser feito.

## Versão [2.0.2]

### Melhoria

#### Adicionado alerta na depuração utilizando SIGAMDI/SIGAADV

Caso o usuário inicie uma depuração utilizando SIGAMDI/SIGAADV, será exibido um alerta informando que na depuração é recomendada o uso direto dos módulos, por exemplo SIGAFAT.

## Versão [2.0.1]

### Melhoria

#### Comando ``BeginContent`` passa a aceitar o tipo de conteúdo

```code
beginContent var myVar [as <language: javascript | JS | html | json | xml | css | typeScript | TS>]
```

Essa informação é utilizada apenas para fins visuais não sendo efetuado nenhum tipo de validação.

#### Comandos ``BeginSql`` e ``EndSql``

Ao utilizar o bloco de comandos ``BeginSql`` e ``EndSql``, o seu conteúdo será apresentado usando as configurações de destaque de sintaxe da linguagem SQL.
Esse destaque é utilizada apenas para fins visuais não sendo afetado a funcionalidade do bloco.

#### Filtro na Linha de Tempo do TDS Replay [#DTCLIENT01-2533](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-2533)

Foi implementado opção de [filtro nos fontes](https://github.com/totvs/tds-vscode/wiki/TDS-Replay#filtro-de-fontes-na-linha-do-tempo) que serão apresentados na Linha de Tempo.

### Correções

#### Erro na inicialização do language server com MACOS #1173

A inicialização do `DSS` falhava (permissão) em sistemas MacOS, com erro:

```code
 (7.391s) [languageServer ] dbcode_manager.cpp:544 | Binary file error. Error: [/Users/XXXXXXXXXX/gitfolder/ma3-tmp/ma3/.vscode/.advpl/_binary_functions.prw] Permission denied
```

#### DSS: Corrigido processo de renomear e remover fontes

Em determinadas circunstâncias, ao renomear ou remover fontes, os processos podiam deixar resíduos no cache, causando duplicidade de informação ou não ser finalizados, requerendo acionar a ação ``Cancelar`` no diálogo de notificação.

## Versão [2.0.0]

> Interoperabilidade entre sistemas operacionais
>
> Para garantir a interoperabilidade das áreas de trabalho entre os sistemas operacionais suportados pelo **TDS-VSCode** e seus componentes, recomenda-se que pastas e arquivos não contenham caracteres especiais (exceto hífen e sublinhado) ou acentuados e sempre em minúsculas.
>
> Leia [Convenção para nomenclatura de _File System_ em ambiente Linux](<https://tdn.totvs.com/x/h8BICw>).

### Melhorias

#### Assistente de assinatura de funções

Adicionado assistente de assinatura de funções (_SignatureHelp_).

#### Informações sobre uso e outras informações

BETA: Adicionado informações sobre o uso de funções (_CodeLens_).

#### Implementação de configuração para ignorar pastas e arquivos

Efetuado a implementação de configuração para a extensão ignorar pastas e arquivos no processo de _Navegação em fontes_ e recursos associados, através da existência do arquivo `.tdsignore`.

Detalhes da implementação em [# TDS: Developer Support Subsystem](docs/dss.md#ignorar-pastas-e-arquivos).

#### Navegação em fontes, passagem de mouse e referências

Efetuado a implementação de navegação em fontes, passagem de mouse e referências.
Detalhes da implementação em [TDS: Developer Support Subsystem](docs/dss.md).

> Os recursos aqui apresentados, podem ser influenciados devido ao _linter_ ignorar o processamento de fontes configurado em [TDS: Linter -> Ignorar pastas e arquivos](docs/linter.md#tdsignore).
> As informações sobre navegação, podem ou não ficar em [_cache_](docs/dss.md#cache).

#### Visão _Estrutura_

Apresenta alguns detalhes sobre o item de acordo com sua definição.

#### Navegação em classes quando usado ``self`` e ``_Super``

- Adicionado tratamento há herança de classe (``_Super``,  ``from``, ``inherited`` e ``of``)
- Unificado tratamento de ``::`` e ``self``
