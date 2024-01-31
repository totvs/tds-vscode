#include "protheus.ch"
#INCLUDE "totvs.ch"
#INCLUDE 'ap5mail.ch'       //Biblioteca de E-mail
#INCLUDE 'topconn.ch'       //Biblioteca conexao do banco de dados

/*{Protheus.doc} WFBloqueioAcessoFerias
Essa fun��o tem a finalidade de envio de workflow para o bloqueio do colaborador quando entrar de ferias
@type class
@version 12.1.2210
@author alexandro.oliveira
@since 7/18/2023
*/

User Function WFBloqueioAcessoFerias()
	//Declarando as variaveis de atua��o na USER FUNCTION apenas
	Local lControlFer  	:=  .F.
	Local cAliasControle:=  GetNextAlias()

	BEGINSQL ALIAS cAliasControle
        SELECT * FROM VW_WF_BLOQUEIO_FERIAS ORDER BY RF_MAT ASC
    ENDIF 
		//Posicionando na tabela para gravar informa��o no novo campo criado 
		dbSelectArea(cAliasControle)
		(cAliasControle)->dbSetOrder(1)
		If SRF->(dbSeek(FWxFilial("SRF")+(cAliasControle)->RF_MAT))
			(cAliasControle)->(dbGotop())
			While (cAliasControle)->(!EOF())
				RecLock("SRF",.T.)
					SRF->RF_XWF := 'WF'
				SRF->(MsUnLock())
				(cAliasControle)->(dbSkip())
			EndDo
			//Retornando a variavel verdadeiro , pois j� gravou nos campos 'WF'
			lControlFer := .T.
		EndIf

		//Aqui verificamos a variavel se � verdaderira e chamo a Static Function aonde aciona envio do e-mail e body do e-mail
		IF(lControlFer)
        	MailInicioFerias((cAliasControle)->RF_DATAINI, (cAliasControle)->RF_DATAFIM)
		EndIf

    EndIf
Return

//Static relacionado ao envio do e-mail
// Static Function MailInicioFerias((cAliasControle)->RF_DATAINI, (cAliasControle)->RF_DATAFIM)

//     Local cMsg := ""
// 	Local xRet 	//Variavel para retorno de erro
// 	Local oServer, oMessage
// 	Local lMailAuth	:= SuperGetMv("MV_RELAUTH",,.F.)
// 	Local nPorta := 587 // Porta de Sa�da para envio do E-mail
// 	Local cCorpo //Variavel para cria��o do corpo do e-mail
// 	Local cAlias //Alias para primeira consulta - Header do E-mail Autom�tico
// 	Local cAssunto // Assunto do E-mail Autom�tico		
// 	Private cMailConta	:= GETMV("MV_RELACNT") //Parametro de Conta - Atualmente workflow@energy.com.br
// 	Private cMailServer	:= GETMV("MV_RELSERV")	//Parametro do Servidor para envio do e-mail
// 	Private cMailSenha	:= GETMV("MV_RELAPSW") //Parametro de Senha da Conta - Workflow

//     oMessage:= TMailMessage():New() //Instanciado a classe de E-mail
// 	oMessage:Clear() //Limpando o objeto

// 	cAssunto := "[E-mail Autom�tico] Funcion�rio(s) - Inicio das F�rias"

// 	//Query aonde tras os dados como nome, matricula, periodo aquisitivo, dias e retorno 
// 	cAlias  :=  GetNextAlias()
//     BEGINSQL ALIAS cAlias
//         SELECT * FROM VW_WF_BLOQUEIO_FERIAS ORDER BY RF_MAT ASC
//     ENDIF

//     cCorpo :=	'<html>'
// 	cCorpo +=		'<head>'
// 	cCorpo += 		'<style>'
// 	cCorpo +=			'html,body,table{'
// 	cCorpo +=				'font-family:Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;'
// 	cCorpo +=				'font-size:14px;'
// 	cCorpo +=				'color:black;'
// 	cCorpo +=				'text-align:justify;'
// 	cCorpo +=			'}'
// 	cCorpo +=			'td{'
// 	cCorpo +=				'font-size:12px;'
// 	cCorpo +=			'}'
// 	cCorpo +=			'thead{'
// 	cCorpo +=				'background-color:#329BA2;'
// 	cCorpo +=				'color:white;'
// 	cCorpo +=				'text-align: center;'
// 	cCorpo +=			'}'
// 	cCorpo +=			'#rodape{'
// 	cCorpo +=				'background-color:#017789;'
// 	cCorpo +=				'color:white;'
// 	cCorpo +=				'border-color:#017789'
// 	cCorpo +=			'}'
// 	cCorpo += 		'</style>'
// 	cCorpo +=		'</head>'
// 	cCorpo +=	'<body>'
//     cCorpo +=		'<table border="0" cellpadding="1" cellspacing="1" style="width:900px">
// 	cCorpo +=			'<tbody>'
// 	cCorpo +=				'<tr>'
// 	cCorpo +=					'<td>'
// 	cCorpo +=						'<p><img alt="" src="https://portal.energy.com.br/img/cabecalho_energy_funcionario_retorno_ferias.png" width="900" /></p>'
// 	cCorpo +=					'</td>'
// 	cCorpo +=				'</tr>'
// 	cCorpo +=			'</tbody>'
// 	cCorpo +=		'</table>'

// 	cCorpo += 		'<table border="1" cellpadding="1" cellspacing="1" style="width:900px">'
// 	cCorpo +=			'<thead>'
// 	cCorpo +=				'<tr>'
// 	cCorpo +=					'<th style="width:350px">'
// 	cCorpo +=						'MATRICULA'
// 	cCorpo +=					'</th>'
// 	cCorpo +=				'<tr>'
// 	cCorpo +=					'<th style="width:350px">'
// 	cCorpo +=						'FUNCION�RIO'
// 	cCorpo +=					'</th>'
// 	cCorpo +=					'<th style="width:350px">'
// 	cCorpo +=						'FUN��O'
// 	cCorpo +=					'</th>'
// 	cCorpo +=					'<th style="width:300px">'
// 	cCorpo +=						'DEPARTAMENTO'
// 	cCorpo +=					'</th>'
// 	cCorpo +=					'<th style="width:100px">'
// 	cCorpo +=						'INICIO'
// 	cCorpo +=					'</th>'
//     cCorpo +=					'<th style="width:100px">'
// 	cCorpo +=						'FIM'
// 	cCorpo +=					'</th>'
// 	cCorpo +=				'</tr>'
// 	cCorpo +=			'</thead>'
	

//     WHILE!(cAlias)->(Eof())

// 		cCorpo += 			'<tr>'
// 		cCorpo +=				'<td align="justify">'
// 		cCorpo +=					(cAlias)->RF_MAT
// 		cCorpo +=				'</td>'
// 		cCorpo +=				'<td align="justify">'
// 		cCorpo +=					(cAlias)->RA_NOME
// 		cCorpo +=				'</td>'
// 		cCorpo +=				'<td align="justify">'
// 		cCorpo +=					(cAlias)->RJ_DESC
// 		cCorpo +=				'</td>'
// 		cCorpo +=				'<td align="justify">'
// 		cCorpo +=					(cAlias)->QB_DESCRIC
// 		cCorpo +=				'</td>'
// 		cCorpo +=				'<td align="center">'
// 		cCorpo +=					(cAlias)->RF_DATAINI
// 		cCorpo +=				'</td>'
//         cCorpo +=				'<td align="center">'
// 		cCorpo +=					(cAlias)->RF_DATAFIM
// 		cCorpo +=				'</td>'
// 		cCorpo +=			'</tr>'

//         (cAlias)->(DBSKIP())

//     ENDDO
	
//     (cAlias)->(DbCloseArea())

// 	cCorpo +=		'</table>'

// 	cCorpo +=		'<table border="0" cellpadding="1" cellspacing="1" style="width:900px">
// 	cCorpo +=			'<tbody>'
// 	cCorpo +=				'<tr>'
// 	cCorpo +=					'<td>'
// 	cCorpo +=						'<p><img alt="" src="https://portal.energy.com.br/img/rodape_energy_sem_logo.png" width="900" /></p>'
// 	cCorpo +=					'</td>'
// 	cCorpo +=				'</tr>'
// 	cCorpo +=			'</tbody>'
// 	cCorpo +=		'</table>'

// 	cCorpo += '</body>'
// 	cCorpo += '</html>' 

//     oMessage:cDate	 	:= cValToChar( Date() ) 	//Data Atual
// 	oMessage:cFrom 	 	:= "workflow@energy.com.br" //Remetente
// 	oMessage:cTo 	 	:= "ti@energy.com.br" 		//Destinat�rio
// 	oMessage:cCc 		:= "rh@energy.com.br" 		//Com Copia
// 	oMessage:cSubject:= cAssunto					//Assunto
// 	oMessage:cBody 	 := cCorpo						//Corpo
// 	oMessage:MsgBodyType("text/html")				//formato do corpo em HTML
	
		   
// 	oServer := tMailManager():New()
// 	oServer:SetUseTLS( .F. ) //Indica se ser� utilizar� a comunica��o segura atrav�s de SSL/TLS (.T.) ou n�o (.F.)
   
//    //Inicializa o servidor
// 	xRet := oServer:Init( "", cMailServer, cMailConta, cMailSenha, 0, nPorta ) 
// 	//Verifica se houve inicializa��o com servidor SMTP, caso retorne diferente de 0 ocorreu alguma falha
// 	IF(xRet != 0)
// 		ALERT("O servidor SMTP n�o foi inicializado:" + oServer:GetErrorString(xRet))
// 		RETURN
// 	ENDIF
   
//     //Indica o tempo de espera em segundos.
// 	xRet := oServer:SetSMTPTimeout( 60 )
// 	//Verifica se houve resposta de protocolo no tempo definido
// 	IF (xRet != 0)
// 		ALERT("N�o foi poss�vel definir " + cProtocol + " tempo limite para " + cValToChar( nTimeout ))
// 	ENDIF
   
//     //Conecta ao servidor SMTP
// 	xRet := oServer:SMTPConnect()
// 	//Verifica a comunica��o com servidor SMTP, caso retorne diferente de 0 n�o foi poss�vel se conectar
// 	IF(xRet <> 0)
// 		ALERT("N�o foi poss�vel conectar ao servidor SMTP: " + oServer:GetErrorString( xRet ))
// 		RETURN
// 	ENDIF
   
//    	//O m�todo SMTPAuth ao tentar realizar a autentica��o do 
// 	//usu�rio no servidor de e-mail, verifica a configura��o 
// 	//da chave AuthSmtp, na se��o [Mail], no arquivo de 
// 	//configura��o (INI) do TOTVS Application Server, para determinar o valor.

// 	IF(lMailAuth)
// 		//Realiza a autentica��o com dados de acesso ao servidor SMTP
// 		xRet := oServer:SmtpAuth( cMailConta, cMailSenha )
// 		//Verifica se conseguiu realiza a autentica��o com servidor SMTP
// 		IF(xRet <> 0)
// 			cMsg := "N�o foi poss�vel se autenticar ao servidor SMTP: " + oServer:GetErrorString( xRet )
// 			ALERT( cMsg )
// 			oServer:SMTPDisconnect()
// 			RETURN
// 		ENDIF
//    	ENDIF

// 	//Realiza o envio da Mensagem
// 	xRet := oMessage:Send( oServer )
// 	//Verifica se foi enviado a mensagem
// 	IF(xRet <> 0)
// 		ALERT("N�o foi poss�vel enviar mensagem: " + oServer:GetErrorString( xRet ))
// 	ENDIF
   
//    //Desconecta do servidor SMTP
// 	xRet := oServer:SMTPDisconnect()
// 	//Verifica se desconectou do servidor SMTP	
// 	IF(xRet <> 0)
// 		ALERT("N�o foi poss�vel desconectar o servidor SMTP: " + oServer:GetErrorString( xRet ))
// 	ENDIF

// Return
