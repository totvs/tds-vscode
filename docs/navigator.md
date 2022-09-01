# TDS: Navegador de código

> Requisitos
>
> - _Code Service_ em execução (inicio automático, em paralelo com o _Language Server_)
> - Resultados podem ser parciais devido ao processo de indexação em andamento

Saiba todas as opções disponíveis em [Code Navigation](https://code.visualstudio.com/docs/editor/editingevolved) e somente as aqui documentadas se aplicam aos projetos baseados nas linguagens **TOTVS**.

> As opções de acionamento citadas são as configurações padrão do **VS-Code**, podendo ser diferentes em função de reconfiguração efetuada pelo usuário ou outras extensões.

> Todas as opções de navegação também pode ser acionadas via menu de contexto do editor.

## [Navegação rápida de arquivos](https://code.visualstudio.com/docs/editor/editingevolved#_quick-file-navigation)

**Acionamento:** ``Ctrl+P`` ou ``F1`` (iniciar com vazio) e comece a digitar o filtro para nome do arquivo.

## [Abrir símbolo por nome](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name)

**Acionamento:** ``Ctrl+T`` ou ``F1`` (iniciar com ``#``) e comece a digitar o filtro para nome da função (desconsiderar o escopo).

## [Ir para definição](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)

**Acionamento:** ``Ctrl+Click`` ou ``Ctrl+Click+Alt`` ou ``F12`` sobre uma chamada de função ou variável.

## [Procurar/ir para referência](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)

**Acionamento:** ``Shift+F12`` sobre uma chamada de função ou variável.

## [Visualizar](https://code.visualstudio.com/docs/editor/editingevolved#_peek)

**Acionamento:** ``Alt+F12`` sobre uma chamada de função ou variável.

## [Procurar Pedido de Referências](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#textDocument_references)

**Acionamento:** ``Shift+F12`` sobre o item a ser procurado.
