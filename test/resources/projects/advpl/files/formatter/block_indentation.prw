//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function blocksA()
local n := 0
if n == 0
conout("if")
elseif n > 1
conout("elseif")
else
conout("else")
endif
for n := 1 to 3
conout(n)
next
do while n < 3
n++
enddo
return
