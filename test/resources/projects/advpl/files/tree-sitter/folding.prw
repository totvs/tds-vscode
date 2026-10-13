#include "totvs.ch"

/*
* Bloco de comentario multi-linha
* para testar folding de comentario.
*/
#ifdef SOME_DEFINE
// dentro do ifdef
// outra linha
#endif

user function foldme()
local n := 0
if n == 0
conout("zero")
conout("one")
endif
do while n < 3
n := n + 1
conout(n)
enddo
for n := 1 to 3
conout(n)
conout(n)
next
do case
case n == 1
    conout("one")
otherwise
    conout("other")
endcase
begin sequence
conout("try")
conout("more")
recover
conout("rec")
end sequence
try
conout("in try")
conout("more")
catch oErr
conout("in catch")
endtry
return
