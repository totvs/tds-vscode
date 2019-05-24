# Versão 0.2.0

## Salvar senha do ambiente: [Issue 5](https://github.com/totvs/tds-vscode/issues/5)
### Melhoria:
* Salvar a senha do ambiente para permitir a reconexão automática
### Solução:
* Usuário e senha serão salvos (encriptados) para permitir a reconexão no ambiente
----
## Conteúdos strings não são apresentadas como sendo tipo string: [Issue 7](https://github.com/totvs/tds-vscode/issues/7)
### Problema:
* Variável caracter apresentada sem aspas no Debug Console, caso tivesse conteúdo numérico poderia confundir o desenvolvedor mais desatento.
### Solução:
* Cercado com aspas o retorno da variável no Debug Console, reforçando ser caracter
----
## Ordenação alfabética dos Servidores: [Issue 19](https://github.com/totvs/tds-vscode/issues/19)
### Melhoria:
* Novos servidores inseridos na ordem de criação, dificultando a localização
### Solução:
* Ordenado alfabeticamente o servidor após sua inclusão
----
## Iniciar conectado no ambiente anterior: [Issue 21](https://github.com/totvs/tds-vscode/issues/21) e relativo [Issue 5](https://github.com/totvs/tds-vscode/issues/5)
### Melhoria:
* Conectar automaticamente o ambiente Protheus na abertura da workspace
### Solução:
* Com o armazenamento protegido da senha, faremos a reconexão automática no ambiente de desenvolvimento
----
## Abas exibidas, porém sem variáveis: [Issue 22](https://github.com/totvs/tds-vscode/issues/22)
### Melhoria:
* Não apresentar as pastas de variáveis na sessão Debug, durante a depuração, caso não haja nenhuma variável disponível para o tipo em questão (local, public, private, static)
### Solução:
* Abas de variáveis serão exibidas apenas quando tiverem conteúdo
----
## Localização do strings para Espanhol: [Issue 34](https://github.com/totvs/tds-vscode/issues/34)
### Melhoria:
* Traduzir extensão para o Espanhol
### Solução:
* Traduzida extensão para o Espanhol
----
## Encoding sugerido: [Issue 37](https://github.com/totvs/tds-vscode/issues/37)
### Melhoria:
* Auxiliar o desenvolvedor a utilizar o encode Windows1252 por padrão em seus fontes AdvPL.
### Solução:
* Na abertura da workspace será apresentado um popup com três botões questionando:
Quer mudar o encoding para o padrão Windows1252?

 **Sim:** Todos os fontes AdvPL serão abertos como Windows1252 (definido no arquivo settings.json);
 **Não:** Arquivos serão abertos com o encode padrão do próprio VSCode, e a pergunta será repetida na próxima vez  que iniciar o VS;
 **Não pergunte novamente:** Arquivos serão abertos com o encode padrão do próprio VSCode, e a pergunta não será repetida novamente para essa workspace.
 **Observação:**

 Em casos específicos, como na compilação de fontes em Cirílico (Russo), o encode poderá ser definido manualmente no arquivo settings.json de sua workspace, abaixo um exemplo de como usar o cirílico (Windows1251)

	{
		"totvsLanguageServer.welcomePage": false,
		"[advpl]": {
			"files.encoding": "windows1251"
		},
		"totvsLanguageServer.askEncodingChange": false
	}
----
# Versão 0.1.0
* Alteração de ícone TOTVS.
* Definição de Licença Apache 2.0.
* Opção de aplicar patch com fontes mais antigo que o RPO.
* Correções na configuração de include.
* Melhorias no Sintax Highlight.
* Melhorias nas mensagens de compilação.
* Liberação de chave de compilação válida pra LINUX e MAC.

# Versão 0.28
 * Adicionado EndDo a lista de palavras reservadas.
 * Remoção de Login com Identity.
 * Disponibilidade no Marketplace do VSCode.
 * Ajuste de parametros da aplicação de patch.
 * Opção de Exportar Lista de Objetos.
 * Opção de Exportar Lista de Funções.
