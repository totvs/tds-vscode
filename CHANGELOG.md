# Changelog

[Changelog V1](CHANGELOG-V1.md)

## Versão [2.0.0-RC-next]

### Correções

### Leitura do cache e aprimoramento na salva/carga do cache (feito)

Ao ler o cache, este está sendo invalidado e com isso reindexa os arquivos.

### Melhoria

### Documentação das funções de binário (_binary function_)

Extração da documentação das funções binárias direto do projeto _totvsvmtests_, via ferramenta _advplDoc_ (solução _TotvsTecTools_).
Para detalhes, veja ``<local folder>\totvsls\dbcode\dbcode_manager.cpp``, método ``DBCodeManager::loadBinaryFunctions``.

## Versão [2.0.0]

### Melhorias

#### Assistente de assinatura de funções

BETA: Adicionado assistente de assinatura de funções (_SignatureHelp_).

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
