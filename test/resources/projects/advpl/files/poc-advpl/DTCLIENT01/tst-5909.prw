#include 'protheus.ch'

#define SAY_COL 010
#define GET_COL 100
#define SAY_ROW(x) (015 * (x))

User Function tst5909()
	local aOption := {;
		{"Radio Button", "tstRadio" }, ;
		}

	u_startRemoteLog("DTCLIENT01-5909: Ajuste no radio button para não precisar dar duplico clique")

	u_selectTest("DTCLIENT01-5909", aOption)

	u_stopRemoteLog()

return

/*/{Protheus.doc} tstRadio
Ajuste no radio button para não precisar dar duplico clique.

@type function
@version 1.0.0
@author John.mendes
@since 08/09/2025
/*/
User Function tstRadio(aoParent)

	local i
	local cTGet1 := "      "
	local oScr1
	local oTGet1
	local oRadio
	local nRadio := 2


	u_remoteLog("save01: start")

	testeList := {}
	aItens := {'Endereço: R GEN SOCRATES,157 - PENHA DE FRANCA - 03632040','Item01','Item02','Item03','Item004','Item005','Item006','Item007','Item008','Item009','Item010','Item011','Item012','Item013','Item014','Item015','Item016','Item017','Item018','Item019','Item020'}

	for i:=1 to 15
		cCodProd:= StrZero(i,6)
		AADD( testeList,  cCodProd )
	next

	oScr1 := TScrollBox():New(aoParent,01,01,92,260,.T.,.T.,.T.)


	oTGet1 := TGet():New( 01,01,{||cTGet1},oScr1,096,009,"",,0,,,.F.,,.T.,,.F.,,.F.,.F.,,.F.,.F.,,cTGet1,,,, )
	oTGet1:cName := "oTGet1"
	oTGet1:cReadVar := "oTGet1"

	oRadio := TRadMenu():New (20,01,aItens,,oScr1,,,,,,,,150,12,,,,.T.)
	oRadio:bSetGet := {|u| Iif(PCount()==0,nRadio,nRadio:=u)}
	oRadio:bChange := {|| conout("nRadio - " + Trim(Str(nRadio))) }
	oRadio:cName := "oRadio"
	oRadio:cReadVar := "oRadio"

	oRadio:SetCSS("QRadioButton{ border: 1px solid red; }")

	oRadio:cTooltip := " t -* e s t e do tooltip tget "

	u_remoteLog("save01: end")
Return

Static Function ftestKey(aoParent, acWho, acValue)
	u_firedEvent(aoParent, acWho + ": " + acValue)
	u_remoteLog("triggered: ["+acWho+"] " + acValue)
Return
