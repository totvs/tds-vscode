#include "Protheus.ch"
//#include "tds-vscode.ch"

user Function html()
	local myVar := "Variavel preenchida manualmente via ADVPL"
	local cCode

	BeginContent var cCode as HTML
	<HTML>
	<body>
	<button>%Exp:myVar%</button>
	</body>
	</HTML>
	endContent

return myVar
