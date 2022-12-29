#include 'protheus.ch'
#include 'fwmanagerjob.ch'

#DEFINE TIPO   1
#DEFINE PARAMS 2
#DEFINE TICKET 3

#DEFINE TIPO_WORK 1
#DEFINE TIPO_WAIT 2
#DEFINE TIPO_EXIT 3

#DEFINE CACHE_GET 1
#DEFINE CACHE_SET 2
#DEFINE CACHE_DEL 3 

#DEFINE STATUS_TICKET_WAITING  1
#DEFINE STATUS_TICKET_WORKING  2
#DEFINE STATUS_TICKET_FINISHED 3
#DEFINE STATUS_TICKET_ERROR    4

Function __FWManagerJob() // Function Dummy
	ApMsgInfo( 'FWManagerJob ->'+STR0002 ) //' Utilizar Classe ao inves da funcao'
Return NIL 

CLASS FWManagerJob From FWSERIALIZE

	Data cID
	Data lActivate
	Data nThreads
	Data nTotalThreads
	Data cFunction
	Data nTimeOut
	Data cOnStart
	Data cOnExit
	Data nTimeKill
	Data nTicket

	Method New() CONSTRUCTOR
	Method Destroy()
	Method Stop()
	Method getId()
	Method Go()
	Method SetTotalThread()
	Method GetTotalThread()
	Method GetCountThreads()
	Method SetNTimeKill()
	Method GetNTimeKill()
	Method SetFunction()
	Method GetFunction()
	Method SetTimeOut()
	Method GetTimeOut()
	Method SetOnStart()
	Method GetOnStart()
	Method SetOnExit()
	Method GetOnExit()
	Method BuildThreads()
	Method waitingWork()
	Method currentTicket()
	Method finishedTicket()

ENDCLASS

//-------------------------------------------------------------------
/*{Protheus.doc} New()
Método inicializador da classe

@param cID				Indica o identificador unico.
@param lCleanGlb	Indica se deve ser feito a limpeza da fila de trabalhos 

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------	
Method New(cID, lCleanGlb) Class FWManagerJob
Default cID       := GetIDUniq()
Default lCleanGlb := .F.

	Self:cID       := cID
	Self:cFunction := ""
	Self:nTimeKill := 0

	Self:SetTimeOut() // 1000
	Self:SetTotalThread() // 10

	// Isto e necessario pois se a classe for utilizada com mesmo ID, 
	//por diferentes threads, o ticket pode se repetir.
	Self:nTicket := Val( Alltrim(Str(ThreadID())) + "0000000000" )

	If lCleanGlb
		cleanAll(self:cID)
	EndIf

	createGLB(self:cID)

Return Self

//-------------------------------------------------------------------
/*{Protheus.doc} Destroy()
Método destrutor da classe.

@param lStop	Indica se devera ser chamado o metodo Stop()

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------	
Method Destroy(lStop) Class FWManagerJob
Default lStop := .F.

	If lStop
		self:Stop()
	EndIf

Return Nil

//-------------------------------------------------------------------
/*{Protheus.doc} Stop()
Método para indicar que as threads devem ser terminadas ao termindo 
de todas as execuções.

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------	
Method Stop() Class FWManagerJob
	If addWork(self:getId(), {TIPO_EXIT, Nil})
		FwFrameTrace({{"FWMANAGERJOB", "Stop - Added EXIT work."}})
	Else
		FwFrameTrace({{"FWMANAGERJOB", "Stop - Can't add EXIT work."}}, 3)
	EndIf
Return

//-------------------------------------------------------------------
/*{Protheus.doc} getId()
Método para retornar o ID

@Return cID		ID

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------	
Method getId() Class FWManagerJob
Return self:cID

//-------------------------------------------------------------------
/*{Protheus.doc} Go()
Método para enviar a pré para thread.

@param aParams	Parametros a serem passados para a funcao a ser executada na thread.
@param nTicket	Ticket utilizado para verificar o status da execucao.

@Return lRet	 	 Validação OK? .T. / .F.
@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------	
Method Go(aParams, nTicket) Class FWManagerJob
Local aGo
Local lRet

Default aParams := {}

	lRet := IpcGo(self:cId, aParams)
	If !lRet
		aGo := {TIPO_WORK, aParams, ++self:nTicket}
		If lRet := addWork(self:cId, aGo)
			self:BuildThreads()
			setTicket(self:cId, self:nTicket, STATUS_TICKET_WAITING)
			nTicket := self:nTicket
		Else
			FwFrameTrace({{"FWMANAGERJOB", STR0003}}, 3) //"Go failed!"
		EndIf
		aSize(aGo, 0)
	EndIf

Return lRet

//-------------------------------------------------------------------
/*{Protheus.doc} SetTotalThread()
Método para setar o total de threads de emissão de pré

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method SetTotalThread(nTotalThreads) Class FWManagerJob
Default nTotalThreads := 10
	If ValType(nTotalThreads) == "N"
		Self:nTotalThreads := nTotalThreads
	EndIf
Return Self:nTotalThreads == nTotalThreads

//-------------------------------------------------------------------
/*{Protheus.doc} GetTotalThread()
Método para setar o total de threads de emissão de pré

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
/*/
//-------------------------------------------------------------------
Method GetTotalThread() Class FWManagerJob
Return Self:nTotalThreads

//-------------------------------------------------------------------
/*{Protheus.doc} GetCountThreads
Método para informar a quantidade de Threads ativas

@author Felipe Bonvicini Conti
@since 18/079/16
@version 1.0
/*/
//-------------------------------------------------------------------
Method GetCountThreads() Class FWManagerJob
Return countThreads(self:cID)

//-------------------------------------------------------------------
/*{Protheus.doc} GetNTimeKill()
Método para setar a quantidade de interações ate terminar a Thread.

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
/*/
//-------------------------------------------------------------------
Method SetNTimeKill(nTimeKill) Class FWManagerJob
Default nTimeKill := 0
	If ValType(nTimeKill) == "N"
		Self:nTimeKill := nTimeKill
	EndIf
Return Self:nTimeKill == nTimeKill

//-------------------------------------------------------------------
/*{Protheus.doc} GetNTimeKill()
Método para retornar a quantidade de interações ate terminar a Thread.

@author Felipe Bonvicini Conti
@since 17/07/16
@version 1.0
/*/
//-------------------------------------------------------------------
Method GetNTimeKill() Class FWManagerJob
Return Self:nTimeKill

//-------------------------------------------------------------------
/*{Protheus.doc} SetFunction()
Método para setar o nome da function

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method SetFunction(cFunction) Class FWManagerJob
Default cFunction := ""
	If ValType(cFunction) == "C"
		If FindFunction( cFunction )
			Self:cFunction := cFunction
		Else
			FwFrameTrace({{"FWMANAGERJOB", STR0004}}, 3) //"Function doesn't exists!"
		EndIf
	EndIf
Return Self:cFunction == cFunction

//-------------------------------------------------------------------
/*{Protheus.doc} GetFunction()
Método para retornar o nome da function

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method GetFunction() Class FWManagerJob
Return Self:cFunction

//-------------------------------------------------------------------
/*{Protheus.doc} SetTimeOut()
Método para setar o Time Out da function

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method SetTimeOut(nTimeOut) Class FWManagerJob
Default nTimeOut := 1000
	If ValType(nTimeOut) == "N"
		Self:nTimeOut := nTimeOut
	EndIf
Return Self:nTimeOut == nTimeOut

//-------------------------------------------------------------------
/*{Protheus.doc} GetTimeOut()
Método para retornar o Time Out da function

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method GetTimeOut() Class FWManagerJob
Return Self:nTimeOut

//-------------------------------------------------------------------
/*{Protheus.doc} SetOnStart()
Método Setar function on start

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
/*/
//-------------------------------------------------------------------
Method SetOnStart(cOnStart) Class FWManagerJob
Default cOnStart := ""
	If ValType(cOnStart) == "C"
		Self:cOnStart := cOnStart
	EndIf
Return Self:cOnStart == cOnStart

//-------------------------------------------------------------------
/*{Protheus.doc} SetOnExit()
Método Setar function on Exit

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method SetOnExit(cOnExit) Class FWManagerJob
Default cOnExit := ""
	If ValType(cOnExit) == "C"
		Self:cOnExit := cOnExit
	EndIf
Return Self:cOnExit == cOnExit

//-------------------------------------------------------------------
/*{Protheus.doc} GetOnStart()
Método buscar function on Start

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//------------------------------------------------------------------- 
Method GetOnStart() Class FWManagerJob
Return Self:cOnStart

//-------------------------------------------------------------------
/*{Protheus.doc} GetFil()
Método buscar function Exit

@author Felipe Bonvicini Conti
@since 24/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method GetOnExit() Class FWManagerJob
Return Self:cOnExit

//-------------------------------------------------------------------
/*{Protheus.doc} BuildThreads
Método para verificar a necessidade de criar threads de trabalho.

@author Felipe Bonvicini Conti
@since 18/07/16
@version 1.0
*/
//-------------------------------------------------------------------
Method BuildThreads() Class FWManagerJob
Local lOk := .F.

	If Self:GetTotalThread() > Self:GetCountThreads()
		lOk := startThread(Self:GetFunction(),   ;
												Self:cID,            ;
												Self:GetOnStart(),   ;
												Self:GetOnExit(),    ;
												Self:GetTimeOut(),   ;
												Self:GetNTimeKill(), ;
												Self:GetTotalThread())
	EndIf

Return lOk

//-------------------------------------------------------------------
/*{Protheus.doc} waitingWork
Método para verificar a quantidade de registros esperando por serem executados.

@author Felipe Bonvicini Conti
@since 10/08/16
@version 1.0
*/
//-------------------------------------------------------------------
Method waitingWork() Class FWManagerJob
Return countWorks(self:getId())

//-------------------------------------------------------------------
/*{Protheus.doc} currentTicket
Método para retornar o ticket corrente

@author Felipe Bonvicini Conti
@since 21/11/16
@version 1.0
*/
//-------------------------------------------------------------------
Method currentTicket() Class FWManagerJob
Return self:nTicket

//-------------------------------------------------------------------
/*{Protheus.doc} finishedTicket
Método para verificar o status do ticket

@author Felipe Bonvicini Conti
@since 18/11/16
@version 1.0
*/
//-------------------------------------------------------------------
Method finishedTicket(nTicket) Class FWManagerJob
Return getTicket(self:cID, nTicket) == STATUS_TICKET_FINISHED

// -------------------------- **** FUNCTIONS **** -------------------------- //

Static Function startThread(cFunction, cID, cOnStart, cOnExit, nTimeOut, nNTimeKill, nMaxThreads)
Local lRet := .F.

	StartJob("IPC_FWMANAGERJOB", GetEnvServer(), .F., cFunction, ;
	         cID, ;
	         cOnStart, ;
	         cOnExit, ;
	         nTimeOut, ;
	         nNTimeKill, ;
	         nMaxThreads )
	lRet := IPCWaitEx("IPC_"+cID, 1000)
	If !lRet
		FwFrameTrace({{"IPC_FWMANAGERJOB", STR0005}}, 3) //"Error on start new thread."
	EndIf

Return lRet

Function IPC_FWMANAGERJOB(cFunction, cID, cOnStart, cOnExit, nTimeOut, nTimeKill, nMaxThreads)
Local lRet        := .T.
Local lExit       := .F.
Local nWorked     := 0
Local cThreadID   := GetThredId()
Local cText
Local aWork
Local nTicket
Local aP

If IpcGo("IPC_"+cID)
	addThread(cID, cThreadID)
Else
	FwFrameTrace({{i18n("IPC_FWMANAGERJOB(#1)", {cThreadID}), i18n(STR0006, {cID})}}) //"Exiting... (ID: #1)"
	Return Nil
EndIf

Default nTimeOut  := 5000
Default nTimeKill := 0

	ErrorBlock( {|e| IpcErrorBlock(e), Break(e) } )
	BEGIN SEQUENCE

		cText := cID+" - "+cFunction + " "

		If cOnStart <> Nil .And. !Empty(cOnStart)
			PtInternal(1, cText + STR0007 ) //' On Start'
			FwFrameTrace({{i18n("IPC_FWMANAGERJOB(#1)", {cThreadID}), i18n(STR0008, {cID})}}, 2) //"On Start (ID: #1)"
	
			&cOnStart.()
		EndIf

		While !KillApp() .And. !lExit

			lRet := .F.

			PtInternal(1, cText + STR0009+AllTrim(Str(nWorked)) ) //' Find next '

			aWork := getWork(cID)
			Do Case
				Case aWork[TIPO] == TIPO_WORK
					PtInternal(1, cText + STR0010) //' Working...'
					lRet        := .T.
					aP          := aWork[PARAMS]
					nTicket     := aWork[TICKET]
				Case aWork[TIPO] == TIPO_WAIT
					PtInternal(1, cText + STR0011) //' Waiting...'
					lRet := IPCWaitEx(cID, 1000, @aP)
				Case aWork[TIPO] == TIPO_EXIT
					PtInternal(1, cText + STR0012) //' Exiting...'
					lExit := .T.
					cleanWorks(cID)
			End Case

			If lRet
				PtInternal(1, cText + STR0013 ) //' Working '

				// Update Ticket
				setTicket(cID, nTicket, STATUS_TICKET_WORKING)

				If Len(aP) < 40
					aSize(aP, 40)
				EndIf
				&cFunction.(aP[1],aP[2],aP[3],aP[4],aP[5],aP[6],aP[7],aP[8],aP[9],aP[10],;
				            aP[11],aP[12],aP[13],aP[14],aP[15],aP[16],aP[17],aP[18],aP[19],aP[20],;
				            aP[21],aP[22],aP[23],aP[24],aP[25],aP[26],aP[27],aP[28],aP[29],aP[30],;
				            aP[31],aP[32],aP[33],aP[34],aP[35],aP[36],aP[37],aP[38],aP[39],aP[40])

				nWorked++

				// Remove Ticket
				DelTicket(cID, nTicket)

			EndIf
			FWFreeObj(aP)
			FWFreeObj(aWork)

			If lExit .Or. (nTimeKill > 0 .And. nWorked >= nTimeKill)
				BREAK
			EndIf

		End

	RECOVER
//		i18nConOut("Exiting #1", {cThreadID})
		FWFreeObj(aP)
		FWFreeObj(aWork)
		delThread(cID, cThreadID)
		setTicket(cID, nTicket, STATUS_TICKET_ERROR)
		PtInternal(1, cText + STR0014+ cThreadID) //' Exiting... '
		FwFrameTrace({{i18n("IPC_FWMANAGERJOB(#1)", {cThreadID}), i18n(STR0006, {cID})}}) //"Exiting... (ID: #1)"

		If cOnExit <> Nil .And. !Empty(cOnExit)
			FwFrameTrace({{i18n("IPC_FWMANAGERJOB(#1)", {cThreadID}), i18n(STR0015, {cID})}}) //"On Exit (ID: #1)"
			&cOnExit.()
		EndIf

		ReleaseProgs()
		DelClassIntf()

		If countWorks(cID) > 0
			If nMaxThreads > countThreads(cID)
				startThread(cFunction, cID, cOnStart, cOnExit, nTimeOut, nTimeKill, nMaxThreads)
			EndIf
		EndIf
	END SEQUENCE

Return Nil

Static Function IPCErrorBlock(oErr)
	FwFrameTrace({{"IPC_FWMANAGERJOB", ThreadId()}, {STR0017, oErr:Description}, {STR0016, oErr:ErrorStack}}, 3) //"Error Stack"
	i18nConOut(STR0018, {CRLF, ThreadId(), oErr:Description, oErr:ErrorStack}) //"#1IPC_FWMANAGERJOB: #2#1Error Description: #3#1Error Stack: #4#1"
//	BREAK
Return 

Static Function GetThredId()
Return AllTrim(Str(ThreadID()))

Static Function GetIDUniq(cID)
Return FWUUIDv4()

//Static Function ThreadIsLive(nThreadID, aInfo)
//Default aInfo := GetUserInfoArray()
//Return aScan( aInfo, { |aX| aX[3] == nThreadID } ) > 0

Static Function createGLB(cID)
Return VarSetUID(cID, .T.)

Static Function getGLB(cID, cKey, aData, lTrans)
Local lGet := .F.
Default lTrans := .T.
	If lTrans
		lGet := VarGetA(cID, cKey, @aData)
	Else
		lGet := VarGetAD(cID, cKey, @aData)
	EndIf
	Default aData := {}
Return lGet

Static Function addGLB(cID, cKey, xData)
//Local lSet
//Local aData := {}

//	lSet := VarBeginT(cID, cKey)
//	If lSet
//		getGLB(cID, cKey, @aData, .F.)
//		aADD(aData, xData)
//		VarSetAD(cID, cKey, aData)
//		VarEndT(cID, cKey)
//		FWFreeObj(aData)
//		FWFreeObj(xData)
//	EndIf

//Return lSet
Return VarSetA(cID, cKey, {}, 1, xData)

Static Function delThread(cID, cThreadID)
Local aThreads
Local nPos
	If VarBeginT(cID, "threads")
		aThreads := getThreads(cID, .F.)
		nPos := aScan(aThreads, cThreadID)
		If nPos > 0
			aDel(aThreads, nPos)
			aSize(aThreads, Len(aThreads)-1)
		EndIf
		VarSetAD(cID, "threads", aThreads)
		VarEndT(cID, "threads")
		FWFreeObj(aThreads)
	EndIf
Return 

Static Function getWork(cID, lPersist)
Local aWorks
Local xWork
Default lPersist := .F.
	If VarBeginT(cID, "works")
		If getGLB(cID, "works", @aWorks, .F.)
			If Len(aWorks) >= 1
				xWork := aWorks[1]
				If !lPersist
					aDel(aWorks, 1)
					aSize(aWorks, Len(aWorks)-1)
					VarSetAD(cID, "works", @aWorks)
				EndIf
			EndIf
		Else
			xWork := {TIPO_EXIT, Nil}
		EndIf
		VarEndT(cID, "works")
		FWFreeObj(aWorks)
	EndIf
	Default xWork := {TIPO_WAIT, Nil}
Return xWork

Static Function countGLB(cID, cKey, lTrans)
Local aData
Local nLen
	getGLB(cID, cKey, @aData, lTrans)
	nLen := Len(aData)
//	i18nConOut("#1: #2 | #3", {cKey, nLen, FWAToS(aData)})
	FWFreeObj(aData)
Return nLen

Static Function getThreads(cID, lTrans)
Local aData
	getGLB(cID, "threads", @aData, lTrans)
Return aData

Static Function addThread(cID, cThreadID)
Return addGLB(cID, "threads", cThreadID)

Static Function addWork(cID, xWork)
Return addGLB(cID, "works", xWork)

Static Function countThreads(cID)
Return countGLB(cID, "threads", .F.)

Static Function countWorks(cID)
Return countGLB(cID, "works")

Static Function cleanWorks(cID)
Return VarDel(cID, "works")

Static Function cleanAll(cID)
Return VarCleanA(cID)

Static Function getTicket(cID, nTicket)
Local nStatus
	Default nTicket := 0
	FWCacheData("TICKET_"+cID, cValToChar(nTicket), CACHE_GET, @nStatus)
	Default nStatus := STATUS_TICKET_FINISHED
Return nStatus

Static Function setTicket(cID, nTicket, nStatus)
	FWCacheData("TICKET_"+cID, cValToChar(nTicket), CACHE_SET, nStatus)
Return 

Static Function DelTicket(cID, nTicket)
	FWCacheData("TICKET_"+cID, cValToChar(nTicket), CACHE_DEL)
Return 
