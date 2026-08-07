#INCLUDE "TOTVS.CH"

user function tst5989()
	local oDlg := nil
	local oEdit := nil
	local cHtml

	u_startRemoteLog("DTCLIENT01-5989: Metodo RetText da tSimpleEditor() via Web retorna vazio")

	define dialog oDlg title "DTCLIENT01-5989" from 180, 180 to 550, 700 pixel

	oEdit := tSimpleEditor():New(0, 0, oDlg, 260, 184)
	oEdit:Load("Novo texto <b>Negrito</b>" + ;
		"<font color=red> Texto em Vermelho</font>" + ;
		"<font size=14> Texto com tamanho grande</font>")

	cHtml := oEdit:RetText()

	u_remoteLog("TSimpleEditor:retText -> " + cHtml)

	ACTIVATE DIALOG oDlg CENTERED

	u_stopRemoteLog()
Return
