#include "protheus.ch"

user function erro()
	local cMsg, nRet
	local nStart

	alert("Continuar")

	nStart := seconds()
	while (seconds() - nStart) < 10
		if (seconds() % 5 == 0)
			conout("Em loop: " + str(seconds() - nStart))
		endif
	end

	cMsg := "Erro de execu��o do programa. "
	nRet := 1234

	conout(cMsg + "C�digo de erro: " + nRet)

return
