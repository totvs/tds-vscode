#INCLUDE "fwuischedulepersist.ch"
#INCLUDE "protheus.ch"
#INCLUDE "parmtype.ch"
#INCLUDE "fwschedule.ch"
#INCLUDE "fwbrowse.ch"




#DEFINE DESC_PTG '1'
#DEFINE DESC_SPA '2'
#DEFINE DESC_ENG '3'

//-------------------------------------------------------------------
/*/{Protheus.doc} FWUISchedulePersist
Classe de interface para a gravação do schedule

@author Daniel Mendes
@since Sep 28, 2018
@version 1.2
/*/
//-------------------------------------------------------------------
CLASS FWUISchedulePersist FROM LongClassName

	DATA aFields   As Array
	DATA aControls As Array

	DATA nOption     As Numeric
	DATA nDevice     As Numeric
	DATA nTpPlanilha As Numeric

	DATA oBrowse          As Object
	DATA oButtonBar       As Object
	DATA oFWCOSchedule    As Object
	DATA oFWLayer         As Object
	DATA oOwner           As Object
	DATA oPanelBrowse     As Object
	DATA oPanelDetail     As Object
	DATA oFWParam         As Object
	DATA oFWScheduleParam As Object

	DATA lNoEndDate        As Logical
	DATA lButtonOkCancel   As Logical
	DATA lSchedFromTReport As Logical
	DATA lSchedFromAdmin   As Logical

	data lChangeUser as Logical
	data cUserLogin as Character
	data cUserBkp as Character

	METHOD new()

	METHOD ClassName()

	METHOD init()

	METHOD createBrowse()
	METHOD createDetails()

	METHOD hide()

	METHOD refresh()

	METHOD setDateCtrl()
	METHOD setEmpFil()
	METHOD setFunctionCtrl()
	METHOD setModuleCtrl()
	METHOD setPeriodCtrl()
	METHOD setTimeCtrl()
	METHOD setEnv()
	METHOD setNoEndDate()
	METHOD setButtonOkCancel()
	METHOD setDevice()
	METHOD setTpPlanilha()
	METHOD setParams()
	METHOD show()
	METHOD submit()

	METHOD updateSchedules()
	METHOD updateControls()
	method canChangeUser()

ENDCLASS

//-------------------------------------------------------------------
/*/{Protheus.doc} new
Método de instância da classe, inicialização das propriedades

@author Daniel Mendes
@since Mar 03, 2020
@version 1.1
/*/
//-------------------------------------------------------------------
METHOD new() CLASS FWUISchedulePersist

	self:aControls := {}

	self:oButtonBar		:= FWButtonBar():new()
	self:oFWCOSchedule	:= FWCOSchedule():new()
	self:lNoEndDate 		:= .F.
	self:lButtonOkCancel	:= .T.
	self:lSchedFromTReport  := .F.
	self:lSchedFromAdmin    := .F.
	self:lChangeUser := .T.
	self:cUserLogin := ""
	self:cUserBkp := ""

RETURN

//---------------------------------------

METHOD ClassName() CLASS FWUISchedulePersist
RETURN "FWUISchedulePersist"

//-------------------------------------------------------------------
/*/{Protheus.doc} init
Método que inicia o objeto de interface para a persistência do schedule
, criando todos os objetos de interface envolvidos

@param oOwner Componente de janela que será aberto o schedule
@param lJustForm Indica como será a criação dos objetos de interface
@param oFWVOSchedule Objeto de VOSchedule
@param bExecute Bloco de execute para os botões da interface

@author Daniel Mendes
@since Sep 27, 2018
@version P12
/*/
//-------------------------------------------------------------------
METHOD init( oOwner, lJustForm, oFWVOSchedule , bExecute) CLASS FWUISchedulePersist

	PARAMTYPE 0 VAR oOwner			AS OBJECT
	PARAMTYPE 1 VAR lJustForm		AS LOGICAL	OPTIONAL DEFAULT .F.
	PARAMTYPE 2 VAR oFWVOSchedule	AS OBJECT	OPTIONAL
	PARAMTYPE 3 VAR bExecute   		AS BLOCK OPTIONAL

	self:aFields := self:oFWCOSchedule:getFields()

	self:oOwner := oOwner

	If Select( "XX1" ) == 0
		FWOpenXX1()
	EndIf

	// Cria layer do monitor de serviços
	If self:oFWLayer == Nil
		self:oFWLayer := FWLayer():New()
		self:oFWLayer:init( oOwner )

		// Adiciona coluna no layer de serviços
		self:oFWLayer:addCollumn( "Sched", 100, .F. )

		// Cria janelas dos serviços
		If lJustForm
			self:oFWLayer:addWindow( "Sched", "Detail", IIf(Upper(oOwner:ClassName())=="TDIALOG",STR0106,STR0107), 100, .F., .T., {||} ) //"Detalhes"

			self:oPanelDetail := self:oFWLayer:getWinPanel( "Sched", "Detail" )
			self:oPanelDetail:readClientCoors()

			self:createDetail( lJustForm, @oFWVOSchedule , bExecute)
		Else
			self:oFWLayer:addWindow( "Sched", "Browse", STR0091, 060, .F., .F., {||} ) //"Browse"
			self:oFWLayer:addWindow( "Sched", "Detail", STR0001, 040, .T., .F., {||} ) //"Detalhes"

			self:oPanelBrowse := self:oFWLayer:getWinPanel( "Sched", "Browse" )
			self:oPanelBrowse:readClientCoors()
			self:oPanelDetail := self:oFWLayer:getWinPanel( "Sched", "Detail" )
			self:oPanelDetail:readClientCoors()

			self:createDetail()

			self:createBrowse()

		EndIf
	EndIf


RETURN

//---------------------------------------

METHOD createBrowse() CLASS FWUISchedulePersist

	Local aBrowseConfig := {}
	Local aSeek := {{STR0002, STR0003, STR0093, STR0094}, ; //"Nome do Usuário"###"Rotina"
	{{SCHD_ID},{SCHD_USERID}, {SCHD_USERNAME}, {SCHD_FUNCTION}}}

	Local nX := 0

	Local oPanelBrw
	Local oBtnBarBrw    := FWButtonBar():new()

	// Adiciona barra de botões
	oBtnBarBrw:init( self:oPanelBrowse, 018, 015, CONTROL_ALIGN_TOP, .F., .T. )
	oBtnBarBrw:setBackGround( FWGetCSS( "", CSS_BAR_IMG_BG ), 000, 000, .T. )

	oBtnBarBrw:addBtnImage( "import_table", STR0095, ; //"Importar agendamentos antigos"
	{|| MsgRun( STR0096,, {|| FWSchdImport(), self:updateSchedules(.T.), ; //"Importando registros..."
	self:updateControls( VIEW ) } ) } ,, .T., CONTROL_ALIGN_LEFT )
	oBtnBarBrw:addBtnImage( "PMSRRFSH", STR0104, {|| self:updateSchedules(.T.) } ,, .T., CONTROL_ALIGN_LEFT ) //"Atualizar"

	// Painel do Browse
	oPanelBrw  := TPanel():New( 000, 000,, self:oPanelBrowse)
	oPanelBrw:Align := CONTROL_ALIGN_ALLCLIENT

	//-------------------------------------------------
	// Busca informações sobre o browse
	//-------------------------------------------------
	aBrowseConfig := self:oFWCOSchedule:getBrowseConfig()

	aSeek := {{ STR0002, { { "", "C", 6, 0, STR0002, "@!" } }, 1, .T. },; //"Código"
	{ STR0003, { { "", "C", 6, 0, STR0003, "@!" } }, 2, .T. }}//,;
//			  { STR0105, { { "", "C", 6, 0, STR0105, "@!" } }, 3, .T. }}

	DEFINE FWBROWSE self:oBrowse DATA TABLE ALIAS "XX1" CHANGE {|| self:updateControls( VIEW ) } NO LOCATE SEEK ORDER aSeek ;
		FILTERDEFAULT "Alltrim( Upper( XX1_ENV ) ) == '" + Alltrim( Upper(GetEnvServer())) + "'" OF oPanelBrw
	//--------------------------------------------------------
	// Altera a identificaçao do browse, usado para salvar as
	// informaçoes corretas de configuraçao no profile
	//--------------------------------------------------------
	self:oBrowse:SetProfileID("PersXX1")
	//--------------------------------------------------------
	// Desabilita a opção de salvar filtro
	//--------------------------------------------------------
	self:oBrowse:SetDBFFilter()
	self:oBrowse:SetUseFilter()
	//--------------------------------------------------------
	// Adiciona legenda no Browse
	//--------------------------------------------------------
	ADD LEGEND DATA "XX1_STATUS == '"+SCHD_ACTIVE+"'"     COLOR "GREEN"  TITLE STR0024 OF self:oBrowse //"Habilitado"
	ADD LEGEND DATA "XX1_STATUS == '"+SCHD_DEACTIVATE+"'" COLOR "RED"    TITLE STR0025 OF self:oBrowse //"Desabilitado"
	ADD LEGEND DATA "XX1_STATUS == '"+SCHD_FINISHED+"'"   COLOR "GRAY"   TITLE STR0110 OF self:oBrowse //"Finalizado"
	//--------------------------------------------------------
	// Adiciona as colunas do Browse
	//--------------------------------------------------------
	For nX := 1 To Len(aBrowseConfig[1])
		If Empty(aBrowseConfig[5][nX])
			ADD COLUMN oColumn DATA &("{|| "+aBrowseConfig[1][nX]+" }") TITLE aBrowseConfig[2][nX] SIZE aBrowseConfig[3][nX] OF self:oBrowse
		Else
			ADD COLUMN oColumn DATA &("{|| "+aBrowseConfig[5][nX]+" }") TITLE aBrowseConfig[2][nX] SIZE aBrowseConfig[3][nX] OF self:oBrowse
		EndIf
	Next nX
	//--------------------------------------------------------
	// Ativação do Browse
	//--------------------------------------------------------
	ACTIVATE FWBROWSE self:oBrowse

RETURN

//-------------------------------------------------------------------
/*/{Protheus.doc} createDetails
Método que cria os componentes da configuração do schedule

@param lJustForm Indica como será a criação dos objetos de interface
@param oFWVOSchedule Objeto de VOSchedule
@param bExecute Bloco de execute para os botões da interface

@author Framework
@since Feb 16, 2022
@version P12
/*/
//-------------------------------------------------------------------
METHOD createDetails( lJustForm, oFWVOSchedule , bExecute) CLASS FWUISchedulePersist

	Local aParam As Array

	Local bAction As Block

	Local cTitle As Character
	Local cEmpFil As Character
	Local cF3 As Character
	Local cFunction As Character
	Local cModule As Character
	Local cUser As Character

	Local nAscan As Numeric
	Local nX As Numeric
	Local nRow As Numeric
	Local nCol As Numeric
	Local nRowHeight As Numeric
	Local nSpace As Numeric
	Local nMaxWidth As Numeric
	Local nWidthLabel As Numeric
	Local nWidthInput As Numeric
	Local nHeight As Numeric
	Local nWidthPanel As Numeric
	Local nItems As Numeric

	Local lEnableBtnP As Logical
	Local lObPar As Logical
	Local lObRec As Logical
	Local lVirtualField As Logical
	Local lShowOptions As Logical

	Local oEmpFil As Object
	Local oFWFontSize As Object
	Local oParam As Object
	Local oPanel As Object
	Local oScroll As Object

	aParam := {}

	bAction := {|| }

	cTitle := ""
	cEmpFil   := ""
	cF3 := ""
	cFunction := ""
	cModule := ""
	cUser := ""

	nAscan := 0
	nX := 0
	nRow := 0
	nCol := 0
	nRowHeight := 10
	nSpace := 05
	nMaxWidth := 0
	nWidthLabel := 0
	nWidthInput := 0
	nHeight := 0
	nWidthPanel := (self:oPanelDetail:nWidth/2)-18
	nItems := 0

	lObPar := .F.
	lObRec := .F.
	lVirtualField := .F.
	lShowOptions := .F.

	oFWFontSize := FWFontSize():New()

	PARAMTYPE 00 VAR lJustForm		AS LOGICAL OPTIONAL DEFAULT .F.
	PARAMTYPE 01 VAR oFWVOSchedule	AS OBJECT OPTIONAL
	PARAMTYPE 02 VAR bExecute   	AS BLOCK OPTIONAL

	// Adiciona barra de botões
	self:oButtonBar:init( self:oPanelDetail, 018, 015, CONTROL_ALIGN_TOP, .F., .T. )
	self:oButtonBar:setBackGround( FWGetCSS( "", CSS_BAR_IMG_BG ), 000, 000, .T. )

	If !lJustForm
		self:oButtonBar:addBtnImage( "AddContainer"	, STR0007, {|| self:updateControls( INSERT ) },, .T., CONTROL_ALIGN_LEFT ) //"Incluir"
		self:oButtonBar:addBtnImage( "altera"		, STR0008, {|| self:updateControls( UPDATE ) },, .T., CONTROL_ALIGN_LEFT ) //"Alterar"
		self:oButtonBar:addBtnImage( "excluir"		, STR0009, {|| self:updateControls( DELETE ) },, .T., CONTROL_ALIGN_LEFT ) //"Excluir"
	EndIf
	self:oButtonBar:addBtnImage( "recorrente"	, STR0010, {|| self:aControls[SCHD_PERIOD][2] := FWSchdRecurrence( self:aControls[SCHD_DATE][2], ; //"Recorrência"
	self:aControls[SCHD_TIME][2], self:aControls[SCHD_PERIOD][2], self:nOption, self:lNoEndDate ) },, ;
		.T., CONTROL_ALIGN_LEFT ) //"Recorrência"
	If ::lButtonOkCancel
		self:oButtonBar:addBtnImage( "Ok"			, STR0011, {|| IIf(bExecute==Nil,Nil,Eval(bExecute,.T.)),self:submit( lJustForm, @oFWVOSchedule ) },, .T., CONTROL_ALIGN_LEFT ) //"Confirmar"
		self:oButtonBar:addBtnImage( "Cancel"		, STR0012, {|| IIf(bExecute==Nil,If( lJustForm, self:oOwner:End(), self:updateControls( VIEW ) ),Eval(bExecute,.F.)) },, ; //"Cancelar"
		.T., CONTROL_ALIGN_LEFT ) //"Cancelar"
	EndIf

	nRow := nSpace
	nCol := nSpace
	nHeight := 10

	// Criação do Scroll
	oScroll:= TScrollArea():New(self:oPanelDetail,000,000,000,000)
	oScroll:Align := CONTROL_ALIGN_ALLCLIENT

	// Painel do fundo
	@ 000,000 MSPANEL oPanel OF oScroll SIZE nWidthPanel, 000
	oPanel:Align := CONTROL_ALIGN_ALLCLIENT
	oScroll:SetFrame(oPanel)
	// Inicializa altura do painel
	oPanel:nHeight := (self:oPanelDetail:nHeight/2) //-(nRow + nRowHeight*2 + nSpace)

	For nX := 1 To Len( self:aFields )

//		oFWFontSize:getTextHeight( cText, cFontName, nSize, lBold, lItalic, lUnderline )

		nWidthLabel := FWCalcFieldSize( "C", Len(self:aFields[nX][2]), 0, "", self:aFields[nX][2] )

		nWidthInput := FWCalcFieldSize( 	self:aFields[nX][3], self:aFields[nX][4], ;
			self:aFields[nX][5], self:aFields[nX][6], ;
			"" )

		nWidthInput := If( nWidthInput > 150, 150, nWidthInput )

		If nCol+nMaxWidth > nWidthPanel .OR. nItems > 3
			nCol := nSpace
			nRow += nRowHeight*2 + nSpace
			nItems := 0
			oPanel:nHeight += (nRowHeight*2 + nSpace)*2
		EndIf

		bWhen   := {|| .T. }

		If Upper( self:aFields[nX][1] ) $ "XX1_USERID|XX1_EMPFIL|XX1_ROTINA|XX1_MODULO"

			aAdd( self:aControls, { Nil, Nil, Nil, self:aFields[nX][7] } )

			self:aControls[Len(self:aControls)][2] := ""

			cTitle := self:aFields[nX][2]

			// Recalcula tamanho dos gets
			nWidthLabel := FWCalcFieldSize( "C", Len(cTitle), 0, "", cTitle )

			nWidthInput := FWCalcFieldSize( 	self:aFields[nX][3], self:aFields[nX][4], ;
				self:aFields[nX][5], self:aFields[nX][6], "" )

			nWidthInput := If( nWidthInput > 150, 150, nWidthInput )

			Do Case
			Case Upper( self:aFields[nX][1] ) == "XX1_USERID"
				bAction := Nil
				bValid  := {|| If( !Empty(self:aControls[SCHD_USERID][2]), ( cUserName := FWUserName( self:aControls[SCHD_USERID][2] ), ;
					If( Empty(cUserName), ( MsgAlert(STR0097, STR0016), .F. ), ; //"Usuário não cadastrado."###"Atenção"
					( self:aControls[SCHD_USERNAME][2] := cUserName, self:aControls[SCHD_USERNAME][1]:refresh(), .T. ) ) ), .T. ), ;
						self:aControls[SCHD_EMPFIL][2] := "", self:aControls[SCHD_MODULE][2] := "  ", self:aControls[SCHD_MODNAME][2] := "" }
					bWhen   := {|| If(!Empty(self:cUserBkp), FwCleanParam(@self:cUserBkp, @self:aControls), self:cUserBkp := self:aControls[SCHD_USERID][2]) }
					cF3 := "USR"
					nWidthInput += 10
				Case Upper( self:aFields[nX][1] ) == "XX1_EMPFIL"
					bAction := Nil
					bAction := {|cLastUser, lMultiChk| cLastUser := __cUserID, __cUserID := self:aControls[SCHD_USERID][2], ;
						If(AllTrim(self:aControls[SCHD_FUNCTION][2]) == "POSUPDATESERVICE", If(FindFunction("FwPosLight") .AND. FwPosLight(),lMultiChk:=.F.,lMultiChk:=.T.), lMultiChk := .T. ), ;
							If( AllTrim(self:aControls[SCHD_FUNCTION][2]) + '/' $ "FWEAI/FWEAISEND/FWEAIRECE/FWEAICLEAR/FWSGDP/", ;
								cEmpFil := FWF3SM0_1( FWEmpLoad(),, .T., self:aControls[SCHD_EMPFIL][2], self:nOption == VIEW ), ;
								If (lMultiChk, cEmpFil:=SchF3SM0_3(),cEmpFil:=SCHF3SM0_2( FWEmpLoad(),, self:aControls[SCHD_EMPFIL][2], self:nOption == VIEW, lMultiChk ))              ),;
									If( ( self:nOption == INSERT .or. self:nOption == UPDATE ) .And. !Empty(cEmpFil), ;
										( self:aControls[SCHD_EMPFIL][2] := cEmpFil, self:aControls[SCHD_EMPFIL][1]:refresh() ), ), ;
										__cUserID := cLastUser }
									bValid  := {|| }
									bWhen   := {|| .T. }
									cF3 := ""
								Case Upper( self:aFields[nX][1] ) == "XX1_ROTINA"
									bAction := {|| If( !lJustForm .AND. self:nOption == INSERT,( cFunction := FWSearchFunc(@lEnableBtnP), ;
										If(!Empty(cFunction), (self:aControls[SCHD_FUNCTION][2] := cFunction, ;
											self:aControls[SCHD_FUNCTION][1]:refresh(), ), ) ),) }
										bValid  := {||	self:aControls[SCHD_EMPFIL][2] := "", ;
											self:aControls[SCHD_EMPFIL][1]:refresh(), ;
											FWVldRotina( self, @aParam, @oParam, @lEnableBtnP ) }
										cF3 := ""
									Case Upper( self:aFields[nX][1] ) == "XX1_MODULO"
										bAction := {|cLastUser| cLastUser := __cUserID, __cUserID := self:aControls[SCHD_USERID][2], ;
											iIf(!(self:aControls[SCHD_FUNCTION][2] + '/' $ "FWEAI/FWEAISEND/FWEAIRECE/FWEAICLEAR/") .AND. (self:nOption == INSERT  .OR. self:nOption == UPDATE), ;
											( cModule := FWF3Modulo( self:aControls[SCHD_MODULE][2] ), ;
											iIf(!Empty(cModule), ( self:aControls[SCHD_MODULE][2] := cModule, ;
											self:aControls[SCHD_MODULE][1]:refresh(), cModule := FWModName( self:aControls[SCHD_MODULE][2] ), ;
											self:aControls[SCHD_MODNAME][2] := cModule, self:aControls[SCHD_MODNAME][1]:refresh() ),) ),), ;
											__cUserID := cLastUser }
										bValid  := {|| iIf( !Empty(self:aControls[SCHD_MODULE][2]), ( cModule := FWModName( self:aControls[SCHD_MODULE][2] ), ;
											iIf( Empty(cModule), ( MsgAlert(STR0099, STR0016), .F. ), ; //"Módulo não permitido ou não cadastrado."###"Atenção"
										( self:aControls[SCHD_MODNAME][2] := cModule, self:aControls[SCHD_MODNAME][1]:refresh(), .T. ) ) ), .T. ) }
										cF3 := ""
									EndCase

									If ( self:aFields[nX][7] )
										cTitle += "*"
									EndIf

									TSay():New( nRow, nCol, &("{|| '"+cTitle+"' }"), oPanel,,,,,, .T.,RGB(000,074,119),, nWidthLabel, 010,,,,,, )

									self:aControls[Len(self:aControls)][2] += Space( self:aFields[nX][4] )

									self:aControls[Len(self:aControls)][1] := TGet():New( nRow+nRowHeight, nCol, ;
										&("{|U| If( pCount() == 0, self:aControls[" +Str(Len(self:aControls))+ "][2], "+ ;
										"self:aControls[" +Str(Len(self:aControls))+ "][2]:=U )} "), oPanel, ;
										nWidthInput,nRowHeight, self:aFields[nX][6], bValid,,,,,, ;
										.T.,,, bWhen,,, /*[\{|nKey, nFlags, Self| <uChange>\}]*/,,, cF3,,,,, .T. )
									// Seta help de campo
									self:aControls[Len(self:aControls)][1]:cSX1HLP := self:aFields[nX][1]
									If !Empty(bAction)
										self:aControls[Len(self:aControls)][1]:bF3 := &( GetCBSource( bAction ) )
									EndIf
									self:aControls[Len(self:aControls)][1]:lHasButton := .T.
									self:aControls[Len(self:aControls)][3] := self:aFields[nX][4]

									nWidthInput += 3

									// Complemento dos componentes que precisam de campo virtual que
									// contenha a descrição ou botoes para disparo de outras funções
									Do Case
									Case Upper( self:aFields[nX][1] ) == "XX1_ROTINA" // .AND. !lJustForm
										lShowOptions := self:lSchedFromTReport .Or. self:lSchedFromAdmin
										If !self:lSchedFromTReport
											oParam := TButton():New( nRow+nRowHeight+1, nCol+nWidthInput, STR0014, oPanel, ; //"Parâmetros"
											{|| If( Empty(self:aControls[SCHD_USERID][2]), (MsgAlert(STR0119, STR0120), .F.),self:aControls[SCHD_PARAM][2] := FWUISchdParam(self:aControls[SCHD_PARAM][2], ; //"Preencha o usuário do agendamento" //"Usuário vazio"
											FwgetSourceString( aParam , self:aControls[SCHD_FUNCTION][2]), self:nOption == UPDATE, self:nOption == INSERT,,,fwgetStringDevice(self:aControls[SCHD_PARAM][2], self:nDevice, self:nTpPlanilha),, self:aControls[SCHD_FUNCTION][2],,,lShowOptions)) }, 050, 010,,,, .T.,,,, ; //"Parâmetros"
											{||/*!Empty(self:aControls[SCHD_PARAM][2]) .Or. lEnableBtnP*/}, /*<{uValid}>*/, )
											nWidthInput += 050/2+5 // Soma a Largura do botao incluido dividido por dois mais 3 que é o espaço entre os controles
											nCol += nSpace+12
											nItems++
										EndIf
									EndCase

								Else
									If !( Upper( self:aFields[nX][1] ) $ "XX1_RECORR|XX1_PARAM|XX1_ULTDIA|XX1_ULTHOR" )

										If ( Upper( self:aFields[nX][1] ) == "XX1_HORA" )
											bValid := {|| ValidHora( self:aControls[SCHD_TIME][2], .F. ) }
											nCol += nSpace
										ElseIf ( Upper( self:aFields[nX][1] ) == "XX1_DATA" )
											bValid := {|| If( self:aControls[SCHD_DATE][2] < Date(), ;
												( MsgAlert(STR0108, STR0016), .F. ), ; //"Atenção"
											ValidPeriod( self:aControls[SCHD_PERIOD][2], self:aControls[SCHD_DATE][2] ) ) }
											nWidthInput += 13
										Else
											bValid := {|| }
										EndIf

										aAdd( self:aControls, { Nil, Nil, Nil, self:aFields[nX][7] } )

										cTitle := self:aFields[nX][2]
										If ( self:aFields[nX][7] )
											cTitle += "*"
										EndIf
										TSay():New( nRow, nCol, &("{|| '"+cTitle+"' }"), oPanel,,,,,, .T.,RGB(000,074,119),, nWidthLabel, 010,,,,,, )

										If self:aFields[nX][1] == "XX1_STATUS"

											self:aControls[Len(self:aControls)][2] := .T.
											self:aControls[Len(self:aControls)][1] := TCheckBox():New( nRow+nRowHeight+1, nCol, '', ;
												&("{|U| If( pCount() == 0, self:aControls[" +Str(Len(self:aControls))+ "][2], "+ ;
												"self:aControls[" +Str(Len(self:aControls))+ "][2]:=U )} "), oPanel, ;
												010, nHeight,, /*[<{uClick}>]*/,, /*<{ValidFunc}>*/,,, , .T.,,, /*<{WhenFunc}>*/ )
											// Seta help de campo
											self:aControls[Len(self:aControls)][1]:cSX1HLP := self:aFields[nX][1]
											self:aControls[Len(self:aControls)][3] := .T.
											nCol += nWidthLabel

										ElseIf ( self:aFields[nX][1] == "XX1_DESCR" )
											//Conteúdo do Campo
											self:aControls[Len(self:aControls)][2] := Space( self:aFields[nX][4] )
											//Definição do Campo
											self:aControls[Len(self:aControls)][1] := TMultiget():New(nRow+nRowHeight+1,nCol,;
												&("{|U| If( pCount() == 0, self:aControls[" +Str(Len(self:aControls))+ "][2], "+ ;
												"self:aControls[" +Str(Len(self:aControls))+ "][2]:=U )} "),;
												oPanel,nWidthInput,30,,,,,,.T.)
											self:aControls[Len(self:aControls)][1]:EnableVScroll( .F. )
											self:aControls[Len(self:aControls)][1]:EnableHScroll( .T. )
											//Realizada a definição manual do CSS para o FWMultiget no tema CLASSIC.
											If ( UPPER( getRealTheme() ) $ "CLASSIC|OCEAN"  )
												self:aControls[Len(self:aControls)][1]:SetCss( FWCSSVerify( GetClassName(self:aControls[Len(self:aControls)][1]), ;
													"Q3TextEdit", "Q3TextEdit{ color: #000000; border: 1px solid #ABADB3 }") )
											EndIf
											//Help de Campo
											self:aControls[Len(self:aControls)][1]:cSX1HLP := self:aFields[nX][1]
											//Tamanho do Campo
											self:aControls[Len(self:aControls)][3] := self:aFields[nX][4]
										Else
											Do Case
											Case self:aFields[nX][3] == "N"
												self:aControls[Len(self:aControls)][2] := 0
											Case self:aFields[nX][3] == "D"
												self:aControls[Len(self:aControls)][2] := CTOD("")
											Otherwise
												self:aControls[Len(self:aControls)][2] := Space( self:aFields[nX][4] )
											EndCase

											self:aControls[Len(self:aControls)][1] := TGet():New( nRow+nRowHeight, nCol, ;
												&("{|U| If( pCount() == 0, self:aControls[" +Str(Len(self:aControls))+ "][2], "+ ;
												"self:aControls[" +Str(Len(self:aControls))+ "][2]:=U )} "), oPanel, ;
												nWidthInput,nRowHeight, self:aFields[nX][6], bValid,,,,,, ;
												.T.,,, /*<{uWhen}>*/,,, /*[\{|nKey, nFlags, Self| <uChange>\}]*/, ;
							/*<.readonly.>*/,,,,, /*[<.lNoBorder.>]*/, /*[<nHelpId>]*/, .T. )
												// Seta help de campo
											self:aControls[Len(self:aControls)][1]:cSX1HLP := self:aFields[nX][1]

											// Tamanho do campo
											self:aControls[Len(self:aControls)][3] := self:aFields[nX][4]

										EndIf
									EndIf
								EndIf

								If !( Upper( self:aFields[nX][1] ) $ "XX1_RECORR|XX1_PARAM|XX1_ULTDIA|XX1_ULTHOR|XX1_STATUS" )
									nMaxWidth := If( nWidthLabel > nWidthInput, nWidthLabel, nWidthInput )
									nCol += nMaxWidth+nSpace+If( Upper( self:aFields[nX][1] ) == "XX1_HORA", nSpace*2, 0 )
									nItems ++
								EndIf

								If ( Upper( self:aFields[nX][1] ) == "XX1_RECORR" )
									lObRec := self:aFields[nX][7]
								ElseIf ( Upper( self:aFields[nX][1] ) == "XX1_PARAM" )
									lObPar := self:aFields[nX][7]
								EndIf
							Next nX

							aAdd( self:aControls, { Nil, "", Nil, lObRec } ) // XX1_RECORR
							aAdd( self:aControls, { Nil, "", Nil, lObPar } ) // XX1_PARAM

							lEnableBtnP := !Empty(self:aControls[SCHD_PARAM][2])

							If lJustForm
								self:updateControls( INSERT,, .T. )
							EndIf
							oPanel:nHeight += (nRowHeight*2 + nSpace)*2
							RETURN

//---------------------------------------

METHOD hide() CLASS FWUISchedulePersist
	self:oFWLayer:hide()
RETURN

//---------------------------------------

METHOD setEmpFil( cEmpFil ) CLASS FWUISchedulePersist

	PARAMTYPE 00 VAR cEmpFil AS CHARACTER

	self:aControls[SCHD_EMPFIL][2] := cEmpFil
	self:aControls[SCHD_EMPFIL][1]:refresh()

RETURN

METHOD setEnv(cEnv) CLASS FWUISchedulePersist

	PARAMTYPE 00 VAR cEnv AS CHARACTER

	self:aControls[SCHD_ENV][2] := UPPER(cEnv)
	self:aControls[SCHD_ENV][1]:refresh()

RETURN

//-------------------------------------------------------------------
/*/{Protheus.doc} setNoEndDate
Define se a recorrência da rotina não tem data de fim

@param lNoEndDate	 Caso seja .T. estão marca que a execução não
tem data pra terminar e bloqueia visualmente essa opção, não deixando
que o usuário altere essa configuração

@author Juliane Venteu
@since 14/03/2013
@version 1.0
/*/
//-------------------------------------------------------------------
METHOD setNoEndDate(lNoEndDate) CLASS FWUISchedulePersist
	::lNoEndDate := lNoEndDate
RETURN

//-------------------------------------------------------------------
/*/{Protheus.doc} setButtonOkCancel
Define se os botões de Ok e Cancelar deverão ser exibidos

@param lButton	 Caso seja .T. serõa exibidos, senão não

@author Juliane Venteu
@since 14/03/2013
@version 1.0
/*/
//-------------------------------------------------------------------
METHOD setButtonOkCancel(lButton) CLASS  FWUISchedulePersist
	::lButtonOkCancel := lButton
RETURN
//---------------------------------------

METHOD setFunctionCtrl( cFunction ) CLASS FWUISchedulePersist

	PARAMTYPE 00 VAR cFunction AS CHARACTER

	self:aControls[SCHD_FUNCTION][2] := cFunction
	self:aControls[SCHD_FUNCTION][1]:refresh()

RETURN

//---------------------------------------

METHOD setModuleCtrl( nModule ) CLASS FWUISchedulePersist

	PARAMTYPE 00 VAR nModule AS NUMERIC

	self:aControls[SCHD_MODULE][2] := StrZero(nModule,2)
	self:aControls[SCHD_MODULE][1]:refresh()
	self:aControls[SCHD_MODNAME][2] := FWModName( self:aControls[SCHD_MODULE][2] )
	self:aControls[SCHD_MODNAME][1]:refresh()

RETURN

//---------------------------------------

METHOD setPeriodCtrl( cPeriod ) CLASS FWUISchedulePersist

	PARAMTYPE 00 VAR cPeriod AS CHARACTER

	self:aControls[SCHD_PERIOD][2] := cPeriod

RETURN

//---------------------------------------

METHOD setTimeCtrl( cTime ) CLASS FWUISchedulePersist

	PARAMTYPE 00 VAR cTime AS CHARACTER

	self:aControls[SCHD_TIME][2] := cTime
	self:aControls[SCHD_TIME][1]:refresh()

RETURN
//---------------------------------------

METHOD setDevice( nDevice ) CLASS FWUISchedulePersist
	self:nDevice := nDevice
Return

METHOD setTpPlanilha( nTpPlanilha ) CLASS FWUISchedulePersist
	self:nTpPlanilha := nTpPlanilha
Return
METHOD setParams(cFile, cTitulo, nOrder, nEmailTpImp, aRelSchdDef, lSchedFromTReport) CLASS FWUISchedulePersist
	Local aParam      := {}
	Local oParam      := Nil
	Local lEnableBtnP := .F.

	FWVldRotina( self, @aParam, @oParam, @lEnableBtnP, .F. )

	If Len(aParam) == 0
		aParam := aRelSchdDef//Se o relatório não possuir SchedDef atribuo a "fake" criada no Report01
	EndIf

	//Carrego as configurações da opção parâmetros
	self:aControls[SCHD_PARAM][2] := FWUISchdParam(self:aControls[SCHD_PARAM][2],;
		FwgetSourceString( aParam , self:aControls[SCHD_FUNCTION][2]),;
		self:nOption == UPDATE,;
		self:nOption == INSERT,;
		.F.,;
		,;
		fwgetStringDevice(,self:nDevice, self:nTpPlanilha, cFile, cTitulo, nOrder, nEmailTpImp);
		,;
		,;
		self:aControls[SCHD_FUNCTION][2],;
		,;
		Iif(Type("aParDef") != "U", aClone(aParDef), {}),;
		lSchedFromTReport)

Return
//---------------------------------------

METHOD show() CLASS FWUISchedulePersist
	self:oFWLayer:show()
RETURN

//---------------------------------------

METHOD submit( lJustForm, oFWVOSchedule ) CLASS FWUISchedulePersist

	Local aGets := {}

	Local lDone := .F.

	Local nX := 0

	PARAMTYPE 00 VAR lJustForm		AS LOGICAL OPTIONAL DEFAULT .F.
	PARAMTYPE 01 VAR oFWVOSchedule	AS OBJECT OPTIONAL

	For nX := 1 To Len( self:aControls )
		If self:nOption != DELETE .AND. ( self:aControls[nX][4] .And. (Empty( self:aControls[nX][2] ) .And. ( nX != SCHD_PARAM .And. nX != SCHD_DESCR ) ) )
			MsgAlert( STR0015, STR0016 ) //"Campo em branco. Por favor, preencha os campos que estão vazios."###"Atenção"
			Return
		EndIf

		aAdd( aGets, self:aControls[nX][2] )

	Next nX

	If lJustForm
		oFWVOSchedule :=  self:oFWCOSchedule:getFWVOSchedule( aGets )
		self:oOwner:End()
		RETURN
	EndIf

	Do Case
	Case self:nOption == DELETE
		MsgRun( STR0100,, {|| lDone := self:oFWCOSchedule:deleteSchedule( aGets ), self:updateSchedules(.T.) } ) //"Deletando registro..."
	Case self:nOption == INSERT
		MsgRun( STR0018,, {|| lDone := self:oFWCOSchedule:insertSchedule( aGets ), self:updateSchedules(.T.) } ) //"Incluindo registro..."
	Case self:nOption == UPDATE
		MsgRun( STR0017,, {|| lDone := self:oFWCOSchedule:updateSchedule( aGets ), self:updateSchedules() } ) //"Atualizando registro..."
	EndCase

	// Se operação foi concluida com sucesso realiza operações de atualização
	If lDone
		self:updateControls( VIEW )
	EndIf

RETURN

//---------------------------------------

METHOD updateSchedules( lGoTop ) CLASS FWUISchedulePersist

	PARAMTYPE 0 VAR lGoTop AS LOGICAL OPTIONAL DEFAULT .F.

	self:oBrowse:refresh(.T.)
RETURN

//-------------------------------------------------------------------
/*{Protheus.doc} updateControls
Atualiza os controles de tela sobre o cadastro do agendamento

@param nOpt Opção selecionada (Insert, Update, Delete...)
@param lChange Indica uma alteração de dados
@param lJustForm Indica a criação apenas do form
				
@author Daniel Mendes
@since 03/03/2020
@version 1.0
*/
//-------------------------------------------------------------------
METHOD updateControls( nOpt, lChange, lJustForm ) CLASS FWUISchedulePersist
	Local lCanChgUser AS LOGICAL
	Local cSchdEmpFil AS CHARACTER

	PARAMTYPE 0 VAR nOpt 		AS NUMERIC
	PARAMTYPE 1 VAR lChange		AS LOGICAL OPTIONAL DEFAULT .F.
	PARAMTYPE 2 VAR lJustForm	AS LOGICAL OPTIONAL DEFAULT .F.

	If lChange .AND. ( nOpt == DELETE .OR. nOpt == UPDATE .OR. nOpt == INSERT )
		If !MsgYesNo( STR0090, STR0016 ) //"Atenção"
			RETURN
		EndIf
	EndIf

	lCanChgUser := self:canChangeUser()
	cSchdEmpFil	:= ""

	self:oButtonBar:aItems[1]:lActive := (lJustForm .OR. nOpt == VIEW ) // Incluir

	If ::lButtonOkCancel
		self:oButtonBar:aItems[2]:lActive := ( lJustForm .OR. ( nOpt == VIEW ) ) .AND. ( lJustForm .OR. XX1->(!EOF()) ) .AND. ;
			( lJustForm .OR. ( XX1->(!EOF()) .AND. XX1->XX1_STATUS != SCHD_FINISHED ) )	// Alterar
		self:oButtonBar:aItems[3]:lActive := ( lJustForm .OR. ( nOpt == VIEW ) ) .AND. ( lJustForm .OR. XX1->(!EOF()) )	// Excluir
	EndIf
	If !lJustForm
		self:oButtonBar:aItems[4]:lActive := nOpt == INSERT .OR. XX1->(!EOF())	// Recorrencia
		self:oButtonBar:aItems[5]:lActive := !( nOpt == VIEW )	// Confirmar
		self:oButtonBar:aItems[6]:lActive := !( nOpt == VIEW )	// Cancelar
	EndIf

	If nOpt == INSERT .OR. XX1->(EOF())
		self:aControls[SCHD_ID][2] := If( nOpt == INSERT, self:oFWCOSchedule:getNextID(), "" )
		self:aControls[SCHD_USERID][2] := If( nOpt == INSERT, __cUserID, "" )
		self:aControls[SCHD_USERNAME][2] := If( nOpt == INSERT, FWUserName( __cUserID ), "" )
		self:aControls[SCHD_FUNCTION][2] := Space( self:aControls[SCHD_FUNCTION][3] )
		self:aControls[SCHD_DATE][2] := DATE()
		self:aControls[SCHD_TIME][2] := "00:00"
		self:aControls[SCHD_ENV][2] := Upper(getenvserver())
		self:aControls[SCHD_EMPFIL][2] := Space( self:aControls[SCHD_EMPFIL][3]-1 )
		self:aControls[SCHD_MODULE][2] := "  "
		self:aControls[SCHD_MODNAME][2] := ""
		self:aControls[SCHD_STATUS][2] := .T.
		self:aControls[SCHD_PERIOD][2] := ""
		self:aControls[SCHD_PARAM][2] := ""
		self:aControls[SCHD_DESCR][2] := Space( self:aControls[12][3] )
	Else
		If XX1->(!EOF())
			cSchdEmpFil := FWSchdEmpFil( XX1->XX1_CODIGO )

			If ( Len( cSchdEmpFil ) > self:aControls[SCHD_EMPFIL][3] )
				cSchdEmpFil := FWSchdEmpFil( XX1->XX1_CODIGO )
				cSchdEmpFil := SubStr( cSchdEmpFil, 1, RAt( ";", cSchdEmpFil ) )
			EndIf

			self:aControls[SCHD_ID][2] := Padr( XX1->XX1_CODIGO, self:aControls[SCHD_ID][3] )
			self:aControls[SCHD_USERID][2] := Padr( XX1->XX1_USERID, self:aControls[SCHD_USERID][3] )
			self:aControls[SCHD_USERNAME][2] := FWUserName( XX1->XX1_USERID )
			self:aControls[SCHD_FUNCTION][2] := Padr( XX1->XX1_ROTINA, self:aControls[SCHD_FUNCTION][3] )
			self:aControls[SCHD_DATE][2] := XX1->XX1_DATA
			self:aControls[SCHD_TIME][2] := Padr( XX1->XX1_HORA, self:aControls[SCHD_TIME][3] )
			self:aControls[SCHD_ENV][2] := Padr( XX1->XX1_ENV, self:aControls[SCHD_ENV][3] )
			self:aControls[SCHD_EMPFIL][2] := cSchdEmpFil
			self:aControls[SCHD_MODULE][2] := StrZero( XX1->XX1_MODULO, 2 )
			self:aControls[SCHD_MODNAME][2] := FWModName( StrZero( (XX1->XX1_MODULO), 2), AllTrim(self:aControls[SCHD_FUNCTION][2]) + '/' $ "FWEAI/FWEAISEND/FWEAIRECE/FWEAICLEAR/")
			self:aControls[SCHD_STATUS][2] := If( XX1->XX1_STATUS == SCHD_ACTIVE, .T., .F. )
			self:aControls[SCHD_PERIOD][2] := XX1->XX1_RECORR
			self:aControls[SCHD_PARAM][2] := XX1->XX1_PARAM
			self:aControls[SCHD_DESCR][2] := XX1->XX1_DESCR
		EndIf
	EndIf

	self:aControls[SCHD_ID][1]:lReadOnly := .T.
	self:aControls[SCHD_USERID][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE .OR. nOpt == UPDATE ) .OR. !lCanChgUser .OR. lJustForm
	self:aControls[SCHD_USERNAME][1]:lReadOnly := .T.
	self:aControls[SCHD_FUNCTION][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE .OR. nOpt == UPDATE ) .OR. lJustForm
	self:aControls[SCHD_DATE][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE .OR. nOpt == UPDATE )
	self:aControls[SCHD_TIME][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE )
	self:aControls[SCHD_ENV][1]:lReadOnly := .T.
	self:aControls[SCHD_EMPFIL][1]:lReadOnly := .T. // ( nOpt == VIEW .OR. nOpt == DELETE )
	self:aControls[SCHD_MODULE][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE ) .OR. lJustForm .OR. AllTrim(self:aControls[SCHD_FUNCTION][2]) + '/' $ "FWEAI/FWEAISEND/FWEAIRECE/FWEAICLEAR/"
	self:aControls[SCHD_MODNAME][1]:lReadOnly := .T.
	self:aControls[SCHD_STATUS][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE )
	self:aControls[SCHD_DESCR][1]:lReadOnly := ( nOpt == VIEW .OR. nOpt == DELETE )

	self:aControls[SCHD_ID][1]:refresh()
	self:aControls[SCHD_USERID][1]:refresh()
	self:aControls[SCHD_USERNAME][1]:refresh()
	self:aControls[SCHD_FUNCTION][1]:refresh()
	self:aControls[SCHD_DATE][1]:refresh()
	self:aControls[SCHD_TIME][1]:refresh()
	self:aControls[SCHD_ENV][1]:refresh()
	self:aControls[SCHD_EMPFIL][1]:refresh()
	self:aControls[SCHD_MODULE][1]:refresh()
	self:aControls[SCHD_MODNAME][1]:refresh()
	self:aControls[SCHD_STATUS][1]:refresh()
	self:aControls[SCHD_DESCR][1]:refresh()

	self:nOption := nOpt
RETURN

//-------------------------------------------------------------------------------------
/*/{Protheus.doc} canChangeUser
Método que verifica e retorna se o usuário tem direito de alterar o usuário do schedule

@return lCanChgUser Indica a possibilidade de alterar o usuário do schedule

@author Daniel Mendes
@since 03.03.2020
@version 1.0
/*/
//-------------------------------------------------------------------------------------
method canChangeUser() class FWUISchedulePersist
	local lCanChgUser as logical
	local aGroups as array

	lCanChgUser := .T.

	if !(self:cUserLogin == __cUserID)
		self:cUserLogin := __cUserID

		// Verifica se usuario possui direito de alterar usuarios do schedule
		if !(__cUserID == "000000")
			if MPIsUsrInDB()
				aGroups := StrTokArr2(FWSFUser(__cUserID,"DATAGROUP","USR_GRUPO",.T.),";")
				lCanChgUser := Ascan( aGroups, {|x| x == "000000" } ) > 0
				FWFreeVar(@aGroups)
			else
				PswOrder(1)
				if PswSeek(__cUserId)
					lCanChgUser := Ascan( PswRet()[1][10], {|x| x == "000000" } ) > 0
				endif
			endif
		endif

		self:lChangeUser := lCanChgUser
	else
		lCanChgUser := self:lChangeUser
	endif

return lCanChgUser
//-------------------------------------------------------------------------------------
/*/{Protheus.doc} FWSchdRecurrence
	Função que realiza a verificaçção se há recorrência cadastrada para o agendamento
	
@param dDate, Date, Data configurada no agendamento
@param cTime, String, Tempo configurado no agendamento
@param cPeriod, String, Periodo configurado no agendamento 
@param nOpc, Numeric, Opção selecionada no agendamento
@param lNoEndDate, Logic, Se possui data de término

@return cRet, String, Periodo configurado para o agendamento

@author emerson.vilela
@since 03.07.2019
@version version
/*/
//-------------------------------------------------------------------------------------
Function FWSchdRecurrence( dDate, cTime, cPeriod, nOpc, lNoEndDate  )
	Local aHoras	As Array
	Local aPanels	As Array
	Local aWeek		As Array
	Local cDay		As Character
	Local cLbx		As Character
	Local cRet		As Character
	Local cRExe		As Character
	LOcal cRInter	As Character
	Local cYMonth	As Character
	Local dEndDay	As Date
	Local lDEach	As Logical
	Local lDEvery	As Logical
	Local lEnd		As Logical
	Local lEndNo	As Logical
	Local lLate		As Logical
	Local lMEach	As Logical
	Local lMMonths	As Logical
	Local lYDay		As Logical
	Local lYEach	As Logical
	Local lShowLbx	As Logical
	Local lSubmit	As Logical
	Local nDDay		As Numeric
	Local nMDay		As Numeric
	Local nPeriod	As Numeric
	Local nYDay		As Numeric
	Local nX		As Numeric
	Local oBtnTable As Object
	Local oDDay		As Object
	Local oDEvery	As Object
	Local oDEach	As Object
	Local oDlg		As Object
	Local oEnd		As Object
	Local oEndNo	As Object
	Local oLate		As Object
	Local oFWLayer	As Object
	Local oLbx		As Object
	Local oMDay		As Object
	Local oPanel	As Object
	Local oPFreq	As Object
	Local oPExec	As Object
	Local oPeriod	As Object
	Local oRExe		As Object
	Local oRHora	As Object
	Local oRInter	As Object
	Local oYDay		As Object
	Local oYMonth 	As Object
	Local nRemoteType As Numeric

	aHoras		:= {}
	aPanels		:= {}
	aWeek		:= { .F., .F., .F., .F., .F., .F., .F. }
	cDay		:= ""
	cLbx		:= ""
	cRet		:= ""
	cRExe		:= "0000"
	cRInter		:= "00:00"
	cYMonth		:= ""
	dEndDay		:= If( !Empty(dDate), dDate, Date() )
	lDEach		:= .T.
	lDEvery		:= .F.
	lEnd		:= .T.
	lEndNo		:= .F.
	lLate		:= .F.
	lMEach		:= .T.
	lMMonths	:= .F.
	lYDay		:= .F.
	lYEach		:= .F.
	lShowLbx	:= .F.
	lSubmit		:= .F.
	nDDay		:= 1
	nMDay		:= 1
	nPeriod		:= 1
	nYDay		:= 1
	nX			:= 0
	nRemoteType := FWCSSTools():GetInterfaceCSSType()
	oBtnTable 	:= Nil
	oDDay		:= Nil
	oDEvery		:= Nil
	oDEach		:= Nil
	oDlg		:= Nil
	oEnd		:= Nil
	oEndNo		:= Nil
	oLate		:= Nil
	oFWLayer	:= Nil
	oLbx		:= Nil
	oMDay		:= Nil
	oPanel		:= Nil
	oPFreq		:= Nil
	oPExec		:= Nil
	oPeriod		:= Nil
	oRExe		:= Nil
	oRHora		:= Nil
	oRInter		:= Nil
	oYDay		:= Nil
	oYMonth 	:= Nil

	PARAMTYPE 00 VAR dDate		AS DATE OPTIONAL DEFAULT Date()
	PARAMTYPE 01 VAR cTime		AS CHARACTER
	PARAMTYPE 02 VAR cPeriod	AS CHARACTER
	PARAMTYPE 03 VAR nOpc		AS NUMERIC
	PARAMTYPE 04 VAR lNoEndDate	AS LOGICAL OPTIONAL DEFAULT .F.

	If ( Empty( cPeriod ) .AND. nOpc == VIEW )
		MsgAlert( STR0027, STR0016 )   //"Não existe recorrência cadastrada para esse agendamento."###"Atenção"
		Return cPeriod
	EndIf

	If !Empty(cPeriod)// .AND. nOpc != INSERT
		Do Case
		Case Subs( cPeriod, 1, 1 ) == DIARY
			If ( nAt := At( "Each", cPeriod ) ) > 0
				lDEach	:= &( Subs( cPeriod, nAt+5, 3 ) )
				// Busca a cada quantos dias
				cDay := ""
				nAt := At( "Day", cPeriod ) + 4
				For nX := nAt To Len(cPeriod)
					If Subs( cPeriod, nX, 1 ) != ")"
						cDay += Subs( cPeriod, nX, 1 )
					Else
						Exit
					EndIf
				Next
				nDDay := Val( cDay )
			EndIf
			If ( nAt := At( "EveryDay", cPeriod ) ) > 0
				If lDEvery	:= &( Subs( cPeriod, nAt+9, 3 ) )
					lDEach := .F.
				EndIf
			EndIf

			nPeriod := 1

		Case Subs( cPeriod, 1, 1 ) == WEEKLY
			aWeek := {}
			For nX := 1 To 7
				If Subs( cPeriod, nX, 1 ) != ")"
					aAdd( aWeek, &( Subs( cPeriod, 3+(nX-1)*3, 3 ) ) )
				Else
					Exit
				EndIf
			Next nX

			nPeriod := 2

		Case Subs( cPeriod, 1, 1 ) == MONTHLY
			// Busca a cada quantos dias
			cDay := ""
			nAt := At( "Day", cPeriod ) + 4
			For nX := nAt To Len(cPeriod)
				If Subs( cPeriod, nX, 1 ) != ")"
					cDay += Subs( cPeriod, nX, 1 )
				Else
					Exit
				EndIf
			Next
			nMDay := Val( cDay )

			nPeriod := 3

		Case Subs( cPeriod, 1, 1 ) == YEARLY
			// Busca a cada quantos dias
			cDay := ""
			nAt := At( "Day", cPeriod ) + 4
			For nX := nAt To Len(cPeriod)
				If Subs( cPeriod, nX, 1 ) != ")"
					cDay += Subs( cPeriod, nX, 1 )
				Else
					Exit
				EndIf
			Next
			nYDay := Val( cDay )

			cYMonth := ""
			nAt := At( "Month", cPeriod ) + 6
			For nX := nAt To Len(cPeriod)
				If Subs( cPeriod, nX, 1 ) != ")"
					cYMonth += Subs( cPeriod, nX, 1 )
				Else
					Exit
				EndIf
			Next

			nPeriod := 4

		Case Subs( cPeriod, 1, 1 ) == ALWAYS

			nPeriod := 5

		EndCase

		// --------------------------------------------------------------------------------------
		// Bloco para validação de preenchimento do campo do número de execuções
		// O campo terá seu valor atualizado somente se houver execuções para serem apresentadas
		// --------------------------------------------------------------------------------------
		cRetExecPeriod := RetExecPeriodNum( cPeriod )

		If !Empty( cRetExecPeriod )
			cRExe := cRetExecPeriod
		EndIf

		nAt := At( "Interval", cPeriod ) + 9

		If ! ( AllTrim( cPeriod ) == "A" )
			cRInter := Subs( cPeriod, nAt, 5 )
		EndIf

		If ( nAt := At( "End", cPeriod ) ) > 0
			lEnd := .T.
			lEndNo := .F.
			dEndDay := STOD( Subs( cPeriod, nAt+4, 8 ) )
		Else
			lEnd := .F.
			lEndNo := .T.
			dEndDay := dDate+1
		EndIf

		If ( nAt := At( "Discard;", cPeriod ) ) > 0
			lLate := .T.
		EndIf

	EndIf

	DEFINE MSDIALOG oDlg TITLE STR0010 FROM 000,000 TO 318,550 PIXEL //"Recorrência"

	oFWLayer := FWLayer():new()
	oFWLayer:init( oDlg )

	// Adiciona coluna no layer de serviços
	oFWLayer:addCollumn( "Sched", 100, .F. )

	// Cria janelas dos serviços
	oFWLayer:addWindow( "Sched", "Freq", STR0028, 49, .F., .T., {||} ) //"Padrão de recorrência"
	oFWLayer:addWindow( "Sched", "Exec", STR0060, 42, .F., .T., {||} ) //"Intervalo de recorrência"

	oPFreq := oFWLayer:getWinPanel( "Sched", "Freq" )
	oPFreq:readClientCoors()
	oPExec := oFWLayer:getWinPanel( "Sched", "Exec" )
	oPExec:readClientCoors()

	@ 005,010 RADIO oPeriod VAR nPeriod ITEMS STR0029, STR0030, STR0031, STR0032, STR0101 SIZE 045,000 OF oPFreq PIXEL //"Diário"###"Semanal"###"Mensal"###"Anual" //"Sempre ativo"
	oPeriod:bChange := {|| updatePanels( nPeriod, aPanels  ), Iif( nPeriod == 5, ( cRExe := "0000",  cRInter := "00:00" ),) }
	oPeriod:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	// Diario
	aAdd( aPanels, TBitmap():New( 002, 055, 210, 042, "x.png",,, oPFreq,,,, .T.,,,,, .T.,, ) )
	@ 005,005 CHECKBOX oDEach VAR lDEach PROMPT STR0033 SIZE 029,010 OF aPanels[1] PIXEL //"A cada"
	oDEach:bLClicked := {|| If( lDEach, lDEvery := .F., lDEvery := .T. ), oDEvery:Refresh() }
	oDEach:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	@ 004,035 GET oDDay VAR nDDay PICTURE "@E 99" OF aPanels[1] SIZE 020,009 PIXEL
	oDDay:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	@ 006,055 SAY STR0034 SIZE 020,010 OF aPanels[1] PIXEL //" dia(s)"

	@ 020,005 CHECKBOX oDEvery VAR lDEvery PROMPT STR0035 SIZE 080,010 OF aPanels[1] PIXEL //"Todos os dias da semana"
	oDEvery:bLClicked := {|| If( lDEvery, lDEach := .F., lDEach := .T. ), oDEach:Refresh() }
	oDEvery:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	// Semanal
	aAdd( aPanels, TBitmap():New( 002, 055, 210, 042, "x.png",,, oPFreq,,,, .T.,,,,, .T.,, ) )
	@ 005,005 SAY STR0036 SIZE 050,010 OF aPanels[2] PIXEL //"Todo(a)"

	@ 015,007 CHECKBOX aWeek[1] PROMPT STR0037 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"domingo"

	@ 015,060 CHECKBOX aWeek[2] PROMPT STR0038 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"segunda-feira"

	@ 015,113 CHECKBOX aWeek[3] PROMPT STR0039 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"terça-feira"

	@ 015,160 CHECKBOX aWeek[4] PROMPT STR0040 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"quarta-feira"

	@ 030,007 CHECKBOX aWeek[5] PROMPT STR0041 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"quinta-feira"

	@ 030,060 CHECKBOX aWeek[6] PROMPT STR0042 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"sexta-feira"

	@ 030,113 CHECKBOX aWeek[7] PROMPT STR0043 SIZE 050,010 OF aPanels[2] WHEN {|| nOpc == INSERT .OR. nOpc == UPDATE } PIXEL //"sábado"

	// Mensal
	aAdd( aPanels, TBitmap():New( 002, 055, 210, 042, "x.png",,, oPFreq,,,, .T.,,,,, .T.,, ) )
	@ 006,005 SAY STR0044 SIZE 025,010 OF aPanels[3] PIXEL //"Dia"

	@ 004,020 GET oMDay VAR nMDay PICTURE "@E 99" SIZE 020,009 OF aPanels[3] PIXEL
	oMDay:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	@ 006,042 SAY STR0045 SIZE 050,010 OF aPanels[3] PIXEL //"de cada mês"

	// Anual
	aAdd( aPanels, TBitmap():New( 002, 055, 210, 042, "x.png",,, oPFreq,,,, .T.,,,,, .T.,, ) )
	@ 006,005 SAY STR0046 SIZE 030,010 OF aPanels[4] PIXEL //"A cada dia"

	@ 004,033 GET oYDay VAR nYDay PICTURE "@E 99" SIZE 020,009 OF aPanels[4] PIXEL
	oYDay:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	@ 006,055 SAY STR0047 SIZE 010,010 OF aPanels[4] PIXEL //"de"

	@ 004,065 COMBOBOX oYMonth VAR cYMonth ITEMS { STR0048, STR0049, ; //"1=janeiro"###"2=fevereiro"
	STR0050, STR0051, STR0052, STR0053, ; //"3=março"###"4=abril"###"5=maio"###"6=junho"
	STR0054, STR0055, STR0056, STR0057, ; //"7=julho"###"8=agosto"###"9=setembro"###"10=outubro"
	STR0058, STR0059 } SIZE 050,012 OF aPanels[4] PIXEL //"11=novembro"###"12=dezembro"
	oYMonth:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }

	// Sempre ativo
	aAdd( aPanels, TBitmap():New( 002, 055, 210, 042, "x.png",,, oPFreq,,,, .T.,,,,, .T.,, ) )
	@ 006,005 SAY STR0102 SIZE 200,030 OF aPanels[5] PIXEL //"Está opção mantém a rotina agendada sempre funcionando."

	// Atualiza todos os paineis
	updatePanels( nPeriod, aPanels )

	@ 005,010 SAY STR0061 SIZE 080,010 OF oPExec PIXEL //"Nº Execuções no mesmo dia"
	@ 003,088 GET oRExe VAR cRExe SIZE 010,009 PICTURE "@E 9999" OF oPExec PIXEL
	oRExe:bValid := {|| ValidVz( cRExe, @cTime, @cRInter, @oRInter ), ;
		TabExec(.F.,cTime,cRInter,cRExe,@aHoras,@oLbx), Iif( Val(cRExe) > 0, oRInter:SetFocus(), .T. ) }
	oRExe:bWhen := {|| ( nOpc == INSERT .OR. nOpc == UPDATE ) .AND. nPeriod != 5 }

	@ 005,125 SAY STR0062 SIZE 023,010 OF oPExec PIXEL		 //"Intervalo"

	@ 003,148 GET oRInter VAR cRInter SIZE 020,009 PICTURE "99:99" OF oPExec PIXEL
	oRInter:bValid := {|| Iif ( SchVldInt( cRInter, cRExe, cTime ), .T., .F.) }
	oRInter:bChange := {|| TabExec(.F.,cTime,cRInter,cRExe,@aHoras,@oLbx) }
	oRInter:bWhen := {|| ( nOpc == INSERT .OR. nOpc == UPDATE ) .AND. nPeriod != 5 }

	@ 003,195 BUTTON oBtnTable PROMPT STR0063 OF oPExec SIZE 070,012 ; //"Execuções"
	ACTION( TabExec(,cTime,cRInter,cRExe,@aHoras,@oLbx), ;
		Iif( lShowLbx, (lShowLbx := .F., oLbx:Hide(), oBtnTable:cCaption:=STR0063, oBtnTable:cTitle:=STR0063, oBtnTable:Refresh() ),; //"Execuções"###"Execuções"
	(lShowLbx := .T., oBtnTable:cCaption:=STR0064, oBtnTable:cTitle:=STR0064, oBtnTable:Refresh() ) ) ) PIXEL //"Fechar"###"Fechar"
	oBtnTable:bWhen := {|| nPeriod != 5 }

	@ 015,195 LISTBOX oLbx VAR cLbx ITEMS aHoras SIZE 070,025 OF oPExec PIXEL
	oLbx:Hide()

	@ 019,010 CHECKBOX oEndNo VAR lEndNo PROMPT STR0065 SIZE 060,010 OF oPExec PIXEL //"Sem data de término"
	oEndNo:bLClicked := {|| If( lEndNo, lEnd := .F., lEnd := .T. ), oEnd:Refresh() }
	oEndNo:bWhen := {|| ( nOpc == INSERT .OR. nOpc == UPDATE ) .AND. nPeriod != 5 }

	@ 019,082 CHECKBOX oLate VAR lLate PROMPT STR0109 SIZE 080,010 OF oPExec PIXEL //"Descarta tarefas atrasadas"
	oLate:bWhen := {|| ( nOpc == INSERT .OR. nOpc == UPDATE ) .AND. nPeriod != 5 }

	@ 032,010 CHECKBOX oEnd VAR lEnd PROMPT STR0066 SIZE 040,010 OF oPExec PIXEL //"Termina em:"
	oEnd:bLClicked := {|| If( lEnd, lEndNo := .F., lEndNo := .T. ), oEndNo:Refresh() }
	oEnd:bWhen := {|| ( nOpc == INSERT .OR. nOpc == UPDATE ) .AND. nPeriod != 5 }

	@ 030,055 MSGET oEndDay VAR dEndDay SIZE 060,009 OF oPExec HASBUTTON PIXEL
	oEndDay:bValid := {|| If( dEndDay<dDate, (MsgAlert(STR0067+DTOC(dDate), STR0016), .F.), .T. ) } //"A data de término deve ser maior que a data inicial "###"Atenção"
	oEndDay:bWhen := {|| ( nOpc == INSERT .OR. nOpc == UPDATE ) .AND. nPeriod != 5 }

	@ IF(nRemoteType == REMOTE_HTML, 143, 145),165 BUTTON oSubmit PROMPT STR0011 OF oDlg SIZE 050,012 ; //"Confirmar"
	ACTION( If(nPeriod == 5 .Or. SchVldConf(cRExe, cRInter),(lSubmit := .T., oDlg:End()),Nil) ) PIXEL
	oSubmit:bWhen := {|| nOpc == INSERT .OR. nOpc == UPDATE }
	oSubmit:SetCSS( FWGetCSS( GetClassName(oSubmit), CSS_BUTTON_FOCAL ) )

	@ IF(nRemoteType == REMOTE_HTML, 143, 145),220 BUTTON oCancel PROMPT STR0012 OF oDlg SIZE 050,012 ; //"Cancelar"
	ACTION( lSubmit := .F., oDlg:End() ) PIXEL

	If lNoEndDate
		oEndNo:lReadOnly := .T.
		oEnd:lReadOnly := .T.

		lEndNo := .T.
		lEnd := .F.
	EndIf

	ACTIVATE DIALOG oDlg CENTERED

	If lSubmit

		Do Case
		Case nPeriod == 1		// Diario
			cRet := DIARY+"("
			cRet += "Each(" + If( lDEach,  ".T.", ".F." ) + ");"
			cRet += "Day(" + AllTrim(Str(nDDay)) + ");"
			cRet += "EveryDay(" + If( lDEvery, ".T.", ".F." ) + ");"
		Case nPeriod == 2		// Semanal
			cRet := WEEKLY+"("
			For nX := 1 To Len(aWeek)
				cRet += If( aWeek[nX], ".T.", ".F." )
			Next nX
		Case nPeriod == 3		// Mensal
			cRet := MONTHLY+"("
			cRet += "Day(" + AllTrim(Str(nMDay)) + ");"
		Case nPeriod == 4		// Anual
			cRet := YEARLY+"("
			cRet += "Day(" + AllTrim(Str(nYDay)) + ");"
			cRet += "Month(" + cYMonth + ");"
		Case nPeriod == 5		// Sempre ativo
			cRet := ALWAYS
		EndCase

		If nPeriod != 5
			cRet += ");"
			// Nº de Execuções
			cRet += "Execs(" + cRExe + ");"
			// Intervalo de execuções
			cRet += "Interval(" + cRInter + ");"

			If !lEndNo
				cRet += "End(" + DTOS( dEndDay ) + ");"
			EndIf
		EndIf

		If lLate
			cRet += "Discard;"
		EndIf


	Else
		Return cPeriod
	EndIf

Return cRet
//-----------------------------------------------

Static Function updatePanels( nPeriod, aPanels )

	Local nX := 0

	For nX := 1 To Len(aPanels)

		If nX == nPeriod
			aPanels[nX]:show()
		Else
			aPanels[nX]:hide()
		EndIf

	Next nX

Return


Static Function CalcHora( nMinutoDia, nMinuto, nMinutoIntervalo, lAlerta, cHoraIn, cHoraIt, cVz )
	Local nHoraInicial 		:= 0
	Local nHoraFinal		:= 0
	Local nMinutoInicial	:= 0
	Local nMinutoFinal  	:= 0
	Local nExecucao			:= 0
	Local lOk				:= .T.

	Default lAlerta			:= .T.

	//----------------------------------------------------
	// Desmembra os horários de agendamento em hora e minuto.
	//----------------------------------------------------
	nHoraInicial 	:= Val( SubStr( cHoraIn, 1, 2 ) )
	nMinutoInicial	:= Val( SubStr( cHoraIn, 4, 2 ) )
	nHoraFinal 		:= Val( SubStr( cHoraIt, 1, 2 ) )
	nMinutoFinal 	:= Val( SubStr( cHoraIt, 4, 2 ) )
	nExecucao 		:= Val( cVz ) - 1

	//----------------------------------------------------
	// Transforma a unidade de hora para minuto.
	//----------------------------------------------------
	nMinuto 			:= ( nHoraInicial * 60 ) + nMinutoInicial
	nMinutoIntervalo 	:= ( nHoraFinal * 60 ) 	+ nMinutoFinal
	nMinutoDia			:= 1440

	//----------------------------------------------------
	// Verifica se excederam as 24h diárias.
	//----------------------------------------------------
	If ( nMinutoDia < ( nMinuto + ( ( nExecucao ) * nMinutoIntervalo ) ) )
		If ( lAlerta )
			MsgAlert( STR0068, STR0016 ) //"Excederam as 24h diárias, não será possível executar a tarefa!"###"Atenção"
		EndIf
		Return .F.
	Endif
Return .T.

Static Function ValidVz( cVz, cHoraIn, cHoraIt, oHoraIt )

	Local	nVz
	Local	nHorasDia
	Local	nHoras
	Local	nHint

	nHorasDia :=0
	nHoras    :=0
	nHint     :=0

	If !( cVz $ "  " )
		nVz := Val( cVz )

		If ( nVz < 0 )
			MsgAlert( STR0069, STR0016 ) //"O número de execuções deve ser maior que 0!"###"Atenção"
			Return .F.
		ElseIf ( nVz < 2 )
			cHoraIt:="00:00"
			oHoraIt:Refresh()
		Else
			oHoraIt:SetFocus()
		EndIf
	Else
		MsgAlert( STR0069, STR0016 ) //"O número de execuções deve ser maior que 0!"###"Atenção"
		Return .F.
	EndIf

	If !CalcHora( @nHorasDia, @nHoras, @nHint, ,cHoraIn, cHoraIt, cVz )
		Return .F.
	EndIf

Return .T.

//-----------------------------------------------

Static Function ValidHora( cHoraIn, lCalc, cHoraIt, cVz )

	Local	nH
	Local	nM
	Local	nHorasDia
	Local	nHoras
	Local	nHint

	DEFAULT lCalc	:= .T.

	nHorasDia	:= 0
	nHoras		:= 0
	nHint		:= 0

	If ( " " $ cHoraIn )
		MsgAlert( STR0070, STR0016 ) //"Hora inválida!"###"Atenção"
		Return .F.
	EndIf

	nH := Val( SubStr( cHoraIn, 1, 2 ) )
	nM := Val( SubStr( cHoraIn, 4, 2 ) )

	If ( nH < 0 ) .Or. ( nM < 0 )
		MsgAlert( STR0070, STR0016 ) //"Hora inválida!"###"Atenção"
		Return .F.
	EndIf
	If ( nH > 23 ) .And. ( nM >= 0 )
		MsgAlert( STR0070, STR0016 ) //"Hora inválida!"###"Atenção"
		Return .F.
	EndIf
	If ( nH > 24 ) .Or. ( nM > 59 )
		MsgAlert( STR0070, STR0016 ) //"Hora inválida!"###"Atenção"
		Return .F.
	EndIf

	If ( lCalc )
		If !CalcHora( @nHorasDia, @nHoras, @nHint,,cHoraIn, cHoraIt, cVz )
			Return .T.
		EndIf
	EndIf

Return .T.

//-----------------------------------------------
Static Function SchVldInt( cHoraIt, cVz, cHoraIn )
	Local	nMinutos
	Local	nH
	Local	nM
	Local	nHorasDia
	Local	nHoras
	Local	nHint

	If ( " " $ cHoraIt )
		MsgAlert( STR0071, STR0016 ) //"Intervalo invalido"###"Atenção"
		Return .F.
	EndIf

	nH := Val( SubStr( cHoraIt, 1, 2 ) )
	nM := Val( SubStr( cHoraIt, 4, 2 ) )

	nMinutos := ( nH * 60 ) + nM

	If !CalcHora( @nHorasDia, @nHoras, @nHint, ,cHoraIn, cHoraIt, cVz )
		Return .F.
	EndIf
Return .T.

//-----------------------------------------------

Function FWSearchFunc(lEnableBtnP)

	Local oDlg
	Local oLabel
	Local oText
	Local oBtn1

	Local cFunction := Space(50)
	Local cReturn   := ""

	Local lOk := .F.

	DEFINE MSDIALOG oDlg FROM 00,00 TO 100,215 TITLE STR0081 PIXEL	//"Pesquisar Rotina" //"Pesquisar Rotina"

	@ 005, 005 SAY oLabel PROMPT STR0082 OF oDlg PIXEL SIZE oDlg:nWidth/2, 015	 //"Digite a rotina que deseja procurar:"
	@ 015, 005 GET oText VAR cFunction OF oDlg SIZE oDlg:nWidth/2-10, 010 PIXEL

	DEFINE SBUTTON oBtn1 FROM 030,063 TYPE 1 ENABLE OF oDlg ONSTOP "Ok - <Ctrl-O>" ACTION ( lOk := !Empty(cFunction), oDlg:End() )

	ACTIVATE MSDIALOG oDlg CENTER

	If ( lOk )
		MsgRun( STR0083,, {|| cReturn := chooseFun( cFunction,lEnableBtnP ) } ) //"Pesquisando rotina..."
	EndIf

Return cReturn

//-----------------------------------------------

Static Function chooseFun( cFunction, lEnableBtnP )

	Local aFunction := {}
	Local aValidFun := {}
	Local aParam    := {}

	Local cReturn := ""

	Local nX

	Local oDlg
	Local oBrowse

	aFunction := FindMenu( cFunction )

	If ( !Empty( aFunction ) )
		For nX := 1 to len(aFunction)
			aParam := FWSchdDef( aFunction[nX][2],@lEnableBtnP )
			If ( !Empty(aParam))
				aAdd(aValidFun,aFunction[nX])
			EndIf
		Next nX

		If ( Empty(aValidFun) )
			Alert(STR0084 + AllTrim(cFunction) + STR0085) //"Não foi encontrada a rotina "###" para o Schedule."
			Return cReturn
		ElseIf ( len(aValidFun) == 1 )
			cReturn := aValidFun[1][2]
			Return cReturn
		EndIf
	Else
		Alert(STR0084 + AllTrim(cFunction) + STR0085) //"Não foi encontrada a rotina "###" para o Schedule."
		Return cReturn
	EndIf

	DEFINE MSDIALOG oDlg FROM 00,00 TO 300,500 TITLE STR0086 + cFunction PIXEL	//"Rotina - " + cFunction //"Rotina - "

	@00,00 LISTBOX oBrowse FIELDS HEADER STR0087,STR0088 PIXEL SIZE 200,200	//"Descrição","Rotina" //"Descrição"###"Rotina"
	oBrowse:SetArray(aValidFun)
	oBrowse:bLine := {|| {aValidFun[oBrowse:nAt][1],aValidFun[oBrowse:nAt][2]}}
	oBrowse:Align := CONTROL_ALIGN_ALLCLIENT
	oBrowse:bLDblClick := {|| cReturn := aValidFun[oBrowse:nAt][2], oDlg:End() }

	//DEFINE SBUTTON oBtn1 FROM 030,063 TYPE 1 ENABLE OF oDlg ONSTOP "Ok - <Ctrl-O>" ACTION ( lOk := .T., oDlg:End() )

	ACTIVATE MSDIALOG oDlg CENTER

Return cReturn

Static Function TabExec( lShow, cHoraIn, cHoraIt, cVz, aHora, oList )

	Local	nHour   := ( Val( SubStr( cHoraIn, 1, 2 ) ) * 60 ) + Val( SubStr( cHoraIn, 4, 2 ) )
	// Local	nInterv := ( Val( SubStr( cHoraIt, 1, 2 ) ) * 60 ) + Val( SubStr( cHoraIt, 4, 2 ) )
	// Local	nVz		:= Val(cVz)
	// Local	i  		:= 0
	// DEFAULT lShow := .T.
	//  If ( CalcHora(,,,.F.,cHoraIn, cHoraIt, cVz) )
	//      aHora := {}
	//      //---------------------------------------------
	//      // Define a hora das execuções.
	//      //---------------------------------------------
	//  	For i := 1  To nVz
	//  		nHoras := nHour + ( ( i - 1 ) * nInterv )
	//  		Aadd( aHora, Str( i,4 ) +"  "+ StrZero( Int( nHoras/60 ), 2 ) + ":" + StrZero( Mod( nHoras,60 ), 2))
	//  	Next
	//      //---------------------------------------------
	//      // Monta a listagem de execuções.
	//      //---------------------------------------------
	//  	oList:SetItems(aHora)
	//  	oList:Refresh()
	//  	If ( lShow )
	//  		oList:Show()
	//  	Endif
	//  EndIf
	Retun
