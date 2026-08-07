#include "protheus.ch"

/**
 * FFunction tst5446
 *
 * This function is designed to perform operations related to the specified initial folder.
 *
 * @param acInitialFolder [Character] - The initial folder path to be used by the function.
 *
 * @return [Undefined] - The function does not explicitly return a value.
 *
 * @note Ensure that the provided folder path is valid and accessible.
 */
User Function tst5446(acInitialFolder)
	Local cMascara  := "Todos os arquivos|*.*"
	Local cTitulo   := "DTCLIENT01-5446"
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
