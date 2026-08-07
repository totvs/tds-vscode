#include "TOTVS.CH"
#INCLUDE 'PROTHEUS.CH'
#INCLUDE 'RWMAKE.CH'
#INCLUDE 'FONT.CH'
#INCLUDE 'COLORS.CH'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

user Function checkbox()
	local aOption := {;
		{"Visual", { |aoParent| ckt_01(aoParent)} }, ;
		{"Events", { |aoParent| ckt_02(aoParent)} }, ;
		{"Checkbox", { |aoParent| ckt_03(aoParent)} }, ;
		}

	u_startRemoteLog("Component Checkbox Test")

	u_selectTest("Checkbox", aOption)

	u_stopRemoteLog()

return

static function ckt_01(aoParent)
	Local oCheckBox1
	Local oCheckBox3
	Local oCheckDisabled
	local lCheck1 := .F.
	local lCheck3 := .F.
	local lDisabled := .F.
	local oToggleBtn

	@SAY_ROW(2), SAY_COL say "Checkbox normal";
		of aoParent pixel
	@SAY_ROW(2), GET_COL checkbox oCheckbox1;
		var lCheck1;
		prompt "Enable to click";
		size 100,20;
		of aoParent pixel
	oCheckbox1:cName := "lCheckBox"
	oCheckbox1:cReadVar := "lCheckBox"

	@SAY_ROW(3), SAY_COL say "Checkbox disabled";
		of aoParent pixel
	@SAY_ROW(3), GET_COL checkbox oCheckDisabled;
		var lDisabled;
		size 100,20;
		prompt "Unable to click";
		when { || !lDisabled };
		of aoParent pixel
	oCheckDisabled:cName := "lBoxDisabled"
	oCheckDisabled:cReadVar := "lBoxDisabled"

	@ SAY_ROW(3), GET_COL + 60 button oToggleBtn;
		prompt "Toggle state";
		action {|| lDisabled := !lDisabled };
		of aoParent pixel

	@SAY_ROW(4), SAY_COL say "Checkbox wo size";
		of aoParent pixel
	@SAY_ROW(4), GET_COL checkbox oCheckbox3;
		var lCheck3;
		prompt "Not specifying size";
		of aoParent pixel

Return

static function ckt_02(aoParent)
	Local oCheckBox1
	Local oCheckDisabled
	local lCheck1 := .F.
	local lDisabled := .F.

	@SAY_ROW(2), SAY_COL say "Checkbox normal";
		of aoParent pixel
	@SAY_ROW(2), GET_COL checkbox oCheckbox1;
		var lCheck1;
		prompt iif(!lDisabled, "This is enabled", "This is disabled");
		when {|| !lDisabled };
		size 100,20;
		of aoParent pixel
	oCheckbox1:cName := "lCheck1"
	oCheckbox1:cReadVar := "lCheck1"

	@SAY_ROW(3), SAY_COL say "Toggle enabled/disabled";
		of aoParent pixel
	@SAY_ROW(3), GET_COL checkbox oCheckDisabled;
		var lDisabled;
		size 100,20;
		prompt "Click to disabled";
		of aoParent pixel
	oCheckDisabled:bChange := { ||;
		oCheckbox1:SetText(iif(!lDisabled, "This is enabled", "This is disabled")),;
		oCheckbox1:SetDisable(lDisabled),;
		oCheckbox1:ctrlRefresh();
		}
	oCheckDisabled:cName := "lCheck2"
	oCheckDisabled:cReadVar := "lCheck2"

	//TSrvObject and TControl
	u_allEvents(oCheckbox1, "oCheckbox1")
	//u_allEvents(oCheckDisabled, "oCheckDisabled")
return

/*/{Protheus.doc} ckt_03
Component Checkbox Test.

@type function
@version 1.0.0
@author John.mendes
@since 21/10/2025
/*/

static function ckt_03(aoParent)
	Local oCheckBox, oCheckBox2, oCheckBox3, oCheckBox4
	Local oFont,oTGet1
	Local lCheck1, lCheck2, lCheck3, lCheck4 := .T.
	Local cTGet1 := "Teste Checkbox"
	Local l := .F.

	u_remoteLog("save01: start")

	oFont := TFont():New('Courier new',,-18,.T.)

	oCheckBox := TCheckBox():New(10, 10, "CheckBox", {|u| If( PCount() == 0, lCheck1, lCheck1:= u ) },aoParent, 100, 20,,,oFont)
	oCheckBox2 := TCheckBox():New(20, 10, "CheckBox2", {|u| If( PCount() == 0, lCheck2, lCheck2:= u ) },aoParent, 100, 20,,,oFont,,CLR_RED,CLR_BLUE,,.T.,"Exibir hover",,{ || cTGet1 := if(lCheck2, "CheckBox foco", "CheckBox foco al"), oTGet1:ctrlRefresh() })
	oCheckBox3 := TCheckBox():New(30, 10, "CheckBox3", {|u| If( PCount() == 0, lCheck3, lCheck3:= u ) },aoParent, 100, 20,,,oFont,,CLR_RED,CLR_BLUE,,.T.,,,)
	oCheckBox4 := TCheckBox():New(60, 10, "CheckBox4", {|u| If( PCount() == 0, lCheck4, lCheck4:= u ) },aoParent, 100, 20,,,oFont,{|| l := if(lCheck4 == .T.,.T.,.F.)},CLR_RED,CLR_BLUE,,.T.,,,)

	oCheckBox:cName := "oCheckBox"
	oCheckBox:cReadVar := "oCheckBox"
	oCheckBox:bChange := { || cTGet1 := if(lCheck1, "CheckBox True", "CheckBox False"), oTGet1:ctrlRefresh() }

	oCheckBox2:cName := "oCheckBox2"
	oCheckBox2:cReadVar := "oCheckBox2"

	oCheckBox3:cName := "oCheckBox3"
	oCheckBox3:cReadVar := "oCheckBox3"
	//oCheckBox3:setCss("{color: #00ff40ff; height: 50px;max-height: 50px;}")
	oCheckBox3:bChange := { || if(lCheck3, oCheckBox3:setCss("{color: #00ff40ff; height: 50px;max-height: 50px;}"), oCheckBox3:setCss("{color: #5f3506ff; height: 30px;max-height: 30px;}"))}

	oCheckBox4:cName := "oCheckBox4"
	oCheckBox4:cReadVar := "oCheckBox4"

	oTGet1 := TGet():New( 80,10,{||cTGet1},aoParent,60,10,,,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet1,,,, )
	oTGet1:cName := "oTGet1"
	oTGet1:cReadVar := "oTGet1"

	u_remoteLog("save01: end")
Return

Static Function ftestKey(aoParent, acWho, acValue)
	u_firedEvent(aoParent, acWho + ": " + acValue)
	u_remoteLog("triggered: ["+acWho+"] " + acValue)
Return

