#INCLUDE "protheus.ch"
#INCLUDE "apwebsrv.ch"

/* ===============================================================================
WSDL Location    \tmptdsspon010124835/FachadaWSSGS09-01-2024-17-32-13.wsdl
Gerado em        09/01/24 17:32:14
Observa��es      C�digo-Fonte gerado por ADVPL WSDL Client 1.120703
                 Altera��es neste arquivo podem causar funcionamento incorreto
                 e ser�o perdidas caso o c�digo-fonte seja gerado novamente.
=============================================================================== */

User Function _IXNRKSM ; Return  // "dummy" function - Internal Use 

/* -------------------------------------------------------------------------------
WSDL Service WSFachadaWSSGSService
------------------------------------------------------------------------------- */

WSCLIENT WSFachadaWSSGSService

	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD RESET
	WSMETHOD CLONE
	WSMETHOD getValoresSeriesVO
	WSMETHOD getUltimosValoresSerieVO
	WSMETHOD getValoresSeriesXML
	WSMETHOD getUltimoValorVO
	WSMETHOD getUltimoValorXML
	WSMETHOD getValor
	WSMETHOD getValorEspecial

	WSDATA   _URL                      AS String
	WSDATA   _CERT                     AS String
	WSDATA   _PRIVKEY                  AS String
	WSDATA   _PASSPHRASE               AS String
	WSDATA   _HEADOUT                  AS Array of String
	WSDATA   _COOKIES                  AS Array of String
	WSDATA   oWSgetValoresSeriesVOin0  AS FachadaWSSGSService_ArrayOfflong
	WSDATA   cin1                      AS string
	WSDATA   cin2                      AS string
	WSDATA   oWSgetValoresSeriesVOReturn AS FachadaWSSGSService_ArrayOffWSSerieVO
	WSDATA   nin0                      AS long
	WSDATA   oWSgetUltimosValoresSerieVOReturn AS FachadaWSSGSService_WSSerieVO
	WSDATA   oWSgetValoresSeriesXMLin0 AS FachadaWSSGSService_ArrayOfflong
	WSDATA   cgetValoresSeriesXMLReturn AS string
	WSDATA   oWSgetUltimoValorVOReturn AS FachadaWSSGSService_WSSerieVO
	WSDATA   cgetUltimoValorXMLReturn  AS string
	WSDATA   ngetValorReturn           AS decimal
	WSDATA   ngetValorEspecialReturn   AS decimal

ENDWSCLIENT

WSMETHOD NEW WSCLIENT WSFachadaWSSGSService
::Init()
If !FindFunction("XMLCHILDEX")
	UserException("O C�digo-Fonte Client atual requer os execut�veis do Protheus Build [7.00.210324P-20231005] ou superior. Atualize o Protheus ou gere o C�digo-Fonte novamente utilizando o Build atual.")
EndIf
Return Self

WSMETHOD INIT WSCLIENT WSFachadaWSSGSService
	::oWSgetValoresSeriesVOin0 := FachadaWSSGSService_ARRAYOFFLONG():New()
	::oWSgetValoresSeriesVOReturn := FachadaWSSGSService_ARRAYOFFWSSERIEVO():New()
	::oWSgetUltimosValoresSerieVOReturn := FachadaWSSGSService_WSSERIEVO():New()
	::oWSgetValoresSeriesXMLin0 := FachadaWSSGSService_ARRAYOFFLONG():New()
	::oWSgetUltimoValorVOReturn := FachadaWSSGSService_WSSERIEVO():New()
Return

WSMETHOD RESET WSCLIENT WSFachadaWSSGSService
	::oWSgetValoresSeriesVOin0 := NIL 
	::cin1               := NIL 
	::cin2               := NIL 
	::oWSgetValoresSeriesVOReturn := NIL 
	::nin0               := NIL 
	::oWSgetUltimosValoresSerieVOReturn := NIL 
	::oWSgetValoresSeriesXMLin0 := NIL 
	::cgetValoresSeriesXMLReturn := NIL 
	::oWSgetUltimoValorVOReturn := NIL 
	::cgetUltimoValorXMLReturn := NIL 
	::ngetValorReturn    := NIL 
	::ngetValorEspecialReturn := NIL 
	::Init()
Return

WSMETHOD CLONE WSCLIENT WSFachadaWSSGSService
Local oClone := WSFachadaWSSGSService():New()
	oClone:_URL          := ::_URL 
	oClone:_CERT         := ::_CERT 
	oClone:_PRIVKEY      := ::_PRIVKEY 
	oClone:_PASSPHRASE   := ::_PASSPHRASE 
	oClone:oWSgetValoresSeriesVOin0 :=  IIF(::oWSgetValoresSeriesVOin0 = NIL , NIL ,::oWSgetValoresSeriesVOin0:Clone() )
	oClone:cin1          := ::cin1
	oClone:cin2          := ::cin2
	oClone:oWSgetValoresSeriesVOReturn :=  IIF(::oWSgetValoresSeriesVOReturn = NIL , NIL ,::oWSgetValoresSeriesVOReturn:Clone() )
	oClone:nin0          := ::nin0
	oClone:oWSgetUltimosValoresSerieVOReturn :=  IIF(::oWSgetUltimosValoresSerieVOReturn = NIL , NIL ,::oWSgetUltimosValoresSerieVOReturn:Clone() )
	oClone:oWSgetValoresSeriesXMLin0 :=  IIF(::oWSgetValoresSeriesXMLin0 = NIL , NIL ,::oWSgetValoresSeriesXMLin0:Clone() )
	oClone:cgetValoresSeriesXMLReturn := ::cgetValoresSeriesXMLReturn
	oClone:oWSgetUltimoValorVOReturn :=  IIF(::oWSgetUltimoValorVOReturn = NIL , NIL ,::oWSgetUltimoValorVOReturn:Clone() )
	oClone:cgetUltimoValorXMLReturn := ::cgetUltimoValorXMLReturn
	oClone:ngetValorReturn := ::ngetValorReturn
	oClone:ngetValorEspecialReturn := ::ngetValorEspecialReturn
Return oClone

// WSDL Method getValoresSeriesVO of Service WSFachadaWSSGSService

WSMETHOD getValoresSeriesVO WSSEND oWSgetValoresSeriesVOin0,cin1,cin2 WSRECEIVE oWSgetValoresSeriesVOReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getValoresSeriesVO xmlns:q1="http://publico.ws.casosdeuso.sgs.pec.bcb.gov.br">'
cSoap += WSSoapValue("in0", ::oWSgetValoresSeriesVOin0, oWSgetValoresSeriesVOin0 , "ArrayOfflong", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in1", ::cin1, cin1 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in2", ::cin2, cin2 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getValoresSeriesVO>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::oWSgetValoresSeriesVOReturn:SoapRecv( WSAdvValue( oXmlRet,"_GETVALORESSERIESVORETURN","ArrayOffWSSerieVO",NIL,NIL,NIL,"O",NIL,NIL) )

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method getUltimosValoresSerieVO of Service WSFachadaWSSGSService

WSMETHOD getUltimosValoresSerieVO WSSEND nin0,nin1 WSRECEIVE oWSgetUltimosValoresSerieVOReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getUltimosValoresSerieVO xmlns:q1="http://publico.ws.casosdeuso.sgs.pec.bcb.gov.br">'
cSoap += WSSoapValue("in0", ::nin0, nin0 , "long", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in1", ::nin1, nin1 , "long", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getUltimosValoresSerieVO>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::oWSgetUltimosValoresSerieVOReturn:SoapRecv( WSAdvValue( oXmlRet,"_GETULTIMOSVALORESSERIEVORETURN","WSSerieVO",NIL,NIL,NIL,"O",NIL,NIL) )

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method getValoresSeriesXML of Service WSFachadaWSSGSService

WSMETHOD getValoresSeriesXML WSSEND oWSgetValoresSeriesXMLin0,cin1,cin2 WSRECEIVE cgetValoresSeriesXMLReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getValoresSeriesXML xmlns:q1="http://publico.ws.casosdeuso.sgs.pec.bcb.gov.br">'
cSoap += WSSoapValue("in0", ::oWSgetValoresSeriesXMLin0, oWSgetValoresSeriesXMLin0 , "ArrayOfflong", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in1", ::cin1, cin1 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in2", ::cin2, cin2 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getValoresSeriesXML>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::cgetValoresSeriesXMLReturn :=  WSAdvValue( oXmlRet,"_GETVALORESSERIESXMLRETURN","string",NIL,NIL,NIL,"S",NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method getUltimoValorVO of Service WSFachadaWSSGSService

WSMETHOD getUltimoValorVO WSSEND nin0 WSRECEIVE oWSgetUltimoValorVOReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getUltimoValorVO xmlns:q1="http://www.w3.org/2001/XMLSchema">'
cSoap += WSSoapValue("in0", ::nin0, nin0 , "long", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getUltimoValorVO>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::oWSgetUltimoValorVOReturn:SoapRecv( WSAdvValue( oXmlRet,"_GETULTIMOVALORVORETURN","WSSerieVO",NIL,NIL,NIL,"O",NIL,NIL) )

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method getUltimoValorXML of Service WSFachadaWSSGSService

WSMETHOD getUltimoValorXML WSSEND nin0 WSRECEIVE cgetUltimoValorXMLReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getUltimoValorXML xmlns:q1="http://www.w3.org/2001/XMLSchema">'
cSoap += WSSoapValue("in0", ::nin0, nin0 , "long", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getUltimoValorXML>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::cgetUltimoValorXMLReturn :=  WSAdvValue( oXmlRet,"_GETULTIMOVALORXMLRETURN","string",NIL,NIL,NIL,"S",NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method getValor of Service WSFachadaWSSGSService

WSMETHOD getValor WSSEND nin0,cin1 WSRECEIVE ngetValorReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getValor xmlns:q1="http://publico.ws.casosdeuso.sgs.pec.bcb.gov.br">'
cSoap += WSSoapValue("in0", ::nin0, nin0 , "long", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in1", ::cin1, cin1 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getValor>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::ngetValorReturn    :=  WSAdvValue( oXmlRet,"_GETVALORRETURN","decimal",NIL,NIL,NIL,"N",NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.

// WSDL Method getValorEspecial of Service WSFachadaWSSGSService

WSMETHOD getValorEspecial WSSEND nin0,cin1,cin2 WSRECEIVE ngetValorEspecialReturn WSCLIENT WSFachadaWSSGSService
Local cSoap := "" , oXmlRet

BEGIN WSMETHOD

cSoap += '<q1:getValorEspecial xmlns:q1="http://publico.ws.casosdeuso.sgs.pec.bcb.gov.br">'
cSoap += WSSoapValue("in0", ::nin0, nin0 , "long", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in1", ::cin1, cin1 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += WSSoapValue("in2", ::cin2, cin2 , "string", .T. , .T. , 0 , NIL, .F.,.F.) 
cSoap += "</q1:getValorEspecial>"

oXmlRet := SvcSoapCall(Self,cSoap,; 
	"",; 
	"RPCX","https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS",,,; 
	"https://www3.bcb.gov.br/wssgs/services/FachadaWSSGS")

::Init()
::ngetValorEspecialReturn :=  WSAdvValue( oXmlRet,"_GETVALORESPECIALRETURN","decimal",NIL,NIL,NIL,"N",NIL,NIL) 

END WSMETHOD

oXmlRet := NIL
Return .T.


// WSDL Data Structure ArrayOfflong

WSSTRUCT FachadaWSSGSService_ArrayOfflong
	WSDATA   nlong                     AS long OPTIONAL
	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD CLONE
	WSMETHOD SOAPSEND
ENDWSSTRUCT

WSMETHOD NEW WSCLIENT FachadaWSSGSService_ArrayOfflong
	::Init()
Return Self

WSMETHOD INIT WSCLIENT FachadaWSSGSService_ArrayOfflong
	::nlong                := {} // Array Of  0
Return

WSMETHOD CLONE WSCLIENT FachadaWSSGSService_ArrayOfflong
	Local oClone := FachadaWSSGSService_ArrayOfflong():NEW()
	oClone:nlong                := IIf(::nlong <> NIL , aClone(::nlong) , NIL )
Return oClone

WSMETHOD SOAPSEND WSCLIENT FachadaWSSGSService_ArrayOfflong
	Local cSoap := ""
	aEval( ::nlong , {|x| cSoap := cSoap  +  WSSoapValue("long", x , x , "long", .F. , .T., 0 , NIL, .F.,.F.)  } ) 
Return cSoap

// WSDL Data Structure ArrayOffWSSerieVO

WSSTRUCT FachadaWSSGSService_ArrayOffWSSerieVO
	WSDATA   oWSWSSerieVO              AS FachadaWSSGSService_WSSerieVO OPTIONAL
	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD CLONE
	WSMETHOD SOAPRECV
ENDWSSTRUCT

WSMETHOD NEW WSCLIENT FachadaWSSGSService_ArrayOffWSSerieVO
	::Init()
Return Self

WSMETHOD INIT WSCLIENT FachadaWSSGSService_ArrayOffWSSerieVO
	::oWSWSSerieVO         := {} // Array Of  FachadaWSSGSService_WSSERIEVO():New()
Return

WSMETHOD CLONE WSCLIENT FachadaWSSGSService_ArrayOffWSSerieVO
	Local oClone := FachadaWSSGSService_ArrayOffWSSerieVO():NEW()
	oClone:oWSWSSerieVO := NIL
	If ::oWSWSSerieVO <> NIL 
		oClone:oWSWSSerieVO := {}
		aEval( ::oWSWSSerieVO , { |x| aadd( oClone:oWSWSSerieVO , x:Clone() ) } )
	Endif 
Return oClone

WSMETHOD SOAPRECV WSSEND oResponse WSCLIENT FachadaWSSGSService_ArrayOffWSSerieVO
	Local nRElem1 , nTElem1
	Local aNodes1 := WSRPCGetNode(oResponse,.T.)
	::Init()
	If oResponse = NIL ; Return ; Endif 
	nTElem1 := len(aNodes1)
	For nRElem1 := 1 to nTElem1 
		If !WSIsNilNode( aNodes1[nRElem1] )
			aadd(::oWSWSSerieVO , FachadaWSSGSService_WSSerieVO():New() )
  			::oWSWSSerieVO[len(::oWSWSSerieVO)]:SoapRecv(aNodes1[nRElem1])
		Endif
	Next
Return

// WSDL Data Structure WSSerieVO

WSSTRUCT FachadaWSSGSService_WSSerieVO
	WSDATA   nanoFim                   AS int OPTIONAL
	WSDATA   nanoInicio                AS int OPTIONAL
	WSDATA   caviso                    AS string OPTIONAL
	WSDATA   ndiaFim                   AS int OPTIONAL
	WSDATA   ndiaInicio                AS int OPTIONAL
	WSDATA   lespecial                 AS boolean OPTIONAL
	WSDATA   cfonte                    AS string OPTIONAL
	WSDATA   cfullName                 AS string OPTIONAL
	WSDATA   cgestorProprietario       AS string OPTIONAL
	WSDATA   nmesFim                   AS int OPTIONAL
	WSDATA   nmesInicio                AS int OPTIONAL
	WSDATA   cnomeAbreviado            AS string OPTIONAL
	WSDATA   cnomeCompleto             AS string OPTIONAL
	WSDATA   noid                      AS long OPTIONAL
	WSDATA   cperiodicidade            AS string OPTIONAL
	WSDATA   cperiodicidadeSigla       AS string OPTIONAL
	WSDATA   lpossuiBloqueios          AS boolean OPTIONAL
	WSDATA   lpublica                  AS boolean OPTIONAL
	WSDATA   cshortName                AS string OPTIONAL
	WSDATA   oWSultimoValor            AS FachadaWSSGSService_WSValorSerieVO OPTIONAL
	WSDATA   cunidadePadrao            AS string OPTIONAL
	WSDATA   cunidadePadraoIngles      AS string OPTIONAL
	WSDATA   lvalorDiaNaoUtil          AS boolean OPTIONAL
	WSDATA   oWSvalores                AS FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO OPTIONAL
	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD CLONE
	WSMETHOD SOAPRECV
ENDWSSTRUCT

WSMETHOD NEW WSCLIENT FachadaWSSGSService_WSSerieVO
	::Init()
Return Self

WSMETHOD INIT WSCLIENT FachadaWSSGSService_WSSerieVO
Return

WSMETHOD CLONE WSCLIENT FachadaWSSGSService_WSSerieVO
	Local oClone := FachadaWSSGSService_WSSerieVO():NEW()
	oClone:nanoFim              := ::nanoFim
	oClone:nanoInicio           := ::nanoInicio
	oClone:caviso               := ::caviso
	oClone:ndiaFim              := ::ndiaFim
	oClone:ndiaInicio           := ::ndiaInicio
	oClone:lespecial            := ::lespecial
	oClone:cfonte               := ::cfonte
	oClone:cfullName            := ::cfullName
	oClone:cgestorProprietario  := ::cgestorProprietario
	oClone:nmesFim              := ::nmesFim
	oClone:nmesInicio           := ::nmesInicio
	oClone:cnomeAbreviado       := ::cnomeAbreviado
	oClone:cnomeCompleto        := ::cnomeCompleto
	oClone:noid                 := ::noid
	oClone:cperiodicidade       := ::cperiodicidade
	oClone:cperiodicidadeSigla  := ::cperiodicidadeSigla
	oClone:lpossuiBloqueios     := ::lpossuiBloqueios
	oClone:lpublica             := ::lpublica
	oClone:cshortName           := ::cshortName
	oClone:oWSultimoValor       := IIF(::oWSultimoValor = NIL , NIL , ::oWSultimoValor:Clone() )
	oClone:cunidadePadrao       := ::cunidadePadrao
	oClone:cunidadePadraoIngles := ::cunidadePadraoIngles
	oClone:lvalorDiaNaoUtil     := ::lvalorDiaNaoUtil
	oClone:oWSvalores           := IIF(::oWSvalores = NIL , NIL , ::oWSvalores:Clone() )
Return oClone

WSMETHOD SOAPRECV WSSEND oResponse WSCLIENT FachadaWSSGSService_WSSerieVO
	Local oNode20
	Local oNode24
	::Init()
	If oResponse = NIL ; Return ; Endif 
	::nanoFim            :=  WSAdvValue( oResponse,"_ANOFIM","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::nanoInicio         :=  WSAdvValue( oResponse,"_ANOINICIO","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::caviso             :=  WSAdvValue( oResponse,"_AVISO","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::ndiaFim            :=  WSAdvValue( oResponse,"_DIAFIM","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::ndiaInicio         :=  WSAdvValue( oResponse,"_DIAINICIO","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::lespecial          :=  WSAdvValue( oResponse,"_ESPECIAL","boolean",NIL,NIL,NIL,"L",NIL,NIL) 
	::cfonte             :=  WSAdvValue( oResponse,"_FONTE","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::cfullName          :=  WSAdvValue( oResponse,"_FULLNAME","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::cgestorProprietario :=  WSAdvValue( oResponse,"_GESTORPROPRIETARIO","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::nmesFim            :=  WSAdvValue( oResponse,"_MESFIM","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::nmesInicio         :=  WSAdvValue( oResponse,"_MESINICIO","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::cnomeAbreviado     :=  WSAdvValue( oResponse,"_NOMEABREVIADO","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::cnomeCompleto      :=  WSAdvValue( oResponse,"_NOMECOMPLETO","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::noid               :=  WSAdvValue( oResponse,"_OID","long",NIL,NIL,NIL,"N",NIL,NIL) 
	::cperiodicidade     :=  WSAdvValue( oResponse,"_PERIODICIDADE","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::cperiodicidadeSigla :=  WSAdvValue( oResponse,"_PERIODICIDADESIGLA","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::lpossuiBloqueios   :=  WSAdvValue( oResponse,"_POSSUIBLOQUEIOS","boolean",NIL,NIL,NIL,"L",NIL,NIL) 
	::lpublica           :=  WSAdvValue( oResponse,"_PUBLICA","boolean",NIL,NIL,NIL,"L",NIL,NIL) 
	::cshortName         :=  WSAdvValue( oResponse,"_SHORTNAME","string",NIL,NIL,NIL,"S",NIL,NIL) 
	oNode20 :=  WSAdvValue( oResponse,"_ULTIMOVALOR","WSValorSerieVO",NIL,NIL,NIL,"O",NIL,NIL) 
	If oNode20 != NIL
		::oWSultimoValor := FachadaWSSGSService_WSValorSerieVO():New()
		::oWSultimoValor:SoapRecv(oNode20)
	EndIf
	::cunidadePadrao     :=  WSAdvValue( oResponse,"_UNIDADEPADRAO","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::cunidadePadraoIngles :=  WSAdvValue( oResponse,"_UNIDADEPADRAOINGLES","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::lvalorDiaNaoUtil   :=  WSAdvValue( oResponse,"_VALORDIANAOUTIL","boolean",NIL,NIL,NIL,"L",NIL,NIL) 
	oNode24 :=  WSAdvValue( oResponse,"_VALORES","ArrayOf_tns2_WSValorSerieVO",NIL,NIL,NIL,"O",NIL,NIL) 
	If oNode24 != NIL
		::oWSvalores := FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO():New()
		::oWSvalores:SoapRecv(oNode24)
	EndIf
Return

// WSDL Data Structure WSValorSerieVO

WSSTRUCT FachadaWSSGSService_WSValorSerieVO
	WSDATA   nano                      AS int OPTIONAL
	WSDATA   nanoFim                   AS int OPTIONAL
	WSDATA   lbloqueado                AS boolean OPTIONAL
	WSDATA   lbloqueioLiberado         AS boolean OPTIONAL
	WSDATA   ndia                      AS int OPTIONAL
	WSDATA   ndiaFim                   AS int OPTIONAL
	WSDATA   nmes                      AS int OPTIONAL
	WSDATA   nmesFim                   AS int OPTIONAL
	WSDATA   noid                      AS long OPTIONAL
	WSDATA   noidSerie                 AS long OPTIONAL
	WSDATA   csvalor                   AS string OPTIONAL
	WSDATA   nvalor                    AS decimal OPTIONAL
	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD CLONE
	WSMETHOD SOAPRECV
ENDWSSTRUCT

WSMETHOD NEW WSCLIENT FachadaWSSGSService_WSValorSerieVO
	::Init()
Return Self

WSMETHOD INIT WSCLIENT FachadaWSSGSService_WSValorSerieVO
Return

WSMETHOD CLONE WSCLIENT FachadaWSSGSService_WSValorSerieVO
	Local oClone := FachadaWSSGSService_WSValorSerieVO():NEW()
	oClone:nano                 := ::nano
	oClone:nanoFim              := ::nanoFim
	oClone:lbloqueado           := ::lbloqueado
	oClone:lbloqueioLiberado    := ::lbloqueioLiberado
	oClone:ndia                 := ::ndia
	oClone:ndiaFim              := ::ndiaFim
	oClone:nmes                 := ::nmes
	oClone:nmesFim              := ::nmesFim
	oClone:noid                 := ::noid
	oClone:noidSerie            := ::noidSerie
	oClone:csvalor              := ::csvalor
	oClone:nvalor               := ::nvalor
Return oClone

WSMETHOD SOAPRECV WSSEND oResponse WSCLIENT FachadaWSSGSService_WSValorSerieVO
	::Init()
	If oResponse = NIL ; Return ; Endif 
	::nano               :=  WSAdvValue( oResponse,"_ANO","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::nanoFim            :=  WSAdvValue( oResponse,"_ANOFIM","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::lbloqueado         :=  WSAdvValue( oResponse,"_BLOQUEADO","boolean",NIL,NIL,NIL,"L",NIL,NIL) 
	::lbloqueioLiberado  :=  WSAdvValue( oResponse,"_BLOQUEIOLIBERADO","boolean",NIL,NIL,NIL,"L",NIL,NIL) 
	::ndia               :=  WSAdvValue( oResponse,"_DIA","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::ndiaFim            :=  WSAdvValue( oResponse,"_DIAFIM","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::nmes               :=  WSAdvValue( oResponse,"_MES","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::nmesFim            :=  WSAdvValue( oResponse,"_MESFIM","int",NIL,NIL,NIL,"N",NIL,NIL) 
	::noid               :=  WSAdvValue( oResponse,"_OID","long",NIL,NIL,NIL,"N",NIL,NIL) 
	::noidSerie          :=  WSAdvValue( oResponse,"_OIDSERIE","long",NIL,NIL,NIL,"N",NIL,NIL) 
	::csvalor            :=  WSAdvValue( oResponse,"_SVALOR","string",NIL,NIL,NIL,"S",NIL,NIL) 
	::nvalor             :=  WSAdvValue( oResponse,"_VALOR","decimal",NIL,NIL,NIL,"N",NIL,NIL) 
Return

// WSDL Data Structure ArrayOf_tns2_WSValorSerieVO

WSSTRUCT FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO
	WSDATA   oWSWSValorSerieVO         AS FachadaWSSGSService_WSValorSerieVO OPTIONAL
	WSMETHOD NEW
	WSMETHOD INIT
	WSMETHOD CLONE
	WSMETHOD SOAPRECV
ENDWSSTRUCT

WSMETHOD NEW WSCLIENT FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO
	::Init()
Return Self

WSMETHOD INIT WSCLIENT FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO
	::oWSWSValorSerieVO    := {} // Array Of  FachadaWSSGSService_WSVALORSERIEVO():New()
Return

WSMETHOD CLONE WSCLIENT FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO
	Local oClone := FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO():NEW()
	oClone:oWSWSValorSerieVO := NIL
	If ::oWSWSValorSerieVO <> NIL 
		oClone:oWSWSValorSerieVO := {}
		aEval( ::oWSWSValorSerieVO , { |x| aadd( oClone:oWSWSValorSerieVO , x:Clone() ) } )
	Endif 
Return oClone

WSMETHOD SOAPRECV WSSEND oResponse WSCLIENT FachadaWSSGSService_ArrayOf_tns2_WSValorSerieVO
	Local nRElem1 , nTElem1
	Local aNodes1 := WSRPCGetNode(oResponse,.T.)
	::Init()
	If oResponse = NIL ; Return ; Endif 
	nTElem1 := len(aNodes1)
	For nRElem1 := 1 to nTElem1 
		If !WSIsNilNode( aNodes1[nRElem1] )
			aadd(::oWSWSValorSerieVO , FachadaWSSGSService_WSValorSerieVO():New() )
  			::oWSWSValorSerieVO[len(::oWSWSValorSerieVO)]:SoapRecv(aNodes1[nRElem1])
		Endif
	Next
Return


