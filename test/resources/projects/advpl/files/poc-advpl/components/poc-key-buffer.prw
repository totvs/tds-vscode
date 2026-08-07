#Include 'Protheus.ch'

User Function keyBuffer()
	Private cCampoMemo:= ""
	Private cContador	:= "001"
	Private cDigitado	:= SPACE(1000)
	Private oFont1		:= TFont():New( "Arial",0,-32,,.F.,0,,400,.F.,.F.,,,,,, )
	Private oDlgSep		:= nil
	Private oMGet1		:= nil
	Private oGet1		:= nil
	Private oBtn2		:= nil

	oDlgSep	:= MSDialog():New( 111,268,795,1302,"Key Buffer Test",,,.F.,,,,,,.T.,,,.T. )
	oMGet1	:= TMultiGet():New( 004,004, {|u| Iif(PCount() > 0 , cCampoMemo := u, cCampoMemo)}, oDlgSep,336,204,/*oFont*/,,CLR_BLACK,CLR_WHITE,,.T.,"",,/*bWhen*/,.F.,.F.,.T./*lReadOnly*/,/*bValid*/,,.F.,/*lNoBorder*/,.T.)
	oMGet1:cName := "cCampoMemo"
	oMGet1:cReadVar := "cCampoMemo"

	oGet1   := TGet():New( 216,004,{|u| If(PCount()>0,cDigitado := u,cDigitado)},oDlgSep,220,026,'@!',{|| MemorizarDigitacao()	},CLR_BLACK,CLR_WHITE,oFont1,,,.T.,"",,,.F.,.F.,,.F.,.F.,"","",,)
	oGet1:cName := "cDigitado"
	oGet1:cReadVar := "cDigitado"

	oBtn1	:= TButton():New( 216,288,"Fechar",oDlgSep	,{ || oDlgSep:End() },048,028,,,,.T.,,"",,,,.F. )
	oBtn2 	:= TButton():New( 216,232,"Limpar",oDlgSep	,{ || LimpaTela()	},048,028,,,,.T.,,"",,,,.F. )

	oGet1:SetFocus()

	oDlgSep:Activate(,,,.T.)

Return

//====================================================================================================================\\
/*/{Protheus.doc}MemorizarDigitacao
  ====================================================================================================================
	@description
	Preenchimento e valida��o.

	@author		Lucas Farias - Mitsuba
/*/
//===================================================================================================================\\
Static Function MemorizarDigitacao()
	Local lRet		:= .T.

	If Empty(cDigitado)
		oDlgSep:Refresh()
		Return lRet
	EndIf

	//Sleep(2000)

	FWMsgRun(,{|| Sleep(1000) },"Sleep:","5 segundo")
	/*FWMsgRun(,{|| Sleep(1000) },"Sleep:","4 segundo")
	FWMsgRun(,{|| Sleep(1000) },"Sleep:","3 segundo")
	FWMsgRun(,{|| Sleep(1000) },"Sleep:","2 segundo")
	FWMsgRun(,{|| Sleep(1000) },"Sleep:","1 segundo")*/

	cCampoMemo := cContador + " - " + ALLTRIM(cDigitado) + CRLF + cCampoMemo

	cDigitado := SPACE(1000)
	cContador := SOMA1(cContador)

	oDlgSep:Refresh()
	oGet1:SetFocus()

Return lRet

// Zera as variaveis
Static Function LimpaTela()
	cCampoMemo	:= ""
	cContador	:= "001"
	cDigitado	:= SPACE(1000)
	oDlgSep:Refresh()
	oGet1:SetFocus()
Return
