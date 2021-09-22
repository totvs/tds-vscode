#include "protheus.ch"
#include "tbiconn.ch"

user function escolheNum(p1)
    local n, cResp, cMsg := ""
    local aOpcoes := {}
    private cOpcao
    private ondeEstou := "escolheNum"



    public aPublic := {}

    // essa seq. UTF 8 inválida para json do DA
    //corrigido versão DA 1.1.24 / srv
    //private paraFuncionar := "se fizer hover aqui, para de funcionar ÃƒÂº"

    testVars()
    private aPrivate := {}

    fillPrivate()

    fillPublic()

//
    for n := 1 to 5
        aAdd(aOpcoes, strZero(n,1,0))
    next
//
    n := 0
    while !(cResp == "*")
        tela(aOpcoes)
        n++
        //cResp := trim(cOpcao)
        cResp := cOpcao

        if cResp == "1"
            cMsg := "Você escolheu o numero 1"
        elseif cResp == "2"
            cMsg := "Você escolheu o numero 2"
        elseif cResp == "3"
            cMsg := "Você escolheu o numero 3"
        elseif cResp == "4"
            cMsg := "Você escolheu o numero 4"
        elseif cResp == "5"
            cMsg := "Você escolheu o numero 5"
        else
            cMsg := "Nenhum nÃºmero escolhido"
        endif

        if !empty(cResp)
            if cResp == "2" .or. cResp == "4"
                cMsg += " e é PAR"
            else
                cMsg += " e é IMPAR"
            endif
        endif

        if !(cResp == "*")
            msgAlert(cMsg)
        endif

    enddo

return

    class AB
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

method ab() class AB
    ::bT := .t.
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
        msgAlerta("Parametro aaOpcoes nÃ£o Ã© uma lista (array)")
        return cOpcao
    endif

    oDlg := MSDIALOG():Create()
    oDlg:cName := "oDlg"
    oDlg:cCaption := "Escolha um numero"
    oDlg:nLeft := 0
    oDlg:nTop := 0
    oDlg:nWidth := 400
    oDlg:nHeight := 250
    oDlg:lCentered := .T.

    oSay1 := TSAY():Create(oDlg)
    oSay1:cName := "oSay1"
    oSay1:cCaption := "Escolha um nÃºmero acionando um dos botÃµes abaixo."
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
