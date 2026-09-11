//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function spaceInsideParentheses(p1,p2)
local nValue := (1+2)
local nValue2 := ( 1+2 )
local nEmpty := func()
local nEmpty2 := func( )
if (p1 == p2)
	conout("value (with parens)", nValue)
endif

conout("Para validação de encoding: não, é, ção")

return
