#include "protheus.ch"

User Function scping()

//   oDlg := TDialog():New(180,180,550,700,'Exemplo TDialog',,,,,CLR_BLACK,CLR_WHITE,,,.T.)

//   @ 40, 70 BUTTON oBtnAdd PROMPT "show NetTest" OF oDlg PIXEL ACTION ScPing(.T.)

//   @ 70, 70 BUTTON oBtnClr PROMPT "get NetTest Logs" OF oDlg PIXEL ACTION getPingLogs()

//   @ 100, 70 BUTTON oBtn2Clr PROMPT "get next" OF oDlg PIXEL ACTION getNext60ping()

//   oDlg:ACTIVATE()
getPingLogs()

Return

Static Function getNext60Ping()

  Local aPingLogs := Array(0)
  processa( {|| Sleep(10000) }, "Titulo", "Processando aguarde...", .f.)
  ScPing(.F., aPingLogs, 10 )
  varinfo("", aPingLogs)

Return

Static Function getPingLogs()

  Local aCpuLogs := Array(0)
  Local aPingLogs := Array(0)

  ScPing(.F., aPingLogs, 10, aCpuLogs, 5)

  ScPing(.F., aPingLogs, , aCpuLogs, )

  ScPing(.F., aPingLogs, 0, aCpuLogs, 1)

  ScPing(.F., aPingLogs, , , )

  varinfo("PING - ", aPingLogs)

  varinfo("CPURAM - ", aCpuLogs)

RETURN

