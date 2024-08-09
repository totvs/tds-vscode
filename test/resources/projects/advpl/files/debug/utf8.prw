//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"

user function utf8()
	local cString := "� � � � � � � � � � �"
	local cString2 := encodeUTF8(cString)
	local ceu := "c�u"
	local ceu2 := encodeUTF8(ceu)
	local cao := "c�o"
	local cao2 := encodeUTF8(cao)
	local t := "acentua��o ACENTUA��O"
	local t2 := encodeUTF8(t)

	conout(cString)
	conout(cString2)
	conout(ceu)
	conout(ceu2)
	conout(cao)
	conout(cao2)
	conout(t)
	conout(t2)

return
