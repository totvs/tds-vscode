# Notas sobre integração  de TDS-VSCode x Copilot

## Preparação

- VS-Code, versão mínima 1.107.1
- Ative a conta TOTVS em [Ativando a conta](https://tdn.totvs.com/display/LRM/Ativando+a+Conta).
- Autentique-se com a conta TOTVS.
- DSS habilidado (configurar `totvsLanguageServer.editor.index.cache` diferente de `Off`).
- Instalar a extensão [Language Server tools for Copilot](https://marketplace.visualstudio.com/items?itemName=sehejjain.lsp-mcp-bridge).
- Criar arquivo `github/tds-vscode-?-?-?.instructions.md`, para definir:
    - Escopo: aplicar em PRW/TLPP/TLL.
    - Diretrizes técnicas: uso de LS como priritário.
    - Comunicação: respostas em PT-BR e objetivas.

> A extensão TDS-VSCode contém um ou mais arquivos de instruções embarcado e são criados na área de trabalho caso não existam ou se mudarem de versão.
> Se não quiser usar (**NÃO RECOMENDÁVEL**), manter o arquivo criado vazio.
> Se editado, as modificações efetuadas são mantidas ou sobescrita sob autorização..

## Copilot

Notas sobre o uso do Copilot e integração do TDS-VSCode com ele.

1. O uso de arquivos de instruções (.md) pode sobrecarregar o consumo de _tokens_. Veja [Recomendações](#arquivos-de-instruções-recomendações).

Cada arquivo de instruções é injetado no contexto de toda requisição ao Copilot dentro do escopo definido em applyTo. Quanto maior e mais abrangente o arquivo, mais tokens são consumidos por requisição.

1. Indexação de código (_Codebase index_)

> Recomenda-se a leitura de [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/overview).

O Copilot tem um processo de indexação de código que funciona somente em repositórios hospedados no [GitHub](https://). Essa indexação permite ao Copilot conhecer sua área de trabalho (_workspace_).

Quando não disponível, pode ocorrer:

- Contexto limitado: Sem o índice, o Copilot foca apenas nos arquivos que estão abertos no momento ou em trechos de código muito próximos ao cursor.
- Perda de precisão no @workspace: Comandos como @workspace ou #codebase tornam-se menos eficazes ou param de funcionar corretamente, pois dependem dessa busca semântica para localizar definições em outros arquivos.
- Sugestões genéricas: A IA pode sugerir nomes de funções ou variáveis que não existem no seu projeto atual ou falhar ao tentar reutilizar padrões específicos da sua arquitetura.
- Dificuldade em grandes projetos: Em bases de código com mais de 2.500 arquivos, o Copilot regride para um "índice básico" com algoritmos simplificados, o que pode resultar em respostas menos detalhadas ou incorretas sobre a estrutura global.

Veja: [How Copilot understands your workspace](https://code.visualstudio.com/docs/copilot/reference/workspace-context).

1. Comando Fix

Apliquei o comando Fix em alguns erros do nosso parser (linter/yacc) e se sai bem.
Código gerado precisa ser verificado antes de se aplicar.

1. Comando explain

Foi aplicado o comando em diversas funções, bons resultados e confiáveis.

1. Comando review

Foi aplicado o comando em diversas funções, bons resultados e confiáveis.

1. Plain Agent

Usei o _plain agent_ para planejar um _rename_. O processo ocorreu como esperado.

1. Geração de código

No tlpp-core não foi muito bem para geração de código de UI. Mandei gerar uma programa de manutenção (_CRUD_) e foi gerado código aparentemente funcional, livres de erro, usando`@..SAY/GET`.

Não usou nenhuma função de FW, dicionário de dados ou outras funções relevantes.

Não havia intruções específicas ou exemplos.
Se houver outros fontes com UI na área de trabalho ou exemplos (p.e. arquivos de instruções), deve gerar usando a estrutura do FW.

**Nota:** Custo de tokens pode ser elevado.

## Arquivos de instruções (recomendações)

1. applyTo restrito: defina os arquivos alvos.

1. Arquivo enxuto: remover seções redundantes ou óbvias para o modelo. O Copilot já conhece padrões gerais; instrua apenas o que é específico do seu contexto..

1. Separar por escopo: em vez de um único arquivo grande, criar arquivos menores com applyTo mais específico (ex.: um só para REST, outro só para testes).

1. Evitar exemplos de código nas instruções: exemplos aumentam muito o tamanho sem ganho proporcional de precisão.

1. Revisar periodicamente: remover regras que o modelo já segue naturalmente após alguns meses.

## Alguns numeros

### LS

Para usar o Copilot junto com o LS, faz-se necessário a indexação da área de trabalho cuja responsabilide é do **DSS (Developer Support Subsystem = indexador)**. Este pode trabalhar em memória, reconstruindo o indice a cada sessão, ou em disco, recuperado a partir do _cache_.

As medições abaixo foram efetuadas no projeto [TLPP-Core](https://).

- Criação de cache em disco

```console
[Trace - 6:06:40 PM] Received notification 'window/showMessage'.
Params: {
    "type": 3,
    "message": "Indexed folder: tlpp-core (1956 files) in 03min 25s  (avg. 104 ms)"
}
```

- Carga do cache em disco

```console
[Trace - 5:51:21 PM] Received notification 'window/showMessage'.
Params: {
    "type": 3,
    "message": "Indexed folder: tlpp-core (1956 files) in 08s 097ms (avg. 4 ms)"
}
```

|         | Tamanho |
| -       | -       |
| Projeto | ~407,1M |
| Fontes  |   ~5,8M |
| Cache   |   ~1,5M |

## Consumo de tokens

### 1a Tentativa de medição

> Modelo: Auto (GPT 5.4)
> Agente: Plan
> Contexto: test/unit/lib/language/test_tad_array.tlpp
> Prompt: renomear oArr para oArray
> Via LS: Sim
> Tokens: ~37,6K

| Etapa                  | Tokens  | Observação           |
| -                      | -       | -                    |
| Preparação             | ~1,9K   | Intruções genéricas. |
| Execução               |         |                      |
|   panel/editAgent      | ~12K    | (1).                 |
|   read_file            |         |                      |
|  vscode_listCodeUsages |         |                      |
|   panel/editAgent      | ~13K    | (1) e resposta.      |
| Total                  | ~26,9K  |                      |

(1) Instruções genéricas, _workspace_info_  e instruções do TDS-VSCode
_workspace_info_: estrutura do projeto (pastas/arquivos)

O consumo foi obtido de _logs de deburação_ gerados pelo _Chat IA_, porém ao questionar o Copilot, esse respondeu:

```console
Prompt: Essa ultima solicitação qto me custou em token e US$ |
Assistente: Não consigo ver seu consumo real de tokens nem o valor em US$ da sua conta daqui, porque não tenho acesso ao billing da sua assinatura/API.

Estimativa da última solicitação (“renomear oArr para oArray”): ficou na faixa de baixo consumo (provavelmente algo como ~400 a 1.200 tokens totais, considerando prompt + resposta + contexto de arquivo curto).

Para calcular em US$ com precisão, use:

Custo input = (tokens_input/1,000,000) x pre/co_input
Custo output = (tokens_output/1,000,000) x pre/co_output
Custo total = input + output

Se você me mandar os números exatos de tokens (input/output) e a tabela de preço do seu plano/modelo, eu te devolvo o valor exato em US$.
```

Pesquisando, achei a visão _Agent Debug Log_ que mostra o consumo de tokens. Na primeira execução, indicou ~37,6K. Em um segunda, acusou ~88K, em uma 3a ~200K.

O consumo informado é acumulativo, sendo necessário iniciar um novo _chat_ (`/clear`), caso contrário, toda a conversa anterior será enviada.

### 2a Tentativa de medição

Após ganho de experiência/conhecimento no consumo de tokens, refiz o teste.

> Modelo: Auto (GPT 5.4)
> Agente: Plan
> Contexto: test/unit/lib/language/test_tad_array.tlpp
> Prompt: renomear oArr para oArray
> Via LS: Sim

| LS | Consumo    |
| -- | ---------- |
|    | ~215,8K(1) |
| X  |  ~41,5K    |

(1) Não fiz _clear_.

### 3a Tentativa de medição

> Modelo: Auto (GPT 5.4)
> Agente: Plan
> Contexto: array.prw
> Prompt: onde uso add
> Via LS: Sim

| LS | Consumo |
| -- | ------- |
|    |  ~34,8K |
| X  |  ~34,2K |

## Opiniões pessoais

Acredito  que um bom **DSS** (hoje ele é voltado mais a _hover_ e _signature-help_), com as melhorias implementadas (navegação, renomear, impacto (references)  para atender o _bridge_, podemos trabalhar sem o Copilot.

A vantagem de usar o Copilot, é na hora de aplicar as alterações, onde é  gerado um _patch_ que é aplicado de forma semelhante quando resolvemos conflitos no repositório.

### Conclusão

Em minha opinião (até esse momento, 30/04/26) que ajuda, ajuda, mas não é indispensável.

### Preocupação

O consumo de _tokens_ pode ser alto. Em uma operação de renomear variável local, em uma função do tllp_core, passou de 50K. (a confirmar e documentar).

Isso pode se agravar, quando houver mais arquivos de instruções (SKILL e outros).
