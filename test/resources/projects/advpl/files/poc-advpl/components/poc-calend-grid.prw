#include 'Protheus.ch'

/*/{Protheus.doc} calculator
Apresenta a MSCalendGrid, permitindo efetuar diversas configurações para o uso desta.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/

User Function calendGrid()
	local nResolution := 4
	local oMsCalendGrid
	Local cImageGer := GetTempPath()+StrTran(Time(),":","") + '.BMP'

	define dialog oDlg;
		title "MSCalendGrid";
		from 180,180 to 550,700 pixel

	// Cria Calendário
	oMsCalendGrid := MsCalendGrid():New(;
		oDlg,;
		01, 01, 260,184,;
		date(), ;
		nResolution,;
		nil ,;
		{|x,y| Alert(x) },;
		RGB(255,255,196), ;
		{|x,y|Alert(x,y)}, ;
		.T. )
	// Adiciona periodos
	oMsCalendGrid:add('Caption 01', 1, 10, 20, RGB(255,000,0), 'Descricao 01')
	oMsCalendGrid:add('Caption 02', 2, 20, 30, RGB(255,255,0), 'Descricao 02')
	oMsCalendGrid:add('Caption 03', 3, 01, 05, RGB(255,0,255), 'Descricao 03')

	@ 150, 005 button oBtn;
		prompt "Fechar";
		action {|| odlg:end()};
		size 045, 020;
		of odlg pixel

	@ 150, 055 button oBtn;
		prompt "Save BMP";
		action {|| odlg:SaveAsBmp(cImageGer)};
		size 045, 020;
		of odlg pixel

	activate msdialog odlg centered
Return
