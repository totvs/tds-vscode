#include "protheus.ch"
#include "apwizard.ch"


User Function SANWIZ()
	Local oNo := LoadBitmap( GetResources(), "LBNO" )
	Local oOk := LoadBitmap( GetResources(), "LBTIK" )
	Local oWizard
	Local oGet1, oGet2, oGet3
	Local cGet1 := 0
	Local cGet2 := 0
	Local cGet3 := 0
	Local nPanel
	Local aWiz := {{.F., ""}}
	Local oLbxWiz
	Local oChkTWiz
	Local oChkIWiz
	Local lChkTWiz := .F.
	Local lChkIWiz := .F.
	Local lWiz := .F.
	Local __lIsP12 := GetVersao(.F.) == "12"

	DEFINE WIZARD oWizard TITLE "Wizard" HEADER "Wizard de Configuração" MESSAGE " ";
		TEXT "Esta é a tela de apresentação do wizard que pode ser suprimida através de parâmetros" PANEL;
	NEXT {|| .T.} FINISH {|| .T.}

// PANEL 2
//cria um novo passo (janela) para o wizard
CREATE PANEL oWizard HEADER "Painel 2" MESSAGE "Painel2" PANEL;
	BACK {|| .T.} ;
	NEXT {|| If(Empty(cGet1) .Or. cGet1 == 0, (MsgStop("Informe o conteúdo para o Get1"), .F.), If(Empty(cGet2) .Or. cGet2 == 0, (msgStop("Informe o conteúdo para o Get2"), .F.), .T.))};
	FINISH {|| .T.} EXEC {|| .T.}

@ 010, 010 TO 125,280 OF oWizard:oMPanel[2] PIXEL
@ 20, 15 SAY oSay1 VAR "Get1: " OF oWizard:oMPanel[2] PIXEL
@ 20, 35 GET oGet1 VAR cGet1 PICTURE "9999" OF oWizard:oMPanel[2] SIZE 40,009 PIXEL
@ 40, 15 SAY oSay2 VAR "Get2: " OF oWizard:oMPanel[2] PIXEL
@ 40, 35 GET oGet2 VAR cGet2 PICTURE "9999" OF oWizard:oMPanel[2] SIZE 40,009 PIXEL

// PANEL 3
//cria um novo passo (janela) para o wizard
CREATE PANEL oWizard HEADER "Painel 3" MESSAGE "Painel3" PANEL;
	BACK {|| oWizard:nPanel := 3, .T.};
	NEXT {|| If(Ascan(aWiz,{|x| x[1] == .T.}) == 0, (MsgStop('Por favor selecione pelo menos um registro no listbox.'), .F.), .T. )} EXEC {||lChkTWiz:=.F., .T.}

@ 010, 010 TO 125,280 OF oWizard:oMPanel[3] PIXEL
@ 018, 020 LISTBOX oLbxWiz FIELDS HEADER "","Owner" SIZE 171, 88 ON DBLCLICK (aWiz[oLbxWiz:nAt,1] := !aWiz[oLbxWiz:nAt,1],If(!aWiz[oLbxWiz:nAt,1],lChkTWiz := .F., ),oLbxWiz:Refresh(.f.),ApSxVerChk(@lChkTWiz,@aWiz,@oLbxWiz,@oChkTWiz)) OF oWizard:oMPanel[3] PIXEL
oLbxWiz:SetArray(aWiz)
oLbxWiz:bLine := {|| {If(aWiz[oLbxWiz:nAt,1],oOK,oNO),aWiz[oLbxWiz:nAt,2]}}
oLbxWiz:bRClicked := { || AEVAL(aWiz,{|x|x[1]:=!x[1]}),oLbxWiz:Refresh(.F.) }

@ 111, 20 CHECKBOX oChkTWiz VAR lChkTWiz PROMPT "Marcar Todos" SIZE 62, 10 OF oWizard:oMPanel[3] PIXEL
oChkTWiz:blClicked := {|| AEval( aWiz,{|x,y| x[1] := lChkTWiz , If(lChkTWiz, (lChkIWiz := .F.,oChkIWiz:Refresh()), )})}
@ 111, 100 CHECKBOX oChkIWiz VAR lChkIWiz PROMPT "Inverter Marca" SIZE 62, 10 OF oWizard:oMPanel[3] PIXEL
oChkIWiz:blClicked := {|| AEval( aWiz,{|x,y| x[1] := !x[1]}), lChkTWiz := (Ascan(aWiz,{|x|!x[1]}) == 0), oChkTWiz:Refresh()}

// PANEL 4
//cria um novo passo (janela) para o wizard
CREATE PANEL oWizard HEADER "Configurações" MESSAGE "Selecione as configurações para a geração do arquivo." PANEL;
	BACK {|| oWizard:nPanel := 4, .T.} NEXT {|| .T.} ;
	FINISH {|| If(Empty(cGet3) .Or. cGet3 == 0, (MsgStop('Informe o conteúdo para o Get3'), .F.), (lWiz := .T., .T.)) } EXEC {|| .T.}
@ 010, 010 TO 125,280 OF oWizard:oMPanel[4] PIXEL
@ 20, 15 SAY oSay3 VAR "Get3: " OF oWizard:oMPanel[4] PIXEL
@ 20, 35 GET oGet3 VAR cGet3 PICTURE "9999" OF oWizard:oMPanel[4] SIZE 40,009 PIXEL

If __lIsP12
	owizard:omodal:lescclose:=.F.
	owizard:omodal:oowner:lescclose:=.F.
Else
	oWizard:oDlg:lEscClose := .F.
Endif
ACTIVATE WIZARD oWizard CENTERED VALID {|| .T. }

If lWiz
	MsgAlert("Executa a rotina de processamento após a seleção dos dados no Wizard")
EndIf
Return

Static Function ApSxVerChk(lChkTudo,aAlias,oLbx,oChk)
	Local nI
	Local nCount := 0
	Local nSizenSize := len(aAlias)

	For nI := 1 to nSize
		If !aAlias[nI,1]
			nCount++
		EndIf
	Next

	If nCount > 0
		lChkTudo := .F.
	Else
		lChkTudo := .T.
	EndIf

	oLbx:Refresh()
	oChk:Refresh()

Return lChkTudo
