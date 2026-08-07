#include "protheus.ch"

#define SAY_COL 010
#define GET_COL 90
#define SAY_ROW(x) (015 * (x))

// Função principal
user Function tst5831()
	local aOption := {;
		{"TPaintPanel", "_5831_01" }, ;
		{"TBitmap (Create)", "_5831_02" }, ;
		{"TBitmap (Save)", "_5831_03" }, ;
		{"TBitmap (Create/Save)", "_5831_04" }, ;
		}

	public oTPanel := nil
	public oBmp := nil

	u_startRemoteLog("DTCLIENT01-5831: SetImageSize")

	u_selectTest("DTCLIENT01-5831", aOption)

	u_stopRemoteLog()

return

user Function _5831_01(aoParent)
	Local oDlg
	Local cBARRAS := If(GetRemoteType() == 2,"/","\")
	Local path := GetTempPath()+'rodados'+cBARRAS
	Local cImagem := path + 'ng_estrutura_2.png'
	local oLayout
	local oButton1
	local oButton2
	local oButton3
	local oButton4

	If !File( cImagem )
		MNTA232IMG()
	EndIf

	DEFINE DIALOG oDlg TITLE "TPaintPanel Teste" FROM 180,180 TO 720,1240 PIXEL

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

	oTPanel:addShape("id=0;type=1;left=0;top=0;width=1240;height=720;"+"gradient=1,0,0,0,0,0.0,#D0CEBC;pen-width=1;"+"pen-color=#ffffff;can-move=0;can-mark=0;is-container=1;")
	// oTPanel:addShape("id=1;type=1;left=272;top=0;width=270;height=400;"+"gradient=1,0,0,0,0,0.0,#B0B7E0;pen-width=1;"+"pen-color=#ffffff;can-move=0;can-mark=0;is-container=1;")

	oTPanel:addShape("id=1;type=8;left=0;top=0;width=300;height=500"+;
		";image-file="+lower(cImagem)+";can-move=1;can-deform=1;can-mark=0;is-container=0")

	oTPanel:Show()
	// SaveImage()

	@ 0,0 button oButton1 ;
		prompt "Change Size (700X500)" ;
		of oLayout pixel;
		action { || oTPanel:SetImageSize(1,700,500) }

	@20,0 button oButton2 ;
		prompt "Change Size (500X500)" ;
		of oLayout pixel;
		action { || oTPanel:SetImageSize(1,500,500) }

	@40,0 button oButton3 ;
		prompt "Original Size" ;
		of oLayout pixel;
		action { || oTPanel:SetImageSize(1,470,192) }

	@60,0 button oButton4 ;
		prompt "Save PNG" ;
		of oLayout pixel;
		action { || saveImage(oTPanel) }

	ACTIVATE DIALOG oDlg CENTERED

Return .T.

user function _5831_02(aoParent)
	processBMP(aoParent, .T., .F.)
return

user function _5831_03(aoParent)
	processBMP(aoParent, .F., .T.)
return

user function _5831_04(aoParent)
	processBMP(aoParent, .T., .T.)
return

static function processBMP(aoParent, alCreate, alSave)
	Local cBARRAS := If(GetRemoteType() == 2,"/","\")
	Local path := GetTempPath()+'rodados'+cBARRAS
	Local cImage := path + 'ng_estrutura_2.PNG'
	Local cImageGer := GetTempPath()+StrTran(Time(),":","") + '.BMP'

	If !File( cImage )
		MNTA232IMG()
	EndIf

	if alCreate
		//oBmp := TBitmap():New( 0, 0, 500, 500, , , , aoParent, , , .t., , , , , , .t.)
		oBmp := TBitmap():New(0,0, 0, 0,,,.T.,,,,,.F.,,,,,.T.)
		oBmp:Hide()
		If oBmp:Load(,cImage)
			oBmp:lStretch:= .T.
			oBmp:lTransparent := .T.
			oBmp:nHeight := 720
			oBmp:nWidth  := 1280
			oBmp:nClrPane := CLR_RED
		else
			MsgStop("Erro na carga. File: " + cImage)
			return
		EndIf
	EndIf

	if alSave
		If !oBmp:SaveAsBmp(cImageGer)
			MsgStop('Ocorreu um erro na geracao')
		Else
			While !File(cImageGer)
				Sleep( 1000 )
			End While

			MsgStop('Bitmap supostamente gerado ' + cImageGer)
		EndIf
	endif

Return .T.

static function saveImage(aoPanel)
	local cImgEstru := GetTempPath(.f.)+StrTran(Time(),":","")
	local nTries := 10
	local cOutfile := cImgEstru + "-before-resize.PNG"

	aoPanel:SaveToPng(0, 0, 1280, 720, cOutfile)

	while !File(cOutfile) .and. nTries > 0
		sleep( 1000 )
		nTries--
	end while
	u_remoteLog("saveImage" , {{ "file", cOutfile}})

	aoPanel:setImageSize(1, 700, 500)

	cOutfile := cImgEstru + "-after-resize.PNG"
	aoPanel:saveToPng(0, 0, 1280, 720, cOutfile)

	nTries := 10
	while !File(cOutfile) .and. nTries > 0
		sleep( 1000 )
		nTries--
	end while
	u_remoteLog("saveImage" , {{ "file", cOutfile}})

return
