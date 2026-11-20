# TDS: Correção rápida (_quick fix_)

> Requisitos

- projeto aberto
- [_Linter_](linter.md) habilitado (`totvsLanguageServer.editor.linter.behavior` diferente de `disable`)
- fonte aberto no editor

A correção rápida (_quick fixes_) é oferecida pelo _Language Server_ (LS) para alguns dos problemas apontados pelo [_Linter_](linter.md). Ela aparece no ícone da lâmpada (💡) ao posicionar o cursor sobre o problema, pelo atalho `Ctrl+.` ou pela opção _Correção Rápida..._ (_Quick Fix..._) da visão _Problemas_.

As correções alteram somente o fonte aberto no editor e não o salvam. Use _Desfazer_ (`Ctrl+Z`) para reverter.

## Correções disponíveis

| Problema                                                            | Código       | Correções                                                   |
| ------------------------------------------------------------------- | ------------ | ----------------------------------------------------------- |
| `Local variable 'x' never used.`                                    | 3 (W0003)    | Remover ou comentar a variável                              |
| `Static variable 'x' never used.`                                   | 9 (W0009)    | Remover ou comentar a variável                              |
| `Variable 'x' redefined.`                                           | 11 (W0011)   | Remover ou comentar a declaração redefinida                 |
| `Variable 'x' used in the FOR command should be declared as Local.` | 5009 (W0004) | Declarar a variável como `Local`                            |
| `Syntax error: ...`                                                 | 2003 (C2003) | Remover ou comentar a linha                                 |
| `Command has no effect`                                             | 1 (W0001)    | Remover ou comentar o comando; remover a cláusula `NOERROR` |
| `Method 'x' is declared in class 'C' but not implemented.`          | 5007         | Criar a implementação; remover ou comentar a declaração |
| `Method 'x' is implemented for class 'C' but not declared in the class.` | 5008   | Declarar na classe; remover ou comentar a implementação |
| `File not found 'x'`                                                | 5001         | Trocar por include de nome parecido; remover ou comentar o `#include` |

> Os códigos entre parênteses são os equivalentes do compilador. Com o _Tree-sitter_ desligado (`totvsLanguageServer.linter.callTreeSitter: false`), as mesmas correções atendem aos avisos do compilador, localizando a declaração pelo texto da linha.

## Variável não utilizada

Problemas `Local variable 'x' never used.` (código 3) e `Static variable 'x' never used.` (código 9). O código 9 é usado para variáveis `Static`, sejam de escopo de arquivo ou declaradas dentro de função/método.

Correções oferecidas:

- **Remove unused variable 'x'** (preferida): remove a variável junto com seu inicializador, inclusive chamadas de função ou método.
  - Variável única na declaração: remove a linha inteira.
  - Várias variáveis na declaração: remove somente o elemento e a vírgula adjacente.
- **Comment out unused variable 'x'**: comenta a variável junto com seu inicializador, que deixa de ser executado.
  - Variável única na declaração: insere `//` antes da declaração.
  - Várias variáveis na declaração: envolve o elemento e a vírgula adjacente com `/* ... */`. Esta opção não é oferecida quando o trecho contém `*/`.

Exemplos:

```xBase
local cUnused                    // removida a linha
local nA := 1, cUnused, nB := 2  // -> local nA := 1, nB := 2
local nA := 1, cUnused, nB := 2  // -> local nA := 1, /* cUnused, */ nB := 2
```

Comentários no fim da linha são preservados. Declarações com continuação de linha (`;`) não recebem correção.

## Variável redefinida

Problema `Variable 'x' redefined.` (código 11): mais de uma declaração `Local`/`Static` (ou parâmetro) com o mesmo identificador no mesmo escopo (arquivo, função ou método). A primeira declaração é aceita e as demais são indicadas.

Correções oferecidas, com as mesmas regras de remoção e comentário da [variável não utilizada](#variável-não-utilizada):

- **Remove redefined variable 'x'** (preferida)
- **Comment out redefined variable 'x'**

Quando o identificador aparece mais de uma vez na mesma linha, a correção atua na última ocorrência. A redefinição de um parâmetro não recebe correção.

## Variável do comando FOR não declarada como `Local`

Problema `Variable 'x' used in the FOR command should be declared as Local.` (código 5009).

Correção oferecida:

- **Declare variable 'x' as Local**: insere `Local x` em nova linha após a última declaração `Local` da função/método ou, quando não houver, no início do corpo. A grafia da palavra-chave (`local`, `Local`, `LOCAL`) segue a da última declaração.

## Erro de sintaxe

Problema `Syntax error: ...` (código 2003).

Correções oferecidas:

- **Remove line with syntax error** (preferida): remove a linha inteira.
- **Comment out line with syntax error**: insere `//` antes do primeiro caractere da linha.

O problema `Missing '...'`, que usa o mesmo código, não recebe correção, pois indica um elemento ausente e remover a linha não o resolve.

## Comando sem efeito

Aviso `Command has no effect` (código 1, W0001), emitido pelo compilador (_Tree-sitter_ desligado).

Correções oferecidas:

- Comando sem efeito (por exemplo, uma expressão ou variável isolada na linha):
  - **Remove command with no effect** (preferida): remove a linha inteira.
  - **Comment out command with no effect**: insere `//` antes do primeiro caractere da linha.
  - Não é oferecida quando o comando continua em outra linha (`;`).
- Cláusula `NOERROR` não suportada (mensagem `Command has no effect NOERROR`):
  - **Remove NOERROR clause**: remove a palavra `NOERROR` da linha, preservando o comando.

## Método declarado e não implementado

Aviso `Method 'x' is declared in class 'C' but not implemented.` (código 5007, _Tree-sitter_): o método consta na definição da classe (`CLASS ... ENDCLASS`), mas não há `METHOD x() CLASS C` no fonte.

Correções oferecidas:

- **Create implementation of method 'x'** (preferida): insere, após o `ENDCLASS` da classe, a implementação com os parâmetros da declaração e a grafia da palavra-chave (`METHOD`/`Method`/`method`):

  ```xBase
  Method speak(cSound) Class Animal

  Return
  ```

- **Remove declaration of method 'x'**: remove a linha da declaração na classe.
- **Comment out declaration of method 'x'**: insere `// ` antes da declaração.

Nenhuma correção é oferecida para declaração com continuação de linha (`;`).

## Método implementado e não declarado

Aviso `Method 'x' is implemented for class 'C' but not declared in the class.` (código 5008, _Tree-sitter_): existe `METHOD x() CLASS C`, mas o método não consta na definição da classe.

A implementação vai da linha do aviso até a última linha não vazia antes da próxima rotina (`METHOD`, `FUNCTION`, `STATIC FUNCTION`, `USER FUNCTION`, `CLASS` etc.), diretiva (`#`) ou bloco de comentário na coluna 0 (por exemplo, o _Protheus.doc_ da rotina seguinte).

Correções oferecidas:

- **Declare method 'x' in class 'C'** (preferida): insere `METHOD x(params)` antes do `ENDCLASS` da classe, com a indentação da declaração anterior.
- **Remove implementation of method 'x'**: remove as linhas da implementação.
- **Comment out implementation of method 'x'**: insere `// ` em cada linha não vazia da implementação.

## Include não encontrado

Erro `File not found 'x'` (código 5001, _Tree-sitter_): o arquivo do `#include` não foi encontrado na pasta do fonte nem nas pastas de include configuradas (procuradas nesta ordem).

Correções oferecidas:

- **Replace with include 'y'**: troca o nome pelo de um arquivo de nome parecido encontrado na pasta do fonte (procurada primeiro) ou nas pastas de include. São sugeridos até três arquivos com a mesma extensão, do mais parecido para o menos (o primeiro é a correção preferida). Um caminho relativo no nome é preservado; só o nome do arquivo é trocado.
- **Remove include 'x'**: remove a linha do `#include`.
- **Comment out include 'x'**: insere `// ` antes do `#include`.

A semelhança é medida pela quantidade de caracteres diferentes (distância de edição), sem diferenciar maiúsculas e minúsculas, aceitando até um terço do tamanho do nome (mínimo de dois). As trocas por nome parecido não são oferecidas em todo o fonte, pois cada `#include` pode ter sugestões diferentes.

## Aplicar em todo o fonte

Junto com a correção do problema sob o cursor, são oferecidas as mesmas correções aplicadas em todo o fonte:

| Problema                | Correções em todo o fonte                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Variável não utilizada  | **Remove all unused variables in file** e **Comment out all unused variables in file**               |
| Variável redefinida     | **Remove all redefined variables in file** e **Comment out all redefined variables in file**         |
| Variável do comando FOR | **Declare all FOR variables as Local in file**                                                       |
| Erro de sintaxe         | **Remove all lines with syntax error in file** e **Comment out all lines with syntax error in file** |
| Comando sem efeito      | **Remove all commands with no effect in file**, **Comment out all commands with no effect in file** e **Remove all NOERROR clauses in file** |
| Método não implementado | **Create all missing method implementations in file**, **Remove all declarations of unimplemented methods in file** e **Comment out all declarations of unimplemented methods in file** |
| Método não declarado    | **Declare all undeclared methods in file**, **Remove all implementations of undeclared methods in file** e **Comment out all implementations of undeclared methods in file** |
| Include não encontrado  | **Remove all includes not found in file** e **Comment out all includes not found in file** |

Regras:

- São consideradas somente as ocorrências com o **mesmo código** do problema sob o cursor. Por exemplo, a partir de uma variável `Local` não utilizada (código 3), as variáveis `Static` não utilizadas (código 9) não são alteradas.
- As opções aparecem somente quando há pelo menos duas ocorrências no fonte.
- As ocorrências são tratadas do fim para o início do fonte.
- Correções que se sobrepõem a outras já incluídas (por exemplo, duas variáveis não utilizadas na mesma declaração, ou a mesma variável de FOR declarada duas vezes) ficam de fora. Após a nova análise do fonte, acione a opção novamente para tratar as restantes.
- São usados os problemas da última análise do _Linter_. Problemas apontados somente pela compilação no _AppServer_ não são considerados.
