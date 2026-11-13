#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

/*/{Protheus.doc} xmlViewer
Presents a dialog with options to test different TXmlViewer functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TXMLViewer
/*/
User Function xmlViewer()
	local aOption := {;
		{"Visual",    { |aoParent| xmlViaual(aoParent) }}, ;
		{"Events",    { |aoParent| xmlEvents(aoParent) }}, ;
		{"100 nodes", { |aoParent| xmlPerformance(aoParent, 100) }}, ;
		{"1K nodes",  { |aoParent| xmlPerformance(aoParent, 1000) }}, ;
		{"10K nodes", { |aoParent| xmlPerformance(aoParent, 10000) }}, ;
		{"40K nodes", { |aoParent| xmlPerformance(aoParent, 40000) }},;
		{"Parent Scroll", { |aoParent| xml2Visual(aoParent) }} ;
		}

	u_selectTest("TXmlViewer", aOption)

return

/*/{Protheus.doc} xmlViaual
Creates a TXmlViewer inside the parent panel for visual testing.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
static function xmlViaual(aoParent)
	Local cFile := createXMLFile(0)
	local aResult := createDialog(cFile)
	local oDialog := aResult[0]

	activate dialog  oDialog centered
Return

/*/{Protheus.doc} xml2Visual
Creates a TXmlViewer inside the parent panel for visual testing.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
static function xml2Visual(aoParent)
	Local cFile := createXMLFile(0)
	local oXml

	oXml := TXMLViewer():New(SAY_ROW(1), SAY_COL, aoParent, cFile, 200, 250, .T.)
	oXml:cName := "oXmlViewer"
	oXml:cReadVar := "oXmlViewer"

	//activate dialog  oDialog centered
Return

/*/{Protheus.doc} xmlEvents
Creates a TXmlViewer inside the parent panel with all events registered for event testing.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
static function xmlEvents(aoParent)
	Local cFile := createXMLFile(0)
	local aResult := createDialog(cFile)
	local oDialog := aResult[0]
	local oXml := aResult[1]

	//TSrvObject and TControl
	u_allEvents(oXml, "oXml")

	activate dialog  oDialog centered
Return

/*/{Protheus.doc} xmlPerformance
Creates a TXmlViewer in a separate dialog for performance testing with variable node count.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
static function xmlPerformance(aoParent, anSize)
	Local cFile := createXMLFile(anSize)
	local aResult := createDialog(cFile)
	local oDialog := aResult[0]

	activate dialog  oDialog centered
Return

	#define WEBAPP_FOLDER "\tmpwebapp-test"

static function createXMLFile(anSize)
	local oFileXML
	Local cRootPath := GetTempPath(.F.)
	Local cFile     := cRootPath + "\test_"+strtran(time(), ":", "_")+".xml"
	Local cContent  := ""
	local i

	if anSize == 0
		cContent := '<?xml version="1.0" encoding="UTF-8"?><root><element>Sample XML content</element></root>'
	else
		cContent := '<?xml version="1.0" encoding="UTF-8"?><root>'
		for i := 1 to anSize
			cContent += '<element seg="'+str(i)+'">Element ' + str(i) + '</element>'
		next
		cContent += '</root>'
	endIf

	ofileXML := FCreate(cFile)
	If ofileXML > 0
		FWrite(ofileXML, cContent)
		FClose(ofileXML)
	else
		u_remoteLog("Erro ao criar arquivo XML", {{ "cFile", cFile }})
		return
	endIf

return cFile

static function createDialog(acFile)
	local oDlg := TDialog():New(0,0,500,500,'TXMLViewer',,,,,,,,,.T.)
	local oXml

	oXml := TXMLViewer():New(SAY_ROW(1), SAY_COL, oDlg, acFile, 200, 250, .T.)
	oXml:cName := "oXmlViewer"
	oXml:cReadVar := "oXmlViewer"

	if !oXml:setXML(acFile)
		u_remoteLog("TXMLViewer:setXML falhou")
	EndIf

return { oDlg, oXml }

