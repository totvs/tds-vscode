#include "protheus.ch"

User Function ReadOnly()
	// Em versão 2.1.2 ocorria "crash" no LS
	Local cMsg := "Arquivo fonte somente leitura."

	ConOut(cMsg)

Return Nil
