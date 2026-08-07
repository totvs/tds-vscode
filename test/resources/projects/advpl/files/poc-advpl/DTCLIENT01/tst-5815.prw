#include "totvs.ch"

user function tst5815()
	local oDlg
	local oFont
	local oSay

	DEFINE DIALOG oDlg TITLE "DTCLIENT01-5815: TSay, SetTextAlign não respeita parâmetro de alinhamento vertical" FROM 180,180 TO 550,700 PIXEL

	// Cria Fonte para visualização
	oFont := TFont():New('Courier new',,-18,.T.)

	// Usando o método Create
	oSay:= TSay():Create(oDlg,	{||'Texto para exibição'},40,01,,oFont,,,,.T.,CLR_RED,CLR_WHITE,200,50)

	// Métodos
	oSay:CtrlRefresh()
	oSay:SetText( "Teste texto Centro" )
	oSay:SetTextAlign( 0, 2 )

	// Propriedades
	oSay:lTransparent = .T.
	oSay:lWordWrap = .F.
	oSay:SetCSS("border: 1px solid #C0C0C0;")

	ACTIVATE DIALOG oDlg CENTERED

Return



