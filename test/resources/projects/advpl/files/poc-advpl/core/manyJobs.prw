#include "protheus.ch"


static function setJobCount(anValue)
	putGlbVars("JobCount", str(anValue))
return

static function getJobCount()
	local cValue
	getGlbVars("JobCount", cValue)
return val(cValue)

static function incJobCount()
	setJobCount(getJobCount() + 1)
return

static function decJobCount()
	setJobCount(getJobCount() - 1)
return

user function manyJobs(acId, axQtde)
	local nInd
	local nSleep := 0
	local nOldJobs := -1

	if acId == nil
		acId := "JOB"
	endif
	if axQtde == nil
		axQtde := 15
	else
		axQtde := val(axQtde)
	endif

	u_startRemoteLog("ManyJobs: " + acId + ": " + cValToChar(axQtde))
	setJobCount(0)

	for nInd := 1 to axQtde
		incJobCount()

		startJob("u_job", "p12133", .f., acId + "-" + strzero(getJobCount(), 5,0))

		nSleep := random(50, 250) //causa atraso para próximo job
		sleep(nSleep)
	next

	while getJobCount() > 0
		sleep(1000)

		if nOldJobs != getJobCount()
			nOldJobs := getJobCount()

			u_remoteLog(">>> Remain: : ",;
				{{"acId", acId},;
				{"axQtde", nOldJobs};
				})

		endif

	end

	u_stopRemoteLog()

return

user function job(acId)
	local cId := acId
	local nSleep
	local nStop := random(5, 10)
	local macro := "ptInternal"
	local aFakeUsers := {;
		"Huguinho",;
		"Luizinho",;
		"MargaracIda",;
		"Mickey Mouse",;
		"Minie",;
		"Pateta",;
		"Pato Donald",;
		"Pluto",;
		"Tio Patinhas",;
		"Zezinho";
		}
	local cFakeUser := aFakeUsers[random(1,10)]

	u_remoteLog(">>> job: : ",;
		{{"acId", cId},;
		{"steps", nStop},;
		{"fakeUser", cFakeUser};
		})

	&(macro)(1, "Logado: " + cFakeUser)

	while (nStop > 0)
		u_remoteLog("=== job: : ",;
			{{"acId", cId},;
			{"time", time()},;
			{"step", nStop};
			})
		nSleep := random(30000, 90000) //causa atraso simulando algum processamento
		sleep(nSleep)
		nStop--
	enddo

	decJobCount()

	u_remoteLog("<<< job: : ",;
		{cId})

return
