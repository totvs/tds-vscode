# Melhorias planejadas/em estudo

> Os itens aqui mencionados não possuem previam *se* e *quando* serão implementados.

## Amostra de novos arquivos e outros elementos do programa

Adicionar amostra (*template*) para novos arquivos com cabeçalho ``ProtheusDOC`` e outros elementos do programa.

## Análise estática de ``ProtheusDOC``

Adicionar processo de análise de ``ProtheusDOC`` (*Linter*), propondo sua inserção em elementos públicos ou correções (valida a documentação se esta de acordo com a definição).

## Usar context.Secrets para senhas

Armazenar informações sensíveis em área secreta. [VSCode Api: Secret Storage](https://code.visualstudio.com/api/references/vscode-api#SecretStorage)

## LSIF: implementar formato de indice

Implementar o *cache* do **DSS** no formato LSIF, de forma que possa ser utilizado em aplicações de terceiros para análise e outros procedimentos. [LSIF: specification](https://microsoft.github.io/language-server-protocol/specifications/lsif/0.6.0/specification/).

## Registro dinâmico (``dynamicRegistration``)

Aprimorar o tratamento de ações que podem ser registradas (ativadas) dinamicamente.
Conceito de [``dynamicRegistration``](https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#client_registerCapability).
