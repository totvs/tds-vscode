#include "TOTVS.CH"

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

User Function tst6120()
	local aOption := {;
		{"TGet", { |aoParent| tstget(aoParent) }}, ;
		}

	u_startRemoteLog("DTCLIENT01-6120: Propriedade( 21)  lReadOnly= .t. em Vari�vel do tipo num�rica e Vari�vel do tipo Data afeta a imagens do campo")

	u_selectTest("DTCLIENT01-6120", aOption)

	u_stopRemoteLog()

return

/*/{Protheus.doc} tstget
TGET Propriedade( 21)  lReadOnly= .t. em Vari�vel do tipo num�rica e Vari�vel do tipo Data afeta a imagens do campo.

@type function
@version 1.0.0
@author John.mendes
@since 29/10/2025
/*/

static Function tstget(aoParent)
	Local cGet1 := "Define variable value" // Variavel do tipo caracter
	Local nGet2 := 0 // Vari�vel do tipo num�rica
	Local dGet3 := stod("20251029") // Vari�vel do tipo Data
	Local dGet4 :="        "
	Local lHasButton := .T.
	Local read := .T.
	Local oGet1, oGet2, oGet3, oGet4, oGet5, oGet6, oGet7, oGet8, oGet9
	Local oTButton1

	u_remoteLog("save01: start")

	oGet1 := TGet():New( 005, 009, { | u | If( PCount() == 0, cGet1, cGet1 := u ) },aoParent, ;
		060, 010, "!@",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.T.,,.F.,.F. ,,"cGet1",,,,lHasButton  )

	oGet2 := TGet():New( 020, 009, { | u | If( PCount() == 0, nGet2, nGet2 := u ) },aoParent, ;
		060, 010, "@E 999.99",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.T.,,read,.F. ,,"nGet2",,,,lHasButton  )
	oGet2:cName := "oGet2"
	oGet2:cReadVar := "oGet2"

	oGet4 := TGet():New( 035, 009, { | u | If( PCount() == 0, nGet2, nGet2 := u ) },aoParent, ;
		060, 010, "@E 999.99",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F. ,,"nGet2",,,,lHasButton  )
	oGet4:lReadOnly := .T.
	oGet3 := TGet():New( 050, 009, { | u | If( PCount() == 0, dGet3, dGet3 := u ) },aoParent, ;
		060, 010, "@D",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.T.,,read,.F. ,,"dGet3",,,,lHasButton  )
	oGet5 := TGet():New( 065, 009, { | u | If( PCount() == 0, dGet3, dGet3 := u ) },aoParent, ;
		060, 010, "@D",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F. ,,"dGet3",,,,lHasButton  )
	oGet5:lReadOnly := .T.

	oGet6 := TGet():New( 080, 009, { | u | If( PCount() == 0, nGet2, nGet2 := u ) },aoParent, ;
		060, 010, "@E 999.99",, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.T.,,.F.,.F. ,,"nGet2",,,,lHasButton:=.F.  )

	oGet7 := TGet():New( 095, 009, { | u | If( PCount() == 0, nGet2, dGet4 := u ) },aoParent, ;
		060, 010,,, 0, 16777215,,.F.,,.T.,,.F.,,.F.,.T.,,.T.,.F. ,,"dGet4",,,,lHasButton:=.F.,.T.  )


	oGet8 := TGet():New( 110,009,{||cGet1},aoParent,100,10,,,,,,,,.T.,,,,,,,.F.,,,cGet1,,,,,.T.)
	oGet8:cF3 := "TESTE"
	oGet8:cName := "oGet8"
	oGet8:cReadVar := "oGet8"

	oGet9 := TGet():New( 125,009,{||cGet1},aoParent,100,10,,,,,,,,.T.,,,,,,,.T.,,,cGet1,,,,,.T.)
	oGet9:cF3 := "TESTE"
	oGet9:cName := "oGet9"
	oGet9:cReadVar := "oGet9"

	oTButton1 := TButton():New( 160, 009, "ReadOnly False",aoParent,, 60,10,,,.F.,.T.,.F.,,.F.,,,.F. )
	oTButton1:bAction := {||;
		oGet2:lReadOnly := .F.,;
		oGet2:CtrlRefresh();
		}
	oTButton1:cName := "oTButton1"
	oTButton1:cReadVar := "oTButton1"

	u_remoteLog("save01: end")

Return

Static Function ftestKey(aoParent, acWho, acValue)
	u_firedEvent(aoParent, acWho + ": " + acValue)
	u_remoteLog("triggered: ["+acWho+"] " + acValue)
Return

