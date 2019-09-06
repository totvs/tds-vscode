# Versao 0.3.14
## Inclusão de PullRequest [PullRequest 155](https://github.com/totvs/tds-vscode/pull/155)
### PullRequest:
* Inclusão de palavras reservadas
----
## Corrigido problema ao abrir a tela de "Compile Key"
### Problema:
* Ao abrir a tela de "Compile Key" sem que antes algum processo tenha iniciado o Language Server, esse último era iniciado após a abertura da tela ocasionando um erro para definir o Id da máquina
### Solução:
* Alterado o processo de abertura da tela de "Compile Key" para que se caso nao exista um "LS no ar", aguardar a inicialização do mesmo para continuar com a abertura da página.
----
## Corrigido problema que fazia com que breakpoints removidos cotinuassem a realizar paradas na depuração [Issue 121](https://github.com/totvs/tds-vscode/issues/121)
### Problema:
* Durante a depuração, em um loop por exemplo, caso um breakpoint fosse removido e usuario pedisse um "Run", esse breakpoint continuava sendo considerado e a parada era realizada.
### Solução:
* Realizado correção no processo de sincronismo de breakpoints pelo debug adapter.
----
# Versão 0.3.13
## Impmentado notificação de "Exceptions" informadas pelo servidor na visão "Debug Console" [Issue 99](https://github.com/totvs/tds-vscode/issues/99#)
### Problema:
* Quando é lançado uma exceção pelo servidor o plugin não mostra no console.
### Solução:
* Alterado o Servidor DAP para receber mensagens de Exception do servidor e enviar uma mensagem de log para o Client
----
## Removido a opção para inicalizar o plugin do TDS VsCode simplemsmente ao lançar uma depuração qualquer [Issue 124](https://github.com/totvs/tds-vscode/issues/124)
### Problema:
* O Plugin do TDS VsCode era ativado sempre que uma depuração era iniciada, mesmo que fosse de outra linguagem
### Solução:
* Removido o parametro "onDebug" dos eventos que ativam a extensão.
----
## Alterado mensagem de falha ao fazer o "StartBuild" para incluir sugestão de que o servidor pode estar off-line [Issue 135](https://github.com/totvs/tds-vscode/issues/135)
### Problema:
* Caso o usuario peça uma compilação e por algum motivo o servidor não está mais on-line, a mensagem de erro apresentada não era clara sobre essa situação.
### Solução:
* Mensagem de erro alterada incluindo informação para o usuario que a falha pode ter ocorrido pois o servidor está off-line
----
## Correção na identificação de declaração de classe pelo Syntax Highlight [Issue 116](https://github.com/totvs/tds-vscode/issues/116)
### Problema:
* Em uma classe, caso seja removido os espaços, ou tabs, no inicio da linha onde estão as declarações de variaveis e métodos, corrompia toda a pintura do fonte
### Solução:
* Correão na expressão regular de identificação de variáveis e métodos na declaração de classes
----
# Versão 0.3.12
## Correção emeregencial de problema no pré compilador [Issue 111](https://github.com/totvs/tds-vscode/issues/111)
### Problema:
* Ao compilar fontes que possuam a instrução %NotDel% ocorre problema no pre compilador.
### Solulção:
* Correção interna no pré compilador.
----
# Versão 0.3.11
## Gerar saída para console [Issue 60] (https://github.com/totvs/tds-vscode/issues/60)
### Melhoria:
* Adicionar uma forma de gerar uma saída no console durante a depuração sem precisar compilar.
### Solução:
* Implementado a funcionalidade de "logpoint" do VsCode no Language Server.
----
## Demora na execução de debug [Issue 95](https://github.com/totvs/tds-vscode/issues/95)
### Problema:
* A depuração apresenta problemas de performance e na abertura da aba de variaveis e tabelas.
### Solução:
* Feito uma série de pequenas correções no servidor DAP.
----
## Erro ao aplicar patch [Issue 96](https://github.com/totvs/tds-vscode/issues/96)
### Problema:
* Erro "Patch URI list not informed" ao aplicar patch
### Solução:
*  Correções internas no Language Server
----
# Versão 0.3.10
## Identação de código [Issue 91](https://github.com/totvs/tds-vscode/issues/91)
### Melhoria:
* Não alterar a posição do return.
### Solução:
* Desligar a formatação na salva do fonte e não alterar a posição do return na formatação
----
## Recompatibilização com servidores 131227 [Issue 90](https://github.com/totvs/tds-vscode/issues/90) relativo a [Issue 86](https://github.com/totvs/tds-vscode/issues/86)
### Problema:
* Ao se conectar a um servidor com build inferior a 170117 o servidor não conectava.
### Solução:
* Corrigir o LS para suportar build 131227.
-----
## Perda de conexão [Issue 86](https://github.com/totvs/tds-vscode/issues/86) relativo a [Issue 90](https://github.com/totvs/tds-vscode/issues/90)
### Problema:
* Cada vez que é feito uma operação no server o vscode exibe uma informação de conexão perdida e faz a reconexão com o server.
### Solução:
* Corrigir o LS.
-----
# Versão 0.3.5
## Exibir tabela com o resultado da compilação [Issue 68](https://github.com/totvs/tds-vscode/issues/68)
### Melhoria:
* Implementar uma opção de exibir os resultados da compilação quando compilado multiplos arquivos.
### Solução:
* Implementar uma tabela com todos os dados de compilação, exibindo quais arquivos foram compilados, quais tem erros, com opção e filtro e ordenação.
----
## Indentação de código [Issue 3](https://github.com/totvs/tds-vscode/issues/3)
### Melhoria:
* Indentação de código fonte Adv/PL.
### Solução:
* Implementado procedimentos na extensão:
  1. Acione menu de contexto do editor, opção "_Format Document_ (`SHIFT + ALT + F`)".
  1. Menu de contexto de um recurso (arquivo fonte) ou pasta, opção "_Format_".
----
## Exibir tabelas e conteúdo: [Issue 20](https://github.com/totvs/tds-vscode/issues/20)
### Melhoria:
* Implementar o sincronismo de tabelas durante a depuração.
### Solução:
* Implementado o sincronismo de tabelas, o qual aparecerá como um escopo de variável e ao chamar pela visão "Debug Console" prefixando o nome da tabela com o comando "table:" (Ex: table:SM0)
----
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
* Implementado comando e atalho (`CTRL + F10` / `CTRL + SHIFT + F10`) para compilar/recompilar todos o fontes abertos no editor.
----
## Chave de compilação necessita de um arquivo .AUT: [Issue 40](https://github.com/totvs/tds-vscode/issues/40)
### Problema:
* Não é possível validar uma chave de compilação sem fornecer um arquivo .AUT.
### Solução:
* Na realidade era possível mas a interface estava um pouco confusa, então alteramos a interface para melhorar a usabilidade.
----
## Permitir passagem de parâmetros para a função principal (-A): [Issue 36](https://github.com/totvs/tds-vscode/issues/36)
### Melhoria
* Permitir passagem de parâmetros para a função principal através do parâmetro -A na chamada do SmartClient.
### Solução:
* Implementado a passagem de parâmetro conforme documentado em https://github.com/totvs/tds-vscode/wiki/Configura%C3%A7%C3%A3o-de-debug:-diretivas-$%7Bcommand:%7D
----
## Permitir visualizar o conteúdo de um patch antes de aplicar: [Issue 38](https://github.com/totvs/tds-vscode/issues/38)
### Melhoria:
* Deveria ser possível visualizar o conteúdo de um patch antes de aplicar.
### Solução:
* Implementada a visualização do conteudo de Patches atraves do comando "TOTVS: Patch Infos".
----
## Geração de patch não respeita filtro *: [Issue 70](https://github.com/totvs/tds-vscode/issues/70)
### Problema:
* Ao tentar gerar um patch e realizar o filtro com caracter "*" o resultado não é apresentando.
### Solução:
* Os caracteres "*" serão removidos do filtro, pois o componente utilizado entende como a pesquisa pelo caracter "*".
----
## Inspetor de funções não mostra o arquivo: [Issue 73](https://github.com/totvs/tds-vscode/issues/73)
### Melhoria:
* O inspetor de funções mostra apenas a lista de funções, mas não mostra em que arquivo fonte está escrita a função.
### Solução:
* Adicionada as informações de fonte e linha retornados pelo appserver.
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
