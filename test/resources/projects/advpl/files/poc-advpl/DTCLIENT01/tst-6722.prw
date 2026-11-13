#include "TOTVS.CH"
#INCLUDE 'PROTHEUS.CH'
#INCLUDE 'RWMAKE.CH'
#INCLUDE 'FONT.CH'
#INCLUDE 'COLORS.CH'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

User Function tst6722()
	local aOption := {;
		{"Checkbox", "tstCkb" }, ;
		}

	u_startRemoteLog("DTCLIENT01-6722: Ajuste checkbox não atualiza ao clicar com espaço")

	u_selectTest("DTCLIENT01-6722", aOption)

	u_stopRemoteLog()

return

/*/{Protheus.doc} tstCkb
Ajuste checkbox não atualiza ao clicar com espaço.

@type function
@version 1.0.0
@author John.mendes
@since 13/10/2025
/*/

User Function tstCkb(aoParent)

	Local oCheckBox, oCheckBox2, oCheckBox3, oCheckBox4
	Local lCheck1, lCheck2, lCheck3, lCheck4 := .F.

	u_remoteLog("save01: start")



// Cria o Objeto tCheckBox usando o comando @ .. CHECKBOX
	//@ 10,10 CHECKBOX oChkBox VAR lCheck1 PROMPT "Selecione" SIZE 60,15 OF aoParent PIXEL
	//@ 20,10 CHECKBOX oChkBox VAR lCheck2 PROMPT "Selecione" SIZE 60,15 OF aoParent PIXEL
	//@ 30,10 CHECKBOX oChkBox VAR lCheck3 PROMPT "Selecione" SIZE 60,15 OF aoParent PIXEL
	//@ 40,10 CHECKBOX oChkBox VAR lCheck4 PROMPT "Selecione" SIZE 60,15 OF aoParent PIXEL
	oCheckBox := TCheckBox():New(10, 10, "CheckBox", {|u| If( PCount() == 0, lCheck1, lCheck1:= u ) },aoParent, 100, 20)
	oCheckBox2 := TCheckBox():New(20, 10, "CheckBox2", {|u| If( PCount() == 0, lCheck2, lCheck2:= u ) },aoParent, 100, 20)
	oCheckBox3 := TCheckBox():New(30, 10, "CheckBox3", {|u| If( PCount() == 0, lCheck3, lCheck3:= u ) },aoParent, 100, 20)
	oCheckBox4 := TCheckBox():New(40, 10, "CheckBox4", {|u| If( PCount() == 0, lCheck4, lCheck4:= u ) },aoParent, 100, 20)
	oCheckBox:cName := "oCheckBox"
	oCheckBox:cReadVar := "oCheckBox"
	oCheckBox2:cName := "oCheckBox2"
	oCheckBox2:cReadVar := "oCheckBox2"
	oCheckBox3:cName := "oCheckBox3"
	oCheckBox3:cReadVar := "oCheckBox3"
	oCheckBox4:cName := "oCheckBox4"
	oCheckBox4:cReadVar := "oCheckBox4"

	//SetKey(K_ALT_A,{||Alert('Chamou SetKey K_ALT_A.')})

	u_remoteLog("save01: end")
Return

Static Function ftestKey(aoParent, acWho, acValue)
	u_firedEvent(aoParent, acWho + ": " + acValue)
	u_remoteLog("triggered: ["+acWho+"] " + acValue)
Return

