#include "Protheus.ch"
//#include "tds-vscode.ch"

user Function css()
	local myVar := "Variavel preenchida manualmente via ADVPL"
	local cCode

/*
	BeginContent var cCode as CSS
	body {
	background-color: lightblue;
		}

	h1 {
	color: white;
		text-align: center;
		background-color: %Exp:myVar%;
		}

	p {
	font-family: verdana;
		font-size: 20px;
		}
	endContent
*/
return myVar
