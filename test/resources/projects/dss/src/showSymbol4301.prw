//'Peek' em váriaveis não apresenta resultados
//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4301
#include "protheus.ch"

#define TEXT_1 "lorem ipsum dolor sit amet, ..."
#define PSEUDO_FUNC(x) conout(x)
#define SYMBOL

#ifdef SYMBOL
user function F4301()
	local x := 0

	//peek:variable
	conout( x)
	x := x + 1

	//peek:symbol
	conout(_WINAPI_CH)

	//peek:symbol_built_in
	conout(SYMBOL)

	//peek:function
	conout(TEXT_1)
	conout()

	//peek:pseudofunction
	PSEUDO_FUNC(TEXT_1)

return

#endif
user function F4301a(p1)
	//peek:u_F4301
	u_F4301()

	//peek:p1
	p1 := 10

	p1 := p1 * p1

return

user function F4301b(p1)

	p1 := 10

	p1 := 20

return
