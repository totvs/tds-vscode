#include "protheus.ch"

if .t.
//
endif



user function indent()
local n := 1

if .t.
n := 10
endif
if .t.
n := 10
else
n := 10
endif

if .t.
n := 10
if .t.
n := 10
else
	n := 10
	endif
endif

while .t. 
n := 10
if .t.
n := 10
endif
if .t.
n := 10
else
	n := 10
	endif
enddo

Do Case
Case nHorizontal == 2
cAlign += "Left, "
nHoriz := 0
Case nHorizontal == 3
cAlign += "Center, "
nHoriz := 2
Case nHorizontal == 4
cAlign += "Right, "
nHoriz := 1
Case nHorizontal == 5
cAlign += "Justify, "
nHoriz := 3
Otherwise
cAlign += "Default, "
nHoriz := 0
EndCase

return
