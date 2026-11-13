#include "protheus.ch"

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

/*/{Protheus.doc} combo
Presents a dialog with options to test TComboBox functionalities.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
@link https://tdn.totvs.com/display/tec/TComboBox
/*/
user Function comboBox()
	local aOption := {;
		{"Visual", { |aoParent| combo_01(aoParent)} }, ;
		{"Events", { |aoParent| combo_02(aoParent)} },;
		{"Select Item", { |aoParent| combo_03(aoParent)} },;
		}

	u_selectTest("TComboBox", aOption)

return

static function combo_01(aoParent)
	local aItems:= {'Item1','Item2','Item3'}
	local cCombo1, cCombo2, cCombo3
	local oCombo1, oCombo2, oCombo3
	local oToggleBtn
	local lDisabled := .f.

	cCombo1:= aItems[1]
	@ SAY_ROW(1), SAY_COL say "::New";
		of aoParent;
		pixel
	oCombo1 := TComboBox():New(SAY_ROW(1), GET_COL,{|u|if(PCount()>0,cCombo1:=u,cCombo1)},;
		aItems,100,20,aoParent,,{||alert('Mudou item da combo')};
		,,,,.T.,,,,,,,,,'cCombo1')

	// Usando Create
	cCombo2:= aItems[2]
	@ SAY_ROW(3), SAY_COL say "::Create";
		of aoParent;
		pixel
	oCombo2 :=  TComboBox():Create(aoParent,{|u|if(PCount()>0,cCombo2:=u,cCombo2)},SAY_ROW(3), GET_COL,;
		aItems,100,20,,{||alert('Mudou item da combo')},,,,.T.,;
		,,,,,,,,'cCombo2')

	cCombo3 := aItems[1]
	@ SAY_ROW(5), SAY_COL say "Disabled";
		of aoParent;
		pixel
	oCombo3 := TComboBox():New(SAY_ROW(5), GET_COL,{|u|if(PCount()>0,cCombo3:=u,cCombo3)},;
		aItems,100,20,aoParent,,{||alert('Mudou item da combo')};
		,,,,.T.,,,,,,,,,'cCombo3')

	@ SAY_ROW(5), GET_COL + 110 button oToggleBtn;
		prompt "Toggle state";
		action {|| lDisabled := !lDisabled, iif(lDisabled, oCombo3:disable(),  oCombo3:enable()) };
		of aoParent pixel

return

static function combo_02(aoParent)
	local aItems:= {'Item1','Item2','Item3', "B acionado"}
	local cCombo1
	local oGet
	local cValue := "1234567890"

	@SAY_ROW(1), SAY_COL say "Colocar em foco o 1o elemento, acionar B e TAB" ;
		of aoParent;
		pixel

	@SAY_ROW(2), SAY_COL say "O combo apresentar� 'B acionado'" ;
		of aoParent;
		pixel

	@SAY_ROW(3), SAY_COL say "GET de apoio" ;
		of aoParent;
		pixel
	@SAY_ROW(3), GET_COL get oGet ;
		var cValue ;
		readonly ;
		of aoParent pixel
	u_allEvents(oGet, "oGet")

	cCombo1:= aItems[1]
	@SAY_ROW(4), SAY_COL say "Combobox" ;
		of aoParent;
		pixel
	oCombo1 := TComboBox():New(SAY_ROW(4), GET_COL,{|u|if(PCount()>0,cCombo1:=u,cCombo1)},;
		aItems,100,20,aoParent,,{||alert('Mudou item da combo')};
		,,,,.T.,,,,,,,,,'cCombo1')
	u_allEvents(oCombo1, "oCombo1")

return

static function combo_03(aoParent)
	local aItems:= {'Item1','Item2','Item3', "B acionado"}
	local cCombo1
	local oGet
	local cValue := "1234567890"

	@SAY_ROW(1), SAY_COL say "Colocar em foco o 1o elemento, acionar B e TAB" ;
		of aoParent;
		pixel

	@SAY_ROW(2), SAY_COL say "O combo apresentar� 'B acionado'" ;
		of aoParent;
		pixel

	@SAY_ROW(3), SAY_COL say "GET de apoio" ;
		of aoParent;
		pixel
	@SAY_ROW(3), GET_COL get oGet ;
		var cValue ;
		readonly ;
		of aoParent pixel

	cCombo1:= aItems[1]
	@SAY_ROW(4), SAY_COL say "Combobox" ;
		of aoParent;
		pixel
	oCombo1 := TComboBox():New(SAY_ROW(4), GET_COL,{|u|if(PCount()>0,cCombo1:=u,cCombo1)},;
		aItems,100,20,aoParent,,{||alert('Mudou item da combo')};
		,,,,.T.,,,,,,,,,'cCombo1')

return
