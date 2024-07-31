//Erro ao declarar uma variável
//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4284
// erros de compilação são esperados, não corrigir

#include "protheus.ch"
function u_define()
	local x := 0
	// proposital: gera elemento incompleto na lista de simbolos
	local
	u_func2(aaa,bbb)
return
