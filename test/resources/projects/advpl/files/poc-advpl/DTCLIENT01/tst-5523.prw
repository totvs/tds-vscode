#include "protheus.ch"

// Função principal
// @param acMask: mascara de arquivos. Lista de arquivos separados por barra vertical (|).
//      Each mask consists of two elements: description and extension.
//      Example: "All files |*.*| Text Files |*.txt | bitmaps |*.png".
//      If not infomed or empty, the default is "all files |*.*| Text Files |*.txt | bitmaps |*.png".
User Function tst5523(acMask, acInitialFolder)
	Local cMascara  := iif(acMask == nil .or. acMask = "", ;
		"Todos os arquivos|*.*|Arquivos de texto|*.txt|Bitmaps|*.png",;
		acMask)
	Local cTitulo   := "DTCLIENT01-5523"
	Local nMascpad  := 0
	local GETF_HIDDENDIR := 256
	local _LOCALHARD := 16
	Local cDirini   := iif(acInitialFolder == nil .or. acInitialFolder == "", "\", acInitialFolder)
	Local lSalvar   := .F. //.T. = Salva || .F. = Abre/
	Local nOpcoes   := nOR( _LOCALHARD, GETF_MULTISELECT, GETF_HIDDENDIR  )
	Local lArvore   := .T. //.T. = apresenta o árvore do servidor || .F. = não apresenta/
	Local targetDir

	targetDir := cGetFile( cMascara, cTitulo, nMascpad, cDirIni, lSalvar, nOpcoes, lArvore)
return
