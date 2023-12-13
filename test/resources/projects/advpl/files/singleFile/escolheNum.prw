#include "protheus.ch"

user function escolheNum(replay, replayPath, numbers)
	local n, cResp := "xxxxx", cMsg := ""
	local aOpcoes := {}
	local cOpcao := ""
	private ondeEstou := "escolheNum"
	public aPublic := {}

	if replay != nil .and. lower(replay) == "true"
		replay = .t.
		TDSReplay(.T. , {"*"}, {}, {"*"} , replayPath, 0 , .t. , "")
	else
		replay := .f.
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
			cOpcao := ""
		endif
		cOpcao := u_replayTela(aOpcoes, cOpcao)

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
		elseif replay
			cResp := "*"
			loop
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
