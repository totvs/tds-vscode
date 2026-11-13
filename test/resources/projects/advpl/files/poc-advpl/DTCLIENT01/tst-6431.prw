#INCLUDE "TOTVS.CH"

user function tst6431(acInitialFolder)
	local cRet := ""
	local aRet := {}

	u_startRemoteLog("DTCLIENT01-6431: Inconsistencia tFileDialog webapp 10.1.1")
	u_remoteLog("Seleção de arquivos com dois espaços no nome")
	u_remoteLog("Pasta inicial: " + acInitialFolder)

	//cRet := tFileDialog("All Files|*.*", "DTCLIENT01-6431")//,0,, .T. ,GETF_MULTISELECT)
	cRet := TFileDialog("All(*)",'Arquivos',0,acInitialFolder,.F.,GETF_MULTISELECT)
	aRet := strTokArr(cRet, ";")

	u_remoteLog("tFileDialog retorno", {;
		{ "cRet", cRet },;
		{ "aRet", aRet };
		})

	u_stopRemoteLog()

Return
