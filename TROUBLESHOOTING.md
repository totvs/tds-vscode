# Resolução de Problemas

> Antes de abrir uma nova **"Issue"** do **TDS VS Code**, verifique se o seu problema está na lista de problemas conhecidos e se existe uma solução de contorno para ele. Caso contrário abra uma nova **"Issue"** e adicione o maior número de informações possíveis (veja abaixo na seção **"Informações importantes"**) para ajudar a identificar a causa do problema.

Os problemas estão divididos em **"Gerais"** e **"Depuração"** então procure na seção em que seu problema se enquadra.

> **"Issues"** abertas sem as **"Informações importantes"** serão analisadas somente após receberem tais informações,


## Problemas Gerais

São problemas que ocorrem desde a inicialização do **TDS VS Code** até a operação normal do dia-a-dia como compilar, gerar e aplicar patches, etc. Excluindo-se apenas a Depuração que é tratada em outra seção.

### Pastas com acentuação

Já tivemos diversos relatos onde o problema era relacionado com acentuações nas pastas do projeto/workspace em uso.

**Solução:** Remova quaisquer acentuações que existam no projeto/workspace que estiver trabalhando.

### Maiúsculas e Minúsculas (*Case*)

É sabido que no Windows o *case* (maiúsculas e minúsculas) não importa, mas no Linux e Mac, que são S.O. baseados no Unix, o *case* faz diferença. Devido ao uso de bibliotecas internas do **TOTVS Server**, o *case* do arquivos no Linux e Mac são convertidos para minúsculas sempre, causando problemas quando existem caracteres em letras maiúsculas.

**Solução:** Utilize somente letras minúsculas em todo o caminho, inclusive no nome dos arquivos quando utilizar o **TDS VS Code** em Linux ou Mac.

### Falhas gerais na inicialização (command 'totvs-developer-studio.add' not found)

Tivemos relatos de problemas de problemas ao utilizar o **TDS VS Code** sem uma pasta aberta (projeto/workspace).

**Solução:** Sempre abra um projeto/workspace ao utilizar o **TDS VS Code**.

### Erro ao adicionar servidores

Se durante a inicialização ocorrer um erro semelhante a:
`Activating extension 'TOTVS.tds-vscode' failed: Unexpected token , in JSON at position 18507`
ou ao tentar salvar um novo servidor ocorrer um erro semelhante a:
`Unexpected token , in JSON at position 18507`
É bem provável que tenha editado o arquivo "servers.json" e "corrompido" sua estrutura.

**Solução:** Verifique se consegue identificar o problema no arquivo "servers.json" utilizando um parser de JSON. Normalmente é apenas a falta ou sobra de uma simples vírgula que causa o problema. Se não encontrar o problema no arquivo JSON, você sempre poderá apagar este arquivo, porém terá que cadastrar os servidores novamente.

### Compilação de fontes

Os problemas mais frequentes que causam falha na compilação estão associadas a configuração de *includes*.

**Solução:** Verifique as configurações de *includes* no arquivo "servers.json" (na pasta ".totvsls" em sua pasta de usuário). Os *includes* podem ser definidos por servidores (em "configurations") e no nível geral *includes*. Se não estiver definido no servidor o *includes* geral será utilizado. Note que os *includes* devem ser os diretórios onde os arquivos `.ch` estão localizados.

> de qualquer formam, os erros ocorridos durante a compilação de um fonte devem aparecer na visão "Problems" do **TDS VS Code** ou exibidos na visão "Output - TOTVS". Se nenhuma informação sobre o erro for apresentada, crie uma nova "Issue".

### Duplicated function

Se durante a compilação de um fonte, por exemplo 'XPTO.PRW', ocorrer o erro "Duplicated function U_XPTO (found in XPTO(1).PRW)", significa que a função já existe no RPO em outro fonte.

**Solução:** Neste caso remova do RPO a função já existente, criando um arquivo, neste exemplo o 'XPTO(1).PRW', com a função duplicada e utilize a opção "Delete file/resource from RPO" para remover este arquivo do RPO. Em seguida realize a compilação de 'XPTO.PRW' novamente.

### File extension not in the allowed extensions list

Se encontrar uma mensagem como a seguir é porque, por padrão, somente serão compilados os fontes/recursos cujas extensões estiverem na lista de extensões permitidas configurada.

> [SKIPPED] File extension for <file.ext> is not in the allowed extensions list.

A lista pode ser visualizada e alterada em `File | Preferences | Settings | Extensions | TOTVS |Folder: Extensions Allowed`.

Este filtro pode ser desativado completamente, permitindo que quaisquer extensões de arquivos sejam compiladas no RPO, ao desmarcar a opção `File | Preferences | Settings | Extensions | TOTVS |Folder: Enable Extensions Filter`.

> Ao cadastrar uma nova extensão utilize o formato `".EXT"` (iniciado por um ponto e com as todas as letras em maíusculas).

### Falha de conexão (Retrieve connection error)

Se ocorrer um erro com a mensagem do tipo:
`Retrieve connection error: Connection is not authenticated but requires authentication`
Indica que o token de reconexão pode conter dados incorretos.

**Solução:** Acione `File > Preferences > Settings` ( ou `CTRL + ,` ) e localize `TOTVS` em Extensions. Procure a opção "Use reconnection token" e desabilite temporariamente. Tente se conectar novamente e os dados do token de reconexão serão atualizados com os novos dados da conexão.

### Falha ao compilar, gerar/aplicar patches (**TOTVS Server** Lobo Guará 19)

A operação falha com uma mensagem semelhante a:
`[FATAL] Aborting: the user must be logged in before xxxxx.`
Certifique-se de que seu TOTVS Server está atualizado, pois se for uma versão RC (Release Candidate), do tipo `Build Version: 19.3.0.1_RC13`, é possível que esteja com um problema que foi corrigido no *TOTVS Server*.

**Solução:** Pegue a última versão do portal e tente novamente.

### Usuário com acentuação

Tivemos um relato onde o problema estava relacionado ao nome do usuário conter acentuação.

**Solução:** Utilize um usuário que não contenha nenhum tipo de acentuação.

### Windows Server

Tivemos relatos de problemas na instalação do **TDS VS Code** em *S.O.* do tipo *Windows Server*. Nossas suspeitas são de que este tipos de *S.O.* não posssuem *DLLs*, que existem na distribuições voltadas para Desktops, e que são necessárias para o funcionamento do *VS Code*.

**Solução:** Utilize um *S.O.* diferente de *Windows Server*.


## Problemas em Depuração

São problemas que ocorrem especificamente durante a depuração de um programa.

### Pastas com acentuação

Apesar de já descrita na seção de **"Problemas Gerais"** existem problemas que ocorrem ao adicionar um *Ponto de Parada* em fontes cujos caminhos contem acentuação em qualquer nível.

**Solução:** Remova quaisquer acentuações que existam no projeto/workspace que estiver trabalhando.

### Depuração não inicia

Se a depuração não inicia, verifique se o Smartclient utilizado é o correto para a versão do TOTVS Server utilizado.

**Solução:** Ao invés de iniciar a depuração com o `F5` utilize o `CTRL + F5` e veja se o Smartclient executa corretamente. Se o Smartclient não executar assim, reveja as configurações de depuração (launch.json).


# Gerando Informações sobre o Problema

Se o seu problema não estiver listado acima então será preciso analisá-lo. Para isso precisamos saber de detalhes de seu ambiente, pois sem isso não podemos ajudá-lo.

## Informações importantes ao abrir uma "Issue"

Para auxiliar na identificação de um problema, ao abrir uma nova **"Issue"** sempre informe:

* Versão do **VS Code** e da extensão **tds-vscode**

E se o problema ocorrer com um servidor informe também:

* Versão do **RPO (LIB)** e do **TOTVS Server**

Se possível anexe os logs de apoio do **TDS VS Code**. Veja como gerar os logs a seguir em **"Gerando logs"**

#### Versão do **VS Code**

Para obter os dados do **VS Code** acione: `Help > About`
```
Version: 1.44.0 (user setup)
Commit: 2aae1f26c72891c399f860409176fe435a154b13
Date: 2020-04-07T23:31:18.860Z
Electron: 7.1.11
Chrome: 78.0.3904.130
Node.js: 12.8.1
V8: 7.8.279.23-electron.0
OS: Windows_NT x64 10.0.18362
```

#### Versão da extensão **tds-vscode**

Para obter os dados da extensão **tds-vscode** instalada selecione a visão *"Extensions"* ( `CTRL + Shift + X` ) e confirme a versão instalada.

![tds-vscode extension version](https://raw.githubusercontent.com/totvs/tds-vscode/master/docs/gifs/tds-vscode_version.PNG)

#### Versão do **RPO (LIB)** e do **TOTVS Server**

Para obter os dados do **RPO (LIB)** e do **TOTVS Server**, de qualquer ponto de execução de um **RPO** (acessado através de um *Smartclient*), acione `Shift + F6` e exporte as informações do **TOTVS Server** e **RPO**:

```
Informações do TOTVS Server
Tipo do servidor;Console
TOTVS Server Build;7.00.191205P-20200220
TOTVS Server version;19.3.0.2
Servidor 64 bits;Sim
Servidor Unix;Não
```
```
Informações da LIB
Versão da Lib;20200214
Data da Lib;20200219_175422
ID da Lib;b295223920b2c697853f41b83b109a3830d997d2
Release;12.1.025
HardLock;2014
Versão do License Server;3.0.3
Versão do Protheus;TOTVS Serviços
Dicionário no banco de dados;Sim
```

## Gerando logs

Para gerar os logs **"Gerais"** adicione as linhas abaixo, em seu arquivo **"settings.json"** dentro da pasta *".vscode"* de seu projeto aberto.
```
"totvsLanguageServer.launch.args": [
    "--log-file=totvsls.log",
    "--record=totvsls"
]
```
O arquivo **"settings.json"** deve ficar como a seguir, observem a vírgula que foi introduzida, pois existem outras configurações, caso contrário o arquivo JSON acusará problema de parse:
```
{
    "totvsLanguageServer.launch.args": [
        "--log-file=totvsls.log",
        "--record=totvsls"
    ],
    "totvsLanguageServer.welcomePage": false,
    "totvsLanguageServer.askCompileResult": true,
    "totvsLanguageServer.askEncodingChange": false
}
```

> Reinicie seu TDS VS Code após esta configuração para que surta efeito.

Os arquivos **"totvsls.log"**, **"totvsls_in.log"** e **"totvsls_out.log"** serão gerados na raiz do projeto aberto.

Se o problema for relacionado a depuração, além dos logs **"Gerais"** deve ser gerado o log de **"Depuração"**. Adicione a linha abaixo, na seção *"configurations"* em seu arquivo **"launch.json"** dentro da pasta *".vscode"* de seu projeto aberto.
```
"logFile": "${workspaceFolder}\\dap.log"
```
O arquivo **"launch.json"** deve ficar como a seguir, observem que uma vírgula foi adicionada a linha anterior, caso contrário o arquivo JSON acusará problema de parse:
```
...
"configurations": [
	{
		"type": "totvs_language_debug",
		"request": "launch",
		"name": "Protheus 19 Debug",
		"program": "${command:AskForProgramName}",
		"cwb": "${workspaceFolder}",
		"smartclientBin": "T:/servers/lg_191205_12.1.25/bin/smartclient/smartclient.exe",
		"isMultiSession": true,
		"enableTableSync": true,
		"waitForAttach": 5,
		"logFile": "${workspaceFolder}\\dap.log"
	}
],
...
```
O arquivo **"dap.log"** será gerado na raiz do projeto aberto.
