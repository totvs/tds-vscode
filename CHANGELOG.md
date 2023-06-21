# Changelog ([Changelog Versão 1](CHANGELOG-V1.md))

## Melhorias planejadas/em estudo

### Usar context.Secrets para senhas

*(aguardando análise)*
Armazenar informações sensiveis em área secreta. [VSCode Api: Secret Storage](https://code.visualstudio.com/api/references/vscode-api#SecretStorage)

### No *hover* de um parâmetro, apresentar sobre a função e destacar o parâmetro)

*(aguardando análise)*
*TypeScript* apresenta sobre o parâmetro.

### LSIF: implementar formato de indice

*(aguardando análise)*
Implementar o *cache* do **DSS** no formato LSIF, de forma que possa ser utiliado em aplicações de terceiros para análise e outros procedimentos. [LSIF: specification](https://microsoft.github.io/language-server-protocol/specifications/lsif/0.6.0/specification/).

## Versão [2.0.0-next]

### Problemas conhecidos

#### Erro ao digitar ao criar função no vscode [DTCLIENT01-4089](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4089)

Ao criar um user function em um arquivo tlpp na primeira linha gera um erro que trava o software do vscode.

#### Navegação no código falha após ler o *cache*

*(em análise)*

#### Disparar o assistente de assinatura, na lista de parâmetros em código já existente

*(em resolução)*
Código teste: ``oTButton1 := TButton():New( 0, 510, "Ir",oPanel,{||oWebEngine:Navigate(cGet1)}, 20,10,,,.F.,.T.,.F.,,.F.,,,.F. )``

#### Não traz documentação de classes binárias

*(aguardando análise)*
Gerar a documentação de classes binárias a partir dos arquivos em ``\advpldoc\advpl\src\classes``
.

#### Ao acionar o assistente no método construtor (new), não traz o da classe específica

*(aguardando análise)*

### Resolvido

#### ``User function`` não aceita identificador numérico

O compilador aceita identificador numérico, pois após o pré-processamento, este passa a contar com prefixo ``u_``, validando o identificador.

#### Navegação em classe

No código ``oGrid:= MyGrid():New(oDlg,aData)``, não vai para a definição da classe ao acionar ``goto definition`` em MyGrid().

Também foi ajustado navegação para métodos estáticos.

## Versão [2.0.0-RC3]

### Novos recursos

#### Assistente de assinatura de funções

### Melhorias

#### ProtheusDOC em classes

Adicionado tratamento de ProtheusDOC em classes.

### Correção

#### ``Ir para definição`` na inicialização (``new``) de objetos

Corrigido a navegação e *text hover* na definição de objeto na sua inicialização.

#### Passagem *mouse* (*text hover*)

Apresentava informações de definição e local de uso de forma indevida.

#### Abrir símbolo pelo nome (``Ctrl+T``)

Correção na execução da mensagem ``workspace/symbol``.

## Versão [2.0.0-RC2]

### Correções

### Leitura do cache e aprimoramento na salva/carga do cache

Ao ler o cache, este está sendo invalidado e com isso reindexa os arquivos.

### Melhoria

### Documentação das funções de binário (*binary function*)

Extração da documentação das funções binárias direto do projeto *totvsvmtests*, via ferramenta *advplDoc* (solução *TotvsTecTools*).
Para detalhes, veja ``<local folder>\totvsls\dbcode\dbcode_manager.cpp``, método ``DBCodeManager::loadBinaryFunctions``.

## Versão [2.0.0]

### Interoperabilidade entre sistemas operacionais

Para garantir a interoperabilidade das áreas de trabalho entre os sistemas operacionais suportados pelo **TDS-VSCode** e seus componentes, recomenda-se **veementemente** que pastas e arquivos não contenham caracteres especiais e/ou acentuados e sempre em mínusculas.

> Leia [Convenção para nomenclatura de File System em ambiente Linux]<https://tdn.totvs.com/x/h8BICw>).

### Melhorias

#### Assistente de assinatura de funções

Adicionado assistente de assinatura de funções (*SignatureHelp*).

#### Informações sobre uso e outras informações

BETA: Adicionado informações sobre o uso de funções (*CodeLens*).

#### Implementação de configuração para ignorar pastas e arquivos

Efetuado a implementação de configuração para a extensão ignorar pastas e arquivos no processo de *Navegação em fontes* e recursos associados, através da existência do arquivo `.tdsindexignore`.

Detalhes da implementação em [# TDS: Developer Support Subsystem](docs/dss.md#ignore).

#### Navegação em fontes, passagem de mouse e referências

Efetuado a implementação de navegação em fontes, passagem de mouse e referências.
Detalhes da implementação em [TDS: Developer Support Subsystem](docs/dss.md).

> Os recursos aqui apresentados, podem ser influenciados devido ao *linter* ignorar o processamento de fontes configurado em [TDS: Linter -> Ignorar pastas e arquivos](docs/linter.md#tdsignore).
> As informações sobre navegação, podem ou não ficar em [*cache*_](docs/dss.md#cache).

#### Visão *Estrutura*

Apresenta alguns detalhes sobre o ítem, conforme sua definição.

#### Navegação em classes quando usado `self` e `_Super`

- Adicionado tratamento há herança de classe (`_Super` e `from`)
- Unificado tratamento de `::` e `self`
