#include "protheus.ch"

// Função principal
User Function tst5694()
	local cMascara := "All Files|*.*" //Text|*.txt'

	u_startRemoteLog("DTCLIENT01-5694: TFileDialog, lSalvar parameter")

	u_RemoteLog("cGetFile, lSalvar=.T.")
	cGetFile(cMascara,"Teste Abrir cGetFile - lAbrir= .T.",,, .T./*lAbrir*/ ,GETF_LOCALHARD) //-- Abrir!!!!

	u_RemoteLog("cGetFile, lSalvar=.F.")
	cGetFile(cMascara,"Teste Salvar cGetFile - lAbrir= .F.",,, .F./*lAbrir*/ ,GETF_LOCALHARD) //-- Salvar!!!!

	u_RemoteLog("tFileDialog, lSalvar=.T.")
	tFileDialog (cMascara,"Teste Salvar tFileDialog - lSalvar = .T.",,, .T./*lSalvar*/ ,GETF_LOCALHARD) //-- Salvar!!!!

	//u_RemoteLog("tFileDialog, lSalvar=.F.")
	//tFileDialog (cMascara,"Teste Abrir tFileDialog - lSalvar = .F.",,, .F./*lSalvar*/ ,GETF_LOCALHARD) //-- Abrir!!!!

	u_stopRemoteLog()
return
