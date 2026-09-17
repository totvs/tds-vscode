//Não enviar ao repositório se aplicar formatação
#include "protheus.ch"

user function operatorSpacing()
local nA := 10
local nB := 3
local nResult := 0
local lFlag := .F.
nResult := nA+nB
nResult := nA-nB
nResult := nA*nB
nResult := nA/nB
nResult += nA
nResult -= nA
nResult *= nA
nResult /= nA
nResult := nA	+nB
nResult := nA	-nB
nResult := nA	*      nB
nResult := nA /	nB
nResult += 	nA
nResult -=    nA
nResult *=  nA
nResult /=    nA
lFlag := nA == nB
lFlag := nA != nB
lFlag := nA >= nB
lFlag := nA <= nB
lFlag := nA > nB
lFlag := nA < nB
lFlag := nA = nB
nResult++
nResult--
cCod := SA1->A1_COD
(xtemp)->(dbskip())

conout("For encoding validation: não, é, ção")

return
