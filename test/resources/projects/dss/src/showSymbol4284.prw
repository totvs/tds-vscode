//Erro ao declarar uma vari�vel
//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4284
// erros de compila��o s�o esperados, n�o corrigir

#include "protheus.ch"
function u_define()
	local x := 0
	// proposital: gera elemento incompleto na lista de simbolos
	local
	u_func2(aaa,bbb)
return
