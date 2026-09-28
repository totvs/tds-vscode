nRetorno := FWExecView( STR0006,"FINA024VCT",;
	nOpc,/*oDlg*/,/*bCloseOnOk*/,/*bOk*/,,aEnableButtons,/*bCancel*/,/*cOperatId*/,/*cToolBar*/, oModel ) // 'Excluir'

F7V->(DbDelete())

HELP(' ',1,"F024FKPXC" ,,STR0008,2,0,,,,,, {STR0009})	//"Exclusão não permitida."###"Regra de vencimento vinculada a uma Regra de Retenção Financeiras. Neste caso a exclusão não é permitida."

oModel:= Nil
FKP->(DBSETORDER(2))	//"FKP_FILIAL+FKP_CODIGO"
