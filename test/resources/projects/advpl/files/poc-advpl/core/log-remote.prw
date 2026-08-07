#include "protheus.ch"
#include "fileio.ch"

#define CRLF chr(13)+chr(10)

static oLogFiles := tHashMap():New()
static aChronoMap := {}
static cLastCallProc := ""

#define WEBAPP_FOLDER "\tmpwebapp-test"

user function startRemoteLog(acTitle, aaComplement, acProcName)
	local cLogfile
	local nHandleFile
	local lExist
	local cStartProc

	if acProcName == nil
		cStartProc := procname(1)
	else
		cStartProc := acProcName
	endif

	cLogfile := cStartProc + ".log"
	cLogFile := strTran(cLogfile, "_", "-")
	lExist := oLogFiles:get(cStartProc, @nHandleFile)

	if !lExist
		nHandleFile := FCreate(WEBAPP_FOLDER+ "\" + cLogfile)
		FClose(nHandleFile)
		nHandleFile := FOpen(WEBAPP_FOLDER+ "\" + cLogfile, FO_WRITE + FO_SHARED)
		nLastHandle := nHandleFile

		lExist := oLogFiles:set(cStartProc, nHandleFile)
		if !lExist
			conerr(">>>> Falha ao registrar log. Arquivo: " + cLogFile)
		endif
	endif

	conout(">>>> [" + cStartProc + "] LOG File:" + WEBAPP_FOLDER+ "\" + cLogfile)

	u_remoteLog("Remote Version: " + GetRmtVersion(), [], cStartProc)
	u_remoteLog("Start log: " + acTitle, aaComplement, cStartProc)

return

user function stopRemoteLog(acMessage, aaComplement, acProcName)
	local nHandleFile
	local cStartProc := findLog(iif(acProcName == nil, procName(1), acProcName))

	if cStartProc != "U_AFTERLOGIN"
		if acMessage != nil
			u_remoteLog("Stop log: " + acMessage, aaComplement, acProcName)
		else
			u_remoteLog("Stop log", [], acProcName)
		endif

		lExist := oLogFiles:get(cStartProc, @nHandleFile)
		if lExist
			FClose(nHandleFile)
			lExist := oLogFiles:del(cStartProc)
		endif

		conout(">>>> [" + cStartProc + "] STOP REMOTE LOG")
	else
		u_remoteLog("KEEP LOG OPENED FOR NEXT CALLS", [], cStartProc)
	endif

return

user function remoteLog(acMessage, aaComplement, acProcName)
	local cStartProc := findLog(iif(acProcName == nil, procName(1), acProcName))
	local cProcName := procName(1)
	local source :=  cStartProc + ":" + cProcName + ":" + strZero(procLine(1),3)
	local cMessage := ">>>> [" + source + "] " + acMessage
	local lExist
	local nHandleFile

	if valtype(aaComplement) == "A"
		cMessage += ": " + join(aaComplement)
	endif

	conout(cMessage)

	lExist := oLogFiles:get(cStartProc, @nHandleFile)
	if lExist
		FWrite(nHandleFile, cMessage + CRLF)
	endif

return

user function startChrono(acLabel)
	local nStart := seconds()
	local cStartProc := procname(1)

	if acLabel == nil
		acLabel := ""
	endif

	u_remoteLog("startChrono:" + cStartProc + ":" + acLabel + ": " + time() + " (" + str(nStart) + "s)")

	aAdd(aChronoMap, { acLabel, nStart })
return

user function stopChrono(acLabel)
	local nEnd := seconds()
	local cStopProc := procname(1)
	local nStart := 0
	local cMessage := ""
	local cStartLabel := ""
	local oJson := nil

	if acLabel == nil
		acLabel := ""
	endif

	if len(aChronoMap) > 0
		cStartLabel := aChronoMap[len(aChronoMap)][1]
		nStart := aChronoMap[len(aChronoMap)][2]
		aDel(aChronoMap, 1)
		aSize(aChronoMap, len(aChronoMap)-1)
	else
		nStart := 0
	endif

	cMessage := cStopProc + ":" + acLabel + ": " + time() + " (" + str(nEnd) + "s)"

	if nStart > 0
		cMessage += ", duration: " + str(nEnd - nStart) + "s"
	endif
	if cStartLabel != ""
		cMessage += ", start label: " + cStartLabel
	endif

	u_remoteLog("stopChrono:" + cMessage)

	oJson := JsonObject():New()
	oJson["procname"] := cStopProc
	oJson["label"] := acLabel
	oJson["start"] := nStart
	oJson["end"] := nEnd
	oJson["duration"] := nEnd - nStart

	u_remoteLog(oJson:toJson())

return cMessage

static function findLog(acProcName)
	local aList := []
	local nHandleFile
	local lExist := oLogFiles:get(acProcName, @nHandleFile)
	local cProcName := acProcName
	local nProc := 0

	if cLastCallProc != acProcName .or. !lExist
		oLogFiles:list(aList)

		nHandleFile := 0
		while !lExist .and. cProcName != ""
			cProcName := procName(nProc)
			lExist := oLogFiles:get(cProcName, @nHandleFile)
			nProc++
		enddo

		if !lExist
			cProcName := "<not found log>"
			lExist := oLogFiles:get(cLastCallProc, @nHandleFile)
			if lExist
				cProcName := cLastCallProc
			endif
		else
			cLastCallProc := acProcName
		endif
	endif

return cProcName

static function join(axExp)
	local cResult := cValToChar(axExp)
	local nInd

	if valType(axExp)=="A"
		for nInd := 1 to len(axExp)
			if valtype(axExp[nInd]) == "A"
				cResult += ", " + join(axExp[nInd])
			else
				cResult += ", (" + cValToChar(nInd)+")="+cValToChar(axExp[nInd])
			endif
		next
	endif

	if left(cResult,1) == ","
		cResult := "["+alltrim(substring(cResult,2, len(cResult)))+"]"
	endif
return cResult
