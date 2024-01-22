#include "protheus.ch"


user function funarr()
	conout("executando u_funarr") 
		
	private result := __funarr()

	conout("executor u_funarr") 

return result 

user function escolheNum(replay, replayPath, numbers)

	local n, cResp := "xxxxx", cMsg := ""
	local aOpcoes := {}
	private cOpcao
	private ondeEstou := "escolheNum"
	public aPublic := {}

	if replay == "true"
		replay = .t.
		TDSReplay(.T. , {"*"}, {}, {"*"} , replayPath, 0 , .t. , "")
	endif

	// essa seq. UTF 8 invÃ¡lida para json do DA
	//corrigido versÃ£o DA 1.1.24 / srv
	//private paraDeFuncionar := "se fizer hover aqui, para de funcionar ÃƒÂº"
//
	for n := 1 to 5
		aAdd(aOpcoes, strZero(n,1,0))
	next
//
	n := 0
	while !(cResp == "*")
		if (replay) 
			cOpcao = substr(numbers, 1, 1)
			numbers =  substr(numbers, 2)
			conout("BOT: select number " + cOpcao)
		else
			tela(aOpcoes)
		endif

		n++
		//cResp := trim(cOpcao)
		cResp := cOpcao

		if cResp == "1"
			cMsg := "Você escolheu o número 1"
		elseif cResp == "2"
			cMsg := "Você escolheu o número 2"
		elseif cResp == "3"
			cMsg := "Você escolheu o número 3"
		elseif cResp == "4"
			cMsg := "Você escolheu o número 4"
		elseif cResp == "5"
			cMsg := "Você escolheu o número 5"
		else
			cMsg := "Nenhum número escolhido"
		endif

		if !empty(cResp)
			if cResp == "2" .or. cResp == "4"
				cMsg += " e é PAR"
			else
				cMsg += " e é IMPAR"
			endif
		endif

		if !(cResp == "*")
			if replay
				conout("BOT: " + cMsg) 
			else 
				msgAlert(cMsg)
			endif
		endif

	enddo

	if replay
		TDSReplay(.F.)
	endif

return

static function tela(aaOpcoes)
	Local oDlg,oSay1 := "",oBtn

	if !(valType(aaOpcoes) == "A")
		msgAlerta("Parametro aaOpcoes nï¿½o ï¿½ uma lista (array)")
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
	oSay1:cCaption := "Escolha um número acionando um dos botï¿½es abaixo."
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
	oDlg:Activate( oDlg:bLClicked, oDlg:bMoved, oDlg:bPainted,.T.,,,, oDlg:bRClicked, )
//oDlg:Activate()

Return cOpcao
