#INCLUDE "LOGIX.CH"

#DEFINE LOAD_LIST_INTERVAL   1 // Intervalo de carga da lista de THREAD
#DEFINE JOIN_TIMEOUT      1000 // 1 segundo (em milisegundos)
#DEFINE MAX_ATTEMPTS        10
#DEFINE MAX_THREADS_DEFAULT 10

#DEFINE VAR_THREAD_ID  "LTHREADID_"

#DEFINE PROCESS_CODE   1
#DEFINE PROCESS_ARGS   2

#DEFINE SESSION_ID             1
#DEFINE SESSION_PARENT_ID      2
#DEFINE SESSION_PROCESS        3
#DEFINE SESSION_PARENT_PROCESS 4
#DEFINE SESSION_DEBUG_MODE     5
#DEFINE SESSION_DEBUG_PATH     6
#DEFINE SESSION_PROCESS_TYPE   7
#DEFINE SESSION_WORKSPACE      8

STATIC __aSessions      :=  {}

STATIC __lDebugThread    := Nil
STATIC __lDebugMemory    := Nil
STATIC __lFirstWorksPace := .F.

STATIC __nMaxThreads    := 0   // Número máximo de THREAD para serem executadas.
STATIC __aThreadList    := {}  // Lista das THREAD em execução.
STATIC __nLastLoadList  := 0   // Tempo em segundos da última vez em que a lista das THREAD foi carregada.

STATIC __aFinishEvents  := {}  // Lista com os eventos de finalização da THREAD.

STATIC __oWorkFolder    := Nil // Instância do objeto TWORKFOLDER do menu.

STATIC __oWorkSpace     := Nil // Instância do objeto TWORKFOLDER do menu.

STATIC __oThreadDlg     := Nil // Instância da janela de execuções secundárias.

STATIC __aSetEnvValues  := {}

STATIC __publicVarLoaded := .F.

//------------------------------------------------------------------------------
/*/{Protheus.doc} LThread
Executa aplicações e funções Logix (seja 4GL ou AdvPL/INTEROP) a partir de uma
nova THREAD, podendo ou não ser visual.

@type class
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@obs É possível definir a emissão de LOGs relacionadas a THREAD ligando a chave
de PROFILE "logix.threads.debug".
/*/
//------------------------------------------------------------------------------
CLASS LThread FROM LComponent
    DATA cErrorMsg

    DATA nThread
    DATA nThreadParent

    DATA cProcess
    DATA cProcessParent

    DATA cLogFileNameSuffix
    DATA nProcessType

    DATA cUserId
    DATA cCompanyId

    DATA nSlotId
    DATA cThreadInfo

    DATA nDebugMode
    DATA nFixedCountEnv
    DATA cDebugPath

    DATA lWaitRun

    DATA aEnvironments
    DATA aParameters
    DATA aFinishEvents

    DATA uReturnValue
    DATA cEnvServer

    DATA oWorkspace

    METHOD NewLThread() CONSTRUCTOR

    METHOD SetProperty()
    METHOD GetProperty()

    METHOD Activate()
    METHOD IsAlive()
    METHOD JoinThread()
    METHOD FreeResources()
ENDCLASS

//------------------------------------------------------------------------------
/*/{Protheus.doc} NewLThread
Método construtor da classe.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param [cName], String, Nome interno do componente.

@obs Recomenda-se não informar o nome do componente no primeiro parâmetro,
informando sempre nulo.
/*/
//------------------------------------------------------------------------------
METHOD NewLThread(cName) CLASS LThread
Local cIPLocal
Local nCount

_Super:NewLComponent(cName)

::cType := "LTHREAD"

::nThread        := 0
::nThreadParent  := THREAD_getId()
::cProcessParent := APPLICATION_getMainAppName()
::nProcessType   := TYPE_4GL

__oWorkSpace := NIL

::cUserId        := LOGIN_getUser()
::cCompanyId     := LOGIN_getCompany()

::nSlotId        := license_getActualSlotID(::cUserId)

::cThreadInfo    := license_getStringInfoMainThread()

::lWaitRun       := .F. //Padrão do JOB é não aguardar o término da execução do JOB no server.

::aEnvironments  := {}
::aParameters    := {}
::aFinishEvents  := {}

::cErrorMsg      := Nil
::uReturnValue   := Nil
::cEnvServer     := GetEnvServer()

::nDebugMode     := XToN(_4GL_LOG_getDebugMode())
::cDebugPath     := _4GL_LOG_getAppDebugLogFilePath()

::cLogFileNameSuffix := Nil

DEFAULT ::nDebugMode := DEBUG_OFF

// Adiciona a variável de ambiente IPLOCAL_LGX.
If !Empty(cIPLocal := _4GL_LOG_localComputerId())
    AAdd(::aEnvironments,{"IPLOCAL_LGX",Trim(cIPLocal)})
EndIf

if !empty(::cProcessParent) .AND. !("MENU" == UPPER(LEFT(::cProcessParent,4)))
	//Valores setados via função LOG_setEnv()
	For nCount := 1 to len(__aSetEnvValues)
	    ::setProperty("ADD_ENVIRONMENT",__aSetEnvValues[nCount][1],__aSetEnvValues[nCount][2])
	Next
endIf

::nFixedCountEnv := len(::aEnvironments)
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} SetProperty
Define o valor de determinado método do componente.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cParam, String, Nome do método do componente.
@param [uParamN], Mixed, Parâmetros (de 1 a 6) dos valores do método.

@return Boolean, Verdadeiro se o método informado é válido.
/*/
//------------------------------------------------------------------------------
METHOD SetProperty(cParam,uParam1,uParam2,uParam3,uParam4,uParam5,uParam6) CLASS LThread
Local cParam := Upper(Trim(cParam))
Local nIdx

If  cParam == "PROCESS" .Or. cParam == "FUNCTION"
    ::cProcess := Trim(uParam1)

    DEFAULT uParam2 := '4GL' //Tipo do processo (4GL ou ADVPL) - DEFAULT: 4GL
    uParam2 := upper(xtoc(uParam2))
    ::nProcessType := if(uParam2 == "4GL" .OR. uParam2 == xtoc(TYPE_4GL),TYPE_4GL,if(uParam2 == "INTEROP" .OR. uParam2 == xtoc(TYPE_INTEROP),TYPE_INTEROP,TYPE_ADVPL))

    //uParam3 (OPCIONAL) - Nome que deve ser usado como sufixo do arquivo de LOG/DEBUG caso deva ser diferente do
    //fonte que tem a FUNCTION principal que será invocada na execução da nova thread.
    //************************************************************************************************************************
    //*** Esta situação é comum em Threads que executam funções ADVPL que recebem como parâmetro outra função/processo
    //*** 4GL pra ser invocado dinamicamente. Neste caso o registro do nome do arquivo de LOG/DEBUG bem como as informações
    //*** de cabeçalho do arquivo de LOG/DEBUG serão com base neste sufixo, que pode ser nome de função ou fonte/programa 4GL.
    ::cLogFileNameSuffix := uParam3
ElseIf cParam == "PROCESS_TYPE"
    //4GL, ADVPL
    uParam2 := upper(xtoc(uParam2))
    ::nProcessType := if(uParam2 == "4GL" .OR. uParam2 == xtoc(TYPE_4GL),TYPE_4GL,if(uParam2 == "INTEROP" .OR. uParam2 == xtoc(TYPE_INTEROP),TYPE_INTEROP,TYPE_ADVPL))
ElseIf cParam == "CLEAR_ENVIRONMENTS"
    ASize(::aEnvironments,::nFixedCountEnv) // Não remove os valores setados antes de iniciar a THREAD (valores setados na thread chamadora)
ElseIf cParam == "ADD_ENVIRONMENT"
    uParam1 := Upper(xToC(uParam1))
    // Não permite alterar o usuário, empresa ou o IP local.
    If !(uParam1 == "LOGNAME")     .And. ;
       !(uParam1 == "EMPRESA_LGX") .And. ;
       !(uParam1 == "IPLOCAL_LGX") .And. ;
       !(uParam1 == "ADVPL")
	    nIdx := aScan(::aEnvironments,{|x| x[1] == uParam1})
        if nIdx == 0
            AAdd(::aEnvironments,{uParam1,XToC(uParam2)})
		else
		    ::aEnvironments[nIdx][2] := XToC(uParam2)
		endIf
    EndIf
ElseIf cParam == "CLEAR_PARAMETERS"
    ASize(::aParameters,0)
ElseIf cParam == "ADD_PARAMETER"
    AAdd(::aParameters,XToC(uParam1))
ElseIf cParam == "ADD_FINISH_EVENT"
    AAdd(::aFinishEvents,uParam1)
ElseIf cParam == "DEBUG_MODE"
    ::nDebugMode := xToN(uParam1)
ElseIf cParam == "DEBUG_PATH"
    if !empty(uParam1)
       if LOG_dir_exist(Trim(uParam1),FALSE)
          ::cDebugPath := Trim(uParam1)
          LOG_setEnv("DEBUG_PATH",::cDebugPath)
       endIf
    else
       LOG_setEnv("DEBUG_PATH","")
       ::cDebugPath := nil
    endIf
ElseIf cParam == "WAIT_RUN"
    uParam1 := if(valtype(uParam1) != "N",xToN(uParam1),uParam1)
    DEFAULT uParam1 := TRUE //Se fizer setProperty desta propriedade sem passar o TRUE/FALSE irá assumir por padrão TRUE.
    ::lWaitRun := (uParam1 == TRUE)
ElseIf cParam == "ENVIRONMENT"
    DEFAULT uParam1 := GetEnvServer()
    ::cEnvServer := lower(xtoc(uParam1))
ElseIf cParam == "FREE_RESOURCES"
    ::FreeResources()
Else
    Return _Super:SetProperty(cParam,uParam1,uParam2,uParam3,uParam4,uParam5,uParam6)
EndIf
Return .T.

//------------------------------------------------------------------------------
/*/{Protheus.doc} GetProperty
Retorna o valor de determinado método do componente.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cParam, String, Nome do método do componente.
@param [uParamN], Mixed, Parâmetros (de 1 a 6) dos valores do método.

@return Mixed, Valor do método informado.
/*/
//------------------------------------------------------------------------------
METHOD GetProperty(cParam,uParam1,uParam2,uParam3,uParam4,uParam5,uParam6) CLASS LThread
Local cParam := Upper(Trim(cParam))

If  cParam == "JOIN"
    Return If(::JoinThread(),TRUE,FALSE)
ElseIf cParam == "IS_ALIVE"
    Return If(::IsAlive(),TRUE,FALSE)
ElseIf cParam == "ACTIVATE" .Or. cParam == "START"
    Return If(::Activate(),TRUE,FALSE)
ElseIf cParam == "DEBUG_MODE"
    Return ::nDebugMode
ElseIf cParam == "DEBUG_PATH"
    Return ::cDebugPath
ElseIf cParam == "ERROR_MESSAGE"
    Return ::cErrorMsg
ElseIf cParam == "WAIT_RUN"
    Return if(::lWaitRun,TRUE,FALSE)
ElseIf cParam == "RETURN_VALUE"
    Return ::uReturnValue
ElseIf cParam == "ENVIRONMENT"
    Return ::cEnvServer
Else
    Return _Super:GetProperty(cParam,uParam1,uParam2,uParam3,uParam4,uParam5,uParam6)
EndIf
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} IsAlive
Verifica se a THREAD JOB atual está em execução.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@return Logical, Verdadeiro se a THREAD atual está em execução.
/*/
//------------------------------------------------------------------------------
METHOD IsAlive() CLASS LThread
Local i
Local lAlive := .F.

If  ::nThread > 0
    // Se ainda não carregou as THREADs ou passou mais de um segundo desde
    // a última carga, recarrega a lista das THREADs.
    If  __nLastLoadList == 0 .Or. (__nLastLoadList > 0 .And. Abs(Seconds() - __nLastLoadList) >= LOAD_LIST_INTERVAL)
        __aThreadList   := GetUserInfoArray(.T.)
        __nLastLoadList := Seconds()
    EndIf

    // Verifica se a THREAD atual está em execução.
    For i := 1 To Len(__aThreadList)
        If  IsEqual(__aThreadList[i][3],::nThread)
            lAlive := .T.
            Exit
        EndIf
    Next

    If  lAlive
        THREAD_debugMessage("[ISALIVE] THREAD " + XToC(::nThread) + " is running.")
    Else
        THREAD_debugMessage("[ISALIVE] THREAD " + XToC(::nThread) + " finished.")
        ::nThread := 0
    EndIf
EndIf
Return lAlive

//------------------------------------------------------------------------------
/*/{Protheus.doc} Activate
Cria e inicia uma nova THREAD JOB.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@return Logical, Verdadeiro se a THREAD foi criada e iniciada com sucesso.
/*/
//------------------------------------------------------------------------------
METHOD Activate() CLASS LThread
Local i := 0

Local cGlbId
Local lStatus := .T.

// Limpa a mensagem do último erro ocorrido.
::cErrorMsg    := Nil
::uReturnValue := Nil

If   (::nProcessType == TYPE_4GL .AND. _4GL_LOG_find4GLFunction(::cProcess)   == TRUE);
.OR. (::nProcessType != TYPE_4GL .AND.      LOG_findAdvPLFunction(::cProcess) == TRUE)
    // Monta um nome único para a variável global que será utilizada para a
    // troca de informações com a THREAD.
    cGlbId := Upper(VAR_THREAD_ID + XToC(::nThreadParent) + "_COMP_" + ::cName)
    PutGlbValue(cGlbId,"")

    // Se o debug da execução está ativa, cria uma pasta se ainda não existe.
    If  ::nDebugMode != DEBUG_OFF
        //Criar apenas a pasta do DEBUG.
        //A função LOG_createDebugLogFile é enviado DEBUG_MODE como 0 apenas pra criar a pasta de debug no servidor
        ::cDebugPath := LOG_createDebugLogFile(0,::cDebugPath,if(!empty(::cLogFileNameSuffix),::cLogFileNameSuffix,::cProcess),::cUserId,::cCompanyId)
    EndIf

    THREAD_debugMessage("[ACTIVATE] Starting NEW THREAD - Process ("+ xToC(::cProcess)+") - WaitRun (" + if(::lWaitRun,"TRUE","FALSE") + ")")

    // Cria e executa a nova THREAD.
    ::uReturnValue := StartJob("THREAD_execute", ::cEnvServer,;
                                                 ::lWaitRun,;
                                                 ::nProcessType,;
                                                 ::cLogFileNameSuffix,;
                                                 cGlbId,;
                                                 ::nThreadParent  ,;
                                                 ::cProcess       ,;
                                                 ::cProcessParent ,;
                                                 ::cUserId        ,;
                                                 ::cCompanyId     ,;
                                                 ::nSlotId        ,;
                                                 ::cThreadInfo    ,;
                                                 ::nDebugMode     ,;
                                                 ::cDebugPath     ,;
                                                 ::aEnvironments  ,;
                                                 ::aParameters    ,;
                                                 ::aFinishEvents)

    // Aguarda para que tenha tempo de setar a variável na THREAD criada.
    ::nThread := 0

    While ::nThread == 0 .And. i < MAX_ATTEMPTS
        //Se o modo WaitRun estiver ativo, não precisa realizar tentativas para recuperar o código da Thread,
        //pois se falhar na 1a execução já indica a falha da chamada do JOB.
        if(!::lWaitRun, Sleep(100),/*vazio*/)

        // Busca o número da nova THREAD.
        ::nThread := GetGlbValue(cGlbId)

        If  Empty(::nThread)
            ::nThread := 0
        Else
            ::nThread := VAL(::nThread)
        EndIf

        i++
    EndDo

    If  ::nThread == 0
        lStatus := .F.

        ::cErrorMsg := "Não foi possível criar a THREAD para execução da função " + ::cProcess + " (" + XToC(i + 1) + " tentativas)"
        THREAD_debugMessage("[ACTIVATE][ERROR] NEW THREAD FAILED - process " + ::cProcess + " (" + XToC(i + 1) + " attempts)")
    EndIf
Else
    lStatus := .F.

    ::cErrorMsg := "Função '" + ::cProcess + "' não encontrada no RPO."
    THREAD_debugMessage("[ACTIVATE][ERROR] Process " + ::cProcess + " not found in RPO")
EndIf
Return lStatus

//------------------------------------------------------------------------------
/*/{Protheus.doc} JoinThread
Aguarda a finalização da THREAD JOB atual.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@return Logical, Verdadeiro para indicar a finalização da THREAD.

@obs Ao executar este método, a lógica ficará pausada até o término da THREAD.
/*/
//------------------------------------------------------------------------------
METHOD JoinThread() CLASS LThread
// Segura a execução até a THREAD terminar.
While ::IsAlive()
    Sleep(JOIN_TIMEOUT)
EndDo

::nThread := 0
Return .T.

//------------------------------------------------------------------------------
/*/{Protheus.doc} FreeResources
Libera recursos utilizados pelo componente LTHREAD da memória para execuções das
THREADs JOB.

@type method
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15
/*/
//------------------------------------------------------------------------------
METHOD FreeResources() CLASS LThread
Local cGlbId

cGlbId := Upper(VAR_THREAD_ID + XToC(::nThreadParent) + "_COMP_" + ::cName)
ClearGlbValue(cGlbId)
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_execute
Executa a função definida para a THREAD JOB.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param nProcessType, String, Tipo de processo (1) 4GL ou 2 (ADVPL)
@param cLogFileNameSuffix, String, Nome da função ou processo que será usado como sufixo para o arquivo de LOG/DEBUG bem como para o cabeçalho/resumo do inicio do LOG/DEBUG.
@param cGlbId, String, Código da variável global de controle da THREAD.
@param nThreadParent, Numeric, Código da THREAD pai.
@param cProcess, String, Código do processo ou função que será executada.
@param cProcessParent, String, Código do processo pai.
@param cUserId, String, Código do usuário.
@param cCompanyId, String, Código da empresa.
@param nSlotId, Numeric, Código de SLOT do usuário.
@param cThreadInfo, String, Informações da MAIN_THREAD.
@param nDebugMode, Numeric, Modo de debug.
@param cDebugPath, String, Pasta onde serão salvos os LOGs de debug.
@param aEnvironments, Array, Lista das variáveis de ambiente.
@param aParameters, Array, Lista dos parâmetros do processo ou função.
@param aFinishEvents, Array, Lista de eventos de finalização.
/*/
//------------------------------------------------------------------------------
MAIN FUNCTION THREAD_execute(nProcessType,cLogFileNameSuffix,cGlbId,nThreadParent,cProcess,cProcessParent,cUserId,cCompanyId,nSlotId,cThreadInfo,nDebugMode,cDebugPath,aEnvironments,aParameters,aFinishEvents)
    Local i
    Local nThreadId := THREAD_getId()

    Local cParam

    DEFAULT nProcessType := TYPE_4GL
    DEFAULT cUserId      := " "
    DEFAULT cCompanyId   := " "

    // Define os padrões de data e acentuação.
    SetDateToBritish()

    // Atribui o ID da nova THREAD na variável global.
    PutGlbValue(cGlbId,XToC(nThreadId))

    // Primeiramente ativa os arquivos de LOG, para que as mensagens sejam emitidas
    // no arquivo correto.
    If  nDebugMode != DEBUG_OFF
        If  LOG_createDebugLogFile(nDebugMode,cDebugPath,if(!empty(cLogFileNameSuffix),cLogFileNameSuffix,cProcess),cUserId,cCompanyId) == Nil
            THREAD_debugMessage("[EXECUTE][ERROR] DEBUG LOG File cannot be created to threadID " + XToC(nThreadId) + ".")
        EndIf
    EndIf

    THREAD_debugMessage("")
    THREAD_debugMessage("[EXECUTE] THREADID " + XToC(nThreadId) + " (" + cProcess + ") started  - PARENT THREADID " + XToC(nThreadParent) + " (" + cProcessParent + ") - GLOBALIDTHREAD = " + cGlbId)

    // Define as variáveis a serem setadas via LOG_setEnv() na thread
    For i := 1 To Len(aEnvironments)
        _4GL_LOG_setEnv(aEnvironments[i][1],aEnvironments[i][2])
    Next

    // Monta o comando da função.
    For i := 1 To Len(aParameters)
        If  cParam == Nil
            cParam := "aParameters["+alltrim(str(i))+"]"
        Else
            cParam += ",aParameters["+alltrim(str(i))+"]"
        EndIf

        THREAD_debugMessage("[EXECUTE] Parameter (" + StrZero(i,2) + ") = "+xtoc(aParameters[i]))
    Next
    DEFAULT cParam := ""

    //empresa e usuário a serem utilizados na execução da Thread
    _4GL_LOG_appSetEnv(cUserId,cCompanyId)

    //Ativar modo de debug indicado
    _4GL_LOG_setDebugMode(nDebugMode)

    // Define a execução atual para ONLINE_JOB_MODE (JOB executado por programa ONLINE).
    SetJobMode(ONLINE_JOB_MODE)
    Set4GLJobSourceName(cProcess)

    if !("MENU" == UPPER(LEFT(cProcessParent,4)))
        // Define o código do programa pai.
        APPLICATION_setMainAppName(cProcessParent)
    endIf

    // Define as informações de LS.
    _4GL_LICENSE_setActualSlotId(cUserId,nSlotId)
    LICENSE_loadStringInfoMainThread(cThreadInfo)

    // Define os eventos de finalização da thread.
    For i := 1 To Len(aFinishEvents)
        THREAD_addFinishEvent(aFinishEvents[i])
    Next

    // Define a função que será executada ao finalizar a THREAD.
    SetFinishAppHandler("THREAD_finish")

    // Envia a informação de execução para o TOTVS MONITOR.
    THREAD_showMonitorInfo("JOB",cProcess,cProcessParent,cUserId,cCompanyId,,nSlotId,nDebugMode)

    // Emite a quantidade de MB da THREAD antes de iniciar a função.
    If  THREAD_debugUsedMemory()
        THREAD_debugMessage("[EXECUTE] THREAD MEMORY before running " + Upper(cProcess) + " JOB PROCESS: " + XToC(Abs(_GetThreadUsedMem() / 1000000)) + "MB",.T.)
    EndIf

    if nProcessType == TYPE_ADVPL
        uReturn := Eval( &("{|| LOG_callADVPLFunction(cProcess," + cParam + ") }") )
    else
        uReturn := Eval( &("{|| LOG_call4GLFunction(cProcess," + cParam + ") }") )
    endIf

    THREAD_debugMessage("[EXECUTE] RETURN VALUE Process "+cProcess+"("+cParam+") = " + XToC(uReturn))

    // Emite a quantidade de MB da THREAD depois de finalizada a função.
    If  THREAD_debugUsedMemory()
        THREAD_debugMessage("[EXECUTE] THREAD MEMORY after running " + Upper(cProcess) + " JOB PROCESS: " + XToC(Abs(_GetThreadUsedMem() / 1000000)) + "MB",.T.)
    EndIf

    THREAD_debugMessage("[EXECUTE] THREAD " + XToC(nThreadId) + " finished")
    THREAD_debugMessage("")
Return uReturn

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_executeView
Cria a execução da aplicação definida para a THREAD visual.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cSession, String, Código da nova sessão.
@param cSessionParent, String, Código da sessão pai.
@param cTitle, String, Título da sessão.
@param nType, Numeric, Tipo da THREAD atual (1 - 4GL, 2 - INTEROP etc).
@param cProcess, String, Código do processo ou função que será executada.
@param cProcessParent, String, Código do processo pai.
@param cUserId, String, Código do usuário.
@param cCompanyId, String, Código da empresa.
@param cKeySystem, String, Chave de consumo de licença (quando execução via MENU).
@param nSlotId, Numeric, Código de SLOT do usuário (quando execução via programa).
@param cThreadInfo, String, Informações da MAIN_THREAD.
@param nDebugMode, Numeric, Modo de debug.
@param cDebugPath, String, Pasta onde serão salvos os LOGs de debug.
@param cEnvironments, String, JSON com a lista das variáveis de ambiente.
@param cProcesses, String, JSON com a lista dos processos e parâmetros.
@param cFinishEvents, String, JSON com a lista de eventos de finalização.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_executeView(cSession,cSessionParent,cTitle,nType,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,cThreadInfo,nDebugMode,cDebugPath,cEnvironments,cProcesses,cFinishEvents)
Local oDlg := nil
Local nHeight
Local nWidth
Local aScreenRes
Local cVersionInfo

nType      := XToN(nType)
nSlotId    := XToN(nSlotId)
nDebugMode := XToN(nDebugMode)
cProcess   := alltrim(upper(cProcess))

if empty(cTitle)
    cVersionInfo := _4GL_VERSION_loadInfoJob(cProcess,"4GL",FALSE)
    DEFAULT cVersionInfo := _4GL_VERSION_loadInfoJob(cProcess,"PRW",FALSE)
    cVersionInfo := _4GL_VERSION_getAttribValue(cVersionInfo,5) + "." + _4GL_VERSION_getAttribValue(cVersionInfo,2)
    cTitle := license_getSystemTitle(license_getKeySystemBySlotID(nSlotID)) + ' - ' + cProcess + "-" + cVersionInfo + '  {' + xToC(LOGIN_getUser()) + '/' + xToC(LOGIN_getCompany()) + '}'
endIf

//IF cSessionParent == "MENU" .AND. THREAD_BuildHasAdjustFreeWorkspace()  //futuramente deverá abrir nova thread a partir da thread corrente qdo nao estiver invocando programa a partir do menu
IF THREAD_BuildHasAdjustFreeWorkspace()
    // Recupera o objeto pai onde será criada a nova sessão.
    oParent := THREAD_workSpaceFolder()
    if empty(nHeight)
        aScreenRes = GetScreenRes()

        DEFAULT nWidth  := ((aScreenRes[1] / 3) * 2)
        DEFAULT nHeight := ((aScreenRes[2] / 3) * 2)

        nWidth  := IF(nWidth <= 0,800,nWidth)
        nHeight := IF(nHeight <= 0,605,nHeight)

        THREAD_debugMessage("[ExecuteView] SCREEN SIZE detected - WIDTH (" + xtoc(nWidth) +")   HEIGHT ("+xtoc(nHeight)+")")
    endIf

    If oParent == nil
        oDlg := MSDialog():New(0,0,nHeight,nWidth,cTitle,,,,DS_MODALFRAME,,,,,.T.,,,,.F.)
        oDlg:lMaximized := .T.
        oDlg:lEscClose  := .F.
        THREAD_debugMessage("[ExecuteView] NEW DIALOG created - WIDTH (" + xtoc(oDlg:nClientWidth) +")   HEIGHT ("+xtoc(oDlg:nClientHeight)+")")
    EndIf
else
    If !("MENU" == UPPER(LEFT(cProcessParent,4)))
        If  nType == TYPE_4GL
            oDlg := MSDialog():New(0,0,605,750,cTitle,,,,DS_MODALFRAME,,,,,.T.,,,,.F.)
            oDlg:lMaximized := .F.
            oDlg:lEscClose  := .F.
        Else
            oDlg := MSDialog():New(0,0,0,0,cTitle,,,,nOr(WS_VISIBLE,WS_POPUP),,,,,.T.,,,,.F.)
            oDlg:lMaximized := .T.
            oDlg:lEscClose  := .F.
        EndIf
        THREAD_debugMessage("[ExecuteView] NEW DIALOG created")
    endIf
EndIf

// A criação da sessão é realizada em uma outra função, pois em SmartClient HTML
// ela deve ser chamada no evento bInit da MSDialog.
If  oDlg == Nil
    InitSession(Nil,cSession,cSessionParent,cTitle,nType,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,cThreadInfo,nDebugMode,cDebugPath,cEnvironments,cProcesses,cFinishEvents)
Else
    oDlg:Activate(,,,.T.,,,{|| InitSession(oDlg,cSession,cSessionParent,cTitle,nType,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,cThreadInfo,nDebugMode,cDebugPath,cEnvironments,cProcesses,cFinishEvents) })
EndIf
Return

//------------------------------------------------------------------------------
STATIC FUNCTION InitSession(oDlg,cSession,cSessionParent,cTitle,nType,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,cThreadInfo,nDebugMode,cDebugPath,cEnvironments,cProcesses,cFinishEvents)
Local lMDI := .T.
Local oParent
Local oWorkSpace := nil
Local i
Local nWidth
Local nHeight

if valtype(oDlg) == "O"
    oDlg:ReadClientCoors()
    oParent := TWorkSpaceFolder():New(oDlg,0,0,0,0,.F.)
    oParent:Align := CONTROL_ALIGN_ALLCLIENT
    oParent:ReadClientCoors(.T.)

    THREAD_debugMessage("[InitSession] NEW WORKSPACEFOLDER created - WIDTH (" + xtoc(oParent:nClientWidth) +")   HEIGHT ("+xtoc(oParent:nClientHeight)+")")

    THREAD_dialog(oDlg)
    THREAD_workSpaceFolder(oParent)
else
    oParent := THREAD_workSpaceFolder()
	If valtype(oParent) == "O" .AND. GetClassName(oParent) == "TWORKSPACEFOLDER"
		if Type("oMenuLogix") == "O" .AND. valtype(oMenuLogix) == "O"
			lMDI := oMenuLogix:MDI()
		    IF THREAD_BuildHasAdjustFreeWorkspace()
				oWorkSpace := oMenuLogix:GetSessionWorkSpace(cSessionParent)
			endIf
		endIf
	    IF THREAD_BuildHasAdjustFreeWorkspace()
			DEFAULT oWorkSpace := THREAD_GetSessionWorkSpace(cSessionParent)
		endIf
		THREAD_dialog(NIL)

        THREAD_debugMessage("[InitSession] WORKSPACEFOLDER detected - WIDTH (" + xtoc(oParent:nClientWidth) +")   HEIGHT ("+xtoc(oParent:nClientHeight)+")")
	endif
EndIf

If  lMDI
    i := AScan(__aSessions,{|x| x[SESSION_ID] == cSession })
    if i > 0
        aResize(__aSessions,i)
    endIf

    IF THREAD_BuildHasAdjustFreeWorkspace()
        // Cria a WORKSPACE para execução da aplicação.
        if oWorkSpace == NIL
            oWorkSpace := TWorkSpace():New(cTitle,oParent)
            oWorkSpace:Align := CONTROL_ALIGN_ALLCLIENT
            oWorkSpace:SetBarVisible(.F.)
            oWorkSpace:ReadClientCoors()
            oWorkSpace:bClose:= {|o,lAll| .T.}

            THREAD_debugMessage("[InitSession] NEW WORKSPACE created - WIDTH (" + xtoc(oWorkSpace:nClientWidth) +")   HEIGHT ("+xtoc(oWorkSpace:nClientHeight)+")")

            THREAD_workSpace(oWorkSpace)
        else
            oWorkSpace:ReadClientCoors(.T.)

            THREAD_debugMessage("[InitSession] WORKSPACE detected - WIDTH (" + xtoc(oWorkSpace:nClientWidth) +")   HEIGHT ("+xtoc(oWorkSpace:nClientHeight)+")")
        endIf
        THREAD_workSpace(oWorkSpace)

        nWidth  := THREAD_WorkSpaceWidth()
        nHeight := THREAD_WorkSpaceHeight()

        if empty(nWidth) .OR. nWidth == 0
            aScreenRes = GetScreenRes()

            DEFAULT nWidth  := ((aScreenRes[1] / 3) * 2)
            DEFAULT nHeight := ((aScreenRes[2] / 3) * 2)

            nWidth  := IF(nWidth <= 0,800,nWidth)
            nHeight := IF(nHeight <= 0,605,nHeight)

            THREAD_debugMessage("[InitSession] SCREEN SIZE detected - WIDTH (" + xtoc(nWidth) +")   HEIGHT ("+xtoc(nHeight)+")")
        endIf
    else
        //Neste caso é workspaceFolder
        oWorkspace := oParent
    endIf

    If  nType == TYPE_4GL
        CreateSession(cSession,oWorkspace,"LogixExecute.4gl#" + cTitle,cSession,cSessionParent,cTitle,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,XToC(nSlotId),cThreadInfo,XToC(nDebugMode),cDebugPath,cEnvironments,cProcesses,cFinishEvents,XtoC(nHeight),XtoC(nWidth))
    Else
        CreateSession(cSession,oWorkspace,"LogixExecute","S",XToC(nType),cSession,cSessionParent,cTitle,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,XToC(nSlotId),cThreadInfo,XToC(nDebugMode),cDebugPath,cEnvironments,cProcesses,cFinishEvents,XtoC(nHeight),XtoC(nWidth))
    EndIf

    THREAD_IsFirstWorkSpace(.F.)

    aAdd(__aSessions,{cSession,cSessionParent,cProcess,cProcessParent,nDebugMode,cDebugPath,nType,oWorkSpace})
    THREAD_debugMessage("[InitSession] Add THREAD to internal control list - TOTAL COUNT (" + xtoc(len(__aSessions)) + ")")
Else
    LogixExecute("N",nType,cSession,cSessionParent,cTitle,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,cThreadInfo,nDebugMode,cDebugPath,cEnvironments,cProcesses,cFinishEvents)
EndIf
Return

//------------------------------------------------------------------------------
STATIC FUNCTION THREAD_GetSessionWorkSpace(cSession)
//------------------------------------------------------------------------------
    Local i

    i := AScan(__aSessions,{|x| x[SESSION_ID] == cSession })
    if i > 0
        THREAD_debugMessage("[GetSessionWorkSpace] Session ("+cSession+") detected to program folder '"+__aSessions[i][SESSION_PROCESS]+"'")
        RETURN __aSessions[i][SESSION_WORKSPACE]
    endIf
    THREAD_debugMessage("[GetSessionWorkSpace] Session (" + cSession + ") NOT detected")
RETURN NIL

//------------------------------------------------------------------------------
/*/{Protheus.doc} LogixExecute
Executa a aplicação definida para a THREAD visual.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cMDI, String, Verdadeiro se a execução é MDI (nova sessão/THREAD).
@param cSession, String, Código da nova sessão.
@param cSessionParent, String, Código da sessão pai.
@param cTitle, String, Título da sessão.
@param cProcess, String, Código do processo ou função que será executada.
@param cProcessParent, String, Código do processo pai.
@param cUserId, String, Código do usuário.
@param cCompanyId, String, Código da empresa.
@param cKeySystem, String, Chave de consumo de licença (quando execução via MENU).
@param nSlotId, Numeric, Código de SLOT de licença (quando execução via programa).
@param cThreadInfo, String, Informações da MAIN_THREAD.
@param nDebugMode, Numeric, Modo de debug.
@param cDebugPath, String, Pasta onde serão salvos os LOGs de debug.
@param cEnvironments, String, JSON com a lista das variáveis de ambiente.
@param cProcesses, String, JSON com a lista dos processos e parâmetros.
@param cFinishEvents, String, JSON com a lista de eventos de finalização.
@param nHeight, Numeric, Altura da janela de execução (para execução MDI)
@param nWidth, Numeric, Largura da janela de execução (para execução MDI)
/*/
//------------------------------------------------------------------------------
MAIN FUNCTION LogixExecute(cMDI,nType,cSession,cSessionParent,cTitle,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,cThreadInfo,nDebugMode,cDebugPath,cEnvironments,cProcesses,cFinishEvents,nHeight,nWidth)
Local i,j
Local cParams
Local lMDI := (cMDI == "S")
Local aEnvironments
Local aProcesses
Local aFinishEvents
Local oWorkSpace
Local cRun

// Define os padrões de data e acentuação.
SetDateToBritish()

// Define o código da sessão atual e da sessão pai.
THREAD_session(cSession)
THREAD_sessionParent(cSessionParent)
THREAD_sessionType("ADVPL")

nType      := XToN(nType)
nSlotId    := XToN(nSlotId)
nDebugMode := XToN(nDebugMode)
nHeight    := XToN(nHeight)
nWidth     := XToN(nWidth)

// Deserializa as variáveis JSON.
FWJSONDeserialize(cEnvironments,@aEnvironments)
FWJSONDeserialize(cProcesses,@aProcesses)
FWJSONDeserialize(cFinishEvents,@aFinishEvents)

If  lMDI
    _4GL_LOG_setEnv("THREADWSHEIGHT",nHeight)
    _4GL_LOG_setEnv("THREADWSWIDTH",nWidth)

    If THREAD_BuildHasAdjustFreeWorkspace()
        SetFirstForm((nHeight > 0 .AND. nWidth > 0) .OR. ("MENU" == UPPER(LEFT(cProcessParent,4))))
    endIf

    // Define as variáveis de ambiente.
    For i := 1 To Len(aEnvironments)
        _4GL_LOG_setEnv(aEnvironments[i][1],aEnvironments[i][2])
    Next
EndIf

//empresa e usuário a serem utilizados na execução da Thread
_4GL_LOG_appSetEnv(cUserId,cCompanyId)

//Ativar modo de debug indicado
_4GL_LOG_setDebugMode(nDebugMode)

// Primeiramente ativa os arquivos de LOG, para que as mensagens sejam emitidas
// no arquivo correto.
If  nDebugMode != DEBUG_OFF
    If  LOG_createDebugLogFile(nDebugMode,cDebugPath,cProcess,cUserId,cCompanyId) == Nil
        THREAD_debugMessage("[EXECUTE][ERROR] DEBUG LOG File cannot create to session " + cSession + ".")
    EndIf
EndIf

THREAD_debugMessage("")
THREAD_debugMessage("[EXECUTE] Session " + cSession + " (" + cProcess + ") started from SessionParent " + cSessionParent + " (" + cProcessParent + ").")

If  lMDI
    IF !THREAD_BuildHasAdjustFreeWorkspace()
        // Cria a WORKSPACE para execução da aplicação.
        oWorkSpace := TWorkSpace():New(cTitle)
        oWorkSpace:SetBarVisible(.F.)

        // IMPORTANTE: Não retirar o "bClose", pois só com este evento a função
        // PTKillSession irá conseguir finalizar a THREAD atual. A função
        // PTKilSession nada mais é que um atalho para este evento.
        oWorkSpace:bClose:= {|| __QUIT() }
        THREAD_workSpace(oWorkspace)
    endIf

    // Define a função que será executada ao finalizar a THREAD e força o
    // encerramento da THREAD.
    SetFinishAppHandler("THREAD_finish")
EndIf

If  "MENU" == UPPER(LEFT(cProcessParent,4))
    // Consome a licença conforme módulo da aplicação.
    If  LICENSE_validSystemKey(cKeySystem)
        LICENSE_setMenuKeySystem(cKeySystem)
        LICENSE_setKeySystemInMainThread(cTitle,cKeySystem)
    EndIf
Else
    // Define as informações de LS.
    LICENSE_setActualSlotId(cUserId,nSlotId)
    LICENSE_loadStringInfoMainThread(cThreadInfo)

    // Adiciona um evento de finalização pra encerrar a janela secundária.
    cRun := "THREAD_endSessionDialog('" + cSessionParent + "')"
    THREAD_addFinishEvent(&('{|| PTRunInSession("' + cSessionParent + '","' + cRun + '") }'))
EndIf

// Define os eventos de finalização.
For i := 1 To Len(aFinishEvents)
    THREAD_addFinishEvent(aFinishEvents[i])
Next

For i := 1 To Len(aProcesses)
    // Envia a informação de execução para o TOTVS MONITOR.
    THREAD_showMonitorInfo("APP",aProcesses[i][PROCESS_CODE],cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,nDebugMode)

    // Define o código do programa pai.
    APPLICATION_setMainAppName(If("MENU" == UPPER(LEFT(cProcessParent,4)),aProcesses[i][PROCESS_CODE],cProcessParent))

    // Define os argumentos do processo atual.
    cParams := ""

    For j := 1 To Len(aProcesses[i][PROCESS_ARGS])
        If  Empty(cParams)
            cParams := aProcesses[i][PROCESS_ARGS][j][1] + "=" + aProcesses[i][PROCESS_ARGS][j][2]
        Else
            cParams += "&" + aProcesses[i][PROCESS_ARGS][j][1] + "=" + aProcesses[i][PROCESS_ARGS][j][2]
        EndIf
    Next

    // Emite a quantidade de MB da THREAD antes de iniciar o programa.
    If  THREAD_debugUsedMemory()
        THREAD_debugMessage("[EXECUTE] THREAD MEMORY before running " + Upper(aProcesses[i][PROCESS_CODE]) + " PROCESS: " + XToC(Abs(_GetThreadUsedMem() / 1000000)) + "MB",.T.)
    EndIf

    // Executa o programa conforme seu tipo.
    aProcesses[i][PROCESS_CODE] += If(At("(",aProcesses[i][PROCESS_CODE]) == 0,"()","")

    THREAD_debugMessage("")
    THREAD_debugMessage("[EXECUTE] Starting Application " + aProcesses[i][PROCESS_CODE] + if(len(aProcesses) > 1," (Sequence "+xToC(i)+")",""))
    If  nType == TYPE_INTEROP
        APPLICATION_setArgs(cParams)
        Eval(&("{|| _4GL_" + aProcesses[i][PROCESS_CODE] + " }"))
    Else
        APPLICATION_setArgs(cParams)
        Eval(&("{|| " + aProcesses[i][PROCESS_CODE] + " }"))
    EndIf

    // Emite a quantidade de MB da THREAD depois de finalizado o programa.
    If  THREAD_debugUsedMemory()
        THREAD_debugMessage("[EXECUTE] THREAD MEMORY after running " + Upper(aProcesses[i][PROCESS_CODE]) + " PROCESS: " + XToC(Abs(_GetThreadUsedMem() / 1000000)) + "MB",.T.)
    EndIf
Next

THREAD_debugMessage("[EXECUTE] Session " + cSession + " finished.")
THREAD_debugMessage("")

If  lMDI
    // Força o encerramento da THREAD.
    __QUIT()
Else
    THREAD_finish()

    // Tratamentos para execuções SDI.
    LOG_connectDatabase("DEFAULT")
EndIf
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_addFinishEvent
Adiciona um novo evento de execução ao finalizar a THREAD atual.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param uEvent, Mixed, Evento de execução.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_addFinishEvent(uEvent)
Local bEvent

bEvent := CreateCodeBlock(uEvent)
AAdd(__aFinishEvents,bEvent)
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_finish
Executa os eventos de finalização da THREAD atual.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_finish()
Local i
Local nLen := Len(__aFinishEvents)

For i := 1 To nLen
    Eval(__aFinishEvents[i])
Next

LICENSE_sendMetrics()

// Efetua ROLLBACK de qualquer transação aberta.
If  LOG_isDBConnected()
    If  LOG_transaction_isActive()
        LOG_transaction_rollback()
    EndIf
    LOG_disconnectDatabase()
EndIf

THREAD_debugMessage("[FINISH] ThreadID Finished (" + xtoc(THREAD_getId()) + ")")
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_debugMessage
Emite uma mensagem de debug conforme chave de PROFILE "logix.threads.debug".

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cMessage, String, Mensagem de debug que será emitida no LOG.
@param [lForce], Logical, Força a emissão da mensagem no LOG.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_debugMessage(cMessage,lForce)
Local cDebug

DEFAULT cMessage := ""
DEFAULT lForce   := .F.

lForce := If(VALTYPE(lForce) == "N",lForce == TRUE,lForce)

If  Empty(__lDebugThread)
    cDebug := LOG_fgl_getresource("logix.threads.debug")

    If  Empty(cDebug)
        __lDebugThread := _4GL_LOG_isDebugMode() == TRUE
    Else
        __lDebugThread := cDebug == "1"
    EndIf
EndIf

If  __lDebugThread .Or. lForce
    if !empty(cMessage) .AND. cMessage != " "
        LOG_consoleMessage("[THREAD] " + cMessage)
    else
        conout("")
    endIf
EndIf
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_debugUsedMemory
Retorna se o debug de memória utilizada por THREAD está ativo.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@return Logical, Verdadeiro se o debug de memória utilizada está ativo.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_debugUsedMemory()
If  __lDebugMemory == Nil
    __lDebugMemory := GetPvProfileInt("GENERAL","DEBUGTHREADUSEDMEMORY",0,GetAdv97()) == 1
EndIf
Return __lDebugMemory

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_getUsedMemory
Retorna a quantidade de memória utilizada no momento pela THREAD em MB.

@type function
@author Rubens Dos Santos Filho
@since 01/09/2017
@version 12.1.18

@return Numeric, Memório em MBs utilizada atualmente pela THREAD.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_getUsedMemory()
Local nMem := -1

If  THREAD_debugUsedMemory()
    nMem := Abs(_GetThreadUsedMem() / 1000000)
EndIf
Return nMem

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_loadMaxThreadCount
Retorna o máximo de execuções a partir da THREAD pai conforme chave de PROFILE
"logix.threads.max".

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@return Numeric, Máximo de THREADs que podem ser executadas em uma THREAD pai.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_loadMaxThreadCount()
// Consiste a quantidade máxima de THREADs que podem ser executadas.
If  __nMaxThreads == 0
    __nMaxThreads := LOG_fgl_getresource("logix.threads.max")
    __nMaxThreads := If(Empty(__nMaxThreads),MAX_THREADS_DEFAULT,VAL(__nMaxThreads))
EndIf
Return __nMaxThreads

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_getId
Retorna o ID da THREAD atual.

@type function
@author Rubens Dos Santos Filho
@since 09/01/2017
@version 12.1.16

@return Numeric, ID da THREAD atual.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_getId()
Local nThreadId := ThreadId()
Return nThreadId

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_newSession
Gera um novo código de sessão.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@return String, Código de sessão gerado.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_newSession()
Return AllTrim("ID" + StrTran(Time(),":",""))

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_sessionParent
Código da sessão pai.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cSessionParent, String, Código da sessão pai.
@return String, Código da sessão pai.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_sessionParent(cSessionParent)
If  PCount() == 0
    cSessionParent := _4GL_LOG_getEnv("AppServerTHREADSessionParent")
    If  Empty(cSessionParent)
        cSessionParent := "MAIN_THREAD"
        _4GL_LOG_setEnv("AppServerTHREADSessionParent",cSessionParent)
    EndIf
Else
    _4GL_LOG_setEnv("AppServerTHREADSessionParent",cSessionParent)
EndIf
Return xtoc(cSessionParent)

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_session
Código da sessão atual.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cSession, String, Código da sessão atual.
@return String, Código da sessão atual.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_session(cSession)
    cCurrentSession := _4GL_LOG_getEnv("AppServerTHREADSession")

    If  PCount() == 0
        If  Empty(cCurrentSession)
            cCurrentSession := "MAIN_THREAD"
            _4GL_THREAD_internalSetEnv("AppServerTHREADSession",cCurrentSession)
        endIf
        //conout("============================ THREADID "+ xtoc(ThreadId()) + " - THREAD_SESSION GET " + cCurrentSession + " ======================================================")
    Else
        If  Empty(cCurrentSession)
            //conout("============================ THREADID "+ xtoc(THREAD_getId()) + " - THREAD_SESSION SET " + cSession + " ======================================================")
            _4GL_THREAD_internalSetEnv("AppServerTHREADSession",cSession)
        endIF
    EndIf
    DEFAULT cSession := cCurrentSession
Return xtoc(cSession)

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_sessionType
Código da sessão atual.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cSession, String, Código da sessão atual.
@return String, Código da sessão atual.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_sessionType(cSessionType)
    cCurrentSessionType := _4GL_LOG_getEnv("AppServerTHREADSessionTypeType")

    If  PCount() == 0
        If  Empty(cCurrentSessionType)
            cCurrentSessionType := IF(_4GL_LOG_getAppProcessType(_4GL_log1200_nome_programa()) == TYPE_4GL,"4GL","ADVPL")
            _4GL_THREAD_internalSetEnv("AppServerTHREADSessionType",cCurrentSessionType)
        endIf
        THREAD_debugMessage("[THREAD_SESSIONTYPE][GET] TYPE = " + cCurrentSessionType)
    Else
        DEFAULT cSessionType := ""
        If  Empty(cCurrentSessionType)
            cSessionType := upper(xtoc(cSessionType))
            cSessionType := IF(cSessionType == '4GL' .OR. cSessionType == xtoc(TYPE_4GL),'4GL','ADVPL')
            THREAD_debugMessage("[THREAD_SESSIONTYPE][SET] TYPE = " + cSessionType)
            _4GL_THREAD_internalSetEnv("AppServerTHREADSessionType",cSessionType)
        endIF
    EndIf
    DEFAULT cSessionType := cCurrentSessionType
Return cSessionType

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_workSpaceFolder
Instância do objeto TWORKSPACEFOLDER atual.

@type method
@author Rubens Dos Santos Filho
@since 31/10/2016
@version 12.1.15

@param [oWorkFolder], Object, Objeto com a instância do TWORKSPACEFOLDER atual.
@return Object, Objeto com a instância do TWORKSPACEFOLDER atual.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_workSpaceFolder(oWorkFolder)
If  PCount() == 0
    oWorkFolder := __oWorkFolder
Else
    __oWorkFolder := oWorkFolder
EndIf
Return oWorkFolder

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_workSpace
Instância do último objeto TWORKSPACE criado.

@type method
@author Cleane
@since 06/05/2021
@version 12.1.33

@param [oWorkSpace], Object, Objeto com a instância do TWORKSPACE atual.
@return Object, Objeto com a instância do TWORKSPACE atual.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_workSpace(oWorkSpace)
    If  PCount() == 0
        oWorkSpace := __oWorkSpace
    Else
        __oWorkSpace := oWorkSpace
        if THREAD_IsFirstWorkSpace()
            _4GL_LOG_setEnv("THREADWSWIDTH",oWorkSpace:nClientWidth)
            _4GL_LOG_setEnv("THREADWSHEIGHT",oWorkSpace:nClientHeight)
        ENDIF
    EndIf
Return oWorkSpace

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_dialog
Instância da janela da THREAD secundária.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param oThreadDlg, Object, Instância da janela da THREAD secundária.
@return Object, Instância da janela da THREAD secundária.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_dialog(oThreadDlg)
If  PCount() == 0
    oThreadDlg := __oThreadDlg
Else
    __oThreadDlg := oThreadDlg
EndIf
Return oThreadDlg

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_endSessionDialog
Finaliza a execução da janela de controle da THREAD secundária.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15

@param cSessionParent, String, Sessão pai da THREAD secundária.
@obs Esta função executa somente na THREAD pai informada.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_endSessionDialog(cSessionParent)
Local oDlg

If  THREAD_session() == cSessionParent
    oDlg := THREAD_dialog()
    if valtype(oDlg) == "O"
        THREAD_debugMessage("[EndSessionDialog] Calling End Dialog of session "+cSessionParent)
        oDlg:End()
    endIf
Else
    PTRunInSession(cSessionParent,"THREAD_endSessionDialog('" + cSessionParent + "')")
EndIf
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_loadPublics
Carrega as variáveis públicas para execução de funcionalidades ADVPL.

@type function
@author Rubens Dos Santos Filho
@since 15/08/2017
@version 12.1.18

@obs Efetua a mesma lógica executada na função ErrorSys.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_loadPublics()
Local cValue

if __publicVarLoaded
   RETURN
endIf
If  Type("cPaisLoc") != "C" .Or. Empty(cPaisLoc)
    PUBLIC cPaisLoc := GetPvProfString(GetEnvServer(),"REGIONALLANGUAGE","BRA",&("GetSrvIniName()"))
EndIf
If  Type("oMenuLogix") != "O" .Or. Empty(oMenuLogix)
    PUBLIC oMenuLogix := NIL
EndIf
If  Type("__BuildHasAdjustFreeWorkspace") != "L" .Or. Empty(__BuildHasAdjustFreeWorkspace)
    PUBLIC __BuildHasAdjustFreeWorkspace := !(GetSrvVersion() < "13.1.3.53" .OR. (isGraphicMode() .AND. at("totvssmartclient.ini",lower(GetRemoteIniName())) > 0))
    if __BuildHasAdjustFreeWorkspace
       //Chave para controle de uso de solucao de abertura de novas threads no appserver para programas 4GL.
       //VALORES: 0-inativo   1-ativo   (Padrao = 0)
       cValue := _4GL_LOG_getProfileKeyValue("threads.4GL.runInNewThread")
       __BuildHasAdjustFreeWorkspace := if(empty(cValue),.F.,(cValue == "1"))
    endIf
endIf

__publicVarLoaded := .T.
Return

//------------------------------------------------------------------------------
/*/{Protheus.doc} THREAD_showMonitorInfo
Exibe informações de execução no TOTVS Monitor.

@type function
@author Rubens Dos Santos Filho
@since 15/08/2017
@version 12.1.18

@param cThread, String, Tipo da THREAD (JOB ou APP).
@param cProcess, String, Processo principal de execução.
@param cProcessParent, String, Processo de execução pai (MENU ou processo).
@param cUserId, String, Código do usuário.
@param cCompanyId, String, Código da empresa.
@param cKeySystem, String, Código da chave de sistema para consumo de licença.
@param nSlotId, Numeric, Código do SLOT consumido (para processos filhos).
@param nDebugMode, Numeric, Modo de debug.
/*/
//------------------------------------------------------------------------------
FUNCTION THREAD_showMonitorInfo(cThread,cProcess,cProcessParent,cUserId,cCompanyId,cKeySystem,nSlotId,nDebugMode)
Local cMonitor := ""

DEFAULT cUserId    := LOGIN_getUser()
DEFAULT cCompanyId := LOGIN_getCompany()
DEFAULT nSlotId    := license_getActualSlotID(cUserId)
DEFAULT nDebugMode := XToN(_4GL_LOG_getDebugMode())

// Monta o texto de exibição no TOTVS Monitor.
IF !empty(cThread)
    cMonitor := "[" + cThread + "] "
endIf
IF !empty(cProcess)
    cMonitor += "PROCESS: " + Upper(xToC(cProcess)) + " | "
endIf
if !empty(cProcessParent)
    cMonitor += "PARENT PROCESS: " + Upper(xToC(cProcessParent)) + " | "
endIf
cMonitor += "USER: " + xToC(cUserId)
cMonitor += " | "
cMonitor += "COMPANY: " + xToC(cCompanyId)
cMonitor += " | "

If  !Empty(cKeySystem) .And. !(cKeySystem == "?")
    cMonitor += "KEY SYSTEM: " + Trim(cKeySystem)
Else
    cMonitor += "SLOTID: " + XToC(nSlotId)
EndIf

cMonitor += " | "
cMonitor += "DEBUG MODE: " + If(nDebugMode == DEBUG_OFF,"OFF",If(nDebugMode == DEBUG_SQL,"ON",If(nDebugMode == DEBUG_PROFILER,"PROFILER",If(nDebugMode == DEBUG_FRAMEWORK,"FRAMEWORK",xtoC(nDebugMode)))))
SendMonitorMessage(cMonitor)
Return

//*** FUNCAO DE USO INTERNO (FRAMEWORK)***
//Funcao utilizada pela funçao LOG_setEnv() para poder repassar para novas threads criadas via componente LTHREAD,
//todos os valores setados em memoria, pois a funcao LOG_setEnv() aciona funcao 4GL nativa fgl_setEnv() que
//simula uma environment do SO em memoria.
//---------------------------------------
FUNCTION THREAD_setEnv(cKey,cValue)
//---------------------------------------
  LOCAL i := 0

  if cKey == nil .OR. empty(cKey)
     RETURN
  end if

  cKey   := upper(XtoC(cKey))
  cValue := XtoC(cValue)

  i := aScan(__aSetEnvValues,{|x| x[1] == cKey})
  if i > 0
     __aSetEnvValues[i][2] = cValue
  else
     AAdd(__aSetEnvValues,{cKey,cValue})
  endIf
RETURN

//------------------------------------------------------------------------------
// FUNÇÃO DE TESTES
//------------------------------------------------------------------------------
/*/{Protheus.doc} U_TestLThread
Simula a criação e utilização do componente LTHREAD garantindo o funcionamento
correto do mesmo.

@type function
@author Rubens Dos Santos Filho
@since 07/11/2016
@version 12.1.15
/*/
//------------------------------------------------------------------------------
USER FUNCTION __TestLThread()
Local oThread
Local lStatus

If  LOG_initApp("PADRAO") = 0
    LOG_setEnv("TestLThread","1")
    LOG_setEnv("TestLThreadOther","teste")

    oThread := LThread():NewLThread()
    oThread:SetProperty("FUNCTION","THREAD_testFunction")

    oThread:SetProperty("CLEAR_ENVIRONMENTS")
    oThread:SetProperty("ADD_ENVIRONMENT","LTHREAD_CMP",Upper(oThread:cName))

    oThread:SetProperty("CLEAR_PARAMETERS")
    oThread:SetProperty("ADD_PARAMETER","admlog")
    oThread:SetProperty("ADD_PARAMETER","01")

    lStatus := oThread:GetProperty("START") == TRUE

    If  lStatus
        CONOUT("[TestLThread]  ] Is Alive? " + If(oThread:GetProperty("IS_ALIVE") == TRUE,"Yes","No"))

        oThread:GetProperty("JOIN")
        MsgInfo("THREAD finalizada")
    Else
        MsgStop(oThread:GetProperty("ERROR_MESSAGE"),"Logix")
    EndIf
Else
    MsgStop("Falha na autenticacao para execucao da rotina (LOG_initApp)")
EndIf
Return

//-------------------------------------------//
FUNCTION THREAD_WorkSpaceHeight(nDefault)
//-------------------------------------------//
    Local nValue

    If  PCount() == 0
        DEFAULT nDefault := 600
    endIf

    nValue = _4GL_LOG_getEnv("THREADWSHEIGHT")
    If !empty(nValue)
        nValue := CTON(nValue,10)
        if valtype(oMenuLogix) == "O"
           nValue -= 87
        ENDIF
    ENDIF

    DEFAULT nValue := nDefault
RETURN nValue

//-------------------------------------------//
FUNCTION THREAD_WorkSpaceWidth(nDefault)
//-------------------------------------------//
    Local nValue

    If PCount() == 0
       DEFAULT nDefault := 800
    endIf

    nValue = _4GL_LOG_getEnv("THREADWSWIDTH")
    If !empty(nValue)
        nValue := CTON(nValue,10)
        if valtype(oMenuLogix) == "O"
           nValue -= 5
        ENDIF
    ENDIF

    DEFAULT nValue := nDefault
RETURN nValue

//-----------------------------------------------//
FUNCTION THREAD_IsFirstWorkSpace(lFirstWorksPace)
//-----------------------------------------------//
   if PCount() > 0
       __lFirstWorksPace := lFirstWorksPace
   endIf
RETURN __lFirstWorksPace

//-----------------------------------------------//
FUNCTION THREAD_BuildHasAdjustFreeWorkspace()
//-----------------------------------------------//
    THREAD_loadPublics()
RETURN __BuildHasAdjustFreeWorkspace

//------------------------------------------------------------------------------
FUNCTION LThread_version_info()
RETURN "$Archive: /Logix/Fontes_Doc/Sustentacao/V12/V12/framework/free_form/thread/LThread.prw $|$Revision: 39 $|$Date: 23/08/21 15:13 $|$Modtime: 23/08/21 15:13 $" // Informações do controle de versão do SourceSafe - Não remover esta linha (FRAMEWORK)
