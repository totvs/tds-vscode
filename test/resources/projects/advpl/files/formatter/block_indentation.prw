#include "protheus.ch"

static _n := 1
	static _total := 2
	static _x := 3

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

procedure blocksProc()
local i := 0
if i == 0
conout("proc")
endif
return
