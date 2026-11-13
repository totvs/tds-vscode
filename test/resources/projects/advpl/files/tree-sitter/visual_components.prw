// Non-functional sources. For testing purposes only.

#include "protheus.ch"
#include "folder.ch"
#include "ptmenu.ch"
#include "msgraphi.ch"

/*/{Protheus.doc} VisualComponents
Fixture dos componentes visuais (TDN "Componentes Visuais") declarados pela
sintaxe de COMANDO (#xcommand de protheus.ch, sigawin.ch, dialog.ch, font.ch,
folder.ch, ptmenu.ch e msgraphi.ch), com o maior numero de clausulas possivel.
As classes NAO sao usadas diretamente (ex.: TSay():New()).
@type user function
/*/
User Function VisualComponents()
	Local oFont
	Local oCursor
	Local oBrush
	Local oIcon
	Local oDlg
	Local oSay
	Local oMsGet
	Local oGet
	Local oMultiGet
	Local oButton
	Local oResButton
	Local oBtnBmp
	Local oCheckBox
	Local oComboBox
	Local oMsComboBox
	Local oListBox
	Local oBrowse
	Local oRadio
	Local oBitmap
	Local oRepository
	Local oGroup
	Local oMeter
	Local oScrollBar
	Local oScrollBox
	Local oPanel
	Local oFolder
	Local oTabs
	Local oGraphic
	Local oWorkTime
	Local oCalendGrid
	Local oIconCtrl
	Local oSButton
	Local oTimer
	Local oMenu
	Local oMenuItem
	Local oSeparator
	Local oBar
	Local oBarButton
	Local oMsgBar
	Local oMsgItem
	Local cName     := Space(40)
	Local cPassword := Space(20)
	Local cMemo     := ""
	Local lActive   := .T.
	Local cOption   := "1"
	Local cMsOption := "1"
	Local nItem     := 1
	Local nRadio    := 1
	Local nMeter    := 0
	Local aOptions  := {"1=First", "2=Second", "3=Third"}
	Local aBitmaps  := {"BMP1", "BMP2", "BMP3"}
	Local aFields   := {"A1_COD", "A1_NOME"}
	Local lConfirm  := .F.

	// TFont
	/* font.ch:
	   #xcommand DEFINE FONT <oFont> ;
	                [ NAME <cName> ] ;
	                [ SIZE <nWidth>, <nHeight> ] ;
	                [ <from:FROM USER> ] ;
	                [ <bold: BOLD> ] ;
	                [ <italic: ITALIC> ] ;
	                [ <underline: UNDERLINE> ] ;
	                [ WEIGHT <nWeight> ] ;
	                [ OF <oDevice> ] ;
	                [ NESCAPEMENT <nEscapement> ]
	*/
	DEFINE FONT oFont ;
		NAME "Arial" ;
		SIZE 0, -12 ;
		BOLD ;
		ITALIC ;
		UNDERLINE ;
		WEIGHT 700 ;
		NESCAPEMENT 0

	// Cursor, pincel e icone usados pelos componentes
	/* protheus.ch:
	   #xcommand DEFINE CURSOR <oCursor> ;
	        [ <resource: RESOURCE, RESNAME, NAME> <cResName> ] ;
	        [ <predef: ARROW, ICON, SIZENS, SIZEWE, SIZENWSE,;
	       SIZENESW, IBEAM, CROSS, SIZE, UPARROW, WAIT, HAND> ]
	*/
	DEFINE CURSOR oCursor ;
		RESOURCE "HAND" ;
		HAND
	/* protheus.ch:
	   #xcommand DEFINE BRUSH [ <oBrush> ] ;
	        [ STYLE <cStyle> ] ;
	        [ COLOR <nRGBColor> ] ;
	        [ <file:FILE,FILENAME,DISK> <cBmpFile> ] ;
	        [ <resource:RESOURCE,NAME,RESNAME> <cBmpRes> ]
	*/
	DEFINE BRUSH oBrush ;
		STYLE "SOLID" ;
		COLOR CLR_WHITE ;
		FILE "brush.bmp" ;
		RESOURCE "BRUSH"
	/* protheus.ch:
	   #xcommand DEFINE ICON <oIcon> ;
	        [ <resource: NAME, RESOURCE, RESNAME> <cResName> ] ;
	        [ <file: FILE, FILENAME, DISK> <cIcoFile> ] ;
	        [ WHEN <WhenFunc> ]
	*/
	DEFINE ICON oIcon ;
		RESOURCE "ICON" ;
		FILE "icon.ico" ;
		WHEN .T.

	// MSDialog
	/* sigawin.ch:
	   #xcommand DEFINE MSDIALOG <oDlg> ;
	                    [ <resource: NAME, RESNAME, RESOURCE> <cResName> ] ;
	                    [ TITLE <cTitle> ] ;
	                    [ FROM <nTop>, <nLeft> TO <nBottom>, <nRight> ] ;
	                    [ <lib: LIBRARY, DLL> <hResources> ] ;
	                    [ <vbx: VBX> ] ;
	                    [ STYLE <nStyle> ] ;
	                    [ <color: COLOR, COLORS> <nClrText> [,<nClrBack> ] ] ;
	                    [ BRUSH <oBrush> ] ;
	                    [ <of: WINDOW, DIALOG, OF> <oWnd> ] ;
	                    [ <pixel: PIXEL> ] ;
	                    [ ICON <oIco> ] ;
	                    [ FONT <oFont> ] ;
	                    [ <status: STATUS> ]
	*/
	DEFINE MSDIALOG oDlg ;
		RESOURCE "DLG" ;
		TITLE "Visual components" ;
		FROM 000, 000 TO 600, 800 ;
		LIBRARY 0 ;
		VBX ;
		STYLE 0 ;
		COLOR CLR_BLACK, CLR_WHITE ;
		BRUSH oBrush ;
		OF oMainWnd ;
		PIXEL ;
		ICON oIcon ;
		FONT oFont ;
		STATUS

	// TSay
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> SAY [ <oSay> <label: PROMPT,VAR > ] <cText> ;
	        [ PICTURE <cPict> ] ;
	        [ <dlg: OF,WINDOW,DIALOG > <oWnd> ] ;
	        [ FONT <oFont> ]  ;
	        [ <lCenter: CENTERED, CENTER > ] ;
	        [ <lRight:  RIGHT >  ] ;
	        [ <lBorder: BORDER > ] ;
	        [ <lPixel: PIXEL, PIXELS > ] ;
	        [ <color: COLOR,COLORS > <nClrText> [,<nClrBack> ] ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ <design: DESIGN >  ] ;
	        [ <update: UPDATE >  ] ;
	        [ <lShaded: SHADED, SHADOW > ] ;
	        [ <lBox:  BOX   >  ] ;
	        [ <lRaised: RAISED > ] ;
	        [ <lHtml: HTML > ]
	*/
	@ 005, 005 SAY oSay ;
		PROMPT "Name:" ;
		PICTURE "@!" ;
		OF oDlg ;
		FONT oFont ;
		CENTERED ;
		RIGHT ;
		BORDER ;
		PIXEL ;
		COLOR CLR_BLUE, CLR_WHITE ;
		SIZE 060, 010 ;
		DESIGN ;
		UPDATE ;
		SHADED ;
		BOX ;
		RAISED ;
		HTML

	// MsGet
	/* sigawin.ch:
	   #command @ <nRow>, <nCol> MSGET [ <oGet> VAR ] <uVar> ;
	                   [ <dlg: OF, WINDOW, DIALOG> <oWnd> ] ;
	                   [ PICTURE <cPict> ] ;
	                   [ VALID <ValidFunc> ] ;
	                   [ <color:COLOR,COLORS> <nClrFore> [,<nClrBack>] ] ;
	                   [ SIZE <nWidth>, <nHeight> ]    ;
	                   [ FONT <oFont> ] ;
	                   [ <design: DESIGN> ] ;
	                   [ CURSOR <oCursor> ] ;
	                   [ <pixel: PIXEL> ] ;
	                   [ MESSAGE <cMsg> ] ;
	                   [ <update: UPDATE> ] ;
	                   [ WHEN <uWhen> ] ;
	                   [ <lCenter: CENTER, CENTERED> ] ;
	                   [ <lRight: RIGHT> ] ;
	                   [ ON CHANGE <uChange> ] ;
	                   [ <readonly: READONLY, NO MODIFY> ] ;
	                   [ <pass: PASSWORD> ] ;
	                   [ F3 <cAlias> ];
	                   [ <lNoBorder: NO BORDER, NOBORDER> ] ;
	                   [ <help:HELPID, HELP ID> <nHelpId> ] ;
	                   [ <lHasButton: HASBUTTON> ]
	*/
	@ 005, 070 MSGET oMsGet VAR cName ;
		OF oDlg ;
		PICTURE "@!" ;
		VALID !Empty(cName) ;
		COLOR CLR_BLACK, CLR_WHITE ;
		SIZE 100, 010 ;
		FONT oFont ;
		DESIGN ;
		CURSOR oCursor ;
		PIXEL ;
		MESSAGE "Name" ;
		UPDATE ;
		WHEN .T. ;
		CENTER ;
		RIGHT ;
		ON CHANGE {|| .T.} ;
		READONLY ;
		PASSWORD ;
		F3 "SA1" ;
		NO BORDER ;
		HELPID 1 ;
		HASBUTTON

	// TGet
	/* protheus.ch:
	   #command @ <nRow>, <nCol> GET [ <oGet> VAR ] <uVar> ;
	       [ <dlg: OF, WINDOW, DIALOG> <oWnd> ] ;
	       [ PICTURE <cPict> ] ;
	       [ VALID <ValidFunc> ] ;
	       [ <color:COLOR,COLORS> <nClrFore> [,<nClrBack>] ] ;
	       [ SIZE <nWidth>, <nHeight> ]  ;
	       [ FONT <oFont> ] ;
	       [ <design: DESIGN> ] ;
	       [ CURSOR <oCursor> ] ;
	       [ <pixel: PIXEL> ] ;
	       [ MESSAGE <cMsg> ] ;
	       [ <update: UPDATE> ] ;
	       [ WHEN <uWhen> ] ;
	       [ <lCenter: CENTER, CENTERED> ] ;
	       [ <lRight: RIGHT> ] ;
	       [ ON CHANGE <uChange> ] ;
	       [ <readonly: READONLY, NO MODIFY> ] ;
	       [ <pass: PASSWORD> ] ;
	       [ <lNoBorder: NO BORDER, NOBORDER> ] ;
	       [ <help:HELPID, HELP ID> <nHelpId> ]
	*/
	@ 020, 005 GET oGet VAR cPassword ;
		OF oDlg ;
		PICTURE "@!" ;
		VALID .T. ;
		COLOR CLR_BLACK, CLR_WHITE ;
		SIZE 100, 010 ;
		FONT oFont ;
		DESIGN ;
		CURSOR oCursor ;
		PIXEL ;
		MESSAGE "Password" ;
		UPDATE ;
		WHEN .T. ;
		CENTER ;
		RIGHT ;
		ON CHANGE {|| .T.} ;
		READONLY ;
		PASSWORD ;
		NO BORDER ;
		HELPID 2

	// TMultiGet
	/* protheus.ch:
	   #command @ <nRow>, <nCol> GET [ <oGet> VAR ] <uVar> ;
	       [ <dlg: OF, WINDOW, DIALOG> <oWnd> ] ;
	       [ <memo: MULTILINE, MEMO, TEXT> ] ;
	       [ <color:COLOR,COLORS> <nClrFore> [,<nClrBack>] ] ;
	       [ SIZE <nWidth>, <nHeight> ] ;
	       [ FONT <oFont> ] ;
	       [ <hscroll: HSCROLL> ] ;
	       [ CURSOR <oCursor> ] ;
	       [ <pixel: PIXEL> ] ;
	       [ MESSAGE <cMsg> ] ;
	       [ <update: UPDATE> ] ;
	       [ WHEN <uWhen> ] ;
	       [ <lCenter: CENTER, CENTERED> ] ;
	       [ <lRight: RIGHT> ] ;
	       [ <readonly: READONLY, NO MODIFY> ] ;
	       [ VALID <uValid> ] ;
	       [ ON CHANGE <uChange> ] ;
	       [ <lDesign: DESIGN> ] ;
	       [ <lNoBorder: NO BORDER, NOBORDER> ] ;
	       [ <lNoVScroll: NO VSCROLL> ]
	*/
	@ 035, 005 GET oMultiGet VAR cMemo ;
		OF oDlg ;
		MULTILINE ;
		COLOR CLR_BLACK, CLR_WHITE ;
		SIZE 200, 040 ;
		FONT oFont ;
		HSCROLL ;
		CURSOR oCursor ;
		PIXEL ;
		MESSAGE "Memo" ;
		UPDATE ;
		WHEN .T. ;
		CENTER ;
		RIGHT ;
		READONLY ;
		VALID .T. ;
		ON CHANGE {|| .T.} ;
		DESIGN ;
		NO BORDER ;
		NO VSCROLL

	// TButton
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> BUTTON [ <oBtn> PROMPT ] <cCaption> ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ ACTION <uAction> ] ;
	        [ <default: DEFAULT> ] ;
	        [ <of:OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ <help:HELP, HELPID, HELP ID> <nHelpId> ] ;
	        [ FONT <oFont> ] ;
	        [ <pixel: PIXEL> ] ;
	        [ <design: DESIGN> ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <WhenFunc> ] ;
	        [ VALID <uValid> ] ;
	        [ <lCancel: CANCEL> ]
	*/
	@ 080, 005 BUTTON oButton ;
		PROMPT "&Confirm" ;
		SIZE 040, 012 ;
		ACTION (lConfirm := .T., oDlg:End()) ;
		DEFAULT ;
		OF oDlg ;
		HELP ID 3 ;
		FONT oFont ;
		PIXEL ;
		DESIGN ;
		MESSAGE "Confirm" ;
		UPDATE ;
		WHEN .T. ;
		VALID .T. ;
		CANCEL

	// TButton (bitmap de resource)
	/* sigawin.ch:
	   #xcommand @ <nRow>, <nCol> BUTTON [<oBtn>] RESOURCE [ <cResName1> [,<cResName2>] ] ;
	                    [ <file: FILE, FILENAME, DISK> <cBmpFile1> [,<cBmpFile2>] ] ;
	                    [ SIZE <nWidth>, <nHeight> ] ;
	                    [ ACTION <uAction,...> ] ;
	                    [ <of:OF, WINDOW, DIALOG> <oWnd> ] ;
	                    [ MESSAGE <cMsg> ] ;
	                    [ WHEN <uWhen> ] ;
	                    [ <adjust: ADJUST> ] ;
	                    [ UPDATE <lUpdate> ] ;
	                    [ <pixel: PIXEL> ]
	*/
	@ 080, 050 BUTTON oResButton ;
		RESOURCE "OK", "OK_DIS" ;
		FILE "ok.bmp", "ok_dis.bmp" ;
		SIZE 012, 012 ;
		ACTION MsgInfo("Resource button") ;
		OF oDlg ;
		MESSAGE "Resource" ;
		WHEN .T. ;
		ADJUST ;
		UPDATE .T. ;
		PIXEL

	// TBtnBmp
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> BTNBMP [<oBtn>] ;
	        [ <resource: NAME, RESNAME, RESOURCE> <cResName1> [,<cResName2>] ] ;
	        [ <file: FILE, FILENAME, DISK> <cBmpFile1> [,<cBmpFile2>] ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ ACTION <uAction,...> ] ;
	        [ <of:OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ WHEN <uWhen> ] ;
	        [ <adjust: ADJUST> ] ;
	        [ <lUpdate: UPDATE> ] ;
	        [ <lGroup: GROUP> ]
	*/
	@ 080, 070 BTNBMP oBtnBmp ;
		RESOURCE "OK", "OK_DIS" ;
		FILE "ok.bmp", "ok_dis.bmp" ;
		SIZE 025, 025 ;
		ACTION MsgInfo("BtnBmp") ;
		OF oDlg ;
		MESSAGE "BtnBmp" ;
		WHEN .T. ;
		ADJUST ;
		UPDATE ;
		GROUP

	// TCheckBox
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> CHECKBOX [ <oCbx> VAR ] <lVar> ;
	        [ PROMPT <cCaption> ] ;
	        [ <of:OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ <help:HELPID, HELP ID> <nHelpId> ] ;
	        [ FONT <oFont> ] ;
	        [ <change: ON CLICK, ON CHANGE> <uClick> ] ;
	        [ VALID   <ValidFunc> ] ;
	        [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack>] ] ;
	        [ <design: DESIGN> ] ;
	        [ <pixel: PIXEL> ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <WhenFunc> ]
	*/
	@ 100, 005 CHECKBOX oCheckBox VAR lActive ;
		PROMPT "Active" ;
		OF oDlg ;
		SIZE 060, 010 ;
		HELPID 4 ;
		FONT oFont ;
		ON CLICK {|| .T.} ;
		VALID .T. ;
		COLOR CLR_BLACK, CLR_WHITE ;
		DESIGN ;
		PIXEL ;
		MESSAGE "Active" ;
		UPDATE ;
		WHEN .T.

	// TComboBox
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> COMBOBOX [ <oCbx> VAR ] <cVar> ;
	        [ <items: ITEMS, PROMPTS> <aItems> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ <dlg:OF,WINDOW,DIALOG> <oWnd> ] ;
	        [ <help:HELPID, HELP ID> <nHelpId> ] ;
	        [ ON CHANGE <uChange> ] ;
	        [ VALID <uValid> ] ;
	        [ <color: COLOR,COLORS> <nClrText> [,<nClrBack>] ] ;
	        [ <pixel: PIXEL> ] ;
	        [ FONT <oFont> ] ;
	        [ <update: UPDATE> ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ WHEN <uWhen> ] ;
	        [ <design: DESIGN> ] ;
	        [ BITMAPS <acBitmaps> ] ;
	        [ ON DRAWITEM <uBmpSelect> ]
	*/
	@ 100, 070 COMBOBOX oComboBox VAR cOption ;
		ITEMS aOptions ;
		SIZE 060, 010 ;
		OF oDlg ;
		HELPID 5 ;
		ON CHANGE {|| .T.} ;
		VALID .T. ;
		COLOR CLR_BLACK, CLR_WHITE ;
		PIXEL ;
		FONT oFont ;
		UPDATE ;
		MESSAGE "Option" ;
		WHEN .T. ;
		DESIGN ;
		BITMAPS aBitmaps ;
		ON DRAWITEM {|| .T.}

	// TComboBox (MsComboBox)
	/* sigawin.ch:
	   #xcommand @ <nRow>, <nCol> MSCOMBOBOX [ <oCbx> VAR ] <cVar> ;
	                    [ <items: ITEMS, PROMPTS> <aItems> ] ;
	                    [ SIZE <nWidth>, <nHeight> ] ;
	                    [ <dlg:OF,WINDOW,DIALOG> <oWnd> ] ;
	                    [ <help:HELPID, HELP ID> <nHelpId> ] ;
	                    [ ON CHANGE <uChange> ] ;
	                    [ VALID <uValid> ] ;
	                    [ <color: COLOR,COLORS> <nClrText> [,<nClrBack>] ] ;
	                    [ <pixel: PIXEL> ] ;
	                    [ FONT <oFont> ] ;
	                    [ <update: UPDATE> ] ;
	                    [ MESSAGE <cMsg> ] ;
	                    [ WHEN <uWhen> ] ;
	                    [ <design: DESIGN> ] ;
	                    [ BITMAPS <acBitmaps> ] ;
	                    [ ON DRAWITEM <uBmpSelect> ]
	*/
	@ 100, 140 MSCOMBOBOX oMsComboBox VAR cMsOption ;
		ITEMS aOptions ;
		SIZE 060, 010 ;
		OF oDlg ;
		HELPID 6 ;
		ON CHANGE {|| .T.} ;
		VALID .T. ;
		COLOR CLR_BLACK, CLR_WHITE ;
		PIXEL ;
		FONT oFont ;
		UPDATE ;
		MESSAGE "Option" ;
		WHEN .T. ;
		DESIGN ;
		BITMAPS aBitmaps ;
		ON DRAWITEM {|| .T.}

	// TListBox
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> LISTBOX [ <oLbx> VAR ] <cnVar> ;
	        [ <items: ITEMS, PROMPTS> <aList>  ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ ON CHANGE <uChange> ] ;
	        [ ON [ LEFT ] DBLCLICK <uLDblClick> ] ;
	        [ <of: OF, WINDOW, DIALOG > <oWnd> ] ;
	        [ VALID <uValid> ] ;
	        [ <color: COLOR,COLORS> <nClrFore> [,<nClrBack>] ] ;
	        [ <pixel: PIXEL> ] ;
	        [ <design: DESIGN> ] ;
	        [ FONT <oFont> ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <uWhen> ] ;
	        [ BITMAPS <aBitmaps> ] ;
	        [ ON DRAWITEM <uBmpSelect> ] ;
	        [ <multi: MULTI, MULTIPLE, MULTISEL> ] ;
	        [ <sort: SORT> ] ;
	        [ ON RIGHT CLICK <uRClick> ]
	*/
	@ 115, 005 LISTBOX oListBox VAR nItem ;
		ITEMS aOptions ;
		SIZE 060, 040 ;
		ON CHANGE {|| .T.} ;
		ON DBLCLICK {|| .T.} ;
		OF oDlg ;
		VALID .T. ;
		COLOR CLR_BLACK, CLR_WHITE ;
		PIXEL ;
		DESIGN ;
		FONT oFont ;
		MESSAGE "Items" ;
		UPDATE ;
		WHEN .T. ;
		BITMAPS aBitmaps ;
		ON DRAWITEM {|| .T.} ;
		MULTI ;
		SORT ;
		ON RIGHT CLICK {|| .T.}

	// TWBrowse
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> LISTBOX [ <oBrw> ] FIELDS [<Flds,...>] ;
	         [ ALIAS <cAlias> ] ;
	         [ <sizes:FIELDSIZES, SIZES, COLSIZES> <aColSizes,...> ] ;
	         [ <head:HEAD,HEADER,HEADERS,TITLE> <aHeaders,...> ] ;
	         [ SIZE <nWidth>, <nHeigth> ] ;
	         [ <dlg:OF,DIALOG> <oDlg> ] ;
	         [ SELECT <cField> FOR <uValue1> [ TO <uValue2> ] ] ;
	         [ ON CHANGE <uChange> ] ;
	         [ ON [ LEFT ] CLICK <uLClick> ] ;
	         [ ON [ LEFT ] DBLCLICK <uLDblClick> ] ;
	         [ ON RIGHT CLICK <uRClick> ] ;
	         [ FONT <oFont> ] ;
	         [ CURSOR <oCursor> ] ;
	         [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack>] ] ;
	         [ MESSAGE <cMsg> ] ;
	         [ <update: UPDATE> ] ;
	         [ <pixel: PIXEL> ] ;
	         [ WHEN <uWhen> ] ;
	         [ <design: DESIGN> ] ;
	         [ VALID <uValid> ] ;
	         [ ACTION <uAction,...> ]
	*/
	@ 115, 070 LISTBOX oBrowse FIELDS aFields[1], aFields[2] ;
		ALIAS "SA1" ;
		FIELDSIZES 050, 100 ;
		HEADERS "Code", "Name" ;
		SIZE 200, 060 ;
		OF oDlg ;
		SELECT "A1_FILIAL" FOR xFilial("SA1") TO xFilial("SA1") ;
		ON CHANGE {|| .T.} ;
		ON CLICK {|| .T.} ;
		ON DBLCLICK {|| .T.} ;
		ON RIGHT CLICK {|| .T.} ;
		FONT oFont ;
		CURSOR oCursor ;
		COLOR CLR_BLACK, CLR_WHITE ;
		MESSAGE "Browse" ;
		UPDATE ;
		PIXEL ;
		WHEN .T. ;
		DESIGN ;
		VALID .T. ;
		ACTION {|| .T.}

	// TRadMenu
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> RADIO [ <oRadMenu> VAR ] <nVar> ;
	        [ <prm: PROMPT, ITEMS> <cItems,...> ] ;
	        [ <of: OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ <help:HELPID, HELP ID> <nHelpId,...> ] ;
	        [ <change: ON CLICK, ON CHANGE> <uChange> ] ;
	        [ COLOR <nClrFore> [,<nClrBack>] ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <uWhen> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ VALID <uValid> ] ;
	        [ <lDesign: DESIGN> ] ;
	        [ <lLook3d: 3D> ] ;
	        [ <lPixel: PIXEL> ]
	*/
	@ 180, 005 RADIO oRadio VAR nRadio ;
		ITEMS "Option 1", "Option 2", "Option 3" ;
		OF oDlg ;
		HELPID 7, 8, 9 ;
		ON CHANGE {|| .T.} ;
		COLOR CLR_BLACK, CLR_WHITE ;
		MESSAGE "Radio" ;
		UPDATE ;
		WHEN .T. ;
		SIZE 060, 030 ;
		VALID .T. ;
		DESIGN ;
		3D ;
		PIXEL

	// TBitmap
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> BITMAP [ <oBmp> ] ;
	        [ <resource: NAME, RESNAME, RESOURCE> <cResName> ] ;
	        [ <file: FILE, FILENAME, DISK> <cBmpFile> ] ;
	        [ <NoBorder:NOBORDER, NO BORDER> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ <of: OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ <lClick: ON CLICK, ON LEFT CLICK> <uLClick> ] ;
	        [ <rClick: ON RIGHT CLICK> <uRClick> ] ;
	        [ <scroll: SCROLL> ] ;
	        [ <adjust: ADJUST> ] ;
	        [ CURSOR <oCursor> ] ;
	        [ <pixel: PIXEL>   ] ;
	        [ MESSAGE <cMsg>   ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <uWhen> ] ;
	        [ VALID <uValid> ] ;
	        [ <lDesign: DESIGN> ]
	*/
	@ 180, 070 BITMAP oBitmap ;
		RESOURCE "LOGO" ;
		FILE "logo.bmp" ;
		NOBORDER ;
		SIZE 050, 050 ;
		OF oDlg ;
		ON CLICK {|| .T.} ;
		ON RIGHT CLICK {|| .T.} ;
		SCROLL ;
		ADJUST ;
		CURSOR oCursor ;
		PIXEL ;
		MESSAGE "Bitmap" ;
		UPDATE ;
		WHEN .T. ;
		VALID .T. ;
		DESIGN

	// TBitmap (repositorio de imagens)
	/* sigawin.ch:
	   #xcommand @ <nRow>, <nCol> REPOSITORY [ <oBmp> ] ;
	                    [ <resource: ENTRY, RESOURCE> <cResName> ] ;
	                    [ <NoBorder:NOBORDER, NO BORDER> ] ;
	                    [ SIZE <nWidth>, <nHeight> ] ;
	                    [ <of: OF, WINDOW, DIALOG> <oWnd> ] ;
	                    [ <lClick: ON CLICK, ON LEFT CLICK> <uLClick> ] ;
	                    [ <rClick: ON RIGHT CLICK> <uRClick> ] ;
	                    [ <scroll: SCROLL> ] ;
	                    [ <adjust: ADJUST> ] ;
	                    [ CURSOR <oCursor> ] ;
	                    [ <pixel: PIXEL>   ] ;
	                    [ MESSAGE <cMsg>   ] ;
	                    [ <update: UPDATE> ] ;
	                    [ WHEN <uWhen> ] ;
	                    [ VALID <uValid> ] ;
	                    [ <lDesign: DESIGN> ] ;
	                    [ <filename: FROM FILE> <cFileName> ]
	*/
	@ 180, 130 REPOSITORY oRepository ;
		RESOURCE "LOGO" ;
		NOBORDER ;
		SIZE 050, 050 ;
		OF oDlg ;
		ON CLICK {|| .T.} ;
		ON RIGHT CLICK {|| .T.} ;
		SCROLL ;
		ADJUST ;
		CURSOR oCursor ;
		PIXEL ;
		MESSAGE "Repository" ;
		UPDATE ;
		WHEN .T. ;
		VALID .T. ;
		DESIGN ;
		FROM FILE "logo.bmp"

	// TGroup
	/* protheus.ch:
	   #xcommand @ <nTop>, <nLeft> [ GROUP <oGroup> ] TO <nBottom>, <nRight > ;
	        [ <label:LABEL,PROMPT> <cLabel> ] ;
	        [ OF <oWnd> ] ;
	        [ COLOR <nClrFore> [,<nClrBack>] ] ;
	        [ <lPixel: PIXEL> ] ;
	        [ <lDesign: DESIGN> ]
	*/
	@ 240, 005 GROUP oGroup TO 290, 200 ;
		LABEL "Group" ;
		OF oDlg ;
		COLOR CLR_BLACK, CLR_WHITE ;
		PIXEL ;
		DESIGN

	// TMeter
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> METER [ <oMeter> VAR ] <nActual> ;
	       [ TOTAL <nTotal> ] ;
	       [ SIZE <nWidth>, <nHeight> ];
	       [ OF <oWnd> ] ;
	       [ <update: UPDATE > ] ;
	       [ <lPixel: PIXEL > ] ;
	       [ FONT <oFont> ] ;
	       [ PROMPT <cPrompt> ] ;
	       [ <lNoPercentage: NOPERCENTAGE > ] ;
	       [ <color: COLOR, COLORS> <nClrPane>, <nClrText> ] ;
	       [ BARCOLOR <nClrBar>, <nClrBText> ] ;
	       [ <lDesign: DESIGN> ]
	*/
	@ 245, 010 METER oMeter VAR nMeter ;
		TOTAL 100 ;
		SIZE 180, 010 ;
		OF oDlg ;
		UPDATE ;
		PIXEL ;
		FONT oFont ;
		PROMPT "Progress" ;
		NOPERCENTAGE ;
		COLOR CLR_WHITE, CLR_BLACK ;
		BARCOLOR CLR_GREEN, CLR_WHITE ;
		DESIGN

	// TScrollBar
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> SCROLLBAR [ <oSbr> ] ;
	        [ <h: HORIZONTAL> ] ;
	        [ <v: VERTICAL> ] ;
	        [ RANGE <nMin>, <nMax> ] ;
	        [ PAGESTEP <nPgStep> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ <up:UP, ON UP> <uUpAction> ] ;
	        [ <dn:DOWN, ON DOWN> <uDownAction> ] ;
	        [ <pgup:PAGEUP, ON PAGEUP> <uPgUpAction> ] ;
	        [ <pgdn:PAGEDOWN, ON PAGEDOWN> <uPgDownAction> ] ;
	        [ <pos: ON THUMBPOS> <uPos> ] ;
	        [ <pixel: PIXEL> ] ;
	        [ <color: COLOR,COLORS> <nClrText> [,<nClrBack>] ] ;
	        [ OF <oWnd> ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <uWhen> ] ;
	        [ VALID <uValid> ] ;
	        [ <lDesign: DESIGN> ]
	*/
	@ 260, 010 SCROLLBAR oScrollBar ;
		HORIZONTAL ;
		RANGE 0, 100 ;
		PAGESTEP 10 ;
		SIZE 180, 010 ;
		UP {|| .T.} ;
		DOWN {|| .T.} ;
		PAGEUP {|| .T.} ;
		PAGEDOWN {|| .T.} ;
		ON THUMBPOS {|| .T.} ;
		PIXEL ;
		COLOR CLR_BLACK, CLR_WHITE ;
		OF oDlg ;
		MESSAGE "Scroll" ;
		UPDATE ;
		WHEN .T. ;
		VALID .T. ;
		DESIGN

	// TScrollBox
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> SCROLLBOX [ <oSbr> ] ;
	        [ <h: HORIZONTAL> ] ;
	        [ <v: VERTICAL> ] ;
	        [ SIZE <nHeight>,<nWidth> ] ;
	        [ OF <oWnd> ] ;
	        [ <lBorder: BORDER> ]
	*/
	@ 300, 005 SCROLLBOX oScrollBox ;
		VERTICAL ;
		SIZE 060, 100 ;
		OF oDlg ;
		BORDER

	// TPanel
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> MSPANEL <oPanel> [ <label: PROMPT,VAR > <cText> ] ;
	        [ <dlg: OF,WINDOW,DIALOG > <oWnd> ] ;
	        [ FONT <oFont> ]  ;
	        [ <lCenter: CENTERED, CENTER > ] ;
	        [ <lRight:  RIGHT >  ] ;
	        [ <color: COLOR,COLORS > <nClrText> [,<nClrBack> ] ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ <lLowered: LOWERED >  ] ;
	        [ <lRaised: RAISED > ]
	*/
	@ 300, 110 MSPANEL oPanel ;
		PROMPT "Panel" ;
		OF oDlg ;
		FONT oFont ;
		CENTERED ;
		RIGHT ;
		COLOR CLR_BLACK, CLR_WHITE ;
		SIZE 100, 060 ;
		LOWERED ;
		RAISED

	// TFolder
	/* folder.ch:
	   #xcommand @ <nRow>, <nCol> FOLDER [<oFolder>] ;
	                [ <of: OF, WINDOW, DIALOG> <oWnd> ] ;
	                [ <prm: PROMPT, PROMPTS, ITEMS> <cPrompt,...> ] ;
	                [ <dlg: DIALOG, DIALOGS, PAGE, PAGES> <cDlgName1> [,<cDlgNameN>] ] ;
	                [ <lPixel: PIXEL> ] ;
	                [ <lDesign: DESIGN> ] ;
	                [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack>] ] ;
	                [ OPTION <nOption> ] ;
	                [ SIZE <nWidth>, <nHeight> ] ;
	                [ MESSAGE <cMsg> ]
	*/
	@ 300, 220 FOLDER oFolder ;
		OF oDlg ;
		PROMPT "Page 1", "Page 2" ;
		DIALOGS "PAGE1", "PAGE2" ;
		PIXEL ;
		DESIGN ;
		COLOR CLR_BLACK, CLR_WHITE ;
		OPTION 1 ;
		SIZE 150, 080 ;
		MESSAGE "Folder"

	// TTabs
	/* folder.ch:
	   #xcommand @ <nRow>, <nCol> TABS [<oTabs>] ;
	                [ <of: OF, WINDOW, DIALOG> <oWnd> ] ;
	                [ <prm: PROMPT, PROMPTS, ITEMS> <cPrompt,...> ] ;
	                [ <act: ACTION, EXECUTE> <uAction> ] ;
	                [ <lPixel: PIXEL> ] ;
	                [ <lDesign: DESIGN> ] ;
	                [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack>] ] ;
	                [ OPTION <nOption> ] ;
	                [ SIZE <nWidth>, <nHeight> ] ;
	                [ MESSAGE <cMsg> ]
	*/
	@ 390, 005 TABS oTabs ;
		OF oDlg ;
		PROMPT "Tab 1", "Tab 2" ;
		ACTION {|| .T.} ;
		PIXEL ;
		DESIGN ;
		COLOR CLR_BLACK, CLR_WHITE ;
		OPTION 1 ;
		SIZE 150, 015 ;
		MESSAGE "Tabs"

	// TMsGraphic
	/* msgraphi.ch:
	   #xcommand @ <nRow>, <nCol> MSGRAPHIC [<oMSGraphic>] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ FONT <oFont> ] ;
	         [ <of:OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack>] ]
	*/
	@ 390, 160 MSGRAPHIC oGraphic ;
		SIZE 150, 080 ;
		FONT oFont ;
		OF oDlg ;
		COLOR CLR_BLACK, CLR_WHITE

	// MsWorkTime
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> WORKTIME [ <oWorktime> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ RESOLUTION <nResolution> ] ;
	        [ VALUE <cValue> ] ;
	        [ <of:OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ WHEN <WhenFunc> ] ;
	        [ <change: ON CLICK, ON CHANGE> <uClick> ]
	*/
	@ 410, 005 WORKTIME oWorkTime ;
		SIZE 150, 020 ;
		RESOLUTION 4 ;
		VALUE "" ;
		OF oDlg ;
		WHEN .T. ;
		ON CHANGE {|| .T.}

	// MsCalendGrid
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> CALENDGRID [ <oCalendGrid> ] ;
	        [ SIZE <nWidth>, <nHeight> ] ;
	        [ DATEINI <dDataIni> ] ;
	        [ RESOLUTION <nResolution > ] ;
	        [ <of:OF, WINDOW, DIALOG> <oWnd> ];
	        [ WHEN <WhenFunc> ] ;
	        [ <change: ON CLICK> <uClick> ] ;
	        [ <change: ON RCLICK> <uRClick> ] ;
	        [ DEFCOLOR <nDefColor> ] ;
	        [ <lFillAll : FILLALLLINES > ]
	*/
	@ 440, 005 CALENDGRID oCalendGrid ;
		SIZE 200, 060 ;
		DATEINI Date() ;
		RESOLUTION 1 ;
		OF oDlg ;
		WHEN .T. ;
		ON CLICK {|| .T.} ;
		ON RCLICK {|| .T.} ;
		DEFCOLOR CLR_YELLOW ;
		FILLALLLINES

	// Icone
	/* protheus.ch:
	   #xcommand @ <nRow>, <nCol> ICON [ <oIcon> ] ;
	        [ <resource: NAME, RESOURCE, RESNAME> <cResName> ] ;
	        [ <file: FILE, FILENAME, DISK> <cIcoFile> ] ;
	        [ <border:BORDER> ] ;
	        [ ON CLICK <uClick> ] ;
	        [ <of: OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ <update: UPDATE> ] ;
	        [ WHEN <uWhen> ] ;
	        [ COLOR <nClrFore> [,<nClrBack>] ] ;
	        [ <pixel: PIXEL> ]
	*/
	@ 440, 220 ICON oIconCtrl ;
		RESOURCE "ICON" ;
		FILE "icon.ico" ;
		BORDER ;
		ON CLICK {|| .T.} ;
		OF oDlg ;
		UPDATE ;
		WHEN .T. ;
		COLOR CLR_BLACK, CLR_WHITE ;
		PIXEL

	// SButton
	/* sigawin.ch:
	   #xcommand DEFINE SBUTTON [ <oBtn> ] ;
	                    [ FROM <nTop>,<nLeft> ] ;
	                    [ TYPE <nType> ] ;
	                    [ <action:ACTION,EXEC> <uAction> ] ;
	                    [ OF <oWnd> ] ;
	                    [ <mode: ENABLE > ] ;
	                    [ ONSTOP <cMsg> ] ;
	                    [ WHEN     <uWhen>]
	*/
	DEFINE SBUTTON oSButton ;
		FROM 510, 005 ;
		TYPE 1 ;
		ACTION (lConfirm := .T., oDlg:End()) ;
		OF oDlg ;
		ENABLE ;
		ONSTOP "Confirm" ;
		WHEN .T.

	// TTimer
	/* protheus.ch:
	   #xcommand DEFINE TIMER [ <oTimer> ] ;
	        [ INTERVAL <nInterval> ] ;
	        [ ACTION <uAction,...> ] ;
	        [ <of: OF, WINDOW, DIALOG> <oWnd> ]
	*/
	DEFINE TIMER oTimer ;
		INTERVAL 1000 ;
		ACTION (nMeter++, oMeter:Set(nMeter)) ;
		OF oDlg
	/* protheus.ch:
	   #xcommand ACTIVATE TIMER <oTimer>
	*/
	ACTIVATE TIMER oTimer

	// TMenu / TMenuItem
	/* ptmenu.ch:
	   #xcommand MENU [ <oMenu> ] ;
	                [ <popup: POPUP> ] ;
	                [ IMAGE <cImage> ] ;
	                [ FROM <nTop>,<nLeft> ];
	                [ SIZE <nHeight>,<nWidth> ];
	                [ OF <oWnd> ]
	*/
	MENU oMenu ;
		POPUP ;
		IMAGE "MENU" ;
		FROM 000, 000 ;
		SIZE 100, 100 ;
		OF oDlg
		/* ptmenu.ch:
		   #xcommand MENUITEM [ <oMenuItem> PROMPT ] [<cPrompt>] ;
		                [ MESSAGE <cMsg> ] ;
		                [ <checked: CHECK, CHECKED, MARK> ] ;
		                [ <enable: ENABLED, DISABLED> ] ;
		                [ <file: FILE, FILENAME, DISK> <cBmpFile> ] ;
		                [ <resource: RESOURCE, RESNAME, NAME> <cResName> ] ;
		                [ ACTION <uAction,...> ] ;
		                [ BLOCK <bAction> ] ;
		                [ <of: OF, MENU, SYSMENU> <oMenu> ] ;
		                [ ACCELERATOR <nState>, <nVirtKey> ] ;
		                [ <help: HELP> ] ;
		                [ <HelpId: HELP ID, HELPID> <nHelpId> ] ;
		                [ WHEN <uWhen> ] ;
		                [ <break: BREAK> ]
		*/
		MENUITEM oMenuItem PROMPT "&Open" ;
			MESSAGE "Open" ;
			CHECKED ;
			ENABLED ;
			FILE "open.bmp" ;
			RESOURCE "OPEN" ;
			ACTION MsgInfo("Open") ;
			BLOCK {|| .T.} ;
			OF oMenu ;
			ACCELERATOR 0, 79 ;
			HELP ;
			HELPID 10 ;
			WHEN .T. ;
			BREAK
		/* ptmenu.ch:
		   #xcommand SEPARATOR [<oMenuItem>]
		*/
		SEPARATOR oSeparator
	/* ptmenu.ch:
	   #xcommand ENDMENU
	*/
	ENDMENU
	/* ptmenu.ch:
	   #xcommand ACTIVATE <menu:POPUP,MENU> <oMenu> ;
	                [ AT <nRow>, <nCol> ] ;
	                [ <of: OF, WINDOW, DIALOG> <oWnd> ]
	*/
	ACTIVATE POPUP oMenu ;
		AT 010, 010 ;
		OF oDlg

	// TBar
	/* protheus.ch:
	   #xcommand DEFINE BUTTONBAR [ <oBar> ] ;
	        [ <size: SIZE, BUTTONSIZE, SIZEBUTTON > <nWidth>, <nHeight> ] ;
	        [ <_3d: 3D, 3DLOOK> ] ;
	        [ <mode: TOP, LEFT, RIGHT, BOTTOM, FLOAT> ] ;
	        [ <wnd: OF, WINDOW, DIALOG> <oWnd> ] ;
	        [ CURSOR <oCursor> ] ;
	        [ <lNoAutoAdjust: NOAUTOADJUST> ]
	*/
	DEFINE BUTTONBAR oBar ;
		SIZE 025, 025 ;
		3D ;
		TOP ;
		OF oDlg ;
		CURSOR oCursor ;
		NOAUTOADJUST

	// TBtnBmp (botao da TBar)
	/* protheus.ch:
	   #xcommand DEFINE BUTTON [ <oBtn> ] ;
	        [ <bar: OF, BUTTONBAR > <oBar> ] ;
	        [ <resource: NAME, RESNAME, RESOURCE> <cResName1> ;
	      [,<cResName2>[,<cResName3>] ] ] ;
	        [ <file: FILE, FILENAME, DISK> <cBmpFile1> ;
	      [,<cBmpFile2>[,<cBmpFile3>] ] ] ;
	        [ <action:ACTION,EXEC> <uAction,...> ] ;
	        [ <group: GROUP > ] ;
	        [ MESSAGE <cMsg> ] ;
	        [ <adjust: ADJUST > ] ;
	        [ WHEN <WhenFunc> ] ;
	        [ TOOLTIP <cToolTip> ] ;
	        [ <lPressed: PRESSED> ] ;
	        [ ON DROP <bDrop> ] ;
	        [ AT <nPos> ] ;
	        [ PROMPT <cPrompt> ] ;
	        [ FONT <oFont> ] ;
	        [ <lNoBorder: NOBORDER> ]
	*/
	DEFINE BUTTON oBarButton ;
		OF oBar ;
		RESOURCE "SAVE" ;
		FILE "save.bmp" ;
		ACTION MsgInfo("Save") ;
		GROUP ;
		MESSAGE "Save" ;
		ADJUST ;
		WHEN .T. ;
		TOOLTIP "Save" ;
		PRESSED ;
		ON DROP {|| .T.} ;
		AT 1 ;
		PROMPT "Save" ;
		FONT oFont ;
		NOBORDER

	// TMsgBar / TMsgItem
	/* protheus.ch:
	   #xcommand DEFINE MESSAGE [ BAR ] [<oMsg>] ;
	        [ OF <oWnd> ] ;
	        [ PROMPT <cMsg> ] ;
	        [ <center: CENTER, CENTERED> ] ;
	        [ <clock: CLOCK, TIME> ] ;
	        [ <date: DATE> ] ;
	        [ <kbd: KEYBOARD> ] ;
	        [ FONT <oFont> ] ;
	        [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack> ] ] ;
	        [ <inset: NO INSET, NOINSET> ]
	*/
	DEFINE MESSAGE BAR oMsgBar ;
		OF oDlg ;
		PROMPT "Ready" ;
		CENTER ;
		CLOCK ;
		DATE ;
		KEYBOARD ;
		FONT oFont ;
		COLOR CLR_BLACK, CLR_WHITE ;
		NOINSET
	/* protheus.ch:
	   #xcommand DEFINE MSGITEM [<oMsgItem>] ;
	        [ OF <oMsgBar> ] ;
	        [ PROMPT <cMsg> ] ;
	        [ SIZE <nSize> ] ;
	        [ FONT <oFont> ] ;
	        [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack> ] ] ;
	        [ ACTION <uAction> ]
	*/
	DEFINE MSGITEM oMsgItem ;
		OF oMsgBar ;
		PROMPT "Item" ;
		SIZE 100 ;
		FONT oFont ;
		COLOR CLR_BLACK, CLR_WHITE ;
		ACTION MsgInfo("Item")

	/* sigawin.ch:
	   #xcommand ACTIVATE MSDIALOG <oDlg> ;
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
	ACTIVATE MSDIALOG oDlg ;
		CENTERED ;
		NOMODAL ;
		WHEN .T. ;
		VALID lConfirm ;
		ON LEFT CLICK {|| .T.} ;
		ON INIT {|| .T.} ;
		ON MOVE {|| .T.} ;
		ON PAINT {|| .T.} ;
		ON RIGHT CLICK {|| .T.}

	If lConfirm
		WindowComponents()
	EndIf

Return lConfirm

/*/{Protheus.doc} WindowComponents
TWindow e TDialog pela sintaxe de comando.
@type static function
/*/
Static Function WindowComponents()
	Local oWnd
	Local oDialog

	// TWindow
	/* protheus.ch:
	   #xcommand DEFINE WINDOW [<oWnd>] ;
	        [ MDICHILD ] ;
	        [ FROM <nTop>, <nLeft> TO <nBottom>, <nRight> ] ;
	        [ TITLE <cTitle> ] ;
	        [ BRUSH <oBrush> ] ;
	        [ CURSOR <oCursor> ] ;
	        [ MENU <oMenu> ] ;
	        [ ICON <oIco> ] ;
	        [ OF <oParent> ] ;
	        [ <vscroll: VSCROLL, VERTICAL SCROLL> ] ;
	        [ <hscroll: HSCROLL, HORIZONTAL SCROLL> ] ;
	        [ <color: COLOR, COLORS> <nClrFore> [,<nClrBack>] ] ;
	        [ <pixel: PIXEL> ] ;
	        [ STYLE <nStyle> ] ;
	        [ <HelpId: HELPID, HELP ID> <nHelpId> ] ;
	        [ BORDER <border: NONE, SINGLE> ] ;
	        [ <NoSysMenu:  NOSYSMENU, NO SYSMENU> ] ;
	        [ <NoCaption:  NOCAPTION, NO CAPTION, NO TITLE> ] ;
	        [ <NoIconize:  NOICONIZE, NOMINIMIZE> ] ;
	        [ <NoMaximize: NOZOOM, NO ZOOM, NOMAXIMIZE, NO MAXIMIZE> ]
	*/
	DEFINE WINDOW oWnd ;
		FROM 000, 000 TO 400, 600 ;
		TITLE "Window" ;
		STYLE 0 ;
		COLOR CLR_BLACK, CLR_WHITE ;
		OF oMainWnd ;
		PIXEL

	// TDialog
	/* dialog.ch:
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
	                [ <help: HELP, HELPID> <nHelpId> ]
	*/
	DEFINE DIALOG oDialog ;
		RESOURCE "DLG" ;
		TITLE "Dialog" ;
		FROM 000, 000 TO 200, 300 ;
		SIZE 300, 200 ;
		LIBRARY 0 ;
		VBX ;
		STYLE 0 ;
		COLOR CLR_BLACK, CLR_WHITE ;
		OF oWnd ;
		PIXEL ;
		HELPID 11

	/* dialog.ch:
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
	ACTIVATE DIALOG oDialog ;
		CENTERED ;
		NOMODAL ;
		WHEN .T. ;
		VALID .T. ;
		ON LEFT CLICK {|| .T.} ;
		ON INIT {|| .T.} ;
		ON MOVE {|| .T.} ;
		ON PAINT {|| .T.} ;
		ON RIGHT CLICK {|| .T.}

	/* protheus.ch:
	   #xcommand ACTIVATE WINDOW <oWnd> ;
	        [ <show: ICONIZED, NORMAL, MAXIMIZED> ] ;
	        [ ON [ LEFT ] CLICK <uLClick> ] ;
	        [ ON LBUTTONUP <uLButtonUp> ] ;
	        [ ON RIGHT CLICK <uRClick> ] ;
	        [ ON MOVE <uMove> ] ;
	        [ ON RESIZE <uResize> ] ;
	        [ ON PAINT <uPaint> ] ;
	        [ ON KEYDOWN <uKeyDown> ] ;
	        [ ON INIT <uInit> ] ;
	        [ ON UP <uUp> ] ;
	        [ ON DOWN <uDown> ] ;
	        [ ON PAGEUP <uPgUp> ] ;
	        [ ON PAGEDOWN <uPgDn> ] ;
	        [ ON LEFT <uLeft> ] ;
	        [ ON RIGHT <uRight> ] ;
	        [ ON PAGELEFT <uPgLeft> ] ;
	        [ ON PAGERIGHT <uPgRight> ] ;
	        [ ON DROPFILES <uDropFiles> ] ;
	        [ VALID <uValid> ]
	*/
	ACTIVATE WINDOW oWnd ;
		MAXIMIZED ;
		ON LEFT CLICK {|| .T.} ;
		ON LBUTTONUP {|| .T.} ;
		ON RIGHT CLICK {|| .T.} ;
		ON MOVE {|| .T.} ;
		ON RESIZE {|| .T.} ;
		ON PAINT {|| .T.} ;
		ON KEYDOWN {|| .T.} ;
		ON INIT {|| .T.} ;
		ON UP {|| .T.} ;
		ON DOWN {|| .T.} ;
		ON PAGEUP {|| .T.} ;
		ON PAGEDOWN {|| .T.} ;
		ON LEFT {|| .T.} ;
		ON RIGHT {|| .T.} ;
		ON PAGELEFT {|| .T.} ;
		ON PAGERIGHT {|| .T.} ;
		ON DROPFILES {|| .T.} ;
		VALID .T.

Return
