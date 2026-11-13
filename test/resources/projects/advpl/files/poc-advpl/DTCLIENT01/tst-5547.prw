#INCLUDE "TOTVS.CH"

user function tst5547()
	Local cFile     := Nil
	Local cBARRAS   := If(isSRVunix(),"/","\")
	Local cRootPath :=  GetTempPath() //"c:\" // Alltrim(GetSrvProfString("RootPath",cBARRAS))
	Local cContent  := "<?xml version='1.0' encoding='ISO-8859-1' standalone='yes' ?>"+;
					   "<testsuite time='0.0000'>"+;
					   "  <testcase id='1'>"+;
					   "</testcase>"+;
					   "</testsuite>"

	u_startRemoteLog("DTCLIENT01-5547: Apoio em classe tec TxmlViewer")

	If Right(AllTrim(cRootPath),1) != cBARRAS
		cRootPath := AllTrim(cRootPath) + cBARRAS
	EndIf
	If !ExistDir(cRootPath+"temp")
		MakeDir(cRootPath+"temp")
	EndIf

	cFile := cRootPath + "temp" + cBARRAS + 'teste.xml'

	oDlg := TDialog():New(150,150,500,500,'DTCLIENT01-5547: TXMLViewer',,,,,,,,,.T.)

	ofileXML := FCREATE(cFile)
	If ofileXML>0
		FWrite(ofileXML, cContent)
		FClose(ofileXML)
	EndIf

	oXml := TXMLViewer():New(10, 10, oDlg , cFile, 150, 150, .T. )

	if oXml:setXML(cFile)
		Alert("Arquivo não encontrado")
	EndIf

	oDlg:Activate()

	u_stopRemoteLog()
Return
