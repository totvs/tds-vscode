#INCLUDE 'TOTVS.CH'

Class xJson

	Data cJson
	Data jTeste
	Data aTeste

	method new(cCpfCnpj) Constructor

EndClass

Method new(cCpfCnpj as Character) Class xJson
	local cRet := ""
	local i

	::aTeste := {}
	for i:= 1 to 2
		aAdd(::aTeste, "Item " + cValToChar(i))
	next

	::aTeste := {}
	//::cJson := MemoRead('W:\ws_tds_vscode\tds-vscode-dev2\test\resources\projects\advpl\files\json\jsonteste3.json')
	::cJson := readFile('W:\ws_tds_vscode\tds-vscode-dev2\test\resources\projects\advpl\files\json\cliente.json')
	::jTeste := JsonObject():New()
	cRet := ::jTeste:FromJson(::cJson)
	conout("cRet: " + cValToChar(cRet))

	::cJson := readFile('W:\ws_tds_vscode\tds-vscode-dev2\test\resources\projects\advpl\files\json\cliente2.json')
	::jTeste := JsonObject():New()
	cRet := ::jTeste:FromJson(::cJson)
	conout("cRet: " + cValToChar(cRet))

	::aTeste := ::jTeste
Return

STATIC Function ReadFile(cFile)
	Local cBuffer := ''
	Local nH , nTam
	nH := Fopen(cFile)
	IF nH != -1
		nTam := fSeek(nH,0,2)
		fSeek(nH,0)
		cBuffer := space(nTam)
		fRead(nH,@cBuffer,nTam)
		fClose(nH)
	Else
		MsgStop("Falha na abertura do arquivo ["+cFile+"]","FERROR "+cValToChar(Ferror()))
	Endif

Return cBuffer
User Function XTSTJS
	Local oObject
	local lJson := readFile('W:\ws_tds_vscode\tds-vscode-dev2\test\resources\projects\advpl\files\json\cliente-2.json')
	local cRet

	oObject := JsonObject():New()
	cRet := oObject:FromJson(lJson)
	conout("cRet: " + cValToChar(cRet))

	oObject := xJson():New("")

Return
