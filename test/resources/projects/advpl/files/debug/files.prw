//Caution:
//  If this source is modified, review breakpoints in the test source.
//--------------------------------------------------------------------

#include "totvs.ch"
#INCLUDE "TBICONN.CH"


user function files()
	local a
	conout(">>> files")

	PREPARE ENVIRONMENT EMPRESA ("T1") FILIAL ("D MG 01")

	chkFile("SF1")

	while .t.
	end

	for a:=1 to 30 step 1.3
	next
return

