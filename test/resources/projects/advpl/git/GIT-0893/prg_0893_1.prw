#include "protheus.ch"


class AB ;
		from XXX
	data bT
	data bF
	data dt
	data c
	data n0
	data n2
	data n8
	data cb

	method ab()
endclass

method ab() ;
		class AB

	::bT := .f.
	::bF := .F.
	::dt := date()
	::c  := "string"
	::n0 := 123
	::n2 := 123.45
	::n8 := 123.45678
	::cb := { |p1,p1| 10+20}

	private ondeEstou := "class ab"

return

static function testVars()
	local bT := .t.
	local bF := .F.
	local dt := date()
	local c := "string"
	local n0 := 123
	local n2 := 123.45
	local n8 := 123.45678
	local cb := { |p1,p1| 10+20}
	local o := AB():AB()

	private ondeEstou := "testVars"
	private aPrivate := {}

	fillPrivate()

	fillPublic()

return { bT, BF, dt, c, n0,n2,n8,cb, o}

static function fillPrivate()
	local n

	private ondeEstou := "fillPrivate"

	for n := 1 to 5
		aAdd(aPrivate, strZero(n,1,0) + procName(1))
	next

	aAdd(aPrivate,  {1, 2, "S3"} )

return

static function fillPublic()
	local n

	private ondeEstou := "fillPublic"

	for n := 1 to 5
		aAdd(aPublic, strZero(n,1,0) + procName(1))
	next

	aAdd(aPublic,  {1, 2, "S3"} )

return

static function tela(aaOpcoes)
	Local oDlg,oSay1,oBtn

	if !(valType(aaOpcoes) == "A")
		msgAlerta("Parametro aaOpcoes n�o � uma lista (array)")
		return cOpcao
	endif

	oDlg := MSDIALOG():Create()
	oDlg:cName := "oDlg"
	oDlg:cCaption := "Escolha um n�mero"
	oDlg:nLeft := 0
	oDlg:nTop := 0
	oDlg:nWidth := 400
	oDlg:nHeight := 250
	oDlg:lCentered := .T.

	oSay1 := TSAY():Create(oDlg)
	oSay1:cName := "oSay1"
	oSay1:cCaption := "Escolha um n�mero acionando um dos bot�es abaixo."
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
