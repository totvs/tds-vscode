with (document) {
	var data = {
		'From_Expression: ': '%Exp:myVar%',
		'name': getElementById('ID_NAME').value,
		'email': getElementById('ID_EMAIL').value,
		'date': getElementById('ID_DATE').value,
	}
}
var text = "form:SaveData('" + JSON.stringify(data) + "')";
twebchannel.jsToAdvpl('receive_data', text, 'dummy');

