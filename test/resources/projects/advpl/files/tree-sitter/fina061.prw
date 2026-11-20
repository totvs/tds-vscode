#INCLUDE "FINA060.ch"
#INCLUDE "PROTHEUS.ch"
#INCLUDE "FONT.CH"
#INCLUDE "COLORS.CH"
#INCLUDE "FWMVCDEF.CH"
#INCLUDE "FWLIBVERSION.CH"
#INCLUDE "FWMBROWSE.CH"

Static lFWCodFil 	:= .T.
Static aSelFil		:= {}
Static dLastPcc  	:= CTOD("22/06/2015")

Static _oFina06101
Static _oFina06102
Static _lExistVA 	  := .F.
Static _lF060Exit	  := .F.
Static _lFA60Fil	  := .F.
Static _lF060CpBor	:= .F.
Static _lTFA60BDE	  := .F.
Static _lFA60BDE	  := .F.
Static _lFA60Can1	  := .F.
Static _lTFA60Can2	:= .F.
Static _lFA60Can2	  := .F.
Static _lVlBcoApi   := .F.
Static _lVlCGCEmp   := .F.
Static _lVlBolPix   := .F.
Static __l241Canc   := Nil
Static _oBorDtCan	  := Nil
//Motor de retenções
//=====================
Static __lMotRet 	  := .F.
Static __lPccMR 	  := .F.
Static __lPccBxMR 	:= .F.
Static __lIrfMR 	  := .F.
Static __lIrfBxMR 	:= .F.
Static __lImpBxMT	  := .F.
Static __aImpos 	  := {}
Static __nTotImp    := 0

// rever a necessidade
Static __nPisCaMR   := 0
Static __nCofCaMR   := 0
Static __nCslCaMR   := 0
Static __nIrfCaMR   := 0
Static __nImpMT     := 0
Static __nVlImpMt   := 0
Static _lTitTemPIX  := Nil
Static _cSitPIX     := Nil
Static _lBCOApi     := .F.
Static _lMetric     := .F.
Static __F713TPix   As Logical
//=====================
Static _lbrCanUse   As Logical

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ FINA061	³ Autor ³ Andrea V. Santiago    ³ Data ³ 10/06/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Transfere portador , situa‡„o e cria Bordero    			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FINA061()												  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FinA061(nPosArotina,lAutomato)

Local cFilter		:= ""
Local bFiltraBrw	:= {||}
Local aIndexFil		:= {}
	
//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³VERIFICA SE A FUNCAO QUE ESTA CHAMANDO E A FINA740³
//³NECESSARIO PARA NAO DUPLICAR VARIAVEL             ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

If ! ISINCALLSTACK('FINA740') .Or. AllTrim(ProcName(8)) <> "FINA740"
	Private lF060LOOP := .T.
Endif
//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Define Array contendo as Rotinas a executar do programa 	  ³
//³ ----------- Elementos contidos por dimens„o ------------	  ³
//³ 1. Nome a aparecer no cabe‡alho 							  ³
//³ 2. Nome da Rotina associada									  ³
//³ 3. Usado pela rotina										  ³
//³ 4. Tipo de Transa‡„o a ser efetuada							  ³
//³	 1 - Pesquisa e Posiciona em uma Cota‡„o					  ³
//³	 4 - Analisa e/ou encerra uma cota‡„o						  ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
__lMotRet		:= ExistFunc("FTemMotor") .And. FTemMotor()
Private aRotina := MenuDef()
Private cCodDiario :=""
Private cFil060

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Variaveis Relativas ao Entidades Bancarias (Junho/2012) ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
Private cBcoChq	  := Criavar("E1_BCOCHQ")
Private cAgeChq	  := Criavar("E1_AGECHQ")
Private cCtaChq	  := Criavar("E1_CTACHQ")

If cPaisLoc == "ARG"
	Private cPostal   := Criavar("E1_POSTAL")
EndIf

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ CARREGA FUNCAO PERGUNTE                               ³
//³ ----------------------------------------------------- ³
//³ mv_par01 - Mostra lan‡amento Contabil				  ³
//³ mv_par02 - Aglutina Lancamentos     				  ³
//³ mv_par03 - Contabiliza Transferencia 				  ³
//³ mv_par04 - Baixar Titulos Descont.   				  ³
//³ mv_par05 - Considera Filiais abaixo  				  ³
//³ mv_par06 - Filial de                 				  ³
//³ mv_par07 - Filial ate               				  ³
//³ mv_par08 - Considera Abatimentos (So Transferencia)   ³
//³ mv_par09 - Considera Acrescimos e Decrescimos		  ³
//³ mv_par10 - Considera Retencao Bancaria				  ³
//³ mv_par11 - Marcar Títulos Aut.?                       ³
//³ mv_par12 - Seleciona Tipos?                           ³
//³ mv_par13 - Seleciona Filiais?                         ³
//  MV_PAR14 - Contabiliza Online? 1=Sim;2=Não
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ

SetKey (VK_F12,{|a,b| AcessaPerg("FIN060",.T.)})

pergunte("FIN060",.F.)

PRIVATE cMarca		:= GetMark( )
PRIVATE lInverte	:= .F.
PRIVATE nPrazo		:= 0			  //para ponto de entrda
PRIVATE nPrazoMed	:= 0			  //idem
PRIVATE nTaxaDesc	:= 0			  //idem
PRIVATE VALOR	  	:= 0
PRIVATE VALOR2   	:= 0
PRIVATE PIS   := 0
PRIVATE COFINS   := 0
PRIVATE CSLL   := 0
PRIVATE nValdesc 	:= 0
PRIVATE aGets		:= {}
PRIVATE cLote		:= ""
PRIVATE dDataMov	:= dDataBase
PRIVATE nIndice		:= SE1->(Indexord())
PRIVATE lconsBco	:= GetMv("MV_CONSBCO")
PRIVATE nMoeda		:= 1
Private nMoedaBco	:= 1
Private nDecs		:= 2
Private nTxmoeda	:= 0
PRIVATE cPict06014	:= PesqPict("SE1","E1_VALOR",16,nMoeda)
PRIVATE cPict06018	:= PesqPict("SE1","E1_VALOR",TamSx3("E1_VALOR")[1],nMoeda)
PRIVATE nAbatim		:= 0
PRIVATE nDescont	:= 0
PRIVATE nJuros		:= 0
PRIVATE nMoedaBor	:= 1
PRIVATE IOF			:= 0
Private nIrrfFina061:= 0
Private nPisFina061	:= 0
Private nCofFina061	:= 0
Private nCslFina061	:= 0
Private aBaixaSE5 	:= {}
Private nPIS    	:= 0 // Variaveis Relativas a gravacao dos impostos (Junho/2013) ³
Private nCOFINS   	:= 0
Private nCSLL    	:= 0
Private nIrrf 		:= 0
Private nParciais 	:= 0
Private nValRec		:= 0
Private nOldValRec	:= 0
Private aDadosRef	:= Array(7)
Private aDadosRet	:= Array(7)
Private lRaRtImp  	:= FRaRtImp()     //Define se ha retencao de impostos PCC/IRPJ no R.A
Private aDadosTit	:= {}
Private cCadastro	:= "Borderô de Cobranças - Impostos"

DEFAULT nPosArotina := 0
DEFAULT lAutomato   := .F.

_lExistVA 	:= TableInDic("FKD") .and. TableInDic("FKC") .And. ExistFunc("FVALACESS")
_lMetric	:= FwLibVersion() >= "20210517"

LoteCont( "FIN" )
dbSelectArea("SE1")

If GetNewPar("MV_CNABIMP",.F.)
	Help(" ",1,"CNABIMP")//Não é permitido colocar títulos em borderô que gerem impostos, com o parâmetro MV_CNABIMP ativado.
	Return
Endif

// Validação para uso da api de boletos
If FindFunction("F713VldUso") .And. FindFunction("F713VldBco")
    _lBCOApi := F713VldUso()
EndIf

If __F713TPix == Nil
	__F713TPix := FindFunction("F713TemPix")
EndIf 

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Aplicacao de filtro para nao exibir os titulos do tipo RA ³
//³ das notas de adiantamento - Manejo de Anticipo            ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
If cPaisLoc == "MEX" .And. X3Usado("ED_OPERADT")
	cFilter := 'E1_TIPO != "'+Substr(MVRECANT,1,3)+'" .Or. '
	cFilter += '!Upper(Alltrim(E1_ORIGEM)) $ "FINA087A|'+IIF(FindFunction('OriCobrDiv'),OriCobrDiv(),"")+'" .Or. '
	cFilter += 'GetAdvFVal("SED","ED_OPERADT",xFilial("SED")+E1_NATUREZ,1,"") != "1" '
	bFiltraBrw := { || FilBrowse("SE1",@aIndexFil,@cFilter)}
	DbSelectArea("SE1")
	Eval(bFiltraBrw)
EndIf

If nPosArotina > 0 .And. lF060LOOP

	dbSelectArea('SE1')
	bBlock := &( "{ |a,b,c,d,e| " + aRotina[ nPosArotina,2 ] + "(a,b,c,d,e) }" )
	Eval( bBlock, Alias(), (Alias())->(Recno()),nPosArotina,lAutomato)

ElseIf nPosArotina = 0  .And. lF060LOOP

	IF ExistBlock("F060BROW")
		ExecBlock("F060BROW",.f.,.f.)
	Endif

    //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
    //³ Intervencao para o Requisito de Entidades Bancarias ³
    //³ Junho de 2012                                       ³
    //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	If hasSmartX()
		setSmartX()
	EndIf

    If cPaisLoc == "ARG"
       mBrowse( 6, 1,22,75,"SE1",,,,,,FA061Legend(),,,,{ || o:=GetMBrowse() ,o:SetNoBrowse( .T. ) } )
    Else
       mBrowse( 6, 1,22,75,"SE1",,,,,,FA061Legend(),,,, )
    EndIf
Else
	lF060LOOP := .T.
Endif

dbSelectArea("SE1")
dbSetOrder(1)	// devolve ordem principal
EvalGeneric()

//Limpa as variáveis estáticas utilizadas para o motor de retenções
LimpaVarMR()
Return

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061Borde³ Autor ³ Eveli Morasco 	    ³ Data ³ 06/05/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Define os borderos a serem enviados ao banco 			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061Borde(ExpC1,ExpN1,ExpN2) 							  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpC1 = Alias do arquivo									  ³±±
±±³			 ³ ExpN1 = N£mero do registro 								  ³±±
±±³			 ³ ExpN2 = Op‡„o selecionada no menu		--				  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA060													  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function Fa061Borde(cAlias,nReg,nOpcx,lAutomato)

Local cNumBor		:= Space(06)
Local cPadrao		:= ""
Local cSituacao		:= " "
Local cArquivo		:= ""
Local cContrato 	:= Space(15)
Local cCapital		:= ""
Local cFileWork		:= ""
Local cSequencia	:= ""
Local cPortAnt		:= ""
Local cAgAnt		:= ""
Local cContAnt		:= ""
Local cClearing		:= ""
Local cComboSit		:= ""
Local cSituant		:= ""
Local cCampoCli		:= " "
Local cProxNum		:= ""
Local nLimite		:= 0
local nC			:= 0
Local nValCred		:= 0
Local nValSaldo		:= 0
Local nTotal		:= 0
Local nHdlPrv		:= 0
Local nI			:= 0
Local nRegSE5		:= 0
Local nRegSE1		:= 0
Local nRegSEA		:= 0
Local nRetencao		:= 0
Local nPos			:= 0
Local nDias			:= 0
Local nAbat 		:= 0
Local nSaldo    	:= 0
Local nEspLarg	 	:= 0
Local nEspLin  		:= 0
Local dBase			:= dDatabase
Local aStru			:= {}
Local aCampos		:= {}
Local aTempos		:= {} //{"24"+OemToAnsi(STR0057),"48"+OemToAnsi(STR0057),"72"+OemToAnsi(STR0057),"96"+OemToAnsi(STR0057),"1 "+OemToAnsi(STR0059),OemToAnsi(STR0058)+"1"+OemToAnsi(STR0059)} // " Horas" # .....# " Semana" # "Mais de " # " Semana"
Local aFeriados		:= RetFeriados()
Local aAux			:= {}
Local aFlagCTB 		:= {}
Local aUserFils		:= GetBrwFils()
Local oValor		:= NIL
Local oPrazoMed		:= NIL
Local oCbx			:= NIL
Local lLanc			:= .F.
Local lPadrao		:= .F.
Local lSaida		:= .F.
Local lMarkAbt		:= .F.
Local lSelCpo		:= .F.
Local lFa060Se5		:= ExistBlock("FA060SE5")
Local lF060BOR		:= ExistBlock("F060BOR")
Local lF060Proc 	:= Existblock("F060PROC")
Local lF060ABT 		:= ExistBlock("F060ABT")
Local lF060SEA2 	:= ExistBlock("F060SEA2")
Local lF060SITUAC	:= ExistBlock("F060SITUAC")
Local lF060QRCP		:= ExistBlock("F060QRCP")
Local lF060TRB		:= Existblock("F060Trb")
Local cOrigemRM		:= Alltrim(GetNewPar("MV_RMORIG",""))
Local E1_SITUACA	:= ""
Local cTit			:= ""

// Requisito de Entidades Bancarias
Local lVerEntBanc	:= (cPaisLoc == "ARG")
Local nEntBanc    	:= If( lVerEntBanc, 14, 0 )   // Valor somado a nEspLin, na montagem da tela do Bordero

//Impostos
Local lIRPJBaixa	:= .F.
Local lPccBxCr 		:= FPccBxCr() //Controla o Pis Cofins e Csll na baixa  (1-Retem PCC na Baixa ou 2-Retem PCC na Emissão(default) )
Local aRetencao		:= {} //Armazena valores de titulos aculumados por baixas, acumulados por titulo no borderô corrente e  borderô gerados anteriormente acumulados.
Local nVlMinImp		:= GetNewPar("MV_VL10925",5000)
Local nOrdSe5		:= 0
Local nOrdSe1		:= 0
Local nVrTitRet		:= 0
Local cPrefixoOrig	:= ""
Local cNumOrig 		:= ""
Local cParcOrig		:= ""
Local cTipoOrig		:= ""
Local cCliOrig		:= ""
Local cLojaOrig		:= ""
Local aBaixa     	:= {}
Local nTotAdto   	:= 0
Local lBaixaAbat 	:= .F.
Local nVlrBaixa  	:= 0
Local lBxCec     	:= .F.
Local lBxLiq		:= .F.
Local lTipBxCP   	:= .F.
Local lSigaloja  	:= .F.
Local nTotBordAc	:= 0
Local nPisSE5		:= 0
Local nCofSE5		:= 0
Local nCsllSE5		:= 0
Local aBorAc		:= {}
Local nVrAc			:= 0
Local lGerTitAc		:= .F.
Local lRegSe5		:= .T.
Local lTpJur		:= .T.

//Gestao
Local lFa060Qry		:= Existblock("FA060QRY")
Local lGestao		:= Iif( lFWCodFil, FWSizeFilial() > 2, .F. )	// Indica se usa Gestao Corporativa
Local lSE1Access	:= Iif( lGestao, FWModeAccess("SE1",1) == "E", FWModeAccess("SE1",3) == "E")
Local cQueryADD		:= ""
Local nj			:= 0
Local aTmpFil		:= {}
Local cTmpSE1Fil	:= ""
Local cFilBack		:= cFilAnt

//Reestruturacao SE5
Local oModelBx		:= NIL
Local oSubFK1		:= NIL
Local oSubFKA		:= NIL
Local oSubFK3		:= NIL
Local oSubFK4		:= NIL
Local cCamposE5 	:= ""
Local lRet 			:= .T.
Local cChaveTit		:= ""
Local cChaveFK7		:= ""
Local cOrigem		:= FunName()
Local aImpostos		:= {}
Local nValBrt		:= 0
Local nX			:= 0
Local aAlt          := {}
Local aTitCalc		:= {}

//Integração SIGAPFS
Local lJFilBco      := ExistFunc("JurVldSA6") .And. SuperGetMv("MV_JFILBCO", .F., .F.) //Indica se filtra as contas correntes vinculadas ao escritório logado - SIGAPFS
Local lJurXFin      := SuperGetMv("MV_JURXFIN",,.F.) // Habilita a integracao entre os modulos SIGAFIN - Financeiro e SIGAPFS - Juridico
Local cEscrit       := IIF(lJFilBco, JurGetDados("NS7", 4, xFilial("NS7") + cFilant + cEmpAnt, "NS7_COD"), "")
Local cF3Bco        := IIF(lJFilBco, "SA6JUR", "SA6")
// Motor de Retenção
Local aMotRet		:= {}
Local nPosFKM		:= 0
Local nValMot 		:= 0
Local nRecE1		:= 0
Local cOldAgenc		:= ""
Local cOldBanco		:= ""
Local lVldCtbOff	:= .F.
Local lCtbOfflin	:= .F.
Local lContabili	:= .T.
Local lImpPIX		:= .F.
Local cChave 		:= ""
Local cIdDoc 		:= ""
Local cStatusPix	:= ""
Local cListCart 	:= FN022LSTCB(1)
Local oImpRetBx     := Nil
Local nLinBtn       := If(_lBCOApi, 22, 0)
Local nLenLin       := If(_lBCOApi, 2, 0)
Local lWhenApi      := .F.
Local cBolApi       := ""
Local cBcoAgCnt     := ""
Local cEspec060  	:= If(_lBCOApi, Criavar("EA_ESPECIE",.F.), "")
Local cSubCta060 	:= If(_lBCOApi, Criavar("EA_SUBCTA",.F.), "")
Local cCodRetIr		:= ""
Local oBanco		As Object
Local oAgencia		As Object
Local oConta		As Object 
Local lVldBcoFin 	As Logical

lVldBcoFin := FindFunction("FinVldBco")

Private lBolApi       := .F.
PRIVATE cPort060	:= Criavar("EF_BANCO",.F.)
Private cAgen060    := CriaVar("EF_AGENCIA",.F.)
Private cConta060   := Criavar("EF_CONTA",.F.)
Private cBcoOfi060  := ""
Private oSayF77     := Nil
PRIVATE aSituacoes	:= {}
PRIVATE dVencIni	:= dDataBase
PRIVATE dVencFim	:= dDataBase
PRIVATE dEmisDe		:= dDataBase
PRIVATE dEmisAte	:= dDataBase
PRIVATE cCliDe		:= Space(Len(SE1->E1_CLIENTE))
PRIVATE cCliAte		:= Replicate("Z",Len(SE1->E1_CLIENTE))
PRIVATE cPrefDe		:= Space(Len(SE1->E1_PREFIXO))
PRIVATE cPrefAte	:= Replicate("Z",Len(SE1->E1_PREFIXO))
PRIVATE cNumDe		:= Space(Len(SE1->E1_NUM))
PRIVATE cNumAte		:= Replicate("Z",Len(SE1->E1_NUM))
PRIVATE nValBaixa	:= 0
PRIVATE nJuros		:= 0
private nDescont	:= 0
PRIVATE nValor		:= 0
PRIVATE nQtdTit		:= 0
PRIVATE nSomaData	:= 0
Private nIndice		:= SE1->(Indexord())
PRIVATE cTipos		:= "" //Utilizada pela FINATIPOS()
PRIVATE nIof		:= 0
PRIVATE dBaixa		:= dDataBase
Private lRetTitMin	:= .F.
Private lDadosRet	:= .F.
Private aPccExc		:= {}

//Reestruturacao SE5
Private nPisCalc	:= 0
Private nCofCalc	:= 0
Private nCslCalc	:= 0
Private nIrfCalc	:= 0
Private nPisBaseR 	:= 0
Private nCofBaseR	:= 0
Private nCslBaseR 	:= 0
Private nIrfBaseR 	:= 0
Private nPccBaseC 	:= 0
Private nPisBaseC 	:= 0
Private nCofBaseC	:= 0
Private nCslBaseC 	:= 0
Private nIrfBaseC 	:= 0
Private nVlPis	 	:= 0
Private nVlCofins 	:= 0
Private nVlCsll 	:= 0

DEFAULT lAutomato := .F.

If _lTitTemPIX == Nil .Or. _cSitPIX == Nil
	_lTitTemPIX := FindFunction("TitTemPIX")
	If _lTitTemPIX .And. FindFunction("F022SITPIX")
		_cSitPIX := F022SITPIX()
		cListCart += _cSitPIX+"|"
	Endif
Endif

If _cSitPIX == Nil .Or. Empty(_cSitPIX)
	_cSitPIX := "0"
Endif


_lF060Exit	:= ExistBlock("F060EXIT")
_lFA60Fil	:= ExistBlock("FA60FIL")
_lF060CpBor	:= ExistBlock("F060CPBOR")
_lTFA60BDE	:= ExistTemplate("FA60BDE")
_lFA60BDE	:= ExistBlock("FA60BDE")

aSelFil := {}

If dDataBase >= dLastPcc
	nVlMinImp	:= 0
EndIf

If lVerEntBanc
   	cBcoChq := Criavar("E1_BCOCHQ")
   	cAgeChq := Criavar("E1_AGECHQ")
   	cCtaChq := Criavar("E1_CTACHQ")
	If cPaisLoc == "ARG"
		cPostal := Criavar("E1_POSTAL")
	Endif
EndIf

nIndice := SE1->(IndexOrd())
If cPaisLoc == "CHI"
	aTempos := {"0"+OemToAnsi(STR0057),"24"+OemToAnsi(STR0057),"48"+OemToAnsi(STR0057),"72"+OemToAnsi(STR0057),"96"+OemToAnsi(STR0057),"1 "+OemToAnsi(STR0059),OemToAnsi(STR0058)+"1"+OemToAnsi(STR0059)} // " Horas" # .....# " Semana" # "Mais de " # " Semana"
Else
	aTempos := {"24"+OemToAnsi(STR0057),"48"+OemToAnsi(STR0057),"72"+OemToAnsi(STR0057),"96"+OemToAnsi(STR0057),"1 "+OemToAnsi(STR0059),OemToAnsi(STR0058)+"1"+OemToAnsi(STR0059)} // " Horas" # .....# " Semana" # "Mais de " # " Semana"
Endif

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Verifica se data do movimento n„o ‚ menor que data limite de ³
//³ movimentacao no financeiro											  ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
If !DtMovFin(,,"2")
	Return
EndIf

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³VERIFICA SE A TELA DE PARAMETROS VAI ABRIR NOVAMENTE³
//³APOS A INCLUSAO DE UM BORDERO                       ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
If ! lF060LOOP
	lF060LOOP := .T.
	Return
EndIf

Pergunte("FIN060",.F.)

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ A fun‡„o SomaAbat reabre o SE1 com outro nome pela ChkFile para  ³
//³ efeito de performance. Se o alias auxiliar para a SumAbat() n„o  ³
//³ estiver aberto antes da IndRegua, ocorre Erro de & na ChkFile,   ³
//³ pois o Filtro do SE1 uptrapassa 255 Caracteres.                  ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
SomaAbat("","","","R")

//Considerar os abatimentos no bordero para serem enviados ao banco.
//Normalmente eles nao devem ir mas tem cliente que necessita.
If lF060ABT
	lMarkAbt := ExecBlock("F060ABT",.F.,.F.)
EndIf

While .T.

   //Preciso primeiro definir aqui essas variaveis, pois, no caso de Gestao Pessoal com o parametro MV_ACATIVO = .T.
	//se nao tiver aqui teremos erro de variavel inexistente.
	If mv_par05 == 1
		cFilDe  := mv_par06
		cFilAte := mv_par07
	ELSE
		cFilDe  := xFilial("SE1")
		cFilAte := xFilial("SE1")
	Endif

	dbSelectArea( "SE1" )
	nSavRec		:= RecNo()
	VALOR 	 	:= 0
	IOF		   	:= 0
	VALOR2    	:= 0
	ABATIMENTO	:= 0
	nValSaldo	:= 0
	nAbat 	 	:= 0
	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Vai pegar o ultimo N£mero de bordero utilizado 				  ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	IF lF060BOR
		cNumBor := ExecBlock("F060BOR",.f.,.f.)
	Else
		cNumBor := Soma1(GetMV("MV_NUMBORR"),6)
		cNumBor := Replicate("0",6-Len(Alltrim(cNumBor)))+Alltrim(cNumBor)
		While !MayIUseCode("SE1"+xFilial("SE1")+cNumBor)  //verifica se esta na memoria, sendo usado
			// busca o proximo numero disponivel
			cNumBor := Soma1(cNumBor)
		EndDo
	Endif
	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Monta a tabela de situa‡”es de T¡tulos										 ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	dbSelectArea("SX5")
	SX5->(dbSeek(xFilial("SX5") + "07"))
	While SX5->X5_FILIAL+SX5->X5_tabela == xFilial("SX5")+"07"
		cCapital := Capital(X5Descri())
		// Coibir utilizacao das carteiras abaixo:
		// 2 = Situacao descontada
		// 7 = Descontada caucionada
		//
		// As carteiras abaixo devem ser gerenciadas exclusivamente por rotinas de
		// controle de transferencia de caixa dos modulos SIGALOJA / SIGAFRT
		// I = Carteira Caixa Loja
		// J = Carteira Caixa Geral
		If !AllTrim(SX5->X5_CHAVE) $ "2|7|I|J"
			aAdd(aSituacoes,SubStr(SX5->X5_CHAVE,1,2) + OemToAnsi(SubStr(cCapital,1,20)))
		Endif
		SX5->(dbSkip())
	EndDo

	IF lF060SITUAC
		aSituacoes:= ExecBlock("F060SITUAC",.F.,.F.,aSituacoes)
	ENDIF

	If cPaisLoc == "CHI" .And. Len(aSituacoes) >= 3
		cComboSit := aSituacoes[3]
		cSituacao := aSituacoes[3]
    Else
		cComboSit := aSituacoes[1]
		cSituacao := aSituacoes[1]
    Endif
    M->E1_SITUACA := cComboSit
	nOpca := 0
	nMoeda := 1

	If !lAutomato
		If IsPanelFin()  //Chamado pelo Painel Financeiro
			dbSelectArea(cAlias)
			oPanelDados := FinWindow:GetVisPanel()
			oPanelDados:FreeChildren()
			aDim := DLGinPANEL(oPanelDados)
			DEFINE MSDIALOG oDlg OF oPanelDados:oWnd FROM 0,0 To 0,0 PIXEL STYLE nOR( WS_VISIBLE, WS_POPUP )
			//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
			//³ Observacao Importante quanto as coordenadas calculadas abaixo: ³
			//³ -------------------------------------------------------------- ³
			//³ a funcao DlgWidthPanel() retorna o dobro do valor da area do   ³
			//³ painel, sendo assim este deve ser dividido por 2 antes da sub- ³
			//³ tracao e redivisao por 2 para a centralizacao. 				   ³
			//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
			nEspLarg := ((DlgWidthPanel(oPanelDados)/2) - 274) /2
			nEspLin  := 0

        Else
            nEspLarg := 2
            nEspLin  := 2
	        //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	        //³ Requisito de Entidades Bancarias - Junho/2012 ³
	        //³ Abre em mais 01 linha a tela de parametros    ³
	        //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
            //Requisito de Entidades Bancarias - Junho/2012
            //Abre em mais 01 linha a tela de parametros
            nLenLin += If(lVerEntBanc, 2, 0)

            DEFINE MSDIALOG oDlg TITLE OemToAnsi(STR0003) FROM 5,0 To 23 + nLenLin,69 OF oMainWnd  //"Border“"

		Endif

		oDlg:lMaximized := .F.
		oPanel := TPanel():New(0,0,'',oDlg,, .T., .T.,, ,20,20)
		oPanel:Align := CONTROL_ALIGN_ALLCLIENT

		@ 002+nEspLin, 002+nEspLarg Say STR0023 SIZE 39, 7 OF oPanel PIXEL // "Border“ N§"
		@ 002+nEspLin, 035+nEspLarg MSGET cNumBor  Picture "@!" SIZE 37,8 ;
			Valid !Empty(cNumBor) .And. FA061Num(cNumBor) OF oPanel PIXEL

		@ 013+nEspLin, 002+nEspLarg Say STR0024		SIZE 40,7 OF oPanel PIXEL// "Venc Real "
		@ 013+nEspLin, 035+nEspLarg MSGET dVencIni	SIZE 54,8 OF oPanel PIXEL HASBUTTON
		@ 013+nEspLin, 098+nEspLarg Say STR0053 	SIZE 40,7 OF oPanel PIXEL //"a"
		@ 013+nEspLin, 117+nEspLarg MSGET dVencFim	SIZE 54,8 OF oPanel PIXEL ;
											Valid FA061DATA(dVencIni,dVencFim) HASBUTTON

		@ 024+nEspLin, 002+nEspLarg Say STR0025 	SIZE 40,7 OF oPanel PIXEL  // "Limite Valor"
		@ 024+nEspLin, 035+nEspLarg MSGET nLimite Picture cPict06018 Valid nLimite >= 0 ;
													SIZE 54,8 OF oPanel PIXEL HASBUTTON
		@ 024+nEspLin, 092+nEspLarg Say STR0026		SIZE 40,7 OF oPanel PIXEL // "Moeda"
		@ 024+nEspLin, 117+nEspLarg MSGET nMoeda 	Picture "99"   Valid nMoeda>=1 .and. nMoeda<=99 ;
													SIZE 54,8 OF oPanel PIXEL
		@ 024+nEspLin, 182+nEspLarg Say STR0015 	SIZE 40, 7 OF oPanel PIXEL //"Contrato"
		@ 024+nEspLin, 204+nEspLarg MSGET cContrato Picture "@S5" F3 "SE9" ;
																	SIZE 62,8 OF oPanel PIXEL HASBUTTON

		@ 035+nEspLin, 002+nEspLarg Say STR0027		SIZE 40, 7 OF oPanel PIXEL // "Banco "
		If cPaisLoc == "BRA"
			@ 035+nEspLin, 035+nEspLarg MSGET oBanco VAR cPort060  Picture "@!" F3 cF3Bco;
			Valid Iif(lVldBcoFin, FinVldBco(@cPort060,@cAgen060,@cConta060, .F., .T., oAgencia),;
				CarregaSa6(cPort060, @cAgen060, @cConta060, .T.,,.T.,,,, @cOldBanco, @cOldAgenc));
				.And. BorApiVld(cPort060, cAgen060, cConta060, @lWhenApi, @lBolApi, @cBcoAgCnt, @cSubCta060, @cEspec060, @cBcoOfi060);
																	SIZE 54,8 OF oPanel PIXEL HASBUTTON
		Else
			@ 035+nEspLin, 035+nEspLarg MSGET cPort060  Picture "@!" F3 "SA6" Valid (CarregaSa6(cPort060, @cAgen060, @cConta060, .F.,,.T.,,,, @cOldBanco, @cOldAgenc) .And. fa061Clear(@cClearing,@oCbxClea,aTempos)) ;
																	SIZE 54,8 OF oPanel PIXEL HASBUTTON
		Endif
		@ 035+nEspLin, 092+nEspLarg Say STR0017 		SIZE 40, 7 OF oPanel PIXEL //"Agência"
		@ 035+nEspLin, 117+nEspLarg MSGET oAgencia VAR cAgen060	Picture "@!";
		Valid Iif(lVldBcoFin, FinVldBco(@cPort060,@cAgen060,@cConta060, .F., .T., oConta),;
			CarregaSa6(cPort060, cAgen060, @cConta060, .T.,,.T.,,,, cOldBanco, @cOldAgenc));
			.And. BorApiVld(cPort060, cAgen060, cConta060, @lWhenApi, @lBolApi, @cBcoAgCnt, @cSubCta060, @cEspec060, @cBcoOfi060);
																	SIZE 54,8 OF oPanel PIXEL
		@ 035+nEspLin, 184+nEspLarg Say STR0018 		SIZE 40, 7 OF oPanel PIXEL // "Conta"
		@ 035+nEspLin, 204+nEspLarg MSGET oConta VAR cConta060	Picture "@!"; 
		Valid Iif(lVldBcoFin, FinVldBco(@cPort060,@cAgen060,@cConta060, .T., .T., oBanco),;  
			CarregaSa6(cPort060, cAgen060, cConta060,.T.,,.T., oBanco));
			.And. BorApiVld(cPort060, cAgen060, cConta060, @lWhenApi, @lBolApi, @cBcoAgCnt, @cSubCta060, @cEspec060, @cBcoOfi060);
																	SIZE 62,8 OF oPanel PIXEL

		@ 046+nEspLin, 002+nEspLarg Say STR0014 		SIZE 40, 7 OF oPanel PIXEL  // "Situação"
		@ 046+nEspLin, 035+nEspLarg MSCOMBOBOX oCbx VAR M->E1_SITUACA ITEMS aSituacoes Valid (Substr(M->E1_SITUACA,1,1)$"13456H" .or. lF060SITUAC) ;
														SIZE 80,27 OF oPanel PIXEL
		If cPaisLoc <> "BRA"
			@ 046+nEspLin,182+nEspLarg Say STR0060 	SIZE 40, 7 OF oPanel PIXEL // "Clearing"
			If cPaisLoc == "CHI"
				@ 046+nEspLin,204+nEspLarg   MSCOMBOBOX oCbxClea VAR cClearing ITEMS aTempos Valid ;
					(Ascan(aTempos,cClearing) >= 0) 		SIZE 62,27 OF oPanel PIXEL
			Else
				@ 046+nEspLin,204+nEspLarg   MSCOMBOBOX oCbxClea VAR cClearing ITEMS aTempos Valid ;
					(Ascan(aTempos,cClearing) > 0) 		SIZE 62,27 OF oPanel PIXEL
			Endif
		Endif

	    // Requisito de Entidades Bancarias - Junho/2012
	    // Possibilita filtrar o Bordero por Banco/Agencia/Cod. Postal
	    If lVerEntBanc

			@ 057+nEspLin, 002+nEspLarg Say STR0088  SIZE 40, 7 OF oPanel PIXEL // "Bco Cheque"
			@ 056+nEspLin, 035+nEspLarg MSGET cBcoChq F3 "FJNCON" Picture "@!" Valid VerFJN("cBcoChq") SIZE 30, 8 OF oPanel Hasbutton PIXEL
			@ 057+nEspLin, 074+nEspLarg Say STR0089  SIZE 40, 7 OF oPanel PIXEL // "Age Cheque"
			@ 056+nEspLin, 108+nEspLarg MSGET cAgeChq Picture "@!" Valid VerFJN("cAgeChq") SIZE 30, 8 OF oPanel PIXEL
			@ 057+nEspLin, 144+nEspLarg Say STR0090  SIZE 40, 7 OF oPanel PIXEL // "Cta Cheque"
			@ 056+nEspLin, 175+nEspLarg MSGET cCtaChq Picture "@!" SIZE 23, 8 OF oPanel PIXEL READONLY
			@ 057+nEspLin, 206+nEspLarg Say STR0091  SIZE 40, 7 OF oPanel PIXEL // "Cod. Postal"
			@ 056+nEspLin, 236+nEspLarg MSGET cPostal Picture "9999" Valid VerFJN("cPostal") SIZE 28, 8 OF oPanel PIXEL

	    EndIf

		@ 064+nEspLin+nEntBanc, 002+nEspLarg Say STR0028 		SIZE 40,7 OF oPanel PIXEL  // "Emiss„o"
		@ 064+nEspLin+nEntBanc, 035+nEspLarg MSGET dEmisDe 		SIZE 54,8 OF oPanel PIXEL HASBUTTON
		@ 064+nEspLin+nEntBanc, 100+nEspLarg Say STR0053 		SIZE 40,7 OF oPanel PIXEL  //"a"
		@ 064+nEspLin+nEntBanc, 117+nEspLarg MSGET dEmisAte   Valid dEmisAte >= dEmisDe SIZE 54,8 OF oPanel PIXEL HASBUTTON

		@ 075+nEspLin+nEntBanc, 002+nEspLarg Say STR0012 		SIZE 40,7 OF oPanel PIXEL // "Cliente"
		@ 075+nEspLin+nEntBanc, 035+nEspLarg MSGET cCliDe F3 "CLI" SIZE 54,8 OF oPanel PIXEL HASBUTTON
		@ 075+nEspLin+nEntBanc, 100+nEspLarg Say STR0053 		SIZE 40,7 OF oPanel PIXEL //"a"
		@ 075+nEspLin+nEntBanc, 117+nEspLarg MSGet cCliAte F3 "CLI" Valid cCliAte >= cCliDe SIZE 54,8 OF oPanel PIXEL HASBUTTON

		@ 086+nEspLin+nEntBanc, 002+nEspLarg Say STR0067 		SIZE 40,7 OF oPanel PIXEL  //Prefixo
		@ 086+nEspLin+nEntBanc, 035+nEspLarg MSGET cPrefDe 	SIZE 54,8 OF oPanel PIXEL
		@ 086+nEspLin+nEntBanc, 100+nEspLarg Say STR0053 		SIZE 40,7 OF oPanel PIXEL //"a"
		@ 086+nEspLin+nEntBanc, 117+nEspLarg MSGET cPrefAte Valid cPrefAte >= cPrefDe SIZE 54,8 OF oPanel PIXEL

		@ 097+nEspLin+nEntBanc, 002+nEspLarg Say STR0068 		SIZE 40,7 OF oPanel PIXEL  //"Titulo"
		@ 097+nEspLin+nEntBanc, 035+nEspLarg MSGET cNumDe 		SIZE 54,8 OF oPanel PIXEL
		@ 097+nEspLin+nEntBanc, 100+nEspLarg Say STR0053 		SIZE 40,7 OF oPanel PIXEL //"a"
		@ 097+nEspLin+nEntBanc, 117+nEspLarg MSGet cNumAte Valid cNumAte >= cNumDe SIZE 54,8 OF oPanel PIXEL

		@ nEspLin, nEspLarg TO 112+nEspLin+nEntBanc , 272+nEspLarg-4 OF oPanel PIXEL
        If _lBCOApi // Habilita checkbox para api de bancos
            @ 114+nEspLin+nEntBanc, nEspLarg TO 137+nEspLin+nEntBanc , 272+nEspLarg-4 OF oPanel PIXEL
            @ 115+nEspLin+nEntBanc, 004+nEspLarg CHECKBOX oBolApi VAR lBolApi Valid {|| BolApiVld(lBolApi, @cSubCta060, @cEspec060)} PROMPT OemToAnsi(STR0161) SIZE 82, 10 OF oPanel PIXEL WHEN lWhenApi // "Registro online de boletos"

			@ 125+nEspLin+nEntBanc, 004+nEspLarg SAY	OemToAnsi(STR0162)	SIZE 40, 7 OF oPanel PIXEL  // "Sub Conta"
			@ 125+nEspLin+nEntBanc, 035+nEspLarg MSGET cSubCta060  Picture "@!" F3 "SEEBOR" Valid {|| SubCApiVld(cPort060, cAgen060, cConta060, cSubCta060)} SIZE 30,8 OF oPanel PIXEL HASBUTTON WHEN lBolApi

			@ 125+nEspLin+nEntBanc, 092+nEspLarg SAY	OemToAnsi(STR0163)	SIZE 40, 7 OF oPanel PIXEL  // "Espécie"
			@ 125+nEspLin+nEntBanc, 117+nEspLarg MSGET cEspec060 Picture "@!" F3 "F77BOR" Valid {|| EspeApiVld(cBcoOfi060, cEspec060)} SIZE 30,8 OF oPanel PIXEL HASBUTTON WHEN lBolApi
			oSayF77 := TSay():New(125+nEspLin+nEntBanc, 150+nEspLarg, {|| OemToAnsi(Space(TamSX3('F77_DESCRI')[01]))}, oPanel,,,,,, .T.)
        EndIf
		If IsPanelFin()  //Chamado pelo Painel Financeiro
			oDlg:Move(aDim[1],aDim[2],aDim[4]-aDim[2], aDim[3]-aDim[1])
			ACTIVATE MSDIALOG oDlg ON INIT FaMyBar(oDlg,;
			{|| IIF( F061Vld(cPort060,cAgen060,cConta060,M->E1_SITUACA,cContrato, lBolApi, cSubCta060, cEspec060).And.;
			F61VldUser(cNumBor, cPort060,cAgen060,cConta060,M->E1_SITUACA,dVencIni,dVencFim,nLimite,nMoeda,cContrato,dEmisDe,dEmisAte,cCliDe,cCliAte),(oDlg:End(),nOpca:=1),(oDlg:End(),nOpca:=0))},;
			{||nOpca:=0,oDlg:End()},,,.F.)

			cAlias := FinWindow:cAliasFile
			dbSelectArea(cAlias)
			FinVisual(cAlias,FinWindow,(cAlias)->(Recno()),.T.)
        Else
	        //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	        //³ Reposiciona os Buttons se a tela for a ampliada ³
	        //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
            nLinBtn += If (lVerEntBanc, 20, 0)

            DEFINE SBUTTON FROM 118 + nLinBtn,217 TYPE 1 ACTION (nOpca := 1,oDlg:End()) ENABLE OF oDlg
            DEFINE SBUTTON FROM 118 + nLinBtn,244 TYPE 2 ACTION (nOpca := 0,oDlg:End()) ENABLE OF oDlg

			ACTIVATE MSDIALOG oDlg CENTERED VALID (iif(nOpca==1,;
				(F061Vld(cPort060,cAgen060,cConta060,M->E1_SITUACA,cContrato, lBolApi, cSubCta060, cEspec060) .and. ;
				F61VldUser(cNumBor, cPort060,cAgen060,cConta060,M->E1_SITUACA,dVencIni,dVencFim,nLimite,nMoeda,cContrato,dEmisDe,dEmisAte,cCliDe,cCliAte) .And.;
				IIF(lJFilBco, JurVldSA6("3", {cEscrit, cPort060, cAgen060, cConta060}), IIF(lJurxFin, JurBnkNat(cPort060, cAgen060, cConta060), .T.))),.t.))
		EndIf

		cComboSit := M->E1_SITUACA
		cSituacao :=SubStr(cComboSit,1,1)

	Else
		aRetAuto 		:= GetParAuto("FINA061TESTCASE")
		nLenAuto		:= Len(aRetAuto)
		cNumBor 		:= aRetAuto[1]
		dVencIni 		:= aRetAuto[2]
		dVencFim 		:= aRetAuto[3]
		nLimite 		:= aRetAuto[4]
		nMoeda 			:= aRetAuto[5]
		cContrato 		:= aRetAuto[6]
		cPort060 		:= aRetAuto[7]
		cAgen060 		:= aRetAuto[8]
		cConta060 		:= aRetAuto[9]
		cSituacao 		:= aRetAuto[10]
		dEmisDe  		:= aRetAuto[11]
		dEmisAte 		:= aRetAuto[12]
		cCliDe			:= aRetAuto[13]
		cCliAte  		:= aRetAuto[14]
		cPrefDe  		:= aRetAuto[15]
		cPrefAte 		:= aRetAuto[16]
		cNumDe 			:= aRetAuto[17]
		cNumAte 		:= aRetAuto[18]
		If nLenAuto > 18
			cTit	 	:= aRetAuto[19]
		EndIf
		If nLenAuto > 19
			//Boleto via API
			lBolApi     := aRetAuto[20]
		Endif
		If nLenAuto > 20
			//subconta
			cSubCta060  := aRetAuto[21]
		Endif
		If nLenAuto > 21
			//especie
			cEspec060 := aRetAuto[22]
		Endif
        //Valida se é borderô API
		BorApiVld(cPort060, cAgen060, cConta060, @lWhenApi, lBolApi, @cBcoAgCnt, @cSubCta060, @cEspec060, @cBcoOfi060)
		nOpca := 1
	EndIf

	If nOpca == 0
		If _lF060Exit			// Log para Saida
			Execblock("F060EXIT",.F.,.F.)
		Endif
		FreeUsedCode()  //libera codigos de correlativos reservados pela MayIUseCode()
		Return
	EndIf

    //Gestao
	//Selecao de filiais
	If lSE1Access .and. mv_par13 == 1 .And. Len( aSelFil ) <= 0
		aSelFil := AdmGetFil(.F.,.T.,"SE1")
		If Len( aSelFil ) <= 0
			Return
		EndIf
	Else
		aSelFil := { cFilAnt }
	EndIf

	//Seleciona tipos de titulos
	If mv_par12 == 1
		finatipos()
	EndIf

	cPict06014:= PesqPict("SE1","E1_VALOR",16,nMoeda)
	cPict06018:= PesqPict("SE1","E1_VALOR",TamSx3("E1_VALOR")[1],nMoeda)

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Filtra o arquivo por tipo e vencimento							  ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	IF _lFA60Fil
		cFil060 := ExecBlock("FA60FIL",.f.,.f.,{cPort060,cAgen060,cConta060,cSituacao,dVencIni,dVencFim,nLimite,nMoeda,cContrato,dEmisDe,dEmisAte,cCliDe,cCliAte})
	Else
		cFil060 := ".T."
	Endif

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Implementa‡Æo de performace para atender a versÆo 2.06 e ++.     ³
	//³ Fazer o Browse() e a IndRegua() em uma area de trabalho a partir ³
	//³ do SE1.                                                          ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	nQtdTit := 0
	nSomaData := 0
	nValor  := 0
	If _lF060CpBor
		cCampoCli:= ExecBlock("F060CPBOR", .F., .F.)
		lSelCpo := .T.
	EndIf
	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Montagem de array para tratamento na MarkBrowse com o arquivo TRB  ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	AADD(aCampos,{"E1_OK",""," "," "})
	dbSelectArea("SX3")
	dbSetOrder(1)
	dbSeek("SE1")
	While !Eof() .and. X3_ARQUIVO=="SE1"
		If x3Uso(x3_usado) .and. AllTrim(X3_CAMPO) != "E1_OK" .and. X3_CONTEXT != "V"  .And. IIf(lSelCpo,AllTrim(X3_CAMPO)$AllTrim(cCampoCli),.T.) .OR. Alltrim(X3_CAMPO) == "E1_FILIAL"
			AADD(aCampos,{SX3->X3_CAMPO,"",Alltrim(X3Titulo()),SX3->X3_PICTURE})
		EndIf
		dbSkip()
	Enddo

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Cria‡Æo da estrutura de TRB com base em SE1.                       ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	dbSelectArea("SE1")
	dbSetOrder(nIndice)
	aStru   := SE1->(dbStruct())
	AADD(aStru,{"RECSE1","N",10,0})

	IF lF060TRB
  		aStru:= ExecBlock("F060Trb",.F.,.F.,{aStru})
  	EndIf

	If(_oFina06101 <> NIL)

		_oFina06101:Delete()
		_oFina06101 := NIL

	EndIf

	//Criando a tabela temporaria
	_oFina06101 := FwTemporaryTable():New("TRB")
	//Setando as colunas
	_oFina06101:SetFields(aStru)
	//Criando o indicie
	_oFina06101:AddIndex("1",TTFtIndex(Strtokarr2(SE1->(IndexKey()), "+")))
	//Criando a Tabela Temporaria
	_oFina06101:Create()

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Posicionar em SE1 no primeiro registro que satisfa‡a a condi‡Æo  ³
	//³ de filtro considerando E1_NUMBOR = "      " (Space(6)).          ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	dbSelectArea("SE1")
	dbSetOrder(12)            // Chave (Numero do Bordero+DTOS(Data de Emissao))

   //Necessario que esse if fique antes de selecionar os titulos a serem exibidos para a geracao do bordero pq caso a filial seja alterada
   //as variaveis que definem as filiais de pesquisa sao atualizadas antes da selecao.
   If mv_par05 == 1
		If cFilDe != mv_par06
			cFilDe  := mv_par06
		Endif
		If cFilAte != mv_par07
			cFilAte := mv_par07
		Endif
	Endif

	aStru := dbStruct()
	cQuery := "SELECT "
	For nj:= 1 to Len(aStru)
		cQuery += aStru[nj,1]+", "
	Next
	cQuery += "R_E_C_N_O_ RECNO "
	cQuery += "  FROM "+	RetSqlName("SE1") + " SE1 "
	cQuery += " WHERE "
	//Gestao
	cQuery += "E1_FILIAL " + GetRngFil( aSelFil, "SE1", .T., @cTmpSE1Fil ) + " "
	aAdd(aTmpFil, cTmpSE1Fil)

	cQuery += "   AND E1_NUMBOR = '      '"
	cQuery += "   AND E1_EMISSAO Between '" + DTOS(dEmisDe) + "' AND '" + DTOS(dEmisAte) + "'"
	cQuery += "   AND E1_CLIENTE between '" + cCliDe        + "' AND '" + cCliAte        + "'"
	cQuery += "   AND E1_VENCREA between '" + DTOS(dVencIni)+ "' AND '" + DTOS(dVencFim) + "'"
	cQuery += "   AND E1_MOEDA = "+ str(nmoeda)
	cQuery += "   AND E1_PREFIXO Between '" + cPrefDe + "' AND '" + cPrefAte + "'"
	If lAutomato
		If Empty(cTit)
			cQuery += "   AND E1_NUM between '"     + cNumDe  + "' AND '" + cNumAte  + "'"
		Else
			cQuery += "   AND E1_NUM in ("     + cTit  + ") "
		EndIf
	Else
		cQuery += "   AND E1_NUM between '"     + cNumDe  + "' AND '" + cNumAte  + "'"
	EndIf

	cQuery += "   AND E1_SALDO > 0 "
	If FindFunction('FINTP02')
    	cQuery += FINTP02() // retornar o filtro de bloqueio do titulo do TIN  AND E1_ORIGEM <> 'FINI055'
	EndIf

	//Retira os títulos em PIX se o borderô for de cobrança descontada e protesto
	If _cSitPIX <> "0" .AND. (FN022SITCB(cSituacao)[3] .or. FN022SITCB(cSituacao)[4])
		cQuery += " AND E1_SITUACA <> '"+_cSitPIX+"' "
	EndIf
	//Seleciona Tipos
	If mv_par12 == 1
		cQuery += "   AND E1_TIPO IN " + FormatIn(cTipos,"/")
	Endif
	If !Empty(cOrigemRM)
		cQuery += " AND E1_ORIGEM NOT IN " + FINFormTp(cOrigemRM)
	Endif
	If ( cPaisLoc == "CHI" )
		cQuery += " AND E1_TIPO NOT IN ('RA ','NCC', 'NDC','NF ','FT ','LTC')"
	Endif
	If !Empty(MVPROVIS) .Or. !Empty(MVRECANT) .Or. !Empty(MV_CRNEG) .Or. !Empty(MVENVBCOR)
		cQuery += "   AND E1_TIPO NOT IN " + FormatIn(MVPROVIS+"/"+MVRECANT+"/"+MV_CRNEG+"/"+MVENVBCOR,"/")
	Endif

    // Requisitos de Entidades Bancarias
	If lVerEntBanc
		If Empty( cBcoChq )
			If cPaisLoc == "ARG" .and. !Empty( cPostal )
				cQuery += " AND E1_POSTAL = '" + cPostal + "'"
			EndIf
		Else
			cQuery += " AND E1_BCOCHQ = '" + cBcoChq + "'"
			cQuery += " AND E1_AGECHQ = '" + cAgeChq + "' "
		EndIf
	EndIf

	// Se o título foi criado pelo faturamento do PFS (E1_JURFAT estivir preenchido),
	// então só pode entrar no borderô caso for do tipo boleto (E1_BOLETO = '1')
	cQuery += Iif(lJurXFin .And. FindFunction("JurQWBorde"), JurQWBorde() , "" )

	//Não pode entrar em bordero, títulos associados a uma NFS OFF Balance ou movimentos de concialiação OFF Balance.
	cQuery += Iif(FindFunction("RskQWBorde"),RskQWBorde(),"")

	cQuery += "   AND E1_SITUACA IN " + FormatIn(cListCart,"|")
	cQuery += "   AND D_E_L_E_T_ = ' ' "

	// Permite a inclusão de uma condicao adicional para a Query
	// Esta condicao obrigatoriamente devera ser tratada em um AND ()
	// para nao alterar as regras basicas da mesma.
	IF lFa060Qry
		cQueryADD := ExecBlock("FA060QRY",.F.,.F.,{ cAgen060, cConta060, cPort060, cEspec060, cSubCta060})
		IF ValType(cQueryADD) == "C"
			cQuery += " AND (" + cQueryADD + ")"
		ENDIF
	ENDIF

	cQuery += " ORDER BY "+ SqlOrder(SE1->(IndexKey()))

	IF lF060QRCP
		cQuery := ExecBlock("F060QRCP",.F.,.F.,{cQuery})
	Endif

	cQuery := ChangeQuery(cQuery)

	dbSelectArea("SE1")
	dbCloseArea()
	dbSelectArea("SA1")

	dbUseArea(.T., "TOPCONN", TCGenQry(,,cQuery), 'SE1', .F., .T.)

	For ni := 1 to Len(aStru)
		If aStru[ni,2] != 'C' .AND. aStru[ni,2] != "M"
			TCSetField('SE1', aStru[ni,1], aStru[ni,2],aStru[ni,3],aStru[ni,4])
		Endif
	Next
	SE1->(dbGoTop())
	While !Eof() .and. IIF(mv_par05 == 2 .OR. (mv_par05 == 1 .and. mv_par06 == mv_par07), ;
			DTOS(SE1->E1_EMISSAO) <= DTOS(dEmisAte) .and. SE1->E1_NUMBOR == Space(6),;
			.T.)

		//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
		//³ Verifica acesso do usuário na filial em processamento ³
		//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
		If !Empty( SE1->E1_FILIAL ) .And. aScan( aUserFils, SE1->E1_FILIAL ) == 0
			dbSkip()
			Loop
		EndIf

		// Nao mostra titulos de abatimentos, pois eles serao marcados automaticamente
		If (SE1->E1_TIPO $ MVIRABT+"/"+MVCSABT+"/"+MVCFABT+"/"+MVPIABT+"/"+MVABATIM) .AND. !lMarkAbt
			dbSkip()
			Loop
		EndIf

		//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
		//³ Verificar a existˆncia do filtro qdo existir o ExecBlock("FA60FIL") ³
		//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
		If ! &(cFil060)
			dbSkip()
			Loop
		Endif

		IF FN022SITCB(SE1->E1_SITUACA)[10] //A rotina de transferência não poderá transferir títulos em PDD
			dbSkip()
			Loop
		EndIf

		// Para o Brasil, apresenta somente os titulos cuja moeda e' a mesma do banco
		// selecionado para baixa.
		// Caso a moeda do banco estiver vazia ou caso o motivo de baixa nao movimente banco, considero apenas a moeda forte
		If FXMultSld()
			If MoedaBco(cPort060,cAgen060,cConta060) > 1
				If cPaisLoc=="BRA" .AND. ;
					!FXVldBxBco(cPort060,cAgen060,cConta060,SE1->E1_NATUREZ, SE1->E1_MOEDA,.F.)

					DbSkip()
					Loop

				Endif
			Endif
		EndIf

		//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
		//³ Gravar campos de TRB.                                            ³
		//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
		If SE1->E1_SALDO > 0
			If FN022SITCB(SE1->E1_SITUACA)[1] .Or. FN022SITCB(SE1->E1_SITUACA)[11]
				dbSelectArea("TRB")
				RecLock("TRB",.T.)
				For ni := 1 to SE1->(FCount())
					If TRB->(FieldName(nI)) == SE1->(FieldName(nI))
						If SE1->(ValType(FieldName(nI))) # "M"
							TRB->(FieldPut(nI,SE1->(FieldGet(ni))))
						EndIf
					EndIf
				Next
				TRB->RECSE1 	:= SE1->RECNO
				TRB->E1_OK  	:= Space(2)
				TRB->E1_NUMBOR	:= cNumBor

				// Template GEM
				If HasTemplate("LOT") .And. !Empty(SE1->E1_NCONTR)
					aAux := ExecTemplate("CMDtPrc",.F.,.F.,{SE1->E1_PREFIXO, SE1->E1_NUM, SE1->E1_PARCELA, SE1->E1_VENCTO, SE1->E1_VENCTO})
					TRB->E1_VALOR += aAux[2] + aAux[3]
					If SE1->E1_VALOR == SE1->E1_SALDO
						TRB->E1_SALDO := TRB->E1_VALOR
					EndIf
				EndIf

				MsUnLock()
			EndIf
		EndIf
		dbSelectArea("SE1")
		dbSkip()
	EndDo

	dbSelectArea("SE1")
	dbCloseArea()
	ChKFile("SE1")
	dbSelectArea("SE1")
	dbSetOrder(12)


	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Verifica a existencia de registros no TRB.                       ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	dbSelectArea("TRB")
	dbGotop()
	lSaida := .T.
	If BOF() .And. EOF()
		Help(" ",1,"RECNO")
		Exit
	EndIf

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Disparar chamada do Browse de sele‡Æo ou markBrowse para TRB.    ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	nOpca := fA061MarkB("TRB",nLimite,dVencIni,dVencFim,cSituacao,oPrazoMed,ovalor,aCampos,cNumbor,lMarkAbt,nIndice,lAutomato)
	If nOpca == 2
		Exit
		lSaida := .T.
	ElseIf nOpca == 0
		dbSelectArea("TRB")
		dbCloseArea()
		Ferase(cFileWork+GetDBExtension())
		Ferase(cFileWork+OrdBagExt())
		dbSelectArea("SE1")
		dbSetOrder(nIndice)
		lSaida := .F.
		Loop
	EndIf
	dbSelectArea("SE1")

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Caso o nenhum titulo tenha sido selecionado, n„o gera bordero³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	If nValor = 0 .and. Abs(nQtdTit) = 0		// Nenhum titulo Selecionado
		Help(" ",1,"FA060VALOR")
		Exit
	EndIf

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Caso o valor de Abatimentos seja maior que de titulos, n„o gera bordero³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	If nValor < 0.01 .and. Abs(nQtdTit) >= 0
		Help(" ",1,"FA060VLNEG")
		Exit
	EndIf

	If lF060Proc
		Execblock("F060PROC",.F.,.F.,{cPort060,cAgen060,cConta060,cSituacao,dVencIni,dVencFim,nLimite,nMoeda,cContrato,dEmisDe,dEmisAte,cCliDe,cCliAte})
	Endif

	nRetencao	:=	SA6->A6_RETENCA

	If cSituacao $ "1H"
		nValCred := nValor - (nQtdTit * SA6->A6_TXCOBSI)
	Else
		nValCred := nValor
	EndIf

	If nOpcA == 2
		dbSelectArea("TRB")
		dbCloseArea()
		Ferase(cFileWork+GetDBExtension())
		Ferase(cFileWork+OrdBagExt())
		dbSelectArea("SE1")
		dbSetOrder(nIndice)
		lSaida := .F.
		Loop
	ElseIf nOpcA == 1
		If nValCred < 0 .Or. nValCred > nValor
    		Exit
    	EndIf

		nVrAc			:= 0
		nPIS		  	:= 0
		nCOFINS			:= 0
		nCSLL			:= 0
		nIrrf			:= 0
		nParciais 		:= 0
		nValRec			:= 0
		nOldValRec		:= 0
		nTotBordAc		:= 0
		nIrrfFina061	:= 0
		nPisFina061		:= 0
		nCofFina061		:= 0
		nCslFina061		:= 0
		aRetencao		:= {}
		lLanc			:= .F.
		lGerTitAc		:= .F.
		lDadosRet		:= .F.
		aDadosTit		:= {}
		oImpRetBx       := Nil

		aBorAc  := F061BorAc( ) //Seleciona titulos com borderos gerados anteriormente com PCC acumulado.

		For nI := 1 to Len(aBorAc)
			SE1->(DbGoto(aBorAc[nI,1]) )
			nTotBordAc	+=	SE1->E1_VALOR	- aBorAc[nI,6]
			aadd(aRetencao, {SE1->(Recno()),;     		// 1 - Recno do titulo a reter
									SE1->E1_CLIENTE,;  	// 2 - CLiente do titulo a reter
									SE1->E1_LOJA,;      // 3 - Loja do cliente a reter
									aBorAc[nI,2]	,;	// 4 - Pis pendente
									aBorAc[nI,3]	,; 	// 5 - Cofins pendente
									aBorAc[nI,4]	,; 	// 6 - Csll pendente
									SE1->E1_STATUS,;   	// 7
									SE1->E1_VALOR ,;	// 8
									SE1->E1_IRRF,;  	// 9 - Irrf
									SE1->E1_SALDO,;	  	// 10
									0,;					// 11
									'BO',;				// 12  (BO=bordero, RE=retido em outro, BX=baixado)
									SE1->E1_PORTADO,;	// 13 Portaro
									SE1->E1_AGEDEP,;  	// 14 Agedep
									SE1->E1_SITUACA,;	// 15 Situaca
									SE1->E1_CONTRAT,; 	// 16 Contrata
									SE1->E1_NUMBOR,;	// 17 Numbor
									SE1->E1_CONTA,;		// 18 Conta
									"",;				// 19 Prefixo Origem
									"",;				// 20 Numero Origem
									"",;				// 21 Parcela Origem
									"",;				// 22 Tipo Origem
									"",;				// 23 Cf Origem
									"",;				// 24 Loja Origem
									"",;				// 25 ID Retencao PIS
									"",;				// 26 ID Retencao COF
									""})				// 27 ID Retencao CSL
		Next

		dbSelectArea( "SE5" )
		dbGoto(0)
		dbSelectArea("TRB")
		dbGoTop()

		cPadrao := fA061Pad(cSituacao)
		lPadrao := VerPadrao(cPadrao)

		//Se caucionada não contabiliza
		If AllTrim(cSituacao) == "3"
			lContabili := MV_PAR03 == 1
		EndIf

		lVldCtbOff := FindFunction("F060VldCtb") .And. F060VldCtb()

		//Se existe contabilização offline
		If lVldCtbOff
			lContabili := .T.  // Idependente do parametro sempre gera a movimentação basedo do MV_PAR14
			If MV_PAR14 == 2 //Se Online igual a NÃO ou LP inexistente
				lCtbOfflin := .T.
			EndIf
		ElseIf MV_PAR03 == 2 //Se contabiliza igual a NÃO e LP existente
			lCtbOfflin := .T.
		EndIf

        If _lBCOApi  // Boleto API, tranforma o lógico para character
            cBolApi := If (lBolApi , 'S', 'N')
        EndIf

		BEGIN TRANSACTION
			While !(TRB->(Eof()))
				dbSelectArea("SE1")
				dbGoto(TRB->RECSE1)

				IF TRB->E1_OK == cMarca .and. (!SE1->E1_TIPO $ MVABATIM .or. lMarkAbt)

					SA1->(dbSetOrder(1))
					SA1->(MsSeek(xfilial("SA1") + SE1->(E1_CLIENTE+E1_LOJA)))
					nRegSA1 := SA1->(Recno())
					SED->(dbSetOrder(1))
					SED->(MsSeek(xfilial("SED") + SE1->E1_NATUREZ))
					nRegSED := SED->(Recno())
					lImpPIX := .F.
					cCodRetIr := ""

					If _lTitTemPIX .And. TitTemPIX()
						cChave     := SE1->E1_FILIAL+"|"+SE1->E1_PREFIXO+"|"+SE1->E1_NUM+"|"+SE1->E1_PARCELA+"|"+SE1->E1_TIPO+"|"+SE1->E1_CLIENTE+"|"+SE1->E1_LOJA
						cIdDoc     := FinBuscaFK7(cChave,"SE1")
						cStatusPix := PixStatus(SE1->E1_FILIAL ,cIdDoc)

						If !(cStatusPix $ '1|7')
							lImpPIX := .T. // Impostos já gerados na transmissão PIX não devem ser gerados novamente no bordero
						EndIf
					EndIf

					aSize (aMotRet, 0)
					aMotRet := {}

					If __lMotRet //Motor de retenções
						nValMot := xMoeda(SE1->E1_VALOR,SE1->E1_MOEDA,1,dDatabase,3,nTxMoeda)
						nValMot := nValMot - (nParciais)

						//Verifica as configurações de impostos pelo motor de retenção
						F061CalImp( SE1->E1_NATUREZ, SE1->E1_CLIENTE, SE1->E1_LOJA, SE1->E1_FILORIG, nValMot, dDataBase, SE1->E1_TIPO )

						aSize( __aImpos, 0) // Limpo o array de calculo pois apenas preciso saber os impostos a serem calculados.

						__aImpos   := {}
						lPccBxCr   := ( __lPccMR .And. __lPccBxMR ) .Or. ( !__lPccMR .And. lPccBxCr )
						lIRPJBaixa := ( __lIrfMR .And. __lIrfBxMR )
					EndIf

					// Verifica se é IRPF pela Baixa para guardar os títulos que devem ter retenção //A1_FILIAL+A1_COD+A1_LOJA
					If !__lIrfMR
						lIRPJBaixa := SA1->A1_IRBAX == "1" .And. !(SA1->A1_ENTID $ "00_02_10") .And. ;
									IIf( cPaisLoc != "TRI", (SA1->A1_PESSOA == "J" .and. SED->ED_CALCIRF = "S"), .F.)
					EndIf

					nC++

					//Verifica qual o Lanc Padrao que sera utilizado
					If lContabili .And. !lLanc .And. !lCtbOfflin .And. lPadrao
						lLanc := .T.
						//Inicializa Lancamento Contabil
						nHdlPrv := HeadProva(cLote, "FINA061" /*cPrograma*/, Substr( cUsuario, 7, 6 ), @cArquivo)
					EndIf

					cSituant := SE1->E1_SITUACA
					cPortAnt := SE1->E1_PORTADO
					cAgAnt   := SE1->E1_AGEDEP
					cContAnt := SE1->E1_CONTA

					If cPaisLoc <> "BRA"
						//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
						//³Calculo para o tempo de Clearing, o tempo de Clearing esta³
						//³sendo calculado somente com dias uteis corridos.          ³
						//³Se o Tempo for de mais de uma semana, coloco uma data de  ³
						//³aqui a dez anos assim tem que ser acreditado manualmente. ³
						//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
						If SE1->E1_VENCREA <= dDataBase
							dBase:=dDataBase
						Else
							dBase:=SE1->E1_VENCREA
						EndIf

						nPos:=Ascan(aTempos,cClearing)

						nDias:=If( nPos <= 5,nPos,3650)
						If nDias == 3650
							dBase	+=	3650
							nDias	:=	0
						Endif
					Else
						dBase	:=	SE1->E1_VENCREA
						nDias	:=	nRetencao
					Endif

					//Se considera retencao bancaria, atualiza vencimento com a retencao
					If nDias > 0 .And. cSituacao $ "134H"
						While nDias > 0
							dBase++
							If Ascan(aFeriados,Dtos(dBase)) == 0 .And. Dow(dBase) <> 1 .And. Dow(dBase) <> 7
							nDias--
							EndIf
						EndDo
						RecLock("SE1")
						If cPaisLoc == "BRA"
							//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
							//³ Atualiza data vencto real c/reten‡„o Banc ria³
							//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
							// Se considera retencao bancaria
							If mv_par10 == 1
								SE1->E1_VENCREA := dBase
								// Atualiza tambem os registros agregados
								F061AtuAgre()
							Endif
						Else
							//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
							//³ Atualiza data em que o cheque serah creditado³
							//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
							SE1->E1_DTACRED:= dBase
						Endif
					Endif
					MsUnlock()

					RecLock("SEA",.T.)
					SEA->EA_FILIAL  := xFilial()
					SEA->EA_NUMBOR  := cNumBor
					SEA->EA_DATABOR := dDataBase
					SEA->EA_PORTADO := cPort060
					SEA->EA_AGEDEP  := cAgen060
					SEA->EA_NUMCON  := cConta060
					SEA->EA_NUM 	:= SE1->E1_NUM
					SEA->EA_PARCELA := SE1->E1_PARCELA
					SEA->EA_PREFIXO := SE1->E1_PREFIXO
					SEA->EA_TIPO	:= SE1->E1_TIPO
					SEA->EA_CART	:= "R"
					SEA->EA_SITUACA := cSituacao
					SEA->EA_SITUANT := cSituant
					SEA->EA_FILORIG := SE1->E1_FILORIG
					SEA->EA_PORTANT := cPortAnt
					SEA->EA_AGEANT  := cAgAnt
					SEA->EA_CONTANT := cContAnt
					SEA->EA_ORIGEM := "FINA061"
					
					If _lBCOApi 
                        SEA->EA_BORAPI  := cBolApi
                    EndIf

					SEA->EA_SUBCTA  := cSubCta060
                    SEA->EA_ESPECIE := cEspec060

					If lF060SEA2
						ExecBlock("F060SEA2",.f.,.f.)
					Endif

					MsUnlock()
					FKCOMMIT()

					aAlt := {}
					aadd(aAlt, { STR0114,'','','',STR0115 +  Alltrim(SEA->EA_NUMBOR) })

					//chamada da Função que cria o Histórico de Cobrança
					FinaCONC(aAlt)

					RecLock("SE1",.F.)
					SE1->E1_PORTADO := cPort060
					SE1->E1_AGEDEP  := cAgen060
					SE1->E1_SITUACA := cSituacao
					SE1->E1_CONTRAT := cContrato
					SE1->E1_NUMBOR  := cNumBor
					SE1->E1_DATABOR := dDataBase
					SE1->E1_MOVIMEN := dDataBase
					SE1->E1_CONTA	:= cConta060

					If lVldCtbOff
						//[01] = FWI_LA ('S' ou 'N')
						//[02] = FWI_LANPAD (Lançamento Padrão utilizado)
						//[03] = FWI_VALOR (Valor da Movimentação)
						//[04] = FWI_DESCON (Desconto da Movimentação)
						//[05] = FWI_IOF (Valor do IOF)
						//[06] = FWI_SITUAC (Carteira Atual)
						//[07] = FWI_SITANT (Carteira Anterior)
						//[08] = FWI_BCOANT (Portador Anterior)
						//[09] = FWI_AGEANT (Agência Anterior)
						//[10] = FWI_CONANT (Número da Conta Anterior)
						//[11] = FWI_CONTRA (Contrato)
						//[12] = FWI_IDMOV (Id da Movimentação na FK5)
						//[13] = FWI_NUMBOR (Número do Borderô)
						FinAGrvFWI({IIf(!lCtbOfflin .And. lPadrao, "S", "N"), cPadrao, SE1->E1_SALDO, 0, 0,;
							cSituacao, cSituAnt, cPortAnt, cAgAnt, cContAnt, cContrato, "", cNumBor})
					EndIf

					//DDA - Debito Direto Autorizado
					If SE1->E1_OCORREN $ "53/52"
						Reclock("SE1")
						SE1->E1_OCORREN := "01"
						MsUnlock()
					Endif

					MsUnlock()
					FKCOMMIT()

					dbSelectArea("SA1")
					dbGoTo(nRegSA1)

					//Somente gerar IRRF e PCC na baixa para pessoa juridica.
					lTpJur    := SA1->A1_PESSOA == "J"
					nValSaldo += SE1->E1_SALDO
					nSaldo    := SE1->E1_SALDO

					//PCC e IRRF
					If lTpJur .AND. !lImpPIX
						aDadosRef	:= Array(7)
						aDadosRet	:= Array(7)
						aTitCalc	:= {}

						dBaixa		:= CriaVar("E1_BAIXA")
						nTxMoeda 	:= If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)
						nParciais	:= 0
						nPisSE5		:= 0
						nCofSE5		:= 0
						nCsllSE5	:= 0
						aBaixa		:= {}
						aBaixaSE5	:= {}

						If (SE1->E1_VALOR > SE1->E1_SALDO) .And. Empty(SE1->E1_TIPOLIQ)	//Verificar valores de baixas existentes no registro.

							lTipBxCP :=	lRaRtImp //Procura pelas baixas deste titulo
							aBaixa   := Sel070Baixa( "VL /V2 /RA /CP /" + MV_CRNEG, SE1->E1_PREFIXO, SE1->E1_NUM, SE1->E1_PARCELA, SE1->E1_TIPO,;
													@nTotAdto, @lBaixaAbat, SE1->E1_CLIENTE, SE1->E1_LOJA, @nVlrBaixa, , @lBxCec, @lBxLiq ,@lSigaloja, @lTipBxCP)

							For nI := 1 to Len(aBaixaSE5)
								nParciais += aBaixaSE5[nI][8]

								If lPccBxCR .And. lRaRtImp
									nParciais += aBaixaSE5[nI][18]+aBaixaSE5[nI][19]+aBaixaSE5[nI][20]+aBaixaSE5[nI][30]// somar impostos PCC
								Endif

								nPisSE5	 += aBaixaSE5[nI][18]
								nCofSE5	 += aBaixaSE5[nI][19]
								nCsllSE5 += aBaixaSE5[nI][20]
							Next

							nParciais += nTotAdto

							If SE1->E1_SDDECRE <> SE1->E1_DECRESC //Soma valor de decrescimo em baixas parciais, para evitar diferencas entre valor original e valor recebido
								nParciais += ( SE1->E1_DECRESC - SE1->E1_SDDECRE )
							EndIf
						Else
							nParciais 	:= SE1->E1_VALOR-SE1->E1_SALDO
						Endif

						If "RA" $ SE1->E1_TIPO
							nParciais 	:= SE1->E1_VALOR-SE1->E1_SALDO
						Endif

						If SE1->E1_MOEDA > 1
							nValRec		:= xMoeda(SE1->E1_VALOR,SE1->E1_MOEDA,1,dDatabase,3,nTxMoeda)
							nValRec		:= nValRec - (nParciais)
							nOldValRec	:= nValRec
						Else
							If lPccBxCR
								nValRec := SE1->E1_VALOR - (nParciais)
								nOldValRec	:= 	nValRec
							Endif
						EndIf

						If	lIRPJBaixa .And. (SE1->E1_IRRF > 0  .OR. (SED->ED_CALCIRF == 'S' .AND. (SED->ED_RECIRRF == '3' .AND. SA1->A1_RECIRRF = '2').OR. SED->ED_RECIRRF == '3' ) )  //Calculando IR caso esteja na baixa e o titulo retenha IR.
							nRecE1    := SE1->( Recno() )
							nValRec   := SE1->E1_VALOR - (nParciais)
							nIrfBaseC := nIrfBaseR := SE1->E1_BASEIRF
							If !Empty(SED->ED_CODRET)
								cCodRetIr := SED->ED_CODRET
							EndIf

							If !__lIrfMR
								nIrrf	:= FCaIrBxCR(nValRec,nRecE1,,,,dDataBase)
							EndIf
						Endif

						If lPccBxCR .And. (SE1->E1_PIS + SE1->E1_COFINS + SE1->E1_CSLL) > 0 //Calculando PCC caso esteja na baixa e o titulo retenha PCC.
							cFilAnt := SEA->EA_FILORIG
							nValRec	:= nOldValRec
							aPccExc := {}

							//Busca impostos retidos nas baixas parciais.
							If nParciais > 0 .And. !__lPccMR .And. !SE1->E1_TIPO $ MVRECANT+"|"+MV_CRNEG+"|"+MVABATIM
								aPccExc := F061PccExc(SE1->E1_FILORIG, SE1->E1_PREFIXO, SE1->E1_NUM, SE1->E1_PARCELA, SE1->E1_TIPO, @oImpRetBx)
							EndIf

							If Len(aRetencao) > 0  .And. !lGerTitAc //Titulo retido em outro.
								For nI := 1 to Len(aRetencao)
									nValRec	+= 	Iif(aRetencao[nI,12] == 'AC',aRetencao[nI,8],0)
									If aRetencao[nI,12]='AC'
										nOldValRec	:= nValRec
									EndIf
									nVrAc   +=	Iif(aRetencao[nI,12] == 'AC',aRetencao[nI,8],0)
									If nValRec > nVlMinImp
										If aRetencao[nI,12]<>'BX'
											aRetencao[nI,19]	:=	SE1->E1_PREFIXO
											aRetencao[nI,20]	:=	SE1->E1_NUM
											aRetencao[nI,21]	:=	SE1->E1_PARCELA
											aRetencao[nI,22]	:=	SE1->E1_TIPO
											aRetencao[nI,23]	:=	SE1->E1_CLIENTE
											aRetencao[nI,24]	:=	SE1->E1_LOJA
										Endif
									EndIf
									If aRetencao[nI,12]='AC'
										aRetencao[nI,11]	:= 'S'
									Endif
								Next

								If !__lPccMR .And. nValRec > nVlMinImp
									nPis	:= nCofins	:=	nCsll	:=	0
								EndIf
							Endif

							nValRec	:= nValRec + nTotBordAc
							nValBrt := nValRec

							//Reestruturacao SE5
							//Base de calculo do PCC para o titulo em questão
							nPccBaseC := SE1->E1_BASEPIS

							If lPccBxCR .And. !__lPccMR
								If dDataBase < dLastPcc
									f070TotMes(dBaixa,.T.,,,,nTxMoeda)
								Else
									If SE1->E1_TIPO # MVRECANT
										aPcc	:= newMinPcc(dDataBase,nPccBaseC,SE1->E1_NATUREZ,"R",SE1->E1_CLIENTE+SE1->E1_LOJA)
										nPis	:= aPcc[2]
										nCofins	:= aPcc[3]
										nCsll	:= aPcc[4]

										If len(aPCC) > 4
											aTitCalc := aPCC[5]
										Endif

									Endif
								EndIF
							EndIf

							cFilAnt := SEA->EA_FILORIG
							nRegSe1	:= SE1->(Recno())
							nOrdSe1	:= SE1->(IndexOrd())
							nRegSe5	:= SE5->(Recno())
							nOrdSe5	:= SE5->(IndexOrd())
							lRegSe5	:= .T.

							If lPccBxCR .and. dDataBase < dLastPcc
								//Reestruturacao SE5
								//Valor calculado do PCC para o titulo em questão (Valores vem da F070TOTMES())
								nPisCalc	:= nVlPis
								nCofCalc	:= nVlCofins
								nCslCalc	:= nVlCsll
							Endif

							If ValType(aPccExc) <> "U" .And. !__lPccMR .And. ValType(aDadosRet[2]) <> "U"
								If Len(aPccExc) > 0 .And. (aPccExc[1,1]+aPccExc[1,2]+aPccExc[1,3] <> aDadosRet[2]+aDadosRet[3]+aDadosRet[4] )
									lRegSe5	:=	.F.
								Endif
							Endif

							If ValType(aDadosRet[2]) <> "U"
								If (aDadosRet[2]+aDadosRet[3]+aDadosRet[4]) > 0  .And. lRegSe5
									//Baixas realizadas anteriromente com titulos com os impostos acumulados e que nao foram incluidos ainda neste bordero.
									cPrefixoOrig	:=	SE1->E1_PREFIXO
									cNumOrig		:=	SE1->E1_NUM
									cParcOrig		:=	SE1->E1_PARCELA
									cTipoOrig		:=	SE1->E1_TIPO
									cCliOrig		:=	SE1->E1_CLIENTE
									cLojaOrig		:=	SE1->E1_LOJA

									SE5->(Dbsetorder(7))   //E5_FILIAL+E5_PREFIXO+E5_NUMERO+E5_PARCELA+E5_TIPO+E5_CLIFOR+E5_LOJA+E5_SEQ
									SE1->(Dbsetorder(1))  //E1_FILIAL+E1_PREFIXO+E1_NUM+E1_PARCELA+E1_TIPO

									For nI := 1 to Len(aDadosRet[6]) //Titulos com PCC acumulados quando realizei a baixa.

										//mantido pois o modelo ira atualizar os impostos dos titulos
										// relacionados no momento da baixa e este bloco sera excluido

										SE5->(DbGoto(aDadosRet[6,nI]) )
										// Alterar os dados da SE5
										Reclock("SE5",.F.)   //Alterando baixa de pendente de retencao para retido em outro titulo.
										If SE5->E5_PRETPIS = "1"
											SE5->E5_PRETPIS	:= "2"
										Endif
										If SE5->E5_PRETCOF = "1"
											SE5->E5_PRETCOF	:= "2"
										Endif
										If SE5->E5_PRETCSL = "1"
											SE5->E5_PRETCSL	:= "2"
										Endif

										SE5->E5_HISTOR 	:=	STR0160

										MsUnlock()

										If SE1->(dbSeek(xFilial("SE1")+SE5->E5_PREFIXO+SE5->E5_NUMERO+SE5->E5_PARCELA+SE5->E5_TIPO))
											aadd(aRetencao,{SE1->(Recno()),;        	// 1
															SE1->E1_CLIENTE,;		  	// 2
															SE1->E1_LOJA,;       		// 3
															SE5->E5_VRETPIS,;			// 4
															SE5->E5_VRETCOF,;			// 5
															SE5->E5_VRETCSL,;			// 6
															SE1->E1_STATUS,;			// 7
															SE5->E5_VALOR,;				// 8
															SE5->E5_VRETIRF,;			// 9
															SE1->E1_SALDO,;				// 10
															0,;							// 11
															'BX',;						// 12  (BO=bordero, RE=retido em outro, BX=baixado)
															cPort060,;					// 13 Portaro
															cAgen060,;					// 14 Agedep
															cSituacao,;					// 15 Situaca
															cContrato,;					// 16 Contrata
															cNumBor,;					// 17 Numbor
															cConta060,;					// 18 Conta
															cPrefixoOrig,;				// 19 Prefixo Origem
															cNumOrig,;					// 20 Numero Origem
															cParcOrig,;					// 21 Parcela Origem
															cTipoOrig,;					// 22 Tipo Origem
															cCliOrig,;					// 23 Cf Origem
															"",;						// 24 Loja Origem
															"",;						// 25 ID Retencao PIS
															"",;						// 26 ID Retencao COF
															""})						// 27 ID Retencao CSL
										Endif
									Next
								Endif
							Endif

							SE1->(Dbsetorder(nOrdSe1))
							SE1->(Dbgoto(nRegSe1))
							SE5->(Dbsetorder(nOrdSe5))
							SE5->(Dbgoto(nRegSe5))
						Endif

						If	((lIRPJBaixa .Or. lPccBxCR) .And. ( ((SE1->E1_PIS + SE1->E1_COFINS + SE1->E1_CSLL) > 0 .And. !__lPccMR).Or. (SE1->E1_IRRF > 0 .OR. nIrrf > 0) .And. !__lIrfMR))

							If Len(aPccExc)> 0
								nPis	-=	aPccExc[1,1]
								nCofins	-=	aPccExc[1,2]
								nCsll	-=	aPccExc[1,3]
								// Alterando campos PRETS dos registros de pcc que foram excluidos e estao acumulados.
								F061PccAc(SE1->E1_FILIAL,SE1->E1_PREFIXO,SE1->E1_NUM,SE1->E1_PARCELA,SE1->E1_TIPO,SE1->E1_CLIENTE,SE1->E1_LOJA)
							Endif

							nPisFina061		:=	nPis
							nCofFina061		:=	nCofins
							nCslFina061		:=	nCsll
							nIrrfFina061	:= 	nIrrf

							If !__lPccMR .And. nValRec <= nVlMinImp .And. ValType(aDadosRet[1]) <> "U"
								If ((aDadosRet[1] > 0) .or. (nValBrt > nVlMinImp)) .And. (nPis+nCofins+nCsll) > 0 //Titulo com valor minimo de retencao mas PCC foi gerado em titulo anterior entao devo reter os impostos.
									lRetTitMin	:= .T.
								Endif
							Endif

							If !__lPccMR .or. !__lIrfMR
								A040DupRec("FINA061",,,,,,,,,,,,,,,,Iif(cPaisLoc == "BRA",SE1->E1_CODIRRF,""),,__lPccMR,__lIrfMR,)
							EndIf

							Reclock("SE1",.F.)

							If (lIRPJBaixa .And. nIrrf > 0 .And. !__lIrfMR .And. SA1->A1_RECIRRF == "1")
								SE1->E1_SALDO -= nIrrf
							EndIf

							If (lPccBxCR .And. (nValRec > nVlMinImp .Or. lRetTitMin) .And. !__lPccMR)
								SE1->E1_SALDO -= (nPis+nCofins+nCsll)
							EndIf

							SE1->E1_VALLIQ	:= SE1->E1_VALLIQ + Iif( (lIRPJBaixa .And. nIrrf>0 .And. !__lIrfMR) , nIrrf, 0) + Iif(lPccBxCR .And. (nValRec > nVlMinImp .Or. lRetTitMin) .And. !__lPccMR, (nPis+nCofins+nCsll),0 )
							SE1->E1_SITUACA	:=	cSituacao

							MsUnlock()

							//Dados da tabela auxiliar com o código do título a pagar
							cChaveTit := xFilial("SE1") + "|" +  SE1->E1_PREFIXO + "|" + SE1->E1_NUM    + "|" + SE1->E1_PARCELA + "|" + ;
																SE1->E1_TIPO    + "|" + SE1->E1_CLIENTE+ "|" + SE1->E1_LOJA
							cChaveFK7 := FINGRVFK7( "SE1", cChaveTit )

							SA1->(dbGoTo(nRegSA1))

							//-------------------------------------------------
							// IRRF
							//-------------------------------------------------
							If nIrfCalc > 0 .And. lIRPJBaixa .And. !__lIrfMR
								aImpostos := {}
								aadd(aImpostos,{"IRF", nIrfCalc,&(SuperGetMV("MV_IRF")),"", nIrrf    , nIrfBaseC, nIrfBaseR,"",SA1->A1_COD,SA1->A1_LOJA,SA1->A1_CGC})

								If nIrrf > 0

									cSequencia 	:= FaNxtSeqBx("SE1")  // Sequencia da baixa do adiantamento + 1
									nMoedaBco 	:= Max( MoedaBco(cPort060,cAgen060,cConta060), 1)
									dBaixa		:= CriaVar("E1_BAIXA")
									nTxMoeda 	:= If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)
									nPosFKM		:= 0
									nPosFKM		:= aScan(aMotRet,{|x| x[8] == "IRF"})
									//Define os campos que não existem nas FKs e que serão gravados apenas na E5, para que a gravação da E5 continue igual
									If !Empty(cCamposE5)
										cCamposE5 += "|"
									Endif
									cCamposE5 := "{"
									cCamposE5 += "{'E5_DTDIGIT', dDataBase}"
									cCamposE5 += ",{'E5_PREFIXO', SE1->E1_PREFIXO}"
									cCamposE5 += ",{'E5_NUMERO', SE1->E1_NUM}"
									cCamposE5 += ",{'E5_PARCELA', SE1->E1_PARCELA}"
									cCamposE5 += ",{'E5_CLIFOR', SE1->E1_CLIENTE}"
									cCamposE5 += ",{'E5_CLIENTE', SE1->E1_CLIENTE}"
									cCamposE5 += ",{'E5_BENEF',SE1->E1_NOMCLI}"
									cCamposE5 += ",{'E5_LOJA', SE1->E1_LOJA}"
									cCamposE5 += ",{'E5_TIPO', SE1->E1_TIPO}"
									cCamposE5 += ",{'E5_DTDISPO', dDatabase}"
									cCamposE5 += ",{'E5_VRETIRF', Val('"+cValToChar(nIrrf)+"')}"
									cCamposE5 += ",{'E5_PRETIRF', '4'}"
									cCamposE5 += "}"

									oModelBx := FWLoadModel("FINM010") //Model de baixas de titulo a Receber
									oModelBx:SetOperation( MODEL_OPERATION_INSERT ) //Inclusao
									oModelBx:Activate()
									oModelBx:SetValue( "MASTER", "E5_GRV", .T. ) //Informa se vai gravar SE5 ou não
									oModelBx:SetValue( "MASTER", "E5_CAMPOS", cCamposE5 ) //Informa os campos da SE5 que serão gravados indepentes de FK5
									oModelBx:SetValue( "MASTER", "HISTMOV", "FINA061-Ger.IRF-Bordero") //Informa os campos da SE5 que serão gravados indepentes de FK5
									oModelBx:SetValue( "MASTER", "NOVOPROC", .T. ) //Informa que a inclusão será feita com um novo número de processo

									//Dados do Processo - Define a chave da FK5 no IDORIG
									oSubFKA := oModelBx:GetModel("FKADETAIL")

									If !oSubFKA:IsEmpty()
										oSubFKA:AddLine()
									Endif

									cIdFK1 := FWUUIDV4()

									oSubFKA:SetValue( "FKA_IDORIG", cIdFK1 )
									oSubFKA:SetValue( "FKA_TABORI", "FK1" )

									oSubFK1 := oModelBx:GetModel("FK1DETAIL")
									oSubFK3 := oModelBx:GetModel("FK3DETAIL")
									oSubFK4 := oModelBx:GetModel("FK4DETAIL")

									//Dados da baixa a pagar
									oSubFK1:SetValue( "FK1_IDDOC" , cChaveFK7 )
									oSubFK1:SetValue( "FK1_IDFK1" , cIdFK1 )
									oSubFK1:SetValue( "FK1_DATA"  , dDatabase )
									oSubFK1:SetValue( "FK1_NATURE", SE1->E1_NATUREZ )
									oSubFK1:SetValue( "FK1_RECPAG", "R" )
									oSubFK1:SetValue( "FK1_TPDOC" , "BA")
									oSubFK1:SetValue( "FK1_MOTBX" , "IRF")
									oSubFK1:SetValue( "FK1_ORIGEM", FunName() )
									oSubFK1:SetValue( "FK1_SEQ"   , cSequencia )
									oSubFK1:SetValue( "FK1_CCUSTO", SE1->E1_CCUSTO)
									oSubFK1:SetValue( "FK1_DOC"   , cNumBor )
									oSubFK1:SetValue( "FK1_VALOR" , nIrrf)
									oSubFK1:SetValue( "FK1_VLMOE2", nIrrf)
									oSubFK1:SetValue( "FK1_MOEDA" , StrZero(nMoedaBco,2))
									oSubFK1:SetValue( "FK1_TXMOED", nTxMoeda)
									oSubFK1:SetValue( "FK1_FILORI", SE1->E1_FILORIG)
									oSubFK1:SetValue( "FK1_HISTOR", "FINA061-Ger.IRF-Bordero")

									If !oSubFK3:IsEmpty()
										//Inclui a quantidade de linhas necessárias
										oSubFK3:AddLine()
										//Vai para linha criada
										oSubFK3:GoLine( oSubFK3:Length() )
									Endif

									cIdFK3:= FINFKSID('FK3', 'FK3_IDFK3')
									cIdFK4:= FINFKSID('FK4', 'FK4_IDFK4')
									aImpostos[1,4] := cIdFK4

									oSubFK3:SetValue( "FK3_IDFK3" , cIdFk3 )
									oSubFK3:SetValue( "FK3_DATA"  , SE1->E1_EMISSAO )
									oSubFK3:SetValue( "FK3_ORIGEM", FunName() )
									oSubFK3:SetValue( "FK3_IMPOS" , "IRF" )
									oSubFK3:SetValue( "FK3_RECPAG", "R" )
									oSubFK3:SetValue( "FK3_MOEDA" , "01" )
									oSubFK3:SetValue( "FK3_VALOR" , nIrfCalc )
									oSubFK3:SetValue( "FK3_NATURE", aImpostos[1][3] )
									oSubFK3:SetValue( "FK3_FILORI", SE1->E1_FILORIG )
									oSubFK3:SetValue( "FK3_BASIMP", nIrfBaseC )
									oSubFK3:SetValue( "FK3_IDORIG", cIdFK1 )
									oSubFK3:SetValue( "FK3_TABORI", "FK1")
									oSubFK3:SetValue( "FK3_IDRET" , cIdFK4)

									If __lMotRet
										oSubFK3:SetValue( "FK3_CODFKM", "" )
										oSubFK3:SetValue( "FK3_CLIFOR", SA1->A1_COD )
										oSubFK3:SetValue( "FK3_LOJA"  , SA1->A1_LOJA )
										oSubFK3:SetValue( "FK3_CGC"   , SA1->A1_CGC )
										oSubFK3:SetValue( "FK3_RAICGC", Substr(SA1->A1_CGC, 1, 8) )
									Endif

									If !oSubFK4:IsEmpty()
										//Inclui a quantidade de linhas necessárias
										oSubFK4:AddLine()
										//Vai para linha criada
										oSubFK4:GoLine( oSubFK4:Length() )
									Endif

									oSubFK4:SetValue( "FK4_IDFK4" , cIdFK4)
									oSubFK4:SetValue( "FK4_DATA"  , dDataBase )
									oSubFK4:SetValue( "FK4_ORIGEM", FunName() )
									oSubFK4:SetValue( "FK4_IMPOS" , "IRF" )
									oSubFK4:SetValue( "FK4_RECPAG", "R" )
									oSubFK4:SetValue( "FK4_MOEDA" , "01" )
									oSubFK4:SetValue( "FK4_VALOR" , nIrrf )
									oSubFK4:SetValue( "FK4_NATURE", aImpostos[1][3] )
									oSubFK4:SetValue( "FK4_FILORI", SE1->E1_FILORIG )
									oSubFK4:SetValue( "FK4_BASIMP", nIrfBaseR ) // Valor a receber

									If __lMotRet
										oSubFK4:SetValue( "FK4_CODFKM", "" )
										oSubFK4:SetValue( "FK4_CLIFOR", SA1->A1_COD )
										oSubFK4:SetValue( "FK4_LOJA"  , SA1->A1_LOJA )
										oSubFK4:SetValue( "FK4_CGC"   , SA1->A1_CGC )
										oSubFK4:SetValue( "FK4_RAICGC", Substr(SA1->A1_CGC, 1, 8) )
									Endif

									//Gravo o relacionamento de retenção dos títulos que tiveram impostos retidos na baixa atual
									FinFk3BCR(aTitCalc, aImpostos)

									If oModelBx:VldData()
										oModelBx:CommitData()
										SE5->(dbGoto(oModelBx:GetValue( "MASTER", "E5_RECNO" )))
									Else
										lRet := .F.
										cLog := cValToChar(oModelBx:GetErrorMessage()[4]) + ' - '
										cLog += cValToChar(oModelBx:GetErrorMessage()[5]) + ' - '
										cLog += cValToChar(oModelBx:GetErrorMessage()[6])
										Help( ,,"F061IRFBOR",,cLog, 1, 0 )
									Endif
									oModelBx:DeActivate()
									oModelBx:Destroy()
									oModelBx := Nil

									If !lRet
										DisarmTransaction()
										Break
									Endif

								Else
									//NÃO Houve retencao de IRRF neste titulo
									//E o mesmo pertence ao bordero em processamento
									If !Empty(SE1->E1_NUMBOR)
										FNGFK3BCR(1,"FK7",cChaveFK7,aImpostos,cNumBor,,cCodRetIr)
									Endif
								Endif
							EndIf

							//-------------------------------------------------
							// PCC
							//-------------------------------------------------
							If (nValBrt > nVlMinImp  .Or. lRetTitMin) .And. (SE1->E1_PIS + SE1->E1_COFINS + SE1->E1_CSLL) > 0 .And. !__lPccMR

								aImpostos := {}
								aadd(aImpostos,{"PIS", nPisCalc ,SuperGetMV("MV_PISNAT") ,"" ,nPis    ,nPisBaseC ,nPisBaseR,"",SA1->A1_COD ,SA1->A1_LOJA ,SA1->A1_CGC})
								aadd(aImpostos,{"COF", nCofCalc ,SuperGetMV("MV_COFINS")   ,"" ,nCofins ,nCofBaseC ,nCofBaseR,"",SA1->A1_COD ,SA1->A1_LOJA ,SA1->A1_CGC})
								aadd(aImpostos,{"CSL", nCslcalc ,SuperGetMV("MV_CSLL")   ,"" ,nCsll   ,nCslBaseC ,nCslBaseR,"",SA1->A1_COD ,SA1->A1_LOJA ,SA1->A1_CGC})

								//HOUVE RETENÇÃO
								If (nPis + nCofins + nCsll) > 0.00

									cSequencia 	:= FaNxtSeqBx("SE1")  // Sequencia da baixa do adiantamento + 1
									nMoedaBco 	:= Max( MoedaBco(cPort060,cAgen060,cConta060), 1)
									dBaixa		:= CriaVar("E1_BAIXA")
									nTxMoeda 	:= If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)

									cCamposE5 := ""
									//---------------------------------------------------------------
									//Ativa o modelo de Baixas a RECEBER
									//---------------------------------------------------------------
									//Define os campos que não existem nas FKs e que serão gravados apenas na E5, para que a gravação da E5 continue igual
									If !Empty(cCamposE5)
										cCamposE5 += "|"
									Endif
									cCamposE5 := "{"
									cCamposE5 += " {'E5_DTDIGIT' , dDataBase}"
									cCamposE5 += ",{'E5_PREFIXO' , SE1->E1_PREFIXO}"
									cCamposE5 += ",{'E5_NUMERO'  , SE1->E1_NUM}"
									cCamposE5 += ",{'E5_PARCELA' , SE1->E1_PARCELA}"
									cCamposE5 += ",{'E5_CLIFOR'  , SE1->E1_CLIENTE}"
									cCamposE5 += ",{'E5_CLIENTE' , SE1->E1_CLIENTE}"
									cCamposE5 += ",{'E5_BENEF'   , SE1->E1_NOMCLI}"
									cCamposE5 += ",{'E5_LOJA'    , SE1->E1_LOJA}"
									cCamposE5 += ",{'E5_TIPO'    , SE1->E1_TIPO}"
									cCamposE5 += ",{'E5_DTDISPO' , dDatabase}"
									cCamposE5 += ",{'E5_VRETPIS' , Val('"+cValToChar(nPis)+"')}"
									cCamposE5 += ",{'E5_VRETCOF' , Val('"+cValToChar(nCofins)+"')}"
									cCamposE5 += ",{'E5_VRETCSL' , Val('"+cValToChar(nCsll)+"')}"
									cCamposE5 += ",{'E5_PRETPIS' , '4'}"
									cCamposE5 += ",{'E5_PRETCOF' , '4'}"
									cCamposE5 += ",{'E5_PRETCSL' , '4'}"
									cCamposE5 += "}"

									oModelBx := FWLoadModel("FINM010") //Model de baixas de titulo a Receber
									oModelBx:SetOperation( MODEL_OPERATION_INSERT ) //Inclusao
									oModelBx:Activate()
									oModelBx:SetValue( "MASTER", "E5_GRV", .T. ) //Informa se vai gravar SE5 ou não
									oModelBx:SetValue( "MASTER", "E5_CAMPOS", cCamposE5 ) //Informa os campos da SE5 que serão gravados indepentes de FK5
									oModelBx:SetValue( "MASTER", "HISTMOV", "FINA061-Ger.Imp.-Bordero") //Informa os campos da SE5 que serão gravados indepentes de FK5
									oModelBx:SetValue( "MASTER", "NOVOPROC", .T. ) //Informa que a inclusão será feita com um novo número de processo

									cIdFK1 := FWUUIDV4()

									//Dados do Processo - Define a chave da FK5 no IDORIG
									oSubFKA := oModelBx:GetModel("FKADETAIL")

									oSubFKA:SetValue( "FKA_IDORIG", cIdFK1 )
									oSubFKA:SetValue( "FKA_TABORI", "FK1" )

									oSubFK1 := oModelBx:GetModel("FK1DETAIL")
									oSubFK4 := oModelBx:GetModel("FK4DETAIL")
									oSubFK3 := oModelBx:GetModel("FK3DETAIL")

									//Dados da baixa a pagar
									oSubFK1:SetValue( "FK1_IDDOC" , cChaveFK7 )
									oSubFK1:SetValue( "FK1_IDFK1" , cIdFK1 )
									oSubFK1:SetValue( "FK1_DATA"  , dDatabase )
									oSubFK1:SetValue( "FK1_NATURE", SE1->E1_NATUREZ )
									oSubFK1:SetValue( "FK1_RECPAG", "R" )
									oSubFK1:SetValue( "FK1_TPDOC" , "BA")
									oSubFK1:SetValue( "FK1_MOTBX" , "PCC")
									oSubFK1:SetValue( "FK1_ORIGEM", FunName() )
									oSubFK1:SetValue( "FK1_SEQ"   , cSequencia )
									oSubFK1:SetValue( "FK1_CCUSTO", SE1->E1_CCUSTO)
									oSubFK1:SetValue( "FK1_DOC"   , cNumBor )
									oSubFK1:SetValue( "FK1_VALOR" , nPis + nCofins + nCsll)
									oSubFK1:SetValue( "FK1_VLMOE2", nPis + nCofins + nCsll)
									oSubFK1:SetValue( "FK1_MOEDA" , StrZero(nMoedaBco,2))
									oSubFK1:SetValue( "FK1_TXMOED", nTxMoeda)
									oSubFK1:SetValue( "FK1_FILORI", SE1->E1_FILORIG)
									oSubFK1:SetValue( "FK1_HISTOR", "FINA061-Ger.Imp.-Bordero") //Informa os campos da SE5 que serão gravados indepentes de FK5

									For nX := 1 to Len(aImpostos)

										//Houve calculo de impostos PCC
										If aImpostos[nX,2] > 0
											cIdFK3:= FINFKSID('FK3', 'FK3_IDFK3')

											//Houve retencao de impostos PCC
											If aImpostos[nX][5] > 0
												cIdFK4:= FINFKSID('FK4', 'FK4_IDFK4')
												aImpostos[nX,4] := cIdFK4
											Endif

											If !oSubFK3:IsEmpty()
												//Inclui a quantidade de linhas necessárias
												oSubFK3:AddLine()

												//Vai para linha criada
												oSubFK3:GoLine( oSubFK3:Length() )
											Endif

											//---------------------------------------------
											// Grava Imposto Calculado
											//---------------------------------------------
											oSubFK3:SetValue( "FK3_IDFK3" , cIdFK3			)
											oSubFK3:SetValue( "FK3_DATA"  , dDataBase		)
											oSubFK3:SetValue( "FK3_ORIGEM", cOrigem			)
											oSubFK3:SetValue( "FK3_IMPOS" , aImpostos[nX][1]	)
											oSubFK3:SetValue( "FK3_RECPAG", "R"				)
											oSubFK3:SetValue( "FK3_MOEDA" , "01"			)
											oSubFK3:SetValue( "FK3_VALOR" , aImpostos[nX][2]	)
											oSubFK3:SetValue( "FK3_NATURE", aImpostos[nX][3]	)
											oSubFK3:SetValue( "FK3_FILORI", SE1->E1_FILORIG )
											oSubFK3:SetValue( "FK3_BASIMP", aImpostos[nX][6]	)
											oSubFK3:SetValue( "FK3_IDORIG", cIdFK1			)
											oSubFK3:SetValue( "FK3_TABORI", "FK1"			)
											oSubFK3:SetValue( "FK3_IDRET" , aImpostos[nX,4]	)

											If __lMotRet
												oSubFK3:SetValue( "FK3_CODFKM", aImpostos[nX,8] )
												oSubFK3:SetValue( "FK3_CLIFOR", SA1->A1_COD )
												oSubFK3:SetValue( "FK3_LOJA"  , SA1->A1_LOJA )
												oSubFK3:SetValue( "FK3_CGC"   , SA1->A1_CGC )
												oSubFK3:SetValue( "FK3_RAICGC", Substr(SA1->A1_CGC, 1, 8) )
											Endif

											//---------------------------------------------
											// Grava Imposto Retido
											//---------------------------------------------
											If aImpostos[nX][5] > 0   //Houve retencao
												If !oSubFK4:IsEmpty()
													//Inclui a quantidade de linhas necessárias
													oSubFK4:AddLine()

													//Vai para linha criada
													oSubFK4:GoLine( oSubFK4:Length() )
												Endif

												oSubFK4:SetValue( "FK4_IDFK4" , aImpostos[nx,4]	)
												oSubFK4:SetValue( "FK4_DATA"  , dDataBase		)
												oSubFK4:SetValue( "FK4_ORIGEM", cOrigem			)
												oSubFK4:SetValue( "FK4_IMPOS" , aImpostos[nx,1]	)
												oSubFK4:SetValue( "FK4_RECPAG", "R"				)
												oSubFK4:SetValue( "FK4_MOEDA" , "01"			)
												oSubFK4:SetValue( "FK4_VALOR" , aImpostos[nX,5]	)
												oSubFK4:SetValue( "FK4_NATURE", aImpostos[nX,3]	)
												oSubFK4:SetValue( "FK4_FILORI", SE1->E1_FILORIG )
												oSubFK4:SetValue( "FK4_BASIMP", aImpostos[nX][7]	)

												If __lMotRet
													oSubFK4:SetValue( "FK4_CODFKM", aImpostos[nX,8] )
													oSubFK4:SetValue( "FK4_CLIFOR", SA1->A1_COD )
													oSubFK4:SetValue( "FK4_LOJA"  , SA1->A1_LOJA )
													oSubFK4:SetValue( "FK4_CGC"   , SA1->A1_CGC )
													oSubFK4:SetValue( "FK4_RAICGC", Substr(SA1->A1_CGC, 1, 8) )
												Endif

											Endif
										Endif
									Next

									For nX:= 1 to len(aTitCalc)
										FINGFK3BOR(2,aTitCalc[nx,1],aTitCalc[nx,2],aImpostos,.F.)
									Next

									If oModelBx:VldData()
										oModelBx:CommitData()
										SE5->(dbGoto(oModelBx:GetValue( "MASTER", "E5_RECNO" )))
									Else
										lRet := .F.
										cLog := cValToChar(oModelBx:GetErrorMessage()[4]) + ' - '
										cLog += cValToChar(oModelBx:GetErrorMessage()[5]) + ' - '
										cLog += cValToChar(oModelBx:GetErrorMessage()[6])

										Help( ,,"F061PCCBOR",,cLog, 1, 0 )
									Endif

									oModelBx:DeActivate()
									oModelBx:Destroy()
									oModelBx := Nil

									If !lRet
										DisarmTransaction()
										Break
									Endif

								ElseIf nPisCalc + nCofCalc + nCslcalc > 0
									//NÃO Houve retencao de PCC neste titulo
									//E o mesmo pertence ao bordero em processamento
									If !Empty(SE1->E1_NUMBOR)
										FNGFK3BCR(1,"FK7",cChaveFK7,aImpostos,cNumBor)
									Endif

								EndIf

								nPIS		:= 0
								nCOFINS		:= 0
								nCSLL		:= 0
								nIrrf 		:= 0
								nParciais 	:= 0
								nValRec		:= 0
								nVrTitRet	:= 0
								nOldValRec	:= 0

								If nTotBordAc > 0 //Neste caso o valor do bordero acumulado acabou de ser gerado entao nao devo guardar conteudo para gerar novamente.
									nTotBordAc	:=	0
								Endif

								//Grava os IDs de retencao
								If Len(aRetencao) > 0  .And. !lGerTitAc //Titulo retido em outro.
									For nI := 1 to Len(aRetencao)
										If aRetencao[nI,12] <> 'BX'
											aRetencao[nI,25] :=	SE1->(RECNO())
											For nX := 1 to Len(aImpostos)
												IF nX == 1
													aRetencao[nI,25] :=	aImpostos[nX,4]	//Id Retencao PIS
												ElseIf nX == 2
													aRetencao[nI,26] :=	aImpostos[nX,4]	//Id Retencao COFINS
												ElseIf nX == 3
													aRetencao[nI,27] :=	aImpostos[nX,4]	//Id Retencao CSLL
												Endif
											Next
										Endif
									Next
								Endif
								If nVrAc >0 //Gerei titulos acumulados que constam neste bordero.
									lGerTitAc	:=	.T.
								Endif
								If ValType(aDadosRet[2]) <> "U"
									If (aDadosRet[2]+aDadosRet[3]+aDadosRet[4]) > 0   //Gravando valores retidos no vetor aDadosRet para nao influenciar caso tenha um outro titulo neste bordero.
										lDadosRet	:= .T.
									Endif
							Endif

							//Titulos que possuam imposto acumulado.
							ElseiF !__lMotRet .And. !__lPccMR

								//NÃO Houve retencao de PCC neste titulo
								//E o mesmo pertence ao bordero em processamento
								If !Empty(SE1->E1_NUMBOR)
									FNGFK3BCR(1,"FK7",cChaveFK7,aImpostos,cNumBor)
								Endif

								nPis		:=	SE1->E1_PIS
								nCofins 	:=	SE1->E1_COFINS
								nCsll		:=	SE1->E1_CSLL

								If SE1->E1_VALOR>SE1->E1_SALDO  .And. Len(aBaixa) > 0
									nPis		-=	nPisSE5
									nCofins 	-=	nCofSE5
									nCsll		-=	nCsllSE5
								Endif

								aadd(aRetencao, {	SE1->(Recno()),;		// 1
													SE1->E1_CLIENTE,; 		// 2
													SE1->E1_LOJA,;			// 3
													nPis,;          		// 4
													nCofins,;  	 			// 5
													nCsll,;       			// 6
													SE1->E1_STATUS,;		// 7
													nValRec+Iif(lIRPJBaixa .And. SE1->E1_VALOR>SE1->E1_SALDO,nIrrf,0),; // 8
													nIrrf,;                 // 9
													SE1->E1_SALDO,; 		// 10
													"",;					// 11
													'AC',;					// 12  (BO=bordero, AC=acumulado no bordero ,BX=acumulado na baixa)
													cPort060,;				// 13 Portaro
													cAgen060,;				// 14 Agedep
													cSituacao,;  			// 15 Situaca
													cContrato,;				// 16 Contrata
													cNumBor,;				// 17 Numbor
													cConta060,;				// 18 Conta
													'',;					// 19 Prefixo Origem
													'',;					// 20 Numero Origem
													'',;					// 21 Parcela Origem
													'',;					// 22 Tipo Origem
													'',;					// 23 Cf Origem
													"",;					// 24 Loja Origem
													"",;					// 25 ID Retencao PIS
													"",;					// 26 ID Retencao COF
													""})					// 27 ID Retencao CSL

								nVrTitRet	+= 	nValRec+Iif(lIRPJBaixa .And. SE1->E1_VALOR>SE1->E1_SALDO,nIrrf,0)
							Endif
						Endif
					Endif

					If !lImpPIX .And. __lMotRet .And. (__lPccBxMR .Or. __lImpBxMT .Or. __lIrfBxMR)//Calcula os impostos pelo motor de retenões
						aMotRet	:= F061CalImp( SE1->E1_NATUREZ, SE1->E1_CLIENTE, SE1->E1_LOJA, SE1->E1_FILORIG, nValMot, dDataBase, SE1->E1_TIPO )
						If Len(aMotRet) > 0
							F061GrvIMt(aMotRet,cNumBor,cSituacao)
						EndIf
					Endif

					// Atualiza T¡tulos protestados
					IF cSituacao $ "6F"
						dbSelectArea("SA1")
						If (dbSeek(cFilial+SE1->E1_CLIENTE+SE1->E1_LOJA))
							Reclock("SA1",.F.)
							SA1->A1_TITPROT := A1_TITPROT+1
							SA1->A1_DTULTIT := dDataBase
							MsUnlock()
						Endif
					Endif

				Endif

				dbSelectArea("TRB")

				IF _lTFA60BDE
					ExecTemplate("FA60BDE",.F.,.F.)
				Endif

				IF _lFA60BDE
					ExecBlock("FA60BDE",.F.,.F.)
				Endif

				cFilAnt := cFilBack

				IF TRB->E1_OK == cMarca .And. lContabili .And. lLanc .And. !lCtbOfflin .And. lPadrao
					If lPccBxCR
						PIS		:=	SE1->E1_PIS
						COFINS	:=	SE1->E1_COFINS
						CSLL	:= 	SE1->E1_CSLL
					EndIf

					nTotal += DetProva(nHdlPrv,cPadrao,"FINA061",cLote)
				EndIF

				TRB->(dbSkip())
			Enddo

			If cStatusPix <> ""
				PixDelStmt()
			EndIf

			If Len(aRetencao) > 0 .And. lTpJur	.And. (__lMotRet .And. Len(aMotRet))
				F061Grava(aRetencao,nValRec,cNumBor,cSituacao,cPort060,cAgen060,cConta060)
			Endif

			dbSelectArea("SE1")
			dbSetOrder(7)
			dbGoto(nRegSE1)

			If lFa060Se5
				Execblock("FA060SE5",.F.,.F.)
			Endif

			//Posiciona Registros para contabilizacao
			dbSelectArea("SA1")
			dbSeek(cFilial+SE1->E1_CLIENTE+SE1->E1_LOJA)
			dbSelectArea("SA6")
			dbSeek(cFilial+SE1->E1_PORTADO+SE1->E1_AGEDEP)
			dbSelectArea("SEA")
			dbGoto(nRegSEA)
			dbSelectArea("SE1")

			//Envia para Lancamento Contabil, se gerado arquivo
			IF lContabili .And. nC > 0 .And. lLanc
				aDiario := {}

				If UsaSeqCor()
					aDiario := {{"SE5", SE5->(recno()), cCodDiario, "E5_NODIA", "E5_DIACTB"}}
				EndIf

				//Efetiva Lan‡amento Contabil                                      ³
				cA100Incl(cArquivo, nHdlPrv, 3 /*nOpcx*/, cLote, mv_par01 == 1, mv_par02 == 1, /*cOnLine*/, /*dData*/, /*dReproc*/, @aFlagCTB, /*aDadosProva*/, aDiario)
				aFlagCTB := {}
			EndIF

			//Verifica se existe o mesmo numero de bordero gravado, quando ocorrer geracao de bordero em usuarios simultaneos
			cProxNum := cNumBor

			Do While !FA061Num( cProxNum, .F. )
				cNumBor  := cProxNum
				cProxNum := Soma1( cNumBor )
			EndDo

			//Grava o N£mero do bordero atualizado Posicionar no sx6 sempre usando GetMv. N„o utilize Seek !!!  ³
			dbSelectArea("SX6")
			PutMv("MV_NUMBORR", cNumBor)
		END TRANSACTION

		If oImpRetBx != Nil
			oImpRetBx:Destroy()
			oImpRetBx := Nil
		EndIf
	EndIf
	Exit
EndDo
dbSelectArea("SX6")
GetMV("MV_NUMBORR")
MsUnlock()

IF lSaida
	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ Restaura os indices 													  ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	dbSelectArea("TRB")
	dbCloseArea()
	Ferase(cFileWork+GetDBExtension())
	Ferase(cFileWork+OrdBagExt())
	dbSelectArea("SE1")
	dbSetOrder(nIndice)
EndIF

If _lF060Exit			// Log para Saida
	Execblock("F060EXIT",.F.,.F.)
Endif

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³Ponto de entrada para tela de filtro de titulos abrir novamente ou nao³
//³apos inclusao de bordero                                              ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
If ExistBlock("F060LOOP") .And. nOpcx = 3
	lF060LOOP := ExecBlock("F060LOOP",.F.,.F.)
Endif

FreeUsedCode()  //libera codigos de correlativos reservados pela MayIUseCode()
dbSelectArea("SE1")
dbSetOrder(nIndice)
dbGoTo(nSavRec)

Return( Nil )

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ FA061Num ³ Autor ³ Eveli Morasco 		  ³ Data ³ 08/05/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica se o N£mero do bordero informado existe			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ ExpL1 := FA061Num(ExpC1)											  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpL1 = .T. se nao existir e .F. se existir					  ³±±
±±³			 ³ ExpC1 = N£mero do bordero informado 							  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061Num( cNumBor, lHelp )

LOCAL lRetorna := .T.

Default lHelp  := .T.

dbSelectArea("SEA")
dbSetOrder(1)
If dbSeek(xFilial("SEA")+cNumBor,.t.)
	Do While xFilial("SEA") == EA_FILIAL .and. cNumBor == EA_NUMBOR .and. !eof()
		If EA_CART == "R"
			If lHelp
				Help(" ",1,"F240BORDE")
			EndIf
			lRetorna := .F.
			Exit
		Endif
		DbSkip(1)
	EndDO
Else
	If	!MayIUseCode( "SE1"+xFilial("SE1")+cNumBor)
		lRetorna:=.F.
	Endif
Endif
DbSelectArea("SE1")

Return lRetorna

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061TxDes³ Autor ³ Eveli Morasco 		  ³ Data ³ 16/06/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica a taxa de desconto cobrada pelo banco e calcula   ³±±
±±³			 ³ o valor a ser creditado.											  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061TxDes(@ExpN1)													  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpN1 = Endereco do valor liquido calculado pela fun‡„o	  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061TxDes(nValCred,nTaxaDesc,nIof)

If nTaxaDesc < 0
	nValCred := nValor
Else
	nValCred := (nValor*((100-nTaxaDesc)/100))
EndIf
If cPaisloc="BRA" .and. SE1->E1_MOEDA==1
	dbselectarea("SED")
	DbSetOrder(1)
	SED->(dbSeek(xFilial("SED")+cNatureza))
	nIof		:= nValCred*(SED->ED_PERCIOF/100)
	nValCred	-=  nIof
Endif

Return .t.

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³Fa061DbEva³ Autor ³ Eveli Morasco 		  ³ Data ³ 20/05/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Trata o dbeval para marcar e desmarcar item					  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061DBEVA(ExpN1,ExpD1,ExpD2) 									  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpN1 = Limite de valor para marcar T¡tulos					  ³±±
±±³			 ³ ExpD1 = Data de vencimento inicial a considerar 			  ³±±
±±³			 ³ ExpD2 = Data de vencimento final a considerar				  ³±±
±±³			 ³ ExpN1 = Verifica se T¡tulo entrara marcado ou nao			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/

Function Fa061DbEva( nLimite,dVencIni,dVencFim,cAlias,aChaveLbn,lMarkAbt )

Local nData 	 := 0
Local nAbat 	 := 0
Local cChaveLbn := ""
Local bCond
Local lACAtivo  := GetNewPar("MV_ACATIVO",.F.)
Local lRet      := .T.
Local lFa060Vld := ExistBlock("FA060VLD")
Local lBolPIX   := _lVlBcoApi .and. F061BolPix(,SA6->A6_COD, SA6->A6_AGENCIA, SA6->A6_NUMCON)

Local cChaveSE1	:= ""
Local aArea		:= {}
Local aAreaSE1	:= {}
//Se utilizar o Gestao Educacional nao filtra por data de vencimento e nem pela emissao,
//pois já foi filtrado pela funçao AcBordero()
If !lACAtivo
	bCond	:=	{|| ((nValor + E1_SALDO) <= (nLimite) .Or. Empty(nLimite)) .And.;
				E1_VENCREA >= dVencIni .And. E1_VENCREA <= dVencFim	       .And.;
				E1_EMISSAO >= dEmisDe .And. E1_EMISSAO <= dEmisAte}
Else
	bCond	:=	{|| ((nValor + E1_SALDO) <= (nLimite) .Or. Empty(nLimite))}
EndIf

If Eval(bCond) .And. MV_PAR11 == 1
	dbSelectArea("SA1")
	dbSeek(xFilial("SA1")+(cAlias)->E1_CLIENTE+(cAlias)->E1_LOJA)
	dbSelectArea(cAlias)
	If !(FINTP01(.F., cAlias)) // Restringe o uso do programa Financeiro quando a origem do titulo for de origem Totvs Incorporação
		If (lConsBco .And. cPort060 $ (SA1->A1_BCO1+"/"+SA1->A1_BCO2+"/"+SA1->A1_BCO3+"/"+SA1->A1_BCO4+"/"+SA1->A1_BCO5)) .Or. (!lConsBco)
			cChaveLbn := "BOR" + (cAlias)->(xFilial("SE1")+E1_PREFIXO+E1_NUM+E1_PARCELA+E1_TIPO)

			If lFa060Vld
				lRet := ExecBlock( "FA060VLD", .F., .F.,{ cMarca, cAlias })
			EndIf

			dbSelectArea("SE1")
			dbGoto((cAlias)->RECSE1) //Posiciona a SE1 para uso no SomaAbat
			dbSelectArea(cAlias)

			If LockByName(cChaveLbn,.T.,.F.) .And. lRet
				Reclock(cAlias,.F.)

				If Empty(SA1->A1_CGC) .And. _lVlBcoApi .and. lBolApi
					Replace (cAlias)->E1_OK With Space(2)
					_lVlCGCEmp := .T.
				Else
					Replace (cAlias)->E1_OK With cMarca
				Endif

				//Não permite a geração bordero para boletos + PIX dos titulos PIX 				
				If lBolPIX .And. __F713TPix .And. F713TemPix() .and. lBolApi
					(cAlias)->E1_OK := "  "
					_lVlBolPix := .T.
				Endif
				
				MsUnlock()
				If !lMarkAbt .And. !lACAtivo
					nAbat := SomaAbat(E1_PREFIXO,E1_NUM,E1_PARCELA,"R",E1_MOEDA,dDataBase,E1_CLIENTE,E1_LOJA,E1_FILIAL,,E1_TIPO)
				Endif
				If (cAlias)->E1_TIPO $ MVABATIM
					nValor  -= E1_SALDO
				Else
					nValor  += (E1_SALDO - nAbat)
					//Se considerar Acrescimos e Decrescimos
					If mv_par09 == 1
						nValor += E1_SDACRES - E1_SDDECRE
					Endif
					//Calculo de Valor Acessorio
					cChaveSE1	:= (cAlias)->E1_PREFIXO + (cAlias)->E1_NUM +(cAlias)->E1_PARCELA +(cAlias)->E1_TIPO
					aArea		:= GetArea()
					aAreaSE1	:= SE1->(GetArea())
					dbSelectArea("SE1")
					dbSetOrder(1)
					If _lExistVA .and. SE1->(DbSeek(xFilial("SE1")+cChaveSE1))
						nValor += FValAcess(E1_PREFIXO,E1_NUM,E1_PARCELA,E1_TIPO,E1_CLIENTE,E1_LOJA,E1_NATUREZ, Iif(Empty(E1_BAIXA),.F.,.T.),"","R",E1_BAIXA)
					EndIf
					RestArea(aAreaSE1)
					RestArea(aArea)
				Endif
				If ExistBlock("F060DPM")
					nData := ExecBlock("F060DPM",.F.,.F.)
				Else
					nData := E1_VENCREA - E1_EMISSAO
				Endif
				nPrazo	  += ( nData * E1_SALDO )
				nQtdTit++
				nSomaData  += nData
				If Ascan(aChaveLbn, cChaveLbn) == 0
					Aadd(aChaveLbn,cChaveLbn)
				Endif
			Endif
		Endif
	Endif
EndIf

Return

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ fA061Pad ³ Autor ³ Wagner Xavier 		  ³ Data ³ 26/05/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica qual Lancamento Padrao sera sugerido para o		  ³±±
±±³			 ³ usuario, de acordo com a situa‡„o do T¡tulo. 				  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ ExpC1:=FA061Pad(ExpC2)												  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function fA061Pad(cSituacao)

	Local cPadrao 		:= Space(3)

	cSituacao := AllTrim(cSituacao)

	If cSituacao $ "0FG"	//Carteira, Carteira Protesto e Carteira Acordo
		cPadrao := "547"
	ElseIf cSituacao $ "1H"	//Simples, Cartorio
		cPadrao := "548"
	ElseIf cSituacao = "3"	//Caucionada
		cPadrao := "550"
	ElseIf cSituacao = "4"	//Vinculada
		cPadrao := "551"
	ElseIf cSituacao = "5"	//Advogado
		cPadrao := "552"
	ElseIf cSituacao = "6"	//Judicial
		cPadrao := "553"
	EndIf

Return cPadrao

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ FA061DATA³ Autor ³ Wagner Xavier 		  ³ Data ³ 08/05/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica se data final ‚ maior que data inicial 			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061DATa(ExpD1,ExpD2)												  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpD1 = Data Inicial 												  ³±±
±±³			 ³ ExpD2 = Data Final													  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061DATA(dVencIni,dVencFim)
LOCAL lRet:=.T.
IF dVencFim<dVencIni
	Help(" ",1,"DATAMENOR")
	lRet:=.F.
EndIF
Return lRet

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061Canc ³ Autor ³Andrea Verissimo Santia³ Data ³ 02/07/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Cancela Borderos											  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061Canc() 												  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ 															  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061													  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function Fa061Canc()

Local cSituaca		:=Space(1)
Local lFirst		:= .t.
Local lFirstL		:= .t.
Local cPortador		:= ""
Local cAgeDep		:= ""
Local cConta		:= ""
Local cPadrao		:= "554"
Local nTotal		:= 0
Local cArquivo
Local lDigita		:= .F.
Local nCount		:= 0
Local lPadrao		:= .f.
Local lAglut		:= .F.
Local cTamDoc		:= CriaVar("E5_DOCUMEN")
Local nTamBor		:= CriaVar("EA_NUMBOR")
Local cBorder		:= ""
Local nRegSE1		:= 0
Local nOrdSE1		:= 0
Local nValSaldo		:= 0
Local lCancela		:= .t.
Local cPortAnt		:= ""
Local cAgeAnt		:= ""
Local cContAnt		:= ""
Local lPanelFin		:= IsPanelFin()

//--- Tratamento Gestao Corporativa
Local aFlagCTB		:= {}
Local lUsaFlag		:= SuperGetMV( "MV_CTBFLAG" , .T. /*lHelp*/, .F. /*cPadrao*/)
Local nI			:= 0
Local aBaixa		:= {}
Local nTotAdto   	:= 0
Local lBaixaAbat 	:= .F.
Local nVlrBaixa  	:= 0
Local lBxCec     	:= .F.
Local lBxLiq		:= .F.
Local lTipBxCP   	:= .F.
Local lSigaloja		:= .F.
Local lNumBco		:= .F.
Local nPisSE5		:= 0
Local nCofSE5		:= 0
Local nCsllSE5		:= 0
Local lIRPJBaixa	:= .F.
Local lPccBxCr 		:= FPccBxCr() //Controla o Pis Cofins e Csll na baixa  (1-Retem PCC na Baixa ou 2-Retem PCC na Emissão(default) )
Local lTpJur		:= .F.
Local cFilBack		:= cFilAnt
Local nX			:= 0
Local nAscan		:= 0
Local aImpMotR	:= {}
Local aAreaSE5 	:= {}
Local dDtGerBor	:= CTOD("  /  /  ")	

//=====================================
//Trecho alterado com o uso dos models:
//=====================================
Local aImpPCC		:= {{"PIS"},{"COF"},{"CSL"},{"IRF"},{"ISS"}}
Local cIdDoc	 	:= ""
Local cChaveTit		:= ""

//Contabilização Offline
Local cAgenciSE1	:= ""
Local cContaSE1		:= ""
Local lCont 		:= MV_PAR03 == 1
Local lContabili    := .T.
Local lCtbOfflin	:= .F.
Local lVldCtbOff	:= .F.
Local cNovaSit      := Nil
Local lImpPIX		:= .F.
Local cChave 		:= ""
Local cStatusPix	:= ""
Local lCancAPI      As Logical
Local aFI2API       As Array
Local aAuxFI2       As Array
Local jApiMsg       As Object

// Motor de Retenção
Private cNatureza 	:= Space(10)
Private lMsErroAuto 	:= .F.
Private nIof			:= 0
Private nValCred := 0 // para não dar erro no cancelamento.
Private nValor := 0

_lFA60Can1	:= ExistBlock("FA60CAN1")
_lTFA60Can2	:= ExistTemplate("FA60CAN2")
_lFA60Can2	:= ExistBlock("FA60CAN2")
__l241Canc  := Iif(__l241Canc == Nil, FindFunction("F241DtCanc"), __l241Canc)    

//Limpa as variáveis do Motor de Retenção.
__lImpBxMT	:= .F.

lCancAPI := .F.

If _lTitTemPIX == Nil .Or. _cSitPIX == Nil
	_lTitTemPIX := FindFunction("TitTemPIX")
	If _lTitTemPIX .And. FindFunction("F022SITPIX")
		_cSitPIX := F022SITPIX()
	Endif
Endif

If _cSitPIX == Nil .Or. Empty(_cSitPIX)
	_cSitPIX := "0"
Endif

nIndice := SE1->(Indexord())

DbSelectArea("SX3")
DbSetOrder(2)

If SX3->(DBSeek("E1_NUMBCO"))
	lNumBco := X3USO(X3_USADO)
Endif

//======================================================================================================
// Verifica se data do movimento nao é menor que data limite de movimentacao no financeiro
//======================================================================================================
If !DtMovFin(,,"2")
	Return
Endif

//======================================================================================================
// Verifica as perguntas selecionadas
//======================================================================================================
If lPanelFin
	If !PergInPanel("AFIC60",.T.)
		Return .T.
	Endif
ElseIf ! Pergunte("AFIC60" ,.T.)
	Return .T.
EndIf

mv_par01:=IIF(Valtype(mv_par01)==NIL,Space(6),mv_par01)
cBorder	:= mv_par01+Space(Len(cTamDoc)-(Len(nTamBor)))

If Empty(cBorder)
	Help(" ",1,".AFIC6001.")
	Return .T.
Endif

//Não permite excluir o bordero se um dos titulos pertencente ao bordero estiver baixado
dbSelectArea("SEA")
dbSetOrder(2)
If dbSeek(xFilial("SEA")+mv_par01+"R")

	If FN022SITCB(SEA->EA_SITUACA)[3] //SEA->EA_SITUACA $ "27"
		Help(" ",1,"AFIC61DSC" ,,STR0110,1,0)		//"Este borderô não foi gerado por esta rotina. Para cancelar, utilize a opção Atualizações\Contas a Receber\Transferências"
		Return .T.
	Endif

	//Não permite excluir o bordero se um dos titulos pertencente ao bordero estiver baixado
	If cPaisLoc <> "BRA" .And. !FN022SITCB(SEA->EA_SITUACA)[3]
		SE1->(DbSetOrder(5))
		SE1->(dbSeek(xFilial("SE1")+mv_par01))

		While SE1->(!Eof()) .and. SE1->E1_NUMBOR == mv_par01 .and. SE1->E1_FILIAL == xFilial("SE1")
			If SE1->E1_SALDO <> SE1->E1_VALOR
				MsgAlert(STR0075+" "+mv_par01+" "+STR0076+chr(13)+;//"Para el Bordero num. " - "Ya existe titulo dado de baja"
				STR0068+" "+AllTrim(SE1->E1_NUM)+" "+STR0077)   //"Titulo"  // ", anule primero la baja del titulo y despues borre el Bordero."
				Return .T.
			EndIf
			SE1->(dbSkip())
		Enddo
	EndIf

	//Garanto o Posicionamento no bordero de EA_CART = R
	While SEA->(!Eof()) .and. EA_NUMBOR == mv_par01 .and. EA_FILIAL == xFilial()
		If SEA->EA_CART != "R"
			dbSkip()
		Else
			Exit
		Endif
	Enddo

	If __l241Canc .And. !F241DtCanc(dDataBase, SEA->EA_NUMBOR, SEA->EA_CART, SEA->EA_FILIAL, @dDtGerBor, @_oBorDtCan, .F.)
		Help(" ",1,"FA061DTCAN",,STR0172 + SEA->EA_NUMBOR + STR0173 + DTOC(dDtGerBor) + STR0174,1,1) //"Não é permitido cancelar o borderô "### " com data anterior à sua geração (" ### ")."
		Return .F.
	EndIf

	// Verifica se existem títulos transferidos por API e se continua o processo
    If _lBCOApi .And. FindFunction('F713VldBol')
		If SEA->EA_BORAPI == 'S' .AND. FindFunction('F713VldAlCa') .AND. F713VldAlCa() .AND. FindFunction('F713CanFI2') .AND. F713CanFI2(xFilial('SEA'),MV_PAR01)
			lCancAPI := .T.
        ElseIf F713VldBol(.T., xFilial('SEA'), MV_PAR01)
            Return .T.
        EndIf
    EndIf

	BEGIN TRANSACTION

		nValSaldo := 0
		dbSelectArea("SEA")
		dbSetOrder(2) // EA_FILIAL+EA_NUMBOR+EA_CART+EA_PREFIXO+EA_NUM+EA_PARCELA+EA_TIPO+EA_FORNECE+EA_LOJA                                                                             

        If Alltrim(SEA->EA_SITUACA) == '3'
            lContabili := lCont
        EndIf

		lVldCtbOff 	:= FindFunction("F060VldCtb") .And. F060VldCtb()
		lPadrao 	:= VerPadrao(cPadrao)

		//Se existe contabilização offline
		If lVldCtbOff
			lContabili := .T. // Idependente do parametro sempre gera a movimentação basedo do MV_PAR05
			If MV_PAR05 == 2 //Se Offline igual a SIM ou LP inexistente
				lCtbOfflin := .T.
			EndIf
		ElseIf !lCont
			lCtbOfflin := .T.
		EndIf

		While !Eof() .and. SEA->(EA_FILIAL+EA_NUMBOR) == xFilial("SEA")+mv_par01 .and. SEA->EA_CART == "R"

			cSitAnt := EA_SITUANT
			cPortAnt:= EA_PORTANT
			cAgeAnt := EA_AGEANT
			cContAnt:= EA_CONTANT
			dbSelectArea("SE1")
			dbSetOrder(1)
			If dbSeek(xFilial("SE1",SEA->EA_FILORIG)+SEA->EA_PREFIXO+SEA->EA_NUM+SEA->EA_PARCELA+SEA->EA_TIPO)
			    cFilAnt := SEA->EA_FILORIG
				nCount++
				cSituaca:=SE1->E1_SITUACA
				VALOR := 0
				IOF	  := 0
				VALOR2 := 0
				PIS		:= 0
				COFINS := 0
				CSLL	:= 0

			   	DbSelectArea("SA6")
			   	DbSetOrder(1)
				DbSeek(xFilial("SA6")+SEA->(EA_PORTADO+EA_AGEDEP+EA_NUMCON))

		  		DbSelectArea("SE1")

				SA1->(dbSetOrder(1))
				SA1->(MsSeek(xfilial("SA1") + SE1->(E1_CLIENTE+E1_LOJA)))
				nRegSA1 := SA1->(Recno())

				SED->(dbSetOrder(1))
				SED->(MsSeek(xfilial("SED") + SE1->E1_NATUREZ))
				nRegSED := SED->(Recno())

				SE5->(dbSetOrder(7))
				SE5->(MsSeek(xfilial("SE5")+SE1->E1_PREFIXO+SE1->E1_NUM+SE1->E1_PARCELA+SE1->E1_TIPO+SE1->E1_CLIENTE+SE1->E1_LOJA))

				// Função que seleciona as baixas a cancelar
				__lPccMR 	:= .F.
				__lIrfMR	:= .F.
				lImpPIX		:= .F.

				If _lTitTemPIX .And. TitTemPIX()
				    cChave  := SE1->E1_FILIAL + "|" +  SE1->E1_PREFIXO + "|" + SE1->E1_NUM + "|" + SE1->E1_PARCELA + "|" + ;
                    SE1->E1_TIPO   + "|" +  SE1->E1_CLIENTE + "|" + SE1->E1_LOJA
        			cIdDoc  := FinBuscaFK7(cChave,"SE1")

					cStatusPix := PixStatus(SE1->E1_FILIAL ,cIdDoc)
					If !(cStatusPix $ '1|7')
						lImpPIX := .T.  // Se o titulo esta no pix ainda ativo, não deleto os impostos mesmo que eles tenham sido gerados pelo FINA061
					EndIf
				EndIf

				//Verifico os impostos que estão configurados pelo Motor
				//Motor de Retencoes
				If __lMotRet .And. !lImpPIX
					F061CalImp( SE1->E1_NATUREZ, SE1->E1_CLIENTE, SE1->E1_LOJA, SE1->E1_FILORIG, SE1->E1_VALOR, dDataBase, SE1->E1_TIPO )
					aSize ( __aImpos, 0 ) // Limpo o array de calculo pois apenas preciso saber os impostos a serem calculados.
					__aImpos := {}
				EndIf
				//Somente gerar IRRF e PCC na baixa para pessoa juridica.
				If !(cPaisLoc == "TRI")
					If SA1->A1_PESSOA == "J"
						lTpJur	:=	.T.
					Endif
				Endif

				// Verifica se é IRPF pela Baixa para guardar os títulos que devem ter retenção //A1_FILIAL+A1_COD+A1_LOJA
				If !__lIrfMR
					lIRPJBaixa :=	SA1->A1_IRBAX == "1" .And. !(SA1->A1_ENTID $ "00_02_10") .And. ;
								IIf( cPaisLoc != "TRI", (SA1->A1_PESSOA == "J" .and. SED->ED_CALCIRF = "S"), .F.)
				Else
					lIRPJBaixa := __lIrfBxMR
				EndIf

		      	VAR_IXB   	:= SE1->E1_PORTADO  // Guardo portador anterior, para possivel utilizacao no LP
				STRLCTPAD 	:= SE1->E1_SITUACA  // Guardo situacao anterior, para possivel utilizacao no LP
				cAgenciSE1	:= SE1->E1_AGEDEP
				cContaSE1	:= SE1->E1_CONTA

				IF !lCtbOfflin .And. lPadrao .And. lFirstL .and. nCount >= 1 .And. lContabili
					//===================================================================
					// Inicializa Lancamento Contabil
					//===================================================================
					nHdlPrv := HeadProva( cLote,;
										"FINA061" /*cPrograma*/,;
										Substr( cUsuario, 7, 6 ),;
										@cArquivo )
					lFirstL:=.F.
				Endif

                //[01] = FWI_LA ('S' ou 'N')
                //[02] = FWI_LANPAD (Lançamento Padrão utilizado)
                //[03] = FWI_VALOR (Valor da Movimentação)
                //[04] = FWI_DESCON (Desconto da Movimentação)
                //[05] = FWI_IOF (Valor do IOF)
                //[06] = FWI_SITUAC (Carteira Atual)
                //[07] = FWI_SITANT (Carteira Anterior)
                //[08] = FWI_BCOANT (Portador Anterior)
                //[09] = FWI_AGEANT (Agência Anterior)
                //[10] = FWI_CONANT (Número da Conta Anterior)
                //[11] = FWI_CONTRA (Contrato)
                //[12] = FWI_IDMOV (Id da Movimentação na FK5)
                //[13] = FWI_NUMBOR (Número do Borderô)
                If lVldCtbOff
                    FinAGrvFWI({IIf(!lCtbOfflin .And. lPadrao, "S", "N"), cPadrao, SE1->E1_SALDO, 0, nIof, cSitAnt,;
                        STRLCTPAD, VAR_IXB, cAgenciSE1, cContaSE1, SE1->E1_CONTRAT, "", SEA->EA_NUMBOR})
                EndIf

				IF !lCtbOfflin .And. lPadrao .And. nCount >= 1 .And. !lTpJur  .And. lContabili
					nTotal+=DetProva(nHdlPrv,cPadrao,"FINA061",cLote)
				EndIF

				IF _lFA60Can1
					lCancela := ExecBlock("FA60CAN1",.F.,.F.)
				Endif

				If ValType(lCancela) != "L" .Or. lCancela // Trata o retorno do PE para permitir ou nao o cancelamento.

					If lTpJur .And. !lImpPIX

						nValSaldo += SE1->E1_SALDO
						nSaldo    := SE1->E1_SALDO

						dBaixa		:=	CriaVar("E1_BAIXA")
						nTxMoeda 	:=	If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)
						nParciais	:= 		nPisSE5	:=	nCofSE5	:=	nCsllSE5	  := 0
						aBaixa		:= {}
						aBaixaSE5	:= {}

						aAreaSE5	:= SE5->(GetArea())

						If (SE1->E1_VALOR > SE1->E1_SALDO) .And. Empty(SE1->E1_TIPOLIQ)	//Verificar valores de baixas existentes no titulo.
							lTipBxCP	:=	lRaRtImp
							aBaixa		:= 	Sel070Baixa( "VL /V2 /BA /RA /CP /LJ /" + MV_CRNEG, SE1->E1_PREFIXO, SE1->E1_NUM, SE1->E1_PARCELA, SE1->E1_TIPO,;
													@nTotAdto, @lBaixaAbat, SE1->E1_CLIENTE, SE1->E1_LOJA, @nVlrBaixa, , @lBxCec, @lBxLiq ,@lSigaloja, @lTipBxCP)
							For nI := 1 To Len(aBaixaSE5)
								nParciais += aBaixaSE5[nI][8]
								If lPccBxCR .And. lRaRtImp
									nParciais += aBaixaSE5[nI][18]+aBaixaSE5[nI][19]+aBaixaSE5[nI][20]+aBaixaSE5[nI][30]// somar impostos PCC
								Endif
								nPisSE5	+= aBaixaSE5[nI][18]
								nCofSE5	+= aBaixaSE5[nI][19]
								nCsllSE5	+= aBaixaSE5[nI][20]
							Next
							nParciais += nTotAdto
							If SE1->E1_SDDECRE <> SE1->E1_DECRESC //Soma valor de decrescimo em baixas parciais, para evitar diferencas entre valor original e valor recebido
								nParciais += ( SE1->E1_DECRESC - SE1->E1_SDDECRE )
							EndIf
						Else
							nParciais 	:= SE1->E1_VALOR-SE1->E1_SALDO
						Endif

						RestArea(aAreaSE5)

						If SE1->E1_TIPO $ MVRECANT
							nParciais 	:= SE1->E1_VALOR-SE1->E1_SALDO
						Endif

						nIrrfFina061		:=	nPisFina061	:=	nCofFina061	:=	nCslFina061	:= 	0

						nRegSE1	:=	SE1->(Recno())
						nOrdSE1	:= SE1->(IndexOrd())

						IF !lCtbOfflin .And. lPadrao .and. nCount >= 1 .And. lContabili
							If lPccBxCr
								PIS		:=	SE1->E1_PIS
								COFINS	:=	SE1->E1_COFINS
								CSLL	:= 	SE1->E1_CSLL
							EndIf
							nTotal+=DetProva(nHdlPrv,cPadrao,"FINA061",cLote)
							If lPccBxCr
								PIS		:=	0
								COFINS	:=	0
								CSLL	:= 	0
							EndIf
						EndIF

						F061DelReg(SE1->E1_PREFIXO,SE1->E1_NUM,SE1->E1_PARCELA,SE1->E1_TIPO,SE1->E1_CLIENTE,SE1->E1_LOJA,lPccBxCR,lIRPJBaixa,SE1->(Recno()),nParciais,__lMotRet,__lPccBxMR,__lIrfBxMR,__lImpBxMT)

						//Deleto os registros FK3 de impostos retidos em outros titulos
						//Dados da tabela auxiliar com o código do título a pagar
						cChaveTit := xFilial("SE1") + "|" + SE1->E1_PREFIXO + "|" + SE1->E1_NUM     + "|" + SE1->E1_PARCELA + "|" + ;
					    	          						SE1->E1_TIPO    + "|" + SE1->E1_CLIENTE + "|" + SE1->E1_LOJA
						cIdDoc := FINGRVFK7( "SE1", cChaveTit )
						If __lMotRet .And. (__lPccBxMR .or. __lImpBxMT .or. __lIrfBxMR)
							aImpMotR := FinImpConf( "2", SE1->E1_FILORIG, SE1->E1_CLIENTE, SE1->E1_LOJA, SE1->E1_NATUREZ )
							For nX:= 1 to Len(aImpMotR)
							nAscan := Ascan(aImpPCC,{|x| x[1]==aImpMotR[nX][1]})
							If nAscan == 0
								Aadd(aImpPCC,{aImpMotR[nX][1]})
							EndIf
							Next nX
						EndIf

						FNGFK3BCR(3,"FK7",cIdDoc,aImpPCC)

					Endif

					If _lTitTemPIX .And. TitTemPIX()
						cNovaSit := _cSitPIX
					Else
						cNovaSit := "0"
					Endif

					dbSelectArea("SE1")
					Reclock("SE1")
					SE1->E1_NUMBOR   	:= Space(6)
					SE1->E1_PORTADO  	:= cPortAnt
					SE1->E1_AGEDEP  	:= cAgeAnt
					SE1->E1_SITUACA 	:= cNovaSit
					SE1->E1_CONTRAT  	:= Space(15)
					SE1->E1_DATABOR  	:= Ctod(Space(8))
					SE1->E1_MOVIMENT  	:= Ctod(Space(8))
					SE1->E1_CONTA	  	:= cContAnt

					If mv_par10 == 1
						SE1->E1_VENCREA  := Datavalida(E1_VENCTO,.T.)
					EndIf

					If !lNumBco
						SE1->E1_NUMBCO  := ""
					Endif

					If !FN022SITCB(cSituaca)[3] // (cSituaca $ "27")
						SE1->E1_VALLIQ	:=	0
						SE1->E1_SALDO	+=	Iif(lPccBxCR,(nPisFina061 + nCslFina061 + nCofFina061),0) + Iif(lIRPJBaixa,nIrrfFina061,0) + __nVlImpMt					
						
						If SE1->E1_SALDO > 0 .And. !Empty(SE1->E1_BAIXA) .And. SE1->E1_SALDO == SE1->E1_VALOR
							SE1->E1_BAIXA := CToD("  /    /  ")
						EndIf					
					Endif
					
					If SE1->E1_SALDO > 0
						SE1->E1_STATUS  := "A"
					Endif
					
					MsUnlock()
					FKCOMMIT()
					nValSaldo += SE1->E1_SALDO
					// Atualiza tambem os registros agregados
					F061AtuAgre()
					dbSelectArea("SA1")
					If (dbSeek(xFilial("SA1")+SE1->E1_CLIENTE+SE1->E1_LOJA))
						If (cSituaca  $ "6F") .And. (SA1->A1_TITPROT >= 0)
							Reclock("SA1")
							SA1->A1_TITPROT := A1_TITPROT-1
							If SA1->A1_TITPROT == 0
								SA1->A1_DTULTIT := cToD("")
							Endif
							MsUnlock()
						Endif
					Endif

				Endif

				//===================================================================
				// Pontos de Entrada
				//===================================================================
				IF _lTFA60Can2
					ExecTemplate("FA60CAN2",.F.,.F.)
				Endif
				IF _lFA60Can2
					ExecBlock("FA60CAN2",.F.,.F.)
				Endif

			Endif
			dbSelectArea("SEA")
			If lFirst
				cPortador:= EA_PORTADO
				cAgeDep	:= EA_AGEDEP
				cConta	:= EA_NUMCON
				dData 	:= EA_DATABOR
				lFirst:=.f.
			Endif
			// Trata o retorno do PE FA60CAN1 para permitir ou nao o cancelamento
			If ValType(lCancela) != "L" .Or. lCancela
				If lCancAPI .AND. SEA->EA_BORAPI == 'S' .AND. SEA->EA_TRANSF == 'S'
					aFI2API := {}
					aAuxFI2 := {}
					
					jApiMsg := JsonObject():New()
					jApiMsg:FromJson(SEA->EA_APIMSG)  

					Aadd(aAuxFI2, '  '      )				//	Ocorrencia,'A',SE1->E1_VENCREA,M->E1_VENCREA,'E1_VENCREA','D','1'})
					Aadd(aAuxFI2, 'C'       )				// 'Operação 'A' - Alteração / 'C' - Cancelamento
					Aadd(aAuxFI2, ''        )           	// Conteudo anterior
					Aadd(aAuxFI2, ''        )       		// Conteudo atual
					Aadd(aAuxFI2, ''        )               // Campo
					Aadd(aAuxFI2, ''       )				// Tipo do campo
					Aadd(aAuxFI2, '1'       ) 				// Carteira
					Aadd(aAuxFI2, jApiMsg:ToJson()	) 		// FI2_HISTOR -> Guardar o EA_APIMSG para utilizar informações no cancelamento
					
					Aadd(aFI2API , aAuxFI2)                        
					FGrvFI2API(aFI2API)
				EndIf			
				cFilAnt:= cFilBack
				RecLock("SEA")
				dbDelete()
				MsUnlock()
				FKCOMMIT()
			Endif
			dbSkip()
		Enddo

		If cStatusPix <> ""
			PixDelStmt()
		EndIf

		If lTpJur
			F061TitBx(cBorder, cPortador, cAgeDep,cConta) //Excluir registros criados neste bordero referente a baixas realizadas em titulos.
	   	Endif

   		nRegSE1 := SE1->(RecNo())
		dbSelectArea("SE1")
		dbGoBottom()
		dbSkip()
		dbSelectArea("SE5")
		VALOR := Iif (FN022SITCB(cSituaca)[3],nValDesc,nValSaldo)
		IOF	   := nIof
		VALOR2 := nValSaldo
		SE1->(dbGoto(nRegSE1))

		IF !lCtbOfflin .And. lPadrao .and. nCount >= 1 .And. lContabili
			//===================================================================
			// Prepara Lancamento Contabil
			//===================================================================
			If lUsaFlag  // Armazena em aFlagCTB para atualizar no modulo Contabil
				aAdd( aFlagCTB, {"E5_LA", "S", "SE5", SE5->( Recno() ), 0, 0, 0} )
			Endif

			lDigita:= IIF(MV_PAR02==1,.T.,.F.)
			lAglut := IIF(MV_PAR03==1,.T.,.F. )

			If UsaSeqCor()
				aDiario := {{"SE5",SE5->(recno()),cCodDiario,"E5_NODIA","E5_DIACTB"}}
			Else
				aDiario := {}
			EndIf
			// Efetiva Lan‡amento Contabil

			cA100Incl( cArquivo,;
			           nHdlPrv,;
			           3 /*nOpcx*/,;
			           cLote,;
			           lDigita,;
			           lAglut,;
			           /*cOnLine*/,;
			           /*dData*/,;
			           /*dReproc*/,;
			           @aFlagCTB,;
			           /*aDadosProva*/,;
			           aDiario )
			aFlagCTB := {}  // Limpa o coteudo apos a efetivacao do lancamento
		EndIf

	END TRANSACTION
	If _oBorDtCan <> Nil
        _oBorDtCan:Destroy()
        _oBorDtCan:= Nil
    EndIf
EndIf

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Restaura a integridade da janela									  ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
dbSelectArea("SE5")
Set Filter to
RetIndex("SE5")
dbSetOrder(1)
dbSelectArea("SE1")
dbSetOrder(nIndice)
dbSeek(xFilial("SE1"))

Return .t.

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ FA061NumC³ Autor ³ Paulo Boschetti		  ³ Data ³ 06/12/93 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica se o N£mero do bordero informado existe			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ ExpL1 := FA240Num(ExpC1)											  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³  ExpC1 = N£mero do bordero informado							  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061NumC()
LOCAL lRetorna:=.F.,nSavRec,cAlias

cAlias:=Alias()
dbSelectArea("SEA")
nSavRec := RecNo()
dbSetOrder(1)

dbSeek(xFilial("SEA")+mv_par01,.t.)
Do While xFilial("SEA") == EA_FILIAL .and. mv_par01 == EA_NUMBOR .and. !eof()
	If EA_CART == "R"
		lRetorna:=.t.
		Exit
	Endif
	DbSkip(1)
EndDO

If !lRetorna .or. Empty(mv_par01)
	Help(" ",1,"F060NOBORD")
	lRetorna := .F.
EndIf

dbGoto(nSavRec)
dbSelectArea(cAlias)
Return lRetorna

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061MarkB³ Autor ³ Pilar S. Albaladejo   ³ Data ³ 20/12/96 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ MarkBrowse para Windows 											  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function Fa061MarkB(cAlias,nLimite,dVencIni,dVencFim,cSituacao,oPrazoMed,oValor,aCampos,cNumBor,lMarkAbt,nIndice,lAutomato)

Local nRec		:= 0
Local bWhile
Local oDlg1		:= NIL
Local nOpca 	:= 0
Local oFnt
Local aBut060	:= {}
Local bSet16	:= SetKey(16,{||Fa061Pesq(oMark,"TRB",nIndice)})
Local aChaveLbn := {}
Local lF060Mark := ExistBlock("F060MARK")
Local lF060COL	:= ExistBlock("F060COL")
Local lRemHTML := GetRemoteType() == REMOTE_HTML
DEFAULT  nIndice := cAlias->(Indexord())
DEFAULT lAutomato := .F.

aBut060 := {{"PESQUISA",{||Fa061Pesq(oMark,"TRB",nIndice)}, STR0074,STR0001}} //"Pesquisar..(CTRL-P)"###"Pesquisar"

DEFINE FONT oFnt NAME "Arial" SIZE 12,14 BOLD

nPrazo := 0
nValor := 0

_lVlCGCEmp  := .F.
_lVlBolPix := .F.

dbSelectArea(cAlias)
bWhile := { || ! Eof() }
nRec:=RecNo()
dbSeek(xFilial("SE1"))
DBEVAL( { |a| FA061DBEVA(nLimite,dVencIni,dVencFim,"TRB",aChaveLbn,lMarkAbt) } , bWhile )
dbGoto(nRec)
nOpca :=0

If lBolApi
	If _lVlCGCEmp
		Help(" ",1,"CAD_DESAT_INI",, STR0179 + CRLF + CRLF + STR0180 ,1,,,,,,, { STR0181 }) // "Como este borderô será transmitido automaticamente para o banco selecionado, faz-se necessário que todos os clientes possuam CNPJ/CPF." # Identificamos clientes sem esta informação, logo, os títulos destes clientes não permitirão sua seleção. #"Ajustar campo CNPJ/CPF em base de dados"
	Endif

	If _lVlBolPix
		Help(" ",1,"BOLPIX_INI",, STR0185, 1) //"A conta selecionada está configurada para Boleto + PIX, logo, os títulos que estão em situação de cobrança PIX não serão marcados na tela de seleção."
	Endif
Endif

//Ponto de entrada para possibilitar alteracao do valor total do bordero
If ExistBlock ("F060VLTOT")
	nValor:= ExecBlock("F060VLTOT",.F.,.F.,{nValor})
EndIf

If !lAutomato
	//Faz o calculo automatico de dimensoes de objetos
	oSize := FwDefSize():New(.T.)

	oSize:lLateral := .F.
	oSize:lProp	:= .T. // Proporcional

	oSize:AddObject( "1STROW" ,  100, 08, .T., .T. ) // Totalmente dimensionavel
	oSize:AddObject( "2NDROW" ,  100, 92, .T., .T. ) // Totalmente dimensionavel

	oSize:aMargins := { 3, 3, 3, 3 } // Espaco ao lado dos objetos 0, entre eles 3

	oSize:Process() // Dispara os calculos

	a1stRow :=	 {	oSize:GetDimension("1STROW","LININI"),;
					oSize:GetDimension("1STROW","COLINI"),;
					oSize:GetDimension("1STROW","LINEND"),;
					oSize:GetDimension("1STROW","COLEND")}

	a2ndRow := {	oSize:GetDimension("2NDROW","LININI"),;
					oSize:GetDimension("2NDROW","COLINI"),;
					oSize:GetDimension("2NDROW","LINEND"),;
					oSize:GetDimension("2NDROW","COLEND")}

	DEFINE MSDIALOG oDlg1 TITLE STR0047 From oSize:aWindSize[1],oSize:aWindSize[2] to oSize:aWindSize[3],oSize:aWindSize[4] OF oMainWnd PIXEL // "Bordero de Cobran‡a"
	oDlg1:lMaximized := .T.

	nTop		:= a1stRow[1] + ((a1stRow[3] - a1stRow[1]) % 2) + 1
	nBottom	:= a1stRow[1] + ((a1stRow[3] - a1stRow[1]) / 2) + 1

	////////
	// Panel
		@ a1stRow[1], a1stRow[2] To a1stRow[3], a1stRow[4] PIXEL OF oDlg1
		@ nTop, a1stRow[2] + 005 Say STR0023 FONT oDlg1:oFont PIXEL Of oDlg1 // "Border“ N§"
		If lRemHTML
			@ nTop, a1stRow[2] + 060 Say cNumbor Picture "@!" COLOR CLR_HBLUE  PIXEL Of oDlg1
		Else
			@ nTop, a1stRow[2] + 060 Say cNumbor Picture "@!" PIXEL Of oDlg1 FONT oFnt
		EndIf

		@ nBottom, a1stRow[2] + 005 Say STR0048  PIXEL Of oDlg1 //"Valor Total:"
		@ nBottom, a1stRow[2] + 060 Say oValor VAR nValor Picture cPict06014 SIZE 60,8  PIXEL Of oDlg1
		@ nBottom, a1stRow[2] + 150 Say STR0049  PIXEL Of oDlg1 //"Quantidade:"
		@ nBottom, a1stRow[2] + 200 Say oQtda VAR nQtdTit Picture "@E 99999" SIZE 50,8  PIXEL Of oDlg1
	// Panel
	////////

	//////////////
	// Mark Browse
	   	IF lF060COL
	   		aCampos:= ExecBlock("F060COL",.F.,.F.,{aCampos})
	   	EndIf

		oMark := MsSelect():New(cAlias,"E1_OK","!E1_SALDO",aCampos,@lInverte,@cMarca,{a2ndRow[1],a2ndRow[2],a2ndRow[3],a2ndRow[4]})

		oMark:bMark := {| | fa061disp(cMarca,lInverte,oValor,oQtda,oPrazoMed,lF060Mark,nLimite,lMarkAbt)}
		oMark:oBrowse:lhasMark = .t.
		oMark:oBrowse:lCanAllmark := .t.
		oMark:bAval	:= {||Fa061bAval(cMarca,oValor,oQtda,oPrazoMed,nLimite,lMarkAbt,aChaveLbn,lF060Mark)}
		oMark:oBrowse:bAllMark := { || FA061Inverte(cMarca,oValor,oQtda,oPrazoMed,nLimite,lMarkAbt,aChaveLbn,,,lF060Mark) }
	// Mark Browse
	//////////////

	Aadd( aBut060, {"S4WB005N",{ || Fa061Visu() }, OemToAnsi(STR0078)+" "+OemToAnsi(STR0013), OemToAnsi(STR0078)} )

	If IsPanelFin()
		ACTIVATE MSDIALOG oDlg1 ON INIT (FaMyBar(oDlg1,;
		{|| nOpca := 1,If(ABS(NVALOR)>0,oDlg1:End(),Help(" ",1,"FA060VALOR"))},;
		{|| nOpca := 2,oDlg1:End()},aBut060),oMark:oBrowse:Refresh())
	Else
		ACTIVATE MSDIALOG oDlg1 ON INIT (MayIUseCode("SE1"+xFilial("SE1")+cNumBor),EnchoiceBar(oDlg1,;
		{|| nOpca := 1,If(ABS(NVALOR)>0,oDlg1:End(),Help(" ",1,"FA060VALOR"))},;
		{|| nOpca := 2,oDlg1:End()},,aBut060),oMark:oBrowse:Refresh()) CENTERED

	Endif

	SetKey(16,bSet16)
Else
	nOpca := 1
EndIf

If !Empty(aChaveLbn)
	aEval(aChaveLbn, {|e| UnLockByName(e,.T.,.F.) } ) // Libera Lock
Endif

Return nOpca

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061REFR1³ Autor ³ Paulo Boschetti		  ³ Data ³ 25/08/93 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Calcula valor liquido T¡tulos a serem descontados na TRANSF³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061REFR1(ExpC,ExpN)												  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpC	= Formula														  ³±±
±±³			 ³ ExpN	= Valor a ser calculado 									  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061REFR1(cFormula,nValCred)
Local xRet:=" "

If Empty(cFormula)
	Return .t.
Endif

xRet:=Formula(cFormula)

If Valtype(xRet)!="N" .or. Valtype(xRet)="U"
	Help(" ",1,"FA060NOFOR")
	Return .F.
	nValcred := 0
Endif

If Valtype(xRet)="N" .or. Valtype(xRet)!="U"
	nValCred:=0
	nValCred:=Formula(cFormula)
Endif

Return .t.

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061REFOR³ Autor ³ Paulo Boschetti	    ³ Data ³ 25/08/93 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Calcula valor liquido T¡tulos a serem descontados no BORD  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061REFOR(ExpC,ExpD1,ExpD2,ExpN)						  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpD1 = Data Inicial 									  ³±±
±±³			 ³ ExpD2 = Data Final										  ³±±
±±³			 ³ ExpC	= Formula											  ³±±
±±³			 ³ ExpN	= Valor a ser calculado 		    				  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061													  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061REFOR(cFormula,dVencIni,dVencFim,nValCred,cNumBor)

Local cAlias := Alias(),nReg:=0,xRet:=" ",lFirst:=.t.,lRet:=.T.
LOCAL nRegEmp := SM0->(RecNo())

//--- Tratamento Gestao Corporativa
Local lGestao   := Iif( lFWCodFil, FWSizeFilial() > 2, .F. )	// Indica se usa Gestao Corporativa
//
Local cFilFwSE1 := IIF( lGestao , FwFilial("SE1") , xFilial("SE1") )

If Empty(cFormula)
	Return .t.
Endif

cNumBor := Iif(Empty(cNumBor),Space(6),cNumBor)

dbSelectArea("TRB")
nOrdem:=IndexOrd()
nReg:=Recno()

dbSelectArea("SM0")
dbSeek(cEmpAnt+cFilDe,.T.)
//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Verifico se o arquivo est  compartilhado (Empty(xFilial("SE1"))) pois   ³
//³ se for, nÆo posso comparar com M0_CODFIL (que nunca sera vazio) sob pena³
//³ de nÆo validar a formula.                                               ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
While !EOF() .And. M0_CODIGO == cEmpAnt .and. ;
		IIF( Empty( cFilFwSE1 ), .T., IIf( lFWCodFil, FWGETCODFILIAL, SM0->M0_CODFIL ) <= cFilAte)

	cFilAnt := IIf( lFWCodFil, FWGETCODFILIAL, SM0->M0_CODFIL )

	dbSelectArea("TRB")
	dbGoTop()
	While !Eof()
		If E1_VENCREA > dVencFim .And. E1_VENCREA < dVencIni
			dbSkip()
			Loop
		EndIf

		dbSelectArea("SE1")
		dbGoto(TRB->RECSE1)
		dbSelectArea("TRB")
		If E1_OK == cMarca .and. SE1->E1_SITUACA $ "0FG"
			xRet:=Formula(cFormula)
			If Valtype(xRet)!="N" .or. Valtype(xRet)="U"
				Help(" ",1,"FA060NOFOR")
				lRet := .F.
				Exit
			Else
				If lFirst
					lFirst:=.f.
					nValcred:=0
				Endif
				nValcred+=Formula(cFormula)
			Endif
		Endif
		dbSkip()
	Enddo

	If Empty( cFilFwSE1 )
		Exit
	Endif
	dbSelectArea("SM0")
	dbSkip()
Enddo
SM0->(dbGoto(nRegEmp))
cFilAnt := IIf( lFWCodFil, FWGETCODFILIAL, SM0->M0_CODFIL )
dbSelectArea("TRB")
dbGoto(nReg)
dbSetOrder(nOrdem)
dbSelectArea(cAlias)
Return lRet

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061TelOk³ Autor ³ Eveli Morasco 		  ³ Data ³ 15/06/92 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica se a situa‡„o informada esta' correta             ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ ExpL1 := FA061TelOk									  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ ExpL1 = Retorna .T.= true ou .F.= false						  ³±±
±±³			 ³ ExpC1 = Situa‡„o														  ³±±
±±³			 ³ ExpA1 = Array de situacoes 										  ³±±
±±³			 ³ ExpC2 = Codigo do portador 										  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061TelOk(cSituacao,cPort060,cAgen060,cConta060,lDesc,cCliente,cTitulo,cSituAnt,cContrato,cPortador)

Local lRet := .T.
Local aDados := {}

cSituacao := SubStr(cSituacao,1,1)

//Conteudo de aDados
//cSituacao	= Situacao para a qual esta sendo transferido o titulo
//cPort060	= Banco para o qual esta sendo transferido o titulo
//cAgen060	= Agencia para a qual esta sendo transferido o titulo
//cConta060	= Conta para a qual esta sendo transferido o titulo
//lDesc		= Informa se a carteira para a qual esta sendo transferido o titulo eh 2 (descontada) ou 7 (Descontada caucionada)
//cCliente	= Cliente, Loja e Nome do Cliente do titulo
//cTitulo	=`Prefixo, Numero e Parcela do titulo
//cSituAnt	= Situacao de cobranca anterior
//cContrato	= Numero do contrato bancário
//cPortador	= Portador anterior do titulo

aDados := {cSituacao,cPort060,cAgen060,cConta060,lDesc,cCliente,cTitulo,cSituAnt,cContrato,cPortador}


If !(cSituacao $ "0FG") .and. (Empty(cPort060) .Or. Empty(cAgen060) .Or. ;
		Empty(cConta060))
	Return .F.
End

If cSituacao $ "0FG" .And. (!Empty(cPort060) .Or. !Empty(cAgen060) .Or. ;
		!Empty(cConta060))
	If cPaisLoc == "BRA"
	   Return .F.
	Else
	   If !(AllTrim(cPort060) $ GetMV("MV_CARTEIR"))
		    Return .F.
	   EndIf
	Endif
EndIf

If cPaisLoc <> "BRA"
	If	( !(cSituacao $ "0FG") .and. Fin060IsCx(cPort060)) .or.;
   		((cSituacao $ "0FG") .and. !Fin060IsCx(cPort060))
		Help(" ",1,"FA060PORT")
		Return .F.
	EndIf
EndIf

//Verifica Bloqueio da Conta Corrente
If CCBlocked(cPort060,cAgen060,cConta060,.F.)
	Return .F.
EndIf

// Consiste se a moeda do banco eh nacional
If FXMultSld()
	lRet := FXVldBco( cPort060, cAgen060, cConta060, SE1->E1_MOEDA )
EndIf

If ExistBlock("F060OK")
	lRet := ExecBlock("F060OK",.F.,.F.,aDados)
	If !lRet
		Return .F.
	Endif
Endif


If UsaSeqCor()
	cCodDiario := CTBAVerDia()
Endif
Return (MsgYesNo(OemToAnsi(STR0051),OemToAnsi(STR0052))) // "Confirma Dados ?"###"Aten‡„o"

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061Erro ³ Autor ³ Pilar S. Albaladejo   ³ Data ³ 20/12/96 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Indica que houve erro na janela - WINDOWS 					  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function Fa061Erro()
Help(" ",1,"FA060ERR")
Return 0

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061Inver³ Autor ³ Pilar S. Albaladejo   ³ Data ³ 20/12/96 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Inverte marcacoes - Windows										  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Static Function Fa061Inverte(cMarca,oValor,oQtda,oPrazoMed,nLimite,lMarkAbt,aChaveLbn,cChaveLbn, lTodos,lF060Mark)
Local nReg        := TRB->(Recno())
Local lF060DPM    := ExistBlock("F060DPM")
Local lF060CPM    := ExistBlock("F060CPM")
Local lMarcado
Local nAbat       := 0
Local nAscan

Local aArea       := {}
Local aAreaSE1    := {}
Local cChaveSE1   :=""

Local lFa060Vld   := ExistBlock( "FA060VLD" )
Local lRet        := .T.

Local lRetCGCCPF  := .F.
Local cCNPJCPF    := ""
Local cMarcaAux   := ""
Local lBolPIX     := _lVlBcoApi .and. F061BolPix(,SA6->A6_COD, SA6->A6_AGENCIA, SA6->A6_NUMCON)

nSomaData := 0
Default lTodos := .T.

dbSelectArea("TRB")
IF lTodos
	dbSeek(xFilial("SE1",aSelFil[1]),.T.)
Endif
While !lTodos .Or. (!Eof())
	If lTodos .Or. cChaveLbn == Nil
		cChaveLbn := "BOR" + xFilial("SE1")+E1_PREFIXO+E1_NUM+E1_PARCELA+E1_TIPO
	Endif

	If lBolApi
		If _lVlBcoApi
			cMarcaAux   := cMarca
			cCNPJCPF    := GetAdvFVal("SA1", "A1_CGC" , xFilial("SA1", cFilAnt) + TRB->E1_CLIENTE + TRB->E1_LOJA,1,"",.T.)
			If Empty(cCNPJCPF) .And. !lTodos
				cMarca  := Space(2)
				Help(" ",1,"CAD_DESAT_MKW",, STR0182 + CRLF + CRLF + STR0183 ,1,,,,,,, { STR0181 }) //Como este borderô será transmitido automaticamente para o banco selecionado, faz-se necessário que o cliente possua CNPJ/CPF. #"Identificamos que o cliente está sem essa informação, logo, o título do cliente não será selecionado." #"Informar o CNPJ/CPF no cadastro de clientes."
			ElseIf Empty(cCNPJCPF) .And. lTodos
				lRetCGCCPF  := .T.
				cMarca      := Space(2)
			Endif
		Endif

		//Não permite a geração bordero para boletos + PIX dos titulos PIX
		If lBolPIX .And. __F713TPix .And. F713TemPix() 
			If !lTodos
				cMarca := Space(2)
				Help(" ",1,"BOLPIX_MKW",, STR0184, 1) //"A conta selecionada está configurada para Boleto + PIX, logo, este título não pode ser incluído em borderô."
			Else
				cMarca := Space(2)		
			Endif	
		Endif
	Endif

	If lFa060Vld
		lRet := ExecBlock( "FA060VLD", .F., .F., { cMarca, "TRB" } )
	EndIf

	If lRet .And. !FINTP01(.F., "TRB") // FINTP01 -> Não considerar quando a origem do titulo for de origem Totvs Incorporação
		If (lTodos .And. LockByName(cChaveLbn,.T.,.F.)) .Or. !lTodos
			If !lMarkAbt .And. !GetNewPar("MV_ACATIVO",.F.)
				nAbat := SomaAbat(E1_PREFIXO,E1_NUM,E1_PARCELA,"R",E1_MOEDA,dDataBase,E1_CLIENTE,E1_LOJA,E1_FILIAL,,E1_TIPO)
			Endif
			RecLock("TRB", .F.)
			(lMarcado := IsMark("E1_OK", cMarca, lInverte))
			If lMarcado .Or. lInverte
				Replace E1_OK With Space(2)
				nAscan := Ascan(aChaveLbn, cChaveLbn )
				If nAscan > 0
					UnLockByName(aChaveLbn[nAscan],.T.,.F.) // Libera Lock
				Endif
			Else
				If (nValor + (E1_SALDO-nAbat)) <= (nLimite) .Or. Empty(nLimite)
					Replace E1_OK With cMarca
					If Ascan(aChaveLbn, cChaveLbn) == 0
						Aadd(aChaveLbn,cChaveLbn)
					Endif
				Endif
			Endif
			MsUnLock()
			If E1_OK == cMarca
				If TRB->E1_TIPO $ MVABATIM
					nValor	-= E1_SALDO
					If lF060DPM
						nData := ExecBlock("F060DPM",.F.,.F.)
					Else
						nData := E1_VENCREA - E1_EMISSAO
					Endif
					nPrazo	-= ( nData * E1_SALDO )
				Else
					nValor	+= (E1_SALDO-nAbat)
					//Se considerar Acrescimos e Decrescimos
					If mv_par09 == 1
						nValor += E1_SDACRES - E1_SDDECRE
					Endif
					//Calculo de Valor Acessorio
					cChaveSE1	:= TRB->E1_PREFIXO + TRB->E1_NUM +TRB->E1_PARCELA +TRB->E1_TIPO
					aArea		:= GetArea()
					aAreaSE1	:= SE1->(GetArea())
					dbSelectArea("SE1")
					dbSetOrder(1)
					If _lExistVA .and. SE1->(DbSeek(xFilial("SE1")+cChaveSE1))
						nValor += FValAcess(TRB->E1_PREFIXO,TRB->E1_NUM,TRB->E1_PARCELA,TRB->E1_TIPO,TRB->E1_CLIENTE,TRB->E1_LOJA,TRB->E1_NATUREZ, Iif(Empty(TRB->E1_BAIXA),.F.,.T.),"","R",TRB->E1_BAIXA)
					EndIf
					RestArea(aAreaSE1)
					RestArea(aArea)
					If lF060DPM
						nData := ExecBlock("F060DPM",.F.,.F.)
					Else
						nData := E1_VENCREA - E1_EMISSAO
					Endif
					nPrazo	+= ( nData * (E1_SALDO-nAbat) )
				EndIf
				nQtdTit++
				nSomaData += nData
				If nValor != 0
					nPrazoMed := nPrazo / nValor
				Else
					nPrazoMed := 0
				EndIf
				If lF060Mark
					ExecBlock("F060MARK",.F.,.F.)
				Endif
			Elseif lMarcado
				If TRB->E1_TIPO $ MVABATIM
					nValor	+= (E1_SALDO-nAbat)
					If lF060DPM
						nData := ExecBlock("F060DPM",.F.,.F.)
					Else
						nData := E1_VENCREA - E1_EMISSAO
					Endif
					nPrazo	+= ( nData * E1_SALDO )
				Else
					nValor	-= (E1_SALDO-nAbat)
					//Se considerar Acrescimos e Decrescimos
					If mv_par09 == 1
						nValor -= E1_SDACRES - E1_SDDECRE
					Endif
					
					//Calculo de Valor Acessorio
					cChaveSE1	:= TRB->E1_PREFIXO + TRB->E1_NUM +TRB->E1_PARCELA +TRB->E1_TIPO
					aArea		:= GetArea()
					aAreaSE1	:= SE1->(GetArea())
					dbSelectArea("SE1")
					dbSetOrder(1)
					If _lExistVA .and. SE1->(DbSeek(xFilial("SE1")+cChaveSE1))
						nValor -= FValAcess(TRB->E1_PREFIXO,TRB->E1_NUM,TRB->E1_PARCELA,TRB->E1_TIPO,TRB->E1_CLIENTE,TRB->E1_LOJA,TRB->E1_NATUREZ, Iif(Empty(TRB->E1_BAIXA),.F.,.T.),"","R",TRB->E1_BAIXA)
					EndIf
					RestArea(aAreaSE1)
					RestArea(aArea)

					If lF060DPM
						nData := ExecBlock("F060DPM",.F.,.F.)
					Else
						nData := E1_VENCREA - E1_EMISSAO
					Endif
					nPrazo	-= ( nData * (E1_SALDO-nAbat) )
				EndIf
				nQtdTit--
				nSomaData -= nData
				if nValor != 0
					nPrazoMed := nPrazo / nValor
				Else
					nPrazoMed := 0
				EndIf
			Endif
			nQtdTit:= Iif(nQtdTit<0,0,nQtdTit)
			nSomaData := Iif(nSomaData<0,0,nSomaData)
		Endif
	EndIf
	If lTodos
		If lRetCGCCPF
			cMarca := cMarcaAux
		Endif
		dbSkip()
	Else
		Exit
	Endif
Enddo

If lRetCGCCPF .And. lTodos
	Help(" ",1,"CAD_DESAT_INV",, STR0179 + CRLF + CRLF + STR0180 ,1,,,,,,, { STR0181 }) // "Como este borderô será transmitido automaticamente para o banco selecionado, faz-se necessário que todos os clientes possuam CNPJ/CPF." # Identificamos clientes sem esta informação, logo, os títulos destes clientes não permitirão sua seleção. #"Ajustar campo CNPJ/CPF em base de dados"
Endif

// Calcula prazo medio, conforme necessidade.
If lF060CPM
	nPrazoMed := ExecBlock("F060CPM",.F.,.F., {nSomaData,nQtdTit,nPrazo,nValor,nPrazoMed})
Endif
TRB->(dbGoto(nReg))
oValor:Refresh()
oQtda:Refresh()
IF VALTYPE(oPrazoMed) == "O"
   oPrazoMed:Refresh()
ENDIF
oMark:oBrowse:Refresh(.t.)
Return Nil

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡…o	 ³Fa061bAval ³ Autor ³ Claudio D. de Souza  ³ Data ³ 07/11/05 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡…o ³Bloco de marcacoo       			          				  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ Fa061bAval()		  										  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061													  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function Fa061bAval(cMarca,oValor,oQtda,oPrazoMed,nLimite,lMarkAbt,aChaveLbn,lF060Mark)
Local lRet 		:= .T.
Local cChaveLbn
Local lFa060Vld	:= ExistBlock( "FA060VLD" )

cChaveLbn := "BOR" + TRB->(xFilial("SE1")+E1_PREFIXO+E1_NUM+E1_PARCELA+E1_TIPO)
// Verifica se o registro nao esta sendo utilizado em outro terminal
//-- Parametros da Funcao LockByName() :
//   1o - Nome da Trava
//   2o - usa informacoes da Empresa na chave
//   3o - usa informacoes da Filial na chave
If LockByName(cChaveLbn,.T.,.F.)

	If FINTP01(.T., "TRB") // Restringe o uso do programa Financeiro quando a origem do titulo for de origem Totvs Incorporação
	   lRet := .F.
	EndIf
	If lRet .AND. lFa060Vld
		lRet := ExecBlock( "FA060VLD", .F., .F., { cMarca, "TRB" } )
	EndIf
	If lRet
		FA061Inverte(cMarca,oValor,oQtda,oPrazoMed,nLimite,lMarkAbt,aChaveLbn,cChaveLbn, .F.,lF060Mark)
	EndIf

Else
	IW_MsgBox(STR0080,STR0081,"STOP") //"Este titulo está sendo utilizado em outro terminal, não pode ser utilizado neste Borderô"###"Atenção"
	lRet := .F.
Endif
oMark:oBrowse:Refresh(.t.)
Return lRet

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061Disp ³ Autor ³ Pilar S. Albaladejo   ³ Data ³ 20/12/96 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Exibe Valores na tela									  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061													  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Static Function Fa061Disp(cMarca,lInverte,oValor,oQtda,oPrazoMed,lF060Mark,nLimite,lMarkAbt)
Local nData := 0
Local lMarcado
Local nAbat := 0

If !lMarkAbt
	nAbat := SomaAbat(E1_PREFIXO,E1_NUM,E1_PARCELA,"R",E1_MOEDA,dDataBase,E1_CLIENTE,E1_LOJA,,,E1_TIPO)
Endif

If (lMarcado := IsMark("E1_OK",cMarca,lInverte))
	If (nValor + E1_SALDO) <= (nLimite) .Or. Empty(nLimite)
		If E1_TIPO $ MVABATIM
			nValor -= E1_SALDO
			If VALTYPE(oPrazoMed) == "O"
				If ExistBlock("F060DPM")
					nData := ExecBlock("F060DPM",.F.,.F.)
				Else
					nData := E1_VENCREA - E1_EMISSAO
				Endif
				nPrazo	-= ( nData * E1_SALDO )
			EndIf
		Else
			nValor += (E1_SALDO-nAbat)
			//Se considerar Acrescimos e Decrescimos
			If mv_par09 == 1
				nValor += E1_SDACRES - E1_SDDECRE
			Endif
			//Calculo de Valor Acessorio
			If _lExistVA
				nValor += FValAcess(E1_PREFIXO,E1_NUM,E1_PARCELA,E1_TIPO,E1_CLIENTE,E1_LOJA,E1_NATUREZ, Iif(Empty(E1_BAIXA),.F.,.T.),"","R",E1_BAIXA)
			EndIf

			If VALTYPE(oPrazoMed) == "O"
				If ExistBlock("F060DPM")
					nData := ExecBlock("F060DPM",.F.,.F.)
				Else
					nData := E1_VENCREA - E1_EMISSAO
				Endif
				nPrazo	+= ( nData * (E1_SALDO-nAbat) )
			EndIf
		EndIf
		nQtdTit++
		nSomaData += nData
		If lF060Mark
			ExecBlock("F060MARK",.F.,.F.)
		Endif
	Else
		If IsMark("E1_OK",cMarca,lInverte)
			Reclock("TRB",.F.)
			TRB->E1_OK := "  "
			MsUnlock()
		Endif
	Endif
Elseif !lMarcado
	If E1_TIPO $ MVABATIM
		nValor += E1_SALDO
		If VALTYPE(oPrazoMed) == "O"
			If ExistBlock("F060DPM")
				nData := ExecBlock("F060DPM",.F.,.F.)
			Else
				nData := E1_VENCREA - E1_EMISSAO
			Endif
			nPrazo	+= ( nData * E1_SALDO )
		EndIF
	Else
		nValor -= (E1_SALDO-nAbat)
		//Se considerar Acrescimos e Decrescimos
		If mv_par09 == 1
			nValor -= E1_SDACRES - E1_SDDECRE
		Endif
		//Calculo de Valor Acessorio
		If _lExistVA
			nValor -= FValAcess(E1_PREFIXO,E1_NUM,E1_PARCELA,E1_TIPO,E1_CLIENTE,E1_LOJA,E1_NATUREZ, Iif(Empty(E1_BAIXA),.F.,.T.),"","R",E1_BAIXA)
		EndIf
		If VALTYPE(oPrazoMed) == "O"
			If ExistBlock("F060DPM")
				nData := ExecBlock("F060DPM",.F.,.F.)
			Else
				nData := E1_VENCREA - E1_EMISSAO
			Endif
			nPrazo	-= ( nData * (E1_SALDO-nAbat) )
	   EndIf
	EndIf
	nQtdTit--
	nSomaData -= nData
	nQtdTit:= Iif(nQtdTit<0,0,nQtdTit)
	nSomaData := Iif(nSomaData<0,0,nSomaData)
Endif
oValor:Refresh()
oQtda:Refresh()
If VALTYPE(oPrazoMed) == "O"
	If nValor != 0
		nPrazoMed := nPrazo / nValor
	Else
		nPrazoMed := 0
	EndIf
	// Calcula prazo medio, conforme necessidade.
	If ExistBlock("F060CPM")
		nPrazoMed := ExecBlock("F060CPM",.F.,.F., {nSomaData,nQtdTit,nPrazo,nValor,nPrazoMed})
	Endif
	oPrazoMed:Refresh()
EndIf
Return

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³FA061blank³ Autor ³ Jose Lucas    		  ³ Data ³ 08/04/98 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Limpa as marcacoes do arquivo (E1_OK)							  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FA061blank()															  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function fa061Blank()

If !Empty(TRB->E1_OK)
	Reclock("TRB",.F.)
	TRB->E1_OK := "  "
	MsUnlock()
EndIF

Return
/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o    ³FA061Clear³ Autor ³ Bruno Sobieski        ³ Data ³ 11/11/99 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Preenche o campo do clearing dacordo com o clearing do SA6.³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe   ³ FA061Clear()                                               ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061																	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Static Function fa061Clear(cClearing,oCbxClear,aTempos)
If SA6->A6_DIASCOB < 6.AND.SA6->A6_DIASCOB > 0
	cClearing   := aTempos[SA6->A6_DIASCOB]
ELSEIF SA6->A6_DIASCOB > 5
	cClearing   := aTempos[6]
Else
	cClearing   := aTempos[1]
EndIF
oCbxClear:Refresh()
Return .T.

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o    ³F061Vld   ³ Autor ³ Mauricio Pequim Jr    ³ Data ³ 31/05/00 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Valida‡Æo de Banco e situa‡Æo na montagem do bordero       ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe   ³ F061Vld() 	                                              ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061													  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function f061Vld(cBanco,cAgencia,cConta,cSitCombo,cContrato, lBolApi, cSubCta060, cEspec060)
	Local lRet := .F.

	Default lBolApi    := .F.
    Default cSubCta060 := ""
    Default cEspec060  := ""

	If CarregaSa6(cBanco,cAgencia,cConta,.T.,,.T.) .and. (Substr(cSitCombo,1,1)$"1234567H" .or. ExistBLock("F060SITUAC"))
		lRet := .T.
	Else
		Help(" ",1,"BORD_TRANS")
	Endif

	If (lRet .AND. lBolApi .AND. (Empty(cSubCta060) .OR. Empty(cEspec060)))
        lRet := .F.
        Help("", 1, "BOLREG", , STR0164, 1,; // #"Sub Conta e Espécie do Boleto devem ser informadas."
            ,,,,,, {STR0165}) // #"Preencha os campos solicitados."
    EndIf

	//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
	//³ PE F060VBCO                                                  ³
	//³ Utilizado para validacoes extras do usuario       		     ³
	//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
	If lRet .AND. ExistBlock("F060VBCO")
		lRet := ExecBlock("F060VBCO",.F.,.F.,{cBanco,cAgencia,cConta,cSitCombo,cContrato})
	Endif
	// Se Portugal, pega cod. Diario
	If lRet .and. UsaSeqCor()
		cCodDiario := CTBAVerDia()
	Endif

	If lRet .and. FXMultSld()
		lRet := FXVldBco( cBanco, cAgencia, cConta, nMoeda, .T. )
	EndIf

Return lRet

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³Fa061Pesq ³ Autor ³ Claudio D. De Souza   ³ Data ³08.02.01  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ tela de pesquisa - WINDOWS 										  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ Generico 																  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Static Function Fa061Pesq(oMark, cAlias,nIndice)
Local 	nRecno				  ,;
		nRecTrb				  ,;
		cCampos
Local aPesqui :={}
Local aSIXVal := {}
Local cSeek 		:= ""

DEFAULT  nIndice := cAlias->(Indexord())

aSIXVal := aClone(FIndPesq("SE1"))//Retorna a descricao do indice posicionado para compor a pesquisa

If ValType(aSIXVal) == "A" .And. Len(aSIXVal) > 0 //Precaucao caso o retorno da rotina tenha algum problema
	aPesqui := {aClone(aSIXVal[nIndice])}
Else
	SIX->(DbSeek("SE1"+Alltrim(STR(nIndice))))
	aAdd(aPesqui,{SIX->DESCRICAO,1})
EndIf

DbSelectArea(cAlias)
nRecno  := Recno()
nRecTrb := TRB->(RecNo())
cCampos := TRB->(IndexKey())
// Obtem os campos de pesquisa de cAlias, para pesquisar no TRB, pois
// os indice do TRB eh unico (FILIAL+PREFIXO+NUMERO+PARCELA+TIPO) e em
// AxPesqui, o usuario pode escolher a chave desejada.
cCampos := cAlias + "->(" + cCampos + ")"

WndxPesqui(oMark:oBrowse,aPesqui,cSeek,.F.)


oMark:oBrowse:Refresh(.T.)

Return Nil

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡…o    ³FA061Legend³ Autor ³ Mauricio Pequim Jr   ³ Data ³ 06.08.01 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡…o ³ Cria uma janela contendo a legenda da mBrowse              ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso      ³ FINA061                                                    ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FA061Legend(nReg)

Local aTmpCores
Local nI
Local aPicture := {}
Local lF060Legen := ExistBlock("F060LEGEN" )
Local aLegenda := {}
Local aTmp     := {}
Local uRetorno := {}

aLegenda := {	{"ENABLE"		, 	STR0063	},;	// "Titulo em Carteira"
		  		{"DISABLE"		, 	STR0064	},;	//"Titulo Transferido"
		   		{"BR_AZUL"		,   STR0065	},;	//"Titulo Baixado"
		  		{"BR_AMARELO"	, 	STR0073	} } //"Titulo Protestado"

IF hasSmartx()
	aLegenda[1][2] := STR0197  // "Em Carteira"
	aLegenda[2][2] := STR0198  // "Transferido"
	aLegenda[3][2] := STR0199  // "Baixado"
	aLegenda[4][2] := STR0200  // "Protestado"
ENDIF

If lF060Legen
	aTmp := aClone(ExecBlock( "F060LEGEN", .f., .f. ))

	If Len(aTmp) >= Len(aLegenda)
		aLegenda := aClone(aTmp)
	EndIf
EndIf

//____________________________________________________________________________________________________________________
//|Ponto de Entrada implementado para que o usuario possa customizar as cores e legendas de situacao dos titulos      |
//|                                                                                                                   |
//| "F060CORES"                                                                                                       |
//| Devera retornar um Array Bi-Dimensional de 3 Colunas sendo:                                                       |
//| [nReg][1] Logica do status                                                                                        |
//| [nReg][2] Picture                                                                                                 |
//| [nReg][3] Descricao da Legenda                                                                                    |
//|____________________________________________________________________________________________________________________

If ExistBlock("F060CORES")
	aAdd(aPicture, "ENABLE")
	aAdd(aPicture, "BR_AZUL")
	aAdd(aPicture, "BR_LARANJA")
	aAdd(aPicture, "BR_BRANCO")
	aAdd(aPicture, "BR_PRETO")
	aAdd(aPicture, "BR_MARROM")
	aAdd(aPicture, "BR_PINK")
	aAdd(aPicture, "BR_CINZA")
	aAdd(aPicture, "BR_AMARELO")
	aAdd(aPicture, "LIGHTBLU")
	aAdd(aPicture, "DISABLE")

	aTmpCores := ExecBlock("F060CORES", .F., .F., aLegenda)
	If ValType(aTmpCores) == "A"
		For nI := 1 To Len(aTmpCores)
			If ValType(aTmpCores[nI][1])# "U" .And. ValType(aTmpCores[nI][2])# "U" .And. ValType(aTmpCores[nI][3])# "U"
				If aScan(aPicture, aTmpCores[nI][2]) # 0 .And. !Empty(aTmpCores[nI][3])
					aAdd(aLegenda, { aTmpCores[nI][2], aTmpCores[nI][3] })
					// adiciona no array uRetorno
                    AAdd(uRetorno, { aTmpCores[nI][1], aTmpCores[nI][2], aTmpCores[nI][3] })
				EndIf
			EndIf
		Next
	EndIf
Endif

If nReg = Nil	// Chamada direta da funcao onde nao passa, via menu Recno eh passado
	Aadd(uRetorno, { 'Empty(E1_PORTADO) .AND. E1_SALDO>0 .AND. E1_SITUACA == "F"', aLegenda[4][1], aLegenda[4][2] } )//"Titulo Protestado"
	Aadd(uRetorno, { 'E1_SITUACA == "0" .AND. E1_SALDO>0', aLegenda[1][1], aLegenda[1][2] } )// "Titulo em Carteira"
	Aadd(uRetorno, { 'E1_SITUACA <> "0" .and. E1_SALDO>0', aLegenda[2][1], aLegenda[2][2] } )//"Titulo Transferido"
	Aadd(uRetorno, { 'E1_SALDO=0', aLegenda[3][1], aLegenda[3][2] } )//"Titulo Baixado"
Else
	BrwLegenda(STR0005,STR0062,aLegenda)  // "Legenda"
Endif

Return uRetorno

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³Fin061IsCx³ Autor ³Julio Cesar            ³ Data ³ 20/05/02 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Verifica se o banco eh caixa do Loja                       ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061												 			   	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
FUNCTION Fin061IsCx(cBco)

Local lRet	:=	.F.

If (cBco $ GetMv("MV_CARTEIR") ) .Or. (GetMV("MV_CXLJFIN",,.F.) .And. !Empty(Tabela("23",cBco,.F.)) .or. cBco $ space(len(cBco)) )
	lRet	:=	.T.
Endif

Return lRet

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³Fa061Visu ³ Autor ³ Cristiano Denardi     ³ Data ³22.02.05  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³Visualiza Titulo a partir da tela de Bordero				  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061	 												  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Static Function Fa061Visu()

Local aArea 		:= GetArea()
Local cSavFil		:= cFilAnt
Private cCadastro 	:= OemToAnsi( STR0013 )

DbSelectArea("SE1")
DbSetOrder(1)
If DbSeek(  TRB->E1_FILIAL + TRB->E1_PREFIXO + TRB->E1_NUM + TRB->E1_PARCELA + TRB->E1_TIPO )
	cFilAnt := TRB->E1_FILIAL

	AxVisual( "SE1", SE1->( Recno() ), 2 )

	cFilAnt := cSavFil
Endif

RestArea( aArea )
Return

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³F061AtuAgr³ Autor ³ Claudio D. de Souza   ³ Data ³22.02.05  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³Atualiza data de vencto. dos registros agregados			  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061 / FINA590										  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061AtuAgre()
Local cChave
Local dVencRea := SE1->E1_VENCREA
Local aAreaSe1 := SE1->(GetArea())
Local aArea    := GetArea()

// Atualiza tambem os registros agregados
If !( SE1->E1_TIPO $ MVRECANT+"/"+MV_CRNEG)
	dbSetOrder(1)
	cChave := xFilial("SE1") + SE1->(E1_PREFIXO+E1_NUM+E1_PARCELA)
	MsSeek(cChave)
	While SE1->(!EOF()) .And. SE1->(E1_FILIAL+E1_PREFIXO+E1_NUM+E1_PARCELA) == cChave
		If SE1->E1_TIPO $ MVABATIM +"/"+MVIRABT+"/"+MVINABT   // AB-/IR-/IN-
			RecLock("SE1" ,.F.)
			SE1->E1_VENCREA := dVencRea
			MsUnlock()
		EndIf
		SE1->(dbSkip())
	Enddo
Endif

SE1->(RestArea(aAreaSe1))
RestArea(aArea)

Return Nil

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Programa  ³MenuDef   ³ Autor ³ Ana Paula N. Silva     ³ Data ³21/11/06 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡…o ³ Utilizacao de menu Funcional                               ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Retorno   ³Array com opcoes da rotina.                                 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³Parametros do array a Rotina:                               ³±±
±±³          ³1. Nome a aparecer no cabecalho                             ³±±
±±³          ³2. Nome da Rotina associada                                 ³±±
±±³          ³3. Reservado                                                ³±±
±±³          ³4. Tipo de Transa‡„o a ser efetuada:                        ³±±
±±³          ³		1 - Pesquisa e Posiciona em um Banco de Dados         ³±±
±±³          ³    2 - Simplesmente Mostra os Campos                       ³±±
±±³          ³    3 - Inclui registros no Bancos de Dados                 ³±±
±±³          ³    4 - Altera o registro corrente                          ³±±
±±³          ³    5 - Remove o registro corrente do Banco de Dados        ³±±
±±³          ³5. Nivel de acesso                                          ³±±
±±³          ³6. Habilita Menu Funcional                                  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³   DATA   ³ Programador   ³Manutencao efetuada                         ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³          ³               ³                                            ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/

Static Function MenuDef()

Local lPageAction as logical        
Local aRotina := {}

lPageAction := .T.

aRotina := {{ STR0001 , "AxPesqui"    , 0 , 1,,.F.},;  // "Pesquisar"
                	{ STR0003 , "FA061Borde"  , 0 , 3},;  // "Border“"
                	{ STR0187 , "FA061Canc"   , 0 , 3, 0,,,,, lPageAction},;  // "Cancelamento de Borderô"
                 	{ STR0062 , "FA061Legend" , 0 , 2,,.F.,,,, lPageAction}}   //"Legenda"

//Motor de Retenções
If __lMotRet
	aAdd( aRotina, { STR0129,"FINCRET('SE1')"   , 0, 9}) //'Consulta de Retenções'
Endif
Return(aRotina)

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o    ³FiValDes ³ Autor ³ Pedro Pereira Lima    ³ Data ³ 02/10/07 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Exibe mensagem após validar os dados para cobrança via     ³±±
±±³          ³ bordero                                                    ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ FiValDes (nValCred,nValor) 								  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Parametros³ nValCred											          ³±±
±±³			 ³ nValor 													  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso		 ³ FINA061													  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³   DATA   ³ Programador   ³Manutencao efetuada                         ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³          ³               ³                                            ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/

FUNCTION FiValDes (nValCred,nValor)

      If nValCred < 0 .Or. nValCred > nValor
      	MsgAlert(STR0082) //"Valor de desconto não pode ser maior que o valor do crédito!"
      ENDIF

RETURN (nValCred > 0 .And. nValCred <= nValor)

/*/
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡…o    ³FinA061T   ³ Autor ³ Marcelo Celi Marques ³ Data ³ 04.04.08 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡…o ³ Chamada semi-automatica utilizado pelo gestor financeiro   ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso      ³ FINA061                                                    ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function FinA061T(aParam)

	cRotinaExec := "FINA061"
	ReCreateBrow("SE1",FinWindow)
	FinA061(aParam[1] /*nPosRotina*/ )
	ReCreateBrow("SE1",FinWindow)
	dbSelectArea("SE1")

	INCLUI := .F.
	ALTERA := .F.

Return .T.

/*
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÉÍÍÍÍÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍËÍÍÍÍÍÍÑÍÍÍÍÍÍÍÍÍÍÍÍÍ»±±
±±ºPrograma  ³F61VldUser   ºAutor  ³Leandro Sousa    º Data ³  21/10/10   º±±
±±ÌÍÍÍÍÍÍÍÍÍÍØÍÍÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÊÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍ¹±±
±±ºDesc.     ³  Funçao para que seja possivel a validaçao de usuario na te±±
±±º          ³ tela de bordero                                           º±±
±±ÌÍÍÍÍÍÍÍÍÍÍØÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹±±
±±ºUso       ³ AP                                                        º±±
±±ÈÍÍÍÍÍÍÍÍÍÍÏÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
*/

Function F61VldUser(cNumBor, cPort060,cAgen060,cConta060,cSituacao,dVencIni,dVencFim,nLimite,nMoeda,cContrato,dEmisDe,dEmisAte,cCliDe,cCliAte)

Local lRet:= .T.
Local lF060VlOk := ExistBlock("F060VLOK")

If lF060VlOk
	lRet := ExecBlock("F060VLOK",.F.,.F.,{cNumBor, cPort060,cAgen060,cConta060,cSituacao,dVencIni,dVencFim,nLimite,nMoeda,cContrato,dEmisDe,dEmisAte,cCliDe,cCliAte})
Endif

Return lRet

/*
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡…o    ³ fa061EBan  ³ Autor ³ Carlos Eduardo Chigres      ³ Data ³ 20/06/12 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descricao ³ Realizar SELECT sobre SE1, apos o acionamento de fA061Bco, para    ³±±
±±³          ³ levantamento de tipos CHEQUES. Apresenta o resultado sob a forma   ³±±
±±³          ³ de MsSelect, permitindo apenas 1 selecao para a transferencia.     ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Params   ³                                                                    ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Retorno  ³ Ponteiro (Recno) de SE1 para o processamento da Transferencia      ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³             ATUALIZACOES SOFRIDAS DESDE A CONSTRUCAO INICIAL                  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Programador  ³ Data   ³ BOPS ³          Manutencoes efetuadas                 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³              ³        ³      ³                                                ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
*/
Function fa061EBan()

//--- Retorno !!
Local nRecor  := 0   // Manter essa inicializacao

//--- Ambiente
Local aOrigin := GetArea()
Local aSX3    := SX3->( GetArea() )

//--- MsSelect
Local oDlg60
Local oMark

//--- Genericas
Local nX          := 1
Local nOpc        := 1
Local cQuery      := " "
Local cArqTRB     := ""
Local cTipCheques := " "
Local cTipos      := MVPROVIS+"/"+MVRECANT+"/"+MV_CRNEG+"/"+MVENVBCOR
Local aCampos     := {}
Local aSupQry     := {}

Local cT60Query := GetNextAlias()

//--- MsSelect
Private cMarca  := GetMark()
Private lInvert := .F.
Private nMarked := 0

cTipos	:=	StrTran(cTipos,',','/')
cTipos	:=	StrTran(cTipos,';','/')
cTipos	:=	StrTran(cTipos,'|','/')
cTipos	:=	StrTran(cTipos,'\','/')

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Certifico de que o TRB esta fechado ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
If Select( cT60Query ) > 0
   (cT60Query)->( dbCloseArea() )
EndIf

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Montagem do array aCampos, para o MsSelect, e um auxiliar para a criacao de TRB ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
DbSelectArea("SX3")
DbSetOrder(2)

DbSeek( "E1_OK" )
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_VALOR")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_BCOCHQ")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_AGECHQ")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_CTACHQ")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

If cPaisLoc == "ARG"
	dbSeek( "E1_POSTAL" )
	Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
	Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )
Endif

DbSeek("E1_PORTADO")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_NUM")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_PREFIXO")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_PARCELA")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_TIPO")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_MOEDA")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_VLCRUZ")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_CLIENTE")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_LOJA")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

DbSeek("E1_VENCTO")
Aadd( aCampos, { X3_CAMPO , "", Alltrim( X3Titulo() ), SX3->X3_PICTURE } )
Aadd( aSupQry, { X3_CAMPO , X3_TIPO, X3_TAMANHO, X3_DECIMAL } )

Aadd( aSupQry, { "RECSE1", "N" ,14 ,0  } )

//--- Retorna estado original de SX3
RestArea( aSX3 )

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Selecao dos registros de CHEQUES ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
SE1->( DbSetOrder(7) )
//--- E1_FILIAL+DTOS(E1_VENCREA)+E1_NOMCLI+E1_PREFIXO+E1_NUM+E1_PARCELA

cQuery := "SELECT "

For nX := 1	To Len( aSupQry ) - 1
	cQuery += aSupQry[nX][1] + ","
Next nX

cQuery += " R_E_C_N_O_  RECNO "
cQuery += " FROM " + RetSqlName("SE1")
cQuery += " WHERE E1_FILIAL = '" + xFilial("SE1") + "'"

cQuery += " AND D_E_L_E_T_ = ' ' AND ( "

cTipCheques := Substr( MVCHEQUES, 1, 3 )
//--- Apenas Tipos Cheques interessam
For nX := 1 TO Len( MVCHEQUES ) Step 4

	cQuery += " E1_TIPO = '" + cTipCheques + "'"

	If nX + 2 <> Len( MVCHEQUES )
		cQuery += " OR "
		cTipCheques := Substr( MVCHEQUES, nX + 4, 3 )
	EndIf

Next nX

cQuery += ")"

If !Empty( MVPROVIS ) .Or. !Empty( MVRECANT ) .Or. !Empty( MV_CRNEG ) .Or. !Empty( MVENVBCOR )
	cQuery += "  AND E1_TIPO NOT IN " + FormatIn( cTipos, '/' )
Endif

cQuery += " AND E1_SALDO > 0 "

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Requisitos de Entidades Bancarias - variaveis preenchidas em fa061Bco ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
If Empty( cBcoChq )

   If cPaisLoc == "ARG" .and. !Empty( cPostal )

       cQuery += " AND E1_POSTAL = '" + cPostal + "'"

   EndIf

Else

    cQuery += " AND E1_BCOCHQ = '" + cBcoChq + "'"
    cQuery += " AND E1_AGECHQ = '" + cAgeChq + "' "

EndIf

cQuery += " ORDER BY " + SQLORDER(SE1->(IndexKey()))

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Geracao e Abertura de Temporario ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
cQuery := ChangeQuery( cQuery )

MsAguarde( { | | dbUseArea(.T., "TOPCONN", TCGenQry(,,cQuery), cT60Query, .T., .T.) },STR0092,STR0093 ) //"Por favor aguarde"###"Seleccionando registros en el Servidor..."

For nX := 1 TO Len( aSupQry ) - 1

	If aSupQry[nX][2] != 'C'
       TCSetField( cT60Query , aSupQry[nX][1], aSupQry[nX][2], aSupQry[nX][3], aSupQry[nX][4] )
	Endif

Next nX

DbSelectArea( cT60Query )

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Migra registros do resultado do Select para um TRB ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
Processa( {|| cArqTRB := a061BdTRB( aSupQry, cT60Query ) } )

//--- Remove o resultado da QUERY
DbSelectArea( cT60Query )
DbCloseArea()

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Precisa verificar o que resultou do processo ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
dbSelectArea( cArqTRB )
dbGoTop()

If BOF() .And. EOF()

   HELP(" ",1,"NORECS")

Else

   //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
   //³ Montagem da MSSELECT ³
   //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
   DEFINE MSDIALOG oDlg60 TITLE OemToAnsi( STR0094) From 9,0 TO 28,80   // "Cheques"

       oMark := MsSelect():New( cArqTRB, "E1_OK", "", aCampos, @lInvert, @cMarca, { 15, 01, 143, 315 } )

       // oMark:oBrowse:Align := CONTROL_ALIGN_ALLCLIENT // Somente Interface MDI

	   oMark:bMark := { || a061Seta( cMarca, lInverte ) }
       oMark:oBrowse:lHasMark     := .T.
       oMark:oBrowse:lCanAllmark  := .F.

   ACTIVATE MSDIALOG oDlg60 ON INIT (EnchoiceBar( oDlg60, {|| nOpc := 1, If( a061Flag(), oDlg60:End(), nOpc := 0 ) }, {|| nOpc := 0, oDlg60:End() },, )) CENTERED

   If nOpc == 1

      dbSelectArea( cArqTRB )

      dbGoTop()

      While !EOF()

         If (cArqTRB)->E1_OK == cMarca
            nOpc := 99
            EXIT
         EndIf

         dbSkip()

      Enddo

      If nOpc == 99
			nRecor := (cArqTRB)->RECSE1
      EndIf

   EndIf

EndIf

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Delecao do arquivo Temporario ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
dbSelectArea( cArqTRB )
dbCloseArea()
FErase( cArqTrb + GetDBExtension() )

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Restaura Ambiente ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
RestArea( aOrigin )

dbSelectArea( "SE1" )

Return( nRecor )

/*
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡ao    ³ a061Flag  ³ Autor ³Carlos Eduardo Chigres³ Data ³ 28.06.12 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡…o ³ Valida toda a operacao de MsSelect, com base no conteudo   ³±±
±±³          ³ da variavel nMarked. Somente 1 titulo deve ser selecionado.³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso      ³ MsSelect de afa061EBan()                                   ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
*/
Static Function a061Flag()

Local lRet := ( nMarked == 1 )

  If !lRet

     Aviso( OemToAnsi(STR0081), OemToAnsi(STR0095) , {'Ok'} )  // Atencao # "Selecione apenas 01 Cheque para completar a operação."

  EndIf

Return( lRet )

/*
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡ao    ³ a061Seta  ³ Autor ³Carlos Eduardo Chigres³ Data ³ 28.06.12 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡…o ³ Funcao que incrementa ou decrementa a variavel nMarked,    ³±±
±±³          ³ a ser usada na validacao da MsSelect (somente 1 marcado).  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Uso      ³ MsSelect de fa061EBan()                                    ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
*/
Static Function a061Seta( cMarca, lInverte )

Local lRet := .T.
Local lMarcado

If (lMarcado := IsMark("E1_OK",cMarca,lInverte))

   nMarked ++

Else

   nMarked --

EndIf

Return( lRet )

/*
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡…o    ³ a061BdTRB  ³ Autor ³ Carlos Eduardo Chigres      ³ Data ³ 20/06/12 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descricao ³ A partir do resultado da QUERY, montar o TRB para apresentacao     ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Params   ³ Lista de Campos do SELECT ; Alias resultante do Select             ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Retorno  ³ Nome do Alias do Arquivo Temporario, a ser usado no MsSelect       ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³             ATUALIZACOES SOFRIDAS DESDE A CONSTRUCAO INICIAL                  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³ Programador  ³ Data   ³ BOPS ³          Manutencoes efetuadas                 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³              ³        ³      ³                                                ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
*/
Static Function a061BdTRB( aCampos, cFromQry )

//--- Genericas
Local nX        := 1
Local nPosCampo := 1

//--- Retorno da funcao
Local c60Alia  := GetNextAlias()

//--- Retorno para ser removido
_oFina06102	:= FwTemporaryTable():New(c60Alia)
_oFina06102:SetFields(aCampos)
_oFina06102:AddIndex("1",{"E1_NUM","E1_PREFIXO","E1_PARCELA","E1_TIPO","E1_CLIENTE","E1_LOJA"})

dbSelectArea( c60Alia )

dbSelectArea( cFromQry )

ProcRegua( Reccount() )

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Migra registros da QRY para TRB ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
While !(cFromQry)->( Eof() )

   dbSelectArea( c60Alia )

   RecLock( c60Alia, .T. )

	For nX := 2	To Len( aCampos )

        // Verifica a existencia do Campo do Select no TRB
		nPosCampo := (cFromQry)->( FieldPos( aCampos[nX][1] ) )

		If nPosCampo > 0
           (c60Alia)->( FIELDPUT( FieldPos(aCampos[nX][1]),(cFromQry)->(FIELDGET(nPosCampo) ) ) )
        Else
			(c60Alia)->RECSE1 := (cFromQry)->RECNO
		EndIf

	Next nX

   MsUnLock()

   dbSelectArea( cFromQry )
   IncProc( OemToAnsi( STR0096 ) )   // "Preparando Arquivo Temporário ..."
   dbSkip()

EndDo

dbSelectArea( c60Alia )

Return( c60Alia )

/*
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±
±±³Fun‡…o	 ³ fA061Bco	³ Autor ³ Carlos Eduardo Chigres ³ Data ³ 27.06.12 ³±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±
±±³Descri‡…o ³ Seleciona Banco / Agencia / Conta / Cod. Postal             ³±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±
±±³Retorno	 ³ Logico, validando os parametros informados                  ³±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±
±±³Parametro ³ Nenhum                                                      ³±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±
±±³Sintaxe	 ³ fA061Bco()                            					   ³±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±
±±³Uso		 ³ Localizacao Argentina									   ³±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
*/
Function fA061Bco()

//--- Retorno
Local lRet := .F.

//--- Ambiente
Local aOrigin  := GetArea()

//--- Genericas
Local nEspLarg := 8
Local nEspLin  := 5
Local nOpca    := 0

//--- Tela
Local oDlg
Local oPanel

cBcoChq := Criavar("E1_BCOCHQ")
cAgeChq := Criavar("E1_AGECHQ")
cCtaChq := Criavar("E1_CTACHQ")

If cPaisLoc == "ARG"
	cPostal := Criavar("E1_POSTAL")
Endif

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Pergunte construido via Dialog ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
DEFINE MSDIALOG oDlg FROM 143,145 TO 158,190 TITLE OemToAnsi(STR0097) //"Entidades Bancarias"

       oDlg:lMaximized := .F.
       oPanel := TPanel():New(00,00,'',oDlg,, .T., .T.,, ,00,00)
       oPanel:Align := CONTROL_ALIGN_ALLCLIENT

       //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
       //³ Metade Superior - Variaveis Relativas ao Banco de Deposito ³
       //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
       @ 000+nEspLin,003+nEspLarg TO 075+nEspLin,163+nEspLarg OF oPanel  PIXEL

       @ 011+nEspLin,010+nEspLarg SAY STR0098 SIZE 55, 7 OF oPanel PIXEL //"Banco Cheque:"

       @ 009+nEspLin,060+nEspLarg MSGET cBcoChq	F3 "FJNCON" Picture "@!" Valid VerFJN("cBcoChq") SIZE 17, 10 OF oPanel Hasbutton PIXEL

       @ 026+nEspLin,010+nEspLarg SAY STR0099 SIZE 55, 7 OF oPanel PIXEL //"Agencia Cheque:"

       @ 024+nEspLin,060+nEspLarg MSGET cAgeChq	Picture "@!" Valid VerFJN("cAgeChq") SIZE 32, 10 OF oPanel PIXEL

       @ 042+nEspLin,010+nEspLarg SAY STR0100 SIZE 55, 7 OF oPanel PIXEL //"Conta Cheque:"

       @ 040+nEspLin,060+nEspLarg MSGET cCtaChq	Picture PesqPict("SE8","E8_CONTA") SIZE 47, 10 OF oPanel PIXEL READONLY

       @ 058+nEspLin,010+nEspLarg SAY STR0101 SIZE 55, 7 OF oPanel PIXEL //"Codigo Postal:"

       @ 056+nEspLin,060+nEspLarg MSGET cPostal	Picture "9999" Valid VerFJN("cPostal") SIZE 47, 10 OF oPanel PIXEL

      DEFINE SBUTTON FROM 090, 100 TYPE 1 ENABLE ACTION ( nOpca := 1 , oDlg:End() ) OF oPanel
      DEFINE SBUTTON FROM 090, 130 TYPE 2 ENABLE ACTION oDlg:End() OF oPanel

ACTIVATE MSDIALOG oDlg CENTERED

If nOpca == 1

   //ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
   //³ Critica dos paramentros - validando um Return True ³
   //ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
   If !( Empty( cBcoChq ) .And. Empty( cAgeChq ) ) .Or. !Empty( cPostal )

      lRet := .T.

   Else

      Aviso( OemToAnsi(STR0081) , OemToAnsi(STR0103) , {'Ok'} )  // Atencao # "Nenhuma seleção foi efetuada."

   EndIf

Else

    Aviso( OemToAnsi(STR0081) , OemToAnsi(STR0103) , {'Ok'} )  // Atencao # "Nenhuma seleção foi efetuada."

EndIf

RestArea( aOrigin )

Return( lRet )

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ F061BorAc³ Autor ³ Andrea V. Santiago    ³ Data ³ 24/06/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Seleciona titulos com borderos de imposto com PCC acumulado³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ Retorna um array com os titulos encontrados (aDadosBor)	  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061BorAc( )
Local nRegSe1		:= SE1->(Recno())
Local aDadosBor		:= 	Array( 6 )
Local cQuery		:= ''
Local cAliasQry		:=	""
Local nBaixas		:=	0
Local nPisBx		:=	0
Local nCofBx		:=	0
Local nCsllBx		:=	0
Local lTipBxCP		:=	.F.
Local nTxMoeda		:=	0
Local aBaixa		:=	{}
Local nTotAdto		:=	0
Local lBaixaAbat	:=	.F.
Local nVlrBaixa		:=	0
Local lBxCec		:=	.F.
Local lBxLiq		:=	.F.
Local lSigaloja		:=	.F.
Local nI			:=	0
Local nIrrfBx		:=	0
Local nParciais		:=	0

dbSelectArea("SE1")

cAliasQry := GetNextAlias()

cQuery := " SELECT E1_VALOR,E1_PIS,E1_COFINS,E1_CSLL,E1_IRRF,E1_SABTPIS,E1_SABTCOF,E1_SABTCSL,E1_SALDO,E1_TIPOLIQ,"
cQuery += " E1_PREFIXO,E1_NUM,E1_PARCELA,E1_TIPO,E1_CLIENTE,E1_LOJA,E1_NATUREZ,E1_MOEDA,E1_TXMOEDA,E1_VENCREA, "
cQuery += " R_E_C_N_O_ RECNO FROM "
cQuery += RetSqlName( "SE1" ) + " SE1 "
cQuery += " WHERE E1_FILIAL Between '" + cFilDe + "' AND '"+ cFilAte + "'"
cQuery += " AND E1_NUMBOR <> ' ' "
cQuery += " AND E1_EMISSAO Between '" + DTOS(dEmisDe) + "' AND '" + DTOS(dEmisAte) + "'"
cQuery += " AND E1_CLIENTE between '" + cCliDe        + "' AND '" + cCliAte        + "'"

If FunName() == "FINA061"
	cQuery += " AND E1_VENCREA between '" + DTOS(dVencIni)+ "' AND '" + DTOS(dVencFim) + "'"
Endif

cQuery += " AND E1_MOEDA = "+ str(nmoeda)

If FunName() == "FINA061"
	cQuery += " AND E1_PREFIXO Between '" + cPrefDe + "' AND '" + cPrefAte + "'"
	cQuery += " AND E1_NUM between '"     + cNumDe  + "' AND '" + cNumAte  + "'"
Endif

cQuery += " AND E1_PORTADO <> ' ' "
cQuery += " AND (E1_SABTPIS > 0 OR E1_SABTCOF > 0 OR E1_SABTCSL > 0)"

If !Empty(MVPROVIS) .Or. !Empty(MVRECANT) .Or. !Empty(MV_CRNEG) .Or. !Empty(MVENVBCOR)
	cQuery += "   AND E1_TIPO NOT IN " + FormatIn(MVPROVIS+"/"+MVRECANT+"/"+MV_CRNEG+"/"+MVENVBCOR,"/")
	Endif

	If FunName() == "FINA061"
	If mv_par12 == 1	//Seleciona Tipos
		cQuery += "   AND E1_TIPO IN " + FormatIn(cTipos,"/")
		Endif
   Endif

	cQuery += "   AND D_E_L_E_T_ = ' ' "

cQuery := ChangeQuery( cQuery )

dbUseArea( .T., "TOPCONN", TcGenQry(,,cQuery), cAliasQry, .F., .T. )

(cAliasQRY)->(DBGOTOP())

aDadosBor	:=	{}
aDadosRef	:= Array(7)
aDadosRet	:= Array(7)
dBaixa		:=	CriaVar("E1_BAIXA")

While !(cAliasQRY)->( Eof())

	nParciais	:=	nBaixas			:=	nPisBx	:=	nCofBx	:=	nCsllBx	:=		nIrrfBx	:=	0
	nTxMoeda 	:=	If((cAliasQRY)->E1_MOEDA > 1, If((cAliasQRY)->E1_TXMOEDA > 0, (cAliasQRY)->E1_TXMOEDA,RecMoeda(dBaixa,(cAliasQRY)->E1_MOEDA)),0)

	If ((cAliasQRY)->E1_VALOR > (cAliasQRY)->E1_SALDO) .And. Empty((cAliasQRY)->E1_TIPOLIQ)
		lTipBxCP		:=	lRaRtImp
		aBaixa		 	:= 	Sel070Baixa( "VL /V2 /BA /RA /CP /LJ /" + MV_CRNEG, (cAliasQRY)->E1_PREFIXO, (cAliasQRY)->E1_NUM, (cAliasQRY)->E1_PARCELA, (cAliasQRY)->E1_TIPO,;
																			@nTotAdto, @lBaixaAbat, (cAliasQRY)->E1_CLIENTE, (cAliasQRY)->E1_LOJA, @nVlrBaixa, , @lBxCec, @lBxLiq ,@lSigaloja, @lTipBxCP)

		For nI:=1 To Len(aBaixaSE5)
			If	Alltrim(aBaixaSE5[nI][29]) = "IRF"
				nIrrfBx	+= aBaixaSE5[nI][8]
			Else
				nPisBx	+= aBaixaSE5[nI][18]
				nCofBx	+= aBaixaSE5[nI][19]
				nCsllBx	+= aBaixaSE5[nI][20]
				nParciais	:= aBaixaSE5[nI][8]
			Endif
		Next
		If nParciais > 0
			nBaixas 		:= nVlrBaixa	- nIrrfBx
		Endif
	Endif
	AADD(aDadosBor,{ 	( cAliasQRY )->RECNO,; 			//1
					 	( cAliasQRY )->E1_SABTPIS, ;  	//2
					 	( cAliasQRY )->E1_SABTCOF,; 	//3
					 	( cAliasQRY )->E1_SABTCSL ,;	//4
					 	( cAliasQRY )->E1_VALOR,;		//5
					 	nBaixas,;						//6
					 	nPisBx,;						//7
					 	nCofBx,;                        //8
					 	nCsllBx	})                      //9

	( cAliasQRY )->( dbSkip())

EndDo

( cAliasQRY )->( dbCloseArea() )

dbSelectArea( "SE1" )
SE1->(Dbgoto(nRegSe1))

Return( aDadosBor )

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ F061Grava³ Autor ³ Andrea V. Santiago    ³ Data ³ 27/06/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Grava dados em SE1 e SE5 de borderos com PCC acumulados.	  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ Nao existe retorno.                                        ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061Grava(aRetidos,nValRec,cNumBor,cSituacao,cPort060,cAgen060,cConta060)
Local nTotTit		:= 0
Local nI			:= 0
Local cSequencia	:=	""
Local lPccBxCr 		:= FPccBxCr() //Controla o Pis Cofins e Csll na baixa  (1-Retem PCC na Baixa ou 2-Retem PCC na Emissão(default) )
Local nVlMinImp		:= GetNewPar("MV_VL10925",5000)
Local aImpPCC		:= {}
Local cDocKey 		:= ""
Local cDocSE1		:= ""

DEFAULT aRetidos	:= {}
DEFAULT nValRec		:= 0
DEFAULT cNumBor		:= ""
DEFAULT cSituacao	:= ""
DEFAULT cPort060	:= ""
DEFAULT cAgen060	:= ""
DEFAULT cConta060	:= ""

If dDataBase >= dLastPcc
	nVlMinImp	:= 0
EndIf

nTotTit	:=	0
If  Len(aRetidos) > 0

	For nI:=1 to Len(aRetidos)
		 If Alltrim(aRetidos[nI,19]) = "" .And.  Alltrim(aRetidos[nI,12])='AC' //Titulos que somam valores minimos e nao possuem bordero.
			nTotTit	+=	aRetidos[nI,8]
		Endif
	Next

	For nI := 1 to Len(aRetidos)

		SE1->( DbGoto(aRetidos[nI,1]) )

		Reclock("SE1",.F.)

		SE1->E1_PORTADO 	:= 	aRetidos[nI,13]
   		SE1->E1_AGEDEP  	:= 	aRetidos[nI,14]
		SE1->E1_SITUACA 	:= 	aRetidos[nI,15]
		SE1->E1_CONTRAT 	:= 	aRetidos[nI,16]
	   	SE1->E1_NUMBOR  	:= 	Iif( Empty(SE1->E1_NUMBOR) ,aRetidos[nI,17], SE1->E1_NUMBOR )
		SE1->E1_DATABOR		:= 	dDataBase
		SE1->E1_MOVIMEN 	:= 	dDataBase
	   	SE1->E1_CONTA	 	:= 	aRetidos[nI,18]

		If nTotTit > 0 .And. nTotTit <=	nVlMinImp .And. nValRec > 0 .And.	nValRec <= nVlMinImp //Titulo gerando neste momento bordero com PCC acumulado.
			SE1->E1_SABTPIS	:= aRetidos[nI,4]
			SE1->E1_SABTCOF	:= aRetidos[nI,5]
			SE1->E1_SABTCSL	:= aRetidos[nI,6]
			MsUnlock()
		Else
			If  Alltrim(aRetidos[nI,12])='BO' //Titulo bordero existente e com valor minimo de retencao vai gerar SFQ pois impostos ainda nao foram gerados.
				SE1->E1_SABTPIS	:=	0
				SE1->E1_SABTCOF	:=	0
				SE1->E1_SABTCSL	:= 0
			Endif

			If !(aRetidos[nI,12] $ "BX_BO" )   .And. Alltrim(aRetidos[nI,11]) <> 'S'
				SE1->E1_SALDO	:=	SE1->E1_SALDO -  Iif(lPccBxCR, (aRetidos[nI,4] +aRetidos[nI,5] +aRetidos[nI,6] ),0 )
				SE1->E1_VALLIQ	:= 	SE1->E1_VALLIQ + Iif(lPccBxCR, (aRetidos[nI,4] +aRetidos[nI,5] +aRetidos[nI,6] ),0 )
			Endif

			If SE1->E1_SALDO = 0
				SE1->E1_STATUS 	:=  "B"
			Endif

          	MsUnlock()
			FImpCriaSFQ("E1B", 	aRetidos[nI,19] , 	aRetidos[nI,20] , 	aRetidos[nI,21] , 	aRetidos[nI,22] , 	aRetidos[nI,23] , 	aRetidos[nI,24] ,;
						"E1B", SE1->E1_PREFIXO, SE1->E1_NUM, SE1->E1_PARCELA, SE1->E1_TIPO, SE1->E1_CLIENTE, SE1->E1_LOJA,;
								SE1->E1_SABTPIS, SE1->E1_SABTCOF, SE1->E1_SABTCSL,0,SE1->E1_FILIAL)

			If (aRetidos[nI,4] + aRetidos[nI,5]+	aRetidos[nI,6] ) > 0.00
				cSequencia := FaNxtSeqBx("SE1")  // Sequencia da baixa do adiantamento + 1

				nMoedaBco 	:= Max( MoedaBco(SE5->E5_BANCO,SE5->E5_AGENCIA,SE5->E5_CONTA), 1)
	            dBaixa		:=	CriaVar("E1_BAIXA")
				nTxMoeda 	:=	If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)
													DbSelectArea("SE5")


				//NÃO Houve retencao de PCC neste titulo
				//E o mesmo pertence ao bordero em processamento
				//Array para gravacao dos impostos FK3 - Retencao
				aImpPCC := {}
				aadd(aImpPCC,{"PIS",0 ,"",aRetidos[nI,25]})
				aadd(aImpPCC,{"COF",0 ,"",aRetidos[nI,26]})
				aadd(aImpPCC,{"CSL",0 ,"",aRetidos[nI,27]})

				//Gero o ID do documento - Titulo a Pagar
				cDocSE1 := xFilial("SE1") 	+ "|"
				cDocSE1 += SE1->E1_PREFIXO 	+ "|"
				cDocSE1 += SE1->E1_NUM 		+ "|"
				cDocSE1 += SE1->E1_PARCELA 	+ "|"
				cDocSE1 += SE1->E1_TIPO 	+ "|"
				cDocSE1 += SE1->E1_CLIENTE 	+ "|"
				cDocSE1 += SE1->E1_LOJA

				cDocKey := FINGRVFK7("SE1",cDocSE1)

				FNGFK3BCR(2 , "FK7",cDocKey,aImpPcc)

				//ATENCAO
				// ESTA GRAVACAO DO SE5 FOI MANTIDA NO MODO ANTIGO E
				// SERA RETIDADA QUANDO A SE5 FOR DESCONTINUADA
				// O CONTROLE DE RETENCOES APÓS A RETIRADA SERA FEITA PELA FK3/FK4
				If lPccBxCr // Quando o PCC for na Baixa e o título

					DbSelectArea("SE5")
					SE5->(RecLock("SE5",.T.))
					Replace E5_FILIAL 	With xFilial("SE5")
					Replace E5_DATA		With dDatabase
					Replace E5_VALOR	With 0
					Replace E5_NATUREZ	With SE1->E1_NATUREZ
					Replace E5_RECPAG 	With "R"
					Replace E5_TIPO		With SE1->E1_TIPO
					Replace E5_TIPODOC  With Iif(cSituacao $ "27","BD","BA")

					If 	aRetidos[nI,12] = "BO" //borderos acumulados devem ser identificados no historico para o caso de realizar o cancelamento correto.
						Replace E5_HISTOR		With "FINA061-Bordero Imp. Ac."
					ElseIf 	aRetidos[nI,12] = "BX"
						Replace E5_HISTOR		With "FINA061-Ref. Baixa"
					Else
						Replace E5_HISTOR		With "FINA061- Ger.Imp.-Bordero"
					Endif

					Replace E5_PREFIXO	With SE1->E1_PREFIXO
					Replace E5_NUMERO 	With SE1->E1_NUM
					Replace E5_PARCELA	With SE1->E1_PARCELA
					Replace E5_CLIFOR 	With SE1->E1_CLIENTE
					Replace E5_CLIENTE 	With SE1->E1_CLIENTE
					Replace E5_LOJA		With SE1->E1_LOJA
					Replace E5_BENEF	With SE1->E1_NOMCLI
					Replace E5_DTDIGIT	With dDataBase
					Replace E5_MOTBX	With "PCC"
					Replace E5_DTDISPO	With SE5->E5_DATA
					Replace E5_SEQ 		With cSequencia
					Replace E5_DOCUMEN	With Iif( Empty(SE1->E1_NUMBOR) ,aRetidos[nI,17], SE1->E1_NUMBOR )
					Replace E5_VLMOED2	With (aRetidos[nI,4] +	aRetidos[nI,5]+	aRetidos[nI,6] )
					Replace E5_VRETPIS	With aRetidos[nI,4]
					Replace E5_VRETCOF	With aRetidos[nI,5]
					Replace E5_VRETCSL	With aRetidos[nI,6]
					Replace E5_PRETPIS	With "2"
					Replace E5_PRETCOF	With "2"
					Replace E5_PRETCSL	With "2"
					Replace E5_FILORIG  With SE1->E1_FILORIG
					Replace E5_MOEDA  	With StrZero(nMoedaBco,2)
					Replace E5_TXMOEDA	With nTxMoeda
					Replace E5_BANCO 	With cPort060
					Replace E5_AGENCIA 	With cAgen060
					Replace E5_CONTA 	With cConta060
					Replace E5_MOVFKS	With "S"

					SE5->(MsUnLock())
				Endif
			EndIf
		Endif
	Next
Endif

Return

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³F061DelReg³ Autor ³ Andrea V. Santiago    ³ Data ³ 02/07/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Exclui registros das tabelas SE1, SFQ e SE5 referentes a   ³±±
±±³          ³   inclusao de borderos        .			    					  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ Nao existe retorno.              								  ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061DelReg(cPrefixo,cNum,cParcela,cTipo,cCliente,cLoja,lPccBxCR,lIRPJBaixa,nSalvRec,nParciais,__lMotRet,__lPccBxMR,__lIrfBxMR,__lImpBxMT,nVImpMt)

Local cTipoDes		:= ""
Local cNumBorDes	:= ""
Local cNumBorOri	:= ""
Local cBanco		:= ""
Local cAgencia		:= ""
Local cConta		:= ""
Local cFilOrig		:= xFilial("SE1",SE1->E1_FILORIG)
Local nRegSE5		:= 0
Local nRegOri		:= 0
Local nPisSe5		:= 0
Local nCofSe5		:= 0
Local nCslSe5		:= 0
Local nMoedaBco		:= 0
Local nRegAtual	   	:= 0
Local nVlMinImp		:= GetNewPar("MV_VL10925",5000)
Local aAreaSE5		:= SE5->(GetArea())
Local aAreaSE1		:= SE1->(GetArea())
Local lTemSfq	 	:= .F.
Local lBordAc		:= .F.
Local lGravaTit		:= .T.
Local lRegImpExc	:= .T.
Local lDelSE5 		:= .F.
Local aAreaE1		:= {}

Default nVImpMt		:= 0

Default __lMotRet 	:= .F.
Default __lPccBxMR 	:= .F.
Default __lIrfBxMR 	:= .F.
Default __lImpBxMT 	:= .F.

nPIS			:= 0
nCOFINS		:= 0
nCSLL			:= 0
nIrrfFina061	:= 0
__nVlImpMt		:=0
If dDataBase >= dLastPcc
	nVlMinImp	:= 0
EndIf

SFQ->(DbSetOrder(1)) //ORIGEM
If SFQ->(MsSeek(xFilial("SFQ")+"E1B"+cPrefixo+cNum+cParcela+cTipo+cCliente+cLoja))
	lTemSfq := .T.
Else
	SFQ->(DbSetOrder(2)) //DESTINO
	If SFQ->(MsSeek(xFilial("SFQ")+"E1B"+cPrefixo+cNum+cParcela+cTipo+cCliente+cLoja))
		lTemSfq		:= .T.
		cTipoDes	:=  SFQ->FQ_TIPODES
	Endif
Endif

DbSelectArea("SE5")

SE5->(DbSetOrder(7))
If SE5->(DbSeek(xFilial("SE5")+cPrefixo+cNum+cParcela+cTipo+cCliente+cLoja))

	While !SE5->(Eof()) .And. SE5->E5_PREFIXO+SE5->E5_NUMERO+SE5->E5_PARCELA+SE5->E5_TIPO+SE5->E5_CLIFOR+SE5->E5_LOJA == ;
							  cPrefixo+cNum+cParcela+cTipo+cCliente+cLoja  .And. xFilial("SE5") == SE5->E5_FILIAL

		cNumBorOri	:= ""
		cNumBorDes	:= ""
		nRegOri		:= 0

		aAreaE1	:= SE1->(GetArea())

		If	lTemSfq
			SE1->(DbSetOrder(1))
			If SE1->(MsSeek(xFilial("SE1")+(SFQ->FQ_PREFDES+SFQ->FQ_NUMDES+SFQ->FQ_PARCDES+SFQ->FQ_TIPODES)))
				cNumBorDes	:=	SE1->E1_NUMBOR
			Endif

			If SE1->(MsSeek(xFilial("SE1")+(SFQ->FQ_PREFORI+SFQ->FQ_NUMORI+SFQ->FQ_PARCORI+SFQ->FQ_TIPOORI)))
				cNumBorOri	:=	SE1->E1_NUMBOR
				nRegOri		:= SE1->(Recno())
			Endif
		Endif

		RestArea(aAreaE1)

		If Alltrim(SE5->E5_HISTOR)	= "Bx. Bord. Ac."	.And. lPccBxCR
			If	lTemSfq .And. Empty(cNumBorOri) //Titulo na SE5 gerado na baixa. Titulo acumulado em outro que nao contenha bordero.
				Reclock("SFQ",.F.)
				dbDelete()
				MsUnlock()
			Endif
			// Trecho não será passado para os model pois este processo
			// Será alterada e as atualizacoes serão realizada quando for retirado o tratamento do SE5
		  	Reclock("SE5",.F.)
			SE5->E5_PRETPIS	:=	"8"
			SE5->E5_PRETCOF	:=	"8"
			SE5->E5_PRETCSL	:=	"8"
			MsUnlock()
			SE5->(Dbskip())
			Loop
		Endif

		If SE5->E5_RECPAG == "R" .And. SE5->E5_MOTBX == "PCC" .And. lPccBxCR .And. SE5->E5_VALOR == 0 .And. ;
			(SE5->E5_PRETPIS = "8" .Or. SE5->E5_PRETCOF = "8" .Or. SE5->E5_PRETCSL = "8") //Excluindo titulo referente ao PCC que seja retido.
			//Deleta registros da SE5 e gera estorno nas FKs
			F061DelSE5()
			SE5->(Dbskip())
			Loop
			lDelSE5 := .T.
		Endif

		If (SE5->E5_RECPAG == "R" .And. SE5->E5_MOTBX == "IRF" .And. !Empty(SE5->E5_DOCUMEN) .And. SE5->E5_PRETIRF = "4" .And. lIRPJBaixa)
		  	nIrrfFina061	+=	SE5->E5_VRETIRF
			//Deleta registros da SE5 e gera estorno nas FKs
			F061DelSE5()
			lDelSE5 := .T.
		Endif

		If (SE5->E5_RECPAG == "R" .And. SE5->E5_MOTBX == "PCC" .And. !Empty(SE5->E5_DOCUMEN)) .And.;
			(SE5->E5_PRETPIS = "4" .Or. SE5->E5_PRETCOF = "4" .Or. SE5->E5_PRETCSL = "4") .And. lPccBxCR
			nPisFina061	+= SE5->E5_VRETPIS
			nCslFina061	+=	SE5->E5_VRETCSL
			nCofFina061 +=	SE5->E5_VRETCOF

			If	lTemSfq
				SE1->(DbSetOrder(1)) //Verificar se titulo destino tem algum registro com PRET = "A" para que eu possa estornar.
			   	If SE1->(MsSeek(xFilial("SE1")+(SFQ->FQ_PREFDES+SFQ->FQ_NUMDES+SFQ->FQ_PARCDES+SFQ->FQ_TIPODES)))

					nRegAtual	:=	SE5->(Recno())
					SE5->(DbSeek(xFilial("SE5")+SE1->E1_PREFIXO+SE1->E1_NUM+SE1->E1_PARCELA+SE1->E1_TIPO+SE1->E1_CLIENTE+SE1->E1_LOJA))

			 		While !SE5->(Eof()) .And. SE5->E5_PREFIXO+SE5->E5_NUMERO+SE5->E5_PARCELA+SE5->E5_TIPO+SE5->E5_CLIFOR+SE5->E5_LOJA == ;
									SE1->E1_PREFIXO+SE1->E1_NUM+SE1->E1_PARCELA+SE1->E1_TIPO+SE1->E1_CLIENTE+SE1->E1_LOJA .And. xFilial("SE5") == SE5->E5_FILIAL

						If SE5->E5_RECPAG == "R" .And. SE5->E5_MOTBX == "PCC" .And. lPccBxCR .And. SE5->E5_VALOR == 0 .And. ;
								(SE5->E5_PRETPIS = "A" .Or. SE5->E5_PRETCOF = "A" .Or. SE5->E5_PRETCSL = "A") //Excluindo titulo referente ao PCC que seja retido em outro.

							If (cPrefixo+cNum+cParcela+cTipo+cCliente+cLoja) = SE1->E1_PREFIXO+SE1->E1_NUM+SE1->E1_PARCELA+SE1->E1_TIPO+SE1->E1_CLIENTE+SE1->E1_LOJA
								//Deleta registros da SE5 e gera estorno nas FKs
								F061DelSE5()
								lDelSE5 := .T.
							Else
						  		// Tratamento de Reterncao de Impostos será tratodo na proxima fase
						  		// este tratamento não será mais suportado e será eliminado nas proximas versoes
							  	Reclock("SE5",.F.)
								SE5->E5_PRETPIS	:=	"8"
								SE5->E5_PRETCOF	:=	"8"
								SE5->E5_PRETCSL	:=	"8"
								MsUnlock()
							Endif
						Endif
			      		SE5->(Dbskip())
					Enddo
					SE5->(Dbgoto(nRegAtual))
				Endif

				FImpExcSFQ("E1B",cPrefixo,cNum,cParcela,cTipo,cCliente,cLoja)
			Endif
			//Deleta registros da SE5 e gera estorno nas FKs
			F061DelSE5()
			lDelSE5 := .T.
		Endif

		lGravaTit	:= .F.
		If (SE5->E5_RECPAG == "R" .And. Empty(SE5->E5_DOCUMEN)) .And. SE5->E5_MOTBX == "NOR" .And.;
			(SE5->E5_PRETPIS = "2" .Or. SE5->E5_PRETCOF = "2" .Or. SE5->E5_PRETCSL = "2") .And. lPccBxCR .And. SE5->E5_VALOR > 0

			If !TemBxCanc( SE5->E5_PREFIXO + SE5->E5_NUMERO + SE5->E5_PARCELA + SE5->E5_TIPO + SE5->E5_CLIFOR + SE5->E5_LOJA + SE5->E5_SEQ )

				SE1->(DbSetOrder(2))
				If SE1->(DbSeek(xFilial("SE1")+cCliente+cLoja+cPrefixo+cNum))
					If ValType(aDadosTit) <> "U"
					 	If Len(aDadosTit) > 0
							If (Ascan(aDadosTit,{|x| x[13]=  (SE1->E1_FILIAL+SE1->E1_PREFIXO+SE1->E1_NUM+SE1->E1_PARCELA+SE1->E1_TIPO+SE1->E1_CLIENTE+SE1->E1_LOJA)} ) ) = 0
				         	  lGravaTit	:= .T.
					       	Endif
						Else
						    lGravaTit	:= .T.
						Endif
					Endif

					If lGravaTit

						AADD(aDadosTit,{ 	SE1->(RECNO()),; 			//1
											SE1->E1_PREFIXO, ;  	//2
											SE1->E1_NUM,; 			//3
											SE1->E1_PARCELA ,;	//4
										 	SE1->E1_TIPO,;			//5
											SE1->E1_CLIENTE,;		//6
											SE1->E1_LOJA,;			//7
											SE5->E5_VRETPIS,;		// 8 Valor Retido do PIS
											SE5->E5_VRETCOF,;		// 9 Valor Retido do COFINS
											SE5->E5_VRETCSL,;		// 10 Valor Retido do CSLL
											SE5->E5_MOTBX,; 		// 11 Motivo de Baixa
											SE5->E5_VALOR,;      // 12 Valor da Baixa
											(SE1->E1_FILIAL+SE1->E1_PREFIXO+SE1->E1_NUM+SE1->E1_PARCELA+SE1->E1_TIPO+SE1->E1_CLIENTE+SE1->E1_LOJA)})   // 13 Chave
					Endif
				Endif
			Endif
		Endif

		//Excluindo titulo referente ao PCC que seja retido em outro.
		If ((SE5->E5_RECPAG == "R" .And. SE5->E5_MOTBX == "PCC" .And. !Empty(SE5->E5_DOCUMEN)) .And.;
			(SE5->E5_PRETPIS = "2" .Or. SE5->E5_PRETCOF = "2" .Or. SE5->E5_PRETCSL = "2") .And. lPccBxCR .And. SE5->E5_VALOR == 0 )

         	lRegImpExc	:=	.T.

			If Alltrim(Upper(SE5->E5_HISTOR)) = "FINA061-BORDERO IMP. AC."
				lBordAc	:=	.T.
			Endif

			If Alltrim(Upper(SE5->E5_HISTOR)) = "FINA061-BORDERO IMP. AC."
				lBordAc	:=	.T.
			Endif

			If Alltrim(Upper(SE5->E5_HISTOR)) <>	"FINA061-REF. BAIXA"
				nRegSe5		:= SE5->(Recno())
				nPisSe5		:= SE5->E5_VRETPIS
				nCofSe5		:= SE5->E5_VRETCOF
				nCslSe5		:= SE5->E5_VRETCSL
				cBanco		:= SE5->E5_BANCO
				cAgencia	:= SE5->E5_AGENCIA
				cConta		:= SE5->E5_CONTA

				SE1->(DbSetOrder(1))
				SE1->(Dbgoto(nRegOri))
				cSequencia 	:= FaNxtSeqBx("SE1")  // Sequencia da baixa do adiantamento + 1
				nMoedaBco 	:= Max( MoedaBco(cBanco,cAgencia,cConta), 1)
				dBaixa		:= CriaVar("E1_BAIXA")
				nTxMoeda 	:= If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)

				lDeletaSE5	:= .T.

				DbSelectArea("SE5")
				SE5->(RecLock("SE5",.T.))//Criar registro referente ao valor do PCC retido referente ao titulo retentor.
				Replace E5_FILIAL 	With xFilial("SE5")
				Replace E5_DATA		With dDatabase
				Replace E5_VALOR	With 0
				Replace E5_VLMOED2	With nPisSe5 + nCofSe5 + nCslSe5
				Replace E5_VRETPIS	With nPisSe5
				Replace E5_VRETCOF	With nCofSe5
				Replace E5_VRETCSL	With nCslSe5
				Replace E5_PRETPIS	With "8" //Valor titulo retido neste que foi cancelado.
				Replace E5_PRETCOF	With "8"
				Replace E5_PRETCSL	With "8"
				Replace E5_NATUREZ	With SE1->E1_NATUREZ
				Replace E5_RECPAG 	With "R"
				Replace E5_TIPO		With SE1->E1_TIPO
				Replace E5_TIPODOC  With "BA"

				If nParciais > 0
					Replace E5_HISTOR		With "FINA061-Bx.Parcial"
				Else
					Replace E5_HISTOR		With "FINA061-Pcc Retido"
				Endif

				Replace E5_PREFIXO	With SE1->E1_PREFIXO
				Replace E5_NUMERO 	With SE1->E1_NUM
				Replace E5_PARCELA	With SE1->E1_PARCELA
				Replace E5_CLIFOR 	With SE1->E1_CLIENTE
				Replace E5_CLIENTE 	With SE1->E1_CLIENTE
				Replace E5_LOJA		With SE1->E1_LOJA
				Replace E5_BENEF	With SE1->E1_NOMCLI
				Replace E5_DTDIGIT	With dDataBase
				Replace E5_MOTBX	With "PCC"
				Replace E5_DTDISPO	With SE5->E5_DATA
				Replace E5_SEQ 		With cSequencia
				Replace E5_DOCUMEN	With SE1->E1_NUMBOR
				Replace E5_FILORIG  With SE1->E1_FILORIG
				Replace E5_BANCO	With cBanco
				Replace E5_AGENCIA	With cAgencia
				Replace E5_CONTA	With cConta
				Replace E5_MOEDA  	With StrZero(nMoedaBco,2)
				Replace E5_TXMOEDA	With nTxMoeda
				SE5->(MsUnLock())

        		SE5->(Dbgoto(nRegSe5))

        	Endif

			If !Empty(cNumBorDes) .And. !Empty(cNumBorOri) .And. Alltrim(cNumBorOri) <> Alltrim(cNumBorDes) .And. lTemSfq
				Reclock("SFQ",.F.)
				dbDelete()
				MsUnlock()
        	Endif

			//Deleta registros da SE5 e gera estorno nas FKs
			F061DelSE5()
			lDelSE5 := .T.

		Endif

		If __lMotRet .And. (__lPccBxMR .or. __lImpBxMT .or. __lIrfBxMR)
			__nVlImpMt := FinRetBxMR("R", SE5->E5_IDORIG, .T.)
			nVImpMt := __nVlImpMt
			If !lDelSE5 //Deleta registros da SE5 e gera estorno nas FKs
				F061DelSE5()
			Endif
		EndIf

		F061DelImp( cCliente, cLoja , cPrefixo , cNum , cParcela , cTipo , cFilOrig , lPccBxCR , lIRPJBaixa, __lMotRet, __lPccBxMR, __lIrfBxMR, __lImpBxMT )
		SE5->(DbSkip())

	EndDo
Else
	F061DelImp( cCliente, cLoja , cPrefixo , cNum , cParcela , cTipo , cFilOrig , lPccBxCR , lIRPJBaixa, __lMotRet, __lPccBxMR, __lIrfBxMR, __lImpBxMT )
EndIf

SE5->(RestArea(aAreaSE5))
SE1->(RestArea(aAreaSE1))

Return

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ F061DelImp³ Autor ³ Daniel Mendes         ³ Data ³ 11/05/15 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Efetua a exclusão dos títulos gerados ao incluir o         ³±±
±±³ 			 ³ 	documento em borderô.                                   ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³  Nao existe retorno.                                        ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Static Function F061DelImp( cCliente, cLoja , cPrefixo , cNum , cParcela , cTipo , cFilOrig , lPccBxCR , lIRPJBaixa, __lMotRet, __lPccMR, __lIrfMR, __lImpBxMT)
Local nRecNoSE1 	:= SE1->( RecNo() )
Local cAlias    	:= Alias()
Local lExistFJU 	:= FJU->(ColumnPos("FJU_RECPAI")) >0 .and. FindFunction("FinGrvEx")
Local aAreaAnt		:= {}
Local cNatur		:= &(SuperGetMv("MV_IRF",,""))
Local cTitPai   	:= SE1->(E1_PREFIXO + E1_NUM + E1_PARCELA + E1_TIPO + E1_CLIENTE + E1_LOJA)
Local aAreaSE1		:= {}
Local cDocKey		:= ""
Local oObjTitPai 	As Object
Local cChaveFK7     := ""

Default __lMotRet	:= .F.
Default __lPccMR 	:= .F.
Default __lIrfMR 	:= .F.
Default __lImpBxMT 	:= .F.

_lbrCanUse	:= brCanUse(@oObjTitPai)


If lPccBxCR .Or. lIRPJBaixa .oR. __lMotRet

	If __lMotRet .And. (__lPccMR .Or. __lIrfMR .Or. __lImpBxMT)

		//Motor de Retenção Exclusão de baixas
		aAreaAnt := GetArea()
		FKA->(dbSetOrder(3))

		If FKA->(msSeek(xFilial('FKA') + "FK1" + SE5->E5_IDORIG))
			FinSetAPrc("FK1")

			oModel := FWLoadModel("FINM060")
			oModel:SetOperation(4)
			oModel:Activate()
			oModel:SetValue( "MASTER", "OPERACAO", 3)
			oSubFKA := oModel:GetModel("FKADETAIL")

			If oSubFKA:SeekLine( { {"FKA_IDORIG", SE5->E5_IDORIG } } )
				If oModel:VldData()
					oModel:CommitData()
				Else
					lRet := .F.
					cLog := cValToChar(oModel:GetErrorMessage()[4]) + ' - '
					cLog += cValToChar(oModel:GetErrorMessage()[5]) + ' - '
					cLog += cValToChar(oModel:GetErrorMessage()[6])
					Help( ,,"M060VLDI1",,cLog, 1, 0 )
					DisarmTransaction()
				Endif

				oModel:DeActivate()
				oModel:Destroy()
				oModel:= Nil
				FinSetAPrc()
			Endif

			RestArea(aAreaAnt)
		EndIf
	Endif

	aAreaSE1 := GetArea()

	dbSelectArea("SE1")
	SE1->(DbSetOrder(2))
	SE1->(DbSeek(cFilOrig+cCliente+cLoja+cPrefixo+cNum))	//Apaga os registros referentes aos impostos gerados nesta rotina.
	While SE1->(!EOF()) .And. SE1->E1_FILIAL+SE1->E1_CLIENTE+SE1->E1_LOJA+SE1->E1_PREFIXO+SE1->E1_NUM == (xFilial("SE1")+cCliente+cLoja+cPrefixo+cNum)
		If SE1->E1_TIPO $ "IRF/PIS/COF/CSL"  .And. SE1->E1_ORIGEM = "FINA061"
			If lExistFJU
				FinGrvEx("R")
			Endif

			cChaveFK7 := xFilial("SE1")+"|"+SE1->E1_PREFIXO+"|"+SE1->E1_NUM+"|"+SE1->E1_PARCELA+"|"+SE1->E1_TIPO+"|"+SE1->E1_CLIENTE+"|"+SE1->E1_LOJA
        
			RecLock("SE1" ,.F.)
			SE1->(DbDelete())
			dbSelectArea( "SE1" )
		EndIf
		If !Empty(cChaveFK7)
			FINDELFKs(cChaveFK7,"SE1")
		EndIf
		SE1->(DbSkip())
	Enddo

	If SA1->A1_RECIRRF == "2"
		dbSelectArea("SE2")
		SE2->(DbSetOrder(6))
		SE2->(DbSeek(cFilOrig+"UNIAO "+"00"+cPrefixo+cNum))	//Apaga os registros referentes aos impostos gerados nesta rotina.
		If SE2->E2_FILIAL+SE2->E2_FORNECE+SE2->E2_LOJA+SE2->E2_PREFIXO+SE2->E2_NUM == (xFilial("SE2")+"UNIAO "+"00"+cPrefixo+cNum)
			cDocKey := SE2->E2_TITPAI
			If _lbrCanUse .And. MethIsMemberOf(oObjTitPai, "setAliasOrig")
				oObjTitPai:setAliasOrig("SE1")
				cDocKey := oObjTitPai:getRelatedBillKey("SE2",SE2->(Recno()))
				FreeObj(oObjTitPai)
			EndIf
			cDocKey := Rtrim(cDocKey)
				
			If SE2->E2_TIPO $ MVTAXA  .And. Alltrim(SE2->E2_ORIGEM) == "FINA061" .and. Alltrim(SE2->E2_NATUREZ) == Alltrim(cNatur) .and. cDocKey == cTitPai
				If lExistFJU
					FinGrvEx("R")
				Endif
				
				//Função para deletar as FKs
				FINDELFKs(SE2->E2_FILIAL+"|"+SE2->E2_PREFIXO+"|"+SE2->E2_NUM+"|"+SE2->E2_PARCELA+"|"+SE2->E2_TIPO+"|"+SE2->E2_FORNECE+"|"+SE2->E2_LOJA,"SE2")
				
				RecLock("SE2" ,.F.)
				SE2->(DbDelete())
				dbSelectArea( "SE2" )
			EndIf
		EndIf
	EndIf

	RestArea(aAreaSE1)

	If lPccBxCR
		FImpExcSFQ("E1B",cPrefixo,cNum,cParcela,cTipo,cCliente,cLoja)
	EndIf
EndIf

SE1->( dbGoTo( nRecNoSE1 ) )
dbSelectArea( cAlias )

Return Nil

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³ F061TitBx³ Autor ³ Andrea V. Santiago    ³ Data ³ 03/07/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Seleciona baixas de titulos que tenham borderos de imposto ³±±
±±³ 			 ³ 	e estorna ou exclui registro da SE5.                  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³  Nao existe retorno.                                       ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061TitBx(cNumBor,cPortado,cAgeDep,cConta )

Local aAreaSE1		:=	SE1->( GetArea() )
Local cQuery		:=		""
Local cAliasQry		:=	""
Local aStruSe1		:=	{}
Local lTipBxCP   	:=	.F.
Local nTxMoeda 		:=	0
Local aBaixa     	:=	{}
Local nTotAdto   	:=	0
Local lBaixaAbat 	:=	.F.
Local nVlrBaixa  	:=	0
Local lBxCec     	:=	.F.
Local lBxLiq		:=	.F.
Local lSigaloja  	:=	.F.
Local nI			:=	0
Local aAreaSE5		:=	SE5->( GetArea() )
Local oModelMov		:= NIL
Local oSubFKA		:= NIL

dbSelectArea("SE1")
aStruSe1 := SE1->( dbStruct() )

SE1->( dbCommit() )

cAliasQry := GetNextAlias()

cQuery := "SELECT E1_FILIAL,E1_PREFIXO,E1_NUM,E1_PARCELA,E1_TIPO,E1_CLIENTE,E1_LOJA,E1_NATUREZ,E1_MOEDA,E1_TXMOEDA,E1_VENCREA, "
cQuery += "E1_VALOR,E1_PIS,E1_COFINS,E1_CSLL,E1_IRRF,E1_SABTPIS,E1_SABTCOF,E1_SABTCSL,E1_SALDO,E1_TIPOLIQ,"
cQuery += "	R_E_C_N_O_ RECNO FROM "
cQuery += RetSqlName( "SE1" ) + " SE1 "
cQuery += " WHERE "
cQuery += " E1_FILIAL = '"  + xFilial("SE1") + "' AND "
cQuery += " E1_NUMBOR = '" + cNumBor +  " ' "
cQuery += " AND E1_PORTADO = '" + cPortado +  " ' "
cQuery += " AND E1_AGEDEP = '" + cAgeDep +  " ' "
cQuery += " AND E1_CONTA = '" + cConta +  " ' "
cQuery += " AND D_E_L_E_T_ =  ' ' "

cQuery := ChangeQuery( cQuery )

dbUseArea( .T., "TOPCONN", TcGenQry(,,cQuery), cAliasQry, .F., .T. )

For nI := 1 To Len(aStruSe1)
	If aStruSe1 [nI][2] <> "C" .And. FieldPos(aStruSe1[nI][1])<>0
		TcSetField(cAliasQry,aStruSe1[nI][1],aStruSe1[nI][2],aStruSe1[nI][3],aStruSe1[nI][4])
	EndIf
Next nI

(cAliasQRY)->(DbGotop())

aDadosRef	:= Array(7)
aDadosRet	:= Array(7)
dBaixa		:= CriaVar("E1_BAIXA")

While !(cAliasQRY)->( Eof())

	nTxMoeda 	:=	If((cAliasQRY)->E1_MOEDA > 1, If((cAliasQRY)->E1_TXMOEDA > 0, (cAliasQRY)->E1_TXMOEDA,RecMoeda(dBaixa,(cAliasQRY)->E1_MOEDA)),0)

	If ((cAliasQRY)->E1_VALOR > (cAliasQRY)->E1_SALDO) .And. Empty((cAliasQRY)->E1_TIPOLIQ)
		lTipBxCP	:=	lRaRtImp
		aBaixa  	:= 	Sel070Baixa( "VL /V2 /BA /RA /CP /LJ /" + MV_CRNEG, (cAliasQRY)->E1_PREFIXO, (cAliasQRY)->E1_NUM, (cAliasQRY)->E1_PARCELA, (cAliasQRY)->E1_TIPO,;
																			@nTotAdto, @lBaixaAbat, (cAliasQRY)->E1_CLIENTE, (cAliasQRY)->E1_LOJA, @nVlrBaixa, , @lBxCec, @lBxLiq ,@lSigaloja, @lTipBxCP)
		For nI:=1 To Len(aBaixaSE5)
			If aBaixaSE5[nI][8] > 0 .And. Alltrim(aBaixaSE5[nI][29]) = "NOR" .And.  Alltrim(aBaixaSE5[nI][4]) = Alltrim((cAliasQRY)->E1_TIPO)
				AADD(aDadosTit,{ 	( cAliasQRY )->RECNO,; 			  	//1
				  					( cAliasQRY )->E1_PREFIXO, ;  	//2
				 					( cAliasQRY )->E1_NUM,; 		//3
								 	( cAliasQRY )->E1_PARCELA ,;	//4
								 	( cAliasQRY )->E1_TIPO,;		//5
								 	( cAliasQRY )->E1_CLIENTE,;		//6
									( cAliasQRY )->E1_LOJA,;		//7
				 					aBaixaSE5[nI][18],;	            // 8 Valor Retido do PIS
									aBaixaSE5[nI][19],;  			// 9 Valor Retido do COFINS
									aBaixaSE5[nI][20],;             // 10 Valor Retido do CSLL
							 		aBaixaSE5[nI][29],;             // 11 Motivo de Baixa
									aBaixaSE5[nI][8],;              // 12 Valor da Baixa
									((cAliasQRY)->E1_FILIAL+(cAliasQRY)->E1_PREFIXO+(cAliasQRY)->E1_NUM+(cAliasQRY)->E1_PARCELA+(cAliasQRY)->E1_TIPO+(cAliasQRY)->E1_CLIENTE+(cAliasQRY)->E1_LOJA)}) // 13 CHAVE
			Endif
		Next
	Endif
	( cAliasQRY )->( dbSkip())
EndDo

( cAliasQRY )->( dbCloseArea() )
dbSelectArea( "SE1" )

If Len(aDadosTit) > 0

	DbSelectArea("SE5")
	SE5->(DbSetOrder(7))

	For nI:=1 to Len(aDadosTit)

		SE1->(Dbgoto(aDadosTit[nI,1] ))
		Reclock("SE1",.F.)
		SE1->E1_NUMBOR   	:= ""
		SE1->E1_PORTADO  	:= ""
		SE1->E1_AGEDEP  	:= ""
		SE1->E1_CONTRAT  	:= ""
		SE1->E1_DATABOR  	:= Ctod(Space(8))
		SE1->E1_MOVIMENT 	:= dDatabase
		SE1->E1_CONTA	  	:= ""
		SE1->E1_SITUACA		:= "0"
		MsUnlock()

		If SE5->(DbSeek(xFilial("SE5")+aDadosTit[nI,2]+aDadosTit[nI,3]+aDadosTit[nI,4]+aDadosTit[nI,5]+aDadosTit[nI,6]+aDadosTit[nI,7]))

			While !SE5->(Eof()) .And. SE5->E5_PREFIXO+SE5->E5_NUMERO+SE5->E5_PARCELA+SE5->E5_TIPO+SE5->E5_CLIFOR+SE5->E5_LOJA == ;
							aDadosTit[nI,2]+aDadosTit[nI,3]+aDadosTit[nI,4]+aDadosTit[nI,5]+aDadosTit[nI,6]+aDadosTit[nI,7]  .And. xFilial("SE5") == SE5->E5_FILIAL

				If SE5->E5_VALOR > 0 .And. SE5->E5_MOTBX = "NOR" .And. SE5->E5_TIPO =  aDadosTit[nI,5] .And.;
				    SE5->E5_PRETPIS = "2" .And. SE5->E5_PRETCOF = "2" .And. SE5->E5_PRETCSL = "2"
				    // Este tratamento sera a absorvido pelas rotinad de baixa quando não houverem mais o SE5
				    // com isso esse tratamento sera descontinuado
				  	Reclock("SE5",.F.)

				 	If SE5->E5_PRETPIS = "2"
						SE5->E5_PRETPIS	:= "1"
					Endif
					If SE5->E5_PRETCOF = "2"
						SE5->E5_PRETCOF	:= "1"
					Endif
					If SE5->E5_PRETCSL = "2"
						SE5->E5_PRETCSL	:= "1"
					Endif
					SE5->E5_HISTOR :=	""
					MsUnlock()
				Endif

				If SE5->E5_VALOR = aDadosTit[nI,12] .And. SE5->E5_MOTBX = "NOR" .And.;
					SE5->E5_TIPO =  aDadosTit[nI,5]	.And. SE5->E5_MOTBX = aDadosTit[nI,11] .And.;
				  	SE5->E5_VRETPIS = aDadosTit[nI,8]  .And. SE5->E5_VRETCOF = aDadosTit[nI,9]	.And. SE5->E5_VRETCSL = aDadosTit[nI,10]

				  	// Este tratamento sera a absorvido pelas rotinad de baixa quando não houverem mais o SE5
					// com isso esse tratamento sera descontinuado
					Reclock("SE5",.F.)
					If SE5->E5_PRETPIS = "2"
						SE5->E5_PRETPIS	:= "1"
					Endif
					If SE5->E5_PRETCOF = "2"
						SE5->E5_PRETCOF	:= "1"
					Endif
					If SE5->E5_PRETCSL = "2"
						SE5->E5_PRETCSL	:= "1"
					Endif

					MsUnlock()
				Endif

				If SE5->E5_VALOR = 0 .And. SE5->E5_MOTBX = "PCC" .And.;
					SE5->E5_VRETPIS = aDadosTit[nI,8]  .And. SE5->E5_VRETCOF = aDadosTit[nI,9]	.And. SE5->E5_VRETCSL = aDadosTit[nI,10] .And.;
			  	  	SE5->E5_PRETPIS = "2" .And. SE5->E5_PRETCOF = "2" .And. SE5->E5_PRETCSL = "2"

					oModelMov := FWLoadModel("FINM010") //Recarrega o Model de movimentos para pegar o campo do relacionamento (SE5->E5_IDORIG)
					oModelMov:SetOperation( MODEL_OPERATION_UPDATE ) //Alteração
					oModelMov:Activate()
					oModelMov:SetValue( "MASTER", "E5_GRV", .T. ) //Habilita gravação SE5
					//E5_OPERACAO 1 = Altera E5_SITUACA da SE5 para 'C' e gera estorno na FK5
					//E5_OPERACAO 2 = Grava E5 com E5_TIPODOC = 'ES' e gera estorno na FK5
					//E5_OPERACAO 3 = Deleta da SE5 e gera estorno na FK5
					oModelMov:SetValue( "MASTER", "E5_OPERACAO", 3 ) //E5_OPERACAO 3 = Deleta da SE5 e gera estorno na FK5

					//Posiciona a FKA com base no IDORIG da SE5 posicionada
					oSubFKA := oModelMov:GetModel( "FKADETAIL" )
					oSubFKA:SeekLine( { {"FKA_IDORIG", SE5->E5_IDORIG } } )

					If oModelMov:VldData()
					   	oModelMov:CommitData()
						SE5->(dbGoto(oModelMov:GetValue( "MASTER", "E5_RECNO" )))
					   	oModelMov:DeActivate()
					Else
						lRet := .F.
					    cLog := cValToChar(oModelMov:GetErrorMessage()[4]) + ' - '
					    cLog += cValToChar(oModelMov:GetErrorMessage()[5]) + ' - '
					    cLog += cValToChar(oModelMov:GetErrorMessage()[6])
    					Help( ,,"M030VALID",,cLog, 1, 0 )
					Endif

				Endif

				SE5->(Dbskip())
			Enddo
		Endif
	Next
Endif

SE1->( RestArea(aAreaSE1) )
SE5->( RestArea(aAreaSE5) )

Return( )

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³F061PccExc³ Autor ³ Andrea V. Santiago    ³ Data ³ 05/07/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Seleciona valores de PCC de bordero cancelado.	   		  ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ Retorna valores do PCC a serem subtraidos pois os titulos  ³±±
±±³          ³   referentes aos impostos jah foram gerados. 		        ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061PccExc(cFilOri As Char, cPreTit As Char, cNumTit As Char, cParTit As Char, cTipTit As Char, oImpRetBx As Object) As Array
	Local cQuery  As Char
	Local cQryEst As Char
	Local cWhere  As Char
	Local cTblSE5 As Char
	Local cTblTmp As Char
	Local nPisBx  As numeric
	Local nCofBx  As numeric
	Local nCsllBx As numeric
	Local aImpDel As Array

	//Inicializa variáveis.
	cQuery  := ""
	cQryEst := ""
	cWhere  := ""
	cTblSE5 := ""
	cTblTmp := "TblTmp"
	nPisBx  := 0
	nCofBx  := 0
	nCsllBx := 0
	aImpDel := {}

	//Valores default dos parâmetros.
	Default cFilOri   := cFilAnt
	Default cPreTit   := Padr("", TamSx3("E1_PREFIXO")[1], " ")
	Default cNumTit   := Padr("", TamSx3("E1_NUM")[1], " ")
	Default cParTit   := Padr("", TamSx3("E1_PARCELA")[1], " ")
	Default cTipTit   := Padr("", TamSx3("E1_TIPO")[1], " ")
	Default oImpRetBx := Nil

	If !Empty(cFilOri) .And. !Empty(cNumTit) .And. !Empty(cTipTit)
		If oImpRetBx == Nil
			cTblSE5 := RetSqlName("SE5")
			cQuery  := "SELECT SE5.E5_VRETPIS, SE5.E5_VRETCOF, SE5.E5_VRETCSL, SE5.E5_SEQ, SE5.E5_HISTOR FROM " + cTblSE5 + " SE5 "

			cWhere := "WHERE SE5.E5_FILORIG = ? "
			cWhere += "AND SE5.E5_PREFIXO = ? AND SE5.E5_NUMERO = ? "
			cWhere += "AND SE5.E5_PARCELA = ? AND SE5.E5_TIPO = ? "
			cWhere += "AND ((ISNULL(SE5.E5_VRETPIS, 0) > 0) OR (ISNULL(SE5.E5_VRETCOF, 0) > 0) "
			cWhere += "OR (ISNULL(SE5.E5_VRETCSL, 0) > 0 )) "
			cWhere += "AND SE5.E5_DATA BETWEEN ? AND ? "
			cWhere += "AND SE5.E5_MOTBX <> 'PCC' "

			//Filtro dos estornos
			cQryEst := "SELECT SE5EST.E5_SEQ FROM " + cTblSE5 + " SE5EST "
			cQryEst += StrTran(cWhere, "SE5.", "SE5EST.")
			cQryEst += "AND SE5EST.E5_TIPODOC = 'ES' AND SE5EST.D_E_L_E_T_ = ' ' "

			//Filtro da query de baixas
			cWhere += "AND SE5.E5_TIPODOC <> 'ES' AND SE5.D_E_L_E_T_ = ' ' "
			cQuery += cWhere + "AND SE5.E5_SEQ NOT IN (" + cQryEst + " )"
			cQuery    := ChangeQuery(cQuery)
			oImpRetBx := FWPreparedStatement():New(cQuery)
		EndIf

		oImpRetBx:SetString(1, cFilOri)
		oImpRetBx:SetString(2, cPreTit)
		oImpRetBx:SetString(3, cNumTit)
		oImpRetBx:SetString(4, cParTit)
		oImpRetBx:SetString(5, cTipTit)
		oImpRetBx:SetString(6, DTOS(dEmisDe))
		oImpRetBx:SetString(7, DTOS(dEmisAte))
		//Parâmetros do estorno
		oImpRetBx:SetString(8, cFilOri)
		oImpRetBx:SetString(9, cPreTit)
		oImpRetBx:SetString(10, cNumTit)
		oImpRetBx:SetString(11, cParTit)
		oImpRetBx:SetString(12, cTipTit)
		oImpRetBx:SetString(13, DTOS(dEmisDe))
		oImpRetBx:SetString(14, DTOS(dEmisAte))

		cQuery := oImpRetBx:GetFixQuery()
		cTblTmp := MpSysOpenQuery(cQuery)

		While (cTblTmp)->(!Eof())
			If Alltrim(Upper((cTblTmp)->E5_HISTOR)) == STR0160
				(cTblTmp)->(DbSkip())
				Loop
			EndIf

			nPisBx	+= (cTblTmp)->E5_VRETPIS
			nCofBx	+= (cTblTmp)->E5_VRETCOF
			nCsllBx	+= (cTblTmp)->E5_VRETCSL
			(cTblTmp)->(DbSkip())
		EndDo

		(cTblTmp)->(DbCloseArea())

		If (nPisBx+nCofBx+nCsllBx) > 0
			Aadd(aImpDel, {nPisBx, nCofBx, nCsllBx})
		Endif
	EndIf
Return aImpDel

/*/
ÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜÜ
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
±±ÚÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÂÄÄÄÄÄÄÂÄÄÄÄÄÄÄÄÄÄ¿±±
±±³Fun‡„o	 ³F061PccAc ³ Autor ³ Andrea V. Santiago    ³ Data ³ 05/08/13 ³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄ´±±
±±³Descri‡„o ³ Seleciona valores de PCC excluidos para alterar campos PRET³±±
±±ÃÄÄÄÄÄÄÄÄÄÄÅÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ´±±
±±³Sintaxe	 ³ Seleciona valores de PCC excluidos e acumulados e altera   ³±±
±±³          ³ os campos E5_PRETPIS,E5_PRETCOF,E5_PRETCSL. Sem retorno.   ³±±
±±ÀÄÄÄÄÄÄÄÄÄÄÁÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ±±
±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±±
ßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßßß
/*/
Function F061PccAc( cFilOri , cPrefOri , cNumOri, cParOri, cTipoOri , cCliOri , cLojaOri)
Local nRegSe5		:=	SE5->(Recno())
Local cQuery		:=	""
Local cAliasQry	:=	""

dbSelectArea("SE5")

cAliasQry := GetNextAlias()

cQuery := "SELECT E5_FILIAL, E5_PREFIXO,E5_NUMERO,E5_PARCELA,E5_TIPO,E5_CLIFOR,E5_LOJA, "
cQuery += "E5_VALOR,E5_PRETPIS,E5_PRETCOF,E5_PRETCSL,E5_VRETPIS,E5_VRETCOF,E5_VRETCSL, E5_MOTBX, "
cQuery += "	R_E_C_N_O_ RECNOSE5 FROM "
cQuery += RetSqlName( "SE5" ) + " SE5 "
cQuery += " WHERE E5_FILIAL = '" + xFilial("SE5") + "'"
cQuery += " AND E5_DATA Between '" + DTOS(dEmisDe) + "' AND '" + DTOS(dEmisAte) + "'"
cQuery += " AND E5_CLIFOR Between '" + cCliDe        + "' AND '" + cCliAte        + "'"
cQuery += " AND E5_VALOR = 0 "
cQuery += " AND E5_PRETPIS = '8'  AND E5_PRETCOF = '8'  AND E5_PRETCSL =  '8' "
cQuery += " AND D_E_L_E_T_ = ' ' "

cQuery := ChangeQuery( cQuery )

dbUseArea( .T., "TOPCONN", TcGenQry(,,cQuery), cAliasQry, .F., .T. )

(cAliasQRY)->(DbGotop())

While !(cAliasQRY)->( Eof())

	SE5->(Dbgoto((cAliasQRY)->RECNOSE5))
	// Tratamento de Impostos sera alterado e tratado pelas rotinad e baixa
	// no novo modelo não sera mais necessario
	Reclock("SE5",.F.)
	SE5->E5_HISTOR	:= "FINA061"
	SE5->E5_PRETPIS	:= "A"
	SE5->E5_PRETCOF	:= "A"
	SE5->E5_PRETCSL	:= "A"
	MsUnlock()

	FImpCriaSFQ("E1B", cPrefOri , cNumOri , cParOri , cTipoOri , cCliOri , cLojaOri,;
				"E1B", SE5->E5_PREFIXO, SE5->E5_NUMERO, SE5->E5_PARCELA, SE5->E5_TIPO, SE5->E5_CLIFOR, SE5->E5_LOJA,;
				SE5->E5_VRETPIS, SE5->E5_VRETCOF, SE5->E5_VRETCSL,0,SE5->E5_FILIAL )

	( cAliasQRY )->( dbSkip())

EndDo

//ÚÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ¿
//³ Fecha a area de trabalho da query                                      ³
//ÀÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÙ
( cAliasQRY )->( dbCloseArea() )
dbSelectArea( "SE5" )

SE5->(Dbgoto(nRegSe5))

Return()

//-----------------------------------------------------------------------------------------
/*/
{Protheus.doc} FNGFK3BCR
Tratamento para os registros da FK3

@Param   nOper 		= Operacao a ser realizada (1 = Inclusao; 2 = Alteracao; 3 Exclusao)
@Param   cTabOrig 	= Tabela de origem do registro da FK3
@Param   cIdDoc 	= Id do documento (FK7)
@Param   aImposRet	= Array para atualizacao dos impostos
@Param   cNumBor 	= Código do borderô em processamento

@author pequim

@since 26/09/2014
@version 1.0
/*/
//-----------------------------------------------------------------------------------------
Function FNGFK3BCR(nOper,cTabOrig,cIdDoc,aImposRet,cNumBor,lMotorRet,cCodRetIr)

Local cIdFK3 	:= ""
Local nX	 	:= 0
Local nLenImp	:= 0

DEFAULT nOper 		:= 0
DEFAULT cTabOrig	:= "FK1"
DEFAULT cIdDoc		:= ""
DEFAULT aImposRet	:= {}
DEFAULT lMotorRet	:= .F.
DEFAULT cCodRetIr	:= ""

nLenImp	:= Len(aImposRet)

__lMotRet		:= ExistFunc("FTemMotor") .And. FTemMotor()

IF nOper == 1	//Inclusao

	//gravação da FK7 X FK3
	//Para titulos em bordoro, verifico se existe FK3 anterior
	dbSelectArea("FK3")
	dbSetOrder(2)


	For nX := 1 to nLenImp

		If !lMotorRet .And. MsSeek(xFilial("FK3") + cTabOrig + cIdDoc + aImposRet[nX][1])
			Exit
		Endif

		//Houve calculo do imposto - Gravo FK3
		If aImposRet[nX][2] > 0

			cIdFK3:= FINFKSID('FK3', 'FK3_IDFK3')

			//Gravação da FK7 X FK3
			RecLock("FK3",.T.)

			FK3_FILIAL	:= xFilial("FK3")
			FK3_IDFK3	:= cIdFk3
			FK3_DATA	:= dDataBase
			FK3_VALOR	:= aImposRet[nX,2]
			FK3_MOEDA	:= "01"
			FK3_NATURE	:= aImposRet[nX,3]
			FK3_RECPAG	:= "R"
			FK3_IDRET	:= aImposRet[nx,4]
			FK3_IMPOS	:= aImposRet[nX,1]
			FK3_FILORI	:= SE1->E1_FILORIG
			FK3_BASIMP	:= aImposRet[nX,6]
			FK3_ORIGEM	:= FunName()
			FK3_IDORIG	:= cIdDoc
			FK3_TABORI	:= cTabOrig
			FK3_STATUS 	:= '1'
			If !Empty(cCodRetIr) 
				FK3_CODRET := cCodRetIr
			EndIf

			If __lMotRet .and. Len(aImposRet[nX]) > 7
				FK3_CODFKM	:= aImposRet[nX,8]
				FK3_CLIFOR	:= aImposRet[nX,9]
				FK3_LOJA	:= aImposRet[nX,10]
				FK3_CGC		:= aImposRet[nX,11]
				FK3_RAICGC	:= Substr(aImposRet[nX,11], 1, 8)
			Endif

			MsUnlock()
	 	Endif
	Next

ElseIf nOper == 2		//Alteracao

	// Gravação da FK7 X FK3
	dbSelectArea("FK3")
	dbSetOrder(2)
	For nX := 1 to nLenImp
		If MsSeek(xFilial("FK3")+cTabOrig+cIdDoc+aImposRet[nX,1])
			RecLock("FK3",.F.)
			FK3->FK3_IDRET	:= aImposRet[nx,4]
			MsUnlock()
			FK3->(dbSkip())
		Endif
	Next
ElseIf nOper == 3		//Exclusao
	// Gravação da FK7 X FK3
	dbSelectArea("FK3")
	dbSetOrder(2)
	For nX := 1 to nLenImp
		If MsSeek(xFilial("FK3")+cTabOrig+cIdDoc+aImposRet[nX,1])
			RecLock("FK3",.F.)
			dbDelete()
			MsUnlock()
		Endif
	Next
Endif

Return .T.

//-----------------------------------------------------------------------------------------
/*/
{Protheus.doc} F061DelSE5
Deleta registros da SE5 e gera estornos nas FKs

@author pequim

@since 26/09/2014
@version 1.0
/*/
//-----------------------------------------------------------------------------------------
Function F061DelSE5()
	Local cHistorico As Char
	Local aAreaAtual As Array
	Local aAreaSE1   As Array
	Local oModelMov  As Object
	Local oSubFKA    As Object

	//Inicializa variáveis
	cHistorico := Iif(AllTrim(SE5->E5_ORIGEM) == "FINA891", STR0171, STR0170)
	aAreaAtual := GetArea()
	aAreaSE1   := SE1->(GetArea())
	oModelMov  := Nil
	oSubFKA    := Nil

	If !Empty(SE5->E5_IDORIG)
		oModelMov := FWLoadModel("FINM010")
		oModelMov:SetOperation(MODEL_OPERATION_UPDATE)
		oModelMov:Activate()
		oModelMov:SetValue("MASTER", "E5_GRV", .T. )
		oModelMov:SetValue("MASTER", "HISTMOV", cHistorico)
		oModelMov:SetValue( "MASTER", "E5_OPERACAO", 3 )
		oSubFKA := oModelMov:GetModel( "FKADETAIL" )

		If oSubFKA:SeekLine({{"FKA_IDORIG", SE5->E5_IDORIG}})
			If oModelMov:VldData()
				oModelMov:CommitData()
				SE5->(dbGoto(oModelMov:GetValue("MASTER", "E5_RECNO")))
			Else
				lRet := .F.
				cLog := cValToChar(oModelMov:GetErrorMessage()[4]) + ' - '
				cLog += cValToChar(oModelMov:GetErrorMessage()[5]) + ' - '
				cLog += cValToChar(oModelMov:GetErrorMessage()[6])
				Help(Nil, Nil, "M030VALID", Nil, cLog, 1, 0)
			Endif
		Endif

		oModelMov:DeActivate()
		oModelMov:Destroy()
		oModelMov := Nil
		oSubFKA   := Nil

		If __lMotRet
			FMRDelImp("FK1", SE5->E5_IDORIG)
		Endif
	Else
		Reclock("SE5",.F.)
		SE5->(DbDelete())
		SE5->(MsUnlock())
	EndIf

	RestArea(aAreaSE1)
	RestArea(aAreaAtual)
	FwFreeArray(aAreaSE1)
	FwFreeArray(aAreaAtual)
Return .T.

/*/{Protheus.doc} F061CalImp()
Função para realizar o cálculo de imposto através do motor de retenções

@param cNatMR, Natureza para cálculo do imposto pelo motor de retenções
@param cCliMR, Cliente para cálculo do imposto pelo motor de retenções
@param cLojaMR, Loja para cálculo do imposto pelo motor de retenções
@param cFilMR, Filial de origem para cálculo do imposto pelo motor de retenções
@param nBaseMR, Valor base para cálculo do imposto pelo motor de retenções
@param dDataMR, Data para cálculo do imposto pelo motor de retenções
@param cTipoTitMR, Tipo do tíutlo para cálculo do imposto pelo motor de retenções

@author Rodrigo Oliveira
@since 26/03/2018
@version 12
/*/
Static Function F061CalImp( cNatMR As Char, cCliMR As Char, cLojaMR As Char, cFilMR As Char, nBaseMR As Numeric, dDataMR As Date, cTipoTitMR As Char )
	Local nZ As Numeric
	Local cTitPosic As Char
	Local lPisMR As Logical
	Local lCofMR As Logical
	Local lCslMR As Logical
	Local lPisBxMR As Logical
	Local lCofBxMR As Logical
	Local lCslBxMR As Logical
	Local lRaRtPis As Logical
	Local lRaRtCof As Logical
	Local lRaRtCsl As Logical

	Default cNatMR := ""
	Default cCliMR := ""
	Default cLojaMR := ""
	Default cFilMR := ""
	Default nBaseMR := 0
	Default dDataMR	:= CtoD("//")
	Default cTipoTitMR := ""

	cTitPosic := FWxFilial( "SE1", SE1->E1_FILORIG ) + "|" + SE1->E1_PREFIXO + "|" + SE1->E1_NUM + "|" + SE1->E1_PARCELA + "|" + SE1->E1_TIPO + "|" + SE1->E1_CLIENTE + "|" + SE1->E1_LOJA

	nPis 		:= 0
	nCofins 	:= 0
	nCsll 		:= 0
	nIrrf 		:= 0
	__nImpMT 	:= 0
	lPisMR 	:= .F.
	lCofMR 	:= .F.
	lCslMR 	:= .F.
	lPisBxMR 	:= .F.
	lCofBxMR 	:= .F.
	lCslBxMR 	:= .F.
	lRaRtPis 	:= .F.
	lRaRtCof 	:= .F.
	lRaRtCsl 	:= .F.

	/*-------------------------------------------
	Estrutura da aImpos
	[1] = Codigo do tipo de imposto (FKM_CODIGO)
	[2] = Base do imposto
	[3] = Valor calculado do imposto
	[4] = Base de retenção do imposto
	[5] = Valor a reter do imposto
	[6] = IDRET FK4
	[7] = Array contendo os Recnos FK3 das pendências de retenção
	[8] = Tipo do Imposto (SX5 - 0C )
	[9] = Fato gerador ( 1=Competência; 2=Caixa )
	[10] = Natureza do imposto
	[11] = Tabela onde foi gerado o imposto
	[12] = Recno do titulo de imposto gerado
	[13] = Ação aplicada no valor da nota na emissão(1 = subtrai, 2 = soma, 3 = sem ação)
	[14] = Carteira de movimento na emissão (1 = Pagar, 2 = Receber)
	[15] = Tipo de movimento na emissão (1 = Abtimento, 2 = Provisão, 3 = Retenção, 4 = Não Gerar)
	[16] = Ação aplicada no valor da nota na baixa(1 = subtrai, 2 = soma, 3 = sem ação)
	[17] = Carteira de movimento na baixa (1 = Pagar, 2 = Receber)
	[18] = Tipo de movimento na baixa (1 = Abtimento, 2 = Provisão, 3 = Retenção, 4 = Não Gerar)
	[19] = Ação sobre títulos de antecipação pagamento/recebimento: 1 = Retém, 2 = Provisiona, 3 = sem ação
	--------------------------------------------*/
	__aImpos := FINCalImp( "2", cNatMR, cCliMR, cLojaMR, cFilMR, nBaseMR, dDataMR, .T., {}, cTipoTitMR,cTitPosic,Nil, {} )

	For nZ := 1 To Len( __aImpos )
		Do Case
			Case __aImpos[nZ,8] == "PIS"
				nPis	+= __aImpos[nZ,5]
				nPisCalc	:= nPis
				lPisMR 	:= .T.
				lPisBxMR 	:= (__aImpos[nZ,9] == "2")
				lRaRtPis 	:= .T.
			Case __aImpos[nZ,8] == "COF"
				nCofins += __aImpos[nZ,5]
				nCofCalc	:= nCofins
				lCofMR 	:= .T.
				lCofBxMR 	:= (__aImpos[nZ,9] == "2")
				lRaRtCof 	:= .T.
			Case __aImpos[nZ,8] == "CSL"
				nCsll	+= __aImpos[nZ,5]
				nCslCalc	:= nCsll
				lCslMR 	:= .T.
				lCslBxMR 	:= (__aImpos[nZ,9] == "2")
				lRaRtCsl	:= .T.
			Case __aImpos[nZ,8] == "IRF"
				nIrrf	+= __aImpos[nZ,5]
				__lIrfMR	:= .T.
				__lIrfBxMR := (__aImpos[nZ,9] == "2")
				__lRaRtIrf := .T.
			OtherWise
				__nImpMT	+= __aImpos[nZ,5]
				__lImpBxMT	:= (__aImpos[nZ,9] == "2")
				__lRaRtMT	:= .T.
		EndCase
	Next nZ

	__lPccMR := lPisMR .Or. lCofMR .Or. lCslMR
	__lPccBxMR := lPisBxMR .Or. lCofBxMR .Or. lCslBxMR

	__nTotImp := nPis + nCofins + nCsll + nIrrf + __nImpMT

Return __aImpos

/*/{Protheus.doc} LimpaVarMR()
Função para limpar as variáveis estáticas utilizadas para o motor de retenções

@author Rodrigo Oliveira
@since 26/03/2018
@version 12
/*/
Static Function LimpaVarMR()

	//Limpa as variáveis de configuração
	__lPccMR := .F.
	__lPccBxMR := .F.
	__lIrfMR := .F.
	__lIrfBxMR := .F.
	__lRaRtIrf := .F.

	//Limpa as variáveis de cálculo
	__nPisCaMR := 0
	__nCofCaMR := 0
	__nCslCaMR := 0
	__nIrfCaMR := 0

	aSize ( __aImpos, 0 )
	__aImpos := {}

	__lMotRet := .F.

Return Nil

//-------------------------------------------------------------------
/*/{Protheus.doc}F061GrvIMT
Função para cálculo e gravação dos impostos retidos via motor

@author Ana Paula Nascimento


@since  23/10/2018
@version 12
/*/
//-------------------------------------------------------------------
Function F061GrvIMT(aMotRet As Array,cNumBor As Character,cSituacao As Character,nTot590 As Numeric)
	Local nX 			As Numeric
	Local nRetMotor 	As Numeric
	Local nTxMoeda		As Numeric
	Local aImpMRT		As Array
	Local cOrigem		As Character
	Local cCampos 		As Character
	Local cChaveTit 	As Character
	Local cChaveFK7 	As Character
	Local nMoedaBco 	As Character
	Local cSequencia 	As Character
	Local lRet			As Logical
	Local lFina590 		As Logical
	Local lFina891 		As Logical

	Default aMotRet := {}
	Default cNumBor := ""
	Default cSituacao := ""
	Default nTot590 := 0

	nX			:= 0
	cOrigem 	:= FunName()
	nRetMotor 	:= 0
	aImpMRT 	:= {}
	cCampos	:= ""
	nMoedaBco 	:= "01"
	lRet		:= .T.
	lFina590	:= FwIsInCallStack("FINA590")
	lFina891	:= Alltrim(FunName()) $ "FINA890"
	cOrigem 	:= Iif(!lFina590,FunName(),"FINA590")


	If Len(aMotRet) > 0

		cSequencia 	:= FaNxtSeqBx("SE1")  // Sequencia da baixa do adiantamento + 1

		dBaixa		:=	CriaVar("E1_BAIXA")
		nTxMoeda 	:=	If(SE1->E1_MOEDA > 1, If(SE1->E1_TXMOEDA > 0, SE1->E1_TXMOEDA,RecMoeda(dBaixa,SE1->E1_MOEDA)),0)
		//Dados da tabela auxiliar com o código do título a pagar
		cChaveTit := xFilial("SE1") + "|" +  SE1->E1_PREFIXO + "|" + SE1->E1_NUM    + "|" + SE1->E1_PARCELA + "|" + SE1->E1_TIPO    + "|" + SE1->E1_CLIENTE+ "|" + SE1->E1_LOJA
		cChaveFK7 := FINGRVFK7( "SE1", cChaveTit )

		cCamposE5 := ""

		//---------------------------------------------------------------
		//Ativa o modelo de Baixas a RECEBER
		//---------------------------------------------------------------
		//Define os campos que não existem nas FKs e que serão gravados apenas na E5, para que a gravação da E5 continue igual
		If !Empty(cCamposE5)
			cCamposE5 += "|"
		Endif
		cCamposE5 := "{"
		cCamposE5 += " {'E5_DTDIGIT' , dDataBase}"
		cCamposE5 += ",{'E5_PREFIXO' , SE1->E1_PREFIXO}"
		cCamposE5 += ",{'E5_NUMERO'  , SE1->E1_NUM}"
		cCamposE5 += ",{'E5_PARCELA' , SE1->E1_PARCELA}"
		cCamposE5 += ",{'E5_CLIFOR'  , SE1->E1_CLIENTE}"
		cCamposE5 += ",{'E5_CLIENTE' , SE1->E1_CLIENTE}"
		cCamposE5 += ",{'E5_BENEF'   , SE1->E1_NOMCLI}"
		cCamposE5 += ",{'E5_LOJA'    , SE1->E1_LOJA}"
		cCamposE5 += ",{'E5_TIPO'    , SE1->E1_TIPO}"
		cCamposE5 += ",{'E5_DTDISPO' , dDatabase}"
		cCamposE5 += "}"

		oModelBx := FWLoadModel("FINM010") //Model de baixas de titulo a Receber
		oModelBx:SetOperation( MODEL_OPERATION_INSERT ) //Inclusao
		oModelBx:Activate()
		oModelBx:SetValue( "MASTER", "E5_GRV", .T. ) //Informa se vai gravar SE5 ou não
		oModelBx:SetValue( "MASTER", "E5_CAMPOS", cCamposE5 ) //Informa os campos da SE5 que serão gravados indepentes de FK5
		If lFina891
			oModelBx:SetValue( "MASTER", "HISTMOV", "FINA891-Ger.Imp.-PIX")
		Else
			oModelBx:SetValue( "MASTER", "HISTMOV", "FINA061-Ger.Imp.-Bordero")
		EndIf
		oModelBx:SetValue( "MASTER", "NOVOPROC", .T. ) //Informa que a inclusão será feita com um novo número de processo

		cIdFK1 := FWUUIDV4()

		//Dados do Processo - Define a chave da FK5 no IDORIG
		oSubFKA := oModelBx:GetModel("FKADETAIL")

		oSubFKA:SetValue( "FKA_IDORIG", cIdFK1 )
		oSubFKA:SetValue( "FKA_TABORI", "FK1" )

		oSubFK1 := oModelBx:GetModel("FK1DETAIL")
		oSubFK4 := oModelBx:GetModel("FK4DETAIL")
		oSubFK3 := oModelBx:GetModel("FK3DETAIL")

		//Dados da baixa a pagar
		oSubFK1:SetValue( "FK1_IDDOC" , cChaveFK7 )
		oSubFK1:SetValue( "FK1_IDFK1" , cIdFK1 )
		oSubFK1:SetValue( "FK1_DATA"  , dDatabase )
		oSubFK1:SetValue( "FK1_NATURE", SE1->E1_NATUREZ )
		oSubFK1:SetValue( "FK1_RECPAG", "R" )
		oSubFK1:SetValue( "FK1_TPDOC" , "BA")
		oSubFK1:SetValue( "FK1_MOTBX" , "IMR")
		oSubFK1:SetValue( "FK1_ORIGEM", FunName() )
		oSubFK1:SetValue( "FK1_SEQ"   , cSequencia )
		oSubFK1:SetValue( "FK1_CCUSTO", SE1->E1_CCUSTO)
		oSubFK1:SetValue( "FK1_DOC"   , cNumBor )
		oSubFK1:SetValue( "FK1_VALOR" , Iif(lFina590 .or. lFina891, nTot590, __nTotImp))
		oSubFK1:SetValue( "FK1_VLMOE2", Iif(lFina590 .or. lFina891, nTot590, __nTotImp))
		oSubFK1:SetValue( "FK1_MOEDA" , nMoedaBco)
		oSubFK1:SetValue( "FK1_TXMOED", nTxMoeda)
		oSubFK1:SetValue( "FK1_FILORI", SE1->E1_FILORIG)
		If lFina891
			oSubFK1:SetValue( "FK1_HISTOR", "FINA891-Ger.Imp.-PIX")
		Else
			oSubFK1:SetValue( "FK1_HISTOR", "FINA061-Ger.Imp.-Bordero")
		EndIf

		For nX := 1 to Len(aMotRet)

			aadd(aImpMRT,{aMotRet[nX,8],aMotRet[nX,3] ,aMotRet[nX,10],"", aMotRet[nX,5], aMotRet[nX,2], aMotRet[nX,4], aMotRet[nX,1] })

			//Caso tenha retenção, gravo uma baixa por imposto.
			If aMotRet[nX,5] > 0 .And. aMotRet[nX,9] == "2"

				If aImpMRT[nX,2] > 0
					cIdFk3 := GetSx8Num('FK3', 'FK3_IDFK3')
					ConfirmSx8()


					If aImpMRT[nX][5] > 0
						cIdFK4:= GetSx8Num('FK4', 'FK4_IDFK4')
						ConfirmSx8()
						aImpMRT[nX,4] := cIdFK4
						aMotRet[nX,6] := cIdFK4
		       	Endif

					If !oSubFK3:IsEmpty()
						//Inclui a quantidade de linhas necessárias
						oSubFK3:AddLine()

						//Vai para linha criada
						oSubFK3:GoLine( oSubFK3:Length() )
					Endif

					//---------------------------------------------
					// Grava Imposto Calculado
					//---------------------------------------------
					oSubFK3:SetValue( "FK3_IDFK3" , cIdFK3				)
					oSubFK3:SetValue( "FK3_DATA"  , dDataBase			)
					oSubFK3:SetValue( "FK3_ORIGEM", cOrigem			)
					oSubFK3:SetValue( "FK3_IMPOS" , aImpMRT[nX][1]	)
					oSubFK3:SetValue( "FK3_RECPAG", "R"				)
					oSubFK3:SetValue( "FK3_MOEDA" , "01"				)
					oSubFK3:SetValue( "FK3_VALOR" , aImpMRT[nX][2]	)
					oSubFK3:LoadValue( "FK3_NATURE", aImpMRT[nX][3]	)
					oSubFK3:SetValue( "FK3_FILORI", SE1->E1_FILORIG 	)
					oSubFK3:SetValue( "FK3_BASIMP", aImpMRT[nX][6]	)
					oSubFK3:SetValue( "FK3_IDORIG", cIdFK1				)
					oSubFK3:SetValue( "FK3_TABORI", "FK1"				)
		          	oSubFK3:SetValue( "FK3_IDRET" , aImpMRT[nX,4]		)
		        	oSubFK3:SetValue( "FK3_CODFKM", aImpMRT[nX,8] 	)
		        	oSubFK3:SetValue( "FK3_CLIFOR", SA1->A1_COD 		)
		        	oSubFK3:SetValue( "FK3_LOJA"  , SA1->A1_LOJA 		)
		        	oSubFK3:SetValue( "FK3_CGC"   , SA1->A1_CGC 		)
		        	oSubFK3:SetValue( "FK3_RAICGC", Substr(SA1->A1_CGC, 1, 8) )
		       Endif
					//---------------------------------------------
					// Grava Imposto Retido
					//---------------------------------------------
					If aImpMRT[nX][5] > 0   //Houve retencao
						If !oSubFK4:IsEmpty()
							//Inclui a quantidade de linhas necessárias
							oSubFK4:AddLine()

							//Vai para linha criada
							oSubFK4:GoLine( oSubFK4:Length() )
						Endif

						oSubFK4:SetValue( "FK4_IDFK4" , aImpMRT[nx,4]		)
						oSubFK4:SetValue( "FK4_DATA"  , dDataBase			)
						oSubFK4:SetValue( "FK4_ORIGEM", cOrigem			)
						oSubFK4:SetValue( "FK4_IMPOS" , aImpMRT[nx,1]		)
						oSubFK4:SetValue( "FK4_RECPAG", "R"				)
						oSubFK4:SetValue( "FK4_MOEDA" , "01"				)
						oSubFK4:SetValue( "FK4_VALOR" , aImpMRT[nX,5]		)
						oSubFK4:LoadValue( "FK4_NATURE", aImpMRT[nX,3]		)
						oSubFK4:SetValue( "FK4_FILORI", SE1->E1_FILORIG 	)
						oSubFK4:SetValue( "FK4_BASIMP", aImpMRT[nX][7]	)
						oSubFK4:SetValue( "FK4_CODFKM", aImpMRT[nX,8] 	)
						oSubFK4:SetValue( "FK4_CLIFOR", SA1->A1_COD 		)
						oSubFK4:SetValue( "FK4_LOJA"  , SA1->A1_LOJA 		)
						oSubFK4:SetValue( "FK4_CGC"   , SA1->A1_CGC 		)
						oSubFK4:SetValue( "FK4_RAICGC", Substr(SA1->A1_CGC, 1, 8) )
						// Atualizacao de retencao da FK3 - Cumulatividade
						If __lMotRet .And. Len(aMotRet[nX,7]) > 0 .And. aMotRet[nX,7,1] > 0
							FK3->(DbGoTo(aMotRet[nX,7,1]))
							RecLock("FK3")
							FK3->FK3_IDRET := aMotRet[nX,6]
							FK3->(MsUnlock())
						EndIf
					Endif
			ElseIf aMotRet[nX,3] > 0 .And. aMotRet[nX,9] == "2"		//teve calculo mas não retenção

					aImpMRT := {}

					//Dados da tabela auxiliar com o código do título a pagar
					cChaveTit := xFilial("SE1") + "|" +  SE1->E1_PREFIXO + "|" + SE1->E1_NUM    + "|" + SE1->E1_PARCELA + "|" + ;
					             SE1->E1_TIPO    + "|" + SE1->E1_CLIENTE+ "|" + SE1->E1_LOJA
					cChaveFK7 := FINGRVFK7( "SE1", cChaveTit )

					aadd(aImpMRT, {	aMotRet[nX,8],  ;	//[1] = Tipo do Imposto (FOO)
									aMotRet[nX,3],  ;	//[2] = Valor calculado do imposto
									aMotRet[nX,10], ;	//[3] = Natureza do imposto
									aMotRet[nX,6],  ;	//[4] = IDRET FK4
									aMotRet[nX,5],  ;	//[5] = Valor a reter do imposto
									aMotRet[nX,2],  ;	//[6] = Base do imposto
									aMotRet[nX,4],  ;	//[7] = Base de retenção do imposto
									aMotRet[nX,1],  ;	//[8] = Codigo do tipo de imposto (FKM_CODIGO)
									SA1->A1_COD ,  ;	//[9] = Código do Fornecedor
									SA1->A1_LOJA,  ;	//[10] = Loja do Fornecedor
									SA1->A1_CGC    } )	//[11] = CNPJ do Fornecedor

					FNGFK3BCR(1,"FK7",cChaveFK7,aImpMRT,cNumBor,.T.)

					aImpMRT := {}
			EndIf
		Next

		If oModelBx:VldData()
		    oModelBx:CommitData()
			SE5->(dbGoto(oModelBx:GetValue( "MASTER", "E5_RECNO" )))
			oModelBx:DeActivate()
		Else
			lRet := .F.
		    cLog := cValToChar(oModelBx:GetErrorMessage()[4]) + ' - '
		    cLog += cValToChar(oModelBx:GetErrorMessage()[5]) + ' - '
		    cLog += cValToChar(oModelBx:GetErrorMessage()[6])

		    Help( ,,"F061PCCBOR",,cLog, 1, 0 )
		Endif
	EndIf

	If __nTotImp > 0 .Or. nTot590 > 0

  		Reclock("SE1",.F.)
  		If __nTotImp > 0 .And. !lFina590 .And. nTot590 == 0
			SE1->E1_SALDO 	:= SE1->E1_SALDO - __nTotImp
			SE1->E1_VALLIQ	:= SE1->E1_VALLIQ + __nTotImp
		ElseIf (lFina590 .or. lFina891) .And. nTot590 > 0 .And. __nTotImp == 0
			SE1->E1_SALDO 	:= SE1->E1_SALDO - nTot590
			SE1->E1_VALLIQ	:= SE1->E1_VALLIQ + nTot590
		Endif
		SE1->E1_SITUACA	:=	cSituacao
		MsUnlock()

 	// Gravacao das retencoes - Motor de Retencoes
 		FinSetAPrc("FK1")
 		FinGrvImp("2" , SE1->(Recno()), aMotRet, If( lFina891,"FINA890", If(!lFina590,"FINA061","FINA590") ), .F., {}, {}, .T., .F., .T., dBaixa, "FK1",,.T.)
 		FinSetAPrc("")
	EndIf

Return

/*/{Protheus.doc} F061CtbOff()
Função para validar se o fonte esta atualizado para garantir o funcionamento da contabilização off-line das transferências.

@version    12.1.23/12.1.25/12.1.27
@author     Rafael Riego
@since      12/06/2020
/*/
Function F061CtbOff()
Return .T.

/*/{Protheus.doc} BorApiVld
    Validação para habilitar o checkbox para registro online de boletos
    @type  Static Function
    @author renato.ito
    @since 14/04/2021
    @version 12.1.33
    @param cPort060, Character, banco
    @param cAgen060, Character, agencia
    @param cConta060, Character, conta
    @param lWhenApi, Logical, variável pra habilitar o checkbox
    @param lBolApi, Logical, variável pra marcar o checkbox
    @param cBcoAgCnt, Character, controle do último banco testado para não acionar ao passar pelo campo
    @param cSubCta060, Character, Sub Conta
    @param cEspec060, Character, Espécie do Boleto
    @param cBcoOfi060, Character, Código Banco Febraban
    @return Logical, true
/*/
Static Function BorApiVld(cPort060 As Character, cAgen060 As Character, cConta060 As Character, lWhenApi As Logical, lBolApi As Logical, cBcoAgCnt As Character, cSubCta060 As Character, cEspec060 As Character, cBcoOfi060 As Character) As Logical

    If _lBCOApi
        If cBcoAgCnt <> (cPort060 + cAgen060 + cConta060)
            cBcoAgCnt := cPort060 + cAgen060 + cConta060
			lBolApi := lWhenApi := F713VldBco(FwXfilial("SA6"), cPort060, cAgen060, cConta060, @cBcoOfi060, @_lVlBcoApi)
            // zerando variáveis
            If (!lBolApi .AND. Type("oSayF77") == "O")
                cSubCta060       := Criavar("EA_SUBCTA" , .F.)
                cEspec060        := Criavar("EA_ESPECIE", .F.)
                oSayF77:cCaption := Criavar("F77_DESCRI", .F.)
            EndIf
        EndIf
    EndIf
	
Return .T.

/*/{Protheus.doc} SubCApiVld
    Validação da Sub Conta

    @type  Static Function
    @author alison.kaique
    @since 11/05/2021
    @version 12.1.33

    @param cPort060  , character, Código do Portador
    @param cAgen060  , character, Número da Agência
    @param cConta060 , character, Número da Conta Bancária
    @param cSubCta060, character, Sub Conta

    @return lRet, logical, controle de processamento
/*/
Static Function SubCApiVld(cPort060 As Character, cAgen060 As Character, cConta060 As Character, cSubCta060 As Character)
    Local lRet As Logical

    lRet := NaoVazio(cSubCta060) .AND. ExistCpo("SEE", cPort060 + cAgen060 + cConta060 + cSubCta060)

	If lRet .And. FindFunction("VldBanB001")
        lRet := VldBanB001(cPort060, cAgen060, cConta060, cSubCta060)
    EndIf
	
Return lRet

/*/{Protheus.doc} EspeApiVld
    Validação da Espécie do Boleto Registrado

    @type  Static Function
    @author alison.kaique
    @since 11/05/2021
    @version 12.1.33

    @param cBcoOfi060, character, Código Banco Febraban
    @param cEspec060 , character, Espécie do Boleto

    @return lRet, logical, controle de processamento
/*/
Static Function EspeApiVld(cBcoOfi060 As Character, cEspec060 As Character) As Logical
    Local lRet As Logical

    // valida se as variáveis existem
    lRet := Type("oSayF77") == "O"

    // valida se registro existe
    If (lRet .AND. NaoVazio(cEspec060) .AND. ExistCpo("F77", cBcoOfi060 + cEspec060))
        // atualiza descrição
        oSayF77:cCaption := AllTrim(Posicione('F77', 01, FWxFilial('F77') + cBcoOfi060 + cEspec060, 'F77_DESCRI'))
    Else
        lRet := .F.
    EndIf
Return lRet

/*/{Protheus.doc} BolApiVld
    Validação do CheckBox de Registro de Boleto

    @type  Static Function
    @author alison.kaique
    @since 11/05/2021
    @version 12.1.33

    @param lBolApi   , logical  , Registra o Boleto?
    @param cSubCta060, character, SubConta
    @param cEspec060 , character, Espécie do Boleto

    @return lRet, logical, controle de processamento
/*/
Static Function BolApiVld(lBolApi As Logical, cSubCta060 As Character, cEspec060 As Character) As Logical
    Local lRet As Logical

    lRet := .T.

    // zerando variáveis
    If (!lBolApi .AND. Type("oSayF77") == "O")
        cSubCta060       := Criavar("EA_SUBCTA" , .F.)
        cEspec060        := Criavar("EA_ESPECIE", .F.)
        oSayF77:cCaption := Criavar("F77_DESCRI", .F.)
    EndIf
Return lRet

/*/{Protheus.doc} F061BolPix
	Retorna se o banco esta configurado para Boleto + PIX
	@type  Function
	@author Vitor Duca
	@since 26/01/2023
	@version 1.0
	@param cFilOrig, Character, FILORIG para ser considerada no xFilial do cadastro de bancos
	@param cBanco, Character, Codigo do banco
	@param cAgencia, Character, Agencia do banco 
	@param cConta, Character, Numero da conta do banco
	@return lRet, Logical, Define se o banco esta configurado para boleto + PIX
/*/
Function F061BolPix(cFilOrig As Character, cBanco As Character, cAgencia As Character, cConta As Character) As Logical
	Local lRet     As Logical
	Local jCfgBol  As Json
	Local aAreaSA6 As Array
	
	//Parâmetros de entrada.
	Default cFilOrig := cFilAnt
	Default cBanco   := ""
	Default cAgencia := ""
	Default cConta   := ""
	
	//Inicializa variáveis
	lRet     := .F.
	aAreaSA6 := FwGetArea()
	
	SA6->(DbSetOrder(1))	
	
	If SA6->(DbSeek(FWxFilial("SA6", cFilOrig)+(cBanco+cAgencia+cConta))) .And. !Empty(SA6->A6_CFGBOL)		
		jCfgBol := JsonObject():new()
		
		If jCfgBol:FromJson(SA6->A6_CFGBOL) == Nil
			lRet := (jCfgBol["layout"]:hasProperty("indicadorPix") .And. jCfgBol["layout"]["indicadorPix"] == 1)
		EndIf	
	EndIf
	
	FwRestArea(aAreaSA6)
Return lRet

/*/{Protheus.doc} brCanUse
	Verifica se a classe BillRelated autoriza o uso da tabela FK7.
	Retorna .T. quando permitido, .F. caso contrário ou em erro.
	@since 27/08/2025
	@version 1.0
/*/
Static Function brCanUse(oBR As Object)
    Local lRet As Logical
	Local lUseClass As Logical
	
	Default oBR := Nil
	
	lRet := .F.
    lUseClass := .F.
   

	If (lUseClass := FindClass('totvs.protheus.backoffice.fin.bills.related.BillRelated'))
		oBR := totvs.protheus.backoffice.fin.bills.related.BillRelated():New()
		If oBR <> Nil
			lRet := oBR:canUseRelatedBill()
		EndIf
	EndIf

Return lRet
