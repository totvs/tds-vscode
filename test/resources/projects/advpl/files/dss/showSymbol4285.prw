//Erro mouse hover em DEFINE
//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-4285
#include "protheus.ch"

#define TEXT_1 "lorem ipsum dolor sit amet,"
#define TEXT_2 "consectetur adipiscing elit."
#define NUMBER 123
#define PSEUDO_FUNC(x) conout(x)
#define PSEUDO_NULL_FUNC(x)
#define SYMBOL

#ifdef SYMBOL
user function F4285()
	local x := 0

	conout(_WINAPI_CH)
	conout( x)
	conout( TEXT_1, TEXT_2)

	PSEUDO_FUNC("lorem ipsum")
	//gotoDefinition
	PSEUDO_FUNC(TEXT_1)

	PSEUDO_NULL_FUNC(TEXT_1)
return
#endif
