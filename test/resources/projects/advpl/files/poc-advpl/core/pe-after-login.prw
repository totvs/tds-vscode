#include "protheus.ch"
#include "fileio.ch"

#define WEBAPP_FOLDER "\tmpwebapp-test"

/*/{Protheus.doc} afterLogin
Ponto de entrada executado logo após o login do usuário.
Destina-se a realizar inicializações da sessão, como carregar
preferências do usuário, permissões, configurar variáveis de ambiente
e preparar a interface ou redirecionamentos necessários.

As configurações necessárias serão recebidas através de um
aquivo JSON, gerado por tests\utils.ts:writeAfterLoginConfig
e as chaves devem ser aqui tratadas.

@type user function
@autor acandido@totvs.com.br
@since 2025-10-21
@version 10.1.6
@obs Whenever possible:
- Avoid long-term operations.
- Handle failures so as not to compromise the user session.
/*/
user Function afterLogin() //Ponto de entrada.
	local cConfigFile := WEBAPP_FOLDER+ "\after-login"
	local jConfig
	local cJson
	local cRetParser
	local cValue
	local cAux
	local cNewFile := strTran(cConfigFile + "-" + dtos(date()) + time(), ":", "-") + ".json"

	cConfigFile += ".json"
	if file(cConfigFile)
		fRename(cConfigFile, cNewFile)
		u_startRemoteLog("AFTER LOGIN: Running entry point.")
		u_remoteLog("AFTER LOGIN: Config file: " + cNewFile)

		cJson := memoRead(cNewFile)

		if !empty(cJson)
			jConfig := JsonObject():new()
			cRetParser := jConfig:FromJson(cJson)

			if valType(cRetParser) != "U"
				u_remoteLog("AFTER LOGIN: Config file JSON error: " + cRetParser)
				u_remoteLog(cJson)
			else
				//DTCLIENT01-6111
				if jConfig:HasProperty("tst6111")
					cValue := jConfig:getJsonText("tst6111")
					u_remoteLog("tst6111: " + cValue)

					if cValue == "true"
						u_remoteLog("tst6111: call")
						u_tst6111()
						u_remoteLog("tst6111: resume")
					endif
				endif

				//General use
				if jConfig:HasProperty("inactiveTimeOut")
					cValue := jConfig:getJsonText("inactiveTimeOut")
					u_remoteLog("inactiveTimeOut:"  + cValue)
					cAux := 'ptInternal(2, "' + cValue + '")'
					&(cAux)
				endif

				freeObj(jConfig)
			endif
		endif

		u_stopRemoteLog("AFTER LOGIN: End entry point.")
	endif

return .t.
