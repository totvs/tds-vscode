#INCLUDE "TOTVS.CH"

//Executado via ponto de entrada u_after_login
user function tst6111()
	u_remoteLog("Setting key bindings for CTRL+4, CTRL+5 and CTRL+M.", [], "u_afterlogin")

	setKey( K_CTRL_4, { || logKey("K_CTRL_4")})
	setKey( K_CTRL_5, { || logKey("K_CTRL_5")})
	setKey( K_CTRL_M, { || logKey("K_CTRL_M")})

Return

static function logKey(acWho)
	local cVarName := readVar()

	u_remoteLog(acWho+": pressed" + cValToChar(cVarName), [], "u_afterlogin")
return
