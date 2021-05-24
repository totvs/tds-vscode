# Changelog

# Versão [1.2.next]

## [TOKEN RPO]

### Melhoria

- TokenRPO: implementado comando para remoção de token aplicado, via opção na barra de status ou via _api_ `clearRPOToken`.

# Versão [1.2.3]

## Depuração/execução: não salva o atributo 'lastProgramExecuted'

### Problema:

- Ao depurar/executar, o último programa executado não é apresentado.

### Solução

- Ajustado salva do atributo 'lastProgramExecuted' na configuração do executor (.vscode\launch.json).

## Problema na importação de arquivo do TDS Replay (https://github.com/totvs/tds-vscode/issues/672)

### Problema:

- Arquivo do TDS Replay enviado pelo usuario parava a importação por volta de 100MB

### Solução:

- Corrigido um processo interno que poderia causar uma falha de importação, interrompendo o processo.

## [BETA] Adição do suporte a nova chave (Token compilação) para o [RPO Seguro](docs/rpo.md).

## Implementar a funcionalidade de aplicação de Templates. [Issue 622](https://github.com/totvs/tds-vscode/issues/622)

### Melhoria:

- Troca das imagens na documentação do monitor por outras com melhor resolução.
- Adicionada a funcionalidade para aplicação de Templates (.tpl).
- [BETA] Esta funcionalidade encontra-se em testes Beta. Caso encontre algum problema na aplicação de um Template abra uma Issue com o Template em questão informando como aplicar e como validar o Template para que possamos rever o processo.

## Revisão de processos de edição 4GL

### Problema:

- A formatação de palavras-chaves ocorre ao acionar `ENTER`.

### Solução:

- Processo de formatação revisado, passando a tratar palavras-chaves durante a digitação. Detalhes em (Formatação de código fonte)[docs/format_config.md]

## Debug do mesmo objetos de instancias diferentes avaliando erroneamente valor de atributos (https://github.com/totvs/tds-vscode/issues/655)

### Problema:

- Ao criar duas instancias de um mesmo objeto e pedir para avaliar o conteudo deles, uma das instancias trazia o valor da outra

### Solução:

- Corrigido processo de cache de objetos para considerar o nome completo do mesmo.

# Versão [1.2.2]

## [4GL][tdsvscode 1.2.1] Variáveis Array de Record não tem valores visualizados no DEBUG [Issue 590](https://github.com/totvs/tds-vscode/issues/590)

### Problema:

- Ao depurar código 4GL que tenha variáveis modulares do tipo ARRAY OF RECORD, os valores dos itens da lista não são apresentadas.

### Solução:

- Na análise da ocorrrência, verificamos que o tipo de servidor, em `servers.json`, não estava correto.
- Foi adicionado atributo tipo de servidor (`type`) no registro de novos servidores.

Para servidores registrados antes desta versão, favor:

- abrir o arquivo `servers.json` em modo texto;
- ajustar o atributo `savedTokens` para uma lista vazia;
- localize a definição do servidor LOGIX e ajuste o atributo `type` para `totvs_server_logix`.

Detalhes em
https://github.com/totvs/tds-vscode/issues/590#issuecomment-742527102.

## Configurar uma pasta inicial padrão para geração de patches. [Issue 398](https://github.com/totvs/tds-vscode/issues/398)

### Melhoria:

- Adicionada a salva da última pasta utilizada na geração de patches que será sugerida na próxima geração.

## Atualização de versão do TypeScript para 4.1

### Problema:

- Devido a quebra de compatibilidade com versões anteriores, ocorrem erros de compilação.
  Detalhes em [Breaking changes](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#breaking-changes)

### Solução:

- Código compatibilizado com o TS 4.1.

## Implementação do processo de validação de pacotes de atualização (_patch_)

### Problema:

- Os pacotes de atualização eram validados parcialmente.

### Solução:

- Reformulação do processo de validação/aplicação de pacotes.
- Interface com usuário refeita, para atender o novo processo.

## Informar parâmetros para debugar ponto de Entrada. [Issue 589](https://github.com/totvs/tds-vscode/issues/589)

### Problema:

- Não estava sendo possível informar parâmetros de entrada para o SmartClient.

### Solução:

- Foi revisto o processo de obtenção dos parâmetros de entrada, na execução e depuração, assim como foi revisto o configurador de Launchers para cadastrar parâmetros nos launchers.

# Versão [1.2.1]

## Não exibe conteúdo de array no Watch. [Issue 549](https://github.com/totvs/tds-vscode/issues/549)

### Problema:

- O conteúdo de arrays não estavam sendo exibidos/atualizados nas variáveis e watch, durante a depuração.

### Solução:

- Foi realizado uma correção no DA para considerar os arrays e 'parent' de objetos.

## VSCode Debug error: User not authenticated. Please connect/reconnect to a server. [Issue 423](https://github.com/totvs/tds-vscode/issues/423)

### Problema:

- Ocorria erro indicando que o usuário não estava conectado ao iniciar a depuração. Isso ocorria apenas com usuários cujo nome continham acentuações.

### Solução:

- Foi revista e corrigida a carga das chaves necessárias para ler o token de conexão do LS pelo DA.

## Confirmar exclusão de servidor [Issue 578](https://github.com/totvs/tds-vscode/issues/578)

### Melhoria:

- Adicionada uma confirmção para ação de exclusão de servidores.

## Aplicação de Patch (Apply Patch) não funciona [Issue 573](https://github.com/totvs/tds-vscode/issues/573)

### Problema:

- O botão 'Apply Patch' não está funcionando quando não há uma chave de compilação válida aplicada.

### Solução:

- Adicionada validação de existência da chave antes da operação de 'Apply Patch'.

## Erro intermitente na conexão com o appserver advpl [Issue 518](https://github.com/totvs/tds-vscode/issues/518)

### Problema:

- Ao tentar compilar um fonte enquanto existe uma depuração ativa, ocorre um erro fatal no LS.

### Solução:

- Adicionamos proteções nas ações que necessitam de acesso exclusivo ao RPO que impedem sua execução se a depuração estiver ativa.

## Conexão com Monitor dando erro de Privilégio [Issue 571](https://github.com/totvs/tds-vscode/issues/571)

### Problema:

- Ocorre erro na verificação de privilégios para obter os usuários no Monitor.

### Solução:

- A validação foi temporariamente desativada para questões do Monitor.

## Aborting end build (rollback changes) [Issue 564](https://github.com/totvs/tds-vscode/issues/564)

### Problema:

- Ao compilar workspace ou pasta com vários arquivos e ocorrer erro em um dos arquivos compilados, todos os arquivos não são compilados (rollback).

### Solução:

- Adicionada a opção "Comitar a compilação com erros/alertas" que permite habilitar o 'commit' mesmo com erros/alertas em arquivos que estão sendo compilados.

# Versão [1.2.0]

## Genéricas

- Documentação e ajustes no [Sistema de Privilégios](docs/servers.md)
- Implementação de opção para visualização do log do repositório

## Implementação da API generatePPO

- Foi implementada a API generatePPO que gera o conteúdo do PPO do arquivo em edição. Maiores detalhes em [API exportadas](https://github.com/totvs/tds-vscode/blob/dev/docs/exported-api.md)

## Chave de compilação Inválida [Issue 563](https://github.com/totvs/tds-vscode/issues/563)

### Problema:

- Ao aplicar uma chave de compilação ocorre erro indicando que a chave é inválida.

### Solução:

- Foi aplicada uma correção interna nas validações da chave de compilação.

## Implementação chamado #269

- Opção de manter as configurações de servidores na área de trabalho e [troca rápida](docs/servers.md)

## Correção chamado #553

- Erro de compilação [FATAL] não é exibido na aba PROBLEMS e nem no LOG do AppServer.

# Versão [1.1.1]

## Correção chamado #549

- Não exibe conteúdo de array e objetos no Watch

## Correção chamado #444

- DEBUG 4GL não aceita expressões na view DEBUG CONSOLE e derruba AppServer (linux) em uma atribuição inválida

# Versão [1.1.0]

## Genéricas

- Atualização de dependências de terceiros
- Higienização de código
- Atualização de documentação (reorganização)

## Correção chamado #371

- Corrigido a solicitação de autenticação ao trocar de servidor/ambiente, mesmo com senha salva.

## Correção chamados #520 e #526

- Corrigido a seleção de programa/função a ser executada (executor).

## Correção chamados #531

- Corrigido apresentação da estrutura de fontes 4GL na visão `Outline`.

## Correção na compilação 4GL quando há comando "globals <arquivo>"

- Resolução do chamado interno [DTCLIENT01-2015](https://jiraproducao.totvs.com.br/browse/DTCLIENT01-2015). Requer atualização do _appServer_.

## Monitoramento de servidores TOTVS (BETA)

- Salva automática de configurações efetuadas no painel de Monitoramento
- Atualização da lista de usuários após a desconexão

## Revisão de processos de edição 4GL

- Processo de formatação revisado. Detalhes em (Formatação de código fonte)[docs/format_config.md]

---

# Versão 1.0.6

## Monitoramento de servidores TOTVS (BETA)

- Monitoramento de conexões do servidor corrente
- Envio de mensagens para um ou mais usuários
- Bloqueio de novas conexões
- Desconexão de um ou mais usuários ou de _jobs_

---

## Revisão do processo de tradução

- Processo de tradução foi revisto. Consulte [localização](LOCALIZATION.pt-br.MD) para detalhes.

---

## PRTOPDEF File not found [Issue 440](https://github.com/totvs/tds-vscode/issues/440)

### Problema:

- Durante uma compilação a mensagem "C2090 File not found PRTOPDEF.CH" é apresentada como erro de compilação.

### Solução:

- Um filtro de extensão de arquivos estava considerando apenas a extensão em letras minúsculas. Se a extensão do arquivo for .PRW ela não estava sendo considerada como AdvPL e não adicionava os includes para compilar.

---

## Extensão trava ao compilar vários fontes [Issue 437](https://github.com/totvs/tds-vscode/issues/437)

### Problema:

- Durante a compilação de múltiplos arquivos (compilação de pasta/workspace) o vscode trava e pode exibir a mensagem "The window is no longer responding".

### Solução:

- O problema está na exibição de muitas notificações pelo vscode. Por enquanto desabilitamos as notificações alterando o padrão para "none".

---

## Erro ao adicionar Servidor (Cannot read property 'id' of undefined) [Issue 434](https://github.com/totvs/tds-vscode/issues/434)

### Problema:

- Ocorre erro na exibição da visão de Servidores e adição de novos servidores.

### Solução:

- Corrigido processo interno na gravação da informação do último servidor conectado.

---

# Versão 1.0.5

## Melhorias na visão "Servidores"

- Adicionado os comandos abaixo, direto no nó do item:
  - Servidor: Conexão
  - Ambiente: Remoção
- Menu de contexto melhorado, apresentando opções conforme o estado do servidor

## [4GL] Liberação do editor para 4GL (BETA)

### Recursos liberados

- Sintaxe destacada conforme tipo (definição, palavra reservada, ...);
- Árvore de estrutura (_outline_), a ser detalhada em liberações futuras.

### Ajustes

- Processo de compilação e outros de apoio

## [4GL] Liberação do depurador para 4GL (BETA)

### Recursos liberados

- Suporte a ponto de parada;
- Avaliação de expressões;
- Árvore de variaveis por escopo;
- Suporte a tipos específicos do 4GL (record, image e outras);

### Problemas conhecidos (SOMENTE em servidores Logix)

Ao utilizar **TOTVS Server**, de versão igual ou anterior a 19.3.0.0 de 01/06/20, detectamos algumas inconsistências durante o processo de depuração:

- Variáveis do tipo _text_, ao terem seus valores modificados por uma atribuição, pode ocasionar queda no processo;
- Variáveis com valor _NIL_ (nulo ou indefinido), podem apresentar resultados em formato diferente quando avaliados no _watch_, do apresentado no bloco do escopo;

## [AdvPL] Árvore de estrutura (_outline_)

- Árvore de estrutura (_outline_), a ser detalhada em liberações futuras.

## Nomenclatura e ortografia

- Padronização da nomenclatura de _AppSever_ para _TOTVS Server_;
- Padronização da identificação _AdvPL_ para _AdvPL/4GL_, quando aplicada as duas linguagens;
- Opção do console _Advpl_, na visão _Output_, alterada para _TOTVS LS_;
- Na árvore da visão _settings_, identificação da extensão passou a ser _TOTVS_;
- Correções ortográficas;

---

# Versão 1.0.4

## Conexão com _TOTVS Server_ com erro - Smartclient 19.3.0.5 (com SSL desligado) [Issue 390](https://github.com/totvs/tds-vscode/issues/390)

### Problema:

- Após da actualizacao do binário do smartclient 19.3.0.5 quando tento lancar um debug com o TDS-VSCode, tenho a janela com siguiente erro: "ERR0027: TOTVS | SmartClient conectou com TOTVS | Application Server mas houve erro no início de validação de conexão."

### Solução:

- Ajustado a geração da configuração para depuração.

---

## Ajustado geração de patch com characteres maiusculos no MAC [Issue 386](https://github.com/totvs/tds-vscode/issues/386)

### Problema:

- Após atualização do language server, o MAC, erroneamente, passou a recusar aplicação de patch caso existisse character maiusculo no caminho do arquivo. Esse processo deve ser apenas para Linux

### Solução:

- Corrigido configuração no Language Server para que o processo de validação ocorra apenas no Linux

---

# Versão 1.0.3

## Problema ao criar launchers a partir das configurações do Smartclient na inicialização [Issue 377](https://github.com/totvs/tds-vscode/issues/377)

### Problema:

- Selecione um smartclient na tela de boas vindas e salve. Os launchers não estão sendo gerados corretamente.

### Solução:

- A geração inicial do arquivo launch.json estava incompleto e foi corrigida.

---

## Senha não fica salva [Issue 371](https://github.com/totvs/tds-vscode/issues/371)

### Problema:

- Ao trocar de ambiente pela seleção de servidor/ambiente na barra inferior, mesmo com o token salvo previamente, a extensão está solicitando o usuário e senha do ambiente novamente.

### Solução/Melhoria:

- A seleção de servidor/ambiente estava com a ação de "Conexão" e foi alterada para "Reconexão" para agilizar a conexão pela barra inferior.

---

## Problema ao tentar gerar cliente WSDL [Issue 369](https://github.com/totvs/tds-vscode/issues/369)

### Problema:

- Problema ao tentar gerar cliente WSDL sem ter uma chave de compilação aplicada. Ocorre o erro "Authorization token was not informed.".

### Solução:

- Foi realizada correção para remover esta validação pois a chave não é obrigatória nestes casos.

---

## Erro ao adicionar servidor [Issue 367](https://github.com/totvs/tds-vscode/issues/367)

### Problema:

- Ao adicionar servidor está sendo apresentada a mensagem: "Cannot read property 'length' of undefined".

### Solução:

- O processo de inicialização permitia a criação do servers.json com apenas a seção "includes". Adicionadas validações para que o arquivo mínimo seja criado ao instalar a extensão.

---

## Possibilidade de exportar arquivo com as informações do conteúdo do patch [Issue 301](https://github.com/totvs/tds-vscode/issues/301)

### Melhoria:

- Adicionada a funcionalidade para exportar um arquivo com as informações do conteúdo do patch em 'Patch Infos'.

---

# Versão 1.0.2

## Exibir apenas os arquivos com Erros na tabela de resultados da compilação quando ocorrer problemas nas compilações [Issue 347](https://github.com/totvs/tds-vscode/issues/347)

### Problema:

- Quando ocorrem erros (Error/Fatal) durante a compilação o processo é abortado e ocorre o "rollback". Porém a tabela com o resultado da compilação exibe os fontes sem erros como se estivessem compilados no RPO causando confusão uma vez que eles não estarão no RPO.

### Solução/Melhoria:

- Filtrar a tabela de resultados da compilação para exibir apenas os arquivos com erros quando o processo for abortado.

---

## Configuração "totvsLanguageServer.extensions.folder.patch" não está sendo respeitada [Issue 297](https://github.com/totvs/tds-vscode/issues/297)

### Problema:

- A compilação não respeita o filtro de extensões definidas em "totvsLanguageServer.extensions.folder.patch".

### Solução/Melhoria:

- O problema era que esta configuração foi criada apenas para a compilação durante a geração de patches. A configuração foi alterada para "totvsLanguageServer.folder.extensionsAllowed" e será utilizada na compilação, seja apenas compilação, seja na geração de patches. Além disso foi adicionada a opção de desabilitar o filtro nos Setting em "Folder: Enable Extensions Filter".

---

## Protheus ao compilar Files/Folder [Issue 329](https://github.com/totvs/tds-vscode/issues/329)

### Problema:

- Erro ao compilar pasta.

### Solução:

- O problema era com apenas um arquivo cujo retorno de erro do **TOTVS Server** estava fora do padrão. Melhorado o tratamento para capturar este erro fora do padrão e exibir ao usuário.

---

## Problema na compilação com binário 7.00.191205P [Issue 292](https://github.com/totvs/tds-vscode/issues/292)

### Problema:

- Ao compilar pastas/workspaces com muitos arquivos o TDS VS Code travava e/ou caia.

### Solução:

- Limitada a exibição de notificações caso o número de arquivos ultrapasse um certo valor. Exibindo apenas as informações consolidadas após o término da compilação.

---

## Separar a ação de conectar e reconectar em um servidor [Issue 344](https://github.com/totvs/tds-vscode/issues/344)

### Melhoria:

- Separadas as ações de conectar e reconectar. O connect se comporta como se fosse uma nova conexão independentemente de existir um token de reconexão. E o reconnect utiliza o token de reconexão se existir ou se comporta como o connect se ainda não existir um token de reconexão.

---

## Erro ao compilar fontes em aberto (.app junto) [Issue 334](https://github.com/totvs/tds-vscode/issues/334)

### Problema:

- Ao compilar arquivos em editores abertos o processo para ao encontrar um arquivo que não pode ser aberto sem a intervenção do usuário, como por exemplo um pdf.

### Solução:

- Ao encontrar um arquivo que não pode ser aberto ele passa para o próximo editor aberto.

---

# Versão 1.0.1

## Seleção de diretório seleciona o primeiro arquivo do diretório [Issue 317](https://github.com/totvs/tds-vscode/issues/317)

### Melhoria:

- Ao selecionar um diretório está selecionando um arquivo deste diretório. Este problema começou após uma atualização do VS Code que mudou o comportamento do componente de seleção de diretório.

---

## Implementar a verificação de integridade do RPO [Issue 288](https://github.com/totvs/tds-vscode/issues/288)

### Melhoria:

- Implementada a verificação de integridade do RPO no menu de contexto do servidor conectado, similar a opção de desfragmentação do RPO.

---

## Exibir o console (Output) durante a compilação [Pull Request 271](https://github.com/totvs/tds-vscode/pull/271)

### Melhoria:

- Adicionada opção nas preferência para exibir o console (Output) ao acionar uma compilação.

---

## Compile/Recompile open Editors [Issue 276](https://github.com/totvs/tds-vscode/issues/276)

### Problema:

- A opção de compilar/recompilar os editores abertos parou de funcionar após atualização Windows/VS Code.

### Solução:

- Ajustada a forma de comparação entre editores que foi alterada com a atualização.

---

## Erro de compilação [Issue 270](https://github.com/totvs/tds-vscode/issues/270)

### Problema:

- Se a variável utilizada na instrução `For` não estiver declarada como `Local` o _TOTVS Server_ informa um 'warning', mas como a mensagem estava fora do padrão estabelecido, a mensagem se tornava um 'error'.

### Solução:

- Melhorado o tratamento das mensagens de 'error/warning' para exibir corretamente esta mensagem.

---

## Opção "Select" no menu contextual do conexão ambiente não esta funcionando [Issue 253](https://github.com/totvs/tds-vscode/issues/253)

### Problema:

- Ao clicar em `Select` no menu de contexto de um 'environment' não acontece nada.

### Solução:

- Corrigida a implementação do `Select` no menu de contexto dos 'environments'.

---

## Não consigo compilar fontes Vs Code [Issue 239](https://github.com/totvs/tds-vscode/issues/239)

### Problema:

- Alguns erro do pré compilador não eram exibidos corretamente na visão `Problems`.

### Solução:

- Corrigido o tratamento de mensagens de erro do pré compilador que indicavam a linha 0 (que não existe).

---

# Versão 0.3.23

## Connection terminated by administrator [Issue 189](https://github.com/totvs/tds-vscode/issues/189)

### Problema:

- Depuração derruba o servidor exibindo a mensagem "Connection terminated by administrator".

### Solução:

- Corrigida ação interna da mensagem idle da depuração.

---

# Versão 0.3.22

## Ao formatar o documento a identação fica errada quando existe #ifdef [Issue 230](https://github.com/totvs/tds-vscode/issues/230)

### Problema:

- Ao formatar o documento a identação fica errada quando existe #ifdef.

### Solução:

- Corrigida a regra para identação do #endif.

---

# Versão 0.3.21

## Extensão permite adicionar o mesmo server várias vezes [Issue 58](https://github.com/totvs/tds-vscode/issues/58)

### Problema:

- Extensão permite adicionar o mesmo server várias vezes.

### Solução:

- Correção do problema no momento da inclusão ou renomeação da conexão.

---

## Configuração Debug WebApp [Issue 195](https://github.com/totvs/tds-vscode/issues/195)

### Problema:

- Falha no inicio da depuração via WebApp.

### Correção:

- Corrigida situação no momento do inicio da depuração.

---

## Corrigida indentação de código BeginSQL e EndSQL [Issue 214](https://github.com/totvs/tds-vscode/issues/214)

### Problema:

- Indentação de código BeginSQL e EndSQL na formatação por trecho incorreta.

### Solução:

- Correção no processo de formatação entre BeginSQL e EndSQL.

---

## Focar na janela de "problemas" quando ocorrer "erro de compilação" [Issue 172](https://github.com/totvs/tds-vscode/issues/172)

### Problema:

- Focar na janela de "problemas" quando ocorrer "erro de compilação".

### Solução:

- Adicionada verificação se houve problema na compilação e muda o foco para aba de "Problemas".

---

# Versão 0.3.20

## Corrigido parada de breakpoint mesmo após ter sido removido [Issue 121](https://github.com/totvs/tds-vscode/issues/121)

### Problema:

- Mesmo após remover um breakpoint, o servidor ainda mandava uma informação de parada de depuração.

### Solução:

- Correção interna no processo do debug adapter.

---

## Corrigido problema de demora de sincronização de variáveis durante a depuração [Issue 142](https://github.com/totvs/tds-vscode/issues/142)

### Problema:

- Ao expandir um grupo de variaveis ocorre uma demora excesiva para que elas sejam apresentadas.

### Solução:

- Alterado o debug Adapter para realizar uma busca mais eficiente dos fontes quando ocorrer uma parada.

---

## Corrigido identação automática ao digitar a palavra "do" [Issue 152](https://github.com/totvs/tds-vscode/issues/152)

### Problema:

- Ao escrever algo que contenha a palavra "do", o código da linha com esta é indentado, realizando um recuo.

### Solução:

- Corrigido processo de identação em relação à palavra "do".

---

## Corrigido erro de identação em Embedded Sql [Issue 156](https://github.com/totvs/tds-vscode/issues/156)

### Problema:

- Quando existe um código de embedded Sql com o operador UNION ALL a formatação não funciona corretamente.

### Solução:

- Corrigido processo de identação para Embedded Sql.

---

## Corrigido erro de identação em WsRestful e End WsRestful [Issue 164](https://github.com/totvs/tds-vscode/issues/164)

### Problema:

- A identação dos comandos WsRestful, WsData, WsMethod e End WsRestful não são tratadas corretamente.

### Solução:

- Corrigido processo de identação para de WsRestful, WsData, WsMethod e End WsRestful.

---

## Corrigido erro de identação em BeginSQL e EndSQL [Issue 188](https://github.com/totvs/tds-vscode/issues/188)

### Problema:

- A identação em comandos BeginSQL e EndSQL não funcionam corretamente.

### Solução:

- Corrigido processo de identação dos comandos BeginSQL e EndSQL.

---

## Corrigido o problema de conexão [Issue 207](https://github.com/totvs/tds-vscode/issues/207)

### Problema:

- Ao cadastrar um novo servidor e tentar conectar ocorre falha na conexão.

### Solução:

- Corrigido o cadastro do servidor referente ao valor do novo parâmetro 'secure'.

---

# Versão 0.3.18

## Corrigido travamento do Debug (stacktrace e evalute) [Issue 193](https://github.com/totvs/tds-vscode/issues/193)

### Problema:

- Ao depurar fontes onde trafegavam informações, no stacktrace ou evaluate, com acentuação ocorria um problema no encoding e desconectava o Debug.

### Solução:

- Corrigido o tratamento de encoding.

---

# Versão 0.3.17

## Corrigido travamento na carga do Smartclient durante o Debug [Issue 186](https://github.com/totvs/tds-vscode/issues/186)

### Problema:

- Ao iniciar a depuração o smartclient inicia a carga mas fica travado.

### Solução:

- Corrigida a inicialização do smartclient.

---

# Versão 0.3.16

## Corrigido travamento no Debug (Avaliação de Objetos) [Issue 170](https://github.com/totvs/tds-vscode/issues/170)

### Problema:

- Ao depurar objetos ocorria um erro que travava o debug.

### Solução:

- Corrigida a avaliação de objetos no DebugAdapter.

---

## Corrigido a salva do último programa executado [Issue 89](https://github.com/totvs/tds-vscode/issues/89)

### Problema:

- Ao digitar um nome de programa a ser executado pela depuração, este não era salvo para exibição na próxima execução.

### Solução:

- Corrigida a salva do nome do último programa executado.

---

# Versão 0.3.15

## Adicionada proteção durante debug de tabelas [Issue 165](https://github.com/totvs/tds-vscode/issues/165)

### Problema:

- Ao depurar tabelas ocorria um erro que derrubava o DebugAdapter.

### Solução:

- Adicionada uma proteção para tratar esse erro no **TOTVS Server** que derrubava o DebugAdapter.

---

# Versao 0.3.14

## Inclusão de PullRequest [PullRequest 155](https://github.com/totvs/tds-vscode/pull/155)

### PullRequest:

- Inclusão de palavras reservadas.

---

## Corrigido problema ao abrir a tela de "Compile Key"

### Problema:

- Ao abrir a tela de "Compile Key" sem que antes algum processo tenha iniciado o Language Server, esse último era iniciado após a abertura da tela ocasionando um erro para definir o Id da máquina.

### Solução:

- Alterado o processo de abertura da tela de "Compile Key" para que se caso nao exista um "LS no ar", aguardar a inicialização do mesmo para continuar com a abertura da página.

---

## Corrigido problema que fazia com que breakpoints removidos cotinuassem a realizar paradas na depuração [Issue 121](https://github.com/totvs/tds-vscode/issues/121)

### Problema:

- Durante a depuração, em um loop por exemplo, caso um breakpoint fosse removido e usuario pedisse um "Run", esse breakpoint continuava sendo considerado e a parada era realizada.

### Solução:

- Realizado correção no processo de sincronismo de breakpoints pelo debug adapter.

---

# Versão 0.3.13

## Implementado notificação de "Exceptions" informadas pelo servidor na visão "Debug Console" [Issue 99](https://github.com/totvs/tds-vscode/issues/99#)

### Problema:

- Quando é lançado uma exceção pelo servidor o plugin não mostra no console.

### Solução:

- Alterado o Servidor DAP para receber mensagens de Exception do servidor e enviar uma mensagem de log para o Client.

---

## Removido a opção para inicalizar o plugin do TDS VsCode simplemsmente ao lançar uma depuração qualquer [Issue 124](https://github.com/totvs/tds-vscode/issues/124)

### Problema:

- O Plugin do TDS VsCode era ativado sempre que uma depuração era iniciada, mesmo que fosse de outra linguagem.

### Solução:

- Removido o parametro "onDebug" dos eventos que ativam a extensão.

---

## Alterado mensagem de falha ao fazer o "StartBuild" para incluir sugestão de que o servidor pode estar off-line [Issue 135](https://github.com/totvs/tds-vscode/issues/135)

### Problema:

- Caso o usuario peça uma compilação e por algum motivo o servidor não está mais on-line, a mensagem de erro apresentada não era clara sobre essa situação.

### Solução:

- Mensagem de erro alterada incluindo informação para o usuario que a falha pode ter ocorrido pois o servidor está off-line.

---

## Correção na identificação de declaração de classe pelo Syntax Highlight [Issue 116](https://github.com/totvs/tds-vscode/issues/116)

### Problema:

- Em uma classe, caso seja removido os espaços, ou tabs, no inicio da linha onde estão as declarações de variaveis e métodos, corrompia toda a pintura do fonte.

### Solução:

- Correão na expressão regular de identificação de variáveis e métodos na declaração de classes.

---

# Versão 0.3.12

## Correção emergencial de problema no pré compilador [Issue 111](https://github.com/totvs/tds-vscode/issues/111)

### Problema:

- Ao compilar fontes que possuam a instrução %NotDel% ocorre problema no pre compilador.

### Solulção:

- Correção interna no pré compilador.

---

# Versão 0.3.11

## Gerar saída para console [Issue 60](https://github.com/totvs/tds-vscode/issues/60)

### Melhoria:

- Adicionar uma forma de gerar uma saída no console durante a depuração sem precisar compilar.

### Solução:

- Implementado a funcionalidade de "logpoint" do VsCode no Language Server.

---

## Demora na execução de debug [Issue 95](https://github.com/totvs/tds-vscode/issues/95)

### Problema:

- A depuração apresenta problemas de performance e na abertura da aba de variaveis e tabelas.

### Solução:

- Feito uma série de pequenas correções no servidor DAP.

---

## Erro ao aplicar patch [Issue 96](https://github.com/totvs/tds-vscode/issues/96)

### Problema:

- Erro "Patch URI list not informed" ao aplicar patch.

### Solução:

- Correções internas no Language Server.

---

# Versão 0.3.10

## Identação de código [Issue 91](https://github.com/totvs/tds-vscode/issues/91)

### Melhoria:

- Não alterar a posição do return.

### Solução:

- Desligar a formatação na salva do fonte e não alterar a posição do return na formatação.

---

## Recompatibilização com servidores 131227 [Issue 90](https://github.com/totvs/tds-vscode/issues/90) relativo a [Issue 86](https://github.com/totvs/tds-vscode/issues/86)

### Problema:

- Ao se conectar a um servidor com build inferior a 170117 o servidor não conectava.

### Solução:

- Corrigir o LS para suportar build 131227.

---

## Perda de conexão [Issue 86](https://github.com/totvs/tds-vscode/issues/86) relativo a [Issue 90](https://github.com/totvs/tds-vscode/issues/90)

### Problema:

- Cada vez que é feito uma operação no server o vscode exibe uma informação de conexão perdida e faz a reconexão com o server.

### Solução:

- Corrigir o LS.

---

# Versão 0.3.5

## Exibir tabela com o resultado da compilação [Issue 68](https://github.com/totvs/tds-vscode/issues/68)

### Melhoria:

- Implementar uma opção de exibir os resultados da compilação quando compilado multiplos arquivos.

### Solução:

- Implementar uma tabela com todos os dados de compilação, exibindo quais arquivos foram compilados, quais tem erros, com opção e filtro e ordenação.

---

## Indentação de código [Issue 3](https://github.com/totvs/tds-vscode/issues/3)

### Melhoria:

- Indentação de código fonte Adv/PL.

### Solução:

- Implementado procedimentos na extensão:
  1. Acione menu de contexto do editor, opção "_Format Document_ (`SHIFT + ALT + F`)".
  1. Menu de contexto de um recurso (arquivo fonte) ou pasta, opção "_Format_".

---

## Exibir tabelas e conteúdo: [Issue 20](https://github.com/totvs/tds-vscode/issues/20)

### Melhoria:

- Implementar o sincronismo de tabelas durante a depuração.

### Solução:

- Implementado o sincronismo de tabelas, o qual aparecerá como um escopo de variável e ao chamar pela visão "Debug Console" prefixando o nome da tabela com o comando "table:" (Ex: table:SM0).

---

## Barra invoca intelisense: [Issue 16](https://github.com/totvs/tds-vscode/issues/16)

### Problema:

- Ao digitar o caractere "/" dentro de uma função, o intelisense é invocado sugerindo a ultima função usada dele.

### Solução:

- Remover os caracteres que disparam a mensagem de completion até que esteja funcional.

---

## Extensão .PRG: [Issue 45](https://github.com/totvs/tds-vscode/issues/45)

### Problema:

- Temos fontes .PRG e não estão sendo reconhecidos no vscode.

### Solução:

- Adicionada extensão de arquivo .PRG na lista de arquivos AdvPL.

---

## Chave de compilação vencida: [Issue 46](https://github.com/totvs/tds-vscode/issues/46)

### Problema:

- Após vencer a chave de compilação não é possível compilar nem User Function.

### Solução:

- Adicionado tratamento que detecta a chave de compilação vencida e informa que a mesma foi removida.

---

## Aplicação de patch não detecta rpo em uso: [Issue 47](https://github.com/totvs/tds-vscode/issues/47)

### Problema:

- Ao fazer uma compilação em um rpo em uso, a extensão gera um erro e aborta a execução da compilação, porém ao aplicar um patch em um rpo em uso, não ocorre o mesmo comportamento.

### Solução:

- Adicionado tratamento de erro ao tentar aplicar patch em um ambiente com o RPO em uso.

---

## Compilação do Projeto: [Issue 26](https://github.com/totvs/tds-vscode/issues/26)

### Problema:

- Quando compilo o folder, ele literalmente compila todos os fontes. Não da skip nos fontes que estão com a mesma versão.

### Solução:

- Averiguado e corrigido problema no cálculo do checksum dos arquivo causando a recompilação caso o workspace fosse utilizado pelo TDS (Eclipse).

---

## Compilação de fontes Abertos: [Issue 42](https://github.com/totvs/tds-vscode/issues/42)

### Problema:

- Implementar um atalho para compilação de todos fontes abertos no editor.

### Solução:

- Implementado comando e atalho (`CTRL + F10` / `CTRL + SHIFT + F10`) para compilar/recompilar todos o fontes abertos no editor.

---

## Chave de compilação necessita de um arquivo .AUT: [Issue 40](https://github.com/totvs/tds-vscode/issues/40)

### Problema:

- Não é possível validar uma chave de compilação sem fornecer um arquivo .AUT.

### Solução:

- Na realidade era possível mas a interface estava um pouco confusa, então alteramos a interface para melhorar a usabilidade.

---

## Permitir passagem de parâmetros para a função principal (-A): [Issue 36](https://github.com/totvs/tds-vscode/issues/36)

### Melhoria

- Permitir passagem de parâmetros para a função principal através do parâmetro -A na chamada do SmartClient.

### Solução:

- Implementado a passagem de parâmetro conforme documentado em https://github.com/totvs/tds-vscode/wiki/Configura%C3%A7%C3%A3o-de-debug:-diretivas-$%7Bcommand:%7D

---

## Permitir visualizar o conteúdo de um patch antes de aplicar: [Issue 38](https://github.com/totvs/tds-vscode/issues/38)

### Melhoria:

- Deveria ser possível visualizar o conteúdo de um patch antes de aplicar.

### Solução:

- Implementada a visualização do conteudo de Patches atraves do comando "TOTVS: Patch Infos".

---

## Geração de patch não respeita filtro \*: [Issue 70](https://github.com/totvs/tds-vscode/issues/70)

### Problema:

- Ao tentar gerar um patch e realizar o filtro com caracter "\*" o resultado não é apresentando.

### Solução:

- Os caracteres "_" serão removidos do filtro, pois o componente utilizado entende como a pesquisa pelo caracter "_".

---

## Inspetor de funções não mostra o arquivo: [Issue 73](https://github.com/totvs/tds-vscode/issues/73)

### Melhoria:

- O inspetor de funções mostra apenas a lista de funções, mas não mostra em que arquivo fonte está escrita a função.

### Solução:

- Adicionada as informações de fonte e linha retornados pelo _TOTVS Server_.

---

# Versão 0.2.1

## Salvar senha do ambiente: [Issue 5](https://github.com/totvs/tds-vscode/issues/5)

### Melhoria:

- Salvar a senha do ambiente para permitir a reconexão automática.

### Solução:

- Usuário e senha serão salvos (encriptados) para permitir a reconexão no ambiente.

---

## Conteúdos strings não são apresentadas como sendo tipo string: [Issue 7](https://github.com/totvs/tds-vscode/issues/7)

### Problema:

- Variável caracter apresentada sem aspas no Debug Console, caso tivesse conteúdo numérico poderia confundir o desenvolvedor mais desatento.

### Solução:

- Cercado com aspas o retorno da variável no Debug Console, reforçando ser caracter.

---

## Ordenação alfabética dos Servidores: [Issue 19](https://github.com/totvs/tds-vscode/issues/19)

### Melhoria:

- Novos servidores inseridos na ordem de criação, dificultando a localização.

### Solução:

- Ordenado alfabeticamente o servidor após sua inclusão.

---

## Iniciar conectado no ambiente anterior: [Issue 21](https://github.com/totvs/tds-vscode/issues/21) e relativo [Issue 5](https://github.com/totvs/tds-vscode/issues/5)

### Melhoria:

- Conectar automaticamente o ambiente Protheus na abertura da workspace.

### Solução:

- Com o armazenamento protegido da senha, faremos a reconexão automática no ambiente de desenvolvimento.

---

## Abas exibidas, porém sem variáveis: [Issue 22](https://github.com/totvs/tds-vscode/issues/22)

### Melhoria:

- Não apresentar as pastas de variáveis na sessão Debug, durante a depuração, caso não haja nenhuma variável disponível para o tipo em questão (local, public, private, static).

### Solução:

- Abas de variáveis serão exibidas apenas quando tiverem conteúdo.

---

## Localização do strings para Espanhol: [Issue 34](https://github.com/totvs/tds-vscode/issues/34)

### Melhoria:

- Traduzir extensão para o Espanhol.

### Solução:

- Traduzida extensão para o Espanhol.

---

## Encoding sugerido: [Issue 37](https://github.com/totvs/tds-vscode/issues/37)

### Melhoria:

- Auxiliar o desenvolvedor a utilizar o encode Windows1252 por padrão em seus fontes AdvPL.

### Solução:

- Na abertura da workspace será apresentado um popup com três botões questionando:
  Quer mudar o encoding para o padrão Windows1252?

  **Sim:** Todos os fontes AdvPL serão abertos como Windows1252 (definido no arquivo settings.json);

  **Não:** Arquivos serão abertos com o encode padrão do próprio VSCode, e a pergunta será repetida na próxima vez que iniciar o VS;

  **Não pergunte novamente:** Arquivos serão abertos com o encode padrão do próprio VSCode, e a pergunta não será repetida novamente para essa workspace.

  **Observação:**

Em casos específicos, como na compilação de fontes em Cirílico (Russo), o encode poderá ser definido manualmente no arquivo settings.json de sua workspace, abaixo um exemplo de como usar o cirílico (Windows1251).

    {
    	"totvsLanguageServer.welcomePage": false,
    	"[advpl]": {
    		"files.encoding": "windows1251"
    	},
    	"totvsLanguageServer.askEncodingChange": false
    }

---

## Intelisense omite variáveis e funções locais: [Issue 8](https://github.com/totvs/tds-vscode/issues/8) relativo a [Issue 15](https://github.com/totvs/tds-vscode/issues/15)

### Melhoria:

- Definir sugestão de variáveis durante a codificação.

### Solução:

- Implementada opção para desabilitar o autocomplete vindo do LSP (Ctrl+Alt+Space), assim, priorizando a apresentação das variavíes contidos no fonte em edição.

---

## Auto-Complete: Identificação de variáveis: [Issue 15](https://github.com/totvs/tds-vscode/issues/15) relativo a [Issue 8](https://github.com/totvs/tds-vscode/issues/8)

### Melhoria:

- Implementar processo de identificação de variáveis do fonte corrente para ser informado no auto-complete.

### Solução:

- Implementado de opção para troca de comportamento do auto-complete:
  - Acesse 'setttings', opção "TOTVS Language Server › Editor › Toggle: Autocomplete"
  - No editor, acione o atalho ctrl+alt+space
- Na barra de status será apresentado o comportamento atual, sendo:
  _ Basic: executa o autocompletar padrão do VSCode.
  _ LS: inclui informações disponíveis no RPO padrão.
  ![issue15a](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/autocomplete/basic.PNG)
  </br>
  ![issue15b](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/autocomplete/complete.PNG)

---

## Permitir configurar quais notificações serão exibidas: [Issue 25](https://github.com/totvs/tds-vscode/issues/25)

### Melhoria:

- Permitir configurar atraves do painel de configuração da extenção AdvPL quais notificações serão exibidas (Nenhuma, Apenas Erros, Erros + Warnings ou Todas).

### Solução:

- Adicionado opção de configuração, onde o usuário define qual o nível de mensagem que será notificada via 'popup'. Independente da configuração, todas as mensagens serão apresentadas no log de console "AdvPL".
  ![issue25](https://raw.githubusercontent.com/totvs/tds-vscode/master/imagens/configs/notification.png)

---

# Versão 0.1.0

- Alteração de ícone TOTVS.
- Definição de Licença Apache 2.0.
- Opção de aplicar patch com fontes mais antigo que o RPO.
- Correções na configuração de include.
- Melhorias no Sintax Highlight.
- Melhorias nas mensagens de compilação.
- Liberação de chave de compilação válida pra LINUX e MAC.

---

# Versão 0.0.28

- Adicionado EndDo a lista de palavras reservadas.
- Remoção de Login com Identity.
- Disponibilidade no Marketplace do VSCode.
- Ajuste de parametros da aplicação de patch.
- Opção de Exportar Lista de Objetos.
- Opção de Exportar Lista de Funções.
