#include "protheus.ch"
/*/{Protheus.doc} brgetddb
Cria um objeto do tipo grade com registros em linhas e informações em colunas.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/brgetddb

/*/
class brgetddb from MsBrGetDBase
data caliastrb as character
method new()
end class
/*/{Protheus.doc} brgetddb:new
Método construtor da classe.

@type method

@return object, Nova instância da classe BrGetDDB

@param [nrow], numeric, Indica a coordenada vertical superior do objeto.
@param [ncol], numeric, Indica a coordenada horizontal à esquerda do objeto.
@param [nwidth], numeric, Indica a coordenada vertical inferior do objeto.
@param [nheight], numeric, Indica a coordenada horizontal à direita do objeto.
@param [bline], codeblock, Indica o bloco de código da lista de campos. Observação: Este parâmetro é utilizado quando o browse trabalha com array.
@param [aheaders], array, Indica o título dos campos no cabeçalho.
@param [acolsizes], array, Indica a largura das colunas.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [cfield], character, Indica os campos necessários para o filtro.
@param [uval1], character, Indica o início do intervalo para o filtro.
@param [uval2], character, Indica o fim do intervalo para o filtro.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [bldblclick], codeblock, Indica o bloco de código que será executado quando clicar duas vezes, com o botão esquerdo do mouse, sobre o objeto.
@param [brclick], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [ocursor], object, Indica o tipo de ponteiro do mouse.
@param [nclrfore], numeric, Indica a cor do texto do componente.
@param [nclrback], numeric, Indica a cor de fundo do componente.
@param [cmsg], character, Indica a mensagem que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam20], logical, Compatibility parameter. Pass NIL.
@param [calias], character, Alias a ser utilizado como fonte dos registros do componente. No caso da fonte ser um array, deixar vazio.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, no objeto criado, estiver sendo realizada. Se o retorno for verdadeiro \(.T.\), o objeto continua habilitado; caso contrário, falso \(.F.\).
@param [uparam24], logical, Compatibility parameter. Pass NIL.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam26], array, Compatibility parameter. Pass NIL.
@param [uparam27], object, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, bline, aheaders, acolsizes, ownd, cfield, uval1, uval2, bchange, bldblclick, brclick, ofont, ocursor, nclrfore, nclrback, cmsg, uparam20, calias, lpixel, bwhen, uparam24, bvalid, uparam26, uparam27) class brgetddb
return


/*/{Protheus.doc} msbrgetdbase
Cria um objeto do tipo grade com registros em linhas e informações em colunas.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msbrgetdbase

/*/
class msbrgetdbase from TCBrowse
data bdelete as codeblock
data bempty as codeblock
data bmove as codeblock
data bnoaltered as codeblock
data badd as codeblock
data bcustomeditcol as codeblock
method new()
method callrefresh()
method goup()
method godown()
method goleft()
method goright()
method goposition()
method gotop()
method gobottom()
method pageup()
method pagedown()
method recadd()
end class
/*/{Protheus.doc} msbrgetdbase:new
Método construtor da classe.

@type method

@return object, Nova instância da classe MsBrGetDBase

@param [nrow], numeric, Indica a coordenada vertical superior do objeto.
@param [ncol], numeric, Indica a coordenada horizontal à esquerda do objeto.
@param [nwidth], numeric, Indica a coordenada vertical inferior do objeto.
@param [nheight], numeric, Indica a coordenada horizontal à direita do objeto.
@param [bline], codeblock, Indica o bloco de código da lista de campos. Observação: Este parâmetro é utilizado quando o browse trabalha com array.
@param [aheaders], array, Indica o título dos campos no cabeçalho.
@param [acolsizes], array, Indica a largura das colunas.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [cfield], character, Indica os campos necessários para o filtro.
@param [uval1], character, Indica o início do intervalo para o filtro.
@param [uval2], character, Indica o fim do intervalo para o filtro.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [bldblclick], codeblock, Indica o bloco de código que será executado quando clicar duas vezes, com o botão esquerdo do mouse, sobre o objeto.
@param [brclick], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [ocursor], object, Indica o tipo de ponteiro do mouse.
@param [nclrfore], numeric, Indica a cor do texto do componente.
@param [nclrback], numeric, Indica a cor de fundo do componente.
@param [cmsg], character, Indica a mensagem que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam20], logical, Compatibility parameter. Pass NIL.
@param [calias], character, Alias a ser utilizado como fonte dos registros do componente. No caso da fonte ser um array, deixar vazio.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, no objeto criado, estiver sendo realizada. Se o retorno for verdadeiro \(.T.\), o objeto continua habilitado; caso contrário, falso \(.F.\).
@param [uparam24], logical, Compatibility parameter. Pass NIL.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam26], array, Compatibility parameter. Pass NIL.
@param [uparam27], object, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, bline, aheaders, acolsizes, ownd, cfield, uval1, uval2, bchange, bldblclick, brclick, ofont, ocursor, nclrfore, nclrback, cmsg, uparam20, calias, lpixel, bwhen, uparam24, bvalid, uparam26, uparam27) class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:callrefresh
Força a atualização do browse.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/callrefresh
/*/
method callrefresh() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:goup
Posiciona o ponteiro do browse uma célula acima de onde está.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goup
/*/
method goup() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:godown
Posiciona o ponteiro do browse uma célula abaixo de onde está..

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/godown
/*/
method godown() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:goleft
Posiciona o ponteiro do browse uma célula a esquerda de onde está..

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goleft
/*/
method goleft() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:goright
Posiciona o ponteiro do browse uma célula a direita de onde está..

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goright
/*/
method goright() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:goposition
Posiciona o ponteiro do browse em uma linha específica.

@type method

@param [nlin], numeric, Número da linha a ser selecionada pelo cursor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goposition
/*/
method goposition(nlin) class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:gotop
Posiciona o ponteiro do browse na primeira linha.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gotop
/*/
method gotop() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:gobottom
Posiciona o ponteiro do browse na última linha.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gobottom
/*/
method gobottom() class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:pageup
Faz o ponteiro do browse saltar um número de linhas para cima.

@type method

@param [nlines], numeric, Número de linhas a serem saltadas para cima.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pageup
/*/
method pageup(nlines) class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:pagedown
Faz o ponteiro do browse saltar um número de linhas para baixo.

@type method

@param [nlines], numeric, Número de linhas a serem saltadas para baixo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pagedown
/*/
method pagedown(nlines) class msbrgetdbase
return
/*/{Protheus.doc} msbrgetdbase:recadd
Executa o codeblock bAdd.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/recadd
/*/
method recadd() class msbrgetdbase
return


/*/{Protheus.doc} mscalend
Cria um objeto do tipo calendário.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mscalend

/*/
class mscalend from TControl
data bchange as codeblock
data bchangemes as codeblock
data ddiaatu as date
data ddiaini as date
data ddiafim as date
data canmultsel as logical
method new()
method addrestri()
method addr_prev()
method addr_next()
method delrestri()
method delr_prev()
method delr_next()
method delallrestri()
method colorday()
method ctrlrefresh()
end class
/*/{Protheus.doc} mscalend:new
Método construtor da classe.

@type method

@return object, Nova instância da classe MsCalend

@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [lcanmultsel], logical, Indica se habilita \(.T.\) ou desabilita \(.F.\) a seleção de múltiplos dias.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, lcanmultsel) class mscalend
return
/*/{Protheus.doc} mscalend:addrestri
Adiciona uma data com restrição no calendário.

@type method

@param <ndia>, numeric, Indica a data que será restringida.
@param <ncorfonte>, numeric, Indica a cor da fonte.
@param [ncorborda], numeric, Indica a cor da borda.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addrestri
/*/
method addrestri(ndia, ncorfonte, ncorborda) class mscalend
return
/*/{Protheus.doc} mscalend:addr_prev
Adiciona uma data com restrição no calendário \(?\).

@type method

@param <ndia>, numeric, Indica a data que será restringida.
@param <ncorfonte>, numeric, Indica a cor da fonte.
@param [ncorborda], numeric, Indica a cor da borda.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addr_prev
/*/
method addr_prev(ndia, ncorfonte, ncorborda) class mscalend
return
/*/{Protheus.doc} mscalend:addr_next
Adiciona uma data com restrição no calendário \(?\).

@type method

@param <ndia>, numeric, Indica a data que será restringida.
@param <ncorfonte>, numeric, Indica a cor da fonte.
@param [ncorborda], numeric, Indica a cor da borda.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addr_next
/*/
method addr_next(ndia, ncorfonte, ncorborda) class mscalend
return
/*/{Protheus.doc} mscalend:delrestri
Exclui a restrição de uma determinada data.

@type method

@param [ndia], numeric, Indica a data para excluir a restrição.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delrestri
/*/
method delrestri(ndia) class mscalend
return
/*/{Protheus.doc} mscalend:delr_prev
Exclui a restrição de uma determinada data \(?\).

@type method

@param [ndia], numeric, Indica a data para excluir a restrição.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delr_prev
/*/
method delr_prev(ndia) class mscalend
return
/*/{Protheus.doc} mscalend:delr_next
Exclui a restrição de uma determinada data \(?\).

@type method

@param [ndia], numeric, Indica a data para excluir a restrição.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delr_next
/*/
method delr_next(ndia) class mscalend
return
/*/{Protheus.doc} mscalend:delallrestri
Exclui todas as restrições do calendário.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delallrestri
/*/
method delallrestri() class mscalend
return
/*/{Protheus.doc} mscalend:colorday
Define a cor das colunas \(dias da semana\).

@type method

@param <ndia>, numeric, Indica o dia da semana que terá a cor alterada \(1 para domingo, 2 para segunda e assim sucessivamente\).
@param <ncorfonte>, numeric, Indica a cor da fonte.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/colorday
/*/
method colorday(ndia, ncorfonte) class mscalend
return
/*/{Protheus.doc} mscalend:ctrlrefresh
Atualiza as informações do calendário.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctrlrefresh
/*/
method ctrlrefresh() class mscalend
return


/*/{Protheus.doc} mscalendgrid
Cria um objeto do tipo grade de períodos.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mscalendgrid

/*/
class mscalendgrid from TControl
data ctopmsg as character
data nlineatu as numeric
data nzoom as numeric
data nintervini as numeric
data nintervfim as numeric
data ntimeunit as numeric
method new()
method add()
method changecolor()
method delete()
method getescala()
method getintervaltime()
method gonext()
method goprev()
method reset()
method setdateini()
method setdefcolor()
method setresolution()
method settimeunit()
method changepos()
method gotointerval()
method setfillalllines()
end class
/*/{Protheus.doc} mscalendgrid:new
Método construtor da classe.

@type method

@return object, Nova instância da classe MsCalendGrid

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ddateini], date, Indica a data inicial do calendário.
@param [nresolution], numeric, Indica a resolução que será aplicada na grade do calendário.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [ndefcolor], numeric, Indica a cor de fundo da grade.
@param [brclick], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@param [lfilall], logical, Indica se habilita \(.T.\) ou desabilita \(.F.\) o preenchimento de todo o período.
@param [ntypeunit], numeric, Indica o tipo de grade, 0\(Default\) = Horas e 1 = Dias.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, nrow, ncol, nwidth, nheight, ddateini, nresolution, bwhen, baction, ndefcolor, brclick, lfilall, ntypeunit) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:add
Adiciona um período na grade.

@type method

@param [ccaption], character, Indica o título que será inserido à esquerda da grade.
@param [nlin], numeric, Indica o número da linha que será inserido no item.
@param [ninicial], numeric, Indica a data inicial.
@param [nfinal], numeric, Indica a data final.
@param [ncolor], numeric, Indica a cor que será utilizada para destacar o item.
@param [cdescri], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o item.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/add
/*/
method add(ccaption, nlin, ninicial, nfinal, ncolor, cdescri) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:changecolor
Redefine a cor de um determinado intervalo.

@type method

@param <nlinha>, numeric, Indica a linha do calendário.
@param <nintervalo>, numeric, Indica o intervalo que será redefinido no calendário.
@param <ncor>, numeric, Indica a cor que será utilizada no intervalo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/changecolor
/*/
method changecolor(nlinha, nintervalo, ncor) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:delete
Exclui um intervalo do calendário.

@type method

@return logical, Retorna um valor lógico que representa falha \(.F\) ou sucesso \(.T.\) na exclusão do intervalo.

@param <nlinha>, numeric, Indica a linha do calendário.
@param <nintervalo>, numeric, Indica o intervalo que será excluído.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delete
/*/
method delete(nlinha, nintervalo) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:getescala
Retorna um texto informando o intervalo e a quantidade de pixels necessários para exibição do calendário.

@type method

@return character, Retorna um texto informando o intervalo e a quantidade de pixels necessários para exibição do calendário.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getescala
/*/
method getescala() class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:getintervaltime
Retorna o texto definido para o intervalo.

@type method

@return character, Retorna o texto que contém informações sobre o intervalo.

@param <nlinha>, numeric, Indica a linha do calendário.
@param <nintervalo>, numeric, Indica o intervalo do calendário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getintervaltime
/*/
method getintervaltime(nlinha, nintervalo) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:gonext
Posiciona o ponteiro do mouse no início do próximo intervalo da linha selecionada.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gonext
/*/
method gonext() class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:goprev
Posiciona o ponteiro do mouse no início do intervalo anterior da linha selecionada.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goprev
/*/
method goprev() class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:reset
Limpa todos os intervalos do calendário.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reset
/*/
method reset() class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:setdateini
Define a data inicial do calendário.

@type method

@param <ddataini>, date, Indica a data inicial do calendário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setdateini
/*/
method setdateini(ddataini) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:setdefcolor
Define a cor de fundo do calendário.

@type method

@param <ncor>, numeric, Indica a cor de fundo do calendário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setdefcolor
/*/
method setdefcolor(ncor) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:setresolution
Define a resolução para exibição dos períodos.

@type method

@param <nresolu��o>, numeric, Indica a resolução que será utilizada para exibição dos períodos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setresolution
/*/
method setresolution(nresolu��o) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:settimeunit
Define o tipo de grade, 0 = Horas e 1 = Dias.

@type method

@param <ntypeunit>, numeric, Define o tipo de grade, 0 = Horas e 1 = Dias
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settimeunit
/*/
method settimeunit(ntypeunit) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:changepos
Redefine a posição de um determinado intervalo dentro da mesma linha.

@type method

@return logical, Retorna um valor lógico que representa falha \(.F\) ou sucesso \(.T.\) na alteração.

@param <nlinha>, numeric, Indica a linha do calendário.
@param <noldintervini>, numeric, Indica o início do intervalo que será redefinido no calendário.
@param <anewintervini>, numeric, Indica o novo início do intervalo.
@param <anewintervfim>, numeric, Indica o novo fim do intervalo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/changepos
/*/
method changepos(nlinha, noldintervini, anewintervini, anewintervfim) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:gotointerval
Posiciona o cursor no início do intervalo especificado.

@type method

@param <nlinha>, numeric, Indica a linha do calendário.
@param <nintervini>, numeric, Indica o início do intervalo que será apontado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gotointerval
/*/
method gotointerval(nlinha, nintervini) class mscalendgrid
return
/*/{Protheus.doc} mscalendgrid:setfillalllines
Indica se habilita \(.T.\) ou desabilita \(.F.\) o preenchimento de todo o período.

@type method

@param <lfilall>, logical, Indica se habilita \(.T.\) ou desabilita \(.F.\) o preenchimento de todo o período.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfillalllines
/*/
method setfillalllines(lfilall) class mscalendgrid
return


/*/{Protheus.doc} msdialog
Cria uma janela de diálogo, no programa, para entrada de dados do tipo modal. Desta forma, não é permitido que outras janelas recebam dados enquanto esta estiver ativa.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msdialog

/*/
class msdialog from TDialog
method new()
method create()
end class
/*/{Protheus.doc} msdialog:new
Método construtor da classe.

@type method

@return object, Nova instância da classe MsDialog

@param [ntop], numeric, Indica a coordenada vertical superior em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal esquerda em pixels ou caracteres.
@param [nbottom], numeric, Indica a coordenada vertical inferior em pixels ou caracteres.
@param [nright], numeric, Indica a coordenada horizontal direita em pixels ou caracteres.
@param [ccaption], character, Indica o título da janela.
@param [uparam6], character, Compatibilidade.
@param [uparam7], numeric, Compatibilidade.
@param [uparam8], logical, Compatibilidade.
@param [uparam9], variant, Compatibilidade.
@param [nclrtext], numeric, Indica a cor do texto.
@param [nclrback], numeric, Indica a cor de fundo.
@param [uparam12], object, Compatibilidade.
@param [ownd], object, Indica a janela mãe \(principal\) da janela que será criada. O padrão é a janela principal do programa.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam15], variant, Compatibilidade.
@param [uparam16], variant, Compatibilidade.
@param [uparam17], variant, Compatibilidade.
@param [ltransparent], logical, Se .T. permitira que a Dialog receba um fundo transparente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nbottom, nright, ccaption, uparam6, uparam7, uparam8, uparam9, nclrtext, nclrback, uparam12, ownd, lpixel, uparam15, uparam16, uparam17, ltransparent) class msdialog
return
/*/{Protheus.doc} msdialog:create
Método construtor da classe.

@type method

@return object, Nova instância da classe MsDialog

@param [ownd], object, Indica a janela mãe \(principal\) da janela que será criada. O padrão é a janela principal do programa.
@param [ntop], numeric, Indica a coordenada vertical superior em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal esquerda em pixels ou caracteres.
@param [nbottom], numeric, Indica a coordenada vertical inferior em pixels ou caracteres.
@param [nright], numeric, Indica a coordenada horizontal direita em pixels ou caracteres.
@param [ccaption], character, Indica o título da janela.
@param [uparam6], character, Compatibilidade.
@param [uparam7], numeric, Compatibilidade.
@param [uparam8], logical, Compatibilidade.
@param [uparam9], variant, Compatibilidade.
@param [nclrtext], numeric, Indica a cor do texto.
@param [nclrback], numeric, Indica a cor de fundo.
@param [uparam12], object, Compatibilidade.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam15], variant, Compatibilidade.
@param [uparam16], variant, Compatibilidade.
@param [uparam17], variant, Compatibilidade.
@param [ltransparent], logical, Se .T. permitira que a Dialog receba um fundo transparente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, ntop, nleft, nbottom, nright, ccaption, uparam6, uparam7, uparam8, uparam9, nclrtext, nclrback, uparam12, lpixel, uparam15, uparam16, uparam17, ltransparent) class msdialog
return


/*/{Protheus.doc} msselbr
Cria um objeto do tipo grade com registros em linhas e informações em colunas, com funcionalidades de marcação de linhas.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msselbr

/*/
class msselbr from TCBrowse
data lcanallmark as codeblock
data lallmark as codeblock
data lhasmark as codeblock
method new()
method ballmark()
method allmark()
end class
/*/{Protheus.doc} msselbr:new
Método construtor da classe.

@type method

@return object, Nova instância da classe MsSelBr

@param [nrow], numeric, Indica a coordenada vertical superior do objeto.
@param [ncol], numeric, Indica a coordenada horizontal à esquerda do objeto.
@param [nwidth], numeric, Indica a coordenada vertical inferior do objeto.
@param [nheight], numeric, Indica a coordenada horizontal à direita do objeto.
@param [bline], codeblock, Indica o bloco de código da lista de campos. Observação: Este parâmetro é utilizado quando o browse trabalha com array.
@param [aheaders], array, Indica o título dos campos no cabeçalho.
@param [acolsizes], array, Indica o tamanho das colunas.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [cfield], character, Indica os campos necessários para o filtro.
@param [uval1], character, Indica o início do intervalo para o filtro.
@param [uval2], character, Indica o fim do intervalo para o filtro.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [bldblclick], codeblock, Indica o bloco de código que será executado quando clicar duas vezes, com o botão esquerdo do mouse, sobre o objeto.
@param [brclick], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [ocursor], object, Indica o tipo de ponteiro do mouse.
@param [nclrfore], numeric, Indica a cor do texto do componente.
@param [nclrback], numeric, Indica a cor de fundo do componente.
@param [cmsg], character, Indica a mensagem que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam20], logical, Compatibility parameter. Pass NIL.
@param [calias], character, Alias a ser utilizado como fonte dos registros do componente. No caso da fonte ser um array, deixar vazio.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, no objeto criado, estiver sendo realizada. Se o retorno for verdadeiro \(.T.\), o objeto continua habilitado; caso contrário, falso \(.F.\).
@param [uparam24], logical, Compatibility parameter. Pass NIL.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, bline, aheaders, acolsizes, ownd, cfield, uval1, uval2, bchange, bldblclick, brclick, ofont, ocursor, nclrfore, nclrback, cmsg, uparam20, calias, lpixel, bwhen, uparam24, bvalid) class msselbr
return
/*/{Protheus.doc} msselbr:ballmark
Bloco de codigo a ser executado quando usuario clicar no header da coluna 1. Observação: sõ será executado quando o atributo lHasMark está ativado.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ballmark
/*/
method ballmark() class msselbr
return
/*/{Protheus.doc} msselbr:allmark
Ativa/desativa a marcação de acordo com o parametro lAllMark.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/allmark
/*/
method allmark() class msselbr
return


/*/{Protheus.doc} msworktime
Cria um objeto do tipo barra de período.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msworktime

/*/
class msworktime from TControl
data bchange as codeblock
data ntotalmark as numeric
method new()
method getblocks()
method getintertime()
method getvalue()
method setresol()
method setvalue()
end class
/*/{Protheus.doc} msworktime:new
Método construtor da classe.

@type method

@return object, Nova instância da classe MsWorkTime

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nresolution], numeric, Indica a resolução que será aplicada na barra de período.
@param [cvalue], character, Indica os intervalos que serão preenchidos. Esses intervalos podem ser utilizados através do método SetValue\(\).
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, nrow, ncol, nheight, nwidth, nresolution, cvalue, bwhen, bchange) class msworktime
return
/*/{Protheus.doc} msworktime:getblocks
Retorna o número de blocos selecionados.

@type method

@return numeric, Número de blocos selecionados.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getblocks
/*/
method getblocks() class msworktime
return
/*/{Protheus.doc} msworktime:getintertime
Retorna o período selecionado no formato `<HH:MM:SS>`.

@type method

@return character, Período selecionado no formato "HH:MM:SS".

@param [nbloco], numeric, Indica o bloco do calendário que deverá retornar o período.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getintertime
/*/
method getintertime(nbloco) class msworktime
return
/*/{Protheus.doc} msworktime:getvalue
Retorna os itens selecionados no formato `<XX X XX >`.

@type method

@return character, Itens selecionados no formato "XX X XX".

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getvalue
/*/
method getvalue() class msworktime
return
/*/{Protheus.doc} msworktime:setresol
Método mantido apenas para compatibilidade com versões anteriores.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setresol
/*/
method setresol() class msworktime
return
/*/{Protheus.doc} msworktime:setvalue
Define os valores de preenchimento.

@type method

@param [cvalor], character, Indica o valor que será definido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalue
/*/
method setvalue(cvalor) class msworktime
return


/*/{Protheus.doc} sbutton
Cria um objeto do tipo botão.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sbutton

/*/
class sbutton from TControl
data baction as codeblock
data ntype as numeric
method create()
method new()
method ctrlrefresh()
end class
/*/{Protheus.doc} sbutton:create
Método construtor da classe.

@type method

@return object, Nova instância da classe SButton

@param [ownd], object, Indica a janela ou controle visual onde o botão será criado.
@param [ntop], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ntype], numeric, Indica a imagem do tipo \(Exemplo: 1=OK e 2=Cancelar\) de botão que será utilizado. Observação: Estas imagens estão carregadas no Smart Client. Para obter o número de cada tipo de botão, consulte a tabela disponível na área "Observações".
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [lenable], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) o botão.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), ao posicionar o ponteiro do mouse sobre o botão.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, ntop, nleft, ntype, baction, lenable, cmsg, bwhen) class sbutton
return
/*/{Protheus.doc} sbutton:new
Método construtor da classe.

@type method

@return object, Nova instância da classe SButton

@param [ntop], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ntype], numeric, Indica a imagem do tipo \(Exemplo: 1=OK e 2=Cancelar\) de botão que será utilizado. Observação: Estas imagens estão carregadas no Smart Client. Para obter o número de cada tipo de botão, consulte a tabela disponível na área "Observações".
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [ownd], object, Indica a janela ou controle visual onde o botão será criado.
@param [lenable], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) o botão.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), ao posicionar o ponteiro do mouse sobre o botão.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, ntype, baction, ownd, lenable, cmsg, bwhen) class sbutton
return
/*/{Protheus.doc} sbutton:ctrlrefresh
Publicado porém sem implementação.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctrlrefresh
/*/
method ctrlrefresh() class sbutton
return


/*/{Protheus.doc} tbar
Barra de botões para a parte superior da interface.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tbar

/*/
class tbar from TControl
data nbtnwidth as numeric
data nbtnheight as numeric
method new()
method setbuttonalign()
end class
/*/{Protheus.doc} tbar:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TBar

@param [ownd], object, Janela ou controle visual onde o objeto será criado.
@param [nbtnwidth], numeric, Largura dos botões contidos na barra.
@param [nbtnheight], numeric, Altura dos botões contidos na barra.
@param [l3d], logical, O componente terá ou não um aspecto tridimensional \(3D\).
@param [uparam5], character, Compatibility parameter. Pass NIL.
@param [ocursor], object, Objeto do tipo de cursor a ser utilizado no componente.
@param [cresource], character, Recurso a ser utilizado como fundo da barra.
@param [lnoautoadjust], logical, Ajusta ou não automaticamente o tamanho do componente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, nbtnwidth, nbtnheight, l3d, uparam5, ocursor, cresource, lnoautoadjust) class tbar
return
/*/{Protheus.doc} tbar:setbuttonalign
Define o alinhamento dos botões contidos na barra.

@type method

@param <nval>, numeric, Código do tipo de alinhamento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setbuttonalign
/*/
method setbuttonalign(nval) class tbar
return


/*/{Protheus.doc} tbitmap
Exibe uma imagem no objeto.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tbitmap

/*/
class tbitmap from TControl
data cbmpfile as character
data cresname as character
data lautosize as logical
data lstretch as logical
data ltransparent as logical
method create()
method new()
method load()
method setbmp()
method setempty()
end class
/*/{Protheus.doc} tbitmap:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TBitmap

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create() class tbitmap
return
/*/{Protheus.doc} tbitmap:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TBitmap

@param [ntop], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels.
@param [nheight], numeric, Indica a altura em pixels.
@param [cresname], character, Indica o nome da imagem.
@param [cbmpfile], character, Indica o nome do arquivo.
@param [lnoborder], logical, Indica se desativa \(.T.\) a apresentação da borda.
@param [ownd], object, Indica a janela ou controle visual onde a imagem será criada.
@param [blclicked], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o objeto.
@param [brclicked], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@param [lscroll], logical, Indica se habilita \(.T.\)/desabilita \(.F.\) a barra de rolagem.
@param [lstretch], logical, Indica se ativa \(.T.\)/desativa \(.F.\) a extensão da imagem.
@param [ocursor], object, Indica o tipo de ponteiro do mouse.
@param [uparam14], character, Compatibilidade.
@param [uparam15], logical, Compatibilidade.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam19], logical, Compatibilidade.
@param [uparam20], logical, Compatibilidade.
@param [uparam21], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nwidth, nheight, cresname, cbmpfile, lnoborder, ownd, blclicked, brclicked, lscroll, lstretch, ocursor, uparam14, uparam15, bwhen, lpixel, bvalid, uparam19, uparam20, uparam21) class tbitmap
return
/*/{Protheus.doc} tbitmap:load
Carrega uma imagem do repositório ou do drive local.

@type method

@return logical, Retorna, verdadeiro \(.T.\), se a imagem for carregada com sucesso do repositório ou do arquivo físico, caso contrário, retornará falso \(.F.\).

@param [cresname], character, Nome da imagem do repositorio a ser carregada.
@param [cbmpfile], character, Caminho da imagem no sistema de arquivos local.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/load
/*/
method load(cresname, cbmpfile) class tbitmap
return
/*/{Protheus.doc} tbitmap:setbmp
Carrega uma imagem do repositório.

@type method

@return logical, Retorna, verdadeiro \(.T.\), se a imagem for carregada com sucesso do repositório ou do arquivo físico, caso contrário, retornará falso \(.F.\).

@param [cresname], character, Nome da imagem do repositorio a ser carregada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setbmp
/*/
method setbmp(cresname) class tbitmap
return
/*/{Protheus.doc} tbitmap:setempty
Limpa a imagem.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setempty
/*/
method setempty() class tbitmap
return


/*/{Protheus.doc} tbrowsebutton
Botão que não permite foco.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tbrowsebutton

/*/
class tbrowsebutton from TButton
method new()
end class
/*/{Protheus.doc} tbrowsebutton:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TBrowseButton

@param [nrow], numeric, Indica a coordenada vertical superior do objeto.
@param [ncol], numeric, Indica a coordenada horizontal à esquerda do objeto.
@param [ccaption], character, Texto mostrado no botão.
@param [ownd], object, Janela ou controle visual onde o botão será criado.
@param [baction], codeblock, Codeblock a ser executado quando clicar no botão.
@param [nwidth], numeric, Largura do componente.
@param [nheight], numeric, Altura do componente.
@param [uparam8], numeric, Compatibility parameter. Pass NIL.
@param [ofont], object, Objeto que define a fonte do componente.
@param [uparam10], logical, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Caso .F. as coordenadas serão em caracteres e não em pixels.
@param [uparam12], logical, Compatibility parameter. Pass NIL.
@param [uparam13], character, Compatibility parameter. Pass NIL.
@param [uparam14], logical, Compatibility parameter. Pass NIL.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [uparam16], codeblock, Compatibility parameter. Pass NIL.
@param [uparam17], logical, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ccaption, ownd, baction, nwidth, nheight, uparam8, ofont, uparam10, lpixel, uparam12, uparam13, uparam14, bwhen, uparam16, uparam17) class tbrowsebutton
return


/*/{Protheus.doc} tbtnbmp
Componente do tipo botão.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tbtnbmp

/*/
class tbtnbmp from TControl
data baction as codeblock
method newbar()
method loadbitmaps()
method setpopupmenu()
method sethastext()
end class
/*/{Protheus.doc} tbtnbmp:newbar
Método construtor da classe.

@type method

@return object, Nova instância da classe TBtnBmp

@param [cresname1], character, Nome do recurso que contém a imagem. Este recurso deve estar compilado,no repositório de imagens, para ser utilizado.
@param [uparam2], character, Compatibility parameter. Pass NIL.
@param [uparam3], character, Compatibility parameter. Pass NIL.
@param [uparam4], character, Compatibility parameter. Pass NIL.
@param [cmsg], character, Mensagem de dica de contexto \(tooltip/hint\), ao posicionar o ponteiro do mouse sobre o botão.
@param [baction], codeblock, Bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [uparam7], logical, Compatibility parameter. Pass NIL.
@param [ownd], object, Janela ou controle visual onde o botão será criado.
@param [uparam9], logical, Compatibility parameter. Pass NIL.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\) se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [ctooltip], character, Indica a mensagem que será apresentada quando o objeto exibir sua dica de contexto \(tooltip\).
@param [uparam12], logical, Compatibility parameter. Pass NIL.
@param [uparam13], codeblock, Compatibility parameter. Pass NIL.
@param [uparam14], character, Compatibility parameter. Pass NIL.
@param [uparam15], numeric, Compatibility parameter. Pass NIL.
@param [cprompt], character, Indica o texto que aparecerá no botão, caso não informado, é utilizado o cToolTip.
@param [ofont], object, Objeto que define a fonte do componente.
@param [uparam18], character, Compatibility parameter. Pass NIL.
@param [uparam19], character, Compatibility parameter. Pass NIL.
@param [uparam20], character, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/newbar
/*/
method newbar(cresname1, uparam2, uparam3, uparam4, cmsg, baction, uparam7, ownd, uparam9, bwhen, ctooltip, uparam12, uparam13, uparam14, uparam15, cprompt, ofont, uparam18, uparam19, uparam20) class tbtnbmp
return
/*/{Protheus.doc} tbtnbmp:loadbitmaps
Define a imagem a ser utilizada como botão.

@type method

@param [cresname1], character, Nome do recurso que contém a imagem. Este recurso deve estar compilado no repositório para ser utilizado.
@param [uparam2], character, Compatibility parameter. Pass NIL.
@param [uparam3], character, Compatibility parameter. Pass NIL.
@param [uparam4], character, Compatibility parameter. Pass NIL.
@param [uparam5], character, Compatibility parameter. Pass NIL.
@param [uparam6], character, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/loadbitmaps
/*/
method loadbitmaps(cresname1, uparam2, uparam3, uparam4, uparam5, uparam6) class tbtnbmp
return
/*/{Protheus.doc} tbtnbmp:setpopupmenu
Define um TMenu estilo popup para quando acionar este componente.

@type method

@param [omenu], object, Objeto TMenu a ser utilizado em popup para quando acionar este componente.
@param [nalignment], numeric, Define o alinhamento de abertura do menu, sendo 1 o padrão da esquerda para a direita, e 2 da direita para a esquerda.
@param [lcustom], logical, Se .T. define um leiaute diferenciado para o menu.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpopupmenu
/*/
method setpopupmenu(omenu, nalignment, lcustom) class tbtnbmp
return
/*/{Protheus.doc} tbtnbmp:sethastext
Define se o botão terá texto ou não, só funciona se o tema da aplicação for diferente do padrão.

@type method

@param [lval], logical, Se .T. o botão terá texto, caso contrário não terá.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sethastext
/*/
method sethastext(lval) class tbtnbmp
return


/*/{Protheus.doc} tcalendarevent
Cria um objeto de evento de Calendário. Esta é uma classe de apoio para as funções de calendário da classe TMobile \(addCalendarEvent, findCalendarEvent, getCalendarEvent e viewCalendarEvent\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcalendarevent

/*/
class tcalendarevent from TClassInstance
data ctitle as character
data cdescription as character
data clocation as character
data dstartdate as date
data cstarttime as character
data denddate as date
data cendtime as character
data lallday as logical
method new()
method getcalendarid()
end class
/*/{Protheus.doc} tcalendarevent:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TCalendarEvent

@param [ctitle], character, Titulo do evento.
@param [cdescription], character, Descrição do evento.
@param [clocation], character, Localização do evento.
@param [dstartdate], date, Data inicial do evento.
@param [cstarttime], character, Horário inicial do evento.
@param [denddate], date, Data final do evento.
@param [cendtime], character, Horário final do evento.
@param [lallday], logical, Indica se o evento será o dia inteiro ou não, caso seja .T., os horários de início e fim serão desconsiderados.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ctitle, cdescription, clocation, dstartdate, cstarttime, denddate, cendtime, lallday) class tcalendarevent
return
/*/{Protheus.doc} tcalendarevent:getcalendarid
Retorna o ID do calendário \(se a classe for resultado de um getCalendarEvent ou após uma inclusão\).

@type method

@return character, Retorna o ID do evento. Se não existir retorna "0".

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcalendarid
/*/
method getcalendarid() class tcalendarevent
return


/*/{Protheus.doc} tcbrowse
Cria um objeto do tipo grade.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcbrowse

/*/
class tcbrowse from TControl
data aarray as array
data acolbmps as array
data acolsizes as array
data acolumns as array
data aheaders as array
data bbmpname as codeblock
data bdelok as codeblock
data bdrawselect as codeblock
data bgobottom as codeblock
data bgotop as codeblock
data bheaderclick as codeblock
data binrange as codeblock
data bldblclick as codeblock
data bline as codeblock
data blogiclen as codeblock
data bseekchange as codeblock
data bskip as codeblock
data bsuperdel as codeblock
data bvalid as codeblock
data calias as character
data cfield as character
data cordertype as character
data cseek as character
data ladjustcolsize as logical
data lautoedit as logical
data ldisablepaint as logical
data lhitbottom as logical
data lhittop as logical
data lhscroll as logical
data ljustific as logical
data lusedefaultcolors as logical
data lvscroll as logical
data nat as numeric
data ncolorder as numeric
data ncolpos as numeric
data nfreeze as numeric
data nlen as numeric
data nlinhas as numeric
data nrowpos as numeric
data nscrolltype as numeric
data aobfuscatedcols as array
method new()
method nrowcount()
method natcol()
method getcolsizes()
method getbrworder()
method getcellrect()
method getbrowse()
method addcolumn()
method setfilter()
method setarray()
method resetlen()
method skip()
method goup()
method godown()
method gotop()
method gobottom()
method goleft()
method goright()
method pageup()
method pagedown()
method goposition()
method gocolumn()
method drawselect()
method colpos()
method setheaderimage()
method setblkcolor()
method setblkbackcolor()
end class
/*/{Protheus.doc} tcbrowse:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TCBrowse

@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [bline], codeblock, Indica o bloco de código da lista de campos. Observação: Esse parâmetro é utilizado somente quando o browse trabalha com array.
@param [aheaders], array, Indica o título dos campos no cabeçalho.
@param [acolsizes], array, Indica a largura das colunas.
@param [ownd], object, Indica o controle visual onde o divisor será criado.
@param [cfield], character, Indica os campos necessários para o filtro.
@param [uvalue1], variant, Indica o início do intervalo para o filtro.
@param [uvalue2], variant, Indica o fim do intervalo para o filtro.
@param [bchange], codeblock, Indica o bloco de código que será executado ao mudar de linha.
@param [bldblclick], codeblock, Indica o bloco de código que será executado quando clicar duas vezes, com o botão esquerdo do mouse, sobre o objeto.
@param [brclick], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [ocursor], object, Indica o tipo de ponteiro do mouse.
@param [nclrfore], numeric, Indica a cor do texto da janela.
@param [nclrback], numeric, Indica a cor de fundo da janela.
@param [cmsg], character, Indica a mensagem ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam20], logical, Compatibilidade.
@param [calias], character, Indica se o objeto é utilizado com array \(opcional\) ou tabela \(obrigatório\).
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\) se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [uparam24], logical, Compatibilidade.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [lhscroll], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a barra de rolagem horizontal.
@param [lvscroll], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a barra de rolagem vertical.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, bline, aheaders, acolsizes, ownd, cfield, uvalue1, uvalue2, bchange, bldblclick, brclick, ofont, ocursor, nclrfore, nclrback, cmsg, uparam20, calias, lpixel, bwhen, uparam24, bvalid, lhscroll, lvscroll) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:nrowcount
Retorna o número de linhas que estão visíveis no browse.

@type method

@return numeric, Retorna o número de linhas que estão visíveis no browse

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nrowcount
/*/
method nrowcount() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:natcol
Retorna a coluna em uma determinada posição do browse.

@type method

@return numeric, Retorna a coluna na posição desejada.

@param <ncolpix>, numeric, Indica a posição em pixels para pesquisar o número da coluna do browse.
@param [lincludefreeze], logical, Indica se as colunas congeladas serão utilizadas no cálculo
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/natcol
/*/
method natcol(ncolpix, lincludefreeze) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:getcolsizes
Retorna um array com as larguras das colunas.

@type method

@return array, Retorna um array com as larguras das colunas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcolsizes
/*/
method getcolsizes() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:getbrworder
Retorna um array com os títulos, definidos pelo usuário, das colunas.

@type method

@return array, Retorna um array com os títulos, definidos pelo usuário, das colunas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getbrworder
/*/
method getbrworder() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:getcellrect
Retorna o retangulo da célula, do browse, no formato da classe TRect.

@type method

@return object, Objeto do tipo TRect com as dimensões da célula.

@param <ncoluna>, numeric, Coluna da célula desejada.
@param <nlinha>, numeric, Linha da célula desejada.
@param <orect>, object, Objeto do Tipo TRect que receberá os dados de dimensão da célula.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcellrect
/*/
method getcellrect(ncoluna, nlinha, orect) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:getbrowse
Retorna o objeto da classe TCBrowse.

@type method

@return object, Retorna o objeto da classe TCBrowse.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getbrowse
/*/
method getbrowse() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:addcolumn
Inclui coluna no browse.

@type method

@param <ocoluna>, object, Indica o objeto do tipo TCColumn utilizado para incluir coluna no browse.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcolumn
/*/
method addcolumn(ocoluna) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:setfilter
Define o filtro para os registros do browse.

@type method

@param <ccampo>, character, Indica o nome do campo que será utilizado para o filtro.
@param [uval1], variant, Indica a expressão inicial do intervalo para o filtro.
@param [uval2], variant, Indica a expressão final do intervalo para o filtro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfilter
/*/
method setfilter(ccampo, uval1, uval2) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:setarray
Define um array para o browse.

@type method

@param <adados>, array, Indica o array que contêm os dados para o browse.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setarray
/*/
method setarray(adados) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:resetlen
Reinicia o contador de linha do browse.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/resetlen
/*/
method resetlen() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:skip
Posiciona o ponteiro do mouse &quot;n&quot; linhas para frente.

@type method

@return numeric, Retorna o número de linhas que o ponteiro do mouse saltou.

@param <nskip>, numeric, Indica o número de linhas que o ponteiro do mouse irá saltar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/skip
/*/
method skip(nskip) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:goup
Move o ponteiro do mouse uma célula acima.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goup
/*/
method goup() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:godown
Move o ponteiro do mouse uma célula abaixo.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/godown
/*/
method godown() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:gotop
Move o ponteiro do mouse para a primeira linha do browse.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gotop
/*/
method gotop() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:gobottom
Move o ponteiro do mouse para a primeira linha do browse.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gobottom
/*/
method gobottom() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:goleft
Move o ponteiro do mouse para a célula adjacente à esquerda.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goleft
/*/
method goleft() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:goright
Move o ponteiro do mouse para a célula adjacente à direita.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goright
/*/
method goright() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:pageup
Move o ponteiro do mouse para cima, conforme o número de linha configurado.

@type method

@param <nlines>, numeric, Indica o número de linhas que o ponteiro do mouse irá saltar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pageup
/*/
method pageup(nlines) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:pagedown
Move o ponteiro do mouse para baixo, conforme o número de linha configurado.

@type method

@param <nlines>, numeric, Indica o número de linhas que o ponteiro do mouse irá saltar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pagedown
/*/
method pagedown(nlines) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:goposition
Posiciona o ponteiro do mouse na linha desejada.

@type method

@param <nlinha>, numeric, Indica a linha para posicionar o ponteiro do mouse.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goposition
/*/
method goposition(nlinha) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:gocolumn
Posiciona o cursor na coluna desejada.

@type method

@param <ncoluna>, numeric, Indica a coluna para posicionar o cursor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gocolumn
/*/
method gocolumn(ncoluna) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:drawselect
Força a atualização do browse.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/drawselect
/*/
method drawselect() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:colpos
Retorna o número da coluna posicionada.

@type method

@return numeric, Retorna o número da coluna posicionada.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/colpos
/*/
method colpos() class tcbrowse
return
/*/{Protheus.doc} tcbrowse:setheaderimage
Define uma imagem para o cabeçalho do browse.

@type method

@param <nrow>, numeric, Indica a coluna para inserir a imagem.
@param <cimage>, character, Indica o nome da imagem no RPO ou o caminho para a mesma, exemplo: `c:/diretorio/imagem.png`
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setheaderimage
/*/
method setheaderimage(nrow, cimage) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:setblkcolor
Define a cor da fonte das colunas.

@type method

@param <bcolor>, codeblock, Indica o bloco de código que permite tratar a cor da fonte da coluna.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setblkcolor
/*/
method setblkcolor(bcolor) class tcbrowse
return
/*/{Protheus.doc} tcbrowse:setblkbackcolor
Define a cor de fundo das colunas.

@type method

@param <bcolor>, codeblock, Indica o bloco de código que permite tratar a cor de fundo da coluna.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setblkbackcolor
/*/
method setblkbackcolor(bcolor) class tcbrowse
return


/*/{Protheus.doc} tccolumn
Cria um objeto do tipo coluna para ser utilizada no browse do sistema, como por exemplo: TCBrowse e BrGetDDb.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tccolumn

/*/
class tccolumn from TClassInstance
data bdata as codeblock
data bvalid as codeblock
data cheading as character
data cpicture as character
data ledit as logical
data cerror as character
data corder as character
data cmsg as character
data bclrfore as character
data bclrback as character
data forecolor as character
data backcolor as character
data lbitmap as logical
data lnolite as logical
data nalign as numeric
data nwidth as numeric
method new()
end class
/*/{Protheus.doc} tccolumn:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TCColumn

@param <ctitulo>, character, Indica o título da coluna.
@param <bdata>, codeblock, Indica o bloco de código que contém o campo da tabela que será apresentado no browse.
@param [cpicture], character, Indica a picture necessária para edição da coluna.
@param [uparam4], variant, Compatibilidade.
@param [uparam5], variant, Compatibilidade.
@param [calinhamento], character, Indica o tipo de alinhamento da coluna. Sendo: Left \(à esquerda\), Center \(centralizada\) ou Right \(à direita\).
@param [nlargura], numeric, Indica a largura da coluna.
@param [lbitmap], logical, Indica se, verdadeiro \(.T.\), a coluna é uma imagem; caso contrário, falso \(.F.\) \(conteúdo padrão\).
@param [ledit], logical, Compatibilidade.
@param [uparam10], variant, Compatibilidade.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam12], variant, Compatibilidade.
@param [uparam13], variant, Compatibilidade.
@param [uparam14], variant, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ctitulo, bdata, cpicture, uparam4, uparam5, calinhamento, nlargura, lbitmap, ledit, uparam10, bvalid, uparam12, uparam13, uparam14) class tccolumn
return


/*/{Protheus.doc} tcheckbox
Cria um objeto do tipo caixa de seleção \(CheckBox\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcheckbox

/*/
class tcheckbox from TControl
method new()
method create()
method ctrlrefresh()
end class
/*/{Protheus.doc} tcheckbox:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TCheckBox

@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [ccaption], character, Indica o título do objeto.
@param [bsetget], codeblock, Indica o bloco de código que será executado na mudança do item selecionado. O bloco de código é responsável pela mudança do valor, da variável lógica, que indica o item selecionado.
@param [odlg], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura do objeto.
@param [nheight], numeric, Indica a altura do objeto. É estipulada uma altura padrão para o objeto de 21 pixels, somente sendo possível sua alteração através da aplicação de estilo, utilizando o método SetCss, devidamente documentado no TDN.
@param [uparam8], numeric, Compatibilidade.
@param [blclicked], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [nclrtext], numeric, Indica a cor do texto da janela.
@param [nclrpane], numeric, Indica a cor de fundo da janela.
@param [uparam14], logical, Compatibilidade.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam17], logical, Compatibilidade.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ccaption, bsetget, odlg, nwidth, nheight, uparam8, blclicked, ofont, bvalid, nclrtext, nclrpane, uparam14, lpixel, cmsg, uparam17, bwhen) class tcheckbox
return
/*/{Protheus.doc} tcheckbox:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TCheckBox

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bsetget], codeblock, Indica o bloco de código que será executado na mudança do item selecionado. O bloco de código é responsável pela mudança do valor, da variável lógica, que indica o item selecionado.
@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [ccaption], character, Indica o título do objeto.
@param [nwidth], numeric, Indica a largura do objeto.
@param [nheight], numeric, Indica a altura do objeto. É estipulada uma altura padrão para o objeto de 21pixels, somente sendo possível sua alteração através da aplicação de estilo, utilizando o método SetCss, devidamente documentado no TDN.
@param [uparam8], numeric, Compatibilidade.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [nclrfore], numeric, Indica a cor do texto da janela.
@param [nclrback], numeric, Indica a cor de fundo da janela.
@param [uparam14], logical, Compatibilidade.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam17], logical, Compatibilidade.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, bsetget, nrow, ncol, ccaption, nwidth, nheight, uparam8, bchange, ofont, bvalid, nclrfore, nclrback, uparam14, lpixel, cmsg, uparam17, bwhen) class tcheckbox
return
/*/{Protheus.doc} tcheckbox:ctrlrefresh
Atualiza as informações do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctrlrefresh
/*/
method ctrlrefresh() class tcheckbox
return


/*/{Protheus.doc} tcolortriangle
Cria um objeto do tipo paleta de cores.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcolortriangle

/*/
class tcolortriangle from TControl
method create()
method new()
method retcolor()
method setcolor()
method setcolorini()
method setsizetriangle()
end class
/*/{Protheus.doc} tcolortriangle:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TColorTriangle

@param [ownd], object, Indica a janela ou controle visual onde a paleta de cores será criada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd) class tcolortriangle
return
/*/{Protheus.doc} tcolortriangle:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TColorTriangle

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ownd], object, Indica a janela ou controle visual onde a paleta de cores será criada.
@param [nwidth], numeric, Indica a largura da paleta de cores em pixels.
@param [nheight], numeric, Indica a altura da paleta de cores em pixels.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, nwidth, nheight) class tcolortriangle
return
/*/{Protheus.doc} tcolortriangle:retcolor
Retorna uma representação numérica do RGB \(Red, Green e Blue\) da cor.

@type method

@return numeric, Representação numérica do RGB \(Red, Green e Blue\) da cor, gerada através de um algoritmo próprio, que pode ser validada com seu nome definido no colors.ch.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/retcolor
/*/
method retcolor() class tcolortriangle
return
/*/{Protheus.doc} tcolortriangle:setcolor
Define o RGB \(Red, Green e Blue\) da cor que será utilizada.

@type method

@param [ncolor], numeric, Indica a representação numérica do RGB \(Red, Green e Blue\) da cor que será definida. O número pode ser utilizado com sua versão textual definida no colors.ch.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolor
/*/
method setcolor(ncolor) class tcolortriangle
return
/*/{Protheus.doc} tcolortriangle:setcolorini
Define a cor RGB \(Red, Green e Blue\) inicial.

@type method

@param [ncolor], numeric, Indica a representação numérica do RGB \(Red, Green e Blue\) da cor inicial. O número pode ser utilizado com sua versão textual definida no colors.ch.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolorini
/*/
method setcolorini(ncolor) class tcolortriangle
return
/*/{Protheus.doc} tcolortriangle:setsizetriangle
Define o tamanho do triângulo de configuração.

@type method

@param <nwidth>, numeric, Indica a largura do objeto.
@param <nheight>, numeric, Indica a altura do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setsizetriangle
/*/
method setsizetriangle(nwidth, nheight) class tcolortriangle
return


/*/{Protheus.doc} tcombobox
Cria um objeto do tipo caixa de seleção \(ComboBox\). Este controle permite a entrada de dados de múltipla escolha através dos itens definidos em uma lista vertical. Essa lista pode ser acessada ao pressionar a tecla F4 ou pelo botão à direita do controle.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcombobox

/*/
class tcombobox from TControl
data aitems as array
data nat as numeric
data lobfuscate as logical
data leditable as logical
method new()
method create()
method select()
method setitems()
method setheight()
end class
/*/{Protheus.doc} tcombobox:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TComboBox

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [bsetget], codeblock, Indica o bloco de código, no formato `{|u| if( Pcount( )>0, := u, ) }`, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for seqüencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [aitems], array, Indica uma lista de itens e caracteres que serão apresentados. Essa lista pode ter os seguintes formatos: Seqüencial `(Exemplo: {"item1","item2",...,"itemN"})` ou Indexada `(Exemplo: {"a=item1","b=item2",...,"n=itemN"})`.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, bsetget, aitems) class tcombobox
return
/*/{Protheus.doc} tcombobox:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TComboBox

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bsetget], codeblock, Indica o bloco de código, no formato `{|u| if( Pcount( )>0, := u, ) }`, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for seqüencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [aitems], array, Indica uma lista de itens e caracteres que serão apresentados. Essa lista pode ter os seguintes formatos: Seqüencial `(Exemplo: {"item1","item2",...,"itemN"})` ou Indexada `(Exemplo: {"a=item1","b=item2",...,"n=itemN"})`.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [uparam7], numeric, Compatibilidade.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o item selecionado é alterado.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [nclrtext], numeric, Indica a cor de texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam15], character, Compatibilidade.
@param [uparam16], logical, Compatibilidade.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [uparam18], logical, Compatibilidade.
@param [uparam19], array, Compatibilidade.
@param [uparam20], codeblock, Compatibilidade.
@param [uparam21], character, Compatibilidade.
@param [creadvar], character, Indica o nome da variável, configurada no parâmetro bSetGet, que será manipulada pelo objeto. Além disso, esse parâmetro será o retorno da função ReadVar\(\).
@param [clabeltext], character, indica o texto que será apresentado na Label.
@param [nlabelpos], numeric, Indica a posição da label, sendo 1=Topo e 2=Esquerda
@param [olabelfont], object, Indica o objeto, do tipo TFont, que será utilizado para definir as características da fonte aplicada na exibição da label.
@param [nlabelcolor], numeric, Indica a cor do texto da Label.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, bsetget, nrow, ncol, aitems, nwidth, nheight, uparam7, bchange, bvalid, nclrtext, nclrback, lpixel, ofont, uparam15, uparam16, bwhen, uparam18, uparam19, uparam20, uparam21, creadvar, clabeltext, nlabelpos, olabelfont, nlabelcolor) class tcombobox
return
/*/{Protheus.doc} tcombobox:select
Altera o item selecionado, da caixa de seleção, e executa o bloco de código `<bChange>` definido para o objeto.

@type method

@param [nitem], numeric, Indica a posição do item que será selecionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/select
/*/
method select(nitem) class tcombobox
return
/*/{Protheus.doc} tcombobox:setitems
Altera os itens da caixa de seleção \(ComboBox\).

@type method

@param <aitens>, array, Indica o array que contêm novos itens para a caixa de seleção \(ComboBox\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setitems
/*/
method setitems(aitens) class tcombobox
return
/*/{Protheus.doc} tcombobox:setheight
Altera a altura do componente.

@type method

@param <nheight>, numeric, Altura do componente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setheight
/*/
method setheight(nheight) class tcombobox
return


/*/{Protheus.doc} tcontrol
Classe abstrata herdada por todos os componentes visuais.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tcontrol

/*/
class tcontrol from TSrvObject
data bchange as codeblock
data bsetget as codeblock
data lmodified as logical
data loutget as logical
data lreadonly as logical
data lvisiblecontrol as logical
data lcrypto as logical
data align as numeric
data nparent as numeric
method click()
method nextcontrol()
method setpopup()
method setaccname()
method setfocus()
method varput()
method setnextfocus()
method setpreviousfocus()
end class
/*/{Protheus.doc} tcontrol:click
Dispara o evento, configurado no bloco de código \*bLClicked\* do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/click
/*/
method click() class tcontrol
return
/*/{Protheus.doc} tcontrol:nextcontrol
Retorna o próximo objeto da lista que permite foco.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nextcontrol
/*/
method nextcontrol() class tcontrol
return
/*/{Protheus.doc} tcontrol:setpopup
Define um menu do tipo popup para os componentes visuais.

@type method

@param <omenu>, object, Objeto do tipo TMenu.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpopup
/*/
method setpopup(omenu) class tcontrol
return
/*/{Protheus.doc} tcontrol:setaccname
Configura o identificador do objeto de interface para integração do TOTVS Smart Client com ferramentas de acessibilidade compatíveis com o Microsoft Active Accessibility \(MSAA\).

@type method

@param <cidentificado>, character, Indica o identificador do controle, caracter, obrigatório.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setaccname
/*/
method setaccname(cidentificado) class tcontrol
return
/*/{Protheus.doc} tcontrol:setfocus
Altera o foco da entrada de dados para o objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfocus
/*/
method setfocus() class tcontrol
return
/*/{Protheus.doc} tcontrol:varput
Atualiza o valor do objeto.

@type method

@param <uvalue>, variant, Indica o texto do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/varput
/*/
method varput(uvalue) class tcontrol
return
/*/{Protheus.doc} tcontrol:setnextfocus
Altera o próximo componente a receber o foco da entrada de dados \(ao pressionar a tecla TAB por exemplo\).

@type method

@param <oobj>, object, Objeto do tipo TControl que será o próximo a receber o foco.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setnextfocus
/*/
method setnextfocus(oobj) class tcontrol
return
/*/{Protheus.doc} tcontrol:setpreviousfocus
Altera o componente anterior a receber o foco da entrada de dados \(ao pressionar as teclas de atalho Shift + TAB por exemplo\).

@type method

@param <oobj>, object, Objeto do tipo TControl que será o componente anterior a receber o foco.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpreviousfocus
/*/
method setpreviousfocus(oobj) class tcontrol
return


/*/{Protheus.doc} tdialog
Cria uma janela de diálogo, no programa, para entrada de dados não modal. Desta forma, é permitido que outras janelas recebam dados enquanto esta estiver ativa.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tdialog

/*/
class tdialog from TWindow
data nresult as numeric
data bfocuschange as codeblock
data bwindowstate as codeblock
data lmaximized as logical
method new()
method setminimumsize()
method updategets()
method activate()
method end()
method hasfocus()
method windowstate()
end class
/*/{Protheus.doc} tdialog:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TDialog

@param [ntop], numeric, Indica a coordenada vertical superior em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal esquerda em pixels ou caracteres.
@param [nbottom], numeric, Indica a coordenada vertical inferior em pixels ou caracteres.
@param [nright], numeric, Indica a coordenada horizontal direita em pixels ou caracteres.
@param [ccaption], character, Indica o título da janela.
@param [uparam6], variant, Compatibilidade.
@param [uparam7], variant, Compatibilidade.
@param [uparam8], variant, Compatibilidade.
@param [uparam9], variant, Compatibilidade.
@param [nclrtext], numeric, Indica a cor do texto.
@param [nclrback], numeric, Indica a cor de fundo.
@param [uparam12], variant, Compatibilidade.
@param [ownd], object, Indica a janela mãe \(principal\) da janela que será criada. O padrão é a janela principal do programa.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam15], variant, Compatibilidade.
@param [uparam16], variant, Compatibilidade.
@param [uparam17], variant, Compatibilidade.
@param [nwidth], numeric, Indica a largura da janela em pixels.
@param [nheight], numeric, Indica a altura da janela em pixels.
@param [ltransparent], logical, Se .T. permitira que a Dialog receba um fundo transparente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nbottom, nright, ccaption, uparam6, uparam7, uparam8, uparam9, nclrtext, nclrback, uparam12, ownd, lpixel, uparam15, uparam16, uparam17, nwidth, nheight, ltransparent) class tdialog
return
/*/{Protheus.doc} tdialog:setminimumsize
Define o tamanho mínimo da janela.

@type method

@param [nwidth], numeric, Indica a largura mínima.
@param [nheight], numeric, Indica a altura mínima.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setminimumsize
/*/
method setminimumsize(nwidth, nheight) class tdialog
return
/*/{Protheus.doc} tdialog:updategets
Sem implementação.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/updategets
/*/
method updategets() class tdialog
return
/*/{Protheus.doc} tdialog:activate
Apresenta o diálogo.

@type method

@param [uparam1], variant, Compatibilidade.
@param [uparam2], variant, Compatibilidade.
@param [uparam3], variant, Compatibilidade.
@param [lcentered], logical, Indica se a janela será \(.T.\) ou não \(.F.\) centralizada. O padrão é falso \(.F.\).
@param [bvalid], codeblock, Indica se o conteúdo do diálogo é válido. Se o retorno for falso \(.F.\), o diálogo não será fechado quando a finalização for solicitada.
@param [uparam6], variant, Compatibilidade.
@param [binit], codeblock, Indica o bloco de código que será executado quando o diálogo iniciar a exibição.
@param [uparam8], variant, Compatibilidade.
@param [uparam9], variant, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/activate
/*/
method activate(uparam1, uparam2, uparam3, lcentered, bvalid, uparam6, binit, uparam8, uparam9) class tdialog
return
/*/{Protheus.doc} tdialog:end
Finaliza o diálogo.

@type method

@return logical, Retorna verdadeiro \(.T.\) se finalizar o diálogo, caso contrário, retorna falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/end
/*/
method end() class tdialog
return
/*/{Protheus.doc} tdialog:hasfocus
Indica se o componente esta em foco.

@type method

@return logical, Retorna, verdadeiro \(.T.\), se o componente está em foco, caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hasfocus
/*/
method hasfocus() class tdialog
return
/*/{Protheus.doc} tdialog:windowstate
Indica o estado atual do componente.

@type method

@return numeric, Retorna um número inteiro indicando o estado atual do componente. Sendo: 0=Restaurado, 1=Minimizado e 2=Maximizado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/windowstate
/*/
method windowstate() class tdialog
return


/*/{Protheus.doc} tdrawer
Abre e manipula imagens com extensões BMP \(Bitmap\), JPG \(Joint Photographic Group\) e PNG \(Portable Network Graphics\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tdrawer

/*/
class tdrawer from TControl
data blclicked as codeblock
data brclicked as codeblock
method new()
method create()
method addtext()
method clearimage()
method crop()
method openimage()
method paste()
method resizeimage()
method saveimage()
method setcolors()
method setfonttext()
method settype()
method undo()
method setpenwidth()
end class
/*/{Protheus.doc} tdrawer:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TDrawer

@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [odlg], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cfilename], character, Indica o nome do arquivo que será aberto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, odlg, nwidth, nheight, cfilename) class tdrawer
return
/*/{Protheus.doc} tdrawer:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TDrawer

@param [odlg], object, Indica a janela ou controle visual onde o objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(odlg) class tdrawer
return
/*/{Protheus.doc} tdrawer:addtext
Inclui um texto em uma determinada posição da imagem.

@type method

@param [ntop], numeric, Indica a posição do texto em relação ao topo.
@param [nleft], numeric, Indica a posição do texto à esquerda
@param [ctexto], numeric, Indica o texto que será incluído.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addtext
/*/
method addtext(ntop, nleft, ctexto) class tdrawer
return
/*/{Protheus.doc} tdrawer:clearimage
Limpa o conteúdo da imagem.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clearimage
/*/
method clearimage() class tdrawer
return
/*/{Protheus.doc} tdrawer:crop
Mantém apenas o trecho selecionado da imagem.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/crop
/*/
method crop() class tdrawer
return
/*/{Protheus.doc} tdrawer:openimage
Abre imagem com extensão BMP \(Bitmap\), JPG \(Joint Photographic Group\) e PNG \(Portable Network Graphics\).

@type method

@param [cimagem], character, Indica o diretório e o nome do arquivo que será aberto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/openimage
/*/
method openimage(cimagem) class tdrawer
return
/*/{Protheus.doc} tdrawer:paste
Copia o conteúdo da memória para a figura, desde que esse conteúdo seja uma imagem.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/paste
/*/
method paste() class tdrawer
return
/*/{Protheus.doc} tdrawer:resizeimage
Redimensiona a imagem.

@type method

@param [nlargura], numeric, Indica a largura da imagem.
@param [naltura], numeric, Indica a altura da imagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/resizeimage
/*/
method resizeimage(nlargura, naltura) class tdrawer
return
/*/{Protheus.doc} tdrawer:saveimage
Salva uma imagem.

@type method

@param [cnomeimagem], character, Indica o diretório e o nome do arquivo.
@param [cextensao], character, Indica a extensão \(BMP, JPG e PNG\) do arquivo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/saveimage
/*/
method saveimage(cnomeimagem, cextensao) class tdrawer
return
/*/{Protheus.doc} tdrawer:setcolors
Define a cor da linha e do fundo.

@type method

@param <ncorlinha>, numeric, Indica a cor da linha.
@param <ncorfundo>, numeric, Indica a cor de fundo. Observação: Caso esse parâmetro seja definido com -1, o fundo ficará transparente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolors
/*/
method setcolors(ncorlinha, ncorfundo) class tdrawer
return
/*/{Protheus.doc} tdrawer:setfonttext
Define a fonte do texto.

@type method

@return logical, Retorna verdadeiro \(.T.\), se a fonte selecionada estiver correta; caso contrário, retornará falso \(.F.\).

@param <ofont>, object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfonttext
/*/
method setfonttext(ofont) class tdrawer
return
/*/{Protheus.doc} tdrawer:settype
Define o tipo de formato \(Shape\) da imagem.

@type method

@param [nshape], numeric, Indica o tipo do formato \(Shape\) da imagem, sendo: 0=Seleção \(Marca um traço da imagem para que possa ser recortada pelo método Crop\), 1=Traço, 2=Traço livre, 3=Círculo, 4=Retângulo e 5=Retângulo com bordas arredondadas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settype
/*/
method settype(nshape) class tdrawer
return
/*/{Protheus.doc} tdrawer:undo
Defaz a última ação realizada na imagem.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/undo
/*/
method undo() class tdrawer
return
/*/{Protheus.doc} tdrawer:setpenwidth
Indica a espessura da linha a ser desenhada.

@type method

@param [nwidth], numeric, Indica a espessura da linha a ser desenhada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpenwidth
/*/
method setpenwidth(nwidth) class tdrawer
return


/*/{Protheus.doc} tflowlayout
Herda as características de um TPanel e acrescenta a funcionalidade de responsividade aos componentes nele inseridos, mantendo a altura e largura de cada um, porém reposicionando-os dinamicamente de acordo com o espaço disponível no layout.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tflowlayout

/*/
class tflowlayout from TPanel
method new()
method addinlayout()
end class
/*/{Protheus.doc} tflowlayout:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TFlowLayout

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nalign], numeric, Indica o alinhamento do objeto \(container TFlowLayout\) no espaço disponibilizado pelo seu objeto pai.
@param [nwidth], numeric, Indica a largura em pontos do objeto.
@param [nheight], numeric, Indica a altura em pontos do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, nalign, nwidth, nheight) class tflowlayout
return
/*/{Protheus.doc} tflowlayout:addinlayout
Insere um componente no layout.

@type method

@param <ocontrol>, object, Indica o componente que será inserido no layout.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addinlayout
/*/
method addinlayout(ocontrol) class tflowlayout
return


/*/{Protheus.doc} tfolder
Cria um objeto para exibir pastas.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tfolder

/*/
class tfolder from TControl
data adialogs as array
data aprompts as array
data bsetoption as codeblock
data noption as numeric
method new()
method additem()
method aenable()
method hidepage()
method setoption()
method getcaption()
method showpage()
end class
/*/{Protheus.doc} tfolder:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TFolder

@param [ntop], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [aprompts], array, Indica o título das pastas.
@param [adialogs], array, Indica o nome do diálogo.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [noption], numeric, Indica a pasta selecionada.
@param [nclrfore], numeric, Indica a cor de frente da pasta.
@param [nclrback], numeric, Indica a cor de fundo da pasta.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam10], logical, Compatibilidade
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam14], logical, Compatibilidade
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, aprompts, adialogs, ownd, noption, nclrfore, nclrback, lpixel, uparam10, nwidth, nheight, cmsg, uparam14) class tfolder
return
/*/{Protheus.doc} tfolder:additem
Inclui uma pasta.

@type method

@param [citem], character, Indica a título da pasta.
@param [lvisible], logical, Indica se a pasta está \(.T.\) ou não \(.F.\) visível.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/additem
/*/
method additem(citem, lvisible) class tfolder
return
/*/{Protheus.doc} tfolder:aenable
Habilita/Desabilita uma pasta.

@type method

@return logical, Retorna verdadeiro \(.T.\) se o processo ocorrer com sucesso; caso contrário, retornará falso \(.F.\).

@param [nitem], numeric, Indica a pasta que será habilitada/desabilitada.
@param [lenable], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a pasta.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/aenable
/*/
method aenable(nitem, lenable) class tfolder
return
/*/{Protheus.doc} tfolder:hidepage
Oculta uma pasta.

@type method

@param <nitem>, numeric, Indica a pasta que será oculta.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hidepage
/*/
method hidepage(nitem) class tfolder
return
/*/{Protheus.doc} tfolder:setoption
Seleciona a pasta desejada.

@type method

@param [noption], numeric, Indica a pasta que será selecionada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setoption
/*/
method setoption(noption) class tfolder
return
/*/{Protheus.doc} tfolder:getcaption
Retorna a descrição da aba ativa da Folder

@type method

@return character, Retorna a descrição da aba ativa.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcaption
/*/
method getcaption() class tfolder
return
/*/{Protheus.doc} tfolder:showpage
Apresenta uma pasta.

@type method

@param <nitem>, numeric, Indica a pasta que será apresentada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/showpage
/*/
method showpage(nitem) class tfolder
return


/*/{Protheus.doc} tfont
Cria um objeto para alterar as características da fonte utilizada em outros controles visuais.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tfont

/*/
class tfont from TFontAbs
data cname as character
data nwidth as numeric
data nheight as numeric
data bold as logical
data italic as logical
data underline as logical
method new()
end class
/*/{Protheus.doc} tfont:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TFont

@param [cname], character, Indica o nome da fonte que será utilizada.
@param [upar2], numeric, Compatibilidade.
@param [nheight], numeric, Indica o tamanho da fonte.
@param [upar4], logical, Compatibilidade.
@param [lbold], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) o estilo negrito.
@param [upar6], numeric, Compatibilidade.
@param [upar7], logical, Compatibilidade.
@param [upar8], numeric, Compatibilidade.
@param [upar9], logical, Compatibilidade.
@param [lunderline], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) o estilo sublinhado.
@param [litalic], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) o estilo itálico.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(cname, upar2, nheight, upar4, lbold, upar6, upar7, upar8, upar9, lunderline, litalic) class tfont
return


/*/{Protheus.doc} tftpclient
Classe destinada a comunicação com servidores de FTP \(File Transfer Protocol\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tftpclient

/*/
class tftpclient
data ntransfertype as numeric
data ntransfermode as numeric
data nconnecttimeout as numeric
data ntransferstruct as numeric
data bfirewallmode as logical
data ndataport as numeric
data ncontrolport as numeric
data ndirinfo as numeric
data ndirinfocount as numeric
data cerrorstring as character
data busesipconnection as logical
method new()
method getlastresponse()
method ftpconnect()
method close()
method directory()
method sendfile()
method receivefile()
method renamefile()
method resumereceivefile()
method deletefile()
method getcurdir()
method chdir()
method cdup()
method mkdir()
method rmdir()
method noop()
method getdirentry()
method gethelp()
method quote()
method getmlcount()
method getmlline()
method settype()
method gettype()
end class
/*/{Protheus.doc} tftpclient:new
Cria uma nova instância da classe TFtpClient.

@type method

@return object, Nova instância da classe tFtpClient

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tftpclient
return
/*/{Protheus.doc} tftpclient:getlastresponse
Retorna a resposta do último comando executado no servidor remoto.

@type method

@return character, String com a resposta do último comando que foi executado no servidor.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getlastresponse
/*/
method getlastresponse() class tftpclient
return
/*/{Protheus.doc} tftpclient:ftpconnect
Estabelece uma conexão com um servidor de FTP \( File Transfer Protocol \) .

@type method

@return numeric, Retorna 0 em caso de uma conexão bem sucedida. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ftpconnect
/*/
method ftpconnect() class tftpclient
return
/*/{Protheus.doc} tftpclient:close
Termina uma conexão estabelecida com um servidor.

@type method

@return numeric, Retorna sempre 0.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/close
/*/
method close() class tftpclient
return
/*/{Protheus.doc} tftpclient:directory
Semelhante a função Directory, lista os arquivos e diretórios do diretório corrente.

@type method

@return array, Retorna um array de subarrays, sendo que cada subarray contém informações sobre cada arquivo que atenda o parâmetro **cMask**.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/directory
/*/
method directory() class tftpclient
return
/*/{Protheus.doc} tftpclient:sendfile
Trasfere um arquivo da máquina local para o servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sendfile
/*/
method sendfile() class tftpclient
return
/*/{Protheus.doc} tftpclient:receivefile
Trasfere um arquivo do servidor remoto para a máquina local.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/receivefile
/*/
method receivefile() class tftpclient
return
/*/{Protheus.doc} tftpclient:renamefile
Renomeia um arquivo hospedado no servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/renamefile
/*/
method renamefile() class tftpclient
return
/*/{Protheus.doc} tftpclient:resumereceivefile
Retoma a trasferência de um arquivo do servidor remoto para a máquina local.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/resumereceivefile
/*/
method resumereceivefile() class tftpclient
return
/*/{Protheus.doc} tftpclient:deletefile
Deleta um arquivo hospedado no servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletefile
/*/
method deletefile() class tftpclient
return
/*/{Protheus.doc} tftpclient:getcurdir
Devolve o nome do diretório atual no servidor FTP conectado.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcurdir
/*/
method getcurdir() class tftpclient
return
/*/{Protheus.doc} tftpclient:chdir
Muda o diretório corrente do servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/chdir
/*/
method chdir() class tftpclient
return
/*/{Protheus.doc} tftpclient:cdup
Muda o diretório corrente do servidor remoto para um imediatamente anterior. Correspondente a "cd .." em ambientes Linux.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/cdup
/*/
method cdup() class tftpclient
return
/*/{Protheus.doc} tftpclient:mkdir
Cria um diretório no servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/mkdir
/*/
method mkdir() class tftpclient
return
/*/{Protheus.doc} tftpclient:rmdir
Apaga um diretório no servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rmdir
/*/
method rmdir() class tftpclient
return
/*/{Protheus.doc} tftpclient:noop
Executa uma operação No-op.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/noop
/*/
method noop() class tftpclient
return
/*/{Protheus.doc} tftpclient:getdirentry
Devolve o nome de um item de um diretório baseado em um índice.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getdirentry
/*/
method getdirentry() class tftpclient
return
/*/{Protheus.doc} tftpclient:gethelp
Obtem informação de ajuda do servidor remoto.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gethelp
/*/
method gethelp() class tftpclient
return
/*/{Protheus.doc} tftpclient:quote
Envia um comando customizado para o servidor.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/quote
/*/
method quote() class tftpclient
return
/*/{Protheus.doc} tftpclient:getmlcount
Retorna a quantidade de linhas do buffer de resposta.

@type method

@return numeric, Número de linhas do buffer de resposta do server.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmlcount
/*/
method getmlcount() class tftpclient
return
/*/{Protheus.doc} tftpclient:getmlline
Retorna a linha especificada do buffer de resposta do server.

@type method

@return character, String com o conteúdo correspondente a linha passada como parâmetro do buffer de resposta do servidor.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmlline
/*/
method getmlline() class tftpclient
return
/*/{Protheus.doc} tftpclient:settype
Seta o tipo de transferência que será usado na recepção e envio de arquivos.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settype
/*/
method settype() class tftpclient
return
/*/{Protheus.doc} tftpclient:gettype
Obtém o tipo de transferência que está setada com o servidor.

@type method

@return numeric, Retorna o tipo da transferência.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gettype
/*/
method gettype() class tftpclient
return


/*/{Protheus.doc} tget
Cria um objeto para entrada de dados editáveis. Esta classe permite armazenar ou alterar o conteúdo de uma variável através da digitação. No entanto, o conteúdo da variável será alterado quando o objeto perder o foco de edição para outro objeto.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tget

/*/
class tget from TControl
data buffer as character
data pictvar as character
data picture as character
data ctext as character
data lpassword as logical
data cplacehold as character
data lobfuscate as logical
data cretf3 as character
data oget as object
data pos as numeric
data exitdirection as numeric
data lcalendario as logical
data lallwaysupdateserver as logical
data aconvkeys as array
method create()
method new()
method ctrlrefresh()
method selectall()
method setcontentalign()
method assign()
method updatebuffer()
method setpos()
method insert()
method ctext()
method jumptonextctrl()
method sethasbutton()
method setnobutton()
method setconvkey()
end class
/*/{Protheus.doc} tget:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TGet

@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for sequencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cpict], character, Indica a máscara de formatação do conteúdo que será apresentada. Verificar [Tabela de Pictures de Formatação](https://tdn.totvs.com/pages/releaseview.action?pageId=22479526)
@param [bvalid], codeblock, Indica o bloco de código de validação, que será executado quando este objeto estiver em foco, e o operador tentar mover o foco para outro componente da interface. Caso o bloco executado retorne .T., será permitida a mudança de foco. Caso o bloco executado retorne .F., não será permitido a remoção do foco do componente.
@param [nclrfore], numeric, Indica a cor do texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [ofont], object, Indica o objeto, do tipo [TFont](TFont), que será utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam12], logical, Compatibilidade
@param [uparam13], object, Compatibilidade
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam15], character, Compatibilidade
@param [uparam16], logical, Compatibilidade
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados no objeto criado estiver sendo realizada. Se o retorno for verdadeiro \(.T.\), o objeto continua habilitado; caso contrário, falso \(.F.\).
@param [uparam18], logical, Compatibilidade
@param [uparam19], logical, Compatibilidade
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [lreadonly], logical, Indica se o objeto pode ser editado.
@param [lpassword], logical, Indica se, verdadeiro \(.T.\), o objeto apresentará asterisco \(\*\) para entrada de dados de senha; caso contrário, falso \(.F.\).
@param [uparam23], character, Compatibilidade
@param [creadvar], character, Indica o nome da variável, configurada no parâmetro bSetGet, que será manipulada pelo objeto. Além disso, esse parâmetro será o retorno da função ReadVar\(\).
@param [uparam25], character, Compatibilidade
@param [uparam26], character, Compatibilidade
@param [uparam27], logical, Compatibilidade
@param [lhasbutton], logical, Se definido .T. indica que deve ser aplicado o botão para seleção de Data ou Calculadora.
@param [uparam29], logical, Compatibilidade
@param [uparam30], logical, Compatibilidade
@param [clabeltext], character, indica o texto que será apresentado na Label.
@param [nlabelpos], numeric, Indica a posição da label, sendo 1=Topo e 2=Esquerda
@param [olabelfont], object, Indica o objeto, do tipo [TFont](TFont), que será utilizado para definir as características da fonte aplicada na exibição da label.
@param [nlabelcolor], numeric, Indica a cor do texto da Label.
@param [cplacehold], character, Define o texto a ser utilizado como place holder, ou seja, o texto que ficará escrito em cor mais opaca quando nenhuma informação tiver sido digitada no campo. \(disponível em builds superiores a 7.00.121227P\)
@param [lpicturepriority], logical, Quando .T. define que a quantidade de caracteres permitidos no TGet será baseada no tamanho da máscara \(Picture\) definida, mesmo que isto exceda a quantidade de caracteres definida na variável bSetGet, até mesmo se ela for vazia \(essa variável deve ser do tipo caracter\). Além disso este parâmetro ativa o controle dos espaços em branco, não incluindo na variável bSetGet os espaços inseridos automaticamente pela Picture. Ou seja, o TGet retornará somente os espaços em branco efetivamente digitados pelo usuário ou aqueles espaços que já foram inicializados na variável bSetGet. Disponível somente a partir da build 7.00.170117A.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(bsetget, nrow, ncol, nwidth, nheight, cpict, bvalid, nclrfore, nclrback, ofont, uparam12, uparam13, lpixel, uparam15, uparam16, bwhen, uparam18, uparam19, bchange, lreadonly, lpassword, uparam23, creadvar, uparam25, uparam26, uparam27, lhasbutton, uparam29, uparam30, clabeltext, nlabelpos, olabelfont, nlabelcolor, cplacehold, lpicturepriority) class tget
return
/*/{Protheus.doc} tget:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TGet

@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for sequencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cpict], character, Indica a máscara de formatação do conteúdo que será apresentada. Verificar [Tabela de Pictures de Formatação](https://tdn.totvs.com/pages/releaseview.action?pageId=22479526)
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [nclrfore], numeric, Indica a cor do texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [ofont], object, Indica o objeto, do tipo [TFont](TFont), que será utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam12], logical, Compatibilidade
@param [uparam13], object, Compatibilidade
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam15], character, Compatibilidade
@param [uparam16], logical, Compatibilidade
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados no objeto criado estiver sendo realizada. Se o retorno for verdadeiro \(.T.\), o objeto continua habilitado; caso contrário, falso \(.F.\).
@param [uparam18], logical, Compatibilidade
@param [uparam19], logical, Compatibilidade
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [lreadonly], logical, Indica se o objeto pode ser editado.
@param [lpassword], logical, Indica se, verdadeiro \(.T.\), o objeto apresentará asterisco \(\*\) para entrada de dados de senha; caso contrário, falso \(.F.\).
@param [uparam23], character, Compatibilidade
@param [creadvar], character, Indica o nome da variável, configurada no parâmetro bSetGet, que será manipulada pelo objeto. Além disso, esse parâmetro será o retorno da função ReadVar\(\).
@param [uparam25], character, Compatibilidade
@param [uparam26], character, Compatibilidade
@param [uparam27], logical, Compatibilidade
@param [lhasbutton], logical, Indica se, verdadeiro \(.T.\), o uso dos botões padrão, como calendário e calculadora.
@param [lnobutton], logical, Oculta o botão F3 \(HasButton\).
@param [uparam30], logical, Compatibilidade
@param [clabeltext], character, indica o texto que será apresentado na Label.
@param [nlabelpos], numeric, Indica a posição da label, sendo 1=Topo e 2=Esquerda
@param [olabelfont], object, Indica o objeto, do tipo [TFont](TFont), que será utilizado para definir as características da fonte aplicada na exibição da label.
@param [nlabelcolor], numeric, Indica a cor do texto da Label.
@param [cplacehold], character, Define o texto a ser utilizado como place holder, ou seja, o texto que ficará escrito em cor mais opaca quando nenhuma informação tiver sido digitada no campo. \(disponível em builds superiores a 7.00.121227P\)
@param [lpicturepriority], logical, Quando .T. define que a quantidade de caracteres permitidos no TGet será baseada no tamanho da máscara \(Picture\) definida, mesmo que isto exceda a quantidade de caracteres definida na variável bSetGet, até mesmo se ela for vazia \(essa variável deve ser do tipo caracter\). Além disso este parâmetro ativa o controle dos espaços em branco, não incluindo na variável bSetGet os espaços inseridos automaticamente pela Picture. Ou seja, o TGet retornará somente os espaços em branco efetivamente digitados pelo usuário ou aqueles espaços que já foram inicializados na variável bSetGet. Disponível somente a partir da build 7.00.170117A.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ncol, bsetget, ownd, nwidth, nheight, cpict, bvalid, nclrfore, nclrback, ofont, uparam12, uparam13, lpixel, uparam15, uparam16, bwhen, uparam18, uparam19, bchange, lreadonly, lpassword, uparam23, creadvar, uparam25, uparam26, uparam27, lhasbutton, lnobutton, uparam30, clabeltext, nlabelpos, olabelfont, nlabelcolor, cplacehold, lpicturepriority) class tget
return
/*/{Protheus.doc} tget:ctrlrefresh
Força a atualização do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctrlrefresh
/*/
method ctrlrefresh() class tget
return
/*/{Protheus.doc} tget:selectall
Seleciona todo o conteúdo da Get.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/selectall
/*/
method selectall() class tget
return
/*/{Protheus.doc} tget:setcontentalign
Alinha o conteúdo interno do objeto.

@type method

@param <nalign>, numeric, Indica o tipo de alinhamento. Para informações dos tipos disponíveis, consulte a área Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcontentalign
/*/
method setcontentalign(nalign) class tget
return
/*/{Protheus.doc} tget:assign
Compatibilidade.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/assign
/*/
method assign() class tget
return
/*/{Protheus.doc} tget:updatebuffer
Compatibilidade.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/updatebuffer
/*/
method updatebuffer() class tget
return
/*/{Protheus.doc} tget:setpos
Compatibilidade.

@type method

@param [nstart], numeric, Compatibilidade.
@param [nend], numeric, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpos
/*/
method setpos(nstart, nend) class tget
return
/*/{Protheus.doc} tget:insert
Compatibilidade.

@type method

@param [cstring], character, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/insert
/*/
method insert(cstring) class tget
return
/*/{Protheus.doc} tget:ctext
Compatibilidade.

@type method

@param [cval], character, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctext
/*/
method ctext(cval) class tget
return
/*/{Protheus.doc} tget:jumptonextctrl
Compatibilidade.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/jumptonextctrl
/*/
method jumptonextctrl() class tget
return
/*/{Protheus.doc} tget:sethasbutton
Compatibilidade.

@type method

@param [lval], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sethasbutton
/*/
method sethasbutton(lval) class tget
return
/*/{Protheus.doc} tget:setnobutton
Compatibilidade.

@type method

@param [lval], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setnobutton
/*/
method setnobutton(lval) class tget
return
/*/{Protheus.doc} tget:setconvkey
Compatibilidade.

@type method

@param [adados], array, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setconvkey
/*/
method setconvkey(adados) class tget
return


/*/{Protheus.doc} tgrid
Exibe os dados organizados em uma tabela.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tgrid

/*/
class tgrid from TControl
data bcursormove as codeblock
data bcolumnchanged as codeblock
data browleftclick as codeblock
data bgridinfo as codeblock
data bkeyblock as codeblock
data nfreeze as numeric
data ninterval as numeric
data lshowgrid as logical
data nhscroll as numeric
data lcolsresizable as logical
data lcolsmovable as logical
data aobfuscatedcols as array
method new()
method addcolumn()
method clearrows()
method colorder()
method colpos()
method getcellrect()
method getvisiblerows()
method removecolumn()
method scrolllines()
method setheaderclick()
method setrowcolor()
method setrowdata()
method setrowheight()
method setselectedrow()
method setselectionmode()
method setheaderimage()
method gocolumn()
method setkeyvalue()
method setcolumncolor()
method getcolumnssize()
method setcolumnsize()
method setcolumnfont()
method getcursorpos()
end class
/*/{Protheus.doc} tgrid:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TGrid

@param <oparent>, object, Indica a janela ou componente parent onde o objeto será criado.
@param [nrow], numeric, Indica a coordenada vertical em pixels.
@param [ncol], numeric, Indica a coordenada horizontal em pixels.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(oparent, nrow, ncol, nwidth, nheight) class tgrid
return
/*/{Protheus.doc} tgrid:addcolumn
Adiciona colunas no objeto.

@type method

@param <nid>, numeric, Indica o ID de identificação da coluna que será criada.
@param <ccaption>, character, Indica o título da coluna.
@param <nwidth>, numeric, Indica a largura inicial da coluna em pixels.
@param <nalign>, numeric, Indica o alinhamento do texto na coluna. Para informações das opções disponíveis, consulte a área Observações.
@param [lheaderfollowsdataalign], logical, Indica se o alinhamento do texto do cabeçalho seguirá o mesmo alinhamento do texto na coluna. Este parâmetro está disponível somente em builds superiores a 7.00.120420A.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcolumn
/*/
method addcolumn(nid, ccaption, nwidth, nalign, lheaderfollowsdataalign) class tgrid
return
/*/{Protheus.doc} tgrid:clearrows
Apaga todas as linhas visíveis do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clearrows
/*/
method clearrows() class tgrid
return
/*/{Protheus.doc} tgrid:colorder
Preenche o array do objeto com as colunas representadas no componente.

@type method

@param <adata>, array, Indica o número de posições inteiras que representará a ordem das colunas que constam no componente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/colorder
/*/
method colorder(adata) class tgrid
return
/*/{Protheus.doc} tgrid:colpos
Retorna a coluna selecionada.

@type method

@return numeric, Índice da coluna selecionada.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/colpos
/*/
method colpos() class tgrid
return
/*/{Protheus.doc} tgrid:getcellrect
Preenche um array com as propriedades \(Top, Left, Right e Bottom\) do formato da célula selecionada.

@type method

@param <aret>, array, Indica um array com as propriedades \(Top, Left, Right e Bottom\) do formato da célula selecionada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcellrect
/*/
method getcellrect(aret) class tgrid
return
/*/{Protheus.doc} tgrid:getvisiblerows
Retorna o número de linhas visíveis no Grid.

@type method

@return numeric, Número de linhas visíveis no Grid.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getvisiblerows
/*/
method getvisiblerows() class tgrid
return
/*/{Protheus.doc} tgrid:removecolumn
Remove a coluna do objeto.

@type method

@param <nid>, numeric, Indica o ID de identificação da coluna criada através do método AddColumn\(\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/removecolumn
/*/
method removecolumn(nid) class tgrid
return
/*/{Protheus.doc} tgrid:scrolllines
Movimenta as linhas de exibição, do objeto, para cima ou para baixo.

@type method

@param <nlines>, numeric, Indica o número de linhas que serão movimentadas. Para mais detalhes, consulte a área Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/scrolllines
/*/
method scrolllines(nlines) class tgrid
return
/*/{Protheus.doc} tgrid:setheaderclick
Determina o bloco de código que será executado ao clicar no header da coluna do grid.

@type method

@param <bblock>, codeblock, Indica o bloco de código que será executado ao clicar no header da coluna do grid. Para mais detalhes, consulte a área Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setheaderclick
/*/
method setheaderclick(bblock) class tgrid
return
/*/{Protheus.doc} tgrid:setrowcolor
Determina a cor exibida em uma linha visível do browse com as propriedades \(nLinha, nColorBack, nColorFore\).

@type method

@param [nlinha], numeric, Indica a linha visível do browse.
@param [ncolorback], numeric, Indica a RGB da cor de fundo.
@param [ncolorfore], numeric, Indica a RGB da cor do texto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setrowcolor
/*/
method setrowcolor(nlinha, ncolorback, ncolorfore) class tgrid
return
/*/{Protheus.doc} tgrid:setrowdata
Confgura os dados que serão apresentados em determinada linha do objeto.

@type method

@param <nrow>, numeric, Indica a linha visual que será atualizada.
@param <bdata>, codeblock, Indica o bloco de código responsável pela geração dos dados que serão apresentados. Para mais detalhes, consulte a área Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setrowdata
/*/
method setrowdata(nrow, bdata) class tgrid
return
/*/{Protheus.doc} tgrid:setrowheight
Configura a altura de cada linha do grid.

@type method

@param [nval], numeric, Indica a altura em pixels.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setrowheight
/*/
method setrowheight(nval) class tgrid
return
/*/{Protheus.doc} tgrid:setselectedrow
Posiciona na linha selecionada do objeto.

@type method

@param [nrow], numeric, Indica a linha que será selecionada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setselectedrow
/*/
method setselectedrow(nrow) class tgrid
return
/*/{Protheus.doc} tgrid:setselectionmode
Indica o tipo \(linha ou célula\) de navegação no componente.

@type method

@param <nselmode>, numeric, Indica o tipo \(0=linha ou 1=célula\) de navegação no componente.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setselectionmode
/*/
method setselectionmode(nselmode) class tgrid
return
/*/{Protheus.doc} tgrid:setheaderimage
Coloca uma imagem em um header criado previamente.

@type method

@param <ncol>, numeric, Número da coluna a ser aplicada a imagem.
@param <cimage>, character, Nome do resource da imagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setheaderimage
/*/
method setheaderimage(ncol, cimage) class tgrid
return
/*/{Protheus.doc} tgrid:gocolumn
Posiciona o cursor em uma coluna específica.

@type method

@param <ncol>, numeric, Número da coluna a ser posicionado o cursor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gocolumn
/*/
method gocolumn(ncol) class tgrid
return
/*/{Protheus.doc} tgrid:setkeyvalue
Adiciona ou remove uma tecla modificadora.

@type method

@param <nkey>, numeric, Código ASCII da tecla.
@param <naddorremove>, numeric, Código para se irá adicionar \(1\) ou remover \(0\) a tecla da lista de modificadores.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setkeyvalue
/*/
method setkeyvalue(nkey, naddorremove) class tgrid
return
/*/{Protheus.doc} tgrid:setcolumncolor
Define a cor de fundo e do texto de uma coluna.

@type method

@param [ncol], numeric, Número da coluna a ser modificada \(a ordem começa do 0, sendo então necessário subtrair 1 do número da coluna\). Caso nenhuma coluna seja informada, limpa as informações sobre cores de fundo e texto de todas as colunas.
@param [nclrback], numeric, Cor de fundo. Caso não seja informada, irá para a cor padrão.
@param [nclrfore], numeric, Cor do texto. Caso não seja informada irá para a cor padrão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolumncolor
/*/
method setcolumncolor(ncol, nclrback, nclrfore) class tgrid
return
/*/{Protheus.doc} tgrid:getcolumnssize
Retorna o tamanho das colunas em pixels.

@type method

@return array, Retorna um array com os tamanhos das colunas, sendo cada posição o tamanho da largura de uma coluna em pixels, seguindo a ordem das colunas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcolumnssize
/*/
method getcolumnssize() class tgrid
return
/*/{Protheus.doc} tgrid:setcolumnsize
Define o tamanho da largura de uma coluna em pixels.

@type method

@param <ncol>, numeric, Número \(índice\) da coluna começando por 0.
@param <nsize>, numeric, Tamanho em pixels da largura da coluna a ser alterada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolumnsize
/*/
method setcolumnsize(ncol, nsize) class tgrid
return
/*/{Protheus.doc} tgrid:setcolumnfont
Define a fonte de texto de uma coluna específica.

@type method

@param <ncol>, numeric, Índice da coluna \(iniciando em 1\).
@param <ofont>, object, Indica o objeto do tipo [TFont](TFont) utilizado para definir as características da fonte aplicada na exibição do texto das linhas da coluna especificada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolumnfont
/*/
method setcolumnfont(ncol, ofont) class tgrid
return
/*/{Protheus.doc} tgrid:getcursorpos
Retorna a linha e coluna onde o cursor está atualmente posicionado.

@type method

@return array, Array contendo o número da linha \(posição 1\) e coluna \(posição 2\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcursorpos
/*/
method getcursorpos() class tgrid
return


/*/{Protheus.doc} tgridlayout
Herda as características de um TPanel e acrescenta a funcionalidade de responsividade aos componentes nele inseridos, isto é, tais componentes se adaptam automaticamente ao tamanho do layout disponível, reajustando-se dinamicamente a largura e/ou altura de acordo com o espaço disponível. Os componentes são inseridos em um layout em formato de grid, dispostos em linhas e colunas.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tgridlayout

/*/
class tgridlayout from TPanel
method new()
method addinlayout()
method addspacer()
end class
/*/{Protheus.doc} tgridlayout:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TGridLayout

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nalign], numeric, Indica o alinhamento do objeto \(container TGridLayout\) no espaço disponibilizado pelo seu objeto pai.
@param [nwidth], numeric, Indica a largura em pontos do objeto.
@param [nheight], numeric, Indica a altura em pontos do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, nalign, nwidth, nheight) class tgridlayout
return
/*/{Protheus.doc} tgridlayout:addinlayout
Insere um componente no layout.

@type method

@param <ocontrol>, object, Indica o componente que será inserido no layout.
@param [nrow], numeric, Especifica em qual linha do grid o componente será inserido.
@param [ncolumn], numeric, Especifica em qual coluna do grid o componente será inserido.
@param [nrowspan], numeric, Especifica quantas linhas serão mescladas.
@param [ncolumnspan], numeric, Especifica quantas colunas serão mescladas.
@param [nalign], numeric, Especifica o alinhamento horizontal e/ou vertical do componente dentro de seu espaço no Layout. Um valor horizontal pode ser combinado a um vertical, por exemplo: LAYOUT_ALIGN_HCENTER + LAYOUT_ALIGN_TOP. Consulte a área de observações para conhecer as opções disponíveis.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addinlayout
/*/
method addinlayout(ocontrol, nrow, ncolumn, nrowspan, ncolumnspan, nalign) class tgridlayout
return
/*/{Protheus.doc} tgridlayout:addspacer
Insere um espaçador no layout.

@type method

@param [nrow], numeric, Representa a linha do grid onde será inserido um espaçador.
@param [ncolumn], numeric, Representa a coluna do grid onde será inserido um espaçador.
@param [nspacefactor], numeric, Especifica um fator que representa sua proporcionalidade em relação a outros espaçadores inseridos no mesmo layout. Um fator maior que zero é suficiente, caso seja o único espaçador no Layout.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addspacer
/*/
method addspacer(nrow, ncolumn, nspacefactor) class tgridlayout
return


/*/{Protheus.doc} tgroup
Cria um objeto do tipo painel, com borda e título, para que outros possam ser agrupados ou classificados.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tgroup

/*/
class tgroup from TControl
method new()
method create()
end class
/*/{Protheus.doc} tgroup:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TGroup

@param [ntop], numeric, Indica a coordenada vertical superior em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal à esquerda em pixels ou caracteres.
@param [nbottom], numeric, Indica a coordenada vertical inferior em pixels ou caracteres.
@param [nright], numeric, Indica a coordenada horizontal à direita em pixels ou caracteres.
@param [ccaption], character, Indica o título do grupo.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nclrtext], numeric, Indica a cor do texto.
@param [nclrpane], numeric, Indica a cor de fundo.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam10], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nbottom, nright, ccaption, ownd, nclrtext, nclrpane, lpixel, uparam10) class tgroup
return
/*/{Protheus.doc} tgroup:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TGroup

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ntop], numeric, Indica a coordenada vertical superior em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal à esquerda em pixels ou caracteres.
@param [nbottom], numeric, Indica a coordenada vertical inferior em pixels ou caracteres.
@param [nright], numeric, Indica a coordenada horizontal à direita em pixels ou caracteres.
@param [clabel], character, Indica o título do grupo.
@param [nclrtext], numeric, Indica a cor do texto.
@param [nclrpane], numeric, Indica a cor de fundo.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam10], logical, Compatibilidade.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, ntop, nleft, nbottom, nright, clabel, nclrtext, nclrpane, lpixel, uparam10) class tgroup
return


/*/{Protheus.doc} thashmap
Cria um HashMap para acessar elementos em uma lista, a chave de busca dos elementos pode ser Numérica, de Caracteres ou de Datas, os valores armazenados podem ser de qualquer tipo.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/thashmap

/*/
class thashmap
data nstatus as numeric
method new()
method set()
method get()
method del()
method list()
method clean()
end class
/*/{Protheus.doc} thashmap:new
Cria um objeto da Classe HashMap.

@type method

@return object, Nova instância da classe tHashMap

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class thashmap
return
/*/{Protheus.doc} thashmap:set
Atualiza o valor correspondente a chave.

@type method

@return logical, Verdadeiro \(.T.\) se executou corretamente e Falso \(.F\) se houve erro

@param <ykey>, variant, Chave de armazenamento do valor
@param <xval>, variant, Valor a ser armazenado na chave
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/set
/*/
method set(ykey, xval) class thashmap
return
/*/{Protheus.doc} thashmap:get
Obtém o valor armazenado correspondente a chave.

@type method

@return logical, Retorna verdadeiro \(.T.\) se achar a chave, ou falso \(.F.\) se não achar.

@param <ykey>, variant, Chave de armazenamento do valor
@param <@aval>, array, Retorna o valor armazenado na chave
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/get
/*/
method get(ykey, aval) class thashmap
return
/*/{Protheus.doc} thashmap:del
Remove o valor armazenado correspondente a chave

@type method

@return logical, Verdadeiro \(.T.\) se deletou o valor e Falso \(.F\) se não encontrou

@param <ykey>, variant, Chave de armazenamento do valor
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/del
/*/
method del(ykey) class thashmap
return
/*/{Protheus.doc} thashmap:list
Lista todos os elementos do objeto HashMap em um array.

@type method

@return logical, Verdadeiro \(.T.\) se conseguiu listar todos os elementos ou Falso \(.F.\) caso contrário

@param <@aelem>, array, Array para retorno da lista dos elementos do HashMap
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/list
/*/
method list(aelem) class thashmap
return
/*/{Protheus.doc} thashmap:clean
Limpa todos os dados alocados no HashMap

@type method

@return logical, Verdadeiro \(.T.\) se limpou todos os dados ou falso \(.F.\) se houve algum erro

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clean
/*/
method clean() class thashmap
return


/*/{Protheus.doc} thbutton
Cria um objeto do tipo botão com aparência de hiperlink \(como em um navegar de Internet\). Desta forma, esse objeto terá os mesmos eventos e ações da classe TButton.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/thbutton

/*/
class thbutton from TControl
method new()
end class
/*/{Protheus.doc} thbutton:new
Método construtor da classe.

@type method

@return object, Nova instância da classe THButton

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ccaption], character, Indica o título do botão.
@param [ownd], object, Indica a janela ou controle visual onde o botão será criado.
@param [blclicked], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [nwidth], numeric, Indica a largura em pixels do botão.
@param [nheight], numeric, Indica a altura em pixels do botão.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do título do botão.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ccaption, ownd, blclicked, nwidth, nheight, ofont, bwhen) class thbutton
return


/*/{Protheus.doc} tibrowser
Cria um objeto do tipo página de internet.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tibrowser

/*/
class tibrowser from TControl
method new()
method navigate()
method gohome()
method print()
end class
/*/{Protheus.doc} tibrowser:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TIBrowser

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ninitlink], character, Indica a URL Uniform Resource Locator da página de internet.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, ninitlink, ownd) class tibrowser
return
/*/{Protheus.doc} tibrowser:navigate
Direciona para uma nova página Web.

@type method

@param [curl], character, Indica a URL Uniform Resource Locator da página Web.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/navigate
/*/
method navigate(curl) class tibrowser
return
/*/{Protheus.doc} tibrowser:gohome
Direciona para a página \(URL - Uniform Resource Locator\) configurada na construção do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gohome
/*/
method gohome() class tibrowser
return
/*/{Protheus.doc} tibrowser:print
Abre uma janela para impressão da página.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/print
/*/
method print() class tibrowser
return


/*/{Protheus.doc} tlinearlayout
Herda as características de um TPanel e acrescenta a funcionalidade de responsividade aos componentes nele inseridos, isto é, tais componentes se adaptam automaticamente ao tamanho do layout disponível, reajustando-se dinamicamente a largura e/ou altura de acordo com o espaço disponível. Os componentes são inseridos linearmente na horizontal ou na vertical dependendo da configuração.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tlinearlayout

/*/
class tlinearlayout from TPanel
data ndirection as numeric
method new()
method addinlayout()
method addspacer()
end class
/*/{Protheus.doc} tlinearlayout:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TLinearLayout

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ndirection], numeric, Indica a direção linear na qual os componentes serão dispostos no layout. Consulte a área de observações para conhecer as opções disponíveis.
@param [nalign], numeric, Indica o alinhamento do objeto \(container TAlignLayout\) no espaço disponibilizado pelo seu objeto pai.
@param [nwidth], numeric, Indica a largura em pontos do objeto.
@param [nheight], numeric, Indica a altura em pontos do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, ndirection, nalign, nwidth, nheight) class tlinearlayout
return
/*/{Protheus.doc} tlinearlayout:addinlayout
Insere um componente no layout.

@type method

@param <ocontrol>, object, Indica o componente que será inserido no layout.
@param [nalign], numeric, Especifica o alinhamento horizontal e/ou vertical do componente dentro de seu espaço no Layout. Um valor horizontal pode ser combinado a um vertical, por exemplo: LAYOUT_ALIGN_HCENTER + LAYOUT_ALIGN_TOP. Consulte a área de observações para conhecer as opções disponíveis.
@param [nspacerfactor], numeric, Especifica o fator de redimensionamento do componente \(respeitando sua política\) dentro do layout. Para maior legibilidade, pode ser usado um valor que represente a porcentagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addinlayout
/*/
method addinlayout(ocontrol, nalign, nspacerfactor) class tlinearlayout
return
/*/{Protheus.doc} tlinearlayout:addspacer
Insere um espaçador no layout.

@type method

@param [nindex], numeric, Representa o indice da lista de componentes do layout onde será inserido um espaçador.
@param [nspacefactor], numeric, Especifica um fator que representa sua proporcionalidade em relação a outros espaçadores inseridos no mesmo layout. É desnecessário quando o layout possuir somente um espaçador.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addspacer
/*/
method addspacer(nindex, nspacefactor) class tlinearlayout
return


/*/{Protheus.doc} tlistbox
Cria um objeto do tipo lista de itens com barra de rolagem.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tlistbox

/*/
class tlistbox from TControl
data aitems as array
data nat as numeric
method create()
method new()
method change()
method del()
method getpos()
method getseltext()
method gobottom()
method gotop()
method insert()
method len()
method modify()
method reset()
method select()
method setarray()
method setitems()
method add()
method set()
end class
/*/{Protheus.doc} tlistbox:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TListBox

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for seqüencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [aitems], array, Indica uma lista de itens e caracteres que serão apresentados. Essa lista pode ter os seguintes formatos: Seqüencial \(Exemplo: \{"item1","item2",...,"itemN"\}\) ou Indexada \(Exemplo: \{"a=item1","b=item2",...,"n=itemN"\}\).
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam10], object, Compatibility parameter. Pass NIL.
@param [uparam11], object, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam13], logical, Compatibility parameter. Pass NIL.
@param [bldblclick], codeblock, Indica o bloco de código que será executado quando clicar duas vezes, com o botão esquerdo do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam16], character, Compatibility parameter. Pass NIL.
@param [uparam17], logical, Compatibility parameter. Pass NIL.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\) se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [uparam19], array, Compatibility parameter. Pass NIL.
@param [uparam20], codeblock, Compatibility parameter. Pass NIL.
@param [uparam21], logical, Compatibility parameter. Pass NIL.
@param [uparam22], logical, Compatibility parameter. Pass NIL.
@param [brclicked], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, nrow, ncol, bsetget, aitems, nwidth, nheight, bchange, bvalid, uparam10, uparam11, lpixel, uparam13, bldblclick, ofont, uparam16, uparam17, bwhen, uparam19, uparam20, uparam21, uparam22, brclicked) class tlistbox
return
/*/{Protheus.doc} tlistbox:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TListBox

@param <nrow>, numeric, Indica a coordenada vertical em pixels ou caracteres.
@param <ncol>, numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for seqüencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [aitems], array, Indica uma lista de itens e caracteres que serão apresentados. Essa lista pode ter os seguintes formatos: Seqüencial \(Exemplo: \{"item1","item2",...,"itemN"\}\) ou Indexada \(Exemplo: \{"a=item1","b=item2",...,"n=itemN"\}\).
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam10], object, Compatibility parameter. Pass NIL.
@param [uparam11], object, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam13], logical, Compatibility parameter. Pass NIL.
@param [bldblclick], codeblock, Indica o bloco de código que será executado quando clicar duas vezes, com o botão esquerdo do mouse, sobre o objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam16], character, Compatibility parameter. Pass NIL.
@param [uparam17], logical, Compatibility parameter. Pass NIL.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, no objeto criado, estiver sendo realizada. Se o retorno for verdadeiro \(.T.\), o objeto continua habilitado; caso contrário, falso \(.F.\).
@param [uparam19], array, Compatibility parameter. Pass NIL.
@param [uparam20], codeblock, Compatibility parameter. Pass NIL.
@param [uparam21], logical, Compatibility parameter. Pass NIL.
@param [uparam22], logical, Compatibility parameter. Pass NIL.
@param [brclicked], codeblock, Indica o bloco de código que será executado quando clicar, com o botão direito do mouse, sobre o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, bsetget, aitems, nwidth, nheight, bchange, ownd, bvalid, uparam10, uparam11, lpixel, uparam13, bldblclick, ofont, uparam16, uparam17, bwhen, uparam19, uparam20, uparam21, uparam22, brclicked) class tlistbox
return
/*/{Protheus.doc} tlistbox:change
Executa o bloco de código configurado no parâmetro bChange, ao mudar de linha.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/change
/*/
method change() class tlistbox
return
/*/{Protheus.doc} tlistbox:del
Exclui um item.

@type method

@param [npos], numeric, Indica a posição do item que será excluído. Observação: Essa posição deve ser maior que 0 e menor ou igual que o número de itens.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/del
/*/
method del(npos) class tlistbox
return
/*/{Protheus.doc} tlistbox:getpos
Retorna a posição do item selecionado na lista.

@type method

@return numeric, Retorna a posição do item selecionado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getpos
/*/
method getpos() class tlistbox
return
/*/{Protheus.doc} tlistbox:getseltext
Retorna o texto do item selecionado na lista.

@type method

@return character, Retorna a posição do item selecionado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getseltext
/*/
method getseltext() class tlistbox
return
/*/{Protheus.doc} tlistbox:gobottom
Posiciona no último item da lista.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gobottom
/*/
method gobottom() class tlistbox
return
/*/{Protheus.doc} tlistbox:gotop
Posiciona no primeiro item da lista.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gotop
/*/
method gotop() class tlistbox
return
/*/{Protheus.doc} tlistbox:insert
Insere um novo item.

@type method

@param [ctext], character, Indica o texto do item que será inserido.
@param [npos], numeric, Indica a posição do novo item, deslocando o item \(anterior\) daquela posição para baixo. Obs.: É necessário que exista um item naquela posição para inserir outro em seu lugar. Se este parâmetro não for passado, o item será inserido na posição do item que está selecionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/insert
/*/
method insert(ctext, npos) class tlistbox
return
/*/{Protheus.doc} tlistbox:len
Retorna o número de itens.

@type method

@return numeric, Retorna o número de itens.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/len
/*/
method len() class tlistbox
return
/*/{Protheus.doc} tlistbox:modify
Altera o texto do item.

@type method

@param [ctext], character, Indica o novo texto do item.
@param [npos], numeric, Indica a posição do item que terá seu texto alterado. Observação: A posição deve ser maior que 0 e menor ou igual que o número de itens.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/modify
/*/
method modify(ctext, npos) class tlistbox
return
/*/{Protheus.doc} tlistbox:reset
Limpa todos os itens da ListBox.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reset
/*/
method reset() class tlistbox
return
/*/{Protheus.doc} tlistbox:select
Força a seleção de um item.

@type method

@param <nitem>, numeric, Indica a posição do item que será selecionado
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/select
/*/
method select(nitem) class tlistbox
return
/*/{Protheus.doc} tlistbox:setarray
Define o vetor de itens para a lista. Caso exista uma definição anterior ela será substituida.

@type method

@param <avetor>, array, Indica um array, no formato texto, com os itens para a lista.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setarray
/*/
method setarray(avetor) class tlistbox
return
/*/{Protheus.doc} tlistbox:setitems
Define o array de itens para a lista. Caso exista uma definição anterior ela será substituida.

@type method

@param <avetor>, array, Indica o array, no formato texto, com os itens para a lista.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setitems
/*/
method setitems(avetor) class tlistbox
return
/*/{Protheus.doc} tlistbox:add
Adiciona um novo item.

@type method

@param [ctext], character, Indica o texto do item que será adicionado.
@param [npos], numeric, Indica a posição do novo item, deslocando o item \(anterior\) daquela posição para baixo. Obs.: Diferente do método Insert, não é necessário que exista um item naquela posição para inserir outro em seu lugar. Se este parâmetro não for passado, o item será inserido no final da lista.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/add
/*/
method add(ctext, npos) class tlistbox
return
/*/{Protheus.doc} tlistbox:set
Força a seleção de um item.

@type method

@param [ctext], character, Indica o texto do item que será selecionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/set
/*/
method set(ctext) class tlistbox
return


/*/{Protheus.doc} tmailmanager
A classe TMailManager realiza a comunicação com o servidor de e-mail.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmailmanager

/*/
class tmailmanager
method new()
method popconnect()
method popdisconnect()
method getnummsgs()
method deletemsg()
method init()
method smtpconnect()
method smtpdisconnect()
method geterrorstring()
method setpoptimeout()
method setsmtptimeout()
method getsmtptimeout()
method sendmail()
method imapconnect()
method imapdisconnect()
method getfolderlist()
method changefolder()
method deletefolder()
method createfolder()
method renamefolder()
method getmsgheader()
method getmsgbody()
method movemsg()
method copymsg()
method getfolder()
method setmsgflag()
method setfoldersubscribe()
method purge()
method smtpauth()
method imapstore()
method getuser()
method startgetallmsgheader()
method endgetallmsgheader()
method setuserealid()
method setusetls()
method setusessl()
end class
/*/{Protheus.doc} tmailmanager:new
Cria uma nova instância da classe TMailManager.

@type method

@return object, Nova instância da classe TMailManager

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:popconnect
Conecta com o servidor POP - Post Office Protocol.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso. Caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/popconnect
/*/
method popconnect() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:popdisconnect
Encerra a conexão com o servidor POP - Post Office Protocol.

@type method

@return numeric, Retorna 0 \(zero\) ao encerrar a conexão com sucesso. Caso contrário, será retornado um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/popdisconnect
/*/
method popdisconnect() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getnummsgs
Obtém o número de mensagens existentes no servidor de e-mail.

@type method

@return numeric, Retorna 0 \(zero\) se a execução for realizada com sucesso. Caso contrário, será retornado o código de erro ocorrido.

@param <@nnummsg>, variant, Indica o número de mensagens que estão no servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getnummsgs
/*/
method getnummsgs(nnummsg) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:deletemsg
Exclui uma mensagem do servidor de e-mail.

@type method

@return numeric, Retorna 0 \(zero\) se encontrar e excluir a mensagem. Caso contrário, será retornado o código de erro ocorrido.

@param <nmsg>, numeric, Indica o número da mensagem que será excluéda.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletemsg
/*/
method deletemsg(nmsg) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:init
Define as configurações da classe TMailManager para realizar uma conexão com o servidor de e-mail.

@type method

@return numeric, Retorna sempre 0 \(zero\). Exceto quando for utilizado o protocolo MAPI e o servidor não estiver rodando em plataforma Windows, o retorno será -1.

@param <cmailserver>, character, Indica o endereço ou alias do servidor de e-mail IMAP/POP/MAPI.
@param <csmtpserver>, character, Indica o endereço ou alias do servidor de e-mail SMTP.
@param <caccount>, character, Indica a conta de e-mail do usuário no servidor de e-mail.
@param <cpassword>, character, Indica a senha do usuário no servidor de e-mail.
@param [nmailport], numeric, Indica a porta de comunicação para conexão IMAP/POP/MAPI.
@param [nsmtpport], numeric, Indica o Indica a porta de comunicação para conexão SMTP \(Padrão 25\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/init
/*/
method init(cmailserver, csmtpserver, caccount, cpassword, nmailport, nsmtpport) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:smtpconnect
Conecta com o servidor SMTP - Simple Mail Transfer Protocol.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso. Caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smtpconnect
/*/
method smtpconnect() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:smtpdisconnect
Finaliza a conexão entre a aplicação e o servidor SMTP - Simple Mail Transfer Protocol.

@type method

@return numeric, Retorna 0 \(zero\) ao encerrar a conexão com sucesso. Caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smtpdisconnect
/*/
method smtpdisconnect() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:geterrorstring
Obtém a descrição do código de erro informado.

@type method

@return character, Retorna uma string com a descrição do código de erro informado.

@param <nerror>, numeric, Indica o código numérico do erro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/geterrorstring
/*/
method geterrorstring(nerror) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setpoptimeout
Define o tempo de espera para uma conexão estabelecida com o servidor POP - Post Office Protocol.

@type method

@return numeric, Retorna 0 \(zero\) se o tempo de espera for definido com sucesso. Caso contrário, será retornado um código de erro.

@param <ntimeout>, numeric, Indica o tempo de espera em segundos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpoptimeout
/*/
method setpoptimeout(ntimeout) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setsmtptimeout
Define o tempo de espera para uma conexão estabelecida com o servidor SMTP - Simple Mail Transfer Protocol.

@type method

@return numeric, Retorna 0 \(zero\) se o tempo de espera for definido com sucesso. Caso contrário, será retornado um código de erro.

@param <ntimeout>, numeric, Indica o tempo de espera em segundos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setsmtptimeout
/*/
method setsmtptimeout(ntimeout) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getsmtptimeout
Obtém o tempo de espera para uma conexão estabelecida com o servidor SMTP - Simple Mail Transfer Protocol.

@type method

@return numeric, Retorna o tempo de espera em segundos.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsmtptimeout
/*/
method getsmtptimeout() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:sendmail
Envia e-mail através do protocolo SMTP - Simple Mail Transfer Protocol ou MAPI.

@type method

@return numeric, Retorna 0 \(zero\) se o e-mail for enviado com sucesso. Caso contrário, retornará um código de erro.

@param <cfrom>, character, Indica o endereço de uma conta de e-mail \(remetente\) para representar o e-mail enviado. Exemplo: usuário@provedor.com.br.
@param <cto>, character, Indica o endereço de uma conta de e-mail que será utilizada para enviar o respectivo e-mail.
@param [csubject], character, Indica o assunto do e-mail. Caso não seja especificado, o assunto será enviado em branco.
@param [cbody], character, Indica o conteúdo da mensagem que será enviada.
@param [ccc], character, Indica o endereço de e-mail, na seção Com Cópia \(CC\), que receberá a mensagem.
@param [cbcc], character, Indica o endereço de e-mail, na seção Cópia Oculta, que receberá a mensagem.
@param [aattach], array, Indica um array de caracteres com o caminho do arquivo que será anexado no e-mail
@param <nnumattach>, numeric, Indica a quantidade de arquivos que serão anexados no e-mail, no caso a quantidade de elementos do array.
@param [npriority], numeric, Indica a prioridade da mensagem. Caso não seja preenchido, a prioridade será normal.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sendmail
/*/
method sendmail(cfrom, cto, csubject, cbody, ccc, cbcc, aattach, nnumattach, npriority) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:imapconnect
Realiza a conexão com o servidor IMAP - Internet Message Access Protocol.

@type method

@return numeric, Retorna 0 \(zero\) se realizar a conexão com o servidor IMAP. Caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/imapconnect
/*/
method imapconnect() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:imapdisconnect
Encerra a conexão entre a aplicação e o servidor IMAP - Internet Message Access Protocol.

@type method

@return numeric, Retorna 0 \(zero\) se finalizar a conexão com o servidor IMAP. Caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/imapdisconnect
/*/
method imapdisconnect() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getfolderlist
Obtém todas as pastas assinadas de uma conta de e-mail, através do servidor IMAP.

@type method

@return array, Retorna um array com todas as pastas assinadas de uma conta de e-mail, com as seguintes informações: nome, status, número de mensagens existentes, número de mensagens lidas e número de mensagens não lidas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getfolderlist
/*/
method getfolderlist() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:changefolder
Permite trocar de pasta, no servidor IMAP, informando uma nova pasta.

@type method

@return logical, Retorna verdadeiro \(.T.\), se a pasta informada for válida \(existir\) para realizar a troca de pasta. Caso contrário, retorna falso \(.F.\).

@param <cfolder>, character, Indica o nome da pasta desejada no servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/changefolder
/*/
method changefolder(cfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:deletefolder
Exclui uma pasta do servidor IMAP.

@type method

@return logical, Retorna verdadeiro \(.T.\), se a pasta for excluéda com sucesso. Caso contrário, retorna falso \(.F.\).

@param <cfolder>, character, Indica o nome da pasta que será excluéda.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletefolder
/*/
method deletefolder(cfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:createfolder
Cria uma nova pasta de mensagens no servidor IMAP.

@type method

@return logical, Retorna verdadeiro \(.T.\), se a pasta for criada com sucesso. Caso contrário, retorna falso \(.F.\).

@param <cfolder>, character, Indica o nome da pasta que será criada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/createfolder
/*/
method createfolder(cfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:renamefolder
Altera o nome da pasta no servidor IMAP.

@type method

@return logical, Retorna verdadeiro \(.T.\), se alterar o nome da pasta. Caso contrário, retorna falso \(.F.\).

@param <ccurfolder>, character, Indica o nome atual da pasta no servidor IMAP.
@param <cnewfolder>, character, Indica o novo nome da pasta.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/renamefolder
/*/
method renamefolder(ccurfolder, cnewfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getmsgheader
Obtém o cabeçalho da mensagem, retornando os campos que foram incluédos na mensagem.

@type method

@return array, Retorna um array com os campos do cabeçalho da mensagem. Em caso de erro, retorna nulo.

@param <nmsg>, numeric, Indica o número da mensagem na pasta do servidor de e-mail IMAP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmsgheader
/*/
method getmsgheader(nmsg) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getmsgbody
Obtém o corpo da mensagem através do servidor IMAP.

@type method

@return array, Retorna um array com as informações da mensagem.

@param <nmsg>, numeric, Indica o número sequencial da mensagem que deseja obter.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmsgbody
/*/
method getmsgbody(nmsg) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:movemsg
Move uma mensagem da pasta em uso, do servidor IMAP, para outra pasta contida na conta de e-mail.

@type method

@return logical, Retorna verdadeiro \(.T.\) caso tenha sido movida a mensagem com sucesso. Caso contrário, retornará falso \(.F.\).

@param <nmsg>, numeric, Indica o número sequencial da mensagem que deseja obter.
@param <cfolder>, character, Indica o nome da pasta que armazenará a mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/movemsg
/*/
method movemsg(nmsg, cfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:copymsg
Copia uma mensagem da pasta corrente, do servidor IMAP, para outra pasta ou a mesma.

@type method

@return logical, Retorna verdadeiro \(.T.\) se realizar a copia da mensagem para a pasta informada. Caso contrário, retorna falso \(.F.\).

@param <nmsg>, numeric, Indica o número sequencial da mensagem no servidor IMAP.
@param <cfolder>, character, Indica o nome da pasta, do servidor IMAP, para qual a mensagem será transferida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/copymsg
/*/
method copymsg(nmsg, cfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getfolder
Obtém o nome da pasta atual no servidor IMAP.

@type method

@return character, Retorna uma string com o nome da pasta em uso pela aplicação.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getfolder
/*/
method getfolder() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setmsgflag
Define o status de uma determinada mensagem no servidor IMAP.

@type method

@return logical, Retorna verdadeiro \(.T.\) se a mensagem for posicionada corretamente. Caso contrário, retorna falso \(.F.\).

@param <nmsg>, numeric, Indica o número sequencial da mensagem que deseja obter.
@param <cflag>, character, Indica o novo status da mensagem, sendo: A=Answered, F=Flagged, D=Deleted, S=Seen, R=Draft, C=Recent, P=Special.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmsgflag
/*/
method setmsgflag(nmsg, cflag) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setfoldersubscribe
Define uma determinada pasta, do servidor IMAP, assinada. Desta forma, a pasta ficará visével, na caixa de correio, e suas mensagens serão baixadas.

@type method

@return logical, Retorna verdadeiro \(.T.\) se a operação for realizada com sucesso. Caso contrário, retorna falso \(.F.\).

@param <cfolder>, character, Indica o nome da pasta que será ou não assinada \(subscribe\).
@param <lsign>, logical, Indica se a pasta será assinada \(.T.\) ou não \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfoldersubscribe
/*/
method setfoldersubscribe(cfolder, lsign) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:purge
Remove permanentemente todas as mensagens contidas na caixa de e-mail e pasta informada, que contenham a flag <Deleted> definidas.

@type method

@return logical, Retorna verdadeiro \(.T.\) se a operação for realizada com sucesso. Caso contrário, retorna falso \(.F.\).

@param <cfolder>, character, Indica o nome da pasta que será realizado o purge.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/purge
/*/
method purge(cfolder) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:smtpauth
Realiza a autenticação no servidor SMTP - Simple Mail Transfer Protocol - para envio de mensagens.

@type method

@return numeric, Retorna 0 \(zero\) em caso de sucesso. Caso contrário, retornará um código de erro.

@param <cuser>, character, Indica o usuário no qual será feita a autenticação.
@param <cpass>, character, Indica a senha do usuário para autenticação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smtpauth
/*/
method smtpauth(cuser, cpass) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:imapstore
Armazena uma mensagem em alguma pasta do servidor IMAP.

@type method

@return numeric, Retorna 0 \(zero\) em caso de sucesso. Caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica o nome da pasta que armazenará a mensagem.
@param <omsg>, object, Indica um objeto, da classe TMailMessage, que contém informações da mensagem que será armazenada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/imapstore
/*/
method imapstore(cfolder, omsg) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:getuser
Obtém o nome do usuário de e-mail, informado nos métodos de inicialização ou autenticação.

@type method

@return character, Retorna o nome da conta de e-mail em uso.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getuser
/*/
method getuser() class tmailmanager
return
/*/{Protheus.doc} tmailmanager:startgetallmsgheader
Inicia o processo para adquirir todos os cabeçalhos \(headers\) e mensagens de uma determinada pasta.

@type method

@return logical, Retorna verdadeiro \(.T.\), se iniciar o processo para adquirir os cabeçalhos e mensagens. Caso contrário, retorna falso \(.F.\).

@param <cfolder>, character, Indica a pasta, no servidor de e-mail, em que serão adquiridos os cabeçalhos das mensagens.
@param <aheader>, array, Indica as informações que serão retornadas nos cabeçalhos das mensagens.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/startgetallmsgheader
/*/
method startgetallmsgheader(cfolder, aheader) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:endgetallmsgheader
Obtém o cabeçalho de todas as mensagens existentes no servidor IMAP.

@type method

@return logical, Retorna verdadeiro \(.T.\) quando o servidor IMAP terminar o envio do cabeçalho da mensagem. Caso contrário, retorna falso \(.F.\).

@param <@aheader>, array, Indica o vetor que será utilizado como referência para retornar o cabeçalho da mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/endgetallmsgheader
/*/
method endgetallmsgheader(aheader) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setuserealid
Define o tipo de identificação, no servidor IMAP, para utilização do ID único da mensagem para a busca de mensagens.

@type method

@param <lopt>, logical, Indica se será utilizado o ID real da mensagem \(.T.\) ou será utilizado o número da mensagem \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setuserealid
/*/
method setuserealid(lopt) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setusetls
Define no envio de e-mail o uso de STARTTLS durante o protocolo de comunicação.

@type method

@param <ltls>, logical, Indica se será utilizará a comunicação segura através de SSL/TLS \(.T.\) ou não \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setusetls
/*/
method setusetls(ltls) class tmailmanager
return
/*/{Protheus.doc} tmailmanager:setusessl
Define o envio de e-mail utilizando uma comunicação segura através do SSL - Secure Sockets Layer.

@type method

@param <lssl>, logical, Indica se será utilizará a comunicação segura através de SSL \(.T.\) ou não \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setusessl
/*/
method setusessl(lssl) class tmailmanager
return


/*/{Protheus.doc} tmailmessage
A classe TMailMessage representa uma mensagem de e-mail. Através dela é possível obter todas informações sobre a mensagem carregada e realizar diversas operações, como envio e recebimento de e-mail.

TMailMessage possui todos atributos possíveis a uma mensagem de e-mail e podemos utilizar seus métodos para inserir arquivos, documentos e outras mensagens como anexo da mensagem atual.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmailmessage

/*/
class tmailmessage
data cfrom as character
data cto as character
data ccc as character
data cbcc as character
data csubject as character
data cbody as character
data creplyto as character
data cmessageid as character
data cdate as character
data cnewsgroups as character
data creferences as character
data cxref as character
data cxnewsreader as character
data cxmailer as character
data nxpriority as numeric
data cnotification as character
data lsigned as logical
method new()
method receive()
method send()
method clear()
method attachfile()
method attach()
method attachfullpath()
method addatthtag()
method tostr()
method fromstr()
method addcustomheader()
method getcustomheader()
method getattachcount()
method getattachinfo()
method getattach()
method saveattach()
method save()
method load()
method msgbodytype()
method msgbodyencode()
method setconfirmread()
method receive2()
method send2()
end class
/*/{Protheus.doc} tmailmessage:new
Cria uma nova instância da classe TMailMessage.

@type method

@return object, Nova instância da classe TMailMessage

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tmailmessage
return
/*/{Protheus.doc} tmailmessage:receive
Recebe uma nova mensagem do servidor populando o objeto da mensagem.

@type method

@return numeric, Retorna 0 \(zero\) quando o e-mail for recebido com sucesso. Caso contrário, retorna outro valor.

@param <oserver>, object, Indica o objeto do servidor de e-mail, criado através da classe TMailManager.
@param <nmsg>, numeric, Indica o número da mensagem que será criada, recebido através do método TMailManager:GetNumMsgs.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/receive
/*/
method receive(oserver, nmsg) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:send
Envia um e-mail, de acordo com os dados passados pelo objeto da classe TMailManager por parâmetro, para o método.

@type method

@return numeric, Retorna 0 \(zero\) quando o e-mail for enviado com sucesso. Caso contrário, retorna outro valor.

@param <oserver>, object, Indica o objeto do servidor de e-mail, criado através da classe TMailManager.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/send
/*/
method send(oserver) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:clear
Limpa o conteúdo do objeto. Desta forma, é possível receber várias mensagens no mesmo objeto, apenas limpando o seu conteúdo antes.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clear
/*/
method clear() class tmailmessage
return
/*/{Protheus.doc} tmailmessage:attachfile
Anexa um arquivo ao objeto de e-mail.

@type method

@return numeric, Em caso de sucesso, retorna o índice do arquivo anexado, iniciando em 0 \(zero\). Em caso de erro, retorna -1.

@param <cfile>, character, Indica o nome do arquivo, a partir do rootpath, a ser anexado no e-mail.
@param [nparam2], numeric, Parâmetro de compatiblidade. Passar Nil \(nulo\).
@param [cparam3], character, Parâmetro de compatiblidade. Passar Nil \(nulo\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/attachfile
/*/
method attachfile(cfile, nparam2, cparam3) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:attach
Anexa o conteúdo de um arquivo ao objeto de e-mail.

@type method

@return numeric, Em caso de sucesso, retorna o índice do arquivo anexado, iniciando em 0 \(zero\). Em caso de erro, retorna -1.

@param <ccontent>, character, Indica o conteúdo do arquivo a ser anexado no e-mail.
@param <cparam2>, character, Parâmetro de compatiblidade. Passar string vazia \(""\).
@param <nparam3>, numeric, Parâmetro de compatiblidade. Passar 0.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/attach
/*/
method attach(ccontent, cparam2, nparam3) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:attachfullpath
Anexa um arquivo ao objeto de e-mail.

@type method

@return numeric, Em caso de sucesso, retorna o índice do arquivo anexado, iniciando em 0 \(zero\). Em caso de erro, retorna -1.

@param <cfile>, character, Indica o nome do arquivo, com o caminho completo, a ser anexado no e-mail.
@param [nparam2], numeric, Parâmetro de compatiblidade. Passar Nil \(nulo\).
@param [cparam3], character, Parâmetro de compatiblidade. Passar Nil \(nulo\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/attachfullpath
/*/
method attachfullpath(cfile, nparam2, cparam3) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:addatthtag
Permite definir um header ao último arquivo anexado na mensagem a ser enviada.

@type method

@return numeric, Retorna o índice do header adicionado na lista caso existe algum anexo. Caso não tenha anexos, retorna -1.

@param <ctag>, character, Indica os dados que se deseja informar para o último arquivo anexado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addatthtag
/*/
method addatthtag(ctag) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:tostr
Converte um objeto da classe TMailMessage para uma string.

@type method

@return character, String com o objeto de e-mail.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tostr
/*/
method tostr() class tmailmessage
return
/*/{Protheus.doc} tmailmessage:fromstr
Carrega um e-mail a partir de uma string para um objeto da classe TMailMessage.

@type method

@param <cstr>, character, Obejto da classe TMailMessage convertido para string.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/fromstr
/*/
method fromstr(cstr) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:addcustomheader
Adiciona um header personalizado à mensagem.

@type method

@param <cname>, character, Nome do header que será adicionado à mensagem.
@param <cvalue>, character, Valor do header que será adicionado à mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcustomheader
/*/
method addcustomheader(cname, cvalue) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:getcustomheader
Devolve o valor de um header da mensagem.

@type method

@return character, Valor do header que está na mensagem.

@param <cname>, character, Nome do header que está na mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcustomheader
/*/
method getcustomheader(cname) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:getattachcount
Informa quantidade de arquivos anexados a mensagem.

@type method

@return numeric, Retorna o número de anexos da mensagem.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getattachcount
/*/
method getattachcount() class tmailmessage
return
/*/{Protheus.doc} tmailmessage:getattachinfo
Apresenta informações de um anexo de uma mensagem.

@type method

@return array, Retorna Nil \(nulo\) caso não encontre o anexo. Caso encontre, retorna um vetor com informações do anexo.

@param <nmsg>, numeric, Indica o número da mensagem que deseja verificar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getattachinfo
/*/
method getattachinfo(nmsg) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:getattach
Permite obter o conteúdo do arquivo atachado e retornar esse conteúdo através de uma string.

@type method

@return character, Retorna uma string \(cadeia de caracteres\) contendo o conteúdo do arquivo anexado na mensagem.

@param <cnummsg>, numeric, Indica o ID \(número de identificação da mensagem\) que se deseja obter informações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getattach
/*/
method getattach(cnummsg) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:saveattach
Salva um arquivo anexo a mensagem em disco.

@type method

@return logical, Retorna verdadeiro \(.T.\) caso consiga salvar o anexo com sucesso. Falso \(.F.\) caso contrário.

@param <nindex>, numeric, Índice do anexo iniciando em 1.
@param <cpath>, character, Caminho com o nome do arquivo que será gravado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/saveattach
/*/
method saveattach(nindex, cpath) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:save
Salva uma mensagem de e-mail em disco.

@type method

@param <cfilepath>, character, Indica o arquivo no disco a partir do RootPath do servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/save
/*/
method save(cfilepath) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:load
Carrega um e-mail salvo em disco para um objeto da classe TMailMessage.

@type method

@param <cfile>, character, Indica o arquivo no disco a partir do RootPath do servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/load
/*/
method load(cfile) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:msgbodytype
Permite definir o tipo do corpo do e-mail.

@type method

@param <cvalue>, character, Indica o valor do tipo do corpo do e-mail que será definido. Valor padrão: text/html.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msgbodytype
/*/
method msgbodytype(cvalue) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:msgbodyencode
Define a codificação do corpo do e-mail.

@type method

@param <nvalue>, numeric, Valor da codificação do corpo do e-mail. Valores aceitos: 0 \(UUEncode\) e 1 \(MIME\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/msgbodyencode
/*/
method msgbodyencode(nvalue) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:setconfirmread
Define se a mensagem enviada terá confirmação de leitura.

@type method

@param <lread>, logical, Indica se haverá confirmação de leitura ou não.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setconfirmread
/*/
method setconfirmread(lread) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:receive2
Recebe uma nova mensagem do servidor populando o objeto da mensagem.

@type method

@return numeric, Retorna 0 \(zero\) quando o e-mail for recebido com sucesso. Caso contrário, retorna outro valor.

@param <oserver>, object, Indica o objeto do servidor de e-mail, criado através da classe TMailMng.
@param <nmsg>, numeric, Indica o número da mensagem que será criada, recebido através do método TMailMng:GetNumMsgs.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/receive2
/*/
method receive2(oserver, nmsg) class tmailmessage
return
/*/{Protheus.doc} tmailmessage:send2
Envia um e-mail, de acordo com os dados passados pelo objeto da classe TMailMng por parâmetro, para o método.

@type method

@return numeric, Retorna 0 \(zero\) quando o e-mail for enviado com sucesso&$ caso contrário, retorna outro valor.

@param <oserver>, object, Indica o objeto do servidor de e-mail, criado através da classe TMailMng.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/send2
/*/
method send2(oserver) class tmailmessage
return


/*/{Protheus.doc} tmailmng
A classe TMailMng vem como substituição à classe TMailManager, realizando a comunicação com o servidor de e-mail, e possuindo maior flexibilidade de configuração e maior suporte de protocolos.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmailmng

/*/
class tmailmng
data lverbose as logical
data nprotocol as numeric
data nsrvssl as numeric
data nsmtpssl as numeric
data cuser as character
data cpass as character
data lsrvretryssl as logical
data csrvaddr as character
data nsrvport as numeric
data nsrvtimeout as numeric
data lsmtpretryssl as logical
data csmtpaddr as character
data nsmtpport as numeric
data nsmtptimeout as numeric
data csmtplocalhost as character
data lauthlogin as logical
data lauthntlm as logical
data lauthplain as logical
data lextendsmtp as logical
data lkeepmsg as logical
data lconnected as logical
data lsmtpconnected as logical
data ccurrentfolder as character
data luserealid as logical
data ltryencode as logical
method new()
method connect()
method disconnect()
method smtpconnect()
method smtpdisconnect()
method smtpauth()
method getnummsgs()
method deletemsg()
method geterrorstring()
method createfolder()
method changefolder()
method deletefolder()
method getfolderlist()
method getallfolderlist()
method renamefolder()
method setfoldersubscribe()
method getmsgbody()
method getmsgheader()
method startgetallmsgheader()
method endgetallmsgheader()
method copymsg()
method movemsg()
method setmsgflags()
method purge()
method imapstore()
end class
/*/{Protheus.doc} tmailmng:new
Cria uma nova instância da classe TMailMng.

@type method

@return object, Nova instância da classe TMailMng

@param <nprotocol>, numeric, Indica o protocolo que será utilizado para recepção de emails.
@param [nserverssl], numeric, Indica a versão de protocolo seguro que será utilizada para o recebimento de emails.
@param [nsmtpssl], numeric, Indica a versão de protocolo seguro que será utilizada para o envio de emails.
@param [loldtls], logical, Indica se utilizará o protocolo SSL v3 para conexão TLS para SMTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nprotocol, nserverssl, nsmtpssl, loldtls) class tmailmng
return
/*/{Protheus.doc} tmailmng:connect
Conecta com o servidor de recebimento de emails.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/connect
/*/
method connect() class tmailmng
return
/*/{Protheus.doc} tmailmng:disconnect
Disconecta do servidor de recebimento de emails.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/disconnect
/*/
method disconnect() class tmailmng
return
/*/{Protheus.doc} tmailmng:smtpconnect
Conecta com o servidor SMTP, para envio de emails.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smtpconnect
/*/
method smtpconnect() class tmailmng
return
/*/{Protheus.doc} tmailmng:smtpdisconnect
Disconecta do servidor SMTP, de envio de emails.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smtpdisconnect
/*/
method smtpdisconnect() class tmailmng
return
/*/{Protheus.doc} tmailmng:smtpauth
Realiza a autenticação no servidor SMTP.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cuser>, character, Indica o nome de usuário que será utilizado para autenticação.
@param <cpass>, character, Indica a senha do usuário para autenticação.
@param [cpopaddress], character, Indica o endereço do servidor POP3 para autenticação.
@param [cpopport], character, Indica a porta para o servidor POP3 para autenticação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/smtpauth
/*/
method smtpauth(cuser, cpass, cpopaddress, cpopport) class tmailmng
return
/*/{Protheus.doc} tmailmng:getnummsgs
Obtém o número de mensagens existentes no servidor de e-mail.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <@nnummsg>, numeric, Indica o número de mensagens que estão no servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getnummsgs
/*/
method getnummsgs(nnummsg) class tmailmng
return
/*/{Protheus.doc} tmailmng:deletemsg
Exclui uma mensagem do servidor de e-mail.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <nmsg>, numeric, Indica o número da mensagem que será excluída.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletemsg
/*/
method deletemsg(nmsg) class tmailmng
return
/*/{Protheus.doc} tmailmng:geterrorstring
Obtém a descrição do código de erro informado.

@type method

@return character, Retorna uma string com a descrição do código de erro informado.

@param <nerror>, numeric, Indica o código numérico do erro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/geterrorstring
/*/
method geterrorstring(nerror) class tmailmng
return
/*/{Protheus.doc} tmailmng:createfolder
Cria uma nova pasta de mensagens no servidor IMAP.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica o nome da pasta que será criada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/createfolder
/*/
method createfolder(cfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:changefolder
Permite trocar de pasta, no servidor IMAP, informando uma nova pasta.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica o nome da pasta desejada no servidor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/changefolder
/*/
method changefolder(cfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:deletefolder
Exclui uma pasta do servidor IMAP.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica o nome da pasta que será excluída.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deletefolder
/*/
method deletefolder(cfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:getfolderlist
Obtém todas as pastas assinadas de uma conta de e-mail, através do servidor IMAP.

@type method

@return array, Retorna um array com todas as pastas assinadas de uma conta de e-mail, com as seguintes informações: nome, status, número de mensagens existentes, número de mensagens lidas e número de mensagens não lidas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getfolderlist
/*/
method getfolderlist() class tmailmng
return
/*/{Protheus.doc} tmailmng:getallfolderlist
Obtém todas as pastas \(Assinadas/Não assinadas\) de uma conta de email do servidor IMAP.

@type method

@return array, Retorna um array com todas as pastas \(Assinadas/Não assinadas\) de uma conta de e-mail, com as seguintes informações: nome, status, número de mensagens existentes, número de mensagens lidas e número de mensagens não lidas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getallfolderlist
/*/
method getallfolderlist() class tmailmng
return
/*/{Protheus.doc} tmailmng:renamefolder
Altera o nome da pasta no servidor IMAP.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <ccurfolder>, character, Indica o nome atual da pasta no servidor IMAP.
@param <cnewfolder>, character, Indica o novo nome da pasta.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/renamefolder
/*/
method renamefolder(ccurfolder, cnewfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:setfoldersubscribe
Define uma determinada pasta, do servidor IMAP, assinada. Desta forma, a pasta ficará visível, na caixa de correio, e suas mensagens serão baixadas.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica o nome da pasta que será ou não assinada \(subscribe\).
@param <lsign>, logical, Indica se a pasta será assinada \(.T.\) ou não \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfoldersubscribe
/*/
method setfoldersubscribe(cfolder, lsign) class tmailmng
return
/*/{Protheus.doc} tmailmng:getmsgbody
Obtém o corpo da mensagem através do servidor IMAP.

@type method

@return array, Retorna um array com as informações da mensagem.

@param <nmsg>, numeric, Indica o número sequencial da mensagem que deseja obter.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmsgbody
/*/
method getmsgbody(nmsg) class tmailmng
return
/*/{Protheus.doc} tmailmng:getmsgheader
Obtém o cabeçalho da mensagem, retornando os campos que foram incluídos na mensagem.

@type method

@return array, Retorna um array com os campos do cabeçalho da mensagem. Em caso de erro, retorna nulo.

@param <nmsg>, numeric, Indica o número da mensagem na pasta do servidor de e-mail IMAP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getmsgheader
/*/
method getmsgheader(nmsg) class tmailmng
return
/*/{Protheus.doc} tmailmng:startgetallmsgheader
Inicia o processo para adquirir todos os cabeçalhos \(headers\) e mensagens de uma determinada pasta.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica a pasta, no servidor de e-mail, em que serão adquiridos os cabeçalhos das mensagens.
@param <aheader>, array, Indica as informações que serão retornadas nos cabeçalhos das mensagens.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/startgetallmsgheader
/*/
method startgetallmsgheader(cfolder, aheader) class tmailmng
return
/*/{Protheus.doc} tmailmng:endgetallmsgheader
Obtém o cabeçalho de todas as mensagens existentes no servidor IMAP.

@type method

@return logical, Retorna verdadeiro \(.T.\) quando o servidor IMAP terminar o envio do cabeçalho da mensagem; caso contrário, retorna falso \(.F.\).

@param <@aheader>, array, Indica o vetor que será utilizado como referência para retornar o cabeçalho da mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/endgetallmsgheader
/*/
method endgetallmsgheader(aheader) class tmailmng
return
/*/{Protheus.doc} tmailmng:copymsg
Copia uma mensagem da pasta corrente, do servidor IMAP, para outra pasta ou a mesma.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <nmsg>, numeric, Indica o número sequencial da mensagem no servidor IMAP.
@param <cfolder>, character, Indica o nome da pasta, do servidor IMAP, para qual a mensagem será transferida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/copymsg
/*/
method copymsg(nmsg, cfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:movemsg
Move uma mensagem da pasta em uso, do servidor IMAP, para outra pasta contida na conta de e-mail.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <nmsg>, numeric, Indica o número sequencial da mensagem no servidor IMAP.
@param <cfolder>, character, Indica o nome da pasta que armazenará a mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/movemsg
/*/
method movemsg(nmsg, cfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:setmsgflags
Define o status de uma determinada mensagem no servidor IMAP.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <nmsg>, numeric, Indica o número sequencial da mensagem no servidor IMAP.
@param <cflag>, character, Indica o novo status da mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmsgflags
/*/
method setmsgflags(nmsg, cflag) class tmailmng
return
/*/{Protheus.doc} tmailmng:purge
Remove permanentemente na pasta informada todas as mensagens que contenham a flag `<Deleted>` definidas.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <cfolder>, character, Indica o nome da pasta que será realizado o purge.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/purge
/*/
method purge(cfolder) class tmailmng
return
/*/{Protheus.doc} tmailmng:imapstore
Armazena uma mensagem em alguma pasta do servidor IMAP.

@type method

@return numeric, Retorna 0 \(zero\) quando a operação é completada com sucesso; caso contrário, retornará um código de erro.

@param <omsg>, object, Indica um objeto da classe TMailMessage que contém informações da mensagem que será armazenada.
@param <cfolder>, character, Indica o nome da pasta que armazenará a mensagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/imapstore
/*/
method imapstore(omsg, cfolder) class tmailmng
return


/*/{Protheus.doc} tmediaplayer
Cria um objeto para reprodução de vídeos e áudios.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmediaplayer

/*/
class tmediaplayer from TControl
data nvolume as numeric
data nplaycount as numeric
method new()
method play()
method stop()
method pause()
method openfile()
method setvolume()
method setshowbar()
method setmute()
end class
/*/{Protheus.doc} tmediaplayer:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMediaPlayer

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [cfile], character, Indica o nome do arquivo de mídia\(MP4 ou MP3\), que caso preenchido iniciara automaticamente a reprodução .
@param [nvolume], numeric, Indica o volume de audio, de 0 a 100.
@param [lshowbar], logical, Se .T. indica que será exibida a barra de comandos do próprio Windows Media Player®.
@param [nplaycount], numeric, Indica a quantidade de vezes que a mídia será reproduzida.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, ownd, cfile, nvolume, lshowbar, nplaycount) class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:play
Inicia reprodução.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/play
/*/
method play() class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:stop
Para a reprodução.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/stop
/*/
method stop() class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:pause
Pausa a reprodução.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/pause
/*/
method pause() class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:openfile
Abre e inicia a reprodução de um arquivo de mídia.

@type method

@param [cfile], character, Indica o nome do arquivo de mídia\(MP4 ou MP3\), que caso preenchido iniciara automaticamente a reprodução.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/openfile
/*/
method openfile(cfile) class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:setvolume
Ajusta a altura do volume de áudio.

@type method

@param <nvolume>, numeric, Indica o volume de audio, de 0 a 100
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvolume
/*/
method setvolume(nvolume) class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:setshowbar
Habilita a exibição da barra de ferramentas do Windows Media Player®.

@type method

@param <showbar>, logical, Se .T. indica que será exibida a barra de comandos do próprio Windows Media Player®
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setshowbar
/*/
method setshowbar(showbar) class tmediaplayer
return
/*/{Protheus.doc} tmediaplayer:setmute
Liga e desliga a opção silencio \(mute\).

@type method

@param <mute>, logical, Se .T. habilita a opção silencio \(mute\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmute
/*/
method setmute(mute) class tmediaplayer
return


/*/{Protheus.doc} tmenu
Cria um objeto do tipo menu.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmenu

/*/
class tmenu from TControl
method new()
method add()
method removeitem()
method reset()
method setimagename()
end class
/*/{Protheus.doc} tmenu:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMenu

@param [ntop], numeric, Indica a coordenada vertical em pixels.
@param [nleft], numeric, Indica a coordenada horizontal em pixels.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [lpopup], logical, Indica se o objeto será Pop-up.
@param [cbmpname], character, Indica o nome da imagem que será utilizada no menu.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nclrnoselect], numeric, Indica o nome da cor que será utilizada quando o item não é selecionado.
@param [nclrselect], numeric, Indica o nome da cor que será utilizada quando o item é selecionado.
@param [carrowupnosel], character, Indica a imagem seta para cima quando o item não é selecionado.
@param [carrowupsel], character, Indica a imagem seta para cima quando o item é selecionado.
@param [carrowdownnosel], character, Indica a imagem seta para baixo quando o item não é selecionado.
@param [carrowdownsel], character, Indica a imagem seta para baixo quando o item é selecionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nheight, nwidth, lpopup, cbmpname, ownd, nclrnoselect, nclrselect, carrowupnosel, carrowupsel, carrowdownnosel, carrowdownsel) class tmenu
return
/*/{Protheus.doc} tmenu:add
Inclui item e subitem ao menu.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/add
/*/
method add() class tmenu
return
/*/{Protheus.doc} tmenu:removeitem
Remove um item do menu.

@type method

@param <omenu>, object, Indica o objeto do tipo TMenuItem que será removido.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/removeitem
/*/
method removeitem(omenu) class tmenu
return
/*/{Protheus.doc} tmenu:reset
Exclui os itens do menu.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reset
/*/
method reset() class tmenu
return
/*/{Protheus.doc} tmenu:setimagename
Define a imagem de fundo do menu.

@type method

@param [cimage], character, Indica o nome da imagem de fundo do menu. Observação: Antes de definir uma imagem para o objeto, é necessário que a mesma esteja compilada no repositório.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setimagename
/*/
method setimagename(cimage) class tmenu
return


/*/{Protheus.doc} tmenubar
Cria um objeto do tipo barra de menu.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmenubar

/*/
class tmenubar from TControl
method new()
method additem()
method addmenuitem()
method reset()
method setdefaultup()
end class
/*/{Protheus.doc} tmenubar:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMenuBar

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd) class tmenubar
return
/*/{Protheus.doc} tmenubar:additem
Inclui um novo item ao menu.

@type method

@param [ctitulo], character, Indica o título do item no menu superior.
@param [omenu], object, Indica o objeto do tipo TMenu que será executado na solicitação do menu superior.
@param [lmenu], logical, Lógico Indica se, verdadeiro \(.T.\), o item incluído será um item de menu; caso contrário, falso \(.F.\)
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/additem
/*/
method additem(ctitulo, omenu, lmenu) class tmenubar
return
/*/{Protheus.doc} tmenubar:addmenuitem
Inclui um novo item ao menu da barra superior.

@type method

@param [ctitulo], character, Indica o título do item no menu superior.
@param [omenu], object, Indica o objeto do tipo TMenu utilizado para incluir um menu.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addmenuitem
/*/
method addmenuitem(ctitulo, omenu) class tmenubar
return
/*/{Protheus.doc} tmenubar:reset
Exclui todas as opções do menu.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reset
/*/
method reset() class tmenubar
return
/*/{Protheus.doc} tmenubar:setdefaultup
Direciona o menu para cima.

@type method

@param [isdefup], logical, Indica se habilita \(.T.\)/desabilita\(.F.\) a apresentação do menu para cima.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setdefaultup
/*/
method setdefaultup(isdefup) class tmenubar
return


/*/{Protheus.doc} tmenuitem
Cria um objeto do tipo menu/item de menu.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmenuitem

/*/
class tmenuitem from TControl
data aitems as array
data baction as codeblock
data lchecked as logical
data omenu as object
data lselected as logical
method new()
method new2()
method add()
method addseparator()
method setactive()
end class
/*/{Protheus.doc} tmenuitem:new
Método Inicia uma nova instância da classe TMenuItem.

@type method

@return object, Nova instância da classe TMenuItem

@param <oparent>, object, Indica o controle visual onde o objeto será criado.
@param [ctitle], character, Indica o texto do item.
@param [cparam3], character, Compatibilidade.
@param [lparam4], logical, Compatibilidade.
@param [lactive], logical, Indica se, verdadeiro \(.T.\), o item está ativo; caso contrário, falso \(.F.\).
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o objeto.
@param [cparam7], character, Compatibilidade.
@param [cresname], character, Indica a imagem, do repositório, que será apresentada quando o ponteiro do mouse não estiver posicionado sobre o item.
@param [nparam9], numeric, Compatibilidade.
@param [cparam10], character, Compatibilidade.
@param [lparam11], logical, Compatibilidade.
@param [nparam12], numeric, Compatibilidade.
@param [bparam13], codeblock, Compatibilidade.
@param [lparam14], logical, Compatibilidade.
@param [lpopup], logical, Indica se, verdadeiro \(.T.\), o item faz parte de um popup; caso contrário, falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(oparent, ctitle, cparam3, lparam4, lactive, baction, cparam7, cresname, nparam9, cparam10, lparam11, nparam12, bparam13, lparam14, lpopup) class tmenuitem
return
/*/{Protheus.doc} tmenuitem:new2
Método Inicia uma nova instância da classe TMenuItem.

@type method

@return object, Nova instância da classe TMenuItem

@param [oparent], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ctitle], character, Indica o texto do item.
@param [cparam3], character, Compatibilidade.
@param [lactive], logical, Indica se, verdadeiro \(.T.\), o item está ativo; caso contrário, falso \(.F.\).
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o objeto.
@param [cresname], character, Indica a imagem, do repositório, que será apresentada quando o ponteiro do mouse não estiver posicionado sobre o item.
@param [creshover], character, Indica a imagem, do repositório, que será apresentada quando o ponteiro do mouse estiver posicionado sobre o item.
@param [nclrnoselect], numeric, Indica a cor do item que não está selecionado.
@param [nclrselect], numeric, Indica a cor do item quando selecionado.
@param [carrowrightnosel], character, Indica a imagem do repositório, no formato de seta para a direita, que será apresentada quando o item estiver fechado e não selecionado. Observação: Essa imagem é apresentada quando o item contém subitens.
@param [carrowrightsel], character, Indica a imagem do repositório, no formato de seta para a direita, que será apresentada quando o item estiver fechado e selecionado. Observação: Essa imagem é apresentada quando o item contém subitens.
@param [carrowdownnosel], character, Indica a imagem do repositório, no formato de seta para baixo, que será apresentada quando o item estiver aberto e não selecionado. Observação: Essa imagem é apresentada quando o item contém subitens.
@param [carrowdownsel], character, Indica a imagem do repositório, no formato de seta para baixo, que será apresentada quando o item estiver aberto e selecionado. Observação: Essa imagem é apresentada quando o item contém subitens.
@param [cresselected], character, Nome do resource a ser usado como fundo quando o item for selecionado \(clicado\). Disponível apenas em build superior a 7.00.121227P.
@param [cresseldetail], character, Nome do resource a ser usado como detalhe \(canto esquerdo ou direito\) do item quando estiver selecionado \(clicado\). O resource pode conter transparência para não sobrepor totalmente o resource de fundo. Disponível apenas em build superior a 7.00.121227P.
@param [nposseldetail], numeric, Código da posição em que o resource de detalhe quando selecionado ficará, sendo 0 para esquerda e 1 para direita. Disponível apenas em build superior a 7.00.121227P.
@param [lselected], logical, Indica se este item já vira selecionado por padrão. Disponível apenas em build superior a 7.00.121227P.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new2
/*/
method new2(oparent, ctitle, cparam3, lactive, baction, cresname, creshover, nclrnoselect, nclrselect, carrowrightnosel, carrowrightsel, carrowdownnosel, carrowdownsel, cresselected, cresseldetail, nposseldetail, lselected) class tmenuitem
return
/*/{Protheus.doc} tmenuitem:add
Adiciona um subitem ao menu.

@type method

@param [omenu], object, Indica o objeto do tipo TMenuItem utilizado para incluir um item ou subitem de menu.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/add
/*/
method add(omenu) class tmenuitem
return
/*/{Protheus.doc} tmenuitem:addseparator
Adiciona um separador no menu.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addseparator
/*/
method addseparator() class tmenuitem
return
/*/{Protheus.doc} tmenuitem:setactive
Ativa a opção do menu com o clique do mouse.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setactive
/*/
method setactive() class tmenuitem
return


/*/{Protheus.doc} tmobile
TMobile é uma classe utilitária que agrupa métodos focados na plataforma móvel TOTVS \| FatClient Embarcado e promove as integrações com aplicativos ou com o hardware do dispositivo móvel.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmobile

/*/
class tmobile
data bscreenorientationchanged as codeblock
data bgeocoordinateupdate as codeblock
data bnotificationtapped as codeblock
data bonpause as codeblock
data bonresume as codeblock
method new()
method takepicture()
method barcode()
method getpairedbluetoothdevices()
method getscreenorientation()
method setscreenorientation()
method getgeocoordinate()
method enablegeocoordinateupdate()
method opensettings()
method testdevice()
method createnotification()
method gettemppath()
method vibrate()
method readaccelerometer()
method addcontact()
method findcontact()
method findcalendarevent()
method getcalendarevent()
method viewcalendarevent()
method addcalendarevent()
end class
/*/{Protheus.doc} tmobile:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMobile

@param [ownd], object, Indica a janela ou controle visual que responderá como pai do controle.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd) class tmobile
return
/*/{Protheus.doc} tmobile:takepicture
Inicia o aplicativo da câmera e permite que uma foto seja registrada e gravada em um arquivo.

@type method

@return character, Retorna uma string contendo o caminho do arquivo da foto registrada. Uma string vazia será retornada se a operação falhar ou for cancelada pela usuário.

@param [nscaletowidth], numeric, Se for informado algum valor maior que 0 \(zero\), altera a largura da imagem final mantendo a proporção.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/takepicture
/*/
method takepicture(nscaletowidth) class tmobile
return
/*/{Protheus.doc} tmobile:barcode
Efetua a leitura de código de barras.

@type method

@return array, Retorna um array de duas posições do tipo caractere onde a primeira posição contém o valor decodificado do código de barras e a segunda posição contém o nome do tipo de código de barras lido \(por exemplo: UPC_A, EAN_8, QR_CODE, etc\). Se o usuário pressionar o botão voltar do dispositivo, nenhum código será lido e as duas posições do array estarão vazias.

@param [cbartype], character, Restringe os tipos de códigos de barras que poderão ser lidos \(consulte a área de observações abaixo para conhecer os valores possíveis para este parâmetro\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/barcode
/*/
method barcode(cbartype) class tmobile
return
/*/{Protheus.doc} tmobile:getpairedbluetoothdevices
Obtém uma lista contendo nomes e endereços dos dispositivos Bluetooth pareados

@type method

@return array, Retorna um array de duas dimensões, isto é, cada elemento do array é um outro array de duas posições do tipo caractere contendo em sua primeira posição o nome, e em sua segunda posição o endereço no formato 00:00:00:00:00:00 que é único e exclusivo para cada dispositivo Bluetooth. As duas posições estarão vazias caso nenhum dispositivo esteja pareado ou a interface Bluetooth esteja disativada.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getpairedbluetoothdevices
/*/
method getpairedbluetoothdevices() class tmobile
return
/*/{Protheus.doc} tmobile:getscreenorientation
Obtém a orientação da tela do dispositivo.

@type method

@return numeric, Retorna um valor numérico que representa a orientação da tela do dispositivo. Consulte a área de observações abaixo para conhecer os valores possíveis para o retorno.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getscreenorientation
/*/
method getscreenorientation() class tmobile
return
/*/{Protheus.doc} tmobile:setscreenorientation
Especifica a orientação da tela de um dispositivo móvel.

@type method

@param [norientation], numeric, Valor correspondente a orientação desejada. Consulte a área de observações abaixo para conhecer os valores possíveis para este parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setscreenorientation
/*/
method setscreenorientation(norientation) class tmobile
return
/*/{Protheus.doc} tmobile:getgeocoordinate
Obtém a mais recente coordenada de geolocalização disponibilizada pelo dispositivo móvel.

@type method

@return character, Retorna uma cadeia de caracteres contendo as coordenadas em latitude e longitude no formato escolhido.

@param [nformat], numeric, Valor correspondente ao formato da coordenada desejado. Consulte a área de observações abaixo para conhecer os valores possíveis para este parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getgeocoordinate
/*/
method getgeocoordinate(nformat) class tmobile
return
/*/{Protheus.doc} tmobile:enablegeocoordinateupdate
Habilita, desabilita e também parametriza o recebimento de coordenadas de geolocalização através do bloco de código bGeoCoordinateUpdate.

@type method

@return character, Retorna uma cadeia de caracteres contendo as coordenadas em latitude e longitude no formato escolhido.

@param [ninterval], numeric, Indica o tempo de intervalo mínimo em milissegundos entre as notificações de atualizações de coordenadas do dispositivo móvel ao bloco de código bGeoCoordinateUpdate. O valor 0 indica que o dispositivo móvel deve notificar o bloco de código bGeoCoordinateUpdate imediatamente e sempre que houver atualizações de coordenadas de geolocalização \(isso pode elevar o uso da bateria\). O valor -1 desativa a notificação de atualizações de coordenadas por parte do dispositivo móvel.
@param [nformat], numeric, Valor correspondente ao formato desejado da coordenada. Consulte a área de observações abaixo para conhecer os valores possíveis para este parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/enablegeocoordinateupdate
/*/
method enablegeocoordinateupdate(ninterval, nformat) class tmobile
return
/*/{Protheus.doc} tmobile:opensettings
Abre e mostra ao usuário do dispositivo móvel o menu de configurações da funcionalidade especificada.

@type method

@param [nsettings], numeric, Identificação do menu de configurações. Consulte a área de observações abaixo para conhecer os valores possíveis para este parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/opensettings
/*/
method opensettings(nsettings) class tmobile
return
/*/{Protheus.doc} tmobile:testdevice
Realiza um teste para verificar se a funcionalidade desejada está presente e ativada no dispositivo móvel.

@type method

@return logical, Retorna um valor lógico que se verdadeiro \(.T.\) indica que o componente/funcionalidade está presente e habilitado no dispositivo móvel. É importante destacar que um retorno falso \(.F.\) nesta função pode significar que a funcionalidade está desativada ou que até mesmo não está presente no dispostivo móvel \(por exemplo um tablet sem suporte a NFC\).

@param [ncomponent], numeric, Identificação do componente ou funcionalidade. Consulte a área de observações abaixo para conhecer os valores possíveis para este parâmetro.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/testdevice
/*/
method testdevice(ncomponent) class tmobile
return
/*/{Protheus.doc} tmobile:createnotification
Dispara uma notificação no dispositivo móvel.

@type method

@param <nnotificationid>, numeric, Identificador único da notificação que será disparada. Com este identificador torna-se possível identificar qual notificação foi tocada na tela do dispositivo móvel \(veja a documentação do bloco de código [bNotificationTapped](bNotificationTapped) que retorna este identificador\). Use um valor maior que zero.
@param <ctitle>, character, Título da notificação que será disparada.
@param <cmessage>, character, Mensagem da notificação que será disparada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/createnotification
/*/
method createnotification(nnotificationid, ctitle, cmessage) class tmobile
return
/*/{Protheus.doc} tmobile:gettemppath
Retorna o caminho do diretório temporário.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gettemppath
/*/
method gettemppath() class tmobile
return
/*/{Protheus.doc} tmobile:vibrate
Faz o dispositivo vibrar.

@type method

@param [*nmilliseconds], numeric, Tempo de duração da vibração em milissegundos \(\*disponível apenas para Android\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/vibrate
/*/
method vibrate(*nmilliseconds) class tmobile
return
/*/{Protheus.doc} tmobile:readaccelerometer
Efetua uma leitura no sensor acelerômetro do dispositivo móvel.

@type method

@return array, Retorna um array com três posições númericas no formato double \(decimal de ponto flutuante\) onde cada posição representa a aceleração de um eixo na ordem X, Y e Z e os valores são representados em metros por segundo ao quadrado \(m/s²\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/readaccelerometer
/*/
method readaccelerometer() class tmobile
return
/*/{Protheus.doc} tmobile:addcontact
Chama a interface de adicionar um contato, com informações previamente preenchidas e fornecidas pelo ADVPL.

@type method

@return character, Retorna o identificador único do contato fornecido pelo SO do dispositivo.

@param <ocontact>, object, Instância da classe TMobileContact com quaisquer informações previamente preenchidas do contato.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcontact
/*/
method addcontact(ocontact) class tmobile
return
/*/{Protheus.doc} tmobile:findcontact
Procura nos contatos do dispositivo por um filtro específico.

@type method

@return array, Array contendo instâncias da classe TMobileContact para cada contato encontrado.

@param <cfilter>, character, Texto a ser usado na busca.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/findcontact
/*/
method findcontact(cfilter) class tmobile
return
/*/{Protheus.doc} tmobile:findcalendarevent
Procura eventos no calendário do dispositivo por um período.

@type method

@return array, Array contendo os Ids dos eventos do calendário encontrados

@param <dinidate>, date, Data de início da pesquisa.
@param <denddate>, date, Data final da pesquisa.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/findcalendarevent
/*/
method findcalendarevent(dinidate, denddate) class tmobile
return
/*/{Protheus.doc} tmobile:getcalendarevent
Retorna informações de um evento do calendário específico.

@type method

@return array, Instância da classe TCalendarEvent contendo as informações do evento.

@param <cid>, character, Identificador do calendário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcalendarevent
/*/
method getcalendarevent(cid) class tmobile
return
/*/{Protheus.doc} tmobile:viewcalendarevent
Utiliza o API do sistema \(Android/IOS\) para mostrar o evento.

@type method

@return logical, Retorna .T. se achou o evento e .F. se o evento não existe \(ou não foi possível acessar\).

@param <cid>, character, Identificador do calendário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/viewcalendarevent
/*/
method viewcalendarevent(cid) class tmobile
return
/*/{Protheus.doc} tmobile:addcalendarevent
Utiliza o API do sistema \(Android/IOS\) para adicionar um evento ao calendário do dispositivo.

@type method

@return character, Retorna o ID do evento criado. Se o usuário cancelou a criação do evento, retorna um ID "0".

@param <ocalev>, object, Instância da classe TCalendarEvent com os dados que devem ser inseridos no calendário.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcalendarevent
/*/
method addcalendarevent(ocalev) class tmobile
return


/*/{Protheus.doc} tmobilecontact
A classe TMobileContact serve para lidar com as informações de contatos pessoas, seja para adicionar um contato ao dispositivo ou para buscar contatos no dispositivo.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmobilecontact

/*/
class tmobilecontact
data ccompany as character
data cjobtitle as character
data cname as character
data cnote as character
data aemails as array
data aphones as array
data apostals as array
method new()
end class
/*/{Protheus.doc} tmobilecontact:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMobileContact

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tmobilecontact
return


/*/{Protheus.doc} tmobilecontactemail
Classe para conter as informações sobre um endereço de e-mail de um contato qualquer.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmobilecontactemail

/*/
class tmobilecontactemail
data ntype as numeric
data caddress as character
method new()
method new2()
end class
/*/{Protheus.doc} tmobilecontactemail:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMobileContactEmail

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tmobilecontactemail
return
/*/{Protheus.doc} tmobilecontactemail:new2
Método construtor da classe que já popula as informações básicas.

@type method

@return object, Nova instância da classe TMobileContactEmail

@param <ntype>, numeric, Tipo do e-mail.
@param <caddress>, character, Endereço do e-mail.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new2
/*/
method new2(ntype, caddress) class tmobilecontactemail
return


/*/{Protheus.doc} tmobilecontactphone
Classe para conter as informações sobre um número de telefone de um contato qualquer.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmobilecontactphone

/*/
class tmobilecontactphone
data ntype as numeric
data cnumber as character
method new()
method new2()
end class
/*/{Protheus.doc} tmobilecontactphone:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMobileContactPhone

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tmobilecontactphone
return
/*/{Protheus.doc} tmobilecontactphone:new2
Método construtor da classe que já popula as informações básicas.

@type method

@return object, Nova instância da classe TMobileContactPhone

@param <ntype>, numeric, Tipo do telefone.
@param <cnumber>, character, Número do telefone.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new2
/*/
method new2(ntype, cnumber) class tmobilecontactphone
return


/*/{Protheus.doc} tmobilecontactpostal
Classe para conter as informações sobre o endereço de um contato qualquer.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmobilecontactpostal

/*/
class tmobilecontactpostal
data ntype as numeric
data caddress as character
method new()
method new2()
end class
/*/{Protheus.doc} tmobilecontactpostal:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMobileContactPostal

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class tmobilecontactpostal
return
/*/{Protheus.doc} tmobilecontactpostal:new2
Método construtor da classe que já popula as informações básicas.

@type method

@return object, Nova instância da classe TMobileContactPostal

@param <ntype>, numeric, Tipo do endereço.
@param <caddress>, character, Endereço.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new2
/*/
method new2(ntype, caddress) class tmobilecontactpostal
return


/*/{Protheus.doc} tmsgbar
Cria um objeto do tipo barra de status.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmsgbar

/*/
class tmsgbar from TControl
data aitem as array
data cmsgdef as character
method new()
method setmsg()
end class
/*/{Protheus.doc} tmsgbar:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMsgBar

@param [ownd], object, Indica a janela ou controle visual onde objeto será criado.
@param [cprompt], character, Indica a descrição que será apresentada na barra de status.
@param [uparam3], logical, Compatibilidade.
@param [uparam4], logical, Compatibilidade.
@param [uparam5], logical, Compatibilidade.
@param [uparam6], logical, Compatibilidade.
@param [nclrfore], numeric, Indica a cor da fonte que será utilizada na barra.
@param [uparam8], numeric, Compatibilidade.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada para exibir o conteúdo do controle visual.
@param [uparam10], logical, Compatibilidade.
@param [cimagename], character, Indica a imagem que será incluída na lateral esquerda.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, cprompt, uparam3, uparam4, uparam5, uparam6, nclrfore, uparam8, ofont, uparam10, cimagename) class tmsgbar
return
/*/{Protheus.doc} tmsgbar:setmsg
Altera a descrição da barra de status.

@type method

@param [ctext], character, Indica o texto que será incluído na barra de status.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmsg
/*/
method setmsg(ctext) class tmsgbar
return


/*/{Protheus.doc} tmsgitem
Cria um objeto do tipo subitem da barra de status.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmsgitem

/*/
class tmsgitem from TControl
data baction as codeblock
data nsize as numeric
data omsgbar as object
method new()
method settext()
end class
/*/{Protheus.doc} tmsgitem:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMsgItem

@param [omsgbar], object, Indica o objeto do tipo TMsgBar utilizado para criar um controle visual do tipo rodapé.
@param [cmsg], character, Indica o texto do item.
@param [nsize], numeric, Indica a largura do item.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [nclrtext], numeric, Indica a cor do texto do item.
@param [uparam6], numeric, Compatibilidade.
@param [ladd], logical, Indica se, verdadeiro \(.T.\), o item é incluído; caso contrário, falso \(.F.\).
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [cresource], character, Indica o nome do recurso que contém a imagem. Este recurso deve estar compilado,no repositório de imagens, para ser utilizado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(omsgbar, cmsg, nsize, ofont, nclrtext, uparam6, ladd, baction, cresource) class tmsgitem
return
/*/{Protheus.doc} tmsgitem:settext
Define o texto do item.

@type method

@param <ctexto>, character, Indica o texto para o item.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settext
/*/
method settext(ctexto) class tmsgitem
return


/*/{Protheus.doc} tmsprinterspool
Componente que mostra um preview de um relatório normalmente para impressão.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmsprinterspool

/*/
class tmsprinterspool from TControl
data lportrait as logical
data lcasesensitive as logical
data ctexthighlight as character
data nzoom as numeric
data bscrollclick as codeblock
method new()
method settextpage()
method setpageinfo()
end class
/*/{Protheus.doc} tmsprinterspool:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMSPrinterSpool

@param [nrow], numeric, Linha em que o componente visual deverá ser desenhado.
@param [ncol], numeric, Coluna em que o componente visual deverá ser desenhado.
@param [nwidth], numeric, Largura do componente visual.
@param [nheight], numeric, Altura do componente visual.
@param <ownd>, object, Componente visual pai.
@param <ctextpage>, character, Texto a ser apresentado no preview.
@param [lportrait], logical, Define se a orientação do documento será retrato \(.T.\) ou paisagem \(.F.\).
@param <crelsize>, character, Tamanho do documento \("P" para pequeno, "M" para médio, "G" para grande\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, ownd, ctextpage, lportrait, crelsize) class tmsprinterspool
return
/*/{Protheus.doc} tmsprinterspool:settextpage
Define o texto do relatório.

@type method

@param <ctextpage>, character, Texto do relatório.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settextpage
/*/
method settextpage(ctextpage) class tmsprinterspool
return
/*/{Protheus.doc} tmsprinterspool:setpageinfo
Define o tamanho do relatório e a orientação das páginas.

@type method

@param <crelsize>, character, Tamanho do relatório sendo "P" pequeno, "M" médio e "G" grande.
@param [lsetportrait], logical, Orientação das páginas sendo .T. retrato e .F. paisagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpageinfo
/*/
method setpageinfo(crelsize, lsetportrait) class tmsprinterspool
return


/*/{Protheus.doc} tmultibtn
Cria um objeto do tipo múltiplos botões.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmultibtn

/*/
class tmultibtn from TControl
data baction as codeblock
method new()
method addbutton()
method setfonts()
end class
/*/{Protheus.doc} tmultibtn:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMultiBtn

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ownd], object, Indica a janela ou controle visual onde o botão será criado.
@param [baction], codeblock, Indica o bloco de código que será executado quando clicar, com o botão esquerdo do mouse, sobre o botão.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cimgname], character, Indica o nome da imagem que será inserida ao lado esquerdo do componente.
@param [nori], numeric, Indica a coordenada \(vertical/horizontal\) do botão na janela.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), ao posicionar o ponteiro do mouse sobre o botão.
@param [nbtnperline], numeric, Indica a quantidade de botões por linha.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, baction, nwidth, nheight, cimgname, nori, cmsg, nbtnperline) class tmultibtn
return
/*/{Protheus.doc} tmultibtn:addbutton
Adiciona um botão.

@type method

@param [onovobotao], object, Indica o botão que será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addbutton
/*/
method addbutton(onovobotao) class tmultibtn
return
/*/{Protheus.doc} tmultibtn:setfonts
Adiciona um botão.

@type method

@param [cfontetitulo], character, Indica o nome da fonte que será utilizada no título.
@param [nsizetitulo], numeric, Indica o tamanho da fonte no título.
@param [cfontebotoes], character, Indica o nome da fonte que será utilizada nos botões.
@param [nsizebotoes], numeric, Indica o tamanho da fonte no botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfonts
/*/
method setfonts(cfontetitulo, nsizetitulo, cfontebotoes, nsizebotoes) class tmultibtn
return


/*/{Protheus.doc} tmultiget
Cria um objeto do tipo campo memo.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tmultiget

/*/
class tmultiget from TControl
data npos as numeric
data lobfuscate as logical
method new()
method create()
method enablevscroll()
method appendtext()
method goend()
method gotop()
method goto()
end class
/*/{Protheus.doc} tmultiget:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TMultiGet

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for sequencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam8], logical, Compatibility parameter. Pass NIL.
@param [uparam9], numeric, Compatibility parameter. Pass NIL.
@param [uparam10], numeric, Compatibility parameter. Pass NIL.
@param [uparam11], object, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam13], character, Compatibility parameter. Pass NIL.
@param [uparam14], logical, Compatibility parameter. Pass NIL.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\) se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [uparam16], logical, Compatibility parameter. Pass NIL.
@param [uparam17], logical, Compatibility parameter. Pass NIL.
@param [lreadonly], logical, Indica se o conteúdo da variável associada ao objeto permanecerá apenas para leitura
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam20], codeblock, Compatibility parameter. Pass NIL.
@param [uparam21], logical, Compatibility parameter. Pass NIL.
@param [lnoborder], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a apresentação da borda no objeto.
@param [lvscroll], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a barra de rolagem vertical. Obs.: O valor default é Desabilitado.
@param [clabeltext], character, Indica o texto que será apresentado na Label.
@param [nlabelpos], numeric, Indica a posição da label, sendo 1=Topo e 2=Esquerda
@param [olabelfont], object, Indica o objeto, do tipo TFont, que será utilizado para definir as características da fonte aplicada na exibição da label.
@param [nlabelcolor], numeric, Indica a cor do texto da Label.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, bsetget, ownd, nwidth, nheight, ofont, uparam8, uparam9, uparam10, uparam11, lpixel, uparam13, uparam14, bwhen, uparam16, uparam17, lreadonly, bvalid, uparam20, uparam21, lnoborder, lvscroll, clabeltext, nlabelpos, olabelfont, nlabelcolor) class tmultiget
return
/*/{Protheus.doc} tmultiget:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TMultiGet

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for sequencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam8], logical, Compatibility parameter. Pass NIL.
@param [uparam9], numeric, Compatibility parameter. Pass NIL.
@param [uparam10], numeric, Compatibility parameter. Pass NIL.
@param [uparam11], character, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam13], character, Compatibility parameter. Pass NIL.
@param [uparam14], logical, Compatibility parameter. Pass NIL.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\) se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [uparam16], logical, Compatibility parameter. Pass NIL.
@param [uparam17], logical, Compatibility parameter. Pass NIL.
@param [lreadonly], logical, Indica se o conteúdo da variável associada ao objeto permanecerá apenas para leitura.
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [uparam20], codeblock, Compatibility parameter. Pass NIL.
@param [uparam21], logical, Compatibility parameter. Pass NIL.
@param [lnoborder], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a apresentação da borda no objeto.
@param [lvscroll], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a barra de rolagem vertical. O valor default é Desabilitado.
@param [clabeltext], character, indica o texto que será apresentado na Label.
@param [nlabelpos], numeric, Indica a posição da label, sendo 1=Topo e 2=Esquerda
@param [olabelfont], object, Indica o objeto, do tipo TFont, que será utilizado para definir as características da fonte aplicada na exibição da label.
@param [nlabelcolor], numeric, Indica a cor do texto da Label.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, bsetget, nrow, ncol, nwidth, nheight, ofont, uparam8, uparam9, uparam10, uparam11, lpixel, uparam13, uparam14, bwhen, uparam16, uparam17, lreadonly, bvalid, uparam20, uparam21, lnoborder, lvscroll, clabeltext, nlabelpos, olabelfont, nlabelcolor) class tmultiget
return
/*/{Protheus.doc} tmultiget:enablevscroll
Habilita/desabilita a barra de rolagem vertical.

@type method

@param [lenable], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a barra de rolagem vertical.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/enablevscroll
/*/
method enablevscroll(lenable) class tmultiget
return
/*/{Protheus.doc} tmultiget:appendtext
Adiciona um texto no fim do texto já existente.

@type method

@param [ctext], character, Indica o texto que será incluído
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/appendtext
/*/
method appendtext(ctext) class tmultiget
return
/*/{Protheus.doc} tmultiget:goend
Posiciona o cursor no fim do texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goend
/*/
method goend() class tmultiget
return
/*/{Protheus.doc} tmultiget:gotop
Posiciona o cursor no início do texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gotop
/*/
method gotop() class tmultiget
return
/*/{Protheus.doc} tmultiget:goto
Posiciona o cursor no início da linha especificada.

@type method

@param <nline>, numeric, Indica a linha em que o cursor será posicionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goto
/*/
method goto(nline) class tmultiget
return


/*/{Protheus.doc} tolecontainer
Cria um objeto do tipo botão vinculado a um objeto OLE \(Object Linking and Embedding\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tolecontainer

/*/
class tolecontainer from TControl
method new()
method openfromfile()
method doverbdefault()
end class
/*/{Protheus.doc} tolecontainer:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TOleContainer

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [lautoactivate], logical, Compatibilidade.
@param [cfilename], character, Indica o diretório e arquivo OLE que será aberto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, ownd, lautoactivate, cfilename) class tolecontainer
return
/*/{Protheus.doc} tolecontainer:openfromfile
Abre arquivo do tipo OLE \(Object Linking and Embedding\).

@type method

@return logical, Retorna verdadeiro \(.T.\) se o processo ocorrer com sucesso; caso contrário, retornará falso \(.F.\).

@param [cfilename], character, Indica o caminho para o arquivo OLE que será aberto.
@param [lasicon], logical, Indica se o objeto OLE será ícone.
@param [lallowinplace], logical, Indica se a abertura do arquivo será local ou não \(dependendo do arquivo OLE poderá exibir as barras de ferramentas do aplicativo editor\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/openfromfile
/*/
method openfromfile(cfilename, lasicon, lallowinplace) class tolecontainer
return
/*/{Protheus.doc} tolecontainer:doverbdefault
Chama o método padrão do objeto OLE \(Object Linking and Embedding\) utilizado.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/doverbdefault
/*/
method doverbdefault() class tolecontainer
return


/*/{Protheus.doc} tpaintpanel
Cria um objeto do tipo painel que permite adicionar subpainéis e shapes.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tpaintpanel

/*/
class tpaintpanel from TControl
data blclicked as codeblock
data bldblclick as codeblock
data brclicked as codeblock
data frameatu as numeric
data shapeatu as numeric
data leftold as numeric
data leftatu as numeric
data topold as numeric
data topatu as numeric
method new()
method addshape()
method clearall()
method addcommand()
method insertblinker()
method deleteblinker()
method setblinker()
method deleteitem()
method setcandeform()
method setcanmove()
method setgradient()
method setimagesize()
method setposition()
method setreleasebutton()
method setscale()
method settooltip()
method settransparent()
method savetopng()
method setvisible()
method setpopup()
end class
/*/{Protheus.doc} tpaintpanel:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TPaintPanel

@param [nrow], numeric, Indica a coordenada vertical em pixels.
@param [ncol], numeric, Indica a coordenada horizontal em pixels.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [lcentered], logical, Indica se, verdadeiro \(.T.\), apresenta o texto de título no centro do objeto; caso contrário, falso \(.F.\).
@param [lright], logical, Indica se, verdadeiro \(.T.\), posiciona o objeto à direita.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, nwidth, nheight, lcentered, lright) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:addshape
Adiciona um container ou um shape ao painel.

@type method

@param <ctextparser>, character, Indica o texto que contém o construtor. Para mais informações, consulte a área Observações..
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addshape
/*/
method addshape(ctextparser) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:clearall
Limpa todos os shapes do painel.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clearall
/*/
method clearall() class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:addcommand
Executa um comando referente ao comportamento do TPaintPanel.

@type method

@param <ccommand>, numeric, Indica o comando que deverá ser executado. Para mais informações, consulte a área Observações.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addcommand
/*/
method addcommand(ccommand) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:insertblinker
Inclui um shape na lista que define os objetos que devem piscar quando o método SetBlinker\(\) for configurado.

@type method

@param <nid>, numeric, Indica o ID \(número de identificação\) do shape que será excluído.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/insertblinker
/*/
method insertblinker(nid) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:deleteblinker
Exclui um shape da lista que define os objetos que devem piscar quando o método SetBlinker\(\) for configurado.

@type method

@param <nid>, numeric, Indica o ID \(número de identificação\) do shape.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deleteblinker
/*/
method deleteblinker(nid) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setblinker
Define o tempo, em milisegundos, que os shapes da lista deverão piscar.

@type method

@param <ntimer>, numeric, Indica o tempo, em milisegundos, que o shape deverá piscar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setblinker
/*/
method setblinker(ntimer) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:deleteitem
Exclui um shape da lista.

@type method

@param <nid>, numeric, Indica o ID \(número de identificação\) do shape que será excluído.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deleteitem
/*/
method deleteitem(nid) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setcandeform
Define se o shape pode ou não ser movido dentro do seu próprio container.

@type method

@param <cid>, numeric, Indica o ID \(número de identificação\) do shape que será movido.
@param <lcandeform>, logical, Indica se, verdadeiro \(.T.\), o shape pode ser movido dentro do seu próprio container; caso contrário, falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcandeform
/*/
method setcandeform(cid, lcandeform) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setcanmove
Define se o shape pode ou não ser movido.

@type method

@param <cid>, numeric, Indica o ID \(número de identificação\) do shape que será movido.
@param <lcandeform>, logical, Indica se, verdadeiro \(.T.\), o shape pode ser movido; caso contrário, falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcanmove
/*/
method setcanmove(cid, lcandeform) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setgradient
Define o gradient do shape.

@type method

@param <nid>, numeric, Indica o ID \(número de identificação\) do shape.
@param <lhover>, logical, Indica se, verdadeiro \(.T.\), o gradient será aplicado quando o shape estiver com o ponteiro do mouse posicionado; caso contrário, falso \(.F.\).
@param <cgradient>, character, Indica o texto do gradient.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setgradient
/*/
method setgradient(nid, lhover, cgradient) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setimagesize
Altera as dimensões de uma shape do tipo 8 \(imagem\).

@type method

@param <cid>, character, Indica o ID \(número de identificação\) do shape que será movido.
@param <nwidth>, numeric, Largura para redimensionamento do shape.
@param <nheight>, numeric, Altura para redimensionamento do shape.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setimagesize
/*/
method setimagesize(cid, nwidth, nheight) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setposition
Define a posição do container ou do shape.

@type method

@param <nid>, numeric, Indica o ID do objeto que será movido.
@param <nleft>, numeric, Indica a nova posição à esquerda do objeto.
@param <ntop>, numeric, Indica a altura em pixels do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setposition
/*/
method setposition(nid, nleft, ntop) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setreleasebutton
SetReleaseButtonDefine se o bloco de código blClicked do Shape, será disparado no release do botão do mouse, mesmo estando este dentro no mesmo Container de origem do click do mouse.

@type method

@param <isreleasebutton>, logical, Se Verdadeiro, define que o bloco de código blClicked do Shape, será disparado no release do botão do mouse, mesmo estando este dentro no mesmo Container de origem do click do mouse.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setreleasebutton
/*/
method setreleasebutton(isreleasebutton) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setscale
Define a escala\(zoom\) de para visualização do painel principal.

@type method

@param <nscale>, numeric, Escala para visualização sendo que 1 define visualização de 100%.É possível utilizar valores fracionados, como 0.4 ou 3.7, por exemplo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setscale
/*/
method setscale(nscale) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:settooltip
Define a dica de contexto \(tooltip/hint\) do shape.

@type method

@param <nid>, numeric, Indica o ID \(número de identificação\) do shape.
@param <ctext>, character, Indica a nova mensagem, do tipo dica de contexto \(tooltip/hint\), do shape
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settooltip
/*/
method settooltip(nid, ctext) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:settransparent
Define, para o método SaveToPNG, se o fundo da imagem será salvo transparente.

@type method

@param <istransparent>, logical, Se verdadeiro, define que o fundo da imagem será salvo transparente, através do método SaveToPNG.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settransparent
/*/
method settransparent(istransparent) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:savetopng
Salva o conteúdo do painel como imagem no formato PNG \(Portable Network Graphics\).

@type method

@param <nleft>, numeric, Indica a posição à esquerda onde a imagem será salva.
@param <ntop>, numeric, Indica a posição ao topo onde a imagem será salva.
@param <nwidth>, numeric, Indica a comprimento, a partir da esquerda, que a imagem será salva.
@param <nheight>, numeric, Indica a altura, a partir do topo, que a imagem será salva.
@param <cfiletarget>, character, Indica o nome do arquivo que será salvo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/savetopng
/*/
method savetopng(nleft, ntop, nwidth, nheight, cfiletarget) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setvisible
Define se o objeto \(container ou shape\) será visível.

@type method

@param [nid], numeric, Indica o ID do objeto que será visível/invisível.
@param [lisvisible], logical, Indica se o objeto é visível \(.T.\) ou invisível \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvisible
/*/
method setvisible(nid, lisvisible) class tpaintpanel
return
/*/{Protheus.doc} tpaintpanel:setpopup
Define um menu do tipo popup.

@type method

@param <omenu>, object, Objeto do tipo TMenu.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpopup
/*/
method setpopup(omenu) class tpaintpanel
return


/*/{Protheus.doc} tpanel
Cria um objeto do tipo painel estático. Além disso, permite criar outros controles visuais com objetivo de organizar ou agrupar outros componentes visuais.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tpanel

/*/
class tpanel from TControl
method create()
method new()
end class
/*/{Protheus.doc} tpanel:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TPanel

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ctext], character, Indica o texto que será apresentado ao fundo do objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [lcentered], logical, Indica se, verdadeiro \(.T.\), apresenta o texto do título no centro do objeto; caso contrário, falso \(.F.\).
@param [uparam7], logical, Compatibilidade.
@param [nclrtext], numeric, Indica a cor do texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [nwidth], numeric, Indica a largura em pontos do objeto.
@param [nheight], numeric, Indica a altura em pontos do objeto.
@param [llowered], logical, Indica se, verdadeiro \(.T.\), apresenta o painel rebaixado em relação ao objeto de fundo; caso contrário, falso \(.F.\).
@param [lraised], logical, Indica se, verdadeiro \(.T.\), apresenta a borda do objeto rebaixada em relação ao objeto de fundo; caso contrário, falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, nrow, ncol, ctext, ofont, lcentered, uparam7, nclrtext, nclrback, nwidth, nheight, llowered, lraised) class tpanel
return
/*/{Protheus.doc} tpanel:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TPanel

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ctext], character, Indica o texto que será apresentado ao fundo do objeto.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [lcentered], logical, Indica se, verdadeiro \(.T.\), apresenta o texto do título no centro do objeto; caso contrário, falso \(.F.\).
@param [uparam7], logical, Compatibilidade.
@param [nclrtext], numeric, Indica a cor do texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [nwidth], numeric, Indica a largura em pontos do objeto.
@param [nheight], numeric, Indica a altura em pontos do objeto.
@param [llowered], logical, Indica se, verdadeiro \(.T.\), apresenta o painel rebaixado em relação ao objeto de fundo; caso contrário, falso \(.F.\).
@param [lraised], logical, Indica se, verdadeiro \(.T.\), apresenta a borda do objeto rebaixada em relação ao objeto de fundo; caso contrário, falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ctext, ownd, ofont, lcentered, uparam7, nclrtext, nclrback, nwidth, nheight, llowered, lraised) class tpanel
return


/*/{Protheus.doc} tpanelcss
Cria um objeto do tipo painel que permite receber CSS \(Cascading Style Sheet\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tpanelcss

/*/
class tpanelcss from TControl
method new()
end class
/*/{Protheus.doc} tpanelcss:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TPanelCss

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [uparam3], character, Compatibility parameter. Pass NIL.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [uparam5], object, Compatibility parameter. Pass NIL.
@param [uparam6], logical, Compatibility parameter. Pass NIL.
@param [uparam7], logical, Compatibility parameter. Pass NIL.
@param [uparam8], numeric, Compatibility parameter. Pass NIL.
@param [uparam9], numeric, Compatibility parameter. Pass NIL.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [uparam12], numeric, Compatibility parameter. Pass NIL.
@param [uparam13], numeric, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, uparam3, ownd, uparam5, uparam6, uparam7, uparam8, uparam9, nwidth, nheight, uparam12, uparam13) class tpanelcss
return


/*/{Protheus.doc} tradmenu
Cria um objeto do tipo Radio Button \(elemento de seleção de única escolha\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tradmenu

/*/
class tradmenu from TControl
data aitems as array
data bchange as codeblock
data bsetget as codeblock
data bvalid as codeblock
data bwhen as codeblock
data lhoriz as logical
method new()
method create()
method disable()
method enable()
method enableitem()
method setoptions()
end class
/*/{Protheus.doc} tradmenu:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TRadMenu

@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [aitems], array, Indica o array que contêm os itens no formato texto.
@param [bsetget], codeblock, Indica o bloco de código que será executado na mudança do item selecionado. O bloco de código é responsável pela mudança do valor, da variável numérica, que indica o item selecionado.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [uparam6], variant, Compatibilidade.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [nclrtext], numeric, Indica a cor do texto da janela.
@param [nclrpane], numeric, Indica a cor de fundo da janela.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [uparam11], logical, Compatibilidade.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [bvalid], codeblock, Compatibilidade.
@param [uparam16], logical, Compatibilidade.
@param [uparam17], logical, Compatibilidade.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [lhoriz], logical, Indica se o menu deverá ser montado na horizontal \(.T.\) ao invés do padrão na vertical \(.F.\). \(disponível em builds superiores a 7.00.121227P\)
@param [lautoheight], logical, Se verdadeiro \(.T.\) indica que a altura do objeto será aplicada automaticamente \(valor padrão\). Caso contrário \(.F.\) a altura respeitará o valor indicado no parâmetro nHeight do construtor. Disponível somente a partir da build 7.00.170117A - 17.2.1.2.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, aitems, bsetget, ownd, uparam6, bchange, nclrtext, nclrpane, cmsg, uparam11, bwhen, nwidth, nheight, bvalid, uparam16, uparam17, lpixel, lhoriz, lautoheight) class tradmenu
return
/*/{Protheus.doc} tradmenu:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TRadMenu

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bsetget], codeblock, Indica o bloco de código que será executado na mudança do item selecionado. O bloco de código é responsável pela mudança do valor, da variável numérica, que indica o item selecionado.
@param [nrow], numeric, Indica a coordenada vertical.
@param [ncol], numeric, Indica a coordenada horizontal.
@param [aitems], array, Indica o array que contêm os itens no formato texto.
@param [uparam6], variant, Compatibilidade.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [nclrtext], numeric, Indica a cor do texto da janela.
@param [nclrpane], numeric, Indica a cor de fundo da janela.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), ao posicionar o ponteiro do mouse sobre o botão.
@param [uparam11], logical, Compatibilidade.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\), se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [uparam15], codeblock, Compatibilidade.
@param [uparam16], logical, Compatibilidade.
@param [uparam17], logical, Compatibilidade.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [lhoriz], logical, Indica se o menu deverá ser montado na horizontal \(.T.\) ao invés do padrão na vertical \(.F.\). \(disponível em builds superiores a 7.00.121227P\)
@param [lautoheight], logical, Se verdadeiro \(.T.\) indica que a altura do objeto será aplicada automaticamente \(valor padrão\). Caso contrário \(.F.\) a altura respeitará o valor indicado no parâmetro nHeight do construtor. Disponível somente a partir da build 7.00.170117A - 17.2.1.2.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, bsetget, nrow, ncol, aitems, uparam6, bchange, nclrtext, nclrpane, cmsg, uparam11, bwhen, nwidth, nheight, uparam15, uparam16, uparam17, lpixel, lhoriz, lautoheight) class tradmenu
return
/*/{Protheus.doc} tradmenu:disable
Desabilita um item.

@type method

@param [nitem], numeric, Indica o item que será desabilitado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/disable
/*/
method disable(nitem) class tradmenu
return
/*/{Protheus.doc} tradmenu:enable
Habilita um item.

@type method

@param [nitem], numeric, Indica o item que será habilitado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/enable
/*/
method enable(nitem) class tradmenu
return
/*/{Protheus.doc} tradmenu:enableitem
Habilita/Desabilita um item.

@type method

@param [nitem], numeric, Indica o item que terá seu status alterado.
@param [lstatus], logical, Indica o status \(.T. - Habilita ou .F. - Desabilita\) que será atribuído ao item.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/enableitem
/*/
method enableitem(nitem, lstatus) class tradmenu
return
/*/{Protheus.doc} tradmenu:setoptions
Seleciona um item.

@type method

@param [nitem], numeric, Indica o item que será selecionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setoptions
/*/
method setoptions(nitem) class tradmenu
return


/*/{Protheus.doc} tsay
Cria um objeto do tipo label. Desta forma, o objeto apresentará o conteúdo do texto estático sobre uma janela ou controle visual.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tsay

/*/
class tsay from TControl
data ltransparent as logical
data lwordwrap as logical
method new()
method create()
method ctrlrefresh()
method settext()
method settextalign()
method setpopup()
end class
/*/{Protheus.doc} tsay:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TSay

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [btext], codeblock, Indica o bloco de código que será executado para retornar e apresentar uma string.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [cpicture], character, Indica a máscara de formatação, do conteúdo, que será apresentada. Verificar [Tabela de Pictures de Formatação](Tabela de Pictures de Formatação).
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam7], logical, Compatibilidade.
@param [uparam8], logical, Compatibilidade.
@param [uparam9], logical, Compatibilidade.
@param [lpixels], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [nclrtext], numeric, Indica a cor do texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [uparam15], logical, Compatibilidade.
@param [uparam16], logical, Compatibilidade.
@param [uparam17], logical, Compatibilidade.
@param [uparam18], logical, Compatibilidade.
@param [uparam19], logical, Compatibilidade.
@param [lhtml], logical, Indica se, verdadeiro \(.T.\), habilita a visualização do texto no formato HTML; caso contrário, falso \(.F.\).
@param [ntxtalghor], numeric, Alinhamento horizontal do texto \(Consulte tabela na página do método SetTextAlign\). Disponível a partir da versão 17.3.0.0.
@param [ntxtalgver], numeric, Alinhamento vertical do texto \(Consulte tabela na página do método SetTextAlign\). Disponível a partir da versão 17.3.0.0.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, btext, ownd, cpicture, ofont, uparam7, uparam8, uparam9, lpixels, nclrtext, nclrback, nwidth, nheight, uparam15, uparam16, uparam17, uparam18, uparam19, lhtml, ntxtalghor, ntxtalgver) class tsay
return
/*/{Protheus.doc} tsay:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TSay

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [btext], codeblock, Indica o bloco de código que será executado para retornar e apresentar uma string.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [cpicture], character, Indica a máscara de formatação, do conteúdo, que será apresentada. Verificar [Tabela de Pictures de Formatação](Tabela de Pictures de Formatação).
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [uparam7], logical, Compatibilidade.
@param [uparam8], logical, Compatibilidade.
@param [uparam9], logical, Compatibilidade.
@param [lpixels], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [nclrtext], numeric, Indica a cor do texto do objeto.
@param [nclrback], numeric, Indica a cor de fundo do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [uparam15], logical, Compatibilidade.
@param [uparam16], logical, Compatibilidade.
@param [uparam17], logical, Compatibilidade.
@param [uparam18], logical, Compatibilidade.
@param [uparam19], logical, Compatibilidade.
@param [uparam20], logical, Compatibilidade.
@param [ntxtalghor], numeric, Alinhamento horizontal do texto \(Consulte tabela na página do método SetTextAlign\). Disponível a partir da versão 17.3.0.0.
@param [ntxtalgver], numeric, Alinhamento vertical do texto \(Consulte tabela na página do método SetTextAlign\). Disponível a partir da versão 17.3.0.0.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, btext, nrow, ncol, cpicture, ofont, uparam7, uparam8, uparam9, lpixels, nclrtext, nclrback, nwidth, nheight, uparam15, uparam16, uparam17, uparam18, uparam19, uparam20, ntxtalghor, ntxtalgver) class tsay
return
/*/{Protheus.doc} tsay:ctrlrefresh
Força a atualização do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctrlrefresh
/*/
method ctrlrefresh() class tsay
return
/*/{Protheus.doc} tsay:settext
Altera o texto que será apresentado pelo objeto.

@type method

@param [xval], character, Indica o texto que será apresentado. Observação: O tipo de dado desse parâmetro pode ser: Caracter, Numérico e Data.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settext
/*/
method settext(xval) class tsay
return
/*/{Protheus.doc} tsay:settextalign
Define o alinhamento horizontal e vertical do texto dentro do alcance do campo.

@type method

@param <nhoriz>, numeric, Tipo de alinhamento horizontal.
@param <nvert>, numeric, Tipo de alinhamento vertical.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settextalign
/*/
method settextalign(nhoriz, nvert) class tsay
return
/*/{Protheus.doc} tsay:setpopup
Define um menu do tipo popup.

@type method

@param <omenu>, object, Objeto do tipo TMenu.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setpopup
/*/
method setpopup(omenu) class tsay
return


/*/{Protheus.doc} tscrollarea
Cria um objeto do tipo painel com barra de rolagem \(Scroll\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tscrollarea

/*/
class tscrollarea from TControl
data ltracking as logical
method new()
method setframe()
end class
/*/{Protheus.doc} tscrollarea:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TScrollArea

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ntop], numeric, Indica a coordenada vertical em pixels.
@param [nleft], numeric, Indica a coordenada horizontal em pixels.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, ntop, nleft, nheight, nwidth) class tscrollarea
return
/*/{Protheus.doc} tscrollarea:setframe
Define o objeto que será apresentado na área.

@type method

@param [o], object, Indica o objeto que será apresentado na área.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setframe
/*/
method setframe(o) class tscrollarea
return


/*/{Protheus.doc} tscrollbox
Cria um objeto do tipo painel com barra de rolagem \(Scroll\).

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tscrollbox

/*/
class tscrollbox from TControl
method new()
method create()
method reset()
end class
/*/{Protheus.doc} tscrollbox:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TScrollBox

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ntop], numeric, Indica a coordenada vertical em pixels.
@param [nleft], numeric, Indica a coordenada horizontal em pixels.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [lvertical], logical, Indica se verdadeiro \(.T.\) a barra de rolagem vertical será apresentada, caso contrário falso \(.F.\).
@param [lhorizontal], logical, Indica se verdadeiro \(.T.\) a barra de rolagem horizontal será apresentada, caso contrário falso \(.F.\).
@param [lborder], logical, Indica se verdadeiro \(.T.\) a borda do objeto será apresentada, caso contrário falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, ntop, nleft, nheight, nwidth, lvertical, lhorizontal, lborder) class tscrollbox
return
/*/{Protheus.doc} tscrollbox:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TScrollBox

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [ntop], numeric, Indica a coordenada vertical em pixels.
@param [nleft], numeric, Indica a coordenada horizontal em pixels.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [lvertical], logical, Indica se verdadeiro \(.T.\) a barra de rolagem vertical será apresentada, caso contrário falso \(.F.\).
@param [lhorizontal], logical, Indica se verdadeiro \(.T.\) a barra de rolagem horizontal será apresentada, caso contrário falso \(.F.\).
@param [lborder], logical, Indica se verdadeiro \(.T.\) a borda do objeto será apresentada, caso contrário falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd, ntop, nleft, nheight, nwidth, lvertical, lhorizontal, lborder) class tscrollbox
return
/*/{Protheus.doc} tscrollbox:reset
Retorna a barra de rolagem para a posição inicial à esquerda e ao topo.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reset
/*/
method reset() class tscrollbox
return


/*/{Protheus.doc} tsimpleeditor
Cria um objeto do tipo editor de texto simples.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tsimpleeditor

/*/
class tsimpleeditor from TControl
data bchanged as codeblock
data bgetkey as codeblock
data lobfuscate as logical
method create()
method new()
method load()
method rettext()
method rettextsel()
method textalign()
method textbold()
method textfamily()
method textcolor()
method textformat()
method textitalic()
method textsize()
method textstatus()
method textstyle()
method gotop()
method goend()
method goto()
method textunderline()
method savetopdf()
method setmaxtextlength()
method setwordwrap()
end class
/*/{Protheus.doc} tsimpleeditor:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TSimpleEditor

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TSimpleEditor

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ctext], character, Indica o texto que será apresentado na inicialização do objeto.
@param [lreadonly], logical, Indica se, verdadeiro \(.T.\), o texto não pode ser editado; caso contrário, falso \(.F.\).
@param [bsetget], codeblock, Indica o bloco de código, no formato \{\|u\| if\( Pcount\( \)>0, := u, \) \}, que será executado para atualizar a variável \(essa variável deve ser do tipo caracter\). Desta forma, se a lista for sequencial, o controle atualizará com o conteúdo do item selecionado, se for indexada, será atualizada com o valor do índice do item selecionado.
@param [ofont], object, Indica o objeto do tipo [TFont](TFont) que será utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada. Observação: O bloco de código retornará verdadeiro \(.T.\) se o controle permanecer habilitado; caso contrário, retornará falso \(.F.\).
@param [bvalid], codeblock, Indica o bloco de código de validação que será executado quando o conteúdo do objeto for modificado. Retorna verdadeiro \(.T.\), se o conteúdo é válido; caso contrário, falso \(.F.\).
@param [clabeltext], character, indica o texto que será apresentado na Label.
@param [nlabelpos], numeric, Indica a posição da label, sendo 1=Topo e 2=Esquerda
@param [olabelfont], object, Indica o objeto, do tipo [TFont](TFont), que será utilizado para definir as características da fonte aplicada na exibição da label.
@param [nlabelcolor], numeric, Indica a cor do texto da Label.
@param [bchanged], codeblock, Indica o bloco de código que será disparado no método Load e no Recortar \(CTRL+X\) e Colar \(CTRL+V\). Parâmetro disponível em builds superiores à 131227A.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, nwidth, nheight, ctext, lreadonly, bsetget, ofont, lpixel, bwhen, bvalid, clabeltext, nlabelpos, olabelfont, nlabelcolor, bchanged) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:load
Carrega um texto para o editor.

@type method

@param [ctexto], character, Indica o texto que inicializará o editor.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/load
/*/
method load(ctexto) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:rettext
Retorna uma string com o conteúdo do editor.

@type method

@return character, String contendo o conteúdo do editor.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rettext
/*/
method rettext() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:rettextsel
Retorna uma string com o conteúdo selecionado do editor.

@type method

@return character, Retorna uma string com o conteúdo selecionado do editor.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/rettextsel
/*/
method rettextsel() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textalign
Define o tipo de alinhamento do texto.

@type method

@param [nalign], numeric, Indica o tipo de alinhamento do texto, sendo: 1-À esquerda, 2-À direita, 3-Centralizado e 4-Justificado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textalign
/*/
method textalign(nalign) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textbold
Aplica o estilo negrito no texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textbold
/*/
method textbold() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textfamily
Aplica um tipo de fonte no texto.

@type method

@param [cfamily], character, Indica o nome da fonte que será utilizada na seção do texto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textfamily
/*/
method textfamily(cfamily) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textcolor
Aplica uma cor no texto.

@type method

@param <ncolor>, numeric, Indica a cor do texto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textcolor
/*/
method textcolor(ncolor) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textformat
Define o formato do texto.

@type method

@param [nformat], numeric, Indica o formato do texto, sendo: 1 = Html e 2 = Plain Text.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textformat
/*/
method textformat(nformat) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textitalic
Aplica o estilo itálico no texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textitalic
/*/
method textitalic() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textsize
Aplica o tamanho da fonte no texto.

@type method

@param [nsize], numeric, Indica o tamanho da fonte que será utilizada na seção do texto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textsize
/*/
method textsize(nsize) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textstatus
Retorna um array com as propriedades do texto posicionado.

@type method

@return array, Retorna um array com as propriedades do texto. Consulte tabela da área de observações.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textstatus
/*/
method textstatus() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textstyle
Define o estilo do parágrafo.

@type method

@param [nstyle], numeric, Indica o estilo do parágrafo que será utilizado na seção do texto. Consulte tabela na área de observações para conhecer os valores possíveis.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textstyle
/*/
method textstyle(nstyle) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:gotop
Posiciona o cursor no início do texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gotop
/*/
method gotop() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:goend
Posiciona o cursor no fim do texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goend
/*/
method goend() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:goto
Posiciona o cursor no início da linha especificada.

@type method

@param <nline>, numeric, Indica a linha em que o cursor será posicionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goto
/*/
method goto(nline) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:textunderline
Aplica o estilo sublinhado no texto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/textunderline
/*/
method textunderline() class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:savetopdf
Salva o conteúdo do editor em um arquivo PDF.

@type method

@param <cpdffile>, character, Indica o caminho e nome do arquivo PDF para salvamento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/savetopdf
/*/
method savetopdf(cpdffile) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:setmaxtextlength
Limita a quantidade de caracteres aceitos no componente.

@type method

@param <nlimit>, numeric, Indica a quantidade de caracteres aceitos no componente. Se for informado o valor -1, o limite será desativado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmaxtextlength
/*/
method setmaxtextlength(nlimit) class tsimpleeditor
return
/*/{Protheus.doc} tsimpleeditor:setwordwrap
Desativa ou ativa a quebra automática de linha no editor.

@type method

@param <lenable>, logical, Indica se desativa \(.F.\) ou ativa \(.T.\) a quebra automática de linha.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setwordwrap
/*/
method setwordwrap(lenable) class tsimpleeditor
return


/*/{Protheus.doc} tslider
Cria um objeto do tipo botão deslizante.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tslider

/*/
class tslider from TControl
data bchange as codeblock
method create()
method new()
method setrange()
method setmarks()
method setinterval()
method setvalue()
method setstep()
method setorient()
end class
/*/{Protheus.doc} tslider:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TSlider

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd) class tslider
return
/*/{Protheus.doc} tslider:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TSlider

@param [nrow], numeric, Indica a coordenada vertical em pixels.
@param [ncol], numeric, Indica a coordenada horizontal em pixels.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), ao posicionar o ponteiro do mouse sobre o botão.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, bchange, nwidth, nheight, cmsg, bwhen) class tslider
return
/*/{Protheus.doc} tslider:setrange
Especifica os valores \(de/até\) da faixa do botão.

@type method

@param [nmin], numeric, Indica o valor mínimo do botão.
@param [nmax], numeric, Indica o valor máximo do botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setrange
/*/
method setrange(nmin, nmax) class tslider
return
/*/{Protheus.doc} tslider:setmarks
Especifica o tipo de marcação do botão.

@type method

@param [nmark], numeric, Indica o tipo de marcação do botão, sendo: 0=Botão com identificação Padrão/Default, 1=Botão com indicação para cima, 2=Botão com indicação para baixo e 3=Botão com indicação para cima/baixo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmarks
/*/
method setmarks(nmark) class tslider
return
/*/{Protheus.doc} tslider:setinterval
Especifica a distância entre os marcadores.

@type method

@param [ninterval], numeric, Indica o valor de intervalo entre os marcadores.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setinterval
/*/
method setinterval(ninterval) class tslider
return
/*/{Protheus.doc} tslider:setvalue
Especifica um valor para o botão.

@type method

@param [nval], numeric, Indica o valor do botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalue
/*/
method setvalue(nval) class tslider
return
/*/{Protheus.doc} tslider:setstep
Especifica o valor de etapa do botão.

@type method

@param [nstep], numeric, Indica o valor de etapa do botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setstep
/*/
method setstep(nstep) class tslider
return
/*/{Protheus.doc} tslider:setorient
Especifica a coordenada \(horizontal/vertical\) do botão.

@type method

@param [norient], numeric, Indica a coordenada \(horizontal/vertical\) do botão, sendo: 0=Horizontal e 1=Vertical.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setorient
/*/
method setorient(norient) class tslider
return


/*/{Protheus.doc} tsocketclient
Estabelece uma conexão client de socket do tipo TCP genérica.Através desta classe, é possível enviar e receber dados por meio de um socket genérico e utilizar como base para implementação de protocolo não suportado pela aplicação.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tsocketclient

/*/
class tsocketclient
method new()
method connect()
method geterror()
method isconnected()
method send()
method receive()
method reset()
method closeconnection()
end class
/*/{Protheus.doc} tsocketclient:new
Cria o objeto TSocketClient sem conexão ativa.

@type method

@return object, Nova instância da classe TSocketClient

@param [lclient], logical, Indica se o client de socket será criado do lado do Client \(.T.\) ou do lado do AppServer \(.F.\). O padrão é \(.F.\) AppServer.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(lclient) class tsocketclient
return
/*/{Protheus.doc} tsocketclient:connect
Estabelece uma conexão TCP genérica \(socket\).

@type method

@return numeric, Retorna 0 \(zero\) se conectar com sucesso; caso contrário, a conexão falhou.

@param <nport>, numeric, Indica o número da porta onde a conexão será realizada.
@param <caddress>, character, Indica o número IP ou nome do servidor onde a conexão será realizada.
@param <ntimeout>, numeric, Indica o número em milissegundos onde o método deve esperar para conectar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/connect
/*/
method connect(nport, caddress, ntimeout) class tsocketclient
return
/*/{Protheus.doc} tsocketclient:geterror
Permite recuperar um código e uma string correspondendo à ultima ocorrência do Socket client registrada em caso de falha.

@type method

@return numeric, Retorna o código do último erro ocorrido.

@param <@cdesc>, character, Retorna um código e uma string que corresponde à última ocorrência de SocketClient registrada em caso de falha. Caso não haja nenhuma falha registrada, a função retorna 0 \(zero\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/geterror
/*/
method geterror(cdesc) class tsocketclient
return
/*/{Protheus.doc} tsocketclient:isconnected
Retorna se o socket está conectado ou não

@type method

@return codeblock, Retorna verdadeiro \(.T.\) caso conectado. Caso contrário retorna \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/isconnected
/*/
method isconnected() class tsocketclient
return
/*/{Protheus.doc} tsocketclient:send
Transmite o buffer pela conexão TCP genérica ativa.

@type method

@return numeric, Retorna o número de bytes transmitidos. Caso o número seja diferente do tamanho especificado, no parâmetro cBuffer, algum erro aconteceu.

@param <cdata>, character, Indica a buffer que contém os dados que serão transmitidos pela conexão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/send
/*/
method send(cdata) class tsocketclient
return
/*/{Protheus.doc} tsocketclient:receive
Recebe qualquer tipo de dado pela conexão ativa do objeto.

@type method

@return numeric, Retorna a quantidade de bytes recebidos. Caso ocorra algum erro, a quantidade recebida será menor que zero.

@param <@cbuffer>, variant, Indica o buffer que contém os dados a serem recebidos.
@param <indica>, numeric, o tempo em milissegundos, que o método receive aguarda, para receber algum dado pela conexão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/receive
/*/
method receive(cbuffer, indica) class tsocketclient
return
/*/{Protheus.doc} tsocketclient:reset
Encerra a conexão sem avisar o outro lado.

@type method

@return numeric, Retorna 0 em caso de sucesso. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reset
/*/
method reset() class tsocketclient
return
/*/{Protheus.doc} tsocketclient:closeconnection
Encerra a conexão TCP genérica \(socket\) do objeto corrente.

@type method

@return numeric, Retorna 0 em caso de uma conexão bem sucedida. Caso contrário retorna um código de erro.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/closeconnection
/*/
method closeconnection() class tsocketclient
return


/*/{Protheus.doc} tspinbox
Cria um objeto do tipo caixa de seleção, cujo os itens são definidos a partir de um intervalo numérico.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tspinbox

/*/
class tspinbox from TControl
data bchange as codeblock
method create()
method new()
method setrange()
method setvalue()
method setstep()
method setwrap()
end class
/*/{Protheus.doc} tspinbox:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TSpinBox

@param [ownd], object, Indica a janela ou controle visual onde objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd) class tspinbox
return
/*/{Protheus.doc} tspinbox:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TSpinBox

@param [nrow], numeric, Indica a coordenada vertical em pixels.
@param [ncol], numeric, Indica a coordenada horizontal em pixels.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cmsg], character, Indica a mensagem do tipo dica de contexto \(tooltip/hint\) ao posicionar o ponteiro do mouse sobre o botão.
@param [bwhen], codeblock, Indica o bloco de código que será executado quando a mudança de foco da entrada de dados, na janela em que o controle foi criado, estiver sendo efetuada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, bchange, nwidth, nheight, cmsg, bwhen) class tspinbox
return
/*/{Protheus.doc} tspinbox:setrange
Especifica os valores \(de/até\) da faixa do botão.

@type method

@param [nmin], numeric, Indica o valor mínimo do botão.
@param [nmax], numeric, Indica o valor máximo do botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setrange
/*/
method setrange(nmin, nmax) class tspinbox
return
/*/{Protheus.doc} tspinbox:setvalue
Especifica um valor para o botão.

@type method

@param [nval], numeric, Indica o valor do botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalue
/*/
method setvalue(nval) class tspinbox
return
/*/{Protheus.doc} tspinbox:setstep
Especifica o valor de etapa do botão.

@type method

@param [nstep], numeric, Indica o valor de etapa do botão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setstep
/*/
method setstep(nstep) class tspinbox
return
/*/{Protheus.doc} tspinbox:setwrap
Especifica se a caixa de giro é circular.

@type method

@param [lwrap], logical, Se habilita\(.T.\), Quando o número chegar ao valor máximo\(50\) espeficicado por `( oSpinBox:SetRange(0,50) )` irá levá-lo ao mínimo\(0\) e vica versa. Ao setar /desabilita\(.F.\), o valor não entra em giro circular.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setwrap
/*/
method setwrap(lwrap) class tspinbox
return


/*/{Protheus.doc} tsplitter
Cria um objeto do tipo barra de divisão.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tsplitter

/*/
class tsplitter from TControl
method new()
method create()
method setorient()
method setchildcollapse()
method setcollapse()
method movetolast()
method movetofirst()
method setopaqueresize()
method setresizemode()
end class
/*/{Protheus.doc} tsplitter:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TSplitter

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [norientation], numeric, Indica a posição que a barra de divisão será criada, sendo 0 = Horizontal e 1 = Vertical.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, nwidth, nheight, norientation) class tsplitter
return
/*/{Protheus.doc} tsplitter:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TSplitter

@param [ownd], object, Indica a janela ou controle visual onde objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd) class tsplitter
return
/*/{Protheus.doc} tsplitter:setorient
Especifica a posição \(horizontal ou vertical\) do objeto.

@type method

@param [norient], numeric, Indica a posição do objeto, sendo 0 = Horizontal e 1 = Vertical.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setorient
/*/
method setorient(norient) class tsplitter
return
/*/{Protheus.doc} tsplitter:setchildcollapse
Define se os elementos serão fechados \(Collapsibles\).

@type method

@param [lcoll], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a opção de fechar \(Collapsibles\) os elementos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setchildcollapse
/*/
method setchildcollapse(lcoll) class tsplitter
return
/*/{Protheus.doc} tsplitter:setcollapse
Define qual objeto será fechado \(Collapsible\).

@type method

@param [oobj], object, Indica o objeto que será fechado \(Collapsed\).
@param [lcoll], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) a opção de fechar.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcollapse
/*/
method setcollapse(oobj, lcoll) class tsplitter
return
/*/{Protheus.doc} tsplitter:movetolast
Define qual objeto será o último das divisões.

@type method

@param [oobj], object, Indica qual objeto será o último da divisão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/movetolast
/*/
method movetolast(oobj) class tsplitter
return
/*/{Protheus.doc} tsplitter:movetofirst
Define qual objeto será o primeiro das divisões.

@type method

@param [oobj], object, Indica qual objeto será o primeiro da divisão.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/movetofirst
/*/
method movetofirst(oobj) class tsplitter
return
/*/{Protheus.doc} tsplitter:setopaqueresize
Define se o redimensionamento \(resize\) será opaco.

@type method

@param [lopaq], logical, Indica se habilita\(.T.\)/desabilita\(.F.\) o redimensionamento opaco.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setopaqueresize
/*/
method setopaqueresize(lopaq) class tsplitter
return
/*/{Protheus.doc} tsplitter:setresizemode
Define a maneira de redimensionar \(resize\) o objeto.

@type method

@param [oobj], object, Indica o objeto que será redimensionado.
@param [nmode], numeric, Indica a maneira que o objeto será redimensionado, sendo: 0 = Stretch, 1 = KeepSize, 2 = FollowSizeHint e 3 = Auto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setresizemode
/*/
method setresizemode(oobj, nmode) class tsplitter
return


/*/{Protheus.doc} tsrvobject
Classe abstrata herdada por todos os componentes visuais.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/tsrvobject

/*/
class tsrvobject
data acontrols as array
data bgotfocus as codeblock
data bhelp as codeblock
data blclicked as codeblock
data bldblclick as codeblock
data blostfocus as codeblock
data brclicked as codeblock
data bvalid as codeblock
data bwhen as codeblock
data ccaption as character
data cmsg as character
data cname as character
data creadvar as character
data ctooltip as character
data lactive as logical
data lcangotfocus as logical
data lvisible as logical
data nbottom as numeric
data nclientheight as numeric
data nclientwidth as numeric
data nclrpane as numeric
data nclrtext as numeric
data nheight as numeric
data nleft as numeric
data nright as numeric
data ntop as numeric
data nwidth as numeric
data nwnd as numeric
data cargo as object
data ocursor as object
data ofont as object
data oparent as object
data ownd as object
method classname()
method coorsupdate()
method disable()
method enable()
method freechildren()
method getclientrect()
method getfont()
method setfont()
method gettext()
method hide()
method show()
method hwhandle()
method move()
method owner()
method refresh()
method saveasbmp()
method setcolor()
method setcoors()
method setcss()
method setdisable()
method setenable()
method setfocus()
method settext()
method setupdatesenabled()
end class
/*/{Protheus.doc} tsrvobject:classname
Retorna o nome da classe.

@type method

@return character, Nome da classe

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/classname
/*/
method classname() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:coorsupdate
Atualiza informação no AppServer do posicionamento \(vertical superior, horizontal esquerda, vertical inferior e horizontal direita\) do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/coorsupdate
/*/
method coorsupdate() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:disable
Desabilita o objeto

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/disable
/*/
method disable() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:enable
Habilita o objeto

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/enable
/*/
method enable() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:freechildren
Elimina/Libera todos os objetos da classe onde este método é chamado.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/freechildren
/*/
method freechildren() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:getclientrect
Retorna as coordenadas de posicionamento e dimensão \(vertical superior, horizontal à esquerda, vertical inferior e horizontal à direita\) do objeto

@type method

@return array, Retorna um array com as coordenadas de posicionamento e dimensão \(vertical superior, horizontal esquerda, vertical inferior e horizontal direita\) do objeto.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getclientrect
/*/
method getclientrect() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:getfont
Retorna a fonte do objeto.

@type method

@return object, Fonte do Objeto

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getfont
/*/
method getfont() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setfont
Define a fonte do objeto.

@type method

@param <ofont>, object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfont
/*/
method setfont(ofont) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:gettext
Retorna o título do objeto contido na propriedade cCaption.

@type method

@return character, Título do objeto.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/gettext
/*/
method gettext() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:hide
Torna o objeto invisível.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hide
/*/
method hide() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:show
Torna o objeto visível.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/show
/*/
method show() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:hwhandle
Retorna o handle do objeto.

@type method

@return numeric, Retorna o handle do objeto.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hwhandle
/*/
method hwhandle() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:move
Move o objeto.

@type method

@param <ntop>, numeric, Indica a posição ao topo.
@param <nleft>, numeric, Indica a posição a esquerda.
@param <nwidth>, numeric, Indica a largura.
@param <nheight>, numeric, Indica a altura.
@param [uparam5], logical, Compatibility parameter. Pass NIL.
@param [lrealcoords], logical, Indica se as bordas do objeto serão consideradas no cálculo de movimentação.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/move
/*/
method move(ntop, nleft, nwidth, nheight, uparam5, lrealcoords) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:owner
Retorna o objeto do tipo tWindow ou tDialog utilizado na criação desta classe.

@type method

@return object, Retorna o objeto do tipo tWindow ou tDialog onde este foi criado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/owner
/*/
method owner() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:refresh
Atualiza as propriedades do objeto no TOTVS Smart Client.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/refresh
/*/
method refresh() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:saveasbmp
Salva uma cópia do objeto no formato Bitmap \(\*.BMP\).

@type method

@return logical, Retorna verdadeiro \(.T.\), se a imagem for salva com sucesso; caso contrário, retorna falso \(.F.\).

@param <cfile>, character, Indica o caminho do arquivo no client.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/saveasbmp
/*/
method saveasbmp(cfile) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setcolor
Define as cores do objeto.

@type method

@param <nclrfore>, numeric, Indica a cor da fonte.
@param <nclrback>, numeric, Indica a cor de fundo do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolor
/*/
method setcolor(nclrfore, nclrback) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setcoors
Define as coordenadas \(à esquerda, ao topo, largura e altura\) do objeto utilizando a classe TRect.

@type method

@param <orect>, object, Indica o objeto do tipo TRect é utilizado para definir as coordenadas.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcoors
/*/
method setcoors(orect) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setcss
Aplica estilo no objeto utilizando o CSS \(Cascading Style Sheets\)

@type method

@param <ccss>, character, Indica o texto com formato CSS para o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcss
/*/
method setcss(ccss) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setdisable
Habilita ou desabilita o objeto.

@type method

@param <lenable>, logical, Indica se o habilita \(.F.\) ou desabilita \(.T.\) o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setdisable
/*/
method setdisable(lenable) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setenable
Habilita ou desabilita o objeto.

@type method

@param <lenable>, logical, Indica se o habilita \(.T.\) ou desabilita \(.F.\) o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setenable
/*/
method setenable(lenable) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setfocus
Altera o foco da entrada de dados para o objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfocus
/*/
method setfocus() class tsrvobject
return
/*/{Protheus.doc} tsrvobject:settext
Define o texto do objeto.

@type method

@param <ctexto>, character, Indica o texto do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settext
/*/
method settext(ctexto) class tsrvobject
return
/*/{Protheus.doc} tsrvobject:setupdatesenabled
Habilita ou desabilita a atualização de pintura do objeto.

@type method

@param <lenable>, logical, Indica se habilita \(.T.\) ou desabilita \(.F.\) a atualização do objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setupdatesenabled
/*/
method setupdatesenabled(lenable) class tsrvobject
return


/*/{Protheus.doc} ttabs
Cria um objeto do tipo aba.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ttabs

/*/
class ttabs from TControl
data baction as codeblock
data noption as numeric
data aprompts as object
method new()
method moveopt()
method additem()
method delitem()
method setoption()
method settabs()
end class
/*/{Protheus.doc} ttabs:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TTabs

@param [ntop], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [aprompts], object, Indica o array, no formato texto, que contêm as descrições das abas.
@param [baction], codeblock, Indica o bloco de código que será executado quando mudar de aba.
@param [ownd], object, Indica a janela ou controle visual onde objeto será criado.
@param [noption], numeric, Indica a aba que será selecionada.
@param [nclrfore], numeric, Indica a cor de frente do objeto.
@param [uparam8], numeric, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@param [uparam10], logical, Compatibility parameter. Pass NIL.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [cmsg], character, Indica a mensagem, do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, aprompts, baction, ownd, noption, nclrfore, uparam8, lpixel, uparam10, nwidth, nheight, cmsg) class ttabs
return
/*/{Protheus.doc} ttabs:moveopt
Move o conteúdo de uma aba para outra e exclui a de origem.

@type method

@param [nabaorigem], numeric, Indica a aba que terá seu conteúdo movido e será excluída.
@param [nabadestino], numeric, Indica a aba que receberá o conteúdo da aba excluída.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/moveopt
/*/
method moveopt(nabaorigem, nabadestino) class ttabs
return
/*/{Protheus.doc} ttabs:additem
Adiciona uma aba.

@type method

@param [ctitulo], character, Indica o título da aba que será adicionada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/additem
/*/
method additem(ctitulo) class ttabs
return
/*/{Protheus.doc} ttabs:delitem
Exclui uma aba.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/delitem
/*/
method delitem() class ttabs
return
/*/{Protheus.doc} ttabs:setoption
Seleciona uma aba.

@type method

@param [nnraba], numeric, Indica o número da aba que será selecionada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setoption
/*/
method setoption(nnraba) class ttabs
return
/*/{Protheus.doc} ttabs:settabs
Inclui um novo array no formato texto, com novas abas.

@type method

@param <aabas>, object, Indica um array no formato texto, com as novas abas.
@param <nopt>, numeric, Indica o número da aba que será apresentada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/settabs
/*/
method settabs(aabas, nopt) class ttabs
return


/*/{Protheus.doc} ttimer
Cria um objeto que executa um bloco de código respeitando o temporizador, atrelado a um componente da interface visual.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ttimer

/*/
class ttimer from TSrvObject
data baction as codeblock
data lactive as logical
data ninterval as numeric
data lliveany as logical
method new()
method activate()
method deactivate()
end class
/*/{Protheus.doc} ttimer:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TTimer

@param [ninterval], numeric, Indica o intervalo em milissegundos para disparar o bloco de código \(\*\).
@param [baction], codeblock, Indica o bloco de código que será executado a cada intervalo definido \(\*\*\).
@param [ownd], object, Indica a janela ou controle visual onde o divisor será criado \(\*\*\*\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ninterval, baction, ownd) class ttimer
return
/*/{Protheus.doc} ttimer:activate
Inicia a execução do timer.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/activate
/*/
method activate() class ttimer
return
/*/{Protheus.doc} ttimer:deactivate
Suspende a execução do timer.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/deactivate
/*/
method deactivate() class ttimer
return


/*/{Protheus.doc} ttoolbox
Cria um objeto do tipo caixa de ferramenta, cujo objetivo é agrupar diferentes tipos de objetos.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ttoolbox

/*/
class ttoolbox from TControl
data bchangegrp as codeblock
method create()
method new()
method addgroup()
method removegroup()
method setcurrentgroup()
end class
/*/{Protheus.doc} ttoolbox:create
Método construtor da classe.

@type method

@return object, Nova instância da classe TToolBox

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/create
/*/
method create(ownd) class ttoolbox
return
/*/{Protheus.doc} ttoolbox:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TToolBox

@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [ofont], object, Indica o objeto do tipo TFont utilizado para definir as características da fonte aplicada na exibição do conteúdo do controle visual.
@param [cmsg], character, Indica a mensagem do tipo dica de contexto \(tooltip/hint\), que será apresentada ao posicionar o ponteiro do mouse sobre o objeto.
@param [bwhen], codeblock, Indica o bloco de código que será executado, quando a mudança de foco da entrada de dados no objeto criado estiver sendo realizada. Se o retorno for verdadeiro \(.T.\) o objeto continua habilitado, caso contrário falso \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(nrow, ncol, ownd, nwidth, nheight, ofont, cmsg, bwhen) class ttoolbox
return
/*/{Protheus.doc} ttoolbox:addgroup
Adiciona um grupo.

@type method

@param [oobj], object, Indica o objeto \(pai\) que será adicionado no grupo.
@param [cname], character, Indica a descrição do grupo.
@param [oicon], object, Indica o ícone que representará o grupo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addgroup
/*/
method addgroup(oobj, cname, oicon) class ttoolbox
return
/*/{Protheus.doc} ttoolbox:removegroup
Exclui o grupo.

@type method

@param [oobj], object, Indica qual objeto \(pai\) será excluído do grupo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/removegroup
/*/
method removegroup(oobj) class ttoolbox
return
/*/{Protheus.doc} ttoolbox:setcurrentgroup
Define o grupo corrente.

@type method

@param [oobj], object, Indica qual objeto \(pai\) será posicionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcurrentgroup
/*/
method setcurrentgroup(oobj) class ttoolbox
return


/*/{Protheus.doc} ttree
Cria um objeto do tipo árvore de itens.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ttree

/*/
class ttree from TControl
data currentnodeid as character
data ncolumns as numeric
data nflags as numeric
data bpromptchanged as codeblock
data bdragnode as codeblock
data bvalidnodes as codeblock
method new()
method beginupdate()
method ptaddnodes()
method ptsendnodes()
method ptaddarraynodes()
method ptsendtree()
method endupdate()
method ptgetprompt()
method ptgetnodecount()
method ptgetnivel()
method ptcollapse()
method ptgototonode()
method ptdeletecurrentnode()
method ptchangeprompt()
method ptchangebmp()
method setscroll()
method ptreset()
method setflags()
method setcolwidth()
method setcolsalign()
end class
/*/{Protheus.doc} ttree:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TTree

@param [ntop], numeric, Indica a coordenada vertical superior do objeto.
@param [nleft], numeric, Indica a coordenada horizontal à esquerda do objeto.
@param [nbottom], numeric, Indica a coordenada vertical inferior do objeto.
@param [nright], numeric, Indica a coordenada horizontal à direita do objeto.
@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [bchange], codeblock, Indica o bloco de código que será executado quando o estado ou conteúdo do objeto é modificado pela ação sobre o controle visual.
@param [brclick], codeblock, Indica o bloco de código que será executado quando clicar com o botão direito do mouse sobre o objeto.
@param [cheaders], character, Indica o texto que será exibido no\(s\) cabeçalho\(s\), também definindo a quantidade de colunas que a árvore conterá. Para mais de uma coluna utilize valores separados por ponto e vírgula.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nbottom, nright, ownd, bchange, brclick, cheaders) class ttree
return
/*/{Protheus.doc} ttree:beginupdate
Prepara a árvore para receber os itens.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/beginupdate
/*/
method beginupdate() class ttree
return
/*/{Protheus.doc} ttree:ptaddnodes
Adiciona um item no buffer para posteriormente ser enviado à árvore.

@type method

@param <cnivel>, character, Nível do item.
@param <ciditem>, character, ID que identificará este item.
@param <cparam3>, character, Compatibilidade. Configure sempre com aspas "".
@param <cprompt>, character, Descrição que será apresentada no item. Para mais de uma coluna utilize valores separados por ponto e vírgula.\*
@param <cfile1>, character, Imagem quando o item da árvore estiver fechado.
@param <cfile2>, character, Imagem quando o item da árvore estiver aberto.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptaddnodes
/*/
method ptaddnodes(cnivel, ciditem, cparam3, cprompt, cfile1, cfile2) class ttree
return
/*/{Protheus.doc} ttree:ptsendnodes
Envia um array pré-definido de itens juntamente com um possível buffer já carregado anteriormente para a árvore.

@type method

@param [anodes], array, Indica o array pré-definido com informações para criar a árvore.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptsendnodes
/*/
method ptsendnodes(anodes) class ttree
return
/*/{Protheus.doc} ttree:ptaddarraynodes
Adiciona um array pré-definido de itens no buffer para posteriormente ser enviado à árvore.

@type method

@param <anodes>, array, Indica o array pré-definido com informações para criar a árvore. Para mais informações referente ao formato do array, consulte a área Observações abaixo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptaddarraynodes
/*/
method ptaddarraynodes(anodes) class ttree
return
/*/{Protheus.doc} ttree:ptsendtree
Envia um array pré-definido de itens juntamente com um possível buffer já carregado anteriormente para a árvore.

@type method

@param <anodes>, array, Indica o array pré-definido com informações para criar a árvore.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptsendtree
/*/
method ptsendtree(anodes) class ttree
return
/*/{Protheus.doc} ttree:endupdate
Encerra a criação dos itens.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/endupdate
/*/
method endupdate() class ttree
return
/*/{Protheus.doc} ttree:ptgetprompt
Retorna a descrição do item selecionado.

@type method

@return character, Retorna a descrição do item selecionado.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptgetprompt
/*/
method ptgetprompt() class ttree
return
/*/{Protheus.doc} ttree:ptgetnodecount
Retorna o número de itens na árvore.

@type method

@return numeric, Retorna o número de itens na árvore.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptgetnodecount
/*/
method ptgetnodecount() class ttree
return
/*/{Protheus.doc} ttree:ptgetnivel
Retorna o nível do item selecionado.

@type method

@return numeric, Retorna o nível do item selecionado, sendo que um item raiz será nível 1, seus filhos nível 2 e assim sucessivamente.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptgetnivel
/*/
method ptgetnivel() class ttree
return
/*/{Protheus.doc} ttree:ptcollapse
Contrai o item selecionado ocultando seus subitens.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptcollapse
/*/
method ptcollapse() class ttree
return
/*/{Protheus.doc} ttree:ptgototonode
Localiza e seleciona um determinado item.

@type method

@param <ciditem>, character, ID que identifica o item a ser localizado e selecionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptgototonode
/*/
method ptgototonode(ciditem) class ttree
return
/*/{Protheus.doc} ttree:ptdeletecurrentnode
Exclui o item selecionado e, consequentemente, todos os seus subitens.

@type method

@return character, Retorna o ID que identifica o novo item selecionado automaticamente após exclusão.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptdeletecurrentnode
/*/
method ptdeletecurrentnode() class ttree
return
/*/{Protheus.doc} ttree:ptchangeprompt
Altera a descrição de um item da árvore.

@type method

@param <cprompt>, character, Indica a nova descrição do item. Para mais de uma coluna utilize valores separados por ponto e vírgula.\*
@param <ciditem>, character, Indica a chave de identificação do item na árvore.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptchangeprompt
/*/
method ptchangeprompt(cprompt, ciditem) class ttree
return
/*/{Protheus.doc} ttree:ptchangebmp
Altera as imagens definidas para um item da árvore.

@type method

@param <cfile1>, character, Imagem quando o item da árvore estiver fechado.
@param <cfile2>, character, Imagem quando o item da árvore estiver aberto.
@param <ciditem>, character, Indica a chave de identificação do item na árvore.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptchangebmp
/*/
method ptchangebmp(cfile1, cfile2, ciditem) class ttree
return
/*/{Protheus.doc} ttree:setscroll
Define a barra de rolagem da árvore.

@type method

@param <ntipo>, numeric, Indica o tipo \(1 = horizontal e 2 = vertical\) da barra de rolagem.
@param <lhabilita>, logical, Indica se habilita \(.T.\) ou desabilita \(.F.\) a barra de rolagem.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setscroll
/*/
method setscroll(ntipo, lhabilita) class ttree
return
/*/{Protheus.doc} ttree:ptreset
Limpa todos os itens da árvore.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ptreset
/*/
method ptreset() class ttree
return
/*/{Protheus.doc} ttree:setflags
Habilita/Desabilita certas funcionalidades do componente.

@type method

@param <nflags>, numeric, Valor que representa a\(s\) funcionalidade\(s\) a ser\(em\) habilitada\(s\). Valores de flags podem ser somados para que mais de uma funcionalidade seja habilitada ao mesmo tempo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setflags
/*/
method setflags(nflags) class ttree
return
/*/{Protheus.doc} ttree:setcolwidth
Define a largura de uma coluna.

@type method

@param <ncol>, numeric, Número da coluna a ser alterada \(começando por 1\).
@param <nwidth>, numeric, Tamanho em píxels da largura a ser definida para a coluna.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolwidth
/*/
method setcolwidth(ncol, nwidth) class ttree
return
/*/{Protheus.doc} ttree:setcolsalign
Define o alinhamento das informações nas colunas.

@type method

@param <ainfo>, array, Array contendo informações sobre a coluna desejada e seu novo alinhamento no formato: \{\{coluna, alinhamento\}, \{coluna, alinhamento\}\}.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcolsalign
/*/
method setcolsalign(ainfo) class ttree
return


/*/{Protheus.doc} twebchannel
Cria um objeto para comunicação entre o SmartClient e o Componente TWebEngine através do protocolo WebSocket.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/twebchannel

/*/
class twebchannel
data lconnected as logical
data bjstoadvpl as codeblock
data nport as numeric
method new()
method connect()
method disconnect()
method advpltojs()
end class
/*/{Protheus.doc} twebchannel:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TWebChannel

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class twebchannel
return
/*/{Protheus.doc} twebchannel:connect
Executa a conexão entre o Navegador \(TWebEngine\) e o SmartClient.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/connect
/*/
method connect() class twebchannel
return
/*/{Protheus.doc} twebchannel:disconnect
Executa a desconexão entre o Navegador \(TWebEngine\) e o SmartClient.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/disconnect
/*/
method disconnect() class twebchannel
return
/*/{Protheus.doc} twebchannel:advpltojs
Executa o envio de informações para a pagina HTML carregada no componente TWebEngine que esta configurado para a Porta do TWebChannel. Assim é possivel, por exemplo, injetar um trecho JavaScript na página via ADVPL.

@type method

@param <ccodetype>, character, Indica o tipo de mensagem que será enviada à página HTML.
@param <ccontent>, character, Indica o conteudo que será enviado à pagina HTML.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/advpltojs
/*/
method advpltojs(ccodetype, ccontent) class twebchannel
return


/*/{Protheus.doc} twebengine
Cria um objeto para manipular uma página HTML, trocando informações em tempo real entre o SmartClient e o Navegador através do protocolo WebSocket.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/twebengine

/*/
class twebengine from TControl
data curl as character
data bloadfinished as codeblock
data bdlstatus as codeblock
data clang as character
data bjsconmsg as codeblock
method new()
method navigate()
method runjavascript()
method goback()
method goforward()
method setasmain()
method sethtml()
method clearcache()
method reload()
end class
/*/{Protheus.doc} twebengine:new
Mï¿½todo construtor da classe.

@type method

@return object, Nova instância da classe TWebEngine

@param [ownd], object, Indica a janela ou controle visual onde o objeto será criado.
@param [nrow], numeric, Indica a coordenada vertical em pixels ou caracteres.
@param [ncol], numeric, Indica a coordenada horizontal em pixels ou caracteres.
@param [nwidth], numeric, Indica a largura em pixels do objeto.
@param [nheight], numeric, Indica a altura em pixels do objeto.
@param [curl], character, Indica a URL a ser executada, em schemas como: http:// https:// ou file://
@param [nport], numeric, Porta do WebSocket para comunicação entre o Navegador e o SmartClient
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ownd, nrow, ncol, nwidth, nheight, curl, nport) class twebengine
return
/*/{Protheus.doc} twebengine:navigate
Executa a navegação para URL selecionada

@type method

@param <curl>, character, Indica a URL a ser executada, em schemas como: http:// https:// ou file://
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/navigate
/*/
method navigate(curl) class twebengine
return
/*/{Protheus.doc} twebengine:runjavascript
Executa uma instrução JavaScript na página carregada.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/runjavascript
/*/
method runjavascript() class twebengine
return
/*/{Protheus.doc} twebengine:goback
Retorno à página anterior, caso exista.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goback
/*/
method goback() class twebengine
return
/*/{Protheus.doc} twebengine:goforward
Avança para página posterior, caso exista.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/goforward
/*/
method goforward() class twebengine
return
/*/{Protheus.doc} twebengine:setasmain
Indica ao SmartClient que o navegador em questão será o principal, recebendo a intrução para executar o comando goBack\(\) através da tecla KEY_BACK do dipositivo Móvel..

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setasmain
/*/
method setasmain() class twebengine
return
/*/{Protheus.doc} twebengine:sethtml
Renderiza e exibe o código HTML informado.

@type method

@param <chtml>, character, Deve conter o código HTML.
@param [cbaseurl], character, Usado para resolver URLs relativas no documento, como imagens referenciadas ou folhas de estilo.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sethtml
/*/
method sethtml(chtml, cbaseurl) class twebengine
return
/*/{Protheus.doc} twebengine:clearcache
Limpa o cache de navegação.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/clearcache
/*/
method clearcache() class twebengine
return
/*/{Protheus.doc} twebengine:reload
Recarrega a página corrente.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/reload
/*/
method reload() class twebengine
return


/*/{Protheus.doc} twindow
Cria a janela principal do programa.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/twindow

/*/
class twindow from TSrvObject
data bstart as codeblock
data omenu as object
data lescclose as logical
data nresult as numeric
data bwindowstate as codeblock
data bfocuschange as codeblock
method new()
method activate()
method center()
method commitcontrols()
method ctrlrefresh()
method end()
method hasfocus()
method setmenu()
method windowstate()
end class
/*/{Protheus.doc} twindow:new
Método construtor da classe.

@type method

@return object, Nova instância da classe TWindow

@param [ntop], numeric, Indica a coordenada vertical superior em pixels ou caracteres.
@param [nleft], numeric, Indica a coordenada horizontal esquerda em pixels ou caracteres.
@param [nbottom], numeric, Indica a coordenada vertical inferior em pixels ou caracteres.
@param [nright], numeric, Indica a coordenada horizontal direita em pixels ou caracteres.
@param [ctitle], character, Indica o título da janela.
@param [uparam6], numeric, Compatibility parameter. Pass NIL.
@param [uparam7], object, Compatibility parameter. Pass NIL.
@param [uparam8], object, Compatibility parameter. Pass NIL.
@param [uparam9], object, Compatibility parameter. Pass NIL.
@param [oparent], object, Indica a janela mãe \(principal\) da janela corrente.
@param [uparam11], logical, Compatibility parameter. Pass NIL.
@param [uparam12], logical, Compatibility parameter. Pass NIL.
@param [nclrfore], numeric, Indica a cor do texto da janela.
@param [nclrback], numeric, Indica a cor do fundo da janela.
@param [uparam15], object, Compatibility parameter. Pass NIL.
@param [uparam16], character, Compatibility parameter. Pass NIL.
@param [uparam17], logical, Compatibility parameter. Pass NIL.
@param [uparam18], logical, Compatibility parameter. Pass NIL.
@param [uparam19], logical, Compatibility parameter. Pass NIL.
@param [uparam20], logical, Compatibility parameter. Pass NIL.
@param [lpixel], logical, Indica se considera as coordenadas passadas em pixels \(.T.\) ou caracteres \(.F.\).
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new(ntop, nleft, nbottom, nright, ctitle, uparam6, uparam7, uparam8, uparam9, oparent, uparam11, uparam12, nclrfore, nclrback, uparam15, uparam16, uparam17, uparam18, uparam19, uparam20, lpixel) class twindow
return
/*/{Protheus.doc} twindow:activate
Apresenta a janela.

@type method

@param [cshow], character, Indica se a janela será minimizada \(Iconized\) ou maximizada \(Maximized\).
@param [uparam2], codeblock, Compatibility parameter. Pass NIL.
@param [uparam3], codeblock, Compatibility parameter. Pass NIL.
@param [uparam4], codeblock, Compatibility parameter. Pass NIL.
@param [uparam5], codeblock, Compatibility parameter. Pass NIL.
@param [uparam6], codeblock, Compatibility parameter. Pass NIL.
@param [uparam7], codeblock, Compatibility parameter. Pass NIL.
@param [uparam8], codeblock, Compatibility parameter. Pass NIL.
@param [uparam9], codeblock, Compatibility parameter. Pass NIL.
@param [uparam10], codeblock, Compatibility parameter. Pass NIL.
@param [uparam11], codeblock, Compatibility parameter. Pass NIL.
@param [uparam12], codeblock, Compatibility parameter. Pass NIL.
@param [uparam13], codeblock, Compatibility parameter. Pass NIL.
@param [uparam14], codeblock, Compatibility parameter. Pass NIL.
@param [uparam15], codeblock, Compatibility parameter. Pass NIL.
@param [uparam16], codeblock, Compatibility parameter. Pass NIL.
@param [uparam17], codeblock, Compatibility parameter. Pass NIL.
@param [uparam18], codeblock, Compatibility parameter. Pass NIL.
@param [uparam19], codeblock, Compatibility parameter. Pass NIL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/activate
/*/
method activate(cshow, uparam2, uparam3, uparam4, uparam5, uparam6, uparam7, uparam8, uparam9, uparam10, uparam11, uparam12, uparam13, uparam14, uparam15, uparam16, uparam17, uparam18, uparam19) class twindow
return
/*/{Protheus.doc} twindow:center
Centraliza a janela.

@type method

@param [lcenter], logical, Define se a janela será centralizada ou não.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/center
/*/
method center(lcenter) class twindow
return
/*/{Protheus.doc} twindow:commitcontrols
Força a atualização da informação contida no componente atualmente com foco entre o SmartClient e o AppServer.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/commitcontrols
/*/
method commitcontrols() class twindow
return
/*/{Protheus.doc} twindow:ctrlrefresh
Força a atualização do objeto.

@type method

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/ctrlrefresh
/*/
method ctrlrefresh() class twindow
return
/*/{Protheus.doc} twindow:end
Finaliza a janela.

@type method

@return logical, Retorna verdadeiro \(.T.\) se finalizar a janela. Caso contrário, retorna falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/end
/*/
method end() class twindow
return
/*/{Protheus.doc} twindow:hasfocus
Indica se a janela esta em foco.

@type method

@return logical, Retorna verdadeiro \(.T.\) se o componente está em foco. Caso contrário, falso \(.F.\).

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/hasfocus
/*/
method hasfocus() class twindow
return
/*/{Protheus.doc} twindow:setmenu
Define o objeto que será o menu da janela.

@type method

@param [omenu], object, Indica o objeto do tipo TMenuBar que será criado no controle visual.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setmenu
/*/
method setmenu(omenu) class twindow
return
/*/{Protheus.doc} twindow:windowstate
Indica o estado atual do componente.

@type method

@return numeric, Retorna um número inteiro indicando o estado atual do componente, sendo: 0=Restaurado 1=Minimizado 2=Maximizado

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/windowstate
/*/
method windowstate() class twindow
return


/*/{Protheus.doc} twsdlmanager
A classe TWsdlManager faz o tratamento para arquivos WSDL \(Web Services Description Language\). Esta classe implementa métodos para identificação das informações de envio e resposta das operações definidas, além de métodos para envio e recebimento do documento SOAP.

@type binary class



@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/twsdlmanager

/*/
class twsdlmanager
data lverbose as logical
data lstatus as logical
data lrememptytags as logical
data lenableoptattr as logical
data ccurrentoperation as character
data ntimeout as numeric
data nconnecttimeout as numeric
data lprocresp as logical
data cerror as character
data cfaultcode as character
data cfaultsubcode as character
data cfaultstring as character
data cfaultactor as character
data clocation as character
data nsslversion as numeric
data csslcacertfile as character
data csslcertfile as character
data csslkeyfile as character
data csslkeypwd as character
data lusensprefix as logical
data lcheckinput as logical
data lcompressed as logical
data lsslinsecure as logical
data lalwayssendsa as logical
method new()
method parsefile()
method parseurl()
method listoperations()
method setoperation()
method getwsdldoc()
method simpleinput()
method complexinput()
method simpleoutput()
method complexoutput()
method simplefault()
method complexfault()
method setcomplexoccurs()
method setvalue()
method setvalues()
method setfirst()
method setfirstarray()
method setvalpar()
method setvalpararray()
method addhttpheader()
method setwssheader()
method getsoapmsg()
method sendsoapmsg()
method getsoapresponse()
method getparsedresponse()
method setproxy()
method getproxy()
method setcredentials()
method getcredentials()
method setauthentication()
method getauthentication()
method nextcomplex()
method getservices()
method getports()
method setport()
end class
/*/{Protheus.doc} twsdlmanager:new
Cria uma nova instância da classe TWsdlManager.

@type method

@return object, Nova instância da classe TWsdlManager

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/new
/*/
method new() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:parsefile
Realiza o parse de um arquivo WSDL através do parâmetro recebido indicando o local do mesmo.

@type method

@return logical, Retorna verdadeiro \(.T.\) caso tenha sido realizado o parse com sucesso. Falso \(.F.\) caso contrário.

@param <cfile>, character, Indica o diretório, a partir do rootpath, e o nome de um arquivo WSDL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/parsefile
/*/
method parsefile(cfile) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:parseurl
Realiza o parse de uma URL que aponta para um arquivo WSDL através do parâmetro recebido indicando o local do mesmo.

@type method

@return logical, Retorna verdadeiro \(.T.\) caso tenha sido realizado o parse com sucesso. Falso \(.F.\) caso contrário.

@param <curl>, character, Indica a URL apontando para um arquivo WSDL.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/parseurl
/*/
method parseurl(curl) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:listoperations
Lista as operações disponibilizadas pelo WebService através do documento WSDL.

@type method

@return array, Retorna um array com as operações disponibilizadas.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/listoperations
/*/
method listoperations() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setoperation
O método define a operação que será realizada.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <coperation>, character, Nome da operação que será realizada.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setoperation
/*/
method setoperation(coperation) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getwsdldoc
Retorna a documentação do documento WSDL.

@type method

@return character, Retorna a documentação do documento WSDL ou uma string vazia caso não exista.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getwsdldoc
/*/
method getwsdldoc() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:simpleinput
Retorna os tipos simples utilizados na mensagem do tipo input para a operação definida.

@type method

@return array, Retorna um array contendo os tipos simples da mensagem do tipo input da operação atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/simpleinput
/*/
method simpleinput() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:complexinput
Retorna os tipos complexos utilizados na mensagem do tipo input para a operação definida que possuem número variável de ocorrências \(minOccurs < maxOccurs\).

@type method

@return array, Retorna um array contendo os tipos complexos da mensagem do tipo input da operação atual com número variável de ocorrências.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/complexinput
/*/
method complexinput() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:simpleoutput
Retorna os tipos simples utilizados na mensagem do tipo output para a operação definida.

@type method

@return array, Retorna um array contendo os tipos simples da mensagem do tipo output da operação atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/simpleoutput
/*/
method simpleoutput() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:complexoutput
Retorna os tipos complexos utilizados na mensagem do tipo output para a operação definida.

@type method

@return array, Retorna um array contendo os tipos complexos da mensagem do tipo output da operação atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/complexoutput
/*/
method complexoutput() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:simplefault
Retorna os tipos simples utilizados em mensagens do tipo fault para a operação definida.

@type method

@return array, Retorna um array contendo os tipos simples das mensagens do tipo fault da operação atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/simplefault
/*/
method simplefault() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:complexfault
Retorna os tipos complexos utilizados em mensagens do tipo fault para a operação definida.

@type method

@return array, Retorna um array contendo os tipos complexos das mensagens do tipo fault da operação atual.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/complexfault
/*/
method complexfault() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setcomplexoccurs
O método define o número de vezes que um elemento do tipo complexo vai aparecer.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir. Falso \(.F.\) caso contrário.

@param <nid>, numeric, ID do elemento igual ao informado pelo método [NextComplex](TWsdlManager:NextComplex).
@param <nvalue>, numeric, Quantidade de vezes que o elemento vai aparecer.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcomplexoccurs
/*/
method setcomplexoccurs(nid, nvalue) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setvalue
O método define o valor de entrada para um elemento do tipo simples do WSDL.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <nid>, numeric, ID do elemento igual ao informado pela função [SimpleInput](TWsdlManager:SimpleInput).
@param <cvalue>, character, Valor para esse elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalue
/*/
method setvalue(nid, cvalue) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setvalues
O método define um vetor de valores de entrada para um elemento do tipo simples do WSDL.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <nid>, numeric, ID do elemento igual ao informada pela função [SimpleInput](TWsdlManager:SimpleInput).
@param <avalues>, array, Vetor de valores para esse elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalues
/*/
method setvalues(nid, avalues) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setfirst
O método define o valor de entrada para a primeira ocorrência de um elemento do tipo simples do WSDL.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <cname>, character, Nome do elemento igual ao informado pela função [SimpleInput](TWsdlManager:SimpleInput).
@param <cvalue>, character, Valor para esse elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfirst
/*/
method setfirst(cname, cvalue) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setfirstarray
O método define um vetor de valores de entrada para a primeira ocorrência de um elemento do tipo simples do WSDL.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <cname>, character, Nome do elemento igual ao informado pela função [SimpleInput](TWsdlManager:SimpleInput).
@param <avalues>, array, Vetor de valores para esse elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setfirstarray
/*/
method setfirstarray(cname, avalues) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setvalpar
O método define o valor de entrada para um elemento do tipo simples do WSDL, dado os elementos pais.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <cname>, character, Nome do elemento igual ao informado pela função [SimpleInput](TWsdlManager:SimpleInput).
@param <aparents>, array, Vetor com os nomes dos elementos pais de **cName**.
@param <cvalue>, character, Valor para esse elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalpar
/*/
method setvalpar(cname, aparents, cvalue) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setvalpararray
O método define um vetor de valores de entrada para um elemento do tipo simples do WSDL, dado os elementos pais.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga definir; falso \(.F.\) caso contrário.

@param <cname>, character, Nome do elemento igual ao informado pela função [SimpleInput](TWsdlManager:SimpleInput).
@param <aparents>, array, Vetor com os elementos pais de **cName**.
@param <avalues>, array, Vetor de valores para esse elemento.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setvalpararray
/*/
method setvalpararray(cname, aparents, avalues) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:addhttpheader
O método adiciona um cabeçalho HTTP à lista de cabeçalhos que serão enviados na mensagem SOAP destinada ao servidor WSDL.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga adicionar. Falso \(.F.\) caso contrário.

@param <cname>, character, Nome do cabeçalho que será adicionado.
@param <cvalue>, character, Valor do cabeçalho que será adicionado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/addhttpheader
/*/
method addhttpheader(cname, cvalue) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setwssheader
O método adiciona ao cabeçalho da mensagem SOAP uma string contendo as tags de cabeçalho WS-Security.

@type method

@param <cheader>, character, Conteúdo que será inserido no cabeçalho da mensagem SOAP, exatamente como for passado.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setwssheader
/*/
method setwssheader(cheader) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getsoapmsg
Retorna o documento SOAP que será enviado ao servidor.

@type method

@return character, Retorna o documento SOAP que será enviado ao servidor.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsoapmsg
/*/
method getsoapmsg() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:sendsoapmsg
Envio o documento SOAP gerado ao endereço definido.

@type method

@return logical, Verdadeiro \(.T.\) caso consiga enviar o documento e receber a reposta do servidor. Falso \(.F.\) caso contrário.

@param [cmsg], character, Indica a mensagem SOAP que será enviada, ao invés da mensagem gerada pela classe usando os valores que foram definidos.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/sendsoapmsg
/*/
method sendsoapmsg(cmsg) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getsoapresponse
Retorna o documento SOAP de resposta recebido do servidor.

@type method

@return character, Retorna o documento SOAP de resposta recebido do servidor.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getsoapresponse
/*/
method getsoapresponse() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getparsedresponse
Retorna uma string contendo a mensagem SOAP de resposta parseada.

@type method

@return character, Retorna uma string contendo a mensagem SOAP de resposta parseada.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getparsedresponse
/*/
method getparsedresponse() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setproxy
Define o host e porta do proxy para fazer a conexão HTTP.

@type method

@param <chost>, character, Indica o host do proxy para fazer a conexão HTTP.
@param <nport>, numeric, Indica a porta do proxy para fazer a conexão HTTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setproxy
/*/
method setproxy(chost, nport) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getproxy
Retorna o host e porta do proxy para fazer a conexão HTTP.

@type method

@return logical, Retorna se o proxy está habilitado \(.T.\) ou não \(.F.\).

@param <@chost>, character, Indica o host do proxy para fazer a conexão HTTP.
@param <@nport>, numeric, Indica a porta do proxy para fazer a conexão HTTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getproxy
/*/
method getproxy(chost, nport) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setcredentials
Define o usuário e senha do proxy para fazer a conexão HTTP.

@type method

@param <cuser>, character, Indica o usuário do proxy para fazer a conexão HTTP.
@param <cpass>, character, Indica a senha do proxy para fazer a conexão HTTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setcredentials
/*/
method setcredentials(cuser, cpass) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getcredentials
Retorna o usuário e senha do proxy para fazer a conexão HTTP.

@type method

@return logical, Retorna se o proxy está habilitado \(.T.\) ou não \(.F.\).

@param <@cuser>, character, Indica o usuário do proxy para fazer a conexão HTTP.
@param <@cpass>, character, Indica a senha do proxy para fazer a conexão HTTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getcredentials
/*/
method getcredentials(cuser, cpass) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setauthentication
Define o usuário e senha usados para fazer autenticação HTTP.

@type method

@param <cuser>, character, Indica o usuário usado para fazer autenticação HTTP.
@param <cpass>, character, Indica a senha usada para fazer autenticação HTTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setauthentication
/*/
method setauthentication(cuser, cpass) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getauthentication
Retorna o usuário e senha usados para fazer autenticação HTTP.

@type method

@return logical, Retorna se a autenticação HTTP está habilitada \(.T.\) ou não \(.F.\).

@param <@cuser>, character, Indica o usuário usado para fazer autenticação HTTP.
@param <@cpass>, character, Indica a senha usada para fazer autenticação HTTP.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getauthentication
/*/
method getauthentication(cuser, cpass) class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:nextcomplex
Retorna o elemento de tipo complexo que necessita definir o número de ocorrências \(minOccurs < maxOccurs\). Esse método deve ser chamado enquanto retornar um array com os dados do elemento complexo, e logo após deve ser chamado o método [SetComplexOccurs](TWsdlManager:SetComplexOccurs), definido o número de ocorrências do elemento.

@type method

@return array, Retorna um array contendo os dados do elemento de tipo complexo da mensagem da operação atual com número variável de ocorrências. Em caso de não ter mais elementos complexos a serem definidos, ou não ter algum elemento complexo que necessite de definição do número de ocorrências, o método retorna **Nil**.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/nextcomplex
/*/
method nextcomplex() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getservices
Retorna a lista de serviços disponíveis no Web Service.

@type method

@return array, Retorna um array contendo o nome dos serviços declarados no Web Service.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getservices
/*/
method getservices() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:getports
Retorna a lista de ports declarados apara o primeiro serviço do Web Service.

@type method

@return array, Retorna um array contendo as informações de cada port do primeiro serviço do Web Service.

@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/getports
/*/
method getports() class twsdlmanager
return
/*/{Protheus.doc} twsdlmanager:setport
Define o port ativo para o primeiro serviço disponível no Web Service.

@type method

@return logical, Retorna verdadeiro \(.T.\) se o port foi ativo com sucesso; caso contrário, retorna falso \(.F.\).

@param <cport>, character, Indica o nome do port que será atvio.
@author [VP Tecnologia](https://tdn.totvs.com/display/tec) - [TOTVS S.A.](https://www.totvs.com/)
@see https://tdn.totvs.com/display/tec/setport
/*/
method setport(cport) class twsdlmanager
return


