# TOTVS Developer Studio Code

[![Build Status](https://travis-ci.org/totvs/tds-vscode.svg?branch=master)](https://travis-ci.org/totvs/tds-vscode)

O plugin do TOTVS Developer Studio Code disponibiliza uma suíte de desenvolvimento para o ecossistema Protheus.
Ele utiliza os protocolos de comunicação LSP (Language Server Protocol) e DAP (Debug Adapter Protocol), ambos amplamente utilizados e extensíveis à outras IDEs de mercado, como Atom, Visual Studio, Eclipse, Eclipse Theia, Vim e Emacs.

> [Lista de IDEs com suporte ao LSP](https://microsoft.github.io/language-server-protocol/implementors/tools).
[Lista de IDEs com suporte ao DAP](https://microsoft.github.io/debug-adapter-protocol/implementors/tools).

## Funcionalidades

* Syntax Highlight
* Comunicação baseada nos protocolos LSP/DAP.
* Compilação de fontes, pastas e da área de trabalho.
* Depuração de fontes (Local e WebApp).
* Geração de Patch.
* Aplicação de Patch.
* Deleção de fontes do RPO.
* Desfragmentação do RPO.
* Inspetor de objetos do RPO.
* Inspetor de funções do RPO.
* Geração de WS Protheus.

## Configurações Gerais

### Tela de boas vindas

* A tela da boa vindas permite configurar a localização do SmartClient e dos diretórios de Includes que serão utilizados durante a compilação dos códigos fontes.
* Esta tela será apresentada na primeira execução do plugin, assim que o primeiro fonte AdvPL for aberto.
* Localize o `SmartClient.exe` (Windows) ou `smartclient` (Linux).
* Localize os diretórios de Includes que necessitar para seus projetos.
* Pressione o botão `Salvar` para concluir.

![Welcome Page](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Welcome.gif)

### Cadastro de servidores utilizando o assistente

* Clique no icone `"+"` no canto superior direito da visão, ao lado da aba `Servidores`.
* Preencha as informações de `nome`, `ip` e `porta` do servidor.
* Clique no botão `Salvar`.
* Existe o atalho que para abertura do assistente: `CTRL + SHIFT + P` digite `TOTVS: Add Server`.

![New server](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/AddServer.gif)

### Conexão com servidores

* Após executar o cadastro de ao menos um servidor.
* Vá para visão de servidores (Acesso pelo ícone da TOTVS na lateral esquerda do VSCode).
* Clique com o botão direito e selecione a opção `Connect`.
* Informe `ambiente`, `usuário` e `senha` (pode ser "em branco") para prosseguir.
* Aguarde o termino da conexão.
* A conexão com servidores pode ser efetuada pela seleção do texto `[Selecionar servidor/ambiente]` na barra de ferramentas. Ou pelo atalho `CTRL + SHIFT + P` digite `TOTVS: Select Server`.

![Connect Server](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/ConnectServer.gif)

## Compilação

### Compilando fonte do editor corrente

* Para compilar o fonte do editor corrente acione o atalho `CTRL + F9`. Ou pelo atalho `CTRL + SHIFT + P` digite `TOTVS: Compile Selection`.

* Para recompilar o fonte do editor corrente acione o atalho `CTRL + SHIFT + F9`.

### Compilando todos os fontes abertos

* Para compilar todos os fontes dos editores abertos acione o atalho `CTRL + F10`. Ou pelo atalho `CTRL + SHIFT + P` digite `TOTVS: Compile Open Editors`.

* Para recompilar todos os fontes dos editores abertos acione o atalho `CTRL + SHIFT + F10`.

### Resultado da compilação

* Para analisar o resultado da compilação de múltiplos arquivos, exite a opção de abrir uma tabela com informações de todos os arquivos que foram compilados.

* Para exibir essa tabela, selecione mais de um arquivo, compile e após a compilação será apresentada a pergunta a seguir: Clique em `Yes`.

![ShowCompileResult](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/compile/askCompileResult.PNG)

* A tabela abaixo será exibida, ordenada pela coluna de resultado.

![TableCompileResult](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/compile/CompileResults.PNG)

* Exite nas preferencias uma maneira de habilitar e desabilitar a pergunta sobre a abertura da tabela.

* Clique em `File | Preferences | Settings` e digite `totvsLanguageServer.askCompileResult` no campo de pesquisa.

## Configurações de Compilação

### Encoding

Tivemos reportes de problemas de encode abrindo fontes antes salvos no TDS, isso ocorre porque o encode original do VSCode é UTF8 e o do TDS é outro.
Para garantir a compilação é necessário compatibilizar o encode da seguinte maneira:
 * No estado original o Fonte será mostrado desta maneira:<br/>
 ![Encoding 1](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding1.png)
 * **Antes de editar/salvar qualquer fonte no VS** entre nas configurações do VS `Ctrl + ,`.
 * No campo de busca digite `encode` e selecione `Windows1252`.<br/>
 * Abra o fonte com o novo encode (reforçando que NÃO DEVE tê-lo salvo antes em UTF8)<br/>
 ![Encoding 3](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding3.png)
 * Compile e/ou recompile o fonte e execute-o.<br/>
 ![Encoding 4](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/encoding/encoding4.png)

 Na abertura do workspace, perguntamos se o usuário deseja alterar o encoding para o padrão TOTVS e essa configuração é feita automaticamente.

### Compilando Function e Main Function com Chave de compilação

* Este processo está sendo revisto e pode sofrer alterações.

* Para aplicar uma chave de compilação, clique com o botão direito na visão de servidores e selecione a opção `Compile key`.
* Abrirá um assistente para selecionar a chave que deseja. Todos os arquivos .aut podem ser selecionados.
* Também é possível abrir o assistente pelo atalho `CTRL + SHIFT + P` digirantando `TOTVS: Compile Key`.
* Após selecionar a chave, ela será lida e os campos preenchidos com suas informações.
* Clique sobre o botão de `Validate` para verificar se a chave é válida.

* OBS: A chave só será salva ao clicar no botão `Save` ou `Save/Close` caso a chave seja válida.

## Chave de compilação

* A partir de 17/05/2019 todas as chaves devem ser regeradas utilizando o ID exibido no nosso plugin do VSCode. Isse se faz necessário para suporte de Linux e MAC.

* Suporte de chave de compilação em Linux e MAC a partir de 17/05/2019.

![Compile Key](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/CompileKey.gif)

### Configuração de Include

* Na visão de servidores, clique com o menu de contexto e selecione a opção `Include`.
* Também é possível configurar pelo assistente: `CTRL + SHIFT + P` digite `TOTVS: Include`.

* As configurações de include ficam no arquivo `%USERHOME%/.totvsls/servers.json`. Abra esse arquivo.
* Já existe por padrão o diretório `"C:/totvs/includes"`.
* Para adicionar uma nova configuração de include separe por vírgula ou substitua o path existente.
  Ex:`"includes": ["C:/totvs/includes1","C:/totvs/includes2", "C:/totvs/includes3"]`.

![Configure Include](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Include.gif)

### Arquivos do pré compilador

* Para manter os arquivos gerados pelo pré-compilador, habilite a opção nas preferencias em: `File | Preferences | Settings | Extensions | AdvPL | Leave PPO File`.
* Caso queira um log completo das operações efetuadas pelo pré-compilador, habilite a opção: `File | Preferences | Settings | Extensions | AdvPL | Show Pre Compiler`.

## Configurações de Debug

### Criando manualmente uma configuração de debug

* O arquivo `launch.json` será criado automaticamente através da Tela de Boas Vindas.
* Caso haja problemas com este arquivo você pode criá-lo manualmente através dos seguintes passos:

  * Selecione a seção `Debug` no painel esquerdo do VSCode.
  * Selecione na parte superior desta tela a opção `Add Configuration...`.
  * Comece a digitar `TOTVS` e selecione o tipo desejado
    * Tipo: _totvs_language_debug_, usa o SmartClient Desktop.
      Preencha o arquivo `launch.json` de acordo com seu ambiente e necessidas, como no exemplo abaixo.

>``{``
"type": "totvs_language_debug",
"request": "launch",
"name": "Totvs Language Debug",
"program": "${command:AskForProgramName}",
"cwb": "${workspaceFolder}",
"smartclientBin": "/home/mansano/_c/totvs12/bin/smartclient/smartclient",
"isMultiSession": true,
"enableTableSync": true
``}``

    * Tipo: _totvs_language_web_debug_, usa o SmartClient Html.
      Preencha o arquivo `launch.json` de acordo com seu ambiente e necessidas, como no exemplo abaixo..

>``{``
"type": "totvs_language_web_debug",
"request": "launch",
"name": "Totvs Language Debug",
"program": "${command:AskForProgramName}",
"cwb": "${workspaceFolder}",
"smartclientUrl": "<http://localhost:8080>",
"isMultiSession": true,
"enableTableSync": true
``}``

*Nota:* Abra o arquivo `settings.json` e informe a chave "", com o caminho completo do seu navegador web.
>``{``
"totvsLanguageServer.welcomePage": false,
"totvsLanguageServer.web.navigator": "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
``}``

Veja detalhes sobre como usar as diretivas [${command:}](https://link) e [passagem de parâmetros](https:link).

### Criando uma configuração de debug com assistente

* Para abrir o assistente de nova configuração de debug, pressione o atalho `CTRL + SHIFT + P` e digite `TOTVS: Configure Launchers`.
* Será aberto um assistente de configuração de launcher que permite criar uma nova configuração ou editar uma configuração já existente.
* Preencha as informações e clique em `Save`.

![New Launcher](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/CreateLauncher.gif)

### Iniciando um debug

* Caso necessário, verifique se os dados do arquivo `launch.json` estão corretos.
* Conecte-se a um servidor previamente cadastrado.
* Pressione o atalho `F5` para iniciar o debug.
* Caso necessário abrir o `launch.json` novamente, Selecione a seção `Debug` no painel esquerdo do VSCode
* E por fim no ícone de configuração na parte superior `Open launch.json`, representado pelo icone de uma `engrenagem`.
* Será exibido um campo para digitação do fonte que deseja depurar, ex: `u_teste`.
* Pressione `Enter` para iniciar a depuração.

![Start Debug](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/StartDebug.gif)

### Usando Debug Console

* É possível verificar os valores de variáveis, conteúdo de tabelas e executar métodos durante o debug com o Debug Console.
* Coloque um breakpoint em um ponto necessário de seu fonte.
* Quando a depuração "parar" ao breakpoint, abra a visão `Debug Console` na parte inferior da tela.
* Digite uma operação ou variável AdvPL disponivel em seu ambiente de depuração.
* Para verificar o conteúdo de uma tabela aberta, digite o seguinte comando: table:nome_da_tabela (ex.: table:SM0)
* Analise os dados retornados de acordo com sua necessidade.

Em [Debug Console: configuração visual](https://github.com/totvs/tds-vscode/wiki/Debug-Console:-configura%C3%A7%C3%A3o-visual), você tem detalhes de como customizar o visual desta visão.

![Debug Console](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/DebugConsole.gif)

### Sincronismo de tabelas durante o debug

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-ShowingTables.gif)

* O sincronismo de tabelas pode ser alterado por configuração de "launcher" pelo parâmetro: enableTableSync
* Ele vem habilitado por padrão em uma nova configuração de execução.

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-EnableTableSyncProperty.gif)

* É possível alterar essa opção durante uma depuração pelo comando: "TOTVS: Toggle table sync". Note que ao usuar esse comando, o parâmetro do launcher é alterado, portanto a próxima depuração irá utilizar essa definição. Ou seja, caso tenha sido desabilitado, a próxima depuração iniciará com o sincronismo de tabelas desabilitado também.

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-CommandToggleTableSync.gif)

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-CommandToggleChangingProperty.gif)

* É possível visualizar o conteúdo de uma tabela aberta usando a visão "Debug Console". Para isso digite o seguinte comando na visão: table:nome_da_tabela (ex.: table:SM0)

![Debug Table Sync](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/TableSync-DebugCommands.gif)

## Patch

### Gerando um Patch (From RPO) utilizando o assistente.

* Para gerar um patch conecte-se ao servidor.

* Selecione com o botão direito do mouse o servidor conectado.
* Selecione a opção `Patch Generation (From RPO)`.
* Existe um atalho para a abertura da página: `CTRL + SHIFT + P ` digite `TOTVS` e selecione a opção `TOTVS: Patch Generation (From RPO)`.

* Aguarde a carga dos arquivos do inspetor de objetos.
* Selecione os arquivos que desejar para o patch utilizando o campo de `Filtro`.
* Para digitar o filtro simplesmente saia do campo ou pressione `Enter`.
* Selecione agora os arquivos na lista da esquerda e mova os desejados para lista da direita utilizando o botão `">>"`.
* Repita o processo até que tenha selecionado todos os arquivos necessários.
* Selecione agora o `diretório` onde deseja salvar o Patch.
* Escolha o `nome do arquivo` de Patch desejado. (Quando não informado, o patch será gerado com o nome do RPO).
* Efetue e geração do Patch pressionando o botão `Gerar`.

![Patch Generate](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/GeneratePatchWizard.gif)

### Gerando um Patch (From Folder) utilizando o menu de contexto

* Para gerar um patch conecte-se ao servidor.
* Clique com o botão direito em cima da pasta de contém os fontes que farão parte do patch.
* Selecione a opção `Patch Generation (From Folder)`.
* Abrirá uma janela para selecionar onde deseja que o fonte seja salvo. Selecione um pasta.
* Uma janela será aberta para coletar o nome do patch que será gerado. (Quando não informado, o patch será gerado com o nome do RPO).
* Após as confirmações o patch será gerado no caminho desejado.

![Patch Generate Folder](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/GeneratePatchWizardFromFolder.gif)

### Aplicando Patch utilizando o assistente

* Para aplicar um patch conecte-se ao servidor.

* Selecione com o botão direito do mouse o servidor.
* Selecione a opção `Patch Apply`.
* Existe um atalho para a abertura da página: `CTRL + SHIFT + P ` digite `TOTVS` e selecione a opção `TOTVS: Patch Apply`.

* Os campos de servidores são preenchidas automaticamente com as informações do servidor conectado.
* No campo `Patch File` selecione o patch que deseja aplicar.
* Confirme a aplicação.

![Patch Apply](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/ApplyPatch.gif)

### Aplicando Patch utilizando o menu de contexto

* Para aplicar um patch conecte-se ao servidor.

* Selecione o patch com o botão direito do mouse.
* Selecione a opção `Patch Apply from file`.
* Confirme a aplicação e o patch será aplicado.

![Patch Apply from File](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/ApplyPatchMenu.gif)

## RPO

### Desfragmentação de RPO

* Para desfragmentar um RPO conecte-se ao servidor.
* Selecione o servidor com o menu de contexto e seleciona a opção `Defrag RPO`.
* Também é possível selecionar a opção pelo atalho `CTRL + SHIFT + P` digitando `TOTVS: Defrag RPO`.

* As mensagens de inicio e fim da desfragmentação serão exibidos no canto inferior direito.

![Defrag RPO](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/DefragRPO.gif)

### Deletar recursos do RPO

* Para deletar algum recurso do RPO, conecte-se ao servidor.
* Com o menu de contexto em cima do arquivo que deseja excluir, selecione a opção `Delete File/Resource from RPO`.
* Confirme a exclusão.
* A confirmação da exclusão será exibida no console e em mensagens no canto inferior esquerdo.

![Delete File RPO](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/DeleteFromRPO.gif)

### Inspetor de Objetos do RPO

* Para visualizar os arquivos que fazem parte do RPO, conecte-se ao servidor.
* Com o menu de contexto em cima do servidor, selecione a opção `Objects inspector`.
* Abrirá um assistente com todos os arquivos que fazem parte do RPO, utilize o filtro para encontrar algum arquivo específico.
* Também é possível abrir o assistente pelo atalho `CTRL + SHIFT + P` digitando `TOTVS: Objects inspector`.

![Objects inspector](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/InspectObject.gif)

### Inspetor de Funções do RPO

* Para visualizar as funções que fazem parte do RPO, conecte-se ao servidor.
* Com o menu de contexto em cima do servidor, selecione a opção `Functions inspector`.
* Abrirá um assistente com todos as funções que fazem parte do RPO, utilize o filtro para encontrar alguma função específica.
* Também é possível abrir o assistente pelo atalho `CTRL + SHIFT + P` digitando `TOTVS: Functions inspector`.

![Functions inspector](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/InspectFunction.gif)

## Geração de Client WS Protheus
* É possível gerar arquivos ADVPL a partir de clients WSDL.
* Abra o assistente com o atalho `CTRL + SHIFT + P` e digite `TOTVS: Generate WS Protheus`.
* Preencha o campo `URL`, selecione um diretório e escreva o nome e extensão do arquivo protheus que será gerado no diretório especificado.
* Após preencher, uma mensagem de sucesso avisará que tudo foi criado corretamente.

![Generate WS](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/GenerateWS.gif)

## Suporte

### Capturador de Logs

* Caso tenha problemas com a ferramenta e deseja suporte da equipe de desenvolvimento do plugin, inicie uma ferramenta de coleta de logs para auxiliar no suporte. Essa ferramenta colhe informações como versões de ferramentas e plugins, sistema operacional, versão do VSCode, configuração de servidores e etc.

* Para ativa-la, selecione pelo atalho `CTRL + SHIFT + P` digite `TOTVS: On Logger Capture`. Nesse momento o capturador de log será iniciado.

* Reproduza o problema e selecione a opção `CTRL + SHIFT + P` digite `TOTVS: Off Logger Capture` ou na Barra inferior clique sobre o texto `Capturando logs...`. Os capturador será encerrado e um arquivo chamado `tdsSupport.zip` será gerado. Anexe esse arquivo ao chamado.

![Logger](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/gifs/Logger.gif)

### Desenvolvimento Colaborativo

* Se deseja contribuir com o desenvolvimento do plugin, acesse [Git Hub TDS-VSCODE](https://github.com/totvs/tds-vscode), faça seu commit que iremos analisar!

## Plugins recomendados

* TDS Monitor for VSCODE.

  Permite monitor servidores protheus.

  <https://marketplace.visualstudio.com/items?itemName=totvs.tds-monitor>

* Numbered Bookmarks.

  Permite uso de bookmarks no estilo Delphi numerados de 1 a 9.

  <https://marketplace.visualstudio.com/items?itemName=alefragnani.numbered-bookmarks>

  ![Toggle](https://github.com/alefragnani/vscode-numbered-bookmarks/raw/master/images/numbered-bookmarks-toggle.png)

