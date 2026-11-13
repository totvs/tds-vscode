#include "totvs.ch"

#command MyScop function <identifier> => function ms_<identifier>

MyScop function candidateSum(nA, nB)
	local nResult := nA + nB
	static nCalls := 0

	conout(nResult)
	conout(nCalls)
return nResult

user function plainFunction()
	local cText := "x"
	conout(cText)
return
