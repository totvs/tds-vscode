#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

//https://jiraproducao.totvs.com.br/browse/DTCLIENT01-6056
//Campo Memo não salva
User Function tst6056()
	local aOption := {;
		{"Save Get/Memo", { |aoParent| save_01(aoParent)} }, ;
		}

	u_startRemoteLog("DTCLIENT01-6056: Campo Memo não salva")

	u_selectTest("DTCLIENT01-6056", aOption)

	u_stopRemoteLog()

return

/*/{Protheus.doc} save_01
Contém TGet e TMultiGet para testar salva de dados via atalho.

@type function
@version 1.0.0
@author acandido
@since 08/09/2025
/*/
static function save_01(aoParent)
	local cGet := space(30)
	local cText := ""
	local cEcho := space(30)
	local cGetEcho := space(30)
	local oGet1
	local oTMultiget1
	local oEcho
	local oGetEcho
	local bChgEvent
	local bChgEchoOld

	u_remoteLog("save01: start")

	@SAY_ROW(2), SAY_COL say "TGet";
		of aoParent pixel
	@SAY_ROW(2), GET_COL get oGet1;
		var cGet;
		size 60, 12;
		of aoParent;
		pixel
	u_allEvents(oGet1, "oGet1")
	bChgEchoOld := oGet1:bChange

	@SAY_ROW(2), SAY_COL + 170 say "TGet (echo)";
		of aoParent pixel
	@SAY_ROW(2), GET_COL + 130 get oGetEcho;
		var cGetEcho;
		size 60, 12;
		of aoParent;
		pixel
	oGet1:bChange := {|| cGetEcho := cGet, eval(bChgEchoOld, oGetEcho), oGetEcho:refresh() }

	@SAY_ROW(3), SAY_COL say "TMultiGet";
		of aoParent;
		pixel
	@SAY_ROW(3), GET_COL get oTMultiget1;
		var cText;
		size 60,60;
		multiline;
		of aoParent;
		pixel
	oTMultiget1:cName := "cText"
	oTMultiget1:cReadVar := "cText"
	u_allEvents(oTMultiget1, "oTMultiget1")
	bChgEvent := oTMultiget1:bChange

	@SAY_ROW(3), SAY_COL + 170 say "TMultiGet (echo)";
		of aoParent;
		pixel
	@SAY_ROW(3), GET_COL + 130 get oEcho;
		var cEcho;
		size 60,60;
		multiline;
		of aoParent;
		pixel
	oEcho:cName := "cEcho"
	oEcho:cReadVar := "cEcho"
	oTMultiget1:bChange := {|| cEcho := cText, eval(bChgEvent, oTMultiget1), oEcho:refresh() }

	SetKey(K_ALT_S, {|| ;
		eval(oGet1:bChange),;
		ftestKey(aoParent, "Alt-S", cGet);
		} )
	SetKey(K_ALT_D, {||;
		eval(oTMultiget1:bChange), ;
		ftestKey(aoParent, "Alt-D", cText);
		} )

	@SAY_ROW(8), SAY_COL say "Alt+S: salva TGet";
		of aoParent;
		pixel
	@SAY_ROW(8.5), SAY_COL say "Alt+D: salva TMultiGet";
		of aoParent;
		pixel
	@SAY_ROW(9), SAY_COL say "Caracteres UTF8";
		of aoParent;
		pixel
	@SAY_ROW(9.5), SAY_COL + 20 say "€ alt-0128, ƒ alt-0131, ‰ alt-0137, › alt-0155";
		of aoParent;
		pixel

	u_remoteLog("save01: end")
Return

Static Function ftestKey(aoParent, acWho, acValue)
	u_firedEvent(aoParent, acWho + ": " + acValue)
	u_remoteLog("triggered: ["+acWho+"] " + acValue)
Return
