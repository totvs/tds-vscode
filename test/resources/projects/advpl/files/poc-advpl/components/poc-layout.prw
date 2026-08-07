#include 'protheus.ch'

#define SAY_ROW(x) (015 * (x))

#define SAY_COL_GROUP 005
#define SAY_COL 010
#define SAY_COL_VALUE (SAY_COL + 160)
#define SAY_COL_EXPECTED (SAY_COL + 220)

#define GET_COL 160
#define GET_COL_2 (GET_COL + 160)

// Direções disponívels para o parâmetro nDirection do construtor e da respectiva propriedade
#define LAYOUT_LINEAR_L2R 0 // LEFT TO RIGHT
#define LAYOUT_LINEAR_R2L 1 // RIGHT TO LEFT
#define LAYOUT_LINEAR_T2B 2 // TOP TO BOTTOM
#define LAYOUT_LINEAR_B2T 3 // BOTTOM TO TOP

// Definições de alinhamento específicas para o parâmetro nAlign do método addInLayout
#define LAYOUT_ALIGN_LEFT     1
#define LAYOUT_ALIGN_RIGHT    2
#define LAYOUT_ALIGN_HCENTER  4
#define LAYOUT_ALIGN_TOP      32
#define LAYOUT_ALIGN_BOTTOM   64
#define LAYOUT_ALIGN_VCENTER  128

user function layout()
	local aOption := {;
		{"TFlowLayout (Margin: 0px)", { |aoParent| layout_01(aoParent, 0) }},;
		{"TFlowLayout (Margin:15px)", { |aoParent| layout_01(aoParent, 15) }},;
		{"TGridLayout (Margin: 0px)", { |aoParent| layout_02(aoParent, 0) }},;
		{"TGridLayout (Margin:15px)", { |aoParent| layout_02(aoParent, 15) }},;
		{"TLimearLayout (Margin: 0px)", { |aoParent| layout_03(aoParent, 0) }},;
		{"TLimearLayout (Margin:15px)", { |aoParent| layout_03(aoParent, 15) }},;
		{"Nested (Margin: 0px)", { |aoParent| layout_04(aoParent, 0) }},;
		{"Nested (Margin: 15px)", { |aoParent| layout_04(aoParent, 15) }},;
		}

	u_selectTest("Layout", aOption, 1200)
return

static function layout_01(aoParent, anMargin)
	local oWSpaceFolder
	local oWSpace1

	oWSpaceFolder := TWorkspaceFolder():New(aoParent, 0, 0, 325, 350)
	oWSpaceFolder:align := CONTROL_ALIGN_ALLCLIENT
	oWSpaceFolder:SetCSS("QWidget { margin-top: 12px }")

	oWSpace1 := TWorkSpace():New("TFlowLayout", oWSpaceFolder)
	oWSpace1:SetStatusBarText("Status bar text 01")

	createFlowLayout(oWSpaceFolder, anMargin)

return

static function layout_02(aoParent, anMargin)
	local oWSpaceFolder
	local oWSpace1

	oWSpaceFolder := TWorkspaceFolder():New(aoParent, 0, 0, 325, 350)
	oWSpaceFolder:align := CONTROL_ALIGN_ALLCLIENT
	oWSpaceFolder:SetCSS("QWidget { margin-top: 12px }")

	oWSpace1 := TWorkSpace():New("TGridLayout", oWSpaceFolder)
	oWSpace1:SetStatusBarText("Status bar text 01")

	createGridLayout(oWSpaceFolder, anMargin)

return

static function layout_03(aoParent, anMargin)
	local oWSpaceFolder
	local oWSpace1

	oWSpaceFolder := TWorkspaceFolder():New(aoParent, 0, 0, 325, 350)
	oWSpaceFolder:align := CONTROL_ALIGN_ALLCLIENT
	oWSpaceFolder:SetCSS("QWidget { margin-top: 12px }")

	oWSpace1 := TWorkSpace():New("TLinearLayout", oWSpaceFolder)
	oWSpace1:SetStatusBarText("Status bar text 01")

	createLinearLayout(oWSpaceFolder, anMargin)

return

static function layout_04(aoParent, anMargin)
	local oWSpaceFolder
	local oWSpace1

	oWSpaceFolder := TWorkspaceFolder():New(aoParent, 0, 0, 325, 350)
	oWSpaceFolder:align := CONTROL_ALIGN_ALLCLIENT
	oWSpaceFolder:SetCSS("QWidget { margin-top: 12px }")

	oWSpace1 := TWorkSpace():New("Nested", oWSpaceFolder)
	oWSpace1:SetStatusBarText("Status bar text 01")

	createNestedLayout(oWSpaceFolder, anMargin)

return

static function createFlowLayout(aoParent, anMargin)
	local oDlg
	local cTexto1
	local cTexto2
	local cTexto3
	local oLayout1
	local oTButton1
	local oTButton2
	local oTButton3
	local oTButton4
	local oTButton5
	local oTButton6
	local oTMultiget1
	local oTMultiget2
	local oTMultiget3

	define dialog oDlg;
		title "Dialog (Margin: "+cValToChar(anMargin)+")";
		from 0, 0 to 300, 500;
		pixel

	oDlg:SetCSS("QWidget { border: 2px dashed red }")

	oLayout1:= TFlowLayout():new(oDlg,CONTROL_ALIGN_ALLCLIENT,0,0)
	oLayout1:SetColor(,CLR_BLUE)
	if anMargin > 0
		oLayout1:setCss("margin: "+cValToChar(anMargin)+"px")
	endif

	oTButton1 := TButton():New( 0, 0, "Button 01", oLayout1,{||alert("Button 01")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:AddInLayout(oTButton1)
	oTButton2 := TButton():New( 0, 0, "Button 02", oLayout1,{||alert("Button 02")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:AddInLayout(oTButton2)
	oTButton3 := TButton():New( 0, 0, "Button 03", oLayout1,{||alert("Button 03")}, 80,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:AddInLayout(oTButton3)
	oTButton4 := TButton():New( 0, 0, "Button 04", oLayout1,{||alert("Button 04")}, 80,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:AddInLayout(oTButton4)
	oTButton5 := TButton():New( 0, 0, "Button 05", oLayout1,{||alert("Button 05")}, 40,20,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:AddInLayout(oTButton5)
	oTButton6 := TButton():New( 0, 0, "Button 06", oLayout1,{||alert("Button 06")}, 40,20,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:AddInLayout(oTButton6)

	cTexto1 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oTMultiget1 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto1 := u, cTexto1 ) }, oLayout1, 50, 50,,,,,,.T. )
	oLayout1:AddInLayout(oTMultiget1)

	cTexto2 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oTMultiget2 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto2 := u, cTexto2 ) }, oLayout1, 50, 50,,,,,,.T. )
	oLayout1:AddInLayout(oTMultiget2)

	cTexto3 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oTMultiget3 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto3 := u, cTexto3 ) }, oLayout1, 100, 80,,,,,,.T. )
	oLayout1:AddInLayout(oTMultiget3)

	//activate dialog oDlg
	//oDlg:Activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,,,,, oDlg:bRClicked, )
	//4o param, centered, padrão é .T.

	//activate dialog oDlg centered
	//oDlg:Activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted, .T.,,,, oDlg:bRClicked, )

	oDlg:activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,.F.,,,, oDlg:bRClicked, )

return

static function createGridLayout(aoParent, anMargin)
	local oDlg
	local cTexto1
	local cTexto2
	local cTexto3
	local oLayout1
	local oTButton1
	local oTButton2
	local oTButton3
	local oTButton4
	local oTButton5
	local oTButton6
	local oTMultiget1
	local oTMultiget2
	local oTMultiget3

	define dialog oDlg;
		title "Dialog (Margin: "+cValToChar(anMargin)+")";
		from 0, 0 to 300, 500;
		pixel

	oDlg:SetCSS("QWidget { border: 2px dashed red }")

	oLayout1 := TGridLayout():new(oDlg,CONTROL_ALIGN_ALLCLIENT,0,0)
	oLayout1:SetColor(,CLR_BLUE)
	if anMargin > 0
		oLayout1:setCss("margin: "+cValToChar(anMargin)+"px")
	endif

	oTButton1 := TButton():New( 0, 0, "Button 01", oLayout1,{||alert("Button 01")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton1, 1, 1)
	oTButton2 := TButton():New( 0, 0, "Button 02", oLayout1,{||alert("Button 02")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton2, 1, 2)
	oTButton3 := TButton():New( 0, 0, "Button 03", oLayout1,{||alert("Button 03")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton3, 1, 3)

	oTButton4 := TButton():New( 0, 0, "Button 04", oLayout1,{||alert("Button 04")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton4, 2, 1)
	oTButton5 := TButton():New( 0, 0, "Button 05", oLayout1,{||alert("Button 05")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton5, 2, 2)
	oTButton6 := TButton():New( 0, 0, "Button 06", oLayout1,{||alert("Button 06")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton6, 2, 3)

	oTButton7 := TButton():New( 0, 0, "Button 07", oLayout1,{||alert("Button 07")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton7, 3, 1)
	oTButton8 := TButton():New( 0, 0, "Button 08", oLayout1,{||alert("Button 08")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton8, 3, 2)
	oTButton9 := TButton():New( 0, 0, "Button 09", oLayout1,{||alert("Button 09")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton9, 3, 3)

	oTButton10 := TButton():New( 0, 0, "Button 10", oLayout1,{||alert("Button 10")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton10, 4, 1)
	oTButton11 := TButton():New( 0, 0, "Button 11", oLayout1,{||alert("Button 11")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton11, 4, 2)
	oTButton12 := TButton():New( 0, 0, "Button 12", oLayout1,{||alert("Button 12")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton12, 4, 3)

	cTexto1 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oTMultiget1 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto1 := u, cTexto1 ) }, oLayout1, 50, 50,,,,,,.T. )
	oLayout1:AddInLayout(oTMultiget1, 5, 1)

	cTexto2 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oTMultiget2 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto2 := u, cTexto2 ) }, oLayout1, 50, 50,,,,,,.T. )
	oLayout1:AddInLayout(oTMultiget1, 5, 2)

	cTexto3 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oTMultiget3 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto3 := u, cTexto3 ) }, oLayout1, 100, 80,,,,,,.T. )
	oLayout1:AddInLayout(oTMultiget1, 5, 3)

	oDlg:activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,.F.,,,, oDlg:bRClicked, )

return

static function createLinearLayout(aoParent, anMargin)
	local oDlg
	local oLayout1
	local oLayout2
	local oLayout3
	local oLayout4
	local oLayout5
	local oTButton1
	local oTButton2
	local oTButton3
	local oTButton4
	local oTButton5
	local oTButton6
	local oTButton7
	local oTButton8
	local oTButton9
	local oTButton10
	local oTButton11
	local oTButton12
	local oTButton13
	local oTButton14
	local oTButton15

	define dialog oDlg;
		title "Dialog (Margin: "+cValToChar(anMargin)+")";
		from 0, 0 to 300, 500;
		pixel

	oDlg:SetCSS("QWidget { border: 2px dashed red }")

	oLayout1 := TLinearLayout():new(oDlg,CONTROL_ALIGN_ALLCLIENT,0,0)
	oLayout1:SetColor(,CLR_BLUE)
	if anMargin > 0
		oLayout1:setCss("margin: "+cValToChar(anMargin)+"px")
	endif

	oLayout1:= TLinearLayout():New(oDlg,LAYOUT_LINEAR_T2B,CONTROL_ALIGN_TOP,0,60)
	oLayout1:SetColor(,CLR_BLUE)
	oTButton1 := TButton():New( 0, 0, "Button 01", oLayout1,{||alert("Button 01")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton2 := TButton():New( 0, 0, "Button 02", oLayout1,{||alert("Button 02")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton3 := TButton():New( 0, 0, "Button 03", oLayout1,{||alert("Button 03")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton1)
	oLayout1:addInLayout(oTButton2)
	oLayout1:addInLayout(oTButton3)

	oLayout2:= tLinearLayout():New(oDlg,LAYOUT_LINEAR_L2R,CONTROL_ALIGN_RIGHT,100,0)
	oLayout2:SetColor(,CLR_RED)
	oTButton4 := TButton():New( 0, 0, "Button 04", oLayout2,{||alert("Button 04")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton5 := TButton():New( 0, 0, "Button 05", oLayout2,{||alert("Button 05")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton6 := TButton():New( 0, 0, "Button 06", oLayout2,{||alert("Button 06")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout2:addInLayout(oTButton4,LAYOUT_ALIGN_TOP)
	oLayout2:addInLayout(oTButton5,LAYOUT_ALIGN_VCENTER)
	oLayout2:addInLayout(oTButton6,LAYOUT_ALIGN_BOTTOM)

	oLayout3:= tLinearLayout():New(oDlg,LAYOUT_LINEAR_B2T,CONTROL_ALIGN_LEFT,100,0)
	oLayout3:SetColor(,CLR_GREEN)
	oTButton7 := TButton():New( 0, 0, "Button 07", oLayout3,{||alert("Button 07")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton8 := TButton():New( 0, 0, "Button 08", oLayout3,{||alert("Button 08")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton9 := TButton():New( 0, 0, "Button 09", oLayout3,{||alert("Button 09")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout3:addInLayout(oTButton7)
	oLayout3:addInLayout(oTButton8)
	oLayout3:addInLayout(oTButton9)

	oLayout4:= tLinearLayout():New(oDlg,LAYOUT_LINEAR_R2L,CONTROL_ALIGN_BOTTOM,0,60)
	oLayout4:SetColor(,CLR_YELLOW)
	oTButton10 := TButton():New( 0, 0, "Button 10", oLayout4,{||alert("Button 10")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton11 := TButton():New( 0, 0, "Button 11", oLayout4,{||alert("Button 11")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton12 := TButton():New( 0, 0, "Button 12", oLayout4,{||alert("Button 12")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout4:addInLayout(oTButton10,,60)
	oLayout4:addInLayout(oTButton11,,30)
	oLayout4:addInLayout(oTButton12,,10)

	oLayout5:= tLinearLayout():New(oDlg,LAYOUT_LINEAR_T2B,CONTROL_ALIGN_ALLCLIENT,0,60)
	oLayout5:SetColor(,CLR_BLACK)
	oTButton13 := TButton():New( 0, 0, "Button 13", oLayout5,{||alert("Button 13")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton14 := TButton():New( 0, 0, "Button 14", oLayout5,{||alert("Button 14")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton15 := TButton():New( 0, 0, "Button 15", oLayout5,{||alert("Button 15")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout5:addInLayout(oTButton13)
	oLayout5:addInLayout(oTButton14)
	oLayout5:addInLayout(oTButton15)
	oLayout5:addSpacer(4)

	// cTexto1 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	// oTMultiget1 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto1 := u, cTexto1 ) }, oLayout1, 50, 50,,,,,,.T. )
	// oLayout1:AddInLayout(oTMultiget1, 5, 1)

	// cTexto2 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	// oTMultiget2 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto2 := u, cTexto2 ) }, oLayout1, 50, 50,,,,,,.T. )
	// oLayout1:AddInLayout(oTMultiget1, 5, 2)

	// cTexto3 := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	// oTMultiget3 := tMultiget():new( 0, 0, {| u | if( pCount() > 0, cTexto3 := u, cTexto3 ) }, oLayout1, 100, 80,,,,,,.T. )
	// oLayout1:AddInLayout(oTMultiget1, 5, 3)

	oDlg:activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,.F.,,,, oDlg:bRClicked, )

return

static function createNestedLayout(aoParent, anMargin)
	local oDlg
	local oTButton1
	local oTButton2
	local oTButton3
	local oTButton4
	local  oMainLayout
	local oHeaderPnl
	local oHeaderLyt
	local oTFont
	local oSayHeader
	local oMenuPnl
	local oCenterPnl
	local oQuestPnl
	local oMenuLyt
	local oCenterLyt

	define dialog oDlg;
		title "Dialog (Margin: "+cValToChar(anMargin)+")";
		from 0, 0 to 300, 500;
		pixel

	oDlg:SetCSS("QWidget { border: 2px dashed red }")

	// --------------------------------------------------------------------------------------------------------
	// Cria o layout principal que comportará todos os layouts e componentes da tela
	oMainLayout := tGridLayout():New(oDlg, CONTROL_ALIGN_ALLCLIENT, 0, 0)

	// --------------------------------------------------------------------------------------------------------
	// Cria o frame do cabeçalho
	// Cria um TPanel intermediário para comportar um TAlignLayout com o conteúdo
	oHeaderPnl := tPanel():New(0,0,,oMainLayout,,.T.,,,CLR_LIGHTGRAY,0,60)
	oHeaderPnl:SetCSS("QFrame{ background-color: #9933cc; margin: 5px; }")
	oMainLayout:addInLayout(oHeaderPnl, 1, 1, ,3)
	oMainLayout:AddSpacer(1,,15)
	oHeaderLyt := tLinearLayout():New(oHeaderPnl, LAYOUT_LINEAR_L2R, CONTROL_ALIGN_ALLCLIENT, 0, 0)
	oTFont := TFont():New('Lucida Sans',,16,.T.)
	oSayHeader := TSay():New(0,0,{||"<H1>T&iacute;tulo</H1>"},oHeaderLyt,,oTFont,,,,.T.,CLR_WHITE,,0,0,,,,,,.T.)
	oHeaderLyt:addInLayout(oSayHeader, LAYOUT_ALIGN_VCENTER)
	oHeaderLyt:AddSpacer(2, 1)

	// --------------------------------------------------------------------------------------------------------
	// Cria o frame central
	// Segmenta o frame central em três partes, usando TPanel para esse fim. Cada TPanel será o parent de um
	// TAlignLayout diferente que por sua vez será o container dos compontentes visuais.
	oMenuPnl := tPanel():New(0,0,,oMainLayout,,.T.,,,CLR_LIGHTGRAY,0,0)
	oCenterPnl := tPanel():New(0,0,,oMainLayout,,.T.,,,CLR_CYAN,0,0)
	oQuestPnl := tPanel():New(0,0,,oMainLayout,,.T.,,,CLR_BROWN,0,0)
	oMainLayout:addInLayout(oMenuPnl,2,1)
	oMainLayout:addInLayout(oCenterPnl,2,2)
	oMainLayout:addInLayout(oQuestPnl,2,3)
	oMainLayout:AddSpacer(2,,70)

	// No primeiro TPanel, cria o layout que comportará o menu lateral
	oMenuLyt := tLinearLayout():New(oMenuPnl, LAYOUT_LINEAR_T2B, CONTROL_ALIGN_ALLCLIENT, 0, 0)
	oMenuLyt:SetCSS("QFrame{ margin: 15px; } TButton{ background-color: #33b5e5; color: #ffffff; text-align: left; margin-bottom: 7px; font-size: 18px; }" )
	oTButton1 := TButton():New( 0, 0, "Button 01", oMenuLyt,{||conout("Button 01")}, 40,20,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton2 := TButton():New( 0, 0, "Button 02", oMenuLyt,{||conout("Button 02")}, 40,20,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton3 := TButton():New( 0, 0, "Button 03", oMenuLyt,{||conout("Button 03")}, 40,20,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton4 := TButton():New( 0, 0, "Button 04", oMenuLyt,{||conout("Button 05")}, 40,20,,,.F.,.T.,.F.,,.F.,,,.F. )
	oMenuLyt:addInLayout(oTButton1)
	oMenuLyt:addInLayout(oTButton2)
	oMenuLyt:addInLayout(oTButton3)
	oMenuLyt:addInLayout(oTButton4)
	oMenuLyt:AddSpacer(5)

	// No segundo TPanel, cria o layout que comportará o texto central
	oCenterLyt := tLinearLayout():New(oCenterPnl, LAYOUT_LINEAR_T2B, CONTROL_ALIGN_ALLCLIENT, 0, 0)
	oCenterLyt:SetCSS("QFrame{ margin: 15px; }")
	cCity := "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus pharetra turpis a tempor tempus. Vivamus sit amet eleifend ante, quis suscipit nulla. Morbi sollicitudin eleifend dapibus. Integer congue sapien quis augue dignissim sodales. Sed a sapien justo. Ut sodales nulla sed lacus sollicitudin, a dignissim magna convallis. Maecenas facilisis purus id aliquam tempus. Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oSayCenter := TSay():New(0,0,{|| cCity},oCenterLyt,,oTFont,,,,.T.,,,0,0,,,,,,.T.)
	oCenterLyt:addInLayout(oSayCenter)

	// No terceiro TPanel, cria o layout que comportará o texto à direita
	oQuestLyt := tLinearLayout():New(oQuestPnl, LAYOUT_LINEAR_T2B, CONTROL_ALIGN_ALLCLIENT, 0, 0)
	oQuestLyt:SetColor(,CLR_WHITE)
	oQuestLyt:SetCss("QFrame{ margin: 5px; }")
	cPerguntas := "<h1>Item 1</h1><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br><h1>Item 2</h1><br>Vivamus pharetra turpis a tempor tempus.<br><h1>Item 3</h1><br>Quisque tempus magna quis nunc ultrices, sit amet luctus ante facilisis."
	oSayQuest := TSay():New(0,0,{|| cPerguntas},oQuestLyt,,oTFont,,,,.T.,CLR_WHITE,CLR_HBLUE,0,0,,,,,,.T.)
	oSayQuest:SetCss("TSay{ qproperty-alignment: AlignCenter; background-color: #33b5e5; color: #ffffff; }")
	oQuestLyt:addInLayout(oSayQuest)

	// --------------------------------------------------------------------------------------------------------
	// Cria o frame do rodapé
	// Cria um TPanel intermediário para comportar um TAlignLayout com o conteúdo.
	oBottomPnl := tPanel():New(0,0,,oMainLayout,,.T.,,,CLR_LIGHTGRAY,0,40)
	oBottomPnl:SetCSS("QFrame{ background-color: #0099cc; color: #ffffff; margin: 5px; }")
	oMainLayout:addInLayout(oBottomPnl,3,1,,3)
	oMainLayout:AddSpacer(3,,15)
	oBottomLyt := tLinearLayout():New(oBottomPnl, LAYOUT_LINEAR_L2R, CONTROL_ALIGN_ALLCLIENT, 0, 0)
	oSayBottom:= TSay():New(0,0,{||"Redimensione a janela para ver como o conte&uacute;do responde ao redimensionamento."},oBottomLyt,,oTFont,,,,.T.,,,0,0,,,,,,.T.)
	oSayBottom:SetCss("TSay{ qproperty-alignment: AlignCenter; }")
	oBottomLyt:AddInLayout(oSayBottom)

	oDlg:activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,.F.,,,, oDlg:bRClicked, )
return
