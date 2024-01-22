# ProtheusDOC

É uma forma estruturada de escrever comentários, sobre funções, classes, métodos ou qualquer outro elemento de um programa-fontes Adv/PL ou 4GL, de forma a autodocumenta-lo.

A estrutura básica é formada por um bloco de comentários, com o  identificador ``/*/{Protheus.doc}`` para o Adv/PL e ``{/{Protheus.doc}`` para o 4GL, seguido de seu identificador, um comentário suscinto, seguido pelo seu tipo (``@type``) e opcionalmente por outros marcadores.

A marcação de tipo (``@type``) é obrigatória, pois é possível existirem nomes de funções, métodos, classes, etc. duplicados e é necessário diferenciá-los.

Observe que o identificador precisa se exatamente o nome da função ou o nome da classe, em caso de serem funções ou classes, respectivamente, ou o nome da classe seguido pelo nome do nome do método separados por ``:`` em caso de métodos de uma classe, por exemplo ``nomeDaClasse:New``.

> Todas as marcações são documetais, não interferindo na compilação ou execução.

## Estrutura geral

```code
/*/{Protheus.doc} <id>
<summary>
@type <typeDoc>
<mark, ...>
/*/
```

## Ordem recomendada

As marcações podem ser informadas em qualquer ordem e são opcionais (exceto *@type*), porém recomenda-se a ordem abaixo e somente as que possuem valor relevante. A ausência de uma marcação indica que não se aplica ou que não há restrição no uso na funcionalidade.

```code
/*/{Protheus.doc} <id>
<summary>
@type <typeDoc>
<marcação @description>
<marcação @params>
<marcação @return>
<demais marcações, que não aceitam multiplas linhas>
<demais marcações, que aceitam multiplas linhas>
/*/
```

| Evitar (exemplos) | Usar |
| ----------------- | ---- |
| @version (sem restrição) | @version appServer 20.3.0.13 |
| @language todas | @language pt-br |
| @since desde que foi criado | @since lib ??????????? |
| @database homologados pelo DBAccess | @database MS-SQL, Oracle |

## Marcações

As marcações aceitas pelo ProtheusDOC são:

## Marcações únicas

São marcações utilizadas apenas uma vez por bloco do **ProtheusDOC.**.

> Parâmetros com o sufixo ``-text`` podem ser composto de uma ou mais linhas, até uma nova marca ou fim do bloco ProtheusDOC. Os demais parâmetros devem ser informados na mesma linha da marcação.

| Marcação | Parâmetros | Descrição |
| -------- | ---------- | --------- |
| @type    | type       | Identifica o tipo do ProtheusDOC que está sendo documentado. Use: |
|          |            | "[scope] function" para Funções. |
|          |            | "class" para Classes. |
|          |            | "method" para Métodos. |
|          |            | "property" para Propriedades.|
|          |            | "variable" para Variáveis |
| @accessLevel | accessLevel | Nível de acesso requerido. |
| @author | name  | Texto com o nome do autor. |
| @build | build | Indica qual a versão do servidor requerido. Similar a ``@version``. |
| @country | country | Indica para qual país o elemento foi programado. |
| @database | database | Indica para qual base de dados o elemento foi programado. |
| @deprecated | [deprecated] | Indica que o elemento foi depreciado e pode ser haver comentários sobre a depreciação, p.e. o motivo e/ou alternativa que deve ser utilizada. |
| @description | description-text | Cria uma entrada de descrição para melhor detalhamento da funcionalidade.

## Marcações múltiplas

São marcações utilizadas quantas vezes forem necessárias por bloco do ProtheusDOC.

| Marcação | Parâmetros | Descrição |
| -------- | ---------- | --------- |
| @example | example-text | Cria uma entrada com exemplo de uso. O conteúdo será considerado como código-fonte. |
| @history | date username description-text | Histórico de alterações no código-fonte, com data da modificação (*date*), identificador para o usuário de uma palavra ou separadas por um ponto (*username*) e  descreva de forma suscinta a modificação (*description-text*). |
| @language | language | Idioma para o qual elemento foi desenvolvido. |
| @link | \(label\)link | Cria uma ligação (*link*) para o alvo especificado (ver notas). O atributo *label* será apresentado ao desenvolvedor no lugar da URI e é opcional. |
| @obs | obs-text | Adiciona uma entrada de observação. |
| @param | parameter-name [, parameter-type] [ description-text] | Adiciona a especificação de parâmetro (de função ou método), identificando-o como *parameter-name*, o tipo e descrição/uso do parâmetro. |
| @private | |  Indica que o método deve ser visto com escopo de “não publico”.
| @protected | |  Indica que o método deve ser visto com escopo de “não publico”.
| @readonly | | Indica que a propriedade é apenas de leitura. |
| @return | type [, description-text ] | Especifica o tipo do retorno (função ou método), com  descritivo do retorno (opcional). |
| @sample  | example-text | O mesmo que a marcação  ``@example``.
| @see | \(label\)link | Adiciona uma entrada “Veja também”. |
| @since | since | Identifica a partir de quando, uma determinada funcionalidade foi implementada. |
| @systemOper | systemOper | Indica para qual sistema operacional foi desenvolvido. |
| @table | table-name [, another-table-name ] | Identifica quais tabelas são utilizadas pela classe, método ou função. |
| @todo | todo-text | Identifica uma tarefa a ser realizada. |
| @version | version-text | Indica para qual versão de produto ou mesmo servidor, que uma determinada funcionalidade requer ou foi disponibilizada. |

## ``//{pdoc}``, ProtheusDOC em linha

>
> Recurso em processo de implementação.
> Pode apresentar erros de processamento ou mesmo não ser processada.
>

O ProtheusDOC em linha deve ser utilizado somente em declarações de propriedades e variáveis, sendo escrito de forma condensada usando a sintaxe:

> Marcações de uso  exclusivo em ProtheusDOC em linha.

| Marcação | Parâmetros | Descrição |
| -------- | ---------- | --------- |
| @defvalue | value  | Indica o valor padrão da propriedade/variável. |
| @objType  | classname | Nome da classe do objeto. |

```code
//{pdoc} [<mark>] <content>
```

Onde, ``<mark>`` (opcional) é qualquer uma das marcações do ProtheusDOC e ``<content>`` o parâmetro associado a marcação, exceto que somente a primeira linha é reconhecida como válida. Essa documentação reduzida será aplicada a próxima declaraão de propriedade (``data`` e equivalentes) ou variável (``local`` e equivalentes).

Se ``<mark>`` for omitido, ``content`` será utilizado como descrição do elemento.

## Exemplos

### Em função

```code
/*/{Protheus.doc} areaQuad
Efetua o cálculo da área de alguns quadriláteros.
@type user function
@author José Silva
@since 20/11/2012
@version P10 R4
@param nBase, numérico, Medida do lado ou da base
@param [nAltura], numérico, Medida da altura
@param [nBaseMenor], numérico, Medida da base menor (trapézios)
@return numérico, Área calculada
/*/
user function areaQuad(nBase, nAltura, nBaseMenor)
  //{pdoc} Tamanho da base do quadrilátero, usado como acumulador.
  local nAux
...
```

### Em classe

```code
/*/{Protheus.doc} TQuad
Efetua o cálculo da área ou perímetro em quadriláteros.
@type    class
@version P12
@author  acandido
@since   05/09/2022
/*/
class TQuad
    //{pdoc} Tamanho da base do quadrilátero.
    //{pdoc} @propType numeric
    data base
...
    //ProtheusDOC de métodos devem ser efetuados na implementação.
    method new(base, altura)
...
endClass

/*/{Protheus.doc} TQuad::new
Cria o objeto para calcular área e perímetro de quadriláteros.
@type method
@author  acandido
@param base, numeric, medida da base do quadrilátero.
@param altura, numeric, medida da altura do quadrilátero.
@return object, instância do objeto ``TQuad``.
/*/
method new(nBase, nAltura) class TQuad
...
return

/*/{Protheus.doc} TQuad::altura
Recupera o valor atual da propriedade ``altura``. Se ``nValue`` for informado, ajusta
o valor da propriedade ``altura`` para ``nValue``.
@type method
@author  acandido
@param [nValue], numeric, nova medida da altura do quadrilátero se informado.
@return numeric, altura do quadrilátero.
/*/
method altura(nValor) class TQuad
  if (valtype(nValor) == "N")
    ::altura = nValor
  endif
return ::altura
...

/*/{Protheus.doc} TQuad::perimetro
Calcula o perimetro do quadrilátero (somente quadrados e retângulos).
@type method
@author  acandido
@return numeric, perimetro do quadrilátero.
/*/
method perimetro() class TQuad
    //{pdoc} Resultado do perimetro calculado. -1, indica parâmetro inválido
    local nPerimetro := -1
...
return

user function tst_quad()
    //{pdoc} Inicializa o objeto com a classe de cáculos com quadrilateros.
    //{pdoc} @objType TQuad
    local quadrilatero := TQuad():new()
    //{pdoc} Esta marcação é valida para todas as variáveis declaradas abaixo.
    local x,y,z

    conout(quadrilatero:perimetro())

return
```

No exemplo acima, em *user function tst_quad*, a declaração da variável ``quadrilatero`` foi precedida da marcação ``@objType``, que será utilizada como informação pelos assistentes de código.

## Boas práticas

> Complemento ao [Adv/PL: Boas práticas](good-practices-advpl.md) e [4GL: Boas práticas](good-practices-4gl.md).

Segue práticas recomendadas:

### Geral

- Sumário (``<summary>``) deve ser suscinto e ter até 3 linhas (210 caracteres).
- As marcações devem seguir a ordem de sua relevância, conforme [Marcações](#marcações).
- Marcações ``HTML`` devem se evitadas em parâmetros textos e não ser utilizadas nas demais.
- Marcações ``markdown`` são liberadas em qualquer conteúdo, exceto se explicito valores para o parâmetro.
- Pode-se usar linhas em branco para melhor legibilidade, mas estas podem ser ignoradas na aparesnetação para o usuário.
- Em marcações que aceitam múltiplas linhas, recomenda-se informar no 1a parágrafo, informações de maior relevância e nos demais os detalhes.

### Documentar sempre

- Funções com escopo público
- Classes
- Propriedades
- Métodos
- Variáveis com escopo público

### Devem ser documentadas

- Funções com escopo estático (``static function``), se relevantes no código.
- Variáveis com escopo local (``local``) ou estático (``static``), se relevantes no código.
- Variáveis com escopo privado ( ``private``), devido a visibilidade para funções chamadas a partir de sua definicição.
- Variáveis com objetos (enriquece com informações o [DSS](dss.md).
