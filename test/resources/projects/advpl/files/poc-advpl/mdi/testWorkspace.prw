#INCLUDE "TOTVS.CH"

User FUNCTION testWorkspace()
	Private workFolder:= NIL
	Private oDlg1
	Private workspace := NIL

	SetFlatControls(.T.)
	SetStyle(5)

	DEFINE MSDIALOG oDlg1 TITLE "Exemplo CreateSession" FROM 000,000 TO 600,800 PIXEL
		oPanel := tPanel():New(0,0,"",oDlg1,,,,,,60,60)
		oPanel:Align := CONTROL_ALIGN_LEFT

		oButton1:= TButton():New( 160, 2, "Create WSFolder", oPanel, {|| CreateFolder() } ,12,10,,,.F.,.T.,.F.,,.F.,,,.F. )
		oButton1:Align := CONTROL_ALIGN_TOP
		
		oButton2:= TButton():New( 160, 2, "Create Work", oPanel, {|| CreateWork() } ,12,10,,,.F.,.T.,.F.,,.F.,,,.F. )
		oButton2:Align := CONTROL_ALIGN_TOP
		
		oButton3:= TButton():New( 160, 2, "WS Session", oPanel, {|| WSSession() } ,12,10,,,.F.,.T.,.F.,,.F.,,,.F. )
		oButton3:Align = CONTROL_ALIGN_TOP

		oButton4:= TButton():New( 160, 2, "WSF Session", oPanel, {|| WSFSession() } ,12,10,,,.F.,.T.,.F.,,.F.,,,.F. )
		oButton4:Align := CONTROL_ALIGN_TOP

		oButton5:= TButton():New( 160, 2, "Create Window", oPanel, {|| OpenWin() } ,12,10,,,.F.,.T.,.F.,,.F.,,,.F. )
		oButton5:Align := CONTROL_ALIGN_TOP

		oButton6:= TButton():New( 160, 2, "Set Css", oPanel, {|| MySetCss() } ,12,10,,,.F.,.T.,.F.,,.F.,,,.F. )
		oButton6:Align := CONTROL_ALIGN_TOP

	oDlg1:Activate()
Return

STATIC FUNCTION MySetCss()
	CssDictAdd("TButton", "TButton img {display: none ;}")
	CssDictAdd("TButton", "TButton button {background-image: none ;}")
	CssDictAdd("TButton", "TButton {background-color: green;}")
RETURN

STATIC FUNCTION CreateFolder()
	if (workFolder == NIL)
		workFolder := TWorkspaceFolder():New( oDlg1, 060, 000, 280, 280 )
		//workFolder:Align := CONTROL_ALIGN_ALLCLIENT
	endif
RETURN

STATIC FUNCTION CreateWork()
	local workspace
	local cTitle := "Aba 1"

	if (workFolder != NIL)
		workspace:= TWorkSpace():New(cTitle, workFolder)
		workspace:SetStatusBarText("Texto da barra de status 01")
	endif
RETURN

STATIC FUNCTION WSFSession()
	Local session:= getThread()

	CreateSession(session, workFolder, "testTIBrowse", session)
RETURN

STATIC FUNCTION WSSession()
	Local session:= getThread()
	local workspace := TWorkSpace():New("Aba " + session, workFolder )

	workspace:SetStatusBarText("Texto da barra de status - Sessao " + session)

	CreateSession(session, workspace, "u__I1549", session)
RETURN

User FUNCTION NewWorkspace(cID)
	Private cThread := cID

	DEFINE DIALOG oDlg2 TITLE "Exemplo TGet" FROM 180,180 TO 550,700 PIXEL

		cTGet1 := "Teste TGet 01 - " + cID
		oTGet1 := TGet():New( 01,01,{||cTGet1},oDlg2,096,009,;
	              "@!",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet1,,,, )

	ACTIVATE DIALOG oDlg2 CENTERED

Return

User FUNCTION NewFolder()
	workSpace := TWorkSpace():New("Aba ")
	workSpace:SetStatusBarText("Texto da barra de status - Tela " )


	DEFINE DIALOG oDlg3 TITLE "Exemplo TGet" FROM 180,180 TO 550,700 PIXEL OF workSpace

		cTGet1 := "Teste TGet 01 - "
		oTGet1 := TGet():New( 01,01,{||cTGet1},oDlg3,096,009,;
	              "@!",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet1,,,, )

	ACTIVATE DIALOG oDlg3 CENTERED

Return

STATIC FUNCTION OpenWin()

	DEFINE DIALOG oDlg4 TITLE "Exemplo Window" FROM 0,0 TO 482,544 PIXEL
		oTBitmap1 := TBitmap():New(01,01,260,184,"fwby_logo.png",,.T.,oDlg4,;
	                {|| OpenWin() },,.F.,.F.,,,.F.,,.T.,,.F.)

	ACTIVATE DIALOG oDlg4 CENTERED
RETURN

Static Function getThread()
	Static __nID := 0
	__nID++
Return StrZero(__nID, 6)

User function testModalDialog()
	aSize := MsAdvSize()  

	DEFINE DIALOG oDlg1 TITLE "Exemplo Window" FROM  aSize[7],0 TO aSize[6],aSize[5] PIXEL
		oTBitmap1 := TBitmap():New(01,01,260,184,"fwby_logo.png",,.T.,oDlg1,;
					{|| OpenWin() },,.F.,.F.,,,.F.,,.T.,,.F.)

	ACTIVATE DIALOG oDlg1


	DEFINE DIALOG oDlg2 TITLE "Exemplo Window" FROM  0,0 TO 800,800 PIXEL
	oTBitmap1 := TBitmap():New(01,01,260,184,"fwby_logo.png",,.T.,oDlg2,;
				{|| OpenWin() },,.F.,.F.,,,.F.,,.T.,,.F.)

	ACTIVATE DIALOG oDlg2

RETURN

User function test2ModalDialog()
	Private aSize := MsAdvSize(,.F.,430)

	DEFINE MSDIALOG oDlg TITLE "Exemplo Window" From aSize[7],0 To aSize[6],aSize[5] OF oMainWnd PIXEL
		oPanel := TPanel():New(0, 0, Nil, oDlg, Nil, .T., .F., Nil, Nil, 0, 0, .T., .F. )
		oPanel:Align := CONTROL_ALIGN_ALLCLIENT

	ACTIVATE MSDIALOG oDlg
RETURN


User Function test3ModalDialog()
aSize := MsAdvSize()  
DEFINE DIALOG oDlg TITLE "Exemplo TFolder" FROM 0,0 TO aSize[6],aSize[5] PIXEL

 /*oPanel:= tPanel():New(01,01,"Panel 1",oDlg,,.T.,,,,100,100)
 oPanel:Align := CONTROL_ALIGN_ALLCLIENT
    	
  oScroll := TScrollArea():New(oPanel,01,01,100,100)
  oScroll:Align := CONTROL_ALIGN_ALLCLIENT
		 
   oPanel2:= tPanel():New(01,01,"Panel 2",oScroll,,.T.,,,,100,100)
   oScroll:SetFrame( oPanel2 )
		  
    oPanelCss := TPanelCss():New(0,0,nil,oPanel2,nil,nil,nil,nil,nil,100,100,nil,nil)
    oPanelCss:Align := CONTROL_ALIGN_ALLCLIENT
		
     aTFolder := { 'Aba 01' }
     oTFolder := TFolder():New( 20,0,aTFolder,,oPanelCss,,,,.T.,,100,100 )
     oTFolder:Align := CONTROL_ALIGN_ALLCLIENT
 
      oPanelCss2 := TPanelCss():New(0,0,nil,oTFolder:aDialogs[1],nil,nil,nil,nil,nil,100,100,nil,nil)
      oPanelCss2:Align := CONTROL_ALIGN_ALLCLIENT

			oScroll1 := TScrollArea():New(oPanelCss2,01,01,150,100)
			oScroll1:Align := CONTROL_ALIGN_ALLCLIENT
				   
			    oPanel3:= tPanel():New(01,01,"Panel 7",oScroll1,,.T.,,,,150,100)
			    oScroll1:SetFrame( oPanel3 )
			         
			        oPanelCss3 := TPanelCss():New(0,0,nil,oPanel3,nil,nil,nil,nil,nil,150,100,nil,nil)
			        oPanelCss3:Align := CONTROL_ALIGN_ALLCLIENT

						oPanelCss4 := TPanelCss():New(0,0,nil,oPanelCss3,nil,nil,nil,nil,nil,oPanelCss3:nClientWidth/2,oPanelCss3:nClientHeight/2,nil,nil)
						
							oPanelCss5 := TPanelCss():New(0,0,nil,oPanelCss4,nil,nil,nil,nil,nil,oPanelCss4:nClientWidth/2,oPanelCss4:nClientHeight/2,nil,nil)
						
								oPanel4:= tPanel():New(800,20,"Panel 7",oPanelCss5,,.T.,,,,150,100)
								oPanel4:Align := CONTROL_ALIGN_RIGHT*/

								oGrid := tGrid():New( oDlg,0,0,100,100 )
								oGrid:Align := CONTROL_ALIGN_ALLCLIENT
								oGrid:SetSelectionMode(1)
								oGrid:setRowHeight(50)

								oGrid:AddColumn( 1, "Código", 50, CONTROL_ALIGN_LEFT )
								oGrid:AddColumn( 2, "Coluna 2", 50, CONTROL_ALIGN_LEFT )
								oGrid:AddColumn( 3, "Coluna 3", 50, CONTROL_ALIGN_LEFT )

								oGrid:setRowData( 1, {|o| { "0001", "Produto 1 teste tamanho da informação na coluna (verificando se quebra linha) blabla bla blablabla", "10,50" } } )


	ACTIVATE DIALOG oDlg CENTERED
Return
