# TDS Replay 2.0

> `ATENÇÃO`: Essa funcionalidade está em desenvolvimento e por enquanto deve ser usada apenas por pessoas AUTORIZADAS.

O TDS Replay permite fazer uma depuração em um arquivo gravado no ambiente em o problema ocorre, fazendo com que dessa forma não seja necessário o envio de grandes arquivos e longos processos de montagem de ambiente para reprodução do problema.

## Instalação:

O TDS Replay já faz parte do plugin tds-vscode portanto não é necessário nenhum procedimento adicional para sua instalação.

## Executor:

* Para criar um executor do TDS Replay, basta chamar o comando (Usando a opção `ctrl + p` ou `command+p` no Mac) `TDSReplay: Configure Launchers`.
 > `Atenção:` O executor do TDS Replay e do depurador normal possuem parâmetros diferentes como pode ser verificado mais abaixo.

 ![TDS Replay Executor Command](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/LauncherCommand.PNG)

 * Após acionar o comando, será mostrada a tela abaixo:

 ![TDS Replay Executor Screen](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/LaunchConfigScreen.PNG)


## Campos do executor:

* `Choose Launcher`: Escolha na caixa de seleção um executor do TDS Replay criado previamente para ser editado ou caso esteja criando um novo, digite o nome.

* `File`: Informe/Selecione o arquivo do TDS Replay já gravado.

* `Password`: Informe nesse campo a senha do arquivo (A qual deve ter sido informada por quem realizou a gravação) ou deixe em branco caso no momento da gravação nenhuma senha foi usada.

* `Include Sources`: Informe nesse campo os fontes que deseja importar. Esse campo aceita o caractere curinga asterisco (*) para auxiliar no filtro de fontes, ou pode ser informado apenas o asterisco para importar todos os fontes. Note que ao usar o asterisco para importar tudo o que foi gravado, pode ter um grande impacto no tempo de importação e performance da execução.

* `Exclude Sources`: Informe nesse campo fontes que, após passarem pelo filtro acima, devem ser desconsiderados. Esse campo é útil para situações onde é necessário importar todo um conjunto de fontes, exceto, um ou outro desse mesmo conjunto. Por exemplo: É necessário importar todos os fontes MATA (MATA01.PRW, MATA02.PRW, MATA03.PRW e etc) exceto o MATA03.PRW, portanto, o campo Include Sources deve conter o filtro: MATA* e o campo Exclude Sources o filtro MATA03.PRW para que este não seja importado.

* `Ignore sources not found in workspace (debugging)`: Essa opção não tem impacto na importação, mas na execução onde os fontes que foram importados, ou seja, que passaram pelos filtros acima, não foram encontrado na pasta/workspace aberto pelo usuário, portanto não deve ser mostrados na visão de linha do tempo.

Após clicar em `Save ou Save/Close`, o executor é adicionado ao arquivo launch.json e o executor fica disponível para ser selecionado pelo VSCode.

 ![TDS Replay Executor Json](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/LauncherJson.PNG)


## Execução:

Ao lançar o executor do TDS Replay, será iniciado primeiramente o `processo de importação` das informações, caso esse processo ainda não tenha sido feito. O VSCode irá apresentar uma notificação com o progresso deve aparecer uma nova saída na visão `Output` onde o progresso também será informado em modo texto.

> O tempo de importação pode variar de `poucos minutos` a `várias horas`, dependendo do `tamanho do arquivo` gravado e dos que foi informado nos campos `Source Include` e `Source Exclude`.

 ![Import Progress](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/ImportProgress.PNG)

 Após a o término da importação, será aberto automaticamente a visão de `Linha do Tempo`. Por limitações do VSCode, essa visão é uma WebView e será aberta em um novo “quadro” que pode ser fechado e aberto usando os comandos do VSCode, ou reposicionado da forma que achar melhor dentro do editor.

  ![Time Line Example](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/TimeLineExample1.PNG)

  Nesse ponto, o processo funciona praticamente como uma `depuração normal`. Note que ao usar um `Step Over` (ou `F10` no VSCode) a linha correspondente da execução será posicionada também na visão de Linha do Tempo. É possível também selecionar diretamente na linha do tempo, fazendo que a depuração seja posicionada exatamente no fonte e linha selecionados.

> Obs.: Note abaixo, que ao desabilitar a opção `Ignore Source Not Found`, os fontes não encontrados aparecem na cor `vermelha`, apenas para `verificação`, e `não podem ser selecionados`. Note também, como `aumenta o número de páginas`.


 ![Ingore Source Not Found unchecked](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/TimeLineView-IgnoreSourceNotFoundUnchecked.PNG)

 ## Variáveis

 Como mostrado na imagem abaixo, a visão Debug Console funciona como na visão AdvPL Commands do TDS Eclipse, onde é possível informar valores de variáveis para serem mostrados. Porém o TDS Replay possui uma limitação onde não é possível entrar expressões para serem avaliadas, já que essa execução não possui um servidor e nem é uma depuração em tempo real.

   ![Watch Variables](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/WatchViewAndDebugConsole.PNG)

   É importante observar também que se caso um fonte tenha sido `filtrado na importação`, e uma `variável` teve seu valor `atribuído nesse fonte`, será mostrado a seguinte mensagem: `N/A (Value exists in a source that was filtered)` conforme mostrado na figura abaixo.

![Variable Filtered](https://raw.githubusercontent.com/totvs/tds-vscode/dev/imagens/TDSReplay/VariableFilteredEx.PNG)





