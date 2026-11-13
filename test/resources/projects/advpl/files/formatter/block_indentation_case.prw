//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function blocksB()
local n := 1
do case
case n == 1
    conout("one")
otherwise
    conout("other")
endcase

begin sequence
conout("try")
recover
conout("rec")
end sequence

if a == 1
conout("a")
else
conout("b")
endif
return
