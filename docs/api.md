# Interface de Programação de Aplicação (API, _Application Programming Interface_)

A API do **TDS-VSCode** fornece métodos para geração de PPOs (Programação de Programação de Objetos), manipulação de tokens RPO, registra uma nova conexão (servidor) e interação com ferramentas de TLPP.

> **ANTES DE USAR**
>
> Uma dessas funções da API, converse com a equipe de Tecnologia.

## Uso da API

Segue exemplo de uso da API em TypeScript:

```typescript

...
const tdsExtension = vscode.extensions.getExtension('totvs.tds-vscode');
if (tdsExtension) {
  const tdsApi = tdsExtension.exports.api;
  if (tdsApi) {
	tdsApi.generatePPO('path/to/file.ppo', { option: 'value' })
	.then(result => {
		// tratamento do resultado
	}).catch(error => {
		// tratamento do erro
	}
  } else {
	//tratamento no caso de não encontrar a API
  }
} else {
	//tratamento no caso de não encontrar a extensão
}

...
```

Veja também [VS Code API: Extensions](https://code.visualstudio.com/api/references/vscode-api#extensions).

## Métodos

### `generatePPO(filePath: string, options?: any): Promise<string>`

Gera um arquivo PPO.

- **Parâmetros:**
    - `filePath` (string): O caminho para o arquivo fonte.
    - `options` (opcional, any): Opções adicionais para a geração do PPO.
        - `.enconding` (string): Código de caracteres para o arquivo-fonte. Padrão: `cp1252`.
            - cp1252: Windows-1252, padrão dos fontes AdvPL/Logix.
            - cp1251: Windows-1251, padrão dos fontes AdvPL (Russia).
            - utf8: UTF-8 (cuidado pois pode gerar problemas de codificação).

- **Retorno:** Uma promessa que resolve para uma string.

### `saveRPOToken(rpoTokenString: string): Promise<boolean>`

Salva a string do token RPO.

- **Parâmetros:**
    - `rpoTokenString` (string): A string do token RPO a ser salva.

- **Retorno:** Uma promessa que resolve para um lógico indicando sucesso ou não.

### `clearRPOToken(): Promise<boolean>`

Limpa a string do token RPO.

- **Retorno:** Uma promessa que resolve para um lógico indicando sucesso ou não.

### `createProtheusServer(serverName: string, port: number, address: string, secure: boolean, buildVersion: string, environment: string, username: string): Promise<boolean>`

Cria um novo servidor Protheus.

- **Parâmetros:**
    - `serverName` (string): O nome do servidor. Usado na visão `Servidores`.
    - `port` (number): O número da porta.
    - `address` (string): O endereço do servidor.
    - `secure` (boolean): Se o servidor é seguro.
    - `buildVersion` (string): A versão da build.
    - `environment` (string): O ambiente.
    - `username` (string): O nome de usuário.

- **Retorno:** Uma promessa que resolve para um lógico indicando sucesso ou não.

### `apiTlppTools(message: string): Promise<string>`

Interage com as ferramentas TLPP.

- **Parâmetros:**
    - `message` (string): A mensagem a ser enviada para as ferramentas TLPP.

- **Retorno:** Uma promessa que resolve para uma string.
