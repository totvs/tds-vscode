# TDS: Depuração e execução

> Requisitos
>
> - servidor/ambiente conectado
> - usuário autenticado (se necessário)
> - executor configurado

> Recomendações

- **NUNCA** faça depuração em ambiente de produção
- Não use _appServers_ compartilhado com terceiros, mesmo que ambientes diistintos
- Prefira sempre um ambiente local
- **Clientes TCloud** : Os ambientes que estão no _TCloud_ em produção são *bloqueados* para depuração.
Promova o _RPO_ para ``DEV`` e use esse ambiente, e se necessário, promova-o de volta para produção.
Para detalhes, entre em contato com o suporte do _TCloud_.

## Configuração de executores

> Recomendamos a leitura [Debugging](https://code.visualstudio.com/docs/editor/debugging).

### Criando um executor com assistente

Acione o atalho `CTRL + SHIFT + P` e execute `TOTVS: Configure Launchers` que lhe apresentará um assistente de configuração de executores que permite criar uma nova configuração ou editar uma já existente. Preencha as informações solicitadas e acione `Save`.

![New Launcher](./gifs/CreateLauncher.gif)

### Criando um executor manualmente

A definição de executores encontra-se nO arquivo `.vscode/launch.json` que, normalmente, é criado através na abertura da página de `Boas Vindas`. Caso isso não ocorra (devido a configurações do seu ambiente), você pode criá-lo manualmente executando:

- Na barra de atividades, acione o `Debug`
- Na barra de ferramentas (parte superior) da visão de `Debug`, abra a lista de seleção e acione `Add Configuration...`.
- Comece a digitar `TOTVS` e selecione o tipo desejado
  - _totvs_language_debug_, para usar _SmartClient Desktop_
  - _totvs_language_web_debug_, para usar _SmartClient Html_
- Preencha os atributos solicitados conforme seu ambiente
- Salve o arquivo

### Exemplos de configuração

```JSON
{
	"version": "0.2.0",
	"configurations": [
    {
    "type": "totvs_language_debug",
    "request": "launch",
    "name": "TOTVS Language Debug",
    "program": "${command:AskForProgramName}",
    "cwb": "${workspaceFolder}",
    "smartclientBin": "/home/totvs12/bin/smartclient/smartclient",
    "isMultiSession": true,
    "enableTableSync": true
    },
    {
      "type": "totvs_language_web_debug",
      "request": "launch",
      "name": "TOTVS Language Debug",
      "program": "${command:AskForProgramName}",
      "cwb": "${workspaceFolder}",
      "smartclientUrl": "http://localhost:8080",
      "isMultiSession": true,
      "enableTableSync": true
    }
  ]
}
```

No caso de efetuar depuração via `SmartClient Html`, indique qual o navegador web será utilizado, no arquivo `.\vscode\settings.json`.

```JSON
{
  ...
  "totvsLanguageServer.web.navigator": "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  ...
}
```

### Variáveis de substituição[#variable]

| Veja [Variable substitution](https://code.visualstudio.com/docs/editor/debugging#_variable-substitution).

Os executores do **TDS-VSCode**, além da variáveis de substituiçã do **VS-Code**, permite o uso de:

| Variável                       | Uso/Função                               |
| ------------------------------ | ---------------------------------------- |
| `${command:AskForProgramName}` | Solicita qual o programa a ser executado |

Ao utilizar `${command:AskForProgramName}` na configuração do executor, lhe será solicitado qual o prorama ou função a ser executada, com ou sem parâmetros.

```ADVPL
user function u_myFunc(p1, p2, p3)
  // processamento conforme parâmetros
  ...
return
```

| Exemplos              | Parâmetros                     |
| --------------------- | ------------------------------ |
| `u_myFunc`            | `p1`=nil, `p2`=nil, `p3`=nil   |
| `u_myFunc()`          | `p1`=nil, `p2`=nil, `p3`=nil   |
| `u_myFunc("A")`       | `p1`="A", `p2`=nil, `p3`=nil   |
| `u_myFunc("A",,3)`    | `p1`="A", `p2`=nil, `p3`="3"   |
| `u_myFunc("A",.t.,3)` | `p1`="A", `p2`=".t.", `p3`="3" |

| A passagem de parâmetros equivale a usar o argumento `-a` do `SmartClient`.

## Execução

Acione o atalho `CTRL + F5` para iniciar a execução e informe o nome da função/programa a ser executado, se solicitado.

> Veja [Variáveis de substituição](#variable).

## Depuração

Acione o atalho `F5` para iniciar a depuração e informe o nome da função/programa a ser executada, se solicitado.

| Veja [Debuggimg Actions](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) e [Variáveis de substituição](#variable).

![Start Debug](./gifs/StartDebug.gif)

## Depuração de serviços (_jobs_, _webservice_, _rest_, _rpc_ e assemelhados)

| A principal característica de um serviço, é que a sua execução não esta diretamente relacionada a interface com o usuário (_SmartClient_) e normalmente é executado em segundo plano pelo _appServer_.

> Certique-se que:
>
> - o serviço está em execução ou pronto para execução quando solicitado;
> - a chave `enableMultiThread` esteja ligada na definição do executor que será utilizado.

- Coloque um ponto de parada que será executado quando o serviço for requisitado
- Inicie a depuração executando qualquer função do _RPO_ para que mantenha um conexão do depurador com o _appServer_
- Acione o serviço por fora do **VS-CODE**, por exemplo executando o `SmartClient`, requisição (http, rest, etc)
- Quando a depuração parar no ponto indicado, prossiga com a depuração normalmente

### Usando Console de Depuração

É possível verificar valores de variáveis, conteúdo de tabelas e executar métodos/funções durante o processo de depuração.

- Coloque um ponto de parada onde achar necessário
- Quando a depuração parar no ponto indicado, abra a visão `Debug Console`
- Digite uma operação ou variável AdvPL/4GL disponível em seu ambiente de depuração
- Para ver conteúdo de uma tabela, digite `table:nome_da_tabela`, por exemplo `table:SM0`

| Veja (Debug Console REPL)[https://code.visualstudio.com/docs/editor/debugging#_debug-console-repl]

![Debug Console](./gifs/DebugConsole.gif)

### Sincronismo de tabelas durante a depuração

![Debug Table Sync](./gifs/TableSync-ShowingTables.gif)

O sincronismo de tabelas pode ser alterado por configuração no executor, usando a chave `enableTableSync`. Por padrão, vem habilitado.

![Debug Table Sync](./gifs/TableSync-EnableTableSyncProperty.gif)

Também é possível alterar essa opção durante o processo de depuração acionando o atalho `CTRL + SHOFT + P`, executando `TOTVS: Toggle table sync`. Note que ao usar esse comando, o parâmetro do executor é alterado, portanto na próxima depuração irá utilizar essa definição.

![Debug Table Sync](./gifs/TableSync-CommandToggleTableSync.gif)

![Debug Table Sync](./gifs/TableSync-CommandToggleChangingProperty.gif)

![Debug Table Sync](./gifs/TableSync-DebugCommands.gif)
