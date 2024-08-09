#include "Protheus.ch"

user Function sqlComment()
	Local aArea  := GetArea()
	Local cWhere := "%B1_TIPO = 'PI' AND B1_LOCPAD = '01'%"
	Local nRegs  := 0

	/*
	O bloco abaixo deve ser ignorado pelo SQL embarcado e não deve ter
	a sua sintaxe destacada

	BeginSql Alias "SQL_SB1"
        //COLUMN CAMPO AS DATE //Deve se usar isso para transformar o campo em data
        SELECT    
            B1_COD,
            B1_DESC
        FROM
            %table:SB1% SB1 
        WHERE
            B1_FILIAL  = %xFilial:SB1%
            AND B1_MSBLQL != '1'
            AND %Exp:cWhere%
            AND SB1.%notDel%
	EndSql
	*/

	//Já este, deve ter a sua sintaxe destacada
	BeginSql Alias "SQL_SB1"
        //COLUMN CAMPO AS DATE //Deve se usar isso para transformar o campo em data
        SELECT    
            B1_COD,
            B1_DESC
        FROM
            %table:SB1% SB1 
        WHERE
            B1_FILIAL  = %xFilial:SB1%
            AND B1_MSBLQL != '1'
            AND %Exp:cWhere%
            AND SB1.%notDel%
	EndSql

	//Enquanto houver registros
	While ! SQL_SB1->(EoF())
		nRegs++

		SQL_SB1->(DbSkip())
	EndDo
	SQL_SB1->(DbCloseArea())

	MsgInfo("Foram processados "+cValToChar(nRegs)+" produtos.", "Atenção")

	RestArea(aArea)
Return
