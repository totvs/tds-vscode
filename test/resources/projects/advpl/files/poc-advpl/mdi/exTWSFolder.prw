#INCLUDE "TOTVS.CH"
#include "tbiconn.ch"

User Function TWorkSpaceFolder()
	local oBtnInDlg
	local oBtnHelpDlg
	local oBtnInFolder

	Private aItems1 := {'Item1','Item2','Item3'}
	Private aItems2 := {'2Item1','2Item2','2Item3'}
	Private aItems3 := {'3Item1','3Item2','3Item3'}
	Private aItems4 := {'4Item1','4Item2','4Item3'}

	DEFINE DIALOG oDlg TITLE "Test TWorkSpaceFolder" FROM 0,0 TO 550,700 PIXEL

	oBtnInDlg := TButton():New(00, 020, "Click Here", oDlg,{|| textClick() }, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oBtnInDlg:bAction := {|| textClick("Click: Dialog") }

	oBtnHelpDlg := TButton():New(00, 080, "Help Dialog", oDlg,{|| hlpDlg("Click: Dialog") }, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oBtnInDlg:bAction := {|| helpDialog("Click: Dialog") }

	oWSpaceFolder := TWorkspaceFolder():New(oDlg,0,25,260,184)
	oWSpaceFolder:bCaptionChanged := {|x,c| Iif( empty( c ), ConOut( "Empty!" ), ConOut( c ) ) }

	oWSpace1 := TWorkSpace():New( "Aba 01 ", oWSpaceFolder )
	oWSpace1:SetStatusBarText("Texto da barra de status 01")
	cCombo1:= aItems1[1]
	oCombo1 := TComboBox():New(02,02,{|u|if(PCount()>0,cCombo1:=u,cCombo1)}, aItems1,100,20,oWSpace1,,{||},,,,.T.,,,,,,,,,'cCombo1')

	oBtnInFolder := TButton():New( 50, 020, "Click Here", oWSpace1,{|| textClick("Click: Folder") }, 40,10,,,.F.,.T.,.F.,,.F.,,,.F. )

	cTGet1 := "Teste TGet 01"
	oTGet1 := TGet():New( 100,20,{||cTGet1},oWSpace1,096,009,"@!",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet1,,,, )
	//oTGet1:bValid := {|| alwaysTrue(alert("Valid TGet"))}
	oTGet1:bValid := {|| textClick("Valid TGet")}

	oWSpace2 := TWorkSpace():New( "Aba 02 ", oWSpaceFolder )
	oWSpace2:SetStatusBarText("Texto da barra de status 02")
	cCombo2:= aItems2[1]
	oCombo2 := TComboBox():New(02,02,{|u|if(PCount()>0,cCombo2:=u,cCombo2)}, aItems2,100,20,oWSpace2,,{||},,,,.T.,,,,,,,,,'cCombo2')

	oWSpace3 := TWorkSpace():New( "Aba 03 ", oWSpaceFolder )
	oWSpace3:SetStatusBarText("Texto da barra de status 03")
	cCombo3:= aItems3[1]
	oCombo3 := TComboBox():New(02,02,{|u|if(PCount()>0,cCombo3:=u,cCombo3)}, aItems3,100,20,oWSpace3,,{||},,,,.T.,,,,,,,,,'cCombo3')

	oWSpace4 := TWorkSpace():New( "Aba 04 ", oWSpaceFolder )
	oWSpace4:SetStatusBarText("Texto da barra de status 04")
	cCombo4:= aItems4[1]
	oCombo4 := TComboBox():New(02,02,{|u|if(PCount()>0,cCombo4:=u,cCombo4)}, aItems4,100,20,oWSpace4,,{||},,,,.T.,,,,,,,,,'cCombo4')

	oWSpace5 := TWorkSpace():New( "Aba 05 ", oWSpaceFolder )
	oWSpace5:SetStatusBarText("Texto da barra de status 05")

	oWSpace6 := TWorkSpace():New( "Aba 06 ", oWSpaceFolder )
	oWSpace6:SetStatusBarText("Texto da barra de status 06")

	oWSpace7 := TWorkSpace():New( "Aba 07 ", oWSpaceFolder )
	oWSpace7:SetStatusBarText("Texto da barra de status 07")

	oWSpace8 := TWorkSpace():New( "Aba 08 ", oWSpaceFolder )
	oWSpace8:SetStatusBarText("Texto da barra de status 08")

	oWSpace9 := TWorkSpace():New( "Aba 09 ", oWSpaceFolder )
	oWSpace9:SetStatusBarText("Texto da barra de status 09")

	oWSpace10 := TWorkSpace():New( "Aba 10 ", oWSpaceFolder )
	oWSpace10:SetStatusBarText("Texto da barra de status 10")

	//oWSpace1:Hide()

	ACTIVATE DIALOG oDlg CENTERED

Return

static function textClick(acFiredBy)
	conout(">>> btnButton: " + acFiredBy)

	alert(acFiredBy)

	conout("<<< btnButton")
return .t.

static function hlpDlg(acFiredBy)
	conout(">>> hlpDlg: " + acFiredBy)

	showHelpDlg("ShowHelpDlg", {"Linha 01 do Help","Linha 02 do Help"},5,{"Solução 01","Solução 02"},5)

	conout("<<< hlpDlg")

return
