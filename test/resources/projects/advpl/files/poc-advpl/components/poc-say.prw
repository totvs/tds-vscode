#include 'protheus.ch'

#define SAY_ROW(x) (015 * (x))

#define WIDTH 100
#define COL_1 5
#define COL_2 (COL_1+WIDTH+5)
#define COL_3 (COL_2+WIDTH+5)

#define H_LEFT 0
#define H_CENTER 2
#define H_RIGHT 1
#define H_JUSTIFIED 3

#define V_TOP 0
#define V_BOTTOM 1
#define V_CENTER 2

/*/{Protheus.doc} say
Presents a dialog with options to test different get functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TSay
@link https://tdn.totvs.com/display/tec/@+...+SAY
/*/
user Function say()

	// {"Visual", "say_01" },;
		// {"Events", "say_02" },;

	local aOption := {;
		{"Alignment", "say_03" };
		}

	private nVertical := 1
	private nHorizontal := 1
	private oDynAlign := nil

	u_selectTest("TSay", aOption)
return

/*/{Protheus.doc} say_01
Presents a dialog with various says functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
user Function say_01(aoParent)

/*
@ <nRow>,<nCol> SAY <cText>

@ <nRow>, <nCol> SAY [ <oSay> PROMPT | VAR ] <cText>
   [ PICTURE <cPict> ]
   [ OF | WINDOW | DIALOG <oWnd> ]
   [ FONT <oFont> ]
   [ PIXEL, pixels]
   [ COLOR | COLORS <nClrText> [,<nClrBack> ] ]
   [ SIZE <nWidth>, <nHeight> ]
   [ HTML ]
*/

	@010,010 say "Visual" pixels of aoParent

Return

/*/{Protheus.doc} say_02
Presents a dialog with a text button and a button with a menu.

@type function
@author acandido
@since 11/7/2024
/*/
user Function say_02(aoParent)

	@010,010 say "Events" pixels of aoParent

return

user Function say_03(aoParent)
	local oSay1 := nil
	local oSay2 := nil
	local oSay3 := nil
	local oSay4 := nil
	local oSay5 := nil
	local oSay6 := nil
	local oSay7 := nil
	local oSay8 := nil
	local oSay9 := nil
	local oRadVertical := nil
	local oRadHorizontal := nil

	@SAY_ROW(1), 010 say "Alignment (Horizontal, Vertical)" pixels of aoParent

	oSay1 := createSay("Left, Top", SAY_ROW(2), COL_1, aoParent)
	oSay1:setTextAlign(H_LEFT, V_TOP )

	oSay2 := createSay("Center, Top", SAY_ROW(2), COL_2, aoParent)
	oSay2:setTextAlign(H_CENTER, V_TOP )

	oSay3 := createSay("Right, Top", SAY_ROW(2), COL_3, aoParent)
	oSay3:setTextAlign(H_RIGHT, V_TOP )

	oSay4 := createSay("Left, Center", SAY_ROW(4), COL_1, aoParent)
	oSay4:setTextAlign(H_LEFT, V_CENTER )

	oSay5 := createSay("Center, Center", SAY_ROW(4), COL_2, aoParent)
	oSay5:setTextAlign(H_CENTER, V_CENTER )

	oSay6 := createSay("Right, Center", SAY_ROW(4), COL_3, aoParent)
	oSay6:setTextAlign(H_RIGHT, V_CENTER )

	oSay7 := createSay("Left, Bottom", SAY_ROW(6), COL_1, aoParent)
	oSay7:setTextAlign(H_LEFT, V_BOTTOM )

	oSay8 := createSay("Center, Bottom", SAY_ROW(6), COL_2, aoParent)
	oSay8:setTextAlign(H_CENTER, V_BOTTOM )

	oSay9 := createSay("Right, Bottom", SAY_ROW(6), COL_3, aoParent)
	oSay9:setTextAlign(H_RIGHT, V_BOTTOM )

	oDynAlign := createSay("Default, Default", SAY_ROW(8), COL_2, aoParent)

	@ SAY_ROW(8), COL_1 say "Horizontal" pixels of aoParent
	oRadHorizontal := TRadMenu():New (SAY_ROW(8.5), COL_1 , {"Default", "Left", "Center", "Right", "Justify"},, aoParent,,,,,,,,50,12,,,,.T.)
	oRadHorizontal:bSetGet := {|u| iif (PCount()==0, nHorizontal, nHorizontal := u)}
	oRadHorizontal:bChange := { || u_changeTextAlign()}
	oRadHorizontal:cName := "nHorizontal"
	oRadHorizontal:cReadVar := "nHorizontal"

	@ SAY_ROW(8), COL_1 + 50 say "Vertical" pixels of aoParent
	oRadVertical := TRadMenu():New (SAY_ROW(8.5), COL_1 + 50 , {"Default", "Top", "Middle", "Bottom"},, aoParent,,,,,,,,50,12,,,,.T.)
	oRadVertical:bSetGet := {|u| iif (PCount()==0, nVertical, nVertical := u)}
	oRadVertical:bChange := { || u_changeTextAlign()}
	oRadVertical:cName := "nVertical"
	oRadVertical:cReadVar := "nVertical"

return

user function changeTextAlign(aoSay)
	local cAlign := ""
	local nHoriz := 0
	local nVert := 0

	Do Case
	Case nHorizontal == 2
		cAlign += "Left, "
		nHoriz := 0
	Case nHorizontal == 3
		cAlign += "Center, "
		nHoriz := 2
	Case nHorizontal == 4
		cAlign += "Right, "
		nHoriz := 1
	Case nHorizontal == 5
		cAlign += "Justify, "
		nHoriz := 3
	Otherwise
		cAlign += "Default, "
		nHoriz := 0
	EndCase

	Do Case
	Case nVertical == 2
		cAlign += "Top"
		nVert := 0
	Case nVertical == 3
		cAlign += "Middle"
		nVert := 2
	Case nVertical == 4
		cAlign += "Bottom"
		nVert := 1
	Otherwise
		cAlign += "Default"
		nVert := 0
	EndCase

	oDynAlign:setText(cAlign)
	oDynAlign:setTextAlign(nHoriz, nVert)
	oDynAlign:CtrlRefresh()

return

static function createCheckBox(varName, row, column, label, abClick, oParent)
	local oCheckBox := TCheckBox():New(row, column+15, label,;
		{|u| If( PCount() == 0, &varName , &varName := u ) },;
		oParent, 100, 20,,abClick,,,,,.F.,.T.,,.F., )
	oCheckBox:cName := varName
	oCheckBox:cReadVar := varName

return oCheckBox;

static function createSay(acText, anRow, anCol, aoParent)
	local oFont := TFont():New('Courier new',,-18,.T.)
	local oSay

	oSay:= TSay():New(anRow, anCol, {|| acText}, aoParent,, oFont,,,, .T.,/*CLR_RED*/,/*CLR_WHITE*/,WIDTH,30)
	oSay:lTransparent = .T.
	oSay:SetCSS("border: 1px solid #C0C0C0;")

return oSay
