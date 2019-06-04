# Versão 0.3.1

## Barra invoca intelisense: [Issue 16](https://github.com/totvs/tds-vscode/issues/16)
### Problema:
* Ao digitar o caractere "/" dentro de uma função, o intelisense é invocado sugerindo a ultima função usada dele.
### Solução:
* Remover os caracteres que disparam a mensagem de completion até que esteja funcional.
----
## Extensão .PRG: [Issue 45](https://github.com/totvs/tds-vscode/issues/45)
### Problema:
* Temos fontes .PRG e não estão sendo reconhecidos no vscode.
### Solução:
* Adicionada extensão de arquivo .PRG na lista de arquivos AdvPL.
----
## Chave de compilação vencida: [Issue 46](https://github.com/totvs/tds-vscode/issues/46)
### Problema:
* Após vencer a chave de compilação não é possível compilar nem User Function.
### Solução:
* Adicionado tratamento que detecta a chave de compilação vencida e informa que a mesma foi removida.
----
## Aplicação de patch não detecta rpo em uso: [Issue 47](https://github.com/totvs/tds-vscode/issues/47)
### Problema:
* Ao fazer uma compilação em um rpo em uso, a extensão gera um erro e aborta a execução da compilação, porém ao aplicar um patch em um rpo em uso, não ocorre o mesmo comportamento.
### Solução:
* Adicionado tratamento de erro ao tentar aplicar patch em um ambiente com o RPO em uso.
----
## Compilação do Projeto: [Issue 26](https://github.com/totvs/tds-vscode/issues/26)
### Problema:
* Quando compilo o folder, ele literalmente compila todos os fontes. Não da skip nos fontes que estão com a mesma versão.
### Solução:
* Averiguado e corrigido problema no cálculo do checksum dos arquivo causando a recompilação caso o workspace fosse utilizado pelo TDS (Eclipse).
----
## Compilação de fontes Abertos: [Issue 42](https://github.com/totvs/tds-vscode/issues/42)
### Problema:
* Implementar um atalho para compilação de todos fontes abertos no editor.
### Solução:
* Implementado comando e atalho (CTRL+F10/CTRL+SHIFT+F10) para compilar/recompilar todos o fontes abertos no editor.
----
## Chave de compilação necessita de um arquivo .AUT: [Issue 40](https://github.com/totvs/tds-vscode/issues/40)
### Problema:
* Não é possível validar uma chave de compilação sem fornecer um arquivo .AUT.
### Solução:
* Na realidade era possível mas a interface estava um pouco confusa, então alteramos a interface para melhorar a usabilidade.
----
## Permitir passagem de parâmetros para a função principal (-A): [#36](https://github.com/totvs/tds-vscode/issues/36)
### Melhoria
Permitir passagem de parâmetros para a função principal através do parâmetro -A na chamada do SmartClient.
### Solução:
Implementado a passagem de parâmetro conforme documentado em https://github.com/totvs/tds-vscode/wiki/Configura%C3%A7%C3%A3o-de-debug:-diretivas-$%7Bcommand:%7D
----
## Permitir visualizar o conteúdo de um patch antes de aplicar: [Issue 38](https://github.com/totvs/tds-vscode/issues/38)
### Melhoria:
* Deveria ser possível visualizar o conteúdo de um patch antes de aplicar.
### Solução:
* Implementada a visualização do conteudo de Patches atraves do comando "TOTVS: Patch Infos".
----

# Versão 0.2.1

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
## Intelisense omite variáveis e funções locais: [Issue 8](https://github.com/totvs/tds-vscode/issues/8) relativo a [Issue 15](https://github.com/totvs/tds-vscode/issues/15)
### Melhoria:
* Definir sugestão de variáveis durante a codificação.
### Solução:
* Implementada opção para desabilitar o autocomplete vindo do LSP (Ctrl+Alt+Space), assim, priorizando a apresentação das variavíes contidos no fonte em edição.
----
## Auto-Complete: Identificação de variáveis: [Issue 15](https://github.com/totvs/tds-vscode/issues/15) relativo a [Issue 8](https://github.com/totvs/tds-vscode/issues/8)
### Melhoria:
* Implementar processo de identificação de variáveis do fonte corrente para ser informado no auto-complete.
### Solução:
* Implementado de opção para troca de comportamento do auto-complete:
	* Acesse 'setttings', opção "Totvs Language Server › Editor › Toggle: Autocomplete"
	* No editor, acione o atalho ctrl+alt+space
* Na barra de status será apresentado o comportamento atual, sendo:
	* Basic: executa o autocompletar padrão do VSCode.
	* LS: inclui informações disponíveis no RPO padrão.
![issue15a](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/autocomplete/basic.PNG)
</br>
![issue15b](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/autocomplete/complete.PNG)
----
## Permitir configurar quais notificações serão exibidas: [Issue 25](https://github.com/totvs/tds-vscode/issues/25)
### Melhoria:
* Permitir configurar atraves do painel de configuração da extenção AdvPL quais notificações serão exibidas (Nenhuma, Apenas Erros, Erros + Warnings ou Todas).
### Solução:
* Adicionado opção de configuração, onde o usuário define qual o nível de mensagem que será notificada via 'popup'. Independente da configuração, todas as mensagens serão apresentadas no log de console "AdvPL".
![issue25](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/configs/notification.png)

----
# Versão 0.1.0
* Alteração de ícone TOTVS.
* Definição de Licença Apache 2.0.
* Opção de aplicar patch com fontes mais antigo que o RPO.
* Correções na configuração de include.
* Melhorias no Sintax Highlight.
* Melhorias nas mensagens de compilação.
* Liberação de chave de compilação válida pra LINUX e MAC.

----
# Versão 0.0.28
 * Adicionado EndDo a lista de palavras reservadas.
 * Remoção de Login com Identity.
 * Disponibilidade no Marketplace do VSCode.
 * Ajuste de parametros da aplicação de patch.
 * Opção de Exportar Lista de Objetos.
 * Opção de Exportar Lista de Funções.
