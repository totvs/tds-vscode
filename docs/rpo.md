# TDS: Manutenção de RPO

> Requisitos

- servidor/ambiente conectado
- usuário autenticado (se requerido)

## Desfragmentação de RPO

Selecione o servidor, acione o menu de contexto e a opção `Defrag RPO` ou acione `CTRL + SHIFT + P` e execute `TOTVS: Defrag RPO`.
Aguarde a finalização do processo, que dependendo do tamanho do _RPO_ pode levar vários minutos.

![Defrag RPO](./gifs/DefragRPO.gif)

### Deletar recursos do RPO

Selecione o arquivo ou recurso a ser removido do _RPO_servidor_, acione o menu de contexto e a opção `Delete File/Resource from RPO`. Confirme a operação e aguarde o término.

![Delete File RPO](./gifs/DeleteFromRPO.gif)

## Verificar interidade de RPO

Selecione o servidor, acione o menu de contexto e a opção `RPO Check Integrity` ou acione `CTRL + SHIFT + P` e execute `RPO Check Integrity`. Aguarde a finalização do processo e caso haja alguma ocorrência, você será notificado.
