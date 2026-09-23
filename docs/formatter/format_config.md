# TDS: Formatação de Código Fonte

> Requisitos
>
> - formatação ativada

## Configuração

> O motor de formatação, pode ser executado na _extensão_ ou no _LS_.
>
> A formatação no LS é _experimental_. Por padrão o motor é executado na extensão e para usar o novo motor, ajuste em `settings.josn` a chave:

```json
{
  totvsLanguageServer.formatter.provider=ls
}
```

Por padrão, a formatação de código fonte vem **desligado**. Para ligá-lo acesse `File | Preferences | Settings` e localize `4gl` ou `advpl`, conforme a linguagem de programação que deseja configurar.

Lhe será apresentado algo semelhante a:

![4GL settings](format_settings.png)

> Saiba mais sobre precedência de configurações em [User and Workspace Settings](https://vscode.readthedocs.io/en/latest/getstarted/settings/).

O bloco `[4gl]` (ou `[advpl]`), são configurações ligadas a ativação dos processos pelo _VS-Code_ associadas ao editor da linguagem e `[4gl.formatter]` (ou `[advpl.formatter]`), são as opções de formatação específicas.

Para sobrescrever os valores padrão, acione `Edit in settings.json`.

> Saiba mais em [Formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting) e [Indentation](https://code.visualstudio.com/docs/editor/codebasics#_indentation).

### Configurações `[4gl]` ou `[advpl]`

- `"files.encoding": "windows1252" | "windows1251"`

  Indica a codificação dos arquivos com código fonte. A codificação `windows1251` deve ser utilizada em fontes com _strings_ no alfabeto cirílico.

- `"editor.formatOnType": true | false`

  Habilita a formatação durante a digitação.

- `"editor.formatOnPaste": true | false`

  Habilita a formatação em blocos colados.

- `"editor.formatOnSave": true | false`

  Habilita a formatação ao salvar o arquivo.

- `"editor.formatOnSaveMode": "file" | "modifications"`

  Indica o modo de formatação ao salvar o arquivo.

- `"editor.insertSpaces": auto | false | true`

  Controla se o editor irá inserir espaços para tabulações. Se definido como `auto`, o valor será determinado com base no arquivo aberto.

- `"editor.tabSize": auto | number`

  Controla o tamanho de renderização da tabulação. Se definido como `auto`, o valor será determinado com base no arquivo aberto.

- `"files.trimTrailingWhitespace": false | true`

  Habilita a remoção de caracteres não significativos ao final da linha.

### Configurações `4gl.formatter` ou `advpl.formatter`

Chaves específicas para formatação de fontes 4GL e AdvPL.

| Chave                                                  | Uso                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| alignAssignments (`boolean`)                           | Alinha operadores de atribuição (`:=`, `+=`, `-=`, `*=`, `/=`, `%=`) em blocos. Padrão: false  |
| blankLinesBetweenTopLevelDeclarations (`number`)       | Quantidade de linhas em branco entre declarações de topo. Padrão: 1                            |
| commentReflow (`boolean`)                              | Permite reorganizar comentários longos. Padrão: false                                          |
| convertSemiGraphicsToChar (`boolean`)                  | Converte caracteres semi-gráficos (CP437) em caracteres ASCII equivalentes. Padrão: false      |
| keywordsCase <upper \| lower \| upperCamel \| ignore>  | Coloca as palavras-chave da linguagem na caixa indicada. Padrão: (4GL) upper / (AdvPL) ignore  |
| maxConsecutiveBlankLines (`number`)                    | Máximo de linhas em branco em sequência. Padrão: 1                                             |
| maxLineLength (`number`)                               | Largura máxima de linha para aplicar quebra automática. Padrão: 120                            |
| normalizeCalls (`boolean`)                             | Normaliza chamadas removendo espaço entre identificador e parêntese de abertura. Padrão: false |
| operatorSpacing (`boolean`)                            | Normaliza espaçamento em operadores. Padrão: false                                             |
| preserveSingleLineBlocks (`boolean`)                   | Preserva blocos de uma única linha. Padrão: false                                              |
| spaceAfterComma (`boolean`)                            | Garante espaço após vírgulas. Padrão: false                                                    |
| spaceInsideParentheses (`boolean`)                     | Controla espaços dentro de parênteses. Padrão: false                                           |
| stringStyle <double-quotes \| single-quotes \| ignore> | Indica como as _strings_ devem ser informadas. Padrão: ignore                                  |
| trimFinalNewlines (`boolean`)                          | Remove linhas em branco no final do arquivo. Padrão: true                                      |
| trimTrailingWhitespace (`boolean`)                     | Remove espaços em branco no final da linha. Padrão: true                                       |
| wrapArguments (`auto` \| `true` \| `false`)            | Controla quebra de linha de argumentos. Padrão: false                                          |
| wrapParameters (`auto` \| `true` \| `false`)           | Controla quebra de linha de parâmetros. Padrão: false                                          |

### Exemplo com os valores padrão

> Arquivo `settings.json`

```JSON
{
  ...,
  "[advpl]": {
    "files.encoding": "windows1252",
    "editor.formatOnType": false,
    "editor.formatOnPaste": false,
    "editor.formatOnSave": false,
    "editor.formatOnSaveMode": "file",
    "editor.tabSize": 4,
    "editor.insertSpaces": false,
    "files.trimTrailingWhitespace": false,
  },
  "[4gl]": {
    "files.encoding": "windows1252",
    "editor.formatOnType": false,
    "editor.formatOnPaste": false,
    "editor.formatOnSave": false,
    "editor.formatOnSaveMode": "file",
    "editor.tabSize": 4,
    "editor.insertSpaces": false,
    "files.trimTrailingWhitespace": false,
  },
  "4gl.formatter": {
    "maxConsecutiveBlankLines": 1,
    "maxLineLength": 120,
    "wrapParameters": false,
    "wrapArguments": false,
    "keywordsCase": "upper",
    "stringStyle": "ignore",
    "operatorSpacing": false,
    "spaceAfterComma": false,
    "spaceInsideParentheses": false,
    "convertSemiGraphicsToChar": false,
    "alignAssignments": false,
    "normalizeCalls": false,
    "preserveSingleLineBlocks": false,
    "trimFinalNewlines": true,
    "blankLinesBetweenTopLevelDeclarations": 1,
    "commentReflow": false,
    "trimTrailingWhitespace": true
  },
  "advpl.formatter": {
    "maxConsecutiveBlankLines": 1,
    "maxLineLength": 120,
    "wrapParameters": false,
    "wrapArguments": false,
    "keywordsCase": "ignore",
    "stringStyle": "ignore",
    "operatorSpacing": false,
    "spaceAfterComma": false,
    "spaceInsideParentheses": false,
    "convertSemiGraphicsToChar": false,
    "alignAssignments": false,
    "normalizeCalls": false,
    "preserveSingleLineBlocks": false,
    "trimFinalNewlines": true,
    "blankLinesBetweenTopLevelDeclarations": 1,
    "commentReflow": false,
    "trimTrailingWhitespace": true
  }
  ...,
}
```

## Exemplos AdvPL por configuração

> Os exemplos abaixo consideram a formatação executada pelo **Language Server
> (LS)**, ou seja, com `totvsLanguageServer.formatter.provider=ls`. Demonstram o
> efeito de **cada opção de `advpl.formatter` isoladamente**; em cada caso, as
> demais opções estão nos valores padrão.

### Reindentação por blocos (sempre aplicada)

O LS reindenta os blocos conforme a estrutura da linguagem (`Function`,
`If/EndIf`, `For/Next`, `While/EndDo`, `Do Case/EndCase`, `Try/Catch`,
`BeginSql/EndSql`, `WsRestful/WsMethod`, etc.), usando `editor.tabSize` e
`editor.insertSpaces` do bloco `[advpl]`. Linhas terminadas em `;` marcam
continuação e recebem um nível extra de indentação na linha seguinte.

Antes:

```advpl
Function Exemplo()
Local nI := 0
For nI := 1 To 10
If nI > 5
ConOut(nI)
EndIf
Next
Return
```

Depois (com `tabSize: 4`, `insertSpaces: true`):

```advpl
Function Exemplo()
    Local nI := 0
    For nI := 1 To 10
        If nI > 5
            ConOut(nI)
        EndIf
    Next
Return
```

### `alignAssignments` (`boolean`, padrão `false`)

Alinha o operador de atribuição em grupos de duas ou mais linhas consecutivas
com a mesma indentação. Os operadores reconhecidos são os de dois caracteres:
`:=`, `+=`, `-=`, `*=`, `/=` e `%=`. **Cada linha mantém o seu próprio
operador** — apenas a _coluna_ do operador é alinhada, usando como referência o
maior lado esquerdo (LHS) do grupo. Após o LHS é inserido um espaço, o operador
original e mais um espaço antes do valor.

```json
{ "advpl.formatter": { "alignAssignments": true } }
```

Antes:

```advpl
nX := 1
nTotal += 100
cNome := "TOTVS"
nPerc /= 2
```

Depois:

```advpl
nX     := 1
nTotal += 100
cNome  := "TOTVS"
nPerc  /= 2
```

> O alinhamento considera apenas os operadores de atribuição de dois caracteres
> (`:=`, `+=`, `-=`, `*=`, `/=`, `%=`); o operador `=` simples e comparadores não
> disparam o alinhamento. Ocorrências dentro de _strings_ são ignoradas. Linhas
> em branco, linhas sem operador de atribuição ou com indentação diferente
> encerram o grupo.

### `blankLinesBetweenTopLevelDeclarations` (`number`, padrão `1`)

Normaliza a quantidade de linhas em branco imediatamente **antes** de cada
declaração de topo (`Function`, `User Function`, `Static Function`, `Procedure`,
`Method`, `Class`), ajustando para o valor configurado. Se houver linhas em
branco a mais, elas são removidas; se houver a menos, são inseridas. A primeira
declaração do arquivo não recebe linhas em branco antes dela.

```json
{ "advpl.formatter": { "blankLinesBetweenTopLevelDeclarations": 2 } }
```

Antes:

```advpl
Function Primeira()
Return
Function Segunda()
Return
```

Depois (com `2`):

```advpl
Function Primeira()
Return


Function Segunda()
Return
```

> Com `0`, as declarações de topo ficam sem linhas em branco entre elas. O padrão
> é `1`.

### `commentReflow` (`boolean`, padrão `false`)

Refaz os parágrafos de comentário de linha (`//`) e blocos (`/* ... */`) para
caber em `maxLineLength`. Cabeçalhos de documentação `/*{Protheus.doc}` **não**
são alterados.

```json
{
  "advpl.formatter": {
    "commentReflow": true,
    "maxLineLength": 40
  }
}
```

Antes:

```advpl
// Esta e uma linha de comentario bastante longa que ultrapassa o limite
```

Depois (reflui como `//` respeitando 40 colunas):

```advpl
// Esta e uma linha de comentario
// bastante longa que ultrapassa o
// limite
```

Bloco `/* ... */` é normalizado para o layout `/*` / `* texto` / `*/`.

> Com `false` (padrão), os comentários são mantidos como estão.

### `convertSemiGraphicsToChar` (`boolean`, padrão `false`)

Converte caracteres semi-gráficos (desenho de caixa e blocos da página de código
CP437) presentes no fonte em caracteres ASCII equivalentes durante a formatação.
É útil em fontes legados que utilizam esses caracteres para molduras e que, ao
serem regravados na codificação de trabalho (`windows1252`/`windows1251`), seriam
degradados de forma inconsistente.

O mapeamento aplicado é:

- Linhas horizontais (`─ ━ ═` etc.) → `-`
- Linhas verticais (`│ ┃ ║` etc.) → `|`
- Cantos e junções (`┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ╔ ╗ ╚ ╝` etc.) → `+`
- Blocos e sombreamentos (`█ ▄ ▀ ░ ▒ ▓` etc.) → `#`

```json
{ "advpl.formatter": { "convertSemiGraphicsToChar": true } }
```

Antes:

```advpl
// ┌───────────────┐
// │ Cabeçalho     │
// └───────────────┘
```

Depois (com `true`):

```advpl
// +---------------+
// | Cabeçalho     |
// +---------------+
```

> Com `false` (padrão), os caracteres semi-gráficos são mantidos como estão.

### `keywordsCase` (`upper` \| `lower` \| `upperCamel` \| `ignore`, padrão (4GL) `upper` / (AdvPL) `ignore`)

Ajusta a caixa apenas das palavras-chave reconhecidas da linguagem. Comentários
(`//`, `/* */`) e o conteúdo de _strings_ são preservados.

```json
{ "advpl.formatter": { "keywordsCase": "upper" } }
```

Antes:

```advpl
function Exemplo()
    local nI := 0
    if nI > 0
        return .T.
    endif
return
```

Depois (com `upper`):

```advpl
FUNCTION Exemplo()
    LOCAL nI := 0
    IF nI > 0
        RETURN .T.
    ENDIF
RETURN
```

> Com `lower`, as palavras-chave ficam em minúsculas. Com `upperCamel`, a
> primeira letra fica em maiúscula e as demais em minúsculas. Com `ignore`, a
> caixa original é mantida. O padrão é `upper` para 4GL e `ignore` para AdvPL.

### `maxConsecutiveBlankLines` (`number`, padrão `0` no LS)

Limita as linhas em branco consecutivas. **Só atua quando o valor é maior que
`0`**; com `0`, o LS não remove linhas em branco por esta regra.

```json
{ "advpl.formatter": { "maxConsecutiveBlankLines": 1 } }
```

Antes:

```advpl
Local nX := 1



Local nY := 2
```

Depois (com `1`):

```advpl
Local nX := 1

Local nY := 2
```

### `maxLineLength` (`number`, padrão `120`) — quebra de linhas longas

Linhas de **código** mais longas que `maxLineLength` são quebradas no último
espaço válido (fora de _strings_) antes do limite, juntando os segmentos com `;`
(operador de continuação AdvPL). A continuação recebe indentação extra
(`editor.tabSize`/`insertSpaces`). Linhas de comentário não são quebradas aqui
(veja `commentReflow`).

```json
{ "advpl.formatter": { "maxLineLength": 40 } }
```

Antes (linha com mais de 40 colunas):

```advpl
oCliente:Gravar(cCodigo, cNome, cEndereco)
```

Depois (quebra no último espaço antes de 40, com `;`):

```advpl
oCliente:Gravar(cCodigo, cNome,;
    cEndereco)
```

> Quando não há espaço seguro antes do limite (ex.: um único identificador
> muito longo), a linha é mantida sem quebra.

### `operatorSpacing` (`boolean`, padrão `false` no LS)

Normaliza o espaçamento ao redor de operadores compostos
(`:=`, `+=`, `-=`, `*=`, `/=`, `==`, `!=`, `>=`, `<=`) e simples
(`+`, `-`, `*`, `/`, `=`, `<`, `>`). Strings e comentários são preservados.

```json
{ "advpl.formatter": { "operatorSpacing": true } }
```

Antes:

```advpl
nTotal:=nQtd*nPreco
If nSaldo>=0
```

Depois:

```advpl
nTotal := nQtd * nPreco
If nSaldo >= 0
```

> Com `operatorSpacing: false` (padrão no LS), o espaçamento original é mantido.

### `preserveSingleLineBlocks` (`boolean`, padrão `false`)

Controla o tratamento de _code blocks_ AdvPL (`{ |params| comando }`). Com
`false` (padrão), um _code block_ de linha única é **expandido** para a forma
multilinha; com `true`, um _code block_ já quebrado cujo corpo é um único
comando é **recolhido** de volta para uma linha.

```json
{ "advpl.formatter": { "preserveSingleLineBlocks": false } }
```

Antes:

```advpl
bAcao := { |oObj| oObj:Executar() }
```

Depois (com `false`, expande o _code block_):

```advpl
bAcao := { |oObj|;
    oObj:Executar();
    }
```

> Com `true`, a forma de linha única acima é preservada (e uma forma multilinha
> de comando único é recolhida para uma linha).

### `spaceAfterComma` (`boolean`, padrão `true`)

Remove o espaço antes da vírgula e força exatamente um espaço após ela. Exceção:
quando a vírgula é seguida de `;` (separador de comandos em _code block_), o
espaço não é inserido. Vírgulas dentro de _strings_/comentários são preservadas.

```json
{ "advpl.formatter": { "spaceAfterComma": true } }
```

Antes:

```advpl
oObj:Metodo(cParam1 ,nParam2,lParam3)
```

Depois:

```advpl
oObj:Metodo(cParam1, nParam2, lParam3)
```

### `spaceInsideParentheses` (`boolean`, padrão `false`)

Controla os espaços internos aos parênteses. Parênteses vazios `()` são
preservados; conteúdo em _strings_/comentários é ignorado.

```json
{ "advpl.formatter": { "spaceInsideParentheses": true } }
```

Antes:

```advpl
nResultado := Calcula(nBase, nTaxa)
```

Depois (com `true`, adiciona espaço interno):

```advpl
nResultado := Calcula( nBase, nTaxa )
```

Depois (com `false` — padrão —, remove espaço interno):

```advpl
nResultado := Calcula(nBase, nTaxa)
```

### `stringStyle` (`double-quotes` \| `single-quotes` \| `ignore`, padrão `ignore`)

Normaliza o delimitador de _strings_. Aspas do mesmo tipo presentes no conteúdo
são convertidas para concatenação com `chr()` (39 = `'`, 34 = `"`).

```json
{ "advpl.formatter": { "stringStyle": "double-quotes" } }
```

Antes:

```advpl
cMsg := 'Ola mundo'
```

Depois (com `double-quotes`):

```advpl
cMsg := "Ola mundo"
```

Exemplo com aspas aninhadas (com `double-quotes`):

Antes:

```advpl
cSql := 'SELECT * FROM "SA1"'
```

Depois:

```advpl
cSql := "SELECT * FROM "+chr(34)+"SA1"+chr(34)+""
```

> Com `ignore` (padrão), o delimitador original é mantido.

### `trimFinalNewlines` (`boolean`, padrão `false` no LS)

Remove as linhas em branco em excesso no final do arquivo.

```json
{ "advpl.formatter": { "trimFinalNewlines": true } }
```

Antes (linhas em branco ao fim):

```advpl
Return
<linha em branco>
<linha em branco>
```

Depois:

```advpl
Return
```

### `trimTrailingWhitespace` (`boolean`, padrão `false` no LS)

Remove espaços/tabulações não significativos ao final das linhas durante a
formatação.

```json
{ "advpl.formatter": { "trimTrailingWhitespace": true } }
```

Antes (espaços ao final representados por `·`):

```advpl
Local nX := 1····
```

Depois:

```advpl
Local nX := 1
```
