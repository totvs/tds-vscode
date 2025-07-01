#include "protheus.ch"

user function tst()
	local list := {}
	local n

	for n := 1 to 10
		aAdd(list, n)
	next

	@ say 10,10
return

