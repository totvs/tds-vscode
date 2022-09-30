# TDS: Navegador de código

> Requisitos
>
> - _Code Service_ em execução (inicio automático, em paralelo com o _Language Server_)
> - Resultados podem ser parciais devido ao processo de indexação em andamento

Saiba todas as opções disponíveis em [Code Navigation](https://code.visualstudio.com/docs/editor/editingevolved) e somente as aqui documentadas se aplicam aos projetos baseados nas linguagens **TOTVS**.

> As opções de acionamento citadas são as configurações padrão do **VS-Code**, podendo ser diferentes em função de reconfiguração efetuada pelo usuário ou outras extensões.

> Todas as opções de navegação também pode ser acionadas via menu de contexto do editor.

## [Navegação rápida de arquivos](https://code.visualstudio.com/docs/editor/editingevolved#_quick-file-navigation)

**Acionamento:** ``Ctrl+P`` ou ``F1`` (iniciar com vazio) e inicie a digitação para o filtro por nome do arquivo.

## [Trilha](https://code.visualstudio.com/docs/editor/editingevolved#_breadcrumbs)

**Acionamento:** Você pode ativar ou desativar a trilha via ``View > Show Breadcrumbs`` ou com a configuração ``breadcrumbs.enabled``.

## [Ir para definição](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)

**Acionamento:** ``Ctrl+Click`` (abre) ou ``Ctrl+Alt+Click`` (abre ao lado) ou ``F12`` sobre uma chamada de função ou variável.

## [Ir para um símbolo](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol)

**Acionamento:** ``Ctrl+Shift+O`` e inicie a digitação para o filtro por nome do simbolo.

## [Abrir símbolo por nome](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name)

**Acionamento:** ``Ctrl+T`` ou ``F1`` (iniciar com ``#``) e inicie a digitação para o filtro por nome do símbolo.

## [Procurar/ir para referência](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)

**Acionamento:** ``Shift+F12`` sobre uma chamada de função ou variável.

## [Visualizar](https://code.visualstudio.com/docs/editor/editingevolved#_peek)

**Acionamento:** ``Alt+F12`` sobre uma chamada de função ou variável.

## [Passagem de mouse (_hover_)](https://code.visualstudio.com/api/language-extensions/programmatic-language-features#show-hovers)

**Acionamento:** Passe o ponteiro do mouse sobre o item a ser visualizado.

| Você pode ativar ou desativar a passagem de mouse em ``View > Text Editor > Hover: Enabled`` ou mudar o formato de apresentação em ``View > Extension > TOTVS > Totvs Language Server > Editor: Hover``.