#include "protheus.ch"

static jobCount := 0
user function manyJobs()
	local nInd

	jobCount := jobCount + 1

	for nInd := 1 to 100
		startJob("u_job", "p12133", .f.)
	next

	while jobCount > 0
		sleep(1000)
	end
return

user function job()
	conout(">>>>>>>>>>> JOB ", jobCount)

	sleep(60000*3)

	jobCount := jobCount - 1
	conout("<<<<<<<<<< JOB ", jobCount)

return
