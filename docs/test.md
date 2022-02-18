# Testes automatizados

> Requisitos

- servidor/ambiente que será usado no teste
- ambiente de testes configurado

## Visão Geral

Os testes automatizados usam a metodologia _End to End_ (_E2E_), ou seja, procuramos testar todo o fluxo de trabalho da extensão, emulando um usuário e procurando representar cenários reais.

Por exemplo, para testar a compilação de fontes, iniciamos o processo com o registro do servidor e vamos avançando em todas as etapas até compilar e testar os resultados da compilação. Se foi completada com sucesso ou não. Quê problemas ocorrem e assim por diante.

Saiba um pouquinho mais em [A Evolução dos testes E2E no Zé Delivery](https://rezenha.ze.delivery/a-evolu%C3%A7%C3%A3o-dos-testes-e2e-no-z%C3%A9-delivery-894ac3781bbf)(Fev/22).

Os testes foram elaborados usando [VSCode Extension Tester](https://github.com/redhat-developer/vscode-extension-tester), desenvolvida pela [RedHat Developer](https://github.com/redhat-developer), cujo foco é testar o [VS-Code](https://code.visualstudio.com/), desenvolvido pela [Microsoft](https://www.microsoft.com).

Os testes da extensão são em _TypeScript_ usando alguns pacotes [npm](https://www.npmjs.com/), sendo os principais [Mocha](https://mochajs.org/api/mocha) e [chai](https://www.chaijs.com/), e usando conceitos de [_Value Object_](https://imasters.com.br/back-end/padroes-de-projeto-value-object), [_Page Object_](https://medium.com/automa%C3%A7%C3%A3o-com-batista/como-utilizar-page-objects-nos-testes-automatizados-com-appium-723468df5bf4) e _Scenario_.

_Scenario_, no contexto dos testes do **TDS-VSCode**, são configurações efetuadas para identificar o servidor alvo, ou pela sua versão (P13, LG, Harpia) ou tipo (Protheus, Logix) e alguns comportamentos. Sua estrutura pode ser vista em [scenario.schema.json](../schema/scenario.schema.json).

## Organização

Os testes estão organizados em sub-pastas da pasta principal ``./test``, conforme a sua funcionalidade/objetivo.

```
test               raiz dos testes
 | e2e             testes _e2e_ e arquivos de uso geral
 | | common        testes comuns a qualquer versão/tipo de servidor
 | | logix         testes somente para servidor do tipo Logix
 | | page-object   arquivos de apoio com as diversas _page objects_ utilizadas
 | | protheus      testes somente para servidor do tipo Protheus
 | | tec           testes somente para servidor do tipo TotvsTec (Harpia)
 | resources       pastas e arquivos de apoio aos testes
 | | compile-key   arquivos _.aut_
 | | patchs        arquivos de pacotes de atualização (_patchs_, _.ptm_)
 | | projecs       arquivos fontes, recursos e definições, em _AdvPL_ ou _4GL_
 | | replay        arquivos de gravação do _TDS Replay_
 | | scenario      arquivos com configurações dos cenários
 | | templayes     arquivos _templates_(_.tpl_)
 | unit            testes unitários
```

As pastas (_common_, _logix_, _protheus_ e _tec_) contém os testes propriamente ditos, identificados pelo sufixo ``-test.ts`` com a sequinte estrutura básica:

```
(folder)
  | NN-short-name  sendo _NN_, sequência de execução do teste e
  |                _short-name_, identificando o quê/objetivo do teste
  |                Pode haver quantas forem necessárias
  | git            testes originados de chamados _GitHub_
  | jira           testes originados de chamados _Jira_
```

## Configuração do ambiente de testes

1. Atualize os arquivos da extensão.
2. Na linha de comando e na pasta principal do projeto, execute ``npm i``  ou ``npm ci``.
   Os pacotes _npm_ necessários já estão identificados nas sessões de dependências e serão instalados, junto com demais depedências.
3. Execute o _script npm_ ``test-setup``.
   Serão baixados alguns pacotes, inclusive a última versão do _VSCode_, na pasta ``../temp``.
   Também será gerado e instalado um _visx_ usando as configurações e fontes da extensão.

> Ao efetuar modificações nos fontes da extensão, faz-se necessário reexecuar a configuração do ambiente ou gerar um novo _vsix_ e instalá-lo (``extest install-vsix``).
> Caso deseje testar um _vsix_ já publicado ou depender da instalação de outras extensões, após executar ``test-setup``, instale-o usando ``install-from-marketplace [options] <id> [ids...]``.

## Executando testes

1. Escolha (ou crie) um arquivo de cenário na pasta _./test/scenario_.
2. Revise-o ajustando as propriedades se necessário.
3. Acione a execução através do _script npm_ (crie se necessário na sessão ``--SCENARIO--``). Os _scripts_ de execução ``--TEST--`` são voltados para execuções em ambientes de _CI_, portanto, se moodificados não devem ser enviados ao _GitHub_.
   Para sistemas operacionais _*nix*_, defina o cenário a ser executado via comando ``export`` no lugar de ``set``

> As alterações na pasta ``test`` e suas sub-pastas, são compiladas antes de qualquer teste.
> Ao executar os testes, as vezes este não é iniciado devido a demora em o _VSCode_ "organizar" _caches_ (ou algo similitar). Caso ocorra, execute mais vezes, principalmente em máquinas mais lentas.

## Limitações

Os testes podem apresentar erros quando executados todos em apenas uma chamada. Isso porquê ainda há algumas falhas não detectadas no encerramento e/ou inicialização dos testes. Como palitiavo, recomenda-se a execução em blocos, alterando o último parâmetro, em um dos _scripts npm_ ``test:*`` ou um dos na sessão ``--SCENARIO--``.

- Original:
  ``"test:common": "set SCENARIO=protheus && npm run test -- './out-test/**/common/**/*test.js'"``
- Bloco:
  ``"test:common": "set SCENARIO=protheus && npm run test -- './out-test/**/common/02**/*test.js'"``

Neste exemplo, será executados todos os testes que encomtram-se na pasta sub-pasta com sufixo ``02`` da pasta ``commmom``.

Também pode-se executar um teste específico, editando-se o arquivo fonte e adicionando `.only` na descrição (`describe`) do teste.

```
describe.only("Debug primitive variables", async () => {
  let workbenchPO: WorkbenchPageObject;
  let debugPO: DebugPageObject;
  let serverTreePO: ServerViewPageObject;
  let editor: TextEditorPageObject;
  ...
```
