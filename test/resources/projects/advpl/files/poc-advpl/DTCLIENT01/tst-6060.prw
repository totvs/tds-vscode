#INCLUDE "TOTVS.CH"

user function tst6060()
	local cRet

	u_startRemoteLog("DTCLIENT01-6060: cGetFile não adiciona extensão de arquivo automaticamente")

	u_remoteLog("cGetFile, lSalvar=.T., nome de arquivo sem extensão")

	cRet := cGetFile('Texto|*.txt|Bitmaps|*.bmp','DTCLIENT01-6060', 0, padR("\", 50), .F., 0,.T., .F. )

	u_remoteLog("cGetFile retorno", {{ "cRet", cRet}})

	u_stopRemoteLog()

Return
