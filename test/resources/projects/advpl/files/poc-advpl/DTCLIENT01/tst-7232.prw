#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 060
#define SAY_ROW(x) (015 * (x))

//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-7232
//Problema campo MEMO - Copiar e colar informações 10.1.6RC12
User Function tst7232()
	local aOption := {;
		{"Get Multiline", { |aoParent| proc_01(aoParent)} }, ;
		}

	u_startRemoteLog("DTCLIENT01-7232: Problema campo MEMO - Copiar e colar informações 10.1.6RC12")

	u_selectTest("DTCLIENT01-7232", aOption)

	u_stopRemoteLog()

return

static function proc_01(aoParent)
	local cText := ""
	local cText2 := ""
	local cEcho := ""
	local cPopup := "This element contains a custom context menu in AdvPL."
	local oMultiget
	local oMultiRClick
	local oEcho
	local oPopup
	local bOldOnCHange

	u_remoteLog("proc_01: start")

	@SAY_ROW(1), SAY_COL say "TMultiGet";
		of aoParent;
		pixel
	@SAY_ROW(2), SAY_COL get oMultiget;
		var cText;
		size 120,60;
		multiline;
		of aoParent;
		pixel
	oMultiget:cName := "cText"
	oMultiget:cReadVar := "cText"
	u_controlEvents(oMultiget, "oMultiget")

	@SAY_ROW(1), SAY_COL + 130 say "TMultiGet (RClick)";
		of aoParent;
		pixel
	@SAY_ROW(2), SAY_COL + 130 get oMultiRClick;
		var cText2;
		size 120,60;
		multiline;
		of aoParent;
		pixel
	oMultiRClick:cName := "cText2"
	oMultiRClick:cReadVar := "cText2"
	oMultiRClick:bRClicked := {|| alert("RClick") }

	@SAY_ROW(7), SAY_COL say "TMultiGet (echo)";
		of aoParent;
		pixel
	@SAY_ROW(8), SAY_COL get oEcho;
		var cEcho;
		size 120,60;
		multiline;
		of aoParent;
		pixel
	oEcho:cName := "cEcho"
	oEcho:cReadVar := "cEcho"
	//u_allEvents(oEcho, "oEcho")
	bOldOnCHange := oMultiget:bChange
	oMultiget:bChange := {|| ;
		eval(bOldOnCHange, oMultiget),;
		cText := iif(left(cText,1) == "!", upper(cText), cText),;
		cEcho := cText,;
		oEcho:refresh(),;
		oMultiget:refresh();
		}

	@SAY_ROW(7), SAY_COL + 130 say "TMultiGet (Popup)";
		of aoParent;
		pixel
	@SAY_ROW(8), SAY_COL + 130 get oPopup;
		var cPopup;
		size 120,60;
		multiline;
		of aoParent;
		pixel
	oPopup:cName := "cPopup"
	oPopup:cReadVar := "cPopup"
	//u_allEvents(oEcho, "oPopup")

	//u_allEvents(oMultiget, "oPopup")
	oPopup:setPopup(u_popupMenu(aoParent, "Popup"))

	u_remoteLog("proc_01: end")
return

static function xxxx(cText, cEcho, oEcho)
return
