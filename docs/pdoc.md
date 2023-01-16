# TDS: ProheusDOC

> Requisitos

- nenhum

## Objetivo

O objetivo do *ProtheusDOC* é permitir a autodocumentação dos programas-fontes escritos nas linguagens **TOTVS** (AdvPL/4GL).

O *ProtheusDOC*, é uma forma estruturada de escrever comentários, sobre funções, classes, métodos ou qualquer outro elemento de um programa-fonte TOTVS, que descreve a utilização deste elemento.

Essa documentação pode ser exportada em formato HTML ou _Markdown_, para que possa ser publicado.

## Sintaxe

### Completa

```
/*/{Protheus.doc} \<id>
Comentáro sucinto sobre a finalizada do elemento.
@type \<elementType>
...outras marcações ProtheusDOC...
/*/
```

A estrutura completa é formada por um bloco de comentários, iniciado com ``/*/{Protheus.doc} \<id>`` para AdvPL e ``{/{Protheus.doc} \<id>`` para o 4GL, onde ``\<id>`` é o nome do elemento sendo documentado. Na segunda linha do bloco _Protheus.doc_, coloca-se comentário sucinto. Após o comentário, informe a marcação ``@type \<type>``, onde ``\<elementType>``, identifica o tipo do elemento, pois é possível existirem identificadores de funções, métodos, classes, etc. com o mesmo nome. Isso faz-se necessário para indicar o final do comentário sucinto e para que a documentação seja apresentada de forma correta com base no contexto do elemento.

O identificador (``\<id>``) precisa ser exatamente o nome da função ou da classe, ou ainda, na implementações dos métodos de uma classe, devem ser ``\<id da Classe>::\<id do Método>``.

### Simplificada

```
//{PDoc} comentário sucinto sobre o elemento.
```

Em váriaveis, propriedade e prototipação de métodos, pode-se utiliza o modo simplificado do ``PDoc``, que é composto por um comentário simples (uma linha) e será associado ao próximo elemento.

## Exemplos de ProtheusDOC

### Função

```
/*/{Protheus.doc} areaQuad
Efetua o cálculo da área em quadriláteros.
@type function
...outras marcações ProtheusDOC...
/*/
user function areaQuad(nBase, nAltura, nBaseMenor)
...código a ser executado...
```

### Classe: Prototipação

```
/*/{Protheus.doc} TQuadrilateros
Efetua o cálculo da área ou perímetro em quadriláteros.
@type class
...outras marcações ProtheusDOC...
/*/
class TQuadrilateros
    //{pdoc} Tamanho da base do quadrilátero.
    private data base as numeric
    //{pdoc} Altura quadrilátero
    private data altura as numeric
    //{pdoc} Tamanho da base menor, nos trapézios.
    private data baseMenor as numeric

    public method new(base as numeric, altura as numeric) as object
    public method base(nValor as numeric) as numeric
    public method altura(nValor as numeric) as numeric
    public method baseMenor(nValor as numeric) as numeric

    public method area() as numeric
    public method perimetro() as numeric

endClass

### Classe: Implementação

/*/{Protheus.doc} TQuadrilateros::new
Cria o objeto para calcular área e perímetro de quadriláteros.
@type method
@param base, numeric, medida da base do quadrilátero.
@param altura, numeric, medida da altura do quadrilátero.
...outras marcações ProtheusDOC...
@return object, instância do objeto ``TQuadrilateros``.
/*/
method new(nBase as numeric, nAltura as numeric) class TQuadrilateros
    ...code...
return self

/*/{Protheus.doc} TQuadrilateros::base
Recupera o valor atual da propriedade base. Se ``nValue`` for informado, ajusta
o valor da propriedade ``base`` para ``nValue``.
@type method
@param [nValue], numeric, nova medida da base do quadrilátero se informado.
...outras marcações ProtheusDOC...
@return numeric, base do quadrilátero.
/*/
method base(nValor as numeric) as numeric class TQuadrilateros
    ...code...
return ::base

/*/{Protheus.doc} TQuadrilateros::area
Calcula a área do quadrilátero.
@type method
...outras marcações ProtheusDOC...
@return numeric, área do quadrilátero.
/*/
method area() as numeric class TQuadrilateros
    //{pdoc} Resultado da área calculada. -1 indica argumentos inválidos no cálculo.
    local nArea := -1
    ...code...
return nArea
```

> Veja o fonte exemplo [AdvPL](https://) ou [TLPP], assim como a documentação gerada.

## Marcações

As marcações aceitas pelo **ProtheusDOC**, são:


| Marcação | Descrição da marcação
| - | -
| @type	<type-text> | Identifica o tipo do ProtheusDoc que está sendo documentado:
|  | "function" para Funções
|  | "class" para Classes
|  | "method" para Métodos
|  | "property" para Propriedades de classes
|  | "variable" para Variáveis
| @accessLevel \<accessLevel-text> | Nível de acesso necessário.
| @author \<name-text> | Nome do autor.
| @build \<build-text> | Indica qual a versão do servidor requerido.
| @country \<country-text> | Indica que é específico para um país.
| @database \<database-text> | Compatibilidade com base de dados.
| @defvalue \<defvalue-text> | Valor padrão da propriedade/parâmetro.
| @description \<description-text> | Cria uma entrada de descrição para melhor detalhamento da funcionalidade/uso.
| @deprecated \<deprecated-text> | Texto com comentários sobre a depreciação, como por exemplo, motivo e alternativa recomendada ou que pode ser utilizada.
| @example \<example-text> | Cria uma entrada no tópico “Exemplos” no documento final.
| @history \<date-text>,\<username-text>,<description-text> | Cria uma entrada no tópico “Histórico" no documento final, com as alterações efetuadas no código-fonte.
| @sample \<example-text> | O mesmo que ``@example``. 
| @language \<language-text> | Idioma para o qual elemento está customizado.
| @link \<link-text> | Cria uma ligação (_link_) para o _target_ especificado (ver notas). O atributo ``label`` será apresentado ao desenvolvedor no lugar da URI e é opcional. Esta marcação deve ser utilizada como complemento as demais marcações.
| @obs \<obs-text> | Adiciona uma entrada de observação no documento final.
| @param \<parameter-name>\[,\<parameter-type>] \<description> | Adiciona uma especificação de parâmetro (de função ou método), identificando-o como \<parameter-name>. 
| @proptype \<proptype-text> | Indica o tipo da propriedade.
| @protected | Indica que o método deve ser visto com escopo de “não publico”.
| @readonly | Indica que a propriedade é apenas de leitura.
| @return \<return-type> \<description-text> | Especifica o retorno (de função ou método).
| @source \<source-text> | Indica o código fonte.
| @systemOper \<systemOper-text> | Indica qual o sistema operacional requerido.
| @see |<see-text> | Adiciona uma entrada “Veja também”.
| @since \<since-text> | Identifica a partir de quando, uma determinada funcionalidade foi implementada.
| @table \<table-name>\[,...] | Identifica quais tabelas são utilizadas pela classe, método ou função.
| @todo \<todo-text> | Indica uma tarefa a ser realizada.
| @version \<version-text> | Indica para qual versão de produto ou mesmo servidor, que uma determinada funcionalidade requer.

## Extensões recomendadas

- [Protheus.DOC para VS-Code](https://github.com/AlencarGabriel/ProtheusDoc-VsCode)

  Suporte aos recursos e _snippets_ de documentação *Protheus.Doc*.

  ![Protheus.DOC](https://github.com/AlencarGabriel/ProtheusDoc-VsCode/raw/master/images/Example3.gif)
