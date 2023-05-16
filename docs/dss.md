# TDS: Developer Support Subsystem

> Requisitos
>
> - DSS (Developer Support Subsystem)_em execução (inicio automático, em paralelo com o_Language Server_)
> - Resultados podem ser parciais devido ao processo de indexação em andamento

Saiba todas as opções disponíveis em [Code Navigation](https://code.visualstudio.com/docs/editor/editingevolved) e  aqui, breve documentação das opções suportadas em projetos baseados nas linguagens **TOTVS**.

> As opções de acionamento citadas são as configurações padrão do **VS-Code**, podendo ser diferentes em função de reconfiguração efetuada pelo usuário ou outras extensões.
> Todas as opções de navegação também pode ser acionadas via menu de contexto do editor.

| Status | Funcionalidade |
| ------ | -------------- |
| OK     | [Estrura](https://code.visualstudio.com/docs/getstarted/userinterface#_outline-view) |
| OK     | [Trilha](https://code.visualstudio.com/docs/editor/editingevolved#_breadcrumbs) |
| OK     | Visão simbolos |
| [OK](#P1) | [Abrir símbolo pelo nome](https://code.visualstudio.com/docs/editor/editingevolved#_open-symbol-by-name). Prefixo ``@`` ou ``#`` |
| OK   | [Sintaxe destacada](https://code.visualstudio.com/api/language-extensions/syntax-highlight-guide) |
| OK     | [Navegação rápida](https://code.visualstudio.com/docs/editor/editingevolved#_quick-file-navigation) |
| [OK](#P1) | [Ir para definição](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition) |
| OK     | Passagem _mouse_ (_text hover) |
|        | Funcionalidade implementada, porém requer revisão das situações onde há duplicidade do símbolo, |
|        | com ou sem  escopo. |
| OK_(1)_    | [Ir para definição de tipo](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-type-definition) |
| OK_(1)_    | [Ir para implementação](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-implementation) |
| OK     | [Ir para um símbolo](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-symbol) |
| _(2)_    | [Visualizar](https://code.visualstudio.com/docs/editor/editingevolved#_peek) |
| Parado | Cache em memória e/ou disco. |
| Execução | Auto completar. |

|        | Funcionalidades futuras |
| ------ | -------------- |
|        | [Informação](https://code.visualstudio.com/docs/editor/editingevolved#_reference-information) |
|        | Destaque visual para código isolado por ``#ifdef``. |
|        | Strings de tradução (visualização e edição). |

| | Descrição de problemas e comportamentos |
|-| --------------------------------------- |
| | Visão ``Symbols``
| | - agrupar: ``+#include``, ``+#define``?
| | |
| | <a name='P1'></a>- ``ctrl+T``, prefixo ``#`` (busca área de trabalho) |
| | Implementar carga parcial. |
| | Somente elementos públicos? |
| | - funções (incluir static?)
| | - classes
| | - métodos
| | - propriedades
| | - defines
| | Considerar escopo? |
| | |
| | <a name='P2'></a>- ``F12`` e ``alt+F12`` |
| | Considerar escopo? |
| | |
| | - ``#define`` em ch´s padrão não possuem informações de localização. |
| | |
| | - TLPP: a lista de definições abaixo, causa erro ou gera detalhes errôneos. |
| | [TLPP: Tipos nativos](https://tdn.totvs.com/display/tec/Tipos+Nativos) |
| | Local fDec2 := DEC_CREATE( 7233.759119, 21, 20 ) as Decimal |
| | Local aArr2 := {1, 2, 3} as array |
| | Local oObj2 := MyClass():New() as object |
| | Local jJsn2 := JsonObject():New() as Json |
| | Local bBlk2 := {|r,l|r*l} as CodeBlock |
| | Local xVar2 := 4 as variant |
| | Local xVar3 := "Texto" as variant |
| | |
| | - AdvPL/Asp (ignorado para o **DSS**, extensões .aph e .apl)
| | APH passa por um pré-proessamento que gera código AdvPL e este  é repassado ao |
| | pré-processador, que gera o AST, que não bate nada com nada com o fonte original. |
| |
| | |

| Legendas | |
| -------- | - |
| OK | Funcionalidade pronta. |
| Parcial | Parcialmente implementada|
| Execução | Parcialmente implementada, ainda em desenvolvimento. |
| Parado | Parcialmente implementada, mas com  desenvolvimento parado devido a outras ocorrências. |
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
| `off` | O _cache_  desligado. |
| `onMemory` | O _cache_ ligado e em memória. |
| `onDisk` | O _cache_ é armazenado em disco, para uso nas próximas sessões. |
| `onDiskPerFolder` | Por pasta: arquivo de cache por pasta do projeto. (experimental). |
| `onDiskPerFile` | Por arquivo: arquivo de cache por arquivo  do projeto. (experimental). |

A opção ``off``, atuará somente nos fontes abertos para edição e o **DSS** terá  limitações em suas funcionalidades. A ``onMemory``, o _cache_ é mantido em memória, sendo recriado a cada nova sessão de uso do **VS-Code**, com o  **DSS** totalmente funcional, incluindo arquivos não abertos para edição. As demais opções, persistem o _cache_ em disco em bloco único (``OnDisk``) ou múltiplos blocos. Essas diferenças mudam o momento em que o _cache_ é persistido, distribuindo o custo de leitura/gravação (I/O) em disco e minimizando eventuais corrupções dos arquivos.

## <a name="ignore"></a>Ignorar pastas e arquivos

### Definição

`.tdsindexignore` é um arquivo dentro da pasta do projeto (ou sub-pastas) que ignora/impede que os arquivos sejam indexados, lembrando que essa configuração afetará a [navegação em fontes](./dss.md).

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

```text
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

```text
# A pasta ``test`` e suas sub-pastas serão ignoradas.
test

# Arquivos ``dbacess``, seguido de um caracter e em qualquer pasta será ignorado
dbacess?.prw
```

##### ``root/api/.tdsindexignore``

```text
# A pasta ``api`` e  sub-pastas serão ignoradas.

# Exceto o arquivo ``api_my_test.prw``
!api_my_test.prw
```

##### ``root/test/.tdsindexignore``

```text
# Cria uma excessão a regra em ``root/.tdsindexignore``
# Não ignora arquivos iniciados com ``test``
!test*.prw
```
