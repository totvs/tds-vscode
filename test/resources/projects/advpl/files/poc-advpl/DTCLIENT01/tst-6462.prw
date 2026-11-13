#include "TOTVS.CH"

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x-1))

User Function tst6462()
	local aOption := {;
		{"TGet", { |aoParent| tstge2(aoParent) }}, ;
		}

	u_startRemoteLog("DTCLIENT01-6462: Tget desconsidera o 0 a esquerda ao digitar em campo num�rico")

	u_selectTest("DTCLIENT01-6120", aOption)

	u_stopRemoteLog()

return

/*/{Protheus.doc} tstget
TGET desconsidera o 0 a esquerda ao digitar em campo num�rico.

@type function
@version 1.0.0
@author John.mendes
@since 08/12/2025
/*/

static function tstge2(aoParent)

	Local cTGet1 := 0, cTGet2 := 0, cTGet3 := 0, cTGet4 := 0, cTGet5 := 0

	u_remoteLog("save01: start")


	oTGet1 := TGet():New( 10,01,{||cTGet1},aoParent,040,009,"-99,99",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,"cTGet1",,,,,,,"-99,99")
	oTGet1:cName := "oTGet1"
	oTGet1:cReadVar := "oTGet1"

	oTGet2 := TGet():New( 25,01,{||cTGet2},aoParent,040,009,"99,99",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,"cTGet2",,,,,,,"99,99")
	oTGet2:cName := "oTGet2"
	oTGet2:cReadVar := "oTGet2"

	oTGet3 := TGet():New( 40,01,{||cTGet3},aoParent,040,009,"99:99",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,"cTGet3",,,,,,,"99:99")
	oTGet3:cName := "oTGet3"
	oTGet3:cReadVar := "oTGet3"

	oTGet4 := TGet():New( 55,01,{||cTGet4},aoParent,040,009,"999,99",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,"cTGet4",,,,,,,"999,99")
	oTGet4:cName := "oTGet4"
	oTGet4:cReadVar := "oTGet4"

	oTGet5 := TGet():New( 70,01,{||cTGet5},aoParent,040,009,"9999,99",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,"cTGet5",,,,,,,"9999,99")
	oTGet5:cName := "oTGet5"
	oTGet5:cReadVar := "oTGet5"

	u_remoteLog("save01: end")

Return

Static Function ftestKey(aoParent, acWho, acValue)
	u_firedEvent(aoParent, acWho + ": " + acValue)
	u_remoteLog("triggered: ["+acWho+"] " + acValue)
Return

