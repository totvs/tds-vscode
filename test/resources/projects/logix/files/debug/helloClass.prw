#include "protheus.ch"

CLASS THello
	Data cMsg as String
	Method New(cMsg) CONSTRUCTOR
	Method SayHello()
ENDCLASS

METHOD NEW(cMsg) CLASS THello
	self:cMsg := cMsg
Return self

METHOD SAYHELLO() CLASS THello
	MsgInfo(self:cMsg)
Return .T.
