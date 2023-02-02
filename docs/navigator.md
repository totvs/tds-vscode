# TDS: Navegador de código

> Requisitos
>
> - DSS (Developer Support Subsystem)_ em execução (inicio automático, em paralelo com o _Language Server_)
> - Resultados podem ser parciais devido ao processo de indexação em andamento

Saiba todas as opções disponíveis em [Code Navigation](https://code.visualstudio.com/docs/editor/editingevolved) e  aqui, breve documentação das opções suportadas em projetos baseados nas linguagens **TOTVS**.

> As opções de acionamento citadas são as configurações padrão do **VS-Code**, podendo ser diferentes em função de reconfiguração efetuada pelo usuário ou outras extensões.

> Todas as opções de navegação também pode ser acionadas via menu de contexto do editor.

| Status | Funcionalidade |
| ------ | -------------- |
| OK | [Estrura](https://code.visualstudio.com/docs/getstarted/userinterface#_outline-view) |
| | Funcionalidade passou a ser executada pelos LS. |
| OK | Passagem _mouse_ (_text hover) |
| | Funcionalidade implementada, porém requer revisão das situações onde há duplicidade do símbolo, com ou sem  escopo. |
| OK | [Navegação rápida](https://code.visualstudio.com/docs/editor/editingevolved#_quick-file-navigation) |
| OK | [Trilha](https://code.visualstudio.com/docs/editor/editingevolved#_breadcrumbs) |
| OK | [Ir para definição](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition) |
| (1) | [Ir para definição de tipo](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-type-definition) |
| (1) | [Ir para implementação](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-implementation) |
| OK | [Ir para um símbolo](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol) |
| NI | [Abrir símbolo pelo nome](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name) |
| OK | [Visualizar](https://code.visualstudio.com/docs/editor/editingevolved#_peek) |
| (2) | [Informação](https://code.visualstudio.com/docs/editor/editingevolved#_reference-information) |
| Execução | [Sintaxe destacada](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) |
| | Envolve o tratamento de arguivo de definição (.CH). |
| Parado | Cache em disco. |

| Legendas | |
| -------- | - |
| OK | Funcionalidade pronta. |
| Execução | Parcialmente implementada, ainda em desenvolvimento. |
| Parado | | Parcialmente implementada, mas com  desenvolvimento parado devido a outras ocorrências. |
| NI | Funcionalidade não implementada. |
| (1) | Ainda a ser definido o comportamento, pois em vários casos não há como diferenciar definição/implementação. |
| (2) | Parcialmente implementado. Ainda pode apresentar falhas. |

## [Navegação rápida](https://code.visualstudio.com/docs/editor/editingevolved#_quick-file-navigation)

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

> Limitações:
- Em classes, a operação funciona somente no fonte da própria classe com o operando ``::`` ou ``self:``;

## [Passagem de mouse](https://code.visualstudio.com/api/language-extensions/programmatic-language-features#show-hovers)

**Acionamento:** Passe o ponteiro do mouse sobre o item a ser visualizado.

> Você pode ativar ou desativar a passagem de mouse em ``View > Text Editor > Hover: Enabled`` ou mudar o formato de apresentação em ``File > Preference > Settings > Extension > TOTVS > Totvs Language Server > Editor: Hover``.

## [Mostrar definições de um símbolo](https://code.visualstudio.com/api/language-extensions/programmatic-language-features#show-definitions-of-a-symbol)

**Acionamento:** ``Ctrl+<passagem ponteiro do mouse>`` sobre o item a ser visualizado. Se este ficar destacado com um sublinhado, pode ir para definição acionando ``Ctrl+<acionamento do mouse>``.

## [Ajuda com assinatura em funções (_signature help_)](https://code.visualstudio.com/api/language-extensions/programmatic-language-features#help-with-function-and-method-signatures)

Em implementação.

**Acionamento:** Automático ao acionar ``(`` após um identificador.

> Funciona apenas para funções, cujo fonte esteja no seu projeto ou para funções AdvPL binárias (definidas direto no _AppServer_).

## <a name="cache"></a>Cache de navegação

Por padrão, a extensão utiliza um _cache_ em memória, que é gerado na inicialização da extensão.
Em alguns casos, pode ser interessante manter esse _cache_ entre sessões, ou seja, ter um _cache_ persistente.

Para ajustar o comportamento acesse ``File > Preference > Settings``, filtre por ``totvsLanguageServer.editor`` e localize ``Totvs Language Server › Editor › Index: Cache``, configurando o comportamento:

| Opção | Comportamento |
| `None` | Desabilita _cache_ em disco (padrão) |
| `JSON` | O _cache_ é gravado em formato (JSON)[https://www.alura.com.br/artigos/o-que-e-json?gclid=Cj0KCQjwkt6aBhDKARIsAAyeLJ24a_dm9QADJrPo6TAG1kzC9y-E13cp5hSu3XKMoQoJmtRcYTI7__IaAjHvEALw_wcB] |
| `package` | O _cache_ é gravado em modo binário (proprietário) |

## <a name="ignore"></a>Ignorar pastas e arquivos

### Definição

`.tdsindexignore` é um arquivo dentro da pasta do projeto (ou sub-pastas) que ignora/impede que os arquivos sejam indexados, lembrando que essa configuração afetará a [navegação em fontes](./navigator.md).

O uso do `.tdsindexignore` é similar aos usados em outras extensões/aplicativos, p.e. `.gitignore`, `.vscodeignore` e outros.

### Sintaxe

- O `.tdsindexignore` pode ser colocado em qualquer pasta ou sub-pastas, sendo que será aplicado de forma recursiva na pasta e sub-pastas, onde esta armazenado;

- Cada linha do arquivo, é formado por uma _string_ que representa o padrão de nome de pastas e arquivos que serão ignorados ou não. Para formar o padrão, use:

| Curinga | Uso |
| - | - |
| `?` | Um caracter desconhecido. |
| `*` | Um ou mais caracteres desconhecidos. |
| `.` | Pasta corrente. |
| `!` | Nega a expressão, forçando o processamento do arquivo. |
| `@` | Expressão regular [`Perl`](https://perldoc.perl.org/perlre). |

> A aplicação dos padrões de seleção não são sensíveis a caixa (maiúsculas e minúsculas).

> Informe primeiro as regras mais restrivas.

> Ao colocar o arquivo ``.tdsindexignore`` em uma pasta, este será aplicado na pasta onde foi criado e em suas sub-pastas.

> Linhas em branco não tem efeito

> Evite usar nomes acentuados.

### Exemplos

#### Área de trabalho
```
root
  \- api
  |  |- .tdsindexignore
  |  |- api_product.prw
  |  |- api_customer.prw
  |  |- api_order.prw
  |  |- api_my_test.prw
  |  |- dbacess1.prw
  |  |- dbacess2.prw
  \- app
  |  |- app.prw
  |  |- utils.prw
  |  |- dbacess1.prw
  |  |- dbacess2.prw
  |  |- app_my_test.prw
  \- test
  |  | .tdsindexignore
  |  \- unit
  |  |  |- test_product.prw
  |  |  |- test_customer.prw
  |  |  |- test_order.prw
  |  \- integration
  |     |- customer.prw
  |     |- product.prw
  |     |- order.prw
  |- .tdsindexignore
```

##### ``root/.tdsindexignore``
```
# A pasta ``test`` e suas sub-pastas serão ignoradas.
test

# Arquivos ``dbacess``, seguido de um caracter e em qualquer pasta será ignorado
dbacess?.prw
```

##### ``root/api/.tdsindexignore``
```
# A pasta ``api`` e  sub-pastas serão ignoradas.
.

# Exceto o arquivo ``api_my_test.prw``
!api_my_test.prw
```

##### ``root/test/.tdsindexignore``
```
# Cria uma excessão a regra em ``root/.tdsindexignore``
# Não ignora arquivos iniciados com ``test``
!test*.prw
```
