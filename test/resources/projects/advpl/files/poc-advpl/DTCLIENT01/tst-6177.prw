#INCLUDE "TOTVS.CH"

user function tst6177()
	local oDlg := nil
	local oTextBtn := nil

	u_startRemoteLog("DTCLIENT01-6177: CursorWait() nao causa nenhum efeito no smartclient web")

	define dialog oDlg title "DTCLIENT01-6177" from 180, 180 to 550, 700 pixel

	@ 15, 005 button oTextBtn;
		prompt "Start Process";
		action {|| process()};
		of oDlg pixel

	ACTIVATE DIALOG oDlg CENTERED

	u_stopRemoteLog()
Return

static function process()
	Local nTotal    := 0
	Local aDados    := Array(60)

	//Muda o cursor para carregamento
	u_remoteLog("CursorWait: chamada")
	CursorWait()

	MsgRun("Lendo informações...", "Teste CursorWait", {|| aEval(aDados,{|x|sleep(500),  nTotal++}) })

	//Volta o cursor para flecha
	u_remoteLog("CursorArrow: chamada")
	CursorArrow()

return
