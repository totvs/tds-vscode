## TDSReplay 2.0

[Vídeo Aula](https://www.youtube.com/watch?v=iU2UOtQ6GGI)

[![Vídeo Aula](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/VideoTDSReplay.PNG)](https://www.youtube.com/watch?v=iU2UOtQ6GGI "TDS Replay 2.0")

O **TDSReplay** é uma ferramenta investigativa que permite tirar uma foto do
**ERP TOTVS** no momento exato de uma ocorrência, seja um erro de
processamento ou execução, ou mesmo uma falha crítica que interrompa a
execução do sistema.

Ele captura um conjunto de informações que permitirá a investigação pelo
Suporte da TOTVS, sem a necessidade de montagens de ambiente, cópias de
RPO ou Bancos de Dados.

O **TDSReplay 2.0** foi aprimorado para acelerar e facilitar a obtenção
das informações, e está disponível a partir das seguintes versões:

- Release 25
    - **AppServer** igual ou superior a **19.3.1.0 (obrigatório BIN 19)**
- Release 27
    - **AppServer** igual ou superior a **19.3.1.0**
- LIB
    - Igual ou superior a Label **20200908**
- Plugin do VsCode
    - **TDS-VSCode** igual ou superior a **1.2.1**, mais informações acesse: [TDS-VSCode](https://marketplace.visualstudio.com/items?itemName=totvs.tds-vscode)

> `IMPORTANTE`:
> A gravação do TDSReplay para o SmartClient WebApp (HTML) estará disponível para build de AppServer igual ou superior a **19.3.1.0**.

## `IMPORTANTE: PROBLEMAS CONHECIDOS USANDO A SIGAMDI`

- Para gravar as informações, `NÃO` é recomendado utilizar o `SIGAMDI`.

- Deve-se chamar o módulo diretamente ou usar o SIGAADV.
- O log é feito por thread. O Programa Inicial SIGAADV e o Programa Inicial que chama diretamente os módulos (SIGACOM por exemplo) abre apenas uma thread, sem abas. Já o SIGAMDI abre uma thread por aba aberta. Desta forma, o log valerá apenas para a aba aberta em que for iniciado.

## Obtendo os dados para investigação

Agora a obtenção dos dados poderá ser feita **diretamente pelo usuário**
do sistema, da seguinte maneira:

1. Acesse a rotina que deve ser investigada a partir do ERP TOTVS.

2. Para iniciar a gravação da ocorrência pressione **Shift+F6**, abrindo o painel com as informações do sistema.

3. Pressione o botão **Avançar** até selecionar a opção **Rastrear Fontes**.

4. Confirme com o Suporte da TOTVS a necessidade de **Gerar fontes de Lib**, caso necessário marque a opção.

5. Pressione o botão **Iniciar**, aguarde o início do processo, e pressione o botão **Concluir**.
![Get File](https://github.com/ricardomansano/Exemplos/blob/master/tdsreplay_get_file.png)

6. Execute a rotina até o ponto que reproduza a ocorrência / problema.

7. Caso haja uma falha crítica que interrompa a execução do sistema, o arquivo será automaticamente salvo.

8. Em qualquer outro caso de falha, como calculo, processo, etc, pressione novamente **Shift+F6**.

9. Pressione o botão **Avançar** até **Rastrear Fontes**.

10. Pressione o botão **Finalizar**.

11. O arquivo com as informações será gerado na **pasta do SmartClient** de sua estação, como no exemplo abaixo.

12. Anexe o arquivo gerado ao seu chamado.
![File Generator](https://github.com/ricardomansano/Exemplos/blob/master/tdsreplay_file_generate.png).

13. Por fim, caso ainda não tenha feito, pressione o botão **Concluir** no painel com as informações do sistema.

## Investigando as informações coletadas

As informações obtidas serão utilizadas pelo **Suporte da TOTVS** durante a
investigação.

### Instalando o Executor do TDSReplay no VSCode

O TDSReplay **faz parte do plugin tds-vscode**, para mais informações
acesse:
[*https://marketplace.visualstudio.com/items?itemName=totvs.tds-vscode*](https://marketplace.visualstudio.com/items?itemName=totvs.tds-vscode)

### Configurando o Executor

Para criar um executor do TDSReplay, pressione (**ctrl + shift + p** no Windows / Linux ou **command+p** no Mac), e selecione a opção **`TDSReplay: Configure Launchers`**.

> **Atenção:** Os executores do TDSReplay e do depurador convencional **não são compatíveis**.

 ![TDSReplay Executor Command](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/LauncherCommand.PNG)

### Tela do Executor

 ![TDSReplay Executor Screen](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/LaunchConfigScreen.PNG)

### Campos do Executor

- **`Choose Launcher`**:
Essa opção é uma caixa de seleção, caso necessite alterar um executor já cadastrado selecione o mesmo, caso esteja criando um novo, apenas digite seu nome.

- **`File`**:
Informe/Selecione o arquivo do TDSReplay obtido pelo cliente.

- **`Password`**:
Por padrão a senha será omitida durante a gravação dos dados, então deixe este campo em branco.

- **`Include Sources`**:
No momento do tratamento das informações é possível filtrar o conjunto de fontes que **deseja importar**.
    - > utilize o curinga asterisco (**\***) para auxiliar no filtro, e a vírgula (**,**) como separador dos filtros, ex: **FINA04\*.PRW,MAT\*03\***, ou utilize um único asterisco (**\***) para importar todos os fontes, porém atente que este processo **terá um grande impacto** sobre o tempo de importação e sobre a performance da execução durante a investigação.

- **`Exclude Sources`**:
Essa opção permite filtrar o fontes que **deseja ignorar** durante a investigação, e aceita curingas da mesma maneira que o `Include Sources`.

- **`Ignore sources not found in workspace (debugging)`**:
Essa opção vai omitir da **Linha do Tempo** os fontes que não estiverem disponíveis para investigação.

- **`Import only the sources information`**:
Ao marcar essa opção, será importado apenas as informações dos fontes recuperadas do RPO (Até o momento: nome e data de compilação).
Note que ao marcar essa opção não será possível configurar os campos: **Include Sources**, **Exclude Sources** e **Ignore sources not found in workspace** pois por padrao será importado todos os fontes disonivel no arquivo do TDS Replay informado.

> No arquivo launch.json será criado a entrada: "importOnlySourcesInfo": true, que pode ser alterado, removido ou adicionado manualmente em qualquer entrada do executor com id **totvs_tdsreplay_debug**

- **`forceImport`**:
Essa opção não aparece na tela, mas é possível adicioná-la diretamente no arquivo launch.json na configuração de execução.
Ao colocar o valor como true ("forceImport": true) sempre que essa configuração for lançada, será feito uma nova importação.
Atenção para isso pois caso o arquivo do TDS Replay seja muito grande, irá ocupar bastante espaço de armazenamento.

> **Atenção:** Por padrão, caso ele já tenha sido importado, a mesma base será usada mesmo que o arquivo do TDS Replay seja movido ou renomeado. A reimportação automática acontecerá quando uma importação já tenha sido feita, mas a base não exista no caminho original. A opção "forceImport": true é útil para casos onde o próprio usuário julgar necessário uma nova importação.

Pressione `Save ou Save/Close`, adicionando o executor arquivo arquivo `launch.json` e habilitando seu uso.

 ![TDSReplay Executor Json](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/LauncherJson.PNG)

### Analisando o arquivo

O primeiro passo é a importação do arquivo, que será feito **uma única vez**, em sua primeira execução.

Selecione na visão **Run** (no painel à esquerda) o executor que inseriu no passo anterior, ele estará disponível na caixa de seleção superior, conforme imagem anterior.

O VSCode irá apresentar uma notificação com o progresso, e também, na visão `Output`, irá exibir o progresso em modo texto.

> O tempo de importação varia de acordo com o tamanho do arquivo gravado, e também com os filtros utilizados.

 ![Import Progress](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/ImportProgress.PNG)

 Após a o término da importação será exibida em uma nova aba a visão de **`Linha do Tempo`**, permitindo sua reposição em tela, como na imagem abaixo:

  ![Time Line Example](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/TimeLineExample1.PNG)

  A partir deste ponto o processo segue exatamente como um depuração convencional.

  > Note que ao utilizar um `Step Over` (ou `F10`) a linha correspondente da execução será posicionada também na visão de **Linha do Tempo**, da mesma forma, selecionando um item na Linha do Tempo a depuração irá selecionar a linha correspondente no código fonte.

  > **Importante**: Ao desabilitar a opção **`Ignore Source Not Found`**, os fontes não localizados serão exibidos na cor **`vermelha`**, apenas para `informação`, e **`não poderão ser selecionados`**. Note também o aumento no número de páginas da Linha do Tempo.

 ![Ingore Source Not Found unchecked](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/TimeLineView-IgnoreSourceNotFoundUnchecked.PNG)

### Variáveis

 Da mesma forma que a depuração convencional, os valores das variaveis são exibidos nos painéis **Variables** e **Watches**.

 > **Importante**: Não é possível executar expressões durante a depuração do TDSReplay, pois este processo é apenas uma **"foto"** do que aconteceu, e não está associado a um AppServer em execução.

 ![Watch Variables](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/WatchViewAndDebugConsole.PNG)

 > Caso um fonte tenha sido **`filtrado na importação`**, e uma `variável` teve seu valor atribuído nesse fonte, será exibida a mensagem: **`N/A (Value exists in a source that was filtered)`**, como no exemplo abaixo.

![Variable Filtered](https://raw.githubusercontent.com/totvs/tds-vscode/dev/docs/tdsreplay/VariableFilteredEx.PNG)

### Tabelas

As tabelas são apresentadas como um escopo de variáveis e podem ser acessadas como um _array_ou objeto.

É possível visualizar o conteúdo da tabela na visão `Expressions` apenas informando o nome dela.

A visão `Debug Console` também permite visualizar a tabela inteira, porém é preciso usar o comando: `table:NOME_DA_TABELA`

Também é possível visualizar o conteúdo de um campo usando a visão `Expressions` ou a visão `Debug Console`. Para isso deve-se usar o formato: `TABELA->CAMPO`

### Filtro de fontes na Linha do Tempo (a partir da versão 2.0.1)

É possível selecionar quais fontes serão apresentados na Linha de Tempo acionando-se a ação `Sources`, que encontra-se no rodapé da visão.

![image](https://github.com/totvs/tds-vscode/assets/114854608/6aa772e2-4dc5-4731-92b1-919ce981ddc6)

No diálogo apresentado, selecione os fontes que deseja ver na Linha do Tempo e confirme (`Apply`).
A ação `Reset`, cancela as seleções efetuadas, deixando o padrão de seleção que são todos os fontes.
A ação `Cancel`, fecha o diálogo sem aplicar as seleções no filtro.

![image](https://github.com/totvs/tds-vscode/assets/114854608/0474446b-6448-4eb1-98f3-caf847f28dd2)

Somente os eventos dos fontes serão apresentados e com destaque visual indicando que esta sendo aplicado um filtro.

![image](https://github.com/totvs/tds-vscode/assets/114854608/517b3845-0f58-46b5-851a-7f6d236e1ac9)

Pode-se repetir a operação sempre que necessários, adicionando ou retirando novos fontes.
