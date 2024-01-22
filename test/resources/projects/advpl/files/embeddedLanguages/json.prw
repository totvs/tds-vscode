#include "Protheus.ch"
//#include "tds-vscode.ch"

user Function json()
	local myVar := "Variavel preenchida manualmente via ADVPL"
	local cCode

	BeginContent var cCode as JSON
	{
		"titulo": "JSON x XML",
		"resumo": "o duelo de dois modelos de representação de informações",
		"ano": 2012,
		"genero": [
		"aventura",
		"ação",
		"ficção"
		],
		"myVar": %Exp:myVar%
	}
	endContent

return myVar
