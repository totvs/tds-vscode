#INCLUDE 'PROTHEUS.CH'
#INCLUDE 'RWMAKE.CH'
#INCLUDE 'TBICONN.CH'
#INCLUDE 'TOTVS.CH'
#INCLUDE 'TOPCONN.CH'

/*/{Protheus.doc} MobileSCL_Aux
Tabelas Auxiliares
@author Lucas Nogueira
/*/
User Function MobileSCL_Aux(_cTabela,_lCargaFull)

	Local nI				:= 1  as numeric

	Private cTabela  		:= "" as character
	Private cRotina  		:= "" as character
	Private cKey			:= "" as character

	Private lCargaFull		:= .T.	as logical

	Default _cTabela		:= ""
	Default _lCargaFull		:= .T.

	lCargaFull 	:= _lCargaFull
	cTabela 	:= _cTabela

	For nI := 1 To 7

		If nI == 1
			cTabela := "ZR2"
			cRotina := "Segmento_Cliente"

		ElseIf nI == 2
			cTabela := "AOV"
			cRotina := "Segmento"

		ElseIf nI == 3
			cTabela := "ZJ0"
			cRotina := "Categoria"

		ElseIf nI == 4
			cTabela := "ZR1"
			cRotina := "Grupo_Cliente"

		ElseIf nI == 5
			cTabela := "ZZI_TIPOCO"
			cRotina := "Tipo Cobranca"

		ElseIf nI == 6
			cTabela := "SX5"
			cKey	:= "Z9"
			cRotina := "Familia_Nut"

		ElseIf nI == 7
			cTabela := "CC2"
			cRotina := "Mun_IBGE"
		Endif

		If !IsBlind()
			Processa({|| processaEnvio() },"[Tab.Auxiliares] - Procesando Dados...","Aguarde...")
		Else
			processaEnvio()
		EndIf
	Next nI

Return()

/*/{Protheus.doc} MobileSCL_Aux 
Processa Envio dos Dados para Firebase
@author Lucas Nogueira
@since 02/2023 
/*/
Static Function processaEnvio()

	Local oClsFirebase 	:= clsFirebase():New("Mobile_SCL","01","11")	as object
	
	Local cPath     := "/" + oClsFirebase:cCommom + "/" + cRotina + ".json" as character

	Local lRet      := .F.  as logical

	Local jParam	:= Nil  as object

	Private oClsLogs	:= clsLogsAPP():New()	as object

	//¦+---------------------------------------------------------+¦
	//¦¦Segue o processo de Inclusão
	//¦+---------------------------------------------------------+¦
	jParam	:= gerarJSon()

	oClsLogs:createLogApi("[" + cRotina + "]  - Incluindo Dados" )

	If oClsFirebase:processaEnvio(cRotina,cPath,jParam,lCargaFull)
		oClsFirebase:atuVersion(.F.," ",cRotina)
		oClsLogs:recordLogApi("Incluido com Sucesso!")
	Endif

	oClsLogs:closeLogApi()

Return(lRet)

/*/{Protheus.doc} MobileSCL_Aux 
Gera Json
@author Lucas Nogueira
@since 02/2023 
/*/
Static Function gerarJSon()

	Local cQuery    := ""   	as character
	Local cAlias    := ""   	as character
	Local cCount	:= "000001"	as character

	Local aDados	:= {}	as array

	Local nI		:= 1	as numeric

	Local jParamItens	:= JsonObject():New()	as object
	Local jParamAux		:= JsonObject():New()	as object


	If cTabela == "ZZI_TIPOCO"
		aDados := StrToKarr(GetSx3Cache("ZZI_TIPOCO","X3_CBOX"),";")

		For nI := 1 To Len(aDados)
			jParamItens[Alltrim(Substr(aDados[nI],1,1))] :=  Alltrim(Substr(aDados[nI],3,Len(aDados[nI])))
		Next nI
	Else
		cQuery := " SELECT "

		cQuery += " " + cTabela + ".* "

		cQuery += " FROM " + RetSqlName(cTabela) + " " + cTabela

		cQuery += " WHERE " + RetSqlCond(cTabela)

		If cTabela == "AOV"
			cQuery += " AND AOV.AOV_MSBLQL <> '1' "

		ElseIf cTabela == "ZJ0"
			cQuery += " AND ZJ0.ZJ0_TABELA = '001' "

		ElseIf cTabela == "SX5"
			cQuery += " AND SX5.X5_TABELA = '" + Alltrim(cKey) + "' "

		ElseIf cTabela == "ZR1"
			cQuery += " AND ZR1.ZR1_NEGOCI = 'S' "
		Endif

		cQuery := ChangeQuery(cQuery)
		cAlias := MPSysOpenQuery(cQuery)

		While (cAlias)->(!Eof())
			jParamAux := Nil
			jParamAux := JsonObject():New()

			If cTabela == "AOV"
				jParamAux["AOV_CODSEG"]	:=  Alltrim((cAlias)->AOV_CODSEG)
				jParamAux["AOV_DESSEG"]	:=  Alltrim((cAlias)->AOV_DESSEG)

			ElseIf cTabela == "ZR1"
				jParamAux["ZR1_COD"]	:=  Alltrim((cAlias)->ZR1_COD)
				jParamAux["ZR1_DESC"]	:=  Alltrim((cAlias)->ZR1_DESC)

			ElseIf cTabela == "ZR2"
				jParamAux["ZR2_COD"]	:=  Alltrim((cAlias)->ZR2_COD)
				jParamAux["ZR2_DESC"]	:=  Alltrim((cAlias)->ZR2_DESC)

			ElseIf cTabela == "ZJ0"
				jParamAux["ZJ0_CODIGO"]	:=  Alltrim((cAlias)->ZJ0_CODIGO)
				jParamAux["ZJ0_DESCRI"]	:=  Alltrim((cAlias)->ZJ0_DESCRI)

			ElseIf cTabela == "SX5"
				jParamItens[Alltrim((cAlias)->X5_CHAVE)]	:=  Alltrim((cAlias)->X5_DESCRI)

			ElseIf cTabela == "CC2"
				jParamAux["CC2_EST"]	:=  Alltrim((cAlias)->CC2_EST)
				jParamAux["CC2_CODMUN"]	:=  Alltrim((cAlias)->CC2_CODMUN)
				jParamAux["CC2_MUN"]	:=  Alltrim((cAlias)->CC2_MUN)
			Endif

			If cTabela <> "SX5"
				jParamItens[cCount] := jParamAux

				cCount := Soma1(cCount)
			EndIf

			(cAlias)->(DbSkip())
		EndDo

		(cAlias)->(DbCloseArea())
	Endif

Return(jParamItens)
