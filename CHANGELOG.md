# Changelog

[Changelog V1](CHANGELOG-V1.md)

## Versão [2.0.0-next]

### Melhorias planejadas

#### No _hover_ de um parâmetro, apresentar sobre a função e destacar o parâmetro

### Problemas conhecidos

#### Disparar o assistente de assinatura, na lista de parâmetros em código já existente

Código teste: ``oTButton1 := TButton():New( 0, 510, "Ir",oPanel,{||oWebEngine:Navigate(cGet1)}, 20,10,,,.F.,.T.,.F.,,.F.,,,.F. )``

#### Não traz documentação de classes binárias

#### Ao acionar o assistente no método construtor (new), não traz o da classe específica

### Resolvido

#### ``User function`` não aceita identificador numérico

O compilador aceita identificador numérico, pois após o pré-processamento, este passa a contar com prefixo ``u_``, validando o identificador.

## Versão [2.0.0-RC3]

### Novos recursos

#### Assistente de assinatura de funções

### Melhorias

#### ProtheusDOC em classes

Adicionado tratamento de ProtheusDOC em classes.

### Correção

#### ``Ir para definição`` na inicialização (``new``) de objetos

Corrigido a navegação e _text hover_ na definição de objeto na sua inicialização.

#### Passagem _mouse_ (_text hover_)

Apresentava informações de definição e local de uso de forma indevida.

#### Abrir símbolo pelo nome (``Ctrl+T``)

Correção na execução da mensagem ``workspace/symbol``.

## Versão [2.0.0-RC2]

### Correções

### Leitura do cache e aprimoramento na salva/carga do cache

Ao ler o cache, este está sendo invalidado e com isso reindexa os arquivos.

### Melhoria

### Documentação das funções de binário (_binary function_)

Extração da documentação das funções binárias direto do projeto _totvsvmtests_, via ferramenta _advplDoc_ (solução _TotvsTecTools_).
Para detalhes, veja ``<local folder>\totvsls\dbcode\dbcode_manager.cpp``, método ``DBCodeManager::loadBinaryFunctions``.

## Versão [2.0.0]

### Interoperabilidade entre sistemas operacionais

Para garantir a interoperabilidade das áreas de trabalho entre os sistemas operacionais suportados pelo **TDS-VSCode** e seus componentes, recomenda-se **veementemente** que pastas e arquivos não contenham caracteres especiais e/ou acentuados e sempre em mínusculas.

> Leia [Convenção para nomenclatura de File System em ambiente Linux]<https://tdn.totvs.com/x/h8BICw>).

### Melhorias

#### Assistente de assinatura de funções

Adicionado assistente de assinatura de funções (_SignatureHelp_).

#### Informações sobre uso e outras informações

BETA: Adicionado informações sobre o uso de funções (_CodeLens_).

#### Implementação de configuração para ignorar pastas e arquivos

Efetuado a implementação de configuração para a extensão ignorar pastas e arquivos no processo de _Navegação em fontes_ e recursos associados, através da existência do arquivo `.tdsindexignore`.

Detalhes da implementação em [# TDS: Developer Support Subsystem](docs/dss.md#ignore).

#### Navegação em fontes, passagem de mouse e referências

Efetuado a implementação de navegação em fontes, passagem de mouse e referências.
Detalhes da implementação em [TDS: Developer Support Subsystem](docs/dss.md).

> Os recursos aqui apresentados, podem ser influenciados devido ao _linter_ ignorar o processamento de fontes configurado em [TDS: Linter -> Ignorar pastas e arquivos](docs/linter.md#tdsignore).
> As informações sobre navegação, podem ou não ficar em [_cache__](docs/dss.md#cache).

#### Visão _Estrutura_

Apresenta alguns detalhes sobre o ítem, conforme sua definição.

#### Navegação em classes quando usado `self` e `_Super`

- Adicionado tratamento há herança de classe (`_Super` e `from`)
- Unificado tratamento de `::` e `self`
