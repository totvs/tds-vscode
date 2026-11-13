#include 'protheus.ch'

#define SAY_ROW(x) (015 * (x))

#define SAY_COL 010
#define SAY_COL_2 (SAY_COL + 160)
#define GET_COL 080
#define GET_COL_2 (GET_COL + 160)

#define IDX_PICTURE 1
#define IDX_EXPECTED 2
#define IDX_TYPE  3
#define IDX_DATA  4

#define DATA_CHAR "aBcDe 1234-5678"
#define DATA_INT 1234
#define DATA_NUMERIC 1234.12
#define DATA_DATE date()
#define DATA_CNPJ_WO_MASK "123456789123412"
#define DATA_CNPJ "123.456.789/1234-12"
#define DATA_CNPJ_2026 "AB3.456.789/AB34-12"
#define DATA_CELULAR_WO_MASK "1212123456789"
#define DATA_CELULAR "+12(12)1-2345-6789"

/*
@ <nRow>, <nCol> get [ <oGet> VAR ] <uVar>
   [ OF | WINDOW | DIALOG <oWnd> ]
   [ PICTURE <cPict> ]
   [ VALID <cbValid> ]
   [ COLOR,COLORS <nClrText> [,<nClrBack> ] ]
   [ SIZE <nWidth>, <nHeight> ]
   [ FONT <oFont> ]
   [ pixel | pixelS ]
   [ WHEN <cbWhen> ]
   [ ON CHANGE <cbChange> ]
   [ READONLY ]
   [ PASSWORD ]
*/

/*/{Protheus.doc} get
Presents a dialog with options to test different get functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TGet
@link https://tdn.totvs.com/display/tec/@+...+get
@link https://tdn.totvs.com/display/tec/@+...+checkbox
@link https://tdn.totvs.com/display/tec/@+...+get+MULTILINE
@link https://tdn.totvs.com/pages/viewpage.action?pageId=273983558 Tabela de Pictures de Formataï¿½ï¿½o
/*/
user function get()
	local aOption := {;
		{"Visual"                  , { |aoParent| get_01(aoParent) }},;
		{"Events"                  , { |aoParent| get_02(aoParent) }},;
		{"Data entry"              , { |aoParent| get_03(aoParent) }},;
		{"Pictures (char)"         , { |aoParent| get_04(aoParent) }},;
		{"Pictures (numeric)"      , { |aoParent| get_05(aoParent) }},;
		{"Pictures (misc)"         , { |aoParent| get_06(aoParent) }},;
		{"Modifier Key (TGet)"     , { |aoParent| get_07(aoParent) }},;
		{"Modifier Key (TMultiGet)", { |aoParent| get_08(aoParent) }},;
		}

	public aCharPictures := {}
	public aGets := {}

	u_startRemoteLog("POC: TGet")

	u_selectTest("TGet", aOption)

	u_stopRemoteLog()
return

/*/{Protheus.doc} get_01
Presents a dialog with various gets functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
static function get_01(aoParent)
	local oGet1 := nil
	local cMinimalist := space(10)
	local cMinSyntaxe := space(10)
	local oGet1RO := nil
	local cReadOnly := "read only"
	local oGet1Disabled := nil
	local cDisabled := "disabled"
	local oToggleBtn := nil
	local lDisabled := .f.
	local oGet2 := nil
	local nNumeric := 0
	local oGet3 := nil
	local nNumeric2 := 0
	local oGet30 := nil
	local nNumeric3 := -200
	local oGet31 := nil
	local nNumeric4 := -100
	local oGet4 := nil
	local dDate := stod("20250101")
	local oGet5 := nil
	local cPassword := space(10)
	local oGet6 := nil
	local lLogic := .t.
	local lMinSyntax := .t.
	local oGet7 := nil
	local lLogic2 := .t.
	local oGet8 := nil
	local cMultiLine := "Line 1" + CRLF + "Line 2" + CRLF + "Line 3"
	local cMimSyntaxML := "Line 1" + CRLF + "Line 2" + CRLF + "Line 3"

/*
@ <nRow>,<nCol> get <uVar>

@ <nRow>, <nCol> get [ <oGet> VAR ] <uVar>
   [ OF | WINDOW | DIALOG <oWnd> ]
   [ PICTURE <cPict> ]
   [ VALID <cbValid> ]
   [ COLOR,COLORS <nClrText> [,<nClrBack> ] ]
   [ SIZE <nWidth>, <nHeight> ]
   [ FONT <oFont> ]
   [ pixel | pixelS ]
   [ WHEN <cbWhen> ]
   [ ON CHANGE <cbChange> ]
   [ READONLY ]
   [ PASSWORD ]

@ <nRow>,<nCol> checkbox <lVar>

@ <nRow>, <nCol> checkbox [ <ocheckbox> VAR ] <lVar>
   [ PROMPT <cCaption>]
   [ OF | WINDOW | DIALOG <oWnd> ]
   [ SIZE <nWidth>, <nHeight> ]
   [ FONT <oFont> ]
   [ ON CLICK | ON CHANGE <cbClick> ]
   [ VALID <cbValid> ]
   [ COLOR | COLORS <nClrText> [,<nClrBack> ] ]
   [ pixel ]
   [ MESSAGE <cMsg> ]
   [ WHEN <cbWhen> ]

@ <nRow>,<nCol> get <uVar> MULTILINE

@ <nRow>, <nCol> get [ <oMultiGet> VAR ] <uVar> MULTILINE
   [ OF | WINDOW | DIALOG <oWnd> ]
   [ COLOR | COLORS <nClrText> [,<nClrBack> ] ]
   [ SIZE <nWidth>, <nHeight> ]
   [ FONT <oFont> ]
   [ pixel ]
   [ WHEN <cbWhen> ]
   [ READONLY ]
   [ VALID <cbValid> ]
   [ NO BORDER | NOBORDER ]
   [ NO VSCROLL ]
*/
	@SAY_ROW(1), SAY_COL say "Minimalist get";
		of aoParent pixel
	@SAY_ROW(1), GET_COL get oGet1;
		var cMinimalist;
		of aoParent pixel

	@SAY_ROW(1), SAY_COL_2 say "Min Syntax";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 get cMinSyntaxe;
		of aoParent pixel

	@SAY_ROW(2), SAY_COL say "Read Only";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oGet1RO;
		var cReadOnly;
		readonly;
		of aoParent pixel

	@SAY_ROW(2), SAY_COL_2 say "Disabled";
		of aoParent pixel
	@SAY_ROW(2), GET_COL_2 get oGet1Disabled;
		var cDisabled;
		when {|| !lDisabled };
		of aoParent pixel
	@SAY_ROW(3), GET_COL_2 button oToggleBtn;
		prompt "Toggle state";
		action {|| lDisabled := !lDisabled, oGet1Disabled:ctrlRefresh() };
		of aoParent pixel

	@SAY_ROW(4), SAY_COL say "Numeric (w button)";
		of aoParent pixel
	@SAY_ROW(4), GET_COL get oGet2;
		var nNumeric;
		picture "@E 99,999.99";
		of aoParent pixel

	@SAY_ROW(4), SAY_COL_2 say "Numeric (wo button)";
		of aoParent pixel
	@SAY_ROW(4), GET_COL_2 get oGet3;
		var nNumeric2;
		picture "@E 99,999.99";
		of aoParent pixel
	oGet3:lNoButton := .t.

	@SAY_ROW(5), SAY_COL say "Numeric (@E 99,999)";
		of aoParent pixel
	@SAY_ROW(5), GET_COL get oGet30;
		var nNumeric3;
		picture "@E 99,999";
		of aoParent pixel
	oGet30:lNoButton := .t.

	@SAY_ROW(5), SAY_COL_2 say "Numeric (@E -99,999.99)";
		of aoParent pixel
	@SAY_ROW(5), GET_COL_2 get oGet31;
		var nNumeric4;
		picture "@E -99,999.99";
		of aoParent pixel
	oGet31:lNoButton := .t.

	@SAY_ROW(6), SAY_COL say "Date";
		of aoParent pixel
	@SAY_ROW(6), GET_COL get oGet4;
		var dDate;
		of aoParent pixel

	@SAY_ROW(7), SAY_COL say "Password";
		of aoParent pixel
	@SAY_ROW(7), GET_COL get oGet5;
		var cPassword;
		password;
		of aoParent pixel

	@SAY_ROW(8), SAY_COL say "checkbox (w size)";
		of aoParent pixel
	@SAY_ROW(8), GET_COL checkbox oGet6;
		var lLogic;
		size 200,20;
		prompt "Click to change";
		message "Click on the checkbox to change (message)";
		of aoParent pixel
	oGet6:cName := "lLogic"
	oGet6:cReadVar := "lLogic"

	@SAY_ROW(8), SAY_COL_2 say "Min Syntax";
		of aoParent pixel
	@SAY_ROW(8), GET_COL_2 checkbox lMinSyntax;
		of aoParent pixel

	@SAY_ROW(9), SAY_COL say "checkbox (wo size)";
		of aoParent pixel
	@SAY_ROW(9), GET_COL checkbox oGet7;
		var lLogic2;
		prompt "Click to change";
		message "Click on the checkbox to change (message)";
		of aoParent pixel
	oGet7:cName := "lLogic2"
	oGet7:cReadVar := "lLogic2"

	@SAY_ROW(10), SAY_COL say "Multi-line";
		of aoParent pixel
	@SAY_ROW(10), GET_COL get oGet8;
		var cMultiLine;
		size 80,50;
		multiline;
		of aoParent pixel

	@SAY_ROW(10), SAY_COL_2 say "Min Syntax";
		of aoParent pixel
	@SAY_ROW(10), GET_COL_2 get cMimSyntaxML;
		multiline;
		of aoParent pixel

Return

/*/{Protheus.doc} get_02
Presents a dialog with a text button and a button with a menu.

@type function
@author acandido
@since 11/7/2024
/*/
static function get_02(aoParent)
	local oGet1 := nil
	local cMinimalist := "minimalist"
	local oGet2 := nil
	local cAnotherGet := "another"
	local oBtn

	@SAY_ROW(1), SAY_COL say "Minimalist get";
		of aoParent pixel
	@SAY_ROW(1), GET_COL get oGet1;
		var cMinimalist;
		of aoParent pixel

	//TSrvObject and TControl
	u_allEvents(oGet1, "oGet1")

	// TGet
	// oTextBtn:bAction := {|| u_firedEvent(oTextBtn, " onAction")}

	@SAY_ROW(3), SAY_COL say "Another get";
		of aoParent pixel
	@SAY_ROW(3), GET_COL get oGet2;
		var cAnotherGet;
		of aoParent pixel
	u_allEvents(oGet2, "oGet2")

	@ 060, 005 button oBtn;
		prompt "Click here";
		action {|| };
		of aoParent pixel
	u_allEvents(oBtn, "oBtn")

return

static function get_03(aoParent)
	local oGet1 := nil
	local cCharacter := space(10)
	local oGet2 := nil
	local nNumeric := 0
	local oGet4 := nil
	local dDate := stod("20250101")
	local oGet5 := nil
	local cPassword := space(10)
	local oGet6 := nil
	local lLogic := .t.
	local oGet8 := nil
	local cMultiLine := "Line 1" + CRLF + "Line 2" + CRLF + "Line 3"
	local oGet9 := nil
	local cMultiL_WoName := "@..Get with multiline option, not assigned :cName/:cReadVar"
	local oGet10 := nil
	local cCtrlC := "Mark a block and act ^C"
	local oGet11 := nil
	local cCtrlV := "Focused this and act ^V"
	local oGet12 := nil
	local cCtrlC_RO := "Mark a block and act ^C (RO)"
	local oGet13 := nil
	local cCtrlV_RO := "Focused this and act ^V (RO)"

	@SAY_ROW(1), SAY_COL say "Character";
		of aoParent pixel
	@SAY_ROW(1), GET_COL get oGet1;
		var cCharacter;
		of aoParent pixel

	@SAY_ROW(2), SAY_COL say "Numeric";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oGet2;
		var nNumeric;
		picture "@E 99,999.99";
		of aoParent pixel

	@SAY_ROW(3), SAY_COL say "Date";
		of aoParent pixel
	@SAY_ROW(3), GET_COL get oGet4;
		var dDate;
		of aoParent pixel

	@SAY_ROW(4), SAY_COL say "Password";
		of aoParent pixel
	@SAY_ROW(4), GET_COL get oGet5;
		var cPassword;
		password;
		of aoParent pixel

	@SAY_ROW(5), SAY_COL say "Checkbox";
		of aoParent pixel
	@SAY_ROW(5), GET_COL checkbox oGet6;
		var lLogic;
		size 200,20;
		prompt "Click to change";
		message "Click on the checkbox to change (message)";
		of aoParent pixel
	oGet6:cName := "lLogic"
	oGet6:cReadVar := "lLogic"

	@SAY_ROW(6), SAY_COL say "Multiline";
		of aoParent pixel
	@SAY_ROW(6), GET_COL get oGet8;
		var cMultiLine;
		size 80,50;
		multiline;
		of aoParent pixel
	oGet8:cName := "cMultiLine"
	oGet8:cReadVar := "cMultiLine"

	@SAY_ROW(6), SAY_COL_2 say "Multiline (wo cName)";
		of aoParent pixel
	@SAY_ROW(6), GET_COL_2 get oGet9;
		var cMultiL_WoName;
		size 80,50;
		multiline;
		of aoParent pixel

	@SAY_ROW(10), SAY_COL say "Ctrl-C";
		of aoParent pixel
	@SAY_ROW(10), GET_COL get oGet10;
		var cCtrlC;
		of aoParent pixel

	@SAY_ROW(11), SAY_COL say "Ctrl-V";
		of aoParent pixel
	@SAY_ROW(11), GET_COL get oGet11;
		var cCtrlV;
		of aoParent pixel

	@SAY_ROW(12), SAY_COL say "Ctrl-C (RO)";
		of aoParent pixel
	@SAY_ROW(12), GET_COL get oGet12;
		var cCtrlC_RO;
		readonly;
		of aoParent pixel

	@SAY_ROW(13), SAY_COL say "Ctrl-V (RO)";
		of aoParent pixel
	@SAY_ROW(13), GET_COL get oGet13;
		var cCtrlV_RO;
		readonly;
		of aoParent pixel

Return

static function get_04(aoParent)
	local i
	local oGet := nil

	aCharPictures := resetCharPics(4)
	aGets := {}

	@SAY_ROW(1), SAY_COL  say "Picture / Current value";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 say "Expected / Original value";
		of aoParent pixel

	for i := 1 to Len(aCharPictures)
		oGet := displayPic(i, aCharPictures[i], aoParent)

		aAdd(aGets, oGet)
	next

return

static function get_05(aoParent)
	local i
	local oGet := nil

	aCharPictures := resetCharPics(5)
	aGets := {}

	@SAY_ROW(1), SAY_COL  say "Picture / Current value";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 say "Expected / Original value";
		of aoParent pixel

	for i := 1 to Len(aCharPictures)
		oGet := displayPic(i, aCharPictures[i], aoParent)

		aAdd(aGets, oGet)
	next

return

static function get_06(aoParent)
	local i
	local oGet := nil

	//Devido ao comportamento de picture em numï¿½ricos, o valor mï¿½ximo a ser digitado
	//deve ser um dï¿½gito a menos quando negativo.
	public aCharPictures := {;
		{ "999.999.999/9999-99", "CNPJ", "C", DATA_CNPJ },;
		{ "@R 999.999.999/9999-99", "CNPJ (@R mask)", "C", DATA_CNPJ_WO_MASK },;
		{ "NNN.NNN.NNN/NNNN-99", "CNPJ (04/2026)", "C", DATA_CNPJ_2026 },;
		{ "+99(99)9-9999-9999", "Celular", "C", DATA_CELULAR },;
		{ "@R +99(99)9-9999-9999", "Celular (@R mask)", "C", DATA_CELULAR_WO_MASK },;
		}
	public aGets := {}

	@SAY_ROW(1), SAY_COL  say "Character / Current value";
		of aoParent pixel
	@SAY_ROW(1), GET_COL_2 say "Expected / Original value";
		of aoParent pixel

	for i := 1 to Len(aCharPictures)
		oGet := nil

		oGet := displayPic(i, aCharPictures[i], aoParent)

		aAdd(aGets, oGet)
	next

return

static function displayPic(anIndex, aaPicture, aoParent)
	local oGet := nil
	local nRow := anIndex * 2
	local cData := ""

	if valtype(aaPicture) != "A"
		return
	endif

	cData := aaPicture[IDX_DATA]

	@SAY_ROW(nRow), SAY_COL say iif(aaPicture[IDX_PICTURE] == "", "(no picture)", aaPicture[IDX_PICTURE]);
		of aoParent pixel

	@SAY_ROW(nRow), GET_COL get oGet;
		var cData;
		size 110, 12;
		picture aaPicture[IDX_PICTURE];
		of aoParent pixel

	oGet:cName := "cData" + alltrim(str(anIndex))
	oGet:cReadVar := "cData" + alltrim(str(anIndex))
	u_OnEvent(oGet, "bChange")

	@SAY_ROW(nRow), SAY_COL + 180 say aaPicture[IDX_EXPECTED];
		of aoParent pixel

	@SAY_ROW((nRow + 1.25)), GET_COL say cData;
		picture aaPicture[IDX_PICTURE];
		size 110, 12;
		color rgb(0, 0, 255);
		of aoParent pixel

	@SAY_ROW((nRow + 1.25)), GET_COL_2 ;
		say aaPicture[IDX_DATA];
		size 110, 12;
		color rgb(0, 0, 255);
		of aoParent pixel

return oGet

static function resetCharPics(funcNumber)

	if funcNumber == 4
		return {;
			{ "", "Equal value", "C", DATA_CHAR },;
			{ "@!", "All upper case", "C", DATA_CHAR },;
			}
	endif

	//Devido ao comportamento de picture em numï¿½ricos, o valor mï¿½ximo a ser digitado
	//deve ser um dï¿½gito a menos quando negativo.
	if funcNumber == 5
		return aCharPictures := {;
			{ "", "Equal value", "N", DATA_INT },;
			{ "@E 99,999", "Integer", "N", DATA_INT },;
			{ "@E 99,999.99", "Numeric with 2 decimals", "N", DATA_NUMERIC },;
			{ "@E -99,999", "Presents as negative, even though it is not", "N", DATA_INT },;
			{ "@E -99,999.99", "Presents as negative, even though it is not", "N", DATA_NUMERIC },;
			{ "99,999", "Integer, american format", "N", DATA_INT },;
			{ "99,999.99", "Numeric with 2 decimals, american format", "N", DATA_NUMERIC },;
			}
	endif

return {}

/*/{Protheus.doc} get_07
Alt Keys activation on TGET.

@type function
@author acandido
@since 08/09/2025
/*/
static function get_07(aoParent)
	local cGet1 := space(20)
	local oGet1
	local cEcho := ""
	local oEcho
	local oSetKeysButton

	u_remoteLog("get_07: start TGET")

	@SAY_ROW(2), SAY_COL say "TGet:" pixel of aoParent
	@SAY_ROW(3), SAY_COL get oGet1 ;
		var cGet1 ;
		size 110, 12;
		of aoParent pixel

	oGet1:bChange := {|oSender| ;
		u_firedEvent(oSender, "onChange: "+ cValToChar(eval(oSender:bSetget)) + " (" + valType(eval(oSender:bSetget)) + ")"),;
		cEcho := cValToChar(eval(oSender:bSetget));
		}

	@SAY_ROW(2), SAY_COL + 150 say "Echo:" pixel of aoParent
	@SAY_ROW(3), SAY_COL + 150 get oEcho ;
		var cEcho ;
		size 110, 12;
		of aoParent pixel

	@SAY_ROW(8), SAY_COL button oSetKeysButton;
		prompt "Set Keys";
		action {|| ;
		u_setAltKeys(oGet1, aoParent), ;
		u_setCtrlKeys(oGet1, aoParent), ;
		u_setFnKeys(oGet1, aoParent), ;
		oSetKeysButton:disable();
		};
		size 90, 15;
		of aoParent pixel

	u_remoteLog("get_07: end")
Return

/*/{Protheus.doc} get_08
Alt Keys activation on TMultGET.

@type function
@author acandido
@since 08/09/2025
/*/
static function get_08(aoParent)
	local cText1 := space(100)
	local oTMultiget1
	local oSetKeysButton
	local oCtrlButton
	local oFnButton
	local oOthersKeysButton

	u_remoteLog("get_08: start Alt+? trigger")

	@SAY_ROW(2), SAY_COL say "TMultiGet:" pixel of aoParent
	@SAY_ROW(3), SAY_COL get oTMultiget1 ;
		var cText1 ;
		multiline;
		size 60, 60 ;
		of aoParent pixel
	oTMultiget1:cName := "cText1"
	oTMultiget1:cReadVar := "cText1"

	u_allEvents(oTMultiget1, "oTMultiget1")

	@SAY_ROW(8), SAY_COL button oSetKeysButton;
		prompt "Alt-?";
		action {|| ;
		u_setAltKeys(oTMultiget1, aoParent), ;
		oSetKeysButton:disable();
		};
		size 90, 15;
		of aoParent pixel

	@SAY_ROW(8), SAY_COL + 100  button oCtrlButton;
		prompt "Ctrl-?";
		action {|| ;
		u_setCtrlKeys(oTMultiget1, aoParent), ;
		oCtrlButton:disable();
		};
		size 90, 15;
		of aoParent pixel

	@SAY_ROW(9), SAY_COL button oFnButton;
		prompt "Fn e Sh+Fn";
		action {|| ;
		u_setFnKeys(oTMultiget1, aoParent), ;
		oFnButton:disable();
		};
		size 90, 15;
		of aoParent pixel

	@SAY_ROW(9), SAY_COL + 100 button oOthersKeysButton;
		prompt "Others";
		action {|| ;
		u_setOthersKeys(oTMultiget1, aoParent), ;
		oOthersKeysButton:disable();
		};
		size 90, 15;
		of aoParent pixel

	u_remoteLog("get_08: end")
Return
