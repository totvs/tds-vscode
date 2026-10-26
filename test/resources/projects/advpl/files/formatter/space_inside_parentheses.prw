//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function spaceInsideParentheses(p1,p2)
local nValue := (1+2)
local nValue2 := ( 1+2 )
local nEmpty := myFunc()
local nEmpty2 := myFunc( )
if (p1 == p2)
	conout("value (with parens)", nValue)
endif

conout("For encoding validation: não, é, ção")

return
