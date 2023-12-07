#include "Protheus.ch"
//#include "tds-vscode.ch"

user Function xml()
	local myVar := "Variavel preenchida manualmente via ADVPL"
	local cCode

	BeginContent var cCode as XML
	<note>
		<to>Tove</to>
		<from>Jani</from>
		<heading>Reminder</heading>
		<body>Don't forget me this weekend!</body>
		<myVar>%Exp:myVar%</myVar>
	</note>
	endContent

return myVar
