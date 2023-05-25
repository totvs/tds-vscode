#INCLUDE "fwuischedulepersist.ch"
#INCLUDE "protheus.ch"
#INCLUDE "parmtype.ch"
#INCLUDE "fwschedule.ch"
#INCLUDE "fwbrowse.ch"

#DEFINE DESC_PTG '1'
#DEFINE DESC_SPA '2'
#DEFINE DESC_ENG '3'

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
	data cUserLogin as Char

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

RETURN



METHOD ClassName() CLASS FWUISchedulePersist
RETURN "FWUISchedulePersist"

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

	Cria layer do monitor de serviços
	If self:oFWLayer == Nil
		self:oFWLayer := FWLayer():New()
		self:oFWLayer:init( oOwner )

		Adiciona coluna no layer de serviços
		self:oFWLayer:addCollumn( "Sched", 100, .F. )

		Cria janelas dos serviços
		If lJustForm
			self:oFWLayer:addWindow( "Sched", "Detail", IIf(Upper(oOwner:ClassName())=="TDIALOG",STR0106,STR0107), 100, .F., .T., {||} ) "Detalhes"

			self:oPanelDetail := self:oFWLayer:getWinPanel( "Sched", "Detail" )
			self:oPanelDetail:readClientCoors()

			self:createDetail( lJustForm, @oFWVOSchedule , bExecute)
		Else
			self:oFWLayer:addWindow( "Sched", "Browse", STR0091, 060, .F., .F., {||} ) "Browse"
			self:oFWLayer:addWindow( "Sched", "Detail", STR0001, 040, .T., .F., {||} ) "Detalhes"

			self:oPanelBrowse := self:oFWLayer:getWinPanel( "Sched", "Browse" )
			self:oPanelBrowse:readClientCoors()
			self:oPanelDetail := self:oFWLayer:getWinPanel( "Sched", "Detail" )
			self:oPanelDetail:readClientCoors()

			self:createDetail()

			self:createBrowse()

		EndIf
	EndIf


RETURN

METHOD createBrowse() CLASS FWUISchedulePersist

	Local aBrowseConfig := {}
	Local aSeek := {{STR0002, STR0003, STR0093, STR0094}, ; "Nome do Usuário"###"Rotina"
	             {{SCHD_ID},{SCHD_USERID}, {SCHD_USERNAME}, {SCHD_FUNCTION}}}

//  	Local nX := 0

//  	Local oPanelBrw
//  	Local oBtnBarBrw    := FWButtonBar():new()

//  	 Adiciona barra de botões
//  	oBtnBarBrw:init( self:oPanelBrowse, 018, 015, CONTROL_ALIGN_TOP, .F., .T. )
//  	oBtnBarBrw:setBackGround( FWGetCSS( "", CSS_BAR_IMG_BG ), 000, 000, .T. )

//  	oBtnBarBrw:addBtnImage( "import_table", STR0095, ; "Importar agendamentos antigos"
//  	{|| MsgRun( STR0096,, {|| FWSchdImport(), self:updateSchedules(.T.), ; "Importando registros..."
//  	self:updateControls( VIEW ) } ) } ,, .T., CONTROL_ALIGN_LEFT )
//  	oBtnBarBrw:addBtnImage( "PMSRRFSH", STR0104, {|| self:updateSchedules(.T.) } ,, .T., CONTROL_ALIGN_LEFT ) "Atualizar"

//  	 Painel do Browse
//  	oPanelBrw  := TPanel():New( 000, 000,, self:oPanelBrowse)
//  	oPanelBrw:Align := CONTROL_ALIGN_ALLCLIENT

//  	aBrowseConfig := self:oFWCOSchedule:getBrowseConfig()

//  	aSeek := {{ STR0002, { { "", "C", 6, 0, STR0002, "@!" } }, 1, .T. },; "Código"
//  	{ STR0003, { { "", "C", 6, 0, STR0003, "@!" } }, 2, .T. }},;
//  			  { STR0105, { { "", "C", 6, 0, STR0105, "@!" } }, 3, .T. }}

//  	DEFINE FWBROWSE self:oBrowse DATA TABLE ALIAS "XX1" CHANGE {|| self:updateControls( VIEW ) } NO LOCATE SEEK ORDER aSeek ;
//  		FILTERDEFAULT "Alltrim( Upper( XX1_ENV ) ) == '" + Alltrim( Upper(GetEnvServer())) + "'" OF oPanelBrw

//  	self:oBrowse:SetProfileID("PersXX1")

//  	self:oBrowse:SetDBFFilter()
//  	self:oBrowse:SetUseFilter()

//  	ADD LEGEND DATA "XX1_STATUS == '"+SCHD_ACTIVE+"'"     COLOR "GREEN"  TITLE STR0024 OF self:oBrowse "Habilitado"
//  	ADD LEGEND DATA "XX1_STATUS == '"+SCHD_DEACTIVATE+"'" COLOR "RED"    TITLE STR0025 OF self:oBrowse "Desabilitado"
//  	ADD LEGEND DATA "XX1_STATUS == '"+SCHD_FINISHED+"'"   COLOR "GRAY"   TITLE STR0110 OF self:oBrowse "Finalizado"

//  	For nX := 1 To Len(aBrowseConfig[1])
//  		If Empty(aBrowseConfig[5][nX])
//  			ADD COLUMN oColumn DATA &("{|| "+aBrowseConfig[1][nX]+" }") TITLE aBrowseConfig[2][nX] SIZE aBrowseConfig[3][nX] OF self:oBrowse
//  		Else
//  			ADD COLUMN oColumn DATA &("{|| "+aBrowseConfig[5][nX]+" }") TITLE aBrowseConfig[2][nX] SIZE aBrowseConfig[3][nX] OF self:oBrowse
//  		EndIf
//  	Next nX

//  	ACTIVATE FWBROWSE self:oBrowse

RETURN
