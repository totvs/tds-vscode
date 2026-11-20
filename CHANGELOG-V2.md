# Changelog (versões 2.x)

Histórico das versões 2.x da extensão. As versões mais recentes estão em [CHANGELOG.md](CHANGELOG.md).

## Versão [2.1.6]

### Melhorias

#### Motor de formatação LS

Funcionalidade _experimental_, para ativá-la ajuste em `settings.json` a chave:

```json
{
  "totvsLanguageServer.formatter.provider": "ls"
}
```

#### Formatação de código AdvPL e 4GL

Processo aprimorado com adição de opções para formatação mais refinada de códigos AdvPL e 4GL. [Detalhes em TDS: Formatação de Código Fonte](./docs/formatter/format_config.md).

#### Configurações

Adicionada documentação de todas as configurações da extensão (chaves `totvsLanguageServer`), com tipo, valor padrão, descrição e exemplo com valores padrão. [Detalhes em TDS: Configurações](./docs/configuration.md).

> Existe algumas combinações de configuração que modifica o comportamento de processos e mesmo outras configurações. [Detalhes](./docs/configuration.md#combinações-que-alteram-o-comportamento).

Melhorado o tratamento de valores inválidos nas configurações. Quando for detectado algum erro de validação, será emitido uma mensagem no console do LS.

## Versão [2.1.5]

### Melhorias

Adicionado configuração de `steering` para o Kiro.

### Correções

#### Textos IA

Correção em mensagens que citam "Copilot".

## Versão [2.1.4]

### Correções

#### Falha de conexão na depuração da release 12.1.2610

Corrigida falha de conexão na depuração da release 12.1.2610.

## Versão [2.1.3]

### Correções

#### Falha de conexão na release 12.1.2610 [#1506](https://github.com/totvs/tds-vscode/issues/1506)

Corrigida falha de conexão na release 12.1.2610.

#### Crash com arquivos read-only [#1505](https://github.com/totvs/tds-vscode/issues/1505)

Corrigida falha que ocasionava crash em workspaces contendo arquivos read-only.

#### Como desabilitar que TDS VScode mostre resumo dos fontes no patch validate [#1479](https://github.com/totvs/tds-vscode/issues/1479)

Em vez de abrir um editor contendo o log com os fontes desatualizados, um arquivo será gerado na raiz do projeto.

## Versão [2.1.2]

### Novidades

#### Pastas de buscas de arquivos de definição por área de trabalho

Implementado a possibilidade de complementar a lista de pastas de buscas de arquivos de definição. Na pasta principal da área de trabalho, crie o arquivo `.include`, onde cada linha é uma especificação de pasta para busca de arquivos de definição.

As pastas especificadas tem prioridade sobre a lista por servidor/global e usam o padrão `glob` e sempre relativas a pasta principal (_workspace_).

Exemplo:

```console
/include
/folder/include
/**/include_dev
#/commented/will be/ignored
```

#### Integração da extensão com o Copilot

A integração do TDS-Code com o Copilot é utilizada para ajudar a IA a compreender melhor sua área de trabalho, tornando-a mais assertiva e rápida em questões relacionadas aos seus fontes.

Recomenda-se o uso do VSCode versão 1.107.1 (11/2025) ou superior. Em versões anteriores, é obrigatório a instalação das extensões:

- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat)

Em qualquer versão do VSCode, instale também a extensão:

- [Language Server tools for Copilot](https://marketplace.visualstudio.com/items?itemName=sehejjain.lsp-mcp-bridge)

#### Integração da extensão com o Kiro

A integração do TDS-Code com o Kiro é utilizada para ajudar a IA a compreender melhor sua área de trabalho, tornando-a mais assertiva e rápida em questões relacionadas aos seus fontes.

Recomenda-se o uso do Kiro versão ???? (??/????) ou superior.

Em qualquer versão do Kiro, instale também a extensão:

- [Kiro LSP MCP](https://open-vsx.org/extension/Rapdog/kiro-lsp-mcp)

#### Melhoria na integração com o Copilot

Implementado ferramenta `@tds` que permitir executar operações direto no `chat`.

- compile: compila o fonte no editor ativo ou o informado.
- recompile: recompila o fonte no editor ativo ou o informado.
- syntax-only: verifica a sintaxe (_linter_) do fonte no editor ativo ou o informado.

#### Renomear elementos

Adicionado suporte ao comando de renomeação de elementos, permitindo alterar identificadores com atualização consistente das ocorrências relacionadas no código.

#### Navegação de elementos

Adicionado suporte aos comandos de navegação, permitindo acessar rapidamente a definição concreta de métodos e símbolos no código.

#### Busca de símbolos no espaço de trabalho (_Workspace symbol_, `Ctrl+T`)

Permite a busca por símbolos, tais como:

- Funções
- Classes
- Métodos
- Propriedades
- _Namespaces_
- Variáveis de escopo não local

### Melhorias

#### No DSS

- Uso de memória
  Corrigido "vazamento de memória" (_memory leak_) e violações (_access violation_).

- Suporte de TLPP
  Melhora do suporte a elementos de TLPP

## Versão [2.0.16]

### Correções

#### The TOTVS Language Server server crashed [#1429](https://github.com/totvs/tds-vscode/issues/1429)

Criado mecanismo para interceptar "crash" ocasionado por fontes "problemáticos" durante a execução do Linter.

### Melhoria

#### Sugestão de verificação da chave BuildKillUsers ao ocorrer erro COMPILEERROR-300

Adição de mensagem quando ocorrer falha na obtenção de acesso exclusivo do RPO.

> **Verify that you have the setting (BuildKillUsers = 1) defined in the [General] section of your AppServer.ini file**

## Versão [2.0.15]

### Correções

#### Erro de linter no MacOS [#1388](https://github.com/totvs/tds-vscode/issues/1388)

Erros diversos no Linter que ocorriam apenas no Mac.

#### C2090 File not Found std.ch [#1389](https://github.com/totvs/tds-vscode/issues/1389)

Qualquer fonte aberto no Mac indicava o erro "C2090 File not Found std.ch" no Linter.

#### Importação de TReplay não conclui

Correção de um bug no processo de importação que causava a interrupção do processo antes de abrir as timelines.

#### Erro de Inspetor de Função no AppServer Harpia (Logix)

Ocorria falha na abertura do Inspetor de Funções em AppServer Harpia (Logix).

#### O Debug não parava na próxima linha (F10 next)

Em depurações multi-thread caso ocorresse uma ação interna em um fonte padrão, o debug não parava na próxima linha.

### Melhoria

#### Exibição de informação adicional na validação de patch desatualizados

Ao validar um patch que já esteja desatualizado em relação ao RPO era exibida a mensagem "Resources in patch older than RPO", mas não informava quais arquivos estavam desatualizado. Agora uma nova aba com essas informações é exibida e pode ser salva e/ou manipulada pelo usuário.

#### Adição de configuração opcional para depuração via launch do web-agent

Caso informado um caminho válido de um web-agent, ou exista um web-agent no caminho padrão de instalação, a depuração será iniciada através do launch do web-agent.

## Versão [2.0.13]

### Correções

#### Queda do tds-vscode no Mac Tahoe [#1367](https://github.com/totvs/tds-vscode/issues/1367)

Correção do erro no Linter que acometia apenas a versão atualizada do MacOS Tahoe.

#### Debug Assertion Failed [#1369](https://github.com/totvs/tds-vscode/issues/1369)

Durante edição de fontes com combinações de caracteres de encodings incompatíveis com CP1252 ocorria erro de "Debug Assertion Failed".

### Melhoria

#### Remoção de ação para abrir Monitor revertida

Porém agora apenas abrimos o WebMonitor externamente. O Monitor 'embedded' foi substituido pela integração externa com o WebMonitor.

## Versão [2.0.12]

### Correções

#### Debug travando appserver onde a cada erro o serviço precisa ser reiniciado [DTCLIENT01-5562](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-5562)

Ajustado o comportamento quando solicitado "Parada (_Stop_) da depuração enquando há uma janela (_Dialog_) AdvPL.

#### Problema ao debugar propriedades que sejam array de Json [#1274](https://github.com/totvs/tds-vscode/issues/1274)

Adicionado tratamento de propriedades do tipo JSon, com conteúdo _array_.

#### \[LINTER] - Problema com fontes que no seu path tem acentuação [#1263](https://github.com/totvs/tds-vscode/issues/1263)

Adicionado tratamento para correto tratamento de caminhos com acentuação (MacOS e Linux).

#### Debugger retorna NIL ao inspecionar propriedades com :: no AdvPL [#1352](https://github.com/totvs/tds-vscode/issues/1352)

Ajustado o tratamento de :: como sendo equivalente ao :self durante a depuração.

### Melhoria

#### Uso do navegador padrão para depuração Web [DTCLIENT01-5330](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-5330)

Caso `totvsLanguageServer.web.navigator` não tenha sido configurado o depurador será utilizado o navegador padrão do sistema operacional para depuração Web (executor `totvs_language_web_debug`).

Caso seja informado `totvsLanguageServer.web.arguments`, a especificação do navegador web a ser utilizado é obrigatória.

#### Seleção de navegador Web para depuração [DTCLIENT01-5236](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-5236)

Caso as chaves `webNavigator` e/ou `web.arguments` sejam informadas no executor da depuração, estas se sobreporão ao definido em `totvsLanguageServer.web.navigator` e `totvsLanguageServer.web.arguments` respectivamente.

> **Linux:** Antes de utilizar, verifique se `xdg-open` está instalado.
>
> **Mac/OS:** O navegador padrão configurado não pode ser o Safari.

#### Importação de lista de fontes para geração de pacotes de atualização (_patch_) [#1229](https://github.com/totvs/tds-vscode/issues/1229)

Adicionado processo de importação de lista de fontes para geração de pacotes de atualização (_patch_).
O arquivo é no formato TXT, onde cada linha é um arquivo (fonte ou recurso).

## Versão [2.0.11]

### Correções

#### Montagem de URL no Debug [#1288](https://github.com/totvs/tds-vscode/issues/1288)

Ao montar a URL para o Debug, o protocolo http/https era adicionado duplicado se o AppServer já estiver com o protocolo no endereço, o que gerava erro na depuração.

#### Geração de WS não está funcionando

Ao tentar gerar um WS, o tds-vscode não está gerando o arquivo corretamente.

#### Inclusão de arquivos e diretórios falhando no Linux/Mac

No Linux a seleção de arquivos e diretórios falhava devido a falta de uma '/' no início dos paths.

#### Patch validation in progress [#1290](https://github.com/totvs/tds-vscode/issues/1290)

Após a validação do patch a ação de aplicar o patch não estava sendo liberada.

## Versão [2.0.10]

### Correções

#### Aplicação de pacote de atualização(_patchs_) e outros (#1283 e outros)

A versão **1.95** do **VS-Code**, gerou efeitos colaterais em todos os processos que envolvam seleção de arquivo/diretório. Os processos foram revisados de forma a atender essa necessidade.

#### Mac Sequoia: apresenta erro `SIGSEGV` (#1270)

Ao abrir um fonte em um Mac Sequoia, era apresentado um erro (`SIGSEGV`) e não é mais possível usar as funcionalidades nesse SO. Ocorrência corrigida no no Servidor de Linguagem, o qual causava o referido erro.

### Depreciado

#### Propriedade `SmartClientURL`

Em executores de depuração web (`totvs_language_web_debug`), a propriedade `smartClientURL` foi depreciada e deve ser removida da definição do executor.

Seu uso deve ser efetuado somente sob orientação. Caso não seja informado, a URL será montada utilizando os parâmetros atuais de conexão do servidor. Informe-a somente sob orientação.

## Versão [2.0.9]

### Melhorias

#### Adição de confirmação ao gerar patch da pasta

Adição de confirmação de compilação de pasta ao gerar patch da pasta.

#### Consolidação de mensagem de confirmação no defrag do RPO

Consolidação de mensagem de confirmação de limpeza de histórico ao realizar o defrag do RPO.

### Correções

#### Breakpoints desaparecem ao debugar arquivos em pastas com acentos [#1252](https://github.com/totvs/tds-vscode/issues/1252)

Este problema estava limitado a pastas com alguns caracteres específico de acentuação (ÁÍÏ).

#### Acentuação em pastas/arquivos - not found na hora da compilação [#1244](https://github.com/totvs/tds-vscode/issues/1244)

Realizado ajustes para evitar alterações de encoding em SO Linux e MacOS.

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

Correção no tratamento de linhas quando opção `ignoreSourcesNotFound` ativa.

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

Os fontes abertos fora da área de trabalho, não são mais processados para fins da visão `Estrutura (_Outline_)` e funcionalidades providas pelo [`DSS`](./docs/dss.md) e [``linter```](./docs/linter.md).
Demais funcionalidades continuam funcionando normalmente.

> Fontes fora da área de trabalho receberá uma notificação na visão `Problemas` como uma informação.
> ![``Problema`` com informação de fora da área de trabalho](./docs/images/info-source-outside.png)

#### Depuração com variáveis do tipo _string_ (_character_)

Variáveis do tipo _character_ (_string_), podem conter dados nos formatos CP1252/CP1251 ou UTF8, que podem ser diferenciadas pelo prefixo `UTF8` em seus valores nas visões `Variables` e `Watches` e ao passar o mouse sobre a variável. Também foi modificado a forma de apresentação.

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

#### Comando `BeginContent` passa a aceitar o tipo de conteúdo

```console
beginContent var myVar [as <language: javascript | JS | html | json | xml | css | typeScript | TS>]
```

Essa informação é utilizada apenas para fins visuais não sendo efetuado nenhum tipo de validação.

#### Comandos `BeginSql` e `EndSql`

Ao utilizar o bloco de comandos `BeginSql` e `EndSql`, o seu conteúdo será apresentado usando as configurações de destaque de sintaxe da linguagem SQL.
Esse destaque é utilizada apenas para fins visuais não sendo afetado a funcionalidade do bloco.

#### Filtro na Linha de Tempo do TDS Replay [#DTCLIENT01-2533](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-2533)

Foi implementado opção de [filtro nos fontes](https://github.com/totvs/tds-vscode/wiki/TDS-Replay#filtro-de-fontes-na-linha-do-tempo) que serão apresentados na Linha de Tempo.

### Correções

#### Erro na inicialização do language server com MACOS #1173

A inicialização do `DSS` falhava (permissão) em sistemas MacOS, com erro:

```console
 (7.391s) [languageServer ] dbcode_manager.cpp:544 | Binary file error. Error: [/Users/XXXXXXXXXX/gitfolder/ma3-tmp/ma3/.vscode/.advpl/_binary_functions.prw] Permission denied
```

#### DSS: Corrigido processo de renomear e remover fontes

Em determinadas circunstâncias, ao renomear ou remover fontes, os processos podiam deixar resíduos no cache, causando duplicidade de informação ou não ser finalizados, requerendo acionar a ação `Cancelar` no diálogo de notificação.

## Versão [2.0.0]

> Interoperabilidade entre sistemas operacionais
>
> Para garantir a interoperabilidade das áreas de trabalho entre os sistemas operacionais suportados pelo **TDS-VSCode** e seus componentes, recomenda-se que pastas e arquivos não contenham caracteres especiais (exceto hífen e sublinhado) ou acentuados e sempre em minúsculas.
>
> Leia [Convenção para nomenclatura de _File System_ em ambiente Linux](https://tdn.totvs.com/x/h8BICw).

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

#### Navegação em classes quando usado `self` e `_Super`

- Adicionado tratamento há herança de classe (`_Super`, `from`, `inherited` e `of`)
- Unificado tratamento de `::` e `self`
