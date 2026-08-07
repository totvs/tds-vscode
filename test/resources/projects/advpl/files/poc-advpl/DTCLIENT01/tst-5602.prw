#include "protheus.ch"

// Função principal
// acOperation, string, Indica a operação a executar.
// acTargetRun, string, Indica o ambiente de execução do código, podendo ser "server" ou "remote"
// acPath, string, Indica o caminho onde estóo os arquivos e onde seró criado o ZIP.

//("zip", "remote", "W:\\webapp_onca\\packages\\poc-advpl\\tests\\e2e\\DTCLIENT01\\resources\\tst-5602")

user function tst5602(acOperation, acTargetRun, acPath)
	u_startRemoteLog("DTCLIENT01-5602: ZIP/UNZIP")

	u_remoteLog("acOperation: "+cValToChar(acOperation))
	u_remoteLog("acTargetRun: "+cValToChar(acTargetRun))
	//u_remoteLog("acPath: "+cValToChar(acPath)) //não exibir o caminho completo por motivos de segurança/snapShot

	do case
	case acOperation == "zip"
		u_remoteLog("Process: ZIP")

		if acTargetRun == "server"
			serverZip(.f., acPath)
			serverZip(.t., acPath)
		else //acTargetRun == "remote"
			remoteZip(.f., acPath)
			remoteZip(.t., acPath)
		endif
	case acOperation == "unzip"
		u_remoteLog("Process: UNZIP")

		if acTargetRun == "server"
			serverUnzip(.f., acPath)
			serverUnzip(.t., acPath)
		else //acTargetRun == "remote"
			remoteUnzip(.f., acPath)
			remoteUnzip(.t., acPath)
		endif
	otherwise
		u_remoteLog("Process: INVALID")
		u_remoteLog("Invalid operation. Please use 'zip' or 'unzip'.")
		throw "Invalid operation. Please use 'zip' or 'unzip'."
	endcase

	u_stopRemoteLog()

return

static function remoteZip(abChangeCase, acPath)
	Local cPathTmp := acPath
	Local cNomeZip := iif(abChangeCase, "\TestFzip_changeCase.zip", "\TestFzip_noChangeCase.zip")
	Local aAnexos := {acPath + "\LAYOUT_CPM.html", acPath+"\WFCUBAGEMPEDIDO.HTML"}

	u_remoteLog("(remote) lChangeCase: "+cValToChar(abChangeCase))
	u_remoteLog("(remote) ZIP File: "+cValToChar(cPathTmp+cNomeZip))

	//  tFzip(msint nId) : tFunction("CRARCOCOLO", nId)
	//           CR                 AR       CO         CO      LO
	nret := FZip(cPathTmp+cNomeZip, aAnexos, cPathTmp, "1234", abChangeCase)

	if nret!=0
		u_remoteLog("ZIP: failed")
	else
		u_remoteLog("ZIP: OK")
	endif
return

static function serverZip(abChangeCase, acPath)
	Local cPathTmp := acPath
	Local cNomeZip := iif(abChangeCase, "\TestFzip_changeCase.zip", "\TestFzip_noChangeCase.zip")
	Local aAnexos := {cPathTmp+"\LAYOUT_CPM.html", cPathTmp+"\WFCUBAGEMPEDIDO.HTML"}

	u_remoteLog("(remote) lChangeCase: "+cValToChar(abChangeCase))
	//  tFzip(msint nId) : tFunction("CRARCOCOLO", nId)
	//           CR                 AR       CO         CO      LO
	nret := FZip(cPathTmp+cNomeZip, aAnexos, cPathTmp, "1234", abChangeCase )

	if nret!=0
		u_remoteLog("ZIP: failed")
	else
		u_remoteLog("ZIP: OK")
	endif
return
