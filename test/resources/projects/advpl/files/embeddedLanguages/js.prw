#include "Protheus.ch"
//#include "tds-vscode.ch"

user Function js()
	local myVar := ;
		"Variavel preenchida manualmente via ADVPL"
	local cCode


	beginContent var cCode as JS
function sendData(){
with(document){
var data = {
'From_Expression: ': %Exp:myVar%,
'name':getElementById('ID_NAME').value,
'email':getElementById('ID_EMAIL').value,
'date':getElementById('ID_DATE').value,
}
}
var text = "form:SaveData('" + JSON.stringify(data) + "')";
twebchannel.jsToAdvpl('receive_data', text, 'dummy');
}
	endContent

return myVar
