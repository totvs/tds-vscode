#include "protheus.ch"

// Função principal
User Function tst5732()
	Local cMascara  := "Todos os arquivos|*.*|Arquivos de texto|*.txt|Bitmaps|*.png"
	Local cTitulo   := "DTCLIENT01-5732"
	Local nMascpad  := 0
	local GETF_HIDDENDIR := 256
	local _LOCALHARD := 16
	Local cDirini   := "\"
	Local lAbrir    := .T. //.F. = Salva || .T. = Abre/
	Local nOpcoes   := nOR( _LOCALHARD, GETF_MULTISELECT, GETF_HIDDENDIR  )
	Local lArvore   := .T. //.T. = apresenta o árvore do servidor || .F. = não apresenta/
	Local targetDir

	u_startRemoteLog("DTCLIENT01-5732: Upload local files")

	targetDir := cGetFile( cMascara, cTitulo, nMascpad, cDirIni, lAbrir, nOpcoes, lArvore)

	u_remoteLog("Result cGetFile: "+cValToChar(targetDir))

	u_stopRemoteLog()

return
