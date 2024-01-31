#INCLUDE "protheus.ch"
#INCLUDE "apwebsrv.ch"

/* ===============================================================================
WSDL Location    http://www.dneonline.com/calculator.asmx?WSDL
Gerado em        31/01/24 16:01:06
Observa��es      C�digo-Fonte gerado por ADVPL WSDL Client 1.120703
                 Altera��es neste arquivo podem causar funcionamento incorreto
                 e ser�o perdidas caso o c�digo-fonte seja gerado novamente.
=============================================================================== */

User Function _WQFJDMR ; Return  // "dummy" function - Internal Use 

/* -------------------------------------------------------------------------------
WSDL Service WSCalculator
------------------------------------------------------------------------------- */

WSCLIENT WSCalculator

	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD RESET
	WSMETHOD CLONE
	WSMETHOD Add
	WSMETHOD Subtract
	WSMETHOD Multiply
	WSMETHOD Divide

	WSDATA   _URL                      AS String
	WSDATA   _HEADOUT                  AS Array of String
	WSDATA   _COOKIES                  AS Array of String
	WSDATA   nintA                     AS int
	WSDATA   nintB                     AS int
	WSDATA   nAddResult                AS int
	WSDATA   nSubtractResult           AS int
	WSDATA   nMultiplyResult           AS int
	WSDATA   nDivideResult             AS int

ENDWSCLIENT

WSMETHOD NEW WSCLIENT WSCalculator
::Init()
If !FindFunction("XMLCHILDEX")
	UserException("O C�digo-Fonte Client atual requer os execut�veis do Protheus Build [7.00.210324P-20231005] ou superior. Atualize o Protheus ou gere o C�digo-Fonte novamente utilizando o Build atual.")
EndIf
Return Self

WSMETHOD INIT WSCLIENT WSCalculator
Return

WSMETHOD RESET WSCLIENT WSCalculator
	::nintA              := NIL 
	::nintB              := NIL 
	::nAddResult         := NIL 
	::nSubtractResult    := NIL 
	::nMultiplyResult    := NIL 
	::nDivideResult      := NIL 
	::Init()
Return

WSMETHOD CLONE WSCLIENT WSCalculator
Local oClone := WSCalculator():New()
	oClone:_URL          := ::_URL 
	oClone:nintA         := ::nintA
	oClone:nintB         := ::nintB
	oClone:nAddResult    := ::nAddResult
	oClone:nSubtractResult := ::nSubtractResult
	oClone:nMultiplyResult := ::nMultiplyResult
	oClone:nDivideResult := ::nDivideResult
Return oClone

// WSDL Method Add of Service WSCalculator

WSMETHOD Add WSSEND nintA,nintB WSRECEIVE nAddResult WSCLIENT WSCalculator
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<Add xmlns="http://tempuri.org/">'
cSoap += WSSoapValue("intA", ::nintA, nintA , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("intB", ::nintB, nintB , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += "</Add>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"http://tempuri.org/Add",; 
	"DOCUMENT","http://tempuri.org/",,,; 
	"http://www.dneonline.com/calculator.asmx")

::Init()
::nAddResult         :=  WSAdvValue( oXmlRet,"_ADDRESPONSE:_ADDRESULT:TEXT","int",NIL,NIL,NIL,NIL,NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method Subtract of Service WSCalculator

WSMETHOD Subtract WSSEND nintA,nintB WSRECEIVE nSubtractResult WSCLIENT WSCalculator
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<Subtract xmlns="http://tempuri.org/">'
cSoap += WSSoapValue("intA", ::nintA, nintA , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("intB", ::nintB, nintB , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += "</Subtract>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"http://tempuri.org/Subtract",; 
	"DOCUMENT","http://tempuri.org/",,,; 
	"http://www.dneonline.com/calculator.asmx")

::Init()
::nSubtractResult    :=  WSAdvValue( oXmlRet,"_SUBTRACTRESPONSE:_SUBTRACTRESULT:TEXT","int",NIL,NIL,NIL,NIL,NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method Multiply of Service WSCalculator

WSMETHOD Multiply WSSEND nintA,nintB WSRECEIVE nMultiplyResult WSCLIENT WSCalculator
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<Multiply xmlns="http://tempuri.org/">'
cSoap += WSSoapValue("intA", ::nintA, nintA , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("intB", ::nintB, nintB , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += "</Multiply>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"http://tempuri.org/Multiply",; 
	"DOCUMENT","http://tempuri.org/",,,; 
	"http://www.dneonline.com/calculator.asmx")

::Init()
::nMultiplyResult    :=  WSAdvValue( oXmlRet,"_MULTIPLYRESPONSE:_MULTIPLYRESULT:TEXT","int",NIL,NIL,NIL,NIL,NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method Divide of Service WSCalculator

WSMETHOD Divide WSSEND nintA,nintB WSRECEIVE nDivideResult WSCLIENT WSCalculator
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<Divide xmlns="http://tempuri.org/">'
cSoap += WSSoapValue("intA", ::nintA, nintA , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("intB", ::nintB, nintB , "int", .T. , .F., 0 , NIL, .F.,.F.) 
cSoap += "</Divide>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"http://tempuri.org/Divide",; 
	"DOCUMENT","http://tempuri.org/",,,; 
	"http://www.dneonline.com/calculator.asmx")

::Init()
::nDivideResult      :=  WSAdvValue( oXmlRet,"_DIVIDERESPONSE:_DIVIDERESULT:TEXT","int",NIL,NIL,NIL,NIL,NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.



