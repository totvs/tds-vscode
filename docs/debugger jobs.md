# TDS: Depuração de serviços (_jobs_, _webservice_, _rest_, _rpc_ e assemelhados)

| A principal característica de um serviço, é que a sua execução não esta diretamente relacionada a interface com o usuário (_SmartClient_) e normalmente, é executado em segundo plano pelo _appServer_.

> Requisitos
> - conhecimento da configuração e do processo de [depuração e execução](docs/debugger.md).

> Recomendações
> - **NUNCA** faça depuração em ambiente de produção
> - Não use _appServer_ compartilhado com terceiros, mesmo que ambientes diistintos
> - Prefira sempre um ambiente local


> Certique-se que:
>
> - o serviço que será depurado esteja pronto para execução quando solicitado;

## Preparação

### Primeira Forma

| Esta forma foi mantidade para quem já esta habituado com o processo do *TDS-Eclipse* ou para serviços que são inicializados quando requisitados.

1. Abra o arquivo ``.vscode\launch.json``;
1. Localize a definição de executor que será utilizada e adicione a chave ``"enableMultiThread": true``;
1. No arquivo de configuração do _appServer_ (``ini``), na sessão [OnStart]
  - aaaaa


### Segunda Forma

| Esta forma foi implementada para faciliar a inicialização de serviços que não são inicializados quando requisitados.

- Serviços que necessitam de inicialização manual
  * Serviços REST




## Exemplos

### Configuração do ``.vscode\launch.json``

```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "totvs_language_debug",
			"request": "launch",
			"name": "SC 19.3.0.6",
			"program": "${command:AskForProgramName}",
			"cwb": "${workspaceFolder}",
			"smartclientBin": "M:/protheus/smartClient/19-3-0-6/smartclient.exe",
			"isMultiSession": true,
			"enableTableSync": true,
			"enableMultiThread": true
		}
    ...
	],
	"lastPrograms": [
    ...
	],
...
}
```


- Coloque um ponto de parada que será executado quando o serviço for requisitado
- Inicie a depuração executando qualquer função do _RPO_ para que mantenha um conexão do depurador com o _appServer_
- Acione o serviço por fora do **VS-CODE**, por exemplo executando o `SmartClient`, requisição (http, rest, etc)
- Quando a depuração parar no ponto indicado, prossiga com a depuração normalmente

