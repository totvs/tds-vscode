#include 'protheus.ch'

#define SAY_ROW(x) (015 * x)
#define SAY_COL 010

#define NL chr(13)+chr(10)
#define LAYOUT_ALIGN_LEFT     1
#define LAYOUT_ALIGN_RIGHT    2
#define LAYOUT_ALIGN_HCENTER  4
#define LAYOUT_ALIGN_TOP      32
#define LAYOUT_ALIGN_BOTTOM   64
#define LAYOUT_ALIGN_VCENTER  128

/*
#xcommand DEFINE DIALOG <oDlg> ;
             [ <resource: NAME, RESNAME, RESOURCE> <cResName> ] ;
             [ TITLE <cTitle> ] ;
             [ FROM <nTop>, <nLeft> TO <nBottom>, <nRight> ] ;
             [ SIZE <nWidth>, <nHeight> ] ;
             [ <lib: LIBRARY, DLL> <hResources> ] ;
             [ <vbx: VBX> ] ;
             [ STYLE <nStyle> ] ;
             [ <color: COLOR, COLORS> <nClrText> [,<nClrBack> ] ] ;
             [ BRUSH <oBrush> ] ;
             [ <of: WINDOW, DIALOG, OF> <oWnd> ] ;
             [ <pixel: PIXEL> ] ;
             [ ICON <oIco> ] ;
             [ FONT <oFont> ] ;
             [ <help: HELP, HELPID> <nHelpId> ] ;
#xcommand ACTIVATE DIALOG <oDlg> ;
             [ <center: CENTER, CENTERED> ] ;
             [ <NonModal: NOWAIT, NOMODAL> ] ;
             [ WHEN <uWhen> ] ;
             [ VALID <uValid> ] ;
             [ ON [ LEFT ] CLICK <uClick> ] ;
             [ ON INIT <uInit> ] ;
             [ ON MOVE <uMoved> ] ;
             [ ON PAINT <uPaint> ] ;
             [ ON RIGHT CLICK <uRClicked> ]
*/

User Function dialog()
	//local aCoverages := {} //para teste de cobertura interna
	local aOption := {;
		{"Empty Dialog",  { |aoParent| dlg_01() }},;
		{"With Style",  { |aoParent| dlg_02(aoParent) }},;
		{"Maximized",  { |aoParent| dlg_03() }},;
		{"With Context Menu",  { || dlg_04() }},;
		{"Events",  { |aoParent| dlg_05() }},;
		{"Resizable Dialog (0 margin)", { |aoParent| dlg_06(aoParent, 0, .f.)} }, ;
		{"Resizable Dialog (15 margin)", { |aoParent| dlg_06(aoParent, 15, .t.)} }, ;
		{"MemoEdit", { |aoParent| dlg_07()} }, ;
		}
		//{"Resizable Dialog (5 margin)", { |aoParent| dlg_06(aoParent, 5, .f.)} }, ;

	//conout("PtInternal( 12, ON)")

	//PtInternal( 12, "ON" )
	u_selectTest("TDialog", aOption, 1200)
	//conout("PtInternal( 12, COVERAGE)")
	//aCoverages := PtInternal( 12, "COVERAGE")
	//varinfo("aCoverages", aCoverages)
	//conout("PtInternal( 12, OFF)")
	//PtInternal( 12, "OFF" )
return

static function dlg_01()
	local oDlg

	define dialog oDlg;
		title "Empty Dialog";
		from 180,180 to 550, 900 pixel //370

	activate dialog odlg centered
return

static function dlg_02(aoParent)
	local nStyle := 0
	local cStyle := ""
	local bStyles := { || ;
		nStyle := 0,;
		nStyle += iif(lWsPopup, WS_POPUP, 0),;
		nStyle += iif(lWsCaption, WS_CAPTION, 0),;
		nStyle += iif(lDsModalFrame, DS_MODALFRAME, 0),;
		nStyle += iif(lWsSysMenu, WS_SYSMENU, 0),;
		nStyle += iif(lDsWaitRunDlg, DS_WAITRUNDLG, 0),; //DS_WAITRUNDLG não definido
	nStyle += iif(lWsThickframe, WS_THICKFRAME, 0),;
		nStyle;
		}
	local bText := { || ;
		cStyle := "",;
		cStyle += iif(lWsPopup, "WS_POPUP+", ""),;
		cStyle += iif(lWsCaption, "WS_CAPTION+", ""),;
		cStyle += iif(lDsModalFrame, "DS_MODALFRAME+", ""),;
		cStyle += iif(lWsSysMenu, "WS_SYSMENU+", ""),;
		cStyle += iif(lDsWaitRunDlg, "DS_WAITRUNDLG", ""),;
		cStyle += iif(lWsThickframe, "WS_THICKFRAME", ""),;
		cStyle;
		}

	public lWsPopup := .f.
	public lWsCaption := .f.
	public lDsModalFrame := .f.
	public lWsSysMenu := .f.
	public lDsWaitRunDlg := .f.
	public lWsThickframe := .f.

	@SAY_ROW(1), SAY_COL say "Select the style options to apply:";
		of aoParent;
		pixel

	bNewCheckBox("lWsPopup", SAY_ROW(3), SAY_COL, "lWsPopup", aoParent)
	bNewCheckBox("lWsCaption", SAY_ROW(4), SAY_COL, "lWsCaption", aoParent)
	bNewCheckBox("lDsModalFrame", SAY_ROW(5), SAY_COL, "lDsModalFrame", aoParent)
	bNewCheckBox("lWsSysMenu", SAY_ROW(6), SAY_COL, "lWsSysMenu", aoParent)
	bNewCheckBox("lDsWaitRunDlg", SAY_ROW(7), SAY_COL, "lDsWaitRunDlg", aoParent):disable()
	bNewCheckBox("lWsThickframe", SAY_ROW(8), SAY_COL, "lWsThickframe", aoParent)

	TButton():New( SAY_ROW(14), 110, "Create Dialog",aoParent,{|| ;
		createdlg(eval(bStyles), eval(bText));
		},40,10,,,.F.,.T.,.F.,,.F.,,,.F. )

Return

static function bNewCheckBox(varName, row, column, label, oParent)
	local oCheckBox := TCheckBox():New(row, column, label,;
		{|u| If( PCount() == 0, &varName , &varName := u ) },;
		oParent, 100, 20,,,,,,,.F.,.T.,,.F., )

	oCheckBox:cName := varName
	oCheckBox:cReadVar := varName

return oCheckBox;

static function createdlg(anStyle, acStyle)
	local oDlg

	define dialog oDlg;
		title "With Style Apply";
		from 180,210 to 550, 900 pixel;
		style anStyle

	@SAY_ROW(1), SAY_COL say "With Style: " + acStyle pixel
	@SAY_ROW(2), SAY_COL say "With Style: " + str(anStyle)  pixel
	@SAY_ROW(3), SAY_COL say "Press ESC to close" pixel

	activate dialog oDlg centered

Return

static function dlg_03(aoParent)
	local oDlg
	local oBtn

	define dialog oDlg;
		title "Maximized Dialog";
		of aoParent;
		from 180,180 to 550, 900 pixel; //370

	@010, 010 say "Actual State: " + iif(oDlg:lMaximized, "Maximized", "Normal") pixel
	@035, 010 button oBtn;
		prompt "Toggle Maximized";
		action {|| oDlg:lMaximized  := !oDlg:lMaximized, oDlg:Refresh() };
		size 090, 020;
		of odlg pixel

	activate dialog odlg //centered
	//activate dialog odlg
	//odlg:Activate( odlg:bLClicked, odlg:bMoved, odlg:bPainted,,,,, odlg:bRClicked, )
	//4o param, centered, padrão é .T.

	//activate dialog odlg centered
	//odlg:Activate( odlg:bLClicked, odlg:bMoved, odlg:bPainted, .T.,,,, odlg:bRClicked, )

Return

static function dlg_04()
	local oDlg
	local oMenu
	local oTMenuIte1
	local oTMenuIte2
	local oTMenuIte3

	define dialog oDlg;
		title "With Context Menu";
		from 180,180 to 550, 900 pixel //370

	oMenu := TMenu():New(0,0,0,0,.T.)
	oTMenuIte1 := TMenuItem():New(oDlg,"TMenuItem 01",,,,{|| conout("TMenuItem 01") },,,,,,,,,.T.)
	oTMenuIte2 := TMenuItem():New(oDlg,"TMenuItem 02",,,,{|| conout("TMenuItem 02") },,,,,,,,,.T.)
	oTMenuIte3 := TMenuItem():New(oDlg,"TMenuItem 03",,,,{|| conout("TMenuItem 03") },,,,,,,,,.T.)
	oMenu:Add(oTMenuIte1)
	oMenu:Add(oTMenuIte2)
	oMenu:Add(oTMenuIte3)

	//oDlg:setPopupMenu(oMenu) //não existe o metodo setPopupMenu no TDialog

	@010, 010 say "Action dialog context menu"  pixel

	@020, 010 say "Alert: TDialog does not have the setpopupmenu method"  pixel

	activate dialog odlg centered

Return

static function dlg_05()
	local cFiredEvents := ""
	local lCanClose := .f.
	local oDlg
	local oEvents
	local oCanClose
	local oAlertBnt

	define dialog oDlg;
		title "Events";
		from 180,180 to 550, 900 pixel //370

	@020, 010 say "Fired Events:" pixel of oDlg

	@020, 080 get oEvents ;
		var cFiredEvents ;
		multiline;
		size 100, 100 ;
		readonly;
		of oDlg pixel
	oEvents:cName := "cFiredEvents"
	oEvents:cReadVar := "cFiredEvents"

	@130, 010 checkbox oCanClose ;
		var lCanClose;
		prompt "Can close now?";
		size 100, 20;
		of oDlg pixel
	oCanClose:cName := "lCanClose"
	oCanClose:cReadVar := "lCanClose"

	@130, 120 button oAlertBnt ;
		prompt "Show alert";
		size 100, 20;
		action {|| alert("Alerta acionado.")};
		of oDlg pixel

	oDlg:bGotFocus := {|| onGetFocus(oEvents)}
	oDlg:bHelp := {|| onHelp(oEvents)}
	oDlg:bLDblClick := {|| onLDblClick(oEvents)}
	oDlg:bLostFocus := {|| onLostFocus(oEvents)}
	oDlg:bFocusChange := {|o,focus| onFocusChange(oEvents, focus)}
	oDlg:bWindowState := {|o,state| onWindowState(oEvents, state )}

	activate dialog odlg ;
		centered;
		when doWhen(oEvents);
		valid doValid(oEvents, cFiredEvents, lCanClose);
		on click onCLick(oEvents);
		on init onInit(oEvents);
		on move onMove(oEvents);
		on paint onPaint(oEvents);
		on click onLCLick(oEvents);
		on right click onRCLick(oEvents)

Return

static function doWhen(aoEvents)
	aoEvents:appendText("When Fired"+NL)
return .T.

static function doValid(aoEvents, acFiredEvents, alCanClose)

	aoEvents:appendText("Valid Fired"+NL)

return alCanClose

static function onCLick(aoEvents)
	aoEvents:appendText("Click Fired"+NL)
return .T.

static function onInit(aoEvents)
	aoEvents:appendText("Init Fired"+NL)
return .T.

static function onMove(aoEvents)
	aoEvents:appendText("Move Fired"+NL)
return .T.

static function onPaint(aoEvents)
	aoEvents:appendText("Paint Fired"+NL)
return .T.

static function onRCLick(aoEvents)
	aoEvents:appendText("RClick Fired"+NL)
return .T.

static function onLCLick(aoEvents)
	aoEvents:appendText("LClick Fired"+NL)
return .T.

static function onGetFocus(aoEvents)
	aoEvents:appendText("GetFocus Fired"+NL)
return .T.

static function onFocusChange(aoEvents, focus)
	aoEvents:appendText("Dialog focus change: " + cValToChar(focus)+NL)
return .T.

static function onWindowState(aoEvents, state)
	aoEvents:appendText("Dialog window state: " + cValToChar(state)+NL)
return .T.

static function onHelp(aoEvents)
	aoEvents:appendText("Help Fired"+NL)
	alert("Help Fired")
return .T.

static function onLDbLClick(aoEvents)
	aoEvents:appendText("LDbLClick Fired"+NL)
return .T.

static function onLostFocus(aoEvents)
	aoEvents:appendText("LostFocus Fired"+NL)
return .T.

static function dlg_06(aoParent, anMargin, alBorder)
	local oDlg := aoParent
	local oWSpaceFolder
	local oWSpace1

	// define dialog oDlg;
		// 	title "TWorkSpace with Dialog";
		// 	from  0, 0 to 650, 800;
		// 	pixel

	oWSpaceFolder := TWorkspaceFolder():New(oDlg, 0, 0, 325, 350)
	oWSpaceFolder:align := CONTROL_ALIGN_ALLCLIENT

	oWSpace1 := TWorkSpace():New("Workspace 01", oWSpaceFolder)
	oWSpace1:SetStatusBarText("Status bar text 01")

	//não consegui fazer por solicitação
	// @SAY_ROW(2), SAY_COL button oBtn1;
		// 	prompt "Dialog Folder 1";
		// 	action {|| createDlgWS(oWSpace1, anMargin) };
		// 	size 090, 020;
		// 	of oWSpace1 pixel

	// activate dialog oDlg;
		// 	centered;
		// 	on init createDlgWS(anMargin, alBorder)
	createDlgWS(anMargin, alBorder)

return

static function createDlgWS(anMargin, alBorder)
	local oDlg
	local oLayout1
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

	define dialog oDlg;
		title "Dialog (Margin: "+cValToChar(anMargin)+")";
		from 110, 110 to 350, 400;
		pixel

	if (alBorder)
		oDlg:SetCSS("QWidget { border: 6px dashed red }")
	endif

	oLayout1:= tGridLayout():New(oDlg, CONTROL_ALIGN_ALLCLIENT,0,0)
	oLayout1:SetColor(,CLR_BLUE)
	if anMargin > 0
		oLayout1:setCss("margin: "+cValToChar(anMargin)+"px")
	endif

	oTButton1 := TButton():New( 0, 0, "Button 01", oLayout1,{||alert("Button 01")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton2 := TButton():New( 0, 0, "Button 02", oLayout1,{||alert("Button 02")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton3 := TButton():New( 0, 0, "Button 03", oLayout1,{||alert("Button 03")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton1, 1, 1, , ,LAYOUT_ALIGN_TOP)
	oLayout1:addInLayout(oTButton2, 1, 2, , ,LAYOUT_ALIGN_VCENTER)
	oLayout1:addInLayout(oTButton3, 1, 3, , ,LAYOUT_ALIGN_BOTTOM)

	oTButton4 := TButton():New( 0, 0, "Button 04", oLayout1,{||alert("Button 04")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton4, 2, 1, , 3)

	oTButton5 := TButton():New( 0, 0, "Button 05", oLayout1,{||alert("Button 05")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton6 := TButton():New( 0, 0, "Button 06", oLayout1,{||alert("Button 06")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton5, 3, 1, ,2)
	oLayout1:addInLayout(oTButton6, 3, 3)

	oTButton7 := TButton():New( 0, 0, "Button 07", oLayout1,{||alert("Button 07")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton8 := TButton():New( 0, 0, "Button 08", oLayout1,{||alert("Button 08")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton9 := TButton():New( 0, 0, "Button 09", oLayout1,{||alert("Button 09")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton7, 4, 1, , , LAYOUT_ALIGN_RIGHT)
	oLayout1:addInLayout(oTButton8, 4, 2, 2)
	oLayout1:addInLayout(oTButton9, 4, 3, , , LAYOUT_ALIGN_LEFT)

	oTButton10 := TButton():New( 0, 0, "Button 10", oLayout1,{||alert("Button 10")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton11 := TButton():New( 0, 0, "Button 11", oLayout1,{||alert("Button 11")}, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oLayout1:addInLayout(oTButton10, 5, 1)
	oLayout1:addInLayout(oTButton11, 5, 3)

	//activate dialog odlg //centered
	//activate dialog odlg
	//odlg:Activate( odlg:bLClicked, odlg:bMoved, odlg:bPainted,,,,, odlg:bRClicked, )
	//4o param, centered, padrão é .T.

	//activate dialog odlg centered
	//odlg:Activate( odlg:bLClicked, odlg:bMoved, odlg:bPainted, .T.,,,, odlg:bRClicked, )
	odlg:Activate( odlg:bLClicked, odlg:bMoved, odlg:bPainted, .F.,,,, odlg:bRClicked, )

return

static function dlg_07(aoParent)
	local cHeader := "Teste memoEdit"
	local lBitMap := .f.
	local cMacro := "cMemo"

	oWSpaceFolder := TWorkspaceFolder():New(aoParent,0,0,260,184)
	oWSpaceFolder:align := CONTROL_ALIGN_ALLCLIENT

	oWSpace1 := TWorkSpace():New("Workspace 01", oWSpaceFolder)
	oWSpace1:SetStatusBarText("Status bar text 01")

	public cMemo := "Teste de memoEdit"

	oMemoEdit := totvs.framework.ui.MemoEdit():New(cHeader, lBitMap)
	oMemoEdit:SetMacro(cMacro)
	oMemoEdit:SetOnlyView(.F.)
	oMemoEdit:setFieldSize(30)
	oMemoEdit:setCorretor(.f.)
	oMemoEdit:Show()

return
