#include "protheus.ch"

user function replayTela(aaOpcoes, acOpcao)
	Local oDlg,oSay1,oBtn, cOpcao

	if !(valType(aaOpcoes) == "A")
		msgAlerta("Parametro aaOpcoes não é uma lista (array)")
		return cOpcao
	endif

	oDlg := MSDIALOG():Create()
	oDlg:cName := "oDlg"
	oDlg:cCaption := "Escolha um número"
	oDlg:nLeft := 0
	oDlg:nTop := 0
	oDlg:nWidth := 400
	oDlg:nHeight := 250
	oDlg:lCentered := .T.

	oSay1 := TSAY():Create(oDlg)
	oSay1:cName := "oSay1"
	oSay1:cCaption := "Escolha um número acionando um dos botões abaixo."
	oSay1:nLeft := 10
	oSay1:nTop := 28
	oSay1:nWidth := 250
	oSay1:nHeight := 17
	oSay1:lTransparent := .T.

	oBtn := TButton():Create(oDlg)
	oBtn:cCaption := "<nenhum>"
	oBtn:blClicked := {|| cOpcao := "", oDlg:end() }
	oBtn:nWidth := 90
	oBtn:nTop := 90
	oBtn:nLeft := 10

	oBtn := TButton():Create(oDlg)
	oBtn:cCaption := "<encerrar>"
	oBtn:blClicked := {|| cOpcao := "*", oDlg:end() }
	oBtn:nWidth := 90
	oBtn:nTop := 90
	oBtn:nLeft := 110

	aEval(aaOpcoes, { |x,i| ;
		oBtn := TButton():Create(oDlg),;
		oBtn:cCaption := x,;
		oBtn:blClicked := &("{|| conout('Foi acionado "+x+"'),cOpcao := '"+x+"', oDlg:end() }"),;
		oBtn:nWidth := 30,;
		oBtn:nTop := 60,;
		oBtn:nLeft := (10 * i) + (oBtn:nWidth*(i-1));
		})

	//ACTIVATE DIALOG oDlg CENTERED
	if acOpcao == ""
		oDlg:Activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,.T.,,,, oDlg:bRClicked, )
	else
		cOpcao := acOpcao
	endif
	//oDlg:Activate()

Return cOpcao
