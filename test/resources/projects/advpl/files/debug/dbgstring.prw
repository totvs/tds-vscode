//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"
#INCLUDE "TBICONN.CH"


user function dbgstring()
	local s0 := ""
	local s10 := "ABCDEFJHI*"
	local s100 := replicate(s10,10)
	local s1000 := replicate(s100,10)
	local s10000 := replicate(s1000,10)

	conout(s0)
	conout(s10)
	conout(s100)
	conout(s1000)
	conout(s10000)
return

