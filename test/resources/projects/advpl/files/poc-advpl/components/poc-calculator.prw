#include 'protheus.ch'

/*/{Protheus.doc} calculator
Apresenta a calculadora associada ao MSGet, permitindo efetuar diversas configurações para o uso desta.

@type function
@version 1.0.0
@author acandido
@since 11/7/2024
/*/
User Function calculator()
	local oBtn := nil
	local oSay := nil
	local oGetPicture := nil
	local oGet3 := nil
	local nValue := 0
	local cPict  := "@E 9.99"+space(15) //faz o botão calculadora aparecer

	define msdialog oDlg;
		title "Calculadora";
		from 180,180 to 550,700 pixel //370

	@ 020, 005 say oSay;
		prompt "Máscara:";
		size 032, 014;
		of odlg pixel
	@ 020, 031 msget oGetPicture;
		var cPict;
		size 058, 012;
		of odlg pixel
	oGetPicture:bChange := {|| oGet3:picture := allTrim(cPict), oGet3:CtrlRefresh()}

	@ 037, 005 say oSay;
		prompt "Valor:";
		size 032, 014;
		of odlg pixel
	@ 037, 031 msget oGet3;
		var nValue;
		picture cPict;
		size 038, 012;
		of odlg pixel

	@ 150, 005 button oBtn;
		prompt "Fechar";
		action {|| odlg:end()};
		size 045, 020;
		of odlg pixel

	activate msdialog odlg centered

Return
