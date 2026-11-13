#include "protheus.ch"

#define SAY_COL 010
#define GET_COL 90
#define SAY_ROW(x) (015 * (x))

//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-5864
user Function tst5864()
	local aOption := {;
		{"TPaintPanel", "_5864_01" },;
		{"POC Chamado", "POC5864"} ;
		}

	public oTPanel := nil
	public oBmp := nil

	u_startRemoteLog("DTCLIENT01-5864: setBlink")

	u_selectTest("DTCLIENT01-5864", aOption)

	u_stopRemoteLog()

return

user function blinkOnOff(focus)
	oTPanel:InsertBlinker(1);

	// Blink on/off
	if focus
		if oTPanel != nil
			oTPanel:setBlinker(1000)
		endif
	else
		if oTPanel != nil
			oTPanel:setBlinker(0)
		endif
	endif

return .t.

user Function _5864_01(aoParent)
	Local oDlg
	Local cBARRAS := If(GetRemoteType() == 2,"/","\")
	Local path := GetTempPath()+'rodados'+cBARRAS
	Local cImagem := path + 'ng_estrutura_2.png'
	local oLayout
	local oButtons := array(9)

	Private oTPanel

	If !File( cImagem )
		MNTA232IMG()
	EndIf

	DEFINE DIALOG oDlg TITLE "TPaintPanel: _5864_01" FROM 180,180 TO 720,1240 PIXEL

	//PALIATIVO: busca por paliativo, não funcionou
	oDlg:bFocusChange := {|o,focus| u_blinkOnOff(focus)}
	oDlg:bWindowState := {|o,state| u_blinkOnOff(.t.)}
	//PALIAITIVO

	oLayout := TGridLayout():New(oDlg, CONTROL_ALIGN_LEFT, 150, 0)
	oLayout:setColor(,CLR_BLUE)

	@ 000, 000 scrollbox oScrollBox;
		horizontal ;
		vertical ;
		size 270, 1240 ;
		of oDlg ;
		border;
		pixel

	oScrollBox:Align := CONTROL_ALIGN_ALLCLIENT
	oScrollBox:cName := "oScrollBox"
	oScrollBox:cReadVar := "oScrollBox"

	oTPanel := TPaintPanel():New(0,0,1240,720,oScrollBox,.F.)

	oTPanel:addShape("id=0;type=1;left=0;top=0;width=1240;height=720;"+;
		"gradient=1,0,0,0,0,0.0,#D0CEBC;pen-width=1;"+"pen-color=#ffffff;can-move=0;can-mark=0;is-container=1;")

	oTPanel:addShape("id=1;type=8;left=0;top=0;width=300;height=500"+;
		";image-file="+lower(cImagem)+";can-move=1;can-deform=1;can-mark=0;is-container=0")

	oTPanel:addShape("id=2;type=4;left=04;"+;
		"top=200;width=100;height=100;gradient=2,050,050,070,-1,0.2,"+;
		"#ffffff,0.8,#67FF67,1.0,#000000;gradient-hover=2,050,050,"+;
		"070,-1,0.2,#ffffff,0.8,#C6FF9F,1.0,#000000;"+;
		"pen-width=1;pen-color=#000000;can-move=1;can-mark=1;is-container=0;")

	oTPanel:Show()

	@ SAY_ROW(0),0 button oButtons[1] ;
		prompt "Insert #1" ;
		of oLayout pixel;
		action { ||;
		oTPanel:InsertBlinker(1);
		}

	@ SAY_ROW(1),0 button oButtons[2];
		prompt "Insert #2" ;
		of oLayout pixel;
		action { ||;
		oTPanel:InsertBlinker(2);
		}

	@ SAY_ROW(2),0 button oButtons[3];
		prompt "Remove #1" ;
		of oLayout pixel;
		action { ||;
		oTPanel:deleteBlinker(1);
		}

	@ SAY_ROW(3),0 button oButtons[4];
		prompt "Remove #2" ;
		of oLayout pixel;
		action { ||;
		oTPanel:deleteBlinker(2);
		}

	@ SAY_ROW(4),0 button oButtons[5] ;
		prompt "setBlinker(1000)" ;
		of oLayout pixel;
		action { ||;
		oTPanel:setBlinker(1000);
		}

	@ SAY_ROW(5),0 button oButtons[6] ;
		prompt "setBlinker(5000)" ;
		of oLayout pixel;
		action { ||;
		oTPanel:setBlinker(5000);
		}

	@ SAY_ROW(6),0 button oButtons[7] ;
		prompt "setBlinker(0)" ;
		of oLayout pixel;
		action { ||;
		oTPanel:setBlinker(0),;
		}

	@ SAY_ROW(7),0 button oButtons[8] ;
		prompt "Remove All" ;
		of oLayout pixel;
		action { ||;
		oTPanel:deleteBlinker(1),;
		oTPanel:deleteBlinker(2);
		}

	@ SAY_ROW(8),0 button oButtons[9] ;
		prompt "New Dlg" ;
		of oLayout pixel;
		action { ||;
		u_newDlg(),;
		}

	ACTIVATE DIALOG oDlg ;
		CENTERED

Return .T.

user function newDlg()
	local oDlg

	DEFINE DIALOG oDlg TITLE "New Dialog" FROM 180,180 TO 100,100 PIXEL

	odlg:ACTIVATE()

return
user function POC5864()
	Local oDlg
	Local cBARRAS := If(GetRemoteType() == 2,"/","\")
	Local path := GetTempPath()+'rodados'+cBARRAS
	Local cImagem := path + 'ng_estrutura_2.png'

	Private oTPanel

	If !File( cImagem )
		MNTA232IMG()
	EndIf

	DEFINE DIALOG oDlg TITLE "TPaintPanel: POC" FROM 180,180 TO 720,1240 PIXEL

	oTPanel := TPaintPanel():New(0,0,1240,720,,.F.)

	oTPanel:addShape("id=0;type=1;left=0;top=0;width=1240;height=720;"+"gradient=1,0,0,0,0,0.0,#D0CEBC;pen-width=1;"+"pen-color=#ffffff;can-move=0;can-mark=0;is-container=1;")

	oTPanel:addShape("id=1;type=8;left=0;top=0;width=300;height=500"+;
		";image-file="+lower(cImagem)+";can-move=1;can-deform=1;can-mark=0;is-container=0")

	oTPanel:InsertBlinker(1)
	oTPanel:setBlinker(2000)

	oTPanel:Show()

	ACTIVATE DIALOG oDlg ;
		CENTERED

Return .T.
